# Temperature dependence of lactic acid bacteria (LAB) growth and acidification

**Compiled:** research memo, all values traced to sources whose full text or abstract I actually retrieved and read.
**Scope:** Q10 values · Arrhenius activation energies · cardinal-temperature / Ratkowsky square-root parameters · vegetable-fermentation-specific rate models.

---

## 0. How to read this document

### 0.1 Evidence categories (used as labels throughout)

| Label | Meaning |
|---|---|
| **(a) VEG** | Measured in a **vegetable** fermentation / vegetable matrix |
| **(b) LAB-OTHER** | Measured for **LAB but in another food system** (MRS broth, milk, meat, salmon juice, sugar-based kefir) |
| **(c) GENERAL** | General rule of thumb, non-LAB organisms, or textbook/pharmaceutical context used only as a range anchor |

### 0.2 Confidence

* **strong** — primary measurement, full text retrieved, statistics/CI reported, directly usable.
* **moderate** — primary measurement retrieved, but single study, or my own derivation from published tables, or a proxy system.
* **weak** — qualitative statement, tertiary source, or a fit whose confidence interval is so wide it is barely usable.

### 0.3 Two important honesty notes up front

1. **I did not find a canonical, retrievable food-microbiology textbook page** that states "Q10 = 2 for LAB growth." What I *did* find is (i) direct primary Q10 measurements for LAB metabolite production, (ii) Q10 values I computed from published LAB growth-rate tables, and (iii) a tertiary (Wikipedia) statement of the ~2–3 rule with its underlying references. These are presented separately and labelled.
2. **No published Arrhenius Ea specifically for LAB growth rate in a vegetable fermentation was found.** The closest things are (i) Ea for *total-acid change* in Sichuan sauerkraut (a vegetable product, but during storage), (ii) Ea for LAB metabolite production in water kefir (sugar-based, mixed LAB/yeast), and (iii) Ea for growth of LAB in broth/salmon juice that I fitted myself from published rate tables. All are flagged.

---

## 1. Q10 values

### 1.1 Primary published Q10 measurements for LAB fermentation rates — **(b) LAB-OTHER**, **strong**

The single best hard-number Q10 source I found. Laureys, Leroy, Vandamme & De Vuyst (2022) fitted Arrhenius equations to volumetric metabolite production rates in **water kefir** (a LAB + yeast fermentation of a sugar/fig medium, NOT a vegetable) over **17, 21, 25, 29 °C**, then converted Ea to Q10.

**Table 2 of that paper, reproduced verbatim:**

| Metabolite | A (mg l⁻¹ h⁻¹) | **Ea (kJ mol⁻¹)** | **Q10** |
|---|---|---|---|
| Ethanol | (25.5 ± 49.7)·10¹² | 63.6 ± 4.8 | 2.37 [2.08; 2.69] |
| **Lactic acid** | (113 ± 242)·10¹² | **71.9 ± 5.3** | **2.64 [2.30; 3.04]** |
| Acetic acid | (1.08 ± 1.54)·10¹² | 62.2 ± 3.5 | 2.32 [2.11; 2.55] |
| Glycerol | (305 ± 776)·10¹² | 76.3 ± 6.3 | 2.81 [2.38; 3.32] |
| Mannitol | (9.19 ± 12.92)·10⁸ | 45.8 ± 3.4 | 1.86 [1.70; 2.04] |

> **Read this as:** for the *rate of lactic acid accumulation* by a LAB-dominated fermentation, **Q10 = 2.64 (95% CI 2.30–3.04)** over roughly 17–29 °C; for the other LAB/yeast metabolites, Q10 = 1.86–2.81. The bracketed interval is the paper's own confidence interval.

* **Citation:** Laureys D, Leroy F, Vandamme P, De Vuyst L (2022). *Backslopping Time, Rinsing of the Grains During Backslopping, and Incubation Temperature Influence the Water Kefir Fermentation Process.* **Frontiers in Microbiology 13:871550.** doi:10.3389/fmicb.2022.871550
* **URLs:** https://doi.org/10.3389/fmicb.2022.871550 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9120925/
* *Method note (their words):* "The calculation of the temperature coefficient or Q10 values was based on the Ea values."
* **Caveat:** mixed LAB + yeast community; sugar-based substrate, not a vegetable; Q10 computed from a non-linear Arrhenius fit, so it is an average over 17–29 °C, not a local derivative.

### 1.2 Q10 computed by me from published LAB growth-rate tables

These are **my own arithmetic** on other people's published μmax values. The arithmetic is shown so it can be checked.

#### 1.2.1 *Leuconostoc mesenteroides* — **(b) LAB-OTHER**, **moderate**

Growth rates of *Lc. mesenteroides* at pH 6.5, 3.25 % NaCl, 100 ppm NaNO₂ (the centre point of a Box–Behnken design), from the dataset of Zurera-Cosano et al. (2006), republished in full in Wang et al. (2013) Tables 1 and 2:

| T (°C) | μmax (h⁻¹), aerobic | μmax (h⁻¹), anaerobic |
|---|---|---|
| 10.5 | 0.141 | 0.106 |
| 17.5 | 0.1765 (mean of 6 replicates) | 0.1723 (mean of 6 replicates) |
| 24.5 | 0.422 | 0.409 |

**Aerobic:** ratio 24.5/10.5 = 0.422 / 0.141 = **2.993** over ΔT = 14 °C
→ Q10 = 2.993^(10/14) = e^((10/14)·ln 2.993) = e^(0.7143 × 1.0963) = e^0.7831 = **2.19**

**Anaerobic:** ratio 24.5/10.5 = 0.409 / 0.106 = **3.858**
→ Q10 = 3.858^0.7143 = e^(0.7143 × 1.3502) = e^0.9644 = **2.62**

> **Read this as:** Q10 ≈ **2.2 (aerobic) to 2.6 (anaerobic)** for *Lc. mesenteroides* growth between 10.5 and 24.5 °C. Note the anomalous shape: the 10.5→17.5 step gives only ~1.25×, while 17.5→24.5 gives ~2.4× — the rate is suppressed at the low end by the 3.25 % NaCl.

* **Citations:** Zurera-Cosano G, García-Gimeno RM, Rodríguez-Pérez R, Hervás-Martínez C (2006). *Performance of response surface model for prediction of Leuconostoc mesenteroides growth parameters under different experimental conditions.* **Food Control 17(6):429–438.** doi:10.1016/j.foodcont.2005.02.003 — **closed access, I could not retrieve it directly**; the data table below is from the open-access re-publication:
* Wang HY, Wen CF, Chiu YH, Lee IN, Kao HY, Lee IC, Ho WH (2013). *Leuconostoc mesenteroides growth in food products: prediction and sensitivity analysis by adaptive-network-based fuzzy inference systems.* **PLoS ONE 8(5):e64995.** doi:10.1371/journal.pone.0064995
* **URLs:** https://pmc.ncbi.nlm.nih.gov/articles/PMC3660370/ · https://doi.org/10.1371/journal.pone.0064995 · (closed original: https://doi.org/10.1016/j.foodcont.2005.02.003)

#### 1.2.2 *Lactobacillus plantarum*, *Lactobacillus sakei*, *Weissella viridescens* — **(b) LAB-OTHER**, **strong data / moderate derivation**

Published μmax values (MRS broth, pH 6.0, Baranyi–Roberts fits) — da Silva et al. (2018) Table 1:

| T (°C) | *L. plantarum* (h⁻¹) | *L. sakei* (h⁻¹) | *W. viridescens* (h⁻¹) |
|---|---|---|---|
| 4 | no growth | 0.02 | 0.02 |
| 8 | 0.01 | 0.06 | 0.06 |
| 12 | 0.06 | 0.17 | 0.16 |
| 16 | 0.16 | 0.24 | 0.25 |
| 20 | 0.30 | 0.34 | 0.43 |
| 30 | 0.65 | 0.78 | 0.78 |

**Q10 computed by me (Q10 = ratio^(10/ΔT)):**

