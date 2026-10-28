import { describe, expect, it } from 'vitest';
import { archiveUrl, detectWeather, normalizeWeather, parseHourly, parsePlace, parseTemp, placeUrl, roundCoord, tapTempFromDaily, weatherUrl } from '../src/weather';

const response = {
  current: { temperature_2m: 11.4 },
  hourly: { time: ['2026-10-28T00:00', '2026-10-28T01:00', 'bad', '2026-10-28T03:00'], temperature_2m: [9.1, null, 8, 120] },
};

describe('weather parsing', () => {
  it('reads the current temperature and rejects nonsense', () => {
    expect(parseTemp(response)).toBe(11.4);
    expect(parseTemp({ current: { temperature_2m: 'warm' } })).toBeNull();
    expect(parseTemp({ current: { temperature_2m: 999 } })).toBeNull();
    expect(parseTemp(null)).toBeNull();
  });

  it('keeps only hours with a usable time and temperature', () => {
    expect(parseHourly(response)).toEqual([{ datetime: '2026-10-28T00:00', tempC: 9.1 }]);
    expect(parseHourly({})).toEqual([]);
  });

  it('rounds coordinates to about a kilometre before they are sent', () => {
    expect(roundCoord(51.50735)).toBe(51.51);
    const url = weatherUrl(51.50735, -0.12776);
    expect(url).toContain('latitude=51.51');
    expect(url).toContain('longitude=-0.13');
    expect(url).not.toContain('51.50735');
  });
});

describe('detectWeather', () => {
  const ok = (json: unknown) => (async () => ({ ok: true, json: async () => json })) as unknown as typeof fetch;

  it('returns the reading with the hourly forecast', async () => {
    const r = await detectWeather({
      getPosition: async () => ({ latitude: 1, longitude: 2 }),
      fetchFn: ok(response),
      now: () => 1234,
    });
    expect(r).toEqual({ ok: true, tempC: 11.4, hourly: [{ datetime: '2026-10-28T00:00', tempC: 9.1 }], at: 1234 });
  });

  it('says why when location is declined, without calling the network', async () => {
    let called = false;
    const r = await detectWeather({
      getPosition: async () => {
        throw { code: 'denied' };
      },
      fetchFn: (async () => {
        called = true;
      }) as unknown as typeof fetch,
    });
    expect(r).toEqual({ ok: false, reason: 'denied' });
    expect(called).toBe(false);
  });

  it('reports a network failure for a bad response', async () => {
    const r = await detectWeather({ getPosition: async () => ({ latitude: 1, longitude: 2 }), fetchFn: ok({}) });
    expect(r).toEqual({ ok: false, reason: 'network' });
  });
});

describe('place', () => {
  const nominatim = { address: { country_code: 'GB', state: 'England', county: 'Surrey', town: 'Esher' } };
  it('reads the country, region and town', () => {
    expect(parsePlace(nominatim)).toEqual({ countryCode: 'gb', region: 'England', city: 'Esher' });
    expect(parsePlace({ address: { country_code: 'de', county: 'Bavaria', village: 'Oberammergau' } })).toEqual({ countryCode: 'de', region: 'Bavaria', city: 'Oberammergau' });
  });
  it('rejects a response without a country', () => {
    expect(parsePlace({ address: {} })).toBeNull();
    expect(parsePlace(null)).toBeNull();
  });
  it('rounds the coordinates before they are sent', () => {
    expect(placeUrl(51.50735, -0.12776)).toContain('lat=51.51&lon=-0.13');
    expect(archiveUrl(51.50735, -0.12776, new Date(2026, 9, 28))).toContain('latitude=51.51&longitude=-0.13');
    expect(archiveUrl(51.5, -0.1, new Date(2026, 9, 28))).toContain('end_date=2026-10-28');
  });
});

describe('tap water temperature', () => {
  it('weights the most recent days most', () => {
    const rising = tapTempFromDaily({ daily: { temperature_2m_mean: [5, 5, 5, 15] } })!;
    const falling = tapTempFromDaily({ daily: { temperature_2m_mean: [15, 5, 5, 5] } })!;
    expect(rising).toBeGreaterThan(falling);
    expect(tapTempFromDaily({ daily: { temperature_2m_mean: [10, 10, 10] } })).toBe(10);
  });
  it('ignores missing days and nonsense', () => {
    expect(tapTempFromDaily({ daily: { temperature_2m_mean: [null, 12, 'x', 12] } })).toBe(12);
    expect(tapTempFromDaily({ daily: { temperature_2m_mean: [] } })).toBeNull();
    expect(tapTempFromDaily({})).toBeNull();
  });
});

describe('detectWeather with extras', () => {
  const pos = async () => ({ latitude: 51.5, longitude: -0.1 });
  const router = (routes: Record<string, unknown | null>) =>
    (async (url: string) => {
      const key = Object.keys(routes).find((k) => String(url).includes(k));
      const body = key ? routes[key] : null;
      return { ok: body !== null, json: async () => body };
    }) as unknown as typeof fetch;
  const forecast = { current: { temperature_2m: 11 }, hourly: { time: [], temperature_2m: [] } };

  it('asks only for what it is told to', async () => {
    const urls: string[] = [];
    const fetchFn = (async (u: string) => {
      urls.push(String(u));
      return { ok: true, json: async () => forecast };
    }) as unknown as typeof fetch;
    await detectWeather({ getPosition: pos, fetchFn });
    expect(urls).toHaveLength(1);
    expect(urls[0]).toContain('api.open-meteo.com');
  });

  it('adds the place and the tap temperature when asked', async () => {
    const r = await detectWeather(
      { getPosition: pos, fetchFn: router({ 'archive-api': { daily: { temperature_2m_mean: [9, 9, 9] } }, 'nominatim.openstreetmap.org': { address: { country_code: 'gb', state: 'England', town: 'Esher' } }, 'api.open-meteo.com': forecast }) },
      { place: true, tapTemp: true },
    );
    expect(r).toMatchObject({ ok: true, tempC: 11, place: { countryCode: 'gb', city: 'Esher' }, tapTempC: 9 });
  });

  it('still returns the forecast when an extra fails', async () => {
    const r = await detectWeather({ getPosition: pos, fetchFn: router({ 'archive-api': null, 'nominatim.openstreetmap.org': null, 'api.open-meteo.com': forecast }) }, { place: true, tapTemp: true });
    expect(r).toMatchObject({ ok: true, tempC: 11 });
    expect((r as { place?: unknown }).place).toBeUndefined();
    expect((r as { tapTempC?: unknown }).tapTempC).toBeUndefined();
  });
});

describe('normalizeWeather', () => {
  const base = { tempC: 10, at: 1, hourly: [{ datetime: '2026-10-28T00:00', tempC: 9 }, 5] };
  it('keeps a good reading with its extras', () => {
    const w = normalizeWeather({ ...base, place: { countryCode: 'GB', region: 'England', city: 'Esher' }, tapTempC: 9.5 })!;
    expect(w.hourly).toHaveLength(1);
    expect(w.place).toEqual({ countryCode: 'gb', region: 'England', city: 'Esher' });
    expect(w.tapTempC).toBe(9.5);
  });
  it('drops bad extras and rejects a bad reading', () => {
    expect(normalizeWeather({ ...base, place: { countryCode: 5 }, tapTempC: 999 })).toEqual({ tempC: 10, at: 1, hourly: [{ datetime: '2026-10-28T00:00', tempC: 9 }] });
    expect(normalizeWeather({ tempC: 'hot' })).toBeNull();
    expect(normalizeWeather(null)).toBeNull();
  });
});
