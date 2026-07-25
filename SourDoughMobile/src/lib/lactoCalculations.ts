/**
 * Lacto-fermentation calculations.
 *
 * Models salt requirements, brine composition, and temperature-adjusted
 * fermentation timelines using the same Q10 kinetics as the bread engine.
 */
import {
  FermentInputs,
  FermentResults,
  FermentMethod,
  SaltCrystal,
  SALT_DENSITY_G_PER_TSP,
  SALT_LABELS,
  LactoDayPoint,
} from '../models/types';

// ── Physical Constants ─────────────────────────────────────────────────

/** Baseline fermentation temperature (°C). */
const BASE_TEMP = 22.0;

/** Baseline fermentation duration (days) at reference temperature. */
const BASE_DAYS = 7.0;

/** Q10 coefficient — rate multiplier per 10°C. Same as bread fermentation. */
const Q10 = 2.5;

/** Minimum feasible fermentation (days) regardless of temperature. */
const MIN_DAYS = 1.0;

/** Maximum reasonable fermentation estimate (days). */
const MAX_DAYS = 60.0;

/** Target pH for well-fermented vegetables. Below 4.6 is safe; 4.0 is shelf-stable. */
export const TARGET_PH = 4.0;

/** Safety pH threshold — botulism cannot grow below 4.6. */
export const SAFETY_PH = 4.6;

// ── Salt Calculation ───────────────────────────────────────────────────

/**
 * Compute salt requirements and conversion to volume measures.
 *
 * Two methods:
 *   - dry: salt massaged into vegetable. Salt % is of vegetable weight.
 *          Vegetable water content partially dissolves the salt.
 *   - brine: salt dissolved in water. Salt % is of water weight.
 *   - mash: like dry but blended (pepper mash, etc.)
 */
