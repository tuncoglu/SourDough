/** The Nominatim requests themselves (finding 11: addressdetails; finding 5: street-level postcode). */
describe('api.ts Nominatim requests', () => {
  const realFetch = global.fetch;
  afterEach(() => { global.fetch = realFetch; jest.resetModules(); });

  async function withFetch(body: unknown) {
    const urls: string[] = [];
    global.fetch = jest.fn(async (url: any) => {
      urls.push(String(url));
      return { ok: true, status: 200, json: async () => body, headers: { get: () => null } } as any;
    }) as any;
    jest.resetModules();
    const api = require('../src/lib/api');
    return { api, urls };
  }

  it('geocodePostcode asks for address details, so city and country are filled in', async () => {
    const { api, urls } = await withFetch([{ lat: '53.48', lon: '-2.24', address: { city: 'Manchester', country: 'United Kingdom', country_code: 'gb', state: 'England' } }]);
    const r = await api.geocodePostcode('M1 1AA');
    expect(urls[0]).toContain('addressdetails=1');
    expect(r.city).toBe('Manchester');
    expect(r.countryCode).toBe('gb');
  });

  it('reversePostcode reads the postcode from a street-level lookup', async () => {
    const { api, urls } = await withFetch({ address: { postcode: 'M2 4NG', country_code: 'gb' } });
    expect(await api.reversePostcode(53.48, -2.24)).toBe('M2 4NG');
    expect(urls[0]).toContain('/reverse');
    expect(urls[0]).toContain('zoom=18');
    expect(urls[0]).toContain('addressdetails=1');
  });

  it('reversePostcode returns null when there is none', async () => {
    const { api } = await withFetch({ address: { country_code: 'gb' } });
    expect(await api.reversePostcode(1, 2)).toBeNull();
  });
});
