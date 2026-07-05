/**
 * Core type definitions for Just Dough It
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
  starterFlourType?: string; // flour label used to feed the starter (undefined on legacy recipes)
  saltPct: number;           // %
  oilPct?: number;           // % — oil/fat as percentage of total flour (0 if unset)
  ambientTemp: number;       // °C
  flourTemp: number;         // °C
  waterTemp: number;         // °C
  starterTemp: number;       // °C
  breadType?: string;        // recipe preset id (undefined on legacy recipes)
  preferment?: {             // pre-ferment config (undefined if not used)
    type: 'poolish' | 'biga';
    flourPct: number;        // % of total flour allocated to pre-ferment
    hydration: number;       // poolish=100, biga=50–60
  };
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
  oil: number;               // g — oil/fat weight (0 if no oil)
  totalDoughWeight: number;
  hydrationPct: number;
  starterPct: number;
  prefermentFlour: number;   // g — flour contributed by pre-ferment (0 if none)
  prefermentWater: number;   // g — water contributed by pre-ferment (0 if none)
  prefermentTotal: number;   // g — total pre-ferment weight (0 if none)
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
  breadType?: string;         // recipe preset id (undefined on legacy recipes)
}

// ── Starter Feeding ────────────────────────────────────────────────────
export interface StarterFeeding {
  id: string;
  timestamp: string;          // ISO
  flourUsed: string;          // flour label
  flourGrams: number;         // g of flour used to feed
  waterGrams: number;         // g of water used to feed
  notes?: string;
}

// ── Settings ───────────────────────────────────────────────────────────
export interface UserSettings {
  defaultFlourType: string;
  defaultFlourWeight: number;
  defaultHydration: number;
  defaultStarterHydration: number; // starter hydration % (default 100)
  defaultSaltPct: number;
  starterFeedingIntervalHours: number;
  notificationsEnabled: boolean;
  waterHardnessOverride: number; // mg/L CaCO₃, 0 = auto-detect
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultFlourType: 'No. 4 Organic White (105)',
  defaultFlourWeight: 500,
  defaultHydration: 75,
  defaultStarterHydration: 100,
  defaultSaltPct: 2.0,
  starterFeedingIntervalHours: 24,
  notificationsEnabled: false,
  waterHardnessOverride: 0,
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

// ── Recipe Presets ─────────────────────────────────────────────────────

export type BreadType =
  | 'classic-boule'
  | 'focaccia'
  | 'baguette'
  | 'ciabatta'
  | 'pizza'
  | 'franco-manca-pizza'
  | 'pita-naan'
  | 'flatbread'
  | '100-rye'
  | 'spelt-loaf'
  | 'pan-de-cristal'
  | 'challah'
  | 'brioche'
  | 'crackers-grissini'
  | 'custom';

export type PreFermentType = 'none' | 'poolish' | 'biga';

export interface DoughProfile {
  hydrationMin: number;
  hydrationMax: number;
  typicalHydration: number;
  inoculationMin: number;
  inoculationMax: number;
  typicalInoculation: number;
  saltMin: number;
  saltMax: number;
  typicalSalt: number;
  oilPct?: number;
  preferment?: { type: PreFermentType; flourPct: number; hydration: number };
  typicalFlourType?: string;
}

export interface ProcessProfile {
  autolyseMinutes: number;
  folds: number;
  foldIntervalMinutes: number;
  benchRestMinutes: number;
  shapingMethod: string;
  proofingVessel: string;
  scoringPattern: string;
}

export interface BakeProfile {
  ovenTempC: number;
  steamRequired: boolean;
  bakingVessel: string;
  bakeTimeMinutes: number;
  notes?: string;
}

export interface RecipePreset {
  id: BreadType;
  name: string;
  emoji: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  dough: DoughProfile;
  process: ProcessProfile;
  bake: BakeProfile;
  tips?: string[];
}
