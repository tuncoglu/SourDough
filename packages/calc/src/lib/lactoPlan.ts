/**
 * Lacto-ferment: everything the ferment page shows, as one pure function.
 *
 * The page calculates live, so this runs on every input change. It has no
 * side effects: recording the ferment in the history is the caller's job (and
 * is debounced there), never done from here. No React or storage imports.
 *
 * Temperature: the forecast is the OUTDOOR temperature, and a jar on a kitchen
 * counter sits warmer, so a temperature the user has set (Settings) always
 * wins over it, in both passes.
 */
import type { VegCombo } from '../data/fermentPresets';
import type { VegEntry } from '../data/vegetables';
import type {
  FermentInputs,
  FermentMethod,
  FermentPreset,
  FermentResults,
  FermentType,
  HourlyPoint,
  LactoDayPoint,
  PrepSize,
  SaltCrystal,
  UnitSystem,
  WaterHardness,
} from '../models/types';
import {
  acidBalanceVerdict,
  buildLactoTimeline,
  computeFermentTemp,
  estimateFermentTiming,
  lactoAdvice,
  runLactoCalculations,
  waterHardnessFermentAdvice,
  type FermentTiming,
  type FermentTimingInput,
} from './lactoCalculations';
import {
  comboReferenceSpeed,
  effectivePrepSize,
  presetReferenceSpeed,
  recommendedSaltPct,
  relativeVegSpeed,
} from './fermentSetup';

/** The vegetable, or the weighted mix of vegetables, being fermented. */
export type LactoVeg = VegEntry & { releaseFactor: number };

export interface LactoPlanInput {
  fermentType: FermentType;
  method: FermentMethod;
  preset: FermentPreset;
  /** The curated combo currently loaded, if any. */
  combo: VegCombo | null;
  veg: LactoVeg;
  isMultiVeg: boolean;
  totalMixGrams: number;
  /** As typed (may be empty or invalid while the user is editing). */
  vegWeight: string;
  waterAmount: string;
  saltPct: string;
  saltType: SaltCrystal;
  prepSize: PrepSize;
  useStarter: boolean;
  hourlyForecast: HourlyPoint[] | null;
  currentTemp: number | null;
  /** The user's own jar temperature (°C). Zero or less means "use the forecast". */
  fermTempOverride: number;
  hardness: WaterHardness;
  unitSystem: UnitSystem;
}

export interface LactoPlanReady {
  ok: true;
  results: FermentResults;
  timing: FermentTiming;
  timeline: LactoDayPoint[];
  advice: string[];
  waterAdvice: string[];
  /** The temperature the final estimate was made at (°C). */
  tempC: number;
}

export type LactoPlan = LactoPlanReady | { ok: false; error: string };

export function planLacto(input: LactoPlanInput): LactoPlan {
  const { method, preset, combo, veg, unitSystem } = input;
  const vegW = input.isMultiVeg ? input.totalMixGrams : (parseFloat(input.vegWeight) || 0);
  const waterW = parseFloat(input.waterAmount) || 0;
  const salt = parseFloat(input.saltPct);

  if (vegW <= 0) {
    return {
      ok: false,
      error: input.isMultiVeg
        ? 'Enter grams for at least one vegetable.'
        : 'Enter a weight for the vegetables.',
    };
  }
  if (method === 'brine' && waterW <= 0) {
    return { ok: false, error: 'Enter the amount of water for your brine.' };
  }
  if (Number.isNaN(salt) || salt <= 0) {
    return { ok: false, error: 'Enter a salt percentage greater than 0.' };
  }

  const useOverride = input.fermTempOverride > 0;
  const forecastTemp = (days: number) =>
    computeFermentTemp(input.hourlyForecast, input.currentTemp, days, unitSystem).effectiveTemp;

  const baseInputs: FermentInputs = {
    fermentType: input.fermentType,
    method,
    vegWeight: vegW,
    waterAmount: waterW,
    saltPct: salt,
    saltType: input.saltType,
    ambientTemp: useOverride ? input.fermTempOverride : forecastTemp(14),
  };

  // Timing: the recipe's own documented duration is the anchor; the user's
  // kitchen moves it. Temperature comes from the user or the forecast, salt
  // from the input, water hardness from detection/settings (only for
  // ferments that actually use added water), vegetables from the mix.
  const typicalDays = combo?.typicalDays ?? preset.typicalDays;
  const referencePrep = combo?.referencePrep ?? preset.referencePrep;
  const referenceSpeed = combo ? comboReferenceSpeed(combo) : presetReferenceSpeed(preset);
  const timingInput: FermentTimingInput = {
    typicalDays,
    vegSpeedRatio: relativeVegSpeed(veg.speedFactor, referenceSpeed),
    saltPct: salt,
    // The recipe's own salt level: a combo's, or what we recommend for these
    // vegetables. Keeps "as written" exactly on its documented days.
    recipeSaltPct: combo?.typicalSaltPct ?? recommendedSaltPct(veg, method),
    prepSize: effectivePrepSize(method, referencePrep, input.prepSize),
    referencePrep,
    starter: input.useStarter,
    hardnessMgL: input.hardness.mgL,
    usesAddedWater: method === 'brine' && waterW > 0,
    unitSystem,
  };

  const baseResults = runLactoCalculations(baseInputs, veg.waterContentPct, timingInput, veg.releaseFactor);

  // Now read the forecast over the estimated duration; a set temperature wins.
  const tempC = useOverride ? input.fermTempOverride : forecastTemp(baseResults.estimatedDays);
  const timing = estimateFermentTiming(tempC, timingInput);
  const results: FermentResults = {
    ...baseResults,
    estimatedDays: timing.days,
    estimatedDaysMin: timing.daysMin,
    estimatedDaysMax: timing.daysMax,
    tempCapped: timing.stalled,
  };

  const style = combo ?? preset;
  return {
    ok: true,
    results,
    timing,
    timeline: buildLactoTimeline(results.estimatedDays, method),
    advice: lactoAdvice(
      method, salt, tempC, results.estimatedDays, unitSystem,
      veg.name,
      { min: style.saltPctMin, max: style.saltPctMax },
      input.prepSize,
      style.referencePrep,
      acidBalanceVerdict(veg),
      input.useStarter,
      !!veg.bloaterProne,
    ),
    waterAdvice: waterHardnessFermentAdvice(input.hardness),
    tempC,
  };
}
