import { describe, expect, it } from 'vitest';
import { detectWeather, parseHourly, parseTemp, roundCoord, weatherUrl } from '../src/weather';

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
