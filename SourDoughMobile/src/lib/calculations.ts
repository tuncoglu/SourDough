/**
 * Core sourdough calculations.
 * Originally ported from the retired Python optimizer.
 */
import {
  RecipeInputs,
  IngredientResults,
  DynamicFermentation,
  FermentationProfilePoint,
  HourlyPoint,
  CalculationResults,
  WaterHardness,
  FlourBlendEntry,
  RecipePreset,
} from '../models/types';
import { getTempZone } from '../models/types';
import { findFlour } from './flourSearch';
import {
  getFlourFermentFactor,
  getBlendFermentFactor,
  getBlendProtein,
  mergeBlendWithStarter,
  resolveFermentFactor,
} from './blendUtils';

// ── Physical Constants ──────────────────────────────────────────────────

/** Baseline fermentation temperature (°C) — the "standard kitchen" reference. */
const BASE_FERMENTATION_TEMP = 26.0;

/** Baseline fermentation duration (hours) at reference temp with reference
 *  inoculation (20%), hydration (70%), and white flour. */
const BASE_FERMENTATION_HOURS = 4.0;

/** Minimum feasible fermentation time (hours) regardless of conditions. */
const MIN_FERMENTATION_HOURS = 2.0;

/** Thermal time constant (hours) — how fast dough temperature drifts
 *  toward ambient. Calibrated for a typical 1–2 kg dough mass; smaller
 *  or larger masses have different thermal time constants. */
export const TAU = 1.5;

/** Q10 coefficient — fermentation rate multiplier per 10°C.
 *  Reference: bread science literature (Collar, 2003; Gisslen 9th ed.). */
export const Q10 = 2.5;

/** Reference temperature for the Q10 model (°C). */
export const T_BASE = 26.0;

/** Baseline fermentation target (hours) — the "4-hour benchmark" at 26°C. */
export const TARGET_HOURS = 4.0;

/** Integration time step for dynamic fermentation model (hours). 15 min. */
export const DT = 0.25;

/** Maximum integration steps before giving up (100h at DT=0.25 = 400 steps).
 *  Beyond this the estimate is meaningless — fermentation would take >4 days. */
const MAX_STEPS = 400;

/** Proof time ≈ 60% of bulk fermentation duration.
 *  Heuristic — the shaped loaf typically proofs faster than bulk because
 *  the dough is warmer and more active after folds. Practice ranges widely:
 *  0.25× (Forkish-style short proof) to 1.0× (Tartine-style long proof). */
export const PROOF_FRACTION = 0.6;

// ── Shared Rate Modifiers ───────────────────────────────────────────────

/**
 * Vitality factor for starter age. Triangular heuristic model:
 * 0h=0.85 → peak 1.0 at 6h → 0.7 at 24h → floor 0.65 after 24h.
 */
export function computeVitalityFactor(starterHoursSinceFed?: number): number {
  if (starterHoursSinceFed === undefined) return 1.0;
  if (starterHoursSinceFed <= 6) return 0.85 + (0.15 / 6) * starterHoursSinceFed;
  if (starterHoursSinceFed <= 24) return 1.0 - (0.3 / 18) * (starterHoursSinceFed - 6);
  return 0.65;
}

/**
 * Fermentation rate penalty for oil/fat content.
 * Fat coats gluten strands and slows yeast activity.
 */
export function computeOilRate(oilPct?: number): number {
  const oil = oilPct ?? 0;
  if (oil >= 10) return 0.85;
  if (oil >= 5) return 0.92;
  return 1.0;
}

// Flour ferment factors, blend utilities, and protein calculation
// are now in ../lib/blendUtils.ts — re-exported here for backward compat.
export {
  getFlourFermentFactor,
  getBlendFermentFactor,
  getBlendProtein,
  mergeBlendWithStarter,
} from './blendUtils';

