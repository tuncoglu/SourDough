import { loadJson, saveJson } from './storage';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Units = 'metric' | 'imperial';

export interface Settings {
  theme: ThemeMode;
  units: Units;
  /** The temperature where the jar sits, in °C. 0 means "use the local forecast". */
  kitchenTempC: number;
}

export const DEFAULT_SETTINGS: Settings = { theme: 'system', units: 'metric', kitchenTempC: 0 };

/** Accept anything that was stored, keep what is valid, default the rest. */
export function normalizeSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const temp = typeof r.kitchenTempC === 'number' && Number.isFinite(r.kitchenTempC) ? r.kitchenTempC : 0;
  return {
    theme: r.theme === 'light' || r.theme === 'dark' ? r.theme : 'system',
    units: r.units === 'imperial' ? 'imperial' : 'metric',
    // Outside this range it is a typo, and the forecast is the better guess.
    kitchenTempC: temp >= -10 && temp <= 60 ? temp : 0,
  };
}

export const loadSettings = (key: string): Settings => loadJson(key, DEFAULT_SETTINGS, normalizeSettings);
export const saveSettings = (key: string, s: Settings): boolean => saveJson(key, s);

/**
 * "System" removes the attribute so the stylesheet follows the device;
 * light and dark set it so the stylesheet overrides the device.
 */
export function applyTheme(theme: ThemeMode, root: HTMLElement = document.documentElement): void {
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}
