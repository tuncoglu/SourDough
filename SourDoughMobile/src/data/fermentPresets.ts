import { FermentPreset, PrepSize } from '../models/types';

/**
 * TIMING: `typicalDays` is days to full sourness at 22 °C with `defaultVegId`,
 * and it must agree with the day range a preset promises in its own `tips` —
 * __tests__/fermentTiming.test.ts parses those tips and fails if they drift
 * apart. Temperature and vegetable swaps are relative adjustments on top of
 * that anchor (see estimateFermentDuration); nothing here is a bare
 * multiplier that no one can check against the copy the user reads.
 */

/**
 * Lacto-fermentation presets.
 *
 * Salt percentages sourced from standard fermentation references:
 * Katz, "The Art of Fermentation"; Shockey, "Fermented Vegetables";
 * USDA Complete Guide to Home Canning (for safety thresholds).
 */
export const FERMENT_PRESETS: Record<string, FermentPreset> = {
  sauerkraut: {
    id: 'sauerkraut',
    name: 'Sauerkraut',
    emoji: '🥬',
    description: 'Shredded cabbage with salt — the classic lacto-ferment. Natural brine forms as salt draws water from the leaves.',
    method: 'dry',
    saltPctMin: 1.5,
    saltPctMax: 3.0,
    typicalVegWeight: 1000,
    typicalDays: 7, // days to full sourness at 22 C with green-cabbage
    defaultVegId: 'green-cabbage',
    referencePrep: 'shredded',
    waterContentPct: 92,
    tips: [
      'Massage salt into shredded cabbage until it feels wet and brine pools at the bottom when squeezed.',
      'Pack tightly — eliminate air pockets. Use a weight to keep cabbage submerged.',
      'Caraway seeds and juniper berries are traditional additions.',
      '🔬 A commercial starter culture reliably speeds the start (pH below 4.0 within a day vs ~3 days spontaneous — Müller et al. 2018). Backslopping with fully sour brine is a different thing and often a downgrade: above ~0.3% acidity it suppresses Leuconostoc mesenteroides, the initiator that builds kraut aroma, and gives poorer quality (FAO). If you backslop, use a fresh, mild brine.',
      '🔬 LAB succession: Enterobacteriaceae (hrs 0–24) → Leuconostoc mesenteroides (days 1–3) → L. plantarum (day 4+).',
    ],
    healthNote: 'Fermented cabbage produces indole-3-lactic acid, phenyl-lactic acid & GABA — bioactive compounds linked to gut barrier integrity and anti-inflammatory effects (Wei et al. 2025).',
  },

  kimchi: {
    id: 'kimchi',
    name: 'Kimchi',
    emoji: '🌶️',
    description: 'Napa cabbage with a spicy gochugaru paste. Faster ferment than sauerkraut due to the paste\'s surface area and higher ambient activity.',
    method: 'dry',
    saltPctMin: 2.0,
    saltPctMax: 4.0,
    typicalVegWeight: 800,
    typicalDays: 3, // days to full sourness at 22 C with napa-cabbage
    defaultVegId: 'napa-cabbage',
    referencePrep: 'chunks',
    waterContentPct: 95, // matches napa cabbage in vegetables.ts
    tips: [
      'Salt cabbage leaves first, let wilt 1–2h, then rinse and mix with paste.',
      'Kimchi is usually ready in 2–5 days at room temp, then moved to fridge.',
      'The paste includes gochugaru, garlic, ginger, fish sauce (or soy sauce for vegan).',
      '🔬 Reusing ripe kimchi juice is not a free speed-up: mature brine is acidic enough to suppress the Leuconostoc that should start the ferment, and it carries the previous batch\'s yeasts with it. A fresh starter culture is the reliable way to shorten the lag.',
      '🔬 Garlic selectively shapes LAB communities — it favours Leuconostoc and Lactiplantibacillus over Weissella (recent kimchi model studies).',
    ],
    healthNote: 'Most-studied fermented vegetable globally: 11 clinical trials. Benefits include reduced body weight, alleviated IBS, lower LDL cholesterol & fasting glucose. Active UC Davis trial (NCT07435831, 2026).',
  },

  'dill-pickles': {
    id: 'dill-pickles',
    name: 'Dill Pickles',
    emoji: '🥒',
    description: 'Cucumber spears in a salt brine with dill and garlic. A tannin-rich leaf (grape, oak, or horseradish) keeps them crisp.',
    method: 'brine',
    saltPctMin: 3.0,
    saltPctMax: 5.0,
    typicalVegWeight: 500,
    typicalDays: 7, // days to full sourness at 22 C with pickling-cucumber
    defaultVegId: 'pickling-cucumber',
    referencePrep: 'whole',
    waterContentPct: 96,
    brineStrength: 3.5,
    tips: [
      'Use pickling cucumbers (Kirby) — they stay crisper than slicing cucumbers.',
      'Add a grape leaf, oak leaf, or horseradish leaf for tannins that preserve crunch. Or ¼ tsp food-grade calcium chloride (CaCl₂) per 1 kg veg.',
      'Garlic, dill, mustard seeds, and black peppercorns are classic.',
      'Ferment 5–10 days at room temp. Move to fridge when you like the sourness.',
      '🔬 Variable-temp strategy: 3 days at room temp → fridge for 2+ weeks = superior crunch, colour & aroma vs. constant warm ferment (recent cucumber fermentation research).',
    ],
  },

  'carrot-sticks': {
    id: 'carrot-sticks',
    name: 'Carrot Sticks',
    emoji: '🥕',
    description: 'Carrot sticks or coins in brine with garlic and dill. Quick, reliable, and kid-friendly.',
    method: 'brine',
    saltPctMin: 2.5,
    saltPctMax: 5.0,
    typicalVegWeight: 400,
    typicalDays: 6, // days to full sourness at 22 C with carrot
    defaultVegId: 'carrot',
    referencePrep: 'sliced',
    waterContentPct: 88,
    brineStrength: 3.0,
    tips: [
      'Cut carrots into uniform sticks so they ferment evenly.',
      'Garlic cloves and fresh dill sprigs are great additions.',
      'Ready in about 5–7 days. Carrots stay crunchy for weeks in the fridge.',
      '🔬 2025 clinical trial (Pihelgas et al.): fermented carrots ↑ butyrate-producing gut bacteria and improved cellular health biomarkers after 3 weeks of daily consumption.',
    ],
  },

  'hot-sauce': {
    id: 'hot-sauce',
    name: 'Hot Sauce / Pepper Mash',
    emoji: '🌶️',
    description: 'Fermented pepper mash — blend peppers, garlic, and salt, then let lactobacillus work. No water added.',
    method: 'mash',
    saltPctMin: 2.5,
    saltPctMax: 5.0,
    typicalVegWeight: 300,
    // Mash is a genuinely slow ferment — no brine cover, lower water
    // activity, capsaicin inhibition — hence 10 days, not the 5–6 the
    // peppers would take in brine. Matches the 7–14 days promised below.
    typicalDays: 10, // days to full sourness at 22 C with jalapeno
    defaultVegId: 'jalapeno',
    referencePrep: 'grated',
    waterContentPct: 88,
    tips: [
      'Use a mix of hot chillies (habanero, bird\'s eye, Scotch bonnet, jalapeño) for complexity.',
      'Blend peppers + garlic + salt into a rough mash. No added water.',
      'Ferment 7–14 days. After fermenting, blend smooth and optionally strain.',
      'A splash of brine keeps it pourable. Vinegar can be added post-ferment for extra tang.',
      '🔬 Starter-strain choice shapes aroma: L. plantarum → fruity aldehydes. L. pentosus → floral alcohols. L. lactis → complex esters. Wild ferment gets you all three.',
    ],
  },

  'beet-kvass': {
    id: 'beet-kvass',
    name: 'Beet Kvass',
    emoji: '🫙',
    description: 'Earthy, salty, and vibrant — a traditional tonic. Quick ferment with beets, salt, and water.',
    method: 'brine',
    saltPctMin: 1.5,
    saltPctMax: 3.0,
    typicalVegWeight: 300,
    // Beetroot is sugar-rich and fast; 4 days matches the 3–5 promised below.
    typicalDays: 4, // days to full sourness at 22 C with beetroot
    defaultVegId: 'beetroot',
    referencePrep: 'chunks',
    waterContentPct: 88,
    brineStrength: 2.0,
    tips: [
      'Chop beets into 1-inch chunks — don\'t grate (too fast, too yeasty).',
      'Ginger and/or orange peel are nice additions.',
      'Ready in just 3–5 days. Strain and refrigerate. Drink a small glass daily.',
      '🔬 In a 2024 beetroot study, 1% salt retained the highest polyphenols & pigments. At 2% you trade some bioactives for a wider safety margin.',
    ],
  },

  'radish-cauliflower': {
    id: 'radish-cauliflower',
    name: 'Radish / Cauliflower',
    emoji: '🥗',
    description: 'Firm, low-sugar vegetables. 3.5% brine is the sweet spot — strong enough to kickstart fermentation without being overly salty.',
    method: 'brine',
    saltPctMin: 3.0,
    saltPctMax: 5.0,
    typicalVegWeight: 500,
    typicalDays: 9, // days to full sourness at 22 C with cauliflower
    defaultVegId: 'cauliflower',
    referencePrep: 'chunks',
    waterContentPct: 90,
    brineStrength: 3.5,
    tips: [
      'Radishes, cauliflower, carrot, and green beans all work well at 3.5% brine.',
      'These vegetables are slower to ferment — expect 7–14 days.',
      'A mixed jar of cauliflower + carrot + radish makes a beautiful pickle platter.',
      '🔬 2024–2026 research: 3–5% NaCl is the sweet spot for L. plantarum dominance. Above 5% slows beneficial LAB without added safety benefit.',
    ],
  },

  custom: {
    id: 'custom',
    name: 'Custom',
    emoji: '⚗️',
    description: 'Your own ferment — set the method, salt percentage, and vegetable weight manually.',
    method: 'brine',
    saltPctMin: 1.5,
    saltPctMax: 8.0,
    typicalVegWeight: 500,
    typicalDays: 7, // days to full sourness at 22 C with green-cabbage
    defaultVegId: 'green-cabbage',
    referencePrep: 'sliced',
    waterContentPct: 90,
  },
};

