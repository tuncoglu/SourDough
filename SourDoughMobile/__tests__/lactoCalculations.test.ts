/**
 * Unit tests for lacto-fermentation calculations.
 */
import {
  calculateFermentSalt,
  estimateFermentDuration,
  buildLactoTimeline,
  runLactoCalculations,
  computeFermentTemp,
  estimateWaterForJar,
  estimatePHAt,
  TARGET_PH,
  SAFETY_PH,
  FINAL_PH,
  PH_START,
} from '../src/lib/lactoCalculations';
import { FermentInputs, HourlyPoint } from '../src/models/types';

// ── calculateFermentSalt ──────────────────────────────────────────────────

describe('calculateFermentSalt', () => {
  it('brine method: salt is % of water weight', () => {
    const r = calculateFermentSalt(1000, 500, 3.0, 'brine', 'fine-sea', 92);
    // 3% of 500g water = 15g salt
    expect(r.saltGrams).toBe(15);
    // 15g / 5.7 g/tsp = ~2.63 tsp
    expect(r.saltTeaspoons).toBeCloseTo(2.63, 1);
  });

  it('dry method: salt is % of vegetable weight', () => {
    const r = calculateFermentSalt(1000, 0, 2.0, 'dry', 'fine-sea', 92);
    // 2% of 1000g veg = 20g salt
    expect(r.saltGrams).toBe(20);
    // 20g / 5.7 g/tsp = ~3.51 tsp
    expect(r.saltTeaspoons).toBeCloseTo(3.51, 1);
  });

  it('dry method: effective salinity accounts for released veg water', () => {
    // Cabbage releases ~90% of its water under salt (releaseFactor 0.9)
    const r = calculateFermentSalt(1000, 0, 2.0, 'dry', 'fine-sea', 92, 0.9);
    // Released water = 1000 * 0.92 * 0.9 = 828g
    // Total brine = 828 + 20 = 848g
    // Effective salinity = 20 / 848 * 100 = ~2.36%
    expect(r.totalBrineGrams).toBeCloseTo(848, 0);
    expect(r.effectiveSalinity).toBeCloseTo(2.36, 1);
  });

  it('dry method: dense roots form a much stronger self-brine', () => {
    // Carrot releases only ~40% of its water → real brine is ~2× the
    // salt %; the old flat 0.7 factor understated this (and overstated
    // leafy-veg salinity — the error flipped direction).
    const r = calculateFermentSalt(1000, 0, 2.5, 'dry', 'fine-sea', 88, 0.4);
    // Released water = 1000 * 0.88 * 0.4 = 352g
    // Total brine = 352 + 25 = 377g
    // Effective salinity = 25 / 377 * 100 = ~6.6%
    expect(r.totalBrineGrams).toBeCloseTo(377, 0);
    expect(r.effectiveSalinity).toBeCloseTo(6.6, 1);
  });

  it('dry method: defaults to a 0.7 release factor when unspecified', () => {
    const r = calculateFermentSalt(1000, 0, 2.0, 'dry', 'fine-sea', 92);
    expect(r.effectiveSalinity).toBeCloseTo(3.0, 1);
  });

  it('mash method: all veg water is available', () => {
    const r = calculateFermentSalt(500, 0, 3.0, 'mash', 'fine-sea', 90);
    // salt = 15g, total water = 500 * 0.9 = 450g
    // total brine = 450 + 15 = 465g
    // effective salinity = 15/465 * 100 ≈ 3.2%
    expect(r.saltGrams).toBe(15);
    expect(r.totalBrineGrams).toBeCloseTo(465, 0);
    expect(r.effectiveSalinity).toBeCloseTo(3.2, 1);
  });

  it('different salt crystal densities affect volume', () => {
    const fine = calculateFermentSalt(1000, 0, 2.0, 'dry', 'fine-sea', 92);
    const diamond = calculateFermentSalt(1000, 0, 2.0, 'dry', 'diamond-kosher', 92);
    // Both have same salt grams
    expect(fine.saltGrams).toBe(diamond.saltGrams);
    // Diamond kosher is less dense → more teaspoons
    expect(diamond.saltTeaspoons).toBeGreaterThan(fine.saltTeaspoons);
  });

  it('returns salt label', () => {
    const r = calculateFermentSalt(1000, 500, 3.0, 'brine', 'maldon-flake', 92);
    expect(r.saltLabel).toBe('Maldon sea flakes');
  });

  it('zero water in brine method gives zero salt', () => {
    const r = calculateFermentSalt(1000, 0, 3.0, 'brine', 'fine-sea', 92);
    expect(r.saltGrams).toBe(0);
    expect(r.saltTeaspoons).toBe(0);
  });
});