// ── FDT Calculation ────────────────────────────────────────────────────
/**
 * Calculate Final Dough Temperature (FDT).
 *
 * When ingredient weights are provided, computes a mass- and heat-capacity-
 * weighted average. Specific heats (J/g·°C): flour ≈ 1.8, water ≈ 4.18,
 * starter ≈ 3.0. Reference: Gisslen 9th ed., Calvel "Le Goût du Pain".
 *
 * Pre-ferment flour and water contribute to dough temperature too — they
 * sit at ambient temp before mixing, so their terms use ambientTemp.
 *
 * Without weights, falls back to a simple arithmetic average for backward
 * compatibility.
 */
export function calculateFDT(
  flourTemp: number,
  waterTemp: number,
  ambientTemp: number,
  starterTemp: number,
  flourWeight?: number,
  waterWeight?: number,
  starterWeight?: number,
  prefermentFlour?: number,
  prefermentWater?: number,
): number {
  const pfFlour = prefermentFlour ?? 0;
  const pfWater = prefermentWater ?? 0;
  if (
    flourWeight !== undefined &&
    waterWeight !== undefined &&
    starterWeight !== undefined &&
    flourWeight + waterWeight + starterWeight + pfFlour + pfWater > 0
  ) {
    // Specific heats (J/g·°C)
    const CP_FLOUR = 1.8;
    const CP_WATER = 4.18;
    const CP_STARTER = 3.0;

    const numerator =
      flourWeight * CP_FLOUR * flourTemp +
      waterWeight * CP_WATER * waterTemp +
      starterWeight * CP_STARTER * starterTemp +
      pfFlour * CP_FLOUR * ambientTemp +
      pfWater * CP_WATER * ambientTemp;
    const denominator =
      flourWeight * CP_FLOUR +
      waterWeight * CP_WATER +
      starterWeight * CP_STARTER +
      pfFlour * CP_FLOUR +
      pfWater * CP_WATER;

    return numerator / denominator;
  }

  // Fallback: simple arithmetic average
  return (flourTemp + waterTemp + ambientTemp + starterTemp) / 4.0;
}

// ── Ingredient Calculator ──────────────────────────────────────────────
/**
 * Compute exact gram weights. Hydration and salt percentages apply to the
 * TRUE total flour (fresh flour + flour contributed by the starter).
 *
 * Pre-ferment (poolish or biga) is decomposed identically to starter:
 * its flour is subtracted from the bowl flour, its water from the added water.
 * Oil is added after and included in total dough weight.
 *
 * When `addedWaterGrams` is provided, it is used as the bowl water and
 * hydration % is derived from it. Otherwise, hydrationPct is used directly.
 */
export function calculateIngredients(
  freshFlour: number,
  hydrationPct: number,
  starterWeight: number,
  saltPct: number,
  starterHydration: number,
  oilPct?: number,
  preferment?: { type: 'poolish' | 'biga'; flourPct: number; hydration: number },
  addedWaterGrams?: number,
): IngredientResults {
  // Split starter into flour and water components
  const starterFlourPct = 100.0 / (100.0 + starterHydration);
  const starterWaterPct = starterHydration / (100.0 + starterHydration);
  const starterFlour = starterWeight * starterFlourPct;
  const starterWater = starterWeight * starterWaterPct;

  // True total flour = what's in the bowl + what's in the starter
  const totalFlour = freshFlour + starterFlour;

  // ═══ Pre-ferment decomposition (same logic as starter) ═══
  let prefermentFlour = 0;
  let prefermentWater = 0;
  let prefermentTotal = 0;
  if (preferment && preferment.flourPct > 0) {
    // Guard against pct > 100 which would make bowlFlour negative
    const effectivePct = Math.min(preferment.flourPct, 100);
    prefermentFlour = totalFlour * (effectivePct / 100);
    prefermentWater = prefermentFlour * (preferment.hydration / 100);
    prefermentTotal = prefermentFlour + prefermentWater;
  }

  // Bowl flour: fresh flour minus what's in the pre-ferment
  const bowlFlour = Math.max(0, freshFlour - prefermentFlour);

  // When water grams are provided directly, derive hydration from them.
  // Otherwise use the hydrationPct parameter (backward compat / tests).
  let waterTotal: number;
  let addedWater: number;
  let effectiveHydrationPct: number;
  if (addedWaterGrams !== undefined) {
    addedWater = addedWaterGrams;
    waterTotal = addedWater + starterWater + prefermentWater;
    effectiveHydrationPct = totalFlour > 0 ? (waterTotal / totalFlour) * 100 : hydrationPct;
  } else {
    waterTotal = (hydrationPct / 100.0) * totalFlour;
    addedWater = Math.max(0, waterTotal - starterWater - prefermentWater);
    effectiveHydrationPct = hydrationPct;
  }
  const salt = (saltPct / 100.0) * totalFlour;

  // ═══ Oil ═══
  const oil = (oilPct ?? 0) > 0 ? ((oilPct ?? 0) / 100.0) * totalFlour : 0;

  const totalDough = bowlFlour + addedWater + starterWeight + salt + oil + prefermentTotal;
  const starterPctDisplay = (starterWeight / totalFlour) * 100.0;

  return {
    freshFlour: round1(freshFlour),
    bowlFlour: round1(bowlFlour),
    flourFromStarter: round1(starterFlour),
    totalFlour: round1(totalFlour),
    addedWater: round1(addedWater),
    waterFromStarter: round1(starterWater),
    totalWater: round1(waterTotal),
    starterTotal: round1(starterWeight),
    salt: round1(salt),
    oil: round1(oil),
    totalDoughWeight: round1(totalDough),
    hydrationPct: effectiveHydrationPct,
    starterPct: round1(starterPctDisplay),
    prefermentFlour: round1(prefermentFlour),
    prefermentWater: round1(prefermentWater),
    prefermentTotal: round1(prefermentTotal),
  };
}