/**
 * Which vegetable each preset defaults to when it is selected.
 *
 * Derived from the presets themselves — this used to be a hand-maintained
 * parallel map, which is exactly the kind of duplicated truth that let the
 * timing copy and the timing maths drift apart.
 */
export const PRESET_DEFAULT_VEG: Record<string, string> = Object.fromEntries(
  Object.entries(FERMENT_PRESETS).map(([id, preset]) => [id, preset.defaultVegId]),
);

// ── Multi-Vegetable Combinations ─────────────────────────────────────────
// Curated from authoritative fermentation literature:
// Katz, "The Art of Fermentation"; Shockey, "Fermented Vegetables";
// USDA Complete Guide; traditional regional practices.

export interface VegCombo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  method: 'dry' | 'brine' | 'mash';
  vegetables: { vegId: string; label: string; proportion: number }[]; // proportion 0–1, sums to 1
  typicalSaltPct: number;
  saltPctMin: number;
  saltPctMax: number;
  typicalTotalGrams: number;
  /**
   * Days to full sourness at 22 °C for this exact mix. Combos have no preset
   * of their own, so without this they inherited the neutral `custom` rate
   * and only landed in the right window by accident. Must agree with the day
   * range in `tips` (enforced by __tests__/fermentTiming.test.ts).
   */
  typicalDays: number;
  /** Prep size `typicalDays` is written for — see FermentPreset.referencePrep. */
  referencePrep: PrepSize;
  tips: string[];
  source: string; // citation
}