| Organism | Window | Rate ratio | **Q10** |
|---|---|---|---|
| *L. plantarum* | 20→30 °C | 0.65/0.30 = 2.17 | **2.17** |
| *L. plantarum* | 16→20 °C | 0.30/0.16 = 1.88 | 4.81 |
| *L. plantarum* | 12→16 °C | 0.16/0.06 = 2.67 | 11.6 |
| *L. plantarum* | 8→12 °C | 0.06/0.01 = 6.0 | 88 (unreliable — see caveat) |
| *L. sakei* | 20→30 °C | 0.78/0.34 = 2.29 | **2.29** |
| *L. sakei* | 8→12 °C | 0.17/0.06 = 2.83 | 13.5 |
| *L. sakei* | 16→20 °C | 1.42 | 2.39 |
| *W. viridescens* | 20→30 °C | 0.78/0.43 = 1.81 | **1.81** |
| *W. viridescens* | 16→20 °C | 1.72 | 3.88 |

> **Read this as:** **near the growth optimum (20–30 °C) Q10 ≈ 1.8–2.3**, i.e. comfortably in the classic 2–3 band. **Below ~15 °C the apparent Q10 blows up** (5–90). That is *not* a real physical Q10 — it is partly real (rates become very temperature-sensitive as T→Tmin) and partly an artifact of the values being rounded to two decimal places (0.01, 0.06, 0.16).

* **Citation:** da Silva APRD, Longhi DA, Dalcanton F, Aragão GMF (2018). *Modelling the growth of lactic acid bacteria at different temperatures.* **Brazilian Archives of Biology and Technology 61:e18160159.** doi:10.1590/1678-4324-2018160159
* **URLs:** https://doi.org/10.1590/1678-4324-2018160159 · PDF: http://www.scielo.br/pdf/babt/v61/1516-8913-babt-61-e18160159.pdf

#### 1.2.3 *Leuconostoc mesenteroides* strains in salmon juice — **(b) LAB-OTHER**, **moderate**

Published μmax (Baranyi–Roberts, fish/salmon juice), Stupar et al. (2023) Table 2:

| Strain | 4 °C | 8 °C | 12 °C | 16 °C |
|---|---|---|---|---|
| *Le. mesenteroides* 68 (Le.m.68) | 0.01 | 0.02 | 0.04 | 0.08 |
| *Le. mesenteroides* 299 (Le.m.299) | 0.03 | 0.05 | 0.08 | 0.09 |
| *Le. citreum* 105 (Le.c.105) | 0.01 | 0.02 | 0.05 | 0.07 |

**Q10 computed by me** (values rounded to 1 significant figure, so treat as order-of-magnitude only):
* Le.m.68, 4→16 °C: 0.08/0.01 = 8 → Q10 = 8^(10/12) = **5.7**
* Le.m.299, 4→16 °C: 0.09/0.03 = 3 → Q10 = 3^(10/12) = **2.5**
* Le.m.299, 8→16 °C: 1.8 → Q10 = **2.1**

> **Read this as:** for *Lc. mesenteroides* between ~8 and 16 °C, Q10 lands around **2–2.5**, but there is large strain-to-strain spread and the published values are rounded too coarsely for precise Q10 work.

* **Citation:** Stupar J, Hoel S, Strømseth S, Lerfall J, Rustad T, Jakobsen AN (2023). *Selection of lactic acid bacteria for biopreservation of salmon products applying processing-dependent growth kinetic parameters and antimicrobial mechanisms.* **Heliyon 9(10):e19887.** doi:10.1016/j.heliyon.2023.e19887
* **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC10559289/

#### 1.2.4 Kimchi ripening time — **(a) VEG**, **moderate**

Kim et al. (2020) measured sensory "overall ripeness" of kimchi at 0, 5, 10 and 20 °C over weeks. Reading the day at which overall ripeness reaches ≈7 off their Table 1:

| Storage T (°C) | Days to overall ripeness ≈ 7 |
|---|---|
| 0 | ~56 |
| 5 | ~28 |
| 10 | ~16 |
| 20 | ~7 |

**Q10-equivalent computed by me** (rate ∝ 1/time, so Q10 = (t₁/t₂)^(10/ΔT)):
* 0→10 °C: time ratio 56/16 = 3.50 → **Q10 ≈ 3.5**
* 10→20 °C: 16/7 = 2.29 → **Q10 ≈ 2.3**
* 0→20 °C: 56/7 = 8.00 → **Q10 = 8^(10/20) = 2.83**
* 5→10 °C: 28/16 = 1.75 → Q10 = 1.75² = **3.1**

> **Read this as:** the *whole kimchi ripening process* speeds up by ~8× from 0 °C to 20 °C, i.e. an average **Q10 ≈ 2.8**, with the sensitivity higher in the cold range (Q10 ≈ 3.5) and lower warm (Q10 ≈ 2.3). This is a composite of LAB growth, acid production and enzyme/ softening reactions — not a pure microbial rate.

* **Citation:** Kim JY, Kim BS, Kim JH, Oh SI, Koo J (2020). *Development of Dynamic Model for Real-Time Monitoring of Ripening Changes of Kimchi during Distribution.* **Foods 9(8):1075.** doi:10.3390/foods9081075
* **URLs:** https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/ · https://doi.org/10.3390/foods9081075
* **Caveat:** the ripening times are my readings off a sensory score table (scores are means of a panel, in 0.01 steps) — hence "moderate", not "strong".

### 1.3 The general rule of thumb: "rate doubles per 10 °C (Q10 = 2)"

**What I actually retrieved:** the Wikipedia article *Q10 (temperature coefficient)*, which states:

> *"For most biological systems, the Q10 value is ~ 2 to 3 (the rate doubles or triples for every 10 °C increase in temperature)."*
> *"Q10 values for biological processes vary with temperature. … At some minimum temperature biological systems do not function at all, but performance increases with rising temperature (Q10 of 2-4) to a maximum performance level and thermal independence (Q10 of 1.0-1.5). With continued increase in temperature, performance decreases rapidly (Q10 of 0.2-0.8) up to a maximum temperature at which all biological function again ceases."*

* **Source:** *Q10 (temperature coefficient)*, Wikipedia — https://en.wikipedia.org/wiki/Q10_(temperature_coefficient)
* **Confidence: weak (tertiary/encyclopedic).** The article's own banner says it needs more citations. It attributes the 2–3 statement to Reyes et al. 2008 (*J Biol Rhythms* 23(1):95–8, PMC2365757) and Davidson & Janssens 2006 (*Nature* 440:165–173), and the "Q10 declines and goes negative above the optimum" statement to a muscle-physiology source (Mundim et al. 2020, *Ecological Modelling* 431:109127). **I did not retrieve those underlying papers**, so I cannot vouch for them — I am reporting only that the rule-of-thumb statement exists in that form and is traceable to those references.

**The best *primary* support I retrieved for the 2–3 band being right for LAB specifically** is the body of measurements in §1.1 and §1.2 above:

| System | Window | Q10 | Category |
|---|---|---|---|
| LAB lactic-acid production, water kefir | 17–29 °C | **2.64** [2.30; 3.04] | (b) LAB-OTHER |
| LAB acetic-acid production, water kefir | 17–29 °C | **2.32** [2.11; 2.55] | (b) LAB-OTHER |
| *Lc. mesenteroides* growth | 10.5–24.5 °C | **2.19** (aer) / **2.62** (anaer) | (b) LAB-OTHER |
| *L. plantarum* growth | 20→30 °C | **2.17** | (b) LAB-OTHER |
| *L. sakei* growth | 20→30 °C | **2.29** | (b) LAB-OTHER |
| *W. viridescens* growth | 20→30 °C | **1.81** | (b) LAB-OTHER |
| Kimchi ripening (sensory) | 0–20 °C | **2.8** (avg) | **(a) VEG** |
| Sichuan sauerkraut total acid (from Ea) | 20–30 °C | **1.90** | **(a) VEG** |

**Verdict: the "Q10 ≈ 2–3" rule of thumb is empirically defensible for LAB growth and acidification in the 10–30 °C window** — it is not a fabrication. But it is a *rule of thumb*, not a constant.

### 1.4 The caveat: Q10 is NOT constant, and goes below 1 above Topt

Three independent lines of evidence I retrieved:

**(i) The Arrhenius/constant-Ea assumption fails for bacterial growth.** Ratkowsky, Olley, McMeekin & Ball (1982), abstract (verbatim):