// ── Static Fermentation Estimate ───────────────────────────────────────
export function estimateFermentation(
  fdt: number,
  inoculationPct: number = 20.0,
  hydrationPct: number = 70.0,
  flour: string | FlourBlendEntry[] = 'Generic: Bread Flour',
  starterHoursSinceFed?: number,
  oilPct?: number,
): { hours: number; note: string } {
  // Inoculation factor: more starter = faster (time ∝ 1/√(inoc%)).
  // NOTE: sqrt model is a heuristic that under-predicts at low inoculation (<10%).
  // Guard against 0% inoculation (division by zero → Infinity).
  const inocRate = Math.sqrt(Math.max(inoculationPct, 1) / 20.0);
  // Hydration factor: wetter dough = faster (rate ∝ (hyd% / 70)^0.6)
  // Reference: Hammelman "Bread", Gisslen 9th ed.
  const hydRate = Math.pow(hydrationPct / 70.0, 0.6);
  // Flour factor: wholemeal/rye/spelt ferment faster than white
  const flourFactor = resolveFermentFactor(flour);

  const vitalityFactor = computeVitalityFactor(starterHoursSinceFed);
  const oilRate = computeOilRate(oilPct);
  const baseHours = BASE_FERMENTATION_HOURS / (inocRate * hydRate * flourFactor * vitalityFactor * oilRate);

  // Q10 temperature adjustment — consistent with dynamic model
  const rateMultiplier = Math.pow(Q10, (fdt - T_BASE) / 10.0);
  let hours = baseHours / rateMultiplier;
  hours = Math.max(hours, MIN_FERMENTATION_HOURS / Math.max(inocRate, 0.5));
  const hoursRounded = Math.round(hours * 2) / 2;

  // Build note
  const delta = fdt - BASE_FERMENTATION_TEMP;
  let inocNote = '';
  if (inoculationPct > 30) {
    inocNote = ` ${inoculationPct.toFixed(0)}% inoculation speeds things up.`;
  } else if (inoculationPct < 12) {
    inocNote = ` ${inoculationPct.toFixed(0)}% inoculation slows things down.`;
  }

  let note: string;
  if (delta < -3) {
    note = `Dough is ${Math.abs(delta).toFixed(1)}°C below baseline — significantly extending fermentation.${inocNote}`;
  } else if (delta < 0) {
    note = `Dough is ${Math.abs(delta).toFixed(1)}°C below baseline — slightly extending fermentation.${inocNote}`;
  } else if (delta > 3) {
    note = `Dough is ${delta.toFixed(1)}°C above baseline — significantly shortening fermentation. Watch closely!${inocNote}`;
  } else if (delta > 0) {
    note = `Dough is ${delta.toFixed(1)}°C above baseline — slightly shortening fermentation.${inocNote}`;
  } else {
    note = 'At baseline temperature.' + inocNote;
  }

  return { hours: hoursRounded, note };
}

