/**
 * UK water hardness mapping (hostile review findings 5, 10 and 11).
 * No new hardness values: these tests only pin which existing entry is chosen.
 */
import { lookupWaterHardness } from '../src/data/waterHardness';
import { looksLikeUkPostcode } from '../src/data/ukWaterHardness';
import { waterHardnessAdvice } from '../src/lib/calculations';
import { FALLBACK_HARDNESS } from '../src/lib/hardnessUtils';

describe('finding 5: England is not one region', () => {
  it('a bare "England" is not London chalk (what Manchester, Leeds and Birmingham return)', () => {
    const r = lookupWaterHardness('gb', 'England');
    expect(r.key).not.toBe('gb-england-se');
    expect(r.mgL).not.toBe(280);
    expect(r.key).toBe('gb'); // the UK-wide figure, "varies by region"
  });

  it('"Midlands" is not London chalk either', () => {
    expect(lookupWaterHardness('gb', 'West Midlands').key).not.toBe('gb-england-se');
  });

  it('Greater London and the South East still map to the chalk entry', () => {
    expect(lookupWaterHardness('gb', 'Greater London').mgL).toBe(280);
    expect(lookupWaterHardness('gb', 'South East').mgL).toBe(280);
  });

  it('postcodes give the area figure: Manchester, Leeds, Birmingham, London', () => {
    expect(lookupWaterHardness('gb', 'England', 'M2 4NG').mgL).toBe(120);
    expect(lookupWaterHardness('gb', 'England', 'LS1 4AP').mgL).toBe(110);
    expect(lookupWaterHardness('gb', 'England', 'B1 1AA').mgL).toBe(200);
    expect(lookupWaterHardness('gb', 'England', 'SW1A 1AA').mgL).toBe(280);
  });

  it('Scotland and Wales are unchanged', () => {
    expect(lookupWaterHardness('gb', 'Scotland').mgL).toBe(30);
    expect(lookupWaterHardness('gb', 'Wales').mgL).toBe(60);
  });
});

describe('finding 11: free text is not a postcode', () => {
  it('"London" typed as a postcode no longer gets Liverpool water', () => {
    const r = lookupWaterHardness('gb', 'England', 'London');
    expect(r.key).not.toContain('uk-postcode');
    expect(r.note).not.toMatch(/Liverpool/);
  });

  it('other junk falls through to the place', () => {
    for (const junk of ['hello world', 'Manchester', '12345', 'ABC']) {
      expect(lookupWaterHardness('gb', 'Scotland', junk).mgL).toBe(30);
    }
  });

  it('valid shapes still look up, in any case and spacing', () => {
    for (const ok of ['SW1A 1AA', 'sw1a1aa', 'M1', 'M2 4NG', 'KT12']) {
      expect(lookupWaterHardness('gb', '', ok).key).toContain('uk-postcode');
    }
  });

  it('looksLikeUkPostcode lives with the data and rejects words', () => {
    expect(looksLikeUkPostcode('London')).toBe(false);
    expect(looksLikeUkPostcode('SW1A 1AA')).toBe(true);
  });
});

describe('finding 10: an assumed hardness is not called ideal', () => {
  it('says the value is assumed and gives no "ideal range" claim', () => {
    const text = waterHardnessAdvice(FALLBACK_HARDNESS).join('\n');
    expect(text).toMatch(/unknown|assum/i);
    expect(text).not.toMatch(/ideal range/i);
    expect(text).not.toMatch(/Your water is/i);
  });

  it('a measured value keeps its advice', () => {
    const text = waterHardnessAdvice(lookupWaterHardness('gb', '', 'M1')).join('\n');
    expect(text).toMatch(/Your water is/);
  });
});
