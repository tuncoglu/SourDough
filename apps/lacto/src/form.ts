/**
 * What the app remembers between visits: the form, the last weather reading,
 * and whether to look the weather up on opening. Everything stored is
 * validated on the way back in, so an old or damaged value can never put the
 * calculator into a state it cannot render.
 */
import type { PrepSize, SaltCrystal } from '@sourdough/calc/models/types';
import { PREP_SIZE_ORDER, SALT_LABELS } from '@sourdough/calc/models/types';
import { FERMENT_PRESETS, VEG_COMBOS } from '@sourdough/calc/data/fermentPresets';
import { VEGETABLES } from '@sourdough/calc/data/vegetables';
import { DEFAULT_LACTO_FORM, type LactoForm, type MixEntry } from '@sourdough/calc/lib/lactoForm';
import type { Weather } from '@sourdough/core/weather';

export interface AppState {
  form: LactoForm;
  /** The last weather read, if the person asked for it. */
  weather: Weather | null;
  /** Detect the weather automatically when the app opens (asks for location permission). */
  autoDetect: boolean;
}

export const DEFAULT_STATE: AppState = { form: DEFAULT_LACTO_FORM, weather: null, autoDetect: false };

const isNum = (v: unknown): v is string => typeof v === 'string' && /^\d*\.?\d*$/.test(v);
const vegIds = new Set(VEGETABLES.map((v) => v.id));

function normalizeMix(raw: unknown): MixEntry[] {
  if (!Array.isArray(raw)) return [];
  const mix = raw.filter((m): m is MixEntry => !!m && vegIds.has((m as MixEntry).vegId) && isNum((m as MixEntry).grams));
  // One vegetable is not a mix; the single-vegetable form holds it.
  return mix.length >= 2 ? mix : [];
}

export function normalizeForm(raw: unknown): LactoForm {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_LACTO_FORM;
  const type = typeof r.fermentType === 'string' && r.fermentType in FERMENT_PRESETS ? (r.fermentType as LactoForm['fermentType']) : d.fermentType;
  const method = r.methodOverride === 'dry' || r.methodOverride === 'brine' || r.methodOverride === 'mash' ? r.methodOverride : null;
  const comboId = typeof r.comboId === 'string' && VEG_COMBOS.some((c) => c.id === r.comboId) ? r.comboId : null;
  return {
    fermentType: type,
    // A method override and a combo only mean something together.
    methodOverride: comboId ? method : null,
    comboId,
    vegId: typeof r.vegId === 'string' && vegIds.has(r.vegId) ? r.vegId : d.vegId,
    vegWeight: isNum(r.vegWeight) ? r.vegWeight : d.vegWeight,
    vegMix: normalizeMix(r.vegMix),
    waterAmount: isNum(r.waterAmount) ? r.waterAmount : d.waterAmount,
    saltPct: isNum(r.saltPct) ? r.saltPct : d.saltPct,
    saltType: typeof r.saltType === 'string' && r.saltType in SALT_LABELS ? (r.saltType as SaltCrystal) : d.saltType,
    prepSize: PREP_SIZE_ORDER.includes(r.prepSize as PrepSize) ? (r.prepSize as PrepSize) : d.prepSize,
    useStarter: r.useStarter === true,
  };
}

export function normalizeState(raw: unknown): AppState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const w = r.weather as Partial<Weather> | null | undefined;
  const weather: Weather | null =
    w && typeof w.tempC === 'number' && Number.isFinite(w.tempC) && typeof w.at === 'number' && Array.isArray(w.hourly)
      ? { tempC: w.tempC, at: w.at, hourly: w.hourly.filter((h) => h && typeof h.datetime === 'string' && typeof h.tempC === 'number') }
      : null;
  return { form: normalizeForm(r.form), weather, autoDetect: r.autoDetect === true };
}
