/**
 * Ferment-history bookkeeping — pure, so the rotation and de-duplication
 * rules are testable without touching storage.
 *
 * Every successful calculation is recorded; there is no save button. Left
 * alone that grows without bound, so entries rotate out after a year and the
 * list is capped as a backstop. Recalculating the same ferment (tweaking the
 * temperature, pressing Calculate twice) updates the existing entry instead
 * of padding the list with near-identical rows.
 */
import { FermentHistoryEntry } from '../models/types';

/** Entries older than this are dropped. */
export const FERMENT_RETENTION_DAYS = 365;

/** Hard cap, whatever the dates say. */
export const FERMENT_HISTORY_CAP = 200;

/** The inputs that identify "the same ferment" for de-duplication. */
export interface FermentSignatureInput {
  fermentType: string;
  method: string;
  vegId: string;
  vegWeight: string;
  waterAmount: string;
  saltPct: string;
  saltType: string;
  prepSize: string;
  useStarter: boolean;
  vegMix: { vegId: string; grams: string }[];
}

/**
 * Stable hash of the ferment-defining inputs.
 *
 * Deliberately excludes temperature and the results: recalculating the same
 * jar as the weather changes should update the entry's estimate, not create a
 * second row for the same ferment.
 */
export function fermentSignature(input: FermentSignatureInput): string {
  const mix = input.vegMix
    .map((m) => `${m.vegId}:${m.grams}`)
    .sort()
    .join(',');
  return [
    input.fermentType,
    input.method,
    input.vegId,
    input.vegWeight,
    input.waterAmount,
    input.saltPct,
    input.saltType,
    input.prepSize,
    input.useStarter ? 'starter' : 'wild',
    mix,
  ].join('|');
}

const ageInDays = (iso: string, now: Date): number =>
  (now.getTime() - new Date(iso).getTime()) / 86400000;

/** Drop entries past the retention window (and any with an unreadable date). */
export function pruneFerments(
  entries: FermentHistoryEntry[],
  now: Date = new Date(),
): FermentHistoryEntry[] {
  return entries.filter((e) => {
    const age = ageInDays(e.createdAt, now);
    return Number.isFinite(age) && age <= FERMENT_RETENTION_DAYS;
  });
}

/**
 * Add an entry, newest first.
 *
 * If the newest entry is the same ferment, it is replaced (fresh timestamp and
 * results) rather than duplicated — pressing Calculate again is not a new
 * event. Re-making the same recipe later still creates a new entry, because by
 * then something else is at the top of the list.
 */
export function addFerment(
  entries: FermentHistoryEntry[],
  entry: FermentHistoryEntry,
  now: Date = new Date(),
): FermentHistoryEntry[] {
  const rest = entries[0]?.signature === entry.signature ? entries.slice(1) : entries;
  return pruneFerments([entry, ...rest], now).slice(0, FERMENT_HISTORY_CAP);
}

/** One-line description for the history list. */
export function fermentSummary(entry: FermentHistoryEntry): string {
  const weight = Number(entry.vegWeight) || 0;
  const salt = entry.saltPct ? `${entry.saltPct}% salt` : '';
  const parts = [`${weight} g ${entry.vegName}`, salt];
  if (entry.useStarter) parts.push('starter');
  return parts.filter(Boolean).join(' · ');
}

export function generateFermentHistoryId(): string {
  return `ferment_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
