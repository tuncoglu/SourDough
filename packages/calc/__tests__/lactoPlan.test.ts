/**
 * The ferment page as one pure function.
 *
 * The forecast is the OUTDOOR temperature and a jar on a counter sits warmer,
 * so a temperature the user set must win in both passes of the estimate. The
 * numbers here are what the real engine gives for 1 kg of cabbage at 2 % salt.
 */
import { planLacto, type LactoPlanInput } from '../src/lib/lactoPlan';
import { FERMENT_PRESETS } from '../src/data/fermentPresets';
import { findVeg, VEG_RELEASE_FACTOR } from '../src/data/vegetables';
import type { HourlyPoint, WaterHardness } from '../src/models/types';

const HARD: WaterHardness = { mgL: 280, classification: 'very hard', note: 'Chalk downs', key: 'gb-england-se' };
const cabbage = findVeg('green-cabbage');

const BASE: LactoPlanInput = {
  fermentType: 'sauerkraut',
  method: 'dry',
  preset: FERMENT_PRESETS.sauerkraut!,
  combo: null,
  veg: { ...cabbage, releaseFactor: VEG_RELEASE_FACTOR[cabbage.category] },
  isMultiVeg: false,
  totalMixGrams: 0,
  vegWeight: '1000',
  waterAmount: '0',
  saltPct: '2.0',
  saltType: 'maldon-flake',
  prepSize: 'shredded',
  useStarter: false,
  hourlyForecast: null,
  currentTemp: 19,
  fermTempOverride: 0,
  hardness: HARD,
  unitSystem: 'metric',
};

const ready = (input: LactoPlanInput) => {
  const plan = planLacto(input);
  if (!plan.ok) throw new Error(plan.error);
  return plan;
};

const flatForecast = (tempC: number): HourlyPoint[] => {
  const start = new Date('2026-10-28T12:00:00');
  return Array.from({ length: 24 * 21 }, (_, i) => ({
    datetime: new Date(start.getTime() + i * 3_600_000).toISOString(),
    tempC,
  }));
};

describe('planLacto', () => {
  it('matches the real engine: 20 g salt, 10.1 days (taste from 6, deeper sour past 14) at 19 °C', () => {
    const plan = ready(BASE);
    expect(plan.results.saltGrams).toBe(20);
    expect(plan.results.estimatedDays).toBe(10.1);
    expect(plan.results.estimatedDaysMin).toBe(6);
    expect(plan.results.estimatedDaysMax).toBe(14.1);
    expect(plan.tempC).toBe(19);
    // Only the factors that move the estimate are reported: here just temperature.
    expect(plan.timing.factors.map((f) => f.id)).toEqual(['temperature']);
    expect(plan.timeline[0].day).toBe(0);
  });

  it('is shorter with a starter culture, by a fixed head start rather than a percentage', () => {
    const wild = ready(BASE);
    const started = ready({ ...BASE, useStarter: true });
    expect(started.results.estimatedDays).toBe(7.7);
    expect(started.results.estimatedDays).toBeLessThan(wild.results.estimatedDays);
  });

  it('says what is missing instead of calculating', () => {
    expect(planLacto({ ...BASE, vegWeight: '' })).toEqual({ ok: false, error: 'Enter a weight for the vegetables.' });
    expect(planLacto({ ...BASE, isMultiVeg: true, totalMixGrams: 0 })).toEqual({
      ok: false,
      error: 'Enter grams for at least one vegetable.',
    });
    expect(planLacto({ ...BASE, method: 'brine', waterAmount: '0' })).toEqual({
      ok: false,
      error: 'Enter the amount of water for your brine.',
    });
    expect(planLacto({ ...BASE, saltPct: '' })).toEqual({ ok: false, error: 'Enter a salt percentage greater than 0.' });
    expect(planLacto({ ...BASE, saltPct: '0' }).ok).toBe(false);
  });

  it('uses a temperature the user set, whatever the forecast says', () => {
    const outdoors = ready({ ...BASE, hourlyForecast: flatForecast(10), currentTemp: 10 });
    const kitchen = ready({ ...BASE, hourlyForecast: flatForecast(10), currentTemp: 10, fermTempOverride: 19 });
    expect(kitchen.tempC).toBe(19);
    expect(kitchen.results.estimatedDays).toBe(10.1);
    // The cold outdoor reading would have made it much slower.
    expect(outdoors.results.estimatedDays).toBeGreaterThan(kitchen.results.estimatedDays);
  });

  it('makes the same estimate for a set temperature as for a forecast at that temperature', () => {
    const set = ready({ ...BASE, hourlyForecast: flatForecast(5), fermTempOverride: 22 });
    const forecast = ready({ ...BASE, hourlyForecast: flatForecast(22), fermTempOverride: 0 });
    expect(set.results.estimatedDays).toBe(forecast.results.estimatedDays);
  });

  it('reports a ferment that is too cold to work rather than a number', () => {
    const cold = ready({ ...BASE, fermTempOverride: 4 });
    expect(cold.timing.stalled).toBe(true);
    expect(cold.timing.stallReason).toBe('cold');
    expect(cold.results.tempCapped).toBe(true);
  });
});
