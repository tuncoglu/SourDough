/**
 * Lacto-fermentation calculations.
 *
 * Models salt requirements, brine composition, and fermentation timelines.
 *
 * Timing is anchored on each recipe's own documented duration and adjusted
 * by the conditions that actually move it: temperature (a cardinal-temperature
 * / Ratkowsky model for the LAB consortium — see labRelativeRate), salt
 * concentration, water hardness for brined ferments, and the vegetable mix.
 */
import {
  FermentInputs,
  PrepSize,
  PREP_TIME_FACTOR,
  PREP_SIZE_LABELS,
  FermentResults,
  FermentMethod,
  SaltCrystal,
  SALT_DENSITY_G_PER_TSP,
  SALT_LABELS,
  LactoDayPoint,
  HourlyPoint,
  UnitSystem,
} from '../models/types';
import { formatTemp } from './unitConversion';

// ── Physical Constants ─────────────────────────────────────────────────

/** Baseline fermentation temperature (°C). */
const BASE_TEMP = 22.0;

/**
 * Reference ferment for the whole engine: shredded cabbage, dry salted,
 * 22 °C → 7 days. Recipes state their own `typicalDays`; this constant is
 * the neutral value used by the `custom` preset and by tests.
 */
export const REFERENCE_DAYS = 7.0;

/** Minimum feasible fermentation (days) regardless of temperature. */
const MIN_DAYS = 1.0;

/** Maximum reasonable fermentation estimate (days). */
const MAX_DAYS = 60.0;

/** Target pH for well-fermented vegetables. Below 4.6 is safe from botulism; 4.0 is the typical fully-sour end point (still refrigerate for long storage — yeasts and moulds grow below 4.0). */
export const TARGET_PH = 4.0;

/** Safety pH threshold — botulism cannot grow below 4.6. */
export const SAFETY_PH = 4.6;

/** Typical final pH of a fully sour ferment (cabbage ~3.4–3.6). */
export const FINAL_PH = 3.5;

/** Starting pH of fresh vegetables. */
export const PH_START = 6.5;

/**
 * pH at which a ferment tastes ready at a given temperature.
 *
 * The sensory optimum is LESS sour in the cold: measured in kimchi, pH 4.97 at
 * 4 °C against 4.41 at 20 °C, with titratable acidity 0.59% vs 0.76% (Hong,
 * Lee, Kim & Ahn 2016, J. Food Sci. 81(11):C2623–C2629). A cold ferment
 * therefore tastes right while still reading "under-sour" against a warm
 * ferment's target — which is why the app quotes a temperature-adjusted
 * readiness pH instead of the fixed TARGET_PH.
 *
 * Linear between the two measured anchors and clamped outside them: there is
 * no data beyond 4–20 °C, and extrapolating a sensory optimum would be
 * invention.
 */
export function readinessPH(tempC: number): number {
  const COLD_T = 4, COLD_PH = 4.97;
  const WARM_T = 20, WARM_PH = 4.41;
  if (!Number.isFinite(tempC) || tempC <= COLD_T) return COLD_PH;
  if (tempC >= WARM_T) return WARM_PH;
  const f = (tempC - COLD_T) / (WARM_T - COLD_T);
  return COLD_PH + f * (WARM_PH - COLD_PH);
}

/** Shape exponent of the pH decline curve (see estimatePHAt). */
const PH_SHAPE = 1.7;

/**
 * Method slowdown — how much the salt/packing method changes the rate.
 *
 * DEPRECATED as a timing input: the mash slowdown is now part of the recipe
 * data (`typicalDays` for the hot-sauce preset and the pepper-mash combo),
 * because the method never changes independently of the recipe — there is
 * no method picker. Kept only as documentation of *why* those recipes are
 * slow (≈2.2× slower than the same peppers in brine).
 */
export const MASH_SLOWDOWN = 2.2;

// ── Salt Calculation ───────────────────────────────────────────────────

/**
 * Compute salt requirements and conversion to volume measures.
 *
 * Two methods:
 *   - dry: salt massaged into vegetable. Salt % is of vegetable weight.
 *          Vegetable water content partially dissolves the salt.
 *   - brine: salt dissolved in water. Salt % is of water weight.
 *   - mash: like dry but blended (pepper mash, etc.)
 *
 * `releaseFactor` is the fraction of the vegetable's water that actually
 * enters the brine under dry salting (0–1; see VEG_RELEASE_FACTOR in
 * vegetables.ts). It affects only the *displayed* effective salinity —
 * the salt the user measures stays saltPct of vegetable weight. A flat
 * 0.7 default overstates leafy-veg salinity — salted cabbage yields only
 * ~50–60% of its water as brine — and understates roots (carrot releases
 * ~20–40%).
 */
export function calculateFermentSalt(
  vegWeight: number,
  waterAmount: number,
  saltPct: number,
  method: FermentMethod,
  saltType: SaltCrystal,
  waterContentPct: number,
  releaseFactor: number = 0.7,
): Pick<
  FermentResults,
  'saltGrams' | 'saltTeaspoons' | 'saltTablespoons' | 'totalBrineGrams' | 'effectiveSalinity' | 'saltLabel'
> {
  const density = SALT_DENSITY_G_PER_TSP[saltType];
  const label = SALT_LABELS[saltType];

  let saltGrams: number;
  let totalBrineGrams = 0;
  let effectiveSalinity = saltPct;

  switch (method) {
    case 'brine': {
      // Salt % is of water weight (baker's percentage).
      // True salinity = salt / (water + salt) — the brine %.
      saltGrams = waterAmount * (saltPct / 100);
      totalBrineGrams = waterAmount + saltGrams;
      effectiveSalinity = totalBrineGrams > 0
        ? (saltGrams / totalBrineGrams) * 100
        : saltPct;
      break;
    }
    case 'dry': {
      // Salt % is of vegetable weight
      saltGrams = vegWeight * (saltPct / 100);
      // Effective brine salinity after veg water is released.
      // Empirical brine-yield estimates (see VEG_RELEASE_FACTOR):
      //   - Cabbage: ~50–60% (1 kg yields ~400–600 ml brine)
      //   - Carrots: 20–40% (dense, low surface area)
      //   - Kale:    30–50% (fibrous, moderate release)
      const releasedWater = vegWeight * (waterContentPct / 100) * releaseFactor;
      totalBrineGrams = releasedWater + saltGrams;
      effectiveSalinity = totalBrineGrams > 0
        ? (saltGrams / totalBrineGrams) * 100
        : saltPct;
      break;
    }
    case 'mash': {
      // Mash — same as dry but the veg is blended, so all water is available
      saltGrams = vegWeight * (saltPct / 100);
      const totalWater = vegWeight * (waterContentPct / 100);
      totalBrineGrams = totalWater + saltGrams;
      effectiveSalinity = totalBrineGrams > 0
        ? (saltGrams / totalBrineGrams) * 100
        : saltPct;
      break;
    }
    default:
      saltGrams = 0;
  }

  const teaspoons = saltGrams / density;

  return {
    saltGrams: Math.round(saltGrams * 10) / 10,
    saltTeaspoons: Math.round(teaspoons * 100) / 100,
    saltTablespoons: Math.round((teaspoons / 3) * 100) / 100,
    totalBrineGrams: Math.round(totalBrineGrams * 10) / 10,
    effectiveSalinity: Math.round(effectiveSalinity * 10) / 10,
    saltLabel: label,
  };
}

