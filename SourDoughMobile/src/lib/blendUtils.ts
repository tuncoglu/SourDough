/**
 * Flour blend utilities — consolidated from flourSearch.ts and calculations.ts.
 *
 * All blend composition, validation, protein calculation, and ferment factor
 * resolution lives here.
 */
import { FlourBlendEntry, FlourCategory, FlourEntry, RecipeInputs } from '../models/types';
import { findFlour } from './flourSearch';

// ── Flour Fermentation Factors ──────────────────────────────────────────
/**
 * Different flour categories ferment at different speeds.
 * Reference: Hammelman, "Bread"; Gisslen, "Professional Baking" 9th ed.
 */
const FLOUR_FERMENT_FACTORS: Record<FlourCategory, number> = {
  'White Bread': 1.0,
  'Cake & Pastry': 1.0,
  'Brown, Malted & Seeded': 1.15,
  'Wholemeal': 1.3,
  'Spelt': 1.2,
  'Ancient & Heritage': 1.2,
  'Rye': 1.5,
  'Other Grains': 1.0,
  'Gluten-Free': 0.7,
  'Malt & Brewing': 1.0,
  'Generic': 1.0,
};

// ── Blend Construction ──────────────────────────────────────────────────

/**
 * Normalize RecipeInputs into a FlourBlendEntry array.
 * New recipes carry flourBlend populated; legacy recipes with only scalar
 * flourType/flourProtein/flourProductNo get a single-entry array synthesized.
 */
export function getBlend(inputs: RecipeInputs): FlourBlendEntry[] {
  if (inputs.flourBlend && inputs.flourBlend.length > 0) {
    return inputs.flourBlend;
  }
  // Legacy recipe — synthesize from scalar fields
  const flour = findFlour(inputs.flourType);
  return [
    {
      label: flour.label,
      protein: flour.protein,
      productNumber: flour.productNumber,
      category: flour.category,
      percentage: 100,
    },
  ];
}

/** Compact display label for a flour or blend. */
export function getBlendDisplayLabel(inputs: RecipeInputs): string {
  const blend = getBlend(inputs);
  if (blend.length === 1) return blend[0].label;
  return blend
    .map((e) => `${e.percentage.toFixed(0)}% ${shortenLabel(e.label)}`)
    .join(' + ');
}

/** Build a FlourBlendEntry array from a list of gram-weighted rows. */
export function buildBlendFromRows(
  rows: { flour: FlourEntry; grams: number }[],
): FlourBlendEntry[] {
  const total = rows.reduce((sum, r) => sum + r.grams, 0);
  return rows.map((row) => ({
    label: row.flour.label,
    protein: row.flour.protein,
    productNumber: row.flour.productNumber,
    category: row.flour.category,
    percentage: total > 0 ? (row.grams / total) * 100 : 0,
  }));
}

// ── Validation ──────────────────────────────────────────────────────────

/**
 * Validate a flour blend. Returns null if valid, or an error message string.
 * Percentages must sum to 100% within ±0.5 tolerance.
 */
export function validateBlend(blend: FlourBlendEntry[]): string | null {
  if (!blend || blend.length === 0) return 'At least one flour is required.';
  if (blend.length > 3) return 'Maximum 3 flours allowed.';

  for (const entry of blend) {
    if (entry.percentage <= 0 || isNaN(entry.percentage)) {
      return `"${entry.label}" has an invalid percentage.`;
    }
  }

  const sum = blend.reduce((s, e) => s + e.percentage, 0);
  if (Math.abs(sum - 100) > 0.5) {
    return `Flour percentages sum to ${sum.toFixed(1)}% — must total 100%.`;
  }

  return null;
}

// ── Protein ─────────────────────────────────────────────────────────────

/** Weighted-average protein percentage for a multi-flour blend. */
export function getBlendProtein(blend: FlourBlendEntry[]): number {
  if (blend.length === 0) return 0;
  let total = 0;
  for (const entry of blend) {
    total += entry.protein * (entry.percentage / 100);
  }
  return Math.round(total * 10) / 10;
}

