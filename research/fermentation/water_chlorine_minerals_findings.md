# Water Chemistry and the Lactic Acid Fermentation of Vegetables
## A literature-evidence review — chlorine/chloramine, minerals, pH, temperature

**Scope:** *sauerkraut, kimchi, cucumber pickles, pepper mash.*
**Question:** what does **real experimental evidence** say about how tap-water chemistry affects the **rate and reliability** of vegetable lactic acid fermentation?

**Method / honesty note.** Citations were verified against the **Crossref API** (author, year, journal, volume, pages) and, where possible, against **PubMed/Europe PMC**, **PMC full text**, or **publisher-independent repositories**. Where a DOI returns HTTP 403 to automated fetching, that is a **bot-block, not a broken citation** — those are marked. Claims are labelled **strong / moderate / weak-or-contested**. Where no experiment exists, this document says **"no experimental evidence found"** rather than repeating folklore. **No citation, page number, or URL in this document is invented.** My own arithmetic (as opposed to a reported measurement) is explicitly labelled **[my calculation]**.

---

# PART A — CHLORINE AND CHLORAMINE

## A-1. THE HEADLINE: chlorine does not measurably inhibit vegetable lactic fermentation

**Finding A-1.1 — Direct experimental test.**
**Claim:** Holding cucumbers in water containing chlorine dioxide — a stronger oxidant than the free chlorine in tap water — had **no effect** on the initiation of the natural lactic acid fermentation after brining.
**Number:** **100 ppm ClO₂** (roughly **100–500× a domestic free-chlorine residual**). Also failed to (a) significantly reduce microbial populations in blended samples, (c) delay visible microbial growth during cucumber storage.
**Source:** Costilow, R.N., Uebersax, M.A. & Ward, P.J. (1984). "Use of Chlorine Dioxide for Controlling Microorganisms During the Handling and Storage of Fresh Cucumbers." *Journal of Food Science* **49**(2):396–401. doi:10.1111/j.1365-2621.1984.tb12431.x
https://doi.org/10.1111/j.1365-2621.1984.tb12431.x *(DOI verified via Crossref; publisher returns 403 to bots)*
**Confidence: STRONG.** This is the single most directly on-point experiment found. It is peer-reviewed *Journal of Food Science*, from the Michigan State/ARS pickle-fermentation milieu, and it tests exactly the claim in question at a concentration 100–500× higher than domestic tap water.

**Finding A-1.2 — Corroborating commercial-scale study.**
**Claim:** Chlorine dioxide sanitises the **process water** effectively, but does **not** reach the microorganisms on or inside the vegetable.
**Numbers:** ClO₂ at **1.3 ppm** optimally controlled bacteria **in the water** (2–6 log-cycle reduction). **0.95 ppm** gave a static population. **2.8 and 5.1 ppm** produced excessive chlorine-dioxide odour. Critically: *"The bacterial populations in/on the cucumbers were not greatly influenced by chlorine dioxide, even at 5.1 ppm. Apparently, microorganisms on or in the fruit were protected from the chlorine dioxide."*
**Source:** Reina, L.D., Fleming, H.P. & Humphries, E.G. (1995). "Microbiological Control of Cucumber Hydrocooling Water with Chlorine Dioxide." *Journal of Food Protection* **58**(5):541–546. doi:10.4315/0362-028X-58.5.541
https://doi.org/10.4315/0362-028X-58.5.541 *(verified, HTTP 200)*
**Confidence: STRONG.** ARS/USDA Food Fermentation Laboratory + NC State.

> **Why this matters for the model:** the sanitizer acts on the *water*, and the vegetable's surface and interior are a protected niche. LAB that will drive the fermentation live on and in the vegetable, so a chlorinated *water* residual is not the relevant exposure route.

## A-2. Chlorine demand: how fast free chlorine is consumed by vegetable matter

**Finding A-2.1 — Free chlorine is consumed essentially immediately by vegetable organic load.**
**Claim & numbers:** In simulated lettuce wash water, *"free chlorine concentration decreased immediately upon the introduction of organic matter, and eventually depleted."* Quantitatively, in the **chlorine replenishment** experiments:
| Organic load (COD, mg/L) | NaClO added (mL/L) | Free Cl **calculated** (mg/L) | Free Cl **measured** (mg/L) |
|---|---|---|---|
| 0 | 0.013 | 1 | 0.91 |
| **532** | 0.507 | **40** | **2.78** |
| **1013** | 1.520 | **120** | **3.58** |
| 1705 | 2.280 | 180 | — |
So at COD ≈ 532 mg/L, **~37 of the 40 mg/L added free chlorine (~93%) was consumed by demand**; at COD ≈ 1013 mg/L, **~116 of 120 mg/L (~97%)** was consumed. Increased organic loading produced *"longer lag periods before the chlorination breakpoint."*
**Source:** Zhou, B., Luo, Y., Nou, X., Millner, P., Wang, Q. et al. (2015). "Inactivation dynamics of *Salmonella enterica*, *Listeria monocytogenes*, and *Escherichia coli* O157:H7 in wash water during simulated chlorine depletion and replenishment processes." *Food Microbiology* **50**:88–96. doi:10.1016/j.fm.2015.03.004 — https://doi.org/10.1016/j.fm.2015.03.004 *(DOI verified via Crossref and resolves HTTP 200)*. **The tables above were read from an open-access copy** previously hosted at `producefoodsafety.org/files/inline-files/zhou-j_food-micro-2015.pdf` (downloaded and text-extracted successfully); **that URL now returns HTTP 404**, so cite the DOI, not the mirror.
**Confidence: STRONG** (measured data; full text read directly).

> **[my calculation]** A domestic residual of **1 mg/L free chlorine in 1 L of water is 1 mg of Cl₂.** The measured demand above is **40–180 mg/L** in vegetable wash water. The demand exceeds the entire domestic dose by **40–180×**, i.e. a 1 mg/L residual is stoichiometrically trivial and is consumed on contact. This is an arithmetic inference from A-2.1, not a separate measurement.

**Finding A-2.2 — Produce-specific free-chlorine rate constants (cut cabbage = sauerkraut substrate).**
**Claim & numbers:** The apparent reaction rate constant **β** of free chlorine with produce constituents (L·mg⁻¹·min⁻¹) was determined at 3 L scale and shown robust across scales (3 L → 3200 L pilot):
- **cut cabbage: β ∈ [0.05, 0.10]**, γ (fraction of COD increase contributing to the reaction) **∈ [0.09, 0.12]**
- cut (disk) carrot: β ∈ [0.05, 0.09], γ ∈ [0.054, 0.078]
- cut iceberg lettuce: β ∈ [0.03, 0.06], γ ∈ [0.07, 0.14]
Also: **turbidity and total dissolved solids were NOT reliable predictors** of free-chlorine decay across produce types.
**Source:** Srinivasan, P., Abnavi, M.D., Kothapalli, C.R. et al. (2020). "Towards enhanced chlorine control: Mathematical modeling for free chlorine kinetics during fresh-cut carrot, cabbage and lettuce washing." *Postharvest Biology and Technology* **161**:111092. doi:10.1016/j.postharvbio.2019.111092 *(DOI verified via Crossref)*
**Confidence: STRONG** for the parameters (from the published abstract, verified verbatim).

**Finding A-2.3 — Independent rate constants and the primacy of COD.**
**Claim & numbers:** Across lettuce types, carrot and **green cabbage**, the apparent free-chlorine reaction rate was **4.74 × 10⁻⁴ to 7.42 × 10⁻⁴ L·mg⁻¹·min⁻¹** at stable pH 6.5–7.0. **Fresh-cut produce exudates, measured as COD, are the primary source of free-chlorine consumption**; a pilot-plant lettuce value of 5.38 × 10⁻⁴ L·mg⁻¹·min⁻¹ corroborated bench scale.
**Source:** Abnavi, M.D., Alradaan, A., Munther, D., Kothapalli, C.R. & Srinivasan, P. (2019). "Modeling of Free Chlorine Consumption and *Escherichia coli* O157:H7 Cross-Contamination During Fresh-Cut Produce Wash Cycles." *Journal of Food Science* **84**(10):2736–2744. doi:10.1111/1750-3841.14774
https://pubmed.ncbi.nlm.nih.gov/31573690/ *(PubMed record verified; publisher returns 403 to bots)*
**Confidence: STRONG.** **Caveat:** this k is ~100× smaller than the β of A-2.2; the two papers parameterise the consumption term differently, so **do not mix the two constants in one equation.** Both agree that consumption is driven by organic load and is fast.

**Finding A-2.4 — Chlorine is also consumed by the brine's own organic and inorganic load.**
**Claim & numbers:** Maintaining a residual of **1 mg/L free chlorine** held water contamination below **2.7, 2.5 and 2.5 log CFU/100 mL** for tap water and artificial process water at **COD 500 and 1000 mg O₂/L** respectively — i.e. the residual had to be *continuously maintained*. *Listeria monocytogenes* was more chlorine-resistant than *Salmonella* spp. and *E. coli* O157. Chlorination by-products: total trihalomethanes reached **124.5 ± 13.4 µg/L** in water at COD 1000 mg O₂/L after 1 h, but **none were found on the lettuce after rinsing**.
**Source:** Van Haute, S., Sampers, I., Holvoet, K. & Uyttendaele, M. (2013). "Physicochemical Quality and Chemical Safety of Chlorine as a Reconditioning Agent and Wash Water Disinfectant for Fresh-Cut Lettuce Washing." *Applied and Environmental Microbiology* **79**(9):2850–2861. doi:10.1128/AEM.03283-12
https://pmc.ncbi.nlm.nih.gov/articles/PMC3623153/ *(DOI verified via Crossref; ASM returns 403 to bots)*
**Confidence: STRONG.**

**Finding A-2.5 — Chlorine demand is a general property of produce wash water; speciation matters.**
Two further peer-reviewed sources confirm the picture but their full texts are paywalled, so only the bibliographic record is verified:
- Weng, S., Luo, Y., Li, J., Zhou, B. & Jacangelo, J.G. (2016). "Assessment and speciation of chlorine demand in fresh-cut produce wash water." *Food Control* **60**:543–551. doi:10.1016/j.foodcont.2015.08.031
- Chen, X. & Hung, Y.-C. (2016). "Predicting chlorine demand of fresh and fresh-cut produce based on produce wash water properties." *Postharvest Biology and Technology* **120**:10–15. doi:10.1016/j.postharvbio.2016.05.007
- Chen, X. & Hung, Y.-C. (2017). "Effects of organic load, sanitizer pH and initial chlorine concentration of chlorine-based sanitizers on chlorine demand of fresh produce wash waters." *Food Control* **77**:96–101. doi:10.1016/j.foodcont.2017.01.026
**Confidence: MODERATE** (existence, authorship and venue verified via Crossref; specific numbers NOT verified — flagged rather than quoted).