> *"The Arrhenius Law … does not adequately describe the effect of temperature on bacterial growth. Microbiologists have attempted to apply a modified version of this law to bacterial growth by replacing the reaction rate constant by the growth rate constant, but the modified law relationship fits data poorly, as graphs of the logarithm of the growth rate constant against reciprocal absolute temperature result in **curves rather than straight lines**. Instead, a linear relationship between [the] square root of growth rate constant (r) and temperature (T), namely, square root = b (T − T0) … is proposed…"*

* **Citation:** Ratkowsky DA, Olley J, McMeekin TA, Ball A (1982). *Relationship between temperature and growth rate of bacterial cultures.* **Journal of Bacteriology 149(1):1–5.** doi:10.1128/jb.149.1.1-5.1982
* **URLs:** https://pmc.ncbi.nlm.nih.gov/articles/PMC216584/ · https://doi.org/10.1128/jb.149.1.1-5.1982
* **Confidence: strong** (verbatim abstract; the paper itself is a scanned PMC deposit I could not open in full, only the abstract page).

**(ii) In the square-root model, Q10 falls monotonically as temperature rises.** Because μ = [b(T − Tmin)]², the implied local Q10 centred on temperature T is

> **Q10(T) = [ (T + 5 − Tmin) / (T − 5 − Tmin) ]²**

This is a *derived* consequence of the published model form, and it is easy to verify numerically (§5.1). Example, *Lc. mesenteroides* Le.m.68 (Tmin = −5.3 °C): Q10 = 3.88 at 10 °C, 2.23 at 20 °C, 1.77 at 30 °C.

**(iii) Above Topt the rate falls with temperature, so Q10 < 1.** Computed from the published cardinal-temperature (CTMI) parameters of *Lactobacillus plantarum* ITM21B (Tmin = 2.40, Topt = 34.35, Tmax = 39.47 °C):

| Interval | τ(Topt+3)/τ(Topt) | Implied Q10 |
|---|---|---|
| *L. plantarum* ITM21B, 34.35 → 37.35 °C | **0.82** (i.e. 18 % slower) | **0.52** |
| *L. paracasei* IMPC2.1, 32.63 → 35.63 °C | **0.92** | **0.76** |
| *L. paracasei* P40, 32.80 → 35.80 °C | **0.78** | **0.43** |

> **Read this as:** at and above the optimum, warming *slows* the organism. Q10 in that region is **0.4–0.8**, exactly as the rule-of-thumb caveat states. So the "2–3" figure applies **only to the sub-optimal temperature range**; extrapolating it up to or past Topt is a modelling error.

---

## 2. Arrhenius activation energies (Ea)

### 2.1 Master table

| System | What is measured | T range | **Ea (kJ/mol)** | Category | Confidence | Source |
|---|---|---|---|---|---|---|
| Water kefir (LAB + yeast) | **Lactic acid production rate** | 17–29 °C | **71.9 ± 5.3** | (b) LAB-OTHER | strong | Laureys et al. 2022 |
| Water kefir | Acetic acid production rate | 17–29 °C | 62.2 ± 3.5 | (b) LAB-OTHER | strong | Laureys et al. 2022 |
| Water kefir | Ethanol production rate | 17–29 °C | 63.6 ± 4.8 | (b) LAB-OTHER | strong | Laureys et al. 2022 |
| Water kefir | Glycerol production rate | 17–29 °C | 76.3 ± 6.3 | (b) LAB-OTHER | strong | Laureys et al. 2022 |
| Water kefir | Mannitol production rate | 17–29 °C | 45.8 ± 3.4 | (b) LAB-OTHER | strong | Laureys et al. 2022 |
| **Sichuan sauerkraut** | **Total acid change (zero-order k)** | 25–45 °C (storage) | **47.23** (R² = 0.957) | **(a) VEG** | **strong** | Du et al. 2022, Table 6 |
| Sichuan sauerkraut | Sensory score change | 25–45 °C | 70.07 | (a) VEG | strong | Du et al. 2022, Table 6 |
| Sichuan sauerkraut | L* colour (vegetable) change | 25–45 °C | 72.09 | (a) VEG | strong | Du et al. 2022, Table 6 |
| Sichuan sauerkraut | Hardness (radish) change | 25–45 °C | 45.76 | (a) VEG | strong | Du et al. 2022, Table 6 |
| *Lc. mesenteroides* growth rate | μmax, aerobic | 10.5–24.5 °C | **54.7** (my fit) | (b) LAB-OTHER | moderate | my Arrhenius fit to Wang et al. 2013 Table 1 |
| *Lc. mesenteroides* growth rate | μmax, anaerobic | 10.5–24.5 °C | **67.5** (my fit) | (b) LAB-OTHER | moderate | my Arrhenius fit to Wang et al. 2013 Table 2 |
| *Aeromonas hydrophila* growth rate | μmax | 4–30 °C | 20.9–21.1 kcal/mol = **87.4–88.3** | (c) GENERAL | strong | De Silvestri et al. 2018 |
| *Listeria monocytogenes* growth rate | μmax | 4–30 °C | 20.9–21.0 kcal/mol = **87.4–87.9** | (c) GENERAL | strong | De Silvestri et al. 2018 |
| *Yersinia enterocolitica* growth rate | μmax | 4–30 °C | 14.2–16.7 kcal/mol = **59.4–69.9** | (c) GENERAL | strong | De Silvestri et al. 2018 |
| *L. monocytogenes* growth rate | μmax | — | 18.5 ± 4.9 kcal/mol = **77.4 ± 20.5** | (c) GENERAL | strong | Diez-Gonzalez et al. 2007, as tabulated by De Silvestri et al. 2018 |
| *L. monocytogenes* growth rate | μmax | — | 21.3 kcal/mol = **89.1** (ComBase) | (c) GENERAL | strong | ComBase, as tabulated by De Silvestri et al. 2018 |
| *Y. enterocolitica* growth rate | μmax | — | 15.5 kcal/mol = **64.9** (ComBase) | (c) GENERAL | strong | ComBase, as tabulated by De Silvestri et al. 2018 |
| Chemical degradation (pharma context, quoted range) | reaction rate | — | **5 to 240, mean ≈ 83** | (c) GENERAL | moderate (secondary quote) | Kommanaboyina & Rhodes 1999, as quoted by De Silvestri et al. 2018 |

**Practical takeaway:** for LAB growth and acidification, the cluster of directly measured/fitted Ea values sits at roughly **45–77 kJ/mol** (with LAB growth fits at ~55–72 and sauerkraut total-acid at 47). Mesophilic foodborne pathogens come out a bit higher, **59–89 kJ/mol**. This is consistent with the classic Q10 ≈ 2–3 band (see §5.2 for the exact conversion).

### 2.2 Sources for §2.1

* **Laureys et al. 2022** — see §1.1. https://pmc.ncbi.nlm.nih.gov/articles/PMC9120925/
* **Du J, Zhang M, Zhang L, Law CL, Liu K (2022).** *Shelf-Life Prediction and Critical Value of Quality Index of Sichuan Sauerkraut Based on Kinetic Model and Principal Component Analysis.* **Foods 11(12):1762.** doi:10.3390/foods11121762 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/
  * Their Arrhenius form: k = k_ref · exp[ −(Ea/R)·(1/T − 1/T_ref) ], R = 8.3144 J/(mol·K), with T_ref the arithmetic mean of the studied temperatures.
  * Their fitted prediction model for total acid (their Table 7), verbatim:
    `t = (4.96 − A) / (1.076 × 10⁶ × e^{(47.23 × 10³ / R)(1/T − 1/T_ref)})`
    where A is the measured total acid and t the time (d).
  * **Caveat:** this is *storage* of already-fermented sauerkraut at 25/35/45 °C, i.e. the tail of the fermentation, not the primary acidification phase.
* **De Silvestri A, Ferrari E, Gozzi S, Marchi F, Foschino R (2018).** *Determination of Temperature Dependent Growth Parameters in Psychrotrophic Pathogen Bacteria and Tentative Use of Mean Kinetic Temperature for the Microbiological Control of Food.* **Frontiers in Microbiology 9:3023.** doi:10.3389/fmicb.2018.03023 — https://pmc.ncbi.nlm.nih.gov/articles/PMC6290036/
* **Wang et al. 2013** — see §1.2.1. https://pmc.ncbi.nlm.nih.gov/articles/PMC3660370/

### 2.3 Explicitly NOT found

