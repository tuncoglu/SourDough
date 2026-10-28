/**
 * Starter feeding log: the pure parts of the Starter screen and the bread
 * page's starter choice. No React or storage imports.
 */
import type { StarterFeeding } from '../models/types';
import {
  DEFAULT_PEAK_EFFECTIVE_HOURS,
  feedDilution,
  starterPeakWindowHours,
  starterTimeToPeakHours,
} from './starterStatus';

/** Feed ratios offered as one-tap choices (the r in 1 : r : r). */
export const FEED_RATIOS = [1, 2, 5] as const;

/** Starter left in the jar by default, and the default feed, in grams. */
export const DEFAULT_KEPT_GRAMS = 50;

const HOUR = 3_600_000;

const round1 = (n: number) => Math.round(n * 10) / 10;

/** "1 : 2.5 : 2.5" from what went into the jar; "1 : 1 : 1" when the record does not say. */
export function ratioLabel(feed: { starterKeptGrams?: number; flourGrams: number; waterGrams: number }): string {
  const kept = feed.starterKeptGrams;
  if (!(typeof kept === 'number' && Number.isFinite(kept) && kept > 0)) return '1 : 1 : 1';
  const fmt = (n: number) => String(round1(n));
  return `1 : ${fmt(feed.flourGrams / kept)} : ${fmt(feed.waterGrams / kept)}`;
}

/** Flour and water for a 1 : r : r feed of `keptGrams` of starter (water follows the hydration). */
export function amountsForRatio(opts: {
  keptGrams: number;
  ratio: number;
  /** Starter hydration %, default 100. */
  hydration?: number;
}): { flourGrams: number; waterGrams: number } {
  const hydration = opts.hydration && opts.hydration > 0 ? opts.hydration : 100;
  const flourGrams = Math.max(0, Math.round(opts.keptGrams * opts.ratio));
  return { flourGrams, waterGrams: Math.max(0, Math.round(flourGrams * (hydration / 100))) };
}

export interface FeedingDraft {
  id: string;
  now: Date;
  /** The flours the feed used and how much of each (grams, as typed). */
  flours: { label: string; grams: string }[];
  waterGrams: string;
  keptGrams: string;
  roomTempC?: number;
  notes?: string;
  /** Put straight in the fridge (the lazy loop: feed the jar after mixing). */
  intoFridge?: boolean;
}

/**
 * Turn what the user entered into a feeding record, or null when there is
 * nothing to record. Several flours are kept as a list; a single flour is
 * recorded the way older versions did, so older readers still understand it.
 */
export function buildFeeding(draft: FeedingDraft): StarterFeeding | null {
  const flours = draft.flours
    .map((f) => ({ label: f.label.trim(), grams: parseFloat(f.grams) || 0 }))
    .filter((f) => f.label && f.grams > 0);
  const flourGrams = flours.reduce((s, f) => s + f.grams, 0);
  const waterGrams = parseFloat(draft.waterGrams) || 0;
  if (flourGrams <= 0 || waterGrams <= 0) return null;

  const kept = parseFloat(draft.keptGrams);
  const iso = draft.now.toISOString();
  const feeding: StarterFeeding = {
    id: draft.id,
    timestamp: iso,
    flourUsed: flours.length === 1 ? flours[0].label : flours.map((f) => f.label).join(' + '),
    flourGrams,
    waterGrams,
  };
  if (flours.length > 1) feeding.flours = flours;
  if (Number.isFinite(kept) && kept > 0) feeding.starterKeptGrams = kept;
  if (draft.roomTempC !== undefined && Number.isFinite(draft.roomTempC)) feeding.roomTempC = draft.roomTempC;
  if (draft.notes?.trim()) feeding.notes = draft.notes.trim();
  if (draft.intoFridge) feeding.fridgeAt = iso;
  return feeding;
}

export interface PeakForecast {
  /** Clock hours from the feed to the peak. */
  hours: number;
  peakAt: Date;
  window: { from: Date; to: Date };
}

/**
 * When a feeding peaks, in its own kitchen and at its own size. Null once the
 * jar has gone into the fridge, where it is no longer heading for a peak.
 */
export function peakForecast(
  feeding: StarterFeeding,
  opts: { roomTempC?: number; peakEffectiveHours?: number } = {},
): PeakForecast | null {
  if (feeding.fridgeAt && !feeding.outOfFridgeAt) return null;
  const fedAt = new Date(feeding.timestamp).getTime();
  if (!Number.isFinite(fedAt)) return null;
  const temp = feeding.roomTempC ?? opts.roomTempC;
  if (temp === undefined || !Number.isFinite(temp)) return null;
  const hours = starterTimeToPeakHours({
    roomTempC: temp,
    dilution: feedDilution(feeding),
    peakEffectiveHours: opts.peakEffectiveHours ?? DEFAULT_PEAK_EFFECTIVE_HOURS,
  });
  const w = starterPeakWindowHours(hours);
  return {
    hours,
    peakAt: new Date(fedAt + hours * HOUR),
    window: { from: new Date(fedAt + w.from * HOUR), to: new Date(fedAt + w.to * HOUR) },
  };
}

/** Whether a feeding was made for the loaf now being planned: recent, and not in the fridge. */
export function fedForThisLoaf(feeding: StarterFeeding | null, now: Date = new Date(), withinHours = 24): boolean {
  if (!feeding) return false;
  const fedAt = new Date(feeding.timestamp).getTime();
  if (!Number.isFinite(fedAt)) return false;
  const inFridge = !!feeding.fridgeAt && !feeding.outOfFridgeAt;
  return !inFridge && now.getTime() - fedAt >= 0 && now.getTime() - fedAt < withinHours * HOUR;
}
