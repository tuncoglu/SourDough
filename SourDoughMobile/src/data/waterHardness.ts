import { WaterHardness } from '../models/types';
import { lookupUkPostcodeHardness, classifyHardness } from './ukWaterHardness';

/**
 * Water hardness by country/region (mg/L CaCO₃ → classification).
 * Ported from optimizer.py WATER_HARDNESS_TABLE.
 *
 * Resolution priority:
 *   1. UK postcode district lookup (e.g. "PO6" → Portsmouth zone data)
 *   2. UK postcode area lookup (e.g. "PO" → Portsmouth Water average)
 *   3. Region keyword match (coarse table)
 *   4. Country-level fallback
 *   5. Global default (120 mg/L)
 */
const WATER_HARDNESS_TABLE: Record<string, [number, string, string]> = {
  'us-northeast':     [45,  'soft',            'Granite/glacial aquifers'],
  'us-southeast':     [90,  'moderately soft', 'Coastal plain sediments'],
  'us-midwest':       [220, 'hard',            'Limestone aquifers — very hard in IN/OH'],
  'us-southwest':     [200, 'hard',            'Desert carbonates'],
  'us-west':          [80,  'moderately soft', 'Mountain runoff — softer near coast'],
  'us-pacific':       [35,  'very soft',       'Rain-fed, low mineral content'],
  'ca-east':          [60,  'soft',            'Canadian Shield — granite'],
  'ca-west':          [80,  'moderately soft', 'Mountain sources'],
  'ca-prairies':      [180, 'moderately hard', 'Sedimentary bedrock'],
  'gb-england-se':    [280, 'very hard',       'Chalk downs — London & SE'],
  'gb-england-nw':    [120, 'moderately soft', 'Mixed geology'],
  'gb-scotland':      [30,  'very soft',       'Granite & peat — perfect for bread'],
  'gb-wales':         [60,  'soft',            'Upland catchments'],
  'gb':               [180, 'moderately hard', 'UK fallback — varies by region'],
  'de': [160, 'moderately hard', 'Mixed — harder in south (limestone)'],
  'fr': [180, 'moderately hard', 'Harder in the Paris basin'],
  'it': [200, 'hard',            'Carbonate aquifers — harder in centre/south'],
  'es': [180, 'moderately hard', 'Regional variation high'],
  'nl': [130, 'moderately soft', 'Soft groundwater'],
  'be': [220, 'hard',            'Limestone regions'],
  'ch': [180, 'moderately hard', 'Mountain & carbonate mix'],
  'at': [170, 'moderately hard', 'Alpine sources softer, Vienna basin harder'],
  'pl': [200, 'hard',            'Sedimentary basin'],
  'cz': [160, 'moderately hard', 'Mixed geology'],
  'se': [50,  'soft',            'Granite bedrock'],
  'no': [30,  'very soft',       'Mountain granite'],
  'fi': [40,  'soft',            'Glacial shield'],
  'dk': [220, 'hard',            'Chalk aquifers'],
  'pt': [150, 'moderately hard', 'Mixed — softer north, harder south'],
  'gr': [190, 'moderately hard', 'Limestone & karst'],
  'ie': [130, 'moderately soft', 'Limestone in centre, granite elsewhere'],
  'au-east': [80,  'moderately soft', 'Coastal catchments'],
  'au-west': [130, 'moderately hard', 'Ancient shield — harder bore water'],
  'nz': [50,  'soft',            'Volcanic & rain-fed sources'],
  'jp': [60,  'soft',            'Volcanic geology'],
  'kr': [100, 'moderately soft', 'Mixed geology'],
  'cn': [140, 'moderately hard', 'Very regionally variable'],
  'in': [160, 'moderately hard', 'Harder in central peninsula'],
  'br': [60,  'soft',            'Tropical weathering, many soft sources'],
  'ar': [140, 'moderately hard', 'Pampas aquifer'],
  'cl': [160, 'moderately hard', 'Andean mineral sources'],
  'co': [90,  'moderately soft', 'Mountain catchments'],
  'za': [100, 'moderately soft', 'Mixed geology'],
  'eg': [190, 'moderately hard', 'Nile — moderate to hard'],
  'ng': [80,  'moderately soft', 'Tropical weathering'],
  'il': [180, 'moderately hard', 'Carbonate aquifers'],
  'tr': [170, 'moderately hard', 'Mixed — harder in central plateau'],
  'mx': [160, 'moderately hard', 'Carbonate regions'],
};