// ── estimateFermentDuration ───────────────────────────────────────────────

describe('estimateFermentDuration', () => {
  it('returns ~7 days at baseline 22°C with speed factor 1.0', () => {
    const d = estimateFermentDuration(22, 1.0);
    expect(d.days).toBeCloseTo(7.0, 1);
  });

  it('warmer temperature speeds up fermentation', () => {
    const cool = estimateFermentDuration(18, 1.0);
    const warm = estimateFermentDuration(28, 1.0);
    expect(warm.days).toBeLessThan(cool.days);
  });

  it('speed factor > 1 reduces fermentation time', () => {
    const baseline = estimateFermentDuration(22, 1.0);
    const fast = estimateFermentDuration(22, 1.8);
    expect(fast.days).toBeLessThan(baseline.days);
  });

  it('caps at MAX_DAYS for very cold temperatures', () => {
    const d = estimateFermentDuration(0, 1.0);
    expect(d.days).toBeLessThanOrEqual(60);
  });

  it('floors at MIN_DAYS for very hot temperatures', () => {
    const d = estimateFermentDuration(40, 1.8);
    expect(d.days).toBeGreaterThanOrEqual(1.0);
  });

  it('returns min/max range around estimate', () => {
    const d = estimateFermentDuration(22, 1.0);
    expect(d.daysMin).toBeLessThan(d.days);
    expect(d.daysMax).toBeGreaterThan(d.days);
  });
});

// ── estimatePHAt ──────────────────────────────────────────────────────────

describe('estimatePHAt', () => {
  it('starts at PH_START and ends at FINAL_PH', () => {
    expect(estimatePHAt(0)).toBeCloseTo(PH_START, 5);
    expect(estimatePHAt(1)).toBeCloseTo(FINAL_PH, 5);
  });

  it('drops fast early, then slows (decelerating curve)', () => {
    // Literature anchors for 2% sauerkraut at 22°C (7-day ferment):
    // day 2 (30%) ≈ 5.1, day 3.5 (50%) ≈ 4.4, day 5.25 (75%) ≈ 3.8
    expect(estimatePHAt(0.3)).toBeCloseTo(5.1, 1);
    expect(estimatePHAt(0.5)).toBeCloseTo(4.4, 1);
    expect(estimatePHAt(0.75)).toBeCloseTo(3.8, 1);
    // Late drop is slower than early drop
    const earlyDrop = estimatePHAt(0) - estimatePHAt(0.25);
    const lateDrop = estimatePHAt(0.75) - estimatePHAt(1);
    expect(earlyDrop).toBeGreaterThan(lateDrop);
  });

  it('clamps progress outside [0, 1]', () => {
    expect(estimatePHAt(-1)).toBeCloseTo(PH_START, 5);
    expect(estimatePHAt(2)).toBeCloseTo(FINAL_PH, 5);
  });

  it('crosses the pH 4.6 safety threshold at ~45% of the timeline', () => {
    expect(estimatePHAt(0.4)).toBeGreaterThan(SAFETY_PH);
    expect(estimatePHAt(0.5)).toBeLessThan(SAFETY_PH);
  });

  it('midpoint label in the timeline matches the curve', () => {
    const timeline = buildLactoTimeline(7, 'dry');
    const mid = timeline.find((p) => p.label.includes('L. plantarum'));
    expect(mid).toBeDefined();
    expect(mid!.description).toContain(estimatePHAt(0.5).toFixed(1));
  });
});

// ── buildLactoTimeline ────────────────────────────────────────────────────

describe('buildLactoTimeline', () => {
  it('starts with Day 0', () => {
    const timeline = buildLactoTimeline(7, 'brine');
    expect(timeline[0].day).toBe(0);
    expect(timeline[0].label).toContain('Start');
  });

  it('ends with the estimated day', () => {
    const timeline = buildLactoTimeline(7, 'brine');
    const last = timeline[timeline.length - 1];
    expect(last.day).toBe(7);
    expect(last.label).toContain('Complete');
  });

  it('includes Day 1 lag phase for ferments >= 1 day', () => {
    const timeline = buildLactoTimeline(7, 'brine');
    expect(timeline.some((p) => p.day === 1 && p.label.includes('Lag'))).toBe(true);
  });

  it('always includes Day 1 lag phase when ceil(days) >= 1', () => {
    // Even a 0.5-day ferment has totalDays = ceil(0.5) = 1, so Day 1 is included
    const timeline = buildLactoTimeline(0.5, 'brine');
    expect(timeline.some((p) => p.day === 1)).toBe(true);
  });

  it('skips intermediate phases for very short ferments', () => {
    // A 2-day ferment should only have Day 0, Day 1, and the final day
    const timeline = buildLactoTimeline(2, 'brine');
    const days = timeline.map((p) => p.day);
    // No intermediate phases between day 1 and the final day
    expect(days.filter((d) => d > 1 && d < 2).length).toBe(0);
  });

  it('dry method includes packing instructions on Day 0', () => {
    const timeline = buildLactoTimeline(7, 'dry');
    expect(timeline[0].description).toContain('weight');
  });

  it('brine method includes submersion instructions on Day 0', () => {
    const timeline = buildLactoTimeline(7, 'brine');
    expect(timeline[0].description).toContain('submerged');
  });
});

