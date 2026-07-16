/**
 * Unit tests for the core calculation engine.
 */
import {
  calculateFDT,
  calculateIngredients,
  estimateFermentation,
  estimateDynamicFermentation,
  runAllCalculations,
} from '../src/lib/calculations';
import { WaterHardness, HourlyPoint, RecipeInputs } from '../src/models/types';

// ── FDT ─────────────────────────────────────────────────────────────────

describe('calculateFDT', () => {
  it('averages four temperatures', () => {
    expect(calculateFDT(20, 20, 20, 20)).toBe(20);
    expect(calculateFDT(22, 18, 21, 19)).toBe(20);
    expect(calculateFDT(30, 30, 20, 20)).toBe(25);
  });

  it('handles cold kitchen', () => {
    const fdt = calculateFDT(15, 10, 14, 15);
    expect(fdt).toBeCloseTo(13.5, 1);
  });

  it('handles warm kitchen', () => {
    const fdt = calculateFDT(30, 28, 32, 30);
    expect(fdt).toBeCloseTo(30, 1);
  });
});

// ── Ingredients ─────────────────────────────────────────────────────────

describe('calculateIngredients', () => {
  it('computes a basic 500g recipe correctly', () => {
    const r = calculateIngredients(500, 75, 100, 2.0, 100);
    // 500g fresh flour + 50g from starter = 550g total flour
    expect(r.freshFlour).toBe(500);
    expect(r.flourFromStarter).toBe(50);   // 100g starter at 100% hyd → 50g flour
    expect(r.totalFlour).toBe(550);
    expect(r.addedWater).toBeCloseTo(362.5, 1); // 75% of 550 = 412.5 - 50 from starter
    expect(r.waterFromStarter).toBe(50);
    expect(r.totalWater).toBeCloseTo(412.5, 1);
    expect(r.starterTotal).toBe(100);
    expect(r.salt).toBeCloseTo(11, 1);     // 2% of 550
    expect(r.totalDoughWeight).toBeCloseTo(973.5, 1);
  });

  it('handles stiff starter (50% hydration)', () => {
    const r = calculateIngredients(500, 70, 100, 2.0, 50);
    // starter: 100g → flour 66.7g, water 33.3g
    expect(r.flourFromStarter).toBeCloseTo(66.7, 1);
    expect(r.waterFromStarter).toBeCloseTo(33.3, 1);
    expect(r.totalFlour).toBeCloseTo(566.7, 1);
  });

  it('includes oil when provided', () => {
    const r = calculateIngredients(500, 75, 100, 2.0, 100, 10);
    expect(r.oil).toBeCloseTo(55, 1);      // 10% of 550
    expect(r.totalDoughWeight).toBeCloseTo(1028.5, 0);
  });

  it('returns zero oil when not provided', () => {
    const r = calculateIngredients(500, 75, 100, 2.0, 100);
    expect(r.oil).toBe(0);
    expect(r.prefermentFlour).toBe(0);
    expect(r.prefermentWater).toBe(0);
    expect(r.prefermentTotal).toBe(0);
  });

  it('decomposes pre-ferment correctly', () => {
    const r = calculateIngredients(500, 75, 100, 2.0, 100, undefined, {
      type: 'poolish',
      flourPct: 30,
      hydration: 100,
    });
    // total flour = 550g. pre-ferment flour = 30% of 550 = 165g
    expect(r.prefermentFlour).toBeCloseTo(165, 1);
    expect(r.prefermentWater).toBeCloseTo(165, 1); // poolish = 100% hyd
    expect(r.prefermentTotal).toBeCloseTo(330, 1);
    // freshFlour returns the original scalar input (500), not bowl flour
    // Bowl flour = freshFlour - prefermentFlour, computed internally
    expect(r.freshFlour).toBe(500);
  });
});

// ── Static Fermentation ─────────────────────────────────────────────────

