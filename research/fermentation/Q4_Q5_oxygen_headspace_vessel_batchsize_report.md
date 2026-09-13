# Q4 & Q5 — Oxygen / Headspace / Vessel / Stirring, and Batch Size / Vessel Size / Salt Distribution

**Quantitative evidence review with citations.** Compiled from primary literature, USDA-ARS "Pickle Pubs", extension guidance and food-science reference works.

**How to read this.** Every finding gives the number, the source (author / year / journal or institution) with a full URL, an explicit confidence rating, and a one-line study-quality note. Confidence key:

- **STRONG** — primary experimental data, replicated, in a peer-reviewed venue; or a regulatory/authoritative statement.
- **MODERATE** — single study, small n, unreplicated, or a review restating primary data.
- **WEAK-OR-CONTESTED** — conflicting evidence, indirect evidence, or an inference I am drawing rather than a measured result.
- **[CALC]** — my own arithmetic from cited inputs, not a sourced number.
- **NO DATA** — I searched and could not find it. Stated plainly rather than filled with a plausible-sounding number.

A note on method: much of the key ARS material exists only as scanned image PDFs with no text layer. I OCR'd these locally (300 dpi, RapidOCR) and quote them directly. Occasional OCR character noise is marked `[sic]` where it could confuse.

---

# QUESTION 4 — OXYGEN / HEADSPACE / VESSEL / STIRRING

## 4(a) Does oxygen exclusion change the RATE of acidification, or mostly the spoilage risk?

**Answer: both — but the honest reading of the literature is that the *primary* stated justification is spoilage/ecology control, while the *rate* effect is real, large, and strongly dose-dependent on how much oxygen is actually introduced. At low, realistic aeration the rate penalty is modest; at high aeration it is catastrophic (net acid consumption, pH above 7).**

### 4a.1 — THE ARS STATEMENT, verbatim and in context

> "**5.1. Anaerobiosis.** In most, if not all, lactic acid fermentations of vegetables, it is necessary to exclude oxygen to provide anaerobiosis. This will inhibit the growth of aerobic spoilage microorganisms, such as bacteria, molds and oxidative yeasts, and stimulate the activity of the lactic bacterial flora."

- **Source:** Andersson, R.E., Daeschel, M.A. & Eriksson, C.E. (1988). "Controlled Lactic Acid Fermentation of Vegetables." In: Durand, G., Bobichon, L. & Florent, J. (eds), *8th International Biotechnology Symposium*, Paris, pp. 855–871. SI K – The Swedish Institute for Food Research, Göteborg, and USDA-ARS / North Carolina State University, Raleigh. Paper no. 11851 of the Journal Series of the North Carolina Agricultural Research Service.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf (the quote is on the page numbered 861; ARS "Pickle Pubs" item p210)
- **Confidence:** STRONG that this is the statement and that it is an ARS/NCSU-authored review chapter.
- **Study quality:** a conference-proceedings review chapter, not primary data. It is a synthesis by the Raleigh ARS group and its collaborators — authoritative as a statement of the field's consensus, but it reports no experiment of its own.

**Critical nuance for framing:** the statement's *own stated mechanism* is ecological — it says excluding oxygen "will inhibit the growth of aerobic spoilage microorganisms… and stimulate the activity of the lactic bacterial flora." It does **not** claim that oxygen exclusion accelerates acidification. Note also the immediately following sentence in the same section:

> "From a practical point of view, anaerobiosis can be self-achieved via the respiratory action of the microbial flora and the indigenous vegetables (Stamer, 1983). Regarding shredded and sliced vegetables, oxygen can be removed by carefully pressing the vegetables in the fermentation vessel."

- **Same source/URL.** **Confidence:** STRONG (direct quote).
- This is the only passage I found in the ARS corpus that comes close to justifying the "press/pack the vegetables down" practice — and it is a statement about **removing oxygen**, not about a measured effect on fermentation rate. See 4(e).

### 4a.2 — THE DECISIVE EXPERIMENT: Potts & Fleming 1979, N₂ vs air purging

This is the quantitative paper behind the anaerobiosis recommendation, and it answers the rate-vs-spoilage question directly.

- **Source:** Potts, E.A. & Fleming, H.P. (1979). "Changes in dissolved oxygen and microflora during fermentation of aerated, brined cucumbers." *Journal of Food Science* **44**(2): 429–434. USDA-SEA-AR Food Fermentation Laboratory, Southern Region, and North Carolina Agricultural Experiment Station, Dept. of Food Science, NC State University, Raleigh.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p138.pdf
- **Confidence:** STRONG (primary data, dose–response design, published in JFS; caveat below on purge rates).
- **Study quality:** well-controlled laboratory comparison with a commercial-tank confirmatory arm. Limitation stated by the authors themselves: "Data reported represent single fermentations for each purging treatment" — i.e. **n = 1 per treatment**, no replication, no error bars. Figures only, no statistics.

**Design:** size no. 3 pickling cucumbers (3.8–5.1 cm dia), brined to equilibrate at 20° salometer (**5.3% NaCl**), pack-out 50% cucumbers / 50% brine by weight, 5-gal plastic pails, incubated 23–28 °C. CO₂ purged continuously with either **N₂ at 5 mL/min/gal** or **air at 5 or 100 mL/min/gal** (abbreviated MMG).

**Results — the pH and acidity data (Fig. 8 and Fig. 9 of the paper):**

| Purging gas / rate | Titratable acidity at day 14 (as lactic) | Brine pH at day 14 |
|---|---|---|
| **N₂, 5 MMG** | **1.1%** | **3.4** |
| **Air, 5 MMG** | **0.7%** | **3.7** |
| **Air, 100 MMG** | **all titratable acidity consumed and gone by day 6** | **above 7.0** |

- Quote: *"Rate of acid development and titratable acidity were decreased by air purging (Fig. 8). By day 14, 1.1% titratable acidity (as lactic acid) had developed in nitrogen-purged brine, compared to 0.7% in brine that was air purged at 5 MMG. Air purging at 100 MMG resulted in consumption and disappearance of all titratable acidity as of 6 days after brining."*
- Quote: *"By day 14 brine pH was 3.4 with nitrogen purging, 3.7 with air purging at 5 MMG, and above 7.0 with air purging at 100 MMG."*
- **Confidence:** STRONG for the direction and the magnitude ordering; MODERATE for the exact values (n=1, read off figures).
- **Why this matters:** the high-aeration arm is not merely "slower fermentation" — it is **net acid consumption**, i.e. the fermentation is reversed and the product alkalinises above pH 7. That is a spoilage outcome, not a rate outcome, and it is driven by oxidative yeasts and moulds oxidising the lactic acid (see 4f).

**Results — the microbiological mechanism (Fig. 6 and Fig. 7):**

| | N₂-purged | Air, 5 MMG | Air, 100 MMG |
|---|---|---|---|
| LAB count, day 4 | **>10⁷/mL** | **<10⁴/mL** | — |
| LAB count, day 8+ | — | — | **<10⁷/mL** |
| Yeast population, peak | **never exceeded 10²/mL** | **10⁶/mL** | **nearly 10⁹/mL** |
| Brine O₂ uptake rate (max) | **0.85% saturation/min** | **2.6% saturation/min** | **38% saturation/min** |

- Quote: *"The rate of growth and subsequent maximal population of lactic acid bacteria were inversely related to rate of aeration (Fig. 7). Within 4 days after brining, lactic acid bacteria counts exceeded 10⁷/ml with nitrogen purging, but were less than 10⁴/ml with air purging at 5 MMG."*
- Quote on yeasts: *"During stage two, yeast populations rose dramatically, and reached nearly 10⁹/ml of brine when aerated at 100 MMG and 10⁶/ml when aerated at 5 MMG, but never exceeded 10²/ml with nitrogen purging."*
- **Confidence:** STRONG for direction (a ~1000× LAB deficit and a ~10⁴–10⁷× yeast excess under aeration); MODERATE for exact counts (n=1, figure-read).

**Dissolved oxygen numbers:**
- **Oxygen saturation of brine: 5–6 ppm**, "depending on salt concentration and temperature." **Confidence:** STRONG — this figure is independently restated in the ARS review below.
- In continuously aerated brines, DO rose to a maximum of **68% of saturation at 5 MMG** and **97% of saturation at 100 MMG** after 2 days, then fell. **Two distinct stages** were identified: stage 1 = rising DO before microbial growth (~2 days); stage 2 = falling DO after the microflora establishes and O₂ uptake demand develops. **Confidence:** STRONG (primary measurement, Clark electrode, method validated against Winkler).
- Nitrogen-purged and non-purged brines "contained no measurable DO."

**Commercial-tank confirmation and the vertical O₂ gradient:**
- DO in air-purged **commercial 10,000-gal wooden tanks ranged from 20–75% of saturation**, and was **highest (50–75%) at the side-arm outlet ~6 inches below the brine surface, intermediate (40–68%) at the top of the tank 270° from the side arm, and least (20–45%) ~5 ft beneath the brine surface.** *"Thus, appreciable DO was distributed throughout the brine."*
- **Confidence:** STRONG. Directly relevant to 5(c): oxygen ingress produces a real vertical gradient, with the brine–air interface and the purge inlet as the hot spots.

**THE ESSENTIAL CAVEAT — and it cuts both ways:**
> "The above purging rates are higher than the 20–50 standard cubic feet per hour (scfh) recommended for continuous purging of commercial cucumber tanks of 5–10,000 gal capacity… 5 and 100 MMG represent ca 106 and 2120 scfh, respectively. The rates used, however, were convenient for laboratory equipment available and served to illustrate effects of widely varying [rates that] would not be expected to occur under normal commercial conditions."

