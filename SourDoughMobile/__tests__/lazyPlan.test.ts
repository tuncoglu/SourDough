import { estimateLazyLoaf, planLazyBake, clampFridgeHours, type LazyLoafInput } from '../src/lib/lazyPlan';
import { lazyProofHours } from '../src/lib/lazyMethod';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';
import { findFlour } from '../src/lib/flourSearch';

const DEFAULT_LOAF: LazyLoafInput = {
  flourGrams: 500,
  waterPct: 75,
  starterPct: 20,
  saltPct: 2,
  starterHydration: 100,
  roomTempC: 22,
};

const H = 3_600_000;
const M = 60_000;

describe('estimateLazyLoaf', () => {
  it('matches what the bread page computed before the refactor (default formula, 22 °C)', () => {
    // Snapshot taken from the inline runAllCalculations call in bread.tsx
    // (commit 3beabe8) with the same inputs and no forecast.
    const est = estimateLazyLoaf(DEFAULT_LOAF, null, FALLBACK_HARDNESS)!;
    expect(est).not.toBeNull();
    expect(est.bulkHours).toBe(7);
    expect(est.proofHours).toBe(lazyProofHours(7));
    expect(est.waterGrams).toBe(375);
    expect(est.starterGrams).toBe(100);
    expect(est.saltGrams).toBe(11);
    expect(est.doughGrams).toBe(986);
    expect(est.results.fdt).toBe(20);
    expect(est.results.ingredients.totalFlour).toBe(550);
  });

  it('defaults to the app flour, room-temperature flour and water, and a fridge-cold starter', () => {
    const implicit = estimateLazyLoaf(DEFAULT_LOAF, null, FALLBACK_HARDNESS)!;
    const explicit = estimateLazyLoaf(
      { ...DEFAULT_LOAF, flourTempC: 22, waterTempC: 22, starterTempC: 4, flour: findFlour('No. 4 Organic White (105)') },
      null,
      FALLBACK_HARDNESS,
    )!;
    expect(explicit.bulkHours).toBe(implicit.bulkHours);
    expect(explicit.results.fdt).toBe(implicit.results.fdt);
  });

  it('rises faster in a warm kitchen and slower in a cold one', () => {
    const cold = estimateLazyLoaf({ ...DEFAULT_LOAF, roomTempC: 16 }, null, FALLBACK_HARDNESS)!;
    const warm = estimateLazyLoaf({ ...DEFAULT_LOAF, roomTempC: 28 }, null, FALLBACK_HARDNESS)!;
    expect(cold.bulkHours).toBeGreaterThan(7);
    expect(warm.bulkHours).toBeLessThan(7);
  });

  it('returns null for invalid input', () => {
    for (const bad of [
      { flourGrams: 0 },
      { waterPct: 0 },
      { starterPct: -1 },
      { saltPct: -0.5 },
      { saltPct: NaN },
      { starterHydration: 0 },
      { roomTempC: NaN },
      { waterTempC: Infinity },
    ]) {
      expect(estimateLazyLoaf({ ...DEFAULT_LOAF, ...bad }, null, FALLBACK_HARDNESS)).toBeNull();
    }
  });

  it('allows a loaf without salt', () => {
    expect(estimateLazyLoaf({ ...DEFAULT_LOAF, saltPct: 0 }, null, FALLBACK_HARDNESS)?.saltGrams).toBe(0);
  });
});