// ── Dynamic Fermentation Model ─────────────────────────────────────────
/**
 * Model dough fermentation with changing ambient temperature.
 *
 * The dough starts at FDT and drifts toward ambient with a thermal time
 * constant τ ≈ 1.5 h. Fermentation rate follows Q10 ≈ 2.5 (rate doubles
 * every 10°C). We integrate in 15-min steps until completion.
 */
export function estimateDynamicFermentation(
  fdt: number,
  hourlyForecast: HourlyPoint[],
  inoculationPct: number = 20.0,
  hydrationPct: number = 70.0,
  flour: string | FlourBlendEntry[] = 'Generic: Bread Flour',
  starterHoursSinceFed?: number,
  oilPct?: number,
): DynamicFermentation | null {

  // Inoculation + hydration + flour multipliers
  // NOTE: sqrt inoculation model is a heuristic that under-predicts at low
  // inoculation (<10%).
  const inocRate = Math.sqrt(inoculationPct / 20.0);
  // Hydration factor: wetter dough = faster (rate ∝ (hyd% / 70)^0.6)
  // Reference: Hammelman "Bread", Gisslen 9th ed.
  const hydRate = Math.pow(hydrationPct / 70.0, 0.6);
  const flourFactor = resolveFermentFactor(flour);
  const baseRate = inocRate * hydRate * flourFactor;

  const vitalityFactor = computeVitalityFactor(starterHoursSinceFed);
  const oilRate = computeOilRate(oilPct);
  const adjustedBaseRate = baseRate * vitalityFactor * oilRate;

  if (hourlyForecast.length < 2) return null;

  // Find starting index: skip hours before the current time
  const now = new Date();
  now.setMinutes(0, 0, 0); // round down to the hour
  let startIdx = 0;
  for (let i = 0; i < hourlyForecast.length; i++) {
    if (new Date(hourlyForecast[i].datetime) >= now) {
      startIdx = i;
      break;
    }
  }

  // Slice from current hour, then extend by repeating the last 24h to
  // preserve day/night temperature cycles.
  const forecast = hourlyForecast.slice(startIdx);
  if (forecast.length > 0) {
    const cycleLen = Math.min(forecast.length, 24);
    const cycle = forecast.slice(forecast.length - cycleLen);
    let lastTime = new Date(forecast[forecast.length - 1].datetime);
    while (forecast.length < MAX_STEPS) {
      lastTime = new Date(lastTime.getTime() + 3600000);
      forecast.push({
        datetime: lastTime.toISOString(),
        tempC: cycle[((forecast.length - hourlyForecast.slice(startIdx).length) % cycleLen) % cycle.length].tempC,
      });
    }
  }

  let doughTemp = fdt;
  let progress = 0.0;
  let steps = 0;
  let converged = false;
  const profile: FermentationProfilePoint[] = [];
  let peakRate = 0.0;
  let ambientSum = 0.0;
  let ambientCount = 0;
  let lastLoggedHour = -1;

  for (const point of forecast) {
    const amb = point.tempC;
    const t = new Date(point.datetime);

    // Thermal drift: dough approaches ambient
    doughTemp += (amb - doughTemp) * (1 - Math.exp(-DT / TAU));

    // Fermentation rate: baseline × temp × inoc × hydration × vitality
    const rate = adjustedBaseRate * Math.pow(Q10, (doughTemp - T_BASE) / 10.0);
    peakRate = Math.max(peakRate, rate);

    progress += rate * DT;
    ambientSum += amb;
    ambientCount += 1;
    steps++;

    // Log roughly hourly
    if (t.getHours() !== lastLoggedHour || progress >= TARGET_HOURS) {
      const pct = Math.min((progress / TARGET_HOURS) * 100, 100);
      profile.push({
        hour: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        ambient: round1(amb),
        dough: round1(doughTemp),
        rate: round2(rate),
        progress: Math.round(pct),
      });
      lastLoggedHour = t.getHours();
    }

    if (progress >= TARGET_HOURS) {
      converged = true;
      break;
    }
    if (steps >= MAX_STEPS) break;
  }

  const bulkHours = steps * DT;
  const bulkRounded = Math.round(bulkHours * 2) / 2; // nearest 0.5 h
  const avgAmbient = round1(ambientSum / Math.max(ambientCount, 1));

  return {
    totalHours: bulkRounded, // caller adds proof if needed
    bulkHours: bulkRounded,
    profile: profile.slice(0, 25),
    peakRate: round1(peakRate),
    avgAmbient,
    converged,
  };
}

