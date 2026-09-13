# pH Thresholds in Vegetable Lactic Acid Fermentation — Concrete Numbers with Citations

**Compiled from primary regulatory text, land-grant extension publications, USDA ARS, FAO, and peer-reviewed literature.**
All URLs verified by direct retrieval during research. Where a document was retrieved and the number was **absent**, this is flagged explicitly as a negative finding — a negative finding is a result.

**Legend for classification:**
- **[REGULATORY]** — binding or enforcement-level federal/state rule
- **[STANDARDS]** — voluntary grade/definition standard with legal or commercial weight
- **[SENSORY]** — convention for eating quality, not a safety threshold
- **[MEASURED]** — experimental data from a controlled study
- **[EXTENSION]** — land-grant/university guidance (research-based but advisory)

> **URL verification note.** All 49 URLs in this report were programmatically checked. Every link resolves **except four publisher sites** — `mdpi.com`, `onlinelibrary.wiley.com`, `sciencedirect.com`, and `ui.adsabs.harvard.edu` — which return **HTTP 403/405 to automated clients** by design (anti-bot). Those URLs are valid in a normal browser; where a blocked publisher page was the only source, an OpenAlex/PubMed/EPA-HERO/PMC mirror is given alongside it. Two initial 404s (an AGRIS record and an ARS directory path) were found by this check and corrected to verified URLs.

---

## (A) pH 4.6 — The *Clostridium botulinum* / FDA Acidified Foods Threshold

### A1. The exact regulation: 21 CFR 114.3(b) — definition of "acidified foods"

**[REGULATORY] [STRONG] — federal regulation, current eCFR text**

> **§ 114.3(b) *Acidified foods*** means low-acid foods to which acid(s) or acid food(s) are added; these foods include, but are not limited to, **beans, cucumbers, cabbage, artichokes, cauliflower, puddings, peppers, tropical fruits, and fish**, singly or in any combination. They have a **water activity (a<sub>w</sub>) greater than 0.85** and have a **finished equilibrium pH of 4.6 or below**. These foods may be called, or may purport to be, "pickles" or "pickled \_\_\_\_\_\_." Carbonated beverages, jams, jellies, preserves, acid foods (including such foods as standardized and nonstandardized food dressings and condiment sauces) that contain small amounts of low-acid food(s) and have a resultant finished equilibrium pH that does not significantly differ from that of the predominant acid or acid food, and foods that are stored, distributed, and retailed under refrigeration are excluded from the coverage of this part.

> **§ 114.3(d) *Low-acid foods*** means any foods, other than alcoholic beverages, with a **finished equilibrium pH greater than 4.6 and a water activity (a<sub>w</sub>) greater than 0.85**. **Tomatoes and tomato products having a finished equilibrium pH less than 4.7 are not classed as low-acid foods.**

- **URL (eCFR.io mirror of current daily eCFR):** https://ecfr.io/Title-21/Section-114.3
- **URL (Cornell LII):** https://www.law.cornell.edu/cfr/text/21/114.3
- **Authoritative URL (eCFR proper):** https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-114
- **FDA accessdata:** https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?CFRPart=114&showFR=1 *(note: this FDA page renders only navigation chrome to automated fetches; the CFR text above is from the eCFR/Cornell LII mirrors)*
- Source note: `[44 FR 16235, Mar. 16, 1979, as amended at 61 FR 14245, Apr. 1, 1996]`

**Key point on the two-part test:** the threshold is a **conjunction** — a<sub>w</sub> **> 0.85** *AND* finished equilibrium pH **> 4.6**. Both must hold for a food to be "low-acid" and thus regulated under Part 113 (LACF) rather than Part 114.

### A2. 21 CFR 113 — thermally processed low-acid canned foods

**[REGULATORY] [STRONG] — federal regulation**

21 CFR 113.3(n) uses **word-for-word identical** language to 114.3(d):

> ***Low-acid foods*** means any foods, other than alcoholic beverages, with a **finished equilibrium pH greater than 4.6 and a water activity (a<sub>w</sub>) greater than 0.85**. Tomatoes and tomato products having a finished equilibrium pH less than 4.7 are not classed as low-acid foods.

- **URL:** https://ecfr.io/Title-21/Section-113.3

The practical consequence: Part 114 governs acidified foods (pH ≤ 4.6, a<sub>w</sub> > 0.85) — these require a scheduled process, pH control and monitoring, but **not** a full retort. Part 113 governs low-acid canned foods (pH > 4.6, a<sub>w</sub> > 0.85) — these require a scheduled retort process achieving commercial sterility.

### A3. The operative control requirement: 21 CFR 114.80(a) — and the "time designated" language

**[REGULATORY] [STRONG] — federal regulation, this is the sentence that actually governs acidification timing**

> **§ 114.80(a)(1)** Acidified foods shall be so manufactured, processed, and packaged that a **finished equilibrium pH value of 4.6 or lower is achieved within the time designated in the scheduled process** and maintained in all finished foods. Manufacturing shall be in accordance with the scheduled process. Acidified foods shall be thermally processed to an extent that is sufficient to destroy the vegetative cells of microorganisms of public health significance and those of nonhealth significance capable of reproducing in the food under the conditions in which the food is stored, distributed, retailed and held by the user. Permitted preservatives may be used to inhibit reproduction of microorganisms of nonhealth significance (in lieu of thermal processing).

> **§ 114.80(a)(2)** Sufficient control, including frequent testing and recording of results, shall be exercised so that the **finished equilibrium pH values for acidified foods are not higher than 4.6**. Measurement of acidity of foods in-process may be made by potentiometric methods, titratable acidity, or colorimetric methods. **If the finished equilibrium pH of the food is above 4.0, the measurement of the finished equilibrium pH shall be by a potentiometric method**, and the in-process measurements by titration or colorimetry shall be related to the finished equilibrium pH. **If the finished equilibrium pH is 4.0 or below, then the measurement of acidity of the final product may be made by any suitable method.** Special care should be taken when food ingredients have been subjected to lye, lime, or similar high pH materials.

- **URL:** https://ecfr.io/Title-21/Section-114.80

**This is the single most important regulatory finding for the "how fast must acidification occur" question.** The CFR does **not** state a fixed number of hours. It requires acidification "**within the time designated in the scheduled process**" — i.e. the deadline is product-specific and set by the processor's competent processing authority, not by the regulation. **This is a critical distinction that is widely misreported.**

**Note also the pH 4.0 measurement break-point** in (a)(2): above pH 4.0 a **potentiometric (meter)** measurement of finished equilibrium pH is mandatory; at or below pH 4.0 any suitable method (including titration or colorimetry) is acceptable. This is a genuine regulatory appearance of pH 4.0 — but as an **analytical-method** threshold, not a safety threshold.

### A4. Is it EQUILIBRIUM pH, and how is it measured? — 21 CFR 114.90

**[REGULATORY] [STRONG] — federal regulation prescribing the analytical method**

**Yes — it is explicitly the finished EQUILIBRIUM pH, not the brine pH and not an arbitrary composite.** The regulation provides a prescribed procedure for exactly the multi-phase problem that fermented vegetables present (solids + brine in one container):

> **§ 114.90(a)(6)(i) *Liquid and solid component mixtures.*** Drain the contents of the container for 2 minutes on a U.S. standard No. 8 sieve (preferably stainless steel) inclined at a 17- to 20-degree angle. Record weight of the liquid and solid portions and retain each portion separately.
> (*a*) If the liquid contains sufficient oil to cause electrode fouling, separate the layers with a separatory funnel and retain the aqueous layer…
> (*b*) Remove the drained solids from the sieve, blend to a uniform paste, adjust the temperature of the paste to 25 °C and determine its pH.
> (*c*) **Mix aliquots of solid and liquid fractions in the same ratio as found in the original container and blend to a uniform consistency. Adjust the temperature of the blend to 25 °C and determine the equilibriated pH.** Alternatively, blend the entire contents of the container to a uniform paste, adjust the temperature of the paste to 25 °C, and determine the equilibriated pH.

