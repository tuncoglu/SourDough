/**
 * Lazy sourdough: the numbers behind the bread page, as pure functions.
 *
 * Shared by the page (bread.tsx) and the Ask the baker Cloudflare Function
 * (functions/api/assist.ts), so the page and the assistant can never disagree
 * about a rise time or a weight. No React or React Native imports: the
 * Function bundles this file directly.
 */
import { runAllCalculations } from './calculations';
import { buildBlendFromRows, buildFlourTypeLabel, getBlendProtein } from './blendUtils';
import { findFlour } from './flourSearch';
import { LAZY_BAKE, lazyProofHours, type LazyStep, type LazyVessel } from './lazyMethod';
import {
  DEFAULT_SETTINGS,
  type CalculationResults,
  type FlourEntry,
  type HourlyPoint,
  type UnitSystem,
  type WaterHardness,
} from '../models/types';

/** The lazy method takes the starter straight from the fridge. */
export const LAZY_STARTER_TEMP_C = 4;

// ── estimateLazyLoaf ────────────────────────────────────────────────────

export interface LazyLoafInput {
  flourGrams: number;       // > 0
  waterPct: number;         // > 0, % of flour
  starterPct: number;       // > 0, % of flour
  saltPct: number;          // >= 0, % of all flour incl. starter's (engine convention)
  starterHydration: number; // > 0, default 100
  roomTempC: number;
  flourTempC?: number;      // default = roomTempC
  waterTempC?: number;      // default = roomTempC
  starterTempC?: number;    // default 4 (straight from the fridge)
  /** The bowl flour. Default: the app's default flour. */
  flour?: FlourEntry;
  /** A blend of bowl flours (weights in grams, summing to flourGrams). Wins over `flour`. */
  flours?: { flour: FlourEntry; grams: number }[];
}

export interface LazyLoafEstimate {
  bulkHours: number;   // rise, from the engine
  proofHours: number;  // lazyProofHours(bulkHours)
  waterGrams: number;
  starterGrams: number;
  saltGrams: number;
  doughGrams: number;
  results: CalculationResults; // full engine output, for saving
}

const finite = (n: number | undefined): n is number => typeof n === 'number' && Number.isFinite(n);

/**
 * Weights and the rise estimate for one lazy loaf.
 * Returns null when the input is invalid or the engine throws.
 */
export function estimateLazyLoaf(
  input: LazyLoafInput,
  hourlyForecast: HourlyPoint[] | null,
  hardness: WaterHardness,
  unitSystem: UnitSystem = 'metric',
): LazyLoafEstimate | null {
  const { flourGrams, waterPct, starterPct, saltPct, starterHydration, roomTempC } = input;
  const flourTempC = input.flourTempC ?? roomTempC;
  const waterTempC = input.waterTempC ?? roomTempC;
  const starterTempC = input.starterTempC ?? LAZY_STARTER_TEMP_C;
  if (!(flourGrams > 0) || !(waterPct > 0) || !(starterPct > 0) || !(starterHydration > 0)) return null;
  if (!finite(saltPct) || saltPct < 0) return null;
  if (![flourGrams, waterPct, starterPct, starterHydration, roomTempC, flourTempC, waterTempC, starterTempC].every(finite)) return null;

  const flour = input.flour ?? findFlour(DEFAULT_SETTINGS.defaultFlourType);
  const blend = buildBlendFromRows(input.flours?.length ? input.flours : [{ flour, grams: flourGrams }]);
  const waterGrams = (flourGrams * waterPct) / 100;
  const starterGrams = (flourGrams * starterPct) / 100;
  const starterFlour = starterGrams * (100 / (100 + starterHydration));
  const totalFlour = flourGrams + starterFlour;

  let results: CalculationResults;
  try {
    results = runAllCalculations(
      {
        flourWeight: flourGrams,
        flourType: blend.length === 1 ? blend[0].label : buildFlourTypeLabel(blend),
        flourProtein: blend.length === 1 ? blend[0].protein : getBlendProtein(blend),
        flourProductNo: blend[0].productNumber,
        flourBlend: blend,
        hydration: ((waterGrams + starterGrams - starterFlour) / totalFlour) * 100,
        addedWaterGrams: waterGrams,
        starterWeight: starterGrams,
        starterHydration,
        saltPct,
        oilPct: 0,
        ambientTemp: roomTempC,
        flourTemp: flourTempC,
        waterTemp: waterTempC,
        starterTemp: starterTempC,
      },
      hourlyForecast,
      hardness,
      [],
      unitSystem,
    );
  } catch {
    return null;
  }

  const bulkHours = results.dynamicFerment?.bulkHours ?? results.staticFermentHours;
  if (!finite(bulkHours)) return null;
  const ing = results.ingredients;
  return {
    bulkHours,
    proofHours: lazyProofHours(bulkHours),
    waterGrams: ing.addedWater,
    starterGrams: ing.starterTotal,
    saltGrams: ing.salt,
    doughGrams: ing.bowlFlour + ing.addedWater + ing.starterTotal + ing.salt,
    results,
  };
}

// ── planLazyBake ────────────────────────────────────────────────────────

export type ProofMode = 'counter' | 'fridge';

export interface LazyPlanInput {
  readyAt: Date;          // when the loaf should be cool and ready to slice
  bulkHours: number;      // from estimateLazyLoaf
  proofMode: ProofMode;
  fridgeHours?: number;   // fridge only; default 12; clamped to [8, 16]
  vessel: LazyVessel;
}

export interface LazyPlanStep { key: LazyStep['key']; at: Date; }
export interface LazyPlan { mixAt: Date; steps: LazyPlanStep[]; totalHours: number; }

/** Fixed step durations, in minutes. Preheating overlaps the proof. */
export const LAZY_PLAN_MINUTES = { mix: 5, shape: 2, cool: 60 } as const;
export const FRIDGE_HOURS = { default: 12, min: 8, max: 16 } as const;

const MIN = 60_000;
const HOUR = 3_600_000;

export function clampFridgeHours(hours: number | undefined): number {
  const h = finite(hours) ? hours : FRIDGE_HOURS.default;
  return Math.min(FRIDGE_HOURS.max, Math.max(FRIDGE_HOURS.min, h));
}

/**
 * Work backwards from when the loaf should be ready to when to mix.
 * All arithmetic is on absolute time, so a DST change in between moves the
 * wall-clock times, not the durations.
 */
export function planLazyBake(input: LazyPlanInput): LazyPlan {
  const ready = input.readyAt.getTime();
  const proofHours = input.proofMode === 'fridge'
    ? clampFridgeHours(input.fridgeHours)
    : lazyProofHours(input.bulkHours);

  const coolAt = ready - LAZY_PLAN_MINUTES.cool * MIN;
  const bakeAt = coolAt - LAZY_BAKE[input.vessel].totalMinutes * MIN;
  const proofAt = bakeAt - proofHours * HOUR;
  const shapeAt = proofAt - LAZY_PLAN_MINUTES.shape * MIN;
  const riseAt = shapeAt - input.bulkHours * HOUR;
  const mixAt = riseAt - LAZY_PLAN_MINUTES.mix * MIN;

  const steps: LazyPlanStep[] = [
    { key: 'mix', at: new Date(mixAt) },
    { key: 'rise', at: new Date(riseAt) },
    { key: 'shape', at: new Date(shapeAt) },
    { key: 'proof', at: new Date(proofAt) },
    { key: 'bake', at: new Date(bakeAt) },
    { key: 'cool', at: new Date(coolAt) },
  ];
  return { mixAt: new Date(mixAt), steps, totalHours: (ready - mixAt) / HOUR };
}
