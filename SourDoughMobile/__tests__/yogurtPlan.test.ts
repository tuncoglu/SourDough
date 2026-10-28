/**
 * The yogurt page as one pure function.
 *
 * Two rules matter: a thermophilic culture is held at its own temperature so
 * neither the weather nor the kitchen changes its time, and a mesophilic one
 * ferments at room temperature, which is the outdoor forecast unless the user
 * set the temperature where the jar actually sits.
 */
import { planYogurt, type YogurtPlanInput } from '../src/lib/yogurtPlan';
import { YOGURT_CULTURES, findMilk } from '../src/data/yogurtCultures';
import type { HourlyPoint } from '../src/models/types';

const BASE: YogurtPlanInput = {
  preset: YOGURT_CULTURES.bulgarian!,
  milk: findMilk('cow-whole'),
  milkLitres: '2',
  sachetCount: '1',
  starterSource: 'sachet',
  previousBatchGrams: '60',
  preHeatEnabled: true,
  hourlyForecast: null,
  currentTemp: 12,
  fermTempOverride: 0,
  unitSystem: 'metric',
};

const ready = (input: YogurtPlanInput) => {
  const plan = planYogurt(input);
  if (!plan.ok) throw new Error(plan.error);
  return plan;
};

describe('planYogurt', () => {
  it('matches the real engine for a Bulgarian batch: 8 h, 6–12 h, ~2 L from 2 L', () => {
    const { results, nutrition, incubationTempC } = ready(BASE);
    expect(results.incubationHours).toBe(8);
    expect(results.incubationHoursMin).toBe(6);
    expect(results.incubationHoursMax).toBe(12);
    expect(results.estimatedYieldGrams).toBe(1998);
    expect(results.estimatedServings).toBe(13);
    expect(nutrition).toEqual({ fatPct: 4, proteinPct: 3.5 });
    expect(incubationTempC).toBe(42);
  });

  it('asks for what is missing instead of calculating', () => {
    expect(planYogurt({ ...BASE, milkLitres: '' })).toEqual({ ok: false, error: 'Enter the amount of milk.' });
    expect(planYogurt({ ...BASE, milkLitres: '0' }).ok).toBe(false);
    expect(planYogurt({ ...BASE, sachetCount: '0' })).toEqual({ ok: false, error: 'Enter the number of starter sachets.' });
    // Sachets only matter when sachets are the starter.
    expect(planYogurt({ ...BASE, sachetCount: '0', starterSource: 'previous-batch' }).ok).toBe(true);
  });

  it('ignores the room temperature for a thermophilic culture', () => {
    const plain = ready(BASE);
    const withRoomTemp = ready({ ...BASE, fermTempOverride: 30, currentTemp: 5 });
    expect(withRoomTemp.results.incubationHours).toBe(plain.results.incubationHours);
    expect(withRoomTemp.incubationTempC).toBe(42);
  });

  describe('mesophilic cultures', () => {
    const VIILI = { ...BASE, preset: YOGURT_CULTURES.viili!, milkLitres: '1' };

    it('use the outdoor temperature when the user has not set one', () => {
      const cold = ready({ ...VIILI, currentTemp: 12 });
      expect(cold.incubationTempC).toBe(12);
    });

    it('use the temperature the user set, even when the forecast says otherwise', () => {
      const outdoors = ready({ ...VIILI, currentTemp: 12 });
      const kitchen = ready({ ...VIILI, currentTemp: 12, fermTempOverride: 20 });
      expect(kitchen.incubationTempC).toBe(20);
      // A warmer jar sets sooner, and this is the biggest error in the estimate.
      expect(kitchen.results.incubationHours).toBeLessThan(outdoors.results.incubationHours);
    });

    it('make the same estimate for a set temperature as for a forecast at that temperature', () => {
      const set = ready({ ...VIILI, fermTempOverride: 22, currentTemp: 5 });
      const forecast = ready({ ...VIILI, fermTempOverride: 0, currentTemp: 22 });
      expect(set.results.incubationHours).toBe(forecast.results.incubationHours);
    });

    it('read the forecast over the actual incubation when there is no set temperature', () => {
      const start = new Date('2026-10-28T12:00:00');
      const forecast: HourlyPoint[] = Array.from({ length: 96 }, (_, i) => ({
        datetime: new Date(start.getTime() + i * 3_600_000).toISOString(),
        tempC: 14,
      }));
      const plan = ready({ ...VIILI, hourlyForecast: forecast, currentTemp: 14 });
      expect(plan.incubationTempC).toBeCloseTo(14, 0);
    });
  });
});
