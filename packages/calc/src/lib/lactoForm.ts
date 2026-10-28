/**
 * The lacto-ferment form: what has been chosen, and the rules that keep the
 * choices consistent (picking a style resets the vegetable and salt, a combo
 * brings its own method, a mix is weighted by grams...).
 *
 * Pure functions over a plain object, so the Expo hook and the web app run
 * the same rules and both are tested here. No React, storage or network.
 */
import type { FermentHistoryEntry, FermentMethod, FermentType, HourlyPoint, PrepSize, SaltCrystal, UnitSystem, WaterHardness } from '../models/types';
import { FERMENT_PRESETS, PRESET_DEFAULT_VEG, VEG_COMBOS, type VegCombo } from '../data/fermentPresets';
import { VEG_RELEASE_FACTOR, findVeg, type VegEntry } from '../data/vegetables';
import { fermentSignature } from './fermentHistory';
import { DEFAULT_BRINE_WATER_G, buildComboSetup, effectivePrepSize, recommendedSaltPct } from './fermentSetup';
import { planLacto, type LactoPlan, type LactoVeg } from './lactoPlan';

export interface MixEntry {
  vegId: string;
  grams: string;
}

export interface LactoForm {
  fermentType: FermentType;
  /** Set by a curated combo, which carries its own method; null follows the style. */
  methodOverride: FermentMethod | null;
  /** The curated combo loaded, if any. Combos run as the `custom` style. */
  comboId: string | null;
  vegId: string;
  vegWeight: string;
  /** Two or more vegetables; empty means the single vegetable above. */
  vegMix: MixEntry[];
  waterAmount: string;
  saltPct: string;
  saltType: SaltCrystal;
  prepSize: PrepSize;
  useStarter: boolean;
}

export const DEFAULT_LACTO_FORM: LactoForm = {
  fermentType: 'sauerkraut',
  methodOverride: null,
  comboId: null,
  vegId: 'green-cabbage',
  vegWeight: '1000',
  vegMix: [],
  waterAmount: '500',
  saltPct: '2.0',
  saltType: 'maldon-flake',
  prepSize: 'shredded',
  useStarter: false,
};

export const methodOf = (f: LactoForm): FermentMethod => f.methodOverride ?? FERMENT_PRESETS[f.fermentType]!.method;
export const comboOf = (f: LactoForm): VegCombo | null => (f.comboId ? VEG_COMBOS.find((c) => c.id === f.comboId) ?? null : null);

/** The name and emoji to show for the ferment: the combo's own when one is loaded, else the style's. */
export function styleLabel(f: LactoForm): { name: string; emoji: string } {
  const c = comboOf(f);
  const p = FERMENT_PRESETS[f.fermentType]!;
  return { name: c?.name ?? p.name, emoji: c?.emoji ?? p.emoji };
}

const grams = (s: string): number => parseFloat(s) || 0;

export interface ResolvedVeg {
  veg: LactoVeg;
  isMultiVeg: boolean;
  totalMixGrams: number;
  mixEntries: Array<MixEntry & { veg: VegEntry }>;
}

