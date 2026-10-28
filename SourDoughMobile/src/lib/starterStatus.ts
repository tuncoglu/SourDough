/**
 * Starter readiness model accounting for fridge storage.
 *
 * Real-world workflow:
 *   1. Feed starter → sits on counter, activates over 4–8h
 *   2. Into fridge → metabolism slows ~15–20× at 4°C (empirically measured)
 *   3. Out of fridge → needs ~3h warmup to reach full activity again
 *   4. At peak → use in recipe, then feed and repeat
 */
import { StarterFeeding, StarterStatus } from '../models/types';

/**
 * How much metabolic activity slows in the fridge vs counter.
 *
 * The simple Q10 model (Q10≈2.5) gives ~0.19 (19%) for 4°C vs 22°C, which is
 * far too fast — real starter metabolism at 4°C is only ~5–8% of the counter
 * rate because microbial enzymes hit a minimum-activity floor near 0°C
 * (Arrhenius breakpoint).
 *
 * Empirically, 1 week at 4°C ≈ 10–12 counter-hours, so we hardcode ~0.06.
 * Reference: Gänzle et al. (2019) sourdough microbiota; Hammelman "Bread".
 */
const FRIDGE_RATE = 0.06;

/** Hours after coming out of fridge before starter reaches full activity. */
const FRIDGE_WARMUP_HOURS = 3;

// ── How fast a starter works ───────────────────────────────────────────

/**
 * Temperature at which "effective hours" are measured: the same 22 °C the
 * fridge rate above is stated against. An effective hour is an hour of a
 * 1 : 1 : 1 feed on a 22 °C counter.
 */
export const STARTER_REFERENCE_TEMP_C = 22;

/** Rate multiplier per 10 °C: the same ×2.5 the rise estimate uses. */
export const STARTER_Q10 = 2.5;

/** Above this the model stops speeding up, as the rise estimate does. */
export const STARTER_MAX_EFFECTIVE_TEMP_C = 38;

/**
 * Effective hours from a feed to its peak, for a 1 : 1 : 1 feed. This is the
 * app's own figure (the vitality model peaks here and the zones centre on it),
 * and baker guides only roughly agree (6–8 h at 1:1:1). So it is a default,
 * replaced by the user's own median once they have marked a few peaks.
 */
export const DEFAULT_PEAK_EFFECTIVE_HOURS = 6;

/** The peak zone, in effective hours at the default peak (see getZone). */
export const PEAK_ZONE_START_HOURS = 4;
export const PEAK_ZONE_END_HOURS = 8;

/** Marked peaks needed at similar feed sizes before the app uses the user's own. */
export const PEAKS_NEEDED_TO_LEARN = 3;

/** A "peak" marked longer than this after the feed is not believed. */
export const MAX_PEAK_CLOCK_HOURS = 48;

/** A learned peak is kept inside a sane range, so one odd tap cannot wreck the plan. */
export const LEARNED_PEAK_RANGE_HOURS = { min: 3, max: 12 } as const;

/**
 * How fast a starter works at a temperature, against the 22 °C reference
 * (×2.5 per 10 °C). A heuristic: bakers agree on the direction and rough size.
 */
export function starterPace(tempC: number): number {
  if (!Number.isFinite(tempC)) return 1;
  const capped = Math.min(tempC, STARTER_MAX_EFFECTIVE_TEMP_C);
  return Math.pow(STARTER_Q10, (capped - STARTER_REFERENCE_TEMP_C) / 10);
}

/**
 * How many times the feed dilutes the starter: everything in the jar after
 * feeding over the starter that was left. 1 : 1 : 1 is 3. A record that does
 * not say how much was kept is read as 1 : 1 : 1.
 */
export function feedDilution(feed: {
  starterKeptGrams?: number;
  flourGrams: number;
  waterGrams: number;
}): number {
  const kept = feed.starterKeptGrams;
  if (!(typeof kept === 'number' && Number.isFinite(kept) && kept > 0)) return 3;
  const total = kept + Math.max(0, feed.flourGrams) + Math.max(0, feed.waterGrams);
  const dilution = total / kept;
  return dilution > 1 ? dilution : 3;
}

