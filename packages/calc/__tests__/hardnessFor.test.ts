import { hardnessFor, looksLikeUkPostcode } from '../src/lib/hardnessFor';

describe('hardnessFor', () => {
  it('a typed number beats everything', () => {
    const r = hardnessFor({ manualMgL: 250, postcode: 'G1 1AA', place: { countryCode: 'gb', region: 'England' } });
    expect(r.source).toBe('manual');
    expect(r.hardness.mgL).toBe(250);
  });

  it('a UK postcode looks up its area, with no network', () => {
    const glasgow = hardnessFor({ postcode: 'G1 1AA' });
    expect(glasgow.source).toBe('postcode');
    expect(glasgow.hardness.mgL).toBeLessThan(50); // Loch Katrine is very soft
    const london = hardnessFor({ postcode: 'sw1a 1aa' });
    expect(london.hardness.mgL).toBeGreaterThan(200);
  });

  it('ignores something that is not a postcode, and falls to the place', () => {
    const r = hardnessFor({ postcode: 'hello', place: { countryCode: 'gb', region: 'England' } });
    expect(r.source).toBe('location');
  });

  it('uses the town found from the location when there is no postcode', () => {
    const r = hardnessFor({ place: { countryCode: 'de', region: 'Bavaria' } });
    expect(r.source).toBe('location');
    expect(r.hardness.mgL).toBeGreaterThan(0);
  });

  it('says it is assuming when it has nothing', () => {
    expect(hardnessFor({}).source).toBe('assumed');
    expect(hardnessFor({ place: { countryCode: 'zz', region: '' } }).source).toBe('assumed');
    expect(hardnessFor({}).hardness.mgL).toBe(120);
  });

  it('recognises UK postcode shapes', () => {
    for (const ok of ['SW1A 1AA', 'sw1a1aa', 'B1', 'KT12', 'EH1 1YZ']) expect(looksLikeUkPostcode(ok)).toBe(true);
    for (const bad of ['', 'hello', '12345', 'ABC']) expect(looksLikeUkPostcode(bad)).toBe(false);
  });
});
