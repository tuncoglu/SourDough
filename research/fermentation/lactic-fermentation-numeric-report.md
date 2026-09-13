# Lactic Acid Fermentation of Vegetables — Numeric Parameters with Citations

**Scope:** QUESTION 1 (fermentable sugar / carbohydrate as driver of acidification) and QUESTION 7 (starting pH and buffering capacity).

**Conventions used throughout**
- **[MEASURED]** = value produced by analysis in the cited study (HPLC, titration, pH meter) on real vegetable or real ferment.
- **[DATABASE]** = value read from USDA FoodData Central (compiled reference value, not a single measurement).
- **[MY CALC]** = my own arithmetic on cited numbers. Flagged every time.
- **[MODEL]** = value from a model/regression, not a direct measurement of the vegetable named.
- **Confidence:** strong / moderate / weak-or-contested, with a one-line study-quality note.
- **[GAP]** = I could not find data. These are listed in full in §3.

> **Two structural warnings before any number is used.**
> 1. **The five ratios in Q1(e) are unsourced.** They trace to `sourchad.com`, a non-peer-reviewed recipe blog that does not even state them, and two of the five directions are contradicted by measurement. See §1.5.
> 2. **"Acid needed to acidify" and "acid produced in fermentation" are different quantities** in the source paper that reports both. Do not conflate them. See §2.2.

---

# QUESTION 1 — FERMENTABLE SUGAR / CARBOHYDRATE CONTENT

## 1.1 (a) Sugar content of fermentation vegetables

### 1.1.1 The most important correction: cabbage is NOT 3.2 g/100 g for fermentation purposes

USDA FDC reports green cabbage total sugars as **3.2 g/100 g**, but that specific value carries derivation code **`NC` = *Calculated***, not analytical. Its *individual* sugars are analytical and do sum to it.

| Item | Value |
|---|---|
| Source | USDA FoodData Central, SR Legacy, FDC ID **169975** "Cabbage, raw" |
| URL | https://fdc.nal.usda.gov/food-details/169975/nutrients |
| Values **[DATABASE]** | Total sugars **3.20 g/100 g** (derivation `NC`, calculated) · glucose **1.67** · fructose **1.45** · sucrose **0.08** · maltose **0.01** (individual sugars derivation `JA`, analytical) → sum **3.21 g** |
| Confidence | **STRONG** for the numbers; **MODERATE** as a fermentation driver (single compiled entry, unknown cultivar/season) |
| Quality note | Compiled national database value, not a designed experiment; n and sampling not reported per food. |

**Why this matters.** Independent HPLC work on real cabbage lots gives materially different numbers, in both directions:

| Source | Total fermentable sugar in cabbage | Basis | Confidence |
|---|---|---|---|
| Pederson & Albury 1969, *The sauerkraut fermentation*, NY State Agric Exp Sta Bull 824 | **2.9 – 8.7 %** | cited in Fleming & McFeeters 1985 | Moderate (secondary citation; bulletin not obtained — **[GAP]**) |
| Hughes & Lindsay 1985, *J Food Sci* 50(6):1662–1667, doi 10.1111/j.1365-2621.1985.tb10560.x | **6.3 – 9.4 %** across cabbage cultivars (cited as 5.0–9.4 % in one ARS paper) | HPLC, multiple cultivars | Moderate (citation verified via Crossref; **values paywalled / NOT OBTAINED**) |
| **Fleming & McFeeters 1985**, 1984 Sauerkraut Seminar, *NY State Agric Exp Sta Special Report No. 56:25–29* | **4.9 %** (glucose 2.3, fructose 2.3, sucrose 0.3) | **HPLC, fresh market cabbage** | **STRONG** |
| **Plengvidhya, Breidt, Lu & Fleming 2007**, *Appl Environ Microbiol* 73(23):7697–7702, PMC2168044 | **2.80 – 3.96 %** across 4 commercial Wisconsin tanks | **HPLC, commercial sauerkraut cabbage, 2 years** | **STRONG** |

**Conclusion for cabbage [MEASURED]:** reported fermentable sugar in cabbage spans roughly **2.8 – 9.4 g/100 g** depending on cultivar, season and lot. The FDC figure of 3.2 g/100 g sits at the **bottom** of that range. **FDC total sugars should not be used to predict sauerkraut acidification.** For a specific lot you must measure it.

### 1.1.2 Cabbage sugar speciation, including the leaf/core split

| Item | Value |
|---|---|
| Source | Data reproduced in Fleming HP 1987, "Considerations for the controlled fermentation and storage of sauerkraut", ARS Pickle Pub **p201**, Table 2 (originally Fleming et al. 1987, *J Food Sci*) |
| URL | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf |
| Confidence | **STRONG** — n = 4 replicates, HPLC |

| Fraction | Sucrose | Glucose | Fructose | Malic acid | **Total sugars** |
|---|---|---|---|---|---|
| Leaves | 7.0 mM = **0.25 %** | 132.5 mM = **2.38 %** | 114.2 mM = **2.05 %** | 12.2 mM = 0.16 % | **4.68 %** |
| Core | 53.1 mM = **1.91 %** | 75.7 mM = **1.36 %** | 60.3 mM = **1.08 %** | 7.1 mM = 0.09 % | **4.35 %** |

**Key point:** the core is sucrose-rich *per unit weight* but is only **23 % of cabbage weight**, so whole-cabbage sucrose is low (**0.44 %**) and glucose/fructose dominate. Sucrose is therefore never a major substrate in sauerkraut.

### 1.1.3 The best multi-vegetable controlled dataset (USDA ARS Raleigh)

| Item | Value |
|---|---|
| Source | Little C, Cruz-Martínez V, St Fort DP, Pagán-Medina C, Page CA, Perez-Perez Y, Taveirne ME, Lee AM, Arroyo-González N, Santiago-Ortiz C, **Pérez-Díaz IM**. 2022. "Vegetable fermentations brined with low salt for reclaiming food waste." *J Food Sci* 87(5):2121–2132 |
| DOI | https://doi.org/10.1111/1750-3841.16084 |
| PDF | https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p447.pdf *(scanned-image tables; requires `curl -A "Mozilla/5.0"` then image reading — returns HTTP 406 to a plain fetch)* |
| Confidence | **STRONG** — 3 lots per vegetable, 30 °C, 21 days, 2 % NaCl, HPLC + Megazyme enzymatic kits, triplicate titrations |
| Caveat | 8 vegetables only; **cabbage, napa, beetroot, cauliflower and jalapeño are NOT in this set** |

**Table 1 — measured intrinsic sugars [MEASURED], mM:**

| Vegetable | Glucose | Fructose | Sucrose | Malic acid |
|---|---|---|---|---|
| Green bean | 49.28 ± 1.13 | 46.88 ± 3.44 | 2.14 ± 1.25 | 14.12 ± 4.96 |
| Green bell pepper | 44.50 ± 1.13 | 50.06 ± 3.15 | 29.27 ± 1.09 | none detected |
| Broccoli | 2.12 ± 1.06 | 0.93 ± 0.25 | 1.24 ± 0.70 | 23.23 ± 5.59 |
| Green leaf lettuce | 11.61 ± 3.62 | 23.29 ± 3.48 | 17.75 ± 2.27 | 13.74 ± 6.77 |
| Green pea | 11.20 ± 2.15 | 13.91 ± 1.09 | 14.53 ± 2.26 | 7.23 ± 4.48 |
| Sweet yellow corn | 38.16 ± 2.98 | 32.50 ± 0.96 | 40.58 ± 3.85 | 13.80 ± 3.40 |
| Sweet potato | 60.5 | 38.0 | 76.3 | — |
| Red ripe tomato | (glucose+fructose, varied widely) | | 20.0 ± 3.4 | — |

**Authors' own caveat, verbatim:** they note sugar content varies **within** vegetable type — their green pea lot measured 11.20/13.91/14.53 mM vs USDA reference 3.33/10.82/**72.89** mM, and broccoli also differed substantially from published values. They attribute this to variety, physiological stage and source. **This is direct evidence that composition tables are not a reliable lot proxy.**

### 1.1.4 Commercial sauerkraut cabbage, exact bridge table

| Item | Value |
|---|---|
| Source | Plengvidhya V, Breidt F, Lu Z, Fleming HP 2007. "DNA Fingerprinting of Lactic Acid Bacteria in Sauerkraut Fermentations." *Appl Environ Microbiol* 73(23):7697–7702 |
| URL | https://pmc.ncbi.nlm.nih.gov/articles/PMC2168044/ |
| Confidence | **STRONG** — commercial plant, ~100 Mg cabbage, 4 tanks over 2 years, HPLC |

**Table 1 [MEASURED] — "Biochemistry of cabbage used in sauerkraut fermentations":**

| Year | Tank | Glucose mM (%) | Fructose mM (%) | Sucrose mM (%) | Malic acid mM (%) | **Total sugars %** |
|---|---|---|---|---|---|---|
| Y1 | 1 | 119.2 (**2.15**) | 90.8 (**1.64**) | 4.8 (**0.17**) | 5.6 (0.08) | **3.96** |
| Y2 | 1 | 92.4 (1.66) | 81.7 (1.47) | ND | 3.9 (0.05) | **3.13** |
| Y2 | 2 | 90.8 (1.63) | 83.5 (1.50) | ND | 3.5 (0.05) | **3.13** |
| Y2 | 3 | 81.7 (1.47) | 73.8 (1.33) | ND | 4.7 (0.06) | **2.80** |