/**
 * How much longer a feed takes to peak than a 1 : 1 : 1 feed. A bigger feed
 * needs more doublings to refill the jar, so peak time grows with the log of
 * the dilution: 1 : 2 : 2 about ×1.5, 1 : 5 : 5 about ×2.2. A reasoned
 * estimate, not a measurement.
 */
export function feedSizeFactor(dilution: number): number {
  if (!(dilution > 1)) return 1;
  return Math.log2(dilution) / Math.log2(3);
}

/** Clock hours from a feed to its peak, in a kitchen at `roomTempC`. */
export function starterTimeToPeakHours(opts: {
  roomTempC: number;
  /** Dilution of the feed (see feedDilution); default 1 : 1 : 1. */
  dilution?: number;
  /** This starter's peak in effective hours; default is the app's 6. */
  peakEffectiveHours?: number;
}): number {
  const peak = opts.peakEffectiveHours ?? DEFAULT_PEAK_EFFECTIVE_HOURS;
  return (peak * feedSizeFactor(opts.dilution ?? 3)) / starterPace(opts.roomTempC);
}

/** The stretch of clock time, from a feed, in which the starter is at its peak. */
export function starterPeakWindowHours(timeToPeakHours: number): { from: number; to: number } {
  return {
    from: (timeToPeakHours * PEAK_ZONE_START_HOURS) / DEFAULT_PEAK_EFFECTIVE_HOURS,
    to: (timeToPeakHours * PEAK_ZONE_END_HOURS) / DEFAULT_PEAK_EFFECTIVE_HOURS,
  };
}

export interface StarterStatusOptions {
  /**
   * Room temperature now (°C). Counter time is scaled to it. Left out, the
   * counter runs at the 22 °C reference, which changes nothing.
   */
  roomTempC?: number;
  /** This starter's own peak in effective hours (see learnedPeak); default 6. */
  peakEffectiveHours?: number;
  /** The clock, for tests. */
  now?: number;
}

export function computeStarterStatus(
  lastFeeding: StarterFeeding | null,
  options: StarterStatusOptions = {},
): StarterStatus | null {
  if (!lastFeeding) return null;

  const now = options.now ?? Date.now();
  const fedAt = new Date(lastFeeding.timestamp).getTime();
  if (isNaN(fedAt)) return null; // corrupt timestamp — refuse to guess
  const hoursSinceFed = (now - fedAt) / 3600000;

  // Determine fridge state
  const fridgeAt = lastFeeding.fridgeAt ? new Date(lastFeeding.fridgeAt).getTime() : null;
  const outOfFridgeAt = lastFeeding.outOfFridgeAt ? new Date(lastFeeding.outOfFridgeAt).getTime() : null;

  // Is the starter currently in the fridge?
  // It's in the fridge if fridgeAt is set and outOfFridgeAt is either unset or earlier than fridgeAt
  const isInFridge = fridgeAt !== null && (outOfFridgeAt === null || outOfFridgeAt < fridgeAt);

  // How fast the counter ran: at the temperature it was fed in until it went
  // in the fridge, and at today's temperature once it is back out.
  const fedPace = starterPace(lastFeeding.roomTempC ?? options.roomTempC ?? STARTER_REFERENCE_TEMP_C);
  const nowPace = starterPace(options.roomTempC ?? lastFeeding.roomTempC ?? STARTER_REFERENCE_TEMP_C);

  // Effective hours: counter time at its pace, fridge time at FRIDGE_RATE
  let rawEffectiveHours = 0;
  let hoursSinceFridgeOut = 0;

  if (fridgeAt && outOfFridgeAt) {
    // Fed → counter → fridge → out → now
    const counterBeforeFridge = Math.max(0, (fridgeAt - fedAt) / 3600000);
    const fridgeTime = Math.max(0, (outOfFridgeAt - fridgeAt) / 3600000);
    const counterAfterFridge = Math.max(0, (now - outOfFridgeAt) / 3600000);

    rawEffectiveHours = counterBeforeFridge * fedPace + fridgeTime * FRIDGE_RATE + counterAfterFridge * nowPace;
    hoursSinceFridgeOut = counterAfterFridge;
  } else if (fridgeAt && !outOfFridgeAt) {
    // Fed → counter → fridge (still there)
    const counterBeforeFridge = Math.max(0, (fridgeAt - fedAt) / 3600000);
    const fridgeTime = Math.max(0, (now - fridgeAt) / 3600000);

    rawEffectiveHours = counterBeforeFridge * fedPace + fridgeTime * FRIDGE_RATE;
    hoursSinceFridgeOut = 0;
  } else {
    // Fed → counter (never fridged)
    rawEffectiveHours = hoursSinceFed * fedPace;
    hoursSinceFridgeOut = 0;
  }

  // A bigger feed takes longer to peak, and a starter that is slower or faster
  // than the default is stretched to the default so the zones below stay put.
  const peak = options.peakEffectiveHours ?? DEFAULT_PEAK_EFFECTIVE_HOURS;
  const effectiveHours =
    (rawEffectiveHours / feedSizeFactor(feedDilution(lastFeeding))) *
    (DEFAULT_PEAK_EFFECTIVE_HOURS / peak);

  // Determine zone based on effective hours
  const zone = getZone(effectiveHours, isInFridge, hoursSinceFridgeOut);
  const { emoji, label } = ZONE_INFO[zone];

  return {
    hoursSinceFed: Math.round(hoursSinceFed * 10) / 10,
    effectiveHours: Math.round(effectiveHours * 10) / 10,
    isInFridge,
    hoursSinceFridgeOut: Math.round(hoursSinceFridgeOut * 10) / 10,
    zone,
    emoji,
    label,
  };
}