## A-3. Rate vs. safety/spoilage vs. flavour

**Finding A-3.1 — FERMENTATION RATE: no evidence of slowing.**
**Claim:** No experimental study was found showing that free chlorine at **0.2–1.0 mg/L**, or chloramine at **1–4 mg/L**, slows acidification or reduces LAB counts in a vegetable fermentation. The one direct test (A-1.1) used **100 ppm ClO₂** and found **no effect on fermentation initiation**.
**Confidence: STRONG as a negative finding** for the concentrations in question.

**Finding A-3.2 — SAFETY / SPOILAGE: chlorine controls the water, not the vegetable.**
**Claim:** The realistic function of chlorinated water in vegetable processing is to prevent **cross-contamination and microbial build-up in recirculated process water** (A-1.2, A-2.4) — not to sanitise the vegetable. Costilow et al. (1984) found chlorine dioxide did **not** delay visible microbial growth during cucumber storage (A-1.1). The idea that chlorine "kills off desirable LAB leaving a niche" is **not supported**: LAB on and in the vegetable are protected (A-1.2), and the fermentation initiates normally at 100 ppm ClO₂.
**Confidence: STRONG** for the water-vs-vegetable distinction; the specific "niche" hypothesis has **no experimental evidence found** either way.

**Finding A-3.3 — FLAVOUR: chlorophenol/chloroanisole taint is real chemistry, but not demonstrated in vegetable fermentations.**
**Claim & numbers:** Chlorination of phenolic precursors in water generates **chlorophenols** and, via microbial methylation, **chloroanisoles** — compounds with very low sensory thresholds responsible for medicinal/plastics/musty taints.
Sources (bibliographic records verified via Crossref/PubMed):
- Muriqi, S., Červenka, L. & Sýs, M. (2025). "Voltammetric Detection of Chlorophenols in Brewing Water and Beer Using Different Carbonaceous Composite Electrodes." *Food Technology and Biotechnology* **63**(3):382–389. doi:10.17113/ftb.63.03.25.8814 — open access, PMC12475904. States chlorophenols in brewing water cause *"sensory changes"* and are monitored to prevent them. **Verified full record.**
- Zhang, K., Zhou, X., Zhang, T. et al. (2016). "Kinetics and mechanisms of formation of earthy and musty odor compounds: Chloroanisoles during water chlorination." *Chemosphere*. PMID 27561731 — chloroanisole formation **during water chlorination**.
- Miki, A., Isogai, A. et al. (2005). "Identification of 2,4,6-trichloroanisole (TCA) causing a musty/muddy off-flavor in sake and its production in rice koji and moromi mash." *Journal of Bioscience and Bioengineering* **100**(2):178–183. doi:10.1263/jbb.100.178 — a **fermented** beverage, direct precedent.
- Giacosa, S., Gabrielli, M., Torchio, F. et al. (2019). "Relationships among electrolyzed water postharvest treatments on winegrapes and chloroanisoles occurrence in wine." *Food Research International*. PMID 31000235 — chloroanisoles carried through to wine.
**Confidence: STRONG** that chlorinated water can generate chlorophenol/chloroanisole taint in **brewing, sake and wine**; **NO EXPERIMENTAL EVIDENCE FOUND** for chlorophenol taint specifically measured in **sauerkraut, kimchi, cucumber pickles or pepper mash**. Treat the vegetable case as a well-founded inference from adjacent fermented-beverage literature, not as a measured result.

## A-4. Chloramine specifically

**Finding A-4.1 — Chloramine is a far weaker, far more persistent disinfectant than free chlorine.**
**Claim & numbers (EPA, verbatim):** *"Monochloramine takes much longer than chlorine to kill most potentially harmful organisms."* *"Monochloramine can be used as a primary disinfectant but the amount of time needed for treatment makes it impractical for most utilities."* *"…because it is longer lasting than chlorine, monochloramine is often used as a secondary disinfectant."*
**Source:** US EPA. *Basic Information about Drinking Water Disinfection*, Q5: "How effective is monochloramine vs. chlorine as a primary disinfectant?" (2/24/2009)
https://www.epa.gov/sites/default/files/2015-09/documents/q5.pdf *(downloaded, HTTP 200, text read)*
Also: US EPA, *Chloramines in Drinking Water* — chloramines *"provide longer-lasting disinfection as the water moves through pipes."* https://www.epa.gov/dwreginfo/chloramines-drinking-water *(verified HTTP 200)*
**Confidence: STRONG.**

**Finding A-4.2 — Quantified: the CT gap is 100–1000×.**
**Claim & numbers:** In demand-free buffered water at 5 °C, comparing **0.2 mg/L free chlorine** with **1 mg/L monochloramine**:
- Free chlorine, 4-log₁₀ inactivation of coxsackievirus B5: **CT = 7.4–10 mg·min/L**
- Monochloramine, 3-log₁₀: echovirus 1 **CT = 8–18 mg·min/L**; but echovirus 11 and adenovirus 2 required **CT = 1,300 and 1,600 mg·min/L**
So for the more resistant organisms, monochloramine needs **~100–200× the CT of free chlorine**, and it is also far more variable between organisms.
**Source:** Cromeans, T.L., Kahler, A.M. & Hill, V.R. (2010). "Inactivation of Adenoviruses, Enteroviruses, and Murine Norovirus in Water by Free Chlorine and Monochloramine." *Applied and Environmental Microbiology* **76**(4):1028–1033. doi:10.1128/AEM.01342-09. Open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC2820971/
**Confidence: STRONG** for the CT values. **[my calculation]** the "100–200×" ratio derives from those CT numbers.

**Finding A-4.3 — Is chloramine inhibitory to LAB at 1–4 mg/L?**
**Claim:** **No experimental evidence found.** No study was located that measures LAB counts, pH drop, or acidification rate in a vegetable fermentation as a function of chloramine concentration. Given A-4.1/A-4.2 (chloramine is the *slow*, *weak* disinfectant chosen precisely because it persists without reacting vigorously) and A-2.1 (vegetable organic load consumes oxidant), a measurable inhibition at 1–4 mg/L is **not expected** — but this is an inference, not a measurement.
**Confidence: MODERATE** for "not expected"; **STRONG** that the direct experiment is absent.

## A-5. Quantitative dechlorination

**Finding A-5.0 — The physics behind everything: HOCl is volatile, monochloramine is not.**
**Numbers:** Henry's law solubility constants at 298.15 K: **HOCl = 6.5 mol/(m³·Pa)**; **monochloramine NH₂Cl = 0.86 mol/(m³·Pa)** — a ratio of **7.6×**. (Measured values from Holzwarth et al. 1984: 6.0 and 0.92.) Lower solubility = less stripping to the air = harder to remove by standing or boiling.
**Source:** Sander, R. (2023). *Compilation of Henry's law constants (version 5.0.0) for water as solvent.* *Atmospheric Chemistry and Physics* **23**:10901–12440. https://henrys-law.org/henry/casrn/7790-92-3 (HOCl) and https://henrys-law.org/henry/casrn/10599-90-3 (NH₂Cl) — both verified. Underlying measurement: Holzwarth, G., Balmer, R.G. & Soni, L. (1984). *Water Research* **18**(11):1421–1427. doi:10.1016/0043-1354(84)90012-5
**Confidence: STRONG.**

**Finding A-5.0b — Authoritative statement: standing removes chlorine, NOT chloramine.**
**Verbatim (CDC, updated 14 Feb 2024):** *"You can also remove chlorine from water by letting it sit out for a **few days**. **You cannot remove chloramine this way, however.**"* Note CDC says *a few days*, not "overnight" — the common overnight-standing advice is **not** what CDC says.
**Source:** US CDC, *About Water Disinfection with Chlorine and Chloramine.* https://www.cdc.gov/drinking-water/about/about-water-disinfection-with-chlorine-and-chloramine.html *(verified HTTP 200 via fetch; text read directly)*
Same page, useful context: *"Chlorine gets used up quickly in water… Utilities may switch to chloramine because it can keep killing germs in water pipes longer than chlorine"*; and *"Chlorine or chloramine levels up to 4 milligrams per liter (mg/L), or 4 parts per million (ppm), are considered safe in drinking water."*
**Confidence: STRONG.**

**Finding A-5.0c — BOILING.**
**Claim & numbers:** In a controlled bench study (2 L tap water, DPD-ferrous titration, measured after cooling):
- Free chlorine ~**0.60 mg/L** at 24 °C → **0.02 mg/L** at 100 °C. At **~0.5 mg/L**, heating to boiling *"eliminated nearly all of the chlorine residual."* At **~4.0 mg/L**, heating to boiling **plus 30 min** additional boiling eliminated **~95%**.
- **Monochloramine at 2.00 mg/L as Cl₂: "the boiling time required to completely remove … monochloramine was about 44 min."** Closing statement: *"A 44-min boiling was required to eliminate 3.33 mg/L of monochloramine."*
- Measured reduction rates at 2.00 mg/L as Cl₂: free chlorine **0.0891 mg/L·min**; monochloramine **0.0687 mg/L·min**.
**Source:** Zhang, L.A. (2013). "Removal of Chlorine Residual in Tap Water by Boiling or Adding Ascorbic Acid." *International Journal of Engineering Research and Applications* **3**(5):1647–1651. https://www.ijera.com/papers/Vol3_issue5/JN3516471651.pdf *(verified HTTP 200; full text read)*
**Confidence: MODERATE** — the method is sound and internally consistent, but this is a **single study in a low-tier journal.** Flagged as such.
**Reconciling the sources:** utility guidance says flatly that chloramine *"cannot be removed by boiling."* Zhang shows boiling *does* eventually destroy it, but needs **~44 min**. The two are reconcilable: the utilities are describing **practical household boiling (a few minutes)**. **★ No EPA statement about boiling/chloramine exists** — I downloaded and text-searched all six EPA chloramine FAQ PDFs (q1–q6); none mentions boiling. The "boiling does not remove chloramine" claim rests on **CDC (for standing)** and on AWWA-pattern utility documents, not on EPA.

