/**
 * Core sourdough calculations.
 * Ported from optimizer.py — same math, TypeScript syntax.
 */
import {
  RecipeInputs,
  IngredientResults,
  DynamicFermentation,
  FermentationProfilePoint,
  HourlyPoint,
  CalculationResults,
  WaterHardness,
  FlourCategory,
  FlourBlendEntry,
} from '../models/types';
import { getTempZone } from '../models/types';
import { findFlour } from './flourSearch';

// ── Physical Constants ──────────────────────────────────────────────────
const BASE_FERMENTATION_TEMP = 26.0;
const BASE_FERMENTATION_HOURS = 4.0;
const MIN_FERMENTATION_HOURS = 2.0;
const ADD_TIME_PER_DEGREE_BELOW = 0.5;
const SUB_TIME_PER_DEGREE_ABOVE = 0.25;

// ── Flour Fermentation Factors ──────────────────────────────────────────
/**
 * Different flour categories ferment at different speeds.
 * Wholemeal, rye, and spelt ferment faster than white flour due to higher
 * mineral/ash content, more enzymes (amylase), and bran providing nucleation
 * sites for yeast activity.
 *
 * Factor > 1.0 = faster ferment; < 1.0 = slower.
 * Reference: Hammelman, "Bread"; Gisslen, "Professional Baking" 9th ed.
 */
const FLOUR_FERMENT_FACTORS: Record<FlourCategory, number> = {
  'White Bread': 1.0,
  'Cake & Pastry': 1.0,
  'Brown, Malted & Seeded': 1.15,
  'Wholemeal': 1.3,
  'Spelt': 1.2,
  'Ancient & Heritage': 1.2,
  'Rye': 1.5,
  'Other Grains': 1.0,
  'Gluten-Free': 0.7,
  'Malt & Brewing': 1.0,
  'Generic': 1.0,
};

/** Look up the fermentation speed factor for a flour by its label. */
export function getFlourFermentFactor(flourLabel: string): number {
  const flour = findFlour(flourLabel);
  return FLOUR_FERMENT_FACTORS[flour.category] ?? 1.0;
}

/** Weighted-average ferment factor for a multi-flour blend. */
export function getBlendFermentFactor(blend: FlourBlendEntry[]): number {
  let total = 0;
  for (const entry of blend) {
    const factor = FLOUR_FERMENT_FACTORS[entry.category] ?? 1.0;
    total += factor * (entry.percentage / 100);
  }
  return total;
}

/** Weighted-average protein percentage for a multi-flour blend. */
export function getBlendProtein(blend: FlourBlendEntry[]): number {
  let total = 0;
  for (const entry of blend) {
    total += entry.protein * (entry.percentage / 100);
  }
  return Math.round(total * 10) / 10;
}

/**
 * Merge the fresh flour blend with the flour contributed by the starter.
 * The starter flour's category affects fermentation, so it must be included
 * in the weighted-average ferment factor alongside the fresh flour blend.
 */
export function mergeBlendWithStarter(
  blend: FlourBlendEntry[] | undefined,
  starterFlourLabel: string | undefined,
  freshFlourWeight: number,
  flourFromStarter: number,
): FlourBlendEntry[] {
  const totalFlour = freshFlourWeight + flourFromStarter;
  if (totalFlour <= 0) return blend ?? [];

  const starterFlour = findFlour(starterFlourLabel ?? 'Generic: Bread Flour');

  // Build a map keyed by (label) to merge duplicate flours
  const merged: Record<string, { entry: FlourBlendEntry; grams: number }> = {};

  // Add fresh flour components
  if (blend && blend.length > 0) {
    for (const entry of blend) {
      const grams = freshFlourWeight * (entry.percentage / 100);
      const key = entry.label;
      if (merged[key]) {
        merged[key].grams += grams;
      } else {
        merged[key] = { entry: { ...entry }, grams };
      }
    }
  } else {
    // No blend — single flour from legacy scalar
    const grams = freshFlourWeight;
    const key = starterFlour.label; // Actually for the fresh flour, we need another source
    // This case is handled by the caller passing a synthesized blend
  }

  // Add starter flour component
  const starterKey = starterFlour.label;
  if (merged[starterKey]) {
    merged[starterKey].grams += flourFromStarter;
  } else {
    merged[starterKey] = {
      entry: {
        label: starterFlour.label,
        protein: starterFlour.protein,
        productNumber: starterFlour.productNumber,
        category: starterFlour.category,
        percentage: 0,
      },
      grams: flourFromStarter,
    };
  }

  // Convert back to FlourBlendEntry[] with recalculated percentages
  return Object.values(merged).map(({ entry, grams }) => ({
    ...entry,
    percentage: (grams / totalFlour) * 100,
  }));
}

/** Resolve a flour argument (string label or blend array) to a ferment factor. */
function resolveFermentFactor(flour: string | FlourBlendEntry[]): number {
  if (typeof flour === 'string') {
    return getFlourFermentFactor(flour);
  }
  return getBlendFermentFactor(flour);
}