Supporting requirements:
> **§ 114.90(a)(3)(ii) *Temperature.*** To obtain accurate results, a uniform temperature should be maintained… Tests should be made at a **temperature between 20° and 30 °C, the optimum being 25 °C.**
> **§ 114.90(a)(5)(iii)** Determine two pH values on the well-mixed sample… **Report values to the nearest 0.05 pH unit.**
> **§ 114.90(b)** Colorimetric methods… **may be used in lieu of the potentiometric method if the pH is 4.0 or lower.**

- **URL:** https://ecfr.io/Title-21/Section-114.90

**Practical implication:** The brine pH alone is *not* the regulated value and can read substantially lower than the equilibrated composite. Solids (cabbage, cucumber, pepper tissue) buffer and acidify slowly. Any claim that "the brine was pH 3.5" does not establish compliance; the equilibrated solid+brine blend is what is measured.

**Industry/state elaboration of "equilibrium pH":** The Pennsylvania Department of Agriculture defines it plainly, and specifies a measurement timing that is frequently misquoted as an acidification deadline:

> Equilibrium pH is the final pH in the food product after the acidic brine or ingredient is allowed to sit and balances its pH with all ingredients. For a proper pH reading, you should test the pH of the product **roughly 24 hours after processing**, once the containers have cooled to room temperature and stabilized, or as directed by the processing authority that evaluated the process. Do not take the pH of a product just before or right after canning because it will not be an accurate measure of the equilibrium pH.

- **Source:** Pennsylvania Department of Agriculture, Bureau of Food Safety and Laboratory Services, *Canning of Acid, Acidified, Fermented Foods & Beverages — Guidance for PA Limited Food Establishments*, Rev. 12/2023. **[EXTENSION/STATE-REGULATORY] [MODERATE]** — state guidance document, not federal
- **URL:** https://www.pa.gov/content/dam/copapwp-pagov/en/pda/documents/consumer_protection/foodsafety/documents/canning-%20limited%20food%20establishments%201.11.24.pdf

⚠️ **Careful reading:** this 24-hour figure is the time to **wait before measuring** equilibrium pH — it is *not* an acidification deadline. These two distinct "24 hour" concepts are routinely conflated in secondary sources.

### A5. Does *C. botulinum* grow/sporulate below pH 4.6? — the authoritative numbers, and the real nuance

**[REGULATORY-ADJACENT] [STRONG] — FDA HACCP guidance, Appendix 4, Table A-1**

> **TABLE A-1 — LIMITING CONDITIONS FOR PATHOGEN GROWTH**
> | PATHOGEN | MIN. a<sub>w</sub> (USING SALT) | MIN. pH | MAX. pH | MAX. % WATER PHASE SALT | MIN. TEMP. | MAX. TEMP. | OXYGEN REQUIREMENT |
> |---|---|---|---|---|---|---|---|
> | **CLOSTRIDIUM BOTULINUM, TYPE A, AND PROTEOLYTIC TYPES B AND F** | **0.935** | **4.6** | 9 | 10 | **50 °F / 10 °C** | **118.4 °F / 48 °C** | anaerobe |
> | **CLOSTRIDIUM BOTULINUM, TYPE E, AND NON-PROTEOLYTIC TYPES B AND F** | **0.97** | **5.0** | 9 | 5 | **37.9 °F / 3.3 °C** | **113 °F / 45 °C** | anaerobe |

- **Source:** U.S. FDA, *Fish and Fishery Products Hazards and Controls Guidance*, **June 2022 Edition**, Appendix 4: Bacterial Pathogen Growth and Inactivation, Table A-1, pp. 419–420.
- **URL:** https://www.fda.gov/media/80637/download *(PDF; verified retrieved, 5,627,254 bytes, 2022 edition, "SGR 129")*
- Document quality: federal regulatory guidance issued by FDA CFSAN/Office of Food Safety; the table is described in-document as "generally conservative."

**Three genuine nuances that are usually lost:**

1. **pH 4.6 is the minimum for the PROTEOLYTIC strains only.** FDA assigns **pH 5.0** as the minimum for *Type E and non-proteolytic types B and F*. So pH 4.6 is **not** the tightest botulinum constraint — pH 4.6 is *conservative* with respect to non-proteolytic strains (whose true limit is higher, 5.0) but is the *binding* limit for proteolytic strains. Using 4.6 as a single universal number therefore over-controls for non-proteolytic and exactly controls for proteolytic.
2. **The hazard is toxin formation, not growth per se.** Vegetative *C. botulinum* cells are destroyed by the mild thermal process required by 21 CFR 114.80(a)(1); **spores** survive and the acidified-food strategy is to prevent spore **outgrowth and toxin formation**. FDA's table separately lists *Staphylococcus aureus* "GROWTH" (min pH 4) vs "TOXIN FORMATION" (min pH 4), illustrating that the agency does distinguish growth from toxin limits where they differ.
3. **A documented dissent exists.** Raatjes & Smelt (1979) reported growth and toxin formation below pH 4.6:
   - **"Clostridium botulinum can grow and form toxin at pH values lower than 4.6"**, *Nature* 281:398 (1979). **[MEASURED] [WEAK-OR-CONTESTED]** — single study, contested; the 4.6 regulatory line has been retained by FDA notwithstanding.
   - URL (record): https://ui.adsabs.harvard.edu/abs/1979Natur.281..398R/abstract
   - Related review: *Clostridium botulinum and Acid Foods*, J. Food Prot. — URL: https://www.sciencedirect.com/science/article/pii/S0362028X23024407 *(publisher blocks automated retrieval; not read in full — see Gaps)*

**The "pH 4.8" variant you asked about:** I could **not** locate an authoritative FDA/USDA/ICMSF source giving **pH 4.8** as a *C. botulinum* practical limit. ⚠️ **FLAGGED AS NOT FOUND.** The 4.8 figure appears in the literature as the **minimum pH for *Shigella* spp.** (FDA Table A-1, above) and as the minimum pH for *Vibrio parahaemolyticus* — it is likely a cross-contamination of those rows or of spore-heat-resistance literature. **Do not attribute pH 4.8 to C. botulinum on the basis of any source found here.**

### A6. The "pH 4.6 within 24 hours" guidance — where it actually comes from

**[MEASURED/REVIEWED] [MODERATE-STRONG] — peer-reviewed, Cornell University Food Science**

This is the clearest explicit statement of the 24-hour rule found anywhere, and it comes from Cornell's NYSAES Food Science department (Padilla-Zakour group), published in *Journal of Food Protection*:

> **"U.S. federal regulations require that acidified foods must reach a pH of 4.6 or lower within 24 h of packaging or be kept refrigerated until then. Processes and formulations should be designed to satisfy this requirement, unless proper studies demonstrate the safety of other conditions."**

- **Source:** Acosta O, Gao X, Sullivan EK, Padilla-Zakour OI. "Pickled egg production: effect of brine acetic acid concentration and packing conditions on acidification rate." *J Food Prot.* 2014 May;77(5):788–95. doi:10.4315/0362-028X.JFP-13-362
- **URL:** https://pubmed.ncbi.nlm.nih.gov/24780334/
- Document quality: peer-reviewed controlled study, Cornell University Department of Food Science, NYS Agricultural Experiment Station, Geneva NY. Eggs rather than vegetables — **the 24 h framing is generic to acidified foods, but the experimental data are for hard-cooked eggs.**

