/**
 * Yogurt starter culture & milk type catalogue.
 *
 * Starter cultures from Freshly Fermented (UK) — organic certified,
 * freeze-dried, heirloom (indefinitely reculturable).
 * https://freshlyfermented.co.uk/product-category/starter-cultures/organic-yoghurt-starter-cultures/
 *
 * Milk: Duchy Organic Unhomogenised Whole Milk from Waitrose + common alternatives.
 */
import { YogurtCulturePreset, YogurtType, MilkEntry } from '../models/types';

// ── Milk Types ────────────────────────────────────────────────────────────

export const MILK_TYPES: MilkEntry[] = [
  // Cow
  {
    id: 'cow-whole',
    name: "Whole cow's milk",
    emoji: '🥛',
    source: 'cow',
    fatLevel: 'whole',
    fatPct: 4.0,
    proteinPct: 3.5,
    carbsPct: 4.7,
    notes: 'Duchy Organic unhomogenised — cream rises to the top. Classic yogurt base.',
  },
  {
    id: 'cow-semi',
    name: "Semi-skimmed cow's milk",
    emoji: '🥛',
    source: 'cow',
    fatLevel: 'semi-skimmed',
    fatPct: 1.7,
    proteinPct: 3.6,
    carbsPct: 4.8,
    notes: 'Lighter body but still sets well. Higher protein-to-fat ratio.',
  },
  {
    id: 'cow-skimmed',
    name: "Skimmed cow's milk",
    emoji: '🥛',
    source: 'cow',
    fatLevel: 'skimmed',
    fatPct: 0.3,
    proteinPct: 3.6,
    carbsPct: 5.0,
    notes: 'Thin set — consider adding milk powder (2 tbsp/L) for body.',
  },
  // Goat
  {
    id: 'goat-whole',
    name: "Whole goat's milk",
    emoji: '🐐',
    source: 'goat',
    fatLevel: 'whole',
    fatPct: 4.1,
    proteinPct: 3.3,
    carbsPct: 4.5,
    notes: 'Softer curd than cow milk. Slightly tangy. Easier to digest for some.',
  },
  {
    id: 'goat-semi',
    name: "Semi-skimmed goat's milk",
    emoji: '🐐',
    source: 'goat',
    fatLevel: 'semi-skimmed',
    fatPct: 1.5,
    proteinPct: 3.5,
    carbsPct: 4.6,
    notes: 'Lighter goat yogurt. Thin body — strain for Greek-style.',
  },
  // Sheep
  {
    id: 'sheep-whole',
    name: "Whole sheep's milk",
    emoji: '🐑',
    source: 'sheep',
    fatLevel: 'whole',
    fatPct: 7.0,
    proteinPct: 6.0,
    carbsPct: 4.8,
    notes: 'Richest milk — double the solids of cow milk. Exceptionally thick, creamy yogurt. Ideal for Greek/Skyr styles.',
  },
  {
    id: 'sheep-skimmed',
    name: "Semi-skimmed sheep's milk",
    emoji: '🐑',
    source: 'sheep',
    fatLevel: 'semi-skimmed',
    fatPct: 3.0,
    proteinPct: 6.0,
    carbsPct: 5.0,
    notes: 'Still very high protein. Excellent set even with reduced fat.',
  },
];

// ── Starter Cultures ──────────────────────────────────────────────────────

/**
 * Freshly Fermented organic yogurt starter cultures.
 *
 * Thermophilic: need sustained warmth (40–45°C). Use a yogurt maker,
 * thermal flask, dehydrator, or low oven with the light on.
 *
 * Mesophilic: ferment at room temperature (20–25°C). No equipment needed.
 * Tend to produce thinner, drinkable-style yogurts.
 *
 * All are heirloom — save 2 tbsp from each batch to start the next.
 */
