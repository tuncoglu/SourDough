/**
 * In-memory cache for user settings to reduce AsyncStorage reads.
 * Invalidated on save. TTL: 60 seconds.
 */
import { UserSettings } from '../models/types';
import { loadSettings, saveSettings } from './settingsStore';

let cache: { settings: UserSettings; loadedAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

export async function getSettings(): Promise<UserSettings> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return cache.settings;
  }
  const settings = await loadSettings();
  cache = { settings, loadedAt: Date.now() };
  return settings;
}

export async function updateSettings(settings: UserSettings): Promise<void> {
  await saveSettings(settings);
  cache = { settings, loadedAt: Date.now() };
}

/** Invalidate cache (e.g., after external modification). */
export function invalidateCache(): void {
  cache = null;
}
