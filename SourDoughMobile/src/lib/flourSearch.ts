import { SHIPTON_MILL_FLOURS, FLOUR_LABELS } from '../data/flours';
import { FlourEntry, FlourBlendEntry, RecipeInputs } from '../models/types';

/**
 * Fuzzy-match a user's flour query against the catalogue.
 * Returns the matched FlourEntry. Falls back to Generic: Bread Flour.
 */
export function findFlour(query: string): FlourEntry {
  const q = query.toLowerCase().trim();
  if (!q) return getDefault();

  // Direct label match
  const direct = SHIPTON_MILL_FLOURS.find((f) => f.label.toLowerCase() === q);
  if (direct) return direct;

  // Product number match
  const byPno = SHIPTON_MILL_FLOURS.find(
    (f) => f.productNumber.toLowerCase() === q,
  );
  if (byPno) return byPno;

  // Prefix match (e.g. "no. 4" matches "No. 4 Organic White")
  for (const flour of SHIPTON_MILL_FLOURS) {
    const key = flour.label.toLowerCase();
    if (key.startsWith(q) || key.includes(q)) return flour;
  }

  // Word-by-word scoring
  let bestScore = 0;
  let bestFlour: FlourEntry | null = null;
  const qWords = new Set(q.split(/\s+/));

  for (const flour of SHIPTON_MILL_FLOURS) {
    const kWords = new Set(flour.label.toLowerCase().split(/\s+/));
    const intersection = [...qWords].filter((w) => kWords.has(w)).length;
    if (intersection > bestScore) {
      bestScore = intersection;
      bestFlour = flour;
    }
  }

  if (bestFlour && bestScore >= 1) return bestFlour;

  return getDefault();
}

/** Return best guess for matched label */
export function findFlourLabel(query: string): string {
  return findFlour(query).label;
}

function getDefault(): FlourEntry {
  return (
    SHIPTON_MILL_FLOURS.find((f) => f.label === 'Generic: Bread Flour') ?? {
      label: 'Generic: Bread Flour',
      protein: 12.5,
      productNumber: '-',
      category: 'Generic',
      notes: 'Fallback.',
    }
  );
}

// ── Blend Utilities ─────────────────────────────────────────────────────

/**
 * Normalize a RecipeInputs into a FlourBlendEntry array.
 * New recipes have flourBlend populated; legacy recipes with only scalar
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

/** Strip parenthetical product numbers from flour labels for compact display. */
function shortenLabel(label: string): string {
  // Remove " (NNN)" or " Organic (NNN)" suffixes
  return label.replace(/\s*\([^)]*\)$/, '').replace(/\s*Organic$/, '');
}
