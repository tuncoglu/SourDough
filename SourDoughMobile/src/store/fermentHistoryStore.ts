/**
 * Persistence for the ferment history.
 *
 * Mirrors recipeStore's shape: AsyncStorage, newest first, writes serialized
 * through a promise chain so two rapid calculations cannot clobber each other.
 * Rotation and de-duplication live in lib/fermentHistory.ts, which is pure and
 * unit-tested; this module only does storage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FermentHistoryEntry } from '../models/types';
import { addFerment, pruneFerments } from '../lib/fermentHistory';

const FERMENTS_KEY = 'sourdough_ferments';

/** Load the ferment history, newest first, with expired entries dropped. */
export async function loadFerments(): Promise<FermentHistoryEntry[]> {
  try {
    const json = await AsyncStorage.getItem(FERMENTS_KEY);
    if (!json) return [];
    const entries: FermentHistoryEntry[] = JSON.parse(json);
    if (!Array.isArray(entries)) return [];
    const live = pruneFerments(entries);
    // Persist the pruned list lazily: reading is not the place to fail.
    if (live.length !== entries.length) {
      AsyncStorage.setItem(FERMENTS_KEY, JSON.stringify(live)).catch(() => {});
    }
    return live;
  } catch {
    return [];
  }
}

let writeQueue: Promise<unknown> = Promise.resolve();
function serialized<T>(op: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(op, op);
  writeQueue = run.then(() => undefined, () => undefined);
  return run;
}

/** Record a calculation. Fire-and-forget from the calculator's point of view. */
export function recordFerment(entry: FermentHistoryEntry): Promise<void> {
  return serialized(async () => {
    const entries = await loadFerments();
    await AsyncStorage.setItem(FERMENTS_KEY, JSON.stringify(addFerment(entries, entry)));
  });
}

export function deleteFerment(id: string): Promise<void> {
  return serialized(async () => {
    const entries = await loadFerments();
    await AsyncStorage.setItem(
      FERMENTS_KEY,
      JSON.stringify(entries.filter((e) => e.id !== id)),
    );
  });
}

export function clearFerments(): Promise<void> {
  return serialized(async () => {
    await AsyncStorage.removeItem(FERMENTS_KEY);
  });
}
