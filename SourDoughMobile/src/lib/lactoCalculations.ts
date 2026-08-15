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
  HourlyPoint,
  UnitSystem,
} from '../models/types';
import { formatTemp } from './unitConversion';

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

/** Target pH for well-fermented vegetables. Below 4.6 is safe from botulism; 4.0 is the typical fully-sour end point (still refrigerate for long storage — yeasts and moulds grow below 4.0). */
export const TARGET_PH = 4.0;

/** Safety pH threshold — botulism cannot grow below 4.6. */
export const SAFETY_PH = 4.6;

/** Typical final pH of a fully sour ferment (cabbage ~3.4–3.6). */
export const FINAL_PH = 3.5;

/** Starting pH of fresh vegetables. */
export const PH_START = 6.5;

/** Shape exponent of the pH decline curve (see estimatePHAt). */
const PH_SHAPE = 1.7;

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

/** Maximum temperature (°C) at which the Q10 model is reliable.
 * Above this, Leuconostoc is inhibited and LAB community composition
 * shifts, so the simple Q10 prediction breaks down. */
const MAX_EFFECTIVE_TEMP = 35.0;

/**
 * Estimate fermentation duration based on temperature and speed factor.
 *
 * Uses the same Q10 model as the bread calculator:
 *   rate = speedFactor × Q10^((effectiveTemp - BASE_TEMP) / 10)
 *   days = BASE_DAYS / rate
 *
 * Temperature is capped at MAX_EFFECTIVE_TEMP for the Q10 calculation.
 * Above that, the estimate is linearly penalised (over 15°C overshoot
 * toward 2× slower) to reflect LAB community shifts and Leuconostoc
 * inhibition at higher temperatures.
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
): { days: number; daysMin: number; daysMax: number; tempCapped: boolean } {
  const tempCapped = temp > MAX_EFFECTIVE_TEMP;
  const effectiveTemp = Math.min(temp, MAX_EFFECTIVE_TEMP);
  const rate = speedFactor * Math.pow(Q10, (effectiveTemp - BASE_TEMP) / 10);
  let days = BASE_DAYS / rate;

  // If temp exceeds the effective cap, penalise the estimate.
  // Above 42°C LAB growth effectively stops, so the penalty escalates
  // more aggressively beyond a 7°C overshoot (i.e. above 42°C).
  if (tempCapped) {
    const overshoot = temp - MAX_EFFECTIVE_TEMP;
    const penalty = overshoot <= 7
      ? 1 + overshoot / 7                    // ≤42°C: linear 1× → 2× penalty
      : 2 + (overshoot - 7) * 0.5;           // >42°C: +0.5× penalty per extra °C
    days *= penalty;
  }

  // Range: ±40% for early taste / fully sour
  const daysMin = days * 0.6;
  const daysMax = days * 1.4;

  return {
    days: clampDays(days),
    daysMin: clampDays(daysMin),
    daysMax: clampDays(daysMax),
    tempCapped,
  };
}

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

  // Final day — fully sour; move to cold storage (classic cellar ferments
  // continue for weeks, but the 7-day baseline marks "ready to refrigerate")
  points.push({
    day: totalDays,
    label: `Day ${totalDays} — Ready for Cold Storage`,
    description: `Final pH ~${FINAL_PH.toFixed(1)} reached — well below the ${SAFETY_PH} safety threshold and stable under ${TARGET_PH.toFixed(1)}. LAB community stable. Move to cold storage (fridge or cellar). Postbiotic compounds (GABA, phenyl-lactic acid, indole-3-lactic acid) continue to develop for weeks.`,
  });

  return points;
}

// ── Full Calculation Pipeline ──────────────────────────────────────────

export function runLactoCalculations(
  inputs: FermentInputs,
  waterContentPct: number = 90,
  speedFactor: number = 1.0,
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

  const duration = estimateFermentDuration(inputs.ambientTemp, speedFactor);

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
    tempCapped: duration.tempCapped,
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

  // Temperature guidance
  if (temp < 16) {
    tips.push(`❄️ Cool temperature (${t}) — fermentation will be very slow. Consider a warmer spot if you want results in under 2 weeks.`);
  } else if (temp > 30) {
    tips.push(`🔥 Warm temperature (${t}) — fermentation will be fast but may produce off-flavours or soft texture. Check daily. Below 20°C favours heterofermentative Leuconostoc (more CO₂, ethanol, acetic acid); above 30°C favours homofermentative L. plantarum (cleaner lactic profile).`);
  } else if (temp > 24) {
    tips.push(`🌡️ Warm room temp (${t}) — consider a variable-temperature strategy: ferment 3 days at room temp, then move to the fridge for cold maturation. Recent cucumber-fermentation research found this preserves texture and develops more complex aroma.`);
  }

  // Method-specific
  if (method === 'dry') {
    tips.push('💧 Massage salt thoroughly into the vegetables. If no brine forms after 30 min, your veg may be old/dry — add a splash of 2% salt brine to cover.');
  }
  if (method === 'brine') {
    tips.push('🪨 Use a weight to keep everything submerged. Anything above the brine line will mould.');
  }

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
  source: 'forecast' | 'current' | 'fallback';
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

  // Integrate the Q10 rate curve — the arithmetic mean is biased for
  // fluctuating temperatures, so convert via the mean rate instead.
  const rateSum = allTemps.reduce((s, t) => s + Math.pow(Q10, (t - BASE_TEMP) / 10), 0);
  const meanRate = rateSum / allTemps.length;
  const effectiveTemp = BASE_TEMP + (10 * Math.log(meanRate)) / Math.log(Q10);
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