describe('planLazyBake', () => {
  const readyAt = new Date('2026-10-17T12:00:00+01:00'); // Saturday lunch, BST

  it('works backwards from ready time with a counter proof (cocotte)', () => {
    const plan = planLazyBake({ readyAt, bulkHours: 7, proofMode: 'counter', vessel: 'cocotte' });
    const at = Object.fromEntries(plan.steps.map((s) => [s.key, s.at.getTime()]));
    expect(plan.steps.map((s) => s.key)).toEqual(['mix', 'rise', 'shape', 'proof', 'bake', 'cool']);
    expect(at.cool).toBe(readyAt.getTime() - 60 * M);
    expect(at.bake).toBe(at.cool - 45 * M);
    expect(at.proof).toBe(at.bake - lazyProofHours(7) * H);
    expect(at.shape).toBe(at.proof - 2 * M);
    expect(at.rise).toBe(at.shape - 7 * H);
    expect(at.mix).toBe(at.rise - 5 * M);
    expect(plan.mixAt.getTime()).toBe(at.mix);
    // 5 min + 7 h + 2 min + 4 h (proof) + 45 min + 60 min
    expect(plan.totalHours).toBeCloseTo(7 + 4 + (5 + 2 + 45 + 60) / 60, 6);
    expect(plan.mixAt.toISOString()).toBe('2026-10-16T22:08:00.000Z');
  });

  it('bakes straight from the fridge after the fridge proof (tin)', () => {
    const plan = planLazyBake({ readyAt, bulkHours: 6, proofMode: 'fridge', vessel: 'tin' });
    const at = Object.fromEntries(plan.steps.map((s) => [s.key, s.at.getTime()]));
    expect(at.bake - at.proof).toBe(12 * H);
    expect(at.cool - at.bake).toBe(45 * M); // LAZY_BAKE.tin.totalMinutes
    expect(at.shape - at.rise).toBe(6 * H);
    expect(plan.totalHours).toBeCloseTo(6 + 12 + (5 + 2 + 45 + 60) / 60, 6);
  });

  it('uses the fixed bake time for each vessel', () => {
    for (const vessel of ['cocotte', 'tin'] as const) {
      const plan = planLazyBake({ readyAt, bulkHours: 5, proofMode: 'counter', vessel });
      const bake = plan.steps.find((s) => s.key === 'bake')!.at.getTime();
      const cool = plan.steps.find((s) => s.key === 'cool')!.at.getTime();
      expect(cool - bake).toBe(45 * M);
    }
  });

  it('clamps the fridge proof to 8–16 hours and defaults it to 12', () => {
    expect(clampFridgeHours(undefined)).toBe(12);
    expect(clampFridgeHours(2)).toBe(8);
    expect(clampFridgeHours(30)).toBe(16);
    expect(clampFridgeHours(10)).toBe(10);
    expect(clampFridgeHours(NaN)).toBe(12);
    const plan = planLazyBake({ readyAt, bulkHours: 6, proofMode: 'fridge', fridgeHours: 40, vessel: 'cocotte' });
    const at = Object.fromEntries(plan.steps.map((s) => [s.key, s.at.getTime()]));
    expect(at.bake - at.proof).toBe(16 * H);
  });

  it('ignores fridgeHours for a counter proof', () => {
    const a = planLazyBake({ readyAt, bulkHours: 6, proofMode: 'counter', vessel: 'cocotte' });
    const b = planLazyBake({ readyAt, bulkHours: 6, proofMode: 'counter', fridgeHours: 16, vessel: 'cocotte' });
    expect(b.mixAt.getTime()).toBe(a.mixAt.getTime());
  });

  it('keeps real durations across the end of British Summer Time', () => {
    // Clocks go back at 02:00 BST (01:00 UTC) on Sunday 25 October 2026.
    const sundayLunch = new Date('2026-10-25T12:00:00+00:00'); // GMT
    const plan = planLazyBake({ readyAt: sundayLunch, bulkHours: 10, proofMode: 'counter', vessel: 'cocotte' });
    // 1 h cool + 45 min bake + 6 h proof + 2 min + 10 h rise + 5 min = 17 h 52 min of real time.
    expect(lazyProofHours(10)).toBe(6);
    expect(sundayLunch.getTime() - plan.mixAt.getTime()).toBe(17 * H + 52 * M);
    // Mixed on Saturday evening, still in BST: 19:08 local is 18:08 UTC.
    expect(plan.mixAt.getTime()).toBe(new Date('2026-10-24T19:08:00+01:00').getTime());
    // The rise spans the change, so its wall-clock length reads 11 h but is 10 h.
    const rise = plan.steps.find((s) => s.key === 'rise')!.at;
    const shape = plan.steps.find((s) => s.key === 'shape')!.at;
    expect(shape.getTime() - rise.getTime()).toBe(10 * H);
    expect(rise.getTime()).toBe(new Date('2026-10-24T19:13:00+01:00').getTime());
    expect(shape.getTime()).toBe(new Date('2026-10-25T04:13:00+00:00').getTime());
  });
});