**Finding A-5.0d — ACTIVATED CARBON.**
**Claim & numbers:** Peer-reviewed GAC column study: influent monochloramine **2 mg/L as Cl₂**; *"with at least one of the GACs tested, **<8 min of empty bed contact time (EBCT) was required** to meet the monochloramine standard for kidney dialysis water (0.1 mg/L as Cl₂). Despite **a required EBCT as long as 20 min**, use of more-traditional GACs may also be feasible."* Steady-state destruction **increased as pH decreased** (pH 7–9).
**Source:** Fairey, J.L., Speitel, G.E. & Katz, L.E. (2007). *Journal AWWA* **99**(7):110–120. doi:10.1002/j.1551-8833.2007.tb07985.x *(Crossref-verified; landing page 403s to bots)*
**Confidence: STRONG** for the peer-reviewed EBCT figures.
Industry engineering guidance gives **EBCT ≈ 2 min for free chlorine** (a *catalytic reduction*, not adsorption, and *"very fast"*), versus **10 min for chloramine on standard carbon and 4 min on catalytic carbon**, with the warning that chloramine *"requires the use of more GAC and careful monitoring for breakthrough."* **Confidence: MODERATE** (industry guidance, not peer-reviewed).
**Bottom line:** carbon works for both, but chloramine needs roughly **2–5× the contact time** of free chlorine on standard carbon, which is why **catalytic carbon** is recommended and why a typical pitcher/countertop filter may not fully remove chloramine.

**Finding A-5.1 — Sulfite is the fast dechlorinating agent; ascorbic acid is comparatively slow.**
**Claim & numbers:** Measuring the rates at which **NH₂Cl, N-Cl-piperidine, N-Cl-leucylalanine and N-Cl-alanylalanine** react with 10 reducing agents at pH 7.4 and 8.4, the agents offering **speed advantages over sulfite alone** were **dithionite, thiosulfate, and iodide-mediated sulfite**. *"Ascorbic acid was the most reactive of the sulfur-free agents but was found to be slow relative to sulfite."* **Metallic iron** reduced inorganic and organic chloramines effectively.
**Source:** Bedner, M., MacCrehan, W.A. & Helz, G.R. (2004). "Making chlorine greener: investigation of alternatives to sulfite for dechlorination." *Water Research* **38**(10):2505–2514. doi:10.1016/j.watres.2004.03.010. NIST Analytical Chemistry Division. PMID 15159154
**Confidence: STRONG.**

**Finding A-5.2 — Real-world dechlorination is incomplete; effectiveness ranking.**
**Claim & numbers:** In an operating wastewater plant using chlorine disinfection + sulfite dechlorination, an estimated **total residual chlorine of 3 µM (0.2 ppm as Cl₂)** was still detected in the effluent *despite dechlorination*. Ranking of alternative agents on laboratory-chlorinated wastewater, **decreasing effectiveness: iron metal ≫ sulfite + iodide ≈ thiosulfate > sulfite ≫ ascorbic acid.** *"Only the iron metal column was completely effective at rapidly removing all traces of residual chlorine."*
**Source:** MacCrehan, W.A., Bedner, M. & Helz, G.R. (2005). "Making chlorine greener: performance of alternative dechlorination agents in wastewater." *Chemosphere* **60**(3):381–388. doi:10.1016/j.chemosphere.2004.11.075. PMID 15924957
**Confidence: STRONG** (for wastewater residual chlorine; the ranking is the key transferable result).

**Finding A-5.3 — ASCORBIC ACID: dose and the chloramine rebound.**
**Claim & numbers:** Ascorbic acid at a **1:1 molar ratio** with free chlorine completely eliminated it, with the DPD indicator showing no colour **within 1 min**. *"For tap water containing 4 mg/L of free chlorine as Cl₂ … 10 mg of ascorbic acid is required to treat 1 L."* For **monochloramine**, *"the concentration … fell to zero within 2 min after the addition of ascorbic acid"* — **but it rebounded**; a molar ratio of **1:2.50** monochloramine:ascorbic acid was needed to eliminate it *"as well as inhibit its re-formation."* Dose: **25 mg ascorbic acid per litre** for 4 mg/L monochloramine as Cl₂. Rebound mechanism: ascorbic acid is consumed by dissolved oxygen, shifting the monochloramine equilibrium back. **Free chlorine does not rebound.**
**Source:** Zhang, L.A. (2013), as A-5.0c. *(full text read)*
**Confidence: MODERATE** (single study) — but the stoichiometry checks out exactly:
**[my calculation]** 1:1 molar AA (176.13 g/mol) : Cl₂ (70.90 g/mol) = **2.484 mg AA per mg free chlorine**; × 4 mg/L = **9.94 mg/L**, versus the paper's stated 10 mg/L ✅. For monochloramine at 2.5:1 molar = **6.21 mg AA per mg Cl₂-as-chloramine**; × 4 = **24.84 mg/L** versus the stated 25 mg/L ✅. On a true monochloramine mass basis (NH₂Cl = 51.48 g/mol) the 1:1 requirement is **3.42 mg AA per mg NH₂Cl** — the "as Cl₂" reporting convention inflates apparent mass by **1.377×**.

**Finding A-5.4 — METABISULFITE / CAMPDEN TABLETS: dose, and a correction to the commonly quoted ratio.**
**Tablet mass:** **0.44 g metabisulfite per tablet** (plus filler). **Confidence: WEAK** — no manufacturer publishes a verified tablet mass; this rests on secondary sources. One retail listing suggests a **~0.55 g total tablet mass** with ~0.44 g active. Treat as **0.4–0.5 g (±15%)**.
**Stated doses (manufacturer/retailer pages, verified):** LD Carlson (US): *"**Use 1 tablet per gallon.** Two crushed tablets equals 1/4 teaspoon."* Young's (UK): *"**1 Tablet per 5 litres** (bottling protection). 2 Tablets per 5 litres (full sanitation)."* Note the US and UK doses differ by ~25%.
**SO₂ yield per tablet:**
| Salt | Molar mass | % SO₂ by mass | mg SO₂ per 0.44 g tablet |
|---|---|---|---|
| Na₂S₂O₅ | 190.10 | **67.4%** | **296.5 mg** |
| K₂S₂O₅ | 222.32 | **57.6%** | **253.6 mg** |
**Resulting SO₂ concentration:**
| Dose | Volume | ppm SO₂ (sodium) | ppm SO₂ (potassium) |
|---|---|---|---|
| 1 tablet / **1 US gal** | 3.785 L | **78.4** | **67.0** |
| 1 tablet / 5 L (UK) | 5.0 L | 59.3 | 50.7 |
| 1 tablet / **5 US gal** | 18.93 L | 15.7 | 13.4 |
| 1 tablet / 23 L | 23.0 L | 12.9 | 11.0 |
| 1 tablet / 20 US gal | 75.7 L | 3.9 | 3.4 |
> **★ CORRECTION TO A WIDELY MIS-STATED RATIO ★** The figure commonly quoted as *"~1.34–1.8 mg SO₂ per mg chlorine"* is **mislabelled**. The authoritative EPA/WEF ratios are: *"**0.9 parts sulfur dioxide (or 1.46 parts NaHSO₃ or 1.34 parts Na₂S₂O₅) is required to dechlorinate 1.0 part residual chlorine. In practice, approximately a one-to-one ratio is used.**"* So **1.34 is mg of sodium metabisulfite per mg Cl₂, NOT mg SO₂.** The true **SO₂ : Cl₂ mass ratio is 0.90**.
**Source:** US EPA, Office of Water, *Wastewater Technology Fact Sheet: Dechlorination*, **EPA 832-F-00-022, September 2000**; text read via the identical reproduced version in PDHonline Course C222: https://www.pdhonline.com/courses/c222/dechlorination.pdf *(HTTP 200, text extracted)*; EPA report number/date independently confirmed via the ECU Libraries catalogue record https://librarycatalog.ecu.edu/catalog/971623 *(epa.gov's own copy returns 403 to automated access)*.
**Confidence: STRONG.** **[my calculation]** independently reproduces the EPA ratios from reaction stoichiometry (Cl₂ + SO₃²⁻ + H₂O → SO₄²⁻ + 2Cl⁻ + 2H⁺): **0.904 mg SO₂**, **1.468 mg NaHSO₃**, **1.341 mg Na₂S₂O₅** per mg Cl₂ — matching 0.9 / 1.46 / 1.34 exactly. (For potassium metabisulfite: **1.568 mg per mg Cl₂.**)
**Per mg monochloramine:** stoichiometry is **the same** (1 mol sulfite per mol NH₂Cl, both accept 2 electrons): **1.24 mg SO₂ or 3.69 mg Na₂S₂O₅ per mg NH₂Cl**; on the utility "as Cl₂" convention, **1.34 mg Na₂S₂O₅ per mg Cl₂-as-chloramine — identical to free chlorine.** **The difficulty with chloramine is KINETIC, not stoichiometric.**
> **★★ THE PRACTICAL BOTTOM LINE ★★** To dechlorinate **1 US gallon of water at 1.0 mg/L free chlorine** you need **3.79 mg Cl₂ → 3.42 mg SO₂ → 5.1 mg sodium metabisulfite ≈ 1/80th of one Campden tablet.** **[my calculation]** Therefore **"1 tablet per gallon" is a WINE-SULFITING dose, not a dechlorination dose.** Using it to treat fermentation water puts **67–78 ppm SO₂** into the brine. Palmer's *"1 tablet per 20 US gallons"* (~3.4–3.9 ppm SO₂) matches the stoichiometric requirement with a ~4–5× margin and **is** the defensible dechlorination dose.
*(For completeness: sodium metabisulfite is ~328 mg free chlorine neutralised per sodium tablet; ~281 mg per potassium tablet — [my calculation] from 296.5/0.904 and 253.6/0.904.)*

**Finding A-5.5 — ★ DOES THE RESIDUAL SULFITE ITSELF INHIBIT LAB? YES — AND THIS IS THE REAL RISK ★**
**Claim & numbers (wine LAB, peer-reviewed):** *"Acetaldehyde- and pyruvic acid-bound SO₂ were inhibitory to wine LAB growth at concentrations **as low as 5 mg/L** … suggesting that bound SO₂ may have a **bacteriostatic rather than bacteriocidal** action."* Organisms tested: ***Oenococcus oeni, Pediococcus parvulus, Ped. damnosus, Lactobacillus hilgardii*** — the relevant genera. Inhibition was **greater at pH 3.50 than at 3.70**.
**Source:** Wells, A. & Osborne, J.P. (2012). "Impact of acetaldehyde- and pyruvic acid-bound sulphur dioxide on wine lactic acid bacteria." *Letters in Applied Microbiology* **54**(3):187–194. doi:10.1111/j.1472-765X.2011.03193.x. Oregon State University. PMID 22150460
**Confidence: STRONG.** *(I independently retrieved and read this abstract.)*
> **The single most important number here:** **5 mg/L bound SO₂ inhibits LAB.** A **1-tablet-per-gallon** Campden dose delivers **67–78 mg/L SO₂ — roughly 13–16× that threshold.** Using a whole Campden tablet per gallon to "dechlorinate" fermentation water is therefore a **genuine fermentation-inhibition risk**, not a neutral step. Note also that the **bound** fraction is the inhibitory species, so *"the sulfite gets consumed, so it's harmless"* is **not** a safe inference.

