/**
 * How fast a starter works, and how the app learns it.
 *
 * Counter time runs at a pace that depends on the kitchen (x2.5 per 10 °C from
 * 22 °C), a bigger feed takes longer to peak, and a starter's own marked peaks
 * replace the default 6 effective hours once there are three. The numbers
 * below are the ones the design shows, so they are checked here.
 */
import {
  DEFAULT_PEAK_EFFECTIVE_HOURS,
  STARTER_MAX_EFFECTIVE_TEMP_C,
  computeStarterStatus,
  feedDilution,
  feedSizeFactor,
  learnedPeakEffectiveHours,
  starterFeedAmounts,
  starterPace,
  starterPeakWindowHours,
  starterTimeToPeakHours,
} from '../src/lib/starterStatus';
import { planLazyBake } from '../src/lib/lazyPlan';
import { buildFeedStep, buildLazySteps } from '../src/lib/lazyMethod';
import type { StarterFeeding } from '../src/models/types';

const H = 3_600_000;
const NOW = new Date('2026-10-30T13:00:00Z').getTime();
const ago = (hours: number) => new Date(NOW - hours * H).toISOString();

const feeding = (over: Partial<StarterFeeding> = {}): StarterFeeding => ({
  id: 'f',
  timestamp: ago(0),
  flourUsed: 'Generic: Bread Flour',
  flourGrams: 50,
  waterGrams: 50,
  ...over,
});

describe('pace and feed size', () => {
  it('runs at the reference pace at 22 °C and x2.5 per 10 °C either side', () => {
    expect(starterPace(22)).toBe(1);
    expect(starterPace(32)).toBeCloseTo(2.5, 6);
    expect(starterPace(12)).toBeCloseTo(0.4, 6);
    expect(starterPace(20)).toBeCloseTo(0.8326, 3);
  });

  it('stops speeding up at 38 °C and ignores a missing temperature', () => {
    expect(starterPace(60)).toBe(starterPace(STARTER_MAX_EFFECTIVE_TEMP_C));
    expect(starterPace(NaN)).toBe(1);
  });

  it('reads a record that does not say what was kept as a 1 : 1 : 1 feed', () => {
    expect(feedDilution({ flourGrams: 50, waterGrams: 50 })).toBe(3);
    expect(feedDilution({ starterKeptGrams: 0, flourGrams: 50, waterGrams: 50 })).toBe(3);
    expect(feedDilution({ starterKeptGrams: 50, flourGrams: 50, waterGrams: 50 })).toBe(3);
    expect(feedDilution({ starterKeptGrams: 30, flourGrams: 60, waterGrams: 60 })).toBe(5);
    expect(feedDilution({ starterKeptGrams: 10, flourGrams: 50, waterGrams: 50 })).toBe(11);
  });

  it('makes a bigger feed take longer: 1:2:2 about x1.5 and 1:5:5 about x2.2', () => {
    expect(feedSizeFactor(3)).toBe(1);
    expect(feedSizeFactor(5)).toBeCloseTo(1.465, 3);
    expect(feedSizeFactor(11)).toBeCloseTo(2.183, 3);
    expect(feedSizeFactor(1)).toBe(1);
  });
});

describe('time to peak', () => {
  const t = (roomTempC: number, dilution?: number, peakEffectiveHours?: number) =>
    Math.round(starterTimeToPeakHours({ roomTempC, dilution, peakEffectiveHours }) * 10) / 10;

  it('is 6 h at 22 °C for a 1:1:1 feed, and moves with the kitchen', () => {
    expect(t(22)).toBe(6);
    expect(t(24)).toBe(5);
    expect(t(20)).toBe(7.2);
    expect(t(18)).toBe(8.7);
    expect(t(27)).toBe(3.8);
  });

  it('is the design’s table for a bigger feed', () => {
    expect([t(18, 5), t(20, 5), t(24, 5), t(27, 5)]).toEqual([12.7, 10.6, 7.3, 5.6]);
    expect([t(18, 11), t(20, 11), t(24, 11), t(27, 11)]).toEqual([18.9, 15.7, 10.9, 8.3]);
  });

  it('uses the starter’s own peak when it has one', () => {
    expect(t(20, 3, 7)).toBe(8.4);
    expect(DEFAULT_PEAK_EFFECTIVE_HOURS).toBe(6);
  });

  it('puts the peak window from two thirds to four thirds of the time to peak', () => {
    const w = starterPeakWindowHours(7.2);
    expect(w.from).toBeCloseTo(4.8, 6);
    expect(w.to).toBeCloseTo(9.6, 6);
  });
});