export const YOGURT_CULTURES: Record<string, YogurtCulturePreset> = {
  // ── Thermophilic (40–45°C) ────────────────────────────────────────────

  bulgarian: {
    id: 'bulgarian',
    name: 'Bulgarian Yogurt',
    emoji: '🇧🇬',
    description: 'The classic. Lactobacillus bulgaricus + Streptococcus thermophilus — the original partnership. Tangy, creamy, and endlessly versatile.',
    type: 'thermophilic',
    typicalTempC: 42,
    tempMinC: 38,
    tempMaxC: 46,
    typicalHours: 8,
    hoursMin: 5,
    hoursMax: 12,
    starterRatio: 0.5,   // 1 sachet per 2L
    typicalMilkLitres: 2,
    thickness: 'medium',
    strainInfo: 'Lactobacillus delbrueckii subsp. bulgaricus + Streptococcus thermophilus. The classic yogurt symbiosis — S. thermophilus lowers pH, stimulating L. bulgaricus which releases peptides that feed S. thermophilus.',
    healthNote: 'Most-studied yogurt culture. Meta-analyses show improved lactose digestion, reduced antibiotic-associated diarrhoea (AAD), and potential immune modulation via TLR4 pathway activation.',
    tips: [
      'Pre-heat milk to 85°C and hold 30 min — denatures whey proteins for thicker set.',
      'Cool milk to 42°C before adding culture. A clean finger test: feels warm but not hot.',
      'Incubate 8h at 42°C. Longer = tangier. 12h gives a proper Bulgarian-style sharpness.',
      'Chill 4h before eating — the gel continues to set in the fridge.',
      '🔬 L. bulgaricus produces bioactive peptides during fermentation that may survive heat treatment.',
    ],
  },

  greek: {
    id: 'greek',
    name: 'Greek Yogurt',
    emoji: '🇬🇷',
    description: 'Thick, strained yogurt with concentrated protein. The same thermophilic culture as Bulgarian, selected for denser curd formation.',
    type: 'thermophilic',
    typicalTempC: 42,
    tempMinC: 38,
    tempMaxC: 46,
    typicalHours: 8,
    hoursMin: 6,
    hoursMax: 10,
    starterRatio: 0.5,
    typicalMilkLitres: 2,
    thickness: 'very-thick',
    strainInfo: 'L. bulgaricus + S. thermophilus (Greek strain selection). Forms a firmer curd; straining removes whey to concentrate protein 2–3×.',
    healthNote: 'Highest protein yogurt style (~8–10g per 100g after straining; varies with milk and straining duration). Whey removal concentrates casein micelles — slower digestion, more satiating.',
    tips: [
      'After incubation, strain through muslin/cheesecloth for 2–6h in the fridge.',
      'The longer you strain, the thicker it gets. 6h = labneh consistency.',
      'Keep the whey! Use in bread dough, smoothies, or as a buttermilk substitute.',
      'Sheep or goat milk makes exceptionally rich Greek yogurt.',
    ],
  },

  russian: {
    id: 'russian',
    name: 'Russian Yogurt',
    emoji: '🇷🇺',
    description: 'Traditional Eastern European ryazhenka-style — baked-milk yogurt. Caramel notes from prolonged milk heating before fermentation.',
    type: 'thermophilic',
    typicalTempC: 40,
    tempMinC: 36,
    tempMaxC: 44,
    typicalHours: 10,
    hoursMin: 8,
    hoursMax: 14,
    starterRatio: 0.5,
    typicalMilkLitres: 2,
    thickness: 'medium',
    strainInfo: 'L. bulgaricus + S. thermophilus + optional L. acidophilus. Traditional Russian cultures often include additional Lactobacillus species.',
    tips: [
      'For authentic ryazhenka: heat milk to 95°C, hold 3–4h until beige/caramel colour develops.',
      'This long heating evaporates water and caramelises lactose — sweeter, nuttier result.',
      'Incubate at 40°C for 10h. The pre-cooked milk sets more firmly.',
      '🔬 Maillard compounds from baked milk are partially indigestible and may be fermented by gut bacteria — contributing to the unique flavour and potential digestive benefits.',
    ],
  },

  skyr: {
    id: 'skyr',
    name: 'Skyr',
    emoji: '🇮🇸',
    description: 'Icelandic cultured dairy — technically a fresh cheese, made like yogurt. Very thick, high protein, slightly tangy. Traditionally made with rennet + culture.',
    type: 'thermophilic',
    typicalTempC: 40,
    tempMinC: 36,
    tempMaxC: 44,
    typicalHours: 10,
    hoursMin: 8,
    hoursMax: 14,
    starterRatio: 0.5,
    typicalMilkLitres: 3,
    thickness: 'very-thick',
    strainInfo: 'S. thermophilus + L. bulgaricus + L. acidophilus + Bifidobacterium. Traditional skyr also uses a small amount of rennet for a firmer set.',
    healthNote: 'Iceland\'s national food for 1,000+ years. Norse settlers brought skyr to Iceland; it died out everywhere else. High protein (~10–12g per 100g after straining; traditional skyr uses skimmed milk and extensive straining). Low lactose.',
    tips: [
      'For traditional skyr: add 1 drop of liquid rennet per 3L milk at inoculation.',
      'Skyr requires more straining than Greek yogurt — 6–12h for authentic density.',
      'Use skimmed milk for traditional low-fat skyr. Whole milk = cream-skyr (rjóma-skyr).',
      'Save 2 tbsp skyr as the starter for your next batch — the culture adapts and improves.',
    ],
  },

  'vegan-soya': {
    id: 'vegan-soya',
    name: 'Vegan Soya Yogurt',
    emoji: '🌱',
    description: 'Dairy-free thermophilic yogurt. Works with soya milk (high protein needed for set). Vegan Society certified culture.',
    type: 'thermophilic',
    typicalTempC: 42,
    tempMinC: 38,
    tempMaxC: 45,
    typicalHours: 10,
    hoursMin: 8,
    hoursMax: 14,
    starterRatio: 0.5,
    typicalMilkLitres: 1,
    thickness: 'medium',
    strainInfo: 'S. thermophilus + L. bulgaricus (adapted for plant milk). Vegan Society certified. Requires protein-rich soya milk — almond/oat won\'t set.',
    healthNote: 'Soya yogurt: isoflavones from soya + probiotics = synergistic. 2025 review: fermented soya products show enhanced antioxidant capacity vs. unfermented.',
    tips: [
      '⚠️ Must use soya milk with ≥3.5g protein per 100ml. Most commercial soya milks work.',
      'Add 1 tsp sugar or maple syrup — the cultures need fermentable carbohydrate.',
      'Soya yogurt will be thinner than dairy — add 1 tbsp cornflour or tapioca starch per litre if you want thicker set.',
      'Oat, almond, coconut milks WON\'T set without added protein. Use soya.',
    ],
  },

  // ── Mesophilic (20–25°C) ──────────────────────────────────────────────

  amasi: {
    id: 'amasi',
    name: 'Amasi',
    emoji: '🇿🇦',
    description: 'South African fermented milk — tart, effervescent, somewhere between yogurt and kefir. Traditionally made in a calabash gourd from raw milk. Freeze-dried version is milder but still complex.',
    type: 'mesophilic',
    typicalTempC: 22,
    tempMinC: 18,
    tempMaxC: 28,
    typicalHours: 24,
    hoursMin: 18,
    hoursMax: 36,
    starterRatio: 1,
    typicalMilkLitres: 1,
    thickness: 'thin',
    strainInfo: 'Lactococcus lactis subsp. lactis + L. lactis subsp. cremoris + Leuconostoc mesenteroides + L. paracasei. A diverse mesophilic consortium — similar to buttermilk but more complex.',
    healthNote: 'Traditional South African probiotic. 2025 University of Pretoria study: amasi consumption associated with reduced diarrhoeal disease incidence in rural communities. Rich in conjugated linoleic acid (CLA).',
    tips: [
      'No heat needed — stir culture into room-temperature milk and leave on the counter.',
      'Thickens slightly but stays drinkable. Tartness builds over 24–36h.',
      'Traditional amasi uses raw milk. With pasteurised milk, the culture still produces good acidity but less complexity.',
      'Shake before drinking — the curd separates. Store 1 week refrigerated.',
    ],
  },

  'caspian-sea': {
    id: 'caspian-sea',
    name: 'Caspian Sea Yogurt',
    emoji: '🌊',
    description: 'Mild, creamy mesophilic yogurt from the Caucasus region. Very low acidity — one of the least tangy yogurt styles. Ropey, almost elastic texture.',
    type: 'mesophilic',
    typicalTempC: 23,
    tempMinC: 18,
    tempMaxC: 28,
    typicalHours: 20,
    hoursMin: 16,
    hoursMax: 30,
    starterRatio: 1,
    typicalMilkLitres: 1,
    thickness: 'medium',
    strainInfo: 'Lactococcus lactis subsp. cremoris FC + Acetobacter orientalis. Unique — includes an acetic acid bacterium alongside LAB, giving a very mild, almost sweet profile.',
    tips: [
      'Mildest of all yogurt cultures — perfect if you find regular yogurt too sharp.',
      'The ropy/elastic texture is normal — caused by exopolysaccharides (EPS) from L. cremoris FC.',
      'Reculture within 5–7 days for best results. The Acetobacter component is less stable than pure LAB.',
      'Great for smoothies and lassi — the mild flavour doesn\'t clash with fruit.',
    ],
  },

  filmjolk: {
    id: 'filmjolk',
    name: 'Filmjölk',
    emoji: '🇸🇪',
    description: 'Swedish cultured milk — the everyday breakfast yogurt of Scandinavia. Drinkable consistency, mild tang, slightly viscous from natural EPS production.',
    type: 'mesophilic',
    typicalTempC: 22,
    tempMinC: 18,
    tempMaxC: 26,
    typicalHours: 24,
    hoursMin: 18,
    hoursMax: 30,
    starterRatio: 1,
    typicalMilkLitres: 1,
    thickness: 'thin',
    strainInfo: 'Lactococcus lactis subsp. lactis + L. lactis subsp. cremoris + Leuconostoc mesenteroides. The same core species as buttermilk — produces diacetyl (buttery aroma) and EPS (body).',
    healthNote: 'Staple probiotic in Swedish diet for centuries. Regular filmjölk consumption linked to improved gut transit time and reduced bloating in Scandinavian cohort studies.',
    tips: [
      'Filmjölk is meant to be drinkable — don\'t expect Greek-yogurt thickness.',
      'Pour over muesli or drink straight. The buttery/diacetyl note is the signature flavour.',
      'Ferments faster in summer (18h) than winter (30h). Taste daily until you find your sweet spot.',
      'Filmjölk culture is very stable — one of the easiest mesophilics to maintain long-term.',
    ],
  },

  piima: {
    id: 'piima',
    name: 'Piimä',
    emoji: '🇫🇮',
    description: 'Finnish cultured milk — thin, refreshing, slightly sour. The everyday fermented dairy of Finland, drunk with meals or poured over berries.',
    type: 'mesophilic',
    typicalTempC: 22,
    tempMinC: 18,
    tempMaxC: 26,
    typicalHours: 24,
    hoursMin: 18,
    hoursMax: 30,
    starterRatio: 1,
    typicalMilkLitres: 1,
    thickness: 'thin',
    strainInfo: 'Lactococcus lactis subsp. lactis + L. lactis subsp. cremoris + L. lactis subsp. lactis biovar. diacetylactis + Leuconostoc. Similar to filmjölk with a distinct Finnish strain profile.',
    tips: [
      'Very similar to filmjölk — thin, drinkable, buttery. The Finnish cousin.',
      'Traditionally made from raw milk. Works well with semi-skimmed pasteurised milk too.',
      'Ferment on the counter 24h. Chill and drink within 7–10 days.',
      'Pour over bilberries (Finnish mustikka) for an authentic Nordic breakfast.',
    ],
  },

  viili: {
    id: 'viili',
    name: 'Viili',
    emoji: '🇫🇮',
    description: 'Finnish long-set yogurt — famous for its stretchy, ropy texture. Spoon it and it pulls like melted mozzarella. Mild flavour despite the dramatic texture. An acquired texture that Finns adore.',
    type: 'mesophilic',
    typicalTempC: 22,
    tempMinC: 18,
    tempMaxC: 25,
    typicalHours: 24,
    hoursMin: 20,
    hoursMax: 36,
    starterRatio: 1,
    typicalMilkLitres: 1,
    thickness: 'thick',
    strainInfo: 'Lactococcus lactis subsp. cremoris (ropy strain) + a Geotrichum candidum mould on the surface. The mould creates a thin velvety layer on top — harmless and traditional. EPS from L. cremoris creates the rope.',
    tips: [
      '⚠️ Viili develops a thin white mould layer on top (Geotrichum candidum) — this is normal and desirable. Don\'t scrape it off!',
      'The ropy/slimy texture is the defining feature. Stir it in — it breaks down and thickens the whole batch.',
      'Viili is very temperature-sensitive. Above 25°C, the mould may not develop. Keep at 20–22°C.',
      'Reculture within 5 days. The mould- LAB balance is more delicate than pure-bacteria cultures.',
      'Not for everyone! The ropy texture is polarising — some love it, others can\'t get past it.',
    ],
  },

  // ── Custom ──────────────────────────────────────────────────────────────
  custom: {
    id: 'custom',
    name: 'Custom',
    emoji: '⚗️',
    description: 'Your own culture — set the incubation temperature, time, and starter ratio manually.',
    type: 'thermophilic',
    typicalTempC: 42,
    tempMinC: 18,
    tempMaxC: 50,
    typicalHours: 8,
    hoursMin: 4,
    hoursMax: 48,
    starterRatio: 0.5,
    typicalMilkLitres: 2,
    thickness: 'medium',
  },
};

