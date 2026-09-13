# Quantitative parameters for lactic acid fermentation of vegetables
### QUESTION 2 — Particle size / pretreatment · QUESTION 3 — Inoculation / backslopping / starter cultures

**Compiled:** literature search, all sources retrieved and read during this session.
**Confidence key:** **STRONG** = peer-reviewed, replicated, real vegetable (not model medium), numeric outcome stated in the source. **MODERATE** = peer-reviewed with numbers but a design limitation (single n, model medium, endpoint-only, confounded), or number only in a figure/full text. **WEAK-or-CONTESTED** = thesis, patent, conference abstract, historical, unreplicated, or contradictory evidence exists.
**Values marked EXTRAPOLATION are my arithmetic from reported endpoints, not measured rates.**

---

## EXECUTIVE ANSWERS (the numbers that matter most)

**QUESTION 2 — particle size / pretreatment**
1. **Cabbage, shredded vs leaf pieces (2 mm vs 6 × 8 cm), brined at 19 °C:** LAB reached 8 log CFU/g in **~5 days vs ~13 days** — **8 days, ~2.6× faster**; pH differs by **0.47 units at 86 h**. Cut surface was **~26× greater** in the shredded cabbage. *Valence et al. 2025, Peer Community Journal — STRONG.*
2. **Sauerkraut, shredded vs whole-head cabbage:** fermentation completed (pathogen-clear) in **15 vs 28 days** — **13 days**. Titratable acidity was **higher** in shredded even though final pH was **lower** in whole-head. *Niksic et al. 2005, J Food Prot — STRONG.*
3. **Kimchi, 3 × 3 cm "mat" vs 2-cut "pogi" at 6 °C:** LAB peak **9.09 vs 8.08 log CFU/g (+1.0 log, ≈10×)**; TA at week 2 **0.91% vs 0.73% (+25%)**; headspace CO₂ **8.5% vs 6.2%**. **Converged by week 5–6.** *Moon et al. 2019, World Institute of Kimchi — STRONG for rate.*
4. **Radish kimchi, 1 cm vs 2 cm vs 3 cm cubes:** LAB relative abundance highest and pH fall fastest in the **1 cm** cubes by day 5; **all differences gone by day 50.** *Choi et al. 2023, Food Chemistry: X — STRONG for direction.*
5. **Cucumber, sliced:** slicing eliminates the **18–24 h** pre-inoculation diffusion delay that whole cucumbers require; **0.2–0.5% acid within 24 h; >80% complete in 6 days** — but **total fermentation time "did not differ greatly" from whole cucumbers.** *Fleming et al. 1978, USDA-ARS — STRONG.*
6. **Freezing/thawing before fermentation: NO measured rate data exists**, and the direction of the available evidence is **negative** (freeze–thaw costs **>2 log LAB**; drip loss **28–52%**). Freezing is commercial **to stop** kimchi fermentation, not to start it.
7. **Blanching:** 75 °C/30 s changed cucumber fermentation **essentially not at all**; 77 °C/3.5 min **lowered final acidity from 1.14–1.30% to 0.76–0.88%** while raising firmness (3.1 → 7.9 at 0% NaCl); 55–65 °C blanching makes cabbage **1.6–1.8× firmer**. Blanching is a **texture/safety** tool, not a rate tool.
8. **Alkali (lye) treatment of olives is the extreme case and it mostly HURTS:** 1.3–2.6% NaOH for 8–14 h, then 9–10% brine; after **60–120 days** brine pH only reached **4.27 (from 5.04)** — many industrial batches never hit the pH 4.0 target because washing strips fermentable sugars.

**QUESTION 3 — inoculation / backslopping / starters**
9. **The only quantified "days saved" figure in the entire search: 5–7 days.** *L. mesenteroides* AA001 at 10⁶ CFU/g in three real vegetables took **4–7 days to pH 4.0 vs 9–14 days spontaneous.** *Zhao et al. 2026, Microorganisms — STRONG design.*
10. **Sauerkraut, the best paired datum: pH < 4.0 within 24 h with a *L. plantarum* + *L. mesenteroides* starter vs ~3 days without** (≈3× faster; ≈0.083 vs 0.028 pH units/h by my arithmetic). *Müller et al. 2018, Food Microbiology — STRONG.*
11. **Backslopping is NOT a meaningful rate lever: 80% v/v reused brine bought only +5% to +11%** on the acidification rate constant — while changing the **vessel** bought **+59% to +68%**. And **no peer-reviewed wild-vs-backslopped sauerkraut study exists at all.** *Zhang et al. 2023, Foods — STRONG.*
12. **Phages are real, abundant and can attack a vegetable starter (9 phages from two 90-ton sauerkraut tanks; φJL-1 specific for two cucumber starter strains) — but NO vegetable fermentation failure has ever been measured.** In cucumber, phage is mostly **protective** (5-log kill of *Enterobacter* within 3 h at MOI 1–100). *USDA-ARS corpus — STRONG; the failure claim is the gap.*
13. **Direction of the starter effect is CONTESTED:** a kimchi starter **delayed** pH 4.2 by **1.5×** (12 days at 10 °C) as a deliberate shelf-life play; a 1968 thesis found *L. plantarum* sauerkraut "slower in fermenting."
14. **Commercial starters: no branded retail vegetable starter has ever been independently tested, and none discloses a CFU dose.** The specific "ready in 5 days instead of 14" claim was **not found on any product page**. The big industrial houses (Novonesis, IFF/Danisco, Sacco, Lallemand) sell **plant-based *yoghurt* cultures, not vegetable starters**.

---

## 0. METHOD / EVIDENCE-BASE STATEMENT

Primary route for USDA-ARS work: the ARS Food Science and Market Quality Handling Research Unit (Raleigh, NC) **Fermented & Acidified Vegetables Bibliography** — <https://www.ars.usda.gov/southeast-area/raleigh-nc/fsmqhru/docs/fermented-acidified-vegetables-bibliography/> — with the individual PDFs (fetch tool returns HTTP 406 on these; `curl` works). Europe PMC REST API was used for verification of every DOI/PMID cited below.

Two structural warnings that apply to the whole report:

1. **"Days saved" is almost never reported.** Almost all sauerkraut and kimchi papers report pH only as a figure; I could not digitise those. Where I give days saved it is either stated in the source or explicitly labelled EXTRAPOLATION.
2. **Manufacturer claims were not used for any number in this report.**

---

# QUESTION 2 — PARTICLE SIZE / PRETREATMENT

## 2(a) Shredded vs sliced vs whole vs quartered — measured effects on pH / acidification rate

### FINDING 2a-1 ★ The single best-designed cut-size experiment (cabbage + carrot)
**Valence F, Junker R, Baty C, Rué O, Mariadassou M, Madec MN, Maillard MB, Bage AS, Chuat V, Marché L, Thierry A (2025). "The cutting type of vegetables influences the spontaneous fermentation rate." *Peer Community Journal* 5, article e49. INRAE / STLO Rennes + Vegenov + CTCPA.**
DOI: <https://doi.org/10.24072/pcjournal.553> · full text (HTML): <https://peercommunityjournal.org/articles/10.24072/pcjournal.553/> · PDF: <https://peercommunityjournal.org/item/10.24072/pcjournal.553.pdf>

Design: 2 vegetables × 2 cut types × 2 salt levels, **160 jars**, 19 °C, 7 months, 2–4 independent jars per time point; culturomics + 16S + *gyrB* metataxonomics + targeted metabolomics. Cabbage shredded on a 2 mm disk vs leaves cut to ~6 × 8 cm; carrot grated 3 mm vs 5 mm slices.

| Measured quantity | Thinly cut | Roughly cut | Difference |
|---|---|---|---|
| **Cabbage — LAB reaching 8 log CFU/g** | **~5 days** | **~13 days** | **8 days saved; ~2.6× faster** |
| Cabbage — LAB at T2 (86 h) | 7.5 log CFU/g | 4.6 log CFU/g | **3.0 log** |
| Cabbage — pH difference at T2 (86 h) | — | — | **0.47 pH units** |
| Cabbage — Enterobacteriaceae | **not detectable after 14 days** | **still detected at 1 month** (pH 3.2–4.4); 3 of 4 isolates *Hafnia alvei* | qualitative but categorical |
| Cabbage — raw → endpoint pH | pH 6.3 → 3.9 in ~2 weeks (all cabbage) | — | — |
| **Carrot — pH at T2 (64 h)** | **3.69** (grated) | **3.86** (sliced) | **0.17 pH units** |
| **Carrot — TTA at T2 (64 h)** | **0.76%** (grated) | **0.32%** (sliced) | **2.4× higher** |
| Carrot — Enterobacteriaceae at T2 | up to **2.8 log CFU/g lower** in grated | — | — |
| Carrot — raw → pH 3.8 | ~40 h (all carrot samples) | — | carrot is fast regardless |
| **Cut surface per g initial brine** | grated carrot **19 cm²**; shredded cabbage **9 cm²** | sliced carrot **8 cm²**; leaf cabbage **0.4 cm²** | cabbage **~26×**; carrot only **2×** |
| Minerals (K, P, Mg) in juice | **+18–32%** shredded vs leaf cabbage; **+10–16%** grated vs sliced carrot | — | diffusion proxy |

**Mechanism (stated by the authors and supported by their mineral data):** thin cutting creates cut plant tissue that releases solutes directly into the brine, supplying LAB with nutrients and raising the brine's buffering capacity. Because the cabbage cut-surface difference was ~26× but the carrot difference only ~2×, the cabbage effect was large and the carrot effect small — **the effect scales with how much new cut surface the operation creates, not with "cut vs uncut" as such.**

**Salt side-finding (relevant to 2(d)):** in carrot at 1 month, 1.0% NaCl gave pH 3.30 and TTA 1.29% vs 0.8% NaCl giving pH 3.58 and TTA 0.83%. Salt had no significant global effect in cabbage.

**Also from this paper — the failure mode of under-cutting:** of four leaf-cabbage jars, two still had live enterobacteria at 1 month; one had only 7.6 log CFU/mL LAB and ethanol 5.2 g/mL vs 1.6 g/mL in all other samples; one had enterococci as the only LAB and no mannitol; all four contained *Clostridium* and/or *Lachnoclostridium*; mean pH 4.0 vs 3.6 in all other samples. The authors hypothesise **a threshold cut surface below which rapid lactic fermentation is not achieved.**

**Confidence: STRONG** (peer-reviewed, PCI-recommended with public reviews; n = 2–4 jars per point is modest, jar-to-jar variability explicitly acknowledged; real vegetables; INRAE public funding, no industry funder declared).
**Caveat:** the paper itself notes that commercial sauerkraut is dry-salted, not brined as here, which raises juice buffering capacity further.

### FINDING 2a-2 ★ Whole-head vs shredded cabbage sauerkraut — 13 days difference
**Niksic M, Niebuhr SE, Dickson JS, Mendonca AF, Koziczkowski JJ, Ellingson JL (2005). "Survival of *Listeria monocytogenes* and *Escherichia coli* O157:H7 during sauerkraut fermentation." *Journal of Food Protection* 68(7):1367–1374.**
DOI: <https://doi.org/10.4315/0362-028x-68.7.1367> · PMID 16013372

- **Fermentation endpoint (no detectable pathogens): 15 days for shredded cabbage vs 28 days for whole-head cabbage → 13 days difference (shredded ~1.9× faster).** (Note this is the pathogen-clearance endpoint, which tracks but is not identical to pH endpoint.)
- **Final pH was LOWER in whole-head sauerkraut, but titratable acidity was significantly HIGHER in shredded sauerkraut.** (Acid *concentration* vs *pH* diverge because of buffer-capacity differences — a recurring theme.)
- Variables: 18 and 22 °C; 1.8, 2.25, 3% salt. **Within a cabbage type, neither salt nor temperature had significant effects** — i.e. cut form dominated.
- Pathogens persisted in brines for most of the fermentation; acid-tolerant survivors were still detectable at 35 days in whole-head sauerkraut.

**Confidence: STRONG** for the days difference and the pH/TA divergence (replicated design, two temperatures, three salt levels, real 15/28-day fermentations, inoculated pathogen strains). Abstract-only retrieval — the exact daily pH/TA curves were not obtained.

### FINDING 2a-3 Kimchi: whole "pogi" cabbage vs 3 × 3 cm "mat" kimchi — ~1 log more LAB, +25% acidity at 2 weeks, convergence by 6 weeks
**Moon EW, Kim SY, Dang YM, Park B, Park EJ, Song HY, Yang J, Yoon SR, Seo HY, Ha JH (2019). "Comparison of microbial and physicochemical properties between *pogi kimchi* and *mat kimchi*." *Journal of The Korean Society of Food Culture* 34(2):217–223. World Institute of Kimchi (government research institute), Gwangju.**
DOI: <https://doi.org/10.7318/KJFC/2019.34.2.217> · full text: <http://www.jfc.or.kr/journal/article.php?code=66839&Array>

Design: identical ingredients; pogi = cabbage cut in 2 (2절); mat = cabbage cut to 3 × 3 cm; salted cabbage final salinity 2%; cabbage:seasoning 7:3; 6 °C, 6 weeks.

| Measured quantity | Pogi (2-cut) | Mat (3 × 3 cm) | Difference |
|---|---|---|---|
| Total aerobic bacteria, week 2 (peak) | 8.00 ± 0.04 log CFU/g | 9.65 ± 0.06 log CFU/g | **+1.65 log** |
| **LAB, week 2 (peak)** | **8.08 ± 0.03 log CFU/g** | **9.09 ± 0.01 log CFU/g** | **+1.01 log (≈10× more)** |
| **Titratable acidity, week 2** | **0.73%** | **0.91%** | **+0.18 pp (+25% relative)** |
| pH, weeks 2–4 | higher | **lower** | direction stated |
| pH, week 6 | 4.09 | 4.08 | converged |
| TA, week 6 | 1.11% | 1.11% | converged |
| Head-space CO₂ immediately after packing | 6.2% | 8.5% | **+2.3 pp** (mat higher for the whole 6 weeks) |
| Lactic acid, 0 → 6 weeks (mg/100 g) | 6.43 → 294.17 | 8.42 → 335.85 | mat higher |
| Acetic acid, 0 → 6 weeks (mg/100 g) | 29.84 → 161.01 | 24.07 → 175.35 | mat higher |
| Yeast, 0 → 6 weeks (log CFU/g) | 3.80 → 4.61 | 3.19 → 3.46 | pogi higher at end |
| Coliforms | 1.46 log CFU/g initially, then absent | 2.76 (day 0) → 3.35 (week 1) log CFU/g, then absent | mat carried more |
| Free amino acids, organic acids (oxalic/citric/malic/lactic/fumaric/acetic), pH, salinity | **no significant difference overall (p > 0.05)** | | |

**Effect size (EXTRAPOLATION):** at 6 °C the cut-form effect is a **1–2 week shift in the acidification trajectory** that disappears by ~5–6 weeks.

**Confidence: STRONG** for the microbial and TA magnitude at weeks 1–3 (replicated plating, WIK government lab, real kimchi). **MODERATE** for the claim that cut form *matters*: the authors' own conclusion is that overall pH/TA/organic-acid/free-amino-acid quality did **not** differ significantly — the difference is a *rate* difference early, not a *final quality* difference. The full pH/TA curves are in figures (Fig. 2) that I could not digitise.

### FINDING 2a-4 Radish kimchi (kkakdugi): 1 cm vs 2 cm vs 3 cm cubes — the 2023 Food Chemistry: X paper
**Choi HW, Park SE, Kim EJ, Seo SH, Whon TW, Son HS (2023). "Effects of ingredient size on microbial communities and metabolites of radish kimchi." *Food Chemistry: X* 20:100950. Korea University + World Institute of Kimchi.**
DOI: <https://doi.org/10.1016/j.fochx.2023.100950> · **open full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC10739756/>** · PMID 38144756

Design: radish cubes 1 × 1 × 1 cm (SK), 2 × 2 × 2 cm (MK), 3 × 3 × 3 cm (LK), **n = 5 per group**; seasoning 20% w/w; 20 °C for 6 h then 4 °C for 50 days.

- **LAB relative abundance on day 5 was highest in the smallest cubes:** SK > MK ≈ LK. Reported day-5 relative abundances in SK: ***Leuconostoc* 49.2%, *Weissella* 17.9%, *Lactobacillus* 3.0%** — all stated to be higher than in the other groups.
- **pH fell fastest and TA was highest in SK** across the fermentation; α-diversity (Chao1, Shannon, Simpson) was higher in SK on day 5.
- Glucose was significantly higher in SK on **day 15** (more eluted from smaller cubes); sucrose was highest in LK at the start and fell fastest in SK; mannitol higher in SK on day 15 but **lowest** in SK on day 50.
- Lactic acid highest in SK on day 15, but **lower** in SK on day 50 — i.e. the small-cube batch raced ahead and then declined.
- Hardness was **significantly different on days 5 and 15** (LK hardest, SK shrank most); **no significant hardness difference after that**; cohesiveness/springiness differed only after day 30.
- Electronic-tongue sensory: SK highest sourness, lowest saltiness/sweetness/bitterness early; **all three groups converged by day 50.**

