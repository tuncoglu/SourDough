/**
 * The history has no save button: a ferment you worked out is a ferment you
 * made. The calculator is live, so a record is only made once the inputs have
 * sat still for a moment, and edits to the same jar shortly after replace the
 * last record instead of adding a row each. (Same rules as the mobile app.)
 */
import type { FermentHistoryEntry } from '@sourdough/calc/models/types';
import { addFerment, generateFermentHistoryId } from '@sourdough/calc/lib/fermentHistory';

export const HISTORY_SETTLE_MS = 2500;
export const HISTORY_TUNING_WINDOW_MS = 10 * 60 * 1000;

export interface LastRecord {
  id: string;
  at: number;
  what: string;
}

type Draft = Omit<FermentHistoryEntry, 'id' | 'createdAt'>;

/** Add a draft to the history, replacing the entry recorded a moment ago for the same style and vegetable. */
export function record(
  history: FermentHistoryEntry[],
  draft: Draft,
  last: LastRecord | null,
  now: Date = new Date(),
): { history: FermentHistoryEntry[]; last: LastRecord } {
  const entry: FermentHistoryEntry = { ...draft, id: generateFermentHistoryId(), createdAt: now.toISOString() };
  const what = `${entry.fermentType}|${entry.comboId ?? ''}|${entry.vegId}`;
  const replaceId = last && last.what === what && now.getTime() - last.at < HISTORY_TUNING_WINDOW_MS ? last.id : undefined;
  return { history: addFerment(history, entry, now, replaceId), last: { id: entry.id, at: now.getTime(), what } };
}
