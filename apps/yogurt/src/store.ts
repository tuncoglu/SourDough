import { loadJson, removeKey, saveJson } from '@sourdough/core/storage';
import { AUTO_TEMP_MAX_AGE_MS, type Weather } from '@sourdough/core/weather';
import { DEFAULT_STATE, normalizeState, type AppState } from './form';

/** Versioned, and scoped to this app by the origin: each calculator keeps its own on this device. */
export const STATE_KEY = 'yogurt.v1';
export const SETTINGS_KEY = 'yogurt.settings.v1';

export const loadState = (): AppState => loadJson(STATE_KEY, DEFAULT_STATE, normalizeState);
export const saveState = (s: AppState): boolean => saveJson(STATE_KEY, s);
export const resetAll = (): void => {
  removeKey(STATE_KEY);
  removeKey(SETTINGS_KEY);
};

/** A weather reading is only trusted for a few hours: the forecast is read from "today". */
export function freshWeather(w: Weather | null, now: number): Weather | null {
  return w && now - w.at <= AUTO_TEMP_MAX_AGE_MS && now >= w.at ? w : null;
}