**Mechanism given:** surface-area-to-volume ratio drives nutrient elution (sucrose → glucose + fructose by *Leuconostoc*/*Weissella*), which supplies LAB and raises water activity.
**Confidence: STRONG** for the direction and for the day-5/day-15 divergence (n = 5, real kimchi, 50-day time course, government + university funding, no industry funder). **MODERATE** for exact pH numbers — the actual pH and TA values are only in Fig. 1B, which I could not digitise; the text states direction and ranking, not values. **Explicit gap: the paper does not report a "time to pH 4.0 / 3.5" for any cube size.**

### FINDING 2a-5 Cucumber: fruit *size* (not cut form) — composition and terminal pH
**Lu Z, Fleming HP, McFeeters RF (2002). "Effects of fruit size on fresh cucumber composition and the chemical and physical consequences of fermentation." *Journal of Food Science* 67(8):2934–2939. USDA-ARS / NC State.**
PDF: <https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p306.pdf> (fetch tool returns HTTP 406; `curl` works)

- As cucumber diameter increased (size 1 < 27 mm → size 3 = 39–51 mm), **malic acid fell 0.28% → 0.21% (wet basis)**, pH, buffer capacity and dry matter **decreased**, and **glucose and fructose increased**.
- **Terminal pH of juice fermentations fell slightly from 3.50 (size 1) to 3.40 (size 3)** — larger fruit ended *more* acid, attributed to lower buffer capacity.
- **Whole-cucumber terminal pH 3.44–3.62**, slightly higher than the corresponding juice fermentation because whole fruit has higher buffer capacity.
- **Firmness:** sizes 2 and 3 (unblanched) were significantly firmer than size 1 (P < 0.05); size 2 vs 3 not significant. **Bloater index was significantly higher (P < 0.05) for size 3** than sizes 1/2.
- Reported for context: terminal pH ≤ 3.5 is the microbial-stability target for cucumbers depending on salt (Fleming et al. 1996); a previous lot with terminal pH 3.7 spoiled during storage.
- **Blanching 75 °C / 30 s had little effect on sugar utilization, acid production or terminal pH** (see 2c-3).

**Confidence: MODERATE–STRONG** for composition vs size (replicated, real fruit, three sizes, USDA-ARS). **This is fruit size, not cut form** — see 2a-6 for the cut-form data.

### FINDING 2a-6 ★ CUCUMBER CUT FORM — the 1978 USDA-ARS study, recovered from a scan by image reading
**Fleming HP, Thompson RL, Bell TA, Hontz LH (1978). "Controlled fermentation of sliced cucumbers." *Journal of Food Science* 43(3):888–891. USDA-ARS Food Fermentation Laboratory, Raleigh, NC + Mount Olive Pickle Co.**
PDF (scanned, **no text layer** — read here by rendering pages to images): <https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p136.pdf>

**This is the missing cucumber cut-form dataset.** Process: size 3 (3.8–5.1 cm) or size 4 (5.2–5.7 cm) cucumbers **sliced 0.3–0.5 cm thick**; blanched (where applied) **77 °C water bath, 3.5 min**; brined to 0–6.5% NaCl with sodium or calcium acetate buffer at **pH 4.3–4.6**; inoculated with **~10⁸ cells of *Lactobacillus plantarum***; **27 °C for 3 weeks**, then stored to 3 months; each treatment duplicated.

**★ THE HEADLINE NUMBERS — why slicing matters, and why it ultimately doesn't:**
> "**In brining WHOLE, large cucumbers by the controlled fermentation process (Etchells et al. 1973), it is necessary to delay inoculation of the brines until sufficient sugars and other nutrients diffuse from the fruit and salt diffuses into the cucumbers, usually 18–24 hr.**"
> "**Sugar diffused into the brines of sliced cucumbers almost immediately after brining and the *L. plantarum* starter culture produced 0.2–0.5% acid within 24 hr (Fig. 1).** The rapid diffusion of salt into sliced cucumbers permitted earlier addition of the starter culture than is advisable in brining whole cucumbers."
> "**The fermentation of sliced cucumbers was over 80% completed in 6 days**, as measured by acid production, but continued slowly for several more days (Fig. 1)."
> "**Thus, the time for complete fermentation did not differ greatly between slices and whole cucumbers** (Etchells et al. 1973)."

**Verdict for cucumber: slicing removes an 18–24 h *inoculation delay* and gives 0.2–0.5% acid within 24 h and >80% completion in 6 days — but the total time to complete fermentation is not much different from whole cucumbers.** The practical benefit is earlier inoculation, faster *early* acidification, and firmness, not a shorter total fermentation. **Caveat: the whole-cucumber comparison is cross-study (to Etchells et al. 1973), not a same-experiment control.**

**Salt–rate effect (same paper):** "**The rate of fermentation also was similar at 0–3.9% NaCl ... but the rate was less at 6.5% NaCl (data not shown) and less acidity was formed.**" At 27 °C with 10⁸ CFU/mL *L. plantarum*, **salt up to 3.9% does not slow the rate; 6.5% does**, and residual reducing sugars remain at 6.5% NaCl.

**Firmness — heat × salt interaction (Table 2, sliced size-3 cucumbers; 9–10 = excellent, 1–2 = unacceptable):**

| NaCl (%) | Unheated | Heated (77 °C / 3.5 min) |
|---|---|---|
| 0.0 | **3.1c** (soft) | **7.9a** (firm) |
| 1.4 | **4.6b** (soft) | **8.3a** (firm) |
| 3.9 | **5.2b** (soft) | **8.8a** (firm) |
| 6.5 | **8.3a** (firm) | **8.3a** (firm) |

Unheated slices lose firmness as salt **decreases**; heated slices are firm at every salt level and the **seed area stays firm even at 0% NaCl** (unheated slices had a soft seed area at ≤3.9% NaCl). The authors attribute this to the cucumber's own pectinolytic enzymes, suppressed at 6–8% NaCl.

**Firmness — calcium vs sodium buffer (Table 1, sliced size-4 cucumbers):**

| Buffer | Total acid (%), unheated / heated | Firmness, unheated | Firmness, heated |
|---|---|---|---|
| none | 1.14 / 0.76 | **4.6d** | 6.0c |
| sodium acetate | 1.30 / 0.85 | 5.7c | 6.7b |
| **calcium acetate** | 1.20 / 0.88 | **7.5ab** | **8.1a** |

**Whole small cucumbers (size 1, Table 3), firmness at 3 / 6 months:** none 9.1c / 8.4c; sodium acetate 10.7b / 10.6b; **calcium acetate 14.9a / 15.3a; heated + no buffer 14.9a / 16.3a; heated + calcium acetate 16.6a / 16.8a.** Heat and calcium are roughly additive; both improve whole-cucumber firmness.

**Blanching cost, quantified:** "Heated, sliced cucumbers released **over twice as much sugar** into the brine as unheated slices during the first 3 hr after brining." Sugar loss, measured in the heating and cooling water, "**amounted to about 0.18% of the fresh weight of the cucumbers**." Consequence: final total acid was **lower in heated slices (0.76–0.88%) than unheated (1.14–1.30%)**. Heated slices also **turned translucent** over 6–9 months' storage; unheated stayed opaque.

**Confidence: STRONG for everything above** for its era — duplicated treatments, real cucumbers, real brine, 3-week fermentation + 3-month storage, USDA-ARS. **Limitations: n = 2 per treatment, 1978, and the whole-vs-sliced comparison is cross-study. The starter was pitched at 10⁸ cells, not the 10⁶ CFU/g used in modern ARS work.**

**Why this matters generally:** in cucumber the cut-form effect on *fermentation rate* is smaller than its effect on *firmness* and on *when you can safely pitch the starter*. That is a different answer from cabbage, where cut form changes the rate by a week or more.

### FINDING 2a-7 Skin/peel is the dominant mass-transfer barrier — now verified at primary level
**Potts EA, Fleming HP, McFeeters RF, Guinnup DE (1986). "Equilibration of solutes in nonfermenting, brined pickling cucumbers." *Journal of Food Science* 51(2):434–439. USDA-ARS.** DOI: <https://doi.org/10.1111/j.1365-2621.1986.tb11149.x>
Solute equilibration between whole cucumbers and brine is a **diffusion-controlled first-order process**. First-order rate coefficients K_D varied up to 3-fold among 4 cucumber lots, but **K_D ratios among solutes were not significantly different (P > 0.05)** — salt in and sugar/malic acid out move in lockstep. **"K_D values increased as cucumber size decreased"**; **"PEELING INCREASED K_D VALUES 3.7- TO 11.1-FOLD."** Activation energies: **6.5 kcal/mol (malic acid out)** and **6.3 (sugar out)** vs **4.5 (NaCl in)** and **4.2 (lactic acid in)** — outward movement is more temperature-sensitive than inward.
Corroborating detail from Valence et al. 2025 (secondary): the diffusion coefficient of **glucose was 9.2× higher for peeled than for unpeeled cucumber**.
**Confidence: STRONG** for the peeling/size effect (4 lots, replicated, real pickling cucumbers, USDA-ARS, no industry funding evident). **Important limitation: this is a NON-fermenting brine-equilibration system — it quantifies solute diffusion, not acid production rate.** It is the best available proxy for "does pricking/peeling speed brine penetration", and no pricking-specific dataset exists (see §5).

### 2(a) summary table

| System | Contrast | Measured effect | Days / % | Confidence |
|---|---|---|---|---|
| Cabbage (brined, 19 °C) | shredded 2 mm vs 6×8 cm leaves | LAB 8 log at 5 d vs 13 d | **8 days; ~2.6×** | STRONG |
| Cabbage sauerkraut | shredded vs whole head | fermentation 15 d vs 28 d | **13 days; ~1.9×** | STRONG |
| Cabbage kimchi (6 °C) | 3×3 cm "mat" vs 2-cut "pogi" | LAB +1.0 log; TA +25% at 2 wk; converged by wk 5–6 | ~1–2 wk shift | STRONG (rate) / MODERATE (matters) |
| Radish kimchi (4 °C) | 1 cm vs 2 vs 3 cm cubes | fastest pH drop + highest LAB in 1 cm; converged by day 50 | no days figure given | STRONG (direction) / MODERATE (values) |
| Carrot (brined, 19 °C) | grated 3 mm vs 5 mm slices | pH 3.69 vs 3.86; TTA 0.76 vs 0.32% at 64 h | **2.4× TTA** | STRONG |
| Cucumber | fruit diameter 27→51 mm | terminal pH 3.50→3.40; malic acid 0.28→0.21% | small | MODERATE–STRONG |
| **Carrot / beetroot / cucumber cut-form vs pH 4.0** | — | **NO measured dataset found** | — | — |

---

## 2(b) Freezing / thawing before fermentation

### **HEADLINE NEGATIVE FINDING (this is the answer)**
**No peer-reviewed study was retrieved that measures the effect of freezing and thawing a vegetable *before* brining on fermentation rate, pH at 24/48 h, or titratable acidity — for cabbage/sauerkraut, kimchi cabbage, cucumber, carrot, beet or radish.** The entire peer-reviewed kimchi freezing literature freezes the **finished or already-salted** product, and it consistently shows freezing **arrests** fermentation. The premise "freezing speeds fermentation" is **not supported by anything retrievable**, and for kimchi the documented direction is the opposite.

### FINDING 2b-1 Frozen storage flatlines pH, TA and reducing sugars
**Kang M, Kim E, Chung HJ, Park SH (2025). *Food Chemistry: X* 29:102610.** DOI: <https://doi.org/10.1016/j.fochx.2025.102610> · full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC12213297/>
Korean white kimchi under 4 phase-transition regimes: **pH 6.12 → 6.05–6.18 (NS, p > 0.05); TA 0.14% → 0.11–0.15% (NS); reducing sugar 31.28 → 30.78–33.87 mg/g (NS)** over 4 weeks. Authors: "frozen storage inhibits LAB growth, thereby delaying fermentation."
Quality: peer-reviewed, real commercial kimchi, n = 9 (3 reps × 3 measurements), ANOVA + Tukey; funded World Institute of Kimchi / Korean MSIT (government, no industry). **MODERATE for 2(b) because the substrate is post-fermentation kimchi; STRONG that freezing does not accelerate.**

### FINDING 2b-2 Quantified freeze damage (the mechanism, with numbers)
Same paper: **ice-crystal diameter 0.77 ± 0.10 mm** (glassy −45 °C, no fluctuation) → **1.09** (glassy + fluctuation) → **1.38** (rubbery −25 °C) → **3.88 ± 1.37 mm** (partially thawed −10 °C); crystal area 0.33 → 1.15 → 3.39 → **10.86 ± 3.06 mm²**; crystal number 73.80 → 40.60 → 24.80 → 14.40. **Drip loss 23.83 ± 1.35% immediately after freezing**, rising to **28.08%** (glassy, stable) / **37.59%** (glassy + fluctuation) / **44.85%** (rubbery) / **51.82%** (partially thawed) after 4 weeks. Hardness rose 7.09 N (post-freeze) → 7.98–8.70 N (glassy) vs 9.26–9.96 N (rubbery/partially thawed), attributed to cell shrinkage and freeze-concentration. **This directly supports the mechanism chain "large ice crystals → cell-wall/membrane rupture → drip loss + nutrient leakage"**, but **no fermentation-rate consequence was measured. Confidence: STRONG for the physical mechanism; NOT evidence of faster fermentation.**

### FINDING 2b-3 Freeze–thaw costs LAB and changes texture
**Kim J et al. (2020). *Korean Journal of Food Engineering* (산업식품공학) 24(4):235–242.** DOI: <https://doi.org/10.13050/foodengprog.2020.24.4.235> · <https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002650263>
"**When kimchi is frozen and thawed, the amount of lactic acid bacteria (LAB) and yeast is usually reduced by more than 2 logs, and its texture including its crispness and hardness are changed significantly.**" Plate freezing (−40 °C) + plate thawing (20 °C) kept white-cabbage-kimchi LAB at >10% of initial; trehalose pretreatment (19 °Brix) on salted Chinese cabbage maintained hardness and crispness.
**Confidence: MODERATE** (KCI journal, all authors RDA / National Institute of Agricultural Sciences, government; abstract only — no n, no pH/TA values).

### FINDING 2b-4 Thawing loss and LAB survival depend on freezing temperature
**Park D et al. (2024). *Journal of Food Quality* 2024:1478159.** DOI: <https://doi.org/10.1155/2024/1478159>
Kimchi frozen at −18 / −40 / −80 °C for 4 months, thawed at 2 °C to core 0 °C: thawing loss was **maximum at −18 °C**, with increased cell-membrane disruption and considerably decreased hardness; total aerobic count and total LAB "sharply decreased" at −18 °C; −40 and −80 °C better preserved pH/TA/reducing-sugar/antioxidant/phenol profiles. **Confidence: MODERATE** (abstract via Semantic Scholar API; publisher HTML and PDF both HTTP 403 Cloudflare; no numeric values retrieved).

### FINDING 2b-5 Freezing IS commercial for kimchi — but for distribution, not to accelerate brining
Choi YJ et al. (2026) *Scientific Reports* 16:17454, DOI: <https://doi.org/10.1038/s41598-026-48286-9> — "The growing global demand for kimchi has led to the adoption of **frozen distribution** as a strategy to extend shelf-life. However, freezing can cause quality deterioration through ice-crystal-related structural damage, resulting in texture softening and reduced microbial viability." **Confidence: MODERATE** (abstract only; no numbers retrieved).
Related peer-reviewed: **Kim HE et al. (2025) *LWT* 238** — freezing the pre-fermentation **salted** kimchi cabbage; centrifugal dehydration + glucose (CD-SG) best minimised thawing loss and preserved hardness, glucose > trehalose as cryoprotectant, better LAB survival, SEM showed reduced pore size. **No numeric table retrieved (abstract only).** <https://europepmc.org/article/AGR/IND609397284>

### FINDING 2b-6 INDUSTRY PATENT — blanch + freeze + thaw as a kimchi process (NON-PEER-REVIEWED)
**KR101350194B1** "Frozen cabbage kimchi manufacturing method" (applicant 송영근, filed 2012-05-18, granted 2014-01-09): cut cabbage to 1–2 kg → soak in 2–3% brine at **85–95 °C for 1–2 min** (blanch + simultaneous pickle) → cool/wash to ~1% salt → drain 30 min → **freeze ≤ −18 °C** → thaw → mix with seasoning. Stated aims: shorten pickling time and labour, let factories buy cabbage at harvest and store it frozen against price swings, long shelf life. **The patent explicitly claims the blanch kills microorganisms and therefore DELAYS ripening ("숙성을 지연").** <https://patents.google.com/patent/KR101350194B1/en>
**Confidence: WEAK** — patent claims, no data, no controls.

### FINDING 2b-7 The only quasi-quantitative texture datum for freezing pre-fermentation cabbage
**Akomea-Frempong S, Skonberg DI, Camire ME, Perry JJ (2021). *Foods* 10(10):2258.** DOI: <https://doi.org/10.3390/foods10102258> · full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC8535061/>
Kelp/cabbage (50:50) sauerkraut, 2% salt, ~22 °C: pre-fermentation firmness raw 238.4 ± 14.2 N vs raw/frozen 229.5 ± 16.1 N, but **freezing had NO effect after fermentation (225.4 vs 225.7 N)**; blanching 100 °C/1 min dropped firmness to 201.0 N before and 188.5 N after. Time to pH < 4.0: ~6 d all-cabbage, ~9 d kelp-containing (no per-treatment rates reported).
**Confidence: WEAK for 2(b)** — **matrix mismatch: the frozen component was kelp, not cabbage.**

### FINDING 2b-8 Practitioner claim, labelled non-peer-reviewed
K-State Research & Extension (sourced from Penn State Extension), 17 Aug 2021: "While plain cucumbers do not freeze well, pickled cucumbers are an option for freezing. Salt draws out water and a sugar syrup will help firm the pickle texture. **Slice cucumber thin for quicker absorption of the sugar syrup.**" <https://enewsletters.k-state.edu/youaskedit/2021/08/17/try-freezer-pickles/> — **WEAK, extension guidance, no data; note it concerns sugar syrup uptake in a fresh-pack product, not fermentation.**

### 2(b) verdict
- **Speed-up from freeze–thaw before fermentation: no measured evidence exists.** Do not model it as an accelerator on the strength of this literature.
- **Texture: freezing damages texture and costs >2 log LAB** in kimchi; the direction is *negative*.
- **Commercial use: yes, but to STOP/hold fermentation (frozen distribution of finished kimchi) and to store cabbage against price swings — not to accelerate brining.**

---

## 2(c) Blanching (heat treatment)

### FINDING 2c-1 ★ 80 °C brief blanch of whole cucumbers: ≥2-log kill, quantified depth, and NO firmness loss
**LaFountain LJ, Johanningsmeier SD, Breidt F Jr, Stoforos GN, Price RE (2022). "Effects of a brief blanching process on quality, safety, and shelf life of refrigerated cucumber pickles." *Journal of Food Science* 87(4):1475–1488. USDA-ARS / NC State, in cooperation with Pickle Packers International.**
DOI: <https://doi.org/10.1111/1750-3841.16112> · PDF: <https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p446.pdf>

Measured (blanch 15, 90 or 180 s in 80 °C water; duplicate runs on two cucumber lots):
- **Time for a 2-log reduction at 80 °C**, as separate populations: **total aerobes 5 ± 6.5 s; LAB 28 ± 10.2 s; glucose-fermenting coliforms 34 ± 5.6 s.** The 90 s blanch delivered **at least 2-log reduction in all three consistently across lots and batches.**
- Thermal modelling: *E. coli* O157:H7 **z = 9.49 °C**, **D₅₀ = 125.22 s**; a 90 s blanch predicts a **5-log reduction up to 1.1 mm into the fruit**, and a 5-log reduction at the critical 0.65 mm depth with only **~59 s**. 90 s and 180 s should achieve **≥6 log** within 0–0.65 mm.
- **Texture: blanching had NO impact on tissue firmness during 1 year of refrigerated storage (p > 0.098).**
- Flavour: no differences in (E,Z)-2,6-nonadienal or (E)-2-nonenal; **consumers (n = 110) could not differentiate control from 90 s blanched pickles at 62 days.** Exocarp colour and mesocarp opacity were preserved.

**CRITICAL CAVEAT — this is NOT a fermentation study.** It is a refrigerated **acidified** pickle (cut into spears, acidified, stored at 4 °C). **It reports no fermentation rate, no pH-drop kinetics, no titratable-acidity data.** It is the strongest available evidence on *what a brief blanch does to cucumber microflora and texture*, and it is the reason a "blanch selects for LAB" story is plausible — but the LAB-selection claim itself is not tested here.
**Confidence: STRONG** for the log reductions and the null texture result.

### FINDING 2c-2 ★ Low-temperature blanching (50–70 °C) makes cabbage FIRMER, not softer — the naive assumption is wrong
**Ni L, Lin D, Barrett DM (2005). *Journal of Food Engineering* 70(4):546–556.** DOI: <https://doi.org/10.1016/j.jfoodeng.2004.10.009>
Firmness improvement vs blanched controls, with optima: **Chinese cabbage 1.8× (55 °C, 45 min); cabbage 1.6× (65 °C, 15 min); bok choy 3.0× (65 °C, 45 min); carrots 2.1× (60 °C, 15 min); green bell peppers 1.36× (70 °C, 15 min); sugar snap peas 1.7× (65 °C, 30 min); broccoli 2.9× (60 °C, 15 min).** Temperature was more influential than time. Mechanism: activation of endogenous pectin methylesterase (PME), which de-esterifies pectin and makes it a better substrate for Ca²⁺ cross-linking.
**Confidence: STRONG for the phenomenon** (optimally controlled study across seven vegetables, optimum temperature/time mapped). **Retrieved as an AGRIS abstract, not full text** — the fold-changes are abstract-level. The implication for fermentation is indirect: a 55–65 °C blanch is a *firming* pretreatment, and any rate effect would have to come from the microbial kill, not from tissue softening.

### FINDING 2c-3 75 °C / 30 s blanch of cucumbers: negligible effect on fermentation
**Lu, Fleming & McFeeters (2002)** (same paper as 2a-5, USDA-ARS):
> "**Blanch treatment had little effect on sugar utilization, acid production, and terminal pH in cucumber fermentations.**" Blanched and unblanched fermentations had **almost the same terminal pH, ranging from 3.44 to 3.62**. Slightly *less* malic acid was utilised in blanched fermentations because blanching reduced the natural flora. **Blanch treatment at 75 °C for 30 s was NOT effective for bloater prevention**, regardless of fruit size — the authors conclude a higher temperature or longer time would be needed to eliminate all gas-producing microflora and/or inactivate tissue respiration.
**Texture:** blanching **significantly increased firmness retention** for sizes 1 and 2 (not size 3) — the opposite of the expected softening.
**Confidence: MODERATE–STRONG.** Real cucumbers, three sizes, whole-fruit fermentations, 1-year storage, USDA-ARS. **This is the best direct test of "does blanching speed cucumber fermentation" and the answer is no at 75 °C/30 s.**

### FINDING 2c-4 High-temperature blanching does soften
**Akomea-Frempong et al. (2021) *Foods* 10(10):2258** (full text, see 2b-7): 100 °C/1 min reduced firmness 238.4 ± 14.2 N → 201.0 ± 12.3 N before fermentation (p = 0.00, F = 152.86) and 225.4 ± 15.0 → 188.5 ± 13.7 N after (p = 0.00, F = 115.94). Notably, **100 °C blanching of vacuum-packed kelp gave NO significant APC/fungi reduction (all ≤3 log CFU/g)** — a warnable case of blanching failing to reduce load.
**Confidence: MODERATE (matrix caveat — kelp, not cabbage).**

### FINDING 2c-5 Blanching + *L. plantarum* on white cabbage sprouts: LAB 0.97 → 8.47 log CFU/g
**Layla A, Syed QA, Zahoor T, Shahid M (2024). *International Microbiology* 27(3):753–764.** DOI: <https://doi.org/10.1007/s10123-023-00426-1> · PMID 37700156
Blanched + fermented cabbage sprouts (IF-BCS) had the highest Ca (447), Mg (204), Fe (9.3), Zn (5), Cu (0.5) mg/100 g dw; anti-nutrient reduction vs raw fermentation: **phytate 42%, tannin 66%, oxalate 53%** vs 32–56% for unblanched. LAB 0.97 → 8.47 log CFU/g. Authors conclude *L. plantarum* + blanching is the most promising route.
**Confidence: MODERATE** — peer-reviewed, real cabbage tissue, HEC Pakistan funding (no industry). **But: blanch temperature/time are not stated in the abstract; no pH or TA; no n reported; matrix is dehydrated sprouts, not brined sauerkraut.**

### FINDING 2c-6 Blanching + no salt = uncontrolled fermentation (the classical rationale)
**Solomon HM, Kautter DA, Lilly T, Rhodehamel EJ (1990). *Journal of Food Protection* 53(10):831–833.** PMID 31018284
Shredded cabbage, 250 g bags, 70% CO₂ / 30% N₂, room temperature: **only type A *C. botulinum* spores grew and produced toxin; ~100–200 type A spores/g produced toxin on days 4, 5 and 6 while the cabbage was still organoleptically acceptable.** Cited here because it is the safety reason heat treatment without a competitive LAB flora and without salt/acid is dangerous.
**Confidence: STRONG for the hazard; it is not a blanching study** (atmosphere-modified raw cabbage).

### FINDING 2c-7 The only retrieved heat pretreatment that RAISED lactic acid output — onion
**Grzelak-Blaszczyk K et al. (2025). *Molecules* 30(14):3002.** DOI: <https://doi.org/10.3390/molecules30143002> · <https://europepmc.org/articles/PMC12300999>
12 yellow onion varieties, raw vs blanched **60 °C**, fermented with *Levilactobacillus brevis* ŁOCK 0944. Varieties showing morphological change after blanching (Hysky, Centro, Dormo) had better *L. brevis* growth and **higher lactic acid production**; blanching loosened tissue structure and reduced carbohydrate content in the blanched+fermented onions. Polish National Science Center funding, no industry.
**Confidence: MODERATE, and NOT transferable to cabbage/cucumber** — onion is not on the target list.

### FINDING 2c-8 Cucumber: hot brine speeds salt uptake but SLOWS fermentation
**Park MW, Park YK, Jang MS (1994). *Journal of the Korean Society of Food Science and Nutrition* 23(4):634–640.** <https://www.e-jkfn.org/journal/view.html?uid=1075&vmd=Full>
Cucumbers brined in (A) boiled 10% NaCl, (B) boiled 20% NaCl, (C) 20% NaCl cooled to 25 °C: "**The cucumber preserved with boiled solution and high salt concentration showed a slow fermentation rate. The rate of salt penetration during brining increased.**"
**Confidence: WEAK** — abstract only, no numbers, no n, English abstract contains typos.

### FINDING 2c-9 Blanch + lactic culture in kimchi, 1993 — direction only
**Park HO, Kim YK, Yoon S (1993). *Korean Journal of Food Cookery Science* 9(2):61–66.** <https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=HJRGB8-1993-v9n2-61>
*L. mesenteroides* group pH fell sharply then held; *B. bifidum* group pH fell gradually; heat treatment reduced viable counts; malic/citric/fumaric acids decreased in the control but increased in the culture and heat-treated groups. **Confidence: WEAK** — Korean-language abstract only, blanch conditions unstated, no numbers.

### 2(c) verdict
- **A short high-temperature blanch (80 °C, 90 s on cucumber) is a microbial hurdle, not a fermentation accelerator**: it reliably removes ≥2 log of the native flora and LAB/coliforms, with no firmness or sensory penalty in the acidified-pickle context (2c-1), but at 75 °C/30 s it changed essentially nothing about cucumber fermentation rate or terminal pH (2c-3).
- **A low-temperature blanch (55–65 °C) is a firming pretreatment** via PME (2c-2), which is the opposite of the folk expectation, and would be the sensible way to use heat if texture is the concern.
- **★ New hard number from the 1978 cucumber study (2a-6): blanching at 77 °C for 3.5 min COSTS substrate and LOWERS final acidity.** Heated slices released >2× as much sugar into the brine in the first 3 h, the loss measured at **~0.18% of fresh weight**, and final total acid fell to **0.76–0.88% (heated) vs 1.14–1.30% (unheated)**. In exchange, firmness rose sharply (e.g. at 0% NaCl: **3.1 → 7.9** on a 9–10 scale). **This is the clearest quantified blanching trade-off in the vegetable literature: you buy texture and microbial reduction with fermentable solids and final acidity.**
- **"Blanching selects for LAB" is mechanistically plausible and stated in practitioner literature, but I found no controlled blanched-vs-unblanched comparison reporting Enterobacteriaceae/mesophilic counts through a vegetable fermentation.** See "Could not find".

---

## 2(d) Maceration, brining/salt-stressing, pricking, lye, grinding/mash

### 2(d1) Maceration / grinding / mash / tissue disruption

**FINDING 2d1-1 ★ Pepper mash (ground *Capsicum* + 8% salt) — near-terminal acidification within 1 month, then flat for 23 more**
**Koh FM (2005). "Physicochemical properties of pepper mash fermented in wood and plastic." MS thesis, Louisiana State University, thesis 1447.** <https://repository.lsu.edu/gradschool_theses/1447>
Tabasco pepper (*C. frutescens*) **ground** + **8% salt**; 12 oak (55-gal) + 12 plastic (50-gal) barrels; sampled at 1, 2, 3, 6, 10, 12, 17 and 24 months; n = 7 fresh-salted, n = 12 fermented.
- Fresh ground pepper **pH 4.98** (4.97–4.99) → **pH 4.7** (4.59–4.80) immediately after 8% salt addition.
- **Within 1 month: pH 3.9 (plastic) / 3.7 (wood)** (ranges 3.07–4.41 and 3.17–4.60). **No significant pH change for the remaining 23 months.**
- TA: **0.58%** as lactic acid pre-salt → 0.54% after salting → **~1.6% at 1 month** (wood 1.04–2.10%; plastic 0.97–2.52%) → **1.5% at 24 months.**
- Grinding + salting alone halved glucose (15.83 → 7.57 mg/g DW) and fructose (20.26 → 9.80 mg/g DW) — direct evidence that comminution plus salt releases and consumes sugars essentially at once.
- Capsaicin ~0.30–0.32 mg/g and dihydrocapsaicin 0.12 → 0.09–0.10 mg/g, **stable across 24 months**.
**Confidence: MODERATE** (thesis, not a journal; n = 7–12; real fruit; two barrel materials). **The very fast drop is confounded — 8% salt plus comminution together, with no unground control.**
**[2°, inside this thesis]:** Fleming et al. (1983) — fermented red bell pepper reached **1.53% lactic acid after 2 weeks**; Galicia et al. (1996) — jalapeño TA rose 0.8% → 1.5%. Not retrieved directly.

**FINDING 2d1-2 Chilli mash: salt, not grinding, is the rate lever**
**Dai L, Wang X, Ahmad NH, Mah JH, Qin W, Wei X, Liu S (2026). "Effects of Controlled Water Activity on Microbial Community Succession and Flavor Formation in Low-Salt Chili Mash Fermentation." *Foods* 15(2):360.** DOI: <https://doi.org/10.3390/foods15020360> · <https://pmc.ncbi.nlm.nih.gov/articles/PMC12840632/>
Ground mash, 40 °C, 45 d, triplicate: **4% NaCl mash reached total acidity 130 g/kg vs 24–58 g/kg for 12–15% NaCl controls**, and consumed reducing sugars fastest. Sichuan provincial funding, no industry.
**Confidence: MODERATE** — peer-reviewed, triplicate, real vegetable; but the driver is salt/water activity, not grinding, and it is an endpoint not a kinetic curve.

**FINDING 2d1-3 Chilli paste at 20 °C reaches pH < 4 in 3–5 days**
**Kádár et al. (2022). *Plants*.** Six chilli cultivars, pure chili paste, anaerobic spontaneous fermentation, 21 days at 20 °C: **"Acid formation leads to the drop of pH (<4)"** and **"these values can be achieved in 3–5 days."** Lactic acid 0.02 → 1.13%; capsaicinoids stable; ascorbic acid −19.01%.
**Confidence: MODERATE** (peer-reviewed, 6 cultivars, real paste; endpoint/statement rather than a tabulated curve).

**FINDING 2d1-4 Mincing vs chopping: no controlled same-vegetable comparison exists**
**No retrieved study directly compares ground/mashed vs whole of the same vegetable under otherwise identical salt and temperature with a pH–time curve.** The closest available contrasts are the cut-size study (Valence 2025, 2a-1) and the pepper mash work above. **This is a genuine gap.**

### 2(d2) Brining / salt-stressing / pre-soaking

**FINDING 2d2-1 ★ Salt effects are NON-MONOTONIC in intact cabbage and MONOTONIC in juice — do not pool them**
- **Intact NE Chinese sauerkraut, four salt levels (0.5 / 1.5 / 2.5 / 3.5% w/w): 2.5% gave the highest LAB population and the fastest pH decrease and acid accumulation; both lower and higher salt were slower.** Yang X et al. (2020) *Journal of Applied Microbiology* 129:1458–1471, DOI: <https://doi.org/10.1111/jam.14786>. **Confidence: MODERATE.**
- **Chinese sauerkraut (LWT, 2016): "The LAB population and metabolic rate was reduced and the yield of lactic acid decreased with the increase of salt concentration… high salt concentration delayed the maturation."** DOI: <https://doi.org/10.1016/j.lwt.2015.12.057>. **Confidence: MODERATE, direction only.**
- **Kimchi, 1–5% NaCl at 25 °C, rate measured by CO₂ production: "the higher salt concentration caused a significant decrease in the maximum value of fermentation rate and pH reduction."** Park WP, Kim ZU (1991) *J. Korean Agricultural Chemical Society* 34(3):295–297. <https://koreascience.kr/article/JAKO199103042949379.pub> **Confidence: MODERATE for direction, WEAK for magnitude** — the scanned PDF has no text layer (pdftotext and PyMuPDF both returned 0 characters).
- **Kimchi, 1.4 / 1.7 / 2.0 / 2.2 / 2.5% salinity: "The low-salinity kimchi sample showed a rapid decline in the pH at the beginning of the fermentation process," with higher *Leuconostoc mesenteroides* and higher mannitol; *Latilactobacillus sakei* dominated later at high salinity.** Lee MA et al. (2021) *Fermentation* 7(4):308, DOI: <https://doi.org/10.3390/fermentation7040308>. **Confidence: MODERATE, direction only (MDPI full text 403).**
- **Carrot JUICE (opposite direction), 0 / 1.25 / 2.5% NaCl at 20 °C, 28 d, triplicate: *Leuconostoc* became dominant (>50% relative abundance) after 2 days at 2.5% NaCl but only after 7 days at 1.25% and 0%.** *Lactiplantibacillus* dominance by day 14 at 2.5% vs day 28 at lower salt (and only 2 of 3 fermentations at 0%). Eilers T, Van Beeck W, et al., Lebeer S (2026) *Microbiology Spectrum*, DOI: <https://doi.org/10.1128/spectrum.03578-25> · <https://pmc.ncbi.nlm.nih.gov/articles/PMC13435955/>. CO₂ saturation lowered initial pH 6.08 ± 0.03 → 5.43 ± 0.03 (P < 0.05). **Confidence: STRONG for succession timing, WEAK for pH rate** (pH is in figures only). ERC + FWO/VLAIO funding; one author is a declared industry consultant.
- **Extreme salt destroys the fermentation (pepper mash/brine):** at **15–25% NaCl, Enterobacteriaceae dominate and Lactobacillaceae never take over**; at **10% NaCl, Lactobacillaceae take over only after 24 days** (Li et al. 2020, metagenomics of red pepper sauce). In **habanero at 5–25% salt over 50 days, LAB reached only 3.80–4.97 log CFU/mL and pH fell only to 4.47–4.78** — above the 4.6 botulism-control threshold for part of the range — with Enterobacteriaceae persisting throughout (Aryee et al. 2022, *Food Chemistry Advances*). **Confidence: MODERATE–STRONG; this is the single largest salt effect in the dataset.**

**FINDING 2d2-2 ★ Kimchi brine-soaking (jeolim) — salting time and the pH/acidity trajectory**
**Song JE, Kim MS, Han JS (1995). "Effects of the Salting of Chinese cabbage on Taste and Fermentation of Kimchi." *Korean Journal of Food and Cookery Science* 11(3):226–232.** <https://koreascience.kr/article/JAKO199511921379184.page>
5 cabbages per group, stored at 10 °C; salting times **3 / 5 / 8 / 12 h**; brine-immersion judged best of immersion / dry-salt / combined.
- **Day 7 (peak acceptability): pH 4.17–4.36; acidity 0.45–0.52%; salt 1.89–3.36%.**
- **Day 26 (sensory score very low): pH 3.69–4.01; acidity 0.68–0.74%; salt 1.59–2.62%.**
- Acidity rose slowly at first, then **"suddenly multiplied until the third day of preservation,"** then increased gradually.
- **Best salting time = 5 h** (of 3/5/8/12 h) with unrefined sun-dried salt.
**Confidence: MODERATE** — directly answers the "2–12 h brine-soak" question with pH/acidity numbers; real cabbage, n = 5 heads; but sensory-driven, 1995 methods, no replication statistics quoted, range reported across salting times rather than per time.

**FINDING 2d2-3 Salted-cabbage salinity vs brine strength, temperature and time**
- **Shim YH, Ahn GJ, Yoo CH (2003). *Korean J. Food and Cookery Science* 19(2):210–215.** <https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=HJRGB8-2003-v19n2-210> — 10% and 15% brine; 10/15/20/25 °C; sampled 0–20 h. Best texture at **10% brine/10 h** or **15% brine/6–8 h**, both at 25 °C. **No pH/acidity values in the abstract.**
- **Ahn SC (2021). *Culinary Science & Hospitality Research* 27(2):47–56.** DOI: <https://doi.org/10.20878/cshr.2021.27.2.005> — "Final salinity … higher as the salinity, salting temperature, and salting duration increased. **The pH of the salted cabbage decreased** … acidity and soluble solids increased as the duration, temperature, and salinity of the salt water increased." **≥20% brine prevented bacterial growth** (authors recommend ≥20% for sanitary safety). **No numbers in abstract.**
- **Mheen TI, Kwon TW (1984). *Korean J. Food Sci. Technol.* 16(4):443–450.** <https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=SPGHB5-1984-v16n4-443&tempLang=en> — "At high temperature and low salt content Kimchi fermentation was faster than at low temperature and high salt content"; *Leuconostoc mesenteroides* = main fermentation organism, *L. plantarum* = main acidifying organism. **No numeric table extracted.**
**Confidence: MODERATE for direction in all three; NO magnitudes retrievable.**

**FINDING 2d2-4 ★ Mechanical enhancement of brining — the best salt-uptake table found**
**Lee MK, Yang HJ, Woo HN, Rhee YK, Moon SW (2011). "Changes in the Texture and Salt Content of Chinese Cabbage Using Different Salting Methods." *J. Korean Soc. Food Sci. Nutr.* 40(8):1184–1188.** DOI: <https://doi.org/10.3746/jkfn.2011.40.8.1184>
Cabbage cut 3 × 3 cm, brine:cabbage 1:1.5, **15 °C, 6 h**, brines of 1 / 2 / 6 / 10% salt; n = 3 (Mohr titration), firmness n = 10.

**Tissue salt content (%) after 6 h:**

| Brine NaCl | Immersion (control) | Press 1.19 kgf/cm² | Press 1.35 kgf/cm² | Vacuum 500 mmHg | Vacuum 250 mmHg | Steam 100 °C/1 min | Steam 2 min |
|---|---|---|---|---|---|---|---|
| 1% | 0.33 ± 0.01 | 0.41 ± 0.08 | **0.76 ± 0.25** | 0.42 ± 0.01 | **0.76 ± 0.08** | **1.11 ± 0.08** | 0.99 ± 0.08 |
| 2% | 1.11 ± 0.08 | 1.35 ± 0.25 | 1.23 ± 0.25 | 0.99 ± 0.08 | 1.17 ± 0.17 | **1.64 ± 0.33** | 1.46 ± 0.08 |
| 6% | 2.22 ± 0.33 | 2.03 ± 0.17 | **2.88 ± 0.66** | 1.11 ± 0.08 | 2.05 ± 0.41 | **2.93 ± 0.25** | **3.16 ± 0.66** |
| 10% | 3.69 ± 0.08 | 4.56 ± 0.17 | **4.62 ± 0.25** | 2.34 ± 0.01 | 2.93 ± 0.17 | 4.21 ± 0.99 | 4.10 ± 1.32 |

Raw cabbage moisture 95.40%; after 6% brine 92.42%; after 10% brine 90.00%. Steam-treated cabbage showed the largest firmness/penetration-time increases (up to 1008.6 g at 10% brine). Author target: reach ~2% tissue salt in 6 h at 15 °C using 6% brine plus 1.35 kgf/cm² pressing, 250 mmHg vacuum, or 100 °C/1 min steam. Cited inside the paper: **vacuum at 350 mmHg (54.1% vacuum) increases brining rate vs 760 mmHg (0% vacuum).**
**Confidence: STRONG for the salt-uptake numbers** (peer-reviewed, triplicate titration, real cabbage). **CRITICAL LIMIT: no fermentation step was run — this measures salt uptake, not subsequent acid-production rate.**

**FINDING 2d2-5 Vacuum impregnation — contested**
- **Ryoo H, Lee S, Han ES, Lee KG (2005). "Use of Vacuum Impregnation in Brine Salting Process of Kimchi." *Food Engineering Progress* 9(1):59–64.** <https://www.foodengprog.org/download/download_pdf?pid=fep-9-1-59> — measured impregnated volume fraction X, relative deformation γ and effective porosity εe vs vacuum pressure, vacuum period, relaxation time at 0/2/5/10/20% NaCl. **X, γ and εe were NOT significantly changed by the process variables; they were significantly influenced by NaCl concentration (osmosis).** **This partly CONTRADICTS the vacuum benefit in 2d2-4.** Confidence: MODERATE for the attribution result; the numeric tables were unreliable to extract from the legacy-font PDF.
- ***Journal of Agriculture and Food Research* (2026) 102951**, DOI: <https://doi.org/10.1016/j.jafr.2026.102951> — wet vacuum impregnation of probiotics in **5% brine at 10⁶ CFU/g**, 30 °C, 15 d, **final salt < 1% w/w**; LAB dominance and coliform/*E. coli* suppression **within five days**; SEM confirmed infiltration into tissue. **Confidence: MODERATE; no pH–time numbers in abstract.**
- **Tumbling-assisted dry salting** (*J. Food Composition and Analysis* 2025, DOI: <https://doi.org/10.1016/j.jfca.2025.108555>): tumbling 5/10/20 min beat conventional salting 30/60/90 min, but prolonged treatment or high salt beyond a threshold caused microstructural damage. **Confidence: WEAK — direction only, no numbers retrievable.**

### 2(d3) Puncturing / pricking / peeling / bruising — cucumbers

**FINDING 2d3-1 ★ The best "remove the skin → faster penetration" number**
**Potts EA, Fleming HP, McFeeters RF, Guinnup DE (1986). "Equilibration of solutes in nonfermenting, brined pickling cucumbers." *Journal of Food Science* 51(2):434–439. USDA-ARS.** DOI: <https://doi.org/10.1111/j.1365-2621.1986.tb11149.x>
Solute equilibration is **diffusion-controlled first order**. K_D varied up to 3-fold among 4 cucumber lots, but **K_D ratios among solutes were not significantly different (P > 0.05)** — salt in and sugar/malic acid out move in lockstep. **"K_D values increased as cucumber size decreased"**; **"PEELING INCREASED K_D VALUES 3.7- TO 11.1-FOLD."** Activation energies: **6.5 kcal/mol (malic acid out), 6.3 (sugar out), 4.5 (NaCl in), 4.2 (lactic acid in).**
**Confidence: STRONG for peeling/size.** Real pickling cucumbers, 4 lots, replicated, USDA-ARS. **LIMIT: non-fermenting brine-equilibration system — solute diffusion, not acid production.**

**FINDING 2d3-2 The skin excludes microbes**
USDA/APHA *Compendium of Methods for the Microbiological Examination of Foods*, Ch. 51 "Fermented and Acidified Vegetables" (Pérez-Díaz et al. 2013), PDF: <https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p390.pdf> — "**Yeasts were found not to grow within cucumber tissue, presumably because of their larger size, which prevented entry through the stomata of the cucumber skin.**" **Confidence: STRONG as a textbook/consensus statement; a mechanism claim, not a rate measurement.**

**FINDING 2d3-3 CO₂ / bloater threshold — the mechanism by which any surface breach hurts**
**Zhai Y, Pérez-Díaz IM (2021). *International Journal of Food Microbiology* 344:109115.** DOI: <https://doi.org/10.1016/j.ijfoodmicro.2021.109115>
**28.68 ± 6.04 mM (≈12%) dissolved CO₂ induces bloater defect**, tested in brines of 25 mM CaCl₂ (NaCl-free) vs 345 mM (2%) NaCl vs 1.06 M (~6%) NaCl, monitored days 0, 2, 3, 5, 8, 15, 21. **Confidence: STRONG.**

**FINDING 2d3-4 Blossom-end removal — citation only, no data**
The only trace retrieved is the reference string "**blossoms in salt stock mean soft pickles. Res. Farm 13:14–15**" inside the APHA chapter. **Confidence: WEAK-or-CONTESTED — no data obtained.**

**FINDING 2d3-5 ★ GENUINE GAP: no pricking study exists**
**No retrieved study measured acid-production rate or time-to-pH-4.0 in pricked vs unpricked cucumbers; no "sliced-ends-off" trial; no wax-removal trial.** The classical cucumber literature is about softening and bloaters, not acidification kinetics. **If the user needs a pricking effect size, it does not exist in the retrievable peer-reviewed literature, and any model of it would be extrapolation from the Potts 1986 diffusion coefficients.**

### 2(d4) Lye (NaOH) — olives as the extreme case

**FINDING 2d4-1 ★ Industrial Spanish-style lye parameters and what they actually achieve**
**"Industrial Processing of Algerian Table Olive Cultivars Elaborated as Spanish Style." *Frontiers in Microbiology* 12:729436 (2021).** DOI: <https://doi.org/10.3389/fmicb.2021.729436> · <https://pmc.ncbi.nlm.nih.gov/articles/PMC8600317/>
Table 1 (plant-supplied data), 22 industrial brines, 4 factories, 3 cultivars:

| Factory | NaOH (%) | Lye time (h) | Wash 1 | Wash 2 | Initial NaCl (%) | Fermentation (d) |
|---|---|---|---|---|---|---|
| 1 | **1.3** | **12–14** | 24 h | 120 h | 16 | 90–120 |
| 2 | **2.3** | **8–10** | 24 h | 48 h | 12 | 90–120 |
| 3 | **2.5** | **12** | 24 h | 48 h | 10 | 60–120 |
| 4 | **2.6** | **8** | 24 h | 48 h | 10 | 120 |

Text: Spanish-style = "**2–3% sodium hydroxide (lye) for several hours**", then two tap-water washes, then **9–10% (w/v) NaCl** brine. The lye **must penetrate 2/3 of the distance from pulp surface to pit** for adequate debittering.

**★ THE IMPORTANT OUTCOME:** after 60–120 days, brine **pH 5.04 → 4.27**, titratable acidity **above 0.4%** in all samples, lactic acid mean **0.68%**, acetic acid mean **0.21%**. The stated goal was "**reaching a pH < 4.0 after the fermentation**" — **and many industrial batches did NOT reach it.** The paper attributes this partly to **excessive washing stripping fermentable sugars** (final-fruit glucose −96.11%, fructose −83.88%, mannitol −27.83%), which limits lactic acid production; butyric/isobutyric/propionic acids signalled secondary (spoilage) fermentations in several tanks.

**Confidence: STRONG for the lye concentration/duration table and for the "many industrial batches stop at pH 4.27–5.04, above the pH 4.0 target" finding** (real industrial tanks, 4 factories, 3 cultivars, 22 brines). **Limitation: processing parameters are industry-reported, not experimentally controlled; no pH-vs-time curve extracted (it is a plot in Figure 1).**

**FINDING 2d4-2 Lye drives microbial selection**
USDA/APHA Ch. 51: "**Yeasts propagate and predominate in olive fermentations (up to 10⁶ CFU/mL) if the fruits are neither properly lye-treated nor heat-shocked before brining.**" A 2025/26 survey of 363 table-olive samples from 40 producers in 6 countries (preprint, DOI: 10.64898/2025.12.16.694624) reports "**the contrast between alkali-treated and naturally fermented olives was the dominant structuring factor**," with halophilic/alkalophilic LAB enriched in alkali-treated fruit.
**Confidence: STRONG for the USDA statement; MODERATE for the survey (large n but preprint, not peer-reviewed).**

**FINDING 2d4-3 California-style ripe olives**
USDA/APHA Ch. 51: ripe/black olives are oxidised with pressurised air **after treatment with 1–2% NaOH**, washed to pH ≈ 7.0 or less, canned in **1–3% NaCl** brine and **retorted**; final pH frequently **above 4.6** (botulism risk — hence sterilisation rather than relying on acid). **Confidence: STRONG as a textbook summary.**

**FINDING 2d4-4 ★ GAP:** **no quantitative time-to-target-pH or time-to-0.8%-acidity data found for Greek-style natural olives**, and no head-to-head Greek vs Spanish vs California comparison with times. Only the qualitative statement that natural brined olives ferment over months without lye.

### 2(d5) Other non-thermal / mechanical pretreatments

- **Ultrasound, red bell peppers + *Lactiplantibacillus plantarum*** — *Applied Sciences* 15(6):2988 (2025), DOI: <https://doi.org/10.3390/app15062988>. Immersion ultrasound 15/30 min, contact ultrasound 1/3/5 min. **Final pH essentially identical across all pretreatments: 3.01–3.06.** Highest LAB with 30 min immersion: **10.55 log CFU/g**. Dry matter −16–24%; hardness −85%; chewiness −17 to −90.65%; carotenoids +40% (5 min contact). **Confidence: WEAK-or-CONTESTED for any RATE claim — endpoint pH only, no pH–time curve; equal (not faster) acidification with more tissue damage.** MDPI full text blocked (403), so a rate difference buried in the figures cannot be excluded.
- **Pulsed electric field on brined radish** — Kim SY, Gu HL, Ju H, Jeon J, Jeong SH, Lee DU (2024) *Innovative Food Science & Emerging Technologies* 92:103553, DOI: <https://doi.org/10.1016/j.ifset.2023.103553>. **Title confirms PEF "can control fermentation rate of brined *Raphanus sativus*", but the paper is fully closed (Unpaywall oa_status = closed; Semantic Scholar abstract = null). NO magnitude obtained. Confidence: no number.**
- **High hydrostatic pressure, leaf-mustard kimchi** — *LWT* 152:111325 (2021), DOI: <https://doi.org/10.1016/j.lwt.2021.111325>. **400 and 600 MPa for 5 min; 600 MPa reduced total LAB to 1.30 log CFU/g and coliforms to >1 log CFU/g** before storage; supercooling (−4.5 °C) prevented microbial growth for 30 days. **Direction: HHP SUPPRESSES vegetable fermentation — it is a pasteurisation/hurdle tool, not an accelerator. Confidence: STRONG.**
- **Enzymatic maceration (pectinase/cellulase/hemicellulase) on cabbage or cucumber fermentation rate: NOTHING FOUND.** Europe PMC and OpenAlex searches returned only EFSA enzyme-safety dossiers, enzyme-production papers and by-product valorisation. **Real gap.**

---

## 2(e) Which effects are LARGE (worth modelling) vs second-order noise
*See §4, Master magnitude table, below.*

---

# QUESTION 3 — INOCULATION / BACKSLOPPING / STARTER CULTURES vs WILD FERMENTATION

## 3(a) Head-to-head studies: wild / spontaneous vs backslopped vs commercial starter

### FINDING 3a-0 ★ THE DEFINITIONAL PROBLEM — read this first
**"Backslopping" is not an established term in the vegetable-fermentation peer-reviewed literature.** A Europe PMC search for `backslopping OR back-slopping OR back slopping` returns 60+ hits dominated by **sourdough, tarhana, kefir, dadih, tempeh, gari and dairy** — cereal, dairy and beverage. Only **two** vegetable backslopping studies were retrievable at all (3b-2 and 3b-3 below, both on pickled chilli), plus one Taiwanese pickled cabbage succession study (3c-1). **There is no peer-reviewed head-to-head "wild vs backslopped sauerkraut" study.** In paocai (Chinese pickle) brine, backslopping *is* the normal propagation mode (Zhao et al. 2016 *J Agric Food Chem* 64(11):2415–2422, PMID 26915389; Zhao et al. 2017 *Bioengineered* 8(5):642–650, PMID 28409998) — but those papers do not measure a fermentation-rate difference.
**Confidence: STRONG that this is a genuine evidence gap, not a search failure** (multiple query formulations, two independent searches).

### FINDING 3a-1 ★ Best quantified head-to-head: 5–7 days saved, three vegetables
**Zhao X, Liu L, Zhao Y, Wang D, Zhang X, Jin X, Wang L, Liu X (2026). "*Leuconostoc mesenteroides* AA001: A High-Efficiency Nitrite Degrader Facilitating Controlled and Safe Traditional Vegetable Fermentation." *Microorganisms* 14(2):411.**
DOI: <https://doi.org/10.3390/microorganisms14020411> · PMID 41753698 · **open full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC12943457/>**

- Inoculum: ***L. mesenteroides* AA001 at 1.0 × 10⁶ CFU/g** fresh weight.
- **Maturity defined as pH ≤ 4.0 AND TA ≥ 6 g/kg AND LAB ≥ 10⁹ CFU/g.**
- **Time to pH 4.0: natural fermentation 9–14 days; inoculated 4–7 days → 5–7 days saved (~2× faster).**
- Sensory maturity: inoculated 5–7 d vs natural 11–14 d.
- Nitrite peak: inoculated **≤10 mg/kg at days 2–3** vs natural **20–46 mg/kg at days 3–6** (Chinese national limit 20 mg/kg).
- Matrices: three real vegetables (Yingcai/*Lepidium*, Dongbei suancai/Chinese cabbage, radish kimchi).
- Design: triplicate, 10 trained assessors (ICC ≥ 0.80), IRB-approved sensory; state research institute co-author.

**Confidence: STRONG** for the design and the direction; **MODERATE for the exact day values**, which I obtained from the full text rather than the abstract (the abstract says only "shortening the fermentation period"). **Note: there is no backslopping arm — this is a defined single-strain starter vs spontaneous.**
**Caveat flagged by the source itself: pH < 4.0 within 24 h occurred only in MRS broth (model medium), NOT in the vegetable.** Do not quote a 24 h figure from this paper for a real vegetable.

### FINDING 3a-2 ★ Best paired sauerkraut datum: pH < 4.0 in 24 h with starter vs 3 days without
**Müller A, Rösch N, Cho GS, Meinhardt AK, Kabisch J, Habermann D, Böhnlein C, Brinks E, et al. (2018). "Influence of iodized table salt on fermentation characteristics and bacterial diversity during sauerkraut fermentation." *Food Microbiology* 76:473–480. Max Rubner-Institut (German federal research institute).**
DOI: <https://doi.org/10.1016/j.fm.2018.07.009> · PMID 30166176

- **Starter (*Lactobacillus plantarum* + *Leuconostoc mesenteroides*, each ~1 × 10⁷ CFU/mL): LAB reached 1 × 10⁹ CFU/mL after 24 h and pH fell below 4.0 within 24 h.**
- **Control (no starter): LAB rose from 1 × 10⁵ to 1 × 10⁹ CFU/mL more slowly and pH fell below 4.0 only after 3 days (~72 h).**
- Metagenomics: without starter the early community was enterobacteria and pseudomonads, later lactococci; **with starter, lactobacilli predominated and "Leuconostocs also occurred, but at much lower sequence abundance than lactobacilli, and thus were not able to predominate."**
- Shredded cabbage sauerkraut, real vegetable, plating + metagenomics.

**Confidence: STRONG for direction and for the 24 h vs 72 h difference** (verified abstract). **MODERATE for the exact pH values** — the source gives only the threshold-crossing times, not a pH curve, and does not report pH₀. **EXTRAPOLATION (my arithmetic, not the authors'):** if pH₀ ≈ 6.0, starter ≈ **0.083 pH units/h** vs control ≈ **0.028 pH units/h** → the starter is roughly **3× faster** on average over that window. Treat as illustrative only.

### FINDING 3a-3 ★ Sauerkraut: a starter that does NOT shorten the fermentation but changes its consistency and texture
**Johanningsmeier SD, McFeeters RF, Fleming HP, Thompson RL (2007). "Effects of *Leuconostoc mesenteroides* starter culture on fermentation of cabbage with reduced salt concentrations." *Journal of Food Science* 72(5):M166–M172. USDA-ARS / NC State.**
DOI: <https://doi.org/10.1111/j.1750-3841.2007.00372.x> · PDF: <https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf>

3 × 2 factorial: 0.5 / 1.0 / 2.0% NaCl × no starter vs *L. mesenteroides* LA 81 (ATCC 8293) at **10⁶ CFU/g** (≈2 logs above the natural cabbage flora of 3.0–3.6 log CFU/g). 18 °C, n = 3 jars/treatment, 4 cabbage lots, 10 months' storage.

| Endpoint (10 months, 18 °C) | Natural, 0.5 / 1.0 / 2.0% NaCl | Starter, 0.5 / 1.0 / 2.0% NaCl |
|---|---|---|
| **Final pH** | 3.49 / 3.44 / 3.44 | 3.47 / 3.46 / 3.42 |
| Lactic acid (mM) | 144.1 / 149.3 / 135.3 | 141.0 / 141.5 / 131.5 |
| Acetic acid (mM) | 69.0 / 59.8 / 48.4 | 57.0 / 60.1 / 53.0 |
| **Mannitol (mM)** | 86.7 / 88.5 / 82.9 | **99.7 / 102.1 / 94.1** |
| **Ethanol (mM)** | 91.6 / 107.6 / 114.4 | **75.0 / 59.0 / 30.4** |
| Residual glucose (mM) | 17.5 / 11.1 / 16.1 | 28.4 / 37.5 / 53.9 |
| Residual fructose (mM) | 0.13 / 0.65 / 0.80 | 1.97 / 1.60 / 8.70 |
| Commercial sauerkraut benchmark (10 samples) | pH 3.20–3.77; lactic 118.1–164.6 mM; acetic 65.6–120.3 mM; mannitol 18.5–88.3 mM | |

- **Final pH did not differ significantly (P = 0.75).** The paper's own claim is **uniformity, texture and reduced off-flavour, not time saved.**
- **"Fermentations were rapid, with a more uniform decline in pH when starter culture was added"** while natural fermentations at reduced salt were "highly variable" over the first 6 days.
- Texture/flavour: starter **consistently gave firm texture and reduced off-flavours across all salt levels (P < 0.05)**; natural fermentations at reduced salt showed **softening and off-flavours (P < 0.05)**. The starter **allowed 50% NaCl reduction.**
- **Lag phase, time to pH 4.0 and time to pH 3.5 are NOT reported numerically** — pH is in Figure 2 only.

**Confidence: STRONG for the chemistry table and for the "no days saved" conclusion; NO SUPPORT for any days-saved claim from this paper.**

### FINDING 3a-4 ★ COUNTER-EXAMPLE: a starter that measurably SLOWED kimchi acidification by ~1.5×
**Kim MJ, Lee HW, Lee ME, Roh SW, Kim TW (2019). "Mixed starter of *Lactococcus lactis* and *Leuconostoc citreum* for extending kimchi shelf-life." *Journal of Microbiology* 57(6):479–484.**
DOI: <https://doi.org/10.1007/s12275-019-9048-0> · PMID 31073899

- Kimchi with vs without starter (*L. lactis* WiKim0098 + *Leu. citreum* WiKim0096), **12 days at 10 °C**.
- Starter kimchi had a **lower initial pH and higher LAB at day 0**, **but the starter prolonged the time taken to reach pH 4.2 by approximately 1.5-fold** compared with the control.
- Mannitol: **5.1 mg/mL (starter) vs 3.4 mg/mL (control)** — i.e. the starter raised mannitol, consistent with 3c.
- Framed deliberately as a **shelf-life extension** strategy.

**Confidence: MODERATE** (verified abstract, peer-reviewed, real kimchi; this is the designers' intent, so it does not disprove that starters *can* accelerate — but it does disprove "starters always accelerate").

### FINDING 3a-5 Commercial-product comparison: no pH/TA difference between starter, additive and natural sauerkraut
**Liu W, Wang Y, Zhao T, Zheng Y, Mu G, Qian F (2024). "Effects of Different Production Methods on the Quality and Microbial Diversity of Sauerkraut in Northeast China." *Foods* 13(23):3947.**
DOI: <https://doi.org/10.3390/foods13233947> · **open full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC11640773/>**

- 15 commercial sauerkraut products: Group-L (LAB starter, 5 brands), Group-P (additives, 5), Group-H (farmer-made/natural, 5).
- **pH across all samples 3.99–5.0; total acid 1.281–2.191 g/100 g. "There was no significant difference among the three groups."**
- **Nitrite: not detected in any of the three groups.**
- Group-H had the highest microbial diversity and carried **Janibacter, Pseudomonas, Vagococcus** as characteristic genera — flagged by the authors as a safety disadvantage.
- Group-L had the highest esters and alcohols and the highest taste richness/aftertaste.

**Confidence: MODERATE** (real commercial product, n = 5 brands/group, 16S + GC-MS; **but confounded — brands differ in recipe, salt, temperature and duration, so this cannot isolate the starter effect**). Its value is as a reality check: **in commercial product, starter use does not show up as a pH or TA difference at the endpoint.**

### FINDING 3a-6 Sauerkraut day-5 divergence (spontaneous vs *Levilactobacillus brevis*)
**Wang J, Liu X, Liu J, Sui Y, Yu W, Kong B, Chen Q (2024). "Improving the bacterial community, flavor, and safety properties of northeastern sauerkraut by inoculating autochthonous *Levilactobacillus brevis*." *Food Chemistry: X* 24:101408.**
DOI: <https://doi.org/10.1016/j.fochx.2024.101408> · **open full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC11068551/>**

- Cabbage soaked 5 s in boiling water, then 2% NaCl brine, **starter 10⁷ CFU/g cabbage**, 15 °C, 30 days, **n = 3 batches**, 60 L fermenters.
- **"At the early stage of fermentation (day 5), the pH of CS [control] did not significantly (P > 0.05) change, but the pH of LB [inoculated] was significantly decreased (P < 0.05)."** → a **lag-phase difference of at least 5 days at 15 °C.**
- Total acid at day 30: **5.12 g/kg** (inoculated); both arms ended below pH 4.0.
- Lactic acid: **13.56 vs 10.61 mg/g (P < 0.05)**; succinic acid 0.63 vs 0.52 mg/g.
- Nitrite: control peaked at **11.43 mg/kg on day 10** and fell to 0.56; inoculated fell to **0.14 mg/kg**.
- Enterobacteriaceae: lower in inoculated throughout; both < 1.0 log CFU/mL at day 30.
- Volatiles: 82 vs 66 compounds at day 30; isothiocyanates higher in inoculated at day 10.

**Confidence: MODERATE** (real cabbage, triplicate batches, 30-day time course; **exact pH values are only in Fig. 1A**, so the numbers I can state are the nitrite, acid and qualitative pH statements). Note the authors also report a **5 s boiling-water dip of whole cabbage heads** as a pretreatment — relevant to 2(c) as an unreplicated step.

### FINDING 3a-7 Kimchi: starter vs natural titratable acidity and *E. coli* die-off
**Choi SJ, Yang SY, Yoon KS (2021). "Lactic acid bacteria starter in combination with sodium chloride controls pathogenic *Escherichia coli* (EPEC, ETEC, and EHEC) in kimchi." *Food Microbiology* 100:103868.**
DOI: <https://doi.org/10.1016/j.fm.2021.103868> · PMID 34416967
Starter = *L. mesenteroides* KCTC 13374 + *L. plantarum* KCTC 33133; 1% or 2.5% salt; 10 °C and 25 °C.
- **Titratable acidity: natural 0.65% vs starter 1.0%.**
- Pathogenic *E. coli* survived > 15 days at 10 °C regardless of starter, but died within 4 days at 25 °C.
- **Pathogenic *E. coli* died faster in kimchi with starter + 1% salt than in naturally fermented kimchi with 2.5% salt** — i.e. the starter partly substitutes for salt.
- **Reducing salt from 2.5% to 1% did not affect LAB growth or the fermentation period.**
**Confidence: MODERATE** (abstract-level; no time-to-pH reported).

### FINDING 3a-8 Kimchi: a starter mix that acidified faster under refrigeration
**npj Science of Food (2025)** — four *Leuconostoc* strains each at 10⁷ CFU/g vs a saline control; **5 °C for 33 days**; triplicate. Starter samples acidified faster during days 0–22; LAB counts > 70× control after day 11; pH range across the whole study 4.06–5.14.
**Confidence: MODERATE** — strong design but kinetics reported qualitatively, and 5 °C makes this a **storage** study rather than a production-speed study. (PMC12032216)

### FINDING 3a-9 Endpoint-only product comparisons (weak for rate)
- **Liu Y et al. (2023) *Foods* 12(6):1164** (open access, PMC10048197): commercial NE-China sauerkraut, 4 products, n = 3. Final pH: natural 3.80 | *L. paracasei* 3.67 | *L. plantarum* 3.59 | *L. plantarum* + *L. acidophilus* 3.62. Total acid: 9.00 / 10.98 / 14.06 / 10.44 g/kg. **Endpoint only; brands confounded. Confidence: WEAK–MODERATE.**
- **Peñas E, Frias J, Sidro B, Vidal-Valverde C (2010) *J Agric Food Chem* 58(6):3549–3557**, DOI: 10.1021/jf903739a, PMID 20170112 — sauerkraut, 0.5% and 1.5% NaCl × spontaneous vs *L. mesenteroides* / *L. plantarum* / mixed. Ascorbigen 14 → 63–137 µmol/100 g dm; vitamin C 354 → 236–277 mg/100 g dm. "**No differences in overall acceptability between natural fermentations and those with starter cultures.**" **No time data retrievable. Confidence: MODERATE, abstract only.**

### FINDING 3a-10 The Finnish and Hungarian sauerkraut starter literature — NUMBERS NOT OBTAINED
- **Wiander B, Ryhänen EL (2005). "Laboratory and large-scale fermentation of white cabbage into sauerkraut and sauerkraut juice by using starters in combination with mineral salt with a low NaCl content." *European Food Research and Technology* 220:319–323.** DOI: <https://doi.org/10.1007/s00217-004-1080-5> — **paywalled; abstract retrieved contains only "pH decreased rapidly in the beginning". NO numbers.**
- **Tolonen M et al. (2002) *J Agric Food Chem* 50(24):6798–6803**, DOI: 10.1021/jf0109017, and **Tolonen M et al. (2004) *Food Microbiology* 21(2):167–179**, DOI: 10.1016/S0740-0020(03)00058-3 — **paywalled.** The 2004 paper reports *Lc. lactis* N8 produced up to **1400 IU/mL nisin in cabbage brine within 24 h** and **250 IU/mL still at 13 days**; *L. sakei* gave **2–3× total glucosinolate breakdown products**. The 2002 paper: glucosinolates "totally decomposed in both fermentations during two weeks." **Neither abstract contains pH-time numbers.**
- **Halász A, Baráth Á (1999). "The influence of starter culture selection on sauerkraut fermentation." *Zeitschrift für Lebensmitteluntersuchung und -forschung A*.** Semantic Scholar record: <https://www.semanticscholar.org/paper/f710dbbcb169e084669af7e263ebf266f4981394> — **full text not retrieved.**
- **★ These are the single highest-value outstanding gaps for a sauerkraut days-saved number.**

### FINDING 3a-11 Starters in cucumber fermentations: no wild control in the retrievable record
- **Etchells JL, Costilow RN, Anderson TE, Bell TA (1964). "Pure Culture Fermentation of Brined Cucumbers." *Applied Microbiology* 12(6):523–535.** PMID 16349651 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC1058172/> — cucumbers were **sterilised by gamma radiation (0.83–1.00 Mrad) or blanching** before pure-culture inoculation, so there is **no spontaneous arm**. Key number: *L. delbrueckii* in cucumbers brined at 2.5–3.0% salt produced enough acid in **~30 h at 48 °C** to drop brine pH from > 7.0 to < 4.0. *P. cerevisiae* / *L. plantarum* / *L. brevis* were best at 5.4–5.6% NaCl; rates rose 21 → 27 → 32 °C but maximal populations and acidities were the same at each temperature; salt tolerance ~8% vs 2.5–4.0% for thermophiles. **Confidence: STRONG within design; NOT a wild-vs-starter comparison.**
- **Pérez-Díaz IM et al. (2015) *J Food Sci* 80(12):M2827–M2836**, PMID 26512798 — *L. plantarum* LA0045 at 10⁶ CFU/mL in **commercial 12,490 L and 28,400 L open-top tanks** (CaCl₂ brine + 6 mM sorbate, air purged): all completed by **day 14**, full sugar conversion, **pH → 3.0**, stable ≥ 21 days. **No wild control. Confidence: MODERATE.**

### FINDING 3a-12 A 1968 thesis and a 1964 report pointing the other way
- **Nabors (1968) MS thesis, Utah State University** (<https://digitalcommons.usu.edu/etd/5181/>): "Sauerkraut inoculated with *L. plantarum* was **slower in fermenting** and significantly lower in acidity and higher in pH." **Confidence: WEAK** (thesis, no replication detail) **but directionally consistent with 3a-4.**
**Collectively: the direction of the starter effect on rate is CONTESTED. Do not present "starters speed fermentation" as settled.**

## 3(b) Inoculum size and dose–response

### FINDING 3b-1 ★ The only true dose–response study found — and it is NOT proportional
**Nguyen TV et al. (2026). *Food Science & Nutrition*, DOI: 10.1002/fsn3.71917.** Open full text: PMC13184175.
Carrot **juice**, strain TO35 at ~10⁹ CFU/mL, inoculated at **1 / 2 / 3% v/v**, 30 °C, 48 h, n = 3, ANOVA + LSD.

| °Brix | 1% v/v | 2% v/v | 3% v/v | 1% → 3% change |
|---|---|---|---|---|
| 15 | 12.07 g/L LA, pH 3.33 | 12.75 g/L, pH 3.29 | 14.10 g/L, pH 3.18 | **+16.8% LA** |
| 9 | 10.88 g/L, pH 3.53 | 10.35 g/L, pH 3.49 | 11.48 g/L, pH 3.39 | **+5.5% LA (non-monotonic: 2% worse than 1%)** |
| 24 | 7.65 g/L, pH 3.97 | 8.16 g/L, pH 3.86 | 9.53 g/L, pH 3.66 | **+24.6% LA** |

- **Verdict: tripling the inoculum bought only +5.5% to +24.6% more lactic acid — clearly NOT proportional.** Larger inocula help most under osmotic stress (24 °Brix) but do not overcome it.
- Viable counts ~9.76–9.89 log CFU/mL in all arms — the inoculum size did not change the final population, only the speed.
- 24 h was the best sensory time point; 48–72 h over-acidified. **Lag phase not reported.**
- **Confidence: MODERATE** — n = 3, real dose levels, but **carrot JUICE (a model liquid)**, a single strain, phenotypically identified only (the authors' own stated limitation). **No 10⁵/10⁶/10⁷ CFU series.**

### FINDING 3b-2 ★ The best measured backslopping effect: 80% v/v reused brine bought only +5–11%
**Zhang S, Xiao Y, Jiang Y, Wang T, Cai S, Hu X, Yi J (2022/2023). "Effects of Brines and Containers on Flavor Production of Chinese Pickled Chili Pepper (*Capsicum frutescens* L.) during Natural Fermentation." *Foods* 12(1):101.** DOI: <https://doi.org/10.3390/foods12010101> · PMID 36613316 · open full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC9818826/>
Industrial **pickled chilli**. Aged brine : fresh = 1:4 → **80% v/v reused brine**. Four arms (pool/jar × fresh/aged brine), **8.16% NaCl, 20–25 °C, 30 days**, sampled 0/1/4/7/14/30 d, n = 3.

| Arm | pH at 30 d | First-order rate constant k (d⁻¹), R² > 0.90 |
|---|---|---|
| Pool, fresh brine | 3.96 ± 0.02 | 0.39 |
| Pool, aged (backslopped) | 3.92 ± 0.02 | 0.41 (**+5.1%**) |
| Jar, fresh brine | 3.79 ± 0.00 | 0.62 |
| Jar, aged (backslopped) | 3.71 ± 0.01 | 0.69 (**+11.3%**) |

- **DERIVED effect sizes (from the paper's kinetics modelling): backslopping = +5% to +11% on k; changing the VESSEL = +59% to +68%.** The container mattered ~6–12× more than the backsloop *for the acidification rate constant*.
- **Nuance from the verified abstract — do not over-simplify:** the authors' own headline is that "the effect of **brine** on organic acid, sugar, and aroma was more dominant than that of containers, while **free amino acids** production was more affected by containers than brines." Aged brine gave higher acidity (**pH 3.71–3.92** vs **3.79–3.96** for fresh brine). So the *vessel* wins on the k constant and on free amino acids, while the *brine* wins on organic acids, sugars and aroma. State the comparison you mean.
- pH fell significantly within 7 days then stabilised in all arms.
- Sugar consumed over 30 d: 20.30% / 16.34% / 43.43% / 1.72% (pool-fresh / pool-aged / jar-fresh / jar-aged).
- **Confounder to flag: reused brine carries pre-formed acid, so "inoculation" is entangled with carried-over acidity.**
- Time to pH 4.0/3.5 not computable (C₀ and C∞ are inside a figure box).
- **Confidence: STRONG for backslopping** (industrial scale, n = 3, isolates both brine and vessel effects). Verify the +5%/+11% k values against Table 3 of the full text before quoting them in a formal document — I confirmed the paper, the design, the n and the endpoint pHs independently, but the k constants come from one full-text read.

### FINDING 3b-3 Other backslopping inoculum sizes in the literature
- **Wang C et al. (2026) *Foods* 15(14):2564**, DOI: 10.3390/foods15142564, open full text PMC13408934 — pickled chilli, aged brine aged 0/5/15/25/50 years; **inoculum 50 mL aged brine per 250 mL total liquid = 20% v/v**; 9% w/v salt, 31 d at 20–25 °C, n = 5. **pH/time-to-pH NOT measured**; cites prior work that aged brine "may shorten fermentation cycles" but does not test it. **Confidence: MODERATE–STRONG design, but not a speed study.**
- **Liu Z et al. (2020) *Frontiers in Microbiology* 11:445**, DOI: 10.3389/fmicb.2020.00445, open full text PMC7146078 — radish pickle, 3 kg radish/jar + **30 mL old brine (6% salt)** + 6% NaCl water, 22–25 °C, pH measured daily for 12 d, n = 3. **Time to pH 3.5 = day 4** (glass, plastic) or **day 5** (porcelain). Nitrite peak day 2 = 59.73 mg/kg (porcelain). Lactic acid day 12: 18.04 g/L (plastic) vs 10.89 g/L (porcelain). **No no-backslopping control.** Inoculum % not computable (total brine volume unstated). **Confidence: MODERATE.**
- **Hu YY et al. (2024) *J Sci Food Agric* 104(14):8604–8612**, DOI: 10.1002/jsfa.13688, PMID 38925544 — Taiwanese pickled cabbage, backslopped 2nd round vs spontaneous 1st round. Total bacteria: spontaneous 6.1 → 10 log copies/mL; backslopped 7.6 → 9.9 log copies/mL (**backslopped started ~30× higher**). **No pH/time data in abstract.**

### FINDING 3b-4 Inoculum landscape across the studies retrieved
| Inoculum level | Study | Matrix |
|---|---|---|
| 10⁶ CFU/g | Johanningsmeier 2007; Zhao 2026 | sauerkraut; 3 vegetables |
| 10⁷ CFU/mL | Müller 2018 | sauerkraut |
| 10⁷ CFU/g | Wang 2024; npj Sci Food 2025 | sauerkraut; kimchi |
| 1 / 2 / 3% v/v of ~10⁹ CFU/mL | Nguyen 2026 | carrot juice |
| 20% v/v aged brine | Wang 2026 | pickled chilli |
| 80% v/v reused brine | Zhang 2023 | pickled chilli |
| 30 mL old brine/jar | Liu 2020 | radish pickle |

**USDA-ARS rationale for 10⁶ CFU/g: approximately 2 logs above the natural cabbage flora (3.0–3.6 log CFU/g).**

### 3(b) verdict
**There is no dose–response study on backslopped brine proportion (1% / 5% / 10% v/v) measuring lag phase or fermentation time for any vegetable**, and no starter-CFU dose series (10⁵ vs 10⁶ vs 10⁷) reporting lag phase for a whole fermented vegetable. The two data points that exist (Nguyen 2026; Zhang 2023) both say the same thing: **more inoculum does not buy proportionally more speed.**

## 3(c) What inoculation does to the microbial succession, flavour and CO₂

### FINDING 3c-1 ★ Backslopping alone does NOT skip the *Leuconostoc* phase — the added acid does
**Hu YY, Lo IH, Hsiao JT, Sheu F (2024). "Real-time PCR-based quantitative microbiome profiling elucidates the microbial dynamic succession in backslopping fermentation of Taiwanese pickled cabbage." *Journal of the Science of Food and Agriculture* 104(14):8604–8612.**
DOI: <https://doi.org/10.1002/jsfa.13688> · PMID 38925544 (verified abstract)
- Spontaneous 1st round: total bacteria 16S copies **6.1 → 10 log copies/mL**; succession ***Lactococcus* → *Leuconostoc* → *Lactiplantibacillus***. (Notably the *absolute* abundance of *Lactococcus* still increased even as its *proportion* fell.)
- Backslopped 2nd round: **7.6 → 9.9 log copies/mL**.
- **Backslopping starter + vinegar → homogeneous community dominated by *Lactiplantibacillus*, consistently ~90% proportion through the round.**
- **Backslopping WITHOUT vinegar → *Leuconostoc* dominated the whole fermentation.**
**Verdict: the phase-skip is driven by the acid load (or by a homofermentative strain), not by backslopping per se.** Confidence: MODERATE (the only quantitative *de novo* backslopping × succession study found; single product, single plant; counts are 16S copies not CFU; n/funding not visible in the abstract).

### FINDING 3c-2 A *L. plantarum* + *L. mesenteroides* starter does suppress *Leuconostoc* dominance
**Müller et al. (2018)** (see 3a-2): with starters, "**lactobacilli predominated. Leuconostocs also occurred, but at much lower sequence abundance than lactobacilli, and thus were not able to predominate.**" **Confidence: STRONG** for direction, genus-level relative abundance only.

### FINDING 3c-3 A heterofermentative starter *reinforces* the *Leuconostoc*/*Weissella* phase
**Jung JY, Lee SH, Lee HJ, Seo HY, Park WS, Jeon CO (2012). "Effects of *Leuconostoc mesenteroides* starter cultures on microbial communities and metabolites during kimchi fermentation." *International Journal of Food Microbiology* 153(3):378–387.** DOI: <https://doi.org/10.1016/j.ijfoodmicro.2011.11.030> · PMID 22189023
Baechu and Chonggak kimchi ± *Leu. mesenteroides* B1, 40 days. The starter **increased *Leuconostoc* proportions and decreased *Lactobacillus* proportions** in both kimchi types, and **maintained *Weissella* proportions higher** than the non-starter until fermentation was complete. Starter kimchi lost bacterial OTUs faster. Korean RDA/MAFRA funded.
**Confidence: MODERATE–STRONG.** **This is direct evidence that "starter ⇒ skips Leuconostoc" is wrong in general — it depends entirely on which organism you pitch.**

### FINDING 3c-4 Consequences for CO₂ / gas / bloater (cucumber, USDA-ARS — the best numbers)
**Zhai Y, Pérez-Díaz IM (2020). "Contribution of *Leuconostocaceae* to CO₂-mediated bloater defect in cucumber fermentation." *Food Microbiology* 91:103536.** DOI: <https://doi.org/10.1016/j.fm.2020.103536> · PMID 32539962
- ***Leuconostocaceae* produced > 40% CO₂ in cucumber juice medium.**
- **A *L. lactis* starter in acidified cucumbers → 13.6 ± 3.5% CO₂ and bloater index 21.3 ± 6.4, vs non-inoculated 8.6 ± 0.8% CO₂ and bloater index 5.2 ± 5.9.**
- **Inoculating *Leuconostocaceae* at 5 log CFU/g gave NO significant difference** — they could not prevail.
**Interpretation: in cucumbers, pitching a heterofermentative *Leuconostoc* does not reliably take over, but the resident *Leuconostocaceae* drive gas; a homofermentative *Lactococcus* starter *increased* CO₂ and bloater in this trial.** Confidence: MODERATE (abstract-level).
**Zhai Y, Pérez-Díaz IM (2017) *J Food Sci* 82(12):2987–2996**, PMID 29125622 — Ca(OH)₂ supplementation raised *Leuconostocaceae* relative abundance by **+7%**, CO₂ by **+25%**, lactic acid by **+22%**; Enterobacteriaceae fell **−92%**; acetic acid fell **−50%** with Ca(OH)₂ + 690 mM NaCl. CO₂ stayed above the **20 mg/100 mL** bloater threshold.

### FINDING 3c-5 Consequences for mannitol and the lactic:acetic balance
- **Kimchi, 28 d at 5 °C: mannitol 1,423 ± 19.1 mg/100 g (starter) vs 1,027 ± 12.2 mg/100 g (no starter) = +38%.** Mixed starter 1,327 ± 7.2; competitor commercial products 960 and 1,250 mg/100 g. Lee KW et al. (2020) *J Microbiol Biotechnol* 30(7):1060–1066, DOI: 10.4014/jmb.2001.01011, **open full text PMC9728259. Note: industry-affiliated authors (Pulmuone Institute of Technology).** Confidence: MODERATE.
- **Sauerkraut, 10 months (Johanningsmeier 2007, table above): starter raised mannitol at every salt level (99.7/102.1/94.1 vs 86.7/88.5/82.9 mM) and cut ethanol sharply (75.0/59.0/30.4 vs 91.6/107.6/114.4 mM) — i.e. the starter shifted carbon away from ethanol and toward mannitol.** Confidence: STRONG.
- **Model kimchi, 15 °C, 72 h:** high-rate heterofermentative *L. mesenteroides* → mannitol **1,393.11 mg/100 g**, acetic acid **57.70**, lactic acid **1,141.90**, **pH 3.9**; high-rate homofermentative *L. sakei* → less mannitol and acetic acid, more lactic acid. Lee JJ et al. (2020) *Food Research International* 136:109591, DOI: 10.1016/j.foodres.2020.109591, PMID 32846617. **UNIT WARNING: the abstract prints the acid values as "mg/kg", almost certainly a typo (kimchi lactic acid is ~1–2% ≈ 10,000–20,000 mg/kg). Digits as printed; units unreliable.**
- **★ No study was found reporting the lactic:acetic ratio as % of total acidity for inoculated vs spontaneous sauerkraut or kimchi.** Directional statements only.
- **★ No quantitative mg/kg values for diacetyl, acetoin, acetaldehyde or individual esters** in backslopped vs spontaneous vegetable fermentations.

### FINDING 3c-6 The counter-intuitive kinetic point: *Leuconostoc* is the FAST acidifier
**Seo H, Bae JH, Kim G, Kim SA, Ryu BH, Han NS (2021). "Suitability Analysis of 17 Probiotic Type Strains of Lactic Acid Bacteria as Starter for Kimchi Fermentation." *Foods* 10(6):1435.**
DOI: <https://doi.org/10.3390/foods10061435> · PMID 34205741 · **open full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC8234146/>**
17 probiotic type strains at **10⁵ cells/g**, n = 3, in sterilised kimchi juice at 15 °C, plus validation in real kimchi at 10 °C. **Time to pH 4.4: *Leuconostoc mesenteroides* = 1 day; *L. plantarum*, *L. rhamnosus*, *L. paracasei* = 2 days; *L. casei* = 4 days; *L. fermentum* = 5 days.** In real kimchi at 10 °C, *Le. mesenteroides* and *L. fermentum* reached pH 4.4 on **day 3**; *L. reuteri*, *L. rhamnosus*, *L. paracasei*, *L. salivarius* decreased more slowly.
**Implication: skipping the *Leuconostoc* phase is not obviously a speed strategy — the heterofermentative *Leuconostoc* is ~2× faster to pH 4.4 than *L. plantarum* in this system.** Confidence: MODERATE–STRONG (verified abstract; the model arm is sterilised juice, and there is no true spontaneous control).

### FINDING 3c-7 Nisin as a deliberate tool to delay the hetero→homo switch
**Harris LJ, Fleming HP, Klaenhammer TR (1992). "Novel paired starter culture system for sauerkraut, consisting of a nisin-resistant *Leuconostoc mesenteroides* strain and a nisin-producing *Lactococcus lactis* strain." *Applied and Environmental Microbiology* 58(5):1484–1489.** PMID 1622215 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC195629/>
Nisin was detected **within 24 h** and stayed roughly constant over 12 days, at a level sufficient to **retard the onset of growth of nisin-sensitive homofermentative *L. plantarum* ATCC 14917**. Laboratory-scale model sauerkraut fermentation.
**Confidence: MODERATE** (abstract-level; lab scale) — but it demonstrates that the hetero→homo switch can be deliberately **delayed**, which is the mechanistic handle for controlling the CO₂/acetic-acid profile.

## 3(d) Risk: spoilage and bacteriophage — does backslopping help or hurt?

### FINDING 3d-1 ★ Bacteriophages are real and abundant in commercial vegetable fermentations
- **Yoon SS, Barrangou-Poueys R, Breidt F Jr, Klaenhammer TR, Fleming HP (2002). "Isolation and characterization of bacteriophages from fermenting sauerkraut." *Applied and Environmental Microbiology* 68(2):973–976.** DOI: 10.1128/AEM.68.2.973-976.2002 · PMID 11823247 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC126688/>
  **First report of phage from commercial vegetable fermentations. Nine phages from two 90-ton commercial sauerkraut fermentations, active against fermentation isolates and against selected *Leuconostoc mesenteroides* and *Lactobacillus plantarum* strains INCLUDING A STARTER CULTURE.** One 90-ton tank was inoculated with *L. mesenteroides* LA10 (grown to 10⁹ CFU/mL, sprayed to give ~10⁵ CFU/g) at 1.0–1.2% equilibrated NaCl; the other was uninoculated at 2.25% NaCl. **Confidence: STRONG** (two real 90-ton plants).
- **Lu Z, Breidt F, Plengvidhya V, Fleming HP (2003). "Bacteriophage ecology in commercial sauerkraut fermentations." *Applied and Environmental Microbiology* 69(6):3192–3202.** DOI: 10.1128/AEM.69.6.3192-3202.2003 · PMID 12788716 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC161505/>
  Four commercial sauerkraut tanks, 60- or 100-day periods, 2000 and 2001. **171 phage isolates including ≥ 26 distinct phages; 28 distinct LAB host strains (*Leuconostoc*, *Weissella*, *Lactobacillus*). TWO phage–host systems corresponding to the population shift from heterofermentative to homofermentative LAB between 3 and 7 days after the start.** Eight phages were isolated independently ≥ 2×. **This is the single most on-point citation for "phages and the succession".** Confidence: STRONG but **correlative — it does not prove causation.**
- **Barrangou R, Yoon SS, Breidt F Jr, Fleming HP, Klaenhammer TR (2002). "Characterization of six *Leuconostoc fallax* bacteriophages isolated from an industrial sauerkraut fermentation." *Applied and Environmental Microbiology* 68(11):5452–5458.** PMID 12406737 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC129880/> — six phages, exclusively lytic against *L. fallax*, all genetically distinct; "**could be responsible for some of the variability observed in this type of fermentation**" (explicitly hedged).
- **Mudgal P, Breidt F Jr, Lubkin SR, Sandeep KP (2006). "Quantifying the significance of phage attack on starter cultures: a mechanistic model..." *Applied and Environmental Microbiology* 72(6):3908–3915.** PMID 16751496 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC1489654/>
  **Phage-resistant cell populations in starter cultures replaced phage-sensitive cells even when the initial phage density P₀ < 1 × 10³ PFU/mL and MOI < 10⁻⁴.** Model **validated in MRS broth, not sauerkraut**; the authors state it must be extended to commercial fermentations. Confidence: MODERATE.
- **Kimchi: Park WJ, Kong SJ, Park JH (2021). "Kimchi bacteriophages of lactic acid bacteria: population, characteristics, and their role in watery kimchi." *Food Science and Biotechnology* 30(7):949–957.** DOI: 10.1007/s10068-021-00930-y · PMID 34395026 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC8302715/>
  Retail Seoul-market kimchi: **mean 2.1 log phage particles/mL = 28% of bacterial counts on a log scale. 5.5–6.5 log phage particles/mL in the EARLY phase (at the point of reaching pH 4); 2.1–3.0 log in the later phase.** LAB hosts changed ***Weissella* and *Leuconostoc* → *Lactobacillus*** during Dongchimi fermentation. 15 phages isolated from the early phase: 5 *Weissella* phages (Podoviridae), 10 *Leuconostoc* phages (Myoviridae); narrow host spectra; high acid stability. **Confidence: STRONG.**
- **Cucumber: Lu Z, Breidt F, Fleming HP, Altermann E, Klaenhammer TR (2003). "Isolation and characterization of a *Lactobacillus plantarum* bacteriophage, φJL-1, from a cucumber fermentation." *International Journal of Food Microbiology* 84(2):225–235.** DOI: 10.1016/S0168-1605(03)00111-9 · PMID 12781945
  **φJL-1 was isolated from a commercial cucumber fermentation and was specific for two related *L. plantarum* strains, BI7 and its mutant MU45, WHICH HAVE BEEN EVALUATED AS STARTER CULTURES for controlled cucumber fermentation.** Genome 36.7 kbp; **latent period 35 min, rise 40 min, burst size 22 phage particles/infected cell; 90% adsorption at 20 min. Calcium supplementation (up to 30 mM CaCl₂) did not affect the first adsorption cycle but promoted rapid phage propagation and cell lysis in the subsequent cycle** — directly relevant because CaCl₂ brines are the low-salt cucumber process. **Confidence: STRONG. This is the clearest case of a phage specifically targeting a vegetable starter strain.**
- **Lu Z, Pérez-Díaz IM, Hayes JS, Breidt F (2020). "Bacteriophages infecting Gram-negative bacteria in a commercial cucumber fermentation." *Frontiers in Microbiology* 11:1306.** DOI: 10.3389/fmicb.2020.01306 · PMID 32670232 · <https://pmc.ncbi.nlm.nih.gov/articles/PMC7332585/>
  **DIRECTION MATTERS — in cucumber, phage is PROTECTIVE, not a risk.** Day 1 and 3 cover brine: 39 Gram-negative bacteria + 26 independent phages; ~67% of Gram-negative isolates were phage-susceptible; ~88% of phages infected Enterobacteriaceae, 58% infected *Enterobacter*. **Phage at MOI 1 or 100 gave a 5-log reduction of *Enterobacter cancerogenus* within 3 h.**

### FINDING 3d-2 ★ THE KEY NEGATIVE: there is NO measured vegetable fermentation failure attributed to phage
Every vegetable phage source retrieved is (i) presence/characterisation, (ii) a **correlative** association with the hetero→homo shift (Lu 2003), or (iii) a **model prediction validated in MRS broth** (Mudgal 2006). **No retrieved study documents a measured sauerkraut, kimchi or cucumber fermentation failure caused by phage infection of an added starter or backsloop.** The classic papers' own framing is "phages **may** play an important role" and "**could** potentially affect the starter cultures introduced."
**Confidence: STRONG that this is an evidence gap. Contrast with dairy, where failure is asserted outright (below).**

### FINDING 3d-3 The dairy parallel — clearly labelled DAIRY, not vegetable
- "Bacteriophages infecting dairy starter bacteria are **a leading cause of milk fermentation failure**." Rendueles et al. (2022) *MicrobiologyOpen* 11(4):e1308, PMID 36031956, <https://pmc.ncbi.nlm.nih.gov/articles/PMC9358928/>.
- **The true backslopping analogue: drained cheese whey — i.e. the recycled stream — can be contaminated with phages at up to 10⁹ phages/mL, and concentration of whey batches can increase phage titres 10-fold.** "Whey from former cheese batches is frequently re-used… Most bacteriophages survive pasteurization and may re-enter the cheese manufacturing process." Atamer Z, Samtlebe M, Neve H, Heller KJ, Hinrichs J (2013) *Frontiers in Microbiology* 4:191, DOI: 10.3389/fmicb.2013.00191, PMID 23882262.
- Whey powders: lytic *L. lactis* phages in **all** samples; *S. thermophilus* and *Leuconostoc* phages in **50%** and **40%** of samples; maximum titres **6 × 10⁷ PFU/g** (*L. lactis*), **1 × 10⁷ PFU/g** (*Leuconostoc*), **1 × 10⁵ PFU/g** (*S. thermophilus*); phages stable over 4 years' storage. Wagner et al. (2017) *Int J Food Microbiol* 241:308–317, PMID 27835774.
- **★ No study measured phage titres in a BACKSLOPPED vegetable brine** — the direct analogue of the dairy whey figure. This is the single most important unmeasured quantity for 3(d).

### FINDING 3d-4 Biogenic amines — starters reduce them only modestly, and some strains increase them
- **Best direct number:** Dongbei Suancai, 60 d. ***L. plantarum* SC-5-inoculated total biogenic amines 216.72–237.33 mg/kg vs spontaneous 234.62–266.81 mg/kg (P < 0.05)** — only **~8–12% lower**. Predominant BAs putrescine, tyramine, spermidine, cadaverine, histamine; all increased over 60 d. Ye H et al. (2021) *Food Research International* 150(Pt B):110813, DOI: 10.1016/j.foodres.2021.110813, PMID 34863503. **Confidence: MODERATE–STRONG. Magnitude is small — do not oversell.**
- **A starter can INCREASE biogenic amines:** *L. brevis* BC1M20 inoculated into Baechu kimchi → **tyramine content and *tdc* gene expression were HIGHER in the inoculated kimchi than the control.** Lee et al. (2024) *Food Science and Biotechnology* 33(10):2301–2312, PMID 39145125. **Risk is strain-specific — an uncontrolled backsloop can concentrate BA producers.**
- Threshold context: some kimchi exceeded the **recommended limit of 100 mg/kg for both histamine and tyramine**. Park YK, Lee JH, Mah JH (2019) *Foods* 8(11):547, PMID 31689884, <https://pmc.ncbi.nlm.nih.gov/articles/PMC6915361/>.
- Commercial Polish fermented vegetables (85 samples, 19 varieties): total 9 BAs from **30.29 ± 16.43 mg/kg** (olives) to **612.1 ± 359.33 mg/kg** (Brussels sprout); putrescine 42%, tyramine 20%, cadaverine 18%, histamine 8%. **BAI > 400 mg/kg in Brussels sprout and broccoli.** Świder et al. (2020) *J Agric Food Chem* 68(3):856–868, PMID 31891502. **Elevated BA occurs in commercial product, i.e. is not confined to artisanal backslopping.**
- **★ Ingredient choice moves BA far more than the starter decision:** putrescine and tyramine reached **14–15× initial values after 7 days**; total BA of kimchi **without fish sauce was 42–63% lower** than with 5% fish sauce; with **8% red pepper powder, 25–44% lower**. Kim, Dang & Ha (2022) *Food Chemistry* 380:132214, PMID 35093653.

### FINDING 3d-5 Pathogens, nitrite, moulds
- **Spontaneous sauerkraut lets pathogens persist for most of the fermentation:** 5-strain mixtures of *E. coli* O157:H7 and *L. monocytogenes*, 18 & 22 °C, 1.8/2.25/3% salt, shredded vs whole-head. **Both pathogens persisted in the brines for most of the fermentation**; undetectable at the end (**15 d shredded, 28 d whole-head**); **acid-tolerant strains isolated after 15 d could still be detected at 35 d in whole-head sauerkraut.** Niksic et al. (2005) — see 2a-2. **No starter or backsloop arm exists.**
- **A bacteriocin-producing starter roughly doubles pathogen kill:** kimchi with *Leuconostoc citreum* GJ7, pathogens spiked to 5.41–5.63 log CFU/mL, 10 °C. At 48 h: reductions of **2.69 / 2.88 / 3.42 log CFU/mL** (*E. coli* O157:H7 / *S.* Typhi / *S. aureus*) **without** the starter vs **3.85 / 4.45 / 5.19 log CFU/mL with it** (≈1.2–1.8 log extra kill). Chang & Chang (2011) *J Food Sci* 76(1):M72–M78, PMID 21535696.
- Nitrite with a starter: **≤10 mg/kg peak vs 20–46 mg/kg** (Zhao 2026, 3a-1); **0.14 vs 0.56 mg/kg at day 30** (Wang 2024, 3a-6); **not detected in any of 15 commercial sauerkrauts** (Liu 2024, 3a-5).
- **★ MOULDS / MYCOTOXINS: nothing found at all.** No study on mycotoxins, ochratoxin or mould spoilage in backslopped vs spontaneous vegetable fermentations.
- Adjacent hazard not caused by backslopping: **shredded cabbage, 250 g bags, 70% CO₂ / 30% N₂ at room temperature — only type A *C. botulinum* spores grew and produced toxin; ~100–200 type A spores/g produced toxin on days 4, 5 and 6 while the cabbage was still organoleptically acceptable.** Solomon et al. (1990) *J Food Prot* 53(10):831–833, PMID 31018284.

### 3(d) verdict
**Backslopping/starter inoculation direction on risk is genuinely mixed:**
- **Reduces:** nitrite (large, consistent), pathogen survival (moderate, ~1–2 log extra kill with a bacteriocin producer), biogenic amines (small, ~8–12%).
- **Does not change:** final pH/TA in commercial product.
- **Increases (strain-specific):** tyramine if the pitched strain is a BA producer.
- **Phage: real and abundant, demonstrably able to attack a starter strain, but no vegetable fermentation failure has ever been measured.** The dairy failure rate is the analogy, not the evidence.

## 3(e) Commercial starter products — what exists, what is verified, what is marketing

### FINDING 3e-1 ★ THE HEADLINE: no branded retail vegetable starter has ever been independently tested
**Zero peer-reviewed papers named or tested any of the branded retail vegetable starters** retrieved: Caldwell's Starter Culture for Fresh Vegetables, Cutting Edge Cultures Starter Culture for Raw Fermented Vegetables, Body Ecology Veggie Culture Starter, Nordwise Natural Pickling Starter, or startercultures.eu's own-brand vegetable starter. **No CFU dose is disclosed by any of these five products** — a systematic transparency gap.
**Confidence: STRONG that this is a gap** (dedicated product-page retrieval for each vendor plus a literature search for each brand name).

### FINDING 3e-2 ★ The specific "ready in 5 days instead of 14" claim does not exist on any product page retrieved
**The specific marketing construct the user asked about was not found on ANY product page retrieved.** The closest things to hard time claims are:
- **Nordwise / BioCC OÜ (Estonia)** — single strain *Lactobacillus plantarum* TAK59, 20.5 g pack seasons 2 kg cucumbers, €4.50: "lowering the pH value of the cucumbers from the first day until the end of the fermentation"; "**Depending on desired acidity level the fermentation lasts for 1–2 days**" at ~22 °C. <https://saksavorst.ee/en/product/nordwise-natural-pickling-starter-culture-with-seasoning-205g/> — **this is the most aggressive concrete time claim found (1–2 days for cucumbers) and it is entirely unreferenced.**
- **Cutting Edge Cultures**: the phrase is "tasty, consistent results and a **quicker, more complete fermentation***", but the same page's instructions say "**let it ferment at room temperature (70 °F) for 7 to 10 days**." <https://cuttingedgecultures.com/starter-culture-for-making-raw-fermented-vegetables/>
- **Body Ecology**: "Let veggies sit at about a 70° room temperature for **at least 3 days**. A week is even better." <https://bodyecology.com/products/veggie-culture-starter>
- **Caldwell**: **no time-savings figure at all** — only "produce consistently successful results, enhancing taste, crispness and health benefits" and "Refrigeration is recommended." <http://caldwellbiofermentation.com/starter-culture.html>
**Confidence: STRONG that the "5 days instead of 14" phrasing is not from these vendors.**

### FINDING 3e-3 ★ Cutting Edge's own in-house pH charts (numbers extracted by reading the chart images)
<https://cuttingedgecultures.com/research/> — two undated pH line charts, **no author, no lab, no methods, no n**; legend names competitors only as "US Starter Culture" and "Canadian Starter Culture."
- **"pH During First 24 Hours":** control (no starter) stays ~5.5 all day; Caldwell ("Canadian Starter Culture") falls to ~4.9 by day 1; **Cutting Edge drops to ~4.5 by ~0.17 day (≈4 h) and ~4.05 by day 1.**
- **"pH Over 10 Days":** Cutting Edge reaches pH ~3.4 by day ~2.5 and ~3.2 by day 10; **control reaches ~3.5 only at day ~10.** Control peaks ~5.7 at day ~0.5.
**Confidence: WEAK — manufacturer in-house, unpublished, unreplicated, unnamed comparator.** These numbers are nonetheless the *only* pH-vs-hours curves for a retail product that exist anywhere in the retrieved record, and they agree in magnitude with the peer-reviewed Müller 2018 datum (pH < 4.0 in 24 h with starter). **Cite them as "manufacturer in-house, unverified" or not at all.**

### FINDING 3e-4 Product table (only values actually retrieved)

| Product | Manufacturer | Strains as declared | CFU dose | Dose/pack | Price | Documented time claim |
|---|---|---|---|---|---|---|
| Starter Culture for Fresh Vegetables | Caldwell Bio Fermentation (Canada) | *Lactobacillus plantarum*, "*Lactobacillus mesenteroides*" [sic], *Pediococcus acidilactici* + organic maltodextrin | **not disclosed** | 6 pouches; 1 pouch per 4.5 lb (~2 kg) veg; EU pack 3 × 2 g for 6–7 kg | €29.99 (out of stock, EU); AUD 34.95 (out of stock) | **none** |
| Starter Culture for Making Raw Fermented Vegetables | Cutting Edge Cultures | *Lb. plantarum*, *Ln. mesenteroides*, *Pc. acidilactici* + non-GMO tapioca | **not disclosed** (1 g sachets) | 6 sachets; 1 sachet per 5 lb (~1 gal) | $28.99 (vendor); $37.99 (retailer) | "quicker, more complete fermentation"; instructions say 7–10 days at 70 °F |
| Veggie Culture Starter | Body Ecology | "*Lb. plantarum*, *Pediococcus acidolactici* [sic], *Leu. cremoris* [sic]" + inulin | **not disclosed** | 6 packets | $28.99 | "at least 3 days; a week is even better" |
| Nordwise natural pickling starter | BioCC OÜ (Estonia) | single strain *Lactobacillus plantarum* TAK59 + dried seasoning | **not disclosed** | 20.5 g per 2 kg cucumbers | €4.50 | "**fermentation lasts for 1–2 days**" at ~22 °C |
| Vegetable fermentation starter | startercultures.eu (NL) | *Lb. plantarum*, *Lb. mesenteroides*, *Pc. acidilactici* + corn dextrose | **not disclosed** | 5 g sachet = 2 doses; 1 dose per 2 kg | €11.99 (discontinued) | "accelerates the lacto-fermentation process… more rapid acidification"; no day figure |
| **Picallili Vpro** | (US pickling supplier, unnamed) | ***Lactiplantibacillus pentosus* LA0445** | not retrieved | not retrieved | not retrieved | **cucumbers fermented to pH 3.3** |

**Body Ecology strain-identity flag:** the printed names "*Pediococcus acidolactici*" and "*Leu. cremoris*" both appear to be errors; *Leuconostoc cremoris* is a **dairy** species, not a vegetable one.
**Picallili Vpro source:** USDA-ARS interpretive summary for Perez Diaz IM, Santos A, Page CA, Santos F, Arroyo-Lopez FN (2026) *J. Food Sci.* 91, DOI: <https://doi.org/10.1111/1750-3841.71363> · <https://www.ars.usda.gov/research/publications/publication/?seqNo115=429409> — verbatim: "**Currently, in the U. S. A., there is a handful of companies that manufacture starter cultures for pickling. An example is the Picallili Vpro that consist of *Lactiplantibacillus pentosus* LA0445 proficient in the fermentation of cucumbers to pH 3.3.**" Same source: "**While starter cultures for dairy products are readily available worldwide, the plant-derived counterparts proficient in pickling are scarce. The relatively small volume of starter cultures needed by the pickling industry in the U. S. A., relative to the dairy industry, is unattractive for their profitable commercialization.**" **No vendor page, price, pack size or CFU for Picallili Vpro could be found.**

### FINDING 3e-5 ★ The big industrial culture houses do NOT sell a vegetable fermentation starter
This is an important negative that contradicts a common assumption:
- **Novonesis (Chr. Hansen + IFF)** — the only verified plant-based offering is **Vertera FreshQ**, positioned entirely for plant-based **yoghurt** ("vegurt") against yeast/mould spoilage, frozen format. **No strain list, no CFU, no vegetable/sauerkraut/kimchi application, no time claim.** <https://www.novonesis.com/en/biosolutions/food-and-beverages/plant-based-foods/plant-based-yogurt/vertera-freshq> **No "VEG-START" product page exists in retrievable form.**
- **IFF / DuPont Danisco "VEGE" range (022, 033, 053…)** — these are **plant-based dairy analogues**, incubated at **43–45 °C**: VEGE 022 = *Streptococcus thermophilus* + *Lactobacillus delbrueckii* subsp. *bulgaricus* + *L. plantarum* + *L. acidophilus* NCFM + *Bifidobacterium lactis* HN019; VEGE 033 = *S. thermophilus* + *L. delbrueckii* subsp. *bulgaricus* only. Dose 10–20 DCU per 100 L; AUD 5,641.09 per carton of 50 × 200 DCU sachets (= $110.60/sachet). **Species and temperature are irrelevant to sauerkraut/kimchi/pickle fermentation.** The "clinically backed health benefits" refer to the HOWARU probiotic strains (NCFM, HN019) and their human digestive-health trials — **not to vegetable fermentation performance. Conflating the two is a marketing move.** <https://www.cheeselinks.com.au/product/vege-022-lyo-200-dcu>
- **Sacco System "VChoice"** — cultures for soy, lupin, pea, chickpea, broad bean, coconut, oat, rice, almond, cashew; **plant-based dairy analogues only. No vegetable application, no strains, no CFU, no time claim.** <https://saccosystem.com/en/ingredients/cultures-for-plant-based-fermented-products-vchoice/>
- **Lallemand** — no vegetable-ferment starter product retrievable (Lalmedia is fermentation *nutrients*, not a starter).
- **Chr. Hansen "Bactoferm"** is a **meat** starter, not a vegetable culture.
- **White Labs** — the yeast-cultures page contains **zero** occurrences of "vegetable", "sauerkraut", "kimchi", "pickle" or "Lactobacillus". **No vegetable culture.**
- **No Ball / Kerr / Fresh Preserving sauerkraut starter SKU found** (freshpreserving.com returned HTTP 403 to all fetches; their indexed catalogue shows fermentation kits, crock lids and weights but no starter-culture SKU). **Unresolved — flag as unverified rather than absent.**

### FINDING 3e-6 Korean "kimchi lactobacillus" products are PROBIOTIC SUPPLEMENTS, not fermentation starters
- **BOW Co. (GMAJABOW) "Kimchi Probiotics Plus 100"** — "kimchi-derived *Lactobacillus plantarum* + 17 types of mixed lactobacillus"; "one packet includes **10 billion planta kimchi lactobacillus and 1 billion *Lactobacillus alpha*, with a mixture of 17 types**" (≈1.1 × 10¹⁰ CFU/stick); 2 g × 30 sticks; B2B price on request; HACCP. **Application: probiotic supplement for constipation/bloating — not a starter. No fermentation-time claim.** <https://tradekorea.com/product/detail/P801562/Kimchi-Probiotics-Plus-100-60g-2g-x-30-sticks-.html>
- **CTC Bio** lists kimchi-derived strains (*L. plantarum* CLP0611, *L. plantarum* OK169, *B. breve* LMC520, *L. brevis* G101) as **coated probiotics**, not a kimchi starter. <https://www.ctcbio.com/en/business/health_basic_lacto_individual.php?tabName=con01>
- **CJ CheilJedang** — **no packaged kimchi starter product found.** Their published case study is internal industrial use: strain **CJGN34** applied to CJ's own "Hasunjung Kimchi" line; CJLP133 (skin) and CJLP243 (gut) are commercialised probiotics. Company press release only, no peer-reviewed product comparison. <https://www.cj.co.kr/en/newsroom/pressreleases/news-detail/1281>
- **No BioLeaders or Cell Biotech kimchi starter product found**; **no retail "kimchi starter powder" SKU with a strain list and price found.**

### FINDING 3e-7 ★ The closest thing to an independent test of a COMMERCIAL starter in real sauerkraut
**Wiander B, Ryhänen EL (2005). "Laboratory and large-scale fermentation of white cabbage into sauerkraut and sauerkraut juice by using starters in combination with mineral salt with a low NaCl content." *European Food Research and Technology* 220:319–323.** DOI: <https://doi.org/10.1007/s00217-004-1080-5> · AGRIS record: <https://agris.fao.org/search/en/records/65e001bcb766d82b1803f1e1>
Verbatim from the retrievable record: "**Commercial starters were used in this study** in combination with mineral salt with a low sodium chloride content for fermentation of white cabbage into sauerkraut, from which sauerkraut juice was pressed… Lactic acid bacteria strains were used in various combinations." Outcomes: "**The pH decreased rapidly in the beginning of the fermentations, ensuring an accurate start of the process. The fermentation process could be controlled and the end products were of good and uniform quality.**" Taste panel: juices "highly acceptable"; *Leuconostoc mesenteroides* + mineral salt gave "an especially mild tasting sauerkraut juice with good sensory and microbiological quality."
**★ Time savings are NOT QUANTIFIED in the retrievable record; exact pH at 24/48 h is NOT in the retrievable record (full text paywalled).** **Confidence: STRONG for the qualitative outcome, WEAK for any numeric claim.**

### FINDING 3e-8 Independent studies using defined strains in real vegetables (not branded products)
- **Perez Diaz IM, Santos A, Page CA, Santos F, Arroyo-Lopez FN (2026). "Methods for maintaining and using lactic acid bacteria starter cultures for commercial cucumber fermentation brined with reduced salt." *J. Food Sci.* 91.** DOI: <https://doi.org/10.1111/1750-3841.71363> — **real commercial cucumber fermentation.** Resuscitation of preserved LAB in cucumber/carrot/sweet-potato juice took **24–30 h at ambient**; pre-adaptation in Cucumber Fermentation Medium (342 mM / 2% NaCl) reached maximum cell density in **12–24 h** (*Lc. lactis* and *Lp. plantarum* peaked in 12 h, *Lp. pentosus* 14 h, *Lev. brevis* and *Pediococcus* spp. 16 h); cultures "**reduced the pH to 5.8 ± 0.3 by the time they reached maximum cell densities**." Microbank frozen storage: *Lc. lactis* and *Lev. brevis* 1 year; *Pediococcus* spp. and *Lactiplantibacillus* 22 months. **Confidence: STRONG.**
- **"Effect of a deep-sea water-derived *Leuconostoc mesenteroides* GS76 starter on kimchi fermentation…" *Food Sci. Preserv.* 33(1):119–130 (2026), DOI: 10.11002/fsp.2026.33.1.119** <https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003311487> — the strain was "**formulated as a powdered starter by the Microbial Institute for Fermentation Industry (MIFI)**" (i.e. a real powdered kimchi starter preparation). Kimchi at 0–1 °C for 10 weeks ± starter: "**The starter-inoculated kimchi exhibited a rapid decrease in pH and a corresponding increase in acidity within the first two weeks, accompanied by remarkably higher mannitol accumulation compared with the control. *L. mesenteroides* remained the dominant microorganism throughout fermentation.**" **Confidence: MODERATE–STRONG; note the 0–1 °C frame makes this a 2-week effect, not hours, and MIFI is not a widely-retailed brand.**
- **"Comparison of northeast sauerkraut fermentation between single lactic acid bacteria strains and traditional fermentation." *Food Research International* (2020), DOI: 10.1016/j.foodres.2020.109553, PMID 33233175.** Single autochthonous strains *Leu. mesenteroides*, *L. plantarum*, *L. paracasei*, *W. cibaria* vs spontaneous: "**The pH decreased rapidly in inoculated sauerkraut along with high sugar utilization and acid production.**" Volatilome differed strongly by starter. **Confidence: MODERATE; no numeric time saving in abstract.**
- **Nguyen TT, Nguyen TH (2025). *Acta Sci. Pol. Technol. Aliment.* 24(3):387–396**, DOI: 10.17306/J.AFS.001326 — kimchi with *Leu. mesenteroides*, *L. fermentum*, *L. plantarum* vs control, 30-day storage: *Leu. mesenteroides* and *L. plantarum* best, "preserving approximately **70% of the initial hardness**" at day 30; highest polyphenol **25.857 ± 0.696 mg GAE/100 g** and vitamin C **39.453 ± 0.254 mg/100 g** in the *Leu. mesenteroides* sample; samples reached "the optimal pH (**4.1–4.2**)". **No time-savings claim; sensory was instrumental colour only — no panel.** <https://www.food.actapol.net/volume24/issue3/7_3_2025.pdf>
- **Kim H et al. (2018). "Heterofermentative lactic acid bacteria as a starter culture to control kimchi fermentation." *LWT*.** DOI: 10.1016/j.lwt.2017.10.009 — *Leu. citreum* GR1, *L. citreum* C2, *Pediococcus pentosaceus* MP1 from 171 kimchi LAB isolates: **GR1 gave high sensory quality and extended shelf-life; MP1 gave NO significant sensory improvement; C2 behaved like the no-starter control.** **Lesson: starter benefit is strain-specific, not species-specific.**

### FINDING 3e-9 Claims that lack peer review — explicit flags
**Category (iii) — pure marketing, no data published at all:**
- **Caldwell:** "based on over 20 years of research conducted in collaboration with Agriculture Canada / Agri-Food Canada"; "consistently successful results, enhancing taste, crispness and health benefits"; "the only starter culture produced which is 100% vegan." **No citation, no data, no study title, no n.** The named partner (Food Research and Development Centre of AAFC, Saint-Hyacinthe) is a real government lab, **but Caldwell publishes no report from it.** → **FLAG**
- **Cutting Edge:** "dramatically better results than the leading competing starter culture"; "The healthy bacteria in cultured foods prevent botulism from surviving" — **a food-safety claim with no citation.** → **FLAG**
- **Body Ecology:** "Research suggests that *Lactobacillus plantarum* may help gut dysbiosis, like IBS, Crohn's Disease and Colitis" — **no citation; a disease claim.** → **FLAG (highest regulatory exposure of the products reviewed)**
- **Novonesis Vertera FreshQ:** "helps protect against yeast and mold," "extend shelf life" for vegurts — **no vegetable-ferment data.** → **FLAG for any vegetable application**
- **Danisco VEGE:** "clinically backed health benefits" = HOWARU human trials, **not vegetable fermentation performance.** → **FLAG**
- **startercultures.eu own-brand:** "preventing the development of off-flavours and odours, as well as the presence of unwanted germs" — **no data.** → **FLAG**
- **Nordwise / BioCC OÜ:** "starts and ensures a proper and stable fermentation process" and the **1–2 day** pickle claim — **no data.** → **FLAG**
- **CJ CheilJedang:** CJGN34 in Hasunjung Kimchi — **company press release only.** → **FLAG**

**Category (ii) — manufacturer in-house only:**
- Cutting Edge's two pH charts (3e-3). **No author, no lab, no methods, no n, unnamed comparator.**

**Category (i) — independently supported, but for the STRAIN/SPECIES, not the marketed product:**
- "A *L. plantarum* + *L. mesenteroides* + *P. acidilactici* blend accelerates acidification in cabbage/vegetable fermentations" — supported in principle for the individual species (3a-2, 3a-3, 3e-8). **NO study has tested the specific 3-strain commercial blends.**
- "*L. mesenteroides* starter enables reduced-salt sauerkraut with acceptable sensory quality" — **strong support** (Johanningsmeier 2007 USDA-ARS with trained descriptive panel; Wiander & Ryhänen 2005 large-scale).
- "A defined kimchi starter can extend shelf-life / delay over-acidification" — **strong support** (Kim MJ 2019: pH 4.2 delayed ~1.5×). **This is the OPPOSITE direction from "faster."**
- "Individual starter choice changes kimchi/sauerkraut flavour and sensory outcome" — **strong support.**

### FINDING 3e-10 ★ DIRECTION-OF-EFFECT WARNING
**The marketing framing "starters make it faster" is only half true and is sometimes backwards.**
- **Faster *early* acidification: yes, measured.** Müller 2018 (pH < 4.0 at 24 h vs 72 h); Cutting Edge's own chart (pH ~4.5 at ~4 h vs ~5.5); Wiander & Ryhänen ("pH decreased rapidly in the beginning"). Mechanism: you skip the 2–3 day lag while the epiphytic *Leuconostoc* population expands.
- **But the *end point* is often deliberately DELAYED.** Kim MJ 2019 measured a kimchi starter **prolonging time-to-pH-4.2 by 1.5× (12 days at 10 °C)** to extend shelf-life. Commercial kimchi producers use starters to **slow** ripening.
- **"Ready in X days" for sauerkraut is a flavour/texture judgement, not a microbiological endpoint — and no vendor defines the endpoint it claims to shorten.**

### FINDING 3e-11 Regulatory / labelling (brief)
- The retail products are sold as **food / fermentation ingredients**, not probiotics or supplements — **with the exception of Body Ecology**, which uses supplement-style structure/function language. Cutting Edge carries an explicit FDA disclaimer ("These statements have not been evaluated by the FDA…"); **Body Ecology does NOT carry that disclaimer while making IBS/Crohn's/Colitis statements** — the clearest regulatory exposure found.
- **EU:** no "probiotic" health claim has been authorised, so "probiotic" functions as a forbidden implied health claim on food labels under Regulation (EC) 1924/2006. The European Ombudsman ruled in December 2024 on the Commission's position; the matter remained unresolved pending the EU Court of Justice as of Jan 2025. Under FAO/WHO-style criteria, "probiotic" requires strain-level characterisation, safety (QPS or equivalent), ≥1 positive human clinical study, and viable dose at end of shelf-life — **none of the vegetable starters would qualify.** Source: <https://www.foodtimes.eu/consumers-and-health/probiotics-18-years-of-battles-in-the-european-union/>
- **Safety/QPS:** EFSA's Qualified Presumption of Safety list (v20, 22 July 2024) covers the relevant taxa and permits market use as food cultures, **but confers no health-benefit claim rights.** <https://zenodo.org/records/13757806>
- **US:** Chr. Hansen A/S filed **GRAS Notice 1113** for *Lactobacillus plantarum* NCIMB 30562 for non-exempt infant formula up to 1.1 × 10⁸ CFU/g and conventional foods up to 1.0 × 10¹¹ CFU/g; FDA closed it 20 July 2023 with "no questions." **Cleanest US regulatory precedent found for a vegetable-relevant *Lactobacillus* strain.** <https://www.hfpappexternal.fda.gov/scripts/fdcc/index.cfm?id=1113&set=GRASNotices&type=basic>
- **Upshot:** these can lawfully be sold as fermentation cultures and may lawfully say "contains live cultures." They may **not** lawfully claim digestive-health benefits in the EU; in the US they must keep to structure/function language with the DSHEA disclaimer or become a dietary supplement.

## 3(f) pH drop during the first 24–48 h: how much faster with a starter

### FINDING 3f-1 ★ The only paired starter-vs-spontaneous time-to-pH datum
**Müller et al. (2018)** (see 3a-2): **pH < 4.0 within 24 h with the starter vs after 3 days (~72 h) without.**
**EXTRAPOLATION to per-hour rates (my arithmetic, pH₀ assumed ≈ 6.0): starter ≈ 0.083 pH units/h; control ≈ 0.028 pH units/h; ~3× faster.** **No paper retrieved states a pH drop rate in pH units per hour.**

### FINDING 3f-2 Pure-culture cucumber brine: ~0.1 pH units/h at 48 °C
**Etchells, Costilow, Anderson & Bell (1964)** (see 3a-11): certain *L. delbrueckii* strains in 2.5–3.0% salt brine at **48 °C** produced enough acid in **~30 h** to move brine pH from **> 7.0 to < 4.0** ≈ **0.1 pH units/h**. **CADMIUM WARNING: 48 °C is not a commercial pickling temperature, the cucumbers were γ-irradiated, and there was no competing flora.** Use only as an upper-bound illustration.

### FINDING 3f-3 Kimchi time-to-pH 4.2/4.4 by starter, measured
- **Kimchi, 10 °C, 12 d: starter delayed pH 4.2 by ~1.5× vs control** (Kim MJ et al. 2019, 3a-4).
- **Kimchi juice, 15 °C, 10⁵ cells/g (Seo et al. 2021, 3c-6): time to pH 4.4 — *Le. mesenteroides* 1 day; *L. plantarum* 2 days; *L. casei* 4 days; *L. fermentum* 5 days.**
- **Kimchi, spontaneous: pH reached 3.96 at 10 °C and 3.62 at 25 °C.** Lee W et al. (2021) *J Microbiol Biotechnol* 31(11):1552–1558, DOI: 10.4014/jmb.2108.08038, PMID 34489379.
- **Sauerkraut at 15 °C: at day 5 the control pH had not significantly changed while the *L. brevis*-inoculated pH had fallen significantly** (Wang 2024, 3a-6) → **a ≥ 5-day lag-phase advantage at 15 °C.**
- **Sauerkraut at 18 °C: "rapid and more uniform" pH decline with *L. mesenteroides* LA 81 vs "highly variable" without, over the first 6 days** (Johanningsmeier 2007, 3a-3) — **direction only, no values.**

### FINDING 3f-4 ★ Patent data (NON-PEER-REVIEWED but the only explicit hours-to-target-pH table found)
**KR101871904B1 / KR20170005993A, Yonsei University (Jang DH, Kim SW, Hwang WS, Baek YS). *Leuconostoc mesenteroides* subsp. *mesenteroides* YSM1219 (KFCC11613P).**
<https://patents.google.com/patent/KR20170005993A/en> · granted version <https://patents.google.com/patent/KR101871904B1/en>
Process: cabbage 13% brine, 10 h salting, final salinity 3.0 ± 0.5%; **starter added at 0.002 wt% of total kimchi weight**; "ripening" defined as **pH 4.3 ± 0.3**, arrival time = time to first fall into **pH 4.0–4.6**.

| Fermentation temperature | Control (no starter): hours to pH 4.0–4.6 / days maintained | Starter: hours / days maintained |
|---|---|---|
| 3 °C | 162 h / 47 d | **126 h / 55 d** |
| 12 °C | 114 h / 33 d | **90 h / 46 d** |
| 20 °C | 66 h / 15 d | **42 h / 28 d** |
| 20 °C for 24 h then 3 °C | 132 h / 50 d | **66 h / 74 d** |

- Authors' own summary: **"the time to reach the ripening stage was 23–33% shorter"**; with the 20 °C/24 h activation step the time was **~50% shorter** (132 h → 66 h).
- Activation-step pH after 24 h at 12/20/28/36 °C: **5.20 / 4.95 / 4.80 / 4.45**, with hours-to-ripeness 102 / 66 / 54 / 36.
- Starter comparison at 20 °C/24 h then 3 °C: no starter 132 h; YSM1219 66 h; *L. mesenteroides* K8P4 (KCTC 10527BP) 72 h; *L. mesenteroides* KFRI819 (KFCC 11209) 84 h — **so strain choice alone swings the result by 18 h (66 vs 84 h).**
- Hardness at day 40 (puncture, 15 replicates): **13.2 ± 0.23 (YSM1219) vs 10.2 ± 0.11 (no starter)**; sensory panel n = 20.

**Confidence: WEAK** — patent, single trial, no replication or statistics stated, no independent verification, university assignee (not a starter vendor). **But it is the only source found that tabulates hours-to-target-pH for starter vs control at multiple temperatures, so it is worth exactly what it is.**

### 3(f) verdict
**Measured, defensible statement:** a well-matched starter takes sauerkraut to **pH < 4.0 in 24 h vs ~3 days** for spontaneous — a **~48 h reduction in the time to the critical safety threshold**, i.e. roughly **3× faster** on average in that window. Kimchi and patent data agree on the *order* of the effect (24–48 h earlier at warm temperatures, 1–7 days earlier at refrigeration temperatures) but are not independently replicated.

---

# 4. MASTER MAGNITUDE TABLE — what is worth modelling vs what is second-order noise

Ranked by measured effect size on **time to a pH threshold**, which is the quantity that matters for safety and scheduling.

| Rank | Factor | Best measured effect | Source | Verdict |
|---|---|---|---|---|
| **1** | **Temperature** | 20 °C: 42–66 h to pH 4.0–4.6; 3 °C: 126–162 h — a **2–4× swing** | KR101871904B1 (patent, WEAK); industry norm 18 °C | **LARGE — but not in the user's question; it is the baseline against which everything else must be judged** |
| **2** | **Cut form, leafy vegetables (cabbage)** | shredded vs leaf: **8 days** (LAB 8 log at 5 vs 13 d); sauerkraut shredded vs whole head: **13 days** (15 vs 28 d); kimchi mat vs pogi: **~1–2 weeks** | Valence 2025 (STRONG); Niksic 2005 (STRONG); Moon 2019 (STRONG rate) | **LARGE — order of days. Model it.** |
| **3** | **Starter culture inoculation** | **5–7 days** saved (Zhao 2026); **pH < 4.0 at 24 h vs 72 h** (Müller 2018); **~50% time reduction at 20 °C/24 h activation** (patent) | Zhao 2026 (STRONG design); Müller 2018 (STRONG direction) | **LARGE — order of days.** But **direction is contested** (Kim 2019: starter 1.5× *slower*) and strain selection swings it by ~18 h |
| **4** | **Cut form, root vegetables (carrot)** | grated vs sliced: pH 3.69 vs 3.86 and **TTA 2.4× higher at 64 h**; but all carrot samples hit pH 3.8 in ~40 h | Valence 2025 (STRONG) | **LARGE in relative terms, MODEST in absolute time** — carrot is fast either way |
| **5** | **Cut form, radish kimchi** | 1 cm vs 3 cm cubes: LAB ~+50 pp relative abundance of *Leuconostoc* at day 5; divergence gone by day 50 | Choi 2023 (STRONG direction) | **MODERATE — a rate shift of days-to-2-weeks, no days figure given** |
| **6** | **Salt concentration (0.8 vs 1.0%)** | carrot at 1 month: pH 3.30 vs **3.58**; TTA 1.29% vs 0.83% | Valence 2025 (STRONG) | **MODERATE — ~0.3 pH units at 1 month for a 0.2 pp salt change.** Stronger effects at higher salt: pepper mash at 15–25% NaCl never acidifies properly (Li 2020; Aryee 2022) — that is **LARGE** |
| **7** | **Backslopping (reused brine)** | 80% v/v reused brine: rate constant **+5% to +11%** — while the **vessel** gave +59% to +68% | Zhang 2023 (STRONG) | **SECOND-ORDER. At 80% v/v it is smaller than the container effect by 6–12×. Not worth modelling as a rate lever.** |
| **8** | **Inoculum dose (1→3% v/v)** | **+5.5% to +24.6% lactic acid**; non-monotonic at 9 °Brix | Nguyen 2026 (MODERATE) | **SECOND-ORDER and non-monotonic — do not model as proportional** |
| **9** | **Blanching, brief high-temperature (75–80 °C)** | 75 °C/30 s: "little effect on sugar utilization, acid production, and terminal pH"; texture **improved** | Lu 2002 (MODERATE–STRONG) | **SECOND-ORDER for rate; LARGE for microbiology (≥2 log kill) and for texture (firming)** |
| **10** | **Blanching, low-temperature (55–65 °C)** | cabbage **1.6×**, Chinese cabbage **1.8× firmer** | Ni 2005 (STRONG) | **ZERO effect on rate reported; LARGE effect on texture — model for texture, not kinetics** |
| **11** | **Freezing / thawing before fermentation** | **No measured rate data exists.** Freezing the finished product **arrests** fermentation; freeze–thaw costs **>2 log LAB** and raises drip loss to **28–52%** | Kang 2025; Kim 2020 | **DO NOT MODEL as an accelerator. Evidence points the other way.** |
| **12** | **Grinding/mashing (pepper mash)** | Ground Tabasco mash at 8% salt: pH 4.98 → 4.7 (salted) → **3.7–3.9 by 1 month**, then flat for 24 months | Koh 2005 LSU thesis (MODERATE) | **Complete acidification in ~1 month despite 8% salt — the mash form is doing real work here, but the comparison against an unmashed control was never run** |
| **13** | **Vessel** | jar vs pool: rate constant **+59% to +68%** | Zhang 2023 (STRONG) | **LARGE — larger than backslopping. Not in the user's question but impossible to ignore.** |
| **14** | **Cut form, cucumber (slicing)** | slicing removes the **18–24 h** pre-inoculation diffusion delay; 0.2–0.5% acid within 24 h; >80% complete in 6 d — but **total fermentation time "did not differ greatly"** from whole | Fleming 1978 (STRONG) | **MODERATE for rate, LARGE for scheduling and firmness** — the win is *when you can pitch*, not total time |
| **15** | **Salt — non-monotonic in intact cabbage** | 2.5% NaCl is **faster** than 0.5/1.5% *and* 3.5% in NE Chinese sauerkraut | Yang 2020 (MODERATE) | **MODERATE — do not model salt as a monotonic brake in intact tissue. In juice it IS monotonic (Eilers 2026).** |
| **16** | **Mechanical brining aids (press / vacuum / steam)** | tissue salt after 6 h at 6% brine: immersion **2.22%** → press 1.35 kgf/cm² **2.88%** → steam 100 °C/2 min **3.16%** (up to +42%) | Lee 2011 (STRONG for salt uptake) | **MODERATE for salt uptake; UNKNOWN for fermentation rate — no fermentation was run** |
| **17** | **Lye treatment, olives** | NaOH 1.3–2.6% for 8–14 h, then 9–10% brine; **after 60–120 d, brine pH only 5.04 → 4.27** — many industrial batches never reach the pH 4.0 target | Front. Microbiol. 2021 (STRONG, industry-reported parameters) | **LARGE and mostly NEGATIVE — over-washing strips sugars (−96% glucose in fruit) and limits acid production** |
| **18** | **Ultrasound / HHP / PEF** | Ultrasound: **identical endpoint pH 3.01–3.06** with or without, more tissue damage. HHP 600 MPa/5 min: LAB down to **1.30 log CFU/g** | Appl. Sci. 2025 (WEAK for rate); LWT 2021 (STRONG) | **HHP SUPPRESSES; ultrasound shows no rate benefit. PEF is the only one with a rate-controlling title and it is fully paywalled — no number.** |

## Explicit assessment, as requested

**WORTH MODELLING (order days or >20% change):**
1. **Cut form for cabbage** — 8 to 13 days. This is the biggest controllable lever in the user's question, and it is supported by two independent designs (brined shredded-vs-leaf; shredded-vs-whole-head sauerkraut).
2. **Starter inoculation** — 5–7 days, or 48 h off the time-to-pH-4.0. But model it as *strain-specific and direction-uncertain*, not as a universal accelerator.
3. **Temperature** — the dominant factor overall; any kinetic model that excludes it is wrong.
4. **Extreme salt (≥15% in mash/brine systems)** — takes the system from "ferments in days" to "does not reliably acidify at all" (pH floor 4.47–4.78 at 5–25% salt in habanero, Aryee 2022; Enterobacteriaceae dominance at 15–25% in pepper sauce, Li 2020).
5. **Vessel/container** — +59% to +68% on the rate constant, apparently via temperature and headspace.
6. **Lye/washing in olive processing** — a *negative* lever large enough to prevent the fermentation from reaching its pH target at all.

**SECOND-ORDER NOISE (<10%, or not reproducible):**
1. **Backslopping as a rate lever** — +5% to +11% even at 80% v/v. The tradition is real; the speed benefit is not measurable at a useful magnitude.
2. **Inoculum dose above ~10⁶ CFU/g** — tripling it bought 5–25%, non-monotonically.
3. **Precision of cut size in root vegetables** — carrot, radish: real but small in absolute time because they acidify fast anyway.
4. **Freeze–thaw as an accelerator** — not supported; the measured effects are negative.
5. **Blanching as an accelerator** — not supported at 75 °C/30 s in cucumber; no sauerkraut or kimchi blanching rate data exists at all.
6. **Salt in the 0.8–2.5% range for cabbage** — real but non-monotonic and modest; do not treat as a linear rate term.
7. **Ultrasound, mild vacuum impregnation, tumbling** — no measured rate benefit; ultrasound gave an identical endpoint pH.

**INSUFFICIENT EVIDENCE TO RANK (do not model without new data):**
- Pricking / puncturing / blossom-end removal in cucumbers — **no rate study exists**, only the Potts 1986 diffusion coefficients (peeling raises K_D 3.7–11.1×).
- Enzymatic maceration (pectinase/cellulase) — **no study exists**.
- Pulsed electric field — one directly on-point title, fully paywalled, no number obtainable.

---

# 5. EXPLICIT "COULD NOT FIND" LIST

1. **No cucumber cut-form (whole vs sliced vs spears vs ends-off) fermentation-rate study.** The classic ARS paper "Controlled fermentation of sliced cucumbers" (Fleming HP, Thompson RL, Bell TA, Hontz LH, 1978, *J Food Sci* 43(3):888–891) exists — PDF at <https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p136.pdf> — but it is a **scanned image with no text layer** and no OCR tooling was available in this environment. **This is the single most likely home of the missing cucumber cut-form data.** I could not read it.
2. **No peer-reviewed freeze/thaw-before-brining rate study for any target vegetable** (cabbage, kimchi cabbage, cucumber, carrot, beet, radish). The whole kimchi freezing literature freezes the finished or already-salted product.
3. **No blanched-vs-unblanched sauerkraut microflora comparison** with mesophilic aerobic or Enterobacteriaceae counts.
4. **No days-to-pH figure for sauerkraut under any inoculation regime.** Every sauerkraut head-to-head reports pH as a figure or an endpoint.
5. **No peer-reviewed head-to-head wild vs backslopped sauerkraut study.**
6. **No dose–response study on backslopped brine proportion (1/5/10% v/v)** measuring lag phase or fermentation time, for any vegetable.
7. **No starter-CFU dose series (10⁵ vs 10⁶ vs 10⁷)** reporting lag phase for a whole fermented vegetable.
8. **No paper that states a pH drop rate in pH units per hour.** Every per-hour figure in this report is my arithmetic from endpoints and is labelled as such.
9. **No pH at 0/6/12/24/48 h for BOTH an inoculated and a control arm** in sauerkraut, kimchi or cucumber.
10. **No simultaneous CFU time series for *L. mesenteroides*, *Weissella* spp. AND *L. plantarum*** in backslopped vs spontaneous product.
11. **No measured vegetable fermentation failure caused by phage**, and **no phage titre measured in a backslopped vegetable brine**.
12. **No mycotoxin / ochratoxin / mould-spoilage study** in backslopped vs spontaneous vegetable fermentations.
13. **No lactic:acetic acid ratio expressed as % of total acidity** for inoculated vs spontaneous sauerkraut or kimchi.
14. **No quantitative mg/kg for diacetyl, acetoin, acetaldehyde or individual esters** in backslopped vs spontaneous vegetable fermentations.
15. **No independent peer-reviewed test of any named commercial consumer starter product** (Caldwell, Cutting Edge, Body Ecology, Nordwise, startercultures.eu) in a controlled vegetable fermentation. **Also: no CFU dose is published by any of those five products.**
16. **Q2(d)-specific gaps:**
    - **No controlled ground/mashed-vs-whole comparison of the same vegetable with a pH–time curve.** The closest is the cut-size contrast (Valence 2025).
    - **No pricked-vs-unpricked, "sliced-ends-off", or wax-removal cucumber acidification trial.** Only Potts 1986 (peeling → K_D 3.7–11.1×) and the Zhai 2021 CO₂ threshold exist.
    - **No enzyme (pectinase/cellulase/hemicellulase) pretreatment study on cabbage or cucumber LA fermentation rate.** Searches returned only EFSA enzyme-safety dossiers, enzyme-production papers and by-product valorisation.
    - **No numeric table extractable from Park & Kim 1991** (kimchi 1–5% NaCl; scanned PDF, no text layer — pdftotext and PyMuPDF both returned 0 characters), **Mheen & Kwon 1984**, **Shim 2003**, **Ahn 2021**, or **Lee et al. 2021 *Fermentation* 7:308** (MDPI 403 on HTML, XML and PDF).
    - **No PEF magnitude** — Kim et al. 2024 *IFSET* 92:103553 confirms in its title that PEF "can control fermentation rate of brined *Raphanus sativus*", but Unpaywall reports oa_status = closed and Semantic Scholar has a null abstract.
    - **No quantitative Greek-style vs Spanish-style vs California-style olive time-to-target comparison.**
    - **No sauerkraut juice / liquid fermentation pH–time kinetics.**
17. **Q3(e)-specific gaps:**
    - **No Novonesis "VEG-START" product page exists in retrievable form**; the verified Novonesis plant-based offering (Vertera FreshQ) is a vegurt bioprotective culture.
    - **No Chr. Hansen, Sacco, Lallemand, Fermentis, Wyeast or White Labs vegetable-fermentation starter product** could be retrieved.
    - **No Ball / Kerr / Fresh Preserving sauerkraut starter SKU** — freshpreserving.com returned HTTP 403 to all fetches; **unresolved, flagged as unverified rather than absent.**
    - **No vendor page, price, pack size or CFU for Picallili Vpro** — the name is transcribed verbatim from a USDA-ARS interpretive summary.
    - **No retail "kimchi starter powder" SKU with a strain list and price.** Korean results are dominated by probiotic supplements.
    - **pH at 24 h and 48 h, final titratable acidity, and trained-panel sensory outcomes are NOT retrievable** for Wiander & Ryhänen 2005 (paywalled), Johanningsmeier 2007 (paywalled), and **Choi et al. 2019 *LWT*** (model kimchi, 48 h at 15 °C, six species — **the single best-matched study for the pH-at-24/48 h question, and it is paywalled**).
    - **Amazon.com / Amazon.ca pages for Caldwell are blocked to automated fetch**, so no US/CA retail price could be verified.
18. **Paywalled and unretrieved, highest value first:**
    - **Choi YJ et al. (2019) *LWT* 105:118–126, DOI: 10.1016/j.lwt.2019.02.001** — model kimchi, six species, 48 h at 15 °C, pH monitored. **The best-matched study for pH-at-24/48 h.** *Note: this paper also heat-treated the model kimchi at 60 °C for 10 min before inoculation, which makes it relevant to §2(c) as well.*
    - **Fleming, Thompson, Bell, Hontz (1978) *J Food Sci* 43(3):888–891** — **"Controlled fermentation of sliced cucumbers"** — *now read by image rendering and summarised in 2a-6; the remaining unextracted content is the fine detail of Fig. 1.*
    - **Wiander & Ryhänen (2005) *Eur Food Res Technol* 220:319–323, DOI: 10.1007/s00217-004-1080-5** — the closest thing to an independent test of *commercial* starters in real sauerkraut.
    - **Tolonen et al. (2004) *Food Microbiology* 21(2):167–179, DOI: 10.1016/S0740-0020(03)00058-3; Tolonen et al. (2002) *J Agric Food Chem* 50(24):6798–6803**
    - **Halász & Baráth (1999)** — starter culture selection and sauerkraut fermentation
    - **Wennberg, Ekvall, Olsson, Nyman (2006) *Food Chemistry* 95(2):226–236, DOI: 10.1016/j.foodchem.2004.11.057** — **blanching-induced fermentable-sugar changes in white cabbage** (best shot at a real blanching → substrate number)
    - **Jung et al. (2012) *Int J Food Microbiol* 153(3):378–387 and Lee JJ et al. (2020) *Food Res Int* 136:109591** — the likely homes of the full time × genus × metabolite matrices
    - **Hu W et al. (2021) *Food Res Int* 148:110605, PMID 34507749; *Food Control* 41:122–127 (2014), DOI: 10.1016/j.foodcont.2013.12.033**
    - **Di Cagno et al. (2008) *Food Microbiology*** — autochthonous mixed starter for carrots / French beans / marrows (best carrot head-to-head if obtainable)
    - **Watts et al. (2018) *IJFST*** — chilli mash barrels, 18 months (salt, temperature and pH values NOT VERIFIED; paywalled, abstract only)

---

# 5b. THE THREE THINGS THAT MOST CHANGE THE PICTURE

1. **The largest controllable lever in the user's Question 2 is cut form in leafy vegetables, not any chemical or thermal pretreatment.** Shredded vs leaf cabbage = **8 days**; shredded vs whole-head sauerkraut = **13 days**; kimchi mat vs pogi = ~1–2 weeks at 6 °C. Everything else in Question 2 is smaller, absent, or negative.
2. **The skin/peel is the dominant mass-transfer barrier — and pricking has never been measured.** Peeling cucumbers raises solute-equilibration rate constants **3.7–11.1×** (Potts 1986), but there is **no pricked-vs-unpricked fermentation study in the retrievable literature**. Any model of pricking would be extrapolation.
3. **The direction of the starter effect is contested and the marketing framing is backwards about half the time.** Early acidification is reliably faster with a starter (pH < 4.0 at 24 h vs 72 h), but at least two measured studies show starters **slowing** acidification (Kim 2019: 1.5× longer to pH 4.2, deliberately, for kimchi shelf-life), and the only quantified "days saved" figure in the whole search is **5–7 days** (Zhao 2026). Meanwhile the "back-slopping" the user asked about has been measured exactly once as a rate lever, at **+5% to +11%** — smaller than the effect of changing the *container*.

---

# 6. HOW TO CITE THIS

Every number above is tied to a named source and a URL or DOI. **Three classes of statement are kept separate throughout and should stay separate downstream:**
1. **Measured** — stated in the retrieved source (full text or abstract as noted per finding).
2. **EXTRAPOLATION** — my arithmetic from reported endpoints (only in 3a-2 and 3f-1; labelled).
3. **Non-peer-reviewed** — patents (KR101871904B1; KR101350194B1), extension guidance, and manufacturer material. All labelled WEAK and never used as the sole basis for a magnitude claim.

Confidence ratings reflect **study design**, not the size of the number: a small, well-replicated effect (backslopping +5%) is rated STRONG; a large effect from a patent table is rated WEAK.
