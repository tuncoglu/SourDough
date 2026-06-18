import { FlourEntry, FlourCategory } from '../models/types';

/**
 * Shipton Mill flour catalogue + generic fallbacks.
 * Ported from optimizer.py SHIPTON_MILL_FLOURS.
 * Protein is midpoint of spec range where available, rounded to nearest 0.5%.
 */
export const SHIPTON_MILL_FLOURS: FlourEntry[] = [
  // ── White Bread Flours ──────────────────────────────────────────────
  {
    label: 'No. 4 Organic White (105)',
    protein: 13.0,
    productNumber: '105',
    category: 'White Bread',
    notes: "Shipton's flagship organic bread flour. Blend of English & continental wheats. W=275, P/L=1.0. Perfect for sourdough, yeasted & enriched breads.",
  },
  {
    label: 'French Type 55 (102)',
    protein: 12.5,
    productNumber: '102',
    category: 'White Bread',
    notes: 'French-style T55. French, Canadian & English wheat blend. W=260, P/L=0.9, Ash 0.50-0.55%. Great for baguettes, doughnuts, pain au lait.',
  },
  {
    label: 'Canadian Strong White (112)',
    protein: 14.5,
    productNumber: '112',
    category: 'White Bread',
    notes: 'High-protein blend with Canadian Prairie wheats. 14.1-15.3% protein, Ash 0.56-0.60%. Long-fermentation sourdoughs & yeasted loaves.',
  },
  {
    label: 'Italian Type 00 (118)',
    protein: 13.5,
    productNumber: '118',
    category: 'White Bread',
    notes: 'Farina di Tipo 00. Very fine, low-ash. W=340, P/L=1.0, Ash 0.45-0.50%. Pizza, pasta, viennoiserie.',
  },
  {
    label: 'Pizza & Pasta Type 00 Organic (120)',
    protein: 13.5,
    productNumber: '120',
    category: 'White Bread',
    notes: 'Organic 00 for Neapolitan pizza & silky pasta. W=320, P/L=0.8, Ash 0.45-0.55%.',
  },
  {
    label: 'Finest Bakers White No. 1',
    protein: 11.5,
    productNumber: 'No.1',
    category: 'White Bread',
    notes: 'Premium white flour. Slightly softer than No.4. Good all-rounder.',
  },
  {
    label: 'Traditional White (704)',
    protein: 12.0,
    productNumber: '704',
    category: 'White Bread',
    notes: 'Traditional (non-organic) white bread flour.',
  },
  {
    label: 'Stoneground White (119)',
    protein: 11.5,
    productNumber: '119',
    category: 'White Bread',
    notes: 'Organic stoneground white. More flavour from stone milling.',
  },
  {
    label: 'Maris Wigeon Heritage White',
    protein: 12.0,
    productNumber: 'MW',
    category: 'White Bread',
    notes: 'Single-variety heritage wheat grown within 30 miles of the mill. Distinctive flavour.',
  },
  {
    label: 'Ciabatta Organic Flour',
    protein: 12.5,
    productNumber: 'ciabatta',
    category: 'White Bread',
    notes: 'Blended for high-hydration Italian-style breads.',
  },

  // ── Wholemeal Flours ────────────────────────────────────────────────
  {
    label: '100% Wholemeal Organic (205)',
    protein: 14.0,
    productNumber: '205',
    category: 'Wholemeal',
    notes: 'Great all-round wholemeal. 12.9-15.2% protein, Ash 1.25-1.45%. Canadian & English organic wheat blend. Sourdoughs, yeasted loaves, rolls.',
  },
  {
    label: 'Stoneground Strongest Wholemeal (209)',
    protein: 14.5,
    productNumber: '209',
    category: 'Wholemeal',
    notes: 'Maximum-strength wholemeal for powerful rise in artisan loaves.',
  },
  {
    label: 'Strong Canadian Wholemeal (214)',
    protein: 14.5,
    productNumber: '214',
    category: 'Wholemeal',
    notes: 'Canadian hard wheat wholemeal blend. Maximum oven spring.',
  },
  {
    label: 'Extra Coarse Wholemeal Organic (216)',
    protein: 13.0,
    productNumber: '216',
    category: 'Wholemeal',
    notes: 'Coarse-ground for rustic texture.',
  },
  {
    label: 'Stoneground Wholemeal Organic (706)',
    protein: 13.5,
    productNumber: '706',
    category: 'Wholemeal',
    notes: 'Stoneground wholemeal — full flavour.',
  },
  {
    label: 'Biodynamic Stoneground Wholemeal (218)',
    protein: 13.5,
    productNumber: '218',
    category: 'Wholemeal',
    notes: 'Biodynamic-certified wholemeal.',
  },
  {
    label: 'Self Raising Wholemeal Organic (217)',
    protein: 10.5,
    productNumber: '217',
    category: 'Wholemeal',
    notes: 'Wholemeal with raising agent added.',
  },
  {
    label: 'Finely Ground Wholemeal Pastry (203)',
    protein: 10.0,
    productNumber: '203',
    category: 'Wholemeal',
    notes: 'Finely milled wholemeal for pastry. Softer, lower protein.',
  },

  // ── Brown, Malted & Seeded ──────────────────────────────────────────
  {
    label: '3 Malts & Sunflower Brown (705)',
    protein: 11.5,
    productNumber: '705',
    category: 'Brown, Malted & Seeded',
    notes: 'Brown flour with wheat, rye & barley malts plus sunflower seeds.',
  },
  {
    label: 'Light Malthouse (301)',
    protein: 12.0,
    productNumber: '301',
    category: 'Brown, Malted & Seeded',
    notes: 'Lightly malted flour — malty sweetness for tin loaves & rolls.',
  },
  {
    label: 'Swiss Dark Flour (409)',
    protein: 11.5,
    productNumber: '409',
    category: 'Brown, Malted & Seeded',
    notes: 'Dark Swiss-style flour. Rustic loaves.',
  },
  {
    label: 'Irish Soda Coarse Brown (406)',
    protein: 10.5,
    productNumber: '406',
    category: 'Brown, Malted & Seeded',
    notes: 'Coarse brown flour blended for Irish soda bread.',
  },
  {
    label: 'Seeded White Organic (419)',
    protein: 12.0,
    productNumber: '419',
    category: 'Brown, Malted & Seeded',
    notes: 'White flour with mixed seeds.',
  },
  {
    label: '5 Seed Blend (401)',
    protein: 12.0,
    productNumber: '401',
    category: 'Brown, Malted & Seeded',
    notes: 'Flour blend with 5-seed mix for seeded loaves.',
  },

  // ── Spelt Flours ────────────────────────────────────────────────────
  {
    label: 'White Spelt Organic (408)',
    protein: 11.0,
    productNumber: '408',
    category: 'Spelt',
    notes: 'Organic white spelt. 9.8-11.8% protein, Ash 0.58-0.63%. Nutty flavour — bread, pastry, cakes, sauces.',
  },
  {
    label: 'White Spelt (418)',
    protein: 11.0,
    productNumber: '418',
    category: 'Spelt',
    notes: 'Non-organic white spelt.',
  },
  {
    label: 'Wholemeal Spelt Organic (407)',
    protein: 12.5,
    productNumber: '407',
    category: 'Spelt',
    notes: 'Organic wholemeal spelt. Min 12.2% protein, Ash 1.4-1.5%. Soda bread, cookies, biscuits. Dense texture.',
  },
  {
    label: 'Wholemeal Spelt (417)',
    protein: 12.5,
    productNumber: '417',
    category: 'Spelt',
    notes: 'Non-organic wholemeal spelt.',
  },
  {
    label: 'Fig, Spelt & Pumpkin Seed (420)',
    protein: 10.5,
    productNumber: '420',
    category: 'Spelt',
    notes: 'Spelt flour blended with fig & pumpkin seed.',
  },

  // ── Ancient & Heritage Grains ───────────────────────────────────────
  {
    label: 'Einkorn Wholemeal Organic (412)',
    protein: 13.0,
    productNumber: '412',
    category: 'Ancient & Heritage',
    notes: 'Ancient grain — the original wheat. Rich, nutty. High protein for an ancient grain.',
  },
  {
    label: 'Emmer Wholemeal Organic (414)',
    protein: 13.0,
    productNumber: '414',
    category: 'Ancient & Heritage',
    notes: 'Ancient grain, closely related to durum. Earthy flavour.',
  },
  {
    label: 'Khorasan Organic (413)',
    protein: 12.5,
    productNumber: '413',
    category: 'Ancient & Heritage',
    notes: 'Khorasan (Kamut®) — buttery flavour, high protein.',
  },
  {
    label: 'T80 UK Wheat Heritage',
    protein: 12.0,
    productNumber: 'T80',
    category: 'Ancient & Heritage',
    notes: 'High-extraction (T80) flour from 100% UK organic heritage wheat. More flavour & minerals than white, lighter than wholemeal.',
  },
  {
    label: 'Heritage Solina White Organic',
    protein: 11.0,
    productNumber: 'solina-white',
    category: 'Ancient & Heritage',
    notes: 'Heritage Italian Solina variety. White.',
  },
  {
    label: 'Heritage Solina Wholemeal Organic',
    protein: 12.0,
    productNumber: 'solina-wholemeal',
    category: 'Ancient & Heritage',
    notes: 'Heritage Solina, wholemeal.',
  },

  // ── Rye Flours ──────────────────────────────────────────────────────
  {
    label: 'Dark Rye Type 1350 Organic (603)',
    protein: 8.5,
    productNumber: '603',
    category: 'Rye',
    notes: 'Wholemeal dark rye. Min 8.5% protein, Ash 1.30-1.45%. Dense rye breads, pumpernickel. Dough handles differently — stickier.',
  },
  {
    label: 'Light Rye Type 997 Organic (601)',
    protein: 8.0,
    productNumber: '601',
    category: 'Rye',
    notes: 'Light rye — less ash than dark rye. Milder flavour, lighter crumb.',
  },
  {
    label: 'Chopped Rye for Pumpernickel (607)',
    protein: 8.0,
    productNumber: '607',
    category: 'Rye',
    notes: 'Chopped rye grains for authentic pumpernickel.',
  },

  // ── Other Grains ────────────────────────────────────────────────────
  {
    label: 'Barley Flour Organic (405)',
    protein: 9.0,
    productNumber: '405',
    category: 'Other Grains',
    notes: 'Barley flour — low gluten. Add 10-20% for flavour.',
  },
  {
    label: 'Chapati Atta Organic (421)',
    protein: 11.0,
    productNumber: '421',
    category: 'Other Grains',
    notes: 'Fine wholemeal for chapatis & flatbreads.',
  },
  {
    label: 'Semolina Organic (507)',
    protein: 12.5,
    productNumber: '507',
    category: 'Other Grains',
    notes: 'Durum semolina. Pasta, pizza dusting, crusty breads.',
  },
  {
    label: 'Medium Oatmeal Organic (404)',
    protein: 11.0,
    productNumber: '404',
    category: 'Other Grains',
    notes: 'Oatmeal flour for biscuits & texture. Low gluten.',
  },

  // ── Cake, Pastry & Soft Flours ──────────────────────────────────────
  {
    label: 'Soft Cake & Pastry Organic (117)',
    protein: 9.5,
    productNumber: '117',
    category: 'Cake & Pastry',
    notes: 'Soft white flour. 8.8-11.6% protein, W=120, P/L=0.7. English organic soft wheat. Cakes, sponges, shortcrust pastry.',
  },
  {
    label: 'Self Raising Organic White (113)',
    protein: 10.0,
    productNumber: '113',
    category: 'Cake & Pastry',
    notes: '9.9-10.7% protein. English organic wheat + raising agents. Cakes, scones — work quickly once water is added.',
  },
  {
    label: 'French Type 45 White',
    protein: 10.0,
    productNumber: 'T45',
    category: 'Cake & Pastry',
    notes: 'Very white, soft French-style flour. Pastry, brioche, croissants.',
  },

  // ── Gluten-Free Flours ──────────────────────────────────────────────
  {
    label: 'GF All Purpose Plain White (810)',
    protein: 5.0,
    productNumber: '810',
    category: 'Gluten-Free',
    notes: 'GF blend for all-purpose baking. No gluten.',
  },
  {
    label: 'GF White Bread Mix (809)',
    protein: 5.0,
    productNumber: '809',
    category: 'Gluten-Free',
    notes: 'GF bread mix. Use GF-specific recipes.',
  },
  {
    label: 'GF Brown Teff (818)',
    protein: 11.0,
    productNumber: '818',
    category: 'Gluten-Free',
    notes: 'Gluten-free. Malty flavour. Injera, flatbreads.',
  },
  {
    label: 'GF White Teff (803)',
    protein: 11.0,
    productNumber: '803',
    category: 'Gluten-Free',
    notes: 'Gluten-free white teff.',
  },
  {
    label: 'GF Oat Flour (801)',
    protein: 10.0,
    productNumber: '801',
    category: 'Gluten-Free',
    notes: 'Gluten-free oat flour. Moisture-retentive.',
  },
  {
    label: 'GF Brown Rice Flour (816)',
    protein: 7.0,
    productNumber: '816',
    category: 'Gluten-Free',
    notes: 'Gluten-free. Slightly gritty — blend with starches.',
  },
  {
    label: 'GF White Rice Flour (802)',
    protein: 6.0,
    productNumber: '802',
    category: 'Gluten-Free',
    notes: 'GF white rice flour. Neutral flavour.',
  },
  {
    label: 'GF Buckwheat Flour (811)',
    protein: 12.0,
    productNumber: '811',
    category: 'Gluten-Free',
    notes: 'GF buckwheat — despite name, no wheat. Strong flavour.',
  },
  {
    label: 'GF Chestnut Flour (812)',
    protein: 5.0,
    productNumber: '812',
    category: 'Gluten-Free',
    notes: 'GF chestnut flour. Sweet, nutty.',
  },
  {
    label: 'GF Gram / Chickpea Flour (813)',
    protein: 20.0,
    productNumber: '813',
    category: 'Gluten-Free',
    notes: 'GF chickpea flour. High protein. Socca, flatbreads.',
  },
  {
    label: 'GF Maize Flour (805)',
    protein: 7.0,
    productNumber: '805',
    category: 'Gluten-Free',
    notes: 'GF maize/corn flour.',
  },
  {
    label: 'GF Millet Flour (814)',
    protein: 10.0,
    productNumber: '814',
    category: 'Gluten-Free',
    notes: 'GF millet flour. Mild, slightly sweet.',
  },
  {
    label: 'GF Quinoa Flour (815)',
    protein: 13.0,
    productNumber: '815',
    category: 'Gluten-Free',
    notes: 'GF quinoa flour. High protein, slightly bitter.',
  },
  {
    label: 'GF Sorghum Flour (817)',
    protein: 10.0,
    productNumber: '817',
    category: 'Gluten-Free',
    notes: 'GF sorghum flour. Mild, whole-grain-like.',
  },

  // ── Malt & Brewing Adjuncts ─────────────────────────────────────────
  {
    label: 'Diastatic Malt Flour (307)',
    protein: 10.0,
    productNumber: '307',
    category: 'Malt & Brewing',
    notes: 'Active malt flour — boosts enzyme activity. Use 0.5-2% of flour weight.',
  },
  {
    label: 'Malted Wheat Flakes (305)',
    protein: 10.0,
    productNumber: '305',
    category: 'Malt & Brewing',
    notes: 'Malted wheat flakes for texture.',
  },
  {
    label: 'Cut Malted Rye Grains (306)',
    protein: 8.0,
    productNumber: '306',
    category: 'Malt & Brewing',
    notes: 'Cut malted rye grains — soaker for texture.',
  },

  // ── Generic Fallbacks ───────────────────────────────────────────────
  {
    label: 'Generic: Bread Flour',
    protein: 12.5,
    productNumber: '-',
    category: 'Generic',
    notes: 'Strong white bread flour.',
  },
  {
    label: 'Generic: All-Purpose / AP',
    protein: 10.5,
    productNumber: '-',
    category: 'Generic',
    notes: 'Standard plain flour. 10-11% protein.',
  },
  {
    label: 'Generic: Whole Wheat / WW',
    protein: 14.0,
    productNumber: '-',
    category: 'Generic',
    notes: 'Standard wholemeal / whole wheat flour.',
  },
  {
    label: 'Generic: Rye Flour',
    protein: 9.0,
    productNumber: '-',
    category: 'Generic',
    notes: 'Generic rye flour.',
  },
  {
    label: 'Generic: Spelt Flour',
    protein: 13.0,
    productNumber: '-',
    category: 'Generic',
    notes: 'Generic spelt flour.',
  },
  {
    label: 'Generic: High-Gluten Flour',
    protein: 14.5,
    productNumber: '-',
    category: 'Generic',
    notes: 'Very strong flour for bagels, high-ratio breads.',
  },
  {
    label: 'Generic: Pastry Flour',
    protein: 9.0,
    productNumber: '-',
    category: 'Generic',
    notes: 'Soft/low-protein flour for pastry & biscuits.',
  },
  {
    label: 'Generic: Cake Flour',
    protein: 8.0,
    productNumber: '-',
    category: 'Generic',
    notes: 'Very soft flour for cakes.',
  },
];

/** Grouped flour list for category-based dropdowns */
export const FLOURS_BY_CATEGORY: Record<FlourCategory, FlourEntry[]> = (() => {
  const groups: Record<string, FlourEntry[]> = {};
  for (const flour of SHIPTON_MILL_FLOURS) {
    if (!groups[flour.category]) groups[flour.category] = [];
    groups[flour.category].push(flour);
  }
  return groups as Record<FlourCategory, FlourEntry[]>;
})();

/** Flat list of display labels for pickers */
export const FLOUR_LABELS: string[] = SHIPTON_MILL_FLOURS.map((f) => f.label);