export function calculateFermentSalt(
  vegWeight: number,
  waterAmount: number,
  saltPct: number,
  method: FermentMethod,
  saltType: SaltCrystal,
  waterContentPct: number,
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
      // Salt % is of water weight
      saltGrams = waterAmount * (saltPct / 100);
      totalBrineGrams = waterAmount + saltGrams;
      effectiveSalinity = saltPct;
      break;
    }
    case 'dry': {
      // Salt % is of vegetable weight
      saltGrams = vegWeight * (saltPct / 100);
      // Effective brine salinity after veg water is released
      // Veg water released ≈ waterContentPct% of veg weight (some stays in the veg)
      const releasedWater = vegWeight * (waterContentPct / 100) * 0.7; // ~70% of water is released
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
      effectiveSalinity = (saltGrams / totalBrineGrams) * 100;
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
 * Estimate fermentation duration based on temperature and speed factor.
 *
 * Uses the same Q10 model as the bread calculator:
 *   rate = speedFactor × Q10^((temp - BASE_TEMP) / 10)
 *   days = BASE_DAYS / rate
 *
 * speedFactor accounts for different ferments:
 *   - sauerkraut/pickles: 1.0
 *   - kimchi: 1.6 (paste accelerates)
 *   - beet kvass: 1.8 (high sugar, fast)
 *   - radish/cauliflower: 0.85 (firm, low-sugar)
 */
export function estimateFermentDuration(
  temp: number,
  speedFactor: number = 1.0,
): { days: number; daysMin: number; daysMax: number } {
  const rate = speedFactor * Math.pow(Q10, (temp - BASE_TEMP) / 10);
  const days = BASE_DAYS / rate;

  // Range: ±30% for early taste / fully sour
  const daysMin = days * 0.6;
  const daysMax = days * 1.4;

  return {
    days: clampDays(days),
    daysMin: clampDays(daysMin),
    daysMax: clampDays(daysMax),
  };
}

function clampDays(d: number): number {
  return Math.round(Math.min(MAX_DAYS, Math.max(MIN_DAYS, d)) * 10) / 10;
}

// ── Day-by-Day Timeline ────────────────────────────────────────────────

/**
 * Build a day-by-day fermentation guide.
 *
 * Models pH drop along a roughly sigmoid curve from ~6.5 to TARGET_PH (4.0),
 * overlaying practical milestones for each phase.
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

  // Day 1 — lag phase
  if (totalDays >= 1) {
    points.push({
      day: 1,
      label: 'Day 1 — Lag Phase',
      description: 'Lactobacillus is waking up. Few visible changes. Keep at room temp, away from direct sun.',
    });
  }

  // Day ~25% — early activity
  const earlyDay = Math.max(2, Math.round(totalDays * 0.25));
  if (earlyDay < totalDays && earlyDay > 1) {
    points.push({
      day: earlyDay,
      label: `Day ${earlyDay} — Activity Begins`,
      description: 'Bubbles appearing. Brine may become cloudy — this is good! A thin white film (kahm yeast) is harmless; scoop it off. Fuzzy mold = discard.',
    });
  }

  // ~50% — half fermented
  const midDay = Math.round(totalDays * 0.5);
  if (midDay > earlyDay && midDay < totalDays) {
    points.push({
      day: midDay,
      label: `Day ${midDay} — Halfway`,
      description: `pH is dropping (approaching ~${(6.5 - (6.5 - TARGET_PH) * 0.5).toFixed(1)}). Taste it — should be tangy but not fully sour yet.`,
    });
  }

  // ~75% — nearly done
  const lateDay = Math.round(totalDays * 0.75);
  if (lateDay > midDay && lateDay < totalDays) {
    points.push({
      day: lateDay,
      label: `Day ${lateDay} — Nearly Ready`,
      description: `pH approaching ${TARGET_PH}. Taste: should be pleasantly sour. If you like it now, move to the fridge. If you want it tangier, give it a few more days.`,
    });
  }

  // Final day
  points.push({
    day: totalDays,
    label: `Day ${totalDays} — Complete`,
    description: `Target pH ${TARGET_PH} reached. Fully fermented. Move to cold storage (fridge or cellar). The flavour will continue to develop slowly for weeks.`,
  });

  return points;
}

// ── Full Calculation Pipeline ──────────────────────────────────────────

export function runLactoCalculations(inputs: FermentInputs): FermentResults {
  const salt = calculateFermentSalt(
    inputs.vegWeight,
    inputs.waterAmount,
    inputs.saltPct,
    inputs.method,
    inputs.saltType,
    inputs.vegWeight > 0 ? 90 : 0, // placeholder; real water content comes from preset
  );

  const duration = estimateFermentDuration(inputs.ambientTemp, 1.0); // speed factor applied at call site

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
): string[] {
  const tips: string[] = [];

  // Salt level guidance
  if (saltPct < 2.0) {
    tips.push(`⚠️ Salt is low at ${saltPct}%. Below 2% risks spoilage — mould and yeast may outcompete lactobacillus. Consider increasing to at least 2%.`);
  } else if (saltPct > 5.0) {
    tips.push(`🧂 Salt is high at ${saltPct}%. Fermentation will be very slow — some beneficial bacteria are inhibited above 5%.`);
  }

  // Temperature guidance
  if (temp < 16) {
    tips.push(`❄️ Cool temperature (${temp}°C) — fermentation will be very slow. Consider a warmer spot if you want results in under 2 weeks.`);
  } else if (temp > 28) {
    tips.push(`🔥 Warm temperature (${temp}°C) — fermentation will be fast but may produce off-flavours or soft texture. Check daily.`);
  }

  // Method-specific
  if (method === 'dry') {
    tips.push('💧 Massage salt thoroughly into the vegetables. If no brine forms after 30 min, your veg may be old/dry — add a splash of 2% salt brine to cover.');
  }
  if (method === 'brine') {
    tips.push('🪨 Use a weight to keep everything submerged. Anything above the brine line will mould.');
  }

  // General safety
  tips.push(`🛡️ Botulism cannot grow below pH ${SAFETY_PH}. Your ferment will be safe once it\'s tangy — typically by day ${Math.round(estimatedDays * 0.5)}–${Math.round(estimatedDays * 0.8)}.`);

  return tips;
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

  if (mgL < 60) {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Soft water may produce softer ferments. Add a grape leaf, oak leaf, or a pinch of calcium chloride for extra crunch.');
    tips.push('   → Low mineral content means less buffering — ferments may sour slightly faster.');
  } else if (mgL < 120) {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Good for most ferments. Balanced mineral content for texture and flavour.');
  } else if (mgL < 200) {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Moderately hard — calcium helps keep vegetables crisp. Ideal for cucumber pickles.');
  } else {
    tips.push(`💧 Your water is ${classification} (${mgL} mg/L CaCO₃).`);
    tips.push('   → Hard water is excellent for crisp ferments — calcium strengthens pectin in vegetable cell walls.');
    tips.push('   → If your brine clouds quickly, it\'s just calcium precipitating — harmless.');
  }
  tips.push(`   → Source geology: ${note}.`);

  return tips;
}

// ── Forecast Temperature for Fermentation ─────────────────────────────

import { HourlyPoint } from '../models/types';

export interface DailyTempSummary {
  day: string;
  high: number;
  low: number;
  avg: number;
}

export interface FermentTempResult {
  effectiveTemp: number;
  dailyTemps: DailyTempSummary[];
  source: 'forecast' | 'current' | 'fallback';
  summary: string;
}

/**
 * Compute effective fermentation temperature from an hourly forecast.
 * Averages temps over the expected ferment duration. Repeats last day's
 * pattern when forecast doesn't cover the full period.
 */
export function computeFermentTemp(
  hourlyForecast: HourlyPoint[] | null,
  currentTemp: number | null,
  estimatedDays: number,
): FermentTempResult {
  if (!hourlyForecast || hourlyForecast.length === 0) {
    const t = currentTemp ?? 22;
    return {
      effectiveTemp: t,
      dailyTemps: [{ day: 'Today', high: t, low: t, avg: t }],
      source: currentTemp != null ? 'current' : 'fallback',
      summary: currentTemp != null
        ? `Using current temperature: ${t}°C`
        : `No weather data — using default ${t}°C`,
    };
  }

  const dayMap = new Map<string, number[]>();
  for (const point of hourlyForecast) {
    const date = new Date(point.datetime);
    const key = date.toISOString().split('T')[0]!;
    if (!dayMap.has(key)) dayMap.set(key, []);
    dayMap.get(key)!.push(point.tempC);
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

  const effectiveTemp = Math.round((allTemps.reduce((s, t) => s + t, 0) / allTemps.length) * 10) / 10;
  const firstDay = dailyTemps[0]!;

  const summary = estimatedDays <= 1
    ? `Today: ${firstDay.high}°C / ${firstDay.low}°C`
    : `${effectiveTemp}°C avg over ${estimatedDays.toFixed(1)} days (${firstDay.high}°C / ${firstDay.low}°C today)`;

  return { effectiveTemp, dailyTemps, source: 'forecast', summary };
}

// ── Brine Calculator Helper ────────────────────────────────────────────

/**
 * Given a jar volume (ml) and vegetable weight, estimate how much water
 * is needed to fill the remaining space for a brine ferment.
 */
export function estimateWaterForJar(
  jarVolumeMl: number,
  vegWeight: number,
  headspaceMl: number = 50,
): number {
  const waterNeeded = jarVolumeMl - vegWeight - headspaceMl;
  return Math.max(0, waterNeeded);
}