// ── runLactoCalculations ──────────────────────────────────────────────────

describe('runLactoCalculations', () => {
  const baseInputs: FermentInputs = {
    fermentType: 'sauerkraut',
    method: 'dry',
    vegWeight: 1000,
    waterAmount: 0,
    saltPct: 2.0,
    saltType: 'fine-sea',
    ambientTemp: 22,
  };

  it('returns all result fields', () => {
    const r = runLactoCalculations(baseInputs, 92, 1.0);
    expect(r.saltGrams).toBeGreaterThan(0);
    expect(r.estimatedDays).toBeGreaterThan(0);
    expect(r.targetPH).toBe(TARGET_PH);
    expect(r.brineStrengthDisplay).toBeDefined();
    expect(r.saltLabel).toBeDefined();
  });

  it('brine method shows brine strength', () => {
    const inputs: FermentInputs = { ...baseInputs, method: 'brine', waterAmount: 500, saltPct: 3.5 };
    const r = runLactoCalculations(inputs, 92, 1.0);
    expect(r.brineStrengthDisplay).toContain('3.5% brine');
  });

  it('dry method shows self-brining label', () => {
    const r = runLactoCalculations(baseInputs, 92, 1.0);
    expect(r.brineStrengthDisplay).toContain('self-brining');
  });
});

// ── computeFermentTemp ────────────────────────────────────────────────────

describe('computeFermentTemp', () => {
  const makeForecast = (hours: number, baseTemp: number): HourlyPoint[] => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return Array.from({ length: hours }, (_, i) => ({
      datetime: new Date(now.getTime() + i * 3600000).toISOString(),
      tempC: baseTemp,
    }));
  };

  it('returns fallback when no forecast available', () => {
    const r = computeFermentTemp(null, null, 7);
    expect(r.effectiveTemp).toBe(22);
    expect(r.source).toBe('fallback');
  });

  it('uses current temp when no forecast but temp available', () => {
    const r = computeFermentTemp(null, 25, 7);
    expect(r.effectiveTemp).toBe(25);
    expect(r.source).toBe('current');
  });

  it('averages forecast temps over estimated duration', () => {
    const forecast = makeForecast(48, 20);
    const r = computeFermentTemp(forecast, null, 3);
    expect(r.effectiveTemp).toBe(20);
    expect(r.source).toBe('forecast');
  });

  it('returns daily summaries', () => {
    const forecast = makeForecast(48, 22);
    const r = computeFermentTemp(forecast, null, 2);
    expect(r.dailyTemps.length).toBe(2);
    expect(r.dailyTemps[0].day).toBe('Today');
  });

  it('handles empty forecast array', () => {
    const r = computeFermentTemp([], 20, 7);
    expect(r.effectiveTemp).toBe(20);
    expect(r.source).toBe('current');
  });
});

// ── estimateWaterForJar ───────────────────────────────────────────────────

describe('estimateWaterForJar', () => {
  it('computes remaining volume after veg and headspace', () => {
    const water = estimateWaterForJar(1000, 600, 50);
    expect(water).toBe(350);
  });

  it('returns 0 when veg fills the jar', () => {
    const water = estimateWaterForJar(500, 500, 0);
    expect(water).toBe(0);
  });

  it('floors at 0 for overfull jars', () => {
    const water = estimateWaterForJar(500, 600, 0);
    expect(water).toBe(0);
  });
});

// ── Constants ─────────────────────────────────────────────────────────────

describe('safety constants', () => {
  it('TARGET_PH is 4.0 (shelf-stable)', () => {
    expect(TARGET_PH).toBe(4.0);
  });

  it('SAFETY_PH is 4.6 (botulism threshold)', () => {
    expect(SAFETY_PH).toBe(4.6);
  });

  it('TARGET_PH is below SAFETY_PH', () => {
    expect(TARGET_PH).toBeLessThan(SAFETY_PH);
  });
});
