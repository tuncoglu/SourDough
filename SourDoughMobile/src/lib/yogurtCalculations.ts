/**
 * Yogurt fermentation calculations.
 *
 * Models incubation time, starter ratios, yield, and temperature-adjusted
 * fermentation timelines using the same Q10 kinetics as the bread and
 * lacto-fermentation engines.
 */
import {
  YogurtInputs,
  YogurtResults,
  YogurtCultureType,
  YogurtCulturePreset,
  YogurtStepPoint,
  MilkEntry,
  MilkFatLevel,
  StarterSource,
} from '../models/types';

// ── Physical Constants ─────────────────────────────────────────────────

/** Milk density in grams per ml (whole milk ≈1.03 kg/L). */
const MILK_DENSITY_G_PER_ML = 1.03;

/**
 * Estimated evaporation loss during incubation (%).
 *
 * Sealed yogurt makers lose virtually no moisture (~0%); uncovered oven
 * methods can lose 5–10% during a long incubation. This 3% is a middle
 * ground for covered-but-not-sealed setups (e.g. jars with loose lids or
 * a towel-covered pot). Reference: Tamime & Robinson (2007).
 */
const EVAPORATION_LOSS_PCT = 3;

/** Standard yogurt serving size in grams. */
const SERVING_GRAMS = 150;

/** Q10 coefficient — rate multiplier per 10°C. Same as bread & lacto. */
const Q10 = 2.5;

/** Minimum feasible incubation (hours). */
const MIN_HOURS = 2.0;

/** Maximum reasonable incubation estimate (hours). */
const MAX_HOURS = 72.0;

/** Reference temperature for thermophilic cultures (°C). */
const BASE_TEMP_THERMOPHILIC = 42.0;

/** Reference temperature for mesophilic cultures (°C). */
const BASE_TEMP_MESOPHILIC = 22.0;

/** Pre-heat temperature for protein denaturation (°C). */
export const PREHEAT_TEMP_C = 85;

/** Pre-heat hold time (minutes). */
export const PREHEAT_MINUTES = 30;

/** Straining yield factor by thickness. */
const STRAINING_FACTORS: Record<string, number> = {
  'thin': 1.0,
  'medium': 1.0,
  'thick': 0.75,       // Greek-style — ~25% whey removed
  'very-thick': 0.60,  // Skyr/labneh — ~40% whey removed
};

/** Protein concentration factor when strained. */
const PROTEIN_CONCENTRATION: Record<string, number> = {
  'thin': 1.0,
  'medium': 1.0,
  'thick': 1.33,       // protein concentrates ~1.33×
  'very-thick': 1.67,  // protein concentrates ~1.67×
};

/** Fat concentration factor when strained. */
const FAT_CONCENTRATION: Record<string, number> = {
  'thin': 1.0,
  'medium': 1.0,
  'thick': 1.3,
  'very-thick': 1.6,
};

// ── Starter Calculation ────────────────────────────────────────────────

/**
 * Calculate how many sachets are needed for a given milk volume.
 * Always returns at least 1 (you can't use half a sachet).
 */
export function calculateSachets(milkLitres: number, starterRatio: number): number {
  return Math.max(1, Math.ceil(milkLitres * starterRatio));
}

// ── Incubation Time ────────────────────────────────────────────────────

/**
 * Estimate incubation time using the Q10 model.
 *
 * Works for both thermophilic (base 42°C) and mesophilic (base 22°C):
 *   rate = Q10^((temp - baseTemp) / 10)
 *   hours = typicalHours / rate
 *
 * Range is ±30% from the central estimate.
 */
export function estimateIncubation(
  temp: number,
  cultureType: YogurtCultureType,
  typicalHours: number,
  tempMaxC?: number,
): { hours: number; hoursMin: number; hoursMax: number; tempCapped: boolean } {
  const baseTemp = cultureType === 'thermophilic'
    ? BASE_TEMP_THERMOPHILIC
    : BASE_TEMP_MESOPHILIC;

  const maxTemp = tempMaxC ?? (cultureType === 'thermophilic' ? 48 : 30);
  const cappedTemp = Math.min(temp, maxTemp);
  const rate = Math.pow(Q10, (cappedTemp - baseTemp) / 10);
  let hours = typicalHours / rate;
  let tempCapped = false;

  if (temp > maxTemp) {
    // Linear penalty from 0 at the cap to 1 at cap+10°C
    const penalty = Math.min(1, (temp - maxTemp) / 10);
    hours = hours * (1 - penalty) + MAX_HOURS * penalty;
    tempCapped = true;
  }

  return {
    hours: clampHours(hours),
    hoursMin: clampHours(hours * 0.75),
    hoursMax: clampHours(hours * 1.5),
    tempCapped,
  };
}

