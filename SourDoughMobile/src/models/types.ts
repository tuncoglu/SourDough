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
  hydration: number;         // % (derived display value when addedWaterGrams is set)
  addedWaterGrams?: number;  // g — bowl water (new saves; undefined on legacy recipes)
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
  coldProofHours?: number;   // hours of cold proofing (fridge), 0 if not used
  coldProofTemp?: number;    // fridge temperature in °C, default 4
  starterHoursSinceFed?: number; // hours since starter was last fed, for vitality adjustment
}

// ── Ingredient Results ─────────────────────────────────────────────────
export interface IngredientResults {
  /** @deprecated The original scalar flour input. Use bowlFlour for actual bowl weight. */
  freshFlour: number;
  /** Flour going into the bowl: freshFlour minus preferment flour (if any). */
  bowlFlour: number;
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
  totalHours: number;  // bulk + proof (total elapsed fermentation time)
  bulkHours: number;   // bulk fermentation only
  profile: FermentationProfilePoint[];
  peakRate: number;
  avgAmbient: number;
  /** True if the model reached TARGET_HOURS within the forecast window. */
  converged: boolean;
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
  /** If the starter went into the fridge after this feeding, when (ISO). */
  fridgeAt?: string;
  /** If the starter came out of the fridge after this feeding, when (ISO). */
  outOfFridgeAt?: string;
}

/** Computed starter readiness based on feeding and fridge history. */
export interface StarterStatus {
  hoursSinceFed: number;      // raw clock hours since last feeding
  effectiveHours: number;     // adjusted for fridge time (fridge ≈ 0.1× rate)
  isInFridge: boolean;
  /** Hours since taken out of fridge (0 if never in fridge or still in). */
  hoursSinceFridgeOut: number;
  zone: 'just-fed' | 'building' | 'peak' | 'past-peak' | 'hungry' | 'dormant';
  emoji: string;
  label: string;
}

// ── Settings ───────────────────────────────────────────────────────────
export type ThemeMode = 'system' | 'light' | 'dark';
export type UnitSystem = 'metric' | 'imperial';