describe('computeStarterStatus with the kitchen and the feed size', () => {
  const at = (hours: number, over: Partial<StarterFeeding> = {}) => feeding({ timestamp: ago(hours), ...over });

  it('is unchanged with no temperature given: the counter runs at the reference pace', () => {
    expect(computeStarterStatus(at(6), { now: NOW })!.effectiveHours).toBe(6);
    expect(computeStarterStatus(at(2), { now: NOW })!.zone).toBe('just-fed');
  });

  it('counts the same peak, wherever the kitchen: 7.2 h at 20 °C is 6 effective hours', () => {
    const cool = computeStarterStatus(at(7.2, { roomTempC: 20 }), { now: NOW })!;
    const warm = computeStarterStatus(at(5, { roomTempC: 24 }), { now: NOW })!;
    expect(cool.effectiveHours).toBe(6);
    expect(warm.effectiveHours).toBe(6);
    expect(cool.zone).toBe('peak');
    expect(cool.hoursSinceFed).toBe(7.2);
  });

  it('falls back to today’s temperature when the feeding did not record one', () => {
    const s = computeStarterStatus(at(7.2), { now: NOW, roomTempC: 20 })!;
    expect(s.effectiveHours).toBe(6);
  });

  it('takes longer to peak after a bigger feed', () => {
    const big = at(13.1, { starterKeptGrams: 10, flourGrams: 50, waterGrams: 50 }); // 1 : 5 : 5 at 22 °C
    expect(computeStarterStatus(big, { now: NOW })!.effectiveHours).toBe(6);
    // A 1:1:1 feed 13 h ago is long past its peak.
    expect(computeStarterStatus(at(13), { now: NOW })!.zone).toBe('past-peak');
  });

  it('stretches a slower starter to the default so the zones stay put', () => {
    // This starter takes 7 effective hours to peak, so 7 h on a 22 °C counter reads as 6.
    expect(computeStarterStatus(at(7), { now: NOW, peakEffectiveHours: 7 })!.effectiveHours).toBe(6);
  });

  it('counts the fridge at 6 % and the counter at the kitchen’s pace: the design’s dormant starter', () => {
    // Fed, in the fridge 0.5 h later, 51.3 h ago at 20 °C: 0.5 x 0.83 + 51.3 x 0.06 = 3.5.
    const s = computeStarterStatus(
      at(51.8, { roomTempC: 20, fridgeAt: ago(51.3) }),
      { now: NOW },
    )!;
    expect(s.isInFridge).toBe(true);
    expect(s.zone).toBe('dormant');
    expect(s.effectiveHours).toBe(3.5);
  });
});

