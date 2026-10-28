/**
 * The starter's state feeding the rise estimate.
 *
 * The same loaf takes longer with a cold or hungry starter and a mixed-flour
 * starter ferments differently from a white one, so the estimate must see both.
 * Without a usable feeding log everything falls back to the old assumption: a
 * fridge-cold starter at full strength.
 */
import { estimateLazyLoaf, type LazyLoafInput } from '../src/lib/lazyPlan';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';
import { mergeBlendWithStarter, normalizeStarterShares } from '../src/lib/blendUtils';
import {
  STARTER_STATUS_MAX_AGE_HOURS,
  computeStarterStatus,
  starterFlourBlendFromFeeding,
  starterTempFor,
  usableStarterStatus,
} from '../src/lib/starterStatus';
import type { StarterFeeding, StarterStatus } from '../src/models/types';

const LOAF: LazyLoafInput = {
  flourGrams: 500,
  waterPct: 75,
  starterPct: 20,
  saltPct: 2,
  starterHydration: 100,
  roomTempC: 20,
};
const hours = (loaf: Partial<LazyLoafInput>) =>
  estimateLazyLoaf({ ...LOAF, ...loaf }, null, FALLBACK_HARDNESS)!.bulkHours;

describe('starter activity in the rise estimate', () => {
  it('changes nothing when the starter state is not given', () => {
    // 8 h: fridge-cold starter at full strength, 20 °C kitchen.
    expect(hours({})).toBe(8);
  });

  it('is fastest with a starter fed to its peak, at room temperature', () => {
    const peak = hours({ starterTempC: 20, starterHoursSinceFed: 6 });
    expect(peak).toBe(7);
    expect(peak).toBeLessThan(hours({}));
  });

  it('slows as the starter gets hungry', () => {
    const peak = hours({ starterTempC: 20, starterHoursSinceFed: 6 });
    const hungry = hours({ starterTempC: 20, starterHoursSinceFed: 24 });
    const veryHungry = hours({ starterTempC: 20, starterHoursSinceFed: 30 });
    expect(hungry).toBe(10);
    expect(veryHungry).toBeGreaterThanOrEqual(hungry);
    expect(hungry).toBeGreaterThan(peak);
  });

  it('counts a fridge starter as slightly below full strength', () => {
    // 3.5 effective hours is 94 % activity, and the cold starter chills the dough.
    expect(hours({ starterTempC: 4, starterHoursSinceFed: 3.5 })).toBe(8.5);
  });

  it('refuses a starter age that is negative or not a number', () => {
    expect(estimateLazyLoaf({ ...LOAF, starterHoursSinceFed: -1 }, null, FALLBACK_HARDNESS)).toBeNull();
    expect(estimateLazyLoaf({ ...LOAF, starterHoursSinceFed: NaN }, null, FALLBACK_HARDNESS)).toBeNull();
  });
});

