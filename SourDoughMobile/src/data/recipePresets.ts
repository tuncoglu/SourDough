import { RecipePreset, BreadType } from '../models/types';

export const RECIPE_PRESETS: RecipePreset[] = [
  // ── Classic Sourdough ────────────────────────────────────────────────
  {
    id: 'classic-boule',
    name: 'Classic Sourdough Boule',
    emoji: '🍞',
    description:
      'The everyday sourdough loaf. A versatile recipe that works with almost any flour and suits beginners and experienced bakers alike.',
    difficulty: 'easy',
    dough: {
      hydrationMin: 65,
      hydrationMax: 78,
      typicalHydration: 72,
      inoculationMin: 15,
      inoculationMax: 30,
      typicalInoculation: 20,
      saltMin: 1.8,
      saltMax: 2.5,
      typicalSalt: 2.0,
      typicalFlourType: 'Generic: Bread Flour',
    },
    process: {
      autolyseMinutes: 45,
      folds: 3,
      foldIntervalMinutes: 30,
      benchRestMinutes: 20,
      shapingMethod: 'boule',
      proofingVessel: 'banneton',
      scoringPattern: 'cross',
    },
    bake: {
      ovenTempC: 230,
      steamRequired: true,
      bakingVessel: 'Dutch oven',
      bakeTimeMinutes: 45,
      notes: 'Remove lid after 25 min to develop crust colour.',
    },
    tips: [
      'A boule is the most forgiving shape — great for learning dough handling.',
      'If your banneton is new, dust generously with rice flour to prevent sticking.',
    ],
  },

  // ── Focaccia ──────────────────────────────────────────────────────────
  {
    id: 'focaccia',
    name: 'Focaccia',
    emoji: '🫒',
    description:
      'High-hydration Italian flatbread enriched with olive oil. Crisp, golden crust with a pillowy interior. Dimple the top before baking.',
    difficulty: 'easy',
    dough: {
      hydrationMin: 75,
      hydrationMax: 90,
      typicalHydration: 82,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 2.0,
      saltMax: 3.0,
      typicalSalt: 2.5,
      oilPct: 10,
      typicalFlourType: 'Generic: Bread Flour',
    },
    process: {
      autolyseMinutes: 30,
      folds: 3,
      foldIntervalMinutes: 30,
      benchRestMinutes: 0,
      shapingMethod: 'tray-spread',
      proofingVessel: 'baking tray',
      scoringPattern: 'none (dimpled)',
    },
    bake: {
      ovenTempC: 230,
      steamRequired: true,
      bakingVessel: 'baking tray',
      bakeTimeMinutes: 25,
      notes: 'Dimple the dough with wet fingers. Drizzle extra oil and scatter flaky salt + rosemary before baking.',
    },
    tips: [
      'Use a generous amount of olive oil in the tray — it fries the bottom for an incredible crisp crust.',
      'Cold-proof overnight in the tray for deeper flavour and easier handling.',
    ],
  },

  // ── Baguette ──────────────────────────────────────────────────────────
  {
    id: 'baguette',
    name: 'Baguette',
    emoji: '🥖',
    description:
      'Classic French baguette with a thin, crackling crust and open crumb. Uses a poolish pre-ferment for depth of flavour.',
    difficulty: 'advanced',
    dough: {
      hydrationMin: 63,
      hydrationMax: 72,
      typicalHydration: 68,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 1.8,
      saltMax: 2.2,
      typicalSalt: 2.0,
      preferment: { type: 'poolish', flourPct: 30, hydration: 100 },
      typicalFlourType: 'French Type 55 (102)',
    },
    process: {
      autolyseMinutes: 45,
      folds: 2,
      foldIntervalMinutes: 45,
      benchRestMinutes: 30,
      shapingMethod: 'baguette',
      proofingVessel: 'couche',
      scoringPattern: 'diagonal slashes',
    },
    bake: {
      ovenTempC: 250,
      steamRequired: true,
      bakingVessel: 'baking stone',
      bakeTimeMinutes: 22,
      notes: 'Pre-heat stone for 45 min. Add steam (ice cubes or spray bottle) for first 10 min, then vent.',
    },
    tips: [
      'Cold-proof shaped baguettes in a floured couche overnight for best results.',
      'Scoring angle matters: hold the lame at ~30° to the dough surface for the classic ear.',
    ],
  },

  // ── Ciabatta ──────────────────────────────────────────────────────────
  {
    id: 'ciabatta',
    name: 'Ciabatta',
    emoji: '🥪',
    description:
      'Italian slipper bread with a wildly open crumb and thin crust. Very wet dough — handle with care. Uses a biga pre-ferment.',
    difficulty: 'medium',
    dough: {
      hydrationMin: 78,
      hydrationMax: 88,
      typicalHydration: 82,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 2.0,
      saltMax: 2.5,
      typicalSalt: 2.2,
      oilPct: 2,
      preferment: { type: 'biga', flourPct: 30, hydration: 55 },
      typicalFlourType: 'Ciabatta Organic Flour',
    },
    process: {
      autolyseMinutes: 60,
      folds: 4,
      foldIntervalMinutes: 30,
      benchRestMinutes: 0,
      shapingMethod: 'ciabatta (cut-and-gently-stretch)',
      proofingVessel: 'floured couche',
      scoringPattern: 'none',
    },
    bake: {
      ovenTempC: 240,
      steamRequired: true,
      bakingVessel: 'baking stone',
      bakeTimeMinutes: 25,
      notes: 'Handle dough minimally. Flip onto a well-floured surface, cut into rectangles, and gently stretch before loading.',
    },
    tips: [
      'The dough will look like a puddle — that is correct. Do not add more flour.',
      'Use a dough scraper, not your hands, to move ciabatta dough.',
    ],
  },

  // ── Pizza ─────────────────────────────────────────────────────────────
  {
    id: 'pizza',
    name: 'Pizza / Pizza in Teglia',
    emoji: '🍕',
    description:
      'Versatile pizza dough. Use lower hydration for Neapolitan-style, or push higher for a focaccia-like pan pizza (teglia).',
    difficulty: 'medium',
    dough: {
      hydrationMin: 58,
      hydrationMax: 72,
      typicalHydration: 65,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 1.8,
      saltMax: 2.5,
      typicalSalt: 2.0,
      oilPct: 2,
      typicalFlourType: 'Italian Type 00 (118)',
    },
    process: {
      autolyseMinutes: 30,
      folds: 2,
      foldIntervalMinutes: 30,
      benchRestMinutes: 15,
      shapingMethod: 'pizza (hand-stretched)',
      proofingVessel: 'dough balls on tray',
      scoringPattern: 'none',
    },
    bake: {
      ovenTempC: 250,
      steamRequired: false,
      bakingVessel: 'pizza stone or steel',
      bakeTimeMinutes: 8,
      notes: 'Pre-heat stone/steel at max temp for at least 45 min. For teglia (pan pizza): 230°C, 20-25 min in a well-oiled tray.',
    },
    tips: [
      'Cold-proof dough balls for 24-48h for the best flavour and extensibility.',
      'For Neapolitan: 00 flour, 60-62% hydration, 250°C+. For pan pizza: bread flour, 70-75% hydration, 230°C.',
    ],
  },

  // ── Franco Manca-Style Pan Pizza ──────────────────────────────────────
  {
    id: 'franco-manca-pizza',
    name: 'Franco Manca Pan Pizza',
    emoji: '🍳',
    description:
      'The sourdough pizza that built a 70-restaurant chain. Ultra-lean inoculation (8%) with a very long 16–18 hour ferment at cool room temp. Baked in a cast-iron pan on the hob, then finished under the grill — no pizza stone needed.',
    difficulty: 'medium',
    dough: {
      hydrationMin: 62,
      hydrationMax: 70,
      typicalHydration: 66,
      inoculationMin: 5,
      inoculationMax: 12,
      typicalInoculation: 8,
      saltMin: 2.2,
      saltMax: 3.0,
      typicalSalt: 2.6,
      oilPct: 2.6,
      typicalFlourType: 'Italian Type 00 (118)',
    },
    process: {
      autolyseMinutes: 15,
      folds: 1,
      foldIntervalMinutes: 60,
      benchRestMinutes: 0,
      shapingMethod: 'stretch into 10–12" round',
      proofingVessel: 'floured container, balls spaced 2 cm apart',
      scoringPattern: 'none',
    },
    bake: {
      ovenTempC: 250,
      steamRequired: false,
      bakingVessel: '26 cm cast-iron pan + grill',
      bakeTimeMinutes: 7,
      notes: '3–4 minutes on the hob until golden underneath, then 3–4 minutes under the highest grill setting. The pan does the heavy lifting — the grill just melts the cheese and finishes the top.',
    },
    tips: [
      'Make the dough late evening for next-day supper. The 16–18h ferment at 20–23°C is what creates the flavour.',
      'Use a 26 cm iron pan. Rub it with olive oil and get it hot before dropping the dough in.',
      'Dough balls are small: 160–180 g each. Don\'t be tempted to go bigger — the pan-bake method works best with thin bases.',
      'If your kitchen is cold (15–18°C), the bulk ferment will take a few hours longer. Don\'t rush it.',
      '—— TOPPING IDEAS ——',
      'No. 6 (Mixed Cheese & Radicchio): Ogleshield 15g, goat\'s curd 15g, blue cheese 20g, mozzarella 75g, radicchio 150g marinated in oil + salt for 40 min.',
      'Broccoli & Smoked Mozzarella: Sauté 200g friarielli with garlic and chilli, Kalamata olives, mozzarella 60g, smoked mozzarella 20g, tomato sauce.',
      'Chorizo & Ricotta: Ricotta cream (4 dsp ricotta + 2 tsp milk), 6 slices chorizo + 6 chunks cooking chorizo, mozzarella 60g, fresh watercress on top after baking.',
      'Asparagus & Buffalo: 12 asparagus spears, mozzarella 60g, buffalo mozzarella 50g, butter dabs, parmesan shavings, basil.',
      'Pizzette (fried, no oven): Divide dough into 8–16 pieces. Fry in groundnut oil at ≤180°C, 1 min per side. Top cold with reduced tomato sauce, mozzarella, parmesan, basil.',
    ],
  },

  // ── Pita / Naan ───────────────────────────────────────────────────────
  {
    id: 'pita-naan',
    name: 'Pita / Naan',
    emoji: '🫓',
    description:
      'Soft, pocket-forming flatbreads. Pita are baked dry at high heat; naan are enriched with yoghurt and cooked in a hot pan or tandoor.',
    difficulty: 'easy',
    dough: {
      hydrationMin: 55,
      hydrationMax: 68,
      typicalHydration: 62,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 1.5,
      saltMax: 2.2,
      typicalSalt: 1.8,
      oilPct: 2,
      typicalFlourType: 'Generic: Bread Flour',
    },
    process: {
      autolyseMinutes: 20,
      folds: 1,
      foldIntervalMinutes: 30,
      benchRestMinutes: 15,
      shapingMethod: 'small rounds, rolled flat',
      proofingVessel: 'tray under damp cloth',
      scoringPattern: 'none',
    },
    bake: {
      ovenTempC: 250,
      steamRequired: false,
      bakingVessel: 'baking stone or heavy pan',
      bakeTimeMinutes: 4,
      notes: 'For pita: bake on a ripping-hot stone — they puff in ~3 min. For naan: cook in a hot cast-iron pan, flip, and char over flame.',
    },
    tips: [
      'Roll pita evenly — uneven thickness prevents the pocket from forming.',
      'Naan dough benefits from a tablespoon of yoghurt per 100g flour for tenderness.',
    ],
  },

  // ── Flatbread ─────────────────────────────────────────────────────────
  {
    id: 'flatbread',
    name: 'Flatbread',
    emoji: '🌮',
    description:
      'Quick, simple flatbreads — tortillas, lavash, or chapati. No oven needed; cook on a stovetop griddle or in a dry pan.',
    difficulty: 'easy',
    dough: {
      hydrationMin: 52,
      hydrationMax: 68,
      typicalHydration: 60,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 1.5,
      saltMax: 2.2,
      typicalSalt: 2.0,
      oilPct: 2,
      typicalFlourType: 'Generic: All-Purpose / AP',
    },
    process: {
      autolyseMinutes: 15,
      folds: 0,
      foldIntervalMinutes: 0,
      benchRestMinutes: 20,
      shapingMethod: 'small rounds, rolled very thin',
      proofingVessel: 'tray under damp cloth',
      scoringPattern: 'none',
    },
    bake: {
      ovenTempC: 0,
      steamRequired: false,
      bakingVessel: 'cast-iron pan or griddle',
      bakeTimeMinutes: 3,
      notes: 'Cook on a hot dry pan — ~60-90 seconds per side until spotted and puffed. No oven required.',
    },
    tips: [
      'Resting the dough after mixing is critical — it relaxes gluten so you can roll paper-thin.',
      'For tortillas, swap 50% of the flour for masa harina or use chapati atta for authentic roti.',
    ],
  },

  // ── 100% Rye ──────────────────────────────────────────────────────────
  {
    id: '100-rye',
    name: '100% Rye',
    emoji: '🌾',
    description:
      'Dense, dark, and deeply flavourful. Rye dough handles completely differently from wheat — it is sticky, paste-like, and relies on pentosans rather than gluten for structure.',
    difficulty: 'medium',
    dough: {
      hydrationMin: 75,
      hydrationMax: 90,
      typicalHydration: 80,
      inoculationMin: 25,
      inoculationMax: 40,
      typicalInoculation: 30,
      saltMin: 1.8,
      saltMax: 2.5,
      typicalSalt: 2.0,
      typicalFlourType: 'Generic: Rye Flour',
    },
    process: {
      autolyseMinutes: 30,
      folds: 0,
      foldIntervalMinutes: 0,
      benchRestMinutes: 0,
      shapingMethod: 'pan loaf (rye cannot hold shape)',
      proofingVessel: 'loaf tin',
      scoringPattern: 'none (rye cracks naturally)',
    },
    bake: {
      ovenTempC: 220,
      steamRequired: true,
      bakingVessel: 'loaf tin',
      bakeTimeMinutes: 55,
      notes: 'Rye benefits from a long, slow bake. Internal temp should reach 96°C. Cool completely before slicing — at least 12 hours.',
    },
    tips: [
      'Do not expect an open crumb — rye bread is meant to be dense.',
      '100% rye starter (roggenstarter) works best, but a wheat starter will do. Feed it rye flour for a few days before baking.',
    ],
  },

  // ── Spelt Loaf ────────────────────────────────────────────────────────
  {
    id: 'spelt-loaf',
    name: 'Spelt Loaf',
    emoji: '🌾',
    description:
      'Nutty, slightly sweet loaf made with spelt flour. Spelt gluten is more extensible and fragile than wheat — handle gently and expect a slightly denser crumb.',
    difficulty: 'medium',
    dough: {
      hydrationMin: 68,
      hydrationMax: 80,
      typicalHydration: 75,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 1.8,
      saltMax: 2.5,
      typicalSalt: 2.0,
      typicalFlourType: 'Generic: Spelt Flour',
    },
    process: {
      autolyseMinutes: 30,
      folds: 2,
      foldIntervalMinutes: 30,
      benchRestMinutes: 15,
      shapingMethod: 'boule (gentle)',
      proofingVessel: 'banneton',
      scoringPattern: 'single slash',
    },
    bake: {
      ovenTempC: 220,
      steamRequired: true,
      bakingVessel: 'Dutch oven',
      bakeTimeMinutes: 40,
      notes: 'Spelt over-proofs quickly — watch the dough, not the clock. It's ready to bake when it just passes the finger-dent test.',
    },
    tips: [
      'Do not over-knead or over-fold spelt — the gluten tears easily. Two gentle folds are enough.',
      'Spelt absorbs water differently from wheat — you may need to hold back 5% of the water initially.',
    ],
  },

  // ── Pan de Cristal ────────────────────────────────────────────────────
  {
    id: 'pan-de-cristal',
    name: 'Pan de Cristal',
    emoji: '💎',
    description:
      'The "glass bread" from Barcelona. 100%+ hydration — an almost pourable dough that produces an impossibly open, translucent crumb with a paper-thin, shatteringly crisp crust.',
    difficulty: 'advanced',
    dough: {
      hydrationMin: 100,
      hydrationMax: 120,
      typicalHydration: 105,
      inoculationMin: 15,
      inoculationMax: 25,
      typicalInoculation: 20,
      saltMin: 2.0,
      saltMax: 2.5,
      typicalSalt: 2.2,
      typicalFlourType: 'Generic: High-Gluten Flour',
    },
    process: {
      autolyseMinutes: 60,
      folds: 4,
      foldIntervalMinutes: 20,
      benchRestMinutes: 0,
      shapingMethod: 'no shaping — pour and fold',
      proofingVessel: 'well-floured couche',
      scoringPattern: 'none',
    },
    bake: {
      ovenTempC: 250,
      steamRequired: true,
      bakingVessel: 'baking stone',
      bakeTimeMinutes: 20,
      notes: 'Use a stand mixer or the "Rubaud method" (vigorous scoop-and-stretch by hand) to develop gluten in the first 10 min. Do not skip this — it is the only way to build strength at this hydration.',
    },
    tips: [
      'Use the strongest bread flour you can find — 14%+ protein. This dough demands it.',
      'The dough will look like a failure for the first 15 min of mixing. Keep going. It transforms suddenly.',
    ],
  },

  // ── Challah ───────────────────────────────────────────────────────────
  {
    id: 'challah',
    name: 'Challah',
    emoji: '🕯️',
    description:
      'Rich, slightly sweet braided Jewish bread enriched with egg and oil. Golden, tender crumb — perfect for Shabbat, French toast, or bread pudding.',
    difficulty: 'medium',
    dough: {
      hydrationMin: 48,
      hydrationMax: 60,
      typicalHydration: 55,
      inoculationMin: 20,
      inoculationMax: 35,
      typicalInoculation: 25,
      saltMin: 1.5,
      saltMax: 2.5,
      typicalSalt: 2.0,
      oilPct: 6,
      typicalFlourType: 'Generic: Bread Flour',
    },
    process: {
      autolyseMinutes: 20,
      folds: 1,
      foldIntervalMinutes: 30,
      benchRestMinutes: 15,
      shapingMethod: 'braid (3, 4, or 6 strand)',
      proofingVessel: 'baking tray',
      scoringPattern: 'none (egg wash instead)',
    },
    bake: {
      ovenTempC: 190,
      steamRequired: false,
      bakingVessel: 'baking tray',
      bakeTimeMinutes: 30,
      notes: 'Brush with egg wash (1 egg + splash of water) before proofing and again just before baking for a deep golden shine.',
    },
    tips: [
      'Challah dough is stiff — a stand mixer makes life much easier.',
      'The oil and egg slow fermentation slightly. Expect a longer bulk than your usual sourdough.',
    ],
  },

  // ── Brioche ───────────────────────────────────────────────────────────
  {
    id: 'brioche',
    name: 'Brioche',
    emoji: '🧈',
    description:
      'The most indulgent bread in the world. Enriched with butter and egg, brioche is soft, rich, and golden — almost cake-like. Sourdough brioche takes patience but rewards you with extraordinary flavour.',
    difficulty: 'advanced',
    dough: {
      hydrationMin: 45,
      hydrationMax: 58,
      typicalHydration: 50,
      inoculationMin: 25,
      inoculationMax: 40,
      typicalInoculation: 30,
      saltMin: 1.5,
      saltMax: 2.2,
      typicalSalt: 2.0,
      oilPct: 15,
      typicalFlourType: 'Generic: Bread Flour',
    },
    process: {
      autolyseMinutes: 20,
      folds: 2,
      foldIntervalMinutes: 45,
      benchRestMinutes: 20,
      shapingMethod: 'loaf or rolls',
      proofingVessel: 'loaf tin or ring mould',
      scoringPattern: 'none (egg wash)',
    },
    bake: {
      ovenTempC: 180,
      steamRequired: false,
      bakingVessel: 'loaf tin',
      bakeTimeMinutes: 35,
      notes: 'The high fat content slows fermentation significantly. Be patient — cold-proofing overnight is ideal. Egg wash before baking for a glossy crust.',
    },
    tips: [
      'Add the butter gradually — incorporate in small cubes at medium speed once the dough has developed some gluten.',
      'Cold-proofing is almost mandatory — the butter needs to stay cold for the dough to be workable.',
    ],
  },

  // ── Crackers / Grissini ───────────────────────────────────────────────
  {
    id: 'crackers-grissini',
    name: 'Crackers / Grissini',
    emoji: '🥨',
    description:
      'Crisp sourdough crackers or Italian breadsticks. A great way to use discard starter. Roll thin, season well, and bake until golden and snapping-crisp.',
    difficulty: 'easy',
    dough: {
      hydrationMin: 35,
      hydrationMax: 55,
      typicalHydration: 45,
      inoculationMin: 15,
      inoculationMax: 30,
      typicalInoculation: 20,
      saltMin: 1.5,
      saltMax: 3.0,
      typicalSalt: 2.0,
      oilPct: 5,
      typicalFlourType: 'Generic: All-Purpose / AP',
    },
    process: {
      autolyseMinutes: 15,
      folds: 0,
      foldIntervalMinutes: 0,
      benchRestMinutes: 15,
      shapingMethod: 'rolled thin, cut into shapes or strips',
      proofingVessel: 'baking tray',
      scoringPattern: 'none (dock with fork)',
    },
    bake: {
      ovenTempC: 180,
      steamRequired: false,
      bakingVessel: 'baking tray',
      bakeTimeMinutes: 15,
      notes: 'Roll very thin (~2 mm). Dock with a fork to prevent bubbling. Bake until evenly golden — they crisp as they cool.',
    },
    tips: [
      'This is the best use for sourdough discard — the starter adds flavour, not leavening.',
      'Season generously: flaky salt, sesame seeds, za\'atar, or rosemary all work brilliantly.',
    ],
  },

  // ── Custom ────────────────────────────────────────────────────────────
  {
    id: 'custom',
    name: 'Custom',
    emoji: '✏️',
    description: 'Set everything manually. No preset defaults — you are in full control.',
    difficulty: 'easy',
    dough: {
      hydrationMin: 40,
      hydrationMax: 120,
      typicalHydration: 0,
      inoculationMin: 5,
      inoculationMax: 50,
      typicalInoculation: 0,
      saltMin: 0,
      saltMax: 5,
      typicalSalt: 0,
    },
    process: {
      autolyseMinutes: 0,
      folds: 0,
      foldIntervalMinutes: 0,
      benchRestMinutes: 0,
      shapingMethod: '',
      proofingVessel: '',
      scoringPattern: '',
    },
    bake: {
      ovenTempC: 0,
      steamRequired: false,
      bakingVessel: '',
      bakeTimeMinutes: 0,
    },
  },
];

/** Lookup map keyed by preset id */
export const PRESETS_BY_ID: Record<BreadType, RecipePreset> = (() => {
  const map: Record<string, RecipePreset> = {};
  for (const preset of RECIPE_PRESETS) {
    map[preset.id] = preset;
  }
  return map as Record<BreadType, RecipePreset>;
})();

/** Get a preset by its id, or undefined if not found */
export function getPreset(id: string): RecipePreset | undefined {
  return PRESETS_BY_ID[id as BreadType];
}