describe('learning the starter’s own peak', () => {
  // A peak marked `clockHours` after a feed in a kitchen at `tempC` is that many effective hours.
  const peaked = (daysAgo: number, effective: number, tempC: number, over: Partial<StarterFeeding> = {}): StarterFeeding => {
    const fedAt = NOW - daysAgo * 24 * H;
    const size = feedSizeFactor(feedDilution({ flourGrams: 50, waterGrams: 50, ...over }));
    const clockHours = (effective * size) / starterPace(tempC);
    return feeding({
      id: `p${daysAgo}`,
      timestamp: new Date(fedAt).toISOString(),
      peakedAt: new Date(fedAt + clockHours * H).toISOString(),
      roomTempC: tempC,
      ...over,
    });
  };

  it('uses the default until three peaks have been marked', () => {
    expect(learnedPeakEffectiveHours([])).toBeNull();
    expect(learnedPeakEffectiveHours([peaked(1, 6, 20), peaked(2, 6.2, 21)])).toBeNull();
  });

  it('takes the median of three, whatever the kitchen was each time', () => {
    const learned = learnedPeakEffectiveHours([
      peaked(1, 6.2, 21),
      peaked(8, 6.0, 19.5),
      peaked(15, 5.8, 20.5),
    ]);
    expect(learned).toEqual({ effectiveHours: 6, count: 3 });
  });

  it('shifts when the starter is slower than the default', () => {
    const slow = learnedPeakEffectiveHours([peaked(1, 7.4, 20), peaked(8, 7.0, 22), peaked(15, 7.2, 24)]);
    expect(slow!.effectiveHours).toBe(7.2);
  });

  it('only counts feeds of a similar size to the latest', () => {
    const big = { starterKeptGrams: 10, flourGrams: 50, waterGrams: 50 };
    // Latest is a 1:1:1 feed; the 1:5:5 peak does not count towards its median.
    const mixed = [peaked(1, 6, 20), peaked(8, 6.1, 20), peaked(15, 5.9, 20, big)];
    expect(learnedPeakEffectiveHours(mixed)).toBeNull();
  });

  it('turns a big feed’s clock time into the same effective hours as a small one', () => {
    const big = { starterKeptGrams: 10, flourGrams: 50, waterGrams: 50 };
    const learned = learnedPeakEffectiveHours([peaked(1, 6, 20, big), peaked(8, 6.2, 20, big), peaked(15, 5.8, 20, big)]);
    expect(learned!.effectiveHours).toBe(6);
  });

  it('does not believe a peak marked days later, or one with no temperature to go on', () => {
    const late = feeding({ timestamp: ago(100), peakedAt: ago(20), roomTempC: 20 });
    const noTemp = peaked(2, 6, 20, { roomTempC: undefined });
    expect(learnedPeakEffectiveHours([late, noTemp, peaked(3, 6, 20), peaked(4, 6, 20)])).toBeNull();
    // Today’s temperature stands in for a record that has none.
    expect(learnedPeakEffectiveHours([noTemp, peaked(3, 6, 20), peaked(4, 6, 20)], 20)!.effectiveHours).toBe(6);
  });

  it('keeps a learned figure inside 3–12 effective hours', () => {
    const quick = learnedPeakEffectiveHours([peaked(1, 1, 22), peaked(2, 1, 22), peaked(3, 1, 22)]);
    const slow = learnedPeakEffectiveHours([peaked(1, 20, 22), peaked(2, 20, 22), peaked(3, 20, 22)]);
    expect(quick!.effectiveHours).toBe(3);
    expect(slow!.effectiveHours).toBe(12);
  });
});

describe('what to feed', () => {
  it('gives 50 g, 50 g and 50 g for a 100 g loaf and 50 g left in the jar', () => {
    expect(starterFeedAmounts({ neededGrams: 100 })).toEqual({
      keptGrams: 50, flourGrams: 50, waterGrams: 50, totalGrams: 150, dilution: 3,
    });
  });

  it('keeps the total the same at a bigger ratio, with less starter left to dilute', () => {
    const two = starterFeedAmounts({ neededGrams: 100, ratio: 2 });
    expect([two.keptGrams, two.flourGrams, two.waterGrams, two.totalGrams]).toEqual([30, 60, 60, 150]);
    expect(two.dilution).toBe(5);
    const five = starterFeedAmounts({ neededGrams: 100, ratio: 5 });
    expect([five.keptGrams, five.flourGrams, five.waterGrams]).toEqual([14, 70, 70]);
    expect(five.dilution).toBeCloseTo(11, 0);
  });

  it('takes the starter’s hydration into account', () => {
    const stiff = starterFeedAmounts({ neededGrams: 100, hydration: 80 });
    expect(stiff.waterGrams).toBeLessThan(stiff.flourGrams);
  });
});

