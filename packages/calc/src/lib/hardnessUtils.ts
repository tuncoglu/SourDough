/**
 * Shared water hardness resolution utilities.
 *
 * Consolidated from duplicated copies across index.tsx, useRecipeCalculation.ts,
 * useLactoCalculator.ts, and useYogurtCalculator.ts.
 */
import { WaterHardness } from '../models/types';
import { classifyHardness } from '../data/ukWaterHardness';

/** Fallback hardness when neither geolocation nor manual override is available. */
export const FALLBACK_HARDNESS: WaterHardness = {
  mgL: 120,
  classification: classifyHardness(120), // 'slightly hard' on the DWI scale
  note: 'Unknown — assuming moderate',
  key: 'fallback',
};

/** Build a WaterHardness entry from a manually entered mg/L value. */
export function buildManualHardness(mgL: number): WaterHardness {
  return {
    mgL,
    classification: classifyHardness(mgL),
    note: 'Manual override',
    key: 'manual',
  };
}

/**
 * Resolve effective water hardness from manual override, geolocation,
 * or fallback — in priority order.
 */
export function resolveHardness(
  waterHardnessOverride: number,
  locationHardness?: WaterHardness | null,
): WaterHardness {
  if (waterHardnessOverride > 0) return buildManualHardness(waterHardnessOverride);
  if (locationHardness) return locationHardness;
  return FALLBACK_HARDNESS;
}