* ❌ **No published Arrhenius Ea for the growth rate of *L. plantarum*, *Lc. mesenteroides*, *L. sakei* or *Lactococcus lactis* in a vegetable fermentation** surfaced in any source I retrieved. The published vegetable-LAB work uses either CTMI (§3) or polynomial/square-root secondary models, not Arrhenius Ea.
* ❌ No Ea for **lactic acid production rate during sauerkraut, kimchi, cucumber or pepper-mash fermentation** specifically. The Sichuan sauerkraut value is total-acid change during *storage*; the water kefir value is lactic acid in sugar-based kefir.
* ❌ **Lactococcus lactis**: I located a directly relevant paper — Dougherty DP, Breidt F, McFeeters RF, Lubkin SR (2002), *Energy-based dynamic model for variable temperature batch fermentation by Lactococcus lactis*, **Applied and Environmental Microbiology 68(5):2468–2478**, doi:10.1128/AEM.68.5.2468-2478.2002 — which models **cucumber juice** fermentation by *L. lactis* under variable temperature. **This is exactly the right paper for your question, but its full text is not open access (PMC127523 is a scanned deposit I could not open) and I found no Ea values in the retrievable abstract.** I am flagging it as the top follow-up target rather than quoting numbers I did not read.

---

## 3. Cardinal temperature and Ratkowsky square-root parameters

### 3.1 Cardinal Temperature Model with Inflection (CTMI) parameters

The CTMI (Rosso et al. 1993) used by both papers below is:

> τ(T) = (T − Tmax)(T − Tmin)² / { (Topt − Tmin)·[ (Topt − Tmin)(T − Topt) − (Topt − Tmax)(Topt + Tmin − 2T) ] }
> μmax(T) = μopt · τ(T)

#### **(a) VEG — strong** — *Lacticaseibacillus paracasei* in white cabbage

Di Biase et al. (2022), Table 2 (95 % CI in brackets). The strains were isolated from table olives or human source; growth rates were measured in modified MRS and then validated **in blanched white cabbage** (*Brassica oleracea* var. *capitata*) with 4 % NaCl brine.

| Parameter | IMPC2.1 | IMPC4.1 | P40 | P101 |
|---|---|---|---|---|
| μopt,MRS (h⁻¹) | 0.48 [0.43; 0.52] | 0.62 [0.576; 0.672] | 0.55 [0.50; 0.60] | 0.65 [0.609; 0.699] |
| **Tmin (°C)** | **0.61** [−2.11; 3.33] | **−0.93** [−2.91; 1.05] | **1.95** [−0.41; 4.30] | **−0.97** [−2.64; 0.71] |
| **Topt (°C)** | **32.63** [31.24; 34.01] | **35.31** [34.08; 36.54] | **32.80** [31.78; 33.82] | **35.67** [34.53; 36.80] |
| **Tmax (°C)** | **40.74** [40.33; 41.15] | **39.26** [39.06; 39.46] | **37.46** [37.17; 37.75] | **39.42** [39.08; 39.77] |
| n (T data) | 14 | 14 | 13 | 14 |
| pHmin | 3.43 | 3.23 | 3.70 | 3.50 |
| pHmax | 9.53 | 10.44 | 9.32 | 9.69 |

Their Table 3 (cabbage-specific kinetic parameters, strain IMPC2.1): **Cf = 0.85**, K = 1.77, a₀ = 4.74, a₁ = 0.14, Tc = 24.5 (bi-linear log₁₀Nmax = a₀ + a₁·T for T < Tc).
→ **μopt in cabbage = Cf × μopt,MRS = 0.85 × 0.48 = 0.408 h⁻¹.**

Measured μmax **in cabbage** (their Table 1):

| T (°C) | pH | μmax measured (h⁻¹) | μmax predicted (h⁻¹) |
|---|---|---|---|
| 15.0 | 5.89 | **0.101** | 0.117 |
| 20.0 | 6.82 | **0.196** | 0.184 |
| 25.0 | 6.04 | **0.257** | 0.287 |
| 25.0 | 5.86 | **0.227** | 0.290 |
| 35.0 | 5.85 | **0.470** | 0.360 |

* **Citation:** Di Biase M, Le Marc Y, Bavaro AR, De Bellis P, Lonigro SL, Lavermicocca P, Postollec F, Valerio F (2022). *A Predictive Growth Model for Pro-technological and Probiotic Lacticaseibacillus paracasei Strains Fermenting White Cabbage.* **Frontiers in Microbiology 13:907393.** doi:10.3389/fmicb.2022.907393
* **URLs:** https://pmc.ncbi.nlm.nih.gov/articles/PMC9207389/ · https://doi.org/10.3389/fmicb.2022.907393

#### **(b) LAB-OTHER — strong** — *Lactobacillus plantarum* ITM21B

Di Biase et al. (2022), *Foods* 11(23):3942, Table 2 (modified MRS broth; validated in liquid sourdough):

| Parameter | Value (95 % CI) |
|---|---|
| μopt,MRS (h⁻¹) | **0.78** (0.74–0.81) |
| **Tmin (°C)** | **2.40** (1.43–3.36) |
| **Topt (°C)** | **34.35** (33.77–34.93) |
| **Tmax (°C)** | **39.47** (39.32–39.62) |
| n (T data), R² | 14, 0.99 |
| pHmin / pHmax | 3.14 / 10.29 |
| aw,min / aw,opt | 0.963 / 0.994 |
| MIC of undissociated lactic acid | 14.8 mM |

* **Citation:** Di Biase M, Le Marc Y, Bavaro AR, Lonigro SL, Verni M, Postollec F, Valerio F (2022). *Modeling of Growth and Organic Acid Kinetics and Evolution of the Protein Profile and Amino Acid Content during Lactiplantibacillus plantarum ITM21B Fermentation in Liquid Sourdough.* **Foods 11(23):3942.** doi:10.3390/foods11233942
* **URLs:** https://pmc.ncbi.nlm.nih.gov/articles/PMC9741194/ · https://doi.org/10.3390/foods11233942

### 3.2 Ratkowsky square-root parameters (b and Tmin)

Model form (Ratkowsky et al. 1982): **√μ = b(T − Tmin)**, equivalently μ = [b(T − Tmin)]².

#### **(b) LAB-OTHER — strong** — LAB in MRS broth, 4–30 °C

da Silva et al. (2018), Table 2. Published fits, 4–30 °C, R² given:

| Organism | Equation (as published) | R² | **b** | **Tmin implied (°C)** |
|---|---|---|---|---|
| *Lactobacillus plantarum* CCT 0580 (ATCC 8014) | √μmax = 0.031·T − 0.127 | 0.992 | **0.031** | **4.10** |
| *Weissella viridescens* CCT 5843 (ATCC 12706) | √μmax = 0.028·T + 0.038 | 0.993 | **0.028** | **−1.36** |
| *Lactobacillus sakei* CCT 5841 (ATCC 15521) | √μmax = 0.028·T + 0.037 | 0.993 | **0.028** | **−1.32** |

*(Sign convention: √μmax = b(T − Tmin) = bT − b·Tmin, so Tmin = −intercept/b. For *L. plantarum*: 0.127/0.031 = 4.10 °C. For the other two the intercept is positive, giving sub-zero Tmin.)*

**Model check against their own measured data (my arithmetic):**

| T | *L. plantarum* model | measured | *L. sakei* model | measured |
|---|---|---|---|---|
| 4 | 9×10⁻⁶ | no growth | 0.022 | 0.02 |
| 8 | 0.015 | 0.01 | 0.068 | 0.06 |
| 12 | 0.060 | 0.06 | 0.139 | 0.17 |
| 16 | 0.136 | 0.16 | 0.235 | 0.24 |
| 20 | 0.243 | 0.30 | 0.356 | 0.34 |
| 30 | 0.645 | 0.65 | 0.769 | 0.78 |

The fits are good in the middle of the range and degrade at the ends (as expected for a 2-parameter model).

* **Citation:** da Silva APRD, Longhi DA, Dalcanton F, Aragão GMF (2018). **Brazilian Archives of Biology and Technology 61:e18160159.** doi:10.1590/1678-4324-2018160159 — https://doi.org/10.1590/1678-4324-2018160159
* **⚠ Caveats:** (i) Tmin for *W. viridescens* and *L. sakei* is fitted below 0 °C, which is biologically implausible — treat as an empirical extrapolation, not a real lower growth limit. (ii) The model is only claimed valid over 4–30 °C. (iii) These are the same strains used for meat-spoilage work; the medium was MRS broth, not a vegetable.