// ── Fermentation Timeline ──────────────────────────────────────────────

/**
 * Rate model.
 *
 * A recipe states how long it takes at the reference conditions (22 °C, its
 * own vegetables, its own salt level, the app's reference water hardness).
 * Everything the user's kitchen does differently is applied as a *duration
 * multiplier* around that anchor:
 *
 *   days = typicalDays × temperatureFactor × saltFactor × waterFactor × vegFactor
 *
 * Every factor is exactly 1 under the recipe's own reference conditions, so a
 * recipe used as written still returns precisely its documented number —
 * while a cool kitchen, a heavy salt hand, soft water or a faster vegetable
 * all move it. `estimateFermentTiming` returns the factors alongside the
 * result so the UI can show what moved the number instead of asserting it.
 */

/** Small numeric clamp helper. */
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Cardinal temperatures for the ferment, from the published CTMI fit for
 * Lactiplantibacillus plantarum in a food matrix (not broth):
 * Matejčeková, Spodniaková, Dujmić, Liptáková & Valík (2019),
 * J. Food Nutr. Res. 58(2):125–134 — Tmin 5.4 °C, Topt 34.2 °C, Tmax 41.4 °C.
 *
 * These describe the organism that FINISHES the ferment, which is what this
 * model predicts the endpoint of. It is deliberately not the cold-tolerant
 * first phase: Leuconostoc mesenteroides still grows at 4 °C and below
 * (Lee et al. 2012 measured full growth at −2.5 °C) and Latilactobacillus
 * sakei can finish kimchi in the cold, which is why a cold jar keeps
 * changing. But the organism that takes a vegetable to full sourness is
 * arrested near 5 °C, so "time to fully sour" genuinely diverges there —
 * the two-phase stall the cold warning describes.
 */
export const LAB_CARDINAL = {
  tMin: 5.4,
  tOpt: 34.2,
  tMax: 41.4,
} as const;

/** Below this relative rate the ferment is not expected to complete. */
export const STALL_RELATIVE_RATE = 0.05;

/** Days a starter culture saves at the 22 °C reference (see estimateFermentTiming). */
export const STARTER_LAG_SAVING_DAYS = 2.0;

/** A starter may never account for more than this share of the estimate. */
export const STARTER_MAX_SHARE = 0.33;

/**
 * Cardinal Temperature Model with Inflection (Rosso, Lobry, Bajard &
 * Flandrois 1993, J. Theor. Biol. 162:447–463) — the standard shape in
 * predictive microbiology for LAB, and the model both Di Biase et al. (2022)
 * and Matejčeková et al. (2019) fit to lactic acid bacteria.
 *
 *   gamma(T) = (T − Tmax)(T − Tmin)² /
 *              (Topt − Tmin)[(Topt − Tmin)(T − Topt) − (Topt − Tmax)(Topt + Tmin − 2T)]
 *
 * gamma(Topt) = 1 and gamma → 0 at both cardinal limits.
 */
function ctmiShape(temp: number): number {
  const { tMin, tOpt, tMax } = LAB_CARDINAL;
  if (temp <= tMin || temp >= tMax) return 0;
  const numerator = (temp - tMax) * Math.pow(temp - tMin, 2);
  const denominator = (tOpt - tMin) *
    ((tOpt - tMin) * (temp - tOpt) - (tOpt - tMax) * (tOpt + tMin - 2 * temp));
  return numerator / denominator;
}

/** Rate at the 22 °C reference, used to normalise the curve. */
const REFERENCE_RATE = ctmiShape(BASE_TEMP);

/**
 * Temperature response of the ferment as a rate relative to 22 °C.
 *
 * Replaces a pure Q10 curve — a local approximation with no cardinal limits,
 * which failed at both ends of the range:
 *
 *   - cold: extrapolated forever, so a 2 °C fridge "finished" a 10-day
 *     ferment in 60 days, and a 16 °C kitchen came out only 1.73× slower when
 *     three independent measurements put the real ratio at 2.2–2.7×
 *     (Parmele et al. 1927 sauerkraut field data 2.21; Matejčeková et al.
 *     2019, μ in milk 2.22 and in broth 2.73; Laureys et al. 2022 put the
 *     Q10 of LAB acid production at 2.64 [2.30–3.04]);
 *   - hot: kept accelerating and still returned ≈10 days at 45 °C, where LAB
 *     cannot grow at all and the ferment fails instead of finishing.
 *
 * On this curve: 16 °C ×2.30, 10 °C ×11.7, 28 °C ×0.60, 34 °C ×0.48 (peak),
 * 40 °C ×1.03, and no fermentation at or above 41.4 °C.
 *
 * WHY THERE IS NO SEPARATE LAG TERM. Predictive microbiology normally splits
 * a fermentation into lag + acidification, because the lag is more
 * temperature-sensitive than the growth rate (measured λ: 35.6 h at 12 °C vs
 * 2.6 h at 30 °C). Adding one here would DOUBLE-COUNT: this curve is
 * calibrated so that a recipe returns its documented days at 22 °C and is
 * then checked against measured TOTAL times to a given acidity — Parmele et
 * al. (1927) put 22→16 °C at 2.21×, and the curve returns 2.30×. Those totals
 * already contain the lag. The lag is modelled explicitly only where a
 * measurement isolates it: the starter-culture term below.
 *
 * WHY THERE IS NO PER-PRODUCT TEMPERATURE CURVE. Cucumbers look much less
 * temperature-sensitive than cabbage in one controlled study (21 → 32 °C moved
 * time-to-maximal-acidity by only ~2 days), but that protocol used 5.4–5.6%
 * brine and a pure-culture inoculum, so salt — not temperature — plausibly
 * dominates it; the older field data for cucumbers (~3× across 17 °C) does not
 * agree. With the primary sources in conflict, one curve is used for all
 * vegetables and the disagreement is reported rather than papered over.
 */
export function labRelativeRate(temp: number): number {
  return ctmiShape(temp) / REFERENCE_RATE;
}

/** True when the temperature is outside the band where the ferment completes. */
export function isStalled(temp: number): boolean {
  return labRelativeRate(temp) < STALL_RELATIVE_RATE;
}

/**
 * Invert labRelativeRate on its rising branch: the constant temperature that
 * ferments at the given mean relative rate. Used to report a single
 * "effective temperature" for a fluctuating forecast.
 */
