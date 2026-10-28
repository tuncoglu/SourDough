import AsyncStorage from '@react-native-async-storage/async-storage';
import { StarterFeeding } from '@sourdough/calc/models/types';
import {
  addFeeding,
  fridgeStateIn,
  generateFeedingId as newFeedingId,
  markPeakedIn,
  patchFeeding,
  sortFeedings,
} from '@sourdough/calc/lib/starterLog';

const FEEDINGS_KEY = 'sourdough_feedings';
const FLOUR_KEY = 'sourdough_starter_flour';

/** Load all feedings, newest first */
export async function loadFeedings(): Promise<StarterFeeding[]> {
  try {
    const json = await AsyncStorage.getItem(FEEDINGS_KEY);
    if (!json) return [];
    return sortFeedings(JSON.parse(json) as StarterFeeding[]);
  } catch {
    return [];
  }
}

// Serialize read-modify-write cycles (see recipeStore for rationale).
let writeQueue: Promise<unknown> = Promise.resolve();
function serialized<T>(op: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(op, op);
  writeQueue = run.then(() => undefined, () => undefined);
  return run;
}

/** Log a new feeding */
export function logFeeding(feeding: StarterFeeding): Promise<void> {
  return serialized(async () => {
    try {
      const feedings = addFeeding(await loadFeedings(), feeding);
      await AsyncStorage.setItem(FEEDINGS_KEY, JSON.stringify(feedings));
    } catch (err) {
      console.error('logFeeding: failed to persist feeding', err);
      throw err; // re-throw so callers can show feedback
    }
  });
}

/** Get the most recent feeding, or null */
export async function getLastFeeding(): Promise<StarterFeeding | null> {
  const feedings = await loadFeedings();
  return feedings.length > 0 ? feedings[0] : null;
}

/** Apply one of the shared log operations to the stored list, one write at a time. */
function mutate(change: (feedings: StarterFeeding[]) => StarterFeeding[]): Promise<void> {
  return serialized(async () => {
    await AsyncStorage.setItem(FEEDINGS_KEY, JSON.stringify(change(await loadFeedings())));
  });
}

/** Update an existing feeding by id (merges fields). */
export function updateFeeding(id: string, patch: Partial<StarterFeeding>): Promise<void> {
  return mutate((l) => patchFeeding(l, id, patch));
}

/** Mark a feeding as having reached its peak (now, unless told otherwise). */
export function markPeaked(id: string, at: Date = new Date()): Promise<void> {
  return mutate((l) => markPeakedIn(l, id, at));
}

/**
 * Record the jar going into the fridge or coming out of it (now, unless told
 * otherwise). Going in again clears an earlier "out".
 */
export function setFridgeState(id: string, state: 'in' | 'out', at: Date = new Date()): Promise<void> {
  return mutate((l) => fridgeStateIn(l, id, state, at));
}

/** Generate a unique feeding ID */
export const generateFeedingId = newFeedingId;

/** Get the persisted starter flour preference (defaults to Generic: Bread Flour) */
export async function getStarterFlour(): Promise<string> {
  try {
    const raw = await AsyncStorage.getItem(FLOUR_KEY);
    return raw ?? 'Generic: Bread Flour';
  } catch {
    return 'Generic: Bread Flour';
  }
}

/** Persist the starter flour preference */
export async function setStarterFlour(flourLabel: string): Promise<void> {
  await AsyncStorage.setItem(FLOUR_KEY, flourLabel);
}