describe('starter fed with more than one flour', () => {
  const RYE = 'Dark Rye Type 1350 Organic (603)';
  const WHITE = 'No. 4 Organic White (105)';

  it('normalises shares to 100 and drops unusable entries', () => {
    const shares = normalizeStarterShares(
      [{ label: WHITE, share: 30 }, { label: RYE, share: 10 }, { label: 'x', share: 0 }, { label: 'y', share: NaN }],
      undefined,
    );
    expect(shares).toEqual([{ label: WHITE, share: 75 }, { label: RYE, share: 25 }]);
  });

  it('falls back to the single label, then to generic bread flour', () => {
    expect(normalizeStarterShares(undefined, RYE)).toEqual([{ label: RYE, share: 100 }]);
    expect(normalizeStarterShares([], undefined)).toEqual([{ label: 'Generic: Bread Flour', share: 100 }]);
  });

  it('splits the starter’s flour across the blend by share', () => {
    const merged = mergeBlendWithStarter(undefined, undefined, 0, 100, [
      { label: WHITE, share: 50 },
      { label: RYE, share: 50 },
    ]);
    const byLabel = Object.fromEntries(merged.map((e) => [e.label, e.percentage]));
    expect(byLabel[WHITE]).toBeCloseTo(50);
    expect(byLabel[RYE]).toBeCloseTo(50);
  });

  it('keeps the bowl flour in the total alongside a mixed starter', () => {
    const bowl = [{ label: WHITE, protein: 12, productNumber: '105', category: 'White Bread' as const, percentage: 100 }];
    const merged = mergeBlendWithStarter(bowl, undefined, 500, 50, [{ label: RYE, share: 100 }]);
    const total = merged.reduce((s, e) => s + e.percentage, 0);
    expect(total).toBeCloseTo(100);
    expect(merged.find((e) => e.label === RYE)!.percentage).toBeCloseTo((50 / 550) * 100);
  });

  it('feeds through to the estimate: a rye starter is not the same as the default', () => {
    const rye = estimateLazyLoaf(
      { ...LOAF, starterFlourBlend: [{ label: RYE, share: 100 }] },
      null,
      FALLBACK_HARDNESS,
    )!;
    // Rye ferments faster than white, and 50 g of the dough's flour is in the starter.
    expect(rye.bulkHours).toBe(7.5);
    expect(rye.bulkHours).toBeLessThan(hours({}));
    // Same weights either way: the starter's flour only changes how it ferments.
    expect(rye.doughGrams).toBe(986);
  });
});

describe('using the feeding log', () => {
  const NOW = Date.now();
  const iso = (hoursAgo: number) => new Date(NOW - hoursAgo * 3_600_000).toISOString();
  const feeding = (over: Partial<StarterFeeding> = {}): StarterFeeding => ({
    id: 'f1',
    timestamp: iso(3),
    flourUsed: 'Generic: Bread Flour',
    flourGrams: 50,
    waterGrams: 50,
    ...over,
  });

  it('takes the flour mix from the grams when a feeding used several flours', () => {
    const blend = starterFlourBlendFromFeeding(
      feeding({
        flours: [
          { label: 'White', grams: 30 },
          { label: 'Rye', grams: 10 },
        ],
      }),
    );
    expect(blend).toEqual([
      { label: 'White', share: 75 },
      { label: 'Rye', share: 25 },
    ]);
  });

  it('uses the single flour label of an older record, and nothing without a feeding', () => {
    expect(starterFlourBlendFromFeeding(feeding())).toEqual([{ label: 'Generic: Bread Flour', share: 100 }]);
    expect(starterFlourBlendFromFeeding(null)).toBeUndefined();
  });

  it('ignores a stale counter log but trusts a starter that is still in the fridge', () => {
    const stale = computeStarterStatus(feeding({ timestamp: iso(STARTER_STATUS_MAX_AGE_HOURS + 24) }))!;
    expect(stale.isInFridge).toBe(false);
    expect(usableStarterStatus(stale)).toBeNull();

    const inFridge = computeStarterStatus(
      feeding({ timestamp: iso(STARTER_STATUS_MAX_AGE_HOURS + 24), fridgeAt: iso(STARTER_STATUS_MAX_AGE_HOURS + 23) }),
    )!;
    expect(inFridge.isInFridge).toBe(true);
    expect(usableStarterStatus(inFridge)).toBe(inFridge);

    const recent = computeStarterStatus(feeding())!;
    expect(usableStarterStatus(recent)).toBe(recent);
    expect(usableStarterStatus(null)).toBeNull();
  });

  it('sets the starter’s temperature from where it is', () => {
    const status = (over: Partial<StarterStatus>): StarterStatus => ({
      hoursSinceFed: 5,
      effectiveHours: 5,
      isInFridge: false,
      hoursSinceFridgeOut: 0,
      zone: 'peak',
      emoji: '',
      label: '',
      ...over,
    });
    expect(starterTempFor(status({ isInFridge: true, zone: 'dormant' }), 20, 4)).toBe(4);
    expect(starterTempFor(status({ zone: 'building', hoursSinceFridgeOut: 1 }), 20, 4)).toBe(12);
    expect(starterTempFor(status({ zone: 'peak' }), 20, 4)).toBe(20);
  });
});