Verbatim from the paper: *"Glucose and fructose were the primary fermentable sugars in the cabbage (the concentrations were between 1.5 and 2.2%, respectively). Sucrose accounted for only a small amount of the fermentable sugars (less than 0.2% of the cabbage by weight) and was not detectable in Y2 samples."*

**[MY CALC] Range: 2.80 – 3.96 % total fermentable sugar.** This is the best-characterised commercial lot data in the literature and it sits **at the low end** of all published cabbage values.

### 1.1.5 Cabbage — practical takeaway

| Quantity | Value | Source |
|---|---|---|
| Fermentable sugar, range across all sources | **2.8 – 9.4 g/100 g FW** | Pederson & Albury 1969; Hughes & Lindsay 1985; Fleming & McFeeters 1985; Plengvidhya et al. 2007 |
| Best single well-replicated values | **3.96 %** (Y1 tank 1) and **2.80–3.13 %** (Y2 tanks) | Plengvidhya et al. 2007 |
| FDC "total sugars" | **3.2 g/100 g** (calculated `NC`) | FDC 169975 |
| Spread | **~3.4×** between lowest and highest published lot | — |

**Confidence: STRONG** that the spread is real and lot-specific measurement is required. **Do not quote a single cabbage sugar number.**

### 1.1.6 Napa / Chinese cabbage

| Item | Value | Source | Confidence |
|---|---|---|---|
| **Sugar → final acidity regression** | Final titratable acidity **TA = 0.30x + 0.07779**, where x = soluble solids (°Brix) | Shim ST, Kim KJ, Kyung KH 1990, *Korean J Food Sci Technol* 22(3):278–284 — https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=SPGHB5-1990-v22n3-278&tempLang=en | **MODERATE** (Korean-language; abstract-only retrievable; n not stated) |
| °Brix, spring-sown napa | **1.20 – 3.40** | same | Moderate |
| °Brix, autumn-sown napa | **3.8 – 6.6** | same | Moderate |
| Season vs variety | "seasonal variations were much more significant than the varietal variations" | same | Moderate |
| Threshold for over-acidification | A cabbage would need S.S. ≈ **2.6 °Brix or less** to be un-over-acidifiable in prolonged storage **[MY CALC]** solving 0 = 0.30x + 0.07779 | same | Moderate |
| Raw napa sugar in g/100 g | **[GAP] NOT FOUND** | — | — |
| Proxy | Kimchi juice at day 0: glucose **17.16 ± 1.38 mg/mL**, sucrose **1.29 ± 0.03 mg/mL** | Jung S, Hwang IM, Lee JH 2024, *Heliyon* 10(6):e27174, PMC10926072 | Moderate |
| FDC reference | FDC **169979** "Cabbage, chinese (pe-tsai), raw": total sugars **1.41 g/100 g**, derivation **`BFSN`** (borrowed from similar food — NOT a measurement), no speciation | https://fdc.nal.usda.gov/food-details/169979/nutrients | Weak (imputed) |

**This is the single best sugar→acidity relationship for napa.** Spring napa can have **less than half** the sugar of autumn napa — a 2–3× seasonal swing that dwarfs any varietal effect.

### 1.1.7 Full FDC sugar table for the requested vegetables

All values **[DATABASE]**, g/100 g raw, from USDA FoodData Central SR Legacy / Foundation Foods bulk releases. **Derivation code is given because it determines whether the number is a measurement.** `A` = analytical, `NC` = calculated, `T` = from another source, `O` = imputed, `BFSN` = borrowed from similar food, `Z` = assumed zero.

| Vegetable | FDC ID | Total sugars | Code | Glucose | Fructose | Sucrose | Maltose | Starch |
|---|---|---|---|---|---|---|---|---|
| Green cabbage | 169975 | **3.20** | `NC` | 1.67 | 1.45 | 0.08 | 0.01 | — |
| Red cabbage | 169977 | **3.83** | `NC` | 1.74 | 1.48 | 0.60 | 0 | — |
| Napa / pe-tsai | 169979 | **1.41** | `BFSN` | — | — | — | — | — |
| Cucumber, with peel | 168409 | **1.67** | `NC` | 0.76 | 0.87 | 0.03 | 0.01 | 0.83 |
| Carrot | 170393 | **4.74** | `NC` | 0.59 | 0.55 | 3.59 | 0 | 1.43 |
| Beetroot | 169145 | **6.76** | `O` | — | — | — | — | — |
| Daikon / radish | 168451 | **2.50** | `T` | — | — | — | — | — |
| Cauliflower | 169986 | **1.91** | **`A`** | 0.94 | 0.97 | 0 | 0 | — |
| Green snap bean | 169961 | **3.26** | **`A`** | 1.51 | 1.39 | 0.36 | 0 | — |
| Green bell pepper | 170427 | **2.40** | `NC` | 1.16 | 1.12 | 0.11 | 0 | — |
| Jalapeño | 170497 | **5.10** | `BFSN` | — | — | — | — | — |
| Hot chilli, green | 168576 | **4.12** | — | 1.48 | 2.63 | 0 | — | — |
| Onion | 170000 | **4.24** | `NC` | 1.97 | 1.29 | 0.99 | 0 | — |
| Garlic | 169230 | **1.00** | `T` | — | — | — | — | — |
| Tomato, red ripe | 170457 | **2.63** | `NC` | 1.25 | 1.37 | 0 | 0 | — |
| Apple | 171688 | **10.4** | **`A`** | 2.43 | 5.90 | 2.07 | 0 | 0.05 |
| Pear | 169118 | **9.75** | **`A`** | 2.60 | 6.42 | 0.71 | 0 | — |
| Broccoli | 170379 | **1.70** | `NC` | 0.49 | 0.68 | 0.10 | 0.21 | — |
| Sweet potato | 168482 | **4.18** | `NC` | 0.96 | 0.70 | 2.52 | 0 | 12.6 |
| Sweet corn | 169998 | **6.26** | **`A`** | 3.43 | 1.94 | 0.89 | 0 | 5.7 |

**Confidence: STRONG** as database values; **WEAK** as fermentation predictors.
**Quality note:** of 92 produce rows examined, **only 18 had analytically measured total sugars**. Garlic, daikon and beetroot are `T`/`O`/`BFSN` — **not measurements**. Foundation Foods "Cabbage, green, raw" (2346407) contains **no sugar data at all**, so it does not help.

**Two traps flagged explicitly:**
- **Olives:** FDC (169094/169095) reports total sugars = **0 g** with derivation **`Z` "Assumed zero"**. This is plainly wrong. Do not use FDC sugars for olives.
- **Sugar beet:** absent from FDC entirely (industrial crop). Only garden beet (169145) exists.

**USDA Agriculture Handbook No. 8 answer [GAP — resolved negatively]:** AH-8-11 (1984) reports **no sugar values at all**. Read directly via HathiTrust full view (`hdl.handle.net/2027/umn.31951002926106c`); raw cabbage = printed p.109, NDB 11109. Its nutrient list is proximate/minerals/vitamins/lipids/amino acids only. Page 3 verbatim: *"The carbohydrate value is the difference between 100 and the sum of the percentages of water, protein, fat, and ash. The value for carbohydrate includes crude fiber."* **There are no AH-8 sugar values to report.**

### 1.1.8 Cucumber — real lot data with sugar depletion

| Item | Value |
|---|---|
| Source | Fan X, Johanningsmeier SD, Schultheis J, Starke K, Osborne JA, Collins M 2024. "Quantification of cucurbitacin C in bitter cucumber and its reduction by fermentation and acidification." *J Food Compos Anal* 129:106065 |
| Confidence | **STRONG** — n = 3 independent replicates, HPLC, 28 °C, 14 days |

**[MEASURED] Table 1, mM:**

| Analyte | Fresh Hanzil | Fresh Vlaspik | Fermented Hanzil | Fermented Vlaspik |
|---|---|---|---|---|
| pH | 5.92 ± 0.11 | 5.93 ± 0.13 | **4.18 ± 0.28** | **4.67 ± 0.46** |
| Glucose | 57.38 ± 4.56 | 50.07 ± 7.83 | 10.11 ± 9.20 | 3.76 ± 8.40 |
| Fructose | 68.43 ± 4.77 | 60.64 ± 8.39 | 19.87 ± 14.48 | 8.13 ± 15.71 |
| Ethanol | 2.72 ± 0.78 | 1.89 ± 0.96 | 27.46 ± 16.36 | 34.42 ± 12.16 |
| Malic acid | 24.14 ± 1.62 | 21.47 ± 2.36 | 1.59 ± 0.67 | 1.02 ± 0.56 |
| Succinic acid | 30.21 ± 3.50 | 22.75 ± 3.58 | 17.08 ± 4.18 | 16.69 ± 1.55 |
| Lactic acid | 0.78 ± 0.70 | 0.56 ± 0.57 | **32.86 ± 11.32** | **15.05 ± 13.69** |

**[MY CALC] Total hexose: Hanzil 125.8 mM, Vlaspik 110.7 mM.** Both fermentations were **incomplete** (residual sugar) and the two cultivars differed ~2× in final lactic acid despite similar starting sugar — cultivar/community effects, not sugar supply.

**Corroborating ARS statement [MEASURED]:** Fleming & McFeeters 1985 (p182) — *"Cucumbers usually contain less than 2.5 percent sugars, as glucose and fructose."* **Confidence: STRONG** (HPLC-based statement in a peer-reviewed seminar report).

### 1.1.9 Beetroot

