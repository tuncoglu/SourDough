import { lookupWaterHardness } from '../src/data/waterHardness';
import { classifyHardness } from '../src/data/ukWaterHardness';

describe('classifyHardness (DWI scale)', () => {
  it('classifies soft', () => {
    expect(classifyHardness(15)).toBe('soft');
    expect(classifyHardness(50)).toBe('soft');
  });

  it('classifies moderately soft', () => {
    expect(classifyHardness(51)).toBe('moderately soft');
    expect(classifyHardness(100)).toBe('moderately soft');
  });

  it('classifies slightly hard', () => {
    expect(classifyHardness(101)).toBe('slightly hard');
    expect(classifyHardness(150)).toBe('slightly hard');
  });

  it('classifies moderately hard', () => {
    expect(classifyHardness(151)).toBe('moderately hard');
    expect(classifyHardness(200)).toBe('moderately hard');
  });

  it('classifies hard', () => {
    expect(classifyHardness(201)).toBe('hard');
    expect(classifyHardness(300)).toBe('hard');
  });

  it('classifies very hard', () => {
    expect(classifyHardness(301)).toBe('very hard');
    expect(classifyHardness(500)).toBe('very hard');
  });
});

describe('lookupWaterHardness', () => {
  it('returns manual override when provided', () => {
    const result = lookupWaterHardness('US', 'California', undefined, 150);
    expect(result.mgL).toBe(150);
    expect(result.classification).toBe('slightly hard');
    expect(result.key).toBe('manual');
  });

  it('returns UK postcode lookup for GB with derived classification', () => {
    const result = lookupWaterHardness('GB', '', 'PO6');
    expect(result.mgL).toBe(288);
    expect(result.classification).toBe('hard'); // DWI scale, even though the data note says "very hard"
    expect(result.key).toContain('uk-postcode');
  });

  it('returns Scotland as soft', () => {
    const result = lookupWaterHardness('GB', 'Scotland', '');
    expect(result.mgL).toBe(30);
    expect(result.classification).toBe('soft');
  });

  it('returns London as hard', () => {
    const result = lookupWaterHardness('GB', 'Greater London', '');
    expect(result.mgL).toBe(280);
    expect(result.classification).toBe('hard');
  });

  it('falls back to country-level for unknown region', () => {
    const result = lookupWaterHardness('DE', 'UnknownRegion', '');
    expect(result.mgL).toBe(160);
    expect(result.classification).toBe('moderately hard');
  });

  it('returns fallback for unknown country', () => {
    const result = lookupWaterHardness('XX', 'Unknown', '');
    expect(result.mgL).toBe(120);
    expect(result.classification).toBe('slightly hard');
    expect(result.key).toBe('fallback');
  });

  it('South West England maps to its own softer region, not London chalk', () => {
    const result = lookupWaterHardness('GB', 'South West', '');
    expect(result.mgL).toBe(100);
    expect(result.classification).toBe('moderately soft');
  });
});