describe('the feed step in the plan', () => {
  const readyAt = new Date('2026-10-31T09:00:00Z');

  it('adds a feed step one time-to-peak before the mix, and no other change', () => {
    const plain = planLazyBake({ readyAt, bulkHours: 7, proofMode: 'fridge', vessel: 'cocotte' });
    const fed = planLazyBake({
      readyAt, bulkHours: 7, proofMode: 'fridge', vessel: 'cocotte',
      feed: { leadHours: 7.2, windowHours: { from: 4.8, to: 9.6 } },
    });
    expect(plain.steps.map((s) => s.key)).toEqual(['mix', 'rise', 'shape', 'proof', 'bake', 'cool']);
    expect(plain.feedAt).toBeUndefined();
    expect(fed.steps.map((s) => s.key)).toEqual(['feed', 'mix', 'rise', 'shape', 'proof', 'bake', 'cool']);
    expect(fed.mixAt.getTime()).toBe(plain.mixAt.getTime());
    expect(fed.feedAt!.getTime()).toBe(plain.mixAt.getTime() - 7.2 * H);
    expect(fed.totalHours).toBeCloseTo(plain.totalHours + 7.2, 6);
  });

  it('gives the window in which mixing keeps the starter at its peak', () => {
    const fed = planLazyBake({
      readyAt, bulkHours: 7, proofMode: 'fridge', vessel: 'cocotte',
      feed: { leadHours: 7.2, windowHours: { from: 4.8, to: 9.6 } },
    });
    const feedAt = fed.feedAt!.getTime();
    expect(fed.mixWindow!.from.getTime()).toBe(feedAt + 4.8 * H);
    expect(fed.mixWindow!.to.getTime()).toBe(feedAt + 9.6 * H);
    // The planned mix sits inside it.
    expect(fed.mixAt.getTime()).toBeGreaterThanOrEqual(fed.mixWindow!.from.getTime());
    expect(fed.mixAt.getTime()).toBeLessThanOrEqual(fed.mixWindow!.to.getTime());
  });

  it('ignores a feed with no usable lead time', () => {
    for (const leadHours of [0, -2, NaN]) {
      const p = planLazyBake({ readyAt, bulkHours: 7, proofMode: 'fridge', vessel: 'cocotte', feed: { leadHours } });
      expect(p.feedAt).toBeUndefined();
      expect(p.steps).toHaveLength(6);
    }
  });

  it('describes the feed in plain words, with the amounts and the kitchen', () => {
    const step = buildFeedStep({
      leadHours: 7.2, roomTempC: 20, keptGrams: 50, flourGrams: 50, waterGrams: 50, neededGrams: 100, unitSystem: 'metric',
    });
    expect(step.key).toBe('feed');
    expect(step.duration).toBe('about 7 h to peak');
    expect(step.body).toContain('Keep 50 g of starter');
    expect(step.body).toContain('50 g of flour and 50 g of water');
    expect(step.body).toContain('20°C');
    expect(step.body).toContain('100 g goes in the dough');
  });

  it('drops the second feed from the mix step when the starter was fed first', () => {
    const fridge = buildLazySteps('cocotte', 7, 'metric').find((s) => s.key === 'mix')!;
    const fed = buildLazySteps('cocotte', 7, 'metric', { starterFed: true }).find((s) => s.key === 'mix')!;
    expect(fridge.aside).toContain('Feed what');
    expect(fed.aside).toContain('No second feed');
    // Still the six fixed steps either way.
    expect(buildLazySteps('cocotte', 7, 'metric', { starterFed: true })).toHaveLength(6);
  });
});