⚠️ **IMPORTANT CAVEAT — I verified the primary source and the 24-hour figure is NOT in the CFR text.** 21 CFR 114.80(a)(1) says only "**within the time designated in the scheduled process**" (quoted verbatim in A3 above). The Acosta et al. sentence is the authors' characterization of federal requirements, not a quotation of regulatory text. The 24-hour figure is best understood as **the widely-applied industry/Cornell convention for the scheduled-process acidification time**, and it is consistent with the PA Department of Agriculture's separate instruction to measure equilibrium pH "roughly 24 hours after processing."

**Bottom line for (A6):** the "pH 4.6 within 24 hours" rule **exists as guidance/convention and is cited to federal regulation by Cornell researchers, but the literal 24-hour deadline does not appear in 21 CFR 114.** Treat 24 hours as a defensible default process time, not as a codified federal limit.

### A7. Vegetable-specific nuance in the regulations

**[REGULATORY] [STRONG]** — Three concrete vegetable-specific points found:

1. **Named commodities.** 21 CFR 114.3(b) names **beans, cucumbers, cabbage, artichokes, cauliflower, and peppers** as exemplars of acidified foods. Fermented vegetables therefore sit squarely inside Part 114 (unless refrigerated — see #3).
2. **Artichokes carry a hard-coded pH 4.5 ceiling** in the canned-vegetable standard of identity — tighter than 4.6:
   > **21 CFR 155.200(c):** "In the case of artichokes, a vinegar or any safe and suitable organic acid… is added in such quantity as to **reduce the pH of the finished canned vegetable to 4.5 or below**."
   > **URL:** https://www.law.cornell.edu/cfr/text/21/155.200
3. **The refrigeration carve-out matters enormously for fermented vegetables.** 114.3(b) excludes "foods that are stored, distributed, and retailed **under refrigeration**." This is why retail **refrigerated** kimchi and refrigerated sauerkraut are not regulated as shelf-stable acidified foods, while **shelf-stable** canned sauerkraut/kimchi is. This is a coverage distinction, not a change in the microbiology.

---

## (B) pH 4.0 and pH 3.8 — The Stability / Security Margin

### B1. What the federal government actually requires for sauerkraut — and what it does not

🚨 **KEY CORRECTION TO A COMMON ASSUMPTION: there is NO FDA standard of identity for sauerkraut, and 21 CFR 155.200 does NOT cover it.**

**[REGULATORY] [STRONG]** — 21 CFR 155.200 is titled "Certain other canned vegetables" and its commodity table lists **"Cabbage — Cut pieces of the heads of the cabbage plant"** — i.e. plain canned cabbage. **Sauerkraut is not in the table and has no standard of identity.** FDA states this explicitly:

> "Shortly after enactment of the 1938 Act, sauerkraut was among the foods exempted from label declaration of ingredients requirement for labeling of nonstandardized foods. The exemption was based on the expectation that standards would soon be established. **However, standards for this product were not established** and on September 17, 1959, the exemption was terminated."
> "**In the absence of a standard of identity**, the term 'sauerkraut' is considered the common or usual name for a product obtained by the lactic acid fermentation of cabbage in the presence of salt. Products which have not been fermented, but owe their acidity to added vinegar, acetic acid or other acidifiers are **not entitled to the name sauerkraut**."

- **Source:** FDA Compliance Policy Guide, **CPG Sec 585.750 Sauerkraut — Definition; Adulteration by Thrips** (issued 8/24/70; revised through 5/2005; updated 11/29/05)
- **URL:** https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cpg-sec-585750-sauerkraut-definition-adulteration-thrips

**The historically operative numeric definition of sauerkraut (acid, not pH!) — exact quote:**

> ***Sauerkraut*:** The product, of characteristic acid flavor, obtained by the full fermentation, chiefly lactic, of properly prepared and shredded cabbage **in the presence of not less than 2 percent nor more than 3 percent of salt**. It contains, upon completion of the fermentation, **not less than 1.5 percent of acid, expressed as lactic acid**. Sauerkraut which has been rebrined in the process of canning or repacking, contains **not less than 1 percent of acid, expressed as lactic acid**.

- Same source/URL as above. **[REGULATORY] [STRONG]** — FDA CPG (definition derived from Food Inspection Decision 196, Aug. 1925, unchanged through S.R.A. F.D. No. 2, Rev. 5, Nov. 1936)
- **Note the quantity is TITRATABLE ACIDITY (% lactic acid), not pH.** The federal definition of sauerkraut has never been expressed as a pH value.

### B2. The USDA grade standard DOES specify a numeric acidity minimum

**[STANDARDS] [STRONG] — USDA AMS voluntary grade standard, §52.2963**

> **§52.2963 Flavor. (a) General.** The flavor of kraut depends on a typical lactic acid fermentation of the product which is controlled, in part, by the amount of salt present. **Kraut of any grade above substandard shall test within the following limits:**
> **Acidity (calculated as lactic acid) . . . 1.0% minimum**
> **Salt . . . 1.3% minimum / 2.5% maximum**

> **§52.2964(b) *Acidity*** means percent, by weight, of acid, calculated as lactic, in canned kraut. The percent acidity may be determined by direct titration on a **10-gram sample of the packing media**. Dilute with about 25 milliliters of distilled water and titrate with **N/10 sodium hydroxide** solution, using several drops of **phenolphthalein** indicator, to the characteristic permanent faint-pink end points.

- **Source:** United States Department of Agriculture, Agricultural Marketing Service, *United States Standards for Grades of Canned Sauerkraut*, effective May 13, 1963 (2nd issue; 28 FR 2573, April 8, 1963). Sections §52.2951–§52.2966. **[STANDARDS] [STRONG]** — federal grade standard, voluntary but used for federal grading and loan values
- **URL (HTML landing):** https://www.ams.usda.gov/grades-standards/canned-sauerkraut-grades-and-standards
- **URL (PDF, retrieved and text-extracted):** https://www.ams.usda.gov/sites/default/files/media/Canned%20Sauerkraut%20Standard.pdf
- ⚠️ **Note the internal inconsistency with FDA CPG 585.750:** FDA's definition says **≥1.5%** lactic acid for fermented sauerkraut (≥1.0% if rebrined); the USDA **grade** standard's threshold for any grade above Substandard is **≥1.0%**. These are different instruments serving different purposes (naming vs. grading) — they are not in direct conflict, but the numbers differ and should not be conflated.

### B3. What commercial sauerkraut producers actually achieve — MEASURED

**[MEASURED] [STRONG] — USDA ARS survey of 8 U.S. commercial producers, peer-reviewed**

> "Canned sauerkraut from **eight U.S. companies** was analyzed for salt, titratable acidity (TA), fermentation substrates and end products… **The TA ranged from 0.9–1.5%, while salt content ranged from 1.4–2.0%**, which was lower than in previous surveys."
> "Overall, the lots contained **10–35% lower concentrations of titratable acidity (TA)** and **13–41% lower salt** when compared to similar surveys made in **1940 and 1985**."

- **Source:** Trail AC, Fleming HP, et al. "Chemical and sensory characterization of commercial sauerkraut." *Journal of Food Quality* (1996). USDA ARS Food Science Research Unit, Raleigh NC.
- **URL (ARS technical abstract):** https://www.ars.usda.gov/research/publications/publication?seqNo115=56596
- **URL (Wiley):** https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1745-4557.1996.tb00402.x
- **URL (EPA HERO record with full abstract):** https://hero.epa.gov/reference/1192224/
- Document quality: peer-reviewed, USDA ARS in-house research, n = 8 commercial companies.

🔎 **This is the strongest available answer to "what pH/acidity do commercial sauerkraut producers target," and the answer is that they target TITRATABLE ACIDITY ≈ 0.9–1.5% lactic acid, not a pH setpoint.** ⚠️ **The paper reports TA and salt but the abstract does not report pH — I could NOT obtain a commercial-sauerkraut pH specification of "3.5–3.8" from any primary source.** See Gaps. The commonly repeated "commercial sauerkraut targets pH 3.5–3.8" claim is **NOT substantiated by any source located in this research**; what is substantiated is **TA 0.9–1.5%** and the regulatory/grade minima of 1.0–1.5%.

### B4. pH 3.5 and pH 3.8 as explicit USDA ARS experimental reference points

**[MEASURED] [STRONG] — USDA ARS, peer-reviewed**

The pH values **3.5** and **3.8** appear as deliberate, defined process categories in USDA ARS acidified-foods research:

> Breidt F, Kay K, Cook J, Osborne J, Ingham B, Arritt F. 2013. **"Determination of 5-log reduction times for *Escherichia coli* O157:H7, *Salmonella enterica*, or *Listeria monocytogenes* in acidified foods with pH 3.5 or 3.8."** *J Food Prot* 76(7):1245–1249.
> Breidt F, Kay K, Osborne J, Ingham B., Arritt, F. 2014. "Thermal processing of acidified foods with pH 4.1 to 4.6." *Food Prot Trends* 34(3):132–138.

- **URL (USDA ARS "Safety of Acidified Foods" publication list, Fred Breidt):** https://www.ars.usda.gov/southeast-area/raleigh-nc/fsmqhru/docs/safety-of-acidified-foods/
- **URL (PubMed record for the 2013 paper — verified, PMID 23834800):** https://pubmed.ncbi.nlm.nih.gov/23834800/
- **URL (Semantic Scholar record for the 2013 paper):** https://www.semanticscholar.org/paper/Determination-of-5-log-reduction-times-for-coli-or-Breidt-Kay/663aed251580d4f41b8262947ddf21a3af15cbcf
- **URL (FAO AGRIS record):** https://agris.fao.org/search/en/records/65dfc1a863b8185d9caeb306
- Document quality: peer-reviewed, USDA ARS Food Science and Market Quality and Handling Research Unit, Raleigh NC.
- ⚠️ **What this establishes:** pH **3.5** and **3.8** are the two bands USDA ARS chose as representative "cold-filled acidified food" pH targets for pathogen 5-log reduction studies — evidence that ~3.5–3.8 is a meaningful *process-design* band. **What it does NOT establish:** that any institution *requires* fermented vegetables to reach 3.5 or 3.8. It is a research design choice, not a mandated target.

### B5. pH 4.0 and 4.2 in state regulatory guidance — a real, tiered, numeric rule

**[REGULATORY/STATE] [MODERATE-STRONG] — Pennsylvania Department of Agriculture, enforceable at state level**

> "Producers of acidified/fermented foods or beverages will be approved only if testing results for equilibrium pH show that their products fall within safe ranges of **pH 4.6 or below**. However, producers of acidified/fermented foods or beverages **should aim for a pH level of 4.2 or below as an extra precaution**."
> "If your product qualifies as an acidified food and the **equilibrium pH is >4.2** you must have a **scheduled process developed by a competent processing authority**."
> "If your final equilibrium pH is **4.0 or below**, you must have either a properly calibrated pH meter **or pH test strips** to verify your pH of every batch produced."
> "If your final equilibrium pH is between **4.0 and 4.2**, you must have a properly calibrated **pH meter** and check the pH of every batch."
> "If your final equilibrium pH is between **4.2 and 4.6**, you must have a properly calibrated pH meter and check the pH of every batch produced. **Additionally, you must have your product flow, recipe and process evaluated and approved by a Process Authority.**"
> "**No product may ever enter commerce if a final pH is found to be >4.6** during testing."

- **Source:** Pennsylvania Department of Agriculture, *Canning of Acid, Acidified, Fermented Foods & Beverages — Guidance for PA Limited Food Establishments*, Rev. 12/2023
- **URL:** https://www.pa.gov/content/dam/copapwp-pagov/en/pda/documents/consumer_protection/foodsafety/documents/canning-%20limited%20food%20establishments%201.11.24.pdf
- Companion document for commercial establishments: https://www.agriculture.pa.gov/consumer_protection/FoodSafety/manufacturing-packing-holding-distribution/commercial-food-establishments/Documents/Canning-%20Commercial%20Food%20Establishments.pdf
- **This is the clearest institutional statement of a pH 4.0 / 4.2 graduated framework found.** Note the tiers are about **regulatory burden (meter vs strips, process authority review)**, and the 4.2 figure is framed as "extra precaution" — i.e. **a margin-of-safety convention, not a microbiological cliff.**

### B6. pH 3.3 — a genuine process threshold, but for a different purpose

**[EXTENSION] [MODERATE] — NC State University Extension**

> "…an alternative process would be to adjust the pH to **below 3.3, prior to filling**. When a product with a pH this low is **stored for 24 hours at 75°F**, research shows that the vegetative cells of common foodborne pathogens are destroyed."

- **Source:** NC State University Extension (document hosted via Texas A&M AgriLife Horticulture)
- **URL:** https://aggie-horticulture.tamu.edu/wp-content/uploads/sites/8/2012/03/ncsu-edu_foodscience_extension_program_documents_acid_acidified_foods.pdf
- Document quality: land-grant extension publication; **note this describes a "hot fill and hold"-style alternative process for acidified foods, not a target for fermented vegetables.** pH 3.3 here substitutes for a thermal process — it is **not** a sauerkraut/kimchi target.

### B7. Extension sources that DO NOT contain numeric pH targets — explicit negative findings

These were specifically requested and were retrieved and searched in full. **Reporting the absence is the result:**

| Institution / document | Numeric pH target present? | What it does give | URL |
|---|---|---|---|
| **Penn State Extension**, *Let's Preserve: Fermentation — Sauerkraut and Pickles* (Zepp, Hirneisen & LaBorde, 2023) | ❌ **NO pH value anywhere in the document** (verified by full-text search for "pH" — only matched "Photo credit", "atmospheric") | Temperature/time only: 70–75 °F → fully fermented in ~3–4 weeks; 60–65 °F → ~6 weeks; <60 °F may not ferment; >80 °F may spoil. Also: "Fermentation naturally stops because the acids accumulate to such an extent that further growth cannot take place." | https://extension.psu.edu/lets-preserve-fermentation-sauerkraut-and-pickles |
| **Penn State Extension**, *Tips for Making Sauerkraut* | ❌ **NO numeric pH** | Ideal fermentation 70–75 °F (21–24 °C); qualitative statement that "the pH (acidity) of the cabbage changes from low acid to high acid" | https://extension.psu.edu/tips-for-making-sauerkraut |
| **USDA Complete Guide to Home Canning, Guide 6** — *Preparing and Canning Fermented Foods and Pickled Vegetables* (2015 rev.) | ❌ **ZERO occurrences of the string "pH" in the entire 36-page guide** (verified by full-text extraction; the only "acid" hit is "¼ tsp powdered ascorbic acid" in a relish recipe) | Recipes, salt ratios, process times. States qualitatively: "The level of acidity in a pickled product is as important to its safety as it is to taste and texture." | https://nchfp.uga.edu/papers/guide/GUIDE06_HomeCan_rev0715.pdf |
| **Clemson HGIC**, *"I Kraut You Not"* | ❌ **NO numeric pH target**; only the 4.6 dividing line ("lowers pH below 4.6 (high acid food)") and "A 2% salt water solution (by weight of the vegetable)" | Recipe + LAB genera list | https://hgic.clemson.edu/i-kraut-you-not/ |
| **NC State Extension**, *How to Make Fermented Pickles* | ❌ **NO numeric pH** | 70–75 °F for 3–4 weeks; 55–65 °F → 5–6 weeks; avoid >80 °F | https://foodsafety.ces.ncsu.edu/news/how-to-make-fermented-pickles/ |
| **Cornell Cooperative Extension** | ❌ **No publication with a numeric pH target located.** Only an event listing for "Food Preservation: Introduction to Fermented Vegetables" was found | — | https://cceevents.org/e/food-preservation-introduction-to-fermented-vegeta |

**Where USDA does state 4.6** is **Guide 1 (Principles of Home Canning)**, not Guide 6:

> "Low-acid foods have **pH values higher than 4.6**… **Acid foods have a pH of 4.6 or lower.** They include fruits, pickles, **sauerkraut**, jams, jellies, marmalades, and fruit butters."
> "**Pickling** — The practice of adding enough vinegar or lemon juice to a low-acid food to **lower its pH to 4.6 or lower**."

- **Source:** USDA *Complete Guide to Home Canning*, Guide 1: Principles of Home Canning (2015 rev.), §"Food acidity and processing methods" and Glossary. **[EXTENSION/FEDERAL] [STRONG]**
- **URL:** https://nchfp.uga.edu/papers/guide/GUIDE01_HomeCan_rev0715.pdf
- ⚠️ **The USDA Complete Guide states pH 4.6 as the acid/low-acid dividing line and does NOT anywhere state a pH 4.0 or 3.8 target for sauerkraut or pickles.**

### B8. pH 4.0 and 3.8 as MEASURED equilibration endpoints (Cornell)

**[MEASURED] [STRONG]** — In the same Cornell study that supplied the 24-hour rule, eggs acidified with three brine acetic acid concentrations **equilibrated at pH 3.8, 4.0, and 4.3** respectively (7.5%, 4.9%, and 2.5% acetic acid brine):

> "Three brine concentrations were evaluated (7.5, 4.9, and 2.5% acetic acid) and egg pH values (whole, yolk, four points within egg) were measured from 4 to 144 h, with **eggs equilibrating at pH 3.8, 4.0, and 4.3**, respectively."

- **URL:** https://pubmed.ncbi.nlm.nih.gov/24780334/

**This is useful evidence that 3.8–4.3 is the practically-achievable equilibration band** for an acidified low-acid solid at realistic brine acidities — but it is **egg** data, not vegetable data, and should be transferred with caution (eggs are far more protein-buffered than cabbage).

### B9. Kimchi: an explicit optimum pH of 4.2 from a land-grant source

**[EXTENSION] [MODERATE-STRONG] — Colorado State University Extension, 2025**

> "The formation of organic acids (primarily lactic and acetic acid) results in an **optimum kimchi pH of 4.2**."
> "For safety, kimchi should reach a **pH of 4.6 or below** before consuming."
> "Kimchi ferments at room temperature in only **1–2 days** or around **3–4 days** while in refrigeration."
> "Ferment for 1 to 2 days at room temperature, testing it daily until a **pH of 4.6 or below** is reached."
> "For best quality, keep kimchi stored in the refrigerator and **eat within 2 weeks**. The quality of kimchi deteriorates with longer fermentation."

- **Source:** Colorado State University Extension, *Understanding and Making Kimchi* (2025), FS handout; recipe by HyoJung Kang, edits by Laura Bauer, PhD, RD, in collaboration with CSU Food Science & Human Nutrition Extension. **[EXTENSION] [MODERATE-STRONG]**
- **URL (web):** https://extension.colostate.edu/resource/understanding-and-making-kimchi/
- **URL (PDF, retrieved):** https://foodsmartcolorado.colostate.edu/wp-content/uploads/2025/03/2025-Understanding-and-Making-Kimchi_FS-handout-4.pdf
- **This is a clean split of SENSORY (4.2 optimum) vs SAFETY (4.6) in a single extension document** — exactly the distinction requested.

---

## (C) pH 3.3–3.6 "Fully Sour", Terminal pH, and Shelf Stability

### C1. FAO — the classic sauerkraut LAB succession with EXACT acidity stages

**[EXTENSION/INTERNATIONAL] [STRONG] — FAO document, retrieved and quoted in full**

> "The first micro-organisms to start acting are the gas-producing cocci (*L. mesenteroides*). These microbes produce acids. **When the acidity reaches 0.25 to 0.3% (calculated as lactic acid), these bacteria slow down and begin to die off**, although their enzymes continue to function. The activity initiated by the *L. mesenteroides* is continued by the lactobacilli (*L. plantarum* and *L. Cucumeris*) **until an acidity level of 1.5 to 2% is attained**. The high salt concentration and low temperature inhibit these bacteria to some extent. Finally, *L. pentoaceticus* continues the fermentation, **bringing the acidity to 2 to 2.5% thus completing the fermentation.**"
> "The optimum temperature for sauerkraut fermentation is around **21 °C**. … **A temperature of 18° to 22 °C is most desirable for initiating fermentation** since this is the optimum temperature range for the growth and metabolism of *L. mesenteroides*. **Temperatures above 22 °C favour the growth of *Lactobacillus* species.**"

- **Source:** FAO, *Fermented fruits and vegetables: A global perspective* (Battcock M. & Azam-Ali S.), Chapter 5 — "Procedure for vegetables preserved by combined methods," §5.6.2 "The 'sauerkraut' process." **[INTERNATIONAL GUIDANCE] [STRONG]** — FAO Agricultural Services Bulletin
- **URL:** https://www.fao.org/4/x0560e/x0560e10.htm
- **Table of contents URL:** https://www.fao.org/4/x0560E/x0560E00.htm

🔎 **This is the single best citation for the LAB succession completion point in acidity terms**: *L. mesenteroides* yields at **0.25–0.3%** lactic acid → *L. plantarum*/*L. cucumeris* carry to **1.5–2%** → *L. pentoaceticus* (i.e. *L. brevis*) completes at **2–2.5%**.

### C2. Kimchi: terminal pH, ripeness stages, and titratable acidity

**[MEASURED] [STRONG] — Korean study, open access, n = controlled fermentation**

> "Fresh kimchi (Fresh), **optimally ripened** kimchi (OptR), and **over ripened** kimchi (OvR) were fermented until the pH reached **pH 5.6, pH 4.3, and pH 3.8**, respectively."

- **Source:** *Nutrition Research and Practice* (2014), "Antioxidative effects of Kimchi under different fermentation stage on radical-induced oxidative stress." Korean journal, peer-reviewed, open access.
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC4252523/ *(PMC ID 4252523 — verified by title/journal/year lookup)*
- **This directly gives the SENSORY convention in pH terms: fresh 5.6 → optimal 4.3 → over-ripened 3.8.**

**[MEASURED] [STRONG] — Korean study, kinetic model, n = 4 temperatures**

Definitive titratable-acidity ripeness bands, correlated against a trained sensory panel:

> "Previous studies that identified ripening stages of Kimchi based on total acidity have reported that the acidity of non-fermented Kimchi increases to 0.4%… The acidity value measured in this study correlated well with the results of the sensory test, since the overall ripening value is **1–3 in the non-fermented stage with 0.4% acidity (low ripening stage)**, **4–6 in the moderate fermented stage with 0.8% acidity (moderate ripening stage)**, and **7+ in the over-fermented stage with over 1.0% acidity (high ripening stage)**. Therefore, acidity is an appropriate indicator for determining the Kimchi ripening status."

- **Source:** "Development of Dynamic Model for Real-Time Monitoring of Ripening Changes of Kimchi during Distribution." *Foods* **2020**, 9(8), 1075. Peer-reviewed, open access; samples from a commercial Korean kimchi manufacturer (D Company, Seoul).
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/
- **DOI/landing:** https://www.mdpi.com/2304-8158/9/8/1075
- ✅ **VERDICT ON YOUR HYPOTHESIS:** the claim "**titratable acidity 0.6–0.9% at optimal ripeness**" is **CONFIRMED and refined** — the measured moderate/optimal ripening value is **≈0.8% acidity**, with the over-ripened threshold at **>1.0%**. The "0.6–0.9%" band brackets 0.8% correctly.

### C3. Kimchi: effect of storage temperature on ripening rate — full measured dataset

**[MEASURED] [STRONG]** — Same *Foods* 2020 study, kimchi stored at 0, 5, 10, and 20 °C. Initial pH **5.93**.

| Temp | pH trajectory | Time to reach acidity plateau | Other markers |
|---|---|---|---|
| **20 °C** | **pH 4.43 in 2 days**; **pH 3.83 in 10 days** | Entered exponential acidity phase with **no lag**; sensory softness/sour smell/sour taste increased significantly until **day 5** | Aerobic count 5.02 → 8.52 log CFU/g by **day 3**; hardness fell to 7.8 N by **day 8** |
| **10 °C** | **pH 4.14–4.24 by day 10**, then held **4.05–4.15** to end of storage | Acidity reached **0.95–0.96% after 14 days**, then held **0.9–1.1%** to day 30 | Sensory indices increased until **day 16**; max bacterial count 7.71 log CFU/g at day 6; hardness 7.8 N by **day 16** |
| **5 °C** | **pH 4.14–4.24 by day 20**, then held **4.05–4.15** to end of storage | Acidity reached **0.95–0.96% after 35 days**, then held **0.9–1.1%** to day 50 | Sensory indices increased significantly until **day 30**; hardness 18.6 N by **day 35** |
| **0 °C** | **Held pH 5.93–6.06 until day 14**, then fell to **pH 4.57 by day 28** | **No exponential phase**; acidity rose gradually and held **0.81–0.85% from day 49 to final day** | Sensory indices increased significantly until **day 56** |

Additional findings from the same paper: **pH and ripeness correlated at r = −0.862 to −0.871; acidity and ripeness correlated at r = 0.946 to 0.960** across all four temperatures (p < 0.01) — i.e. **acidity is a better ripeness predictor than pH.** The paper also concluded that **maximum acidity increases with storage temperature**, and that the **maximum acidity does not change when temperature fluctuates during the stationary phase** (the basis of their Mean Kinetic Temperature model).

> "It was determined that the Kimchi stored at 0, 5, and 20 °C showed a significantly higher degree of ripening over the fermentation period (p < 0.05)."
> "**At 10 °C, the degree of fermentation substantially increased until the 16th day; subsequently, there was no significant difference observed.**"

- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/

**A second, independent temperature/time data point — optimal pH window reached in 3 days at 15 °C:**

> "Fermentation at **15 °C progressed rapidly, reaching the optimal pH range (4.0–4.5) within 3 days**, and resulted in significantly higher LAB counts and TPC compared to samples stored at 4 °C (p < 0.05). In contrast, prolonged storage at **4 °C** led to a decrease in both TPC, radical scavenging activities, and LAB counts during the excessive fermentation stage."

- **Source:** "Effect of Fermentation Conditions on Functional Quality of Napa Cabbage Kimchi." *Foods* **2025**, 14(16):2826. Peer-reviewed, open access. **[MEASURED] [STRONG]**
- **URL:** https://pubmed.ncbi.nlm.nih.gov/40870738/ *(PMID 40870738 — verified; MDPI's own site returns HTTP 403 to automated retrieval, so this record is the reliable access point)*
- ✅ Note this paper **independently defines the optimal kimchi pH range as 4.0–4.5**, consistent with the 4.2 (CSU) and 4.3 (Nutr Res Pract) figures above.

### C4. Kimchi: terminal pH after extended fermentation

**[MEASURED] [MODERATE-STRONG]**

> "The pH of the two groups, which were fermented at **10 and 25 °C**, decreased rapidly at the beginning of fermentation and then **reached pH 3.96 and pH 3.62**."

- **Source:** "Effect of Enterotoxigenic *Escherichia coli* on Microbial Communities during Kimchi Fermentation." *Journal of Microbiology and Biotechnology* (2021). Peer-reviewed.
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC9705866/ *(PMC ID 9705866 — verified by title/journal/year lookup)*
- **Terminal pH: 3.96 at 10 °C; 3.62 at 25 °C.** Strong evidence that **terminal kimchi pH is temperature-dependent**, and that warm fermentation drives pH lower.

**[MEASURED] [MODERATE]** — A separate kimchi study reported a much shallower endpoint, illustrating the spread across studies:
> "…with concomitant **pH decrease from 6.39 to 4.34** and **acidity increase from 0.06% to 0.35%**."
- **Source:** "Effect of pasteurization on delayed kimchi ripening and regression analysis for shelf life estimation of kimchi." *Food Science & Nutrition* (2019). Peer-reviewed, open access.
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC6392831/ *(PMC ID 6392831 — verified)*
- ⚠️ **Note the discrepancy:** 0.35% acidity here vs 0.8% "moderate ripening" in the *Foods* 2020 paper. **Titratable acidity values for kimchi are NOT directly comparable across papers** because endpoint pH (8.3 vs phenolphthalein), normality, and sample dilution vary. Compare acidity values only within a study, or verify the titration method.

### C5. Cucumber pickles — terminal pH and the pH 3.6 quality floor

**[MEASURED] [STRONG] — 6-month commercial-style storage study**

> "Our findings revealed that, **when pH declined to 3.6, undesirable textural and sensory properties were observed in the pickled cucumbers.** However, pickles treated with CaCl₂ and calcium acetate exhibited higher pH levels compared to other samples after 6 months. Calcium ions demonstrated a positive effect on firmness… firmness followed the order of Ca(C₂H₃O₂)₂ > CaCl₂ > KCl > MgCl₂ > AlCl₃."
> Fermentation brines: various salts at 50, 100, 200, 400 ppm **alongside 6% NaCl**.

- **Source:** "Enhancing the Texture and Sensory Properties of Pickled Cucumbers with Different Brine Solutions." *Foods* **2025**. Peer-reviewed, open access.
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC11817513/ *(PMC ID 11817513)*
- 🔎 **This gives a concrete pH 3.6 as the point where brined cucumber quality degrades** — supporting the "3.3–3.6 = fully sour but quality-limiting" framing. It is a **quality/texture** threshold, not a safety threshold.
- ⚠️ **Note the 6% NaCl brine** — much higher than typical home cucumber pickling (~5% brine / 3.5% equilibrium), so absolute rates are not directly transferable.

**Supporting note on cucumber buffering and pH floor:** USDA ARS work documents that cucumber fermentation pH is influenced by the fruit's buffering capacity and by added Ca(OH)₂/calcium salts; in one starter-culture study, LAB "reduced the pH to **5.60 ± 0.51** by the time they reached maximum cell densities" in cucumber fermentation medium — i.e. early-stage, not terminal.
- **Source:** "Methods for Maintaining and Using Lactic Acid Bacteria Starter Cultures for Commercial Cucumber Fermentation Brined With Low Salt." *Journal of Food Science* (2026);91(8):e71363. **[MEASURED] [MODERATE]**
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC13498662/ *(PMC ID 13498662 — verified)*

**[MEASURED] [MODERATE]** — Commercial cucumber fermentation spoilage (secondary fermentation) is driven by **yeasts** (*Pichia manshurica*, *Issatchenkia occidentalis*) consuming lactic acid, causing **pH to RISE** — the mechanism by which a fully-soured, shelf-stable brine destabilises:
> "…yeast metabolic activities lead to lactic acid degradation, a small decline in the redox potential… and **an increase in pH to levels at which bacteria other than the lactic acid bacteria responsible for the primary fermentation can grow** and produce acetic, butyric, and propionic acids."
> Estimated loss: **"$6,000 to $15,000 per affected tank."**
- **Source:** "Characteristics of Spoilage-Associated Secondary Cucumber Fermentation." (2012). **[MEASURED] [STRONG]**
- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC3273025/ *(PMC ID 3273025)*
- 🔎 **Key shelf-stability mechanism:** in brined cucumber stock, the risk at terminal pH is not insufficient acidity but **loss of acidity** (lactic acid catabolism by yeasts), which raises pH back toward unsafe territory.

### C6. *Lactiplantibacillus plantarum* — terminal pH and acid tolerance

**[MEASURED] [MODERATE]** — *L. plantarum* is characterised in the literature as a highly acid-tolerant, homofermentative vegetable LAB that "produces high acidity in all vegetable fermentations and plays the [dominant role]" (FAO, URL above).

Concrete measured values located:

| Value | Context | Source | Confidence |
|---|---|---|---|
| **pH 6.1 → 3.8 in 6 h**, 8.1 g/L lactic acid | Yam fermentation; *Lactobacillus plantarum* CCMA 0744 co-inoculated with *Leuconostoc lactis* CCMA 0415 and *L. fermentum* CCMA 0745 (the pH drop is attributed primarily to *L. lactis*) | *Brazilian Journal of Microbiology* (2019) — https://pmc.ncbi.nlm.nih.gov/articles/PMC6863312/ | **MODERATE** (mixed culture; not *L. plantarum* alone) |
| **Growth at pH 3.0** | *Leuconostoc mesenteroides* kimchi starters "can grow under pH 3.0 and low temperature conditions of 5 °C" | *J. Microbiol. Biotechnol.* (2020);30(7):1060–1066 — https://pubmed.ncbi.nlm.nih.gov/32270659/ | **MODERATE** (different genus — *Leuconostoc*, not *L. plantarum*) |
| Terminal acidity **1.5–2% lactic acid** reached by *L. plantarum*/*L. cucumeris* stage in sauerkraut | Classic sauerkraut succession | FAO, https://www.fao.org/4/x0560e/x0560e10.htm | **STRONG** (FAO, but a classic/consensus account rather than a single new measurement) |

⚠️ **FLAGGED GAP:** I could **not** locate a single controlled study reporting a definitive **terminal pH floor for *L. plantarum* alone in a vegetable fermentation** (i.e. the pH at which its own metabolism stops). The frequently repeated "**L. plantarum does not grow below pH 3.2**" figure was **NOT** traceable to a primary source in this research. **Do not cite 3.2 as a *L. plantarum* limit without a primary source.** What is well-supported is that *L. plantarum* is among the most acid-tolerant vegetable LAB, that it dominates the late/middle sauerkraut stage, and that **sauerkraut/kimchi terminal pH lands in the 3.3–4.0 range** (see C1–C4), which empirically bounds the consortium's acid tolerance.

### C7. FAO/WHO and other international documents

**Found:** FAO *Fermented fruits and vegetables: A global perspective* — the acidity succession data in C1, plus the qualitative statement:
> "The **optimum pH for most bacteria is near the neutral point (pH 7.0)**. Certain bacteria are acid tolerant and will survive at reduced pH levels."

- **URL:** https://www.fao.org/4/x0560e/x0560e10.htm
- Companion FAO chapter (combined methods, minimally processed vegetables): https://www.fao.org/4/y4358E/y4358e08.htm — **retrieved and searched; contains NO numeric pH target for fermented vegetables** (it is oriented to MAP/combined preservation, not lactic fermentation endpoints). ⚠️ **Negative finding.**

⚠️ **FLAGGED GAP:** I did **not** locate a **FAO/WHO (Codex) document specifying a numeric pH target of 4.0 or 3.8 for fermented vegetables.** Codex has a *Standard for Kimchi* (CXS 223-2001) but I could not verify whether it specifies pH or acidity — **see Gaps.**

---

## Summary Table — What Each Number Actually Is

| Value | Classification | What it is | Best primary source |
|---|---|---|---|
| **pH 4.6** | **REGULATORY** | Acidified-food / low-acid dividing line; a<sub>w</sub> > 0.85 conjunctive | [21 CFR 114.3](https://ecfr.io/Title-21/Section-114.3) |
| **pH 4.6** | **MEASURED (FDA)** | Min pH for **proteolytic** *C. botulinum* growth | [FDA HACCP Guide 2022, Table A-1](https://www.fda.gov/media/80637/download) |
| **pH 5.0** | **MEASURED (FDA)** | Min pH for **non-proteolytic** *C. botulinum* / Type E | Same |
| **a<sub>w</sub> 0.935 / 0.97** | **MEASURED (FDA)** | Min a<sub>w</sub>, proteolytic / non-proteolytic *C. botulinum* | Same |
| **"within the time designated in the scheduled process"** | **REGULATORY** | The actual acidification deadline rule (no fixed hours) | [21 CFR 114.80(a)(1)](https://ecfr.io/Title-21/Section-114.80) |
| **24 hours** | **CONVENTION (peer-reviewed attribution)** | Acidified foods to pH ≤ 4.6 within 24 h of packaging, else refrigerate | [Acosta et al. 2014, Cornell](https://pubmed.ncbi.nlm.nih.gov/24780334/) |
| **~24 hours** | **STATE GUIDANCE** | Time to **wait before measuring** equilibrium pH (not a deadline) | [PA Dept. of Agriculture](https://www.pa.gov/content/dam/copapwp-pagov/en/pda/documents/consumer_protection/foodsafety/documents/canning-%20limited%20food%20establishments%201.11.24.pdf) |
| **pH 4.5** | **REGULATORY** | Canned **artichokes** acidification ceiling | [21 CFR 155.200(c)](https://www.law.cornell.edu/cfr/text/21/155.200) |
| **pH 4.0** | **REGULATORY (analytical)** | Above 4.0, finished equilibrium pH must be by potentiometric meter | [21 CFR 114.80(a)(2)](https://ecfr.io/Title-21/Section-114.80) |
| **pH 4.2** | **STATE REGULATORY / SENSORY** | PA: "aim for 4.2 or below as extra precaution"; CSU: kimchi optimum | PA (above); [CSU Extension](https://extension.colostate.edu/resource/understanding-and-making-kimchi/) |
| **≥1.5% lactic acid** | **REGULATORY (definition)** | FDA definition of sauerkraut (≥1.0% if rebrined); salt 2–3% | [FDA CPG 585.750](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cpg-sec-585750-sauerkraut-definition-adulteration-thrips) |
| **≥1.0% lactic acid; salt 1.3–2.5%** | **STANDARDS** | USDA grade standard, canned sauerkraut | [USDA AMS](https://www.ams.usda.gov/sites/default/files/media/Canned%20Sauerkraut%20Standard.pdf) |
| **TA 0.9–1.5%; salt 1.4–2.0%** | **MEASURED** | Actual US commercial canned sauerkraut, 8 companies | [Trail & Fleming, USDA ARS](https://www.ars.usda.gov/research/publications/publication?seqNo115=56596) |
| **pH 3.5 / 3.8** | **MEASURED (study design)** | USDA ARS acidified-food pH bands for 5-log pathogen reduction | [ARS Breidt publications](https://www.ars.usda.gov/southeast-area/raleigh-nc/fsmqhru/docs/safety-of-acidified-foods/) |
| **pH 3.3 (24 h @ 75 °F)** | **EXTENSION** | Alternative non-thermal process for acidified foods (not a ferment target) | [NC State Extension](https://aggie-horticulture.tamu.edu/wp-content/uploads/sites/8/2012/03/ncsu-edu_foodscience_extension_program_documents_acid_acidified_foods.pdf) |
| **0.25–0.3% / 1.5–2% / 2–2.5% acidity** | **EXTENSION/INTL** | Sauerkraut LAB succession completion points | [FAO](https://www.fao.org/4/x0560e/x0560e10.htm) |
| **pH 5.6 / 4.3 / 3.8** | **SENSORY (MEASURED)** | Kimchi fresh / optimal / over-ripened | [Nutr Res Pract 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4252523/) |
| **0.4% / 0.8% / >1.0% acidity** | **SENSORY (MEASURED)** | Kimchi low / moderate / over-fermented ripening | [Foods 2020, 9:1075](https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/) |
| **pH 4.0–4.5 in 3 d @ 15 °C** | **MEASURED** | Kimchi optimal window at 15 °C | [Foods 2025, 14:2826](https://pubmed.ncbi.nlm.nih.gov/40870738/) |
| **pH 3.96 (10 °C) / 3.62 (25 °C)** | **MEASURED** | Kimchi terminal pH | [J Microbiol Biotechnol 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC9705866/) |
| **pH 3.6** | **MEASURED (quality)** | Brined cucumber — undesirable texture/sensory beyond this | [Foods 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11817513/) |
| **pH 3.8 / 4.0 / 4.3** | **MEASURED** | Equilibration endpoints at 7.5 / 4.9 / 2.5% acetic brine (eggs) | [Acosta et al. 2014](https://pubmed.ncbi.nlm.nih.gov/24780334/) |

---

## EXPLICIT GAPS — Data I Could NOT Find

These are flagged deliberately. **Do not fill them with plausible-sounding numbers.**

1. **❌ "pH 4.8" as a *C. botulinum* limit — NOT FOUND.** No FDA/USDA/ICMSF/ICMSF-equivalent source giving 4.8 for *C. botulinum* was located. FDA's own Table A-1 gives **4.6** (proteolytic) and **5.0** (non-proteolytic). The 4.8 figure appears in FDA's table only for *Shigella* spp. and *Vibrio parahaemolyticus*. **Treat any "pH 4.8 for botulism" claim as unsourced.**

2. **❌ A literal "24 hours" acidification deadline in 21 CFR 114 — NOT FOUND.** The CFR says "within the time designated in the scheduled process." The 24-hour figure is a Cornell-attributed convention (Acosta et al. 2014) and matches industry practice, but **it is not the codified text**. I could not locate an FDA guidance document that states a flat 24-hour acidification requirement.

3. **❌ Penn State Extension numeric pH target — DOES NOT EXIST** in the two sauerkraut/fermentation publications retrieved (verified by exhaustive full-text search). Penn State gives time–temperature only. **If a secondary source attributes a "Penn State pH 4.0" target, that attribution is false.**

4. **❌ USDA Complete Guide to Home Canning numeric pH target for sauerkraut/pickles — DOES NOT EXIST.** Guide 6 contains **zero** instances of "pH." Guide 1 states only the 4.6 dividing line. **No 4.0/3.8 target anywhere in the Complete Guide.**

5. **❌ Cornell Cooperative Extension publication with a numeric pH target — NOT FOUND.** Only an event listing was located. (The Cornell *Food Science* department publication on the 24-hour rule is a peer-reviewed journal article, not a CCE extension publication — a different unit.)

6. **❌ Commercial sauerkraut pH specification of "3.5–3.8" — NOT SUBSTANTIATED.** What USDA ARS measured in 8 commercial products was **titratable acidity 0.9–1.5%**, not a pH setpoint. No company specification sheet or trade-standard pH target was located. **The "3.5–3.8 commercial sauerkraut" claim appears to be folklore or a private spec; it is not documented in accessible public sources.**

7. **❌ A definitive terminal pH floor for *Lactiplantibacillus plantarum* ALONE in vegetable fermentation — NOT FOUND.** The common "does not grow below pH 3.2" figure could not be traced to a primary source. Terminal consortium pH for sauerkraut/kimchi is empirically ~3.3–4.0, but attributing that floor specifically to *L. plantarum* is not supported by the sources located.

8. **❌ Terminal pH values for carrots, turnips, cauliflower, peppers, radish, beetroot, green beans, onions, garlic — LARGELY NOT FOUND as clean terminal-pH figures.** Searches surfaced only partial/indirect data (e.g. the *J Food Sci* 2026 cucumber-medium value pH 5.60 ± 0.51, which is an early-stage not terminal value). **I did not find a reliable set of measured terminal pH values for these individual vegetables.** This is a genuine literature gap in accessible open sources, or at least one I could not close within this research.

9. **❌ Codex Standard for Kimchi (CXS 223-2001) numeric pH/acidity requirement — NOT VERIFIED.** I did not retrieve the Codex text; cannot confirm whether it specifies pH or titratable acidity. **Unresolved.**

10. **❌ Full text of *Clostridium botulinum and Acid Foods* (J. Food Prot.) — NOT READ.** ScienceDirect returned HTTP 403 to automated retrieval. Only the citation is confirmed; **no numbers from it are quoted above.**

11. **❌ Several USDA ARS "Pickle Pubs" sauerkraut papers are image-only scans** (verified HTTP 200 but no text layer):
    - *Considerations for the Controlled Fermentation and Storage of Sauerkraut* — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf
    - *A New Look at Sauerkraut Fermentation* — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p155.pdf
    - *Residual Sugars and Fermentation Products in Raw and Finished Commercial Sauerkraut* — https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p182.pdf

    All three were downloaded successfully but **contain no extractable text** (`pdftotext` produced 0 lines; `pdffonts` shows no font objects — pure scan). No OCR tooling was available in this environment. **These are very likely to contain the definitive sauerkraut terminal-pH data — OCR is the recommended follow-up.**

12. **❌ MDPI full texts blocked** (HTTP 403 to automated retrieval) for *Foods* 9(8):1075, *Foods* 2025 kimchi, *Microorganisms* 9(12):2570, *Applied Sciences* 15(18):9934. Abstracts were obtained via PubMed/PMC E-utilities; **figure-level pH curves were not read.**

13. **❌ FAO/WHO numeric pH target of 4.0/3.8 for fermented vegetables — NOT FOUND.** FAO documents retrieved give **titratable acidity** stages, not pH targets.

---

## Three Corrections Worth Propagating

1. **21 CFR 155.200 does NOT contain a sauerkraut standard of identity.** Canned sauerkraut has **no** FDA standard of identity. The operative federal numeric definition is **FDA CPG Sec 585.750: ≥1.5% lactic acid, 2–3% salt** (≥1.0% if rebrined). The separate **USDA grade standard** uses **≥1.0% lactic acid, 1.3–2.5% salt**.
2. **There are two different "24 hours" in acidified foods, and they are not the same thing.** (a) *Acidify to pH ≤ 4.6 within 24 h of packaging or refrigerate* — Cornell attribution to federal rules. (b) *Wait ~24 h after processing before measuring equilibrium pH* — PA Dept. of Agriculture. Conflating them produces a false regulatory claim.
3. **pH 4.6 is a proteolytic-strain number.** FDA's own table gives **pH 5.0** for non-proteolytic *C. botulinum* and Type E, and **a<sub>w</sub> 0.97** vs **0.935**. Any statement that "4.6 is the minimum pH for *C. botulinum*" is imprecise; it is the minimum for the proteolytic group.

---

*Report compiled from primary documents retrieved during research. Numbers are quoted verbatim from sources wherever a quotation appears. Negative findings are stated as such and should be treated as results.*