/**
 * This starter's own peak, in effective hours, from the feedings the user
 * marked as peaked. Each is the clock time to the mark, turned into effective
 * hours for that day's kitchen and that feed's size, so a warm day and a cool
 * day, or a small feed and a big one, count the same. Only feeds of a similar
 * size to the latest marked one are used, and it takes three of them.
 * Returns null until then, and callers use the default.
 */
export function learnedPeakEffectiveHours(
  feedings: StarterFeeding[],
  fallbackRoomTempC?: number,
): { effectiveHours: number; count: number } | null {
  const marked = feedings
    .map((f) => {
      if (!f.peakedAt) return null;
      const fedAt = new Date(f.timestamp).getTime();
      const peakedAt = new Date(f.peakedAt).getTime();
      const clockHours = (peakedAt - fedAt) / 3600000;
      if (!Number.isFinite(clockHours) || clockHours <= 0 || clockHours > MAX_PEAK_CLOCK_HOURS) return null;
      const temp = f.roomTempC ?? fallbackRoomTempC;
      if (temp === undefined || !Number.isFinite(temp)) return null;
      const size = feedSizeFactor(feedDilution(f));
      return { fedAt, size, effective: (clockHours * starterPace(temp)) / size };
    })
    .filter((m): m is { fedAt: number; size: number; effective: number } => m !== null)
    .sort((a, b) => b.fedAt - a.fedAt);

  if (marked.length === 0) return null;
  const reference = marked[0].size;
  const similar = marked.filter((m) => Math.abs(m.size / reference - 1) <= 0.25);
  if (similar.length < PEAKS_NEEDED_TO_LEARN) return null;

  const sorted = similar.map((m) => m.effective).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const { min, max } = LEARNED_PEAK_RANGE_HOURS;
  return {
    effectiveHours: Math.round(Math.min(max, Math.max(min, median)) * 10) / 10,
    count: similar.length,
  };
}

/**
 * Feed amounts that leave `neededGrams` of peaked starter for the dough plus
 * `keepGrams` to stay in the jar, at a 1 : r : r feed (default 1 : 1 : 1).
 * With the starter at 100 % hydration the flour and water are equal.
 */
export function starterFeedAmounts(opts: {
  neededGrams: number;
  keepGrams?: number;
  /** r in 1 : r : r. */
  ratio?: number;
  /** Starter hydration %, default 100. */
  hydration?: number;
}): { keptGrams: number; flourGrams: number; waterGrams: number; totalGrams: number; dilution: number } {
  const keep = opts.keepGrams ?? 50;
  const r = opts.ratio && opts.ratio > 0 ? opts.ratio : 1;
  const hydration = opts.hydration && opts.hydration > 0 ? opts.hydration : 100;
  const total = Math.max(0, opts.neededGrams) + Math.max(0, keep);
  // starter + r·starter flour + r·starter·(hydration/100) water = total
  const starter = total / (1 + r + (r * hydration) / 100);
  const keptGrams = Math.max(1, Math.round(starter));
  const flourGrams = Math.max(1, Math.round(keptGrams * r));
  const waterGrams = Math.max(1, Math.round(flourGrams * (hydration / 100)));
  const totalGrams = keptGrams + flourGrams + waterGrams;
  return { keptGrams, flourGrams, waterGrams, totalGrams, dilution: totalGrams / keptGrams };
}

