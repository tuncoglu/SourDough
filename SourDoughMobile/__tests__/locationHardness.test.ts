/**
 * Location -> water hardness (hostile review findings 5, 10 and 11), with Nominatim and
 * Open-Meteo mocked.
 */
jest.mock('../src/lib/api', () => ({
  reverseGeocode: jest.fn(),
  reversePostcode: jest.fn(),
  getAmbientTemp: jest.fn(),
  fetchHourlyForecast: jest.fn(),
  estimateWaterTemp: jest.fn(),
}));

import * as api from '../src/lib/api';
import { detectAll, buildSummary } from '../src/lib/location';
import { FALLBACK_HARDNESS } from '@sourdough/calc/lib/hardnessUtils';

const place = (city: string, countryCode = 'gb', region = 'England') => ({
  city, country: countryCode === 'gb' ? 'United Kingdom' : 'Elsewhere', countryCode, region, lat: 0, lon: 0,
});

function mockPlace(p: ReturnType<typeof place>, foundPostcode: string | null) {
  (api.reverseGeocode as jest.Mock).mockResolvedValue(p);
  (api.reversePostcode as jest.Mock).mockResolvedValue(foundPostcode);
  (api.getAmbientTemp as jest.Mock).mockResolvedValue(10);
  (api.fetchHourlyForecast as jest.Mock).mockResolvedValue(null);
  (api.estimateWaterTemp as jest.Mock).mockResolvedValue(11);
}

beforeEach(() => jest.clearAllMocks());

describe('detectAll: England outside London (finding 5)', () => {
  const cases: [string, string, number][] = [
    ['Manchester', 'M2 4NG', 120],
    ['Leeds', 'LS1 4AP', 110],
    ['Birmingham', 'B1 1AA', 200],
    ['London', 'SW1A 1AA', 280],
  ];
  it.each(cases)('%s uses the postcode found at the fix (%s)', async (city, pc, mgL) => {
    mockPlace(place(city), pc);
    const data = await detectAll(1, 2);
    expect(data!.hardness.mgL).toBe(mgL);
    expect(data!.hardness.key).toContain('uk-postcode');
  });

  it('with no postcode at the fix, England is the UK-wide figure, not London chalk', async () => {
    mockPlace(place('Somewhere'), null);
    const data = await detectAll(1, 2);
    expect(data!.hardness.key).toBe('gb');
    expect(data!.hardness.mgL).not.toBe(280);
  });

  it('only asks for a postcode in the UK', async () => {
    mockPlace(place('Munich', 'de', 'Bavaria'), null);
    await detectAll(1, 2);
    expect(api.reversePostcode).not.toHaveBeenCalled();
  });

  it('a postcode the user typed wins and needs no extra lookup', async () => {
    mockPlace(place('Manchester'), 'SW1A 1AA');
    const data = await detectAll(1, 2, 'LS1 4AP');
    expect(data!.hardness.mgL).toBe(110);
    expect(api.reversePostcode).not.toHaveBeenCalled();
  });
});

describe('detectAll: free text typed as a postcode (finding 11)', () => {
  it('"London" falls back to the postcode found at the fix, not Liverpool', async () => {
    mockPlace(place('London'), 'SW1A 1AA');
    const data = await detectAll(1, 2, 'London');
    expect(data!.hardness.mgL).toBe(280);
    expect(data!.hardness.note).not.toMatch(/Liverpool/);
  });

  it('"London" with no postcode found is not Liverpool either', async () => {
    mockPlace(place('London'), null);
    const data = await detectAll(1, 2, 'London');
    expect(data!.hardness.note).not.toMatch(/Liverpool/);
    expect(data!.hardness.key).not.toContain('uk-postcode');
  });
});

describe('buildSummary: assumed hardness (finding 10)', () => {
  const loc = place('Nowhere', 'zz', '');
  it('does not present the fallback as a measurement', () => {
    const s = buildSummary(loc, 10, 11, FALLBACK_HARDNESS);
    expect(s).toMatch(/unknown|assum/i);
    expect(s).toMatch(/120/);
    expect(s).not.toMatch(/Water slightly hard/);
  });

  it('keeps the plain wording for a real value', () => {
    const s = buildSummary(loc, 10, 11, { mgL: 120, classification: 'moderately soft', note: 'x', key: 'uk-postcode:M1x' });
    expect(s).toMatch(/Water moderately soft \(120 mg\/L\)/);
  });
});
