import { lookupWaterHardness } from '../src/data/waterHardness';
import { classifyHardness } from '../src/data/ukWaterHardness';

describe('classifyHardness', () => {
  it('classifies very soft', () => {
    expect(classifyHardness(15)).toBe('very soft');
    expect(classifyHardness(29)).toBe('very soft');
  });

  it('classifies soft', () => {
    expect(classifyHardness(30)).toBe('soft');
    expect(classifyHardness(55)).toBe('soft');
  });

  it('classifies moderately soft', () => {
    expect(classifyHardness(60)).toBe('moderately soft');
    expect(classifyHardness(115)).toBe('moderately soft');
  });

  it('classifies moderately hard', () => {
    expect(classifyHardness(120)).toBe('moderately hard');
    expect(classifyHardness(195)).toBe('moderately hard');
  });

  it('classifies hard', () => {
    expect(classifyHardness(200)).toBe('hard');
    expect(classifyHardness(295)).toBe('hard');
  });

  it('classifies very hard', () => {
    expect(classifyHardness(300)).toBe('very hard');
    expect(classifyHardness(500)).toBe('very hard');
  });
});

describe('lookupWaterHardness', () => {
  it('returns manual override when provided', () => {
    const result = lookupWaterHardness('US', 'California', undefined, 150);
    expect(result.mgL).toBe(150);
    expect(result.classification).toBe('moderately hard');
    expect(result.key).toBe('manual');
  });

  it('returns UK postcode lookup for GB', () => {
    const result = lookupWaterHardness('GB', '', 'PO6');
    expect(result.mgL).toBe(288);
    expect(result.classification).toBe('very hard');
    expect(result.key).toContain('uk-postcode');
  });

  it('returns Scotland as very soft', () => {
    const result = lookupWaterHardness('GB', 'Scotland', '');
    expect(result.mgL).toBe(30);
    expect(result.classification).toBe('very soft');
  });

  it('returns London as very hard', () => {
    const result = lookupWaterHardness('GB', 'Greater London', '');
    expect(result.mgL).toBe(280);
    expect(result.classification).toBe('very hard');
  });

  it('falls back to country-level for unknown region', () => {
    const result = lookupWaterHardness('DE', 'UnknownRegion', '');
    expect(result.mgL).toBe(160);
    expect(result.classification).toBe('moderately hard');
  });

  it('returns fallback for unknown country', () => {
    const result = lookupWaterHardness('XX', 'Unknown', '');
    expect(result.mgL).toBe(120);
    expect(result.classification).toBe('moderately soft');
    expect(result.key).toBe('fallback');
  });
});
