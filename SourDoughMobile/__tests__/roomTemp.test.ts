/**
 * Where the bread page's room temperature comes from (hostile review findings 2 and 3).
 * Pure logic only; the hooks that call it are not covered by this Jest config.
 */
import { chooseRoomTemp, describeRoomTemp, DEFAULT_ROOM_TEMP_C } from '../src/lib/roomTemp';
import { estimateLazyLoaf } from '@sourdough/calc/lib/lazyPlan';
import { FALLBACK_HARDNESS } from '@sourdough/calc/lib/hardnessUtils';

jest.mock('../src/lib/api', () => ({
  reverseGeocode: jest.fn(),
  getAmbientTemp: jest.fn(),
  fetchHourlyForecast: jest.fn(),
  estimateWaterTemp: jest.fn(),
}));

import * as api from '../src/lib/api';
import { detectAll } from '../src/lib/location';

describe('chooseRoomTemp', () => {
  it('uses the Settings kitchen temperature over the outdoor reading (outdoor 4, setting 20)', () => {
    expect(chooseRoomTemp(20, 4)).toEqual({ tempC: 20, source: 'settings' });
  });

  it('uses the outdoor reading, labelled as outdoor, when Settings has none', () => {
    expect(chooseRoomTemp(0, 4)).toEqual({ tempC: 4, source: 'outdoor' });
    expect(chooseRoomTemp(undefined, 4)).toEqual({ tempC: 4, source: 'outdoor' });
  });

  it('falls back to the default only when there is neither, and says so', () => {
    expect(chooseRoomTemp(0, null)).toEqual({ tempC: DEFAULT_ROOM_TEMP_C, source: 'default' });
    expect(chooseRoomTemp(undefined, undefined)).toEqual({ tempC: DEFAULT_ROOM_TEMP_C, source: 'default' });
    expect(chooseRoomTemp(0, NaN).source).toBe('default');
  });

  it('treats an outdoor 0 °C as a real reading', () => {
    expect(chooseRoomTemp(0, 0)).toEqual({ tempC: 0, source: 'outdoor' });
  });

  it('ignores a non-positive or non-finite Settings value', () => {
    expect(chooseRoomTemp(-3, 10).source).toBe('outdoor');
    expect(chooseRoomTemp(NaN, 10).source).toBe('outdoor');
  });

  it('drives the loaf estimate: the chosen 20 °C kitchen is not the 4 °C winter day', () => {
    const loaf = (roomTempC: number) =>
      estimateLazyLoaf(
        { flourGrams: 500, waterPct: 75, starterPct: 20, saltPct: 2, starterHydration: 100, roomTempC },
        null,
        FALLBACK_HARDNESS,
      );
    const chosen = chooseRoomTemp(20, 4);
    const kitchen = loaf(chosen.tempC)!;
    const winterDay = loaf(4)!;
    expect(kitchen.bulkHours).toBeLessThan(winterDay.bulkHours / 2);
  });
});

describe('describeRoomTemp', () => {
  it('does not call an outdoor or default value "auto"', () => {
    for (const source of ['settings', 'outdoor', 'default', 'typed'] as const) {
      expect(describeRoomTemp(source).badge).not.toBe('auto');
    }
  });

  it('labels the sources', () => {
    expect(describeRoomTemp('settings').badge).toMatch(/settings/i);
    expect(describeRoomTemp('outdoor').badge).toMatch(/outdoor/i);
    expect(describeRoomTemp('outdoor').note).toMatch(/outdoor/i);
  });

  it('warns on the default, naming the value and the way out', () => {
    const d = describeRoomTemp('default');
    expect(d.badge).toBeNull();
    expect(d.note).toMatch(/22/);
    expect(d.note).toMatch(/settings|type/i);
  });

  it('says nothing about a value the user typed', () => {
    expect(describeRoomTemp('typed')).toEqual({ badge: null, note: null });
  });
});

describe('weather failure after a successful geocode', () => {
  const loc = {
    city: 'Leeds', country: 'United Kingdom', countryCode: 'gb', region: 'England', lat: 53.8, lon: -1.55,
  };

  beforeEach(() => {
    (api.reverseGeocode as jest.Mock).mockResolvedValue(loc);
    (api.getAmbientTemp as jest.Mock).mockResolvedValue(null);
    (api.fetchHourlyForecast as jest.Mock).mockResolvedValue(null);
    (api.estimateWaterTemp as jest.Mock).mockResolvedValue(null);
  });

  it('keeps ambientTemp null, and the room temperature is then marked as the default, not auto-detected', async () => {
    const data = await detectAll(53.8, -1.55);
    expect(data).not.toBeNull();
    expect(data!.ambientTemp).toBeNull();
    const choice = chooseRoomTemp(0, data!.ambientTemp);
    expect(choice.source).toBe('default');
    expect(describeRoomTemp(choice.source).note).toBeTruthy();
  });
});
