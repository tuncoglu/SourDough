/**
 * Unit tests for yogurt fermentation calculations.
 */
import {
  calculateSachets,
  estimateIncubation,
  buildYogurtTimeline,
  runYogurtCalculations,
  yogurtAdvice,
  estimateYield,
  calculateYogurtNutrition,
  PREHEAT_TEMP_C,
  PREHEAT_MINUTES,
} from '../src/lib/yogurtCalculations';
import { YOGURT_CULTURES, MILK_TYPES, findMilk } from '../src/data/yogurtCultures';
import { YogurtInputs } from '../src/models/types';

// ── calculateSachets ──────────────────────────────────────────────────────

describe('calculateSachets', () => {
  it('returns 1 for small volumes', () => {
    expect(calculateSachets(0.5, 0.5)).toBe(1); // floor at 1
    expect(calculateSachets(0, 1)).toBe(1);
  });

  it('scales linearly with volume', () => {
    expect(calculateSachets(2, 0.5)).toBe(1);  // 2L × 0.5 = 1
    expect(calculateSachets(4, 0.5)).toBe(2);  // 4L × 0.5 = 2
  });

  it('rounds up fractional sachets', () => {
    expect(calculateSachets(3, 0.5)).toBe(2);  // 1.5 → 2
    expect(calculateSachets(1.2, 1)).toBe(2);  // 1.2 → 2
  });

  it('mesophilic ratio (1 sachet/L)', () => {
    expect(calculateSachets(1, 1)).toBe(1);
    expect(calculateSachets(2, 1)).toBe(2);
  });
});

// ── estimateIncubation ────────────────────────────────────────────────────

describe('estimateIncubation', () => {
  it('thermophilic at optimal temp returns baseline', () => {
    const r = estimateIncubation(42, 'thermophilic', 8);
    expect(r.hours).toBeCloseTo(8, 1);
  });

  it('thermophilic warmer is faster', () => {
    const r = estimateIncubation(46, 'thermophilic', 8);
    expect(r.hours).toBeLessThan(8);
  });

  it('thermophilic colder is slower', () => {
    const r = estimateIncubation(35, 'thermophilic', 8);
    expect(r.hours).toBeGreaterThan(8);
  });

  it('mesophilic at optimal temp returns baseline', () => {
    const r = estimateIncubation(22, 'mesophilic', 24);
    expect(r.hours).toBeCloseTo(24, 1);
  });

  it('mesophilic warmer is faster', () => {
    const r = estimateIncubation(28, 'mesophilic', 24);
    expect(r.hours).toBeLessThan(24);
  });

  it('mesophilic colder is slower', () => {
    const r = estimateIncubation(18, 'mesophilic', 24);
    expect(r.hours).toBeGreaterThan(24);
  });

  it('caps at MAX_HOURS (72)', () => {
    // At very low temps, should be clamped to 72
    const r = estimateIncubation(0, 'mesophilic', 24);
    expect(r.hours).toBeLessThanOrEqual(72);
  });

  it('floors at MIN_HOURS (2)', () => {
    const r = estimateIncubation(60, 'thermophilic', 8);
    expect(r.hours).toBeGreaterThanOrEqual(2);
  });

  it('returns min/max range', () => {
    const r = estimateIncubation(42, 'thermophilic', 8);
    expect(r.hoursMin).toBeLessThan(r.hours);
    expect(r.hoursMax).toBeGreaterThan(r.hours);
  });
});

// ── estimateYield ─────────────────────────────────────────────────────────

describe('estimateYield', () => {
  it('thin yogurt has no straining loss', () => {
    const y = estimateYield(1, 'thin');
    // 1000ml × 1.03 g/ml × 0.97 evaporation = ~999g
    expect(y.estimatedYieldGrams).toBeCloseTo(999, -1); // ~1000g
    expect(y.estimatedServings).toBeGreaterThan(0);
  });

  it('thick yogurt (Greek) loses ~25% to straining', () => {
    const thin = estimateYield(1, 'thin');
    const thick = estimateYield(1, 'thick');
    expect(thick.estimatedYieldGrams).toBeLessThan(thin.estimatedYieldGrams);
  });

  it('very-thick (Skyr) loses ~40%', () => {
    const thick = estimateYield(1, 'thick');
    const veryThick = estimateYield(1, 'very-thick');
    expect(veryThick.estimatedYieldGrams).toBeLessThan(thick.estimatedYieldGrams);
  });
});

// ── calculateYogurtNutrition ──────────────────────────────────────────────

describe('calculateYogurtNutrition', () => {
  const wholeMilk = findMilk('cow-whole');

  it('medium thickness preserves original macros', () => {
    const n = calculateYogurtNutrition(wholeMilk, 'medium');
    expect(n.fatPct).toBe(wholeMilk.fatPct);
    expect(n.proteinPct).toBe(wholeMilk.proteinPct);
  });

  it('thick (Greek) concentrates protein and fat', () => {
    const n = calculateYogurtNutrition(wholeMilk, 'thick');
    expect(n.proteinPct).toBeGreaterThan(wholeMilk.proteinPct);
    expect(n.fatPct).toBeGreaterThan(wholeMilk.fatPct);
  });

  it('very-thick (Skyr) concentrates more', () => {
    const thick = calculateYogurtNutrition(wholeMilk, 'thick');
    const veryThick = calculateYogurtNutrition(wholeMilk, 'very-thick');
    expect(veryThick.proteinPct).toBeGreaterThan(thick.proteinPct);
  });
});

// ── buildYogurtTimeline ───────────────────────────────────────────────────