export const VEG_COMBOS: VegCombo[] = [
  {
    id: 'dill-pickles-classic',
    name: 'Classic Dill Pickles',
    emoji: '🥒',
    description: 'Garlicky, dilly, crisp cucumber pickles. A tannin-rich leaf (grape, oak, or horseradish) keeps them crunchy.',
    method: 'brine',
    vegetables: [
      { vegId: 'pickling-cucumber', label: 'Pickling cucumbers', proportion: 0.90 },
      { vegId: 'garlic', label: 'Garlic cloves', proportion: 0.10 },
    ],
    typicalSaltPct: 3.5,
    saltPctMin: 3.0,
    saltPctMax: 5.0,
    typicalTotalGrams: 800,
    typicalDays: 7,
    referencePrep: 'sliced',
    tips: [
      'Add a generous handful of fresh dill (stems and all), mustard seeds, and black peppercorns.',
      'Add a grape leaf, oak leaf, or ¼ tsp calcium chloride per kg for maximum crunch.',
      'Garlic cloves can be left whole — they mellow beautifully.',
      'Ferment 5–10 days at room temp, then move to the fridge.',
    ],
    source: 'Katz, "The Art of Fermentation"; Shockey, "Fermented Vegetables"',
  },
  {
    id: 'giardiniera',
    name: 'Giardiniera',
    emoji: '🥗',
    description: 'Italian mixed vegetable pickle — cauliflower, carrots, celery, and peppers in a tangy brine. The classic antipasto.',
    method: 'brine',
    vegetables: [
      { vegId: 'cauliflower', label: 'Cauliflower', proportion: 0.35 },
      { vegId: 'carrot', label: 'Carrot', proportion: 0.25 },
      { vegId: 'celery', label: 'Celery', proportion: 0.15 },
      { vegId: 'bell-pepper', label: 'Bell pepper', proportion: 0.15 },
      { vegId: 'jalapeno', label: 'Jalapeño', proportion: 0.10 },
    ],
    typicalSaltPct: 3.5,
    saltPctMin: 3.0,
    saltPctMax: 5.0,
    typicalTotalGrams: 1000,
    typicalDays: 8,
    referencePrep: 'chunks',
    tips: [
      'Cut all vegetables to similar size for even fermentation.',
      'Jalapeños add a gentle heat — add more for spicier giardiniera.',
      'Ready in 7–10 days. Keeps for months refrigerated.',
      'Excellent on sandwiches, antipasto platters, or chopped into tuna salad.',
    ],
    source: 'Shockey, "Fermented Vegetables"; traditional Italian',
  },
  {
    id: 'carrot-jalapeno-garlic',
    name: 'Carrot + Jalapeño + Garlic',
    emoji: '🥕',
    description: 'Sweet, spicy, and garlicky — the most popular mixed ferment. Carrot sticks with jalapeño heat and mellow fermented garlic.',
    method: 'brine',
    vegetables: [
      { vegId: 'carrot', label: 'Carrot', proportion: 0.70 },
      { vegId: 'jalapeno', label: 'Jalapeño', proportion: 0.18 },
      { vegId: 'garlic', label: 'Garlic', proportion: 0.12 },
    ],
    typicalSaltPct: 3.0,
    saltPctMin: 2.5,
    saltPctMax: 4.0,
    typicalTotalGrams: 600,
    typicalDays: 6,
    referencePrep: 'sliced',
    tips: [
      'Cut carrots into uniform sticks so they ferment evenly.',
      'Leave jalapeños whole (pierce once) for milder heat, or slice for spicier.',
      'Garlic turns blue/green — harmless enzymatic reaction with acid.',
      'Ready in 5–7 days. A perfect snack straight from the jar.',
    ],
    source: 'Shockey, "Fermented Vegetables"',
  },
  {
    id: 'pineapple-habanero',
    name: 'Pineapple + Habanero Hot Sauce',
    emoji: '🍍',
    description: 'Tropical heat — sweet pineapple and fiery habanero, fermented into a complex hot sauce. Blend after fermenting.',
    method: 'mash',
    vegetables: [
      { vegId: 'pineapple', label: 'Pineapple', proportion: 0.55 },
      { vegId: 'habanero', label: 'Habanero', proportion: 0.25 },
      { vegId: 'garlic', label: 'Garlic', proportion: 0.10 },
      { vegId: 'onion', label: 'Onion', proportion: 0.10 },
    ],
    typicalSaltPct: 3.0,
    saltPctMin: 2.5,
    saltPctMax: 4.0,
    typicalTotalGrams: 400,
    typicalDays: 10,
    referencePrep: 'grated',
    tips: [
      'WEAR GLOVES when handling habaneros.',
      'Roughly chop everything, mix with salt, and pack into a jar.',
      'Ferment 7–14 days. Blend smooth after fermenting — add brine to adjust consistency.',
      'The pineapple sugar drives fast fermentation — check daily.',
      'A splash of vinegar post-ferment adds brightness.',
    ],
    source: 'Katz, "The Art of Fermentation"; contemporary hot sauce practice',
  },
  {
    id: 'cucumber-onion-dill',
    name: 'Cucumber + Onion + Dill',
    emoji: '🥒',
    description: 'Quick cucumber-onion pickle with fresh dill. Lighter and faster than full dill pickles — ready in days, not weeks.',
    method: 'brine',
    vegetables: [
      { vegId: 'pickling-cucumber', label: 'Pickling cucumber', proportion: 0.65 },
      { vegId: 'onion', label: 'Onion', proportion: 0.25 },
      { vegId: 'garlic', label: 'Garlic', proportion: 0.10 },
    ],
    typicalSaltPct: 3.5,
    saltPctMin: 3.0,
    saltPctMax: 5.0,
    typicalTotalGrams: 700,
    typicalDays: 4,
    referencePrep: 'sliced',
    tips: [
      'Slice cucumbers into spears or coins. Slice onion into thin rings.',
      'Dill goes in whole — stems and all.',
      'Ready in 3–5 days. Onions ferment quickly and taste amazing.',
      'Keep refrigerated — these are half-sours and will continue fermenting.',
    ],
    source: 'Katz, "The Art of Fermentation"; Eastern European tradition',
  },
  {
    id: 'beet-ginger',
    name: 'Beet + Ginger Kvass',
    emoji: '🫙',
    description: 'Earthy beetroot with zingy ginger — a vibrant, deeply coloured tonic. Traditional Russian kvass, modernised with ginger.',
    method: 'brine',
    vegetables: [
      { vegId: 'beetroot', label: 'Beetroot', proportion: 0.80 },
      { vegId: 'ginger', label: 'Ginger', proportion: 0.20 },
    ],
    typicalSaltPct: 2.0,
    saltPctMin: 1.5,
    saltPctMax: 3.0,
    typicalTotalGrams: 400,
    typicalDays: 4,
    referencePrep: 'chunks',
    tips: [
      'Chop beets into 1-inch chunks — do not grate (too fast, too yeasty).',
      'Slice ginger thin — no need to peel if organic.',
      'Ready in just 3–5 days. Strain and refrigerate.',
      'Drink a small glass daily as a tonic. The brine is the point here.',
    ],
    source: 'Katz, "The Art of Fermentation"; traditional Russian',
  },
  {
    id: 'green-beans-garlic-dill',
    name: 'Dilly Beans',
    emoji: '🫘',
    description: 'Crisp, garlicky fermented green beans — a classic American ferment. Snappy, tangy, and addictive.',
    method: 'brine',
    vegetables: [
      { vegId: 'green-beans', label: 'Green beans', proportion: 0.80 },
      { vegId: 'garlic', label: 'Garlic', proportion: 0.12 },
      { vegId: 'jalapeno', label: 'Jalapeño (optional)', proportion: 0.08 },
    ],
    typicalSaltPct: 4.0,
    saltPctMin: 3.5,
    saltPctMax: 5.0,
    typicalTotalGrams: 500,
    typicalDays: 8,
    referencePrep: 'whole',
    tips: [
      'Trim the stem ends. Pack beans vertically in a tall jar — they look beautiful.',
      'Add a grape leaf for extra crunch — green beans can go soft.',
      'Ready in 7–10 days. They stay crisp for weeks in the fridge.',
      'Perfect in a Bloody Mary, or just eaten straight from the jar.',
    ],
    source: 'Shockey, "Fermented Vegetables"; American tradition',
  },
  {
    id: 'mixed-ferment-fruit',
    name: 'Mixed Fruit Ferment',
    emoji: '🍎',
    description: 'Apple, pear, and plum with warm spices — a fermented fruit compote. Great with yogurt, oatmeal, or cheese.',
    method: 'dry',
    vegetables: [
      { vegId: 'apple', label: 'Apple', proportion: 0.40 },
      { vegId: 'pear', label: 'Pear', proportion: 0.35 },
      { vegId: 'plum', label: 'Plum', proportion: 0.25 },
    ],
    typicalSaltPct: 2.0,
    saltPctMin: 1.5,
    saltPctMax: 2.5,
    typicalTotalGrams: 500,
    typicalDays: 3,
    referencePrep: 'chunks',
    tips: [
      'Use firm, slightly underripe fruit. Dice into small cubes.',
      'Add a cinnamon stick and 2 cloves. A star anise is wonderful too.',
      'Fruits ferment fast — check daily. Move to fridge after 2–3 days.',
      'The ferment will be lightly effervescent and tangy-sweet.',
      'Serve chilled over yogurt, oatmeal, or vanilla ice cream.',
    ],
    source: 'Katz, "The Art of Fermentation"; contemporary',
  },
];

/** Ordered list of ferment types for UI display (excluding custom). */
export const FERMENT_TYPE_ORDER: Array<{ id: string; preset: FermentPreset }> = [
  { id: 'sauerkraut', preset: FERMENT_PRESETS.sauerkraut! },
  { id: 'kimchi', preset: FERMENT_PRESETS.kimchi! },
  { id: 'dill-pickles', preset: FERMENT_PRESETS['dill-pickles']! },
  { id: 'carrot-sticks', preset: FERMENT_PRESETS['carrot-sticks']! },
  { id: 'hot-sauce', preset: FERMENT_PRESETS['hot-sauce']! },
  { id: 'beet-kvass', preset: FERMENT_PRESETS['beet-kvass']! },
  { id: 'radish-cauliflower', preset: FERMENT_PRESETS['radish-cauliflower']! },
];