const REGION_MAP: Record<string, Record<string, string>> = {
  us: {
    northeast: 'us-northeast', 'new england': 'us-northeast',
    'new york': 'us-northeast', pennsylvania: 'us-northeast',
    southeast: 'us-southeast', florida: 'us-southeast',
    georgia: 'us-southeast', carolina: 'us-southeast',
    midwest: 'us-midwest', ohio: 'us-midwest', indiana: 'us-midwest',
    illinois: 'us-midwest', michigan: 'us-midwest',
    southwest: 'us-southwest', texas: 'us-southwest',
    arizona: 'us-southwest', 'new mexico': 'us-southwest',
    west: 'us-west', colorado: 'us-west', utah: 'us-west',
    nevada: 'us-west', pacific: 'us-pacific',
    california: 'us-pacific', oregon: 'us-pacific', washington: 'us-pacific',
  },
  ca: {
    ontario: 'ca-east', québec: 'ca-east', quebec: 'ca-east',
    'new brunswick': 'ca-east', 'nova scotia': 'ca-east',
    'british columbia': 'ca-west', alberta: 'ca-prairies',
    saskatchewan: 'ca-prairies', manitoba: 'ca-prairies',
  },
  gb: {
    'greater london': 'gb-england-se', london: 'gb-england-se',
    'south east': 'gb-england-se', 'south west': 'gb-england-se',
    'england-south': 'gb-england-se',
    'north west': 'gb-england-nw', 'england-north': 'gb-england-nw',
    yorkshire: 'gb-england-nw', midlands: 'gb-england-se',
    // Broad fallbacks — catch "England", "Scotland", "Wales" as state names
    england: 'gb-england-se',
    scotland: 'gb-scotland',
    wales: 'gb-wales',
  },
  au: {
    queensland: 'au-east', 'new south wales': 'au-east',
    victoria: 'au-east', 'western australia': 'au-west',
    'south australia': 'au-west', tasmania: 'au-east',
  },
};

const FALLBACK_HARDNESS: WaterHardness = {
  mgL: 120,
  classification: 'moderately soft',
  note: 'Unknown — assuming moderate',
  key: 'fallback',
};

export function lookupWaterHardness(
  countryCode: string,
  region: string,
  postcode?: string,
  manualOverride?: number | null,
): WaterHardness {
  // Manual override takes absolute priority
  if (manualOverride != null && manualOverride > 0) {
    return {
      mgL: manualOverride,
      classification: classifyHardness(manualOverride),
      note: 'Manual override — user-supplied value',
      key: 'manual',
    };
  }

  // UK postcode-level lookup
  if (countryCode.toUpperCase() === 'GB' && postcode && postcode.trim()) {
    const [mgL, cls, note] = lookupUkPostcodeHardness(postcode);
    return { mgL, classification: cls, note, key: `uk-postcode:${postcode.trim().toUpperCase().substring(0, 3)}x` };
  }

  const country = countryCode.toLowerCase();
  const regionLower = region.toLowerCase();

  // Check region-specific mapping
  if (country in REGION_MAP) {
    for (const [keyword, key] of Object.entries(REGION_MAP[country])) {
      if (regionLower.includes(keyword) && key in WATER_HARDNESS_TABLE) {
        const [mgL, cls, note] = WATER_HARDNESS_TABLE[key];
        return { mgL, classification: cls, note, key };
      }
    }
  }

  // Fall back to country-level
  if (country in WATER_HARDNESS_TABLE) {
    const [mgL, cls, note] = WATER_HARDNESS_TABLE[country];
    return { mgL, classification: cls, note, key: country };
  }

  return FALLBACK_HARDNESS;
}
