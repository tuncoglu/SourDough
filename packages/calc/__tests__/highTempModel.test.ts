/**
 * Hostile review finding 1: above the yeast optimum the old "penalty" multiplied the rate by more
 * than 1, so 45 °C and 100 °C both came out as a 2 h bulk, and the advice said the estimate
 * "assumes slowing". The rate now falls to zero and a dough that hot is reported as stalled.
 *
 * The shape above 38 °C (linear fall to zero at STALL_TEMP_BREAD) is a reasoned estimate, not a
 * calibrated curve; these tests pin its direction and limits, not its exact numbers.
 */
import {
  estimateFermentation,
  fermentAdvice,
  tempRateMultiplier,
  MAX_EFFECTIVE_TEMP_BREAD,
  STALL_TEMP_BREAD,
} from '../src/lib/calculations';
import { runLazyLoaf, estimateLazyLoaf } from '../src/lib/lazyPlan';
import { DEFAULT_BREAD_FORM, planBread, tooHotNote, type BreadEnv } from '../src/lib/breadPlan';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';
import { starterStateFrom } from '../src/lib/starterLog';

const hours = (fdt: number) => estimateFermentation(fdt, 20, 70, 'Generic: Bread Flour').hours;

describe('the rate curve', () => {
  it('is unchanged up to the optimum (26 °C = 1, Q10 2.5)', () => {
    expect(tempRateMultiplier(26)).toBeCloseTo(1, 6);
    expect(tempRateMultiplier(32)).toBeCloseTo(1.733, 3);
    expect(tempRateMultiplier(MAX_EFFECTIVE_TEMP_BREAD)).toBeCloseTo(3.003, 3);
  });

  it('is non-increasing from the optimum upward, 38 -> 60 °C in 0.5 °C steps', () => {
    for (let t = MAX_EFFECTIVE_TEMP_BREAD; t < 60; t += 0.5) {
      expect(tempRateMultiplier(t + 0.5)).toBeLessThanOrEqual(tempRateMultiplier(t));
    }
  });

  it('is strictly slower at 40 and 41 °C than at 38 °C', () => {
    expect(tempRateMultiplier(40)).toBeLessThan(tempRateMultiplier(38));
    expect(tempRateMultiplier(41)).toBeLessThan(tempRateMultiplier(40));
  });

  it('is zero at and above the stall temperature, and positive below it', () => {
    expect(tempRateMultiplier(STALL_TEMP_BREAD)).toBe(0);
    for (const t of [45, 50, 80, 100]) expect(tempRateMultiplier(t)).toBe(0);
    expect(tempRateMultiplier(STALL_TEMP_BREAD - 0.1)).toBeGreaterThan(0);
  });

  it('is never negative and stays finite', () => {
    for (const t of [-20, 0, 4, 26, 38, 41.9, 42, 100, 1000]) {
      const m = tempRateMultiplier(t);
      expect(Number.isFinite(m)).toBe(true);
      expect(m).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('the hours', () => {
  it('45 °C and 100 °C are no longer "2 h": they are stalled, with no time', () => {
    for (const t of [45, 100]) {
      const r = estimateFermentation(t, 20, 70, 'Generic: Bread Flour');
      expect(r.stalled).toBe(true);
      expect(r.hours).toBe(Infinity);
      expect(r.note).toMatch(/too hot/i);
    }
  });

  it('hot dough takes longer, not less: 38 <= 40 < 41 hours, then stalled', () => {
    expect(hours(40)).toBeGreaterThan(hours(38));
    expect(hours(41)).toBeGreaterThan(hours(40));
    expect(estimateFermentation(STALL_TEMP_BREAD, 20, 70).stalled).toBe(true);
  });

  it('is not stalled, and not changed, in the working range', () => {
    expect(estimateFermentation(26, 20, 70).stalled).toBeFalsy();
    expect(hours(26)).toBe(4);
    expect(hours(32)).toBe(2.5);
    expect(hours(38)).toBe(2);
  });

  it('the cold end is still monotonic: 4 > 10 > 15 > 20 > 26 °C (values are uncalibrated)', () => {
    const h = [4, 10, 15, 20, 26].map(hours);
    for (let i = 1; i < h.length; i++) expect(h[i]).toBeLessThan(h[i - 1]);
  });
});

describe('advice', () => {
  it('no longer says the estimate assumes slowing; says what happens to a hot dough', () => {
    const text = fermentAdvice(45, 20, 70).join('\n');
    expect(text).not.toMatch(/the estimate assumes slowing/i);
    expect(text).toMatch(/stall|too hot/i);
  });
});

describe('the loaf and the plan', () => {
  const loaf = (roomTempC: number) => ({
    flourGrams: 500, waterPct: 75, starterPct: 20, saltPct: 2, starterHydration: 100, roomTempC,
  });

  it('a stalled loaf has no estimate but says how hot the dough is', () => {
    const r = runLazyLoaf(loaf(60), FALLBACK_HARDNESS);
    expect(r.estimate).toBeNull();
    expect(r.stalledAtC).toBeGreaterThan(STALL_TEMP_BREAD);
    expect(estimateLazyLoaf(loaf(60), FALLBACK_HARDNESS)).toBeNull();
  });

  it('an ordinary loaf has an estimate and no stall', () => {
    const r = runLazyLoaf(loaf(22), FALLBACK_HARDNESS);
    expect(r.estimate).not.toBeNull();
    expect(r.stalledAtC).toBeNull();
  });

  it('invalid input is still just null, not a stall', () => {
    const r = runLazyLoaf({ ...loaf(22), flourGrams: 0 }, FALLBACK_HARDNESS);
    expect(r.estimate).toBeNull();
    expect(r.stalledAtC).toBeNull();
  });

  const NOW = new Date(2026, 9, 28, 17, 30);
  const env = (roomTempC: number): BreadEnv => ({
    now: NOW, roomTempC, hardness: FALLBACK_HARDNESS, unitSystem: 'metric',
    starter: starterStateFrom([], 20, NOW), mixedAt: null,
  });

  it('planBread carries the stall so the screens can explain it', () => {
    const hot = planBread(DEFAULT_BREAD_FORM, env(60));
    expect(hot.chosen!.estimate).toBeNull();
    expect(hot.chosen!.stalledAtC).toBeGreaterThan(STALL_TEMP_BREAD);
    expect(hot.schedule).toBeNull();
    const ok = planBread(DEFAULT_BREAD_FORM, env(22));
    expect(ok.chosen!.stalledAtC).toBeNull();
    expect(ok.chosen!.estimate).not.toBeNull();
  });

  it('the note names the temperature, in the right unit, and the way out', () => {
    const c = tooHotNote(47.3, 'metric');
    expect(c).toMatch(/47/);
    expect(c).toMatch(/too hot/i);
    expect(c).toMatch(/cool/i);
    expect(tooHotNote(47.3, 'imperial')).toMatch(/117/); // 47.3 C = 117.1 F
  });
});
