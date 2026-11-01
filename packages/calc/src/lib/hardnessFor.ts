/**
 * Which water hardness to use, and where it came from, in the order the
 * person would expect: a number they typed beats a UK postcode they typed,
 * which beats a town found from their location, which beats an assumption.
 * Pure: the tables are bundled, so a postcode needs no network at all.
 */
import type { WaterHardness } from '../models/types';
import { lookupWaterHardness } from '../data/waterHardness';
import { looksLikeUkPostcode } from '../data/ukWaterHardness';
import { FALLBACK_HARDNESS, buildManualHardness } from './hardnessUtils';

export type HardnessSource = 'manual' | 'postcode' | 'location' | 'assumed';

export interface HardnessChoice {
  hardness: WaterHardness;
  source: HardnessSource;
}

// Kept as an export of this module for the callers that already import it from here.
export { looksLikeUkPostcode };

export function hardnessFor(opts: {
  /** mg/L typed by the person; 0 = none. */
  manualMgL?: number;
  postcode?: string;
  place?: { countryCode: string; region: string } | null;
}): HardnessChoice {
  if (opts.manualMgL && opts.manualMgL > 0) return { hardness: buildManualHardness(opts.manualMgL), source: 'manual' };
  if (opts.postcode && looksLikeUkPostcode(opts.postcode)) {
    return { hardness: lookupWaterHardness('GB', '', opts.postcode), source: 'postcode' };
  }
  if (opts.place) {
    const h = lookupWaterHardness(opts.place.countryCode, opts.place.region);
    if (h.key !== FALLBACK_HARDNESS.key) return { hardness: h, source: 'location' };
  }
  return { hardness: FALLBACK_HARDNESS, source: 'assumed' };
}