**Claim & numbers (the closest real VEGETABLE-brine analogue — table olives):** In a growth/no-growth logistic model for table-olive microorganisms (pH 3.5–5.0, sodium metabisulphite 0–1000 mg/L): *"**LAB were more sensitive to SM**, while yeasts were to CIN."* … *"at pH 4.0, and growth probability 0.01, the **LAB population might be inhibited by the presence in the medium of 150 mg/L SM** or 1000 mg/L CIN, while in the case of yeasts, 450 mg/L SM, or 150 mg/L CIN are required."*
**Source:** Romero-Gil, V., Garrido-Fernández, A. & Arroyo-López, F.N. (2016). "In silico Logistic Model for Table Olive Related Microorganisms As a Function of Sodium Metabisulphite, Cinnamaldehyde, pH, and Type of Acidifying Agent." *Frontiers in Microbiology* **7**:1370. doi:10.3389/fmicb.2016.01370. Instituto de la Grasa (CSIC). https://pmc.ncbi.nlm.nih.gov/articles/PMC5005353/
**Confidence: STRONG source, but a MODEL OUTPUT, not a measured MIC.** 150 mg/L sodium metabisulphite ≈ **101 mg/L SO₂ equivalent** (×0.674).

**★★ EXTRAPOLATION WARNING — state this as a real gap ★★**
Wine pH is 3.0–3.8; **sauerkraut and pickle brines start at pH ~5.5–6.5 and only fall below 4.0 after fermentation is established.** Molecular SO₂ — classically the active antimicrobial form — is a steep function of pH. **[my calculation]** from SO₂ pKa₁ = 1.81 / pKa₂ = 6.91, the molecular SO₂ fraction is ≈ **2.0% at pH 3.5**, ≈ **0.16% at pH 4.6**, and ≈ **0.0065% at pH 6.0** — a **~300× drop** between wine pH and an early sauerkraut brine. Both key studies are explicitly pH-dependent (Wells & Osborne: greater inhibition at pH 3.50 than 3.70; Romero-Gil: inhibitory effect of SM depended on pH, and the 150 mg/L figure is *at pH 4.0*). **Therefore the 5 mg/L threshold should NOT be transplanted to a pH-6 sauerkraut brine without qualification.**
**★ NO EXPERIMENTAL EVIDENCE FOUND** for the effect of metabisulfite **used as a dechlorinating agent** on sauerkraut, kimchi, cucumber pickle or pepper-mash fermentation. PubMed searches for `sauerkraut AND sulfite` and `cucumber AND brine AND sulfite` returned **no relevant records**. The nearest real evidence is table olives (above), wine MLF, and the 5 mg/L bound-SO₂ threshold.
**Does sulfite get consumed during fermentation?** Yes, by two routes: **chemical binding** to acetaldehyde/pyruvic acid, and **microbial degradation** — *"Degradation of SO₂-bound acetaldehyde was observed for all LAB."* (Wells & Osborne 2012). **But because the bound fraction is itself inhibitory, this does not make the sulfite harmless.**
**Regulatory note:** FDA requires sulfite declaration when the finished food contains **≥10 ppm** total SO₂. **Confidence: MODERATE** (regulatory summary, not read from the eCFR directly).

---

# PART B — OTHER WATER FACTORS

## B-1. Water pH (does starting pH 6.5 vs 8.5 matter?)

**Finding B-1.1 — No experiment isolates "water pH".**
**Claim:** **No experimental evidence found** for a study varying the **starting pH of the water itself** (e.g. 6.5 vs 8.5) and measuring vegetable fermentation rate.
**Confidence: STRONG as a negative finding.**

**Finding B-1.2 — The controlling variable is INTERNAL cell pH, not external starting pH.**
**Claim & numbers:** Growth of *Leuconostoc mesenteroides* stopped when **internal pH reached 5.4–5.7**; *Lactobacillus plantarum* stopped at **internal pH 4.6–4.8**. Decisively: *"Variation in growth medium composition or pH did not alter the growth-limiting internal pH reached by these microorganisms."* *L. plantarum* maintained its pH gradient in **160 mM** sodium acetate or lactate down to **external pH 3.0**.
**Source:** McDonald, L.C., Fleming, H.P. & Hassan, H.M. (1990). "Acid Tolerance of *Leuconostoc mesenteroides* and *Lactobacillus plantarum*." *Applied and Environmental Microbiology* **56**(7):2120–2124. PMID 16348238. Open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC184570/
**Confidence: STRONG.** *(Independently re-verified by me: PMID 16348238 exists and the PMC link resolves HTTP 200.)* This is the single best experimental answer to the water-pH question.

**Finding B-1.3 — Starting brine pH shifts the early microbiota and the safety margin, not the LAB endpoint.**
**Claim & numbers:** Acidified cover brines **pH 4.7–4.8** vs non-acidified **pH 6.6**, with 2% (342 mM) NaCl at 28 °C: adding **25 mM acetic acid** (but **not** HCl at the same pH) reduced *Enterobacteriaceae* (**P < 0.002**). Acidification had **no effect on texture (P = 0.8235)**. Separately, cucumbers brined in CaCl₂ at **pH 6.0 ± 0.1** were still outcompeted by lactobacilli **within 36 h** — i.e. a deliberately neutral brine does not prevent a normal LAB fermentation. Commercial terminal pH: **3.23 ± 0.09** (CaCl₂ brine) vs **3.30 ± 0.12** (NaCl).
**Sources:** McMurtrie, E.K., Johanningsmeier, S.D., Breidt, F. & Price, R.E. (2019). *Journal of Food Science* **84**(5):1129–1137. https://www.ars.usda.gov/research/publications/publication/?seqNo115=358012 · Rothwell, M.A.R. et al. (2022). *Microbiology Spectrum* **10**:e0103121. https://pmc.ncbi.nlm.nih.gov/articles/PMC9241618/ · McMurtrie, E.K. & Johanningsmeier, S.D. (2018). *Journal of Food Quality* **2018**:8051435. doi:10.1155/2018/8051435
**Confidence: STRONG.**
**Bottom line:** starting water pH is a **minor** variable. The vegetable/brine buffer system plus internal pH homeostasis dominate.

## B-2. Dissolved minerals as LAB cofactors

**Finding B-2.1 — Manganese: mechanistically essential, but tap water is orders of magnitude too dilute to matter.**
**Claims & numbers:**
- *L. plantarum* has **no superoxide dismutase**; it substitutes **20–25 mM intracellular dialyzable Mn(II)** (extracts ≈ **9 µg Mn per mg protein**; 75–90% dialyzable). Cells grown Mn-rich were more resistant to oxygen toxicity. *L. plantarum* showed **no nutritional requirement for iron** and accumulated little iron even in iron-rich media.
  **Source:** Archibald, F.S. & Fridovich, I. (1981). *Journal of Bacteriology* **145**(1):442–451. doi:10.1128/jb.145.1.442-451.1981. Open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC217292/ — **Confidence: STRONG**
- Across LAB, strains contain **either** SOD **or** high millimolar Mn, not both. *Archibald & Fridovich (1981) J. Bacteriol.* **146**(3):928–936. https://pmc.ncbi.nlm.nih.gov/articles/PMC216946/ — **STRONG**
- **Manganese is one of only 10 compounds ESSENTIAL for all wine LAB tested** (2 *Oenococcus oeni* + 2 *Lactobacillus*), by single-omission in chemically defined medium with up to 15 subcultures. *Terrade, N. & Mira de Orduña, R. (2009). Int. J. Food Microbiol.* **133**(1–2):8–13. doi:10.1016/j.ijfoodmicro.2009.03.020 — **STRONG**
- **Most directly relevant to brines:** in **cucumber juice fermentation**, **10–60 mM Mn significantly increased utilization of both glucose and fructose**, but higher concentrations reduced utilization vs. control. Inorganic anions (chloride, nitrate, sulfate, phosphate) **generally suppressed** utilization of both sugars, especially at higher concentrations (tested range **10–360 mM**). Citrate increased utilization of both sugars.
  **Source:** Lu, Z., Fleming, H.P., McFeeters, R.F. & Yoon, S.S. (2002). "Effects of Anions and Cations on Sugar Utilization in Cucumber Juice Fermentation." *Journal of Food Science* **67**:1155–1161. USDA-ARS Food Science Research Unit, NC State.
  https://www.ars.usda.gov/research/publications/publication?seqNo115=119373 *(verified HTTP 200; technical abstract quoted verbatim)* — **Confidence: STRONG**

**The quantitative verdict.** 10–60 mM Mn = **549–3,296 mg/L Mn**. Typical tap water contains Mn at a median of **2.3 µg/L** (Massachusetts statewide median 17.0 µg/L; N = 37,210). Even water at the EPA secondary MCL of **0.05 mg/L** sits **~11,000× below** the lowest concentration that changed cucumber fermentation.
**Sources:** Friedman, A. et al. (2024). *Journal of Exposure Science & Environmental Epidemiology* **34**:58–67. https://pmc.ncbi.nlm.nih.gov/articles/PMC10727146/ · CA SWRCB (EPA SMCL 0.05 mg/L; WHO provisional 0.08 mg/L): https://water.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Manganese.html
**Confidence: STRONG** for the concentration data; **MODERATE** for the conclusion (arithmetic inference — not a direct experiment).
> **★ NO EXPERIMENTAL EVIDENCE FOUND** that Mn in **tap water** at drinking-water concentrations changes vegetable fermentation rate. Corroborating this: the comprehensive ARS review chapter *"Cucumber Fermentation"* (Franco et al., CRC Press, pp. 107–155) **does not mention manganese at all** — I text-mined the full chapter: **0 occurrences** of "mangan-".

