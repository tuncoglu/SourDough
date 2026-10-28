/**
 * The yogurt form: what the person has chosen, and the rules that keep it
 * consistent. Pure functions, so the rules are tested without a browser.
 */
import type { StarterSource, YogurtType } from '@sourdough/calc/models/types';
import { DEFAULT_MILK_ID, MILK_TYPES, YOGURT_CULTURES } from '@sourdough/calc/data/yogurtCultures';
import { calculateSachets } from '@sourdough/calc/lib/yogurtCalculations';
import { normalizeWeather, type Weather } from '@sourdough/core/weather';

/** Grams of previous-batch yogurt per litre of milk (about two tablespoons). */
export const BATCH_GRAMS_PER_LITRE = 30;

export interface Form {
  yogurtType: YogurtType;
  milkId: string;
  milkLitres: string;
  starterSource: StarterSource;
  sachetCount: string;
  previousBatchGrams: string;
  /** True once the person typed the amount, so a change of milk volume no longer rewrites it. */
  sachetTouched: boolean;
  batchTouched: boolean;
  preHeat: boolean;
  /** Detect the weather automatically when the app opens (asks for location permission). */
  autoDetect: boolean;
}

export interface AppState {
  form: Form;
  /** The last weather read, if the person asked for it. */
  weather: Weather | null;
}

const num = (s: string): number => parseFloat(s) || 0;
const fmt = (n: number): string => String(Math.round(n * 100) / 100);

export function defaultsFor(type: YogurtType): Pick<Form, 'milkLitres' | 'sachetCount' | 'previousBatchGrams' | 'preHeat' | 'sachetTouched' | 'batchTouched' | 'starterSource'> {
  const p = YOGURT_CULTURES[type]!;
  return {
    milkLitres: String(p.typicalMilkLitres),
    sachetCount: String(calculateSachets(p.typicalMilkLitres, p.starterRatio)),
    previousBatchGrams: String(p.typicalMilkLitres * BATCH_GRAMS_PER_LITRE),
    // A thermophilic set is firmer after pre-heating; a mesophilic one is not usually heated.
    preHeat: p.type === 'thermophilic',
    sachetTouched: false,
    batchTouched: false,
    starterSource: 'sachet',
  };
}

export const DEFAULT_FORM: Form = {
  yogurtType: 'bulgarian',
  milkId: DEFAULT_MILK_ID,
  autoDetect: false,
  ...defaultsFor('bulgarian'),
};

export const DEFAULT_STATE: AppState = { form: DEFAULT_FORM, weather: null };

/** Choosing a culture resets the amounts to what that culture usually needs. */
export function selectCulture(form: Form, type: YogurtType): Form {
  // Vegan culture needs plant milk; leaving it puts cow's milk back.
  const milkId = type === 'vegan-soya' ? 'soya' : form.milkId === 'soya' ? DEFAULT_MILK_ID : form.milkId;
  return { ...form, ...defaultsFor(type), yogurtType: type, milkId };
}

/** Changing the milk volume re-derives the starter amounts the person has not typed themselves. */
export function setLitres(form: Form, litres: string): Form {
  const next: Form = { ...form, milkLitres: litres };
  const l = num(litres);
  if (l <= 0) return next;
  const preset = YOGURT_CULTURES[form.yogurtType]!;
  if (!form.sachetTouched) next.sachetCount = String(calculateSachets(l, preset.starterRatio));
  if (!form.batchTouched) next.previousBatchGrams = fmt(l * BATCH_GRAMS_PER_LITRE);
  return next;
}

export const setSachets = (form: Form, v: string): Form => ({ ...form, sachetCount: v, sachetTouched: true });
export const setBatchGrams = (form: Form, v: string): Form => ({ ...form, previousBatchGrams: v, batchTouched: true });

/** What the starter field should hold for this much milk, for the "calculated for you" hint. */
export function recommendedSachets(form: Form): number {
  const preset = YOGURT_CULTURES[form.yogurtType]!;
  return calculateSachets(num(form.milkLitres) || preset.typicalMilkLitres, preset.starterRatio);
}

/** Accept whatever was stored, keep what is valid, default the rest. */
export function normalizeState(raw: unknown): AppState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const f = (r.form && typeof r.form === 'object' ? r.form : {}) as Record<string, unknown>;
  const type = typeof f.yogurtType === 'string' && f.yogurtType in YOGURT_CULTURES ? (f.yogurtType as YogurtType) : DEFAULT_FORM.yogurtType;
  const base = { ...DEFAULT_FORM, ...defaultsFor(type), yogurtType: type };
  const str = (v: unknown, d: string) => (typeof v === 'string' && /^\d*\.?\d*$/.test(v) ? v : d);
  const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d);
  const weather = normalizeWeather(r.weather);
  return {
    form: {
      ...base,
      milkId: typeof f.milkId === 'string' && MILK_TYPES.some((m) => m.id === f.milkId) ? f.milkId : base.milkId,
      milkLitres: str(f.milkLitres, base.milkLitres),
      starterSource: f.starterSource === 'previous-batch' ? 'previous-batch' : 'sachet',
      sachetCount: str(f.sachetCount, base.sachetCount),
      previousBatchGrams: str(f.previousBatchGrams, base.previousBatchGrams),
      sachetTouched: bool(f.sachetTouched, false),
      batchTouched: bool(f.batchTouched, false),
      preHeat: bool(f.preHeat, base.preHeat),
      autoDetect: bool(f.autoDetect, false),
    },
    weather,
  };
}
