import { FermentPreset } from '../models/types';

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
    typicalSaltPct: 2.0,
    saltPctMin: 1.5,
    saltPctMax: 3.0,
    typicalVegWeight: 1000,
    speedFactor: 1.0,
    waterContentPct: 92,
    tips: [
      'Massage salt into shredded cabbage until it feels wet and brine pools at the bottom when squeezed.',
      'Pack tightly — eliminate air pockets. Use a weight to keep cabbage submerged.',
      'Caraway seeds and juniper berries are traditional additions.',
    ],
  },

  kimchi: {
    id: 'kimchi',
    name: 'Kimchi',
    emoji: '🌶️',
    description: 'Napa cabbage with a spicy gochugaru paste. Faster ferment than sauerkraut due to the paste\'s surface area and higher ambient activity.',
    method: 'dry',
    typicalSaltPct: 2.5,
    saltPctMin: 2.0,
    saltPctMax: 4.0,
    typicalVegWeight: 800,
    speedFactor: 1.6,
    waterContentPct: 90,
    tips: [
      'Salt cabbage leaves first, let wilt 1–2h, then rinse and mix with paste.',
      'Kimchi is usually ready in 2–5 days at room temp, then moved to fridge.',
      'The paste includes gochugaru, garlic, ginger, fish sauce (or soy sauce for vegan).',
    ],
  },

  'dill-pickles': {
    id: 'dill-pickles',
    name: 'Dill Pickles',
    emoji: '🥒',
    description: 'Cucumber spears in a salt brine with dill and garlic. A tannin-rich leaf (grape, oak, or horseradish) keeps them crisp.',
    method: 'brine',
    typicalSaltPct: 3.5,
    saltPctMin: 3.0,
    saltPctMax: 5.0,
    typicalVegWeight: 500,
    speedFactor: 1.0,
    waterContentPct: 96,
    brineStrength: 3.5,
    tips: [
      'Use pickling cucumbers (Kirby) — they stay crisper than slicing cucumbers.',
      'Add a grape leaf, oak leaf, or horseradish leaf for tannins that preserve crunch.',
      'Garlic, dill, mustard seeds, and black peppercorns are classic.',
      'Ferment 5–10 days at room temp. Move to fridge when you like the sourness.',
    ],
  },

  'carrot-sticks': {
    id: 'carrot-sticks',
    name: 'Carrot Sticks',
    emoji: '🥕',
    description: 'Carrot sticks or coins in brine with garlic and dill. Quick, reliable, and kid-friendly.',
    method: 'brine',
    typicalSaltPct: 3.0,
    saltPctMin: 2.5,
    saltPctMax: 5.0,
    typicalVegWeight: 400,
    speedFactor: 1.1,
    waterContentPct: 88,
    brineStrength: 3.0,
    tips: [
      'Cut carrots into uniform sticks so they ferment evenly.',
      'Garlic cloves and fresh dill sprigs are great additions.',
      'Ready in about 5–7 days. Carrots stay crunchy for weeks in the fridge.',
    ],
  },

  'hot-sauce': {
    id: 'hot-sauce',
    name: 'Hot Sauce / Pepper Mash',
    emoji: '🌶️',
    description: 'Fermented pepper mash — blend peppers, garlic, and salt, then let lactobacillus work. No water added.',
    method: 'mash',
    typicalSaltPct: 3.0,
    saltPctMin: 2.5,
    saltPctMax: 5.0,
    typicalVegWeight: 300,
    speedFactor: 1.3,
    waterContentPct: 88,
    tips: [
      'Use a mix of hot peppers (habanero, Thai, jalapeño) for complexity.',
      'Blend peppers + garlic + salt into a rough mash. No added water.',
      'Ferment 7–14 days. After fermenting, blend smooth and optionally strain.',
      'A splash of brine keeps it pourable. Vinegar can be added post-ferment for extra tang.',
    ],
  },

  'beet-kvass': {
    id: 'beet-kvass',
    name: 'Beet Kvass',
    emoji: '🫙',
    description: 'Earthy, salty, and vibrant — a traditional tonic. Quick ferment with beets, salt, and water.',
    method: 'brine',
    typicalSaltPct: 2.0,
    saltPctMin: 1.5,
    saltPctMax: 3.0,
    typicalVegWeight: 300,
    speedFactor: 1.8,
    waterContentPct: 88,
    brineStrength: 2.0,
    tips: [
      'Chop beets into 1-inch chunks — don\'t grate (too fast, too yeasty).',
      'Ginger and/or orange peel are nice additions.',
      'Ready in just 3–5 days. Strain and refrigerate. Drink a small glass daily.',
    ],
  },

  'radish-cauliflower': {
    id: 'radish-cauliflower',
    name: 'Radish / Cauliflower',
    emoji: '🥗',
    description: 'Firm, low-sugar vegetables that need a stronger brine to kickstart fermentation. Great for mixed pickle jars.',
    method: 'brine',
    typicalSaltPct: 5.0,
    saltPctMin: 3.5,
    saltPctMax: 5.0,
    typicalVegWeight: 500,
    speedFactor: 0.85,
    waterContentPct: 90,
    brineStrength: 5.0,
    tips: [
      'Radishes, cauliflower, and green beans all work well at 5% brine.',
      'These vegetables are slower to ferment — expect 7–14 days.',
      'A mixed jar of cauliflower + carrot + radish makes a beautiful pickle platter.',
    ],
  },

  custom: {
    id: 'custom',
    name: 'Custom',
    emoji: '⚗️',
    description: 'Your own ferment — set the method, salt percentage, and vegetable weight manually.',
    method: 'brine',
    typicalSaltPct: 3.0,
    saltPctMin: 1.0,
    saltPctMax: 8.0,
    typicalVegWeight: 500,
    speedFactor: 1.0,
    waterContentPct: 90,
  },
};

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