// ── FDT Calculation ────────────────────────────────────────────────────
export function calculateFDT(
  flourTemp: number,
  waterTemp: number,
  ambientTemp: number,
  starterTemp: number,
): number {
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
 */
export function calculateIngredients(
  freshFlour: number,
  hydrationPct: number,
  starterWeight: number,
  saltPct: number,
  starterHydration: number,
  oilPct?: number,
  preferment?: { type: 'poolish' | 'biga'; flourPct: number; hydration: number },
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
    prefermentFlour = totalFlour * (preferment.flourPct / 100);
    prefermentWater = prefermentFlour * (preferment.hydration / 100);
    prefermentTotal = prefermentFlour + prefermentWater;
  }

  // Bowl flour: fresh flour minus what's in the pre-ferment
  const bowlFlour = freshFlour - prefermentFlour;

  const waterTotal = (hydrationPct / 100.0) * totalFlour;
  // Added water = total water – water in starter – water in pre-ferment
  const addedWater = waterTotal - starterWater - prefermentWater;
  const salt = (saltPct / 100.0) * totalFlour;

  // ═══ Oil ═══
  const oil = (oilPct ?? 0) > 0 ? ((oilPct ?? 0) / 100.0) * totalFlour : 0;

  const totalDough = bowlFlour + addedWater + starterWeight + salt + oil + prefermentTotal;
  const starterPctDisplay = (starterWeight / totalFlour) * 100.0;

  return {
    freshFlour: round1(freshFlour),
    flourFromStarter: round1(starterFlour),
    totalFlour: round1(totalFlour),
    addedWater: round1(addedWater),
    waterFromStarter: round1(starterWater),
    totalWater: round1(waterTotal),
    starterTotal: round1(starterWeight),
    salt: round1(salt),
    oil: round1(oil),
    totalDoughWeight: round1(totalDough),
    hydrationPct,
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
): { hours: number; note: string } {
  // Inoculation factor: more starter = faster (time ∝ 1/√(inoc%))
  const inocRate = Math.sqrt(inoculationPct / 20.0);
  // Hydration factor: wetter dough = faster (rate ∝ (hyd% / 70)^0.6)
  const hydRate = Math.pow(hydrationPct / 70.0, 0.6);
  // Flour factor: wholemeal/rye/spelt ferment faster than white
  const flourFactor = resolveFermentFactor(flour);
  const baseHours = BASE_FERMENTATION_HOURS / (inocRate * hydRate * flourFactor);

  const delta = fdt - BASE_FERMENTATION_TEMP;
  let hours: number;
  if (delta < 0) {
    hours = baseHours + Math.abs(delta) * ADD_TIME_PER_DEGREE_BELOW;
  } else {
    hours = baseHours - delta * SUB_TIME_PER_DEGREE_ABOVE;
  }
  hours = Math.max(hours, MIN_FERMENTATION_HOURS / Math.max(inocRate, 0.5));
  const hoursRounded = Math.round(hours * 2) / 2;

  // Build note
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
): DynamicFermentation | null {
  const TAU = 1.5;      // hours — thermal time constant
  const Q10 = 2.5;      // rate multiplier per 10°C
  const T_BASE = 26.0;  // baseline temp
  const TARGET = 4.0;   // baseline hours at rate 1.0
  const DT = 0.25;      // integration step (15 min)

  // Inoculation + hydration + flour multipliers
  const inocRate = Math.sqrt(inoculationPct / 20.0);
  const hydRate = Math.pow(hydrationPct / 70.0, 0.6);
  const flourFactor = resolveFermentFactor(flour);
  const baseRate = inocRate * hydRate * flourFactor;

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

  // Slice from current hour, then extend linearly if it runs out
  const forecast = hourlyForecast.slice(startIdx);
  const lastTemp = forecast[forecast.length - 1].tempC;
  let lastTime = new Date(forecast[forecast.length - 1].datetime);
  while (forecast.length < 200) {
    lastTime = new Date(lastTime.getTime() + 3600000);
    forecast.push({ datetime: lastTime.toISOString(), tempC: lastTemp });
  }

  let doughTemp = fdt;
  let progress = 0.0;
  let steps = 0;
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

    // Fermentation rate: baseline × temp × inoc × hydration
    const rate = baseRate * Math.pow(Q10, (doughTemp - T_BASE) / 10.0);
    peakRate = Math.max(peakRate, rate);

    progress += rate * DT;
    ambientSum += amb;
    ambientCount += 1;
    steps++;

    // Log roughly hourly
    if (t.getHours() !== lastLoggedHour || progress >= TARGET) {
      const pct = Math.min((progress / TARGET) * 100, 100);
      profile.push({
        hour: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        ambient: round1(amb),
        dough: round1(doughTemp),
        rate: round2(rate),
        progress: Math.round(pct),
      });
      lastLoggedHour = t.getHours();
    }

    if (progress >= TARGET) break;
  }

  const totalHours = steps * DT;
  const avgAmbient = round1(ambientSum / Math.max(ambientCount, 1));

  return {
    totalHours: Math.round(totalHours * 2) / 2, // nearest 0.5 h
    profile: profile.slice(0, 25),
    peakRate: round1(peakRate),
    avgAmbient,
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

// ── Full Calculation Pipeline ──────────────────────────────────────────
export function runAllCalculations(
  inputs: RecipeInputs,
  hourlyForecast: HourlyPoint[] | null,
  hardness: WaterHardness,
  warnings: string[] = [],
): CalculationResults {
  const fdt = calculateFDT(
    inputs.flourTemp,
    inputs.waterTemp,
    inputs.ambientTemp,
    inputs.starterTemp,
  );

  const ingredients = calculateIngredients(
    inputs.flourWeight,
    inputs.hydration,
    inputs.starterWeight,
    inputs.saltPct,
    inputs.starterHydration,
    inputs.oilPct,
    inputs.preferment,
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
  );

  let dynamicFerment: DynamicFermentation | null = null;
  if (hourlyForecast) {
    dynamicFerment = estimateDynamicFermentation(
      fdt,
      hourlyForecast,
      ingredients.starterPct,
      inputs.hydration,
      totalBlend,
    );
  }

  const fa = fermentAdvice(
    fdt,
    ingredients.starterPct,
    inputs.hydration,
    dynamicFerment?.totalHours,
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

// ── Helpers ────────────────────────────────────────────────────────────
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