describe('buildYogurtTimeline', () => {
  it('starts with inoculation step', () => {
    const timeline = buildYogurtTimeline(8, 'thermophilic', 'medium', false);
    expect(timeline[0].hour).toBe(0);
    expect(timeline[0].label).toContain('Inoculate');
  });

  it('includes pre-heat step when enabled', () => {
    const withPre = buildYogurtTimeline(8, 'thermophilic', 'medium', true);
    expect(withPre[0].hour).toBeNull(); // pre-heat has null hour
    expect(withPre[0].label).toContain('Pre-heat');
  });

  it('ends with chill/complete step', () => {
    const timeline = buildYogurtTimeline(8, 'thermophilic', 'medium', false);
    const last = timeline[timeline.length - 1];
    expect(last.label).toContain('Chill');
  });

  it('thick/very-thick includes straining step', () => {
    const timeline = buildYogurtTimeline(8, 'thermophilic', 'thick', false);
    const hasStrain = timeline.some((p) => p.label.includes('Strain'));
    expect(hasStrain).toBe(true);
  });

  it('thin yogurt has no straining step', () => {
    const timeline = buildYogurtTimeline(8, 'thermophilic', 'thin', false);
    const hasStrain = timeline.some((p) => p.label.includes('Strain'));
    expect(hasStrain).toBe(false);
  });

  it('mesophilic mentions room temperature', () => {
    const timeline = buildYogurtTimeline(24, 'mesophilic', 'medium', false);
    const inoculation = timeline.find((p) => p.hour === 0);
    expect(inoculation?.description).toContain('room temperature');
  });
});

// ── runYogurtCalculations ─────────────────────────────────────────────────

describe('runYogurtCalculations', () => {
  const bulgarian = YOGURT_CULTURES.bulgarian!;
  const milk = findMilk('cow-whole');

  const baseInputs: YogurtInputs = {
    yogurtType: 'bulgarian',
    cultureType: 'thermophilic',
    milkId: 'cow-whole',
    milkLitres: 2,
    incubationTempC: 42,
    sachetCount: 1,
    preHeatEnabled: true,
  };

  it('returns all result fields', () => {
    const r = runYogurtCalculations(baseInputs, bulgarian, milk);
    expect(r.milkGrams).toBeGreaterThan(0);
    expect(r.sachetCount).toBe(1);
    expect(r.incubationHours).toBeGreaterThan(0);
    expect(r.estimatedYieldGrams).toBeGreaterThan(0);
    expect(r.estimatedServings).toBeGreaterThan(0);
    expect(r.starterRatioDisplay).toContain('per');
  });

  it('larger milk volume increases yield', () => {
    const small = runYogurtCalculations({ ...baseInputs, milkLitres: 1 }, bulgarian, milk);
    const large = runYogurtCalculations({ ...baseInputs, milkLitres: 3 }, bulgarian, milk);
    expect(large.estimatedYieldGrams).toBeGreaterThan(small.estimatedYieldGrams);
    expect(large.milkGrams).toBeGreaterThan(small.milkGrams);
  });

  it('respects temperature effect on incubation', () => {
    const cool = runYogurtCalculations({ ...baseInputs, incubationTempC: 35 }, bulgarian, milk);
    const warm = runYogurtCalculations({ ...baseInputs, incubationTempC: 46 }, bulgarian, milk);
    // Cooler = slower = longer incubation
    expect(cool.incubationHours).toBeGreaterThan(warm.incubationHours);
  });

  it('works with mesophilic cultures', () => {
    const amasi = YOGURT_CULTURES.amasi!;
    const inputs: YogurtInputs = { ...baseInputs, yogurtType: 'amasi', cultureType: 'mesophilic', incubationTempC: 22, sachetCount: 1 };
    const r = runYogurtCalculations(inputs, amasi, milk);
    expect(r.incubationHours).toBeGreaterThan(0);
  });
});

// ── yogurtAdvice ──────────────────────────────────────────────────────────

describe('yogurtAdvice', () => {
  it('warns when thermophilic temp is too low', () => {
    const advice = yogurtAdvice('thermophilic', 30, 'whole', true, 'medium', 12);
    expect(advice.some((a) => a.includes('low'))).toBe(true);
  });

  it('warns when thermophilic temp is too high', () => {
    const advice = yogurtAdvice('thermophilic', 50, 'whole', true, 'medium', 8);
    expect(advice.some((a) => a.includes('Too hot'))).toBe(true);
  });

  it('warns when mesophilic room is too cold', () => {
    const advice = yogurtAdvice('mesophilic', 15, 'whole', true, 'thin', 36);
    expect(advice.some((a) => a.includes('cool'))).toBe(true);
  });

  it('pre-heat advice is included when enabled', () => {
    const withPre = yogurtAdvice('thermophilic', 42, 'whole', true, 'medium', 8);
    expect(withPre.some((a) => a.includes('Pre-heating'))).toBe(true);
  });

  it('skimmed milk gets body advice', () => {
    const advice = yogurtAdvice('thermophilic', 42, 'skimmed', false, 'medium', 8);
    expect(advice.some((a) => a.includes('skimmed'))).toBe(true);
  });

  it('very-thick gets straining advice', () => {
    const advice = yogurtAdvice('thermophilic', 42, 'whole', true, 'very-thick', 10);
    expect(advice.some((a) => a.includes('strain'))).toBe(true);
  });

  it('includes general safety advice', () => {
    const advice = yogurtAdvice('thermophilic', 42, 'whole', true, 'medium', 8);
    expect(advice.some((a) => a.includes('contamination'))).toBe(true);
  });
});

// ── Constants ─────────────────────────────────────────────────────────────

describe('constants', () => {
  it('PREHEAT_TEMP_C is 85°C', () => {
    expect(PREHEAT_TEMP_C).toBe(85);
  });

  it('PREHEAT_MINUTES is 30', () => {
    expect(PREHEAT_MINUTES).toBe(30);
  });
});
