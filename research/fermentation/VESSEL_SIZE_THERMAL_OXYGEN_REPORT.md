# Vessel Size, Thermal Mass, Surface-to-Volume Ratio and Oxygen Ingress in Vegetable Fermentation
## A quantitative literature report with full citations

**Compiled:** 13 September 2026
**Scope:** (A) thermal mass / vessel & batch size effects on vegetable fermentation rate; (B) surface-to-volume geometry and oxygen ingress.
**Method:** web search + direct retrieval of primary PDFs/HTML. Where the primary document was a scanned image with no text layer, it was rasterised (`pdftoppm`) and read visually. Primary sources preferentially from USDA ARS, peer-reviewed journals, and university extension.

### How to read this report

| Label | Meaning |
|---|---|
| **[MEASURED]** | A value I read directly in a primary source (experiment or field survey). |
| **[MODELLED]** | A value produced by the cited authors' model/simulation, not a direct measurement. |
| **[CALC — mine]** | **My own arithmetic.** Formula and all inputs are shown so you can re-derive it. This is not a literature value. |
| **[ANALOGUE]** | Data from silage or compost, used because direct vegetable-fermentation data does not exist. |

**Confidence:** *strong* = peer-reviewed, measured, replicated, primary; *moderate* = peer-reviewed or authoritative institutional source but modelled/single-study/single-site; *weak-or-contested* = secondary compilation, conflicting sources, internal inconsistency, or analogue of uncertain transferability.

**Honesty note:** Section 6 lists every sub-question for which I found **NO data**. I have not filled those gaps with plausible-sounding numbers.

---

# 1. EXECUTIVE SUMMARY — the numbers that matter

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| Thermal diffusivity, cabbage petiole tissue (raw) | **1.10–1.21 × 10⁻⁷ m²/s** [CALC — mine, from measured *k* + estimated *c_p*] | derived from Kim et al. 1991 | moderate |
| Thermal diffusivity, measured, root vegetables (carrot/radish/burdock) | **1.15–1.47 × 10⁻⁷ m²/s** [MEASURED] | Muramatsu et al. 2020 | strong |
| Thermal conductivity, raw Chinese-cabbage petiole | **0.43–0.47 W m⁻¹ K⁻¹** [MEASURED] | Kim et al. 1991 | strong |
| Thermal conductivity, *salted* cabbage petiole | **+0.04 W m⁻¹ K⁻¹ vs raw** → ~0.47–0.51 W m⁻¹ K⁻¹ [MEASURED] | Kim et al. 1991 | strong |
| Thermal conductivity, corn/grass **silage** [ANALOGUE] | **0.09–0.47 W m⁻¹ K⁻¹** [MEASURED] | Ahn et al. 2009 (USDA-ARS) | strong |
| Volumetric heat capacity, **silage** [ANALOGUE] | **0.93–3.09 MJ m⁻³ K⁻¹** [MEASURED] | Ahn et al. 2009 (USDA-ARS) | strong |
| Heat capacity, **compost** at 40 % moisture [ANALOGUE] | **2.01 kJ kg⁻¹ K⁻¹**; *k* = 1.436 kJ m⁻¹ h⁻¹ K⁻¹ = **0.399 W m⁻¹ K⁻¹** [MODELLED inputs, from Haug 1993] | Barrena et al. 2006 | moderate |
| Thermal time constant τ = R²/(2.4048²α) — **1 L jar** (r = 4.73 cm) | **0.94 h** [CALC — mine] | this report §3.2 | — |
| Thermal time constant τ — **20 L crock** (r = 12.85 cm) | **6.90 h** [CALC — mine] | this report §3.2 | — |
| τ ratio 20 L : 1 L | **7.4×** (= 20^(2/3)) [CALC — mine] | this report §3.2 | — |
| Sensible heat to shift batch by 1 K — 1 L vs 20 L | **3.9 kJ/K vs 78.0 kJ/K** (20×) [CALC — mine] | this report §3.2 | — |
| Diurnal (24 h) thermal penetration depth in cabbage tissue | **5.6 cm** [CALC — mine] | this report §3.2 | — |
| A/V, 1 L cylinder (H = 1.5 D) | **0.563 cm⁻¹ = 56.3 m⁻¹** [CALC — mine] | this report §4.1 | — |
| A/V, 20 L cylinder (H = 1.5 D) | **0.208 cm⁻¹ = 20.8 m⁻¹** [CALC — mine] | this report §4.1 | — |
| D(O₂) in water, 20 °C | **1.97 × 10⁻⁹ m²/s** [MODELLED — Wilke–Chang correlation] | Richard, Cornell Composting | moderate |
| D(O₂) in air (O₂–N₂), 20 °C | **2.19 × 10⁻⁵ m²/s** [MODELLED — kinetic theory] | Richard, Cornell Composting | moderate |
| O₂ solubility in water, 25 °C, air-saturated | **8.26 mg/L**; at 20 °C **9.09 mg/L** [MEASURED — tabulated] | Chapra / standard DO tables; USGS DOTABLES (Benson & Krause) | moderate |
| Henry constant O₂ in water, 25 °C | **log K_H,cp = −2.904** ⇒ **1.25 × 10⁻³ mol kg⁻¹ bar⁻¹** [MEASURED, fitted to IUPAC data] | Bok, Moog & Brendler 2023 | strong |
| Vessel **material** changes fermentation rate at identical size | pH 3.5 reached **day 4** (glass, plastic) vs **day 5** (porcelain), 10 L jars [MEASURED] | Liu et al. 2020 | moderate |
| Porous (onggi) vs hermetic (glass) vessel — CO₂ generation | **0.695 vs 0.552 mmol h⁻¹** per 200 g cabbage = **+26 %**, p = 0.0498 [MEASURED, n = 3] | Kim & Hu 2023 | moderate |
| Sauerkraut, extension guidance | **3–4 wk at 21–24 °C** vs **5–6 wk at 15.6 °C** [MEASURED practice] | Oregon State PNW 355 | moderate |
| Arrhenius Eₐ, total-acid change in sauerkraut | **47.23 kJ/mol** (whole range across quality indices **47.23–72.09 kJ/mol**) [MODELLED fit to measured data] | Du et al. 2022 | moderate |
| Q₁₀ from *L. plantarum* Ratkowsky model | **2.03** (15→20 °C), **1.67** (20→25 °C), **1.46** (25→30 °C) [CALC — mine from published parameters] | params: Zwietering et al. 1994 | moderate |
| **Vessel/batch SIZE as an independent variable on fermentation rate** | **NO DATA FOUND** | §2, §6 | — |

---

# 2. TOPIC A.1 — DOES VESSEL / BATCH SIZE CHANGE THE RATE OF VEGETABLE FERMENTATION?

## Direct answer

**No study I could locate isolates vessel size (volume) as an independent variable and measures its effect on vegetable fermentation rate.** The literature contains (a) vessel **material** comparisons, (b) vessel **depth** effects on *physical* properties of the pack, and (c) vessel **permeability** effects — but in every case geometry and material are confounded or size is held constant. This is stated plainly in the literature itself:

> "The fermentation techniques may vary from place to place, but an essential element influencing the quality of the fermented product is the fermentation vessel. However, to date, whether the fermentation vessels contribute to the characteristics of the pickle has little been assessed."
> — Liu et al. (2020), *Front. Microbiol.* 11:445 — [https://doi.org/10.3389/fmicb.2020.00445](https://doi.org/10.3389/fmicb.2020.00445) — *strong* (verbatim statement of the gap)

What follows is the closest available evidence, decomposed into the four mechanisms you asked about.

## (i) Thermal mass / temperature buffering

**NO direct vegetable-fermentation data.** No paper I found measures the core temperature trajectory of a 20 L crock vs a 1 L jar under a controlled ambient programme. See §3 for the full treatment using measured thermophysical properties plus a silage/compost analogue, and my own calculation.

The nearest *fermentation-vessel* statement is in the ARS cucumber literature, where tank depth (a linear dimension, hence thermal mass) is treated as a quality variable, not a rate variable:

> "Other sources of fermented cucumber damage ... include pre-harvest fruits condition, tanking injuries of the fresh fruits and hydrostatic pressure in tanks with more than 6 ft depth (Fleming et al., 1977). ... Increasing tank depths augments the buoyancy force on cucumbers near the top of the tank."
> — Zhai, Pérez-Díaz & Diaz (2018), *Trends Food Sci. Technol.* 81:185–192 — [https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p423.pdf](https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p423.pdf) — *strong* (peer-reviewed review, USDA-ARS co-author)

Primary source behind it: **Fleming, H. P., Thompson, R. L., Bell, T. A., & Monroe, R. J. (1977). "Effect of brine depth on physical properties of brine-stock cucumbers." *J. Food Sci.* 42(6):1464–1470.** DOI [10.1111/j.1365-2621.1977.tb08401.x](https://doi.org/10.1111/j.1365-2621.1977.tb08401.x). *Confidence: moderate* — I verified the citation and its use by the ARS review, but the full text is paywalled and I could **not** read its numeric results.

## (ii) Surface-to-volume ratio and oxygen ingress

**NO direct measurement** of O₂ ingress vs vessel size in a vegetable fermentation vessel. There are, however, three quantitative anchors:

1. **Vessel permeability changes the rate (measured).** Fermenting salted napa cabbage in porous *onggi* vs hermetic glass over 2 days at 200 g scale:

   > "Salted cabbage carbon dioxide generation rates were **0.552 mmol h⁻¹** for glass and **0.695 mmol h⁻¹** for onggi. Thus, salted cabbage in onggi generated **26 % more carbon dioxide** than in the glass container, indicative of 26 % more bacterial proliferation in the onggi. One-tailed *t*-test shows this difference was significant (**p = 0.0498**)."
   > "...carbon dioxide generation rates per unit mass of cabbage for the glass and onggi were **2915 and 3670 mg kg⁻¹ day⁻¹**."
   > — Kim, S., & Hu, D. L. (2023), *J. R. Soc. Interface* 20(201):20230034 — [https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/) — *moderate* (n = 3 trials; **confound:** the onggi was 4600 mL and the glass jar 1900 mL, so size and material are not separated)

   Vessel geometry values from the same paper: onggi **4600 mL, mouth radius 10 cm, height 20 cm**; glass jar **1900 mL, height 15 cm, radius 10 cm**; steady-state internal gas pressure **4.1 kPa**; onggi pore size **5 µm**; measured gas permeance **3.4 × 10⁻³ mol kPa⁻¹ m⁻² h⁻¹**, vs **1.7–49.4 × 10⁻³** for unglazed onggi in prior work. [MEASURED]

2. **Vessel material changes the rate at identical size and volume (measured).** This is the cleanest controlled vessel experiment I found — 10 L jars of glass (GL), porcelain (PO) and plastic (PL), each with ~3 kg radish in 6 % NaCl, 22–25 °C, pH measured daily for 12 days:

   > "the pH levels reached a minimum value of **3.5 on the 4th day in GL and PL, while the pH in PO only reached the same value on the 5th day**."
   > "the nitrite concentrations ... reached **59.73 mg/kg in PO**, which was significantly higher than the values in both the other containers."
   > — Liu, L., She, X., Chen, X., Qian, Y., Tao, Y., Li, Y., Guo, S., Xiang, W., Liu, G., & Rao, Y. (2020). "Microbiota Succession and Chemical Composition Involved in the Radish Fermentation Process in Different Containers." *Front. Microbiol.* 11:445 — [https://doi.org/10.3389/fmicb.2020.00445](https://doi.org/10.3389/fmicb.2020.00445) — *moderate* (single site, single batch, n = 3; no headspace-O₂ measurement, so the mechanism is inferred)

   **Interpretation:** container material alone shifted time-to-pH-3.5 by ~25 % (4 → 5 days) at fixed volume. That is a *material/permeability* effect, not a size effect — but it sets the scale of what vessel choice can do.

3. **A directly relevant literature formula ties vessel geometry to gas equilibration time.** The onggi study derives

   > τ = μ_CO₂ · V · d / (k_g · P₀ · A)

   where *V* is vessel volume, *A* vessel surface area, *d* wall thickness, *k_g* gas permeability. — Kim & Hu 2023, eq. 3.12 — [https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/)

   **τ ∝ V/A.** This is a published, peer-reviewed statement that the CO₂ time constant of a fermentation vessel scales with the volume-to-surface ratio, i.e. as the linear dimension. **This is the single most citable formula I found linking vessel size to gas dynamics.** [MODELLED]

## (iii) CO₂ blanket establishment time

**NO study measures the time for a CO₂ blanket to establish in a vegetable fermentation vessel of any size.** What exists:

- **CO₂ generation rate**, the necessary input: **0.695 mmol h⁻¹ per 200 g** salted cabbage = **3.48 mmol h⁻¹ kg⁻¹** [MEASURED] — Kim & Hu 2023, above.
- **A CO₂ production figure from the cucumber industry:** *Lactobacillus plantarum* "can generate **84 mg of CO₂ per 100 g of cucumbers** in a fermentation" [MEASURED] — Zhai et al. 2018, [ARS PDF](https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p423.pdf).
- **Bloater-defect thresholds** (CO₂ in cover brine): defect initiates at **20–60 mg CO₂ per 100 mL**; **12.5 mM** dissolved CO₂ is the point at which internal tissue pressure displaces tissue; target **<30 % saturation above 75 °F and <50 % below 75 °F** in 25° salometer (10 % NaCl) brine. [MEASURED/industry-derived] — Zhai et al. 2018, same URL. Underlying primary data: Fleming, Etchells, Thompson & Bell (1975), cited therein.

My own estimate of headspace displacement time is in §4.2 — it is a **calculation with stated assumptions**, not a literature value.

## (iv) Microbiological differences

**NO data.** No study I located compares the microbial succession (*Leuconostoc mesenteroides* → *Lactobacillus* spp.) between vessels of different **size** at constant material and temperature. Liu et al. 2020 explicitly found the opposite of a vessel effect at the community level:

> "The container materials had **no significant influence on the microbial structure**, wherein *Lactobacillus* was the absolute dominant genus in all containers. But container material did have an effect on the abundance of specific genus, such as *Lactococcus* and *Pediococcus*."
> — Liu et al. 2020, [https://doi.org/10.3389/fmicb.2020.00445](https://doi.org/10.3389/fmicb.2020.00445) — *moderate*

One reviewed source asserts a mechanistic link between container and community but the same source frames it as unexplored. There is also a Korean study titled "The Effect of Container Types on the Growth of Bacteria during Kimchi Fermentation" (KCI, article ID ART001778860 — [https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001778860](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001778860)); I could retrieve only the record, **not the numbers**. *Confidence: weak-or-contested* — cite only as evidence the question has been asked.

---

# 3. TOPIC A.2 — THERMAL MASS WITH NUMBERS

## 3.1 Measured thermophysical properties

### 3.1.1 Cabbage tissue — thermal conductivity [MEASURED]

> "Changes in thermal conductivity of petiole tissue of Chinese cabbage during steam heating and salting were measured by probe method. ... initial **0.43–0.47 W m⁻¹ K⁻¹**, increased to **0.51–0.54 W m⁻¹ K⁻¹** on heating as internal air was expelled. ... The thermal conductivity of salted cabbage was about **0.04 W m⁻¹ K⁻¹ higher** than that of raw cabbage at the same moisture content."
> Correlation reported: k_e = 0.0192·MC − 0.6284·V_a − 1.3252 (over MC 92–96 %, gas content 0–0.15 mL/g, 30 °C)
> — Kim, J.-B., Lee, D.-S., Choi, D.-W., & Pyun, Y.-R. (1991). "Thermal Conductivity of Petiole Tissue of Chinese Cabbage." *Korean J. Food Sci. Technol.* 23(3):325–329. — [https://koreascience.kr/article/JAKO199103041971660.pub](https://koreascience.kr/article/JAKO199103041971660.pub) — **strong** (direct probe measurement, replicated across moisture/gas contents)

**Caveat:** the English and Korean abstracts give *different* coefficients for the gas-content term (−0.6284 vs −0.6539). I report the English-abstract form and flag the discrepancy. Also note **k rises on salt addition and on de-aeration**, i.e. a salted, packed crock conducts heat *better* than raw shredded cabbage.

### 3.1.2 Cabbage tissue — thermal diffusivity [MEASURED, by analogy to other vegetables]

I found **no direct measurement of thermal diffusivity of cabbage**. The closest measured values, in root vegetables of comparable water content:

| Sample | α (×10⁻⁷ m²/s), 2-D analysis | α (×10⁻⁷ m²/s), 3-D analysis |
|---|---|---|
| Burdock root | 1.372 ± 0.093 | 1.372 ± 0.088 |
| Carrot-A (cyl. 20 mm × 100 mm) | 1.402 ± 0.109 | 1.402 ± 0.111 |
| Carrot-B | 1.347 ± 0.064 | 1.345 ± 0.056 |
| Carrot-C | 1.337 ± 0.088 | 1.338 ± 0.079 |
| Carrot-D (disk 40 × 10 mm) | — | 1.467 ± 0.052 |
| Radish | 1.147 ± 0.024 | 1.151 ± 0.025 |

> "The thermal diffusivity values of the samples ranged from **(1.1–1.5) × 10⁻⁷ m²/s**."
> Literature values quoted in the same paper: **1.24 × 10⁻⁷** (burdock), **(1.39–1.55) × 10⁻⁷ m²/s** (carrot).
> — Muramatsu, Y., Hashiguchi, M., Mi, D., Sakaguchi, E., & Kawakami, S. (2020). "Sequential Estimation of the Thermal Diffusivity of Three Vegetables Based on an Analysis of 2- and 3-Dimensional Unsteady-state Heat Transfer." *Food Sci. Technol. Res.* 26(6):717–723. — [https://doi.org/10.3136/fstr.26.717](https://doi.org/10.3136/fstr.26.717) — **strong** (open access, method validated against literature values, RMSE 0.35–0.81 °C)

**Critical methodological finding in this paper, directly relevant to you:** α was estimated on cylinders of 20 mm × 100 mm, 20 mm × 20 mm, and disks of 40 mm × 10 mm, and 2-D vs 3-D analysis:

> "The thermal diffusivity could be estimated **regardless of size, shape, and 2 and 3 dimensions** for carrot within the setting range of this experiment." ... "A multiple comparison test using a one-way analysis of variance (significance level of 5 %) showed no [significant differences]"

i.e. **α is a material property, not a size-dependent one** — which is why τ scales purely as L². [MEASURED]

### 3.1.3 Cabbage — specific heat capacity

**NO direct measurement of cabbage c_p found in an accessible primary source.** I used **c_p ≈ 3900 J kg⁻¹ K⁻¹** as a design value. Basis and honesty flag:

- Cabbage is ~92 % water; the water-dominated value for fresh vegetables sits near 3.8–4.0 kJ kg⁻¹ K⁻¹. I could **not** verify a specific tabulated cabbage entry against ASHRAE or a USDA table within this session (the ASHRAE chapter is paywalled; the freely-indexed copies were inaccessible).
- **Cross-check (my arithmetic):** α = k/(ρ·c_p). With k = 0.43–0.47 W m⁻¹ K⁻¹ (measured, §3.1.1), ρ ≈ 1000 kg m⁻³, c_p = 3900 J kg⁻¹ K⁻¹ → **α = 1.10–1.21 × 10⁻⁷ m²/s**. This lands inside the *independently measured* vegetable α range of 1.1–1.5 × 10⁻⁷ m²/s (Muramatsu et al. 2020). The consistency of two independent routes is the reason I am willing to use α = 1.15 × 10⁻⁷ m²/s downstream. **Confidence: moderate.**
- Water/brine values used for comparison are standard: k = 0.60 W m⁻¹ K⁻¹, ρ = 1010 kg m⁻³ (2 % NaCl), c_p = 4000 J kg⁻¹ K⁻¹ → **α_brine = 1.49 × 10⁻⁷ m²/s** [CALC — mine].

### 3.1.4 SILAGE analogue — thermal properties [ANALOGUE, MEASURED]

This is the best-quality analogue data I found, and it is from **USDA-ARS**:

> "For the water content at 80 % of water holding capacity ... **Silage showed medium values** at the same water content (**K: 0.09–0.47 W m⁻¹ °C⁻¹** and **C: 0.93–3.09 MJ m⁻³ °C⁻¹**)."
> — Ahn, H. K., Sauer, T. J., Richard, T. L., & Glanville, T. D. (2009). "Determination of thermal properties of composting bulking materials." *Bioresour. Technol.* 100(17):3974–3981. USDA-ARS, Beltsville. — [https://doi.org/10.1016/j.biortech.2008.11.056](https://doi.org/10.1016/j.biortech.2008.11.056) · PubMed [19362828](https://pubmed.ncbi.nlm.nih.gov/19362828/) — **strong** (USDA-ARS, 12 materials, systematic variation of density/particle size/moisture; r = 0.84–0.99 regressions)

**Derived thermal diffusivity of silage [CALC — mine]:** α = k/C → **2.9 × 10⁻⁸ to 5.1 × 10⁻⁷ m²/s**. The spread is nearly 20×, driven by the density/moisture range. **This enormous spread is the single biggest uncertainty in any silage-analogue thermal calculation** and I flag it as such.

### 3.1.5 COMPOST analogue — thermal properties and the thermal-inertia statement [ANALOGUE]

> "A macroscopic non-steady state energy balance was developed and solved for a composting pile of source-selected organic fraction of municipal solid waste during the maturation stage (**13 500 kg** of compost). Simulated temperature profiles correlated well with temperature experimental data (ranging from **50 to 70 ºC**) obtained during the maturation process for **more than 50 days** at full scale. **Thermal inertia effect** usually found in composting plants and associated to the **stockpiling of large composting masses** could be predicted by means of this simplified energy balance... **Heat losses in a large composting mass are low**..."
> — Barrena, R., Cánovas, C., & Sánchez, A. (2006). "Prediction of temperature and thermal inertia effect in the maturation stage and stockpiling of a large composting mass." *Waste Management* 26(9):953–959. — [https://doi.org/10.1016/j.wasman.2005.07.023](https://doi.org/10.1016/j.wasman.2005.07.023) · open pre-print [https://ddd.uab.cat/pub/artpub/2006/163580/wasman_a2006v26n9p953.pdf](https://ddd.uab.cat/pub/artpub/2006/163580/wasman_a2006v26n9p953.pdf) — **moderate** (single full-scale pile, model validated against one site)

Pile geometry and conditions [MEASURED]: **trapezoidal, base 2 m, height 1.5 m, length 10 m**, ~13 500 kg, no forced aeration or turning, **ambient 15 °C**, bulk density **600 → 620 kg m⁻³** wet, moisture 40 %, organic matter 46 % dry.

Thermal properties used (Table 2 of that paper, sourced from Haug 1993) [MODELLED inputs]:
- **c_p compost (40 % moisture) = 2.01 kJ kg⁻¹ K⁻¹**
- **k (40 % moisture) = 1.436 kJ m⁻¹ h⁻¹ m⁻² K⁻¹ = 0.399 W m⁻¹ K⁻¹** [unit conversion mine]
- Metabolic heat generation fitted as **Q_gen = 9193.7·exp(−6.87·t)** kJ h⁻¹ (t in hours), R² = 0.997.
- Core-to-surface distance **assumed = 1 m** (an explicit model assumption).

**Derived α_compost = k/(ρ·c_p) = 0.399/(600 × 2010) = 3.31 × 10⁻⁷ m²/s** [CALC — mine].

**Key qualitative finding transferable to your question:** the compost authors conclude that the reason a large mass holds temperature is that **the surface-area-to-volume ratio falls**, so conductive/convective/radiative loss terms become small relative to heat generation, and the core stays thermophilic "for a long time." That is exactly the mechanism you asked about, established in a peer-reviewed analogue.

### 3.1.6 SILAGE field evidence of internal thermal gradients [ANALOGUE, MEASURED]

> "the silage temperature of the core samples taken **200 mm behind the silage face** ranged from **12.0 to 22.9 °C**" (survey of 54 dairy farms, northern Italy; temperatures measured at 11 locations and 7 elevations)
> "The core samples always showed ... a dT(ref40) below **2 °C**, whereas ... one [group of peripheral areas] had ... a dT(ref40) lower than **3.5 °C** (53 %) and one [group] had ... a dT(ref40) higher than **5 °C** (47 %)."
> — Borreani, G., & Tabacco, E. (2010). "The relationship of silage temperature with the microbiological status of the face of corn silage bunkers." *J. Dairy Sci.* 93(6):2620–2629. — [https://doi.org/10.3168/jds.2009-2919](https://doi.org/10.3168/jds.2009-2919) · PubMed [20494171](https://pubmed.ncbi.nlm.nih.gov/20494171/) — **strong** (54-farm survey; dT(ref40) = temperature rise above the silo's own central reference temperature)

**Read this carefully:** a large silage mass develops a persistent **core vs periphery temperature difference of >5 °C** across roughly the outer metre. This is direct field evidence that a large mass is not isothermal and that its interior is decoupled from ambient.

## 3.2 The calculation you asked for: τ = L²/α, 1 L jar vs 20 L crock

**[CALC — mine]. All inputs shown. Geometry from §4.1: cylinder with H = 1.5·D (H = 3r).**

### Inputs
| Input | Value | Source |
|---|---|---|
| α (adopted, cabbage/brine pack) | 1.15 × 10⁻⁷ m²/s | §3.1.2–3.1.3 |
| r, 1 L vessel | 4.73 cm = 0.0473 m | §4.1 |
| r, 20 L vessel | 12.85 cm = 0.1285 m | §4.1 |
| Density of packed cabbage | ~1000 kg m⁻³ | assumption |
| c_p | 3900 J kg⁻¹ K⁻¹ | §3.1.3 |

### (a) Crude scaling τ = L²/α (L = radius)

| Vessel | R (cm) | τ = R²/α | τ (h) |
|---|---|---|---|
| 1 L jar | 4.73 | 0.0473² / 1.15e−7 = 19 452 s | **5.40 h** |
| 5 L | 8.10 | — | **15.83 h** |
| 20 L crock | 12.85 | 0.1285² / 1.15e−7 = 143 583 s | **39.89 h** |
| 100 L | 21.97 | — | **116.63 h** |

### (b) Physically correct first-mode time constant for a cylinder

For a finite cylinder with a large Biot number (i.e. surface follows ambient), the slowest-decaying (first) mode has

**τ = R² / (λ₁² α)**, with λ₁ = 2.4048 (first root of J₀)

| Vessel | R (cm) | τ (h) | t₉₅ ≈ 3τ |
|---|---|---|---|
| **1 L jar** | 4.73 | **0.94 h** | 2.8 h |
| 2 L | 5.96 | 1.49 h | 4.5 h |
| 5 L | 8.10 | 2.74 h | 8.2 h |
| 10 L | 10.20 | 4.35 h | 13.0 h |
| **20 L crock** | 12.85 | **6.90 h** | 20.7 h (0.86 d) |
| 50 L | 17.44 | 12.70 h | 38.1 h (1.6 d) |
| 100 L | 21.97 | 20.17 h | 60.5 h (2.5 d) |

**τ ratio, 20 L : 1 L = 7.37×** — exactly 20^(2/3), i.e. **thermal time constant scales as V^(2/3)**, identical to the A/V scaling.

### (c) What that means for a given ambient swing

Step response: (T_core − T_ambient) = (T₀ − T_ambient)·exp(−t/τ)

| | 1 L (τ = 0.94 h) | 20 L (τ = 6.90 h) |
|---|---|---|
| gap remaining after **1 h** | 34.5 % | 86.5 % |
| after **2 h** | 11.9 % | 74.8 % |
| after **6 h** | 0.2 % | 41.9 % |
| after **12 h** | ~0 % | 17.6 % |
| after **24 h** | ~0 % | 3.1 % |
| t₅₀ | 0.65 h | **4.78 h** |
| t₉₀ | 2.16 h | **15.89 h** |
| t₉₅ | 2.82 h | **20.70 h** |

**Plain reading:** if the kitchen drops 5 °C overnight, the 1 L jar core has essentially fully equilibrated within ~3 h, whereas the 20 L crock core is still ~40 % of the way from its old temperature after 6 h and needs ~16 h to close 90 % of the gap. **The 20 L crock lags the 1 L jar by roughly 4–5 hours in a 12-hour cycle, and its interior never fully tracks a diurnal swing.**

### (d) Sensible heat content — the "thermal flywheel"

| Vessel | C = m·c_p | Energy for a 1 K shift |
|---|---|---|
| 1 L (~1 kg) | 3.9 kJ/K | 3.9 kJ |
| 5 L | 19.5 kJ/K | 19.5 kJ |
| 20 L (~20 kg) | **78.0 kJ/K** | **78.0 kJ** |
| 100 L | 390 kJ/K | 390 kJ |

**20× the thermal buffer per K**, on top of the 7.4× longer time constant. Both effects push the same way.

### (e) Diurnal penetration depth — the cleanest single number

**δ = √(2α/ω)**

| Period | δ in cabbage tissue | δ in brine |
|---|---|---|
| 12 h | 3.98 cm | 4.52 cm |
| **24 h** | **5.62 cm** | **6.39 cm** |
| 7 d | 14.88 cm | 16.91 cm |

Then, using the semi-infinite approximation exp(−R/δ) for centre amplitude [CALC — mine; **this approximation is only indicative** — it over-damps for R ≲ δ, and a full Bessel-function solution should be used for the 1 L case]:

| Vessel | R (cm) | R/δ (24 h) | Centre amplitude, % of ambient diurnal swing | Phase lag |
|---|---|---|---|---|
| 1 L | 4.73 | 0.84 | ~43 % | ~3.2 h |
| 5 L | 8.10 | 1.44 | ~24 % | ~5.5 h |
| 20 L | 12.85 | 2.29 | **~10 %** | **~8.7 h** |
| 100 L | 21.97 | 3.91 | ~2 % | ~14.9 h |

**This is the headline answer to your question:** a 1 L jar's core sees roughly 40 % of a 24-hour ambient swing; a 20 L crock's core sees roughly 10 %, delayed by ~9 hours. Because fermentation rate is strongly temperature-dependent (§5), and because the daily-mean temperature is what dominates over multi-day fermentations, **the practical consequence is a difference in rate variance, not necessarily in mean rate** — see §5.4.

### (f) The silage/compost analogue, explicitly labelled

Substituting silage α (Ahn et al. 2009) into the same formula widens the answer by ~4× in α (τ inversely proportional):

| α assumed | τ (1 L, R = 4.73 cm) | τ (20 L, R = 12.85 cm) |
|---|---|---|
| Silage, low end: 2.9 × 10⁻⁸ | 3.7 h | 27.4 h |
| **Cabbage tissue: 1.15 × 10⁻⁷** | **0.94 h** | **6.90 h** |
| Compost: 3.31 × 10⁻⁷ | 0.33 h | 2.40 h |
| Silage, high end: 5.05 × 10⁻⁷ | 0.21 h | 1.57 h |

**The qualitative conclusion (7.4× ratio) is robust; the absolute hours are not.** Any real crock also has an insulating wall, a headspace, and evaporative/radiative surface losses, all of which *increase* the effective time constant relative to this idealised calculation. There is **no measured τ for any vegetable fermentation vessel** in the literature I could find.

---

# 4. TOPIC B.1 — SURFACE-TO-VOLUME GEOMETRY

## 4.1 Exact geometry and concrete values [CALC — mine]

### Formulae

**Sphere:** A = 4πr², V = (4/3)πr³ ⟹ **A/V = 3/r** ∝ V^(−1/3)

**Closed cylinder, height H, radius r:** A = 2πr² + 2πrH, V = πr²H ⟹
**A/V = 2/r + 2/H**

**Cylinder with H = k·D = 2kr** (your "crock shape", k = 1.5 used below):
A/V = 2/r + 1/(k·r) = **(2 + 1/k)/r = 2.667/r** for k = 1.5

**Open cylinder — liquid surface only** (the oxygen-relevant area): A_top = πr², V = πr²H ⟹ **A_top/V = 1/H**

**General law:** A/V ∝ 1/L for any self-similar family. For a fixed shape, **A/V = c·V^(−1/3)**, and the scale factor between two sizes is (V₂/V₁)^(−1/3). For 1 L → 20 L that factor is **20^(−1/3) = 0.368**.

### Concrete values — cylinder, H = 1.5·D (= 3r)

| V (L) | V (cm³) | r (cm) | D (cm) | H (cm) | A_wall (cm²) | A_total (cm²) | **A/V total (cm⁻¹)** | A/V total (m⁻¹) | A_top/V (m⁻¹) |
|---|---|---|---|---|---|---|---|---|---|
| **1** | 1000 | 4.73 | 9.47 | 14.20 | 422.5 | 563.3 | **0.5633** | 56.33 | 7.041 |
| 2 | 2000 | 5.96 | 11.93 | 17.89 | 670.6 | 894.2 | 0.4471 | 44.71 | 5.588 |
| **5** | 5000 | 8.10 | 16.19 | 24.29 | 1 235.3 | 1 647.0 | **0.3294** | 32.94 | 4.118 |
| 10 | 10 000 | 10.20 | 20.40 | 30.60 | 1 960.9 | 2 614.5 | 0.2615 | 26.15 | 3.268 |
| **20** | 20 000 | 12.85 | 25.70 | 38.55 | 3 112.7 | 4 150.3 | **0.2075** | 20.75 | 2.594 |
| 50 | 50 000 | 17.44 | 34.88 | 52.32 | 5 733.7 | 7 644.9 | 0.1529 | 15.29 | 1.911 |
| **100** | 100 000 | 21.97 | 43.95 | 65.92 | 9 101.7 | 12 135.5 | **0.1214** | 12.14 | 1.517 |
| 1000 | 1 000 000 | 47.34 | 94.68 | 142.02 | 42 246.1 | 56 328.2 | 0.0563 | 5.63 | 0.704 |

Verification of the scaling law: predicted A/V ratio 20 L/1 L = 20^(−1/3) = **0.368**; computed 0.2075/0.5633 = **0.368**. ✓

### Sphere, for comparison

| V (L) | r (cm) | A (cm²) | A/V (cm⁻¹) | A/V (m⁻¹) |
|---|---|---|---|---|
| 1 | 6.20 | 483.6 | 0.4836 | 48.36 |
| 5 | 10.61 | 1 414.0 | 0.2828 | 28.28 |
| 20 | 16.84 | 3 563.2 | 0.1782 | 17.82 |
| 100 | 28.79 | 10 418.8 | 0.1042 | 10.42 |

A sphere always beats a cylinder of equal volume (3/r vs 2.667/r for H = 1.5 D) — i.e. **a squat crock has less wall area per litre than a tall one**, but a *taller* cylinder has *more*. Note this matters only for wall-transmitting vessels (onggi, plastic); for a sealed glass jar the wall is irrelevant and only A_top/V = 1/H counts.

### Crock with a fixed headspace neck

If a vessel has a neck of radius r_n and the body radius is r_b, the liquid surface that the headspace "sees" is min(πr_n², πr_b²) — i.e. **a narrow neck decouples the headspace gas from the brine surface**, which is a geometry effect independent of volume. I found **no quantitative study of neck geometry in vegetable fermentation**; treat this as an untested design intuition, not a data-backed result.

## 4.2 From A/V to oxygen ingress flux

### The transport coefficients (with citations)

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| D(O₂) in water, 20 °C | **1.97 × 10⁻⁹ m²/s** (1.97 × 10⁻⁵ cm²/s) [MODELLED — Wilke–Chang correlation, ±10 % claimed] | Richard, T., "Calculating the Oxygen Diffusion Coefficient in Water," Cornell Composting — [https://compost.css.cornell.edu/oxygen/oxygen.diff.water.html](https://compost.css.cornell.edu/oxygen/oxygen.diff.water.html) | moderate |
| D(O₂) in water — indicated T-dependence | 20 °C: 1.97e−9; 40 °C: 3.24e−9; 50 °C: 3.99e−9; 60 °C: 4.82e−9 m²/s | same | moderate |
| D(O₂) in air, O₂–N₂ pair, 20 °C | **2.19 × 10⁻⁵ m²/s** (0.219 cm²/s) [MODELLED — kinetic theory] | Richard, T., "Calculating the Oxygen Diffusion Coefficient in Air," Cornell Composting — [https://compost.css.cornell.edu/oxygen/oxygen.diff.air.html](https://compost.css.cornell.edu/oxygen/oxygen.diff.air.html) | moderate |
| D(O₂) in air — other pairs, 20 °C | O₂–CO₂: 1.53e−5; O₂–H₂O vapour: 2.40e−5 m²/s | same | moderate |
| D(O₂) in air mixture, 20 °C, 2–15 % O₂ | **2.03–2.14 × 10⁻⁵ m²/s** (50–100 % RH) | same | moderate |
| Solubility of O₂ in water, 25 °C, air | **8.26 mg/L**; 20 °C: **9.09 mg/L** | Standard DO saturation table, reproduced in Chapra, *Numerical Methods for Engineers* 7th ed., Problem 20.21 — [https://www.bartleby.com/solution-answer/chapter-20-problem-21p-numerical-methods-for-engineers-7th-edition/9781260514131/](https://www.bartleby.com/solution-answer/chapter-20-problem-21p-numerical-methods-for-engineers-7th-edition/9781260514131/the-saturation-concentration-of-dissolved-oxygen-in-water-as-a-function-of-temperature-and-chloride/59d4f296-0363-11e9-9bb5-0ece094302b6) | moderate |
| **Salinity effect (this is your brine number)** | at 25 °C: 0 g/L Cl⁻ → **8.26 mg/L**; 10 g/L → **7.46**; 20 g/L → **6.73 mg/L**. At 20 °C: 9.09 / 8.17 / 7.35 mg/L | same table | moderate |
| Authoritative computation route | USGS **DOTABLES** v3.6 computes DO solubility from **Benson & Krause (1980, 1984)**; valid 0–40 °C, salinity 0–40 ‰, 51–112 kPa | USGS — [https://water.usgs.gov/water-resources/software/DOTABLES/](https://water.usgs.gov/water-resources/software/DOTABLES/) | strong (for the tool/equations) |
| **Henry's law constant, O₂ in pure water, 298.15 K** | **log K_H,cp = −2.904** (this work; mean of 11 database values = −2.92; NEA/THEREDA/PSI all −2.89 to −2.90) ⟹ K_H,cp = **1.25 × 10⁻³ mol kg⁻¹ bar⁻¹** [MEASURED, fitted to IUPAC-reviewed experimental data] | Bok, F., Moog, H. C., & Brendler, V. (2023). "The solubility of oxygen in water and saline solutions." *Front. Nucl. Eng.* 2:1158109 — [https://doi.org/10.3389/fnuen.2023.1158109](https://doi.org/10.3389/fnuen.2023.1158109) | strong |
| Henry T-dependence parameters | A₁ = −71.95 ± 0.35; A₃ = 3 625 ± 34; A₄ = 9.984 ± 0.056 | same, Table 2 | strong |
| Salting-out model | Full Pitzer ion-interaction coefficients given for NaCl up to **6.5 mol/kg H₂O**, 273–318 K, p(O₂) ≤ 101.325 kPa | same, Table 10 | strong |

**Cross-check (my arithmetic):** 1.25 × 10⁻³ mol kg⁻¹ bar⁻¹ × 0.2095 bar (pO₂ in air) = 2.62 × 10⁻⁴ mol/kg = **8.4 mg/L** at 25 °C. This agrees with the tabulated 8.26 mg/L to within 2 %, so the two independent sources corroborate each other. Similarly, a 2–3 % NaCl brine (~20–30 g/L Cl⁻) reduces O₂ solubility by roughly **10–20 %** vs pure water — small, so brine's *solubility* effect on O₂ is minor; its effect is on **diffusivity and convection**, not capacity.

### Oxygen ingress through a stagnant brine layer [CALC — mine]

**Formula:** steady 1-D Fickian flux J = D·ΔC/L, with ΔC = C_sat − 0 = 8.26 g m⁻³ (25 °C, air-saturated surface, zero at the consumption front).

| Stagnant brine depth L | J (mg O₂ m⁻² day⁻¹) |
|---|---|
| 1 mm | 1 405.9 |
| 5 mm | 281.2 |
| 10 mm | 140.6 |
| **50 mm** | **28.1** |

Diffusion *time* t ~ L²/D through the same layers:

| L | t |
|---|---|
| 0.1 mm | 5 s |
| 1 mm | 508 s (8.5 min) |
| 5 mm | 3.53 h |
| 10 mm | 14.1 h |
| **50 mm** | **14.7 days** |
| 100 mm | 58.8 days |

**This is the mechanism behind "keep the cabbage submerged."** A 5 cm stagnant brine column slows O₂ supply by ~50× vs a 1 mm film, and the characteristic diffusion time through 5 cm of brine is **two weeks** — longer than many fermentations.

### Scaling of O₂ supply per litre [CALC — mine]

Using J = 28.1 mg m⁻² day⁻¹ (5 cm stagnant brine) applied to the **top surface only**:

| Vessel | A_top (cm²) | A_top/V (m⁻¹) | O₂ ingress (mg/day) | **O₂ ingress per litre (mg L⁻¹ day⁻¹)** |
|---|---|---|---|---|
| **1 L** | 70.4 | 7.04 | 0.198 | **0.198** |
| 5 L | 205.9 | 4.12 | 0.579 | 0.116 |
| **20 L** | 518.8 | 2.59 | 1.459 | **0.073** |
| 100 L | 1 516.9 | 1.52 | 4.265 | **0.043** |

**The result in one line: oxygen ingress per litre per day scales as V^(−1/3). The 1 L jar receives ~2.7× more O₂ per litre than the 20 L crock, and ~4.6× more than the 100 L vessel.** This is the correct quantitative statement of "small vessels are more oxidative." Note the *absolute* numbers are small — a few tenths of a mg per litre per day — so this mechanism matters for **surface mould/yeast and for redox state**, more than for bulk LAB growth.

### Vessel-closure oxygen ingress (the sealed-vessel case)

For a sealed vessel, wall diffusion is negligible and the closure dominates. Measured data from the wine-bottle literature (an excellent controlled analogue: sealed liquid-filled vessel, long timescale):

| Metric | Value |
|---|---|
| OTR, microagglomerated cork stoppers, 6–42 mm long | **0.01–1.15 mg O₂ year⁻¹** (per closure) |
| Apparent D(O₂) through cork | **3.37 × 10⁻¹¹ ± 0.14 × 10⁻¹¹ m²/s**; range across lengths 0.04–1.14 × 10⁻¹¹ |
| Glass–cork interface share of total O₂ transfer at 20 °C | **~75 %** |

> — Chanut, J., Lagorce, A., Simon, J.-M., Bezverkhyy, I., Bellat, J.-P., Gougeon, R. D., & Karbowiak, T. (2026). "Deciphering the mechanisms of oxygen transfer into a wine bottle." *Science Advances.* [https://pmc.ncbi.nlm.nih.gov/articles/PMC13281788/](https://pmc.ncbi.nlm.nih.gov/articles/PMC13281788/) — **strong** (quantitative, replicated, 18-month study)

**Scale check [CALC — mine]:** 1 mg O₂ per year ≈ 0.0027 mg/day. So a well-sealed vessel closure admits ~**70× less** O₂ per day than a 1 L open-top jar with a 5 cm brine column (0.198 mg/day). **For a sealed vessel, the headspace is the oxygen reservoir and the closure is nearly irrelevant.**

### CO₂ blanket / headspace displacement time [CALC — mine — explicitly a rough estimate]

**Assumptions (stated because they matter):** (1) CO₂ generation at 3.48 mmol h⁻¹ kg⁻¹ from the onggi study; (2) all generated CO₂ accumulates in the headspace; (3) CO₂ quantitatively displaces headspace O₂ (ignores CO₂ dissolution in brine, which real systems do substantially); (4) headspace O₂ initially at 20.95 %.

| Batch | Headspace | O₂ in headspace | CO₂ rate | Time to displace all headspace O₂ |
|---|---|---|---|---|
| 1 kg cabbage | 0.3 L | 2.80 mmol | 3.48 mmol/h | **0.81 h** |
| 10 kg cabbage | 2.0 L | 18.69 mmol | 34.80 mmol/h | **0.54 h** |
| 20 kg cabbage | 5.0 L | 46.73 mmol | 69.60 mmol/h | **0.67 h** |

**Because both O₂ inventory and CO₂ production scale with batch size, the headspace displacement time is roughly size-independent when headspace is a fixed *fraction* of volume** — provided the headspace fraction is constant. It changes only if the headspace *fraction* changes. **This is my analysis and no measurement supports it; assumptions (2) and (3) are both substantially wrong in detail** (much CO₂ dissolves; brine outgasses slowly). Use only as an order-of-magnitude statement.

---

# 5. TOPIC A.3 — TEMPERATURE EFFECT ON FERMENTATION RATE

## 5.1 Kimchi — measured pH/acidity trajectories (Korea, World Institute of Kimchi)

Fermentation of factory-made kimchi in plastic bags, sampled weekly for 4 weeks:

| Temperature | Week 1 | Week 2 | Week 4 |
|---|---|---|---|
| **4 °C** (Kimchi A) | pH **5.09**, acidity **0.75 %** | pH **4.54**, acidity **1.07 %** | pH **4.37**, acidity **1.51 %** |
| **10 °C** (Kimchi B) | pH **4.21**, acidity **1.69 %** | pH **4.02**, acidity **1.83 %** | pH 4.02, acidity slightly decreased |
| **15 °C** (Kimchi C) | — | — | — (fastest) |

> — Jung, S., Hwang, I. M., & Lee, J.-H. (2024). "Temperature impact on microbial and metabolic profiles in kimchi fermentation." *Heliyon* 10(6):e27174. World Institute of Kimchi, Gwangju. — [https://doi.org/10.1016/j.heliyon.2024.e27174](https://doi.org/10.1016/j.heliyon.2024.e27174) · [PMC10926072](https://pmc.ncbi.nlm.nih.gov/articles/PMC10926072/) — *moderate* (single batch, weekly sampling, microbial + metabolite data; **flag:** the paper's text contains one internally inconsistent sentence assigning "acidity 0.32 % and pH 5.81" to week 1 for all three — those are almost certainly the week-0 values. The A/B/C series above is internally consistent and is what I report.)

**Derived [CALC — mine]:** at week 1, the 10 °C batch had acidified to 1.69 % vs 0.75 % at 4 °C — a **~2.3× higher acid accumulation over a 6 K difference**, and the pH gap (5.09 vs 4.21) at week 1 is large. This is a direct measured confirmation that **a 6 K shift roughly doubles early acidification rate at refrigeration-adjacent temperatures**, consistent with §5.3.

## 5.2 Sauerkraut — measured practice data (university extension)

> "At temperatures between **70 °F and 75 °F**, sauerkraut will be fully fermented in **three to four weeks**; at **60 °F**, fermentation may take **five to six weeks**. At temperatures lower than 60 °F, kraut may not ferment; above 75 °F, kraut may become soft."
> — Oregon State University Extension, *Pickling Vegetables*, PNW 355 — [https://extension.oregonstate.edu/catalog/pub/pnw355](https://extension.oregonstate.edu/catalog/pub/pnw355) — *moderate* (authoritative extension publication; laboratory-tested recipes, but the time/temperature figures are practice guidance, not a controlled kinetic study)

> "Ideal fermentation temperature is between **70 °F–75 °F (21 °C–24 °C)**."
> — Penn State Extension, *Tips for Making Sauerkraut* — [https://extension.psu.edu/tips-for-making-sauerkraut](https://extension.psu.edu/tips-for-making-sauerkraut) — *moderate*

> (Brined pickles) "Store for about **three to four weeks** in a location where temperature is **70 °F to 75 °F**. Temperatures of **55 °F to 65 °F** are acceptable, but the fermentation will take **five to six weeks**. Pickles will become too soft if temperatures are above **80 °F**."
> — Oregon State University Extension, PNW 355, same URL — *moderate*

**Derived [CALC — mine]:** 3.5 weeks at 22.5 °C vs 5.5 weeks at 15.6 °C ⇒ a **~1.6× slowdown for a ~7 K drop**, i.e. an empirical **Q₁₀(10 K) ≈ 2.2**. This is *practice* data with undefined endpoints, so treat as weak-or-contested, but it agrees well with the independent predictive-microbiology calculation below.

**Accessible peer-reviewed sauerkraut temperature papers that I could NOT obtain:**
- "Effect of Temperature on Fermentation and Quality of Sauerkraut," *Mysore Journal of Agricultural Science* 36:218–221 — record at [ResearchGate](https://www.researchgate.net/publication/319547291_Effect_of_Temperature_on_Fermentation_and_Quality_of_Sauerkraut) (blocked, HTTP 403). **I did not read it and quote no numbers from it.**
- "The relation between temperature and the rate of fermentation of commercial sauerkraut" — HathiTrust record [101763894](https://preview.catalog.hathitrust.org/Record/101763894); catalogued, full text not retrievable. **No numbers quoted.**
- "An investigation of commercial sauerkraut production," *Food Research* 6(3), 1941 — [doi:10.1111/j.1365-2621.1941.tb16286.x](https://doi.org/10.1111/j.1365-2621.1941.tb16286.x), paywalled. **No numbers quoted.**

**This is a real gap in the literature-as-accessible, and I am flagging it rather than substituting invented numbers.** The classic USDA-ARS Raleigh temperature work (Fleming, McFeeters, Pederson) is largely in scanned-image ARS "Pickle Pubs" PDFs; I retrieved and visually read Fleming (1987) *Considerations for the controlled fermentation and storage of sauerkraut* ([https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf)), which is a **technology/quality** paper — its vessel-geometry content is:

> "The fermentors depicted in Figure 1 were useful in visual observation of some of the physical changes... **sauerkraut bed was restricted, which allowed the liquid generated by osmotic release from the cabbage to rise above the bed.** A measuring ruler attached to the side of the [fermenter]..."
> — Fleming, H. P. (1987), p. 27 — same URL — *moderate* (conference proceedings, USDA-ARS/NC State)

...and its chemistry content is qualitative. It contains **no temperature-rate table**. It does state the industry context quantitatively: US per-capita sauerkraut consumption fell from **2.3 lb (1930) to 1.0 lb (1982)**. [MEASURED]

## 5.3 Arrhenius activation energies — measured/model-fitted

### Sauerkraut (Sichuan *paocai*), 25/35/45 °C accelerated storage

| Quality index | Eₐ (kJ/mol) | R² | Model |
|---|---|---|---|
| **Total acid** | **47.23** | 0.9567 | zero-order + Arrhenius |
| Radish L* (colour) | 65.18 | 0.9943 | " |
| Green-vegetable L* | 72.09 | 0.9995 | " |
| Radish hardness | 45.76 | 0.9075 | " |
| Green-vegetable hardness | 58.10 | 0.9779 | " |
| Sensory score | 70.07 | 0.9955 | " |

> "The activation energy (Eₐ) ranges from **47.23 to 72.09 kJ/mol**, and the k_ref varied from 1.076 × 10⁶ – 9.220 × 10¹⁰ d⁻¹... **the total acid is the least sensitive to temperature**."
> — Du, J., Zhang, M., Zhang, L., Law, C. L., & Liu, K. (2022). "Shelf-Life Prediction and Critical Value of Quality Index of Sichuan Sauerkraut Based on Kinetic Model and Principal Component Analysis." *Foods* 11(12):1762. — [https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/](https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/) — *moderate* (3 temperatures, single product, accelerated design; **important caveat: this is post-fermentation storage chemistry, not the fermentation itself** — but total-acid change is the closest proxy published with a numeric Eₐ)

**Derived [CALC — mine] from Eₐ = 47.23 kJ/mol:**
- Q₁₀ over 5 K: **1.37–1.40** (range 15–25 °C)
- Q₁₀ over 10 K: **1.86–1.94**
- rate(25 °C)/rate(18 °C) = **1.58×**
- rate(20 °C)/rate(15 °C) = **1.40×**

## 5.4 Predictive microbiology — Ratkowsky parameters for *Lactobacillus plantarum*

**The published parameter set I could verify:**

| Parameter | Value | Organism / medium |
|---|---|---|
| b | **0.0385** | *Lactobacillus plantarum*, MRS agar |
| c | **0.247** | " |
| T_min | **3.29 °C** | " |
| T_max | **44.8 °C** | " |

> Model: √μ = b·(T − T_min)·[1 − exp(c·(T − T_max))]
> Attributed to **Zwietering, M. H., de Wit, J. C., Cuppers, H. G. A. M., & van 't Riet, K. (1994). "Evaluation of data transformations and validation of a model for the effect of temperature on bacterial growth." *Appl. Environ. Microbiol.* 60(1):195–203** — [doi:10.1128/aem.60.1.195-203.1994](https://doi.org/10.1128/aem.60.1.195-203.1994) · [PMC201289](https://pmc.ncbi.nlm.nih.gov/articles/PMC201289/) — and tabulated in the open-access DTU PhD thesis of Nina Bjerre Østergaard, Table 11: [https://backend.orbit.dtu.dk/ws/files/103646179/Nina_Bjerre_stergaard_Ph.d._afhandling..PDF](https://backend.orbit.dtu.dk/ws/files/103646179/Nina_Bjerre_stergaard_Ph.d._afhandling..PDF)
> — *Confidence: moderate.* I verified the parameter values verbatim in the DTU thesis table and verified the Zwietering 1994 citation in that thesis's reference list (the AEM paper's own full text is a scanned image on PMC and I could not read the table directly). **The parameters are for MRS agar, not for cabbage/brine — transfer to a vegetable fermentation is an assumption, not a measurement.**

**Derived [CALC — mine] from these parameters:**

| T (°C) | μ (h⁻¹) | Doubling time (h) | Relative to 18 °C |
|---|---|---|---|
| 5 | 0.0043 | 160 | 0.014 |
| 10 | 0.0667 | 10.4 | 0.209 |
| 15 | 0.2030 | 3.41 | 0.635 |
| **18** | **0.3199** | **2.17** | **1.00** |
| 20 | 0.4121 | 1.68 | 1.29 |
| 22 | 0.5152 | 1.35 | 1.61 |
| **25** | **0.6882** | **1.01** | **2.15** |
| 30 | 1.0035 | 0.69 | 3.14 |
| 35 | 1.2373 | 0.56 | 3.87 |
| 40 | 0.9633 | 0.72 | 3.01 |

**Ratios and Q₁₀:**
- μ(25 °C)/μ(18 °C) = **2.15×**
- μ(25 °C)/μ(15 °C) = **3.39×**
- μ(18 °C)/μ(10 °C) = **4.79×**
- Q₁₀(10→15 °C) = **3.04**; Q₁₀(15→20) = **2.03**; Q₁₀(20→25) = **1.67**; Q₁₀(25→30) = **1.46**; Q₁₀(30→35) = **1.23**

**Apparent Arrhenius Eₐ implied by this model [CALC — mine]:** 125.7 kJ/mol (10→20 °C), **87.2 kJ/mol (15→25 °C)**, 79.0 kJ/mol (18→25 °C).

⚠️ **Contested point, stated plainly:** the Ratkowsky-implied Eₐ (~87 kJ/mol over 15–25 °C) is roughly **1.8× the measured sauerkraut total-acid Eₐ (47.23 kJ/mol)**. These are not the same quantity — one is *biomass growth rate of one organism in a rich medium*, the other is *net acid accumulation in a real ferment* — but the discrepancy is large enough that you should treat any single Eₐ as ±2× and prefer bracketing. **The measured kimchi data (§5.1, ~2.3× per 6 K) sits between the two, which is reassuring for the Arrhenius value but is itself only one batch.**

**Other LAB Ratkowsky/cardinal parameters found (secondary compilation, confidence weak-or-contested — cite with care):** *L. sanfranciscensis* μ_opt 0.68 h⁻¹, T_min 3.0 ± 0.6 and 4.1 ± 0.5, T_max 41.0, T_opt 32.5, pH_min 3.90–3.94 (Gänzle et al. 1998); *L. sakei* subsp. *carnosum* b = 0.001187, T_min = −8.81 (Devlieghere et al. 2000); *L. curvatus* T_min −3.63, T_max 41, pH_min 4.24 (Wijtzes et al. 2001; Messens et al. 2003); LAB mix b = 0.659 ± 0.002, T_min −3.05 ± 0.66, pH_min 4.24 (Mejlholm & Dalgaard 2007). All as tabulated in the DTU thesis Table 11, same URL.

## 5.5 The interaction: does vessel size change the temperature the ferment actually sees?

Combining §3.2 and §5.4 gives the practical rule [CALC — mine]:

| Scenario | 1 L jar | 20 L crock |
|---|---|---|
| Diurnal centre amplitude | ~43 % of ambient swing | ~10 % of ambient swing |
| Phase lag | ~3 h | ~9 h |
| Rate multiplier if core sits 3 K above ambient daily-mean | ~1.2–1.3× | ~1.05× |

**Bottom line:** thermal mass does **not** change the rate law; it changes **how faithfully the ferment tracks a fluctuating ambient**. In a stable 20 °C room a 1 L jar and a 20 L crock should ferment at essentially the same rate. In a kitchen that swings 8 K day/night, the small jar's rate will oscillate strongly (and it will spend more time at the daily extremes, which is where off-flavours and mould risk live) while the crock will run near the daily mean. **I found no measurement that confirms or refutes this for vegetable fermentation.** It is a physics-based inference, not a citation.

---

# 6. EXPLICIT "NO DATA FOUND" LIST

I searched for each of the following and did **not** find it. These are gaps, not oversights.

| # | Missing quantity | What I searched |
|---|---|---|
| 1 | Measured temperature trajectory (core vs ambient) in any vegetable fermentation vessel as a function of vessel size | kimchi/sauerkraut/cucumber/pickle + vessel size, batch size, thermal mass, temperature lag, "scale" |
| 2 | Any controlled comparison of fermentation **rate** at two vessel sizes with material, headspace fraction and temperature held constant | as above + "surface to volume", "scale-up", "batch size" |
| 3 | Measured thermal time constant (τ) for a crock, jar, or commercial fermentation tank | vessel + time constant, thermal inertia, temperature lag |
| 4 | Specific heat capacity of cabbage from a primary/verifiable table (ASHRAE, USDA) | multiple phrasings; all accessible copies were paywalled or unverifiable. **c_p = 3900 J kg⁻¹ K⁻¹ is my design value, cross-validated only indirectly via α** |
| 5 | Thermal diffusivity of **cabbage** specifically (measured) | closest measured values are other root vegetables (§3.1.2) |
| 6 | Measured CO₂ blanket establishment time in a vegetable fermentation vessel | CO₂ blanket, headspace, purge time, anaerobiosis onset |
| 7 | O₂ ingress flux measured in a vegetable fermentation vessel at any scale | O₂ ingress, dissolved oxygen, OTR, headspace oxygen. **Nearest measured data is from wine bottles**, not fermenting vegetables |
| 8 | Oxygen transmission rate for crocks (ceramic/glazed), HDPE buckets, or glass jars used for vegetable fermentation | packaging OTR, permeability; found only qualitative statements |
| 9 | Microbial community comparison across vessel **sizes** | Liu et al. 2020 compares materials at fixed size and found no community-level difference |
| 10 | A sauerkraut (not kimchi, not Sichuan paocai) temperature-kinetics dataset in an accessible text-layer document | the classic USDA-ARS Raleigh and Cornell/1940s sources are scanned images or paywalled; see §5.2 |
| 11 | Q₁₀ or Eₐ measured specifically for *Leuconostoc mesenteroides* in a vegetable matrix | searches returned only non-vegetable matrices (meat, dairy) |
| 12 | Any study of headspace **neck geometry** (narrow-neck crock) on fermentation | none found |
| 13 | Measured wall thermal conductivity / insulation value of a ceramic crock or HDPE bucket | none found; I used tissue/brine properties and an idealised Biot ≫ 1 boundary |

---

# 7. PRACTICAL SYNTHESIS (only what the data supports)

1. **Size does not change the rate law; it changes the coupling to ambient.** τ scales as V^(2/3) (7.4× from 1 L to 20 L, my calculation). Whether that matters depends entirely on how stable your room is. *No vegetable-specific measurement exists.*
2. **Size does change oxygen supply per litre**, as V^(−1/3): 0.198 vs 0.073 mg O₂ L⁻¹ day⁻¹ for 1 L vs 20 L through a 5 cm brine column (my calculation). Small vessels are more oxidative per unit product.
3. **The biggest vessel effect actually measured is material/permeability, not size:** ±25 % on time-to-pH-3.5 (porcelain vs glass/plastic, 10 L, Liu et al. 2020) and +26 % CO₂ generation (porous onggi vs glass, Kim & Hu 2023). If you are choosing a vessel, **material matters more than volume** on the current evidence.
4. **Temperature dominates everything else.** 25 °C vs 18 °C is ~1.6× (measured sauerkraut Eₐ) to ~2.2× (Ratkowsky/LAB growth) — an order of magnitude more than any vessel-size effect proposed here.
5. **Submersion is the highest-leverage oxygen control**, because O₂ diffusion through 5 cm of brine takes ~15 days (my calculation from Cornell's D value and standard solubility).

---

# 8. FULL REFERENCE LIST

**Peer-reviewed / institutional**

1. Ahn, H. K., Sauer, T. J., Richard, T. L., & Glanville, T. D. (2009). Determination of thermal properties of composting bulking materials. *Bioresource Technology* 100(17):3974–3981. USDA-ARS Beltsville. https://doi.org/10.1016/j.biortech.2008.11.056 · https://pubmed.ncbi.nlm.nih.gov/19362828/ *(includes silage thermal properties)*
2. Barrena, R., Cánovas, C., & Sánchez, A. (2006). Prediction of temperature and thermal inertia effect in the maturation stage and stockpiling of a large composting mass. *Waste Management* 26(9):953–959. https://doi.org/10.1016/j.wasman.2005.07.023 · open PDF: https://ddd.uab.cat/pub/artpub/2006/163580/wasman_a2006v26n9p953.pdf
3. Bok, F., Moog, H. C., & Brendler, V. (2023). The solubility of oxygen in water and saline solutions. *Frontiers in Nuclear Engineering* 2:1158109. https://doi.org/10.3389/fnuen.2023.1158109
4. Borreani, G., & Tabacco, E. (2010). The relationship of silage temperature with the microbiological status of the face of corn silage bunkers. *Journal of Dairy Science* 93(6):2620–2629. https://doi.org/10.3168/jds.2009-2919 · https://pubmed.ncbi.nlm.nih.gov/20494171/
5. Chanut, J., Lagorce, A., Simon, J.-M., Bezverkhyy, I., Bellat, J.-P., Gougeon, R. D., & Karbowiak, T. (2026). Deciphering the mechanisms of oxygen transfer into a wine bottle. *Science Advances*. https://pmc.ncbi.nlm.nih.gov/articles/PMC13281788/
6. Kim, S., & Hu, D. L. (2023). Onggi's permeability to carbon dioxide accelerates kimchi fermentation. *Journal of the Royal Society Interface* 20(201):20230034. https://doi.org/10.1098/rsif.2023.0034 · https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/
7. Fleming, H. P. (1987). Considerations for the controlled fermentation and storage of sauerkraut. Presented at the 80th Annual Convention, National Kraut Packers Association, 23 July 1987, Canandaigua, NY. USDA-ARS / North Carolina Agricultural Research Service. https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf
8. Fleming, H. P., Thompson, R. L., Bell, T. A., & Monroe, R. J. (1977). Effect of brine depth on physical properties of brine-stock cucumbers. *Journal of Food Science* 42(6):1464–1470. https://doi.org/10.1111/j.1365-2621.1977.tb08401.x *(cited but not read — paywalled)*
9. Jung, S., Hwang, I. M., & Lee, J.-H. (2024). Temperature impact on microbial and metabolic profiles in kimchi fermentation. *Heliyon* 10(6):e27174. World Institute of Kimchi. https://doi.org/10.1016/j.heliyon.2024.e27174 · https://pmc.ncbi.nlm.nih.gov/articles/PMC10926072/
10. Kim, J.-B., Lee, D.-S., Choi, D.-W., & Pyun, Y.-R. (1991). Thermal conductivity of petiole tissue of Chinese cabbage. *Korean Journal of Food Science and Technology* 23(3):325–329. https://koreascience.kr/article/JAKO199103041971660.pub
11. Liu, L., She, X., Chen, X., Qian, Y., Tao, Y., Li, Y., Guo, S., Xiang, W., Liu, G., & Rao, Y. (2020). Microbiota succession and chemical composition involved in the radish fermentation process in different containers. *Frontiers in Microbiology* 11:445. https://doi.org/10.3389/fmicb.2020.00445
12. Muramatsu, Y., Hashiguchi, M., Mi, D., Sakaguchi, E., & Kawakami, S. (2020). Sequential estimation of the thermal diffusivity of three vegetables based on an analysis of 2- and 3-dimensional unsteady-state heat transfer. *Food Science and Technology Research* 26(6):717–723. https://doi.org/10.3136/fstr.26.717
13. Zhai, Y., Pérez-Díaz, I. M., & Diaz, J. T. (2018). Viability of commercial cucumber fermentation without nitrogen or air purging. *Trends in Food Science & Technology* 81:185–192. https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p423.pdf
14. Du, J., Zhang, M., Zhang, L., Law, C. L., & Liu, K. (2022). Shelf-life prediction and critical value of quality index of Sichuan sauerkraut based on kinetic model and principal component analysis. *Foods* 11(12):1762. https://doi.org/10.3390/foods11121762 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/
15. Zwietering, M. H., de Wit, J. C., Cuppers, H. G. A. M., & van 't Riet, K. (1994). Evaluation of data transformations and validation of a model for the effect of temperature on bacterial growth. *Applied and Environmental Microbiology* 60(1):195–203. https://doi.org/10.1128/aem.60.1.195-203.1994 · https://pmc.ncbi.nlm.nih.gov/articles/PMC201289/ *(parameter values verified via Østergaard DTU thesis, Table 11)*
16. Østergaard, N. B. (PhD thesis, Technical University of Denmark). *[Predictive microbiology of lactic acid bacteria]* — Table 11, "Overview of existing predictive growth models for LAB." https://backend.orbit.dtu.dk/ws/files/103646179/Nina_Bjerre_stergaard_Ph.d._afhandling..PDF

**Extension services**

17. Oregon State University Extension. *Pickling Vegetables*, PNW 355. https://extension.oregonstate.edu/catalog/pub/pnw355
18. Penn State Extension. *Tips for Making Sauerkraut*. https://extension.psu.edu/tips-for-making-sauerkraut

**Reference data / tools**

19. Richard, T. *Calculating the Oxygen Diffusion Coefficient in Air.* Cornell Composting, Cornell Waste Management Institute. https://compost.css.cornell.edu/oxygen/oxygen.diff.air.html
20. Richard, T. *Calculating the Oxygen Diffusion Coefficient in Water.* Cornell Composting, Cornell Waste Management Institute. https://compost.css.cornell.edu/oxygen/oxygen.diff.water.html
21. U.S. Geological Survey. *DOTABLES — Dissolved oxygen solubility tables*, v3.6 (Benson & Krause 1980, 1984). https://water.usgs.gov/water-resources/software/DOTABLES/
22. Chapra, S. C. *Numerical Methods for Engineers*, 7th ed., Problem 20.21 — DO saturation vs temperature and chloride concentration. https://www.bartleby.com/solution-answer/chapter-20-problem-21p-numerical-methods-for-engineers-7th-edition/9781260514131/

**Documents identified but NOT readable (no numbers quoted from these)**

23. "Effect of Temperature on Fermentation and Quality of Sauerkraut." *Mysore Journal of Agricultural Science* 36:218–221. https://www.researchgate.net/publication/319547291_Effect_of_Temperature_on_Fermentation_and_Quality_of_Sauerkraut *(HTTP 403)*
24. "The relation between temperature and the rate of fermentation of commercial sauerkraut." HathiTrust 101763894. https://preview.catalog.hathitrust.org/Record/101763894
25. "An investigation of commercial sauerkraut production." *Food Research* 6(3), 1941. https://doi.org/10.1111/j.1365-2621.1941.tb16286.x
26. Mheen & Kwon (1984). Effect of temperature and salt concentration on kimchi fermentation. *Korean J. Food Sci. Technol.* 16(4):443. https://www.semanticscholar.org/paper/dcddb6fb275be2ccaec7e0cf5a16cedd6181b466 *(scanned image; no text layer — noted because a file `mheen1984.pdf` in the workspace turned out to be a failed login-page download, not the paper)*
27. "The Effect of Container Types on the Growth of Bacteria during Kimchi Fermentation." KCI ART001778860. https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001778860

**Supporting calculation file:** `calcs.txt` and `calcs_kinetics.txt` in this directory contain the raw, reproducible arithmetic behind every **[CALC — mine]** value in this report.