describe('estimateFermentation', () => {
  it('returns ~4h at baseline (26°C, 20%, 70%, white)', () => {
    const { hours } = estimateFermentation(26, 20, 70, 'Generic: Bread Flour');
    expect(hours).toBe(4); // exactly baseline — no adjustments
  });

  it('extends time when cold', () => {
    const { hours } = estimateFermentation(20, 20, 70, 'Generic: Bread Flour');
    expect(hours).toBeGreaterThan(4);
    expect(hours).toBeCloseTo(7, 1); // ~3h extra per °C below baseline
  });

  it('shortens time when warm', () => {
    const { hours } = estimateFermentation(30, 20, 70, 'Generic: Bread Flour');
    expect(hours).toBeLessThan(4);
  });

  it('high inoculation speeds up', () => {
    const low = estimateFermentation(26, 5, 70, 'Generic: Bread Flour');
    const high = estimateFermentation(26, 40, 70, 'Generic: Bread Flour');
    expect(high.hours).toBeLessThan(low.hours);
  });

  it('rye flour ferments faster than white', () => {
    const white = estimateFermentation(22, 20, 70, 'Generic: Bread Flour');
    const rye = estimateFermentation(22, 20, 70, 'Generic: Rye Flour');
    // At 22°C, white ≈ 6h, rye ≈ 4h — difference is clear away from baseline
    expect(rye.hours).toBeLessThan(white.hours);
  });

  it('never goes below minimum', () => {
    const { hours } = estimateFermentation(40, 50, 90, 'Generic: Rye Flour');
    expect(hours).toBeGreaterThanOrEqual(0.5); // absolute floor
  });

  it('returns a descriptive note', () => {
    const cold = estimateFermentation(18, 20, 70);
    expect(cold.note).toContain('below baseline');

    const hot = estimateFermentation(30, 20, 70);
    expect(hot.note).toContain('above baseline');
  });
});

// ── Dynamic Fermentation ────────────────────────────────────────────────

describe('estimateDynamicFermentation', () => {
  const makeForecast = (hours: number, baseTemp: number, drift?: number): HourlyPoint[] => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const points: HourlyPoint[] = [];
    for (let i = 0; i < hours; i++) {
      const t = new Date(now.getTime() + i * 3600000);
      const temp = baseTemp + (drift ? drift * Math.sin((i / hours) * Math.PI) : 0);
      points.push({ datetime: t.toISOString(), tempC: Math.round(temp * 10) / 10 });
    }
    return points;
  };

  it('returns null for empty forecast', () => {
    const result = estimateDynamicFermentation(26, []);
    expect(result).toBeNull();
  });

  it('produces a profile with progress points', () => {
    const forecast = makeForecast(24, 26);
    const result = estimateDynamicFermentation(26, forecast);
    expect(result).not.toBeNull();
    expect(result!.totalHours).toBeGreaterThan(0);
    expect(result!.profile.length).toBeGreaterThan(0);
  });

  it('cold ambient extends fermentation', () => {
    const warm = estimateDynamicFermentation(26, makeForecast(48, 28));
    const cold = estimateDynamicFermentation(26, makeForecast(48, 18));
    expect(cold!.totalHours).toBeGreaterThan(warm!.totalHours);
  });

  it('rye ferment factor speeds things up', () => {
    // Use a cooler ambient so the flour difference is measurable
    const white = estimateDynamicFermentation(22, makeForecast(48, 22), 20, 70, 'Generic: Bread Flour');
    const rye = estimateDynamicFermentation(22, makeForecast(48, 22), 20, 70, 'Generic: Rye Flour');
    expect(rye!.totalHours).toBeLessThan(white!.totalHours);
  });
});

// ── Full Pipeline ───────────────────────────────────────────────────────

describe('runAllCalculations', () => {
  const fallbackHardness: WaterHardness = {
    mgL: 120,
    classification: 'moderately soft',
    note: 'Test fallback',
    key: 'test',
  };

  const baseInputs: RecipeInputs = {
    flourWeight: 500,
    flourType: 'Generic: Bread Flour',
    flourProtein: 12.5,
    flourProductNo: '-',
    hydration: 75,
    starterWeight: 100,
    starterHydration: 100,
    saltPct: 2.0,
    ambientTemp: 22,
    flourTemp: 22,
    waterTemp: 18,
    starterTemp: 22,
  };

  it('produces all result fields', () => {
    const result = runAllCalculations(baseInputs, null, fallbackHardness);
    expect(result.fdt).toBeDefined();
    expect(result.tempZone).toBeDefined();
    expect(result.ingredients).toBeDefined();
    expect(result.staticFermentHours).toBeGreaterThan(0);
    // fermentAdvice can be empty for a "normal" recipe at moderate temps
    expect(Array.isArray(result.fermentAdvice)).toBe(true);
    expect(result.waterHardnessAdvice.length).toBeGreaterThan(0);
    expect(result.hardness).toBe(fallbackHardness);
  });

  it('includes dynamic ferment when forecast is provided', () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const forecast: HourlyPoint[] = Array.from({ length: 24 }, (_, i) => ({
      datetime: new Date(now.getTime() + i * 3600000).toISOString(),
      tempC: 22,
    }));

    const result = runAllCalculations(baseInputs, forecast, fallbackHardness);
    expect(result.dynamicFerment).not.toBeNull();
  });
});