| Item | Value | Source | Confidence |
|---|---|---|---|
| Total sugar, juice | **~7.7 %**, of which **95 % sucrose** | Wruss J et al. 2015, *J Food Compos Anal* 42:46–55, doi 10.1016/j.jfca.2015.03.005 (7 varieties, Upper Austria) | **STRONG** |
| ⇒ sucrose **[MY CALC]** | **≈ 7.3 g per 100 mL juice** | same | Strong |
| Total sugars, root | **24.6 – 41.5 g/100 g DW**; sucrose 3.94–40.79 g/100 g DW | Almeida D et al. 2025, *Plants* 14(4):591, PMC11859049 | Moderate |
| ⇒ fresh-weight **[MY CALC]** | **≈ 5.4 – 6.6 g/100 g FW** (at 13–16 % DM); **range across cultivars spans >10×** | same | Moderate |
| FDC | **6.76 g/100 g**, derivation `O` (imputed) | FDC 169145 | Weak |

**Key point:** beetroot sugar is **~95 % sucrose** — unique among the vegetables here, which are glucose/fructose-dominated.

### 1.1.10 Which vegetables are high-sugar vs low-sugar [MEASURED, cross-source]

| Tier | Vegetables | Total sugar g/100 g FW |
|---|---|---|
| High | Apple 10.4, Pear 9.75, Beetroot ~6.8, Sweet corn 6.26 | 6 – 10 |
| Moderate | Jalapeño 5.10, Carrot 4.74, Onion 4.24, Sweet potato 4.18, Cabbage 2.8–9.4 | 3 – 6 |
| Low | Green bean 3.26, Red cabbage 3.83, Green bell pepper 2.40, Cucumber 1.67, Broccoli 1.70, Cauliflower 1.91, Garlic 1.00, Napa 1.41 | 1 – 4 |

---

## 1.2 (b) Does measured sugar predict acidification rate / final acidity?

**Short answer: it predicts the ENDPOINT strongly, and the RATE weakly to not at all. The rate is set by temperature, salt, inoculum and species succession.**

### 1.2.1 Strong positive evidence — endpoint IS predictable from sugar + buffer

| Item | Value |
|---|---|
| Source | Little et al. 2022, *J Food Sci* 87:2121–2132 (see §1.1.3 for full citation) |
| Verbatim conclusion | *"It is concluded that the completion of a vegetable fermentation can be predicted from lot specific sugar content and buffer capacity."* |
| Method | They **predicted outcomes in advance** from measured sugar and titration data, then confirmed them by fermenting |
| Confidence | **STRONG** — 3 lots/vegetable, 30 °C, 21 days, replicated |

Their predictions and outcomes:

| Vegetable | Sugar sufficient for (mM LA) | Acid needed to pH 3.0 (mM) | Predicted | **Observed** |
|---|---|---|---|---|
| Green leaf lettuce | 86.04 | 135 | complete | reduced pH 5.9 → **3.63 ± 0.37**; sugars below detection |
| Broccoli | 156.59 | 173 | complete | **pH 4.3 ± 0.5** (complete, low acid) |
| Green pea | 119.87 | — | complete | pH 6.0 → **3.7 ± 0.1** at 14 d |
| Green bell pepper | 275.93 | 64.8 | **incomplete** | **pH 3.1 ± 0.2, residual sugars** |
| Green bean | 351.27 | 57.6 | **incomplete** | **pH 3.1 ± 0.2, residual sugars** |
| Tomato | 366.41 | 65.0 | **incomplete** | **pH 3.3 ± 0.2, residual sugars** |
| Sweet potato | 502.05 | 72.3 | **incomplete** | pH 3.4 ± 0.4 at 21 d, **substantial sugar remaining** |
| Sweet yellow corn | 699.57 | 210 | **incomplete** | pH 3.4 ± 0.4 at 21 d, **substantial sugar remaining** |

**All eight predictions were confirmed.** This is the strongest evidence in the literature that sugar + buffer jointly determine fermentation completion.

### 1.2.2 Strong NEGATIVE evidence — sugar does NOT set the early RATE

| Item | Value |
|---|---|
| Source | Fleming HP, McFeeters RF, Humphries EG 1988, *Biotechnol Bioeng* 31(3):189–197 ("A fermentor for study of sauerkraut fermentation"); data reproduced in ARS Pickle Pub **p201**, Figs 3–5 |
| URL | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf |
| Confidence | **STRONG** — controlled laboratory fermentor, replicated, purged |

**Fig. 3 [MEASURED] — titratable acidity and pH during sauerkraut fermentation:**

| Day | pH | Titratable acidity (% as lactic) |
|---|---|---|
| 0 | ~6.2 | ~0.05 |
| 1 | ~5.5 | ~0.05 |
| 2 | ~4.9 | ~0.20 |
| 4 | ~4.6 | ~0.47 |
| 6 | ~4.5 | ~0.75 |
| 8 | ~4.4 | ~0.84 |
| 12 | ~4.15 | ~0.97 |
| 16 | ~3.9 | ~1.40 |
| 20 | ~3.8 | ~1.68 |
| 28 | ~3.65 | ~1.95 |
| 60 | ~3.5 | ~2.10 |
| 150 | ~3.4 | ~2.20 |

*Values are my calibrated readings of the plotted curves (±0.05 pH / ±0.05 % acidity).*

**[MY CALC] Acidification rate:** pH fell **~1.6 units in the first 4 days ≈ 0.4 pH units/day initially**, then slowed markedly after ~8 days. The paper states: *"Rate of acid production during the fermentation was relatively rapid during the gaseous stage, slowed at about 8 days, and then increased again."*

**Fig. 4 [MEASURED] — the decisive sugar data:**

| Day | Glucose mM | Fructose mM | Sucrose mM |
|---|---|---|---|
| 0 | 35 | 31 | ~2.5 |
| 2 | 47 | 26 | ~2.5 |
| 4 | 70 | 17 | ~2.5 |
| 8 | 76 | 7.5 | ~2 |
| 12 | 73 | 0 | ~1.5 |
| 16 | 60 | — | — |
| 20 | 41 | — | — |
| 28 | 29 | — | — |
| 60 | ~2 | — | — |

**Glucose CONCENTRATED in the brine from 35 mM to 76 mM during days 0–8 — precisely the period of fastest acidification.** Fructose was depleted by day 12 while glucose persisted to day 60.

**Conclusion [STRONG]:** the early acidification rate is limited by **microbial growth and species succession**, not by sugar availability. Sugar was demonstrably *accumulating* while pH fell fastest. **A vegetable with 2× the sugar will not ferment 2× as fast.**

Fig. 5 [MEASURED] — products by day 60: lactic acid **~250 mM**, mannitol **~100 mM**, acetic acid **~90 mM**, ethanol **~60 mM**.

### 1.2.3 Rate is dominated by temperature

| Item | Value |
|---|---|
| Source | Kim J, Park H, Moon B, Kim S 2025. "Effect of Fermentation Conditions on Functional Quality of Napa Cabbage Kimchi." *Foods* 14(16):2826 |
| URL | https://pmc.ncbi.nlm.nih.gov/articles/PMC12385461/ |
| Confidence | **STRONG** — n = 3 per timepoint, real napa kimchi (2.3 % salt), controlled incubators |

| Stage | Expected pH | 4 °C | 15 °C |
|---|---|---|---|
| Non-fermented | > 5 | 5.57 ± 0.01 (day 0) | 5.57 ± 0.01 (day 0) |
| Optimally fermented | 4.0 – 4.5 | **4.32 ± 0.01 at day 47** | **4.36 ± 0.00 at day 3** |
| Excessively fermented | < 4.0 | 3.98 ± 0.01 at day 168 | 3.89 ± 0.00 at day 14 |

Authors' own conclusion: *"kimchi stored at 15 °C ferments approximately 15 times faster than at 4 °C in terms of reaching the optimal pH range."* **[MY CALC] Q₁₀ ≈ 4.6** over 4→15 °C.

**Also established here (verbatim):** *"the optimal fermentation period of kimchi has been defined as the stage when the pH reaches between 4.0 and 4.5, and a pH value below 4.0 is generally considered indicative of over-ripening or excessive fermentation."*

**Implication:** any claim about relative vegetable fermentation speed is meaningless unless temperature is pinned. An 11 °C difference moves time-to-target by 15×; the claimed between-vegetable ratios span only 0.8–1.8×.

### 1.2.4 The classic sauerkraut literature on sugar utilisation