// ── Fermentation Advice ────────────────────────────────────────────────
export function fermentAdvice(
  fdt: number,
  inoculationPct: number = 20.0,
  hydrationPct: number = 70.0,
  dynamicHours?: number,
  flour: string | FlourBlendEntry[] = 'Generic: Bread Flour',
  oilPct?: number,
): string[] {
  const advice: string[] = [];
  const effectiveHours = dynamicHours;

  // Speed assessment
  if (effectiveHours !== undefined) {
    if (effectiveHours <= 3) {
      advice.push(`⚡ FAST ferment ahead — ~${effectiveHours.toFixed(1)}h to completion.`);
      advice.push('   → Don\'t walk away! Check at 2h and every 30 min after.');
    } else if (effectiveHours <= 5) {
      advice.push(`🏃 Steady-quick ferment — ~${effectiveHours.toFixed(1)}h to completion.`);
      advice.push('   → Check at the 3h mark, then every 45 min.');
    } else if (effectiveHours <= 7) {
      advice.push(`🚶 Steady ferment — ~${effectiveHours.toFixed(1)}h to completion.`);
      advice.push('   → Check around 4-5h and go by look and feel.');
    } else {
      advice.push(`🐢 Long, slow ferment — ~${effectiveHours.toFixed(1)}h to completion.`);
      advice.push('   → Great for flavour. Check at 6h, then hourly.');
    }
  }

  // What's driving the speed?
  const drivers: string[] = [];

  if (inoculationPct >= 40) {
    drivers.push(`high inoculation (${inoculationPct.toFixed(0)}% — you used a LOT of starter)`);
  } else if (inoculationPct >= 25) {
    drivers.push(`elevated inoculation (${inoculationPct.toFixed(0)}%)`);
  } else if (inoculationPct <= 10) {
    drivers.push(`low inoculation (${inoculationPct.toFixed(0)}% — lean starter, longer ferment)`);
  }

  if (hydrationPct >= 80) {
    drivers.push(`high hydration (${hydrationPct.toFixed(0)}% — wet dough moves faster)`);
  } else if (hydrationPct <= 60) {
    drivers.push(`low hydration (${hydrationPct.toFixed(0)}% — stiff dough moves slower)`);
  }

  // Flour type driver
  const isBlend = Array.isArray(flour);
  const flourFactor = resolveFermentFactor(flour);
  if (isBlend && (flour as FlourBlendEntry[]).length > 1) {
    // For blends, describe the overall weighted effect
    if (flourFactor >= 1.4) {
      drivers.push(`flour blend (weighted rate ${flourFactor.toFixed(2)}× — very active)`);
    } else if (flourFactor >= 1.15) {
      drivers.push(`flour blend (weighted rate ${flourFactor.toFixed(2)}× — elevated activity)`);
    } else if (flourFactor <= 0.8) {
      drivers.push(`flour blend (weighted rate ${flourFactor.toFixed(2)}× — slow ferment)`);
    }
  } else {
    // Single flour
    const flourLabel = typeof flour === 'string' ? flour : flour[0].label;
    const flourData = findFlour(flourLabel);
    if (flourFactor >= 1.4) {
      drivers.push(`${flourData.category.toLowerCase()} flour (high enzyme/mineral content — rapid ferment)`);
    } else if (flourFactor >= 1.15) {
      drivers.push(`${flourData.category.toLowerCase()} flour (elevated enzyme activity — faster than white)`);
    } else if (flourFactor <= 0.8) {
      drivers.push(`gluten-free flour (no gluten matrix — different fermentation dynamic)`);
    }
  }

  if (fdt > 27) {
    drivers.push(`warm dough (${fdt.toFixed(1)}°C)`);
  } else if (fdt < 20) {
    drivers.push(`cold dough (${fdt.toFixed(1)}°C)`);
  }

  if ((oilPct ?? 0) >= 10) {
    drivers.push(`high fat content (${(oilPct ?? 0).toFixed(0)}% — fat slows yeast activity)`);
  } else if ((oilPct ?? 0) >= 5) {
    drivers.push(`moderate fat content (${(oilPct ?? 0).toFixed(0)}% — slight slowdown)`);
  }

  if (drivers.length > 0) {
    advice.push('   ⚙  What\'s driving this: ' + drivers.join('; ') + '.');
  }

  // Practical tips
  if (inoculationPct >= 40 && effectiveHours && effectiveHours <= 4) {
    advice.push('   💡 With this much starter, consider reducing to 20-30% next time for more flavour development and a more manageable schedule.');
  } else if (inoculationPct <= 10 && effectiveHours && effectiveHours >= 8) {
    advice.push('   💡 With so little starter, consider upping to 20% if you want a faster turnaround.');
  }
  if (fdt < 21 && inoculationPct < 30) {
    advice.push('   💡 Your dough starts cool but will warm with the room. The dynamic estimate above accounts for this.');
  }
  if ((oilPct ?? 0) >= 10) {
    advice.push('   💡 High fat content (butter, oil, eggs) coats gluten strands and slows yeast. Expect a noticeably longer ferment than the model predicts. Cold-proofing overnight is ideal for enriched doughs.');
  } else if ((oilPct ?? 0) >= 5) {
    advice.push('   💡 Moderate fat content — fermentation will be slightly slower than a lean dough at the same temperature.');
  }

  return advice;
}

