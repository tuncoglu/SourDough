import AsyncStorage from '@react-native-async-storage/async-storage';
import { StarterFeeding } from '../models/types';

const FEEDINGS_KEY = 'sourdough_feedings';
const FLOUR_KEY = 'sourdough_starter_flour';

/** Load all feedings, newest first */
export async function loadFeedings(): Promise<StarterFeeding[]> {
  try {
    const json = await AsyncStorage.getItem(FEEDINGS_KEY);
    if (!json) return [];
    const feedings: StarterFeeding[] = JSON.parse(json);
    return feedings.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
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
      const feedings = await loadFeedings();
      feedings.unshift(feeding);
      await AsyncStorage.setItem(FEEDINGS_KEY, JSON.stringify(feedings.slice(0, 500)));
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

/** Update an existing feeding by id (merges fields). */
export function updateFeeding(id: string, patch: Partial<StarterFeeding>): Promise<void> {
  return serialized(async () => {
    const feedings = await loadFeedings();
    const idx = feedings.findIndex((f) => f.id === id);
    if (idx === -1) return;
    feedings[idx] = { ...feedings[idx], ...patch };
    await AsyncStorage.setItem(FEEDINGS_KEY, JSON.stringify(feedings));
  });
}

/** Generate a unique feeding ID */
export function generateFeedingId(): string {
  return `feed_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

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