function clampHours(h: number): number {
  return Math.round(Math.min(MAX_HOURS, Math.max(MIN_HOURS, h)) * 10) / 10;
}

// ── Yield Calculation ──────────────────────────────────────────────────

/**
 * Estimate final yogurt yield, accounting for evaporation and optional
 * straining (Greek/Skyr styles).
 */
export function estimateYield(
  milkLitres: number,
  thickness: string,
): { estimatedYieldGrams: number; estimatedYieldLitres: number; estimatedServings: number } {
  const milkGrams = milkLitres * 1000 * MILK_DENSITY_G_PER_ML;
  // ~3% evaporation loss during incubation
  const afterIncubation = milkGrams * (1 - EVAPORATION_LOSS_PCT / 100);
  const strainFactor = STRAINING_FACTORS[thickness] ?? 1.0;
  const finalGrams = Math.round(afterIncubation * strainFactor);
  const finalLitres = Math.round(finalGrams / 1000 * 10) / 10;

  return {
    estimatedYieldGrams: finalGrams,
    estimatedYieldLitres: finalLitres,
    estimatedServings: Math.round(finalGrams / SERVING_GRAMS),
  };
}

// ── Nutrition ──────────────────────────────────────────────────────────

/**
 * Calculate fat and protein content of the finished yogurt, accounting
 * for concentration during straining.
 */
export function calculateYogurtNutrition(
  milk: MilkEntry,
  thickness: string,
): { fatPct: number; proteinPct: number } {
  const proteinFactor = PROTEIN_CONCENTRATION[thickness] ?? 1.0;
  const fatFactor = FAT_CONCENTRATION[thickness] ?? 1.0;

  return {
    fatPct: Math.round(milk.fatPct * fatFactor * 10) / 10,
    proteinPct: Math.round(milk.proteinPct * proteinFactor * 10) / 10,
  };
}

// ── Timeline ───────────────────────────────────────────────────────────

/**
 * Build a step-by-step yogurt-making timeline.
 *
 * Covers pre-heat (if enabled), inoculation, incubation checkpoints,
 * and final chilling. Thermophilic cultures get temperature-maintenance
 * guidance; mesophilic cultures get room-temperature notes.
 */