// ── Water Hardness Advice ──────────────────────────────────────────────
export function waterHardnessAdvice(hardness: WaterHardness): string[] {
  const tips: string[] = [];
  const { mgL, classification, note } = hardness;

  if (mgL < 60) {
    tips.push(`🧪 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Soft water produces extensible, slack dough — good for high-hydration breads.');
    tips.push('   → May lack minerals for yeast health. If your starter is sluggish, try adding a pinch (0.02%) of MgSO₄ (Epsom salt).');
  } else if (mgL < 120) {
    tips.push(`🧪 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Ideal range for most sourdough — good gluten development and yeast activity.');
  } else if (mgL < 200) {
    tips.push(`🧪 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Slightly hardening — tightens gluten. Good for lower hydration doughs. May slightly slow fermentation.');
  } else {
    tips.push(`🧪 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Hard water tightens gluten and buffers acid production. Expect a slightly slower, tangier ferment.');
    tips.push('   → If dough feels too tight, increase hydration by 2–3%.');
  }
  tips.push(`   → Source geology: ${note}.`);

  return tips;
}

// ── Cold Proof Extension ──────────────────────────────────────────────

/**
 * Extend a dynamic fermentation profile with a cold-proof (retard) phase.
 *
 * After bulk fermentation completes, the shaped dough is placed in the
 * fridge. The dough temperature drifts from FDT toward fridge temp with
 * the same thermal time constant τ, and fermentation continues at a very
 * slow rate (Q10 model extended downward).
 *
 * At 4°C, rate ≈ 0.13× baseline (pure Q10 model).
 *
 * The model runs for the full user-requested coldHours. Progress is reported
 * as percentage of coldHours elapsed (the actual biological progress during
 * cold proofing is a small fraction of a bulk equivalent — at 4°C, ~1–2%
 * of baseline rate).
 *
 * NOTE: This model uses a uniform Q10 coefficient (≈2.5) across all
 * temperatures. In reality, yeast (S. cerevisiae) and lactic acid bacteria
 * respond differently to cold: below 10°C, yeast metabolism slows more
 * sharply than LAB, shifting the balance toward bacterial (especially acetic
 * acid) activity. The uniform Q10 model does not capture this differential
 * temperature response — the estimated rate is a composite average that
 * may understate the shift toward acetic character in cold proofing.
 */
export function estimateColdProof(
  baseProfile: DynamicFermentation,
  fdt: number,
  coldHours: number,
  coldTemp: number = 4,
  adjustedBaseRate: number = 1.0,
): DynamicFermentation {
  let doughTemp = fdt;
  let progress = 0; // cold-phase progress in rate×DT units
  let steps = 0;
  const profile = [...baseProfile.profile];
  let peakRate = baseProfile.peakRate;
  let ambientSum = baseProfile.avgAmbient * baseProfile.profile.length;
  let ambientCount = baseProfile.profile.length;

  const totalSteps = Math.ceil(coldHours / DT);
  let lastLoggedHour = -1;

  for (let i = 0; i < totalSteps; i++) {
    // Thermal drift toward fridge temp
    doughTemp += (coldTemp - doughTemp) * (1 - Math.exp(-DT / TAU));

    // Fermentation rate at fridge temp (Q10 model, scaled by base rate factors)
    const rate = adjustedBaseRate * Math.pow(Q10, (doughTemp - T_BASE) / 10.0);
    peakRate = Math.max(peakRate, rate);

    progress += rate * DT;
    ambientSum += coldTemp;
    ambientCount++;
    steps++;

    const hour = Math.floor(steps * DT);
    if (hour !== lastLoggedHour || i === totalSteps - 1) {
      const pct = Math.min((steps / totalSteps) * 100, 100);
      profile.push({
        hour: `❄️ +${hour}h`,
        ambient: coldTemp,
        dough: round1(doughTemp),
        rate: round2(rate),
        progress: Math.round(pct),
      });
      lastLoggedHour = hour;
    }
  }

  const coldHoursActual = steps * DT;
  const totalHours = baseProfile.bulkHours + coldHoursActual;
  const avgAmbient = round1(ambientSum / Math.max(ambientCount, 1));

   return {
     totalHours: Math.round(totalHours * 2) / 2,
     bulkHours: baseProfile.bulkHours,
     profile: profile.slice(0, 32), // allow more rows with cold phase
     peakRate: round1(peakRate),
     avgAmbient,
     converged: baseProfile.converged,
   };
}

// ── Full Calculation Pipeline ──────────────────────────────────────────
export function runAllCalculations(
  inputs: RecipeInputs,
  hourlyForecast: HourlyPoint[] | null,
  hardness: WaterHardness,
  warnings: string[] = [],
): CalculationResults {
  const ingredients = calculateIngredients(
    inputs.flourWeight,
    inputs.hydration,
    inputs.starterWeight,
    inputs.saltPct,
    inputs.starterHydration,
    inputs.oilPct,
    inputs.preferment,
    inputs.addedWaterGrams,
  );

  const fdt = calculateFDT(
    inputs.flourTemp,
    inputs.waterTemp,
    inputs.ambientTemp,
    inputs.starterTemp,
    ingredients.bowlFlour,
    ingredients.addedWater,
    inputs.starterWeight,
    ingredients.prefermentFlour,
    ingredients.prefermentWater,
  );

  // Build fresh flour blend (synthesize from legacy scalar if needed)
  const freshBlend: FlourBlendEntry[] =
    inputs.flourBlend && inputs.flourBlend.length > 0
      ? inputs.flourBlend
      : [
          {
            label: inputs.flourType,
            protein: inputs.flourProtein,
            productNumber: inputs.flourProductNo,
            category: findFlour(inputs.flourType).category,
            percentage: 100,
          },
        ];

  // Merge starter flour into the total blend for accurate fermentation factor
  const totalBlend = mergeBlendWithStarter(
    freshBlend,
    inputs.starterFlourType,
    inputs.flourWeight,
    ingredients.flourFromStarter,
  );

  const staticFerment = estimateFermentation(
    fdt,
    ingredients.starterPct,
    inputs.hydration,
    totalBlend,
    inputs.starterHoursSinceFed,
    inputs.oilPct,
  );

  let dynamicFerment: DynamicFermentation | null = null;
  if (hourlyForecast) {
    dynamicFerment = estimateDynamicFermentation(
      fdt,
      hourlyForecast,
      ingredients.starterPct,
      inputs.hydration,
      totalBlend,
      inputs.starterHoursSinceFed,
      inputs.oilPct,
    );

    // Extend with cold proof if requested
    if (dynamicFerment && (inputs.coldProofHours ?? 0) > 0) {
      // Compute base rate factors for cold-proof scaling (same as dynamic model)
      const cpInocRate = Math.sqrt(Math.max(ingredients.starterPct, 1) / 20.0);
      const cpHydRate = Math.pow(inputs.hydration / 70.0, 0.6);
      const cpFlourFactor = resolveFermentFactor(totalBlend);
      const cpVitality = computeVitalityFactor(inputs.starterHoursSinceFed);
      const cpOilRate = computeOilRate(inputs.oilPct);
      const cpAdjustedBaseRate = cpInocRate * cpHydRate * cpFlourFactor * cpVitality * cpOilRate;

      dynamicFerment = estimateColdProof(
        dynamicFerment,
        fdt,
        inputs.coldProofHours!,
        inputs.coldProofTemp ?? 4,
        cpAdjustedBaseRate,
      );
    } else if (dynamicFerment) {
      // No cold proof — add warm proof time (~60% of bulk)
      const proofHours = dynamicFerment.bulkHours * PROOF_FRACTION;
      dynamicFerment = {
        ...dynamicFerment,
        totalHours: Math.round((dynamicFerment.bulkHours + proofHours) * 2) / 2,
      };
    }

    // Warn if the forecast window wasn't long enough for the model to converge
    if (dynamicFerment && !dynamicFerment.converged) {
      warnings.push('⚠️ Fermentation estimate did not converge within the forecast window. The actual time may be longer than shown.');
    }
  }

  const fa = fermentAdvice(
    fdt,
    ingredients.starterPct,
    inputs.hydration,
    dynamicFerment?.bulkHours,
    totalBlend,
    inputs.oilPct,
  );

  const ha = waterHardnessAdvice(hardness);
  const tempZone = getTempZone(fdt);

  return {
    fdt: round1(fdt),
    tempZone,
    ingredients,
    staticFermentHours: staticFerment.hours,
    staticFermentNote: staticFerment.note,
    dynamicFerment,
    fermentAdvice: fa,
    waterHardnessAdvice: ha,
    warnings,
    hardness,
  };
}

// ── Process Time ───────────────────────────────────────────────────────

/**
 * Compute total process time (hours) for a recipe preset: autolyse,
 * folds × fold interval, bench rest, shaping (5 min), bulk ferment,
 * proof (PROOF_FRACTION × fermentHours), scoring (1 min), and bake.
 *
 * Single source of truth for process duration. Without a preset, falls
 * back to bulk ferment + proof only.
 */
export function computeProcessHours(
  fermentHours: number,
  preset: RecipePreset | null | undefined,
): number {
  if (!preset) return fermentHours + fermentHours * PROOF_FRACTION;
  const { process, bake } = preset;
  const autolyse = process.autolyseMinutes / 60;
  const folds = process.folds * (process.foldIntervalMinutes / 60);
  const benchRest = process.benchRestMinutes / 60;
  const shaping = 5 / 60;
  const proof = fermentHours * PROOF_FRACTION;
  const scoring = 1 / 60;
  const bakeTime = bake.bakeTimeMinutes / 60;
  return autolyse + folds + benchRest + shaping + fermentHours + proof + scoring + bakeTime;
}

// ── Helpers ────────────────────────────────────────────────────────────
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