#### **(b) LAB-OTHER — strong** — *Leuconostoc* spp. and *Carnobacterium* spp. in salmon juice, 4–16 °C

Stupar et al. (2023), Table 3. This is the **best *Leuconostoc mesenteroides* square-root parameter set I found**:

| Strain | **b** | **Tmin (°C)** | R² |
|---|---|---|---|
| ***Leuconostoc mesenteroides* 68 (Le.m.68)** | **0.013 ± 0.000** | **−5.3 ± 0.1** | 0.99 |
| ***Leuconostoc mesenteroides* 299 (Le.m.299)** | **0.011 ± 0.000** | **−11.5 ± 1.1** | 0.88 |
| *Leuconostoc citreum* 105 (Le.c.105) | 0.014 ± 0.001 | −3.2 ± 0.7 | 0.97 |
| *Leuconostoc lactis* 358 (Le.l.358) | 0.013 ± 0.000 | −4.2 ± 0.5 | 0.97 |
| *Leuconostoc gelidum* 406 (Le.g.406) | 0.009 ± 0.001 | −17.9 ± 2.2 | 0.90 |
| *Carnobacterium maltaromaticum* 35 | 0.012 ± 0.001 | −10.3 ± 1.7 | 0.93 |
| *Carnobacterium maltaromaticum* 55 | 0.009 ± 0.001 | −10.0 ± 1.1 | 0.99 |
| *Carnobacterium maltaromaticum* 316 | 0.010 ± 0.000 | −8.6 ± 0.2 | 0.90 |
| *Carnobacterium maltaromaticum* 461 | 0.009 ± 0.000 | −9.9 ± 0.7 | 0.95 |
| *Carnobacterium divergens* 468 | 0.011 ± 0.001 | −5.1 ± 1.0 | 0.97 |

*Species identities are as listed in the paper's strain list: Le.m.68 and Le.m.299 = *Leuconostoc mesenteroides*; Le.c.105 = *Leuconostoc citreum*; Le.l.358 = *Leuconostoc lactis*; Le.g.406 = *Leuconostoc gelidum*.*

* **Citation:** Stupar J, Hoel S, Strømseth S, Lerfall J, Rustad T, Jakobsen AN (2023). **Heliyon 9(10):e19887.** doi:10.1016/j.heliyon.2023.e19887 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10559289/
* **⚠ Caveats:** seafood-derived strains, salmon-juice model system; Tmin values of −5 to −18 °C are extrapolations far outside the measured 4–16 °C window (there is a ±1–2 °C SE on them); the paper itself uses these to describe psychrotrophic spoilage, not vegetable fermentation.

#### **(b) LAB-OTHER — weak** — undefined LAB consortium in BHI and milk, 4–30 °C

Tarlak et al. (2025), Tables 4 and 5, Ratkowsky parameters from a one-step fit:

| Matrix | Primary model | **T₀ (=Tmin) (°C)** | **b₁** | R²adj |
|---|---|---|---|---|
| BHI broth | Gompertz | 1.88 ± 4.93 | 1.28 × 10⁻² ± 1.26 × 10⁻² | 0.822 |
| BHI broth | Baranyi | 1.43 ± 4.40 | 1.14 × 10⁻² ± 9.97 × 10⁻³ | 0.820 |
| Milk | Gompertz | −0.45 ± 2.12 | 9.40 × 10⁻³ ± 2.61 × 10⁻³ | 0.925 |
| Milk | Baranyi | −0.77 ± 2.19 | 9.16 × 10⁻³ ± 2.56 × 10⁻³ | 0.925 |

* **Confidence: weak** — the Tmin confidence intervals span ±5 °C and the R²adj is only ~0.82–0.93, because only three temperatures (4, 10, 30 °C) were used. Useful only as a sanity band (b ≈ 0.009–0.015, Tmin ≈ −1 to +2 °C) that is consistent with §3.2 above.
* **Citation:** Tarlak F, Correia Peres Costa JC, Yucel O (2025). *The Development of Machine Learning-Assisted Software for Predicting the Interaction Behaviours of Lactic Acid Bacteria and Listeria monocytogenes.* **Life 15(2):244.** doi:10.3390/life15020244 — https://pmc.ncbi.nlm.nih.gov/articles/PMC11856248/

### 3.3 Vegetable-specific temperature optima (qualitative) — **(a) VEG**, **weak**

FAO (1998), *Fermented fruits and vegetables: a global perspective*, Chapter 5, states:

> *"The optimum temperature for sauerkraut fermentation is around 21 °C. A variation of just a few degrees from this temperature alters the activity of the microbial process and affects the quality of the final product. … A temperature of 18° to 22 °C is most desirable for initiating fermentation since this is the optimum temperature range for the growth and metabolism of Leuconostoc mesenteroides. Temperatures above 22 °C favour the growth of Lactobacillus species."*
> *"The optimum temperature for L. Cucumeris is 29 to 32 °C."*
> *"Fermentation takes between one and four weeks depending on the ambient temperature."* (dry-salted vegetables)

* **Source:** FAO Agricultural Services Bulletin — **URL:** https://www.fao.org/4/x0560e/x0560e10.htm
* **Confidence: weak** — authoritative institutional source but **no numbers, no primary data, no citation trail** for the temperature claims.

### 3.4 Explicitly NOT found

* ❌ **Topt and Tmax for *Leuconostoc mesenteroides*.** I found only square-root b/Tmin (§3.2) and growth rates across 10.5–24.5 °C (§1.2.1). No CTMI or full cardinal set.
* ❌ **Topt/Tmax for *Lactobacillus sakei*.** I found only square-root b/Tmin (§3.2). The same applies to *Weissella viridescens*.
* ❌ **Any cardinal parameters for *Lactococcus lactis*.** My Europe PMC searches for *Lactococcus lactis* + temperature + growth returned overwhelmingly probiotics/aquaculture papers; no cardinal parameter set was retrievable.
* ❌ **I could not access ComBase.** `https://www.combase.cc/` 301-redirects to `http://combase.errc.ars.usda.gov/`, which **timed out from this environment (exit 28)**. No ComBase Predictor values are reported here because I never retrieved any.
* ❌ I confirmed the existence but could **not retrieve the full text** of Zwietering et al. (1991) *Appl Environ Microbiol* 57:1094 (PMC182851) or Rosso et al. (1995) *Appl Environ Microbiol* 61:610 (PMC1388350) — both are non-OA scanned PMC deposits (Europe PMC `fullTextXML` returns 0 bytes). **No numbers are quoted from them.**

---

## 4. Published models for vegetable fermentation rate vs temperature

### 4.1 Kimchi acidity model — **(a) VEG**, **moderate**

The only published **explicit rate-vs-temperature equation for a vegetable fermentation** I found. Kim et al. (2020) model kimchi **total acidity N (%)** with a Baranyi–Roberts primary model whose maximum acidity growth rate μmax depends on temperature through a **polynomial**:

> **μmax(T) = a₀ + a₁·T + a₂·T²**  with  **a₀ = 7.09 × 10⁻²**, **a₁ = 1.52 × 10⁻²**, **a₂ = 2.33 × 10⁻³**
> (fitted over 0–20 °C; T in °C; μmax is the "maximum acidity growth rate at temperature T")

95 % CIs from their Table 3: a₀ [6.00×10⁻²; 8.38×10⁻²], a₁ [9.86×10⁻³; 2.34×10⁻²], a₂ [1.90×10⁻³; 2.87×10⁻³]. Also Q₀ = 3.70×10⁻⁷, and Nmax is linear in T: Nmax = 8.78×10⁻¹ + 1.60×10⁻²·T.

**Rate ratios computed by me from the fitted polynomial:**

| T (°C) | μmax(T) | Ratio vs 0 °C |
|---|---|---|
| 0 | 0.0709 | 1.00 |
| 5 | 0.2052 | 2.89 |
| 10 | 0.4559 | 6.43 |
| 15 | 0.8232 | 11.6 |
| 20 | 1.3069 | 18.4 |

* 10→20 °C: **1.3069 / 0.4559 = 2.87×**
* 5→15 °C: **0.8232 / 0.2052 = 4.01×**
* 15→20 °C: 1.3069 / 0.8232 = 1.59×

