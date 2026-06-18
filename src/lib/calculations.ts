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
} from '../models/types';
import { getTempZone } from '../models/types';

// ── Physical Constants ──────────────────────────────────────────────────
const BASE_FERMENTATION_TEMP = 26.0;
const BASE_FERMENTATION_HOURS = 4.0;
const MIN_FERMENTATION_HOURS = 2.0;
const ADD_TIME_PER_DEGREE_BELOW = 0.5;
const SUB_TIME_PER_DEGREE_ABOVE = 0.25;

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
 */
export function calculateIngredients(
  freshFlour: number,
  hydrationPct: number,
  starterWeight: number,
  saltPct: number,
  starterHydration: number,
): IngredientResults {
  // Split starter into flour and water components
  const starterFlourPct = 100.0 / (100.0 + starterHydration);
  const starterWaterPct = starterHydration / (100.0 + starterHydration);
  const starterFlour = starterWeight * starterFlourPct;
  const starterWater = starterWeight * starterWaterPct;

  // True total flour = what's in the bowl + what's in the starter
  const totalFlour = freshFlour + starterFlour;

  const waterTotal = (hydrationPct / 100.0) * totalFlour;
  const addedWater = waterTotal - starterWater;
  const salt = (saltPct / 100.0) * totalFlour;
  const totalDough = freshFlour + addedWater + starterWeight + salt;
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
    totalDoughWeight: round1(totalDough),
    hydrationPct,
    starterPct: round1(starterPctDisplay),
  };
}

// ── Static Fermentation Estimate ───────────────────────────────────────
export function estimateFermentation(
  fdt: number,
  inoculationPct: number = 20.0,
  hydrationPct: number = 70.0,
): { hours: number; note: string } {
  // Inoculation factor: more starter = faster (time ∝ 1/√(inoc%))
  const inocRate = Math.sqrt(inoculationPct / 20.0);
  // Hydration factor: wetter dough = faster (rate ∝ (hyd% / 70)^0.6)
  const hydRate = Math.pow(hydrationPct / 70.0, 0.6);
  const baseHours = BASE_FERMENTATION_HOURS / (inocRate * hydRate);

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
): DynamicFermentation | null {
  const TAU = 1.5;      // hours — thermal time constant
  const Q10 = 2.5;      // rate multiplier per 10°C
  const T_BASE = 26.0;  // baseline temp
  const TARGET = 4.0;   // baseline hours at rate 1.0
  const DT = 0.25;      // integration step (15 min)

  // Inoculation + hydration multipliers
  const inocRate = Math.sqrt(inoculationPct / 20.0);
  const hydRate = Math.pow(hydrationPct / 70.0, 0.6);
  const baseRate = inocRate * hydRate;

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

  if (fdt > 27) {
    drivers.push(`warm dough (${fdt.toFixed(1)}°C)`);
  } else if (fdt < 20) {
    drivers.push(`cold dough (${fdt.toFixed(1)}°C)`);
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
  );

  const staticFerment = estimateFermentation(
    fdt,
    ingredients.starterPct,
    inputs.hydration,
  );

  let dynamicFerment: DynamicFermentation | null = null;
  if (hourlyForecast) {
    dynamicFerment = estimateDynamicFermentation(
      fdt,
      hourlyForecast,
      ingredients.starterPct,
      inputs.hydration,
    );
  }

  const fa = fermentAdvice(
    fdt,
    ingredients.starterPct,
    inputs.hydration,
    dynamicFerment?.totalHours,
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