/** The vegetable, or the mix weighted by grams, as one set of properties. */
export function resolveVeg(form: LactoForm): ResolvedVeg {
  const veg = findVeg(form.vegId);
  const mixEntries = form.vegMix.map((m) => ({ ...m, veg: findVeg(m.vegId) }));
  const isMultiVeg = mixEntries.length > 1;
  const totalMixGrams = mixEntries.reduce((s, m) => s + grams(m.grams), 0);
  if (!isMultiVeg) {
    return { veg: { ...veg, releaseFactor: VEG_RELEASE_FACTOR[veg.category] }, isMultiVeg, totalMixGrams, mixEntries };
  }

  const total = totalMixGrams || 1;
  const weighted = (pick: (v: VegEntry) => number) => mixEntries.reduce((s, m) => s + pick(m.veg) * grams(m.grams), 0) / total;
  const counts = { soft: 0, medium: 0, firm: 0 };
  mixEntries.forEach((m) => { counts[m.veg.firmness]++; });
  const firmness = counts.firm >= counts.soft && counts.firm >= counts.medium ? 'firm' : counts.medium >= counts.soft ? 'medium' : 'soft';
  // The acid balance of a mix is only known when EVERY component has been
  // titrated; otherwise it stays unknown rather than extrapolating.
  const measured = mixEntries.filter((m) => m.veg.acidBalance);
  const acidBalance = measured.length === mixEntries.length && measured.length > 0
    ? {
        acidDemandMmolL: mixEntries.reduce((s, m) => s + m.veg.acidBalance!.acidDemandMmolL * grams(m.grams), 0) / total,
        sugarSupplyMmolL: mixEntries.reduce((s, m) => s + m.veg.acidBalance!.sugarSupplyMmolL * grams(m.grams), 0) / total,
        // The endpoint of a novel mix has not been measured.
        measuredEndPH: undefined,
      }
    : undefined;

  return {
    isMultiVeg,
    totalMixGrams,
    mixEntries,
    veg: {
      ...veg,
      acidBalance,
      bloaterProne: mixEntries.some((m) => m.veg.bloaterProne),
      waterContentPct: Math.round(weighted((v) => v.waterContentPct)),
      speedFactor: Math.round(weighted((v) => v.speedFactor) * 100) / 100,
      typicalBrineSaltPct: Math.round(weighted((v) => v.typicalBrineSaltPct) * 10) / 10,
      typicalDrySaltPct: Math.round(weighted((v) => v.typicalDrySaltPct) * 10) / 10,
      releaseFactor: Math.round(weighted((v) => VEG_RELEASE_FACTOR[v.category]) * 100) / 100,
      firmness,
      name: mixEntries.map((m) => m.veg.name).join(' + '),
      emoji: mixEntries.map((m) => m.veg.emoji).join(''),
    },
  };
}

/** Choosing a style resets the vegetable, salt, cut and water to what that style usually uses. */
export function selectPreset(form: LactoForm, type: FermentType): LactoForm {
  const p = FERMENT_PRESETS[type]!;
  const vegId = PRESET_DEFAULT_VEG[type] ?? 'green-cabbage';
  const veg = findVeg(vegId);
  return {
    ...form,
    fermentType: type,
    methodOverride: null,
    comboId: null,
    vegMix: [],
    vegId,
    vegWeight: String(veg.typicalWeight),
    saltPct: String(recommendedSaltPct(veg, p.method)),
    prepSize: p.referencePrep,
    waterAmount: p.method === 'brine' ? String(DEFAULT_BRINE_WATER_G) : '0',
  };
}

/** Choosing a vegetable resets the weight, salt and water to what it usually needs. */
export function selectVeg(form: LactoForm, id: string): LactoForm {
  const v = findVeg(id);
  const method = methodOf(form);
  return {
    ...form,
    vegId: id,
    vegWeight: String(v.typicalWeight),
    saltPct: String(recommendedSaltPct(v, method)),
    waterAmount: method === 'brine' ? String(DEFAULT_BRINE_WATER_G) : '0',
  };
}

/** Add or remove a vegetable from the mix. Down to one vegetable returns to the single-vegetable form. */
export function toggleVegInMix(form: LactoForm, id: string): LactoForm {
  const base = { ...form, comboId: null }; // hand-editing the mix means it is no longer the curated combo
  const exists = form.vegMix.some((m) => m.vegId === id);
  if (exists) {
    const next = form.vegMix.filter((m) => m.vegId !== id);
    if (next.length === 1) return { ...base, vegId: next[0]!.vegId, vegWeight: next[0]!.grams, vegMix: [] };
    return { ...base, vegMix: next };
  }
  const entry: MixEntry = { vegId: id, grams: String(findVeg(id).typicalWeight) };
  if (form.vegMix.length === 0) {
    // The first addition starts the mix from the vegetable already chosen.
    if (id === form.vegId) return form;
    return { ...base, vegMix: [{ vegId: form.vegId, grams: form.vegWeight }, entry] };
  }
  return { ...base, vegMix: [...form.vegMix, entry] };
}

export function updateMixGrams(form: LactoForm, id: string, g: string): LactoForm {
  return { ...form, vegMix: form.vegMix.map((m) => (m.vegId === id ? { ...m, grams: g } : m)) };
}

export const clearMix = (form: LactoForm): LactoForm => ({ ...form, vegMix: [], comboId: null });