// ── Display Order ─────────────────────────────────────────────────────────

/** Ordered list of yogurt culture types for UI display (excluding custom). */
export const YOGURT_TYPE_ORDER: Array<{ id: YogurtType; preset: YogurtCulturePreset; section: 'thermophilic' | 'mesophilic' }> = [
  // Thermophilic section
  { id: 'bulgarian', preset: YOGURT_CULTURES.bulgarian!, section: 'thermophilic' },
  { id: 'greek', preset: YOGURT_CULTURES.greek!, section: 'thermophilic' },
  { id: 'russian', preset: YOGURT_CULTURES.russian!, section: 'thermophilic' },
  { id: 'skyr', preset: YOGURT_CULTURES.skyr!, section: 'thermophilic' },
  { id: 'vegan-soya', preset: YOGURT_CULTURES['vegan-soya']!, section: 'thermophilic' },
  // Mesophilic section
  { id: 'amasi', preset: YOGURT_CULTURES.amasi!, section: 'mesophilic' },
  { id: 'caspian-sea', preset: YOGURT_CULTURES['caspian-sea']!, section: 'mesophilic' },
  { id: 'filmjolk', preset: YOGURT_CULTURES.filmjolk!, section: 'mesophilic' },
  { id: 'piima', preset: YOGURT_CULTURES.piima!, section: 'mesophilic' },
  { id: 'viili', preset: YOGURT_CULTURES.viili!, section: 'mesophilic' },
];

// ── Lookup Helpers ────────────────────────────────────────────────────────

const milkMap = new Map<string, MilkEntry>();
for (const m of MILK_TYPES) milkMap.set(m.id, m);

export function findMilk(id: string): MilkEntry {
  return milkMap.get(id) ?? MILK_TYPES[0]!;
}

/** Default milk: whole cow (Duchy Organic spec) */
export const DEFAULT_MILK_ID = 'cow-whole';
