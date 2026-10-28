import {
  getBlendProtein,
  getBlendFermentFactor,
  validateBlend,
  mergeBlendWithStarter,
  buildBlendFromRows,
  getBlend,
} from '../src/lib/blendUtils';
import { findFlour } from '../src/lib/flourSearch';
import { FlourBlendEntry, RecipeInputs } from '../src/models/types';

describe('getBlendProtein', () => {
  it('returns 0 for empty blend', () => {
    expect(getBlendProtein([])).toBe(0);
  });

  it('returns the single flour protein', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'Test', protein: 13.5, productNumber: '-', category: 'White Bread', percentage: 100 },
    ];
    expect(getBlendProtein(blend)).toBe(13.5);
  });

  it('computes weighted average for blends', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'A', protein: 14, productNumber: '-', category: 'White Bread', percentage: 50 },
      { label: 'B', protein: 10, productNumber: '-', category: 'White Bread', percentage: 50 },
    ];
    expect(getBlendProtein(blend)).toBe(12);
  });
});

describe('getBlendFermentFactor', () => {
  it('returns 1.0 for white bread flour', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'Test', protein: 12, productNumber: '-', category: 'White Bread', percentage: 100 },
    ];
    expect(getBlendFermentFactor(blend)).toBeCloseTo(1.0, 1);
  });

  it('rye factor > white factor', () => {
    const white: FlourBlendEntry[] = [
      { label: 'W', protein: 12, productNumber: '-', category: 'White Bread', percentage: 100 },
    ];
    const rye: FlourBlendEntry[] = [
      { label: 'R', protein: 9, productNumber: '-', category: 'Rye', percentage: 100 },
    ];
    expect(getBlendFermentFactor(rye)).toBeGreaterThan(getBlendFermentFactor(white));
  });

  it('weighted average for blend of white + rye', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'W', protein: 12, productNumber: '-', category: 'White Bread', percentage: 50 },
      { label: 'R', protein: 9, productNumber: '-', category: 'Rye', percentage: 50 },
    ];
    // white factor = 1.0, rye factor = 1.5 → weighted = 1.25
    expect(getBlendFermentFactor(blend)).toBeCloseTo(1.25, 1);
  });
});

describe('validateBlend', () => {
  it('returns null for valid blend', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'A', protein: 12, productNumber: '-', category: 'White Bread', percentage: 100 },
    ];
    expect(validateBlend(blend)).toBeNull();
  });

  it('rejects empty blend', () => {
    expect(validateBlend([])).toContain('required');
  });

  it('rejects more than 3 flours', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'A', protein: 12, productNumber: '-', category: 'White Bread', percentage: 25 },
      { label: 'B', protein: 12, productNumber: '-', category: 'White Bread', percentage: 25 },
      { label: 'C', protein: 12, productNumber: '-', category: 'White Bread', percentage: 25 },
      { label: 'D', protein: 12, productNumber: '-', category: 'White Bread', percentage: 25 },
    ];
    expect(validateBlend(blend)).toContain('3');
  });

  it('rejects percentages that do not sum to 100', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'A', protein: 12, productNumber: '-', category: 'White Bread', percentage: 60 },
      { label: 'B', protein: 12, productNumber: '-', category: 'White Bread', percentage: 30 },
    ];
    expect(validateBlend(blend)).toContain('90');
  });
});

describe('mergeBlendWithStarter', () => {
  it('returns empty array when total flour is zero', () => {
    const result = mergeBlendWithStarter([], 'Generic: Bread Flour', 0, 0);
    expect(result).toEqual([]);
  });

  it('merges starter flour into fresh blend', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'Generic: Bread Flour', protein: 12.5, productNumber: '-', category: 'White Bread', percentage: 100 },
    ];
    // 500g fresh + 50g from starter = 550g total
    const result = mergeBlendWithStarter(blend, 'Generic: Bread Flour', 500, 50);
    expect(result.length).toBe(1);
    // The bread flour entry should now have the starter flour merged in
    expect(result[0].percentage).toBeCloseTo(100, 0);
  });

  it('adds starter flour as separate entry if not in blend', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'Generic: Rye Flour', protein: 9, productNumber: '-', category: 'Rye', percentage: 100 },
    ];
    const result = mergeBlendWithStarter(blend, 'Generic: Bread Flour', 500, 50);
    // Should have both rye and bread flour entries
    expect(result.length).toBe(2);
  });
});

describe('buildBlendFromRows', () => {
  it('computes percentages from gram weights', () => {
    const flour = findFlour('Generic: Bread Flour');
    const result = buildBlendFromRows([
      { flour, grams: 400 },
      { flour, grams: 100 },
    ]);
    expect(result[0].percentage).toBe(80);
    expect(result[1].percentage).toBe(20);
  });

  it('returns all zeros for zero total', () => {
    const flour = findFlour('Generic: Bread Flour');
    const result = buildBlendFromRows([
      { flour, grams: 0 },
    ]);
    expect(result[0].percentage).toBe(0);
  });
});

describe('getBlend (legacy compatibility)', () => {
  it('returns blend array from new-style inputs', () => {
    const blend: FlourBlendEntry[] = [
      { label: 'Generic: Bread Flour', protein: 12.5, productNumber: '-', category: 'White Bread', percentage: 100 },
    ];
    const inputs: RecipeInputs = {
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
      flourBlend: blend,
    };
    expect(getBlend(inputs)).toEqual(blend);
  });

  it('synthesizes from legacy scalar inputs', () => {
    const inputs: RecipeInputs = {
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
    const result = getBlend(inputs);
    expect(result.length).toBe(1);
    expect(result[0].percentage).toBe(100);
    expect(result[0].label).toBe('Generic: Bread Flour');
  });
});