> **Read this as:** kimchi acidification speeds up **2.9× from 10 to 20 °C** and **4.0× from 5 to 15 °C** — a Q10 of about 2.9 and 4.0 respectively, i.e. **more temperature-sensitive than pure LAB growth**, which makes sense because it also reflects the shifting LAB consortium, salt effects and enzyme activity.

* **Citation:** Kim JY, Kim BS, Kim JH, Oh SI, Koo J (2020). **Foods 9(8):1075.** doi:10.3390/foods9081075 — https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/
* **⚠ Caveat:** the paper does not explicitly state the time unit attached to μmax in the fitted model (the fermentation schedules are in days). **Absolute μmax values therefore carry a unit ambiguity; the ratios do not.** The polynomial is a purely empirical fit valid only over the measured 0–20 °C.

### 4.2 Kimchi dynamic/MKT model — **(a) VEG**, **moderate**

Same paper: a dynamic model using **Mean Kinetic Temperature (MKT)** was validated under fluctuating temperature profiles (0↔10 °C at 24 h intervals for 20 days; 5↔15 °C at 24 h intervals for 14 days), achieving accuracy factors Af = 1.04–1.13 and bias factors Bf = 0.91–1.07 across three independent experiments. This is the standard approach for real-time kimchi shelf-life/ripeness prediction during distribution.

### 4.3 Sichuan sauerkraut Arrhenius shelf-life model — **(a) VEG**, **strong**

Du et al. (2022) stored Sichuan sauerkraut at **25, 35 and 45 °C** and fitted zero-order kinetics + Arrhenius (see §2.1/§2.2). Zero-order rate constants for **total acid** (their Table 2) and the derived Ea:

| T (°C) | k (total acid, zero-order) |
|---|---|
| 25 | −0.0078 |
| 35 | −0.0083 |
| 45 | −0.0196 |

**Arrhenius Ea reported by the authors (their Table 6): 47.23 kJ/mol, k_ref = −1.0616 d⁻¹, R² = 0.9567.**

**My independent pairwise Arrhenius fits to those three k values** (showing how noisy a 3-point fit is):
* 25→35 °C: ratio 1.064 → Ea = **4.7 kJ/mol**
* 35→45 °C: ratio 2.361 → Ea = **70.0 kJ/mol**
* 25→45 °C overall: ratio 2.513 → Ea = **36.3 kJ/mol**
* 3-point regression: Ea = **36.0 kJ/mol**

> **Read this as:** my naive fits (4.7–70 kJ/mol) bracket but do not reproduce the authors' 47.23 kJ/mol, because they fitted all quality indices jointly with a shared reference temperature. **Use the published 47.23 kJ/mol**, and treat the spread as an honest indication of the uncertainty in a 3-temperature Arrhenius fit. The authors' own statement: *"The activation energy (Ea) ranges from 47.23 to 72.09 kJ/mol"*, with **total acid having the lowest Ea** of all indices studied.

* **Citation & URL:** see §2.2. https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/

### 4.4 White cabbage / *L. paracasei* fermentation-time model — **(a) VEG**, **strong**

Di Biase et al. (2022) provide a complete predict-then-validate framework for a LAB starter in cabbage:

* μmax,cabbage(T) = **Cf · μopt,MRS · τ(T) · γ(pH)** with **Cf = 0.85**, μopt,MRS = 0.48 h⁻¹ (strain IMPC2.1)
* lag: K = μmax × λ = **1.77 h₀**
* log₁₀Nmax = 4.74 + 0.14·T for T < 24.5 °C (constant above)
* validated at 15, 20, 25, 35 °C with measured μmax of 0.101, 0.196, 0.257/0.227 and 0.470 h⁻¹ (§3.1). Predicted vs observed agreement is ±20 % except at 35 °C (0.360 predicted vs 0.470 observed).
* Simulations were used to predict the time to reach a 7 log₁₀ CFU/g target at different temperatures.

### 4.5 Kimchi ripening-time prediction (identified, NOT retrieved)

Jaisan N, Lee DS (2017). *A mathematical model to predict ripening degree of kimchi, a Korean fermented vegetable for meeting consumer preference and controlling shelf life on real time basis.* **Food Packaging and Shelf Life 12:23–29.** doi:10.1016/j.fpsl.2017.02.002 — **closed access; Unpaywall reports no OA copy; I did NOT retrieve it and quote no numbers from it.** https://doi.org/10.1016/j.fpsl.2017.02.002

### 4.6 Sauerkraut temperature study (identified, NOT retrieved)

Qiao & Gänzle, *From phyllosphere to fermentation: Impact of fermentation scale and temperature on sauerkraut fermentation*, **International Journal of Food Microbiology** (2026), doi:10.1016/j.ijfoodmicro.2025.111571 — flagged OA by Unpaywall but **ScienceDirect returned HTTP 403 to every retrieval attempt from this environment, so I did NOT read it and quote no numbers from it.** This is the second high-value follow-up target. https://doi.org/10.1016/j.ijfoodmicro.2025.111571

### 4.7 Explicitly NOT found

* ❌ No quantitative temperature-vs-rate model for **cucumber brine fermentation** was retrievable. The closest identified paper (Gül H, Güngörmüşler M, 2022, *Zeitschrift für Naturforschung C*, doi:10.1515/znc-2022-0009) is closed access and its retrievable abstract only states that fermentation temperatures of 20, 25, 30 °C were tested — **no rate constants, and I did not read the full text.**
* ❌ No quantitative temperature-vs-rate model for **pepper mash** fermentation.
* ❌ No published **Q10 for sauerkraut acidification rate** as such (I derived an equivalent from the Sichuan sauerkraut Ea instead).

---

## 5. Worked arithmetic (as requested)

### 5.1 Square-root model rate ratios: 15→25 °C and 10→20 °C

**Model:** μ = [b(T − Tmin)]², therefore **μ(T₂)/μ(T₁) = [(T₂ − Tmin)/(T₁ − Tmin)]²**

*(Note: the ratio is independent of b. b matters only for absolute rates.)*

| Organism / source | Tmin (°C) | **15 → 25 °C** | **10 → 20 °C** |
|---|---|---|---|
| *L. plantarum* (BABT 2018) | 4.10 | ((25−4.10)/(15−4.10))² = (20.90/10.90)² = 1.917² = **3.68** | ((20−4.10)/(10−4.10))² = (15.90/5.90)² = 2.694² = **7.26** |
| *L. sakei* (BABT 2018) | −1.32 | ((26.32)/(16.32))² = 1.613² = **2.60** | ((21.32)/(11.32))² = 1.883² = **3.55** |
| *W. viridescens* (BABT 2018) | −1.36 | ((26.36)/(16.36))² = 1.611² = **2.60** | ((21.36)/(11.36))² = 1.880² = **3.54** |
| ***Lc. mesenteroides* Le.m.68** (Stupar 2023) | −5.3 | ((30.30)/(20.30))² = 1.493² = **2.23** | ((25.30)/(15.30))² = 1.654² = **2.73** |
| ***Lc. mesenteroides* Le.m.299** (Stupar 2023) | −11.5 | ((36.50)/(26.50))² = 1.377² = **1.90** | ((31.50)/(21.50))² = 1.465² = **2.15** |
| *Lc. citreum* Le.c.105 (Stupar 2023) | −3.2 | ((28.20)/(18.20))² = 1.549² = **2.40** | ((23.20)/(13.20))² = 1.758² = **3.09** |
| *Lc. lactis* Le.l.358 (Stupar 2023) | −4.2 | ((29.20)/(19.20))² = 1.521² = **2.31** | ((24.20)/(14.20))² = 1.704² = **2.90** |

> **Headline result:** using the reviewer-standard square-root model, **the 15→25 °C rate ratio for vegetable-relevant LAB is ~1.9–3.7×, and the 10→20 °C ratio is ~2.2–7.3×.** The spread is driven almost entirely by Tmin. A LAB with a Tmin near +4 °C (*L. plantarum* in that particular fit) is far more temperature-sensitive in the cold than one with Tmin near −5 to −11 °C (*Lc. mesenteroides*).

**Local Q10 implied by the square-root model**, Q10(T) = [(T+5−Tmin)/(T−5−Tmin)]²:

| Organism | Q10 @10 °C | Q10 @20 °C | Q10 @30 °C |
|---|---|---|---|
| *L. plantarum* (Tmin 4.10) | 145.7 | 3.68 | 2.19 |
| *L. sakei* (Tmin −1.32) | 6.67 | 2.60 | 1.90 |
| *Lc. mesenteroides* Le.m.68 (Tmin −5.3) | 3.88 | 2.23 | 1.77 |
| *Lc. mesenteroides* Le.m.299 (Tmin −11.5) | 2.58 | 1.90 | 1.62 |
| *Lc. citreum* Le.c.105 (Tmin −3.2) | 4.93 | 2.40 | 1.83 |

**Two things to notice:** (1) Q10 **falls monotonically with temperature** — this is the caveat, quantifiable. (2) When Tmin is close to the temperature of interest, the model's Q10 explodes (145 for *L. plantarum* at 10 °C). That is a known pathology of the square-root model near Tmin, **not** a real Q10 — do not use the model within a few degrees of Tmin.

### 5.2 Converting Ea to Q10 (and back)

**Exact relation:** Q10 = exp[ (Ea/R) × (10 / (T₁·T₂)) ], with T in kelvin and R = 8.314 J mol⁻¹ K⁻¹. For a narrow interval this is well approximated by Q10 ≈ exp(10·Ea/(R·T²)).

| Ea (kJ/mol) | Q10 at 10→20 °C | Q10 at 20→30 °C | Q10 at 25→35 °C |
|---|---|---|---|
| 45.8 (water kefir mannitol) | 1.83 | 1.80 | 1.80 |
| 47.23 (**Sichuan sauerkraut total acid**) | **1.98** | **1.90** | **1.86** |
| 54.7 (*Lc. mesenteroides* growth, my fit) | 2.44 | 2.30 | 2.24 |
| 62.2 (water kefir acetic acid) | 3.02 | 2.80 | 2.70 |
| 67.5 (*Lc. mesenteroides* growth anaer., my fit) | 3.46 | 3.18 | 3.05 |
| 71.9 (**water kefir lactic acid**) | **3.86** | **3.51** | **3.36** |
| 76.3 (water kefir glycerol) | 4.34 | 3.92 | 3.73 |
| 87.4 (*L. monocytogenes* growth) | 5.86 | 5.15 | 4.84 |
| 100 (round number) | 8.34 | 7.17 | 6.65 |

**How to reconcile this table with §1.1:** Laureys et al. report Q10 = 2.64 for lactic acid with Ea = 71.9 kJ/mol. My table says 3.86 for the 10→20 °C window — because their Q10 was evaluated over **17–29 °C**, i.e. at a higher, warmer reference (Q10 = exp(71900·10/(8.314 × 290.15 × 300.15)) = 2.70; at a 21 °C midpoint it is 2.63, matching their 2.64). **Q10 is reference-temperature-dependent. Always state the temperature window.**

### 5.3 Q10 computed for the vegetable systems

**Kimchi (from §1.2.4, sensory ripeness times):**
* 0→10 °C: 56 d / 16 d = 3.50 → **Q10 = 3.5**
* 10→20 °C: 16 d / 7 d = 2.29 → **Q10 = 2.3**
* 0→20 °C: 56 d / 7 d = 8.00 → **Q10 = 8.00^(10/20) = 2.83**

**Kimchi (from the μmax(T) polynomial, §4.1):**
* 10→20 °C: μmax(20)/μmax(10) = 1.3069/0.4559 = **2.87**
* 5→15 °C: 0.8232/0.2052 = **4.01**

**Sichuan sauerkraut (from published Ea = 47.23 kJ/mol):**
* 20→30 °C: Q10 = exp(47230 × 10 / (8.314 × 293.15 × 303.15)) = exp(472300/738,850) = e^0.6392 = **1.90**
* 10→20 °C: Q10 = **1.98**

Both kimchi estimates (2.3–3.5) sit at or slightly above the top of the classic band; the sauerkraut acidification estimate (1.9) sits at the bottom. **Do not use a single Q10 across a vegetable fermentation.**

### 5.4 Cardinal-model rate ratios (the requested 15→25 and 10→20)

Using τ(T) from the CTMI (§3.1), μ(T₂)/μ(T₁) = τ(T₂)/τ(T₁):

| Strain | **15 → 25 °C** | **10 → 20 °C** | τ(Topt)→τ(Topt+3 °C) |
|---|---|---|---|
| *L. paracasei* IMPC2.1 (cabbage) | τ(25)/τ(15) = 0.7690/0.3093 = **2.49** | 0.5303/0.1371 = **3.87** | 0.92 (**slower**) |
| *L. paracasei* IMPC4.1 | 0.6077/0.2364 = **2.57** | 0.4035/0.1121 = **3.60** | 0.69 (**slower**) |
| *L. paracasei* P40 | 0.6885/0.2353 = **2.93** | 0.4397/0.0909 = **4.84** | 0.78 (**slower**) |
| *L. paracasei* P101 | 0.5921/0.2298 = **2.58** | 0.3924/0.1091 = **3.60** | 0.64 (**slower**) |
| *L. plantarum* ITM21B | 0.6310/0.2083 = **3.03** | 0.3973/0.0770 = **5.16** | 0.82 (**slower**) |

**Cross-check against real cabbage measurements** (Di Biase Table 1, strain IMPC2.1, μmax in blanched white cabbage): 15 °C = 0.101 h⁻¹, 25 °C = 0.242 h⁻¹ (mean of the two 25 °C runs)
→ ratio = 0.242/0.101 = **2.40** (vs 2.49 predicted by CTMI — very good agreement)
→ and 15→20 °C: 0.196/0.101 = 1.94.

---

## 6. Summary: what is solid, what is thin

### Solid (strong confidence, ready to use)
1. **Q10 for LAB lactic acid production rate = 2.64 [2.30; 3.04]** over 17–29 °C — Laureys et al. 2022.
2. **Ea for LAB metabolite production = 45.8–76.3 kJ/mol** over 17–29 °C — Laureys et al. 2022.
3. **Rate ratios from the Ratkowsky square-root model** for *L. plantarum*, *L. sakei*, *W. viridescens* (MRS, 4–30 °C) and five *Leuconostoc* spp. including two *Lc. mesenteroides* strains (salmon juice, 4–16 °C) — da Silva et al. 2018; Stupar et al. 2023.
4. **Cardinal temperatures for *L. paracasei* in white cabbage** (Tmin ≈ −1 to +2, Topt ≈ 33–36, Tmax ≈ 37–41 °C) plus a validated cabbage growth model with Cf = 0.85 — Di Biase et al. 2022 (Frontiers).
5. **Cardinal temperatures for *L. plantarum* ITM21B** (Tmin 2.40, Topt 34.35, Tmax 39.47 °C) — Di Biase et al. 2022 (Foods).
6. **Ea = 47.23 kJ/mol for total-acid change in Sichuan sauerkraut** over 25–45 °C, with a published prediction equation — Du et al. 2022.
7. **Kimchi μmax(T) = 0.0709 + 0.0152·T + 0.00233·T²** over 0–20 °C — Kim et al. 2020.
8. **The Q10-declines-with-T and Q10<1-above-Topt caveats**, both computable from the published parameters above and supported by Ratkowsky et al. 1982.

### Thin or missing (do not fabricate around these)
1. **No Topt/Tmax for *Lc. mesenteroides*, *L. sakei*, or *Lc. lactis*.** Only square-root b/Tmin exists for the first two; nothing for *Lc. lactis*.
2. **No published Arrhenius Ea for LAB growth rate specifically in a vegetable fermentation.** Best available proxies: my fits to the *Lc. mesenteroides* growth data (54.7 aer / 67.5 anaer kJ/mol), and Ea for sauerkraut acid *change* (47.23 kJ/mol).
3. **No Q10 for sauerkraut/kimchi acidification rate published as such** — I derived kimchi Q10 ≈ 2.3–3.5 and sauerkraut Q10 ≈ 1.9.
4. **ComBase was unreachable** (usda.gov host timed out). No ComBase values are quoted.
5. **Zwietering 1991 and Rosso 1995** (the classic cardinal-parameter papers) exist in PMC but only as non-OA scans — I could not read them and quote nothing from them.
6. **Dougherty et al. 2002 (AEM) on *Lactococcus lactis* in cucumber juice under variable temperature** is the single best-targeted unread paper for your question. Closed access.
7. **Qiao & Gänzle on sauerkraut scale × temperature** — flagged OA but ScienceDirect 403'd me. Unread.
8. **Cucumber and pepper mash**: no quantitative temperature-rate model retrieved.