type Zone = StarterStatus['zone'];

function getZone(effectiveHours: number, isInFridge: boolean, hoursSinceFridgeOut: number): Zone {
  if (isInFridge) return 'dormant';

  // Just came out of fridge — still warming up
  if (hoursSinceFridgeOut > 0 && hoursSinceFridgeOut < FRIDGE_WARMUP_HOURS) {
    return 'building';
  }

  // Standard counter-based zones
  if (effectiveHours <= 4) return 'just-fed';
  if (effectiveHours <= 8) return 'peak';
  if (effectiveHours <= 14) return 'past-peak';
  return 'hungry';
}

const ZONE_INFO: Record<Zone, { emoji: string; label: string }> = {
  'just-fed': { emoji: '🌱', label: 'Just fed — building strength' },
  'building': { emoji: '🌤️', label: 'Warming up from fridge — nearly ready' },
  'peak': { emoji: '🟢', label: 'At peak activity — great time to bake!' },
  'past-peak': { emoji: '🟡', label: 'Still active but past peak' },
  'hungry': { emoji: '🔴', label: 'Hungry — time to feed!' },
  'dormant': { emoji: '❄️', label: 'Dormant in fridge — preserved' },
};

/** Resolve a starter zone to the current theme's semantic color. */
export function starterZoneColor(zone: Zone, colors: { ideal: string; hot: string; cold: string }): string | undefined {
  switch (zone) {
    case 'peak': return colors.ideal;
    case 'hungry': return colors.hot;
    case 'dormant': return colors.cold;
    default: return undefined;
  }
}

// ── Feeding the rise estimate ───────────────────────────────────────────

/** A status older than this, with no fridge record, is too stale to trust. */
export const STARTER_STATUS_MAX_AGE_HOURS = 14 * 24;

/**
 * The status to use in a recipe estimate, or null when it should not be used.
 *
 * A starter that is in the fridge is always usable: dormant is a real state
 * however long it has been there. A counter starter with no fridge record
 * that was last fed weeks ago is probably a stale log from an old install, not
 * a hungry jar, so it is ignored rather than allowed to quietly slow every
 * estimate.
 */
export function usableStarterStatus(status: StarterStatus | null): StarterStatus | null {
  if (!status) return null;
  if (status.isInFridge) return status;
  return status.hoursSinceFed > STARTER_STATUS_MAX_AGE_HOURS ? null : status;
}

/**
 * Temperature of the starter when it goes into the dough: fridge-cold while
 * in the fridge, room temperature once it is warmed up, and halfway while it
 * is still coming up (the first hours out of the fridge).
 */
export function starterTempFor(
  status: StarterStatus,
  roomTempC: number,
  fridgeTempC: number,
): number {
  if (status.isInFridge) return fridgeTempC;
  if (status.zone === 'building') return (fridgeTempC + roomTempC) / 2;
  return roomTempC;
}

/**
 * The flour mix a feeding used, as shares of its flour (summing to 100).
 * A feeding with several flours uses their grams; an older single-flour
 * record uses its one label. Undefined when there is nothing to go on.
 */
export function starterFlourBlendFromFeeding(
  feeding: StarterFeeding | null,
): { label: string; share: number }[] | undefined {
  if (!feeding) return undefined;
  const flours = (feeding.flours ?? []).filter((f) => f.label && f.grams > 0);
  const total = flours.reduce((s, f) => s + f.grams, 0);
  if (flours.length > 0 && total > 0) {
    return flours.map((f) => ({ label: f.label, share: (f.grams / total) * 100 }));
  }
  return feeding.flourUsed ? [{ label: feeding.flourUsed, share: 100 }] : undefined;
}