export interface UserSettings {
  defaultFlourType: string;
  defaultFlourWeight: number;
  defaultWaterGrams: number;       // g — default bowl water
  defaultStarterHydration: number; // starter hydration % (default 100)
  defaultSaltPct: number;
  waterHardnessOverride: number; // mg/L CaCO₃, 0 = auto-detect
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultFlourType: 'No. 4 Organic White (105)',
  defaultFlourWeight: 500,
  defaultWaterGrams: 375,          // 75% of 500g
  defaultStarterHydration: 100,
  defaultSaltPct: 2.0,
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

export function getTempZoneInfo(zone: TempZone): { icon: string; label: string } {
  switch (zone) {
    case 'cold': return { icon: '❄️', label: 'cold — slow ferment' };
    case 'cool': return { icon: '🌤️', label: 'cool — good flavour' };
    case 'ideal': return { icon: '✅', label: 'ideal — goldilocks zone' };
    case 'warm': return { icon: '🌡️', label: 'warm — watch closely' };
    case 'hot': return { icon: '🔥', label: 'hot — check early!' };
  }
}

/** Resolve a TempZone to the current theme's semantic color. */
export function tempZoneColor(zone: TempZone, colors: { cold: string; cool: string; ideal: string; warm: string; hot: string }): string {
  return colors[zone];
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
  /** Typical weight in grams for a single unit (loaf, baguette, pizza, etc.).
   *  0 means the whole batch is one unit (e.g. focaccia tray, cracker sheet). */
  typicalUnitGrams: number;
  /** Label for a single unit: "loaf", "baguette", "pizza", "piece", etc. */
  unitLabel: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Lacto-Fermentation Types
// ═══════════════════════════════════════════════════════════════════════

export type FermentMethod = 'dry' | 'brine' | 'mash';

export type FermentType =
  | 'sauerkraut'
  | 'kimchi'
  | 'dill-pickles'
  | 'carrot-sticks'
  | 'hot-sauce'
  | 'beet-kvass'
  | 'radish-cauliflower'
  | 'custom';

/** Salt crystal type — different densities give different tsp/tbsp weights.
 *  Includes US and UK common salt varieties. */
export type SaltCrystal =
  | 'fine-sea'
  | 'coarse-sea'
  | 'diamond-kosher'
  | 'morton-kosher'
  | 'pickling'
  | 'maldon-flake'
  | 'rock-salt'
  | 'himalayan-pink'
  | 'cornish-sea'
  | 'table-salt';

/** Density of each salt type in grams per teaspoon.
 *  Measured by weight of a level tsp. Sources: manufacturer data, King Arthur Baking.
 *
 *  NOTE: Actual density varies ±15-20% depending on measurement method
 *  (scooped vs spoon-and-level), humidity, and crystal size.
 *  Volume-to-weight conversions are approximations — weighing is more accurate. */
export const SALT_DENSITY_G_PER_TSP: Record<SaltCrystal, number> = {
  'fine-sea': 5.7,
  'coarse-sea': 4.8,
  'diamond-kosher': 2.8,
  'morton-kosher': 4.8,
  'pickling': 6.0,
  'maldon-flake': 2.3,
  'rock-salt': 4.5,
  'himalayan-pink': 5.5,
  'cornish-sea': 5.7,
  'table-salt': 6.2,
};

/** Human-readable labels for salt types. */
export const SALT_LABELS: Record<SaltCrystal, string> = {
  'fine-sea': 'Fine sea salt',
  'coarse-sea': 'Coarse sea salt',
  'diamond-kosher': 'Diamond Crystal kosher',
  'morton-kosher': 'Morton kosher',
  'pickling': 'Pickling salt',
  'maldon-flake': 'Maldon sea flakes',
  'rock-salt': 'Rock salt (Saxa etc.)',
  'himalayan-pink': 'Himalayan pink salt',
  'cornish-sea': 'Cornish sea salt',
  'table-salt': 'Table salt',
};

/** UK-specific salts shown first, then standard types. */
export const SALT_TYPE_ORDER: SaltCrystal[] = [
  'maldon-flake',
  'rock-salt',
  'cornish-sea',
  'himalayan-pink',
  'table-salt',
  'fine-sea',
  'coarse-sea',
  'diamond-kosher',
  'morton-kosher',
  'pickling',
];

export interface FermentPreset {
  id: FermentType;
  name: string;
  emoji: string;
  description: string;
  method: FermentMethod;
  typicalSaltPct: number;       // 2–5%
  saltPctMin: number;
  saltPctMax: number;
  typicalVegWeight: number;     // grams — typical batch size
  speedFactor: number;          // 1.0 = baseline (sauerkraut); higher = faster
  /** Vegetables with high water content release their own brine in dry salting. */
  waterContentPct: number;      // typical water content of the vegetable
  tips?: string[];
  /** For brine method: recommended brine strength %. */
  brineStrength?: number;
  /** Evidence-based health or research context for this ferment style. */
  healthNote?: string;
}

export interface FermentInputs {
  fermentType: FermentType;
  method: FermentMethod;
  vegWeight: number;            // grams
  waterAmount: number;          // grams (brine method only)
  saltPct: number;              // salt % (relative to veg for dry, water for brine)
  saltType: SaltCrystal;
  ambientTemp: number;          // °C
}

export interface FermentResults {
  saltGrams: number;
  saltTeaspoons: number;
  saltTablespoons: number;
  totalBrineGrams: number;      // water + salt (brine method only, 0 for dry)
  effectiveSalinity: number;    // final brine % accounting for veg water (dry method)
  estimatedDays: number;        // days to completion at current temp
  estimatedDaysMin: number;     // range: early taste
  estimatedDaysMax: number;     // range: fully sour
  tempCapped: boolean;          // true when ambient temp exceeds reliable Q10 range
  targetPH: number;             // 4.0
  brineStrengthDisplay: string; // e.g. "3.5% brine"
  saltLabel: string;
}

export interface LactoDayPoint {
  day: number;
  label: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Yogurt Fermentation Types
// ═══════════════════════════════════════════════════════════════════════

export type YogurtCultureType = 'thermophilic' | 'mesophilic';

export type StarterSource = 'sachet' | 'previous-batch';

export type YogurtType =
  | 'bulgarian'
  | 'greek'
  | 'russian'
  | 'skyr'
  | 'vegan-soya'
  | 'amasi'
  | 'caspian-sea'
  | 'filmjolk'
  | 'piima'
  | 'viili'
  | 'custom';

export type MilkSource = 'cow' | 'goat' | 'sheep';
export type MilkFatLevel = 'whole' | 'semi-skimmed' | 'skimmed';

export interface MilkEntry {
  id: string;              // e.g. "cow-whole"
  name: string;            // "Whole cow's milk"
  emoji: string;
  source: MilkSource;
  fatLevel: MilkFatLevel;
  fatPct: number;          // g per 100ml
  proteinPct: number;      // g per 100ml
  carbsPct: number;        // g per 100ml
  notes?: string;
}

export type YogurtThickness = 'thin' | 'medium' | 'thick' | 'very-thick';

export interface YogurtCulturePreset {
  id: YogurtType;
  name: string;
  emoji: string;
  description: string;
  type: YogurtCultureType;
  typicalTempC: number;    // ideal incubation temperature
  tempMinC: number;
  tempMaxC: number;
  typicalHours: number;    // typical incubation time at ideal temp
  hoursMin: number;
  hoursMax: number;
  starterRatio: number;    // sachets per litre of milk
  typicalMilkLitres: number;
  thickness: YogurtThickness;
  tips?: string[];
  healthNote?: string;
  strainInfo?: string;     // key bacterial strains (e.g. "L. bulgaricus + S. thermophilus")
}

export interface YogurtInputs {
  yogurtType: YogurtType;
  cultureType: YogurtCultureType;
  milkId: string;
  milkLitres: number;
  incubationTempC: number;
  starterSource: StarterSource;
  sachetCount: number;
  previousBatchGrams?: number;  // grams of previous-batch yogurt used as starter
  preHeatEnabled: boolean;
}

export interface YogurtResults {
  milkGrams: number;
  starterSource: StarterSource;
  sachetCount: number;              // 0 when using previous-batch
  previousBatchGrams: number;       // 0 when using sachets
  starterRatioDisplay: string;      // e.g. "1 sachet per 2L" or "30g per L"
  incubationHours: number;
  incubationHoursMin: number;
  incubationHoursMax: number;
  estimatedYieldGrams: number;      // accounts for evaporation loss (~3%)
  estimatedYieldLitres: number;
  estimatedServings: number;        // based on 150g serving
  tempCapped: boolean;
}

export interface YogurtStepPoint {
  hour: number | null;      // null for pre-heat step (no clock hour)
  label: string;
  description: string;
}
