import AsyncStorage from '@react-native-async-storage/async-storage';
import { StarterFeeding } from '../models/types';

const FEEDINGS_KEY = 'sourdough_feedings';
const SCHEDULE_KEY = 'sourdough_feeding_schedule';
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

/** Log a new feeding */
export async function logFeeding(feeding: StarterFeeding): Promise<void> {
  try {
    const feedings = await loadFeedings();
    feedings.unshift(feeding);
    await AsyncStorage.setItem(FEEDINGS_KEY, JSON.stringify(feedings.slice(0, 500)));
  } catch (err) {
    console.error('logFeeding: failed to persist feeding', err);
    throw err; // re-throw so callers can show feedback
  }
}

/** Get the most recent feeding, or null */
export async function getLastFeeding(): Promise<StarterFeeding | null> {
  const feedings = await loadFeedings();
  return feedings.length > 0 ? feedings[0] : null;
}

/** Delete a feeding by id */
export async function deleteFeeding(id: string): Promise<void> {
  const feedings = await loadFeedings();
  await AsyncStorage.setItem(
    FEEDINGS_KEY,
    JSON.stringify(feedings.filter((f) => f.id !== id)),
  );
}

/** Generate a unique feeding ID */
export function generateFeedingId(): string {
  return `feed_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/** Feeding schedule interval in hours */
export async function getFeedingInterval(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(SCHEDULE_KEY);
    return raw ? parseInt(raw, 10) : 24;
  } catch {
    return 24;
  }
}

export async function setFeedingInterval(hours: number): Promise<void> {
  await AsyncStorage.setItem(SCHEDULE_KEY, String(hours));
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