**Finding B-2.2 — Magnesium and potassium: inhibition thresholds are ~1 M; tap water is nowhere near.**
**Claim & numbers:** NIC/MIC for *Lactobacillus pentosus* (a genuine table-olive/vegetable LAB), as % w/v:
| Salt | NIC | MIC |
|---|---|---|
| NaCl | 5.2 ± 0.2 | 8.2 ± 0.3 |
| CaCl₂ | 4.4 ± 0.3 | 8.7 ± 0.4 |
| KCl | **8.4 ± 0.2** | 12.6 ± 0.2 |
| MgCl₂ | **9.8 ± 0.5** | 22.8 ± 1.1 |
So KCl NIC = **84 g/L (~1.13 M)** and MgCl₂ NIC = **98 g/L (~1.03 M)**.
**Source:** Bautista-Gallego, J., Arroyo-López, F.N., Durán-Quintana, M.C. & Garrido-Fernández, A. (2008). *Journal of Food Protection* **71**(7):1412–1421. doi:10.4315/0362-028X-71.7.1412 (full data tables in the CSIC doctoral thesis: https://core.ac.uk/download/132463587.pdf)
**Confidence: STRONG.**
**Verdict:** tap-water Mg (~**3.6 mg/L** median) is **~7,000× below** the ~1 M threshold; K is similar. **★ NO EXPERIMENTAL EVIDENCE FOUND** for Mg²⁺ or K⁺ dose-response *stimulation* of vegetable LAB. Tap-water numbers: Michael, K.G.F.T. & Somani, B.K. (2022). *J. Clin. Med.* **11**:5118. https://pmc.ncbi.nlm.nih.gov/articles/PMC9457372/

**Finding B-2.3 — Iron: LAB are iron-independent; the documented problem is quality, not rate.**
**Claims:** LAB have **no nutritional iron requirement** (B-2.1, Archibald & Fridovich). Iron, zinc and copper naturally present in cucumbers and brining salt **promote oxidation of pigments and flavour compounds**; **100–200 ppm CaNa₂EDTA** is used as a chelating protectant in commercial cucumber fermentation.
**Source:** Franco, W., Johanningsmeier, S., Lu, J., Demo, J., Wilson, E. & Moeller, L. "Cucumber Fermentation", Ch. 7 in *Lactic Acid Fermentation of Fruits and Vegetables* (CRC Press), pp. 107–155. Full text: https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p406.pdf
**Confidence: MODERATE→STRONG** (chapter read in full text; the 100–200 ppm CaNa₂EDTA figure is quoted directly).
**★ NO EXPERIMENTAL EVIDENCE FOUND** for a dose-response study giving mg/L Fe vs. LAB inhibition or vs. pickle darkening. EPA secondary MCL for iron = **0.3 mg/L** (nuisance: rusty colour, sediment, metallic taste, staining). https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals
> **★ NOTE:** "iron chlorosis" is a **plant-nutrition** term (Fe-deficiency chlorosis in crops). It is **not** used as a pickle/fermentation defect in the literature — treat its appearance in fermentation contexts as a category error.

## B-3. Fluoride at 0.7–1.0 mg/L

**Finding B-3.1 — LAB inhibition requires ~19–380 mg/L, i.e. ~20–400× drinking-water levels.**
**Claim & numbers:** NaF inhibited growth of oral lactobacilli by **5–46% at 1 mmol/L**, **13–65% at 5 mmol/L**, **57–84% at 20 mmol/L** — strain-dependent. Unit conversion: **1 mM NaF = 19 mg/L F⁻; 5 mM = 95 mg/L; 20 mM = 380 mg/L.**
**Source:** Ahumada Ostengo, M. del C., Wiese, B. & Nader-Macías, M.E. (2005). "Inhibitory effect of sodium fluoride and chlorhexidine on the growth of oral lactobacilli." *Canadian Journal of Microbiology* **51**(2):133–140. doi:10.1139/w04-128
**Confidence: STRONG.**
**Verdict:** at **0.7–1.0 mg/L** (37–53 µM), fluoride is **19–27× below the lowest concentration at which any inhibition was observed** — and that lowest concentration only reduced growth by 5–46%. **No experimental evidence of LAB inhibition at US drinking-water fluoridation levels.**
**Mechanism (for completeness):** fluoride acts via enzyme binding, AlF₄⁻/BeF₃⁻ phosphate mimics, and — most relevant at low pH — its **weak-acid** character (pKa 3.15) acting as a proton conductor. Marquis, R.E., Clock, S.A. & Mota-Meira, M. (2003). *FEMS Microbiology Reviews* **26**(5):493–510. doi:10.1111/j.1574-6976.2003.tb00627.x — **STRONG.** *Nuance:* an acidic brine is a *more* favourable context for fluoride action than neutral water, but the ~1.5-order-of-magnitude gap keeps it irrelevant. EPA secondary MCL fluoride **2.0 mg/L**; MCL **4.0 mg/L**.
**★ NO EXPERIMENTAL EVIDENCE FOUND** for fluoride affecting vegetable fermentation.

## B-4. Water / fermentation temperature

**Finding B-4.1 — Sauerkraut: the authoritative USDA time–temperature table.**
**Claim & numbers (USDA / NCHFP, verbatim):** *"At temperatures between 70º and 75ºF, kraut will be fully fermented in about 3 to 4 weeks; at 60º to 65ºF, fermentation may take 5 to 6 weeks. At temperatures lower than 60ºF, kraut may not ferment. Above 75ºF, kraut may become soft."* The USDA recommendation is to store at **70–75 °F (21–24 °C)**.
**Source:** National Center for Home Food Preservation (University of Georgia), *Sauerkraut*, adapted from the **USDA Complete Guide to Home Canning**, Agriculture Information Bulletin No. 539, revised 2015.
https://nchfp.uga.edu/how/ferment/recipes/sauerkraut *(verified HTTP 200; text read directly)*
**Confidence: STRONG.** This is the canonical USDA/NCHFP figure.
**Converted:** 21–24 °C → **3–4 weeks**; 16–18 °C → **5–6 weeks**; **<16 °C → may not ferment**; **>24 °C → softening risk.**

**Finding B-4.2 — Fermented cucumbers: same optimum window.**
**Claim:** *"Store fermenting cucumbers between 70° and 75°F. This is the optimum temperature for growth of the organisms necessary for fermentation."* Too high a temperature is listed as a cause of **soft or slippery pickles**.
**Source:** NCHFP (Univ. of Georgia), *Causes and Possible Solutions for Problems with Fermented Pickles*, adapted from *So Easy to Preserve*, 6th ed. (2014), Bulletin 989.
https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/causes-and-possible-solutions-for-problems-with-fermented-pickles/ *(verified HTTP 200)*
**Confidence: STRONG.**

**Finding B-4.3 — Temperature changes the LAB *succession*, not just the speed.**
**Claim & numbers:** Fermenting chopped white cabbage in **2.5% (w/w) NaCl** at **10 °C vs 20 °C** (0.8 g – 30 g scale): at the 30 g scale, ***Lactiplantibacillus* dominated at 20 °C regardless of cabbage source, whereas *Leuconostoc* or *Rahnella* remained dominant at 10 °C.** Organic acid concentrations and phenolic metabolism differed accordingly.
**Source:** Qiao, N. & Gänzle, M.G. (2026). "From phyllosphere to fermentation: Impact of fermentation scale and temperature on sauerkraut fermentation." *International Journal of Food Microbiology* **447**:111571. doi:10.1016/j.ijfoodmicro.2025.111571 *(verified via Crossref + PubMed)*
**Confidence: STRONG.** **Important caveat:** this was a **0.8–30 g** model system, so the absolute times are not commercial-scale.

**Finding B-4.4 — Kimchi: measured time to optimal pH at two temperatures.**
**Claim & numbers:** Napa cabbage kimchi stored at **4 °C or 15 °C**: *"Fermentation at **15 °C progressed rapidly, reaching the optimal pH range (4.0–4.5) within 3 days**, and resulted in significantly higher LAB counts and total polyphenol content compared to samples stored at 4 °C (p < 0.05). In contrast, prolonged storage at 4 °C led to a decrease in both TPC, radical scavenging activities, and LAB counts during the excessive fermentation stage."*
**Source:** Kim, J., Park, H., Moon, B. & Kim, S. (2025). "Effect of Fermentation Conditions on Functional Quality of Napa Cabbage Kimchi." *Foods* **14**(16):2826. doi:10.3390/foods14162826. https://pmc.ncbi.nlm.nih.gov/articles/PMC12385461/ *(verified HTTP 200; abstract read)*
**Confidence: STRONG.** **Number to carry:** **15 °C → pH 4.0–4.5 in ~3 days**; 4 °C is a slow, long-term storage regime.

**Finding B-4.5 — Commercial cucumber fermentation timing.**
**Claim:** Air-purging is applied during active lactic acid fermentation — **seven to ten days in summer months and up to a month in colder temperatures**.
**Source:** Franco et al., "Cucumber Fermentation", Ch. 7 (as B-2.3), full text read.
**Confidence: MODERATE** (review chapter statement, no temperature series given).

**Finding B-4.6 — ★ Q10 AND ARRHENIUS: REAL MEASURED VALUES, AND THEY ARE NOT CONSTANT ★**
**Headline caveat:** Q10 and Ea for LAB are **not constants** — measured values rise steeply as temperature falls toward the cardinal minimum. Any single quoted "Q10 = 2" is wrong outside the mid-mesophilic range.

**(a) Published activation energies for a kimchi-derived LAB — STRONG.**
Organism: ***Weissella koreensis* isolated from baechu kimchi**; isothermal **5, 10, 15, 20 °C**. Arrhenius Ea: colour change **99.88 kJ/mol**; maximum specific growth rate μmax **95.91 kJ/mol**; pH change **93.38 kJ/mol**. Time to the TTI endpoint at initial inocula of 6.2/5.5/4.5/3.4 log CFU/mL = **63.5 / 101.8 / 115.1 / 166.6 h**.
**Source:** Lim, S.H., Choi, W.Y., Son, B.H. & Hong, K.W. (2014). "Development of a Microbial Time-Temperature Integrator System using Lactic Acid Bacteria." *Food Science and Biotechnology* **23**(2):483–487. doi:10.1007/s10068-014-0066-8 *(verified via Crossref)*
**[my calculation]** from Ea = 95.91 kJ/mol: **Q10 ≈ 4.4 at 5 °C, ≈ 4.1 at 12.5 °C, ≈ 3.8 at 20 °C.**

**(b) Measured μ(T) for *Lactobacillus plantarum* — STRONG values, ⚠️ dairy matrix.**
μ (h⁻¹): 8 °C **0.0049** (td = 141.5 h) · 12 °C **0.0242** · 15 °C **0.0641** · 18 °C **0.1082** · 21 °C **0.1823** · 25 °C **0.2920** · 37 °C **0.7683** (td = 54 min, optimum). At 40 °C μ fell ~62% vs 37 °C.
**Source:** Matejčeková, Z., Liptáková, D., Spodniaková, S. & Valík, Ľ. (2016). *Acta Chimica Slovaca* **9**(2):104–108. doi:10.1515/acs-2016-0018
**[my calculation]** — 8→18 °C: **Q10 ≈ 22**, Ea ≈ **211 kJ/mol**; 15→25 °C: **Q10 ≈ 4.6**, Ea ≈ **108 kJ/mol**; 18→25 °C: Ea ≈ **102 kJ/mol**. **So at 15–25 °C, Ea ≈ 100–110 kJ/mol and Q10 ≈ 4–5; near Tmin Q10 exceeds 20.**
Cardinal temperatures for *L. plantarum* (Ratkowsky, milk): **Tmin 7.1 °C, Tmax 41.2 °C**; (CTMI, milk) **7.8 / 34.7 / 41.0 °C**. *Matejčeková et al. (2019), J. Food Nutr. Res.* **58**(2):125–134 — **STRONG.**

**(c) ★ THE BEST VEGETABLE-MATRIX DATA: measured LAB lag and generation times in cabbage juice ★**
Matrix: **filter-sterilised Chinese cabbage juice** — a genuine vegetable matrix, 7 kimchi-derived strains.
**Lag times (minutes):**
| Strain | 10 °C | 20 °C | 30 °C |
|---|---|---|---|
| *Leu. mesenteroides* subsp. *dextranicum* | 1470 | 402 | 168 |
| *Leu. mesenteroides* subsp. *mesenteroides* | 1404 | 420 | 204 |
| *Leu. paramesenteroides* | 2040 | 666 | 612 |
| *Lac. bavaricus* | 1632 | 540 | 258 |
| *Lac. homohiochii* | 1812 | 528 | 228 |
| *Lac. plantarum* | 2496 | 660 | 270 |
| *Lac. brevis* | 2364 | 558 | 264 |
**Generation times at 30 °C:** *dextranicum* **36 min**, *mesenteroides* **36**, *bavaricus* **33**, *homohiochii* **39**, *plantarum* **66**, *brevis* **42**, *paramesenteroides* **162**.
**Source:** So, M.H. & Lee, Y.S. (1997). "Influences of Cultural Temperature on Growth Rates of Lactic Acid Bacteria Isolated from Kimchi." *The Korean Journal of Food and Nutrition* **10**(1):110–116. https://koreascience.kr/article/JAKO199711920135330.page
**Confidence: STRONG** (30 °C values verbatim in the English abstract; 10/20 °C read from the figures).
**[my calculation]** Q10 for the rate of transition to growth: *Leu. mesenteroides* ≈ **3.3** (10→20 °C) and ≈**2.1** (20→30 °C); *Lb. plantarum* ≈ **3.8** and ≈ **2.4**. Note Q10 **falls** as temperature rises.

**(d) The succession mechanism, quantified — STRONG.** Verbatim: *"At 10 °C, 20 °C and 30 °C, both the lag time and the generation time of Leu. mesenteroides subsp. mesenteroides were shorter than those of Lac. plantarum. But at 40 °C, this pattern was completely inverted. As a whole **lower temperatures were more favorable for the growth of Leu. mesenteroides subsp. mesenteroides, while higher temperatures were for Lac. plantarum**."* — Same source as (c). This is the measured mechanistic basis for the classic *Leuconostoc*-early / *Lactobacillus*-late succession.

**(e) Explicit statement of what is measured where.** Vegetable matrix: only (c) — growth kinetics, not Q10/Ea. Vegetable-derived organism in a model system: (a). Lab media/dairy: (b). **★ NO EXPERIMENTAL EVIDENCE FOUND for Q10 or Ea measured *in* fermenting sauerkraut, cucumber brine, or pepper mash; and none at all for pepper mash temperature effects.** The textbook "Q10 ≈ 2–3" could **not** be verified from a citable source and is **not** asserted here.

**Finding B-4.7 — Well water at 10–15 °C vs. room-temperature water.**
**Claim:** **No experimental evidence found** isolating the temperature of the *water* added to a brine as a variable, for any of the four products. This is a **documented absence**, not a documented negative result. The literature instead controls **bulk/holding temperature**. The ARS report that a 5-log *E. coli* O157:H7 reduction in fermented cucumber brine took **4 days** at pH < 3.3 *"regardless of the holding temperature (10 °C and above)"*, but **23 days** at pH 3.9 and 23 °C, shows temperature and pH **interact**.
**Reasoning (not evidence):** added water is a small fraction of a packed crock's thermal mass, and a crock equilibrates to ambient within hours versus a 3–6 week fermentation — so bulk/ambient temperature should dominate. **No experiment has measured this.**
**Confidence: MODERATE** for the reasoning; **STRONG** that the direct experiment is absent.

**Finding B-4.8 — Supporting temperature–defect thresholds (extension, two independent institutions).**
- **NC State Extension**, *Pickle and Pickle Product Problems*: hollow pickles ("bloaters") — *"Temperature was above 75 °F during fermentation"*; soft or slippery pickles — *"Temperature was too high during brining (over 75 °F)"*; dark/discoloured pickles — hard-water minerals, *"**Iron in the water is the worst offender**"*; brass/iron/copper/zinc utensils *"contribute metal ions that react with cucumbers to form dark pigments."* https://content.ces.ncsu.edu/pickle-and-pickle-product-problems — **Confidence: STRONG as guidance, MODERATE as experimental evidence.** The **75 °F (23.9 °C)** threshold is the only number.
- **Clemson Cooperative Extension HGIC**, *Making Sauerkraut*: confirms the USDA sauerkraut numbers independently and adds the mechanism — leuconostocs *"grow better at 60 °F to 70 °F"*, lactobacilli *"grow well above 70 °F"*; desired final salt **2.25–2.5%**. https://hgic.clemson.edu/making-sauerkraut/ — **Confidence: STRONG as guidance.**
- **FAO**, *Fermented fruits and vegetables: A global perspective*, Ch. 5: optimum ≈ **21 °C**; **18–22 °C** optimum for *L. mesenteroides*, **above 22 °C favours *Lactobacillus***; cucumber brine active stage **10–30 days depending on temperature**; optimum for *L. cucumeris* **29–32 °C**. https://www.fao.org/4/x0560e/x0560e10.htm — **Confidence: MODERATE** (secondary review).
- **ARS chapter (p406), temperature–bloater relationships:** *"less bloating occurs at lower fermentation temperatures"*; CO₂ solubility *"decreases with increasing NaCl and temperature"*; *"the critical period for susceptibility to bloating was between one to 12 days"*; fully cured cucumbers as early as **8 days** after brining, some only partially cured at **30 days**. **Confidence: STRONG** (ARS-authored chapter, text read).

## B-5. Nitrate — in water and in vegetables

**Finding B-5.1 — The nitrite "peak" is real and quantified.**
**Claim & numbers:** In Chinese Northeastern sauerkraut broth, at the **nitrite peak: 32.15 mg/kg nitrite, pH 4.7**; at the degradation stage **0.04 mg/kg, pH 3.6**. Market survey of 378 NE Chinese sauerkraut samples: nitrite **17.2 ± 2.1 to 38.5 ± 5.2 mg/kg**; tyramine up to **203 ± 3 mg/kg**.
**Sources:** Xu, X., Zhang, M., Tao, Y. & Wei, W. (2024). *Foods* **13**(24):4168. doi:10.3390/foods13244168. https://pmc.ncbi.nlm.nih.gov/articles/PMC11675561/ · Liu, L. et al. (2017). *International Journal of Food Properties* **20**:2448–2455. doi:10.1080/10942912.2016.1239632
**Confidence: STRONG.**

**Finding B-5.2 — ★ Commercial products: measured nitrate/nitrite, ARS/USDA survey ★**
**Claim & numbers:** 131 samples, 46 commercial pickled products, in **mg/100 g**:
| Product | Nitrate | Nitrite |
|---|---|---|
| **Kimchi** (n=3 lots) | **121.9 ± 36.8** | **2.3 ± 0.1** |
| Sauerkraut, company H | 26.9 ± 14.2 | 7.2 ± 4.1 |
| Sauerkraut, company R | 30.1 ± 3.7 | 9.8 ± 6.9 |
| Sauerkraut, company J | 47.2 ± 16.3 | 11.2 ± 4.9 |
| Fermented cabbage grouped (n=9) | 28.9 ± 16.7 | — |
Additional findings: **nitrite was detected in only 6 of 46 products, all at <1.5 mg/100 g**; nitrate was **<10 mg/100 g in 32 of 46** products and **>50 mg/100 g in only 2** (both kimchi). Total phenols: sauerkraut 5.4–5.9 mg/100 g; kimchi 20.9 ± 1.6 mg/100 g.
**Source:** Ding, Z., Johanningsmeier, S.D., Price, R., Reynolds, R., Truong, V.-D., Conley Payton, S. & Breidt, F. (2018). "Evaluation of nitrate and nitrite contents in pickled fruit and vegetable products." *Food Control* **90**:304–311. doi:10.1016/j.foodcont.2018.03.005. ARS full text: https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p417.pdf
**Confidence: STRONG** (primary data, tables read directly).
**Context:** Kimchi carries ~**1,220 mg/kg** nitrate — an order of magnitude more than sauerkraut. This is the **vegetable**, not the water.

**Finding B-5.3 — Nitrate in vegetables vs water, and the nitrite peak mechanism.**
**Claim & numbers:** Nitrate in 116 supermarket vegetable samples: range **10–4,800 mg/kg** fresh weight; highest means **radish 2,132**, butterhead lettuce **1,725**, beetroot **1,306**, iceberg lettuce **890** mg/kg; **cucumber only 32 mg/kg**. Fermentation reduces nitrate and nitrite substantially (white-cabbage sauerkraut: nitrate −55.5%, nitrite −76.7%).
**Sources:** Raczuk, J., Wadas, W. & Głozak, K. (2014). *Roczniki Państwowego Zakładu Higieny* **65**:15–20. PMID 24964574 · Heród-Leszczyńska, T. & Miedzobrodzka, A. (1992). *Rocz. Panstw. Zakl. Hig.* **43**:253–258. PMID 1308742
**Mechanism (MODERATE — secondary citation chain, primaries not read):** during Chinese cabbage fermentation *"nitrate decreased and then reached a stationary level, while the content of nitrite initially increased and then decreased when the pH was lower than 4.5"*. Nitrite-metabolising LAB include strains of *Lactobacillus brevis*, *Lactobacillus plantarum* and *Leuconostoc mesenteroides* from kimchi. **Do not quote ppm values from those primaries — they were not read.**
**Verdict:** with leafy/root vegetables carrying **~10³ mg/kg** nitrate and a brine being roughly equal masses water and vegetable, the vegetable contributes on the order of **~10³ mg/L** nitrate to the brine — roughly **100× the EPA nitrate MCL of 10 mg/L**. Water at the MCL would supply on the order of **~1%** of the vegetable's nitrate. **Confidence: MODERATE** (arithmetic with a stated brine-ratio assumption).
**Safety context:** dietary nitrite is associated with fatal methemoglobinemia at **>0.3% by weight (>3,000 mg/kg)** — the commercial sauerkraut/kimchi values above (**20–110 mg/kg**) sit **one to two orders of magnitude below** that threshold.
**★ NO EXPERIMENTAL EVIDENCE FOUND** that nitrate in the **water** changes vegetable fermentation rate or the nitrite peak. EPA MCL nitrate **10 mg/L** (as N), nitrite **1 mg/L** (as N). https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations

## B-6. Sulfate, copper, chlorate/chlorite, hardness

**Finding B-6.1 — Sulfate.** Sulfate was among the anions that **generally suppressed** sugar utilization in cucumber juice fermentation at **10–360 mM** (10 mM sulfate = **960 mg/L**). *Lu et al. (2002)*, as B-2.1. **Confidence: STRONG** for the general anion effect; **the paper does not report a sulfate-specific coefficient.** Sulfate reduction to H₂S **is** documented in a vegetable brine — *Desulfovibrio aestuarii* as the cause of hydrogen-sulfide spoilage of fermenting **olive** brines: Levin, R.E. & Vaughn, R.H. (1966). *Journal of Food Science* **31**(5):768–772. doi:10.1111/j.1365-2621.1966.tb01939.x *(Crossref-verified; full text not read, so no concentrations quoted)* — **Confidence: MODERATE.** UK tap-water sulfate median **25.36 mg/L**, ~**38× below** the lowest concentration Lu et al. tested. EPA secondary MCL sulfate **250 mg/L**. **★ NO EXPERIMENTAL EVIDENCE FOUND** that sulfate in drinking water affects vegetable fermentation.

**Finding B-6.2 — Copper and iron: quality defects, documented qualitatively by multiple institutions.**
Copper inhibits *Oenococcus oeni* and malolactic fermentation: Vidal, M.T., Poblet, M., Constanti, M. & Bordons, A. (2001). *American Journal of Enology and Viticulture* **52**(3):223–229 *(citation verified; **no numbers obtained** — not open access, and I will not invent a concentration)* — **Confidence: MODERATE.**
**Three independent extension/FAO sources on metal-induced discolouration (all qualitative):**
- **NC State Extension**, *Pickle and Pickle Product Problems*: *"Hard water was used in pickling solution — minerals in the water react with pigments in the cucumbers. **Iron in the water is the worst offender.**"* … *"**Brass, iron, copper, or zinc utensils** were used during pickle making — they contribute metal ions that react with cucumbers to form dark pigments."* Also: colour change is safe to some extent when caused by iron, *"not when caused by other metals"* — copper, brass and lead *"will leach harmful chemicals into the product."* https://content.ces.ncsu.edu/pickle-and-pickle-product-problems
- **Clemson Cooperative Extension HGIC**, *Making Sauerkraut*: *"Do not use aluminum, copper, brass, galvanized, or iron containers for fermenting sauerkraut, as these metals will react with the acids and salt in the sauerkraut, discolor it, and leach into it."* https://hgic.clemson.edu/making-sauerkraut/
- **FAO**, Ch. 5: *"**Salt with iron impurities can result in the blackening of the vegetables.** Magnesium impurities impart a bitter taste. Carbonates can result in pickles with a soft texture"* (citing Lal, Siddappa & Tandon 1986). https://www.fao.org/4/x0560e/x0560e10.htm
Metals including copper in cucumbers and brine salt promote oxidation of pigments and flavour compounds (B-2.3). EPA secondary MCL copper **1.0 mg/L**; Lead & Copper Rule action level **1.3 mg/L**; iron **0.3 mg/L**.
**★ NO EXPERIMENTAL EVIDENCE FOUND — the specific thing asked for ★** a quantitative **mg/L iron threshold** in pickle or fermented-vegetable brine above which discolouration occurs. Three institutions say iron is "the worst offender" but **none gives a number**; there is also **no** study measuring iron pick-up into brine from equipment over time in mg/L, and **no** evidence that Fe²⁺ affects LAB fermentation **rate** in vegetables. **If anyone quotes "iron above X mg/L causes dark pickles", treat it as unsourced.** Likewise **★ NO EXPERIMENTAL EVIDENCE FOUND** for copper pesticide residues on vegetables at mg/kg levels affecting fermentation, or a free-Cu²⁺ MIC for vegetable LAB.

**Finding B-6.3 — Chlorate / chlorite.** EPA MCL for **chlorite = 1.0 mg/L** (MCLG 0.8 mg/L), for systems using chlorine dioxide; an MRDL also applies to chlorine dioxide itself. Sources: https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations and the EPA Stage 1/2 DBPR plain-English guide: https://www.epa.gov/sites/default/files/2020-06/documents/dbpr_plain_english_guide_final_508.pdf — **Confidence: STRONG.** Chlorate in hypochlorite solutions and in chlorine-dioxide-treated drinking water is well documented (Bolyard & Fair 1992, *Environ. Sci. Technol.* doi:10.1021/es00032a028; Al-Otoum et al. 2016, *Chemosphere* **164**:649–656, doi:10.1016/j.chemosphere.2016.09.008). **★ NO EXPERIMENTAL EVIDENCE FOUND** for a chlorate or chlorite MIC against LAB, or for residual chlorate/chlorite affecting vegetable fermentation.

**Finding B-6.4 — Hardness affects TEXTURE, not rate — and it is calcium, not "hardness", that matters.**
**Claims & numbers:** Increasing calcium from **0 to 25 mM** (≈ **0.28% CaCl₂**; 25 mM Ca²⁺ ≈ **1,000 mg/L Ca**) **dramatically reduced the softening rate** of fermented cucumber tissue stored in 2% NaCl. Commercial CaCl₂-brine fermentation terminal pH **3.23 ± 0.09** vs **3.30 ± 0.12** for NaCl.
**Sources:** McFeeters, R.F., Fleming, H.P. & Brenes Balbuena, M. (1995). "Softening rates of fermented cucumber tissue: effects of pH, calcium and temperature." *Journal of Food Science* **60**(4):786–788, 793 · McMurtrie & Johanningsmeier (2018), *J. Food Quality* **2018**:8051435 · Review: Franco et al., Ch. 7 (full text read)
**Confidence: STRONG.**
**[my calculation]** Typical tap-water Ca is ~**30 mg/L** median — **~33× less** than the ~1,000 mg/L Ca²⁺ used for firming. **The calcium that matters is added CaCl₂, not water hardness.**
**★ NO EXPERIMENTAL EVIDENCE FOUND** that Mg²⁺ specifically firms pickles (the primary work studied "multivalent cations" collectively), nor for calcium effects on sauerkraut/kimchi texture.
**The documented home defect is quality, not rate:** NCHFP lists *"Dark or discolored pickles — cause: **Minerals in hard water** — prevention: **Use soft water**"*, and *"Brass, iron, copper or zinc utensils used"* as a separate cause. https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/causes-and-possible-solutions-for-problems-with-fermented-pickles/ *(verified HTTP 200)*

---

# PART C — WHERE HOME-FERMENTATION FOLKLORE IS **NOT** SUPPORTED

1. **"Tap water chlorine kills the LAB / stalls your ferment."** **Not supported.** The one direct experiment used **100 ppm ClO₂** — 100–500× a domestic residual — and found **no effect on fermentation initiation** (A-1.1). Vegetable organic load consumes free chlorine on contact at **40–180 mg/L** demand vs a **0.2–1.0 mg/L** dose (A-2.1).
2. **"You must boil or stand your water to dechlorinate before fermenting."** **Not supported as a necessity.** USDA/NCHFP sauerkraut and fermented-pickle procedures **never mention chlorine** and prescribe no dechlorination step; the only water-related defect they list is hardness-related discolouration (B-6.4). Note NCHFP *does* specify "boiled and cooled brine" for topping up — but as a make-up liquid, not as a dechlorination instruction.
3. **"Chloramine is much harder to remove, so it will wreck your ferment."** **Half right.** Chloramine genuinely is much harder to remove — it is not effectively boiled off, and it needs high-contact-time/catalytic carbon (A-5.3, and see the EPA statement in A-4.1). But there is **no experimental evidence** that it inhibits a vegetable fermentation at 1–4 mg/L (A-4.3).
4. **"A pinch of ascorbic acid instantly neutralises chlorine/chloramine."** **Half right — and it depends on which.** For **free chlorine**, ascorbic acid works fast at **1:1 molar (2.48 mg per mg Cl₂; ~10 mg/L for 4 mg/L Cl₂)**, no rebound (A-5.3). For **chloramine**, it needs **2.5:1 molar (6.2 mg per mg Cl₂-as-chloramine)** *and the chloramine rebounds* unless that higher dose is used. Independently, NIST rate measurements found ascorbic acid *"slow relative to sulfite"* for chloramines, and in wastewater the effectiveness ranking was **iron ≫ sulfite+iodide ≈ thiosulfate > sulfite ≫ ascorbic acid** (A-5.1, A-5.2).
5. **★ "Add a Campden tablet per gallon to dechlorinate your fermentation water." ★ — THIS IS THE ONE PIECE OF FOLKLORE THAT IS ACTIVELY RISKY.**
   - **1 tablet per US gallon is a WINE-SULFITING dose, not a dechlorination dose.** It delivers **67–78 ppm SO₂** (A-5.4).
   - The stoichiometric requirement to dechlorinate 1 US gallon of 1 mg/L water is **~3.4 mg SO₂ ≈ 5 mg metabisulfite ≈ 1/80th of a tablet** (A-5.4).
   - **Bound SO₂ inhibits wine LAB at concentrations as low as 5 mg/L** (Wells & Osborne 2012) — so 67–78 ppm is **~13–16× the LAB-inhibitory threshold**. In table-olive brine, LAB growth probability fell to 0.01 at **150 mg/L sodium metabisulphite at pH 4.0** (Romero-Gil 2016).
   - **Verdict: dechlorinating with a whole Campden tablet per gallon can itself delay or stall the lactic fermentation** — the exact opposite of the intended effect. If dechlorination is wanted, dose at the stoichiometric requirement (**~1 tablet per 20 US gallons**, ~3.4–3.9 ppm SO₂) or use ascorbic acid, which leaves no sulfite residue.
   - **Caveat, stated honestly:** this inhibitory threshold is established in **wine (pH 3.5–3.7)** and modelled in **table olives (pH 4.0)**. Molecular SO₂ falls steeply with pH **[my calculation: ~2.0% of free SO₂ at pH 3.5 → ~0.16% at pH 4.6 → ~0.0065% at pH 6.0]**, so the effect in an early, pH-6 sauerkraut brine would be weaker. **No data exists at vegetable-brine pH — this is a genuine gap, and the risk is real but not precisely quantified for sauerkraut.**
6. **"Hard water prevents the acid from forming / stops pickles curing."** **No experimental evidence found**, and it is **contradicted**: CaCl₂ brines — extremely "hard" — ferment normally to pH ~3.2–3.3 (B-6.4, B-1.3). The MSU Extension sheet asserting this also simultaneously asserts the *opposite* (that minerals, especially Ca and Mg, are needed or pickles will be mushy). **Confidence: folklore.**
7. **"Iron chlorosis ruins pickles."** "Iron chlorosis" is a **plant-nutrition** term. Not used as a fermentation defect in the literature.
8. **"Manganese in your water feeds the LAB."** Manganese is genuinely important LAB biochemistry (B-2.1) — but the effective cucumber-fermentation concentration is **10–60 mM (549–3,296 mg/L)**, versus **~0.002–0.05 mg/L** in tap water, a gap of ~**10⁴–10⁶**. The comprehensive ARS cucumber-fermentation review **never mentions manganese**.
9. **"Let the water stand overnight to remove chloramine."** **Wrong.** CDC: standing works for chlorine over *"a few days"*; *"You cannot remove chloramine this way, however"* (A-5.0b).

---

# PART D — WHAT ACTUALLY MATTERS (ranked, for a predictive model)

| Rank | Variable | Effect on fermentation **rate** | Effect on **reliability/safety** | Effect on **quality** | Evidence |
|---|---|---|---|---|---|
| 1 | **Temperature** | **Dominant.** 21–24 °C → 3–4 wk; 16–18 °C → 5–6 wk; <16 °C may not ferment | <16 °C risks failure; >24 °C risks softening | Softness above 75 °F | **STRONG** |
| 2 | **Salt concentration** | Major (not a water-chemistry variable) | Major — drives LAB selection | Texture | **STRONG** |
| 3 | **Water pH** | **Minor** — internal pH homeostasis dominates | Starting pH shifts early *Enterobacteriaceae*, a safety-margin effect | Neutral | **STRONG** (B-1.2–B-1.3) |
| 4 | **Calcium (added, not from hardness)** | No rate effect | — | **Major** — 0→25 mM cuts softening sharply | **STRONG** |
| 5 | **Free chlorine / ClO₂** | **No measurable effect** at any plausible level | Sanitises process water, not the vegetable | Chlorophenol taint plausible (brew/sake/wine precedent), **unmeasured in vegetables** | **STRONG** (rate), **MODERATE** (flavour) |
| 6 | **Chloramine** | **No experimental evidence found**; not expected at 1–4 mg/L | — | — | **No evidence** |
| 7 | **★ Added sulfite (Campden) ★** | **Can DELAY or STALL fermentation** — bound SO₂ inhibits LAB from **5 mg/L**; a 1-tablet/gal dose gives **67–78 ppm** | — | — | **STRONG** (wine/table-olive); **no data at vegetable-brine pH** |
| 8 | **Mn, Mg, K, Fe, F⁻, NO₃⁻, SO₄²⁻, chlorate** | **All ≥10³× too dilute in tap water to matter** | — | Fe/Cu → discolouration (unquantified) | **STRONG** for the dilution argument; **NO direct experiments** |

**One-line summary for the model:** for vegetable fermentation, **tap-water chlorine and chloramine are a non-issue for fermentation rate** — they are consumed by the vegetable's chlorine demand within seconds-to-minutes, and the one direct experiment at 100 ppm ClO₂ found no effect on fermentation initiation. **Water minerals are quantitatively irrelevant**, being 10³–10⁶× too dilute versus the concentrations shown to matter. **The variables that actually determine rate and reliability are temperature, salt, and (for texture) added calcium** — plus, for quality only, water hardness/iron/copper and the possibility of chlorophenol taint.
**⚠ The one water-treatment action that can genuinely harm a ferment is over-dosing metabisulfite** (a whole Campden tablet per gallon) in the belief that it is a dechlorination dose. See Part C item 5.

**Practical recommendation if dechlorination is desired:** it is not necessary for fermentation success (A-1.1, Part C item 2). If it is done anyway for flavour reasons, the defensible dose is **~1 Campden tablet per 20 US gallons (~3.4–3.9 ppm SO₂)** or **~2.5 mg ascorbic acid per mg free chlorine** — **not** one tablet per gallon.

---

# APPENDIX — Confidence ledger

**STRONG:** A-1.1, A-1.2, A-2.1–A-2.4, A-3.1, A-3.2, A-4.1, A-4.2, A-5.0, A-5.0b, A-5.0d (peer-reviewed EBCT), A-5.1, A-5.2, A-5.4 (EPA/WEF ratio), A-5.5 (both sulfite studies), B-1.1–B-1.3, B-2.1, B-2.2, B-3.1, B-4.1–B-4.5, B-4.6(a)(c)(d), B-4.8 (ARS + extension guidance), B-5.1–B-5.2, B-6.3, B-6.4.
**MODERATE:** A-2.5 (numbers unverified), A-3.3 (vegetable-specific flavour), A-4.3, A-5.0c (single low-tier study), A-5.0d (industry EBCT guidance), A-5.3, A-5.5 (regulatory note), B-2.3, B-4.5, B-4.6(b) (dairy matrix), B-4.7, B-5.3, B-6.1, B-6.2.
**WEAK-OR-CONTESTED:** A-5.4 (Campden tablet mass — no manufacturer spec, ±15%); all derived Q10/Ea values (labelled [my calculation]); all folklore items in Part C.

**Explicit "no experimental evidence found" list:**
(a) free chlorine at 0.2–1.0 mg/L or chloramine at 1–4 mg/L inhibiting LAB / slowing vegetable acidification;
(b) chloramine inhibition of LAB at any concentration in a fermentation matrix;
(c) chlorophenol/chloroanisole taint *measured* in sauerkraut/kimchi/pickles/pepper mash;
(d) Mn, Mg, K, Fe, F⁻, NO₃⁻ or SO₄²⁻ **in tap water** at drinking-water concentrations changing vegetable fermentation rate;
(e) Mg²⁺ or K⁺ dose-response *stimulation* of vegetable LAB;
(f) Fe dose-response for LAB inhibition or pickle darkening (no mg/L threshold exists);
(g) any study varying **starting water pH** (6.5 vs 8.5) and measuring fermentation rate;
(h) Q10 / Arrhenius activation energy **measured in** sauerkraut, cucumber brine or pepper mash (values exist only for a kimchi-derived organism in a model system, and for *L. plantarum* in milk/MRS);
(i) a fluoride MIC for dairy/vegetable starter cultures;
(l) any temperature effect on **pepper mash** acidification;
(m) a numeric **mg/L iron threshold** for pickle/fermentation brine discolouration;
(n) measured days-to-pH tables for kimchi at 5/10/15/20/25 °C and for sauerkraut at 15/18/21/24/30 °C (the classic Pederson 1932 bulletin exists but is not available in readable form).
(j) chlorate/chlorite MIC against LAB;
(k) Mg²⁺ specifically firming pickles; calcium effects on sauerkraut/kimchi texture.

**Citations I could NOT fully verify (flagged, not quoted):** A-2.5 (Weng 2016; Chen & Hung 2016, 2017 — bibliographic records verified via Crossref, numbers not); B-6.1 (Levin & Vaughn 1966 — record verified, full text not read); B-6.2 (Vidal et al. 2001 — record verified, no numbers obtained); A-5.3 (Fairey et al. 2007 — record verified, full text paywalled).

**Master index for follow-up.** The USDA-ARS Food Science and Market Quality and Handling Research Unit (Raleigh, NC) maintains a numbered bibliography of **462** fermented/acidified vegetable publications with direct PDF links, covering the Breidt / McFeeters / Fleming / Pérez-Díaz corpus: https://www.ars.usda.gov/southeast-area/raleigh-nc/fsmqhru/docs/fermented-acidified-vegetables-bibliography/ *(verified HTTP 200)*. Individual PDFs live under the pattern `https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/` + `pNNN.pdf` (e.g. the chapter cited here is `p406.pdf`).

**Access notes.** Several publishers (ScienceDirect, Wiley, ASM, MDPI, OUP, Taylor & Francis, AJEV) return **HTTP 403 to automated fetching**; those DOIs were verified through the **Crossref API** and, where available, PubMed/Europe PMC/PMC. Every URL in this document was HTTP-checked at the time of writing. Known non-200 results and their explanations: **A-1.1 DOI** (403, Wiley bot-block; Crossref-verified); **A-2.3 PubMed link** (203, PubMed's response to automated clients; the record exists); **CDC link in A-5.0b** (403 to `curl`, **HTTP 200 via a browser-equivalent fetch — the text was read directly and quoted verbatim**). The USDA-ARS "Pickle Pubs" PDFs reject the standard fetch tool but download fine via `curl`; the chapter at `p406.pdf` uses a custom font encoding that required a decoder, so only confidently decoded passages are quoted.

**Key corrections this review makes to commonly repeated figures:**
1. **"1.34 mg SO₂ per mg chlorine"** is mislabelled — 1.34 is mg of **sodium metabisulfite** per mg Cl₂. The true SO₂:Cl₂ ratio is **0.90** (EPA 832-F-00-022).
2. **"1 Campden tablet per gallon"** is a **wine-sulfiting** dose (67–78 ppm SO₂), **not** a dechlorination dose (**~1/80 tablet** per gallon at 1 mg/L Cl₂) — and at that level it can inhibit the LAB.
3. **Chlorine does not need to be removed for a vegetable fermentation to succeed** — the direct test at 100 ppm ClO₂ found no effect on fermentation initiation (A-1.1).
