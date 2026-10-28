/**
 * Yogurt: everything the yogurt page shows, as one pure function.
 *
 * The page calculates live, so this runs on every input change and must be
 * cheap and side-effect free. No React or storage imports.
 *
 * Temperature: a thermophilic culture is held at its own temperature, so the
 * weather and the kitchen do not matter. A mesophilic culture ferments at room
 * temperature. That is the outdoor forecast unless the user has set the
 * temperature where the jar actually sits (Settings), which always wins — the
 * same rule the lacto-ferment calculator follows.
 */
import type {
  HourlyPoint,
  MilkEntry,
  StarterSource,
  UnitSystem,
  YogurtCulturePreset,
  YogurtInputs,
  YogurtResults,
  YogurtStepPoint,
} from '../models/types';
import {
  buildYogurtTimeline,
  calculateYogurtNutrition,
  estimateIncubation,
  estimateYield,
  runYogurtCalculations,
  yogurtAdvice,
} from './yogurtCalculations';
import { computeFermentTemp } from './lactoCalculations';

export interface YogurtPlanInput {
  preset: YogurtCulturePreset;
  milk: MilkEntry;
  /** Litres, as typed (may be empty or invalid while the user is editing). */
  milkLitres: string;
  sachetCount: string;
  starterSource: StarterSource;
  previousBatchGrams: string;
  preHeatEnabled: boolean;
  hourlyForecast: HourlyPoint[] | null;
  /** Current outdoor temperature, used when there is no forecast. */
  currentTemp: number | null;
  /** The user's own room temperature (°C). Zero or less means "use the forecast". */
  fermTempOverride: number;
  unitSystem: UnitSystem;
}

export interface YogurtPlanReady {
  ok: true;
  results: YogurtResults;
  timeline: YogurtStepPoint[];
  advice: string[];
  nutrition: { fatPct: number; proteinPct: number };
  /** The temperature the incubation estimate was made at (°C). */
  incubationTempC: number;
}

export type YogurtPlan = YogurtPlanReady | { ok: false; error: string };

export function planYogurt(input: YogurtPlanInput): YogurtPlan {
  const { preset, milk, starterSource, preHeatEnabled, unitSystem } = input;
  const litres = parseFloat(input.milkLitres) || 0;
  const sachets = parseInt(input.sachetCount) || 0;

  if (litres <= 0) return { ok: false, error: 'Enter the amount of milk.' };
  if (starterSource === 'sachet' && sachets <= 0) {
    return { ok: false, error: 'Enter the number of starter sachets.' };
  }

  const cultureType = preset.type;
  const useOverride = input.fermTempOverride > 0;
  const forecast = (days: number) =>
    computeFermentTemp(input.hourlyForecast, input.currentTemp, days, unitSystem).effectiveTemp;

  // First pass: the culture's own temperature, or the room's for mesophilic.
  const firstPassTemp = cultureType === 'thermophilic'
    ? preset.typicalTempC
    : useOverride ? input.fermTempOverride : forecast(7);

  const inputs: YogurtInputs = {
    yogurtType: preset.id,
    cultureType,
    milkId: milk.id,
    milkLitres: litres,
    incubationTempC: firstPassTemp,
    starterSource,
    sachetCount: sachets,
    previousBatchGrams: parseFloat(input.previousBatchGrams) || undefined,
    preHeatEnabled,
  };

  const baseResults = runYogurtCalculations(inputs, preset, milk);
  const nutrition = calculateYogurtNutrition(milk, preset.thickness);

  // Thermophilic, or mesophilic at a temperature the user set: nothing to refine.
  if (cultureType === 'thermophilic' || useOverride) {
    return {
      ok: true,
      results: baseResults,
      timeline: buildYogurtTimeline(baseResults.incubationHours, cultureType, preset.thickness, preHeatEnabled, starterSource, baseResults.previousBatchGrams, unitSystem),
      advice: yogurtAdvice(cultureType, firstPassTemp, milk.fatLevel, preHeatEnabled, preset.thickness, baseResults.incubationHours, unitSystem),
      nutrition,
      incubationTempC: firstPassTemp,
    };
  }

  // Mesophilic on the forecast: re-read the forecast over the actual incubation.
  const finalTemp = forecast(baseResults.incubationHours / 24);
  const incubation = estimateIncubation(finalTemp, cultureType, preset.typicalHours, preset.tempMaxC);
  const yield_ = estimateYield(litres, preset.thickness);
  const results: YogurtResults = {
    ...baseResults,
    incubationHours: incubation.hours,
    incubationHoursMin: incubation.hoursMin,
    incubationHoursMax: incubation.hoursMax,
    estimatedYieldGrams: yield_.estimatedYieldGrams,
    estimatedYieldLitres: yield_.estimatedYieldLitres,
    estimatedServings: yield_.estimatedServings,
    tempCapped: incubation.tempCapped,
  };
  return {
    ok: true,
    results,
    timeline: buildYogurtTimeline(results.incubationHours, cultureType, preset.thickness, preHeatEnabled, starterSource, results.previousBatchGrams, unitSystem),
    advice: yogurtAdvice(cultureType, finalTemp, milk.fatLevel, preHeatEnabled, preset.thickness, results.incubationHours, unitSystem),
    nutrition,
    incubationTempC: finalTemp,
  };
}
