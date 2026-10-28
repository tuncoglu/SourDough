import type { FermentHistoryEntry } from '@sourdough/calc/models/types';
import { pruneFerments } from '@sourdough/calc/lib/fermentHistory';
import { loadJson, removeKey, saveJson } from '@sourdough/core/storage';
import { AUTO_TEMP_MAX_AGE_MS, type Weather } from '@sourdough/core/weather';
import { DEFAULT_STATE, normalizeState, type AppState } from './form';

/** Versioned, and scoped to this app by the origin: each calculator keeps its own on this device. */
export const STATE_KEY = 'lacto.v1';
export const SETTINGS_KEY = 'lacto.settings.v1';
export const HISTORY_KEY = 'lacto.history.v1';

export const loadState = (): AppState => loadJson(STATE_KEY, DEFAULT_STATE, normalizeState);
export const saveState = (s: AppState): boolean => saveJson(STATE_KEY, s);

const isEntry = (e: unknown): e is FermentHistoryEntry => {
  const x = e as Partial<FermentHistoryEntry> | null;
  return !!x && typeof x.id === 'string' && typeof x.createdAt === 'string' && typeof x.signature === 'string' && typeof x.fermentType === 'string' && !!x.results && Array.isArray(x.vegMix);
};

export const loadHistory = (now: Date = new Date()): FermentHistoryEntry[] =>
  loadJson<FermentHistoryEntry[]>(HISTORY_KEY, [], (raw) => pruneFerments(Array.isArray(raw) ? raw.filter(isEntry) : [], now));
export const saveHistory = (h: FermentHistoryEntry[]): boolean => saveJson(HISTORY_KEY, h);

export const resetAll = (): void => {
  removeKey(STATE_KEY);
  removeKey(SETTINGS_KEY);
  removeKey(HISTORY_KEY);
};

/** A weather reading is only trusted for a few hours: the forecast is read from "today". */
export function freshWeather(w: Weather | null, now: number): Weather | null {
  return w && now - w.at <= AUTO_TEMP_MAX_AGE_MS && now >= w.at ? w : null;
}
