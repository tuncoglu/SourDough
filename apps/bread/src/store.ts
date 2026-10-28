import type { StarterFeeding } from '@sourdough/calc/models/types';
import { sortFeedings } from '@sourdough/calc/lib/starterLog';
import { loadJson, removeKey, saveJson } from '@sourdough/core/storage';
import { AUTO_TEMP_MAX_AGE_MS, type Weather } from '@sourdough/core/weather';
import { DEFAULT_STATE, normalizeForm, normalizeState, type AppState, type SavedLoaf } from './state';

/** Versioned, and scoped to this app by the origin: each calculator keeps its own on this device. */
export const STATE_KEY = 'bread.v1';
export const SETTINGS_KEY = 'bread.settings.v1';
export const FEEDINGS_KEY = 'bread.feedings.v1';
export const LOAVES_KEY = 'bread.loaves.v1';

export const loadState = (): AppState => loadJson(STATE_KEY, DEFAULT_STATE, normalizeState);
export const saveState = (s: AppState): boolean => saveJson(STATE_KEY, s);

const isFeeding = (f: unknown): f is StarterFeeding => {
  const x = f as Partial<StarterFeeding> | null;
  return !!x && typeof x.id === 'string' && typeof x.timestamp === 'string' && !Number.isNaN(new Date(x.timestamp).getTime()) && typeof x.flourGrams === 'number' && typeof x.waterGrams === 'number';
};
export const loadFeedings = (): StarterFeeding[] =>
  loadJson<StarterFeeding[]>(FEEDINGS_KEY, [], (raw) => sortFeedings(Array.isArray(raw) ? raw.filter(isFeeding) : []));
export const saveFeedings = (f: StarterFeeding[]): boolean => saveJson(FEEDINGS_KEY, f);

const isLoaf = (l: unknown): l is SavedLoaf => {
  const x = l as Partial<SavedLoaf> | null;
  return !!x && typeof x.id === 'string' && typeof x.createdAt === 'string' && !!x.summary && typeof x.summary.flourGrams === 'number' && !!x.form;
};
export const loadLoaves = (): SavedLoaf[] =>
  loadJson<SavedLoaf[]>(LOAVES_KEY, [], (raw) => (Array.isArray(raw) ? raw.filter(isLoaf).map((l) => ({ ...l, form: normalizeForm(l.form) })) : []));
export const saveLoaves = (l: SavedLoaf[]): boolean => saveJson(LOAVES_KEY, l);

export const resetAll = (): void => {
  for (const k of [STATE_KEY, SETTINGS_KEY, FEEDINGS_KEY, LOAVES_KEY]) removeKey(k);
};

/** A weather reading is only trusted for a few hours. */
export function freshWeather(w: Weather | null, now: number): Weather | null {
  return w && now - w.at <= AUTO_TEMP_MAX_AGE_MS && now >= w.at ? w : null;
}
