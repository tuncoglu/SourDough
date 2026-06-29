import { SHIPTON_MILL_FLOURS, FLOUR_LABELS } from '../data/flours';
import { FlourEntry } from '../models/types';

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