// ── Ferment Factor ──────────────────────────────────────────────────────

/** Weighted-average ferment factor for a multi-flour blend. */
export function getBlendFermentFactor(blend: FlourBlendEntry[]): number {
  if (blend.length === 0) return 1.0;
  let total = 0;
  for (const entry of blend) {
    const factor = FLOUR_FERMENT_FACTORS[entry.category] ?? 1.0;
    total += factor * (entry.percentage / 100);
  }
  return total;
}

/** Look up the fermentation speed factor for a single flour by its label. */
export function getFlourFermentFactor(flourLabel: string): number {
  const flour = findFlour(flourLabel);
  return FLOUR_FERMENT_FACTORS[flour.category] ?? 1.0;
}

/** Resolve a flour argument (string label or blend array) to a ferment factor. */
export function resolveFermentFactor(flour: string | FlourBlendEntry[]): number {
  if (typeof flour === 'string') {
    return getFlourFermentFactor(flour);
  }
  return getBlendFermentFactor(flour);
}

// ── Merge Starter Flour Into Blend ──────────────────────────────────────

/**
 * Merge the fresh flour blend with the flour contributed by the starter.
 * The starter flour's category affects fermentation, so it must be included
 * in the weighted-average ferment factor alongside the fresh flour blend.
 */
export function mergeBlendWithStarter(
  blend: FlourBlendEntry[] | undefined,
  starterFlourLabel: string | undefined,
  freshFlourWeight: number,
  flourFromStarter: number,
): FlourBlendEntry[] {
  const totalFlour = freshFlourWeight + flourFromStarter;
  if (totalFlour <= 0) return blend ?? [];

  const starterFlour = findFlour(starterFlourLabel ?? 'Generic: Bread Flour');

  // Build a map keyed by label to merge duplicate flours
  const merged: Record<string, { entry: FlourBlendEntry; grams: number }> = {};

  // Add fresh flour components
  if (blend && blend.length > 0) {
    for (const entry of blend) {
      const grams = freshFlourWeight * (entry.percentage / 100);
      const key = entry.label;
      if (merged[key]) {
        merged[key].grams += grams;
      } else {
        merged[key] = { entry: { ...entry }, grams };
      }
    }
  } else {
    // Legacy: single flour from scalar fields. Synthesize a single-entry blend
    // from the fresh flour data (caller provides at least one entry).
    // If blend is empty/undefined, the starter flour becomes the only entry.
  }

  // Add starter flour component
  const starterKey = starterFlour.label;
  if (merged[starterKey]) {
    merged[starterKey].grams += flourFromStarter;
  } else {
    merged[starterKey] = {
      entry: {
        label: starterFlour.label,
        protein: starterFlour.protein,
        productNumber: starterFlour.productNumber,
        category: starterFlour.category,
        percentage: 0,
      },
      grams: flourFromStarter,
    };
  }

  // Convert back to FlourBlendEntry[] with recalculated percentages
  return Object.values(merged).map(({ entry, grams }) => ({
    ...entry,
    percentage: (grams / totalFlour) * 100,
  }));
}

// ── Display Helpers ─────────────────────────────────────────────────────

/** Strip parenthetical product numbers from flour labels for compact display. */
export function shortenLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)$/, '').replace(/\s*Organic$/, '');
}

/**
 * Category colours for blend visualisation bars.
 * Mapped by FlourCategory to a hex colour representing that flour type.
 */
export const CATEGORY_COLORS: Record<FlourCategory, string> = {
  'White Bread': '#E8D5B7',
  'Wholemeal': '#8B6914',
  'Brown, Malted & Seeded': '#A0825A',
  'Spelt': '#C4956A',
  'Ancient & Heritage': '#B8956A',
  'Rye': '#6B5344',
  'Other Grains': '#C4A882',
  'Cake & Pastry': '#F0E0C8',
  'Gluten-Free': '#D4C5B2',
  'Malt & Brewing': '#7B6040',
  'Generic': '#BFB5AD',
};