/** A curated combo brings its own method, mix, salt, cut and water. */
export function applyCombo(form: LactoForm, combo: VegCombo): LactoForm {
  const setup = buildComboSetup(combo);
  return {
    ...form,
    fermentType: setup.fermentType,
    methodOverride: setup.method,
    comboId: combo.id,
    vegId: setup.vegId,
    vegMix: setup.vegMix,
    saltPct: setup.saltPct,
    prepSize: combo.referencePrep,
    waterAmount: setup.waterAmount,
  };
}

/** Load a past ferment back in, restoring the method and combo together with the numbers. */
export function restoreFrom(form: LactoForm, entry: FermentHistoryEntry): LactoForm {
  const presetForType = FERMENT_PRESETS[entry.fermentType]!;
  return {
    ...form,
    fermentType: entry.fermentType,
    methodOverride: entry.method === presetForType.method ? null : entry.method,
    comboId: entry.comboId && VEG_COMBOS.some((c) => c.id === entry.comboId) ? entry.comboId : null,
    vegId: entry.vegId,
    vegWeight: entry.vegWeight,
    vegMix: entry.vegMix ?? [],
    waterAmount: entry.waterAmount,
    saltPct: entry.saltPct,
    saltType: entry.saltType,
    prepSize: entry.prepSize,
    useStarter: entry.useStarter,
  };
}

export interface LactoEnv {
  hourlyForecast: HourlyPoint[] | null;
  currentTemp: number | null;
  /** The user's own jar temperature (°C); 0 means use the forecast. */
  fermTempOverride: number;
  hardness: WaterHardness;
  unitSystem: UnitSystem;
}

export function planFromForm(form: LactoForm, env: LactoEnv): LactoPlan {
  const { veg, isMultiVeg, totalMixGrams } = resolveVeg(form);
  const combo = comboOf(form);
  return planLacto({
    fermentType: form.fermentType,
    method: methodOf(form),
    preset: FERMENT_PRESETS[form.fermentType]!,
    combo,
    veg,
    isMultiVeg,
    totalMixGrams,
    vegWeight: form.vegWeight,
    waterAmount: form.waterAmount,
    saltPct: form.saltPct,
    saltType: form.saltType,
    prepSize: form.prepSize,
    useStarter: form.useStarter,
    hourlyForecast: env.hourlyForecast,
    currentTemp: env.currentTemp,
    fermTempOverride: env.fermTempOverride,
    hardness: env.hardness,
    unitSystem: env.unitSystem,
  });
}

/** What to record in the history for a ferment that has been worked out; null while it has no result. */
export function historyDraft(form: LactoForm, plan: LactoPlan): Omit<FermentHistoryEntry, 'id' | 'createdAt'> | null {
  if (!plan.ok) return null;
  const { veg, isMultiVeg, totalMixGrams } = resolveVeg(form);
  const combo = comboOf(form);
  const preset = FERMENT_PRESETS[form.fermentType]!;
  const method = methodOf(form);
  const prep = effectivePrepSize(method, (combo ?? preset).referencePrep, form.prepSize);
  return {
    presetName: styleLabel(form).name,
    presetEmoji: styleLabel(form).emoji,
    method,
    vegName: veg.name,
    fermentType: form.fermentType,
    comboId: combo?.id,
    vegId: form.vegId,
    vegWeight: isMultiVeg ? String(totalMixGrams) : form.vegWeight,
    waterAmount: form.waterAmount,
    saltPct: form.saltPct,
    saltType: form.saltType,
    prepSize: prep,
    useStarter: form.useStarter,
    vegMix: form.vegMix,
    results: {
      saltGrams: plan.results.saltGrams,
      estimatedDays: plan.results.estimatedDays,
      tempC: Math.round(plan.tempC * 10) / 10,
    },
    signature: fermentSignature({
      fermentType: form.fermentType,
      method,
      vegId: form.vegId,
      vegWeight: isMultiVeg ? String(Math.round(totalMixGrams)) : form.vegWeight,
      waterAmount: form.waterAmount,
      saltPct: form.saltPct,
      saltType: form.saltType,
      prepSize: prep,
      useStarter: form.useStarter,
      vegMix: form.vegMix,
    }),
  };
}