| Source | Finding | Confidence |
|---|---|---|
| **Fleming HP, McFeeters RF 1985**, "Residual sugars and fermentation products in raw and finished commercial sauerkraut", 1984 Sauerkraut Seminar, *NY State Agric Exp Sta Special Report No. 56:25–29*. PDF: https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p182.pdf | Defines **"completely fermented"** sauerkraut as *"that has been fermented to contain no fermentable sugars"*; proposes that if no fermentable sugars remain, heat processing may be unnecessary for anaerobic stability. Found fully fermented sauerkraut **microbiologically stable in hermetically sealed containers provided pH was 3.8 or below** | **STRONG** — 10 commercial tanks, HPLC |
| same, Table 1 | 10 commercial tanks, **raw** sauerkraut: glucose **0.0–3.20 %**, fructose **0.0–3.20 %**, sucrose **0.0–3.20 %**; titratable acidity **2.1–3.3 %**; pH **3.2–3.4** | **STRONG** — direct measurement |
| same, Table 3 | **Finished** product: total sugars **0.00–1.89 %** (several exactly 0.00); titratable acidity **0.93–2.75 %**; salt 0.6–2.6 % | **STRONG** |
| same, verbatim | *"The final acidity reached in the year-old sauerkraut was two or more times that reached in cucumber fermentations, due to the greater amount of fermentable sugars in cabbage than in cucumbers."* | **STRONG** |
| **Lu Z, Fleming HP, McFeeters RF, Yoon SS 2002**, "Effects of anions and cations on sugar utilization in cucumber juice fermentation", *J Food Sci* 67(3):1155–1161. ARS record: https://www.ars.usda.gov/research/publications/publication/?seqNo115=119373 | Sugar utilisation depended on **brine anion/cation composition**, not just sugar level. 10–360 mM anions tested; inorganic anions generally **suppressed** utilisation. Acetate and lactate increased **fructose** but not glucose utilisation; citrate increased both. **10–60 mM manganese significantly increased utilisation of both sugars** | **STRONG** — model system (cucumber juice), replicated |
| **Breidt F, Skinner CR 2022**, *J Food Prot* 85(9):1273–1281, doi 10.4315/JFP-22-068. PDF: https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p450.pdf | At identical 30 °C / 2 % NaCl / 48 h, the **most-buffered** cucumber juice (smallest fruit) fermented to **complete glucose utilisation**; least-buffered (largest fruit) left **2–15 mM glucose and 15–21 mM fructose** — despite larger cucumbers having **more** sugar (Lu et al. 2002) | **STRONG** — 3 independent fermentations |

**Net answer to (b):** sugar predicts whether a fermentation *can* complete (a threshold/stoichiometry question). It does **not** predict how *fast* it goes. The best single predictor of completion is the **ratio of acid-producing potential to buffer capacity**.

### 1.2.5 The napa sugar→acidity proportionality

Shim et al. 1990 (§1.1.6) is the one paper that directly regresses final acidity on sugar: **TA = 0.30x + 0.07779** where x = °Brix. **Confidence: MODERATE** (single Korean-language study, 1990, n unstated, abstract-only access).

**[GAP]** No equivalent regression exists for cabbage, carrot, beetroot, cucumber, cauliflower or peppers.

---

## 1.3 (c) Stoichiometry

### 1.3.1 Theoretical yields

| Pathway | Reaction | g lactic acid per g hexose |
|---|---|---|
| **Homofermentative** | glucose → 2 lactic acid (2 ATP) | **1.00** (theoretical maximum) |
| **Heterofermentative** (phosphoketolase) | glucose → 1 lactic acid + 1 ethanol + 1 CO₂ (1 ATP); or 1 lactate + 1 acetate + 1 CO₂ if an external electron acceptor is available | **0.50** (0.51 g ethanol + 0.49 g CO₂) |
| **Mannitol shunt** (fructose as electron acceptor) | 3 fructose → 2 mannitol + 1 lactate + 1 acetate + 1 CO₂ | ~0.33 lactate + ~0.67 mannitol per fructose |

**Confidence: STRONG** — standard, settled biochemistry (Embden–Meyerhof–Parnas vs phosphoketolase pathway). *Note: these are textbook stoichiometries; I did not locate a single primary paper as the canonical citation, because this is not a contested value.*

### 1.3.2 What is actually measured in vegetable fermentations

| System | Measured outcome | Source | Confidence |
|---|---|---|---|
| **Cucumbers, anaerobic tanks** | *"lactic acid accounting for **95 %** of the cucumber sugars fermented"*; fermentations "predominantly homofermentative" | Fleming HP, McFeeters RF, Daeschel MA, Humphries EG, Thompson RL 1988, *J Food Sci* 53(1):127–133, doi 10.1111/j.1365-2621.1988.tb10192.x — abstract: https://agris.fao.org/search/en/records/65df33154c5aef494fe0bdc0 | **STRONG** |
| **Sauerkraut, controlled fermentor** | By day 60: lactic acid ~250 mM, **mannitol ~100 mM**, acetic acid ~90 mM, ethanol ~60 mM from ~40 % of the sugar consumed. **[MY CALC]** lactic acid is only ~**50–70 %** of the carbon going to fermentation products | Fleming et al. 1987 data in ARS p201, Fig. 5 | **STRONG** for the figure shape; values are my reading of plotted curves |
| **Green beans** | *"Fructose was nearly quantitatively reduced to mannitol with a concomitant accumulation of acetic acid."* Max **3.74 %** sugar metabolised in bean juice containing 2.5 % NaCl + 0.08 % acetic acid | Chen K-H, McFeeters RF, Fleming HP 1983, "Complete Heterolactic Acid Fermentation of Green Beans by *Lactobacillus cellobiosus*", *J Food Sci* **48**(3):967–971, doi 10.1111/j.1365-2621.1983.tb14942.x — *citation verified via Crossref*. Companion: Chen K-H, McFeeters RF, Fleming HP 1983, *J Food Sci* **48**(3):972–974, doi 10.1111/j.1365-2621.1983.tb14943.x — *"Completely fermented beans were microbiologically stable for at least 6 months under anaerobic conditions at 27 °C"* | **MODERATE–STRONG** |
| **Green beans, mixed culture** | *"An inoculum of 10 CFU/ml Lactobacillus plantarum and 10⁶ CFU/ml L. cellobiosus resulted in the formation of **twice as much lactic acid** as inoculation with L. cellobiosus alone."* | same | Moderate–Strong |
| **8 vegetables, 30 °C** | Every vegetable produced **both** lactic and acetic acid, plus ethanol, succinic and/or malic acid. E.g. green bean 155.7 mM lactic + 43.5 mM acetic + 28.5 mM ethanol + 14.03 mM succinic | Little et al. 2022, Tables 1–2 | **STRONG** |

**Practical rule [STRONG]:** in a real vegetable fermentation **assume ~0.5–0.7 g lactic acid per g sugar fermented**, not 1.0. The remainder goes to acetic acid, ethanol, mannitol and CO₂. This matters directly for any acid-requirement calculation.

### 1.3.3 How much sugar is needed to reach pH 3.5 / 4.0?

**This cannot be answered from a published per-vegetable table — that table does not exist. [GAP]** It must be computed from buffer capacity, and buffer capacity is only published for 8 vegetables (none of them cabbage, napa, beetroot or cauliflower). Below is the calculation with its inputs stated.

**Step 1 — acid required, measured at pH 3.0 (the only such measurement set).** From Little et al. 2022, Table 2. **Critical caveat: these titrations were done on a 50:50 vegetable:water slurry (50.0 ± 1.0 g blended vegetable + 50.0 ± 0.2 g distilled water), whereas their "calculated lactic acid equivalents" are computed from the sugar content of the vegetable tissue.** The two columns therefore have different denominators and must not be subtracted from one another without correction.

| Vegetable | Lactic acid needed to pH 3.0, mM (in 50:50 slurry) | **[MY CALC]** g lactic acid per kg **slurry** (×0.09008) | **[MY CALC]** g per kg **tissue** (×2) |
|---|---|---|---|
| Green bean | 57.6 ± 1.5 | 5.19 | ~10.4 |
| Green bell pepper | 64.8 ± 3.0 | 5.84 | ~11.7 |
| Red ripe tomato | 65.0 ± 3.0 | 5.86 | ~11.7 |
| Orange sweet potato | 72.3 ± 2.0 | 6.51 | ~13.0 |
| Green leaf lettuce | 135 ± 15 | 12.16 | ~24.3 |
| Broccoli | 173 ± 13 | 15.58 | ~31.2 |
| Sweet yellow corn | 210 ± 14 | 18.92 | ~37.8 |
| Green pea | not determined (NA) | — | — |

**Step 2 — sugar required [MY CALC].** At homofermentative yield (1.0 g LA/g sugar) the sugar mass equals the acid mass: **~10–38 g sugar per kg tissue** to reach pH 3.0. At a realistic sauerkraut-type yield (0.65 g LA/g sugar) it is **~16–58 g per kg**.

**Step 3 — compare to actual sugar content.** Measured/DB sugar contents are 17–68 g/kg (cucumber 1.67 % to beetroot 6.8 %). **So the required sugar is right at the edge of what these vegetables contain** — which is exactly why some complete and some do not.

**Step 4 — cabbage-specific anchor, from measured sauerkraut titration.** Using Fleming et al. 1987 (p201, Fig. 3) and treating titratable acidity as lactic acid equivalents:

| Target pH | Titratable acidity reached | **[MY CALC]** g lactic acid per kg cabbage |
|---|---|---|
| **pH 4.4** (≈ first "safety" milestone) | ~0.84 % | **~8.4** |
| **pH 3.9** | ~1.40 % | **~14.0** |
| **pH 3.4** (fully fermented) | ~2.20 % | **~22.0** |

**Confidence: MODERATE** — this is my arithmetic on Fujiwara-style titratable acidity from a plotted figure (±15 %), not a published acid-requirement table.

**Step 5 — the headline answer [MY CALC, MODERATE].** To bring cabbage from pH ~6.2 to **pH 4.0**, approximately **8–12 g lactic acid per kg** is needed; to reach **pH 3.5**, approximately **18–22 g/kg**. At 0.65 g LA/g sugar that means consuming **~12–18 g sugar/kg** to hit pH 4.0 and **~28–34 g/kg** to hit pH 3.5. Given cabbage contains 28–94 g sugar/kg, **pH 4.0 is reached after consuming only ~20–50 % of the sugar; pH 3.5 after ~40–80 %.** This is consistent with the observation that sauerkraut hits pH 4.4 with 0.84 % acidity while sugar is still abundant (Fig. 4, day 8).