export function buildYogurtTimeline(
  incubationHours: number,
  cultureType: YogurtCultureType,
  thickness: string,
  preHeatEnabled: boolean,
  starterSource?: StarterSource,
  previousBatchGrams?: number,
): YogurtStepPoint[] {
  const points: YogurtStepPoint[] = [];
  const totalH = Math.ceil(incubationHours);
  const isPreviousBatch = starterSource === 'previous-batch';

  // Step 0: Pre-heat (optional)
  if (preHeatEnabled) {
    points.push({
      hour: null,
      label: 'Pre-heat — Denature Proteins',
      description: `Heat milk to ${PREHEAT_TEMP_C}°C and hold for ${PREHEAT_MINUTES} min. This denatures whey proteins (mainly β-lactoglobulin), allowing them to bind to casein micelles — giving a firmer, creamier set. Cool to incubation temperature before adding culture.`,
    });
  }

  // Inoculation
  const coolTemp = cultureType === 'thermophilic' ? '42°C' : '22°C';
  const starterInstruction = isPreviousBatch
    ? `Whisk in ${previousBatchGrams ?? 30}g of yogurt from your previous batch (≈${Math.round((previousBatchGrams ?? 30) / 15)} tbsp) until smooth and fully incorporated.`
    : `Whisk in starter culture until fully dissolved.`;

  const incubateInstruction = cultureType === 'thermophilic'
    ? 'Place in yogurt maker or warm spot (oven with light on, dehydrator, thermal flask).'
    : 'Cover and leave on the counter at room temperature.';

  points.push({
    hour: 0,
    label: 'Hour 0 — Inoculate',
    description: preHeatEnabled
      ? `Cool milk to ${coolTemp}. ${starterInstruction} Pour into clean jars. ${incubateInstruction}`
      : `Warm milk to ${coolTemp} if needed. ${starterInstruction} Pour into clean jars. ${cultureType === 'thermophilic' ? `${incubateInstruction} Maintain 40–45°C.` : `${incubateInstruction} (20–25°C).`}`,
  });

  // Early incubation (~20%)
  const earlyH = Math.max(1, Math.round(totalH * 0.2));
  if (earlyH > 1 && earlyH < totalH) {
    points.push({
      hour: earlyH,
      label: `Hour ${earlyH} — Early Fermentation`,
      description: cultureType === 'thermophilic'
        ? 'S. thermophilus begins rapid growth, consuming lactose and producing lactic acid. pH starts dropping (~6.0). No visible change yet — the milk still looks like milk. Keep temperature stable.'
        : 'Lactococcus lactis begins acidifying the milk. At room temperature this is a slow, gentle process. No visible change yet — the milk still looks like milk.',
    });
  }

  // Halfway (~40-50%)
  const midH = Math.round(totalH * 0.45);
  if (midH > earlyH && midH < totalH) {
    points.push({
      hour: midH,
      label: `Hour ${midH} — Halfway`,
      description: cultureType === 'thermophilic'
        ? `pH ~5.5. L. bulgaricus joins S. thermophilus in the classic yogurt symbiosis. The milk begins to thicken — a slight wobble when you gently tilt the jar. Lactic acid production accelerates.`
        : `pH dropping. The milk begins to thicken slightly. ${thickness === 'thin' ? 'Mesophilic yogurts stay thinner — this is normal.' : 'A gentle tang is developing.'} Taste with a clean spoon to track progress.`,
    });
  }

  // Nearly ready (~75-85%)
  const lateH = Math.round(totalH * 0.8);
  if (lateH > midH && lateH < totalH) {
    points.push({
      hour: lateH,
      label: `Hour ${lateH} — Nearly Ready`,
      description: `pH approaching 4.5. The yogurt should have a clean set — tilt the jar: it should move as one mass. ${cultureType === 'thermophilic' ? 'Aroma is tangy and yogurty. If you like the taste now, move to the fridge. For more tang, give it another 1–2 hours.' : 'Taste: should be pleasantly sour. Move to the fridge when you like the flavour.'}`,
    });
  }

  // Straining (if thick/very-thick)
  if (thickness === 'thick' || thickness === 'very-thick') {
    const strainH = totalH + 3;
    points.push({
      hour: strainH,
      label: `Hour ${strainH} — Strain`,
      description: thickness === 'very-thick'
        ? 'Line a colander with cheesecloth/muslin. Pour in the yogurt and let whey drain in the fridge for 6–12h. The longer you strain, the thicker it gets — Skyr consistency needs patience. Save the whey for bread or smoothies.'
        : 'Line a colander with cheesecloth. Pour in the yogurt and let whey drain in the fridge for 2–4h. Check consistency periodically. Save the whey — great in bread dough.',
    });
  }

  // Complete
  const completeH = thickness === 'very-thick' ? totalH + 6
    : thickness === 'thick' ? totalH + 3
    : totalH;

  points.push({
    hour: completeH,
    label: 'Complete — Chill',
    description: `Refrigerate for at least 4h. The cold halts fermentation and the gel continues to firm up. Keeps for 2–3 weeks refrigerated. Save 2 tbsp as starter for your next batch — heirloom cultures improve with each generation.`,
  });

  return points;
}

// ── Full Calculation Pipeline ──────────────────────────────────────────

export function runYogurtCalculations(
  inputs: YogurtInputs,
  culture: YogurtCulturePreset,
  milk: MilkEntry,
): YogurtResults {
  const milkGrams = Math.round(inputs.milkLitres * 1000 * MILK_DENSITY_G_PER_ML);

  const incubation = estimateIncubation(
    inputs.incubationTempC,
    inputs.cultureType,
    culture.typicalHours,
    culture.tempMaxC,
  );

  const yield_ = estimateYield(inputs.milkLitres, culture.thickness);

  const isPreviousBatch = inputs.starterSource === 'previous-batch';

  const starterDisplay = isPreviousBatch
    ? `${inputs.previousBatchGrams ?? 30}g per L (≈2 tbsp)`
    : culture.starterRatio >= 1
      ? `${culture.starterRatio} sachet${culture.starterRatio > 1 ? 's' : ''} per L`
      : `1 sachet per ${Math.round(1 / culture.starterRatio)}L`;

  return {
    milkGrams,
    starterSource: inputs.starterSource,
    sachetCount: isPreviousBatch ? 0 : inputs.sachetCount,
    previousBatchGrams: isPreviousBatch ? (inputs.previousBatchGrams ?? 30) : 0,
    starterRatioDisplay: starterDisplay,
    incubationHours: incubation.hours,
    incubationHoursMin: incubation.hoursMin,
    incubationHoursMax: incubation.hoursMax,
    estimatedYieldGrams: yield_.estimatedYieldGrams,
    estimatedYieldLitres: yield_.estimatedYieldLitres,
    estimatedServings: yield_.estimatedServings,
    tempCapped: incubation.tempCapped,
  };
}

