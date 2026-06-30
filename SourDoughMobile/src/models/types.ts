/**
 * Core type definitions for the Sourdough Optimizer
 */

// ── Flour ──────────────────────────────────────────────────────────────
export interface FlourEntry {
  label: string;
  protein: number;
  productNumber: string;
  notes: string;
  category: FlourCategory;
}

/** A single flour component within a multi-flour blend. */
export interface FlourBlendEntry {
  label: string;
  protein: number;
  productNumber: string;
  category: FlourCategory;
  percentage: number; // 0–100
}

export type FlourCategory =
  | 'White Bread'
  | 'Wholemeal'
  | 'Brown, Malted & Seeded'
  | 'Spelt'
  | 'Ancient & Heritage'
  | 'Rye'
  | 'Other Grains'
  | 'Cake & Pastry'
  | 'Gluten-Free'
  | 'Malt & Brewing'
  | 'Generic';

// ── Water Hardness ─────────────────────────────────────────────────────
export interface WaterHardness {
  mgL: number;
  classification: string;
  note: string;
  key: string;
}

// ── Location & Weather ─────────────────────────────────────────────────
export interface LocationInfo {
  lat: number;
  lon: number;
  city: string;
  region: string;
  country: string;
  countryCode: string;
}

export interface WeatherData {
  ambientTemp: number | null;
  waterTemp: number | null;
  hourlyForecast: HourlyPoint[] | null;
}

export interface HourlyPoint {
  datetime: string; // ISO string
  tempC: number;
}

// ── Recipe Inputs ──────────────────────────────────────────────────────
export interface RecipeInputs {
  flourWeight: number;       // g — fresh flour scooped into bowl
  flourType: string;         // display label of selected flour (or composite for blends)
  flourProtein: number;      // % (weighted average for blends)
  flourProductNo: string;    // first flour's product no (or composite for blends)
  flourBlend?: FlourBlendEntry[]; // detailed blend breakdown (undefined on legacy recipes)
  hydration: number;         // %
  starterWeight: number;     // g
  starterHydration: number;  // %
  saltPct: number;           // %
  ambientTemp: number;       // °C
  flourTemp: number;         // °C
  waterTemp: number;         // °C
  starterTemp: number;       // °C
}

// ── Ingredient Results ─────────────────────────────────────────────────
export interface IngredientResults {
  freshFlour: number;
  flourFromStarter: number;
  totalFlour: number;
  addedWater: number;
  waterFromStarter: number;
  totalWater: number;
  starterTotal: number;
  salt: number;
  totalDoughWeight: number;
  hydrationPct: number;
  starterPct: number;
}

// ── Fermentation Profile ───────────────────────────────────────────────
export interface FermentationProfilePoint {
  hour: string;       // "HH:MM"
  ambient: number;    // °C
  dough: number;      // °C
  rate: number;       // multiplier
  progress: number;   // 0–100%
}

export interface DynamicFermentation {
  totalHours: number;
  profile: FermentationProfilePoint[];
  peakRate: number;
  avgAmbient: number;
}

// ── Temperature Zone ───────────────────────────────────────────────────
export type TempZone = 'cold' | 'cool' | 'ideal' | 'warm' | 'hot';

// ── Calculation Results ────────────────────────────────────────────────
export interface CalculationResults {
  fdt: number;
  tempZone: TempZone;
  ingredients: IngredientResults;
  staticFermentHours: number;
  staticFermentNote: string;
  dynamicFerment: DynamicFermentation | null;
  fermentAdvice: string[];
  waterHardnessAdvice: string[];
  warnings: string[];
  hardness: WaterHardness;
}

// ── Saved Recipe ───────────────────────────────────────────────────────
export interface SavedRecipe {
  id: string;
  createdAt: string;          // ISO timestamp
  inputs: RecipeInputs;
  results: CalculationResults;
  locationSummary: string;
}

// ── Starter Feeding ────────────────────────────────────────────────────
export interface StarterFeeding {
  id: string;
  timestamp: string;          // ISO
  flourUsed: string;          // flour label
  ratio: string;              // "1:1:1", "1:2:2", "1:5:5", "custom"
  customRatio?: { starter: number; flour: number; water: number };
  notes?: string;
}

// ── Settings ───────────────────────────────────────────────────────────
export interface UserSettings {
  defaultFlourType: string;
  defaultFlourWeight: number;
  defaultHydration: number;
  defaultStarterHydration: number;
  defaultSaltPct: number;
  starterFeedingIntervalHours: number;
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultFlourType: 'No. 4 Organic White (105)',
  defaultFlourWeight: 500,
  defaultHydration: 75,
  defaultStarterHydration: 100,
  defaultSaltPct: 2.0,
  starterFeedingIntervalHours: 24,
  notificationsEnabled: false,
};

// ── FDT Temperature Zone ──────────────────────────────────────────────
export function getTempZone(fdt: number): TempZone {
  if (fdt < 21) return 'cold';
  if (fdt < 24) return 'cool';
  if (fdt <= 28) return 'ideal';
  if (fdt <= 30) return 'warm';
  return 'hot';
}

export function getTempZoneInfo(zone: TempZone): { icon: string; label: string; color: string } {
  switch (zone) {
    case 'cold': return { icon: '❄️', label: 'cold — slow ferment', color: '#4A90D9' };
    case 'cool': return { icon: '🌤️', label: 'cool — good flavour', color: '#6BA5C4' };
    case 'ideal': return { icon: '✅', label: 'ideal — goldilocks zone', color: '#6B8E4D' };
    case 'warm': return { icon: '🌡️', label: 'warm — watch closely', color: '#E8A040' };
    case 'hot': return { icon: '🔥', label: 'hot — check early!', color: '#C44536' };
  }
}
