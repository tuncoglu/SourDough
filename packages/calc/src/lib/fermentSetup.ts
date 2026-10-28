/**
 * Curated-combo → calculator setup.
 *
 * Why this exists as its own pure module: a combo carries its **own**
 * method (`VEG_COMBOS[].method`), but applying one used to just switch the
 * ferment type to `custom` and copy the vegetables. Because `method` was
 * derived from the preset, every combo silently ran as the custom preset's
 * brine — so "Pineapple + Habanero Hot Sauce" (a mash) was timed and
 * salted as a brine ferment, and applying a brine combo straight after a
 * mash preset left the water input at 0 and failed validation.
 *
 * Keeping the mapping here (instead of inline in the hook) means it can be
 * unit-tested without a React runtime — see __tests__/fermentSetup.test.ts.
 */
import { FermentMethod, FermentPreset, FermentType, PrepSize } from '../models/types';
import { VegCombo } from '../data/fermentPresets';
import { findVeg, VegEntry } from '../data/vegetables';

/** Brine combos start from the same 500 g default as the brine presets. */
export const DEFAULT_BRINE_WATER_G = 500;

export interface ComboSetup {
  fermentType: FermentType;
  /** The combo's own method — dry, brine, or mash. */
  method: FermentMethod;
  /** First vegetable in the combo, used for the single-veg picker display. */
  vegId: string;
  vegMix: { vegId: string; grams: string }[];
  saltPct: string;
  /** Water only applies to brine; dry and mash combos must send 0. */
  waterAmount: string;
}

/** Turn a curated combo into the full set of calculator inputs. */
export function buildComboSetup(combo: VegCombo): ComboSetup {
  const vegMix = combo.vegetables.map((v) => ({
    vegId: v.vegId,
    grams: String(Math.round(combo.typicalTotalGrams * v.proportion)),
  }));

  return {
    fermentType: 'custom',
    method: combo.method,
    vegId: combo.vegetables[0].vegId,
    vegMix,
    saltPct: String(combo.typicalSaltPct),
    waterAmount: combo.method === 'brine' ? String(DEFAULT_BRINE_WATER_G) : '0',
  };
}

/**
 * The salt % the app recommends for a vegetable under a given method.
 *
 * Single source of truth for BOTH the prefilled salt input and the timing
 * anchor. They used to come from different places — the input from the
 * vegetable, the anchor from the preset — so accepting our own
 * recommendation could register as "you salted differently from the recipe"
 * and add a phantom time adjustment.
 */
export function recommendedSaltPct(veg: VegEntry, method: FermentMethod): number {
  return method === 'brine' ? veg.typicalBrineSaltPct : veg.typicalDrySaltPct;
}

/**
 * The cut size that actually applies to a ferment.
 *
 * A mash is blended by definition, so a cut-size selection is meaningless
 * there — and letting one through multiplied a pepper-mash estimate by 2.3×
 * for a combination that cannot physically exist (the salt model already
 * assumes every cell is ruptured, which is what blending does). For every
 * other method the user's choice stands.
 */
export function effectivePrepSize(
  method: FermentMethod,
  referencePrep: PrepSize,
  chosen: PrepSize,
): PrepSize {
  return method === 'mash' ? referencePrep : chosen;
}

// ── Timing anchors ──────────────────────────────────────────────────────

/**
 * Gram-weighted fermentation rate of a vegetable mix.
 *
 * Every recipe states `typicalDays` for a *reference* vegetable
 * composition; the estimate is that number scaled by how much faster or
 * slower the user's actual vegetables are (see estimateFermentDuration).
 */
export function mixSpeedFactor(mix: { vegId: string; grams: number | string }[]): number {
  const weights = mix.map((m) => Math.max(0, Number(m.grams) || 0));
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return 1;
  return mix.reduce(
    (sum, m, i) => sum + findVeg(m.vegId).speedFactor * (weights[i] / total),
    0,
  );
}

/**
 * Rate a preset's `typicalDays` is anchored to: its own default vegetable.
 */
export function presetReferenceSpeed(preset: FermentPreset): number {
  return findVeg(preset.defaultVegId).speedFactor;
}

/**
 * Rate a combo's `typicalDays` is anchored to: the combo's own mix, built
 * through the same rounding the calculator uses, so applying a combo gives
 * a ratio of exactly 1 and therefore exactly the documented number of days.
 */
export function comboReferenceSpeed(combo: VegCombo): number {
  return mixSpeedFactor(buildComboSetup(combo).vegMix);
}

/**
 * How much faster/slower the actual vegetable mix is than the recipe's
 * reference — the `vegSpeedRatio` that estimateFermentDuration scales by.
 */
export function relativeVegSpeed(actualSpeed: number, referenceSpeed: number): number {
  if (!(referenceSpeed > 0) || !(actualSpeed > 0)) return 1;
  return actualSpeed / referenceSpeed;
}