**[GAP]** No published table of "g lactic acid per kg to reach pH 4.0 / 3.5" exists for any individual vegetable. Any such table in circulation is an extrapolation.

---

## 1.4 (d) Turnaround: does 2× sugar ferment 2× as fast?

**No. The relationship saturates, and in the early phase it inverts.**

| Evidence | Finding | Confidence |
|---|---|---|
| Fleming et al. 1987 (p201 Fig. 4) | Glucose **rose** 35 → 76 mM during days 0–8 while pH fell fastest (6.2 → 4.4). Substrate was not limiting; growth/succession was | **STRONG** |
| Little et al. 2022 | Sweet corn (699.6 mM LA potential, the highest of 8) was among the **slowest and never completed** (21 d, pH 3.4, substantial sugar left). Broccoli (86 mM potential, the lowest) **completed** | **STRONG** |
| Breidt & Skinner 2022 (p450) | At identical conditions, the more-buffered smaller cucumbers completed; larger ones (with **more** sugar) did not | **STRONG** |
| Fleming & McFeeters 1985 (p182) | In commercial practice sauerkraut **does** reach ≤ 3.8 pH with residual sugars 0.00–1.89 % — sugar is generally fully consumed, but over weeks not days | **STRONG** |
| Kim et al. 2025 | 15× time difference from temperature alone (4 → 15 °C) — a far larger lever than any 2× sugar difference | **STRONG** |