export function effectiveTemperatureForRate(meanRate: number): number {
  let lo: number = LAB_CARDINAL.tMin + 0.01;
  let hi: number = LAB_CARDINAL.tOpt;
  if (meanRate >= labRelativeRate(hi)) return hi;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (labRelativeRate(mid) < meanRate) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Duration multiplier from temperature — the reciprocal of the rate. */
export function temperatureTimeFactor(temp: number): number {
  const rate = labRelativeRate(temp);
  if (rate <= 0) return Number.POSITIVE_INFINITY;
  return 1 / rate;
}

/** Water hardness (mg/L CaCO₃) the recipes are written around. */
export const REFERENCE_HARDNESS_MGL = 120;

/**
 * Salt optimum — BCCDC's fermentation guidance puts the target at 2.25% and
 * notes that above ~3.5% NaCl becomes "detrimental to Leuconostoc"; Yang et
 * al. (2020, J. Appl. Microbiol. 129:1458) measured the fastest pH drop and
 * acid accumulation at 2.5%, with BOTH 0.5% and 3.5% slower.
 */
export const SALT_OPTIMUM_PCT = 2.25;

/**
 * The flat bottom of the curve. Salt is a selector across this band, not a
 * brake: a shredded/whole × 1.8–3% salt × 18/22 °C factorial found salt not
 * significant within a cabbage type (Niksic et al. 2005), and BCCDC's
 * guidance gives 0.7–3% as the working range with 2.25% optimal. Penalising
 * 2% against a notional 2.25% optimum would be false precision — and would
 * mark the single most classic ferment in the app as mis-salted.
 */
const SALT_FLAT_MIN_PCT = 1.5;
const SALT_FLAT_MAX_PCT = 2.75;

/** Above this, the penalty steepens sharply (Xiong 2016: onset 24 h at 2%,
 *  36 h at 5%, 72 h at 8% — a 3× delay). */
const SALT_STEEP_ABOVE_PCT = 5.0;

/** Around 10% NaCl fermentation effectively stops. */
const SALT_STOP_PCT = 10.0;

/**
 * Duration multiplier from salt concentration — U-shaped, not monotonic.
 *
 * The evidence does not support a single slope:
 *   - LOW salt is SLOWER, not faster. Acidification is fastest near 2.5% and
 *     falls off on both sides (Yang 2020); a low-salt jar also lets
 *     Enterobacteriaceae and Pseudomonads persist far longer (Eilers et al.
 *     2026 found Leuconostoc only dominant by day 2 at 2.5% NaCl but day 7 at
 *     1.25%). A model that speeds up as salt falls gets the safety story
 *     exactly backwards: the slow-starting, low-salt ferment is the risky one.
 *   - The optimum-to-4% slope is ~15–27% per 1% (not the 33% the old linear
 *     term implied), steepening above 5%.
 *   - Cold ferments are more salt-sensitive still: kimchi at 5 °C takes
 *     ~1.7 / 2.6 / 3.9 weeks to pH 4.6 at 1.5 / 2.5 / 3.5% salt.
 */
/** The U-shaped penalty curve itself, as a multiplier on the optimum. */
function saltPenalty(saltPct: number): number {
  if (saltPct >= SALT_STOP_PCT) return 3.0;
  if (saltPct < SALT_FLAT_MIN_PCT) {
    // Under-selected ferments: slower, and the risky direction for spoilage.
    return clamp(1 + 0.30 * (SALT_FLAT_MIN_PCT - saltPct), 1, 1.6);
  }
  if (saltPct <= SALT_FLAT_MAX_PCT) return 1;
  // Stamer et al. (1971): generation time at 3.5% NaCl is +33–67% on a
  // no-salt control, while 2.25% is within 5–10% of it.
  if (saltPct <= 3.5) return 1 + 0.53 * (saltPct - SALT_FLAT_MAX_PCT);
  if (saltPct <= SALT_STEEP_ABOVE_PCT) return 1.4 + 0.20 * (saltPct - 3.5);
  // Above 5% the penalty grows faster than linearly (≈3× by 8%).
  return clamp(1.7 + 0.43 * (saltPct - SALT_STEEP_ABOVE_PCT), 1, 3.0);
}

/**
 * Duration multiplier from salt concentration, relative to the level the
 * recipe itself uses.
 *
 * The recipe's `typicalDays` was written for its own salt level — a 4% dilly
 * bean brine and a 2% kraut are both "as documented" — so the absolute
 * U-curve is normalised against the recipe's own point on it. Deviating from
 * the recipe then moves the estimate the way the evidence says it should:
 * less salt is slower (not faster), more salt is slower still.
 *
 * This also avoids the old bug's shape: a plain `salt/recipeSalt` ratio
 * treated 2% against a 3% recipe as a 33% speed-up, which the trials
 * contradict and which pointed the safety advice the wrong way.
 */
export function saltTimeFactor(saltPct: number, recipeSaltPct?: number): number {
  if (!(saltPct > 0)) return 1;
  const reference = recipeSaltPct && recipeSaltPct > 0 ? saltPenalty(recipeSaltPct) : 1;
  return clamp(saltPenalty(saltPct) / reference, 0.5, 3.0);
}

/** True when salt is high enough that fermentation effectively stops. */
export function saltStopsFermentation(saltPct: number): boolean {
  return saltPct >= SALT_STOP_PCT;
}

/**
 * Duration multiplier from water chemistry.
 *
 * Two corrections to the naive version of this term:
 *
 * 1. The buffer is ALKALINITY (HCO₃⁻/CO₃²⁻, meq/L), not hardness (Ca²⁺/Mg²⁺).
 *    They decouple — softened water keeps its alkalinity — and Ca²⁺/Mg²⁺ are
 *    not proton buffers in the pH 3–7 range at all. We only have hardness to
 *    work with, so it is used as a rough proxy and the effect is bounded by
 *    mass balance rather than fitted.
 * 2. The magnitude is small. A typical 60–150 mg/L as CaCO₃ supply is
 *    1.2–3 meq/L, against the ~50–120 mmol/L of acid needed just to reach
 *    pH 4.6 — on the order of 1–3% of the ferment, not 10%. No experimental
 *    study measures vegetable fermentation rate against hardness or
 *    alkalinity; this is a chemistry bound, deliberately capped at ±3%.
 *
 * Calcium's real contribution is TEXTURE (pectin cross-linking), which is not
 * a rate effect and is handled in the water advice copy instead: CaCl₂ at
 * 20–40 mM firms vegetables and ferments normally.
 */
export const HARDNESS_TIME_SLOPE = 0.0001;

export function waterHardnessTimeFactor(
  hardnessMgL: number | null | undefined,
  usesAddedWater: boolean,
): number {
  if (!usesAddedWater || hardnessMgL == null || !(hardnessMgL >= 0)) return 1;
  return clamp(1 + HARDNESS_TIME_SLOPE * (hardnessMgL - REFERENCE_HARDNESS_MGL), 0.97, 1.03);
}

export type FermentRateFactorId = 'temperature' | 'salt' | 'water' | 'vegetables' | 'prep' | 'starter';

export interface FermentRateFactor {
  id: FermentRateFactorId;
  /** Short user-facing label, e.g. "Cool room (16 °C)". */
  label: string;
  /** Duration multiplier: >1 = slower/longer, <1 = faster/shorter. */
  factor: number;
  /**
   * Additive adjustment in days (negative = saves time). The lag phase is a
   * fixed head start, not a proportional one, so effects that act on it are
   * modelled additively — see `starter`.
   */
  daysDelta?: number;
  /** One-line explanation of why this moves the estimate. */
  detail: string;
}

/** Everything the user's conditions change about a recipe's duration. */
export interface FermentTimingInput {
  /** Days at the reference conditions, as the recipe documents. */
  typicalDays: number;
  /** Rate of the actual vegetable mix vs the recipe's reference (1 = same). */
  vegSpeedRatio?: number;
  /**
   * Salt % the user set, in the recipe's own dosing convention (of vegetable
   * weight for dry/mash, of water for brine).
   */
  saltPct?: number;
  /**
   * The salt % the recipe is written with — the point its `typicalDays`
   * refers to, and what the salt adjustment is measured against.
   */
  recipeSaltPct?: number;
  /** Local water hardness (mg/L CaCO₃); null/undefined = unknown. */
  hardnessMgL?: number | null;
  /** True when the ferment actually uses added water (brine with water). */
  usesAddedWater?: boolean;
  /** How finely the vegetables are cut. */
  prepSize?: PrepSize;
  /** The prep size the recipe is written for (its `referencePrep`). */
  referencePrep?: PrepSize;
  /**
   * A fresh starter culture was used (commercial sachet or fresh mild brine
   * — NOT fully sour backslopped brine, which the evidence says is neutral to
   * harmful). Acts on the lag phase, so it is modelled additively.
   */
  starter?: boolean;
  unitSystem?: UnitSystem;
}

export interface FermentTiming {
  days: number;
  daysMin: number;
  daysMax: number;
  /**
   * True when the temperature is outside the band where the ferment
   * completes. The estimate is then meaningless as a plan, so surfaces
   * should show the reason instead of a number.
   */
  stalled: boolean;
  /** Why it is stalled: too cold to finish, or too hot for LAB to win. */
  stallReason: 'cold' | 'hot' | null;
  /**
   * True when the (unstalled) estimate runs past the model horizon. Cold
   * cellars are a legitimate way to ferment — Pederson & Albury found 7.5 °C
   * kraut "of superior quality" — so this is reported as "months", not as a
   * failure.
   */
  beyondHorizon: boolean;
  /** The recipe's documented duration at the reference conditions. */
  referenceDays: number;
  /** Effective temperature the estimate was computed at (°C). */
  tempC: number;
  /** Applied adjustments, temperature first, neutral ones omitted. */
  factors: FermentRateFactor[];
}

/**
 * Estimate a ferment's duration for the user's actual conditions, with the
 * reasoning attached.
 *
 * This is the only entry point for timing: it composes the recipe anchor
 * (`typicalDays`) with the temperature, salt, water-hardness and vegetable
 * adjustments, and reports each one so the UI can show its work.
 */
export function estimateFermentTiming(
  tempC: number,
  input: FermentTimingInput,
): FermentTiming {
  const unit = input.unitSystem ?? 'metric';
  const typicalDays = Math.max(0.1, input.typicalDays);

  const tempFactor = temperatureTimeFactor(tempC);
  const saltFactor = saltTimeFactor(input.saltPct ?? 0, input.recipeSaltPct);
  const waterFactor = waterHardnessTimeFactor(input.hardnessMgL, input.usesAddedWater ?? false);
  const vegFactor = input.vegSpeedRatio && input.vegSpeedRatio > 0 ? 1 / input.vegSpeedRatio : 1;
  // Prep: measured against what the recipe is written for, so a recipe used
  // as documented is exactly 1.0 — see PREP_TIME_FACTOR for the evidence.
  const prepFactor = input.prepSize && input.referencePrep
    ? PREP_TIME_FACTOR[input.prepSize] / PREP_TIME_FACTOR[input.referencePrep]
    : 1;

  /**
   * Starter cultures act on the LAG phase — the slow, risky start while the
   * spontaneous flora establishes itself — not on the acidification rate
   * that follows. Measured: pH below 4.0 within 24 h with a starter against
   * ~3 days spontaneous (Müller et al. 2018, Food Microbiol. 76:473), which
   * is a fixed saving of roughly a day or two rather than a percentage.
   *
   * The endpoint evidence is genuinely mixed — Beganović et al. (2011) saw
   * whole-head cabbage finish 14 days sooner, Zhao et al. (2026) 9–14 d → 4–7 d,
   * but Liu et al. (2024) found no endpoint difference across 15 commercial
   * sauerkrauts. So this is bounded: never more than a third of the estimate.
   */
  const starterSaving = input.starter
    ? Math.min(STARTER_LAG_SAVING_DAYS * tempFactor, typicalDays * STARTER_MAX_SHARE)
    : 0;

  // The effective temperature is forecast-integrated, so it is rarely a round
  // number — show a decimal, or the label contradicts the multiplier.
  const atReference = Math.abs(tempC - BASE_TEMP) < 0.05;
  const factors: FermentRateFactor[] = [{
    id: 'temperature',
    label: atReference
      ? `${formatTemp(BASE_TEMP, unit, 0)} (reference)`
      : `${tempC < BASE_TEMP ? 'Cool' : 'Warm'} ${formatTemp(tempC, unit, 1)}`,
    factor: tempFactor,
    detail: atReference
      ? 'Recipes are written at 22 °C — no temperature adjustment.'
      : `LAB grow between about ${LAB_CARDINAL.tMin} °C and ${LAB_CARDINAL.tMax} °C and are `
        + `fastest near ${LAB_CARDINAL.tOpt} °C (cardinal-temperature model), so a `
        + `${tempC < BASE_TEMP ? 'cooler' : 'warmer'} room ferments `
        + `${tempC < BASE_TEMP ? 'more slowly' : 'faster'}.`,
  }];

  if (Math.abs(saltFactor - 1) >= 0.01) {
    const above = (input.saltPct ?? 0) > SALT_FLAT_MAX_PCT;
    factors.push({
      id: 'salt',
      label: `Salt ${input.saltPct}% (${above ? 'above' : 'below'} the ${SALT_FLAT_MIN_PCT}–${SALT_FLAT_MAX_PCT}% band)`,
      factor: saltFactor,
      detail: above
        ? 'Salt above the optimum extends the lag phase and favours osmotolerant LAB; past '
          + 'about 5% it slows sharply, and near 10% fermentation stops.'
        : 'Below the optimum the ferment is SLOWER, not faster: weak salting lets spoilage '
          + 'organisms persist and delays the LAB takeover, and it removes the safety margin.',
    });
  }

  if (Math.abs(waterFactor - 1) >= 0.01) {
    factors.push({
      id: 'water',
      label: `${input.hardnessMgL! < REFERENCE_HARDNESS_MGL ? 'Soft' : 'Hard'} water `
        + `(${Math.round(input.hardnessMgL!)} mg/L)`,
      factor: waterFactor,
      detail: 'Carbonate hardness buffers lactic acid (and calcium firms pectin), so harder water '
        + 'sours a little more slowly. Capped at ±10% — hardness matters far more for texture.',
    });
  }

  if (Math.abs(prepFactor - 1) >= 0.01) {
    factors.push({
      id: 'prep',
      label: prepFactor > 1
        ? `Cut coarser than the recipe (${PREP_SIZE_LABELS[input.prepSize!]})`
        : `Cut finer than the recipe (${PREP_SIZE_LABELS[input.prepSize!]})`,
      factor: prepFactor,
      detail: 'Sugar has to diffuse out of the tissue before LAB can use it, so surface area '
        + 'sets the pace of the early phase: shredded cabbage finishes in about 15 days against '
        + '28 for whole heads (Niksic et al. 2005).',
    });
  }

  if (Math.abs(vegFactor - 1) >= 0.01) {
    factors.push({
      id: 'vegetables',
      label: vegFactor < 1
        ? 'Faster vegetables than the recipe (heuristic)'
        : 'Slower vegetables than the recipe (heuristic)',
      factor: vegFactor,
      detail: 'Substrate adjustment from an internal per-vegetable ranking. No study measures '
        + 'time-to-target-pH across these vegetables under one protocol, so treat it as a rough '
        + 'direction rather than a measurement — the ±40% range around the estimate is the honest '
        + 'uncertainty.',
    });
  }

  if (starterSaving > 0) {
    factors.push({
      id: 'starter',
      label: 'Starter culture',
      factor: 1, // additive, not proportional — see daysDelta
      daysDelta: -starterSaving,
      detail: 'A starter skips most of the lag phase — the days the spontaneous flora spends '
        + 'establishing itself. It shortens the START; the evidence on the final endpoint is '
        + 'mixed, so the saving is capped.',
    });
  }

  // Multiplicative factors only — the additive starter term is applied after.
  const combined = factors.reduce((product, f) => (f.daysDelta ? product : product * f.factor), 1);
  const days = Math.max(MIN_DAYS, typicalDays * combined - starterSaving);
  const stalled = isStalled(tempC);
  const stallReason: 'cold' | 'hot' | null = !stalled
    ? null
    : tempC <= LAB_CARDINAL.tOpt ? 'cold' : 'hot';
  const beyondHorizon = !stalled && days > MAX_DAYS;

  return {
    days: clampDays(days),
    daysMin: clampDays(days * 0.6),
    daysMax: clampDays(days * 1.4),
    stalled,
    stallReason,
    beyondHorizon,
    referenceDays: typicalDays,
    tempC: tempC,
    factors,
  };
}

/** Round an estimate the way every timing surface displays it. */
function clampDays(d: number): number {
  return Math.round(Math.min(MAX_DAYS, Math.max(MIN_DAYS, d)) * 10) / 10;
}

// ── Day-by-Day Timeline ────────────────────────────────────────────────

/**
 * Estimated pH at a given fermentation progress fraction (0 = start,
 * 1 = complete). Models the real trajectory: pH drops fast in the first
 * days, then slows as LAB activity plateaus.
 *
 * Calibrated to measured sauerkraut at ~2% salt, 22°C (day 2 ≈ 5.0–5.5,
 * day 3–4 ≈ 4.0–4.5, final 3.4–3.6): with a 7-day ferment this gives
 * pH(0.3) ≈ 5.2, pH(0.5) ≈ 4.4, pH(0.75) ≈ 3.8, pH(1) = 3.5.
 * Previously a linear 6.5→4.0 model ran 0.5–1.0 pH units too high at
 * every milestone and ended 0.5 units above the true final acidity.
 */
export function estimatePHAt(progress: number): number {
  const x = Math.min(1, Math.max(0, progress));
  return FINAL_PH + (PH_START - FINAL_PH) * Math.pow(1 - x, PH_SHAPE);
}

/**
 * Build a day-by-day fermentation guide.
 *
 * Models pH drop along a decelerating curve from ~6.5 to FINAL_PH (~3.5),
 * overlaying practical milestones for each phase. TARGET_PH (4.0) remains
 * the shelf-stable threshold referenced in safety copy.
 */
export function buildLactoTimeline(estimatedDays: number, method: FermentMethod): LactoDayPoint[] {
  const points: LactoDayPoint[] = [];
  const totalDays = Math.ceil(estimatedDays);

  // Start day
  points.push({
    day: 0,
    label: 'Day 0 — Start',
    description: method === 'brine'
      ? 'Vegetables submerged in brine. Everything should stay below the surface.'
      : 'Salt mixed in. Pack tightly and apply a weight.',
  });

  // Day 1 — lag phase: Enterobacteriaceae fade, Leuconostoc wakes up
  if (totalDays >= 1) {
    points.push({
      day: 1,
      label: 'Day 1 — Lag Phase',
      description: 'Enterobacteriaceae from the vegetable surface fade as salt and anaerobic conditions take hold. Leuconostoc mesenteroides begins to wake up. Few visible changes. Keep at room temp, away from direct sun.',
    });
  }

  // Day ~25% — early activity: Leuconostoc & Weissella dominate
  const earlyDay = Math.max(2, Math.round(totalDays * 0.25));
  if (earlyDay < totalDays && earlyDay > 1) {
    points.push({
      day: earlyDay,
      label: `Day ${earlyDay} — Leuconostoc Phase`,
      description: 'Bubbles appearing — CO₂ from heterofermentative Leuconostoc mesenteroides and Weissella species. Brine becomes cloudy (bacterial bloom — good!). A thin white film (kahm yeast, often Kazachstania) is harmless; scoop it off. Fuzzy mould = discard.',
    });
  }

  // ~50% — half fermented: transition to L. plantarum
  const midDay = Math.round(totalDays * 0.5);
  if (midDay > earlyDay && midDay < totalDays) {
    points.push({
      day: midDay,
      label: `Day ${midDay} — L. plantarum Takes Over`,
      description: `pH dropping (approaching ~${estimatePHAt(0.5).toFixed(1)}). Leuconostoc fades as acid-tolerant Lactiplantibacillus plantarum becomes dominant. Taste it — should be tangy but not fully sour yet.`,
    });
  }

  // ~75% — nearly done: L. plantarum & Pediococcus
  const lateDay = Math.round(totalDays * 0.75);
  if (lateDay > midDay && lateDay < totalDays) {
    points.push({
      day: lateDay,
      label: `Day ${lateDay} — Nearly Ready`,
      description: `pH approaching ~${estimatePHAt(0.75).toFixed(1)}. L. plantarum and Pediococcus dominate. Taste: should be pleasantly sour. If you like it now, move to the fridge. For more complexity, give it a few more days — cold maturation develops deeper flavour.`,
    });
  }

  // Final day — the recipe's own duration, i.e. "safe and ready to
  // refrigerate". Deliberately not framed as a universal final pH: the pH a
  // ferment stops at is substrate-specific (kimchi is eaten around 4.2–4.5,
  // kraut runs to 3.4–3.6), and reaching pH 4.0 is only ~25–40% of the sugar
  // — a deeper sour is a later, separate date.
  points.push({
    day: totalDays,
    label: `Day ${totalDays} — Ready for Cold Storage`,
    description: `Safely below the ${SAFETY_PH} botulism threshold and sour enough to eat — move it to cold storage (fridge or cellar). This is not the end of the ferment: it keeps souring slowly in the cold, and postbiotic compounds (GABA, phenyl-lactic acid, indole-3-lactic acid) continue to develop for weeks. Leave it longer for a sharper, deeper sour.`,
  });

  return points;
}

// ── Full Calculation Pipeline ──────────────────────────────────────────

export function runLactoCalculations(
  inputs: FermentInputs,
  waterContentPct: number = 90,
  timing: FermentTimingInput = { typicalDays: REFERENCE_DAYS },
  releaseFactor: number = 0.7,
): FermentResults {
  const salt = calculateFermentSalt(
    inputs.vegWeight,
    inputs.waterAmount,
    inputs.saltPct,
    inputs.method,
    inputs.saltType,
    waterContentPct,
    releaseFactor,
  );

  const duration = estimateFermentTiming(inputs.ambientTemp, timing);

  const brineLabel =
    inputs.method === 'brine'
      ? `${inputs.saltPct.toFixed(1)}% brine`
      : inputs.method === 'dry'
        ? 'Dry salt (self-brining)'
        : 'Mash (self-brining)';

  return {
    saltGrams: salt.saltGrams,
    saltTeaspoons: salt.saltTeaspoons,
    saltTablespoons: salt.saltTablespoons,
    totalBrineGrams: salt.totalBrineGrams,
    effectiveSalinity: salt.effectiveSalinity,
    estimatedDays: duration.days,
    estimatedDaysMin: duration.daysMin,
    estimatedDaysMax: duration.daysMax,
    tempCapped: duration.stalled,
    targetPH: TARGET_PH,
    brineStrengthDisplay: brineLabel,
    saltLabel: salt.saltLabel,
  };
}

// ── Safety Advice ──────────────────────────────────────────────────────

export function lactoAdvice(
  method: FermentMethod,
  saltPct: number,
  temp: number,
  estimatedDays: number,
  unitSystem: UnitSystem = 'metric',
  /** Name of the vegetable or mix, for vegetable-specific advice. */
  vegName: string = 'This vegetable',
  /** Salt % range this style is normally made with (drives the level advice). */
  saltRange?: { min: number; max: number },
  /** How the user cut the vegetables, vs what the recipe assumes. */
  prepSize?: PrepSize,
  referencePrep?: PrepSize,
  /** Acid balance of the vegetable actually being fermented. */
  acidBalance?: AcidBalanceVerdict,
  /** True when a starter culture was used. */
  usedStarter?: boolean,
  /** Cucumber-family vegetable (prone to CO₂ bloater damage when warm). */
  bloaterProne?: boolean,
): string[] {
  const tips: string[] = [];
  const t = formatTemp(temp, unitSystem, 0);

  // Salt level guidance — updated per 2024–2026 research
  if (saltPct < 1.5) {
    tips.push(`⚠️ Salt is very low at ${saltPct}%. Research shows 0.8–1.5% can work (maximises probiotics & polyphenols), but the safety margin is razor-thin — enteric bacteria may not be suppressed. Consider ≥1.5% for safety.`);
  } else if (saltPct < 2.0) {
    tips.push(`💡 Salt is moderate-low at ${saltPct}%. 2024 research shows 1.0–1.5% retains more polyphenols and probiotics, but below 2% requires extra care — check daily and keep everything submerged.`);
  } else if (saltPct > 5.0) {
    tips.push(`🧂 Salt is high at ${saltPct}%. Fermentation will be very slow — beneficial LAB are inhibited above 5%. In the referenced studies, 3–5% was the sweet spot for L. plantarum dominance.`);
  }

  // Temperature guidance — thresholds follow the vegetable-fermentation
  // literature, which puts the QUALITY optimum far below the growth optimum:
  // 15–18 °C gives the best flavour, colour and ascorbic-acid retention
  // because the heterofermentative Leuconostoc phase contributes more
  // (Pederson & Albury 1969, Cornell Bulletin 824; Parmele et al. 1927).
  // Above 24 °C kraut "may become soft" (USDA AIB-539 / extension guidance),
  // and at ~32 °C it darkens and tastes of "acidified cabbage" because the
  // fermentation collapses to a pure homofermentation.
  if (isStalled(temp)) {
    tips.push(temp <= LAB_CARDINAL.tOpt
      ? `❄️ ${t} is below the range where this ferment completes. Cold-tolerant Leuconostoc keeps working, so the jar will still change slowly, but Lactiplantibacillus plantarum — the organism that takes it to full sourness — is arrested around ${LAB_CARDINAL.tMin} °C. Cold is also how you deliberately park a ferment you like; warm it to 18–24 °C if you want it to finish.`
      : `🔥 ${t} is above the range where LAB can grow (they stop near ${LAB_CARDINAL.tMax} °C). This will not ferment — yeasts, moulds and Bacillus species take over instead. Cool it below 30 °C.`);
  } else if (temp < 10) {
    tips.push(`🧊 Cold ferment (${t}) — months rather than weeks. Traditional cellars fermented at this temperature and the results are prized (Pederson & Albury rated 7.5 °C kraut "of superior quality"), but it will stall short of full sourness for a long time. Move it to 18–24 °C for a normal schedule.`);
  } else if (temp < 16) {
    tips.push(`❄️ Cool temperature (${t}) — roughly 2–3× slower than 22 °C, so expect weeks rather than days. Flavour is usually excellent at this end.`);
  } else if (temp <= 18) {
    tips.push(`✅ ${t} is the traditional cellar range — generally the best flavour, because the heterofermentative Leuconostoc phase contributes more (Pederson & Albury). It is slower than a warm room, and the optimum is interior: recent paocai work found 20 °C best for texture, with both 10 °C and 30 °C worse.`);
  } else if (bloaterProne && temp > 27) {
    tips.push(`🥒 Cucumbers bloat above ~27 °C: CO₂ trapped under the skin hollows them out. In controlled fermentations 24.5% of cucumbers bloated at 27 °C against 48.0% at 32 °C — with identical final acidity (1.30 vs 1.32%), so this is damage, not speed. Deeper brine makes it worse (12% at 9 in vs 48% at 27 in at 32 °C). Ferment these below 27 °C if you can.`);
  } else if (temp > 25) {
    tips.push(`🔥 Warm temperature (${t}) — fast, but above 25 °C quality suffers: the community shifts towards homofermentative species, giving a harsher, flatter character, softening texture and darkening. This is a spoilage/quality limit, not a safety one — acid kill of pathogens is actually FASTER warm. The only institutional temperature guidance for vegetable fermentation (BCCDC) is to stay between 10 °C and 25 °C. Check daily.`);
  } else if (temp > 22) {
    tips.push(`🌡️ Warm room temp (${t}) — a little faster, with some softening and aroma flattening above ~24 °C. Consider a variable-temperature strategy: 3 days at room temp, then the fridge for cold maturation; recent cucumber-fermentation research found this preserves texture and develops more complex aroma.`);
  }

  // Salt level, relative to the range this style is normally made with.
  if (saltPct > 0 && saltRange && saltPct > saltRange.max) {
    tips.push(`🧂 Salt is above the ${saltRange.min}–${saltRange.max}% this style usually uses. More salt slows the lag phase and selects for osmotolerant LAB, so expect a slower start; it does not add safety margin below 5%.`);
  } else if (saltPct > 0 && saltRange && saltPct < saltRange.min) {
    tips.push(`💡 Salt is below the ${saltRange.min}–${saltRange.max}% this style usually uses — it will ferment faster, but keep everything submerged and check daily.`);
  }

  // Iodised salt: the common warning is not supported by the evidence.
  tips.push('🧂 Iodised table salt is fine — in a controlled sauerkraut trial, iodine at the level in 1% iodised salt did not significantly change the LAB population or the fermentation (Müller et al. 2018, Food Microbiology 76:473–480).');

  // Method-specific
  // Readiness is temperature-dependent, and this matters most in a cellar:
  // at 12 °C the sensory optimum sits near pH 4.7, well above the 4.0
  // stability target the app quotes for warm ferments.
  if (!isStalled(temp) && temp < BASE_TEMP) {
    tips.push(`👅 Judge a cool ferment by taste, not by the clock: at ${t} it will taste ready around pH ${readinessPH(temp).toFixed(1)} — the sensory optimum is less sour in the cold (measured pH 4.97 at 4 °C against 4.41 at 20 °C), so it reads "under-sour" against a warm ferment's target while already being at its best.`);
  }

  if (method === 'dry') {
    tips.push('💧 Massage salt thoroughly into the vegetables. If no brine forms after 30 min, your veg may be old/dry — add a splash of 2% salt brine to cover.');
  }
  if (method === 'brine') {
    tips.push('🪨 Use a weight to keep everything submerged. Anything above the brine line will mould.');
  }

  if (usedStarter) {
    tips.push('🥄 Starter culture — expect a much faster start (pH below 4.0 within a day against ~3 days spontaneous). Note the evidence on the FINAL endpoint is mixed: some trials finish two weeks sooner, others find no difference, so use the estimate as the start date rather than a promise about the end.');
  }

  // Can this vegetable's own sugar reach full sourness at all?
  if (acidBalance?.acidLimited) {
    const where = acidBalance.measuredEndPH != null
      ? `, so it runs out of sugar at pH ${acidBalance.measuredEndPH.toFixed(1)}`
      : '';
    tips.push(`⚠️ ${vegName} will not reach full sourness: its own sugar supplies only ${Math.round((acidBalance.ratio ?? 0) * 100)}% of the acid its buffering consumes${where}. Safe (below ${SAFETY_PH}) and still worth eating, but noticeably milder — and no amount of extra time fixes it, because the missing ingredient is sugar. Blend it with a sweeter vegetable, or add a little sugar, if you want it properly sour.`);
  }
  if (acidBalance?.aceticTrap) {
    tips.push(`🧪 ${vegName} needs far more acetic acid than lactic acid for the same pH drop (acetic acid is only weakly dissociated at this pH). So if the ferment runs heterofermentatively — cool temperatures favour Leuconostoc — the pH will fall unusually slowly even though sugar is plentiful.`);
  }

  // Prep is the lever a fermenter controls most directly after salt.
  if (prepSize && prepSize !== referencePrep) {
    const finer = PREP_TIME_FACTOR[prepSize] < PREP_TIME_FACTOR[referencePrep ?? prepSize];
    tips.push(finer
      ? `🔪 Cutting finer than this style usually is will speed the start — sugar has to diffuse out of the tissue before LAB can use it, which is why shredded cabbage finishes in about 15 days against 28 for whole heads. Check earlier than the estimate suggests.`
      : `🔪 Cutting coarser than this style usually is will slow the start — LAB can only use sugar once it has diffused out of the tissue (shredded cabbage ~15 days vs ~28 for whole heads). Give it longer, and keep everything submerged.`);
  }

  // Oxygen and light, not temperature, are what degrade colour and vitamin C
  tips.push('🫙 Keep the jar full, everything submerged and in the dark. Ascorbate and colour are lost to oxygen and light far more than to temperature — under nitrogen, kraut juice held its vitamin C for days while an air-exposed sample was at zero within 24–48 h (Fleming 1987).');

  // Kahm yeast
  tips.push('🦠 A thin white film (kahm yeast) is harmless — typically Debaryomyces, Pichia or Candida species (Kazachstania also appears). Skim it off. Fuzzy mould = discard immediately.');

  // General safety — the "safe by" day comes from the pH curve: a 4.6
  // crossing at ~45% of the estimated timeline (calibrated to measured
  // sauerkraut, which crosses pH 4.6 around day 2–3 at 22°C).
  const safeDay = Math.round(estimatedDays * 0.45);
  const tangyDay = Math.round(estimatedDays * 0.7);
  tips.push(`🛡️ Botulism cannot grow below pH ${SAFETY_PH}. Your ferment will be safe once it\'s tangy — typically by day ${Math.max(1, safeDay)}–${tangyDay}. The pH must drop throughout the jar (inside chunks too, not just the brine). If unsure, pH strips are cheap insurance.`);

  return tips;
}

// ── Fermentation Ceiling (acid balance) ───────────────────────────────

export interface AcidBalanceVerdict {
  /** True when the vegetable's own sugar cannot supply the acid its buffering
   *  demands, so it stops short of full sourness. */
  acidLimited: boolean;
  /** pH actually reached in the measured trial (undefined when unmeasured). */
  measuredEndPH?: number;
  /** Ratio of available acid to required acid; the review's diagnostic. */
  ratio?: number;
  /** True when acetic acid would be a far weaker acidifier than lactic. */
  aceticTrap: boolean;
  /** True when no measurement exists for this vegetable. */
  unknown: boolean;
}

/**
 * Will this vegetable's own sugar take it all the way down?
 *
 * Sugar is a GATE here, not a rate: supply exceeds demand by 3–7× in most
 * vegetables, so it almost never sets the pace — but when supply falls short
 * of the acid the vegetable's buffering consumes, the ferment stops at a
 * higher pH no matter how long you wait (Little et al. 2022, J. Food Sci.
 * 87:2121–2132: measured, 3 lots per vegetable, 2% brine, 30 °C, 21 days).
 *
 * Returns `unknown` for the vegetables nobody has titrated. That is
 * deliberate: absence of data must not read as a clean bill of health.
 */
export function acidBalanceVerdict(
  veg: { acidBalance?: { acidDemandMmolL: number; sugarSupplyMmolL: number; measuredEndPH?: number; aceticDemandMmolL?: number } },
): AcidBalanceVerdict {
  const ab = veg.acidBalance;
  if (!ab) return { acidLimited: false, aceticTrap: false, unknown: true };

  const ratio = ab.sugarSupplyMmolL / ab.acidDemandMmolL;
  return {
    acidLimited: ratio < 1,
    measuredEndPH: ab.measuredEndPH,
    ratio,
    // Acetic acid is largely undissociated near pH 3, so it acidifies far
    // more weakly per mole. Green bean needs 8× as much of it as lactic.
    aceticTrap: ab.aceticDemandMmolL != null && ab.aceticDemandMmolL > 4 * ab.acidDemandMmolL,
    unknown: false,
  };
}

// ── Water Hardness Ferment Advice ─────────────────────────────────────

/**
 * Fermentation-specific water hardness advice.
 * Hard water tightens vegetable cell walls (calcium cross-links pectin),
 * keeping ferments crisp. Soft water produces softer results.
 */
export function waterHardnessFermentAdvice(hardness: { mgL: number; classification: string; note: string }): string[] {
  const tips: string[] = [];
  const { mgL, classification, note } = hardness;

  if (mgL <= 100) {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Soft water may produce softer ferments. Add a grape leaf, oak leaf, or a pinch of calcium chloride for extra crunch.');
    tips.push('   → Low mineral content means less buffering — ferments may sour slightly faster.');
  } else if (mgL <= 200) {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Good for most ferments. Balanced mineral content for texture and flavour.');
  } else if (mgL <= 300) {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Hard — calcium helps keep vegetables crisp. Ideal for cucumber pickles.');
  } else {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Hard water is excellent for crisp ferments — calcium strengthens pectin in vegetable cell walls.');
    tips.push('   → A cloudy brine is normal bacterial activity; white sediment may be calcium — also harmless.');
  }
  tips.push(`   → Source geology: ${note}.`);
  // Chlorine itself does not measurably inhibit a vegetable ferment (fresh-cut
  // produce consumes 40–180 mg/L against a 0.2–1.0 mg/L dose, so it is gone in
  // minutes). The treatment is the risk: a Campden tablet is a wine-sulfiting
  // dose, and sulfite does inhibit LAB.
  tips.push('   → If you dechlorinate with a Campden tablet, use about 1 tablet per 20 US gallons — the common "one per gallon" dose is 67–78 mg/L SO₂, a wine-sulfiting level and 13–16× above the concentration that inhibits lactic acid bacteria. The treatment can stall a ferment the chlorine would not have.');

  return tips;
}

// ── Forecast Temperature for Fermentation ─────────────────────────────

export interface DailyTempSummary {
  day: string;
  high: number;
  low: number;
  avg: number;
}

export interface FermentTempResult {
  effectiveTemp: number;
  dailyTemps: DailyTempSummary[];
  source: 'forecast' | 'current' | 'fallback' | 'manual';
  summary: string;
}

/**
 * Compute the effective fermentation temperature from an hourly forecast.
 *
 * The effective temperature is derived by integrating the Q10 rate curve
 * over the expected ferment duration — an arithmetic mean temperature is
 * systematically biased when nights are cold and days warm (12h at 10°C +
 * 12h at 34°C averages 22°C but ferments at ~1.7× the 22°C rate). The
 * returned value is the single constant temperature that produces the same
 * integrated rate, so feeding it into estimateFermentDuration is exact.
 *
 * Forecast points are bucketed by LOCAL calendar day (the API returns
 * local-naive datetimes; bucketing by UTC date would mislabel "Today" and
 * split days for users east or west of UTC). Malformed datetimes are
 * skipped instead of crashing.
 */
export function computeFermentTemp(
  hourlyForecast: HourlyPoint[] | null,
  currentTemp: number | null,
  estimatedDays: number,
  unitSystem: UnitSystem = 'metric',
): FermentTempResult {
  if (!hourlyForecast || hourlyForecast.length === 0) {
    const t = currentTemp ?? 22;
    return {
      effectiveTemp: t,
      dailyTemps: [{ day: 'Today', high: t, low: t, avg: t }],
      source: currentTemp != null ? 'current' : 'fallback',
      summary: currentTemp != null
        ? `Using current temperature: ${formatTemp(t, unitSystem, 0)}`
        : `No weather data — using default ${formatTemp(t, unitSystem, 0)}`,
    };
  }

  /** Local-calendar day key (YYYY-MM-DD) — avoids UTC-day misalignment. */
  const localDayKey = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const dayMap = new Map<string, number[]>();
  for (const point of hourlyForecast) {
    const date = new Date(point.datetime);
    if (isNaN(date.getTime())) continue; // skip malformed datetimes
    const key = localDayKey(date);
    if (!dayMap.has(key)) dayMap.set(key, []);
    dayMap.get(key)!.push(point.tempC);
  }

  if (dayMap.size === 0) {
    const t = currentTemp ?? 22;
    return {
      effectiveTemp: t,
      dailyTemps: [{ day: 'Today', high: t, low: t, avg: t }],
      source: currentTemp != null ? 'current' : 'fallback',
      summary: currentTemp != null
        ? `Using current temperature: ${formatTemp(t, unitSystem, 0)}`
        : `No weather data — using default ${formatTemp(t, unitSystem, 0)}`,
    };
  }

  const days = Array.from(dayMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const dailyTemps: DailyTempSummary[] = [];
  const allTemps: number[] = [];
  const neededDays = Math.max(1, Math.ceil(estimatedDays));

  for (let i = 0; i < neededDays; i++) {
    const dayData = i < days.length ? days[i]! : ['repeat', days[days.length - 1]![1]] as [string, number[]];
    const temps = dayData[1];
    const high = Math.round(Math.max(...temps) * 10) / 10;
    const low = Math.round(Math.min(...temps) * 10) / 10;
    const avg = Math.round((temps.reduce((s, t) => s + t, 0) / temps.length) * 10) / 10;

    const dayLabel = i === 0 ? 'Today'
      : i === 1 ? 'Tomorrow'
      : new Date(Date.now() + i * 86400000).toLocaleDateString('en-GB', { weekday: 'short' });

    dailyTemps.push({ day: dayLabel, high, low, avg });
    allTemps.push(...temps);
  }

  // Integrate the same rate law the estimate uses — the arithmetic mean is
  // biased for fluctuating temperatures, so convert via the mean RATE. The
  // effective temperature is the constant temperature with that same rate,
  // which is why feeding it back into estimateFermentTiming is exact.
  const rateSum = allTemps.reduce((sum, t) => sum + labRelativeRate(t), 0);
  const meanRate = rateSum / allTemps.length;
  const effectiveTemp = effectiveTemperatureForRate(meanRate);
  const effectiveTempRounded = Math.round(effectiveTemp * 10) / 10;
  const firstDay = dailyTemps[0]!;

  const summary = estimatedDays <= 1
    ? `Today: ${formatTemp(firstDay.high, unitSystem, 0)} / ${formatTemp(firstDay.low, unitSystem, 0)}`
    : `${formatTemp(effectiveTempRounded, unitSystem)} effective over ${estimatedDays.toFixed(1)} days (${formatTemp(firstDay.high, unitSystem, 0)} / ${formatTemp(firstDay.low, unitSystem, 0)} today)`;

  return { effectiveTemp: effectiveTempRounded, dailyTemps, source: 'forecast', summary };
}

// ── Brine Calculator Helper ────────────────────────────────────────────

/**
 * Given a jar volume (ml) and vegetable weight, estimate how much water
 * is needed to fill the remaining space for a brine ferment.
 *
 * Chopped vegetables pack at roughly 0.9 g/ml, so the veg volume is
 * weight / 0.9 rather than assuming 1 g = 1 ml (which overfills jars).
 */
export function estimateWaterForJar(
  jarVolumeMl: number,
  vegWeight: number,
  headspaceMl: number = 50,
): number {
  const vegVolumeMl = vegWeight / 0.9;
  const waterNeeded = jarVolumeMl - vegVolumeMl - headspaceMl;
  return Math.round(Math.max(0, waterNeeded));
}