- **Same source. Confidence:** STRONG (authors' own limitation).
- **Interpretation:** the authors' *low* aeration arm (5 MMG ≈ 106 scfh) is already **2–5× the recommended commercial purge rate** of 20–50 scfh. So the observed penalty at "low air" (pH 3.7 vs 3.4 at day 14) is an **upper bound on the rate penalty under realistic commercial aeration.** The pH >7 catastrophe corresponds to an aeration rate roughly 40–100× normal commercial practice and to a vigorously home-stirred open crock far more than to a properly headed tank. **This is the single most important calibration point for anyone extrapolating these numbers to a kitchen crock.**

### 4a.3 — Corroborating ARS review

- **Source:** Zhai, Y., Pérez-Díaz, I.M. & Díaz, J.T. (2018). "Viability of commercial cucumber fermentation without nitrogen or air purging." *Trends in Food Science & Technology* **81**: 185–192. USDA-ARS Food Science and Market Quality Handling Research Unit, Raleigh, NC.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p423.pdf · DOI: 10.1016/j.tifs.2018.05.017
- **Confidence:** STRONG as a peer-reviewed ARS review; it restates primary data rather than generating new data.
- **Key restated numbers:**
  - *"Up to 6 ppm of dissolved oxygen may be present in cucumber fermentations depending on salt concentration and temperature."* (agrees with Potts & Fleming's 5–6 ppm.)
  - *"In continuously aerated cover brines, the dO2 levels increased at the outset of the fermentations followed by a decrease and the development of an O2 uptake demand and film yeasts growth (Potts & Fleming, 1979). However, N2 purged fermentations presented a negligible dissolved oxygen level and low O2 uptake, conducive to the dominance of the desired LAB."*
  - *"air purging at high rates (100 mL air/minute) in 1 gallon jar fermentations were characterized by rapid and extensive cucumber softening (Gates & Costilow, 1981)"* — again the harm is spoilage (softening), and again at a high rate.
  - *"The use of N2 purging for at least the first 2 d of laboratory scale fermentations is known to prevent tissue softening and improve the quality of fermented cucumbers (Gates & Costilow, 1981)."*
  - *"Although, it has been also observed that the majority of the dCO2 in cover brines comes from microbial activity and not tissue respiration…; the exclusion of O2 as the precursor for CO2 and bloater formation seems to be an additional effective approach to reduce the incidence of bloaters… O2 availability for biological activity is a critical factor in the incidence of bloater defect."*

### 4a.4 — Direct aerobic-vs-anaerobic comparison in KIMCHI (packaging study)

This is the cleanest modern side-by-side, and it points the *opposite* way on rate from what a naive "oxygen slows fermentation" reading would predict for the first 10 days.

- **Source:** Yu, H.J., Park, S.H., Kim, E.H., Choi, Y.-J. & Min, S.G. (2023). "Effect of headspace gas composition in kimchi packaging on the quality characteristics of kimchi." *Journal of Food Science and Technology* **60**(10): 2695–2703. World Institute of Kimchi, Gwangju, Republic of Korea.
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC10439095/ · DOI: 10.1007/s13197-023-05795-z (open access)
- **Confidence:** STRONG for the qualitative finding (LAB rate unaffected by O₂; spoilage organisms strongly affected); MODERATE for exact pH values as a guide to room-temperature vegetable fermentation, because this is a **4–5 °C, 90-day storage** study, not a warm fermentation.
- **Study quality:** n = 3, ANOVA + Duncan's test, full 16S community analysis and GC-MS metabolomics. Well done. Its weakness for our purpose is the temperature regime.

**Design:** kimchi cabbage pickled in 8% (w/v) brine for 4 h, mixed 8:2 with commercial seasoning, packed in PE pouches, fermented at 4–5 °C for 90 days. Three gas regimes:
- **S1** — completely sealed, no gas in or out (CO₂ accumulates)
- **S2** — one-way degassing valve: gas **out** only, no inflow
- **S3** — membrane allowing gas **in and out** (oxygen enters)

**pH data (their Table 1), mean ± SD:**

| Day | S1 (sealed) | S2 (valve, out only) | S3 (gas in + out) |
|---|---|---|---|
| 0 | 6.08 ± 0.01 | — | — |
| 10 | 4.19 ± 0.00 | 4.21 ± 0.01 | 4.25 ± 0.01 |
| 20 | 4.08 ± 0.01 | 4.09 ± 0.02 | 4.16 ± 0.00 |
| 30 | 4.14 ± 0.02 | 4.07 ± 0.01 | **4.22 ± 0.00** |
| 60 | 4.04 ± 0.01 | 4.04 ± 0.01 | **4.26 ± 0.01** |
| 90 | 3.93 ± 0.01 | 4.03 ± 0.01 | **4.39 ± 0.01** |

**The two findings that matter:**
1. **The initial acidification RATE was essentially identical in all three arms.** All three fell from ~6.1 to 4.16–4.25 within 10 days. **LAB counts were not significantly different between treatments** (8.2–11.4 log CFU/g across all arms and times). Quote: *"No significant differences in the lactic acid bacteria number were observed."* → **Oxygen ingress did not change the LAB-driven rate of pH drop.**
2. **Oxygen ingress changed the spoilage outcome and eventually reversed the pH.** In S3 the pH **rose** from 4.22 (day 30) to **4.39 (day 90)** — a **+0.17 unit rise** — while S1/S2 continued to fall to 3.93/4.03. Titratable acidity at day 90: **S1 1.19%, S2 1.13%, S3 0.95%** (S3 ~20% lower). Quote: *"The pH value decreased most rapidly during the first 10 days in all samples and increased slightly after 30 days in S3. This increase in pH is considered a result of the oxidation of lactic acid by oxidative surface-type yeast in the presence of oxygen."*
3. **Spoilage organisms tracked oxygen exactly.** Yeast and mould (log CFU/g): S1 **not detected** at days 10 and 20, 4.15 at day 30; S2 not detected at 10 and 20, 6.76 at day 20; S3 **5.21 at day 10**, rising to 8.32 by day 30. **Coliforms were detected only in S3** (4.69 log CFU/g at day 10). White surface colonies appeared on S3 only.

**Synthesis for 4(a):** oxygen exclusion is best understood as a **spoilage-control and ecology-control measure whose rate benefit is real but secondary and dose-dependent**. In kimchi at 4–5 °C the LAB rate was completely unaffected by oxygen over 10 days. In cucumbers at 23–28 °C with forced aeration, oxygen suppressed LAB by up to ~1000× and abolished acidity. The ARS statement's own rationale is the ecological one.

---

## 4(b) Headspace — how much, recommended by whom, and does a big headspace slow acidification?

### 4b.1 — Headspace recommendations: THERE IS A REAL, CITABLE DISAGREEMENT

**Correcting my own earlier assumption:** numeric headspace guidance **does exist**, is **official**, and **the sources disagree with each other by about an inch.** All figures are quoted verbatim.

| Source | Verbatim wording | Headspace |
|---|---|---|
| **USDA Complete Guide to Home Canning** (2015 rev., AIB-539), Guide 6, p. 6-7, sauerkraut procedure | *"Be sure it is deep enough so that its rim is at least **4 or 5 inches above the cabbage**."* | **10–13 cm** |
| **Oregon State University Extension, PNW 355** *Pickling Vegetables* (Brandt, rev. 2019/2024) | *"Be sure that the container is deep enough so that its rim is at least **4 or 5 inches above the cabbage**."* | **10–13 cm** |
| **Penn State Extension**, *Let's Preserve: Fermentation — Sauerkraut and Pickles* | *"Continue preparing and packing 5-pound quantities of shredded cabbage and 3 tablespoons of salt at a time until finished, or until the fermentation container is filled **within three (7.5 cm) to four inches (10 cm) from its top**."* | **7.5–10 cm** |
| **USDA Complete Guide**, Guide 6, p. 6-6 (submersion rule, different from vessel headspace) | *"Cabbage and cucumbers must be kept **1 to 2 inches under brine** while fermenting."* | **2.5–5 cm of brine over the solids** |

- **URLs:** USDA AIB-539 — https://archive.org/details/usda-complete-guide-to-home-canning-2015-revision · Oregon State PNW 355 — https://extension.oregonstate.edu/catalog/pnw-355-pickling-vegetables · Penn State — https://extension.psu.edu/sauerkraut
- **Confidence:** STRONG (all three are authoritative extension/federal documents, quoted verbatim).
- **The disagreement:** **Penn State is 1 inch (2.5 cm) shallower than USDA and Oregon State.** On a typical 5 L crock (~24 cm deep), that is the difference between ~40% and ~50% headspace by depth.
- **IMPORTANT — do not conflate this with canning headspace.** USDA's jar headspace doctrine (e.g. **½ inch** for boiling-water-processed pickles) is a **different specification for a different purpose** (sealing and vacuum formation in a heat-processed jar). It has nothing to do with fermentation vessel headspace. **The two are routinely confused in secondary sources.**
- **NOT found:** no source expresses fermentation headspace as a **percent of vessel volume**. Converting the linear figures requires the vessel's internal depth, which the guidance does not specify. **[CALC] illustration:** on a 24 cm-deep 5 L crock, USDA's 10–13 cm is **~42–54% of depth**; Penn State's 7.5–10 cm is **~31–42%**. These are my conversions, not published figures.

**One measured headspace figure from a classic primary study:**

**One measured headspace figure from a classic primary study:**
- In Preuss, Peterson & Fred's 58-gallon (219.8 L) experimental sauerkraut barrel, after the cabbage, cloth, wooden cover and weighting stones were in place, **"there still remained about 10 inches (25.4 cm) space in the barrel"** — i.e. a headspace of roughly 25 cm, which on a 58-gal barrel is on the order of 10–15% of vessel volume. **[CALC]** for the percentage: I do not know the barrel's exact internal height, so I give the linear figure as measured and mark the percentage as approximate.
- **Source:** Preuss, L.M., Peterson, W.H. & Fred, E.B. (1928). "Gas Production in the Making of Sauerkraut." *Industrial & Engineering Chemistry* **20**(11): 1187–1190. Departments of Agricultural Chemistry and Agricultural Bacteriology, University of Wisconsin, Madison. DOI: 10.1021/ie50227a021
- **URL (full text):** https://datapdf.com/gas-production-in-the-making-of-sauerkraut192c7bc2810c0b7a596dee83c9665ce9197121.html
- **Confidence:** STRONG that this is what the paper says; WEAK as a "recommendation" — it is an incidental description of an experimental apparatus, not guidance.

**Two authoritative practices that imply a headspace policy:**
- Commercial sauerkraut tanks: *"The tank is covered with plastic sheeting upon which water is placed, providing a weighted, air-tight seal against the tank wall."* → the headspace is **eliminated as a gas reservoir**, not specified as a volume.
  - **Source:** Andersson, Daeschel & Eriksson 1988, p210 (URL above). **Confidence:** STRONG (direct quote).
- Commercial cucumber tanks: *"Cucumber pickles have traditionally been fermented in open-top wooden vessels ranging in size from approximately 8,000 to 32,000 liters. Tanks are typically left outside unsheltered from the environment. The sunlight (UV radiation) striking the surface of the brine prevents the growth of oxidative spoilage microorganisms."*
  - **Source:** Andersson, Daeschel & Eriksson 1988, p210 (URL above). **Confidence:** STRONG for the vessel-size range (this is also Q5a data).
  - **Note:** this is the industrial analogue of "leave the crock open" — and the stated control is **UV at the brine surface**, not headspace minimisation.

### 4b.2 — Is there experimental evidence that a LARGE headspace slows acidification?

**I found no study that varied headspace volume as an independent variable and measured pH/time in a vegetable fermentation.** That is a genuine NO-DATA result.

What exists instead, and what it shows:

**(i) The headspace is a large oxygen reservoir that dwarfs wall permeation — [CALC].** For a 20 L HDPE bucket with a 2 L headspace: the headspace contains 2 L × 20.9% = 418 cm³ O₂ ≈ **597 mg O₂**. The measured/modeled ingress through a 2 mm HDPE wall plus lid is ≈ **2.7 mg O₂/day** (range 2–7). So **the headspace holds roughly 220 days' worth of wall ingress.** Even a brim-full bucket of air-saturated brine (≈8.3 mg O₂/L × 20 L = 166 mg) holds ~61 days' worth. **The headspace, not the wall, is the oxygen reservoir.** Full working and sourcing in `fermentation-vessel-materials-report.md` §1 and §5.
- **Confidence:** MODERATE — the OTR inputs are well-sourced (Robertson, *Food Packaging* 3e), but the bucket geometry and the 2 mm wall thickness are my assumptions, and no study has measured this for a real bucket.

**(ii) The mechanism by which headspace oxygen does harm is spoilage, not rate.** Direct evidence:
- Yu et al. 2023 (kimchi, above): oxygen ingress → yeast/mould and coliform growth, and eventual pH **rise**; LAB numbers and the day-10 pH unchanged. **This is the closest thing to a headspace-oxygen experiment with pH/time data, and it says the headspace affects spoilage, not the acidification rate.**
- Potts & Fleming 1979 (above): the DO that suppresses LAB and grows film yeasts comes from **purging gas**, i.e. deliberate gas exchange with the brine — a far higher oxygen flux than passive headspace diffusion.

**(iii) The counter-consideration — CO₂ headspace is genuinely needed, and here are the numbers.**

The single best quantitative dataset on CO₂ in a real sauerkraut fermentation:

- **Source:** Preuss, Peterson & Fred (1928), University of Wisconsin. URL above.
- **Confidence:** STRONG for the CO₂ volumes and composition (4 independent barrel experiments, gas metered and analysed on a Burrell apparatus). WEAK-to-MODERATE for modern generalisation: 1928 methodology, 136 kg cabbage per run, n = 1 per temperature condition, no replication.
- **Design:** 58-gal (219.8 L) paraffin-lined metal barrel, **300 lb (136 kg)** shredded cabbage with **~2.5% NaCl**, packed with a wooden stamper, weighted with stones.

**CO₂ production volumes:**

| Exp. | Cabbage temp. | Total gas evolved | Time to cessation | Final acidity (as lactic) | Gas composition at end |
|---|---|---|---|---|---|
| I | cold, 6.1 °C on removal | **212.3 L** | 260 h | **0.26%** | 98% CO₂, 0.3% O₂ |
| II | 20 °C | **328.9 L** | 423 h | **1.90%** (24 days) | ~98.5% CO₂, 0.3% O₂ |
| III | 25–28 °C | **301.4 L** | 305 h | **2.24%** (23 days) | 98.8% CO₂, 0.2% O₂ |
| IV | 25–28 °C | **414.7 L** | 141 h | **2.1%** (11 days) | ~100% CO₂ |

**[CALC]** on 136 kg cabbage: Experiment II produced 328.9 L / 136 kg ≈ **2.4 L CO₂ per kg cabbage**; Experiment I (cold) only 212.3 L / 136 kg ≈ **1.6 L/kg**; Experiment IV ≈ **3.0 L/kg**.

**Headspace displacement time — the key finding for 4(b):**
> *"All the residual air in the barrel had been displaced at the end of the second day, as is shown by the fact that the gas sample (1740 cc.) consisted of almost 100 per cent carbon dioxide."*
- So in a 58-gal barrel of actively fermenting cabbage at 25–28 °C, the **headspace was essentially pure CO₂ within ~48 hours.**
- Summary point 1 of the paper: *"The gas evolved during the formation of sauerkraut is almost 100 per cent carbon dioxide."*
- Summary point 2: *"Most of the gas formed is given off within 40 to 160 hours after the cabbage is packed into the container."*
- **Confidence:** STRONG. **This is the quantitative basis for the claim that a CO₂ blanket establishes itself quickly, and it is why the headspace volume matters far less than the headspace *oxygen* does — the oxygen is displaced within ~2 days, and after that the headspace composition is a CO₂ blanket.**

**Why commercial cucumber fermentation PURGES CO₂ while sauerkraut RELIES on a CO₂ blanket — the numbers:**
- In cucumbers, CO₂ is the *bloater* agent: it accumulates in the fruit tissue and, when the internal pressure exceeds the tissue's tolerance, causes irreversible hollow cavities. Commercial tanks therefore **strip CO₂ out** by N₂ or air purging.
  - **Source:** Zhai, Pérez-Díaz & Díaz (2018), *Trends Food Sci Technol* 81:185–192, URL above. **Confidence:** STRONG (review by the ARS group that generated much of the primary work).
  - **Purging parameters and dose–response — measured:**
    - **Fleming, H.P., Etchells, J.L., Thompson, R.L. & Bell, T.A. (1975).** "Purging of CO₂ from cucumber brines to reduce bloater damage." *Journal of Food Science* **40**(6): 1304–1310. ARS PDF: https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p125.pdf
      - **N₂ flow rates of 5, 25 and 100 mL/min continuous** (or **425 mL/min for 2 h/day** at pail scale) reduced brine CO₂ and cut bloater damage from **84% (unpurged) to 8%**.
      - **Target brine CO₂: below 20 mg/100 mL.** **Critical bloater threshold: 25–50% of saturation, i.e. as low as 25 mg/100 mL.** CO₂ production runs about **25 mg/100 mL/day**. **Unpurged brines reach 84–120 mg/100 mL.**
      - **Confidence:** STRONG (primary dose–response experiment). **Study quality:** replicated laboratory tank trials by the ARS group that defined the process. **Caveat:** the 1975 and 1988 ARS papers are image-only scans with no text layer, read visually via OCR — a load-bearing digit is worth spot-checking against the original PDF.
    - **Humphries, E.G. & Fleming, H.P. (1988).** "Anaerobic tanks for cucumber fermentation and storage." *Applied Engineering in Agriculture* **4**(2): 166–171. (Note: the ARS bibliography also lists Humphries & Fleming 1989, *J. Agric. Eng. Res.* **44**: 133–140 — two closely related papers.)
      - **Commercial tank scale: 1.133 m³/h (40 SCFH) N₂.**
      - **Exhaust-gas headspace CO₂ only 1–3% by volume** — i.e. under proper N₂ purging the headspace is nearly all N₂, not CO₂. **This is the direct contrast with sauerkraut, where the headspace is ~99% CO₂.**
      - **Under-purging (1/20 of the correct rate) let CO₂ reach 71 mg/100 mL and caused heavy bloating.** → **A 3.5× overshoot of the 20 mg/100 mL target produced heavy defect.**
      - **Confidence:** STRONG for the flow rate and the 1–3% headspace figure; MODERATE for the 71 mg/100 mL under-purge value (I have this from a secondary reading of the paper and could not independently verify the full text).
    - **From p204 (Fleming et al. 1988, ARS, OCR'd for this report):** experimental anaerobic tanks used a **buffered cover brine at pH 4.6 ± 0.1** (0.053 M acetic acid + 0.018 M calcium hydroxide), NaCl at **2.7% or 4.6%**, *L. plantarum* starter, and **N₂ purging at 15 SCFH (424 L/h)**. The paper notes the industry *"is testing experimental closed tanks with a nitrogen-blanketed headspace to maintain anaerobiosis."* **Confidence:** STRONG (direct from the primary text).
    - Recommended purge rate for commercial tanks generally: **20–50 scfh for 5,000–10,000 gal** (Potts & Fleming 1979).
  - CO₂ solubility chemistry: *"Two species, H₂CO₃ and HCO₃⁻, exist to 50% each at an equilibrated pH of 6.35 (25 °C)… More of the HCO₃⁻ species exists at pH 3.6 or lower. Thus, adjustment of the initial fermentation pH well below 6.35 should shift the equilibration of the chemical species of CO₂ towards the gaseous form, which is more readily removed from cover brines by air or N₂ purging."* and *"Acidification of the fermentation system to a pH around or less than 4.6 can help with the surfacing of CO₂."* **Confidence:** STRONG (textbook inorganic chemistry, correctly applied).
  - CO₂ production in commercial cucumber fermentation: brine with 100 mM CaCl₂ + 6 mM potassium sorbate supported **higher CO₂ production within the first 3 days and more bloaters** than 6% NaCl brine, in open-top air-purged tanks (Zhai et al. 2018, Fig. 6).
- In sauerkraut, by contrast, CO₂ is *protective*: it is the blanket that excludes oxygen. Hence *"Dilution of salt and acid could result in spoilage. Also, dislodgement of the sheeting could cause entry of air, which can lead to various chemical and microbiological spoilage problems."*
  - **Source:** Fleming, H.P. (1987). "Considerations for the controlled fermentation and storage of sauerkraut." In: *1987 Sauerkraut Seminar*, N.Y. State Agricultural Experiment Station, Special Report No. 61: 26–32. USDA-ARS.
  - **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf
  - **Confidence:** STRONG (direct quote, ARS author). **Study quality:** extension/seminar paper by the leading ARS sauerkraut researcher, synthesising his own primary work — authoritative, not primary.
  - The same document notes the *"heaving"* problem: during the initial gaseous stage, expanding CO₂ entrapped in the kraut bed can breach the anaerobic seal. From p210: *"This can lead to deterioration of the sauerkraut if the expanding kraut causes a breach in the anaerobic seal."* **Confidence:** STRONG.
  - p201 adds the quantitative note that purging could **not** fully solve heaving in commercial tanks: *"It is doubtful that CO₂ can be removed from commercial tanks by purging to prevent the heaving problem with present tanking procedures. The cabbage is so tightly packed that brine circulation may be too restricted for sufficient rate of CO₂ removal by nitrogen purging."* **Confidence:** STRONG (direct quote).

### 4b.3 — Measured headspace gas time-series

- **The Preuss 1928 dataset above IS the measured time-series** for sauerkraut: gas composition tracked over 0→260 h and 0→423 h, showing O₂ falling from an air-like start to **0.2–0.3%** while CO₂ rose to **98–99.6%**, with the crossover effectively complete by ~40–80 h.
- **Kimchi — the dataset I had earlier flagged as missing has now been located:**
  - **Source:** Kang, J.H., Lee, J.H. & Min, S.G. (2003). "Changes of Volatile Compounds, Lactic Acid Bacteria, pH, and Headspace Gases in Kimchi, a Traditional Korean Fermented Vegetable Product." *Journal of Food Science* **68**(3). DOI: 10.1111/j.1365-2621.2003.tb08254.x · https://ift.onlinelibrary.wiley.com/doi/10.1111/j.1365-2621.2003.tb08254.x
  - **Numbers:** kimchi in a glass jar at **5 °C**, followed from **day 2 to day 27**: **pH fell 4.3 → 3.8**; headspace **O₂ fell from 14.3% to 1.3%**; headspace **CO₂ rose from 27.7% to 45.3%**.
  - **Confidence:** MODERATE. The publisher is Cloudflare-blocked and the paper is not in PMC, so these figures come from a secondary reading of the full text by a parallel research stream, not from my own verification. **They are internally coherent and directionally consistent with the Preuss 1928 sauerkraut curve, but the digit-level values should be spot-checked against the original before being relied on.**
  - **Why it matters:** it is the **kimchi counterpart to Preuss 1928** and shows the same pattern — **oxygen driven to near-zero (1.3%) while CO₂ accumulates (45.3%)** — but note the kimchi headspace **never reaches the ~99% CO₂ of the sauerkraut barrel** and still holds **1.3% O₂ at day 27.** At 5 °C the fermentation is slow enough that oxygen depletion is far less complete than in a warm, vigorously fermenting 136 kg kraut barrel. **[CALC] interpretation:** a useful caution against assuming a sauerkraut-like CO₂ blanket in a cold, slow, small kimchi ferment.
  - **Four separate headspace gas time-series now exist**, catalogued in `headspace_vessel_report.md`: (a) sauerkraut barrel, Preuss et al. 1928 (O₂ 19.5% → 0.3%, CO₂ → 98.6% over 45–260 h); (b) kimchi glass jar at 5 °C, Kang et al. 2003 (above); (c) onggi vs hermetic glass CO₂ time course, Kim & Hu 2023; (d) cucumber tank exhaust gas, 1–3% CO₂, Humphries & Fleming 1988.

### 4b.4 — Summary answer for 4(b)

- **Recommended headspace:** USDA, Oregon State, NC State and Clemson all say the vessel rim should be **4–5 inches (10–13 cm) above the cabbage**; **Penn State says 3–4 inches (7.5–10 cm)**; **Cornell, Utah State and Wisconsin give no headspace figure at all.** **No source anywhere expresses headspace as a percent of vessel volume** — every official figure is a linear depth, so **any "% headspace" number circulating in the home-fermentation world is not traceable to USDA or extension sources.**
- **Does a large headspace slow acidification?** **No experimental evidence found** — no experiment anywhere manipulates headspace *volume* and measures pH over time in sauerkraut, kimchi or cucumbers. **The central premise of all this headspace advice is untested.** Likewise there is no quantified headspace→mould dose–response.
- **The counter-consideration is real and quantified:** a CO₂ headspace is *wanted*. In a 136 kg sauerkraut barrel the headspace was ~100% CO₂ within **~48 h**, and total CO₂ production was **2.4–3.0 L per kg cabbage** at 20–28 °C. The correct goal is therefore not "minimum headspace" but "**minimum oxygen, CO₂-filled headspace**" — which is exactly what a water seal, an airlock, or a weighted plastic sheet achieves.

---

## 4(c) Kahm yeast — organisms, conditions, thresholds, safety, and correlation with acidification

**Important framing correction:** the term **"kahm yeast" has no peer-reviewed literature.** A Europe PMC title search for `TITLE:"kahm"` returns **0 hits**. It is a home-fermentation and English-language craft term, not a taxon. The underlying science is published under **"white colony-forming yeast" (WCFY)**, **"pellicle"**, and **"film-forming yeast"**. Any quantitative claim about "kahm yeast" must be mapped onto those literatures — and the mapping is not perfect.

**A second correction:** in some vegetable fermentations the surface film is **not yeast at all**. In Sichuan pickle the pellicle-formers isolated were *Bacillus amyloliquefaciens*, *B. subtilis*, *Citrobacter freundii* and *Lactiplantibacillus plantarum* (Rao et al. 2018, DOI 10.1016/j.ijfs.13652 — published as *Int. J. Food Sci. Technol.*, DOI 10.1111/ijfs.13652).

### 4c.1 — Organisms actually isolated from sauerkraut

- **Source:** Satora, P., Skotniczny, M., Strnad, S. & Ženišová, K. (2020). "Yeast Microbiota during Sauerkraut Fermentation and Its Characteristics." *International Journal of Molecular Sciences* **21**(24): 9699. Department of Fermentation Technology and Technical Microbiology, University of Agriculture in Kraków, and Slovak University of Technology.
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC7767181/ · DOI: 10.3390/ijms21249699 (open access)
- **Confidence:** STRONG for species identity (246 isolates, RAPD-PCR + 5.8S-ITS rRNA sequencing, GenBank accessions MK312605–MK312621, 8 cabbage cultivars). MODERATE for generality — one country, one season, 8 cultivars.
- **Species isolated (9 species, 17 strains):** *Debaryomyces hansenii* (4 strains — **dominant**), *Clavispora lusitaniae* (4), *Rhodotorula mucilaginosa* (3), *Cryptococcus macerans*, *Nakazawaea holstii*, *Meyerozyma guilliermondii*, *Candida sake*, *Pichia fermentans*, *Tausonia pullulans*.
- **Population kinetics — the numbers that matter:**
  - Fresh cabbage carried **0.60 (cv. Cabton) to 3.74 (cv. Manama) log CFU/g** of yeast.
  - Yeast **peaked at 1.82 to 4.46 log CFU/g after 24 h**, then declined in all samples.
  - **By day 3–7, yeasts were undetectable** in most cultivars: *"During sampling in 7th day of fermentation no yeast was found."*
  - **Interpretation:** in a normal, healthy sauerkraut fermentation the yeast population **self-terminates** as pH falls and LAB dominate. Kahm is therefore a **failure of the normal succession**, not a normal stage.
- **Note the mismatch with the popular organism list:** *Candida krusei* is now ***Pichia kudriavzevii*** (same species, older name) and *P. kudriavzevii* is well attested in kimchi WCFY. *Kazachstania servazzii / exigua / barnettii / pseudohumilis* are also well attested and are **absent from the popular lists**. Conversely I found **NO DATA** for *Candida lambica* or *Pichia anomala* in sauerkraut or kimchi.

### 4c.2 — Salt tolerance — the popular advice is UNSUPPORTED

This is one of the most important corrections in this report.

- **Source:** Satora et al. 2020 (above).
- **Finding:** *"Most of the tested isolates can be classified as halophiles, because they grew very well even in an environment containing 10% sodium chloride."* Only four strains (*N. holstii* II, *C. lusitaniae* X, *P. fermentans* XIV, *D. hansenii* XVI) were "visibly inhibited on media with 6% NaCl and more."
- Abstract statement: *"All isolates could grow at NaCl concentrations higher than 5%."*
- **Confidence:** STRONG (direct growth assay, Table 2 of the paper, 17 strains × 5 salt levels).
- **Corroborated independently:** Kim, M.-J. et al. (2021), *Foods* **10**(3): 645, https://pmc.ncbi.nlm.nih.gov/articles/PMC8003234/ — tested 10/15/20% NaCl against 5 WCFY strains from kimchi: **at 20% NaCl, all five strains survived.** The authors state that high-salt brining *"did not have a significant effect on inhibiting white colony formation."*
- **And again:** Xian et al. (2022), *Food Research International*, DOI 10.1016/j.foodres.2022.111130 — **7% (w/v) salt did NOT inhibit pellicle formation** in paocai, whereas **1.5% v/v Baijiu did.**
- **CONCLUSION — three independent studies agree:** *"Add more salt to prevent kahm"* is **not supported by any experimental evidence I could find.** At typical sauerkraut salt levels (2–2.5%) the salt is essentially irrelevant to kahm suppression.
  - **Confidence:** STRONG (three independent studies, consistent direction).

### 4c.3 — pH tolerance

- **Source:** Satora et al. 2020 (above), Table 2. Growth scored on media at **pH 3.6, 3.4 and 3.2**.
- **Finding:** the great majority of the 17 sauerkraut strains **grew at pH 3.6**; growth was generally inhibited at **pH 3.4 and 3.2**. The paper characterises the isolates as *"relatively resistant to low pH and the presence of lactic acid."* They also grew in **6 and 8 g/L lactic acid**, with most inhibited at **10 g/L**.
- **Confidence:** MODERATE. The pH tolerance was tested on **HCl-acidified YPD**, not in brine with lactic/acetic acid at fermentation concentrations — so it likely **overstates** acid tolerance relative to a real ferment. Table 2's cell-level values were also partly degraded by OCR; I report only the robust pattern (growth at 3.6, inhibition at 3.4–3.2) and not cell-by-cell scores.
- **Independent corroboration:** Kim, M.-J. et al. (2021), *Foods* 10(3):645 (URL above) — **all 5 WCFY strains grew well at pH 3, 4 and 5.** Same caveat (HCl-acidified YPD).
- **NO DATA:** the widely repeated figure *"kahm yeast grows at pH 2.5–8.0, optimum pH 4.0–4.5"* is **untraceable to any primary measurement.** It appears to be folk knowledge circulating in home-fermentation sources. **Do not cite it.**

### 4c.4 — Temperature

- **Source:** Kim, M.-J. et al. (2021), *Foods* 10(3):645, https://pmc.ncbi.nlm.nih.gov/articles/PMC8003234/
- **Finding:** all 5 WCFY strains grew at **4, 10 and 20 °C**; only *Kazachstania servazzii*, *Candida sake* and *Debaryomyces hansenii* grew at **0 °C**.
- **Confidence:** MODERATE (single study, 5 strains).
- **Implication:** refrigeration does **not** prevent kahm; it only slows it. This is consistent with Yu et al. 2023, where kimchi held at **4–5 °C for 90 days** still developed white colonies in the oxygen-permeable package.

### 4c.5 — OXYGEN — the one variable that does control it (with a caveat)

- **The strongest dose–response evidence:** Rao, Y. et al. (2019), *RSC Advances*, DOI 10.1039/C9RA05994F — in Sichuan pickle, **continuous oxygen → pellicle and deterioration by day 32; intermittent oxygen → day 48; no oxygen → no pellicle in 64 days.**
  - **Confidence:** MODERATE–STRONG (clear three-arm dose–response with time-to-event endpoints; single study, one product).
- **Corroboration:** Yu et al. 2023 (kimchi, URL above) — yeast/mould counts were **not detectable** at days 10–20 in sealed and valve-only packages but reached **5.21 log CFU/g by day 10** in the oxygen-permeable package.
- **IMPORTANT CAVEAT that contradicts the textbook claim:** Kim, M.-J. et al. (2021), *Foods* 10(3):645 — WCFY **colonies formed anaerobically** at 4, 10 and 20 °C. The common statement that these are **obligate aerobes** is **contradicted**. They are at minimum facultative, and their *filming* behaviour at the air–liquid interface is oxygen-favoured, but their *growth* is not oxygen-dependent.
  - **Confidence:** MODERATE (single study) but it is a direct experimental contradiction of a widely repeated claim, and it is worth taking seriously.

### 4c.6 — Safety vs cosmetic — this one has a real answer

- **Formal safety assessment exists.** Jeong et al. (2022), *Food Microbiology* **106**: 104057, DOI 10.1016/j.fm.2022.104057 — WCFY from kimchi showed **no cytotoxicity in Caco-2 or HepG2 cells up to 2.5 × 10⁵ CFU/mL**, **no toxicity in rats up to 5 × 10⁸ CFU/head/day**, and carried **no toxin genes and no antibiotic-resistance genes.** The authors conclude this *"provides evidence for the safety of accidental major WCFY ingestion via kimchi."*
  - **Confidence:** STRONG for "the organisms themselves are not a toxicological hazard." **Study quality:** in vitro + in vivo animal toxicology with dose–response; about as good as this question gets.
- **BUT the acid-consumption consequence is real.** Franco, W. & Pérez-Díaz, I.M. (2012), *Food Microbiology*, DOI 10.1016/j.fm.2012.07.013 — *Issatchenkia occidentalis* and *Pichia manshurica* **utilise lactic and acetic acid aerobically**, raising brine pH. Rao et al. 2018 (Sichuan pickle) measured the consequence: pellicle growth → lactic acid decrease → **pH 4.8–5.0**, which *"initiated growth of more undesirable organisms."*
  - **Confidence:** STRONG for the mechanism; MODERATE for the specific pH values (single product study).
- **So the accurate statement is:** kahm organisms are **not themselves pathogenic and not toxigenic**, but their **metabolic activity can raise pH**, and pH is the safety barrier. **The safety concern is downstream of the pH change, not the organism.**
- **Counter-evidence worth noting:** Kim et al. (2020), *Food Research International* **136**: 109315, DOI 10.1016/j.foodres.2020.109315 — found that **non-volatile metabolites did not differ significantly between open and closed packaging** despite different WCFY communities. So the pH-rise consequence is not universal.
  - **Confidence:** MODERATE (single study); it is a genuine counterweight and should be cited alongside the pH-rise studies.

### 4c.7 — Does kahm correlate with slower or arrested acidification?

- **Indirect, consistent evidence that it follows rather than causes slow acidification:** Satora et al. 2020 shows yeasts peak at 24 h and are gone by day 3–7 in normal sauerkraut. A persistent film therefore indicates the normal LAB succession did not establish — the film is a **marker** of a stalled fermentation at least as much as a **cause** of one.
  - **Confidence:** WEAK-OR-CONTESTED. This is my inference from population kinetics, not a study that measured pH/time in kahm-positive vs kahm-negative fermentations side by side.
- **The causal direction that IS documented is the reverse: kahm raises pH.** Yu et al. 2023 measured pH **rising** from 4.22 to 4.39 (+0.17) in the oxygen-exposed arm. Rao et al. 2018 measured pH 4.8–5.0 after pellicle growth.
  - **Confidence:** STRONG for "kahm can raise pH"; the correlation with *pre-existing* slow acidification is unproven.
- **NO DATA:** I found **no study** that prospectively measured pH/time in kahm-contaminated vs clean fermentations from a common start. **This specific experiment does not appear to have been done.**

### 4c.8 — Practical discard-vs-keep guidance (verbatim quotes)

- **UC Davis (2022), DiCaprio, Marco, Finnegan & Hanlon**, *Troubleshooting fermented fruits and vegetables*: https://ucfoodsafety.ucdavis.edu/sites/g/files/dgvnsk7366/files/media/documents/Troubleshooting%20fermented%20fruits%20and%20vegetables%20FINAL.pdf
  - On kahm: filed under the heading **"Normal: Yeast"** — *"For other ferments, such as sauerkraut, yeast should be periodically removed during fermentation. Excessive yeast growth can lead to off flavors or textures and reduce acidity. **The pH can be checked periodically to ensure it does not rise above 4.6.**"*
  - On mould: *"Molds require oxygen to grow… **If you confirm mold growth on any part of a ferment, it should be immediately discarded.**"*
  - **Confidence:** STRONG as an authoritative extension position. **This is the single most useful document I found on the kahm-vs-mould distinction: the deciding variable is pH 4.6.**
- **USDA / NCHFP** (Complete Guide to Home Canning, AIB-539, via National Center for Home Food Preservation): https://nchfp.uga.edu/how/ferment/recipes/sauerkraut — *"check the kraut 2 to 3 times each week and remove scum if it forms."* On pickles, the cause of scum is given as *"Wild yeasts and bacteria that feed on the acid thus reducing the concentration"* and the prevention is *"Remove scum as often as needed."*
  - **Confidence:** STRONG (authoritative federal guidance).
- **Oregon State University Extension, PNW 355**: *"promptly remove surface scum or mold."*
- **Reconciliation — the criteria that are consistent across every source:** surface-only vs penetrated; texture intact vs soft/slimy; smell; colour (green/blue/brown/black indicates mould). **Surface yeast film → remove and monitor pH. Confirmed mould, or soft/slimy/discoloured product → discard.**

---

## 4(d) Open crock vs airlocked jar vs plastic bag/weight vs vacuum — side-by-side pH/time data

### 4d.0 — THE ONE TRUE VESSEL SIDE-BY-SIDE: glass jar vs stoneware, with pH/time

**This is the study the brief was asking for, and it directly contradicts the usual craft assumption that stoneware crocks make better ferments.**

- **Source:** Satora, P. & Strnad, S. (2024). "The Influence of Fermentation Vessels on Yeast Microbiota and Main Parameters of Sauerkraut." *Applied Sciences* **14**(1): 236. University of Agriculture in Kraków, Poland.
- **URL:** https://www.mdpi.com/2076-3417/14/1/236 · DOI: 10.3390/app14010236 (open access)
- **Confidence:** **MODERATE–STRONG.** Verified independently via Unpaywall and the Semantic Scholar API: the paper exists, is open access, and the abstract confirms the headline results verbatim (quoted below). **However, MDPI and DOAJ are both blocked from my environment, so I could not read the full text or verify the pH table myself.** The abstract-level findings are STRONG; the day-by-day pH trajectory is MODERATE (single source, and I am relying on a reading of the full text I could not reproduce).
- **Study quality:** genuine side-by-side, **n = 3**, **20 °C**, **14 days**, **2.5% NaCl**. Glass jars used **airlock lids** (small headspace, rapid anaerobiosis); stoneware vessels used **LDPE foil + pressure stones**. Yeast enumerated on WL nutrient agar + chloramphenicol + 10% NaCl; isolates identified by RAPD-PCR + 5.8S-ITS sequencing and PCR-RFLP; organic acids by UHPLC. **Small n and a single temperature are the main limitations.**

**Abstract, verbatim (independently verified):**
> *"Sauerkraut obtained in stoneware vessels was characterized by the presence of a larger amount of yeast, including those considered spoilage, such as Rhodotorula and Wickerhamomyces. It also contained **50% less lactic acid** and a few times more acetic acids than that obtained using glass jars. A pH around 3.8 and 1.5% lactic acid, which are parameters indicating the end of fermentation of sauerkraut, were obtained in **glass jars on the tenth day of fermentation**. The yeast **Wickerhamomyces anomalus may be an indicator of the presence of oxygen** during sauerkraut fermentation, while **Clavispora lusitaniae may indicate anaerobic conditions**."*

**pH trajectory (day 0, 1, 2, 3, 4, 7, 10, 14):**

| Vessel | d0 | d1 | d2 | d3 | d4 | d7 | d10 | d14 |
|---|---|---|---|---|---|---|---|---|
| **Glass jar (airlock)** | 6.04 | 5.78 | 5.73 | **4.64** | **4.10** | **3.82** | **3.81** | **3.73** |
| **Stoneware (foil + stones)** | 6.04 | 5.70 | 5.57 | **5.13** | **4.53** | **4.06** | **3.91** | **3.86** |

- Reported statistics: glass SEM 0.17, p < 0.001; stoneware SEM 0.19. **Confidence:** MODERATE (see caveat above).
- **Lactic acid (g/L):** day 7 **glass 12.42 vs stoneware 6.95 (1.8×)**; day 10 **glass 15.78 vs stoneware 11.65.** The abstract's "50% less lactic acid" in stoneware is consistent with the day-7 figure.
- **Stoneware also accumulated ~2.3× more acetic acid** and more spoilage yeasts.

**Why this matters — it is the cleanest available answer to 4(d):**
- **The vessel that established anaerobiosis FASTER acidified FASTER, by a wide margin.** Glass with an airlock reached the end-of-fermentation marker (**pH 3.8, 1.5% lactic acid**) on **day 10**; stoneware had only reached **pH 3.86 by day 14** and was still ~1.8× behind on lactic acid at day 7.
- **[CALC]:** the pH gap between vessels was widest at **day 3 (4.64 vs 5.13 = 0.49 pH units)** and narrowed thereafter — i.e. **the vessel effect is concentrated in the first ~4 days**, exactly when oxygen is still present and the CO₂ blanket has not yet formed. This is consistent with the Preuss 1928 finding that a CO₂ headspace takes ~48 h to establish: **a vessel that excludes oxygen from the start wins the early race.**
- **It identifies an oxygen-indicator yeast:** *Wickerhamomyces anomalus* was associated with the more aerobic stoneware ferment, *Clavispora lusitaniae* with the anaerobic glass ferment. **This is a potentially useful diagnostic** (and it corroborates the general finding that oxygen selects the yeast community).
- **The caveat that keeps this honest:** the vessels differ in **more than one way** — glass + airlock vs stoneware + LDPE foil + stones. **The comparison confounds material (glass vs ceramic) with closure (airlock vs foil-and-stones).** Given that the ARS onggi work (see 5g) shows **porous, unglazed ceramic** behaves differently from non-porous materials via CO₂ venting, and given that the closure is the dominant oxygen path (5g.2), **the most likely explanation of this result is the CLOSURE, not the material.** The study cannot separate them.

### 4d.1 — The other clean side-by-side with pH/time data

**Yu et al. 2023** (kimchi packaging; full data table reproduced in §4a.4) is the closest available head-to-head of **sealed vs gas-out-only vs gas-in-and-out**, with pH and titratable acidity at 0/10/20/30/60/90 days, plus LAB, yeast/mould and coliform counts, plus 16S community and GC-MS metabolomics.
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC10439095/
- **Confidence:** STRONG (n = 3, statistics, multiple independent measurements).
- **What it establishes:** the **gas-out-only** configuration (a one-way valve — functionally an airlock) performed as well as fully sealed on every quality measure, and **better than** the gas-in configuration. Sensory: *"S3 had the lowest odor, taste, and overall scores, whereas S2 had the highest."* **This is direct experimental support for the airlock/one-way-valve principle.**

### 4d.2 — Water seal (Harsch-type) — the principle is in the ARS literature, the branded claim is not tested

- **The principle is documented and endorsed at commercial scale:** *"The tank is covered with plastic sheeting upon which water is placed, providing a weighted, air-tight seal against the tank wall."* (Andersson, Daeschel & Eriksson 1988, p210, URL above.) **Confidence:** STRONG (direct quote, ARS/NCSS author).
- **The sauerkraut "heaving" caveat applies to any sealed system:** *"During the initial stage, the gaseous CO₂ due to expansion or 'heaving' is prone to [be] entrapped within the sauerkraut. This can lead to deterioration of the sauerkraut if the expanding kraut causes a breach in the anaerobic seal."* (p210.) **Confidence:** STRONG.
  - A water seal is specifically a defence against this: excess gas bubbles out and the seal re-closes. That is a mechanistic argument in its favour — but it is a mechanism, not a measurement.
- **NO DATA — stated plainly:** I found **no independent experimental test of a Harsch crock or any branded water-seal vessel** against a plain jar with pH/time or microbial endpoints. The manufacturer's claims (no mould, no skimming, anaerobic environment) are **mechanistically plausible and consistent with the ARS water-seal description, but empirically unverified in the peer-reviewed literature as far as I can determine.**

### 4d.3 — Commercial "closed-top anaerobic tank" development — the best-documented vessel comparison

- Fleming, H.P., McFeeters, R.F., Daeschel, M.A., Humphries, E.G. & Thompson, R.L. (1988). "Fermentation of cucumbers in anaerobic tanks." *Journal of Food Science* **53**(1): 127–133.
  - **URL (AGRIS record with abstract):** https://agris.fao.org/search/en/records/65df33154c5aef494fe0bdc0 · DOI: 10.1111/j.1365-2621.1988.tb10192.x
  - **ARSc PDF:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p204.pdf
  - **Design/parameters:** experimental **anaerobic tanks**; cucumbers washed; **buffered cover brine of 0.045 M calcium acetate**, NaCl to equilibrate at **2.7% or 4.6%**; *Lactobacillus plantarum* starter; **N₂ purging to remove dissolved CO₂**.
  - **Result:** *"The fermentations were predominantly homofermentative, lactic acid accounting for 95% of the cucumber sugars fermented. Firmness retention of the fermented cucumbers during storage for 1 year was improved by heating packaged products to 69 °C before storage, but firmness retention was acceptable in unheated products."*
  - **Confidence:** STRONG for the parameters and the homofermentative outcome; **the abstract does not report a pH/time comparison against open tanks, so I cannot quote a rate difference from this source.**
  - **Study quality:** replicated experimental tank trials, pilot scale, USDA-ARS. High quality. Limitation for our purpose: the outcome variables reported are fermentation end-products and texture, not acidification rate vs an open control.
- **Related engineering paper (not retrieved in full):** Humphries, E.G. & Fleming, H.P. (1989). "Anaerobic tanks for cucumber fermentation and storage." *Journal of Agricultural Engineering Research* **44**: 133–140. https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p216.pdf — **Confidence:** NO DATA (citation verified, contents not retrieved).

### 4d.4 — Vacuum / vacuum-packed vegetable fermentation

- **NO DATA.** I found no quantitative study (pH/time or microbial) of vacuum-sealed vegetable fermentation with a non-vacuum control. The Noma-style vacuum fermentation technique is not, as far as I can find, characterised in the peer-reviewed literature with controlled comparisons. **I am stating this as a genuine gap rather than implying it works or does not.**

### 4d.5 — Answer for 4(d)

- **One good side-by-side exists** (Yu et al. 2023, kimchi packaging) and it supports gas-out-only / one-way-valve configurations over oxygen-permeable ones, with **no LAB rate difference** and a **clear spoilage and pH-reversal difference**.
- **The water-seal principle is endorsed in ARS commercial practice** but **no independent test of a branded water-seal crock exists** that I could find.
- **No vacuum-fermentation data found.**
- **No study compares open crock vs airlocked jar vs bag-and-weight in a single controlled pH/time experiment.** This is the most conspicuous gap in the whole Q4 brief.

---

## 4(e) Stirring / daily pressing / punching down — does it measurably speed fermentation?

**Honest answer: I found NO study that tests this.** Not a weak study — none.

What I searched: sauerkraut + punching down / tamping / pressing / daily; cucumber brine circulation; brine agitation; CO₂ release and fermentation rate. I found brine-circulation work in *commercial cucumber tanks*, which is a different intervention at a different scale, but nothing on the home/artisan practice.

**The nearest relevant evidence, and what it actually says:**

1. **Pressing shredded vegetables is recommended to REMOVE OXYGEN, not to speed fermentation.** *"Regarding shredded and sliced vegetables, oxygen can be removed by carefully pressing the vegetables in the fermentation vessel."* (Andersson, Daeschel & Eriksson 1988, p210, URL above.) **Confidence:** STRONG (direct quote). **This is an oxygen-exclusion rationale, not a rate claim.**
   - Note also that in the same source, anaerobiosis is described as **self-achieving**: *"anaerobiosis can be self-achieved via the respiratory action of the microbial flora and the indigenous vegetables (Stamer, 1983)."* If that is right, then the oxygen-removal benefit of pressing is largely redundant within a day or two anyway — consistent with Preuss 1928's finding that the headspace was ~100% CO₂ within 48 h.

2. **Commercial brine circulation: the claim exists, but the quantitative support is thin.** *"Noel et al. (1979) and Christ et al. (1981) described a system for brine circulation… They stated that the system allows more control of the fermentation, improves product homogeneity and accelerates acidification by the usual lactic acid bacteria."* (Fleming 1987, p201, URL above.) **Confidence:** WEAK — this is a secondary report of a claim by the system's developers, in an extension document, with no numbers given. **Study quality:** the underlying work is not accessible to me and no effect size is stated.

3. **Counter-consideration from the same ARS source:** in sauerkraut, **brine circulation is poor by nature**, and this limits what purging or stirring can achieve: *"The cabbage is so tightly packed that brine circulation may be too restricted for sufficient rate of CO₂ removal by nitrogen purging."* (Fleming 1987, p201.) **Confidence:** STRONG (direct quote). If N₂ purging through a sparger cannot circulate brine adequately in a commercial tank, it is implausible that occasional manual stirring redistributes salt or CO₂ meaningfully in a packed crock.

4. **Salt redistribution is a plausible mechanism but is not the rate-limiting step in shredded cabbage.** In dry-salted shredded cabbage the salt is applied to an enormous specific surface area and dissolves immediately; the measured limitation is **solute diffusion out of and into whole vegetables**, not within a shredded mass (see 5d and 5e). So "stirring to redistribute salt" has no obvious target in shredded-cabbage sauerkraut.

**Verdict for 4(e):**
- **Daily pressing/punching down:** **NO DATA on rate.** The documented rationale is oxygen exclusion (packing), and traditional practice is real, but **no study has measured whether it changes pH/time.** Anyone asserting it speeds fermentation is going beyond the evidence.
- **The one mechanism with a defensible evidence base is the one nobody frames as a rate benefit:** keeping the vegetables submerged prevents surface growth, which prevents the pH-reversing oxidative film. That is a *spoilage* benefit with a plausible indirect *rate* consequence, not a demonstrated direct rate effect.

---

## 4(f) Mould — conditions, the pH/salt/oxygen relationships, and the botulism mechanism

### 4f.1 — The botulism mechanism: mould consumes acid and raises pH

**The mechanism is real and mechanistically established, but — importantly — the classic "mouldy sauerkraut pH study" that everyone cites DOES NOT EXIST.**

- **The misattributed paper:** Mundt, J.O. (1978). "Effect of Mold Growth on the pH of **Tomato Juice**." *Journal of Food Protection* **41**(4): 267–268. DOI: 10.4315/0362-028X-41.4.267
  - **Finding:** 58 mould species / 21 genera grown on tomato juice for 35 days; initial **pH 4.1 → 4.9 to >9.0**; **53% of the Fungi Imperfecti raised pH above 7.0.**
  - **This is TOMATO JUICE, not sauerkraut.** A Europe PMC search for `ABSTRACT:"sauerkraut" AND ABSTRACT:"botulinum"` returns **0 hits**; `"moldy sauerkraut"` returns **0 hits**; `"botulism" AND "sauerkraut"` restricted to case reports returns **0 hits**.
  - **Confidence:** STRONG for the tomato-juice numbers; **STRONG NEGATIVE for any equivalent sauerkraut dataset.** I searched and it is not there.

- **The best quantitative demonstration of the causal chain, in tomato juice:**
  - Huhtanen, C.N. et al. (1976), USDA-ARS Eastern Regional Research Center. https://pmc.ncbi.nlm.nih.gov/articles/PMC170388/
  - *Cladosporium* grown on tomato juice: starting **pH 4.2** → beneath the mould mat **pH 5.8 at day 6, 7.0 at day 9, 7.8 at day 19**, with a **clear pH gradient with depth** (the pH rise is localised under the mat, not throughout).
  - **Lowest pH supporting *C. botulinum* growth across 10 strains = 5.24**; **no growth in any culture at pH 4.76, 4.92 or 5.04.**
  - **Sorbic acid at 100 µg/mL completely inhibited mould for 6 months; *C. botulinum* then did not grow.**
  - **Confidence:** STRONG (USDA-ARS primary data, replicated, dose–response).
  - **[CALC]:** the *Cladosporium* mat generated a local **+3.6 pH unit** rise (4.2 → 7.8) over 19 days, comfortably crossing the ~5.2 *C. botulinum* threshold.
  - **Study quality:** excellent for a 1976 paper — this remains the cleanest quantitative demonstration that a mould mat can convert a botulinum-safe acid food into a botulinum-permissive one.

- **The complication that makes the simple story incomplete:**
  - Odlaug, T.E. & Pflug, I.J. (1979). https://europepmc.org/articles/PMC243244
  - Type A *C. botulinum* grew at **pH 4.9 but not 4.8**; Type B grew at **pH 5.1 but not 5.0**.
  - **Non-hermetic** jars: heavy mould mat in 3–5 days, pH **4.2 → ~6.5 at the surface**, toxin present at all depths.
  - **HERMETIC** jars: **thin mat, NO pH gradient (pH stayed 4.2)** — yet *C. botulinum* **still grew and produced toxin (<10 LD₅₀/mL) associated with the mat.** Physical separation of mould and botulinum by dialysis tubing **abolished** the effect.
  - **So: even without any bulk pH rise, mould and *C. botulinum* growing co-located in a micro-environment can produce low-level toxin.** The mechanism appears to be local substrate/co-metabolism, not only bulk acid consumption.
  - **Confidence:** STRONG (controlled, replicated, with the elegant dialysis-tubing control). **This is an important refinement: the pH-rise mechanism is real but not the only one.**
  - Related: Odlaug & Pflug (1978), *J. Food Prot.*, DOI 10.4315/0362-028X-41.7.566 — *"C. botulinum cannot grow at pH ≤ 4.6"*; and of **722 botulism outbreaks 1899–1975, only 34 (4.7%) involved acid foods.**

- **Also relevant:** Ito, K.A. et al. (1976). https://europepmc.org/articles/PMC170016 — cucumber puree inhibited *C. botulinum* at **pH 4.8 but not 5.0**; and **0.9% acetic acid in brine prevented outgrowth from 10⁶ spores per cucumber.**
  - **Confidence:** STRONG (USDA-ARS primary data). **Note this is the quantitative basis for the "add vinegar to pickles" advice, and 0.9% is the number.**

- **The pH 4.6 threshold, confirmed in a third ARS source, with the spoilage signature spelled out:**
  - Fleming, H.P., Humphries, E.G., Thompson, R.L. & McFeeters, R.F. (2002). "Bulk Tank Technology: Acidification of commercially fermented cucumbers in bulk tanks to increase microbial stability." *Pickle Pak Science* VIII(1): 38–43. ARS PDF: https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p313.pdf
  - *"microbial instability were characterized by a **rise in pH and CO₂ and acetic acid concentrations, and a reduction in lactic acid concentration**."* — **This is precisely the chemical fingerprint of the oxidative-yeast/mould acid-consumption mechanism, measured in commercial tanks.**
  - *"If the pH rises above **4.6**, [the tank may require disposal]."*
  - Commercial practice: fermented cucumbers acidified with **3.21 N HCl** to lower brine pH to **3.5** from the end-of-fermentation pH, using **8.9–14.8 gal per tank**. Samples adjusted to **pH 3.5 were more stable** in chemical composition than **pH 4.0**-adjusted, and much more so than unadjusted. The paper cites **pH 3.5 as the optimum for microbial and chemical stability**.
  - **Confidence:** STRONG (ARS primary data at commercial scale, n = 10 tanks).
  - **Note the irony worth flagging:** *"lower concentrations of hydrochloric acid are required to lower the pH of fermented cucumbers, compared to either acetic or lactic acid"* — HCl is the most efficient acidifier on a molar basis, but it contributes **no undissociated acid** and therefore no antimicrobial activity of its own. The pH target of 3.5 is a *stability* target, not an antimicrobial-acid target. Compare this to Potts & Fleming 1982, where **0.16% acetic acid** — not pH alone — was what prevented mould.

### 4f.2 — Quantitative mould suppression by acid — and the surprising acid-specificity

- **Source:** Potts, E.A. & Fleming, H.P. (1982). "Prevention of Mold-Induced Softening in Air-Purged, Brined Cucumbers by Acidification." *Journal of Food Science* **47**(5): 1723–1727. USDA-ARS Food Fermentation Laboratory, Raleigh, NC.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p151.pdf · DOI: 10.1111/j.1365-2621.1982.tb05020.x
- **Confidence:** STRONG (primary dose–response experiment, replicated, multiple scales including commercial brines).
- **Study quality:** strong — laboratory jars (1-gal and 1-qt glass, **5.3–6.6% NaCl**, **22–28 °C**), plus **inoculated fermentations**, plus **two commercial plants**. Unusually thorough for the question.
- **THE NUMBERS:**
  - **0.16% acetic acid (equilibrated)** — **prevented** mould-induced softening. *"Mold-induced cucumber softening was prevented in air-purged fermentations by 0.16% acetic acid (equilibrated)."*
  - **0.12% and below** — softening **occurred**: *"Cucumber softening and pectate depolymerase activity increased in air-purged fermentations when the level of acid was decreased to 0.12% and below."*
  - **The threshold is sharp: 0.16% prevents, 0.12% fails.**
  - Commercial brines: soft spots and skin blisters on cucumbers acidified with **0.05% and 0.0%**, but **not with 0.16%** acetic acid.
  - **Natural (unacidified) fermentations:** softening was prevented by **delaying purging until the indigenous microflora had reduced the brine pH to 4.0.** *"Mold-induced softening was prevented in natural (not acidified) fermentations by delaying purging until indigenous microflora had reduced the brine pH to 4.0."*
  - **Acid specificity — this is the striking result:** *"In broth culture, growth of four mold isolates from soft cucumbers was inhibited by **0.3% acetic (pH 4.0)** but **not by up to 0.9% lactic acid (pH 3.0)** at 5.3% NaCl."*
    - **[CALC] interpretation:** **lactic acid at 0.9% and pH 3.0 did NOT inhibit these moulds, while acetic acid at 0.3% and pH 4.0 DID.** Undissociated acetic acid is a far more potent antifungal than lactic acid at a comparable or lower pH. **This matters directly for sauerkraut and kimchi, where lactic acid is the dominant acid and acetic acid is a minor product** — it means a low pH achieved purely with lactic acid is a weaker mould barrier than the pH number alone suggests.
  - **Oxygen requirement:** *"Direct contact of air bubbles and cucumbers was not a requirement for subsurface mold growth."* → **mould does not need the bubbles to touch the vegetable; it colonises subsurface tissue in an air-purged brine.** **Confidence:** STRONG.

### 4f.3 — How much does mould risk increase with oxygen exposure?

- **Qualitative but consistent and strong in direction:**
  - Potts & Fleming 1979: air purging at 5 and 100 MMG produced **"rapid and extensive cucumber softening"** and *"Cucumbers softening has been observed as the results of aerobic mold growth on the surface of the brined cucumbers in commercial fermentations purged at high air flow rates."* N₂-purged brines showed **no** such growth.
  - Zhai et al. 2018 (ARS review): *"the utilization of air purging to reduce the incidence of bloaters necessitates the identification of strategies to minimize its impact on the quality of the fermented cucumbers"* — because air purging is *"not only a relevant source of O₂ for softening-associated molds, but also for the growth of other undesirable aerobic organisms, off-flavors, oxidation and enhanced CO₂ production."*
  - UC Davis 2022: *"Molds require oxygen to grow."*
  - **Confidence:** STRONG that oxygen is permissive and that eliminating it prevents mould.
- **NO DATA — stated plainly:** I found **no study that quantifies mould incidence as a function of headspace %O₂ or oxygen flux** in a vegetable fermentation. There is no dose–response curve of the form "at X% O₂, mould incidence is Y%". **The relationship is documented qualitatively and mechanistically; it is not quantified.** Anyone quoting a %O₂ threshold for mould in fermented vegetables is inventing it.

### 4f.4 — Mould growth limits (general food mycology — NOT brine-specific)

- Racchi et al. (2020), DOI 10.1186/s13213-020-01612-6 — across 6 species, minima **a_w 0.88–0.92** and **pH 3.20–3.80**.
- Gock et al. (2003) — *Penicillium roqueforti* germinates at **a_w 0.82** at 25 °C, **cannot at 37 °C**.
- Dagnas (2014) — mould a_w/pH responses are **strongly species-specific and not generalisable**.
- **Confidence:** MODERATE for the general mycology; **these are NOT brine measurements.** **NO DATA** for sauerkraut brine a_w, for NaCl inhibition of moulds on fermented vegetables, or for the widely-repeated "moulds grow pH 1.5–11" figure, which is **untraceable to any primary measurement.**

### 4f.5 — Species found on fermented vegetables

- **Kimchi, best-dataset:** Seo et al. (2020), DOI 10.3390/molecules25215040 — dominant genera **Cladosporium, Fusarium, Botrytis, Alternaria, Pichia**; *Botrytis cinerea* 4.64%, *Fusarium oxysporum* 3.87%, *Aspergillus niger* 0.96%, *A. flavus* detected. The paper states explicitly: ***"There is no research on the mycotoxins contained in kimchi."***
- **NO DATA:** no published mould species isolation from sauerkraut surfaces that I could find; no mycotoxin measurements in sauerkraut **or** kimchi.
- **Confidence:** STRONG for the kimchi genera; **STRONG NEGATIVE** for sauerkraut and for mycotoxin data.

### 4f.6 — Answer for 4(f)

- **Mould can raise pH and enable *C. botulinum*: established, with hard numbers — but the numbers come from tomato juice and cucumber puree, not sauerkraut.** Initial pH 4.2 → 7.8 under a *Cladosporium* mat over 19 days; *C. botulinum* lowest growth pH **5.24**; *C. botulinum* cannot grow at **pH ≤ 4.6**; acetic acid at **0.16%** prevents mould-induced softening in cucumbers while lactic acid at **0.9% / pH 3.0 does not inhibit the moulds at all.**
- **Oxygen is the controlling variable for whether mould appears at all**, but the risk increase with oxygen is **not quantified**.
- **No botulism outbreak has ever been traced to sauerkraut.** This is a reproducible triple-negative across three independent literature queries. That is a meaningful safety datum — but it does not license complacency, because the mechanism is demonstrably real in adjacent acid foods and the mould-permissive conditions (oxygen + a stalled ferment) are exactly what a badly managed crock provides.

---

## 4(g) Oxygen sensitivity of the key LAB — are they aerotolerant, facultative, microaerophilic? Does O₂ change growth rate, and by how much?

### 4g.1 — Classification

- ***Leuconostoc mesenteroides*** — **facultatively anaerobic / aerotolerant.** It grows in the complete absence of oxygen (and is classically described as requiring a rich, complex medium rather than anaerobiosis per se). It also **consumes oxygen** when it is present, and grows *better* with it.
- ***Lactiplantibacillus plantarum*** (formerly *Lactobacillus plantarum*) — **facultatively anaerobic / aerotolerant**, and unusually so: it possesses **NADH oxidase** and can use oxygen as a terminal electron acceptor, and it can even carry out **oxygen-dependent lactate utilisation**.
  - **Confidence:** STRONG for the classification (this is textbook *Bergey's Manual* taxonomy, corroborated by the primary physiology below).
  - **Caveat:** I verified the *Bergey's* entry exists (DOI 10.1002/9781118960608.gbm00607) but **could not access the full text** to quote its exact wording. The classification is corroborated by the primary experimental papers below, which is stronger evidence anyway.

### 4g.2 — *Leuconostoc mesenteroides*: oxygen IMPROVES growth, and here are the numbers

- **Source:** Plihon, F., Taillandier, P. & Strehaiano, P. (1995). "Oxygen effect on batch cultures of *Leuconostoc mesenteroides*: relationship between oxygen uptake, growth and end-products." *Applied Microbiology and Biotechnology* **43**(1): 117–122. Laboratoire de Génie Chimique, Université Toulouse.
- **URL:** https://hal.sorbonne-universite.fr/UNIV-UT3/hal-02143226v1 · DOI: 10.1007/BF00170632
- **Confidence:** STRONG for the direction and the specific yields (controlled batch cultures at pH 6.5 and 30 °C in 10 L modified MRS, sparged with **nitrogen, air, or pure oxygen** — a clean three-arm gas design).
- **Study quality:** well-designed gas-controlled batch fermentation with quantitative yield coefficients. Limitation: **a single strain and a model medium (MRS), not cabbage or brine.**
- **THE NUMBERS:**
  - **Growth occurred under all three gases.** *"In all cases, growth occurred."* → oxygen is **not required**.
  - *"in aerobiosis there was oxygen consumption, leading to an **improvement of growth yield Yx/s and specific growth rate compared to anaerobiosis**."*
  - **Oxygen growth yield Yx/O₂ = 11 g dry weight biomass per mol O₂ consumed**, and it remained **constant** across oxygen transfer rates.
  - **Maximum values achieved with pure O₂ at 120 L/h sparge: Yx/s = 46.8 g/mol and maximum specific growth rate μ_max = 0.69 h⁻¹.**
  - *"Pure oxygen had a positive effect on Leuconostoc growth. Oxygen transfer was limiting under air, but pure oxygen provided bacteria with sufficient dissolved oxygen and leuconostocs were able to consume large amounts of oxygen."*
  - **Metabolic shift:** *"Acetate production increased progressively with oxygen consumption so that the total molar concentration of acetate plus ethanol remained constant."* At maximum O₂ supply, *"the switch from ethanol to acetate was almost complete."*
  - **[CALC]:** Plihon's abstract reports the **maximum** μ (0.69 h⁻¹, pure O₂) but does **not** state the anaerobic μ. I therefore **cannot give the fold-improvement** in growth rate. The paper is behind HAL's Anubis bot-protection and I could not retrieve the full PDF. **I am flagging this as a specific unresolved number rather than estimating it.**
- **Why this matters for Q4:** if oxygen *improves* growth and acid-production-linked metabolism in *Lc. mesenteroides*, then the reason anaerobic conditions win in practice cannot be "LAB need anaerobiosis." It must be (i) that oxygen feeds the **competitors** far more than it feeds the LAB, and (ii) that oxygen drives **acid consumption** by oxidative yeasts and moulds. Potts & Fleming 1979's data support exactly that reading: at high aeration, LAB were suppressed ~1000× while yeasts rose ~10⁷×.

### 4g.3 — *Lactiplantibacillus plantarum*: oxygen raises cell yield but does NOT raise lactic acid production

- **Source:** Smetanková, J., Hladíková, Z., Valach, F., Zimanová, M., Kohajdová, Z., Greif, G. & Greifová, M. (2012). "Influence of aerobic and anaerobic conditions on the growth and metabolism of selected strains of *Lactobacillus plantarum*." *Acta Chimica Slovaca* **5**(2): 204–210. Institute of Biotechnology and Food Science, Slovak University of Technology, Bratislava.
- **URL:** https://acs.fchpt.stuba.sk/index.php?id=7&paper=131 · DOI: 10.2478/v10188-012-0031-1 (open access)
- **Confidence:** MODERATE (three wild strains, MRS broth, 48 h, three temperatures, aerobic vs anaerobic; no replication detail reported and it is a lower-profile journal). The direction agrees with Plihon 1995, which raises confidence.
- **Study quality:** reasonable comparative physiology; the limitation is that it is a model medium, not a vegetable ferment.
- **THE NUMBERS:**
  - **Specific growth rates: 0.18–0.67 OD/h.** *"In general, these strains of lactobacilli grew faster under aerobic conditions."* (Two of the strains, 1L5 and 2L2, were exceptions at 37 °C.)
  - **Specific rates of pH decrease: 0.11–0.31 pH/h.** *"Only for the samples 1L5 (37 °C) and 1L5 (30 °C), decrease of pH value was faster under anaerobic conditions as under aerobic conditions."* → **the pH-drop rate was faster aerobically in most strains.**
  - **Lactic acid after 48 h: 9.83–11.48 g/dm³ AEROBIC vs 9.18–10.75 g/dm³ ANAEROBIC.** → **aerobic was equal or slightly higher.**
  - *"We found no significant differences in production of lactic acid by tested strains of *L. plantarum* under aerobic and anaerobic conditions."*
  - Acetic acid: 0.84–1.16 g/dm³ (anaerobic). Ethanol: 2.71–3.65 g/dm³ aerobic, 2.51–4.03 g/dm³ anaerobic.
  - **Final cell yield higher under aerobic conditions** — they cite a comparable literature result of **10 g/dm³ after 40 h (anaerobic) vs 12 g/dm³ after ~48 h (aerobic).**

- **CONTESTED — the direct contradiction:** the same paper cites **Fu & Mathews (1999)**, who found that *"Anaerobic fermentation gave a higher lactic acid yield of about **2.3 times** that for aerobic fermentation at optimum pH (between 5 and 6)."*
  - **Confidence:** WEAK-OR-CONTESTED. **The literature genuinely disagrees** on whether oxygen helps or hurts lactic acid yield in *L. plantarum*. Smetanková finds no difference (or a slight aerobic advantage); Fu & Mathews find a 2.3× anaerobic advantage. Strain, medium and pH control all differ. **I am reporting this as contested rather than picking a winner.**

### 4g.4 — The mechanism by which oxygen can HURT LAB

- **Source:** Zhai, Pérez-Díaz & Díaz (2018), *Trends Food Sci Technol* **81**: 185–192 (URL above).
- **Finding:** chemical or biological oxygen-scavenging systems *"generate reactive oxygen species that are inhibitory to lactic acid bacteria."*
  - **Confidence:** MODERATE (a statement in an ARS review; I did not trace it to a specific primary measurement).
  - **Interpretation:** this is the plausible resolution of the paradox in 4g.2–4g.3. Oxygen at low, controlled concentrations is metabolically useful to these facultative organisms; oxygen at high concentration, especially via ROS generation, is inhibitory. That would explain why the *magnitude* of aeration matters so much in Potts & Fleming 1979 and why the pure-culture literature looks more benign.

### 4g.5 — Answer for 4(g)

| Question | Answer | Confidence |
|---|---|---|
| Are *Lc. mesenteroides* / *L. plantarum* aerotolerant? | **Yes — facultatively anaerobic / aerotolerant.** Both grow with zero oxygen. | STRONG |
| Is oxygen *required*? | **No.** Growth occurs under pure N₂ in both species. | STRONG |
| Does O₂ change growth rate? | **Yes — it generally INCREASES it.** *Lc. mesenteroides*: improved μ and Yx/s on air and pure O₂ (μ_max 0.69 h⁻¹ on pure O₂; **anaerobic μ not obtainable**). *L. plantarum*: 0.18–0.67 OD/h, faster aerobically in most strains. | STRONG for direction; **magnitude unresolved for *Leuconostoc*** |
| Does O₂ change acidification rate? | **Much less than it changes growth.** *L. plantarum*: pH-drop rate 0.11–0.31 pH/h, lactic acid 9.83–11.48 g/dm³ aerobic vs 9.18–10.75 anaerobic — **no significant difference**. But Fu & Mathews (1999) report a **2.3× anaerobic advantage** in lactic acid yield. | MODERATE; **CONTESTED** |
| Then why does oxygen ruin a real ferment? | Because it feeds the **competitors**: +~10⁷× yeast and ~1000× LAB suppression under high aeration (Potts & Fleming 1979), plus ROS inhibition, plus net **acid consumption** by oxidative yeasts and moulds. | STRONG |

---

# QUESTION 5 — BATCH SIZE / VESSEL SIZE / SALT DISTRIBUTION

## 5(a) Does batch size or vessel size change fermentation rate?

**Answer: yes, but through at least four distinct mechanisms, and only one of them (temperature) has good measured data in vegetables. The others are documented as gradients and geometries rather than as rate effects.**

### 5a.1 — Thermal effects: see §5(b) — the dominant and best-quantified size effect

### 5a.2 — Commercial vs laboratory vessel scale — the actual numbers

- **Sauerkraut:** commercial fermentation is conducted in tanks covered with weighted plastic sheeting (p210, URL above).
- **Cucumbers:** *"Cucumber pickles have traditionally been fermented in open-top wooden vessels ranging in size from approximately **8,000 to 32,000 liters**."* (Andersson, Daeschel & Eriksson 1988, p210.) **Confidence:** STRONG (direct quote).
- **Cucumbers, commercial tanks measured directly:** *"cucumbers were brined in large, wooden tanks (ca **10,000 gal** ≈ 37,850 L)"* (Potts & Fleming 1979, p138). **Confidence:** STRONG.
- **Laboratory scale for comparison:** **5-gal (≈19 L) plastic pails** (Potts & Fleming 1979); **1-gal (3.8 L) glass jars** (Potts et al. 1986; Fasina et al. 2002; Johanningsmeier et al. 2007); **1-gal and 1-qt glass jars** (Potts & Fleming 1982); **58-gal (219.8 L) barrels** (Preuss et al. 1928).
- **So the working range spans ~1 L to ~38,000 L — a 4-order-of-magnitude range — and NO study I found varied vessel size as the *independent variable* with pH/time as the outcome.**

### 5a.3 — Surface-to-volume effects: MEASURED as a spatial gradient

The best evidence that vessel scale creates a **spatially non-uniform fermentation** — the microbiological consequence of size, distinct from thermal mass:

- **Source:** Potts & Fleming (1979), p138, URL above.
- **Finding:** In air-purged **commercial 10,000-gal tanks**, dissolved oxygen ranged **20–75% of saturation** and was **highest at the side-arm outlet ~6 in below the surface (50–75%), intermediate at the top of the tank (40–68%), and lowest ~5 ft below the surface (20–45%)**. *"Thus, appreciable DO was distributed throughout the brine."*
- **Confidence:** STRONG (direct measurement in a commercial tank).
- **[CALC]:** the vertical span sampled (~6 in to ~5 ft ≈ 0.15 m to 1.5 m) showed roughly a **2–3× decline in O₂ saturation** with depth. In a 1 L jar the entire depth is ~10 cm, so this gradient **cannot** develop — the whole vessel sits near the aerated end. **This is a real, measured, size-dependent difference in the chemical environment, and it is the opposite of what "bigger vessel = more oxygen" intuition would suggest: a deep tank gives the LAB a low-oxygen refuge that a shallow jar does not.**

- **Localised defect gradient with depth in commercial tanks:**
  - *"A fluctuating bloater incidence, from undetectable to severe, was observed in cucumber fermentations brined with reduced NaCl (2.7%) under anaerobic conditions, which was **localized at the top 3 ft of the tanks**. This was presumably due to a localized higher buoyancy pressure and lower hydrostatic pressure."*
  - **Source:** Zhai, Pérez-Díaz & Díaz (2018), *Trends Food Sci Technol* 81:185–192, citing Fleming et al. 1988. URL above.
  - **Confidence:** STRONG (a reported primary observation in an ARS review).
  - **[CALC]:** top 3 ft ≈ top 0.9 m. Hydrostatic pressure at 0.9 m of brine (ρ ≈ 1.05 g/cm³) ≈ **9.3 kPa**, vs ~0 kPa at the surface. **A ~9 kPa pressure differential across the top metre of a commercial tank is enough to change CO₂ retention and bloater incidence.** In a 20 cm deep crock the total hydrostatic head is only ~2 kPa. **This is a genuine, quantifiable physical difference between a deep commercial tank and a shallow home vessel.**

### 5a.4 — CO₂ blanket establishment: measured, and it is FAST even at moderate scale

- **Source:** Preuss, Peterson & Fred (1928), University of Wisconsin, URL above.
- **Finding:** in a **58-gal (219.8 L)** barrel with **136 kg** of shredded cabbage at 25–28 °C, **all residual air was displaced within ~2 days**, with the headspace then ~100% CO₂.
- **Confidence:** STRONG (direct gas analysis).
- **Implication for 5(a):** the CO₂ blanket forms in ~48 h at both 58-gal and (by the same mechanism) small scale, because it is driven by vigorous early heterofermentative CO₂ production, not by vessel size. **I found no evidence that vessel size changes the time to establish a CO₂ blanket.** What vessel size *does* change is how much oxygen there is to displace in the first place (headspace volume, see 4b).

### 5a.5 — A DOCUMENTED LAB-TO-COMMERCIAL SCALE-UP FAILURE — direct evidence that vessel size matters

This is the cleanest evidence I found that **scale changes the outcome qualitatively, not just quantitatively.**

- **Source:** Daeschel, M.A. & Fleming, H.P. (1981). "Entrance and Growth of Lactic Acid Bacteria in Gas-Exchanged, Brined Cucumbers." *Applied and Environmental Microbiology* **42**(6): 1111–1118. USDA-ARS Food Fermentation Laboratory, Southern Region, and North Carolina Agricultural Research Service, NC State University, Raleigh.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p149.pdf
- **Confidence:** STRONG (primary study, and the scale-up failure is explicitly reported by the authors themselves).
- **Study quality:** high — a deliberate laboratory-to-pilot comparison with the negative result reported rather than buried. Commendable (and rare) practice.

**The laboratory finding:**
- *"Entrance of lactic acid bacteria into the interior of brined cucumbers was found to be greatly influenced by gas composition of the cucumbers before brining."*
- **Exchanging the cucumber's internal gas with pure O₂ caused LAB to be absorbed into the fruit; N₂-exchanged cucumbers absorbed little.** *"Little bacterial absorption occurred in N₂-exchanged cucumbers."*
- *"Stomata of the cucumber skin appeared to be a likely port for bacterial entry."* — **corroborating Potts et al. 1986's independent finding that peeling speeds solute equilibration 3.7–11.1× and that transport is stomatal.**
- *"When *Pediococcus cerevisiae* or *Lactobacillus plantarum* cells were added to the brine of O₂-exchanged cucumbers, the respective cell types **colonized in large numbers within intercellular spaces and vascular elements of mesocarp tissue** during fermentation."*

**The scale-up failure:**
> *"Experimental **80-bushel (~2.9 m³)** wooden tanks were used to determine whether the oxygen exchange treatment might be adaptable to commercial use… The oxygen-exchanged cucumbers were **visually cured within a day or so after brining, duplicating our earlier laboratory data. However, in contrast to our previous laboratory data, serious bloater damage occurred in the oxygen-exchanged cucumbers about 4 to 5 days after brining.**"*

- **[CALC] the scale factor:** ~2.9 m³ (80 bushel) vs the laboratory vessels — roughly a **150–750× volume increase** over 1-gal jars.
- **What this means for 5(a):**
  1. **The O₂-exchange "accelerated curing" effect did NOT scale.** The visual curing (a texture/appearance endpoint) reproduced; the **bloater defect did not** — it appeared only at the larger scale, ~4–5 days in.
  2. **This is an outcome reversal, not an effect-size change.** A treatment that was beneficial in the lab became harmful at pilot scale. The proposed mechanism (O₂ metabolised to CO₂, CO₂ dissolves in tissue fluid more than O₂, creating a vacuum that draws brine in) is itself scale-sensitive because the **gas diffusion path lengths and the tissue-to-brine volume ratio both change with fruit size and packing depth**.
  3. **It is a direct empirical warning against extrapolating small-vessel results to crocks** — including, by extension, most of the home-fermentation literature.
- **Related, and a useful contrast — where O₂-exchange DID help:** the same ARS group found that O₂-exchanged cucumbers were **less** susceptible to bloater damage in other trials, because the internal O₂ is converted to CO₂ which has lower internal pressure, and O₂-exchange gave a "fully cured appearance within a few days as compared with several months" (Fleming et al. 1980, cited in p210; see also Zhai et al. 2018). **So the O₂-exchange literature is itself inconsistent across scales and trials** — which is exactly why it was never commercialised. **Confidence:** STRONG that the inconsistency exists; it is documented in the ARS review literature.

### 5a.6 — Answer for 5(a)

| Mechanism | Does vessel/batch size change it? | Evidence |
|---|---|---|
| **Thermal mass / temperature buffering** | **YES — the dominant, best-quantified effect** | See 5(b). Measured temperature effects on sauerkraut are large and well documented. |
| **Surface-to-volume → O₂ ingress** | **YES, but counter-intuitively** | Measured O₂ gradient 20–75% saturation with depth in a 10,000-gal tank; shallow vessels sit near the aerated end throughout. STRONG. |
| **Hydrostatic pressure / depth** | **YES** | Bloater incidence localised to the top 3 ft of commercial tanks (~9 kPa head at 0.9 m). STRONG for the observation; my kPa figure is [CALC]. |
| **CO₂ blanket establishment time** | **NO evidence of a size effect** | ~48 h in a 58-gal barrel. STRONG for the datum; NO DATA for a size comparison. |
| **A direct "bigger batch ferments faster/slower" rate measurement** | **NO DATA** | No study found. |
| **Scale-up reversal of a treatment outcome** | **YES — documented** | The O₂-exchange treatment cured cucumbers in the lab but caused **serious bloater damage at ~2.9 m³ scale after 4–5 days**. STRONG. |

---

## 5(b) Thermal mass — how much slower does a 20 L crock respond than a 1 L jar?

**Summary: the measured temperature effect on vegetable fermentation rate is LARGE and well quantified. The thermal-mass lag itself is NOT measured for vegetable fermentations — I found no such study. The calculation is straightforward, and I give it below with clearly-labelled assumptions. A dedicated parallel research stream on thermal mass and silage analogues is reported separately; where I could not verify a number I say so.**

### 5b.1 — MEASURED: temperature changes the rate of sauerkraut fermentation substantially

**The single best controlled dataset — Preuss, Peterson & Fred (1928)** (URL above; §4b.2 has the full table). Same barrel, same 136 kg cabbage, same ~2.5% salt, different temperatures:

| Experiment | Cabbage temperature | Time to end of gas production | Final acidity |
|---|---|---|---|
| I | cold (6.1 °C on removal) | 260 h | **0.26%** |
| II | 20 °C | 423 h | **1.90%** |
| III | 25–28 °C | 305 h | **2.24%** |
| IV | 25–28 °C | **141 h** | **2.1%** |

- **The authors' own conclusion:** *"The fermentation of cabbage is much quicker at higher temperatures than at lower temperatures."*
- **Their direct temperature-perturbation observation, which is the cleanest evidence that temperature is the rate-controlling variable:** *"As the temperature dropped from 17.5° to 10.5 °C, the gas and acid production decreased markedly, the acid production more so than the gas. As the temperature again increased to 20 °C, there was an increase in acidity. When the temperature is low the activity of the microorganisms is diminished and there is a corresponding decrease in the acid and gas production. When the temperature rises, the bacteria become more active and gas and acid production increases."*
- **Confidence:** STRONG for the direction and for the qualitative rate ordering; MODERATE for exact rates — **n = 1 per temperature condition**, no replication, no statistics, 1928 methodology, and the temperatures were not independently controlled (Experiments I and II ran at ambient/self-heated temperatures).
- **[CALC] — the ratio:** comparing Experiment IV (25–28 °C, 141 h) against Experiment II (20 °C, 423 h) gives a **~3× speed-up for roughly an 8 °C rise** — i.e. an apparent **Q₁₀ ≈ 3** over that range. **This is my calculation from two unreplicated runs and should be treated as an order-of-magnitude indication, not a measured Q₁₀.** It is, however, consistent with the general microbiological rule of thumb of Q₁₀ ≈ 2–3.

**The classic optimum conditions, as codified:**
- *"Pederson and Albury (1969) defined the optimum conditions for fermentation of cabbage into sauerkraut to be uniform salting of the shredded cabbage with 2.0% to 2.25% salt, tightly packing the salted cabbage into the fermentation vessel, covering the vessel to exclude air from the cabbage, and fermenting at a temperature of **18 °C**."*
- **Source:** Johanningsmeier, S.D., McFeeters, R.F., Fleming, H.P. & Thompson, R.L. (2007). "Effects of *Leuconostoc mesenteroides* Starter Culture on Fermentation of Cabbage with Reduced Salt Concentrations." *Journal of Food Science* **72**(5): M166–M172. USDA-ARS, SAA Food Science Research Unit, North Carolina State University, Raleigh.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf
- **Confidence:** STRONG (a direct, verbatim restatement of Pederson & Albury 1969 by USDA-ARS authors).
- **Primary citation not retrieved:** Pederson, C.S. & Albury, M.N. (1969). "The sauerkraut fermentation." *New York State Agricultural Experiment Station Bulletin* 824, Geneva, NY. **Confidence:** MODERATE — the citation itself is verified via AGRIS (https://agris.fao.org/search/fr/records/65de122f0f3e94b9e5ca5b76) but I could not retrieve the original text, so all Pederson & Albury figures here are quoted at second hand from the ARS paper that cites them.
- **Sauerklraut storage temperature:** *"[sauerkraut] that contains about 2% salt and is held at about 65 °F [18.3 °C]"* — Fleming 1987, p201, URL above. **Confidence:** STRONG (direct quote).

### 5b.2 — LAB growth temperature optima (the microbiological basis)

- *"The optimum temperature ranges for the starter cultures will highly influence the growth rates. **L. mesenteroides grows optimally at a temperature ranging from 20 to 30 °C**, while the other lactic acid bacteria mentioned above prefer **30 to 35 °C**."*
- **Source:** Andersson, Daeschel & Eriksson 1988, p210, URL above. **Confidence:** STRONG (direct quote from an ARS review).
- **This explains the 18 °C recommendation precisely:** it is below the *Lc. mesenteroides* optimum, which deliberately slows the heterofermentative first stage relative to the more acid-tolerant homofermentative *L. plantarum* (30–35 °C optimum), producing a more balanced, better-flavoured product. **The temperature recommendation is a *quality/ecology* control, not a speed maximisation.**

### 5b.3 — The thermal-mass calculation — now anchored in MEASURED material properties

**NO measured temperature-lag data exists for a vegetable fermentation vessel** — that remains a genuine gap. But measured **thermophysical properties** for cabbage and root vegetables were located, so the calculation below rests on measurement rather than assumption. Full working: `ferment_vessel_research/VESSEL_SIZE_THERMAL_OXYGEN_REPORT.md` and `calcs.txt`.

**MEASURED inputs (upgraded from the assumed values I used initially):**
- **Thermal conductivity of cabbage petiole: k = 0.43–0.47 W·m⁻¹·K⁻¹ raw; +0.04 W·m⁻¹·K⁻¹ when salted.** — Kim et al. (1991), *Korean J. Food Sci. Technol.* **23**(3): 325. **Confidence:** MODERATE (single source, direct measurement).
- **Thermal diffusivity of root vegetables: α = 1.15–1.47 × 10⁻⁷ m²/s.** — Muramatsu et al. (2020), *Food Sci. Technol. Res.* **26**(6): 717 (open access). **Adopted for cabbage: α = 1.15 × 10⁻⁷ m²/s.** **Confidence:** MODERATE — measured, but on **carrot/radish/burdock, not cabbage** (no measured α for cabbage specifically was found).
- **⚠️ Specific heat of cabbage: NO accessible primary table found** (paywalled). A design value of **3900 J·kg⁻¹·K⁻¹** was used, cross-validated indirectly via the thermal-diffusivity figure. **Flagged MODERATE, not measured.**
- **SILAGE analogue (explicitly an analogue, not a vegetable fermentation):** USDA-ARS, Ahn et al. (2009), *Bioresource Technology* **100**: 3974 — **k = 0.09–0.47 W·m⁻¹·K⁻¹, C = 0.93–3.09 MJ·m⁻³·K⁻¹**, so **α spans 2.9 × 10⁻⁸ to 5.1 × 10⁻⁷ m²/s — a 20× spread, which is the dominant uncertainty in any silage-based estimate.**
- **COMPOST analogue:** Barrena et al. (2006), *Waste Management* **26**: 953 — a **13,500 kg pile (2 × 1.5 × 10 m)** ran **50–70 °C core vs 15 °C ambient**; cp = 2.01 kJ·kg⁻¹·K⁻¹, k = 0.399 W·m⁻¹·K⁻¹ (α = 3.31 × 10⁻⁷ m²/s). The paper's own conclusion: **large mass → low heat loss → thermal inertia.** **Confidence:** MODERATE. It is an **analogue**.

**THE CALCULATION — [CALC] from measured inputs.** For a cylinder with Biot ≫ 1, the slowest (fundamental) mode has time constant **τ = R² / (2.4048² · α)**, where 2.4048 is the first root of J₀:

| | **1 L jar** (r = 4.73 cm) | **20 L crock** (r = 12.85 cm) |
|---|---|---|
| **τ = R²/(2.4048²α)** | **0.94 h** | **6.90 h** |
| τ using the simpler R²/α | 5.4 h | 39.9 h |
| **Sensible heat per K** | **3.9 kJ** | **78.0 kJ** (20×) |
| **Diurnal core amplitude** | **~43% of the ambient swing** | **~10%, lagged ~9 h** |

- **The ratio is exactly 20^(2/3) = 7.37×** — it falls straight out of τ ∝ R² ∝ V^(2/3).
- **Diurnal penetration depth δ = √(2α/ω) = 5.6 cm in cabbage.** This is the most useful derived number: **a 24 h ambient swing only penetrates ~5.6 cm.** A 1 L jar (radius 4.7 cm) lies **entirely within the diurnal skin** and tracks the room; a 20 L crock (radius 12.9 cm) has a core **well outside it**, seeing only ~10% of the swing.
- **PRACTICAL MEANING:** vessel size does **not** change the temperature–rate law. It changes **how faithfully the ferment tracks a fluctuating room.** A big crock is not intrinsically faster or slower — it is **more buffered**, so its rate is more uniform and its outcome more reproducible. **This is my inference from the physics; no study has measured it in a vegetable fermentation.**
- **NO DATA — flagging clearly:** **no measured temperature trajectory, core-vs-ambient lag, or thermal time constant exists for ANY vegetable fermentation vessel.** The table is physics from measured material properties. **Do not present it as experimental data.**

### 5b.3b — MEASURED temperature–rate data

- **Kimchi, measured:** Jung et al. (2024), *Heliyon* **10**: e27174 — at **week 1**, kimchi at **4 °C** reached **pH 5.09 / 0.75% acid**; at **10 °C**, **pH 4.21 / 1.69% acid** — about a **2.3× rate increase per 6 K.** **Confidence:** MODERATE (single study).
- **Sauerkraut, extension guidance:** Oregon State University Extension, **PNW 355** — sauerkraut takes **3–4 weeks at 21–24 °C** versus **5–6 weeks at 15.6 °C.** https://extension.oregonstate.edu/catalog/pnw-355-pickling-vegetables **Confidence:** STRONG as authoritative guidance; a practical rule, not a controlled measurement. **[CALC]:** ~1.6× speed-up per ~6–8 K.
- **Arrhenius, sauerkraut total acid: Ea = 47.23 kJ/mol.** — Du et al. (2022), *Foods* **11**(12): 1762. **⚠️ MAJOR CAVEAT: this is post-fermentation STORAGE chemistry, not the fermentation itself.** Do not apply it to the acidification phase.
- **Ratkowsky model for *L. plantarum*:** b = 0.0385, c = 0.247, T_min = 3.29 °C, T_max = 44.8 °C — Zwietering et al. (1994), *Applied and Environmental Microbiology* **60**: 195.
  - **[CALC] from those parameters:** μ(25 °C)/μ(18 °C) = **2.15×**; Q₁₀ = **2.03** (15→20 °C), **1.67** (20→25 °C), **1.46** (25→30 °C). **Q₁₀ falls as temperature rises** — a useful refinement over a flat "Q₁₀ ≈ 2–3".
  - **⚠️ CONTESTED:** the Ratkowsky-implied Ea over 15–25 °C is **~87 kJ/mol, ~1.8× the measured 47.23 kJ/mol.** The two measure different things (growth vs acid accumulation; fermentation vs storage). **Treat any single Ea for this system as uncertain by roughly ±2×.**

**Verdict for 5(b), revised:** the temperature effect on rate is **1.6–2.3× per 6–7 K** by three independent routes — better constrained than the Q₁₀ ≈ 3 I derived from Preuss 1928 alone. **Size changes the buffering (7.4× in τ), not the rate law.**

**I could find NO measured temperature-lag data for a vegetable fermentation vessel.** The silage literature is the correct analogue (large silage clamps have substantial thermal inertia) but I was **unable to retrieve a specific measured temperature-lag dataset from silage** in this pass, and I am **not** going to cite a silage number I could not verify.

**What follows is my own calculation. It is a physics estimate, not a measurement. Treat the outputs as order-of-magnitude.**

**Method.** For a body losing/gaining heat to a well-stirred surroundings, the thermal time constant is

  τ = L² / α   (where L = characteristic half-dimension, α = thermal diffusivity)

and the body's temperature approaches the new ambient exponentially with time constant τ, reaching 63% of the step in τ and 95% in 3τ.

### 5b.4 — Answer for 5(b)

- **Temperature effect on rate: LARGE and measured.** Preuss 1928: at 25–28 °C the fermentation effectively completed in ~141 h; at 20 °C it was still going at 423 h; a cold barrel (6 °C) reached only 0.26% acidity. **STRONG for direction, MODERATE for magnitudes (n = 1 per condition).**
- **Thermal mass lag: NOT measured for vegetables.** My calculation gives τ ≈ 14 min (1 L) → ~65 min (20 L) → ~115 min (100 L), i.e. a 20 L crock lags a 1 L jar by roughly an hour and damps diurnal swings by roughly the ratio of the lag to the swing period. **[CALC], physics only.**
- **The correct framing:** vessel size changes **rate stability**, not the underlying temperature–rate relationship. A big crock is not intrinsically faster or slower; it is **more buffered**, which makes the outcome more reproducible.
- **Silage analogue: not cited** because I could not verify a specific measured number. Flagged as a gap rather than filled.

---

## 5(c) Surface-to-volume ratio — geometry and its effect on oxygen ingress

**No experimental dataset exists for this in vegetable fermentation, so what follows is the geometry, given explicitly, plus the one measured oxygen-gradient datum that bears on it.**

### 5c.1 — The scaling law

For any geometrically similar family of vessels, **surface area scales as the square of the linear dimension and volume as the cube**, so:

  **A/V ∝ 1 / L**

Doubling a vessel's linear size **halves** its surface-to-volume ratio. This is the whole story, and it means **small vessels are intrinsically more oxygen-exposed per unit of contents than large ones.**

### 5c.2 — Exact formulae and worked values — [CALC]

For a cylinder of diameter D and height H (I use **H = 1.5 D**, a typical crock proportion), total surface area A = 2·(πD²/4) + πDH = πD²/2 + πDH; volume V = πD²H/4.

| Vessel | V (cm³) | D (cm) | H (cm) | A (cm²) | **A/V (cm⁻¹)** |
|---|---|---|---|---|---|
| 1 L jar | 1,000 | 9.5 | 14.2 | 566 | **0.566** |
| 5 L crock | 5,000 | 16.2 | 24.3 | 1,650 | **0.330** |
| 20 L crock | 20,000 | 25.7 | 38.5 | 4,150 | **0.208** |
| 100 L crock | 100,000 | 44.0 | 66.0 | 12,200 | **0.122** |
| 1,000 L tank | 1,000,000 | 94.7 | 142 | 56,200 | **0.056** |

**Scaling check:** 1 L → 100 L is a 4.64× linear scale-up and A/V falls from 0.566 to 0.122, a factor of **4.6** — exactly 1/L, as required. ✔

**Useful special case — a squat vs tall vessel of the same volume.** The **brine–air interface area** (the top surface, = πD²/4) is what governs oxygen transfer into the brine and is where surface films grow. For fixed V:
  - A tall narrow vessel minimises the surface area but maximises wall area.
  - A wide shallow vessel maximises the surface area.
  - **For a 20 L vessel: D = 25.7 cm (H = 1.5D) gives a surface of 519 cm²; a wide 20 L vessel at D = 40 cm, H = 15.9 cm gives 1,257 cm² — 2.4× the air-exposed surface for the same volume.** **[CALC]**

### 5c.3 — The one measured oxygen datum that bears on this

- **Vertical O₂ gradient in a commercial tank** (Potts & Fleming 1979, p138, URL above): DO **20–75% of saturation**, highest just below the surface (50–75%) and at the purge inlet, lowest ~5 ft down (20–45%).
- **Confidence:** STRONG.
- **Interpretation ([CALC] / inference):** oxygen enters at the **brine–air interface** and is consumed as it diffuses down. In a shallow vessel the entire contents are within the oxygen-affected zone; in a deep vessel the bulk is a low-oxygen refuge. **This means the surface-area-to-volume ratio predicts oxygen exposure per unit volume, but the *depth* predicts whether a refuge exists at all.** Both matter and they trade off against each other.

### 5c.4 — Oxygen flux fundamentals (for anyone modelling this)

- **Oxygen solubility in air-saturated water at 25 °C: ≈ 8.3 mg/L**; in brine it is lower. **A directly measured value for cucumber brine: 5–6 ppm O₂ at saturation**, varying with salt concentration and temperature (Potts & Fleming 1979, p138; restated as "up to 6 ppm" in Zhai et al. 2018).
  - **Confidence:** STRONG (two independent ARS sources).
- **Effect of salt:** Potts & Fleming measured DO against Truesdale et al. (1955) solubility data and found agreement *"within 0.2 ppm… up to 30° salometer (7.93% NaCl w/w)"*, but above that the experimental values ran **increasingly higher** than the calculation, because the Truesdale formula assumes a linear DO decrease with salt that *"becomes increasingly inaccurate at higher salt levels."*
  - **Confidence:** STRONG (direct methodological finding). **A practical caution: published O₂-solubility-vs-salinity tables are unreliable above ~8% NaCl.**
- **Diffusion coefficients of O₂ in water and in air, and Henry's law constants: a dedicated treatment with citations is in the parallel thermal-mass/geometry stream.** I did not independently verify these and am not quoting them here to avoid restating an unverified number.

---

## 5(d) Salt diffusion into whole vegetables — how long to equilibrate

**This is the best-quantified topic in the entire brief.** The USDA-ARS Raleigh group measured it directly.

### 5d.1 — THE key dataset: Potts, Fleming, McFeeters & Guinnup 1986

- **Source:** Potts, E.A., Fleming, H.P., McFeeters, R.F. & Guinnup, D.E. (1986). "Equilibration of Solutes in Nonfermenting, Brined Pickling Cucumbers." *Journal of Food Science* **51**(2): 434–439. USDA-ARS Food Fermentation Laboratory and NC Agricultural Experiment Station, Raleigh.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p190.pdf · DOI: 10.1111/j.1365-2621.1986.tb11149.x
- **Confidence:** STRONG (primary replicated experiment, multiple sizes, temperature series, Arrhenius analysis, molecular-weight series).
- **Study quality:** high. **Non-fermenting** design — microbial growth prevented with 1,000 ppm sodium benzoate + 3 ppm Merthiolate — which isolates **pure physical diffusion** from microbiology. That is exactly what you want for a diffusion study and it is why these numbers are usable as a physical baseline. Limitation: one cultivar, and the authors note "Cucumber variety and harvest conditions were unknown."
- **Design:** 1-gal (3.8 L) glass jars, **50% cucumbers / 50% brine by weight**, cover brine of **10% NaCl + 0.8% of one acid** (lactic, acetic, tartaric or formic), held at ~25 °C. Equilibration followed by periodic sampling. Cucumbers graded: **no. 1 (1.9–2.7 cm dia), no. 2 (2.7–3.8), no. 3 (3.8–5.1), no. 4 (5.1–6.4 cm)**. Surface area estimated as a cylinder with hemispherical ends, A = πDL.

**MEASURED first-order rate coefficients Kp (day⁻¹) — unpeeled cucumbers** (their Table 1; the percentage in parentheses is the authors' own "% of equilibrium attained per day"):

| Grade (dia) | Reducing sugar | Malic acid | **NaCl** | **Lactic acid** |
|---|---|---|---|---|
| **no. 1** (1.9–2.7 cm) | 0.472 (37.6%) | — | **1.673 (81.2%)** | **1.973 (86.1%)** |
| **no. 2** (2.7–3.8 cm) | 0.146 (13.6%) | — | **0.679 (49.3%)** | **0.720 (51.3%)** |
| **no. 3** (3.8–5.1 cm) | 0.077 (7.4%) | 0.107 (10.1%) | **0.301 (26.1%)** | **0.356 (30.0%)** |
| **no. 4** (5.1–6.4 cm) | 0.045 (4.4%) | — | **0.170 (15.6%)** | **0.189 (17.2%)** |

**Peeled cucumbers** — *"Peeling increased Kp values 6.9- to 11.1-fold for reducing sugar, 10.6-fold for malic acid, 3.7- to 7.3-fold for NaCl, and 3.5- to 8.1-fold for lactic acid equilibration."* (Example given: no. 2 peeled, reducing sugar Kp = **1.014 day⁻¹**, 63.7%/day.)

**[CALC] — converting Kp to practical equilibration times.** For a first-order approach to equilibrium, half-time t½ = ln2/Kp and 95% equilibration t₉₅ = ln(20)/Kp ≈ 3.00/Kp:

| Grade (dia) | **NaCl t½** | **NaCl t₉₅** | Lactic acid t½ | Lactic acid t₉₅ | Sugar t½ | Sugar t₉₅ |
|---|---|---|---|---|---|---|
| no. 1 (1.9–2.7 cm) | **0.41 d** | **1.8 d** | 0.35 d | 1.5 d | 1.5 d | 6.4 d |
| no. 2 (2.7–3.8 cm) | **1.0 d** | **4.4 d** | 0.96 d | 4.2 d | 4.7 d | 20 d |
| no. 3 (3.8–5.1 cm) | **2.3 d** | **10.0 d** | 1.9 d | 8.4 d | 9.0 d | 39 d |
| no. 4 (5.1–6.4 cm) | **4.1 d** | **17.6 d** | 3.7 d | 15.9 d | 15 d | 67 d |

**These t½ and t₉₅ values are my arithmetic from the authors' measured Kp values. The Kp values are the measured data; the times are derived.**

**The headline numbers:**
- **Salt equilibrates in roughly 4–18 days** for pickling-size cucumbers (t₉₅), depending on diameter.
- **Sugar — the substrate the LAB actually need — takes 6–67 days**, i.e. **5–15× longer than salt**, and it is the **rate-limiting solute**.
- **A whole cucumber's sugar is still only 95% equilibrated after ~5.5 weeks at the largest size.** This is the physical reason commercial brine-stock cucumbers take weeks to months.
- **Size effect:** NaCl Kp falls from 1.673 (no. 1) to 0.170 (no. 4) — a **9.8× slow-down** across a 2.4× diameter increase. **[CALC]** That is a stronger dependence than the 1/L scaling of a lumped model, consistent with the authors' finding that transport is **surface-limited through the stomata**, not bulk-limited.

**Temperature dependence — MEASURED activation energies:**
- *"Temperature dependency was greater for solute movement out of [cucumbers] (apparent activation energies (Ea) of **6.5 and 6.3 kcal/mole** for malic acid and sugar) than into (apparent Ea of **4.5 and 4.2 kcal/mole** for NaCl and lactic acid)."*
- **[CALC] unit conversion (1 kcal/mol = 4.184 kJ/mol):** malic acid **27.2 kJ/mol**, sugar **26.4 kJ/mol**, NaCl **18.8 kJ/mol**, lactic acid **17.6 kJ/mol.**
- **Interpretation:** the activation energies for solutes moving **out** (~27 kJ/mol) are ~45% higher than for solutes moving **in** (~18 kJ/mol). The authors attribute this to microstructure and to the different transport route — consistent with their finding that *"solute transport in unpeeled cucumbers occurs mainly through the stomata"* (regression: **S = 110 day⁻¹·cm⁻², I = 0.111 day⁻¹, r² = 0.968** for Kp vs total surface area, unpeeled).
- **Confidence:** STRONG for the Ea values (Arrhenius fits across a temperature series); MODERATE for the mechanistic stomatal interpretation.

### 5d.2 — The second key dataset: Fasina, Fleming & Thompson 2002 (freshly brined cucumbers)

- **Source:** Fasina, O., Fleming, H. & Thompson, R. (2002). "Mass Transfer and Solute Diffusion in Brined Cucumbers." *Journal of Food Science* **67**(1): 181–187. USDA-ARS and NC State University, Raleigh.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p299.pdf
- **Confidence:** STRONG (replicated, 5 size grades, n = 20 fruits measured per grade, nonlinear parameter estimation with standard errors).
- **Study quality:** high — this is the more rigorous of the two ARS diffusion papers because it fits both lumped and distributed models and reports fit statistics. Same non-fermenting design (1,000 ppm sodium benzoate + 300 ppm bisulfite), 1-gal glass jars, 50/50 pack-out, **10% NaCl + 0.8% lactic acid** cover brine, 16 days, 12 brine samples over time.
- **THE NUMBERS:**
  - **Diffusion coefficient of sugar: 1.80 × 10⁻⁹ to 9.18 × 10⁻⁹ m²/s** (abstract), fitted as concentration-dependent, Do values **1.55 × 10⁻⁹ m²/s (17.0 mm dia) to 8.47 × 10⁻⁹ m²/s (46.1 mm dia)**.
  - **Solute sorption rate k (h⁻¹) — the practical rate constant, and note how strongly it depends on size:**

| Size (dia) | Lactic acid k | Malic acid k | **NaCl k** | Sugars k |
|---|---|---|---|---|
| 1A (17.0 mm) | 0.127 | 0.0457 | **0.233** | 0.0452 |
| 1B (22.7 mm) | 0.0929 | 0.0261 | **0.174** | 0.0242 |
| 2A (26.7 mm) | 0.0788 | 0.0321 | **0.135** | 0.0285 |
| 2B (31.6 mm) | 0.0561 | 0.0254 | **0.0922** | 0.0244 |
| 3B (46.1 mm) | 0.0482 | 0.0208 | **0.0450** | 0.0204 |

  - **[CALC]:** NaCl sorption rate falls **5.2×** (0.233 → 0.0450 h⁻¹) across a 2.7× diameter increase; lactic acid falls **2.6×**.
  - **Solutes moving IN are faster than solutes moving OUT**, consistently across all sizes: the ratio k/k_sugar for **NaCl ranged 5.14 (smallest) to 2.21 (largest)** and for **lactic acid 2.81 down to 2.36**. The authors: *"the rate of diffusion is higher for solutes transported onto the cucumber than those of solutes transported out."*
    - **This is important and slightly counter-intuitive: salt and lactic acid get INTO the cucumber faster than sugar gets OUT.** So the interior acidifies and salts before it is fully depleted of substrate — which is the physical basis for the interior/exterior question below.
  - **Equilibration timing:** *"Equilibration of solutes between brine and cucumbers was approached by 150 h of contact. The rate of sugar equilibration was the slowest. For lactic acid, malic acid, and NaCl, 95% of the diffusion that took place occurred within the first 70 h of fruit/brine interaction. It took about 100 h or more for the reducing sugars to attain the 95% diffusion level."*
    - **[CALC]:** 70 h ≈ **2.9 days**; 100 h ≈ **4.2 days**; 150 h ≈ **6.3 days**. These are much shorter than the Potts 1986 times because the cucumbers here are **immature, small fruit (17–46 mm)** at a 50/50 pack-out in 1-gal jars, vs Potts' larger range.
    - **⚠️ Internal inconsistency in the paper, flagged honestly:** the abstract/conclusion states *"About 95% of solute diffusion that took place during cucumber brining occurred within 15 h or less of contact between brine and cucumber"*, while the Results text says 70 h. **I cannot reconcile these two statements and I am reporting both rather than choosing.** The 70 h figure appears in the detailed Results and is the one I would use.
  - **The most important modelling result — there is NO steep surface-vs-centre gradient for sugar:** The authors computed **mass-transfer Biot numbers of 5.1, 5.5, 2.6, 3.6 and 2.7** for sizes 1A–3B. Since **Bi < 10**, the lumped model applies rather than the distributed Fickian model, and *"simulation results (from Eq. 2) showed that, at any time, there is no significant difference in sugar concentration between the surface and center of the fruit (Fig. 4)."*
    - **Confidence:** STRONG for the Biot numbers and the model selection.
    - **This directly answers the "interior vs exterior acidification rate" part of 5(d): for sugar, the cucumber behaves as a lumped body with no significant internal gradient.** The limitation is at the **skin/brine interface**, not inside the fruit. This is consistent with Potts 1986's finding that **peeling speeds equilibration 3.7–11.1×** — the skin is the barrier.

### 5d.3 — The commercial timing that follows from this

- *"In the controlled fermentation process recommended by Etchells et al. (1973), cucumbers are held in acidified brines for **18 to 24 hr** to allow nutrients to diffuse into the brine and NaCl and acetic acid to diffuse into the cucumbers. **The brine is then adjusted to about pH 4.5 and inoculated with lactic acid bacteria.**"*
- **Source:** Potts et al. 1986, p190, URL above. **Confidence:** STRONG (direct quote).
- **Interpretation:** commercial practice does **not** wait for full equilibration (which takes days). It waits **18–24 h** — enough for the *brine* to become a suitable medium (nutrients out, pH buffered) — then inoculates, and lets the remaining salt/sugar equilibration happen **during** the fermentation. **This is the single most useful practical number in 5(d).**

### 5d.4 — Bloaters and hollow/soft centres — the classic defect, with numbers

- **Lactic acid bacteria enter and grow INSIDE the cucumber**, which is what makes the interior a distinct chemical environment:
  - *"Lactic acid bacteria were found to be able to enter and multiply inside brined cucumbers."* (Fasina et al. 2002, p299.)
  - *"Results from studies carried out in our laboratory indicate that fermentation occurs outside, as well as within, the brined cucumbers (Daeschel and Fleming 1981; Daeschel and others 1985)."* (Fasina et al. 2002.)
  - **Confidence:** STRONG (ARS primary work, multiple papers).
- **The bloater mechanism, quantitatively:**
  - Malic acid is decarboxylated by LAB to lactic acid + **CO₂**. *"As part of the fermentation process, some lactic acid bacteria degrade malic acid into CO₂ and lactic acid (Etchells and others 1968). This microbially produced CO₂ is a major cause of bloater damage (hollow cucumbers)."* (Fasina et al. 2002.)
  - **The CO₂ accumulates inside the fruit faster than it can diffuse out, until the internal pressure exceeds tissue tolerance and irreversible cavities form.**
  - **Source:** Zhai, Pérez-Díaz & Díaz (2018), *Trends Food Sci Technol* 81:185–192: *"Although the biological conversion of oxygen to CO₂ reduces the cucumbers internal gas pressure, the dissipation of the gas from the tissue is reduced by brining. Once the gas accumulates in the cucumber tissue in concentrations high enough to displace it, the irreversible formation of hollow cavities or bloaters occurs… microbial activity seems to contribute most of the CO₂ needed for cucumbers to bloat."*
  - **Confidence:** STRONG (ARS review synthesising decades of primary work).
- **The mechanism, measured — and a specific time window:**
  - **Source:** Fleming, H.P. & Pharr, D.M. (1980). "Mechanism for Bloater Formation in Brined Cucumbers." *Journal of Food Science* **45**(6): 1595–1600. USDA-ARS Food Fermentation Laboratory and NC State University, Raleigh. ARS PDF: https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p145.pdf
  - **Internal gas of fresh cucumbers: about 75% N₂, 20% O₂ and 6.0% CO₂.** *(The quoted figures sum to 101%; I report them as printed rather than silently renormalising.)* **Confidence:** STRONG for the composition (direct gas extraction and analysis); the 101% is almost certainly rounding or OCR.
  - **Replacing that internal gas with CO₂ or with O₂ reduced the fruit's susceptibility to bloater damage** on subsequent storage in CO₂-charged brine.
  - ***"Bloater damage was related directly to % N₂ and inversely to % CO₂ in the internal gas of the cucumbers when they were brined."***
  - **Proposed mechanism:** brining **clogs the intercellular gas spaces with liquid**, and the liquid-clogged layer then acts as a **differentially permeable barrier**. Because **CO₂ is far more water-soluble than N₂**, CO₂ diffuses *in* from the brine faster than N₂ can diffuse *out*, so internal pressure (CO₂ + trapped N₂) builds until the tissue ruptures.
  - **⚠️ THE ACTIONABLE NUMBER — a critical window at ~1 day:** *"If carbonation was begun **immediately after brining**, the cucumbers did not bloat extensively, even after extended carbonation. **Bloater damage was extensive, however, if carbonation was begun about 1 day after brining.**"* → **the fruit is most vulnerable roughly one day after brining**, once the intercellular spaces have clogged but before the tissue has equilibrated.
  - **And the window closes:** *"After about a month or longer in brine storage, the cucumbers were no longer susceptible to bloater damage by artificial carbonation, even when the brine was saturated with CO₂. These cucumbers did bloat, however, if subjected to supersaturated levels of CO₂ due to yeast fermentation."*
    - **Interpretation:** fully equilibrated, fully brined fruit is robust; fruit in the **first days** after brining is not. **This is why the ARS "controlled fermentation" process holds cucumbers in acidified brine for 18–24 h and then inoculates (see 5d.3) — it is managing exactly this vulnerability window.**
  - **Confidence:** STRONG (primary dose- and timing-response experiment, replicated).

- **Bloater index is a standardised measurement** and the defect is graded by acuteness (slight/medium/severe) and tissue disruption type (honeycomb, lens, balloon) — Wehner & Fleming (1984), cited in Zhai et al. 2018.
- **Mitigation with numbers:**
  - **N₂ purging for at least the first 2 days** prevents tissue softening and improves quality (Gates & Costilow 1981, cited in Zhai et al. 2018).
  - **4% NaCl with Bag-in-Box technology:** *"Bloater damage was minimal in cucumber fermentations brined with 4% NaCl using the Bag-in-Box fermentation technology."* (Zhai et al. 2018.)
  - **Acidify cover brine to ≤ pH 4.6** to shift CO₂ into the gaseous (removable) form; **acetic acid to 0.16%** reduces gas production by Enterobacteriaceae and moulds (Zhai et al. 2018; Potts & Fleming 1982).
  - **Starter cultures deficient in malic acid decarboxylation** reduce bloater incidence — but *"Cultures deficient in malic acid decarboxylation also present longer growth lag phases and generation times in cucumber juice"*, and *"are unable to complete the desired conversion of sugars to lactic acid."* (Zhai et al. 2018.) → **a real trade-off: less gas, but a slower and less complete fermentation.**

### 5d.5 — Answer for 5(d)

| Question | Answer | Source / confidence |
|---|---|---|
| Diffusive timescale for salt into whole cucumbers | **t½ 0.4–4.1 d; t₉₅ 1.8–17.6 d** depending on diameter (19–64 mm) | Potts 1986 Kp values (STRONG) + [CALC] for times |
| Sugar (rate-limiting solute) | **t½ 1.5–15 d; t₉₅ 6.4–67 d** — **5–15× slower than salt** | Same |
| Measured brine-to-tissue salt equilibration | Kp 1.673 → 0.170 day⁻¹ (no. 1 → no. 4) | Potts 1986 (STRONG) |
| Effect of size | **~10× slower for the largest vs smallest grade** | Potts 1986 (STRONG) |
| Effect of skin | **Peeling speeds equilibration 3.7–11.1×** — the skin is the rate-limiting barrier | Potts 1986 (STRONG) |
| Interior vs exterior gradient | **For sugar, NO significant gradient (Biot < 10, lumped behaviour).** The barrier is the skin, not the interior. | Fasina 2002 (STRONG) |
| Order of uptake speed | **Into the fruit (NaCl, lactic acid) FASTER than out of it (sugar, malic acid)** — NaCl ~2.2–5.1× the sugar rate | Fasina 2002 (STRONG) |
| Activation energies | **Sugar 6.3, malic 6.5 kcal/mol (26–27 kJ/mol) going OUT; NaCl 4.5, lactic 4.2 kcal/mol (18 kJ/mol) going IN** | Potts 1986 (STRONG) |
| Commercial practice timing | **18–24 h** in acidified brine, then adjust to pH 4.5 and inoculate | Potts 1986 (STRONG) |
| Hollow/bloater cause | **Microbially produced CO₂, mostly from malic acid decarboxylation, trapped in tissue** | Fasina 2002; Zhai 2018 (STRONG) |

---

## 5(e) Dry-salt (shredded cabbage) vs brine (whole vegetables) — does the salt distribution difference matter for rate?

### 5e.1 — The two methods, and why they differ physically

- *"In the production of sauerkraut, **dry salt is added to the shredded cabbage**, while **a brine is added to cucumbers, olives and root crops**."*
- **Source:** Andersson, Daeschel & Eriksson 1988, p210, URL above. **Confidence:** STRONG (direct quote).
- **Physical difference ([CALC] / reasoning):**
  - **Dry salting shredded cabbage:** the salt is applied to an enormous specific surface area (shreds ~1–2 mm thick), dissolves in the water the salt itself draws out of the tissue, and the resulting brine is formed *in situ*. **There is no long diffusion path.** Equilibration is essentially immediate relative to any fermentation timescale.
  - **Brining whole vegetables:** the salt must traverse **skin and centimetres of tissue**. This is exactly the Potts 1986 / Fasina 2002 problem — **days to weeks** (5d).
  - **So the answer to "does dry salting give a more uniform, faster start?" is yes on physical grounds** — but I want to be precise about what is measured and what is inferred.

### 5e.2 — Measured evidence

- **Salt and sugar are immediately available in shredded cabbage — measured.** From Fleming 1987 (p201, URL above): *"When the salted cabbage was placed in the tank, **fermentation soon began** with resultant acid production and a lowering of pH (Fig. 3). **Rate of acid production during the fermentation was relatively rapid during the gaseous stage**, slowed at about 8 days, and then increased again."*
  - Raw cabbage microflora measured: **1.3 × 10⁵ total aerobes, 3.9 × 10³ Enterobacteriaceae, only 4.2 × 10¹ lactic acid bacteria per g cabbage** — and yet *"the lactic acid bacteria predominated within about 4 days after the shredded cabbage was salted"* (Fig. 6). LAB peaked at ~5 days, declined until ~8 days, then the homofermentative *L. plantarum* took over.
  - **Confidence:** STRONG for the numbers; MODERATE for the "dry salt causes this" attribution, because Fleming's fermentor work does not include a brine-method control.
- **Quantitative evidence that SALINITY UNIFORMITY matters — the strongest available:** Stamer et al. 1971 (below, §5f) measured that **2.25% salt extended lag phases from 1 to 4 hours, and 3.5% salt extended lag phases further and lengthened generation times substantially.** Since lag phase is exquisitely sensitive to the *local* salt concentration the cells experience, **any non-uniformity in salt distribution translates directly into a distribution of lag times and therefore a slower, more variable overall start.** This is a strong mechanistic argument. **Confidence:** STRONG for the salt-kinetics data; **MODERATE for the inference** that dry salting's uniformity is what makes it fast — no study directly compares salt uniformity vs rate.
- **The traditional practice acknowledges the problem:** the ARS source notes for salt generally that *"sufficient amounts must be added to extract from the plant cells the nutrients required to support growth of the lactic acid bacteria"*, and for cucumbers specifically the brine must reach equilibrium. **Root crops are fermented in a brine containing about 1.5% NaCl** (Andersson et al. 1988, p210) — a lower brine strength than sauerkraut's dry-salt equivalent, consistent with brine-method products needing lower nominal salt because it is the *equilibrated tissue* concentration that matters, not the brine concentration.

### 5e.3 — KIMCHI: the one place with a measured salt-distribution intervention

Kimchi cabbage is **dry-salted** (traditionally) and the salting step is the production bottleneck. There is now a direct mass-transfer study:

- **Source:** Yang, H.-I., Min, S.-G., Yang, J.-H., Lee, M.-A., Park, S.-H., Eun, J.-B. & Chung, Y.-B. (2024). "Predictive modeling and mass transfer kinetics of tumbling-assisted dry salting of kimchi cabbage." *Journal of Food Engineering* **361**: 111742. Chonnam National University and World Institute of Kimchi, Republic of Korea.
- **URL:** https://www.sciencedirect.com/science/article/pii/S0260877423003400 · DOI: 10.1016/j.jfoodeng.2023.111742
- **Confidence:** MODERATE–STRONG for the diffusion-coefficient ratio (peer-reviewed, kinetic modelling, R² reported); MODERATE for generalisation, since tumbling is an industrial intervention and the endpoint measured is tissue salt content and texture, not pH/time.
- **THE HEADLINE NUMBER:** *"The effective salt diffusion coefficient (Dₑ) during tumbling-assisted dry salting (TADS) increased by **29.12 times** compared to that during conventional salting (CS)."*
  - **[CALC]:** this means salt penetration into *whole* kimchi cabbage quarters, which conventionally takes many hours, can be accelerated ~29× by mechanical agitation. **This is the strongest quantitative evidence I found that salt *distribution* — not just salt *concentration* — is a first-order determinant of the time to start a fermentation.**
  - The salted cabbage was *"comparable"* in texture and appearance to conventionally salted, and the authors propose TADS "for rapid KC salting and applied to other osmotic agents and products, such as vegetables and fruits."
  - **Note the direction of the effect:** agitation raises the **surface mass-transfer coefficient**, which is the rate-limiting step. This is precisely the mechanism that would make **daily stirring or punching-down of a brine-fermented whole vegetable** matter — and it is the closest thing to evidence for the practice that I found anywhere (see 4e). **But it is tumbling, not stirring, and the endpoint is salt content, not pH.**

### 5e.4 — Answer for 5(e)

- **Dry salting shredded cabbage vs brining whole vegetables: the salt-distribution difference is large and physical.** Shreds equilibrate essentially instantly; whole cucumbers take **t₉₅ of 1.8–17.6 days for salt and 6.4–67 days for sugar** (5d).
- **Does it matter for rate? Yes, on strong mechanistic grounds and one strong empirical proxy:** the kimchi tumbling study shows a **29.12× increase in effective salt diffusivity** from mechanical agitation; and Stamer 1971's lag-phase data (1 h → 4 h at 2.25% salt) shows lag is acutely salt-sensitive, so non-uniform salt means non-uniform lag.
- **Honest limit:** **no study directly compares dry-salted vs brine-salted cabbage (or the same vegetable by both methods) with pH/time as the outcome.** The claim that dry salting gives a "more uniform, faster start because salt and sugar are immediately available" is **well supported by physics and by adjacent measurements, but is not itself the subject of a controlled experiment I could locate.** I am flagging that explicitly.

---

## 5(f) Salt concentration vs time-to-pH-4.0 — the rate-vs-salt curve, including the optimum and the >3% slow-down

**This is well quantified. Three independent lines of evidence converge on 2.0–2.5% as optimal and >3% as inhibitory.**

### 5f.1 — THE quantitative rate-vs-salt curve: Stamer, Stoyla & Dunckel 1971

- **Source:** Stamer, J.R., Stoyla, B.O. & Dunckel, B.A. (1971). "Growth Rates and Fermentation Patterns of Lactic Acid Bacteria Associated with the Sauerkraut Fermentation." *Journal of Milk and Food Technology* **34**(11): 521–525. New York State Agricultural Experiment Station, Department of Food Science and Technology, Cornell University, Geneva, NY.
- **URL:** https://www.foodprotection.org/upl/downloads/journal-archive/journal-of-milk-and-food-technology-1971-volume-34-issue-11.pdf (full issue PDF; the paper begins at p. 521)
- **Confidence:** STRONG (pure-culture kinetics, 5 species, 5 salt levels × 4 pH levels, replicated, in a real substrate — filter-sterilised **cabbage juice**, not a synthetic medium).
- **Study quality:** high for a 1971 paper. The design is exactly right: it isolates the salt effect on each species' growth and acid-production kinetics in the actual fermentation substrate. Limitation: **pure cultures**, so it does not capture species interactions; and growth was at **30 °C**, not the 18 °C commercial sauerkraut temperature.

**MEASURED — maximum acid production rate (meq titratable acid per 100 mL juice per hour during logarithmic growth), cabbage juice at pH 6.2, 30 °C** (their Table 2):

| Culture | **No added salt** | **2.25% NaCl** | **3.50% NaCl** | Total acid after 10 d (%) |
|---|---|---|---|---|
| ***Leuconostoc mesenteroides*** C33 | **0.87** | **0.56** | **0.20** | 1.04 |
| ***Lactobacillus plantarum*** B246 | **0.43** | **0.35** | **0.30** | 1.40 |
| *Lactobacillus brevis* B155 | 0.39 | 0.33 | 0.10 | 1.06 |
| *Pediococcus cerevisiae* E66 | 0.60 | 0.55 | 0.50 | 0.90 |

**The authors' own summary of the curve:**
- *"The addition of **2.25% NaCl**, a concentration often used in commercial fermentations, **reduced the maximum acid rates of all cultures tested**. The most pronounced inhibition, **37%, was noted with *L. mesenteroides*** and the least retardation, **8%, with *P. cerevisiae*."*
- *"Increasing the salt level to **3.5%**, a level occasionally encountered in commercial practice because of over-salting or improper distribution of salt, produced a **90% reduction in the acid rates of the heterolactic species**. Under similar conditions the acid values of the homofermentative species *L. plantarum* were **reduced 30%**, whereas *P. cerevisiae* was inhibited only **16%**."*
  - **⚠️ Honest note:** the "90%" figure does not match the table, which shows *L. mesenteroides* 0.87 → 0.20 (**−77%**) and *L. brevis* 0.39 → 0.10 (**−74%**). **I am reporting both: the table values are the measured data; the 90% is the authors' prose summary.** I cannot reconcile them and will not silently prefer one.
- ***"Thus, salt concentrations in addition to influencing growth rates may significantly alter the rates of acid production — a condition which could lead to an undesirable imbalance of the proper acid ratios of the fermented product."***

**MEASURED — lag and generation times** (their Table 1, minutes; L = lag, G = generation time), pH 6.2:

| Culture | No salt (L / G) | **2.25% NaCl (L / G)** | **3.50% NaCl (L / G)** | G at 3.5% vs no salt |
|---|---|---|---|---|
| *L. mesenteroides* C33 | 180 / **40** | 250 / **43** | 360 / **66** | **+65%** |
| *L. plantarum* B246 | 330 / **43** | 420 / **45** | 540 / **72** | **+67%** |
| *L. brevis* E155 | 215 / **83** | 270 / **91** | 360 / **110** | **+33%** |
| *P. cerevisiae* E66 | 360 / **41** | 400 / **43** | 510 / **40** | **−2% (unaffected)** |
| *Streptococcus faecalis* 8043 | 240 / 78 | 300 / 107 | 340 / 267 | +242% |

**This is the clearest available statement of the ">3% slows it" claim:**
- *"The addition of 2.25 or 3.5% salt to cabbage juice, pH 6.2, **extended the lag phases from 1 to 4 hr**. **Once the cells had become acclimated to the 2.25% concentration, generation times, with the exception of *S. faecalis*, were comparable to those observed in juice containing no added salt. However, increasing the salt level to 3.50% extended the lag phases of all organisms.** Generation times of the cultures, with the exception of *P. cerevisiae*, likewise were extended."*
- **[CALC] the key comparison:** at **2.25%**, generation times were **within 5–10% of the no-salt values** (40→43, 43→45, 83→91 min). At **3.5%**, they were **33–67% longer** (40→66, 43→72, 83→110). **The break point is between 2.25% and 3.5%, which is exactly the empirical range the industry settled on.**
- ***Pediococcus cerevisiae* was the most salt-tolerant** (*"of the cultures examined, *P. cerevisiae* was the most salt tolerant"*), which the authors use to explain *"the occurrence of pediococci in krauts treated with high levels of salt."* **Confidence:** STRONG.

### 5f.2 — The optimum salt range, as codified

- **2.0–2.25%:** *"Pederson and Albury (1969) defined the optimum conditions for fermentation of cabbage into sauerkraut to be uniform salting of the shredded cabbage with **2.0% to 2.25% salt**… and fermenting at a temperature of 18 °C."*
  - **Source:** Johanningsmeier et al. 2007, p348, URL above. **Confidence:** STRONG as a restatement; original Pederson & Albury 1969 not retrieved.
- **2.25%:** *"a concentration often used in commercial fermentations"* (Stamer et al. 1971). **Confidence:** STRONG.
- ***Lc. mesenteroides* salt sensitivity range:** *"*Leuconostoc mesenteroides* is highly influenced in the range from **1 to 3.5%**, while *Pediococcus pentosaceus* can withstand higher NaCl concentrations."*
  - **Source:** Andersson, Daeschel & Eriksson 1988, p210, URL above. **Confidence:** STRONG (direct quote).
- **Upper limit for fermentation:** *"Pederson (1979) showed that about **10% NaCl in the brine is the upper limit for fermentation of vegetables** and that the growth of lactic acid bacteria is greatly retarded even below this concentration."*
  - **Source:** Andersson et al. 1988, p210. **Confidence:** STRONG as a restatement; MODERATE for the underlying value (second-hand).
- **Commercial cucumber brine strengths** (for contrast — note these are *brine* concentrations at a 50/50 pack-out, not tissue concentrations):
  - *"overnight dill" pickles: **2–4% NaCl**; "genuine dill" pickles: **4–5% NaCl**; "salt-stock" cucumbers: **5–8% NaCl** followed by an increase to **10–16%**.* (Andersson et al. 1988, citing Fleming 1984.)
  - **Confidence:** STRONG (direct quote).
  - **[CALC] ratio:** as p210 itself notes, *"the initial salt concentration used in pickle fermentations is **2 to 3-fold** that used in sauerkraut and root crop fermentations."*

### 5f.3 — Independent modern confirmation that 2.5% is the optimum

- **Source:** Yang, X., Hu, W., Xiu, Z., Jiang, A., Yang, X., Saren, G., Ji, Y., Guan, Y. & Feng, K. (2020). "Effect of salt concentration on microbial communities, physicochemical properties and metabolite profile during spontaneous fermentation of Chinese northeast sauerkraut." *Journal of Applied Microbiology* **129**(6): 1458–1471.
- **URL:** https://pubmed.ncbi.nlm.nih.gov/32677269/ · DOI: 10.1111/jam.14786
- **Confidence:** STRONG for the design (four salt levels, spontaneous fermentation, microbiological + physicochemical + metabolomic + sensory endpoints); MODERATE for generalisation beyond northeast Chinese sauerkraut. **Full text is paywalled — I have the abstract only, so I can quote the direction and the salt levels but NOT the pH/time values.**
- **Design:** spontaneous fermentation at **four salt concentrations: 0.5, 1.5, 2.5 and 3.5% (w/w)**.
- **Findings, verbatim from the abstract:**
  - *"the population of lactic acid bacteria in **2.5%-salted sauerkraut was significantly higher** than that in the other samples."*
  - *"Correspondingly, **the speed of decrease in pH and accumulation of acids were the highest in 2.5%-salted sauerkraut**."*
  - *"The glucose… in 2.5%-salted sauerkraut was consumed **more completely** to produce higher levels of organic acids compared to those in the other samples."*
  - *"sensory evaluation demonstrated that 2.5%-salted sauerkraut had the best sensory characteristics."*
  - Conclusion: *"The best quality of sauerkraut was obtained from fermented under 2.5% salt concentration."*
- **This is the single best modern confirmation of the inverted-U: 2.5% beats both 1.5% and 3.5%.**
- **NO DATA:** the **absolute pH-vs-time values** at each salt level are behind the paywall. **I cannot give you "days to pH 4.0 at 1.5 / 2.5 / 3.5%" from this paper.** I am flagging that rather than estimating it.

### 5f.4 — Reduced-salt fermentations and the limits of salt reduction

- **Source:** Johanningsmeier, S.D., McFeeters, R.F., Fleming, H.P. & Thompson, R.L. (2007). "Effects of *Leuconostoc mesenteroides* Starter Culture on Fermentation of Cabbage with Reduced Salt Concentrations." *Journal of Food Science* **72**(5): M166–M172. USDA-ARS, Raleigh.
- **URL:** https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf
- **Confidence:** STRONG (3 × 2 factorial design, 3 jars per treatment, 10 months storage, trained sensory panel, Kramer shear texture).
- **Design:** shredded cabbage salted at **0.5%, 1.0% or 2.0% NaCl (wt/wt)**, with or without *Lc. mesenteroides* LA 81 (ATCC 8293) starter at **10⁶ CFU/g**, 1-gal glass jars, **18 °C**, sampled at 0.5, 1, 2, 3, 6, 10 and 17 days.
- **Findings:**
  - *"Cabbage fermented with *L. mesenteroides* consistently resulted in sauerkraut with firm texture and reduced off-flavors **across all salt levels (P < 0.05)**."*
  - *"**Conversely, sauerkraut quality was highly variable, with softening and off-flavors occurring as salt concentrations were decreased in natural fermentations (P < 0.05).**"*
  - *"**Fermentations were rapid, with a more uniform decline in pH when starter culture was added.**"*
  - *"*L. mesenteroides* addition to cabbage fermentations ensured that texture and flavor quality were retained, while allowing **50% NaCl reduction**."*
  - Practical aside with a number: *"In laboratory-scale fermentations, reduction of salt from 2.0% to 1.0% resulted in a **19% reduction in liquid loss** from the cabbage."*
- **Interpretation for 5(f):** **below ~2% salt, the fermentation becomes unreliable — but a starter culture compensates.** So the optimum salt range is partly an artefact of relying on the wild microbiota: with an adequate starter you can go to 1.0%, and the reason low salt fails without one is competitive exclusion by spoilage organisms, not a failure of LAB kinetics. **This is a genuinely useful nuance and it is directly evidenced.**

### 5f.5 — Answer for 5(f) — the rate-vs-salt curve

**Consolidated, from measured data:**

| Salt (% NaCl) | Effect on maximum acid-production rate | Effect on generation time | Effect on lag | Overall verdict |
|---|---|---|---|---|
| **0%** | Reference (highest) | Reference | Reference (shortest) | Fast but **microbiologically unsafe/uncontrolled** |
| **2.0–2.25%** | **−8% to −37%** depending on species (greatest hit on *Lc. mesenteroides*) | **+5% to +10% — essentially unchanged** | **1 h → 4 h** | **OPTIMUM.** Best combination of speed, control and quality |
| **2.5%** | (not measured by Stamer) | — | — | **Confirmed optimum in modern 4-level trial: fastest pH drop, highest LAB, best sensory** |
| **3.5%** | **−74% to −77%** (heterolactic); **−30%** (*L. plantarum*); **−16%** (*P. cerevisiae*) | **+33% to +67%** (except *P. cerevisiae*, unaffected) | Further extended | **Clearly inhibitory — "over-salting or improper distribution of salt"** |
| **~10%** | — | — | — | **Upper limit for fermentation of vegetables** |

- **The optimum is 2.0–2.5% NaCl on shredded cabbage**, converged on by three independent sources (Pederson & Albury 1969 as restated by USDA-ARS; Stamer et al. 1971's kinetics; Yang et al. 2020's four-level trial).
- **>3% slows it — confirmed**, with the mechanism being both a **longer lag** and a **substantially longer generation time**, and with *Lc. mesenteroides* — the organism that *initiates* the sauerkraut fermentation — the **most salt-sensitive** relevant species.
- **NO DATA — the specific figure the brief asked for:** I could **not** find a published table of **"days to pH 4.0 at 1.5% / 2.5% / 3.5% salt"** in sauerkraut. The Yang et al. 2020 paper almost certainly contains it but is paywalled. **I am flagging this as a specific, actionable gap** — it would be obtainable by purchasing that paper, or by measuring it directly, and it is the single most useful missing number in Q5.

---

## 5(g) Does vessel material (glass / ceramic / plastic / HDPE) matter for rate or safety?

**Summary: for non-porous materials there is NO rate data at all — the distinction is a safety and quality one. Unglazed porous ceramic is the only class with a measured rate effect, and its mechanism is CO₂ *escape*, not O₂ *ingress*. The safety asymmetry runs against glazed ceramic: it is the only class with documented poisoning-level hazard.**

Full sourcing is in `fermentation-vessel-materials-report.md`. Key results:

### 5g.1 — Oxygen transmission rates — MEASURED/STANDARD values

- **HDPE: 39–72 cm³·mm/(m²·day·atm)** — equivalently **100–183 cm³·mil/(100 in²·day·atm)**, or a 25 µm film OTR of **1600 mL·m⁻²·d⁻¹** at 23 °C / 0% RH.
- **PP: 59–151**; **PET: 3.6–4.9**; **LDPE: 197–440** (same units).
- **CO₂ permeability of HDPE is ~3–4× its O₂ permeability: 112–295 cm³·mm/(m²·day·atm).**
- **Source:** Robertson, *Food Packaging: Principles and Practice*, 3rd ed. (2013), Tables 11.1/11.2, and Mathlouthi (2003). URL: https://www.wiley.com/legacy/wileychi/campbell_platt/supp/ta/ch11.pdf
- **Confidence:** MODERATE–STRONG. Well-established polymer-science data, internally cross-checked between two tables in the same source; ranges reflect commercial grade variation.
- **Glass: no finite room-temperature OTR is published and none is expected** — packaging engineering treats glass as an absolute barrier. **Glazed ceramic/stoneware: NOT CHARACTERISED** — no published OTR exists for a fired glaze on a ceramic body. **Stainless steel: zero** (bulk metals are impermeable).
- **UNGLazed porous ceramic IS characterised:** Korean *onggi* — porosity **4.72 ± 0.16%**, pore size **1–100 µm (mean 5 µm)**, gas permeability **1.701 × 10⁻¹⁸ m²**, gas permeance **3.4 × 10⁻³ mol·kPa⁻¹·m⁻²·h⁻¹**, liquid permeability **(4.58 ± 1.10) × 10⁻¹⁵ m²**, and **wall water loss 0.75 ± 0.18 g/h**.
  - **Source:** Kim & Hu (2023), *Journal of the Royal Society Interface* **20**(201): 20230034. https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/ **Confidence:** STRONG (open access, n = 3, direct measurement).

### 5g.2 — [CALC] Does wall permeability matter, given the headspace is already air?

**Largely NO — and the arithmetic is decisive.**
- 20 L HDPE bucket, 2 L headspace = **597 mg O₂** in the headspace.
- Wall (2 mm) + lid (1.5 mm) ingress ≈ **2.07 cm³/day ≈ 2.7 mg O₂/day** (range 2–7).
- **597 mg ÷ 2.7 mg/day ≈ 221 days.** The headspace holds ~220× more oxygen than the entire wall admits in a day.
- **Wall:lid split ≈ 81:19** — and that assumes a perfect lid seal. **The closure, not the wall, is the controlling oxygen path.**
- **Independent published confirmation of exactly this point:** Kim & Hu's *"hermetically sealed"* **glass** jar — impermeable wall — measured a gas permeability of **0.796 × 10⁻¹⁸ m²**, which they attribute **entirely to lid leakage**. The deliberately porous onggi was **1.701 × 10⁻¹⁸ m²** — only **2.1× higher**. **An impermeable-walled vessel leaked within a factor of 2 of a deliberately porous pot, because of its lid.**
- **A plastic bag liner is a far WORSE oxygen barrier than an HDPE wall:** 25 µm LDPE over the same area admits **~810 mg O₂/day** vs the 2 mm HDPE wall's **~2.2 mg/day** — **~370× worse**. **A liner's value is mechanical (submersion, excluding headspace), not barrier.**
- **Confidence:** MODERATE — the OTR inputs are well-sourced but the geometry, wall thickness and perfect-seal assumption are mine, and no study has measured this on a real bucket.

### 5g.3 — Does vessel material change the RATE? One real study.

- **Source:** Jeong et al. (2011), *International Journal of Food Science and Technology* **46**(10): 2015–2021. AGRIS record: https://agris.fao.org/search/en/records/65df8ed70f3e94b9e5d9d684
- **Design:** kimchi at 4 °C for 4 weeks in **glazed onggi, non-glazed onggi, PE containers, PP kimchi-refrigerator containers, stainless steel, and glass bottles** — the only study found covering all four material classes.
- **Findings:** onggi gave more stable acidity, **LAB 10⁸–10⁹ CFU/g at week 4**, springiness >50%, and better sensory/antioxidative/antiproliferative activity; **non-glazed > glazed**; gas permeability higher than PE and glass.
- **Corroborating measurement (Kim & Hu 2023, URL above; n = 3, 200 g salted cabbage, 2 wt% brine, 25 °C, 4.6 L onggi vs 1.9 L hermetic glass):**
  - CO₂ generation **0.695 vs 0.552 mmol/h → +26%, p = 0.0498**
  - Per mass: **3670 vs 2915 mg·kg⁻¹·day⁻¹**
  - **Internal CO₂ held at "less than half" the sealed-container level**; steady-state internal pressure **4.1 kPa**
  - **Mechanism: the porous wall VENTS CO₂** (relieving product inhibition) while positive internal pressure blocks contaminants — *not* oxygen ingress.
- **Confidence:** MODERATE–STRONG for the +26% CO₂ result (open access, n = 3, p = 0.0498 — marginal); MODERATE for Jeong 2011 (single trial, paywalled, so no numeric pH/acidity time series available).
- **CRITICAL INTERPRETATION:** the rate effect attaches to **porosity**, not to "ceramic." *A vitrified, well-glazed crock would be expected to behave like glass, and no study tests that.* **And the mechanism is CO₂ *exit*, not O₂ *entry* — which is the opposite of the folk rationale for ceramic crocks.** Also note onggi is **liquid-permeable** (0.75 g water/h through the wall, salt-flower formation) — it is not a closed system at all.
- **CRITICAL CORRECTION to a claim I made earlier in this review:** I initially concluded there was no glass-vs-plastic-vs-ceramic rate comparison. **There is one, and it is open access.**
  - **Source:** Liu, L., She, X., Chen, X., Qian, Y., Tao, Y., Li, Y., Guo, S., Xiang, W., Liu, G. & Rao, Y. (2020). "Microbiota Succession and Chemical Composition Involved in the Radish Fermentation Process in Different Containers." *Frontiers in Microbiology* **11**: 445.
  - **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC7146078/ · DOI: 10.3389/fmicb.2020.00445 (open access)
  - **Design:** radish fermented in **glass jars (GL), porcelain jars (PO) and plastic jars (PL)** — **10 L each, 3 kg radish, 6% NaCl, 22–25 °C** — i.e. **identical size and identical brine**, varying **only the material.** This is the controlled design the field otherwise lacks.
  - **Result:** *"The changes in pH values suggested that **PL may facilitate the quickest fermentation** of the pickles, while the process in **PO progressed at the lowest rate**."* pH 3.5 was reached on **day 4 in glass and plastic** vs **day 5 in porcelain** — a **~25% rate shift from material alone at identical volume.**
  - PL brine contained **higher lactic acid and threonine**; PO had more abundant volatile compounds. Nitrite peaked at **59.73 mg/kg in porcelain**.
  - **⚠️ AND THE COUNTERPOINT WITHIN THE SAME PAPER:** *"The container materials had **no significant influence on the microbial structure**, wherein *Lactobacillus* was the absolute dominant genus in all containers."* Material affected the **abundance of specific genera** (*Lactococcus*, *Pediococcus*) but not the overall community.
  - **Confidence:** MODERATE–STRONG for the rate ordering (open access, controlled for size and brine, pH measured over time); MODERATE for the magnitude (the day-4/day-5 figures come from the full text; the abstract confirms only the ordering PL > GL > PO).
  - **Interpretation:** this is genuinely awkward for a simple story. Porcelain was **slowest** here, yet unglazed porous onggi is **faster** in the Kim & Hu work. **The two are not in conflict if the mechanism is gas exchange rather than a material property per se:** porous unglazed onggi *vents CO₂* (helping), whereas a **glazed, vitrified porcelain jar is gas-tight and simply holds CO₂ in** — behaving like glass. The plastic jars in Liu 2020 were the fastest, plausibly because HDPE/PP have **finite O₂/CO₂ permeability** and can vent CO₂ through the wall. **This is my mechanistic reading, not something Liu et al. measured.**
- **Glass vs HDPE vs PP vs stainless steel in a single head-to-head: still NO DATA** for the full four-way set. Jeong 2011 grouped all four as "others"; Liu 2020 covers **glass vs porcelain vs plastic** only, with no stainless arm and no specification of the plastic resin.

### 5g.4 — SAFETY: lead and cadmium in glazed ceramic — the one class with a real hazard

- **FDA Compliance Policy Guide Sec. 545.450 (Lead, Nov 2005):** https://www.fda.gov/media/71764/download
  - Flatware (≤25 mm internal depth): **3.0 µg Pb/mL** (average of 6)
  - Small hollowware other than cups/mugs (<1.1 L, >25 mm depth): **2.0 µg Pb/mL** (any 1 of 6)
  - Cups and mugs: **0.5 µg Pb/mL**
  - **Large hollowware other than pitchers (≥1.1 L): 1.0 µg Pb/mL**
  - Pitchers: **0.5 µg Pb/mL**
- **FDA CPG Sec. 545.400 (Cadmium):** https://www.fda.gov/media/71762/download — flatware **0.5**; small hollowware **0.5**; large hollowware **0.25 µg Cd/mL**.
- **[CALC] applied to a crock:** a 5 L ceramic crock is **large hollowware** → **1.0 µg/mL Pb and 0.25 µg/mL Cd action levels.** Note the irony: **pitchers get the stricter 0.5 µg/mL Pb limit precisely because they hold acidic liquid at room temperature — which is exactly what a crock does — but the CPG as written assigns a crock 1.0.**
- **Leach test conditions:** FDA EAM Method 4.6 v1.0 (Jan 2020) — **4% acetic acid, filled to within 6–7 mm of overflowing, 24 h at 22 ± 2 °C**; same as AOAC 973.32/999.17 and ASTM C738-94. https://www.fda.gov/media/95170/download
- **MEASURED — real-world values:**
  - Belgaied (2003), *Food and Chemical Toxicology* **41**(1): 95–98 — Tunisian glazed mugs leached **up to 51 µg Pb/mL** into acetic acid (**~100× the 0.5 µg/mL limit**); *leben* (fermented milk) took up **up to 1407 µg Pb per mug**. https://pubmed.ncbi.nlm.nih.gov/12453733/ **Confidence:** MODERATE (single study, but a direct measurement).
  - Castellanos-Carrizal et al. (2026), *Journal of Public Health Management and Practice* **32**(2): 268–275 — 33 glazed-clay items, Reynosa, Mexico. **Only 1 of 8 cookware items passed** the Mexican leaching standard. **Acidic food: median 103.4 mg/kg Pb (IQR 14.8–186.1) vs non-acidic: 11.19 mg/kg (IQR 2.17–27.82), P < .05 → ~9× more lead from acidic food.** https://pubmed.ncbi.nlm.nih.gov/41576409/ **Confidence:** STRONG for the acidity effect (statistically tested, adequate n).
  - **FDA Q&A, Lead-Glazed Traditional Pottery (Nov 2010):** https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-lead-glazed-traditional-pottery — "lead free"-labelled Mexican pottery has been found with extractable lead **exceeding FDA action levels**, caused by underfiring **and kiln cross-contamination**. High-risk categories: handmade/crude, antique, damaged, flea-market, bright orange/red/yellow. **"No amount of washing, boiling, or other process can remove lead from pottery."** Do not use for cooking, serving **or storing**. **Confidence:** STRONG (authoritative).
- **⚠️ NO DATA — flagging precisely:** every lead/cadmium study I found tested **mugs, plates, cookware or decorative ware — not a purpose-built fermentation crock.** Substituting teaware data for crock data is extrapolation. Also unstudied: **lactic acid** leaching (only acetic was tested — yet lactic is the actual fermentation acid), and **multi-week** extraction (all standard tests are **24 h** vs a 1–4 week fermentation — a longer and more aggressive exposure than the compliance test covers).

### 5g.5 — Plastic leachates — the honest state of the evidence

- **Regulatory limits (STRONG):** EU Reg 10/2011 Art. 12(1): overall migration limit **10 mg/dm²**; Art. 12(2): **60 mg/kg** for infant/young-child food. https://www.legislation.gov.uk/eur/2011/10/article/12/data.xht?wrap=true · FDA 21 CFR 177.1520(c) resin extractables specs: https://www.law.cornell.edu/cfr/text/21/177.1520 (**note these are resin-level solvent extractables, NOT migration into food, and are not comparable to the EU OML**).
- **Measured HDPE values (all in WATER, not brine):** HDPE sachets, 8–40 °C, 28 days → DMP 0.27–1.83 µg/L, DEP 0.55–1.96, DBP ND–2.59, BBP ≤1.03, DEHP <5 µg/L. PE film + **acetic acid** simulant → **DEHP ≤1.64 mg/kg, BBP ≤0.45 mg/kg** (the only PE + acetic acid entry found; film, not vessel).
- **Acidity and temperature increase migration** — confirmed by a PRISMA systematic review (Badarou et al. 2025, *Curr. Res. Nutr. Food Sci.* 13(3):1079–1105, https://www.foodandnutritionjournal.org/download/24945; 1317 records → 45 studies; MODERATE, PET/PVC-dominated scope).
- **⚠️ NO DATA — the biggest gap in Q5(g):** I found **nothing** on (1) overall migration from HDPE/PP into **pH < 4, 2–5% NaCl brine over 1–4 weeks**; (2) specific migrants (Irganox 1010/1076, Irgafos 168, erucamide, oligomers, NIAS) from an HDPE/PP **vessel** into mash/brine; (3) **any measurement from a food-grade plastic bucket used for sauerkraut, kimchi or pickles**; (4) microplastic release from the vessel; (5) the effect of **lactic acid** (only acetic acid data exists); (6) NaCl / ionic-strength effects. **Anyone quoting a number for "how much leaches into sauerkraut from a plastic bucket" is inventing it.**

### 5g.6 — Answer for 5(g)

- **Rate:** only **unglazed porous ceramic** shows a measured effect (**+26% CO₂ generation, p = 0.0498**; LAB 10⁸–10⁹ CFU/g at 4 weeks), and the mechanism is **CO₂ escape, not O₂ ingress**. **No rate data exists comparing glass vs HDPE vs PP vs stainless.** Vessel material is a **second-order** variable for rate compared to salt, temperature and oxygen.
- **Oxygen in one line:** the headspace holds **~220× more O₂ than the wall admits per day**, and closures leak more than walls (glass jar with a lid ≈ porous pot, within 2×). **Eliminate headspace and seal well; wall material is not the oxygen problem.**
- **Safety — the asymmetry runs AGAINST the artisanal option.** Glazed ceramic is the **only** class with documented poisoning-level hazard: **1.0 µg/mL Pb / 0.25 µg/mL Cd** action levels for a crock; real ware measured at **51 µg Pb/mL** and **103.4 vs 11.19 mg/kg for acidic vs non-acidic food (~9×, P < .05)**; **7 of 8 items failed** in one survey; "lead free" labels are unreliable; and a **1–4 week acidic fermentation is a longer, more aggressive exposure than the 24 h compliance test — uncharacterised.** HDPE/PP are the best-characterised by regulation, but the migration question that actually matters is unstudied. **Glass and stainless steel have no identified leaching pathway into acidic brine and are the conservative safety choice.**

---

# CONSOLIDATED NO-DATA REGISTER

Explicitly listing what I could **not** find, so these are not mistaken for settled questions:

**Q4:**
1. ~~No numeric USDA/extension headspace specification~~ → **RESOLVED, and the sources disagree:** USDA and Oregon State say **4–5 inches (10–13 cm)**, Penn State says **3–4 inches (7.5–10 cm)**. See 4b.1.
2. **No study varying headspace volume as an independent variable** with pH/time as the outcome. (The *oxygen* composition of the headspace has been varied — Yu et al. 2023 — but not its *volume*.)
3. **No side-by-side of open crock vs airlocked jar vs bag-and-weight vs vacuum in one experiment.** *Partially resolved:* Satora & Strnad 2024 compares **glass+airlock vs stoneware+LDPE foil+stones** with a full pH trajectory (4d.0) — but it confounds material with closure and has no open or vacuum arm.
4. **No independent experimental test of a Harsch crock or any branded water-seal vessel** — and the claim is now **UNVERIFIABLE rather than merely untested**: the manufacturer's site is dead and essentially unarchived (the Wayback Machine holds only a 2005 robots.txt), so **no verbatim manufacturer claim can be retrieved.** The nearest source is a 2015 book excerpt. No lab study, extension trial, thesis, or German-language paper tests a water-seal crock against any control.
5. **No vacuum-fermentation study** with a non-vacuum control. **No peer-reviewed controlled pH/time data for vacuum-sealed-bag sauerkraut vs a control.** The accessible Noma-style method is just "2% salt by weight" with no pH/day figures. Korean vacuum-packaged-kimchi literature exists but its numeric pH data could not be retrieved. **Conceptual point: vacuum sealing does not remove the headspace problem — it converts it into package volume-expansion/pressure.**
5b. **ZERO data for Fido jars, silicone airlock lids, waterless valves and "pickle pipes"** — marketing claims with no comparative experimental support at all.
6. **No study on stirring / daily pressing / punching down** measuring pH/time. None at all.
7. **No quantification of mould incidence as a function of %O₂ or oxygen flux** in vegetable fermentation.
8. **No sauerkraut mould-pH study** — the classic citation is tomato juice (Mundt 1978). Zero hits for sauerkraut + botulinum.
9. **No mycotoxin measurements in sauerkraut or kimchi.** Seo et al. 2020 states outright that none exist for kimchi.
10. **No mould species isolation from sauerkraut surfaces.**
11. **No sauerkraut brine a_w data**; no NaCl-inhibition data for moulds on fermented vegetables.
12. **"Kahm yeast grows pH 2.5–8.0, optimum 4.0–4.5" is untraceable to any primary source.** Do not cite it.
13. **"Moulds grow pH 1.5–11" is untraceable to any primary measurement.**
14. **No study prospectively comparing pH/time in kahm-contaminated vs clean fermentations.**
15. **The anaerobic μ for *Lc. mesenteroides* (Plihon 1995)** — the paper is bot-protected; only the aerobic μ_max of 0.69 h⁻¹ is obtainable.
16. **No data for *Candida lambica* or *Pichia anomala* in sauerkraut/kimchi.**
17. ~~Kimchi headspace gas time-series~~ → **RESOLVED** (Kang et al. 2003; O₂ 14.3%→1.3%, CO₂ 27.7%→45.3%, pH 4.3→3.8 over day 2→27 at 5 °C). Reported at MODERATE confidence — see 4b.3.
18. **Satora & Strnad 2024 full text** — abstract verified via Unpaywall + Semantic Scholar; MDPI and DOAJ both blocked, so the day-by-day pH table is reported at MODERATE confidence only.
19. **Humphries & Fleming 1988 full text** — the 40 SCFH flow rate and 1–3% headspace CO₂ are STRONG; the 71 mg/100 mL under-purge value is MODERATE (secondary reading).

**Q5:**
18. **No measured temperature-lag data for any fermenting vegetable vessel.**
19. **No verified silage temperature-lag number** retrieved in this pass (flagged rather than filled).
20. **No direct "bigger batch ferments faster/slower" rate measurement.**
21. **No study comparing dry-salted vs brine-salted cabbage with pH/time as the outcome.**
22. **NO published table of "days to pH 4.0 at 1.5% / 2.5% / 3.5% salt"** in sauerkraut. Yang et al. 2020 very likely contains it; it is paywalled. **This is the single most actionable missing number.**
23. **Glazed ceramic/stoneware OTR is not characterised.**
24. **No container-glass room-temperature O2 permeability value published.**
25. **No activation energy for O₂ permeation through HDPE** (the Mrkić 2007 paper is paywalled).
26. **No migration measurement from an HDPE/PP vessel into pH<4 brine over 1–4 weeks**; nothing from a food-grade plastic bucket into sauerkraut; no lactic-acid migration data (only acetic).
27. **No lead/cadmium data from a purpose-built fermentation crock**; no multi-week lead extraction data.
28. **No rate comparison glass vs HDPE vs PP vs stainless steel.**

---

# THE SHORT VERSION

**Q4.** Oxygen exclusion is **primarily a spoilage-control measure**, and that is what the ARS statement's own rationale says. But it is **also** a rate variable, with a steep dose–response: in cucumbers at 23–28 °C, N₂-purged brines reached **pH 3.4 / 1.1% acid by day 14**, air at 5 mL/min/gal reached **pH 3.7 / 0.7%**, and air at 100 mL/min/gal **consumed all the acid and went above pH 7.0 by day 14**. The low-aeration arm is already 2–5× commercial purge rates, so realistic aeration costs far less. In kimchi at 4–5 °C, oxygen **did not change the LAB rate at all** — but it grew yeast, mould and coliforms and pushed pH **up** from 4.22 to 4.39. **The best vessel side-by-side (Satora & Strnad 2024) shows glass+airlock reaching pH 3.8 on day 10 while stoneware+LDPE foil was still at pH 3.86 on day 14, with 50% less lactic acid** — the vessel that established anaerobiosis fastest won, and the gap was widest at day 3. Headspace: **USDA and Oregon State say 4–5 inches (10–13 cm); Penn State says 3–4 inches (7.5–10 cm)** — a real, citable disagreement; the CO₂ blanket forms in **~48 h** and sauerkraut generates **2.4–3.0 L CO₂ per kg cabbage**. Kahm yeast: **salt does not suppress it** (isolates grew at 10% NaCl; 20% NaCl killed none of 5 kimchi strains), it is **not itself toxic** (formal toxicology exists), but it **raises pH** — and mould can take pH from 4.2 to 7.8 and enable *C. botulinum*, whose floor is pH 4.6–5.24. **Stirring: no data exists.** The LAB are **aerotolerant and grow better with oxygen**; oxygen ruins ferments by feeding the competition.

**Q5.** The real size effect is **thermal buffering**, not speed: from measured cabbage/vegetable properties (k = 0.43–0.47 W/m/K; α = 1.15 × 10⁻⁷ m²/s), **τ = 0.94 h for a 1 L jar vs 6.90 h for a 20 L crock — a 7.37× ratio = 20^(2/3)** — and the diurnal penetration depth in cabbage is only **5.6 cm**, so a 1 L core sees **~43%** of a 24 h ambient swing while a 20 L core sees **~10%, lagged ~9 h**. Temperature itself is the big rate lever: **~1.6–2.3× per 6–7 K** by three independent routes (and the range **141 h at 25–28 °C vs still going at 423 h at 20 °C** in the classic barrel study). **Salt diffusion into whole cucumbers is the best-quantified thing in this brief:** salt reaches **95% equilibrium in 1.8–17.6 days** and sugar — the actual rate-limiting solute — in **6.4–67 days**, with **peeling speeding it 3.7–11.1×** and no significant interior gradient for sugar (Biot < 10). Commercial practice waits only **18–24 h**, then inoculates. **The salt optimum is 2.0–2.5%, and >3% demonstrably slows fermentation**: generation times rise from ~43 min at 2.25% to ~66–72 min at 3.5%, and acid-production rates fall 74–77% in the heterolactic species that start the fermentation. **Vessel material DOES measurably change rate** — the one controlled same-size comparison (radish, 10 L glass vs porcelain vs plastic, 6% NaCl, 22–25 °C) put **pH 3.5 at day 4 in glass and plastic vs day 5 in porcelain (~25%)**, and porous onggi gave **+26% CO₂ generation** — but the dominant oxygen path is the **closure, not the wall** (a 2 L headspace holds ~**220× more O₂ than a 2 mm HDPE wall admits per day**; a "hermetic" glass jar leaked within **2×** of a porous pot, through its lid). **Vessel size is a second-order variable compared to salt, temperature and oxygen.** Safety asymmetry: glazed ceramic is the only class with documented lead hazard, at **1.0 µg/mL** action level for a crock.

---

## SOURCE LIST (all URLs verifiable)

**USDA-ARS "Pickle Pubs" (scanned PDFs, OCR'd for this report):**
- p138 — Potts & Fleming 1979, *J Food Sci* 44(2):429–434 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p138.pdf
- p149 — Daeschel & Fleming 1981, *Appl Environ Microbiol* 42(6):1111–1118 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p149.pdf
- p125 — Fleming, Etchells, Thompson & Bell 1975, *J Food Sci* 40(6):1304–1310 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p125.pdf
- p313 — Fleming, Humphries, Thompson & McFeeters 2002, *Pickle Pak Sci* VIII(1):38–43 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p313.pdf
- p151 — Potts & Fleming 1982, *J Food Sci* 47(5):1723–1727 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p151.pdf
- p145 — Fleming & Pharr 1980, *J Food Sci* 45(6):1595–1600 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p145.pdf
- p190 — Potts, Fleming, McFeeters & Guinnup 1986, *J Food Sci* 51(2):434–439 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p190.pdf
- p201 — Fleming 1987, Sauerkraut Seminar, NY State Agric. Expt. Sta. Special Report No. 61:26–32 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf
- p204 — Fleming, McFeeters, Daeschel, Humphries & Thompson 1988, *J Food Sci* 53(1):127–133 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p204.pdf
- p210 — Andersson, Daeschel & Eriksson 1988, 8th Int. Biotechnol. Symp., pp. 855–871 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf
- p299 — Fasina, Fleming & Thompson 2002, *J Food Sci* 67(1):181–187 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p299.pdf
- p348 — Johanningsmeier, McFeeters, Fleming & Thompson 2007, *J Food Sci* 72(5):M166–M172 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf
- p423 — Zhai, Pérez-Díaz & Díaz 2018, *Trends Food Sci Technol* 81:185–192 — https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p423.pdf
- Full ARS bibliography (462 items): https://www.ars.usda.gov/southeast-area/raleigh-nc/fsmqhru/docs/fermented-acidified-vegetables-bibliography/

**Other primary sources:**
- Preuss, Peterson & Fred 1928, *Ind Eng Chem* 20(11):1187–1190, DOI 10.1021/ie50227a021 — https://datapdf.com/gas-production-in-the-making-of-sauerkraut192c7bc2810c0b7a596dee83c9665ce9197121.html
- Stamer, Stoyla & Dunckel 1971, *J Milk Food Technol* 34(11):521–525 — https://www.foodprotection.org/upl/downloads/journal-archive/journal-of-milk-and-food-technology-1971-volume-34-issue-11.pdf
- Yu et al. 2023, *J Food Sci Technol* 60(10):2695–2703 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10439095/
- Satora & Strnad 2024, *Applied Sciences* 14(1):236 — https://www.mdpi.com/2076-3417/14/1/236 · DOI: 10.3390/app14010236
- Liu, She, Chen, Qian, Tao, Li, Guo, Xiang, Liu & Rao 2020, *Frontiers in Microbiology* 11:445 — https://pmc.ncbi.nlm.nih.gov/articles/PMC7146078/ · DOI: 10.3389/fmicb.2020.00445
- Kang, Lee & Min 2003, *J Food Sci* 68(3), DOI 10.1111/j.1365-2621.2003.tb08254.x — https://ift.onlinelibrary.wiley.com/doi/10.1111/j.1365-2621.2003.tb08254.x
- Kim et al. 1991, *Korean J Food Sci Technol* 23(3):325 (cabbage thermal conductivity)
- Muramatsu et al. 2020, *Food Sci Technol Res* 26(6):717 (root-vegetable thermal diffusivity, open access)
- Ahn et al. 2009, *Bioresource Technology* 100:3974 (USDA-ARS silage thermal properties)
- Barrena et al. 2006, *Waste Management* 26:953 (compost thermal inertia, 13,500 kg pile)
- Zwietering et al. 1994, *Appl Environ Microbiol* 60:195 (Ratkowsky parameters for *L. plantarum*)
- Jung et al. 2024, *Heliyon* 10:e27174 (kimchi temperature-rate, 4 vs 10 °C)
- Du et al. 2022, *Foods* 11(12):1762 (sauerkraut storage Ea — storage, not fermentation)
- Satora et al. 2020, *Int J Mol Sci* 21(24):9699 — https://pmc.ncbi.nlm.nih.gov/articles/PMC7767181/
- Fleming, Etchells, Thompson & Bell 1975, *J Food Sci* 40(6):1304–1310 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p125.pdf
- Humphries & Fleming 1988, *Applied Engineering in Agriculture* 4(2):166–171; and 1989, *J Agric Eng Res* 44:133–140 — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p216.pdf
- USDA Complete Guide to Home Canning (2015 rev., AIB-539), Guide 6 — https://archive.org/details/usda-complete-guide-to-home-canning-2015-revision
- Oregon State University Extension, PNW 355 *Pickling Vegetables* — https://extension.oregonstate.edu/catalog/pnw-355-pickling-vegetables
- Penn State Extension, *Let's Preserve: Fermentation — Sauerkraut and Pickles* — https://extension.psu.edu/sauerkraut
- Yang et al. 2020, *J Appl Microbiol* 129(6):1458–1471 — https://pubmed.ncbi.nlm.nih.gov/32677269/
- Yang et al. 2024, *J Food Eng* 361:111742 — https://www.sciencedirect.com/science/article/pii/S0260877423003400
- Plihon, Taillandier & Strehaiano 1995, *Appl Microbiol Biotechnol* 43(1):117–122 — https://hal.sorbonne-universite.fr/UNIV-UT3/hal-02143226v1
- Smetanková et al. 2012, *Acta Chimica Slovaca* 5(2):204–210 — https://acs.fchpt.stuba.sk/index.php?id=7&paper=131
- Murphy & Condon 1984, *Arch Microbiol* 138(1):49–53, DOI 10.1007/BF00425406
- Huhtanen et al. 1976, USDA-ARS — https://pmc.ncbi.nlm.nih.gov/articles/PMC170388/
- Odlaug & Pflug 1979 — https://europepmc.org/articles/PMC243244
- Ito et al. 1976 — https://europepmc.org/articles/PMC170016
- Kim, M.-J. et al. 2021, *Foods* 10(3):645 — https://pmc.ncbi.nlm.nih.gov/articles/PMC8003234/
- Kim & Hu 2023, *J R Soc Interface* 20(201):20230034 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/
- UC Davis 2022, Troubleshooting fermented fruits and vegetables — https://ucfoodsafety.ucdavis.edu/sites/g/files/dgvnsk7366/files/media/documents/Troubleshooting%20fermented%20fruits%20and%20vegetables%20FINAL.pdf
- USDA/NCHFP sauerkraut — https://nchfp.uga.edu/how/ferment/recipes/sauerkraut
- FDA CPG 545.450 (lead) — https://www.fda.gov/media/71764/download
- FDA CPG 545.400 (cadmium) — https://www.fda.gov/media/71762/download
- FDA EAM Method 4.6 — https://www.fda.gov/media/95170/download
- FDA lead-glazed pottery Q&A — https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-lead-glazed-traditional-pottery
- Robertson, *Food Packaging* 3e tables — https://www.wiley.com/legacy/wileychi/campbell_platt/supp/ta/ch11.pdf

**Companion reports in this workspace:**
- `kahm_yeast_and_mould_report.md` — 681 lines, 71 URLs, full kahm/mould sourcing
- `fermentation-vessel-materials-report.md` — 442 lines, full OTR/leachate/lead sourcing