**Is sugar ever limiting? Yes — but usually for *completion*, not *speed*:**
- **Sugar-limited (won't finish acidifying):** broccoli, green leaf lettuce, green pea — acid demand to pH 3.3 exceeded what their sugar could produce (Little et al. 2022).
- **Buffer-limited (stops before sugar runs out):** green bean, green bell pepper, tomato, sweet potato, sweet corn — stalled at pH 3.1–3.4 with residual sugar (Little et al. 2022).
- **Neither (completes):** sauerkraut cabbage, small pickling cucumbers.

**Residual sugar at end of fermentation [MEASURED]:**
- Sauerkraut, finished product: **0.00 – 1.89 %** total sugars, several lots at exactly 0.00 % (Fleming & McFeeters 1985, Table 3). **This is the source of the commonly quoted "sauerkraut leaves 0.2–1.5 % sugar" figure — the measured range is 0.00–1.89 % across 10 tanks.**
- Sauerkraut, raw (incomplete) tanks: up to **3.26 %** (same, Table 1).
- Cucumber juice, 48 h: **2–15 mM glucose, 15–21 mM fructose** (Breidt & Skinner 2022).
- Fermented cucumber, 14 d: **10.11 mM glucose, 19.87 mM fructose** (Fan et al. 2024).

**Conclusion [STRONG]: doubling sugar does not double speed.** In the growth-limited early phase, more sugar changes little. The late phase is rate-limited by acid inhibition and buffer exhaustion. The dominant rate levers are temperature, salt concentration and inoculum.

---

## 1.5 (e) Which vegetables are genuinely fast vs slow, and the specific ratios

### 1.5.1 VERDICT ON THE CLAIM — UNSUPPORTED

**The claim (napa 1.6×, beetroot 1.8×, cauliflower 0.9×, green beans 0.8×, jalapeño 1.2×, green cabbage = 1.0) is not supported by any published source.**

Three independent reasons:

1. **No study measures time-to-target-pH for these six vegetables under a common protocol.** The normalisation the claim requires (same salt, temperature, target pH, vessel geometry, microbial load) does not exist in the literature. Full-text searches of Europe PMC (incl. OA full text), OpenAlex, Semantic Scholar and general web found no such paper. **Confidence: STRONG that the gap is real.**

2. **The apparent source does not contain the ratios.** They trace to `sourchad.com` (non-peer-reviewed recipe blog, "Chad Waldman, Analytical Chemist"):
   - Its napa page implies roughly **2.8–3.5×**, not 1.6× — https://sourchad.com/compare/napa-vs-green-cabbage
   - Its vegetable guide lists **beets 7–14 days vs cauliflower 5–10 days** — i.e. cauliflower *faster* than beetroot, **inverting** the claim's ordering — https://sourchad.com/guide/best-vegetables-to-ferment

3. **Two of the five directions are contradicted by measured data** (below).

### 1.5.2 What the actual measured times-to-pH are

| Vegetable | Target pH | Time | Temp | System | Source | Confidence |
|---|---|---|---|---|---|---|
| Green cabbage (sauerkraut, tank SK1) | 3.8 ± 0.1 | **7 d** | 19.1 → 22.1 °C | Artisanal tank, spontaneous | Gaudioso et al. 2022, *Front Microbiol* 13:929738, PMC9606823 | Moderate |
| Green cabbage (sauerkraut, tank SK2) | 4.0 ± 0.02 | **7 d** | 13.5 → 16.0 °C | Artisanal tank, spontaneous | same | Moderate |
| Napa (kimchi) | 4.36 ± 0.00 | **3 d** | 15 °C | Real kimchi, 2.3 % salt | Kim et al. 2025, *Foods* 14(16):2826 | **Strong** |
| Napa (kimchi) | 3.89 ± 0.00 | 14 d | 15 °C | same | same | Strong |
| Napa (kimchi) | 4.32 ± 0.01 | 47 d | 4 °C | same | same | Strong |
| Napa (commercial kimchi) | 4.07 (acidity 1.83 %) | **7 d** | 15 °C | Commercial kimchi | Jung et al. 2024, *Heliyon* 10(6):e27174, PMC10926072 | Moderate |
| Napa (commercial kimchi) | 4.21 | 7 d | 10 °C | same | same | Moderate |
| Napa (commercial kimchi) | 5.09 | 7 d | 4 °C | same | same | Moderate |
| Cauliflower | < 4.0 | **2 d** | 25–30 °C | Real florets, 5 % NaCl, spontaneous | Qinghang et al. 2023, *Curr Res Food Sci* 6:100493, PMC10070088 | Moderate |
| Cauliflower | 3.60 (0.54 % lactic acid) | **3 d** | 25–30 °C | same | same | Moderate |
| Broccoli | 3.56 (0.51 % lactic acid) | 3 d | 25–30 °C | same | same | Moderate |
| Beetroot juice | 4.00 | **96 h** | 24–25 °C | Juice + 25 % yoghurt water | Duyar et al. 2024, *Heliyon* 10(9):e30448, PMC11088329 | Moderate |
| Beetroot juice | 3.83 | **44 h** | 31 °C | Juice, 2 % *Lc. paracasei* | same | Moderate |
| Green bean | < 4.0 | **4 d** (starter) / **8 d** (none) | **[GAP] not stated** | Whole beans, 2 varieties | Mnkeni et al. 1995, *Ecol Food Nutr* 34(1):29–38, doi 10.1080/03670244.1995.9991453 | Weak–moderate |
| Green bean | 3.1 ± 0.2 (incomplete) | 21 d | 30 °C | 2 % NaCl, native | Little et al. 2022 | Strong |
| Chilli (9 % NaCl brine) | 3.31–3.38 | pH stable only by **day 66–77** | 25 °C | Whole peppers, 9 % NaCl + 2.5 % sugar | Huang et al. 2025, *Food Chem X* 26:102551, PMC12148400 | Moderate–strong |
| Habanero puree | 4.07–4.13 | **4 h** | **40 °C** | Sterilised puree, 10 % inoculum | López-Salas et al. 2022, *Foods* 11(22):3618, PMC9689949 | Weak as a proxy |

**Why two of the claimed directions fail:**
- **Cauliflower (claimed slowest at 0.9×)** reached pH < 4.0 in **2 days** and pH 3.60 in 3 days. Adjusting crudely for the higher temperature, it is **comparable to or faster than** sauerkraut, not 10 % slower.
- **Beetroot (claimed fastest at 1.8×)** took **4 days** to pH 4.0 without a defined starter.

**And the napa:cabbage ratio is unresolvable.** At ~15 °C: Kim 2025 kimchi reaches pH 4.36 at day 3 / 3.89 at day 14; Jung 2024 commercial kimchi reaches pH 4.07 at day 7. **The two kimchi studies disagree by ~3×.** Comparing Jung 2024 (pH 4.07 at day 7, 15 °C) with sauerkraut SK2 (pH 4.0 at day 7, 13.5–16 °C) gives **≈1.0×, not 1.6×** [MY CALC]. Comparing Kim 2025 gives kimchi *slower*.

### 1.5.3 Sugar does NOT explain the speed ordering

| Vegetable | Total sugar g/100 g | Claimed speed | Problem |
|---|---|---|---|
| Cauliflower | **1.91** (lowest of the six) | 0.9× (slowest) | If sugar drove speed, cauliflower should be slowest. Measured: it is fast (pH < 4.0 in 2 d) |
| Jalapeño | **5.10** (FDC 170497) / 4.12 (FDC 168576) — **more than green cabbage (3.20)** | 1.2× | "Peppers are slow because low sugar" is **FALSE** |
| Beetroot | ~6.8 (highest) | 1.8× (fastest) | Highest sugar, but only moderately fast |

### 1.5.4 The real determinants, ranked by evidence

1. **Temperature — dominant.** 15× time difference from 4 → 15 °C in kimchi (Kim et al. 2025). **Strong.**
2. **Salt concentration.** Sauerkraut 2–2.5 %, kimchi 2.3 %, pepper brine **8–10 %**. Peppers are slow largely because of salt. **Moderate–strong.**
3. **Buffering capacity.** Sets whether acidification stops before sugar runs out (Little et al. 2022; Breidt & Skinner 2022). **Strong.**
4. **Inoculum / native community.** Green bean: 4 d with starter vs 8 d without = **2.0×** on inoculum alone (Mnkeni et al. 1995). Pepper puree with 10 % inoculum at 40 °C reached pH 4.0 in **4 hours**. Anion/cation composition (Mn²⁺, citrate, acetate) materially changes sugar utilisation (Lu et al. 2002). **Moderate–strong.**
5. **Sugar content.** Sets the endpoint/stoichiometric ceiling, not the speed. **Strong (as a negative result).**
6. **Antimicrobial compounds (capsaicin).** **[GAP]** No measured MIC of capsaicin against LAB exists in the literature I could find. Counter-evidence: habanero puree supported μ = 0.068 h⁻¹ and 10.81 g/L lactic acid. Capsaicinoids *shift* community composition rather than blocking fermentation (Park et al. 2019, *J Microbiol Biotechnol* 29(10):1580–1590, doi 10.4014/jmb.1907.07023). **Contested / likely overstated.**
7. **Tissue structure.** Real but unquantified for cross-vegetable speed: cucumber fermentation rate depends on fruit size and thus surface:volume and diffusion path length (Lu et al. 2002; Breidt & Skinner 2022). **[GAP]** No cross-vegetable tissue-structure metric.

**Bottom line for (e):** the ratios cannot be used. Even if they were real, the inoculum-alone effect (2.0×) and temperature effect (15×) are the same size or far larger than the claimed between-vegetable spread (0.8–1.8×), so **the claimed differences are below the noise floor of normal process variation.**

---

# QUESTION 7 — STARTING pH AND BUFFERING CAPACITY

## 2.1 (a) Measured pH of fresh, raw vegetables

### 2.1.1 Values from designed studies (preferred)

| Vegetable | pH | Source | Confidence | Quality note |
|---|---|---|---|---|
| **Cucumber**, pickling cv Hanzil | **5.92 ± 0.11** | Fan et al. 2024, *J Food Compos Anal* 129:106065 | **STRONG** | n = 3, calibrated meter, real fruit |
| **Cucumber**, pickling cv Vlaspik | **5.93 ± 0.13** | same | **STRONG** | n = 3 |
| **Cucumber** (diam 27–51 mm, juice) | ~5.1–5.7 | Lu et al. 2002, *J Food Sci* 67:2934–2939 (abstract via Crossref https://api.crossref.org/works/10.1111/j.1365-2621.2002.tb08841.x) | Moderate | pH decreased with increasing fruit size; exact values paywalled |
| **Tomato**, red ripe | **4.6 ± 0.5** | Little et al. 2022 (Fig. 1) | **STRONG** | 3 lots, 2 % NaCl |
| **Cauliflower** | **5.46** | Qinghang et al. 2023, *Curr Res Food Sci* 6:100493 | Moderate | single lot, 5 kg, 4 timepoints |
| **Broccoli** | **5.32** | same | Moderate | same |
| **Green leaf lettuce** | **5.9 ± 0.04** | Little et al. 2022 | **STRONG** | 3 lots |
| **Green pea** | **6.0 ± 0.6** | Little et al. 2022 | **STRONG** | 3 lots |
| **Cabbage** (shredded, slated) | **~6.2** at day 0 | Fleming et al. 1987, in ARS p201 Fig. 3 | Moderate | **[MY CALC]** reading of plotted y-axis origin |
| **Napa cabbage** (kimchi base) | **5.57 ± 0.01** | Kim et al. 2025, *Foods* 14(16):2826 | **STRONG** | n = 3, gauze-filtered juice |
| **Napa cabbage** (commercial kimchi base) | **5.81** | Jung et al. 2024, *Heliyon* 10(6):e27174 | Moderate | n = 3, commercial product |
| **Red cabbage** (sauerkraut base) | ~5.5–6.0 | **[GAP]** no primary measurement found | — | — |

### 2.1.2 Composite reference ranges (secondary compilation)

| Vegetable | pH range | Vegetable | pH range |
|---|---|---|---|
| Artichokes | 5.6 | Lettuce | 5.8 – 6.0 |
| Asparagus | 4 – 6 | Okra (cooked) | 5.5 – 6.4 |
| Beans | 5.7 – 6.2 | Peas | 5.8 – 7.0 |
| Beets | 4.9 – 5.6 | Pepper | 5.15 |
| **Cabbage** | **5.2 – 6.0** | Pimiento | 4.6 – 4.9 |
| **Carrots** | **4.9 – 5.2** | Sauerkraut | 3.4 – 3.6 |
| Cauliflower | 5.6 | Spinach | 5.5 – 6.8 |
| Celery | 5.7 – 6.0 | Tomatoes (whole) | 4.2 – 4.9 |
| **Cucumbers** | **5.1 – 5.7** | Turnips | 5.2 – 5.5 |
| Dill pickles | 3.2 – 3.5 | Eggplant | 4.5 – 5.3 |
| Horseradish | 5.35 | | |

**Source:** *The Gourmet-O-Matic pH of Various Foods Guide*, http://www.gourmetomatic.com/ph_guide_ph%20_of_various_foods.html, which cites FDA "pH Values of Various Foods."
**Confidence: WEAK–MODERATE.** This is a secondary consumer compilation, not a primary source; **n, method, temperature and sample preparation are not reported**. It is consistent with the measured values above where they overlap (cabbage 5.2–6.0 vs measured ~6.2 at day 0; cucumber 5.1–5.7 vs measured 5.92; tomato 4.2–4.9 vs measured 4.6; cauliflower 5.6 vs measured 5.46). **Use only as a sanity-check envelope, never as a citation for a specific value.**

**[GAP] Napa cabbage, garlic, and onion raw pH:** I could not find a primary measured value with n and method. Garlic and onion are absent from the composite table above.

---

## 2.2 (b) Buffering capacity

### 2.2.1 The key source and the definition

| Item | Value |
|---|---|
| **Definition source** | Lu Z, Fleming HP, McFeeters RF 2002. "Effect of fruit size on fresh cucumber composition and the chemical and physical consequences of fermentation." *J Food Sci* 67:2934–2939 |
| Method, verbatim | Buffer capacity = *"the milliequivalents of HCl required to reduce a 100-g sample of cucumber juice from the initial pH to **pH 3.5**"* |
| Findings | As cucumber size increased (27 → 51 mm), **malic acid, pH, buffer capacity and dry matter all DECREASED**, while glucose and fructose **INCREASED**. Greater buffering in small cucumbers produced **complete sugar utilisation**; larger cucumbers did not |
| Links | Crossref abstract: https://api.crossref.org/works/10.1111/j.1365-2621.2002.tb08841.x · ARS record: https://www.ars.usda.gov/research/publications/publication/?seqNo115=130813 |
| Confidence | **STRONG** for the definition, method and direction of effect; **the numeric meq values are inside a paywalled paper [GAP]** |

**This is the paper that establishes the meq-HCl-per-100-g-to-pH-3.5 convention** you asked about. Note the target is **pH 3.5**, not 4.0.

### 2.2.2 The only multi-vegetable measured buffer-capacity table

| Item | Value |
|---|---|
| Source | Little et al. 2022, *J Food Sci* 87(5):2121–2132, Table 2 |
| Method | Triplicate titrations; **7 M lactic acid**, **7 M acetic acid**, or an equal-concentration mixture (7.01 M); **100.0 ± 1.2 g of vegetable slurry** = 50.0 ± 1.0 g blended vegetable + 50.0 ± 0.2 g distilled water, titrated to **pH 3.0** |
| Confidence | **STRONG** — one protocol, triplicate, 3 lots, real vegetables |
| Caveat | 50:50 slurry in water (so values are per kg of *slurry*); target pH 3.0 (below the 3.5/4.0 targets); only 8 vegetables |

**Buffer capacity — mM acid required to reach pH 3.0 [MEASURED]:**

| Vegetable | Lactic acid | Lactic + acetic | Acetic acid |
|---|---|---|---|
| Green bean | **57.6 ± 1.5** | 154 ± 14 | **463 ± 14** |
| Green bell pepper | 64.8 ± 3.0 | 91 ± 7 | 189 ± 20 |
| Red ripe tomato | 65.0 ± 3.0 | 77 ± 7 | > 130 |
| Orange sweet potato | 72.3 ± 2.0 | 350 ± 10 | 699 ± 28 |
| Green leaf lettuce | 135 ± 15 | 98 ± 7 | 255 ± 15 |
| Broccoli | 173 ± 13 | 189 ± 7 | 225 ± 20 |
| Sweet yellow corn | 210 ± 14 | 133 ± 7 | 90 ± 5 |
| Green pea | NA | 326 ± 7 | 1251 ± 100 |

**[MY CALC] In g lactic acid per kg of slurry** (× 0.09008): green bean 5.19 · green bell pepper 5.84 · tomato 5.86 · sweet potato 6.51 · lettuce 12.16 · broccoli 15.58 · sweet corn 18.92.
**[MY CALC] Per kg of actual vegetable tissue** (slurry is 50 % water, so ×2): green bean ~10.4 · pepper ~11.7 · tomato ~11.7 · sweet potato ~13.0 · lettuce ~24.3 · broccoli ~31.2 · sweet corn ~37.8 g/kg.

**Two striking findings in this table:**
- **Green bean is the LEAST lactic-acid-buffered vegetable** (57.6 mM) but the **MOST acetic-acid-buffered** (463 mM). The spread between lactic and acetic requirements is a **factor of 8**. This is why heterofermentative (acetic-producing) green bean fermentations stall while homofermentative ones succeed — **the acid type matters as much as the amount.**
- **Acetic acid is a far less efficient acidifier than lactic acid** here: green bean needs 57.6 mM lactic but 463 mM acetic to reach the same pH. **[MY CALC]** acetic acid (pK 4.76) is largely undissociated at pH 3.0 and contributes little buffering, whereas lactic acid (pK 3.86) is near its pK and buffers strongly.

### 2.2.3 The modern quantitative framework (equations and method)

| Item | Value |
|---|---|
| Source | **Breidt F, Skinner CR 2022.** "Buffer Models for pH and Acid Changes Occurring in Cucumber Juice Fermented with *Lactiplantibacillus pentosus* and *Leuconostoc mesenteroides*." *J Food Prot* 85(9):1273–1281 |
| DOI / PDF | https://doi.org/10.4315/JFP-22-068 · free ARS PDF: https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p450.pdf |
| Confidence | **STRONG** — 3+ independent fermentations, RMSE of pH prediction **0.064 pH units** |

**Equations (their numbering):**

Buffer capacity from titration data:
```
β = Δ(volume of acid or base) / ΔpH                                    (1)
```

Buffer-capacity model as a sum of monoprotic buffers:
```
β = 2.303 × [ Σ Ci·Ki·[H⁺] / ([H⁺] + Ki)²  +  Kw/[H⁺]  +  [H⁺] ]      (2)
```

pH solved from charge balance (Butler & Cogley):
```
0 = Σ[Ca·Ka/(Ka + [H⁺])] − Σ[Cb·[H⁺]/([H⁺] + Kb)] + Kw/[H⁺] − [H⁺] + adjC   (3)
```

pK correction for ionic strength (Davies equation), I = 0.342 M for 2 % NaCl:
```
pKadj = pKa − 1.02 × [ √I/(1 + √I) − 0.3I ]                            (4)
```

**Their measured buffer components for cucumber juice in the pH 3–5 region (the region that matters for acidification) [MEASURED], Table 1:**

| Buffer | CJ1 (< 27 mm) | CJ2 (27–38 mm) | CJ3 (39–51 mm) |
|---|---|---|---|
| at pK ~3.2 | **18.15 mM** (pK 3.27) | 14.85 mM (pK 3.18) | 13.68 mM (pK 3.20) |
| at pK ~4.4 | **16.70 mM** (pK 4.46) | 13.94 mM (pK 4.43) | 12.50 mM (pK 4.42) |
| adjC (salt correction) | 5.7 mM | 14.4 mM | 15.5 mM |

**Their conclusion, verbatim:** *"the data are consistent with the hypothesis that **greater buffering in CJ1 compared with CJ2 and CJ3 explains the differences in sugar utilization and acid production**."*

**Malolactic reaction** also buffers (consumes a proton): `malic acid + H⁺ → lactic acid + CO₂`. Malic acid is a **diprotic** acid; its theoretical pK values in CJ medium were estimated at **3.13 and 4.93** after ionic-strength adjustment from published 3.40 and 5.20. This is why cucumber buffer capacity is dominated by malic acid.

### 2.2.4 Free tools

| Tool | Source | URL |
|---|---|---|
| **BufferCapacity3** — Matlab GUI computing buffer capacity and pH from titration data | Breidt F 2023, *SoftwareX* 22:101351 | https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p452.pdf |
| **IngredientDB** — BC matrices for **41+ food ingredients**, predicts pH of formulations | Breidt F et al. 2023, *SoftwareX* 24:101545 | https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p458.pdf |
| Underlying method | Price RE, Longtin M, Conley Payton S, Osborne JA, Johanningsmeier SD, Bitzer D, Breidt F 2020. "Modeling buffer capacity and pH in acid and acidified foods." *J Food Sci* 85(4):918–925 | doi 10.1111/1750-3841.15091 |

### 2.2.5 [GAP] Buffering capacity NOT FOUND for

**Cabbage, napa cabbage, beetroot, cauliflower, jalapeño/chilli, carrot, radish, garlic, onion.** This is a genuine hole in the literature, not a search failure — multiple targeted searches (including the full 462-entry ARS Fermented & Acidified Vegetables Bibliography) found no measured buffer capacity for these. **Broccoli (173 mM lactic) is the nearest proxy for cauliflower.** Cucumber is the only vegetable with a full published buffer *model*.

**Anyone quoting a buffer capacity for cabbage, napa, beetroot or cauliflower should be asked for the source.**

---

## 2.3 (c) Does starting pH / buffering change time to pH 4.0 or 3.5?

**Buffering: YES, decisively. Starting pH: only marginally.**

### 2.3.1 How much acid is needed — the only published table, at pH 3.0

Reproduced from §1.3.3 (Little et al. 2022, Table 2, titrated on a 50:50 vegetable:water slurry):

| Vegetable | Lactic acid needed, mM | **[MY CALC]** g/kg slurry | **[MY CALC]** g/kg tissue |
|---|---|---|---|
| Green bean | 57.6 ± 1.5 | 5.19 | ~10.4 |
| Green bell pepper | 64.8 ± 3.0 | 5.84 | ~11.7 |
| Red ripe tomato | 65.0 ± 3.0 | 5.86 | ~11.7 |
| Orange sweet potato | 72.3 ± 2.0 | 6.51 | ~13.0 |
| Green leaf lettuce | 135 ± 15 | 12.16 | ~24.3 |
| Broccoli | 173 ± 13 | 15.58 | ~31.2 |
| Sweet yellow corn | 210 ± 14 | 18.92 | ~37.8 |

**Spread: broccoli/corn need ~3× the acid of green bean/pepper to reach the same pH.**

### 2.3.2 [GAP] No published "acid required to pH 4.0 / 3.5" table exists

**This table does not exist in the literature.** It must be computed, and computing it requires buffer-capacity models that are only published for cucumber. Any such table presented as sourced is an extrapolation.

### 2.3.3 What can be said with confidence [MY CALC, MODERATE]

My computation for **cabbage**, from the measured sauerkraut titration curve (Fleming et al. 1987, in ARS p201, Fig. 3), treating titratable acidity as lactic acid:

| To reach | Acid required (g lactic per kg cabbage) | Fraction of typical cabbage sugar consumed **[MY CALC]** |
|---|---|---|
| pH 4.4 | ~8.4 | ~20–30 % (of 28–94 g/kg) |
| **pH 4.0** (≈ interpolated) | **~10–12** | **~25–40 %** |
| pH 3.9 | ~14.0 | ~30–50 % |
| **pH 3.5** (≈ interpolated) | **~18–22** | **~40–75 %** |
| pH 3.4 (fully fermented) | ~22.0 | ~45–80 % |

**This is the key structural insight: sauerkraut reaches pH 4.0 having consumed only about a quarter to a third of its sugar.** That is why pH 4.0 is reached in days while full fermentation takes weeks, and why "time to pH 4.0" and "time to complete fermentation" are completely different quantities.

**Cardinal temperatures/doses must be pinned:** none of the above is meaningful without stating temperature (15× effect, Kim et al. 2025) and salt concentration.

### 2.3.4 Starting pH: minor effect, and it cuts both ways

| Evidence | Finding | Confidence |
|---|---|---|
| Little et al. 2022 | Tomato starts at **pH 4.6 ± 0.5** (lowest of 8) and still fermented to pH 3.3 ± 0.2 — only ~1.3 pH units of headroom, but it **produced the most acid of any vegetable** (110.0 mM lactic + 43.6 mM acetic) because its sugar could not be buffered | **STRONG** |
| Little et al. 2022 | All fermentations in that study were **acidified to pH 4.70 at brining** with vinegar — i.e. starting pH was deliberately normalised, so it was not a variable | **STRONG** |
| Huang et al. 2025 | Pepper brine contained vinegar to pH 4.7; the peppers still took 66–77 days to stabilise at pH 3.3 — **starting pH did not make them fast** | Moderate–strong |
| López-Salas et al. 2022 | Habanero puree started at pH 4.92–4.95 (near the 4.5 safety threshold) and dropped to 4.07 in 4 h — but that was 40 °C with 10 % inoculum, so the speed is not attributable to starting pH | Weak as a proxy |

**Conclusion:** starting pH shifts the *distance* to travel but not the *rate*. Buffering determines the *amount of acid* required and therefore whether the fermentation completes at all. A low starting pH with high buffering (tomato) produces a lot of acid and still stalls; a high starting pH with low buffering (green bean) acidifies readily.

---

## 2.4 (d) Do high-buffer vegetables need longer, and by how much?

**Yes — but the effect appears primarily as INCOMPLETE fermentation rather than simply "more days."**

| Vegetable | Buffer (mM lactic to pH 3.0) | Sugar potential (mM LA) | Outcome at 30 °C, 21 d | Days |
|---|---|---|---|---|
| Broccoli | 173 (high) | 86 (low) | **completed**, pH 4.3 ± 0.5 | 21 |
| Green leaf lettuce | 135 (high) | 87 (low) | **completed**, pH 3.63 ± 0.37 | 16 |
| Green pea | NA | 120 | **completed**, pH 3.7 ± 0.1 | 14 |
| Green bell pepper | **64.8 (low)** | 276 | **INCOMPLETE**, pH 3.1 ± 0.2, sugar left | 21 |
| Green bean | **57.6 (lowest)** | 351 | **INCOMPLETE**, pH 3.1 ± 0.2, sugar left | 21 |
| Tomato | 65.0 (low) | 366 | **INCOMPLETE**, pH 3.3 ± 0.2, sugar left | 14 |
| Sweet potato | 72.3 (low) | 502 | **INCOMPLETE**, pH 3.4 ± 0.4, sugar left | 21 |
| Sweet corn | 210 (highest) | 700 | **INCOMPLETE**, pH 3.4 ± 0.4, sugar left | 21 |

**Source:** Little et al. 2022. **Confidence: STRONG** — all eight predictions made in advance and confirmed.

### Quantified day-differences attributable to buffering

| Comparison | Day difference | Source | Confidence |
|---|---|---|---|
| Small (most-buffered) vs large (least-buffered) cucumber, same 30 °C / 2 % NaCl / 48 h | Small fermented **to completion**; large left **2–15 mM glucose + 15–21 mM fructose** — an unbounded difference (complete vs incomplete) | Breidt & Skinner 2022 | **STRONG** |
| High-buffer + high-sugar vegetables (sweet potato, sweet corn) | **Never completed within 21 days**; substantial sugar remained | Little et al. 2022 | **STRONG** |
| Green bean with vs without starter | **4 d vs 8 d** to pH < 4.0 — but this is an **inoculum** effect, not a buffer effect | Mnkeni et al. 1995 | Weak–moderate |

**[GAP] A published table of "extra days required per unit of buffer capacity" does not exist.** The honest statement is: high-buffer vegetables with sugar in excess of their buffer capacity **do not finish at all** within normal timeframes; the penalty is not a fixed number of days.

---

# 3. EXPLICIT GAPS — do not let these be filled with invention

| # | Gap | Notes |
|---|---|---|
| 1 | **The Q1(e) ratios themselves** | No paper normalises time-to-target-pH across these vegetables. Source is a non-peer-reviewed blog. **Treat as fabricated.** |
| 2 | **Measured buffer capacity for cabbage, napa, beetroot, cauliflower, jalapeño, carrot, radish** | Nothing found. Broccoli (173 mM) is the nearest cauliflower proxy; cucumber is the only vegetable with a published buffer model. |
| 3 | **g lactic acid per kg to reach pH 4.0 / 3.5, per vegetable** | No published table. Must be computed from BC models; computing it requires data from gap #2. |
| 4 | **Napa cabbage raw sugar in g/100 g** | FDC value (1.41) is `BFSN` borrowed, not measured. Best proxies: Shim 1990 °Brix; Jung 2024 kimchi juice. |
| 5 | **Napa mannitol in absolute units** | Only relative/fold-change data found. |
| 6 | **A single primary source with measured pH for all listed vegetables, with n and method** | Values exist individually (see §2.1.1); no single table. |
| 7 | **Any study reporting dpH/dt across vegetables under one protocol** | Does not exist. Every dpH/dt in this report is my arithmetic on endpoint pairs. |
| 8 | **Fermentation temperature in Mnkeni et al. 1995** | The best green-bean time-to-pH number has no stated temperature; paper paywalled. |
| 9 | **Mheen & Kwon 1984**, *Korean J Food Sci Technol* 16:443–450 | Canonical kimchi temperature/salt reference — no accessible full text or numeric abstract. |
| 10 | **Kimchi vs sauerkraut head-to-head acidification study** | Does not exist. |
| 11 | **Measured MIC of capsaicin against lactic acid bacteria** | Not found. The "capsaicin slows pepper fermentation" claim is unsupported by any dose-response study. |
| 12 | **Water activity of pepper mash / brine-fermented peppers** | Not found. |
| 13 | **Pederson & Albury 1969** bulletin no. 824; **Hughes & Lindsay 1985** values | Both cited for cabbage sugar ranges; neither full text obtained (secondary citations only). |
| 14 | **Numeric meq values from Lu et al. 2002** | Definitions and directions confirmed via abstract; the actual meq-per-100-g numbers are inside the paywalled paper. |
| 15 | **Garlic, onion, napa raw pH** | Not found with n and method. |
| 16 | **USDA AH-8 sugar values** | Resolved negatively — AH-8-11 (1984) reports no sugar values at all. |

---

# 4. SOURCE-INTEGRITY WARNINGS

1. **`sourchad.com`** presents itself as evidence-based ("Every claim cited") but **misattributes PMIDs**. Example: it cites **PMID 38144756** (Choi et al. 2023, *Food Chem X*, on the effect of *ingredient size* on radish kimchi) for the proposition that *"glucose content during the early fermentation window was directly predictive of lactic acid bacteria activity and pH decline rate."* That is not what that paper tested. **Do not propagate its numbers.** It is the apparent origin of the Q1(e) ratios.

2. **Three peer-reviewed sources contain internal numerical contradictions** that I documented rather than propagated:
   - **Jung et al. 2024**, *Heliyon* 10(6):e27174 — the mg/L organic-acid units are ~1000× too low (1.3 × 10² mg/L lactic acid cannot drop pH 5.8 → 4.1), and the sentence *"The acidity and pH of Kimchi A, B, and C in week 1 were 0.32% and 5.81"* states the **week-0** values. **Use the pH/acidity table only; do not use the absolute organic-acid concentrations.**
   - **Duyar et al. 2024**, *Heliyon* 10(9):e30448 — the spontaneous-arm regression coefficient is impossible against its own measured endpoint (*"increases by 6249 mg/L for every additional unit of time"* vs a measured total increase of 505 mg/L over 96 h). **Use endpoint pH/time/acid only.**
   - A **2018 MDPI kimchi/glutinous-rice paper** (PMC6320964) — states GRP kimchi pH was *"slightly lower"* than control while reporting GRP **4.24/4.13** vs control **4.00/3.96** (i.e. higher). **Numbers and stated conclusion disagree.**

3. **Legacy ARS PDFs are scanned images.** Both `ars.usda.gov/ARSUserFiles/60701000/Pickle Pubs/` (116 papers, p100–p215) and `.../60702500/Fermented Veg Manuscripts/` (p390–p461) have **no text layer** and return **HTTP 406** to a plain fetch. Required workflow: `curl -A "Mozilla/5.0"` → `gs -sDEVICE=pnggray` → read pages as images. **Consequence: some values above are my calibrated visual readings of plotted figures, and are flagged inline with ± tolerance.** Where a value came from a table rather than a plot, it is exact.

4. **USDA FDC derivation codes matter.** Only 18 of 92 produce rows examined had analytically measured total sugars. Garlic (1.00 g, `T`), daikon (2.50 g, `T`), beetroot (6.76 g, `O`), jalapeño (5.10 g, `BFSN`) and napa (1.41 g, `BFSN`) are **not measurements**. **Olives are reported as 0 g sugars with derivation `Z` "Assumed zero"** — plainly wrong; do not use.

5. **`fdc.nal.usda.gov/food-details/<ID>/nutrients` is not machine-fetchable** (serves an Angular shell, returns HTTP 404 to direct requests). Use the FDC API or the bulk datasets.

---

# 5. HEADLINE ANSWERS IN ONE PARAGRAPH EACH

**Q1.** Fermentable sugar in fermentation vegetables ranges from **~1.0 g/100 g (garlic)** to **~10 g/100 g (apple)**, with **cabbage spanning 2.8–9.4 g/100 g** depending on cultivar, season and lot — the USDA figure of 3.2 g/100 g is at the bottom of that range and is a *calculated*, not measured, value. Sugar reliably predicts whether a fermentation **can complete** (Little et al. 2022 predicted all 8 outcomes in advance from lot sugar + buffer capacity) but **not how fast it goes**: glucose actually *accumulated* in sauerkraut brine during the fastest phase of acidification (Fleming et al. 1987). Stoichiometry is 1.0 g lactic acid/g hexose homofermentatively and 0.5 g heterofermentatively; real systems measure **95 % lactic acid from cucumber sugar** but sauerkraut carbon splits substantially into mannitol, acetic acid, ethanol and CO₂ — so budget **~0.5–0.7 g lactic acid per g sugar**. Doubling sugar does **not** double speed; the relationship saturates and in the early phase is rate-limited by growth, not substrate. The five specific ratios in question are **unsourced and contradicted**.

**Q7.** Raw vegetable pH clusters tightly at **4.6–6.2** (tomato 4.6 ± 0.5 measured; cabbage ~6.2; cucumber 5.92 ± 0.11; napa 5.57 ± 0.01; cauliflower 5.46; broccoli 5.32). **Buffering capacity, not starting pH, is the decisive variable**, and it is only measured for 8 vegetables: reaching pH 3.0 requires **57.6 mM lactic acid for green bean but 210 mM for sweet corn** — a 3.6× spread — and green bean needs **463 mM acetic acid** for the same target, 8× its lactic requirement, which is why heterofermentative green bean fermentations stall. The modern method is titration to a target pH (Lu et al. 2002 defined it as meq HCl per 100 g to **pH 3.5**) fitted to monoprotic buffer models (Breidt & Skinner 2022; RMSE 0.064 pH units), with free ARS tools BufferCapacity3 and IngredientDB. For cabbage specifically, **[MY CALC]** ~**10–12 g lactic acid per kg** is needed for pH 4.0 and ~**18–22 g/kg** for pH 3.5 — i.e. **pH 4.0 is reached after only ~25–40 % of the sugar is consumed**, which is why "time to pH 4.0" and "time to full fermentation" differ by an order of magnitude. High-buffer vegetables with excess sugar (sweet potato, sweet corn) **never complete** within 21 days rather than merely taking longer. **The critical missing data: buffer capacity for cabbage, napa, beetroot and cauliflower has never been published.**
