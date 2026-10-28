/**
 * What the app remembers: the form, the defaults the person set, the last
 * weather reading, and when the dough was mixed. The feeding log and the saved
 * loaves have their own keys. Everything is validated on the way back in.
 */
import { findFlour } from '@sourdough/calc/lib/flourSearch';
import { DEFAULT_BREAD_FORM, MAX_FLOURS, type BreadForm, type FlourRow } from '@sourdough/calc/lib/breadPlan';
import { FRIDGE_HOURS } from '@sourdough/calc/lib/lazyPlan';
import { normalizeWeather, type Weather } from '@sourdough/core/weather';

export interface BreadDefaults {
  flourLabel: string;
  flourWeight: string;
  waterPct: string;
  saltPct: string;
  starterHydration: string;
}

export const DEFAULT_DEFAULTS: BreadDefaults = {
  flourLabel: 'Generic: Bread Flour',
  flourWeight: '500',
  waterPct: '75',
  saltPct: '2',
  starterHydration: '100',
};

export interface AppState {
  form: BreadForm;
  defaults: BreadDefaults;
  weather: Weather | null;
  autoDetect: boolean;
  /** When the dough was mixed (ISO), so the clock survives closing the app. */
  mixedAt: string | null;
}

/** A loaf the person saved: the whole form, and what it came to, so the list needs no recalculating. */
export interface SavedLoaf {
  id: string;
  createdAt: string;
  form: BreadForm;
  summary: { flourGrams: number; waterPct: number; starterPct: number; riseHours: number | null; flours: string };
}

export function formFromDefaults(d: BreadDefaults): BreadForm {
  return {
    ...DEFAULT_BREAD_FORM,
    flours: [{ key: 'flour_0', label: d.flourLabel, grams: d.flourWeight }],
    waterPct: d.waterPct,
    saltPct: d.saltPct,
    starterHydration: d.starterHydration,
  };
}

export const DEFAULT_STATE: AppState = { form: DEFAULT_BREAD_FORM, defaults: DEFAULT_DEFAULTS, weather: null, autoDetect: false, mixedAt: null };

const isNum = (v: unknown): v is string => typeof v === 'string' && /^\d*\.?\d*$/.test(v);
const flourOk = (label: unknown): label is string => typeof label === 'string' && findFlour(label).label === label;

function normalizeFlours(raw: unknown): FlourRow[] {
  if (!Array.isArray(raw)) return DEFAULT_BREAD_FORM.flours;
  const rows = raw
    .filter((r): r is FlourRow => !!r && flourOk((r as FlourRow).label) && isNum((r as FlourRow).grams) && typeof (r as FlourRow).key === 'string')
    .slice(0, MAX_FLOURS);
  return rows.length > 0 ? rows : DEFAULT_BREAD_FORM.flours;
}

export function normalizeForm(raw: unknown): BreadForm {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_BREAD_FORM;
  const day = typeof r.readyDay === 'number' && Number.isInteger(r.readyDay) && r.readyDay >= 0 && r.readyDay <= 4 ? r.readyDay : d.readyDay;
  const ratio = r.feedRatio === 2 || r.feedRatio === 5 ? r.feedRatio : 1;
  return {
    flours: normalizeFlours(r.flours),
    waterPct: isNum(r.waterPct) ? r.waterPct : d.waterPct,
    starterPct: isNum(r.starterPct) ? r.starterPct : d.starterPct,
    saltPct: isNum(r.saltPct) ? r.saltPct : d.saltPct,
    starterHydration: isNum(r.starterHydration) ? r.starterHydration : d.starterHydration,
    waterTempOverride: typeof r.waterTempOverride === 'string' && /^-?\d*\.?\d*$/.test(r.waterTempOverride) ? r.waterTempOverride : '',
    vessel: r.vessel === 'tin' ? 'tin' : 'cocotte',
    starterMode: r.starterMode === 'fed' ? 'fed' : 'fridge',
    modeChosen: r.modeChosen === true,
    feedRatio: ratio,
    planMode: r.planMode === 'readyBy' ? 'readyBy' : 'now',
    readyDay: day,
    readyTime: typeof r.readyTime === 'string' && r.readyTime.length <= 12 ? r.readyTime : d.readyTime,
    proofMode: r.proofMode === 'fridge' ? 'fridge' : 'counter',
    fridgeHours: isNum(r.fridgeHours) && parseFloat(r.fridgeHours) >= FRIDGE_HOURS.min && parseFloat(r.fridgeHours) <= FRIDGE_HOURS.max ? r.fridgeHours : d.fridgeHours,
  };
}

export function normalizeDefaults(raw: unknown): BreadDefaults {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_DEFAULTS;
  return {
    flourLabel: flourOk(r.flourLabel) ? r.flourLabel : d.flourLabel,
    flourWeight: isNum(r.flourWeight) && parseFloat(r.flourWeight) > 0 ? r.flourWeight : d.flourWeight,
    waterPct: isNum(r.waterPct) && parseFloat(r.waterPct) > 0 ? r.waterPct : d.waterPct,
    saltPct: isNum(r.saltPct) ? r.saltPct : d.saltPct,
    starterHydration: isNum(r.starterHydration) && parseFloat(r.starterHydration) > 0 ? r.starterHydration : d.starterHydration,
  };
}

export function normalizeState(raw: unknown): AppState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const weather = normalizeWeather(r.weather);
  const mixed = typeof r.mixedAt === 'string' && !Number.isNaN(new Date(r.mixedAt).getTime()) ? r.mixedAt : null;
  return { form: normalizeForm(r.form), defaults: normalizeDefaults(r.defaults), weather, autoDetect: r.autoDetect === true, mixedAt: mixed };
}
