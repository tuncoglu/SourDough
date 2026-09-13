# Relative Acidification Speed of Vegetables — Evidence Report

**Prepared as a literature audit. Every number below is tagged with its source and a confidence rating. Where I could not find data, it says NOT FOUND. Where a number is my own arithmetic, it is tagged [MY CALC].**

---

## 0. BOTTOM LINE

**The five ratios in the claim (napa 1.6x, beetroot 1.8x, cauliflower 0.9x, green beans 0.8x, jalapeno 1.2x, green cabbage = 1.0) are NOT SUPPORTED by any published source I could locate.**

Three separate problems:

1. **No study measures time-to-target-pH for these six vegetables under a common protocol.** The normalisation the claim requires (same salt, same temperature, same target pH, same vessel geometry, same microbial load) does not exist in the literature for this vegetable set. Without that, a single "x" multiplier is not a measurable quantity.
2. **The implied source does not contain the ratios.** The numbers appear to derive from [sourchad.com](https://sourchad.com/compare/napa-vs-green-cabbage) and [sourchad.com/guide/best-vegetables-to-ferment](https://sourchad.com/guide/best-vegetables-to-ferment) — a non-peer-reviewed recipe blog ("Chad Waldman, Analytical Chemist"). Those pages give qualitative "fast/slow" labels and day ranges, **not** normalised rate ratios. The napa page implies roughly 2.8–3.5x, and the vegetable guide gives beets 7–14 days vs cauliflower 5–10 days — i.e. it says cauliflower is *faster* than beetroot, which inverts the claim's beetroot 1.8x > cauliflower 0.9x ordering.
3. **Two of the five directions are contradicted by measured data.** Cauliflower (claimed slowest at 0.9x) acidified to pH <4.0 in 2 days and to pH 3.60 in 3 days in a real 5% NaCl spontaneous fermentation. Beetroot (claimed fastest at 1.8x) took 4 days to reach pH 4.0 in juice with a 25% yoghurt-water inoculum. Whatever the true ordering is, it does not match the claim.

**The ratios should be treated as unsourced.** What the literature *does* support is a set of absolute measured rates and a clear mechanistic ranking driver: **buffering capacity matters more than sugar content.** Green bean, for example, needs only 57.6 mM lactic acid to fall to pH 3.0 but 463 mM acetic acid — the widest lactic/acetic split of any vegetable measured — while jalapeno has *more* sugar than green cabbage (4.12 vs 3.20 g/100 g) yet is fermented commercially for weeks to months.

---

## 1. TASK 1 — The ratios, tested

### 1.1 Direct search for the ratios: NOT FOUND

Searched: Europe PMC (title/abstract + OA full text), OpenAlex, Semantic Scholar, and general web, using the ratio values, the phrase "relative fermentation speed", and vegetable-pair formulations. **No peer-reviewed paper reports normalised time-to-target-pH ratios for cabbage : napa : beetroot : cauliflower : green bean : jalapeno.**

The closest thing that exists — and it is only a partial analogue — is a **buffer-capacity normalisation**, not a speed normalisation (§1.3).

### 1.2 The only multi-vegetable controlled comparison at USDA ARS Raleigh

| Item | Value |
|---|---|
| Study | Little C, Cruz-Martínez V, St Fort DP, Pagán-Medina C, Page CA, Perez-Perez Y, Taveirne ME, Lee AM, Arroyo-González N, Santiago-Ortiz C, **Pérez-Díaz IM**. "Vegetable fermentations brined with low salt for reclaiming food waste." *J Food Sci.* 2022;87(5):2121–2132 |
| DOI / URL | https://doi.org/10.1111/1750-3841.16084 · ARS PDF: https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p447.pdf (curl with a browser User-Agent; returns HTTP 406 to a plain browser) |
| Confidence | **Strong** for the numbers themselves; **weak** as a test of the claim (wrong vegetable set) |
| Study quality | USDA-ARS Food Science & Market Quality and Handling Research Unit, Raleigh NC + NC State + Pontificia Universidad Católica de Puerto Rico. 3 lots per vegetable, triplicate titrations, 72 titrated samples, controlled 30 °C, 21 days, HPLC + Megazyme enzymatic sugar kits. Genuine replication and control. **But: no cabbage, napa, beetroot, cauliflower or jalapeno, and no time-to-pH reported** — only endpoints and buffer capacity |

**Buffer capacity — mM acid required to bring a vegetable slurry to pH 3.0** (their Table 2). This is the single most transferable quantitative result in the whole search:

| Vegetable | Lactic acid (mM) | Lactic + acetic (mM) | Acetic acid alone (mM) |
|---|---|---|---|
| Green bean | 57.6 ± 1.5 | 154 ± 14 | 463 ± 14 |
| Green bell pepper | 64.8 ± 3.0 | 91 ± 7 | 189 ± 20 |
| Red ripened tomato | 65.0 ± 3.0 | 77 ± 7 | >130 |
| Orange sweet potato | 72.3 ± 2.0 | 350 ± 10 | 699 ± 28 |
| Green leaf lettuce | 135 ± 15 | 98 ± 7 | 255 ± 15 |
| Broccoli | 173 ± 13 | 189 ± 7 | 225 ± 20 |
| Sweet yellow corn | 210 ± 14 | 133 ± 7 | 90 ± 5 |
| Green pea | NA | 326 ± 7 | 1251 ± 100 |

Two things worth your attention:

- **Green bean is the least lactic-acid-buffered vegetable measured (57.6 mM).** On buffering alone it should acidify *fastest* of the eight — the opposite of the claim's 0.8x. But it is the *most* acetic-acid-buffered (463 mM), which is why heterofermentative (acetic-producing) fermentations of green bean stall.
- **Broccoli — the closest measured relative of cauliflower — is the second-most lactic-acid-buffered (173 mM) while having almost no sugar** (glucose 2.12 ± 1.06, fructose 0.93 ± 0.25, sucrose 1.24 ± 0.70 mM). It fermented to completion but only to pH 4.3 ± 0.5. This is a genuine argument that cauliflower *could* be slow — and it is directly contradicted by the measured cauliflower curve in §4.1.

Measured sugar content in the same study (their Table 1, means ± SD, mM):

| Vegetable | Glucose | Fructose | Sucrose | Malic acid |
|---|---|---|---|---|
| Green bean | 49.28 ± 1.13 | 46.88 ± 3.44 | 2.14 ± 1.25 | 14.12 ± 4.96 |
| Green bell pepper | 44.50 ± 1.13 | 50.06 ± 3.15 | 29.27 ± 1.09 | none |
| Broccoli | 2.12 ± 1.06 | 0.93 ± 0.25 | 1.24 ± 0.70 | 23.23 ± 5.59 |
| Green leaf lettuce | 11.61 ± 3.62 | 23.29 ± 3.48 | 17.75 ± 2.27 | 13.74 ± 6.77 |
| Green pea | 11.20 ± 2.15 | 13.91 ± 1.09 | 14.53 ± 2.26 | 7.23 ± 4.48 |
| Sweet yellow corn | 38.16 ± 2.98 | 32.50 ± 0.96 | 40.58 ± 3.85 | 13.80 ± 3.40 |

Note their own caveat: USDA reference values for green pea and broccoli **differed substantially** from what they measured, so published composition tables are not a reliable proxy for a given lot.

### 1.3 Sugar content of the six vegetables in the claim

USDA FoodData Central, SR Legacy, **g per 100 g raw, as-is** (retrieved via FDC API):

| Vegetable | Total sugars | Glucose | Fructose | Sucrose | FDC ID |
|---|---|---|---|---|---|
| Cabbage, raw (green/white) | **3.20** | 1.67 | 1.45 | 0.08 | [169975](https://fdc.nal.usda.gov/food-details/169975/nutrients) |
| Cauliflower, raw | **1.91** | 0.94 | 0.97 | 0.00 | [169986](https://fdc.nal.usda.gov/food-details/169986/nutrients) |
| Beans, snap, green, raw | **3.26** | 1.51 | 1.39 | 0.36 | [169961](https://fdc.nal.usda.gov/food-details/169961/nutrients) |
| Peppers, jalapeno, raw | **4.12** | 1.48 | 2.63 | 0.00 | [168576](https://fdc.nal.usda.gov/food-details/168576/nutrients) |
| Beets, raw | **6.76** | not retrieved | not retrieved | not retrieved | [169145](https://fdc.nal.usda.gov/food-details/169145/nutrients) |
| Napa cabbage, raw | **NOT FOUND** | — | — | — | — |

- **Confidence: strong** for the values; USDA SR Legacy is a compiled national database, not a single primary measurement, and SR Legacy is now frozen/superseded by Foundation Foods.
- **Napa cabbage raw sugar: NOT FOUND.** The FDC API rate-limited before I could pull *Cabbage, chinese (pe-tsai), raw* (FDC 169979), and the FDC web pages are JS-rendered. The best available substitute is measured **kimchi** sugar (§2.1), which is a different matrix (salted, seasoned).
- **Cauliflower has the least sugar of the six (1.91 g/100 g) — 40% less than green cabbage.** If sugar drove the ranking, cauliflower should be slowest. Measured data say otherwise (§4.1).
- **Jalapeno has the second-most sugar of the six.** The "peppers are slow because they're low in sugar" explanation is **false**.

### 1.4 What the actual measured times-to-pH are (the real answer to "give whatever the actual measured rates are")

| Vegetable | Time to target pH | Target pH | Temp | System | Source | Confidence |
|---|---|---|---|---|---|---|
| **Green cabbage** (sauerkraut, tank SK1) | 7 days | 3.8 ± 0.1 | 19.1 → 22.1 °C | Artisanal tanks, spontaneous | Gaudioso 2022 §4.2 | Moderate |
| **Green cabbage** (sauerkraut, tank SK2) | 7 days | 4.0 ± 0.02 | 13.5 → 16.0 °C | Artisanal tanks, spontaneous | Gaudioso 2022 §4.2 | Moderate |
| **Napa cabbage** (kimchi) | **3 days** | 4.36 ± 0.00 (optimal window) | 15 °C | Real kimchi, 2.3% salt | Kim 2025 §2.1 | Strong |
| **Napa cabbage** (kimchi) | **14 days** | 3.89 ± 0.00 | 15 °C | Real kimchi, 2.3% salt | Kim 2025 §2.1 | Strong |
| **Napa cabbage** (kimchi) | 47 days | 4.32 ± 0.01 | 4 °C | Real kimchi, 2.3% salt | Kim 2025 §2.1 | Strong |
| **Napa cabbage** (commercial kimchi) | 7 days | 4.07, acidity 1.83% | 15 °C | Commercial kimchi | Jung 2024 §2.1 | Moderate |
| **Napa cabbage** (commercial kimchi) | 7 days | 4.21, acidity 1.69% | 10 °C | Commercial kimchi | Jung 2024 §2.1 | Moderate |
| **Napa cabbage** (commercial kimchi) | 7 days | 5.09, acidity 0.75% | 4 °C | Commercial kimchi | Jung 2024 §2.1 | Moderate |
| **Beetroot** (juice, spontaneous + 25% yoghurt water) | 96 h (4 d) | 4.00 | 24–25 °C | Juice, pasteurised-free, yoghurt-water inoculated | Duyar 2024 §3.1 | Moderate |
| **Beetroot** (juice, *Lc. paracasei* 2%, ~6–7 log CFU/mL) | 44 h (1.8 d) | 3.83 | 31 °C | Juice, pasteurised, defined starter | Duyar 2024 §3.1 | Moderate |
| **Cauliflower** (5% w/w NaCl, spontaneous) | **2 days** | <4.0 | 25–30 °C | Real cauliflower florets, 5 kg lots | Qinghang 2023 §3.1 | Moderate |
| **Cauliflower** (5% w/w NaCl, spontaneous) | 3 days | 3.60 | 25–30 °C | Real cauliflower florets, 5 kg lots | Qinghang 2023 §3.1 | Moderate |
| **Broccoli** (5% w/w NaCl, spontaneous) | 3 days | 3.56 | 25–30 °C | Real broccoli florets | Qinghang 2023 §3.1 | Moderate |
| **Green bean** (with starter culture) | **4 days** | <4.0 | not stated in abstract | Whole green beans, 2 varieties (Binz, Mangtout) | Mnkeni 1995 | Weak–moderate |
| **Green bean** (no starter, spontaneous) | **8 days** | <4.0 | not stated in abstract | Whole green beans, 2 varieties | Mnkeni 1995 | Weak–moderate |
| **Jalapeno-type pepper** (habanero puree, 60% w/v, *L. plantarum* 10% inoculum) | **4 h** | 4.07–4.13 | **40 °C** | Sterilised pepper puree | López-Salas 2022 App. A1 | Weak (see §5.1) |
| **Jalapeno-type pepper** (habanero puree) | 6 h | 3.88–3.94 | 40 °C | Sterilised pepper puree | López-Salas 2022 App. A1 | Weak |
| **Chilli pepper** (pickled, 9% NaCl) | ~21 days for the bulk of the change; pH 3.31–3.38 at 77 d | ~3.3 | 25 °C | Whole peppers, 9% brine, 2.5% sugar | Huang 2025 §3.1 | Moderate |
| **Red hot chilli pepper mash** | pH reduction over 18 months; aroma peaks in first 60 days | not stated | ambient, barrels | Commercial-style mash | Watts 2018 | Moderate |

**[MY CALC]** If you force a comparison at roughly matched temperature, using only the two datasets that are internally consistent — sauerkraut SK2 at 13.5–16 °C reaching pH 4.0 in 7 days, versus commercial kimchi at 15 °C reaching pH 4.07 in 7 days — the ratio is **≈1.0x, not 1.6x**. Using Kim 2025's kimchi at 15 °C (pH 4.36 at day 3, 3.89 at day 14) and interpolating linearly, kimchi reaches pH 4.0 at roughly day 11, which would make napa **≈0.6x** — *slower* than sauerkraut. The two kimchi studies disagree with each other by roughly a factor of 3, so **the napa:cabbage ratio is not resolvable from published data at all**, let alone at 1.6x.

---

## 2. TASK 2 — Kimchi / napa cabbage acidification kinetics

### 2.1 The best "optimal ripening pH" source

| Item | Value |
|---|---|
| Study | Kim J, Park H, Moon B, Kim S. "Effect of Fermentation Conditions on Functional Quality of Napa Cabbage Kimchi." *Foods* 2025;14(16):2826 |
| DOI / URL | https://doi.org/10.3390/foods14162826 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12385461/ |
| Confidence | **Strong** |
| Study quality | n = 3 per timepoint, real napa cabbage kimchi, controlled incubators at 4 °C and 15 °C, pH measured on gauze-filtered juice, full recipe reported (1 kg brined napa, 130 g radish, 35 g red pepper powder, 22 g anchovy sauce, final salt 2.3%). Weaknesses: sampling intervals were "scheduled according to researcher availability" — not a fixed grid — and only two temperatures |

**The definition of optimal ripening (their words, verbatim):**

> "In many previous studies, the optimal fermentation period of kimchi has been defined as the stage when the pH reaches between 4.0 and 4.5, and a pH value below 4.0 is generally considered indicative of over-ripening or excessive fermentation."

**Their measured pH trajectory (their Table 3), initial pH 5.57 ± 0.01:**

| Stage | Expected pH | 4 °C | 15 °C |
|---|---|---|---|
| Non-fermented | >5 | 5.57 ± 0.01 (day 0) | 5.57 ± 0.01 (day 0) |
| Optimally fermented | 4.0–4.5 | **4.32 ± 0.01 at day 47** | **4.36 ± 0.00 at day 3** |
| Excessively fermented | <4.0 | 3.98 ± 0.01 at day 168 | 3.89 ± 0.00 at day 14 |

Their own conclusion: *"kimchi stored at 15 °C ferments approximately 15 times faster than at 4 °C in terms of reaching the optimal pH range."* [47 d ÷ 3 d = 15.7 — [MY CALC], and it checks out.]

**This is the cleanest temperature-scaling number in the entire search: a 11 °C increase (4 → 15 °C) compresses time-to-optimal-pH by ~15x.** That is a Q₁₀ of roughly 4.6 [MY CALC] — steep, and it means any claim about relative vegetable speed is meaningless without pinning temperature.

### 2.2 Independent kimchi dataset with 4 / 10 / 15 °C and sugar + organic acid data

| Item | Value |
|---|---|
| Study | Jung S, Hwang IM, Lee JH. "Temperature impact on microbial and metabolic profiles in kimchi fermentation." *Heliyon* 2024;10(6):e27174 |
| DOI / URL | https://doi.org/10.1016/j.heliyon.2024.e27174 · https://pmc.ncbi.nlm.nih.gov/articles/PMC10926072/ |
| Confidence | **Moderate** (see caveats) |
| Study quality | n = 3, commercial kimchi from a Gwangju factory (salted napa 70%, red pepper 4%, radish 8%, fish sauce 5.3%, glutinous rice 0.6%), stored at 4/10/15 °C, sampled weekly for 4 weeks. Pyrosequencing + UPLC-QTOF-MS. Weakness: only 4 weekly timepoints, so no resolution between day 0 and day 7 — this is the main reason it disagrees with Kim 2025 |

**pH and titratable acidity (their §3.2). Week 0 baseline: pH 5.81, acidity 0.32%**

| Temp | Week 1 | Week 2 | Week 4 |
|---|---|---|---|
| 4 °C | pH 5.09, 0.75% | pH 4.54, 1.07% | pH 4.37, 1.51% |
| 10 °C | pH 4.21, 1.69% | pH 4.02, 1.83% | pH 4.02, 2.32% |
| 15 °C | pH 4.07, 1.83% | pH 3.81, 2.63% | pH 3.63, 4.07% |

**Free sugars (their §3.3), mg/mL in kimchi juice:**

| Analyte | Week 0 | 4 °C wk 1 | 10 °C wk 1 | 15 °C wk 1 |
|---|---|---|---|---|
| Glucose | 17.16 ± 1.38 | 13.54 ± 1.09 | 9.41 ± 1.22 | 6.26 ± 0.32 |
| Sucrose | 1.29 ± 0.03 | 1.20 ± 0.02 | 0.93 ± 0.02 | 0.23 ± 0.01 |

**[MY CALC] Glucose consumption rate, week 1:** 3.62 mg/mL/week at 4 °C; 7.75 at 10 °C; 10.90 at 15 °C. So **sugar utilisation roughly doubles per 10 °C** — a far weaker temperature response than the pH data imply, which is a real inconsistency between the two kimchi datasets.

**Organic acids (their §3.5), week 1, mg/L:** lactic acid 30.44 ± 2.96 (4 °C), 96.11 ± 11.96 (10 °C), 133.90 ± 4.34 (15 °C); succinic acid 1.38 ± 0.07, 2.74 ± 0.07, 3.49 ± 0.33.
**Caveat: the mg/L units are almost certainly wrong** (1.3 × 10² mg/L = 0.13 g/L lactic acid is far too low to drop pH from 5.8 to 4.1). **Flagged as contested — do not use these absolute values.**

**Also flagged as an internal error in this paper:** the sentence *"The acidity and pH of Kimchi A, B, and C in week 1 were 0.32% and 5.81, respectively"* states the week-0 values while saying "week 1". The 0.32%/5.81 figures are the week-0 baseline per the surrounding table.

### 2.3 Kimchi sugar / mannitol dynamics (napa matrix)

| Item | Value |
|---|---|
| Study | "Analysis of Targeted Metabolites and Molecular Structure of Starch to Understand the Effect of Glutinous Rice Paste on Kimchi Fermentation." *Foods* 2018 (MDPI) |
| URL | https://pmc.ncbi.nlm.nih.gov/articles/PMC6320964/ |
| Confidence | **Moderate** |
| Study quality | Triplicate packs (n = 3), real baechu kimchi from a commercial manufacturer, HPAEC-PAD for sugars/sugar alcohols. Protocol: 20 °C for 24 h, then 4 °C for 20 days. Richer sugar panel than any other source found |

Verbatim findings:
- *"The initial pH of kimchi sample with or without GRP was around 5.50."*
- *"After 2 days of fermentation, sucrose almost hydrolyzed and its content maintained relatively constant."*
- *"The glucose content in GRP kimchi reached 877 mg/100 g after 20 days of fermentation, which was twice higher than that in control kimchi (451 mg/100 g)."*
- *"Control kimchi had only 17 mg/100 g in maltose content before fermentation, but maltose was not detected after starting fermentation."*
- *"Mannitol content rapidly increased during the early stage of fermentation and its content maintained relatively constant after 5 days of fermentation, which was correlated inversely with decrease in fructose content."*

**Flagged contradiction in this paper:** the text says GRP kimchi pH values *"were slightly lower than those of control kimchi"* but reports GRP 4.24 (day 7) and 4.13 (day 20) versus control 4.00 and 3.96 — i.e. GRP was **higher**. The stated numbers and the stated conclusion disagree. **Use with caution.**

**Mannitol in g/100 g or mM: NOT FOUND as an absolute value.** Every source I found reports mannitol as a relative/peak-intensity or fold-change quantity, or in mg/100 g in the GRP comparison only. The claim that mannitol is a major kimchi sugar alcohol is well supported qualitatively (*Leuconostoc* mannitol dehydrogenase, fructose → mannitol) but I could not retrieve a defensible absolute nM/mM figure.

### 2.4 Kimchi vs sauerkraut: head-to-head comparison paper

**NOT FOUND.** No paper directly compares kimchi and sauerkraut acidification rates under a common protocol. The comparison must be assembled from separate studies (§1.4) and is therefore weak. The closest adjacent evidence is qualitative: sauerkraut and kimchi both run *Leuconostoc → Lactobacillus* succession, but kimchi carries a large non-*Brassica* sugar load (radish, glutinous rice, added sugar) that sauerkraut does not.

### 2.5 Classic Korean literature (Mheen & Kwon and similar)

**NOT FOUND in accessible full text.** Mheen TI & Kwon TW (1984), "Effect of temperature and salt concentration on kimchi fermentation," *Korean J Food Sci Technol* 16:443–450, is the canonical citation and is behind a Korean-language paywall with no OA mirror I could reach. The related Korean-language paper "Fermentation Property of Chinese Cabbage Kimchi by Fermentation Temperature and Salt Concentration" is indexed at https://koreascience.kr/article/JAKO200003043024439.pub?&lang=en — **abstract only, no numeric data retrievable.** Anyone citing Mheen & Kwon for specific rates should be asked for the page image.

---

## 3. TASK 3 — Beetroot

### 3.1 Sugar content — sucrose dominance confirmed, 5–8% confirmed

**Primary source (best in the search):**

| Item | Value |
|---|---|
| Study | Wruss J, Waldenberger G, Huemer S, Uygun P, Lanzerstorfer P, Müller U, Höglinger O, Weghuber J. "Compositional characteristics of commercial beetroot products and beetroot juice prepared from seven beetroot varieties grown in Upper Austria." *J Food Compos Anal.* 2015;42:46–55 |
| DOI / URL | https://doi.org/10.1016/j.jfca.2015.03.005 |
| Confidence | **Strong** |
| Study quality | 7 beetroot varieties (field-grown, Upper Austria) + 16 commercial juices + 4 powders. Multiple analytes, established methods. Cited 302×. This is the reference composition paper for beetroot juice |

**Verbatim:** *"Sugar composition was similar in all varieties with an average total content of about 7.7%, consisting of 95% sucrose."*

**[MY CALC]** 7.7% total sugar × 95% sucrose = **≈7.3 g sucrose per 100 mL juice**. Total sugar range across varieties was tight (their abstract: "others showed only minor variation (certain minerals and sugars)"). Note the units are **g per 100 mL fresh juice**, not g/100 g root — juice is slightly concentrated relative to root.

**Corroborating dry-weight data:**

| Item | Value |
|---|---|
| Study | Almeida D, Petropoulos SA, da Silveira TFF, Pires TCSP, Ferreira ICFR, Fernandes Â, Barros L. "Exploring the Biochemical Profile of *Beta vulgaris* L.: A Comparative Study of Beetroots and Swiss Chard." *Plants* 2025;14(4):591 |
| URL | https://doi.org/10.3390/plants14040591 · https://pmc.ncbi.nlm.nih.gov/articles/PMC11859049/ |
| Confidence | Moderate |
| Verbatim | *"sucrose being the prevalent sugar (3.94 to 40.79 g/100 g dw), followed by trehalose (0.38 to 0.70 g/100 g dw)"* and *"cv. Pablo F1 roots being the sample with the highest total sugars content (41.5 g/100 g dw) due to the high content of sucrose (40.8 g/100 g dw)"* |

**[MY CALC]** Beetroot is ~13–16% dry matter, so 41.5 g/100 g DW ≈ 5.4–6.6 g/100 g fresh weight. Consistent with Wruss. The huge varietal range (3.94–40.79 g/100 g DW) is a real caution: **beetroot sugar varies more than tenfold between cultivars**, far more than cabbage or cauliflower.

USDA SR Legacy "Beets, raw" total sugars = **6.76 g/100 g** (FDC 169145). Sucrose/glucose/fructose breakdown **NOT FOUND** (API rate-limited).

### 3.2 Time to pH 4.0 and acidification rate

| Item | Value |
|---|---|
| Study | Duyar SM, Sari F, Karaoglan HA. "Production of red beetroot juice by different methods: Kinetics of microbial growth, sugar consumption, and acid production." *Heliyon* 2024;10(9):e30448 |
| DOI / URL | https://doi.org/10.1016/j.heliyon.2024.e30448 · https://pmc.ncbi.nlm.nih.gov/articles/PMC11088329/ |
| Confidence | **Moderate for pH/time; weak for the rate regressions** (internal inconsistencies, below) |
| Study quality | Two parallel methods, n = 3 (triplicate plating and analysis), real red beetroot juice, HPLC sugar quantification, pH meter. Weaknesses: separate vessel per sampling time (not repeated sampling), spontaneous arm included 25% yoghurt water as an inoculum, and the reported regression coefficients do not reconcile with the measured endpoints |

**Measured endpoints:**

| Method | Temp | Duration | Final pH | Lactic acid start → end | Acetic acid start → end |
|---|---|---|---|---|---|
| Spontaneous (+25% yoghurt water) | **24–25 °C** (ambient) | **96 h** | **4.00** | 519.30 → 1024.30 mg/L | 42.46 → 191.33 mg/L |
| *Lc. paracasei* 2% (~6–7 log CFU/mL), pasteurised | **31 °C** | **44 h** | **3.83** | not detected → 851.10 mg/L | not detected → 327.76 mg/L |

**Sugars (their Table 1), mg/L juice:**

| Method | Time | Sucrose | Fructose | Glucose |
|---|---|---|---|---|
| Spontaneous | 0 h | 8038 | 3802 | 65.66 |
| Spontaneous | 96 h | 7373 | 3764 | 73.76 |
| *Lc. paracasei* | 0 h | 14490 | 3495 | 233.57 |
| *Lc. paracasei* | 44 h | 10080 | 2484 | 250.44 |

**[MY CALC] Rates:**
- Lactic acid, spontaneous: +505 mg/L over 96 h = **5.3 mg/L/h = 0.126 g/L/day**
- Lactic acid, *Lc. paracasei*: +851 mg/L over 44 h = **19.3 mg/L/h = 0.46 g/L/day** (this is 3.7× the spontaneous rate)
- Sucrose consumed, *Lc. paracasei*: 4410 mg/L over 44 h = **100 mg/L/h**
- Sucrose consumed, spontaneous: 665 mg/L over 96 h = **6.9 mg/L/h** — and the paper itself states the sucrose decline was **not statistically significant** (p < 0.05 threshold, reported as not significant)

**⚠ Major caveat on this paper.** The regression sentences do not reconcile with the measured endpoints. Verbatim: *"An increase of one unit in the fermentation time caused the formation of 22.4 and 6.957 mg/L LA and AA"* (≈22.4 mg/L/h → 985 mg/L over 44 h, which does roughly match the 851 mg/L endpoint) — but the spontaneous arm is reported as *"The amount of LA in the environment increases by 6249 mg/L for every additional unit of time"*, which is impossible given the measured 505 mg/L total increase over 96 h. **Treat the regression coefficients as unreliable; use only the endpoint pH, time and acid concentrations.**

Also note: **1.0 g/L lactic acid is a very low terminal acid concentration.** Reaching pH 4.0 with ~1 g/L lactic acid implies a weakly buffered juice — plausible for beet juice but worth independent verification. And the "spontaneous" arm was not truly spontaneous (25% yoghurt water added).

### 3.3 Is beetroot described as fast-fermenting?

**NOT FOUND as an explicit claim in the peer-reviewed literature.** I found no paper stating beetroot is a fast or slow fermenter relative to other vegetables. The Duyar paper frames beetroot juice as *"an excellent environment for the development of probiotics due to the carbohydrates it contains"* and notes LAB reached >8 log CFU/mL, but gives no cross-vegetable rate comparison.

**Contradicting signal from the non-peer-reviewed source:** the same sourchad.com guide that the ratios likely came from lists **"Beets 7–14 days"** — the same window as green beans, and **slower** than its "Cauliflower 5–10 days". [https://sourchad.com/guide/best-vegetables-to-ferment](https://sourchad.com/guide/best-vegetables-to-ferment). Its own beetroot sugar figure is *"beets (~7 g sugar/100g)"*, which matches Wruss.

### 3.4 Beetroot buffering capacity: **NOT FOUND.** No measured titration curve for beetroot or beet juice located.

---

## 4. TASK 4 — Cauliflower and green bean

### 4.1 Cauliflower — full pH/time curve found

| Item | Value |
|---|---|
| Study | Qinghang W, Zhang C, Zhang J, Xin X, Li T, He C, Zhao S, Liu D. "Variation in glucosinolates and the formation of functional degradation products in two *Brassica* species during spontaneous fermentation." *Curr Res Food Sci.* 2023;6:100493 |
| DOI / URL | https://doi.org/10.1016/j.crfs.2023.100493 · https://pmc.ncbi.nlm.nih.gov/articles/PMC10070088/ |
| Confidence | **Moderate** (strong for pH/time; the 5% NaCl and 25–30 °C conditions are not typical Western sauerkraut practice) |
| Study quality | 5.0 kg cauliflower lots, cut to 25 × 10 mm, 5.0% (w/w) NaCl, pressed under bamboo batten and stones, fermented **25–30 °C in the dark**, sampled at 0, 24, 48, 72 h. Salt verified stable at 2.25–2.47%. 16S rRNA sequencing, UPLC-MS/MS. Only 4 timepoints, no replication stated for the pH series |

**Measured (their Fig. 1 and §3.1):**

| | Cauliflower (FC) | Broccoli (FB) |
|---|---|---|
| Initial pH | 5.46 | 5.32 |
| pH after 3 d | **3.60** | 3.56 |
| Titratable acidity after 3 d | **0.54% as lactic acid** | 0.51% as lactic acid |
| Salt (brine) | 2.25–2.47% | 2.38–2.75% |

**And verbatim:** *"the fermented pH was below 4.0 in both FC and FB after 2 d of fermentation"* — this is their inference from pH-gated myrosinase inactivation, and it is consistent with the Fig. 1 curve.

**Interpretation for the claim:** cauliflower is **fast**, not 0.9x. Reaching pH <4.0 in 2 days and pH 3.60 in 3 days. The confound is temperature (25–30 °C here vs ~20 °C for the sauerkraut tanks). Applying a rough Q₁₀ of 2–3 [MY CALC, not from a source] to bring cauliflower down to 20 °C gives roughly 4–6 days to pH 4.0 — i.e. **comparable to sauerkraut, maybe slightly faster, not 10% slower.** And cauliflower has the *least* sugar of the six vegetables (1.91 g/100 g), so something other than sugar is driving it — most likely its low content of buffering solids plus the *Weissella*-dominated heterofermentative community (Weissella was 39.33–51.18% of the bacterial population).

**Contradicting but weaker evidence:** the USDA ARS broccoli data show high lactic-acid buffer capacity (173 mM to pH 3.0) and a stalled endpoint at pH 4.3 ± 0.5 — but that was at 30 °C in 2% NaCl with a low LAB population (4.5 ± 0.5 log CFU/mL). The two studies disagree about whether *Brassica* florets acidify strongly. **Flagged as contested.**

**Cauliflower buffering capacity as mM acid: NOT FOUND.** No titration curve. Only the broccoli proxy above.

**Supporting community-dynamics source** (no pH/time numbers, but useful for succession): Paramithiotis S, Hondrodimou OL, Drosinos EH. "Development of the microbial community during spontaneous cauliflower fermentation." *Food Res Int.* 2010;43(4):1098–1103. https://doi.org/10.1016/j.foodres.2010.01.023 — and Wouters D, Grosu-Tudor S, Zamfir M, De Vuyst L. *J Sci Food Agric.* 2013;93(4):808–817. https://doi.org/10.1002/jsfa.5788, which found for cauliflower and mixed-vegetable (green tomato/carrot/cauliflower) fermentations: *"a second phase from day 3 onwards wherein L. citreum and Lb. brevis occurred"*, with glucose and fructose *"mostly depleted at the end of fermentation"* and *"lactic acid, acetic acid, ethanol and small amounts of mannitol"* as products. Both paywalled; abstracts only.

### 4.2 Green bean

**Best quantitative source — time-to-pH with and without starter:**

| Item | Value |
|---|---|
| Study | Mnkeni AP, Maeda EE, Gierschner K. "Chemical, nutritional and sensory evaluation of green beans fermented with and without starter culture." *Ecol Food Nutr.* 1995;34(1):29–38 |
| DOI / URL | https://doi.org/10.1080/03670244.1995.9991453 |
| Confidence | **Weak–moderate** |
| Study quality | Two varieties (Binz, Mangtout), with and without starter, pH + reducing sugars + total acids + vitamins tracked, sensory panel (5-point hedonic). **Fermentation temperature is not in the abstract and the paper is paywalled — I could not verify it.** Cited only 2× |
| Verbatim | *"The pH of the beans fermented with starter culture fell to below 4.0 after 4 days whereas the samples fermented without starter culture took 8 days. In both cases a sharp decrease in sugars and increase in acids were observed within the first two days of fermentation but samples fermented without starter produced significantly less acids."* |

**[MY CALC] Starter vs native ratio here = 8/4 = 2.0x.** This is one of the very few clean "speed ratio" numbers in the literature — and note it is a *process* variable (inoculation), not a *vegetable* variable. It also shows the same vegetable can swing 2x on inoculum alone, which is a direct argument that 0.8x vs 1.2x distinctions between vegetables are below the noise floor.

Related: Mnkeni AP, Gierschner K, Maeda EE. *Int J Food Sci Nutr.* 1996;47(5):395–399. https://doi.org/10.3109/09637489609028559 — green beans (var. Tuf) blanched 90 °C/20 min, fermented in **3.08% salt** with starter; vitamins B1/B2 and trypsin inhibitors fell significantly; storage at 20 °C for 36 days.

**USDA ARS green bean engineering data (already in §1.2):**
- Buffer capacity: **57.6 ± 1.5 mM lactic acid** and **463 ± 14 mM acetic acid** to reach pH 3.0 — the extreme lactic/acetic split of any vegetable measured
- Measured sugars: glucose 49.28 ± 1.13, fructose 46.88 ± 3.44, sucrose 2.14 ± 1.25 mM
- At 30 °C, 2% NaCl, 21 days: reached pH 3.1 ± 0.2 with **residual sugars still present**, producing 155.7 ± 15.8 mM lactic acid, 43.5 ± 10.9 mM acetic acid, 28.5 ± 8.6 mM ethanol, and 14.03 ± 1.54 mM succinic acid
- **Green bean reached the lowest pH of the eight vegetables tested (3.1 ± 0.2)** — a "complete" fermentation by their definition was not achievable because buffer capacity was exhausted before the sugar was

**Classic USDA ARS fermentation paper:** Chen KH, McFeeters RF, Fleming HP. "Complete Heterolactic Acid Fermentation of Green Beans by *Lactobacillus cellobiosus*." *J Food Sci.* 1983;48(3):967–971. https://doi.org/10.1111/j.1365-2621.1983.tb14942.x
- *"A maximum of 3.74% sugar was metabolized by L. cellobiosus in bean juice containing 2.5% NaCl and 0.08% acetic acid."*
- *"Fructose was nearly quantitatively reduced to mannitol with a concomitant accumulation of acetic acid."*
- *"An inoculum of 10 CFU/ml Lactobacillus plantarum and 10⁶ CFU/ml L. cellobiosus resulted in the formation of twice as much lactic acid as inoculation with L. cellobiosus alone."*
- Companion paper: https://doi.org/10.1111/j.1365-2621.1983.tb14943.x — *"Completely fermented beans were microbiologically stable for at least 6 months under anaerobic conditions at 27 °C"* and mannitol was stable to *L. plantarum* at pH 3.5. **This is the mannitol-in-green-bean source: fructose → mannitol is nearly quantitative.**

---

## 5. TASK 5 — Jalapeno / chilli pepper

### 5.1 The one true pH/time curve for a *Capsicum* under defined conditions

| Item | Value |
|---|---|
| Study | López-Salas D, Oney-Montalvo JE, Ramírez-Rivera E, Ramírez-Sucre MO, Rodríguez-Buenfil IM. "Evaluation of the Volatile Composition and Sensory Behavior of Habanero Pepper during Lactic Acid Fermentation by *L. plantarum*." *Foods* 2022;11(22):3618 |
| DOI / URL | https://doi.org/10.3390/foods11223618 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9689949/ |
| Confidence | **Weak as a proxy for normal pepper fermentation; strong for its own conditions** |
| Study quality | Real habanero puree at 60% (w/v), **sterilised at 121 °C/15 psi/15 min**, inoculated 10% (v/v) with ~10⁷ cells/mL, **incubated at 40 °C**. n not stated in the assay descriptions. **This is a sterilised, heavily inoculated, 40 °C model system — not a spontaneous room-temperature pepper ferment** |

**pH trajectory (their Appendix A, Table A1):**

| Time (h) | pH, COM strain | pH, WIL strain |
|---|---|---|
| 0 | 4.95 ± 0.01 | 4.92 ± 0.01 |
| 2 | 4.48 ± 0.01 | 4.39 ± 0.00 |
| 4 | **4.13 ± 0.00** | **4.07 ± 0.01** |
| 6 | 3.94 ± 0.01 | 3.88 ± 0.01 |
| 8 | 3.79 ± 0.00 | 3.77 ± 0.00 |
| 24 | 3.56 ± 0.00 | 3.42 ± 0.00 |
| 48 | 3.55 ± 0.02 | 3.39 ± 0.00 |
| 72 | 3.62 ± 0.01 | 3.49 ± 0.00 |

**Kinetic parameters (their Table 2):**

| Parameter | COM (*L. plantarum*, commercial) | WIL (*L. plantarum*, wild, pepper-isolated) |
|---|---|---|
| µ, growth rate (h⁻¹) | **0.0680 ± 0.0025** | 0.0336 ± 0.0074 |
| ∆X, max dry weight (g/L) | 0.54 ± 0.03 | 0.58 ± 0.06 |
| **Qₚ, lactic acid synthesis rate (g/L/h)** | **0.7751 ± 0.1160** | **0.8596 ± 0.1014** |
| ∆P, max lactic acid (g/L) | 9.91 ± 0.09 | **10.81 ± 1.03** |

**[MY CALC]** Qₚ of ~0.78–0.86 g/L/h = **18.7–20.6 g/L/day**. That is roughly **40–160× faster** than the beetroot rates in §3.2 and roughly **10× faster** than the kimchi rates in §2.2. But it is an artefact of 40 °C plus a 10⁷ CFU/mL inoculum in a sterilised medium. **Do not use this to argue peppers are fast fermenters.**

### 5.2 What commercial/practical pepper fermentation actually looks like — peppers are SLOW

| Item | Value |
|---|---|
| Study | Huang Q, Li C, Wu Y, Tong S, Zhang L, Jin J, Zhu Q, Yan Y. "Impact of pepper varieties on microbial succession and correlation with physicochemical properties and volatile compounds during pickled pepper fermentation." *Food Chem X.* 2025;26:102551 |
| DOI / URL | https://doi.org/10.1016/j.fochx.2025.102551 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12148400/ |
| Confidence | **Moderate–strong** |
| Study quality | Two commercial cultivars (*Capsicum frutescens* Xiaomola; *C. annuum* Zhuzijiao), dedicated fermentation chamber at **25 °C and 70% RH**, multi-vessel parallel design to avoid repeated-sampling artefacts, sampling at D0/7/14/21/49/63/77, all measurements in triplicate |
| Conditions | **9% NaCl brine + 2.5% sugar + 1% Chinese liquor + 1% ginger + 1% garlic.** Note the added sugar — so this is not a sugar-limited system |
| Verbatim results | *"Both varieties showed minimal changes in pH and TA from D21 to D77, with final pH values stabilizing at 3.31 and 3.38"*; *"salinity reduction from 9% to 4.12%, pH stabilization at 3.3 after 66 days"*; reducing sugars reduced by **27.55%** (XML) and **72.39%** (ZZJ) |
| Industrial context (their §1) | *"fresh whole peppers of XML and ZZJ are fermented as pickled peppers through brine fermentation for approximately 3 months at 25–30 °C in sealed containers"* |

**[MY CALC]** Peppers here needed ~3 weeks to reach near-terminal pH at 25 °C, in 9% salt with 2.5% added sugar. Compare: cauliflower reached pH 3.60 in **3 days** at 25–30 °C. So in real brines **peppers are roughly 7x slower than cauliflower**, not 1.2x vs 0.9x.

| Item | Value |
|---|---|
| Study | Watts EG, Janes ME, Prinyawiwatkul W, Shen Y, Xu Z, Johnson D. "Microbiological changes and their impact on quality characteristics of red hot chilli pepper mash during natural fermentation." *Int J Food Sci Technol.* 2018;53(9):2072–2080 |
| DOI / URL | https://doi.org/10.1111/ijfs.13792 |
| Confidence | Moderate |
| Verbatim | *"Production of hot sauce may require fermentation of red hot pepper mash in barrels from 2 weeks up to 3 years... Significant pH reduction was observed, with an inverse correlation with acid content... Aroma was analysed based on six volatile compounds which had a significant increase during the first 60 days of fermentation, followed by a significant reduction after 300 days."* |
| Note | pH/time curve not in the abstract; paywalled. **The only quantitative takeaway is that the commercial window is 2 weeks to 3 years** — unambiguously slow |

### 5.3 Why are peppers slow? — mechanism by mechanism

| Proposed mechanism | Verdict | Evidence |
|---|---|---|
| **Low sugar** | **FALSE** | USDA SR Legacy: jalapeno raw = **4.12 g total sugars/100 g**, *higher* than green cabbage (3.20) and cauliflower (1.91). Fructose 2.63, glucose 1.48, sucrose 0.00 g/100 g (FDC 168576). The Huang 2025 brine even had 2.5% **added** sugar |
| **Low water activity / high solids** | **Plausible, untested here** | Pepper mash is a high-solids comminuted matrix; Watts 2018 discusses an 18-month barrel process. I found **no measured a_w** for pepper mash or brine-fermented peppers. **NOT FOUND** |
| **Antimicrobial capsaicin** | **Contested / likely overstated** | Counter-evidence: habanero puree supported µ = 0.068 h⁻¹ and 10.81 g/L lactic acid at 40 °C (López-Salas 2022). Also Park B, Yang JS, Moon EW, Seo HY, Ha JH. "Influence of Capsaicinoids Content on the Microbial Community during Kimchi Fermentation." *J Microbiol Biotechnol.* 2019;29(10):1580–1590, https://doi.org/10.4014/jmb.1907.07023 — capsaicinoids *shift* the community rather than blocking fermentation. **A specific MIC of capsaicin against LAB: NOT FOUND** |
| **Acidic initial pH** | **Partially true** | Habanero puree started at pH 4.92–4.95 (López-Salas 2022) — already near the pH 4.5 safety threshold, so the LAB have little pH headroom to create a "fast drop". But this cuts the other way: less acid is needed to reach pH 4.0 |
| **High buffer capacity** | **Plausible — the strongest candidate** | USDA ARS: green bell pepper needs only 64.8 ± 3.0 mM lactic acid to reach pH 3.0 (low), but 189 ± 20 mM acetic acid. Peppers are citrate/malate-rich, and tomato (another fruit-type matrix) needed only 65.0 ± 3.0 mM lactic acid yet still stalled at pH 3.3 ± 0.2. **Direct measured buffer capacity for jalapeno or chilli mash: NOT FOUND** |
| **High salt in practice (8–10%)** | **TRUE and probably dominant** | Huang 2025 used **9% NaCl**; traditional pepper mash uses 8–10%. Compare sauerkraut at 2.5% and kimchi at 2.3%. Salt is the obvious rate-limiting difference between a 3-day cauliflower ferment and a 3-week pepper ferment |

**Honest conclusion for Task 5:** the literature does not support "peppers are slow because of low sugar or capsaicin." The measured differences are driven by **process (8–10% salt, high-solids mash, months-long barrel fermentations)** and plausibly by **buffering**, not by the vegetable's intrinsic sugar or its pungency.

---

## 6. MASTER COMPARISON TABLE — everything measured, side by side

All entries are real vegetable or real juice unless marked. ★ = my ranking, [MY CALC].

| Vegetable | Sugar (g/100 g FW, USDA) | Measured time to pH ~4.0 | Temp | System | Lactic acid rate | Source | Confidence |
|---|---|---|---|---|---|---|---|
| Green cabbage | 3.20 | **7 d to pH 4.0**; 7 d to pH 3.8 | 13.5–16 °C (SK2); 19–22 °C (SK1) | Artisanal tank, spontaneous, 2%+ salt | total acidity 0.54–0.89% after 62 d | Gaudioso 2022; Drašković Berger 2021 | Moderate |
| Napa cabbage | NOT FOUND (raw) | **3 d to pH 4.36**; 14 d to 3.89; 47 d at 4 °C | 15 °C / 4 °C | Real kimchi, 2.3% salt | — | Kim 2025 | Strong |
| Napa cabbage | 17.16 mg/mL glucose in juice at d0 | 7 d to pH 4.07 (15 °C); 4.21 (10 °C); 5.09 (4 °C) | 4/10/15 °C | Commercial kimchi | 1.83%/1.69%/0.75% acidity at wk 1 | Jung 2024 | Moderate |
| Beetroot | 6.76 (USDA); **7.7% in juice, 95% sucrose** | **96 h to pH 4.00** (spont.); **44 h to pH 3.83** (starter) | 24–25 °C; 31 °C | Real juice, 25% yoghurt water / 2% *Lc. paracasei* | 0.126 g/L/d (spont.); 0.46 g/L/d (starter) | Wruss 2015; Duyar 2024 | Moderate |
| Cauliflower | **1.91** (lowest) | **<2 d to pH <4.0; 3 d to pH 3.60** | 25–30 °C | Real florets, 5% NaCl, spontaneous | 0.54% lactic acid at 3 d | Qinghang 2023 | Moderate |
| Broccoli | ~1.7 (FDC) | 3 d to pH 3.56 | 25–30 °C | Real florets, 5% NaCl | 0.51% lactic acid at 3 d | Qinghang 2023 | Moderate |
| Green bean | 3.26 | **4 d (starter) / 8 d (no starter) to pH <4.0** | NOT FOUND | Whole beans, 2 varieties | — | Mnkeni 1995 | Weak–moderate |
| Green bean | 49.28 mM glucose, 46.88 mM fructose | 21 d to pH 3.1 ± 0.2 (incomplete) | 30 °C | 2% NaCl + 0.08% acetic, native | 155.7 ± 15.8 mM lactic acid over 21 d [MY CALC ≈ 7.4 mM/d] | Little 2022 (USDA ARS) | Strong |
| Green bell pepper | 61.34 mM glucose ref. | 21 d to pH 3.1 ± 0.2 (incomplete) | 30 °C | 2% NaCl + acetic, native | 102.7 ± 14.4 mM lactic acid over 21 d [MY CALC ≈ 4.9 mM/d] | Little 2022 (USDA ARS) | Strong |
| Jalapeno | **4.12** | NOT FOUND (real jalapeno) | — | — | — | USDA FDC 168576 | Strong (composition only) |
| Habanero | NOT FOUND | **4 h to pH 4.07–4.13**; 24 h to 3.42–3.56 | **40 °C** | 60% puree, sterilised, 10% inoculum | Qₚ 0.78–0.86 g/L/h [MY CALC 18.7–20.6 g/L/d] | López-Salas 2022 | Weak (see §5.1) |
| Chilli (pickled) | reducing sugars −27.6% / −72.4% | ~21 d for bulk change; pH 3.31–3.38 at 77 d | 25 °C | **9% NaCl** + 2.5% sugar | — | Huang 2025 | Moderate |
| Chilli (mash) | NOT FOUND | 2 weeks to 3 years (commercial window) | ambient | Barrel mash, 8–10% salt | — | Watts 2018 | Moderate |

**[MY CALC] Observed ordering by measured time-to-pH-4.0, where data exist and after crude temperature adjustment to ~20 °C (using a Q₁₀ of 2, which is my assumption, not a sourced value):**

1. Cauliflower — fastest by measured curve (2 d at 25–30 °C → ~3–4 d at 20 °C)
2. Beetroot juice with starter (1.8 d at 31 °C → ~3–4 d at 20 °C)
3. Green cabbage / sauerkraut — 7 d at ~15 °C; ~4–5 d at 20 °C
4. Napa / kimchi — dataset-dependent: 3–11 d at 15 °C
5. Green bean — 4–8 d at unstated temperature
6. Peppers in real brine — 21+ d at 25 °C in 9% salt

That ordering matches **none** of the claimed ratios. In particular **beetroot > napa > cauliflower > cabbage > jalapeno > green bean** (the claim) is inconsistent with cauliflower and sauerkraut both being fast and with napa being unresolvable.

---

## 7. WHERE I COULD NOT FIND DATA — explicit gaps

1. **The ratios themselves.** No paper normalises time-to-target-pH across these six vegetables. Any such number is an extrapolation.
2. **Napa cabbage raw sugar content (g/100 g or mM).** FDC API rate-limited; FDC pages are JS-rendered. Partial substitute: measured kimchi glucose 17.16 ± 1.38 mg/mL and sucrose 1.29 ± 0.03 mg/mL at day 0 (Jung 2024).
3. **Napa cabbage mannitol in absolute units.** Only relative/peak-intensity or fold-change data found.
4. **Beetroot buffering capacity (mM acid to a given pH).** Nothing found.
5. **Cauliflower buffering capacity.** Nothing found. Broccoli is the nearest proxy but the two studies disagree about broccoli's endpoint.
6. **Fermentation temperature in Mnkeni 1995.** The single best green-bean time-to-pH number has no stated temperature in its abstract, and the paper is paywalled.
7. **Mheen & Kwon (1984), *Korean J Food Sci Technol* 16:443–450.** Canonical kimchi temperature/salt reference — no accessible full text or numeric abstract. Same for most Korean Journal of Food Science and Technology kimchi papers, which are not in Europe PMC or PMC.
8. **Kimchi vs sauerkraut head-to-head acidification rate study.** Does not exist as far as I can find.
9. **A measured MIC of capsaicin against lactic acid bacteria.** Not found; the claim that capsaicin slows pepper fermentation is not supported by a dose-response study I could locate.
10. **Water activity of pepper mash or brine-fermented peppers.** Not found.
11. **Any study reporting dpH/dt for cabbage, napa, beetroot, cauliflower, green bean or jalapeno under a common protocol.** Not found. All dpH/dt values in this report are my arithmetic on endpoint pairs.

---

## 8. RECOMMENDED READING ORDER IF YOU WANT TO CHASE THIS FURTHER

1. **Kim et al. 2025, *Foods* 14(16):2826** — the cleanest kimchi temperature/time/pH table, open access. https://pmc.ncbi.nlm.nih.gov/articles/PMC12385461/
2. **Little et al. 2022, *J Food Sci* 87:2121–2132** — the only USDA ARS multi-vegetable controlled fermentation with buffer capacities. https://doi.org/10.1111/1750-3841.16084
3. **Qinghang et al. 2023, *Curr Res Food Sci* 6:100493** — the only real cauliflower pH/time curve. https://pmc.ncbi.nlm.nih.gov/articles/PMC10070088/
4. **Gaudioso et al. 2022, *Front Microbiol* 13:929738** — the sauerkraut baseline with measured tank temperatures. https://pmc.ncbi.nlm.nih.gov/articles/PMC9606823/
5. **Duyar et al. 2024, *Heliyon* 10(9):e30448** — the only beetroot acidification kinetics. https://pmc.ncbi.nlm.nih.gov/articles/PMC11088329/
6. **Wruss et al. 2015, *J Food Compos Anal* 42:46–55** — beetroot sugar composition, 7 varieties. https://doi.org/10.1016/j.jfca.2015.03.005

## 9. METHOD NOTE

Searches were run against Europe PMC (REST API, incl. OA full text), OpenAlex, Semantic Scholar, PMC, USDA FoodData Central (SR Legacy, API), and general web search. Where a paper was paywalled I retrieved the abstract via OpenAlex or Semantic Scholar and have labelled it as abstract-only. Full text was extracted and read for: Little 2022 (ARS PDF), Kim 2025, Jung 2024, Qinghang 2023, Gaudioso 2022, Duyar 2024, López-Salas 2022, Huang 2025, Almeida 2025, and the 2018 MDPI kimchi/glutinous-rice paper.

**Two source-integrity flags for anyone downstream:**
- **sourchad.com** presents itself as evidence-based ("Every claim cited") but several of its PMID citations do not support the sentences they are attached to. Example: it cites **PMID 38144756** (Choi et al. 2023, *Food Chem X*, on the effect of *ingredient size* on radish kimchi) for the proposition that "glucose content during the early fermentation window was directly predictive of lactic acid bacteria activity and pH decline rate." That is not what that paper tested.
- Two peer-reviewed sources I used contain **internal numerical contradictions** (Jung 2024 on the week-1 acidity/pH sentence and the mg/L organic acid units; the 2018 MDPI glutinous-rice paper on GRP vs control pH direction; Duyar 2024 on the spontaneous-arm regression coefficient). These are flagged inline and should not be propagated without checking the original figures.