// ── Advice ─────────────────────────────────────────────────────────────

export function yogurtAdvice(
  cultureType: YogurtCultureType,
  incubationTemp: number,
  milkFatLevel: MilkFatLevel,
  preHeatEnabled: boolean,
  thickness: string,
  incubationHours: number,
): string[] {
  const tips: string[] = [];

  // Temperature guidance
  if (cultureType === 'thermophilic') {
    if (incubationTemp < 36) {
      tips.push(`🌡️ Incubation temp is low (${incubationTemp}°C). Thermophilic cultures need 38–46°C. Below 36°C, L. bulgaricus slows dramatically — expect a much longer set or a thin result.`);
    } else if (incubationTemp > 48) {
      tips.push(`🔥 Too hot! Above 48°C, the cultures begin to die. S. thermophilus is more heat-tolerant than L. bulgaricus — you may get a thin, poorly set yogurt. Keep at 40–45°C.`);
    } else {
      tips.push(`✅ Temperature (${incubationTemp}°C) is in the thermophilic sweet spot. Maintain this consistently — temperature swings cause graininess.`);
    }
    tips.push('💡 Use a yogurt maker, Instant Pot on yogurt setting, dehydrator, or oven with just the light on. A thermal flask wrapped in a towel also works.');
  } else {
    if (incubationTemp < 18) {
      tips.push(`❄️ Room is cool (${incubationTemp}°C). Mesophilic cultures work best at 20–25°C. At this temperature, incubation will be very slow — consider a warmer spot.`);
    } else if (incubationTemp > 28) {
      tips.push(`🌡️ Room is warm (${incubationTemp}°C). Mesophilic cultures may ferment too quickly above 28°C — off-flavours can develop. Consider a cooler spot.`);
    } else {
      tips.push(`✅ Room temperature (${incubationTemp}°C) is ideal for mesophilic cultures. No equipment needed — just leave it on the counter.`);
    }
  }

  // Pre-heat advice
  if (preHeatEnabled) {
    tips.push(`🥛 Pre-heating to ${PREHEAT_TEMP_C}°C for ${PREHEAT_MINUTES} min denatures whey proteins → noticeably thicker yogurt. Especially important for skimmed or semi-skimmed milk.`);
  } else if (milkFatLevel === 'skimmed' || milkFatLevel === 'semi-skimmed') {
    tips.push('💡 Consider pre-heating your milk to 85°C for 30 min before cooling — denatures proteins for a thicker set with lower-fat milk.');
  }

  // Milk fat advice
  if (milkFatLevel === 'skimmed') {
    tips.push('🥛 Skimmed milk produces thin yogurt. Add 2 tbsp skimmed milk powder per litre for body, or strain after incubation for Greek-style thickness.');
  } else if (milkFatLevel === 'whole') {
    tips.push('🥛 Whole milk gives the creamiest result. The Duchy Organic unhomogenised milk has an especially good cream top — stir it in before heating.');
  }

  // Thickness / straining
  if (thickness === 'very-thick') {
    tips.push('🪢 This is a very thick style — requires straining after incubation. Line a colander with cheesecloth and drain in the fridge for 6–12h.');
  } else if (thickness === 'thick') {
    tips.push('🪢 This style benefits from straining. Line a colander with cheesecloth, pour in the yogurt, and drain in the fridge for 2–4h.');
  }

  // General tips
  tips.push('🫙 Use clean glass jars — residual detergent inhibits cultures. Sterilise with boiling water or a dishwasher cycle.');
  tips.push('🔬 Save 2 tbsp from this batch to start the next. Heirloom cultures adapt to your kitchen and improve over generations. Reculture within 5–7 days.');
  tips.push('🛡️ Signs of contamination: pink/orange discolouration, blue/green fuzzy mould, or yeasty/alcoholic smell. Discard if any of these appear. A clean, tangy/sour smell is normal.');

  return tips;
}