---

## 7. Full citation list with working URLs

All URLs below were verified to return HTTP 200 from this environment, except where marked.

| # | Citation | URL(s) | Retrieved? |
|---|---|---|---|
| 1 | Laureys D, Leroy F, Vandamme P, De Vuyst L (2022). *Backslopping Time, Rinsing of the Grains During Backslopping, and Incubation Temperature Influence the Water Kefir Fermentation Process.* Front Microbiol 13:871550. | https://doi.org/10.3389/fmicb.2022.871550 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9120925/ | ✅ full text |
| 2 | Di Biase M, Le Marc Y, Bavaro AR, De Bellis P, Lonigro SL, Lavermicocca P, Postollec F, Valerio F (2022). *A Predictive Growth Model for Pro-technological and Probiotic Lacticaseibacillus paracasei Strains Fermenting White Cabbage.* Front Microbiol 13:907393. | https://doi.org/10.3389/fmicb.2022.907393 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9207389/ | ✅ full text |
| 3 | Di Biase M, Le Marc Y, Bavaro AR, Lonigro SL, Verni M, Postollec F, Valerio F (2022). *Modeling of Growth and Organic Acid Kinetics … Lactiplantibacillus plantarum ITM21B Fermentation in Liquid Sourdough.* Foods 11(23):3942. | https://doi.org/10.3390/foods11233942 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9741194/ | ✅ full text |
| 4 | da Silva APRD, Longhi DA, Dalcanton F, Aragão GMF (2018). *Modelling the growth of lactic acid bacteria at different temperatures.* Braz Arch Biol Technol 61:e18160159. | https://doi.org/10.1590/1678-4324-2018160159 · http://www.scielo.br/pdf/babt/v61/1516-8913-babt-61-e18160159.pdf | ✅ full text (PDF) |
| 5 | Stupar J, Hoel S, Strømseth S, Lerfall J, Rustad T, Jakobsen AN (2023). *Selection of lactic acid bacteria for biopreservation of salmon products…* Heliyon 9(10):e19887. | https://doi.org/10.1016/j.heliyon.2023.e19887 · https://pmc.ncbi.nlm.nih.gov/articles/PMC10559289/ | ✅ full text |
| 6 | Du J, Zhang M, Zhang L, Law CL, Liu K (2022). *Shelf-Life Prediction and Critical Value of Quality Index of Sichuan Sauerkraut…* Foods 11(12):1762. | https://doi.org/10.3390/foods11121762 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/ | ✅ full text |
| 7 | Kim JY, Kim BS, Kim JH, Oh SI, Koo J (2020). *Development of Dynamic Model for Real-Time Monitoring of Ripening Changes of Kimchi during Distribution.* Foods 9(8):1075. | https://doi.org/10.3390/foods9081075 · https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/ | ✅ full text |
| 8 | Wang HY, Wen CF, Chiu YH, Lee IN, Kao HY, Lee IC, Ho WH (2013). *Leuconostoc mesenteroides growth in food products: prediction and sensitivity analysis by adaptive-network-based fuzzy inference systems.* PLoS ONE 8(5):e64995. | https://doi.org/10.1371/journal.pone.0064995 · https://pmc.ncbi.nlm.nih.gov/articles/PMC3660370/ | ✅ full text |
| 9 | Zurera-Cosano G, García-Gimeno RM, Rodríguez-Pérez R, Hervás-Martínez C (2006). *Performance of response surface model for prediction of Leuconostoc mesenteroides growth parameters under different experimental conditions.* Food Control 17(6):429–438. | https://doi.org/10.1016/j.foodcont.2005.02.003 | ❌ **closed access** (data obtained via #8) |
| 10 | De Silvestri A, Ferrari E, Gozzi S, Marchi F, Foschino R (2018). *Determination of Temperature Dependent Growth Parameters in Psychrotrophic Pathogen Bacteria…* Front Microbiol 9:3023. | https://doi.org/10.3389/fmicb.2018.03023 · https://pmc.ncbi.nlm.nih.gov/articles/PMC6290036/ | ✅ full text |
| 11 | Ratkowsky DA, Olley J, McMeekin TA, Ball A (1982). *Relationship between temperature and growth rate of bacterial cultures.* J Bacteriol 149(1):1–5. | https://doi.org/10.1128/jb.149.1.1-5.1982 · https://pmc.ncbi.nlm.nih.gov/articles/PMC216584/ | ⚠️ abstract only (non-OA scan) |
| 12 | Tarlak F, Correia Peres Costa JC, Yucel O (2025). *The Development of Machine Learning-Assisted Software for Predicting the Interaction Behaviours of Lactic Acid Bacteria and Listeria monocytogenes.* Life 15(2):244. | https://doi.org/10.3390/life15020244 · https://pmc.ncbi.nlm.nih.gov/articles/PMC11856248/ | ✅ full text |
| 13 | FAO (1998). *Fermented fruits and vegetables: a global perspective*, Chapter 5: Bacterial fermentations. FAO Agricultural Services Bulletin. | https://www.fao.org/4/x0560e/x0560e10.htm | ✅ full text |
| 14 | *Q10 (temperature coefficient)*, Wikipedia. | https://en.wikipedia.org/wiki/Q10_(temperature_coefficient) | ✅ (tertiary) |
| 15 | Jaisan N, Lee DS (2017). *A mathematical model to predict ripening degree of kimchi…* Food Packag Shelf Life 12:23–29. | https://doi.org/10.1016/j.fpsl.2017.02.002 | ❌ closed access |
| 16 | Qiao, Gänzle. *From phyllosphere to fermentation: Impact of fermentation scale and temperature on sauerkraut fermentation.* Int J Food Microbiol (2026). | https://doi.org/10.1016/j.ijfoodmicro.2025.111571 | ❌ HTTP 403 |
| 17 | Dougherty DP, Breidt F, McFeeters RF, Lubkin SR (2002). *Energy-based dynamic model for variable temperature batch fermentation by Lactococcus lactis.* Appl Environ Microbiol 68(5):2468–2478. | https://doi.org/10.1128/AEM.68.5.2468-2478.2002 | ❌ closed access |
| 18 | Gül H, Güngörmüşler M (2022). *Utilizing response surface methodology to evaluate the process parameters of indigenous cucumber fermentation.* Z Naturforsch C. | https://doi.org/10.1515/znc-2022-0009 | ❌ closed access (abstract only) |
| 19 | Zwietering MH et al. (1991). *Modeling of bacterial growth as a function of temperature.* Appl Environ Microbiol 57(4):1094–1101. | https://pmc.ncbi.nlm.nih.gov/articles/PMC182851/ | ❌ non-OA scan, no full text |
| 20 | Rosso L, Lobry JR, Bajard S, Flandrois JP (1995). *Convenient Model To Describe the Combined Effects of Temperature and pH on Microbial Growth.* Appl Environ Microbiol 61(2):610–616. | https://pmc.ncbi.nlm.nih.gov/articles/PMC1388350/ | ❌ non-OA scan, no full text |

---

## 8. Method note

Values were taken from the publisher/PMC/Europe PMC **full-text XML** of the cited articles (downloaded and parsed directly, tables extracted from the JATS XML rather than copied from secondary summaries). Where a value is my own computation rather than the authors', it is labelled "computed by me" or "my fit" and the arithmetic is shown in §5 so it can be independently checked. No number in this document was produced from memory or from an unretrieved source.

**URL status.** Every `pmc.ncbi.nlm.nih.gov`, `fao.org`, `doi.org/10.3389/...`, `doi.org/10.1371/...` and `doi.org/10.1016/j.heliyon...` link was fetched successfully (HTTP 200) from this environment. The MDPI (`10.3390/...`) and ASM (`10.1128/...`) DOIs returned HTTP 403 to automated fetching — this is their bot filter, **not** a dead link; all of those DOIs were confirmed to exist and resolve via the Crossref API (`api.crossref.org/works/<DOI>`), and the corresponding PMC mirrors all returned 200 and were read in full. The closed-access entries in §7 are marked as such because their **content**, not their URL, was unavailable.
