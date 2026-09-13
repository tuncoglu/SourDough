# Salt TYPE / Salt QUALITY in Sauerkraut and Other Vegetable Ferments — Evidence Report

**Scope:** Experimental studies that vary salt *type, origin, purity, or mineral composition* (not merely salt *concentration*) in sauerkraut and other vegetable fermentations (kimchi, suan-tsai, cucumber pickle, pepper mash).

**Retrieval honesty note:** Every citation below was actually returned by `web_search`, `web_fetch`, the CrossRef API, the PubMed/PMC E-utilities API, or a PDF I downloaded and text-extracted. Where I could only obtain a title/metadata and not the abstract or full text, I say so explicitly and report only what I actually saw. Retrieval failures are named.

**Headline finding:** The peer-reviewed literature on "salt quality" in sauerkraut is almost entirely about **partial NaCl replacement by KCl (and MgCl₂/CaCl₂)** and **iodisation** — i.e. salt *composition*. There is **no experimental study** comparing unrefined/artisanal salt *origin* (sel gris, grey salt, fleur de sel, Himalayan pink, bay salt, rock salt) against refined NaCl in **sauerkraut**. That specific gap is real and is stated explicitly in §6.

---

## 1. The known paper: Viander, Mäki & Palva (2003)

### 1.1 CLAIM
Low NaCl (0.5%) and mineral salt (0.5% of a 28% KCl / 57% NaCl blend, giving 0.3% NaCl) can replace 1.2% NaCl in a **430 kg** spontaneous industrial-scale white-cabbage sauerkraut / sauerkraut-juice fermentation without loss of fermentation security, and the mineral-salt juice was judged **best** in taste.

### 1.2 NUMBERS (as actually retrieved)
| Parameter | Trial 1A–C | Trial 2A–C | Trial 3A–C |
|---|---|---|---|
| Salt added | 0.5% NaCl | 0.5% mineral salt (28% KCl, 57% NaCl) | 1.2% NaCl |
| Resulting NaCl | 0.5% | **0.3%** | 1.2% |
| LAB reaching 10⁸ cfu/ml | **day 4** | **day 6** | **day 3** |
| LAB at end of fermentation (pressed juice) | 10⁸ cfu/ml | 10⁸ cfu/ml | 10⁸ cfu/ml |
| Scale | 430 kg, three parallel trials each (A–C) | same | same |

- **pH:** decreased *somewhat faster* at 1.2% NaCl; the pH drop was "much the same in all cabbage containers" and **no significant differences after the sixth fermentation day**.
- **Lactic acid:** production was **clearly lower after 2 weeks** in the 0.5% mineral-salt trials vs the other trials.
- **Acetic acid:** "**No major difference** could be detected between the acetic acid concentrations in the different trials."
- **Sensory:** the sauerkraut juice fermented with **0.5% mineral salt was considered to have the best taste** (trained taste panel).
- **Shelf-life at 4 °C:** LAB counts decreased in all juices; yeasts and moulds, enterobacteria, and mesophilic and thermophilic spores all decreased during storage.

### 1.3 SOURCE
Viander B, Mäki M, Palva A (2003). "Impact of low salt concentration, salt quality on natural large-scale sauerkraut fermentation." *Food Microbiology* **20**(4):391–395. DOI: [10.1016/S0740-0020(02)00150-8](https://doi.org/10.1016/S0740-0020(02)00150-8)

Abstracts retrieved and cross-checked at two independent sources (identical wording, including the restored superscript "10⁸ cfu/ml"):
- https://search.isc.ac/inventory/10/1189220.htm (the URL supplied by the requester)
- https://dev.europepmc.org/pub/databases/pmc/article-html/AGR/23/3/3/0/agr-IND23330968.html
- Metadata confirmed via CrossRef API: https://doi.org/10.1016/s0740-0020(02)00150-8

### 1.4 CONFIDENCE
**Strong** for the claims and numbers listed (abstract is unambiguous and independently duplicated).

### 1.5 STUDY-QUALITY NOTE + RETRIEVAL GAP
- Real food, industrial scale (430 kg), 3 salt regimes × 3 parallel trials (A–C) = 9 vessels; genuine large-scale replication.
- **RETRIEVAL FAILURE — be aware:** the **full text is paywalled and I could not obtain it.** ScienceDirect returned HTTP 403 (both via `web_fetch` and via a browser-user-agent `curl`); Semantic Scholar reports the paper as `openAccessPdf: CLOSED`; Europe PMC has only the AGR abstract; the Helsinki research portal record contains no full text.
- **Therefore: per-day numeric pH values, per-day LAB counts, and absolute lactic/acetic acid concentrations (g/L) are NOT retrievable and are NOT reported here.** The requester's request for "pH by day, LAB CFU/ml by day, lactic/acetic acid concentrations" **cannot be satisfied from open sources**; only the day-on-which-10⁸ cfu/ml was reached is available. Anyone needing the curves must obtain the publisher PDF.

---

## 2. Other sauerkraut studies that vary salt type / composition

### 2.1 Wolkers-Rooijackers, Thomas & Nout (2013) — the closest thing to a "sea-salt mineral profile" test in sauerkraut

**CLAIM.** A 40% partial sodium replacement (NaCl + KCl + MgCl₂ + CaCl₂) maintains sauerkraut quality and safety equal to full-salt control, whereas simple salt *reduction* (no mineral replacement) destroys texture.

**NUMBERS.**
| Treatment | Composition |
|---|---|
| **[A] control** | 15 g kg⁻¹ NaCl |
| **[B] reduced salt** | 9 g kg⁻¹ NaCl (no replacement) |
| **[C] 40% partial Na replacement** | 9 g kg⁻¹ NaCl + **4.5 g kg⁻¹ KCl** + **0.75 g kg⁻¹ MgCl₂** + **0.75 g kg⁻¹ CaCl₂** |

- **pH 3.4–3.7 in all treatments**; microbiological safety similarly assured in all samples.
- **PCR-DGGE + cloning:** *Lactococcus lactis* and *Leuconostoc mesenteroides* dominated [A], [B] and [C]; **[C] showed additional abundance of *Lactobacillus paraplantarum* and *Lactobacillus curvatus***. Differences in microbial flora between treatments during the first weeks of fermentation.
- **[B] failed industrial quality criteria — texture too soft** compared with [A] and [C].
- **Sensory:** [A] and [C] **equally acceptable** to an industrial panel for aroma, taste and texture.

**SOURCE.** Wolkers-Rooijackers JCM, Thomas SM, Nout MJR (2013). "Effects of sodium reduction scenarios on fermentation and quality of sauerkraut." *LWT – Food Science and Technology* **54**(2):383–388. DOI: [10.1016/j.lwt.2013.07.002](https://doi.org/10.1016/j.lwt.2013.07.002) — full abstract retrieved at https://agris.fao.org/search/en/records/669f656e00eb85b7d72c8ed7 (AGRIS record supplied by Wageningen University & Research). ScienceDirect (https://www.sciencedirect.com/science/article/abs/pii/S0023643813002521) returned HTTP 403.

**CONFIDENCE.** **Strong.** The abstract states all treatments, doses and outcomes numerically.

**STUDY-QUALITY NOTE.** Real food (white cabbage), lab/pilot scale (not stated in abstract), full factorial 3-treatment design with microbial ecology (PCR-DGGE + cloning), texture and trained/industrial sensory panel. **This is the single most mechanistically relevant sauerkraut paper for the "does the mineral load of unrefined salt matter?" question**, because MgCl₂ + CaCl₂ is exactly the mineral fraction that distinguishes unrefined sea salt from purified NaCl.

---

### 2.2 Wiander & Ryhänen (2005) — mineral salt + commercial starters, lab and large scale

**CLAIM.** Mineral salt with low NaCl content, combined with commercial starter cultures, gives a controllable fermentation and a highly acceptable, uniform sauerkraut juice.

**NUMBERS.** Mineral salt contained **57% NaCl and 28% KCl**; **NaCl content in the sliced white cabbage = 0.5% w/w**. pH decreased rapidly at the start. LAB, yeasts and moulds, enterobacteria, mesophilic and thermophilic spores were enumerated. Taste panel found juices "highly acceptable"; the **mineral salt + *Leuconostoc mesenteroides*** combination gave an especially mild-tasting juice. *(No numeric pH/CFU values appear in the retrieved abstract.)*

**SOURCE.** Wiander B, Ryhänen E-L (2005). "Laboratory and large-scale fermentation of white cabbage into sauerkraut and sauerkraut juice by using starters in combination with mineral salt with a low NaCl content." *European Food Research and Technology* **220**:191–195. DOI: [10.1007/s00217-004-1080-5](https://doi.org/10.1007/s00217-004-1080-5) — abstract retrieved at https://agris.fao.org/search/en/records/65e001bcb766d82b1803f1e1

**CONFIDENCE.** **Moderate** (claim and formulation clear; no numeric outcomes in abstract; full text not retrieved).
**QUALITY NOTE.** Lab + large scale, real food, starter combinations; abstract does not state n or replicate count.

---

### 2.3 Wiander & Palva (2011) — mineral-salt dose optimisation (FULL TEXT OBTAINED)

**CLAIM.** Mineral salt (Pansuola®) at 0.8–1.5% produces good sauerkraut and sauerkraut juice at final NaCl 0.5–0.9%; 0.8% mineral salt gave the best sensory quality.

**NUMBERS (extracted from the open-access full text).**
- **Mineral salt composition (Pansuola®, Oriola Oy, Espoo, Finland):** **57% sodium chloride, 28% potassium chloride, 12% magnesium sulphate, 2% lysine hydrochloride, 1% silicon dioxide, 0.0036% potassium iodide.**
- **Trial 1:** mineral salt at **0.8%, 1.2%, 1.5%** → final NaCl **0.5%, 0.7%, 0.9%**. Duplicate treatments. 2.5 kg sliced cabbage per steel vessel, **20 °C**.
- **pH:** decrease faster at 1.5% than 0.8%; pH of pressed juices similar for 0.8% and 1.2%; somewhat lower for 1.5%. **pH reached 3.8 in 20–25 days.**
- **LAB at juice pressing (Fig. 2):** highest with **1.5% mineral salt**; axis range 0–200 × 10⁶ cfu ml⁻¹. **Yeasts and moulds lowest at 1.5% mineral salt**; axis range 0–14 000 cfu ml⁻¹. *(Exact bar values are in the figure image and were not recoverable from the text layer — I do not guess them.)*
- **Sensory (1–5 scale):** best with **0.8% mineral salt, scores 4–5**; described as "very smooth-tasting".
- **Stated comparison to ordinary salt (no numbers given):** "All the sauerkraut juices were found to have a smoother taste compared to sauerkraut juices produced by using ordinary salt."
- **Trial 2 (garlic/algae):** 0.8% mineral salt + **0.2% fresh garlic** or **1% Vacame algae**; duplicate. Yeasts+moulds **lowest with garlic, highest in control**. Sensory: garlic **3–4**, control **4–5**, algae **2** ("not very appealing… even though acceptable").
- **Trial 3 (slice size), 1 kg cabbage, 0.8% mineral salt, duplicate:** pressed juice yield **≈80% for 1 mm × 1 mm**, **70% for 2 mm × 10 mm**, **60% for 3 mm × 40 mm**.

**SOURCE.** Wiander B, Palva A (2011). "Sauerkraut and sauerkraut juice fermented spontaneously using mineral salt, garlic and algae." *Agricultural and Food Science* **20**(2):169–175. DOI: [10.2137/145960611797215718](https://doi.org/10.2137/145960611797215718) — **open access; PDF downloaded from** https://journal.fi/afs/article/download/6016/5213/14195

**CONFIDENCE.** **Strong** for the formulation, salt levels, pH endpoint, yields and sensory scores; **moderate** for the LAB/yeast comparisons (figure values not machine-readable).
**QUALITY NOTE.** Real food, 20 °C, duplicate treatments, LAB on MRS + 0.02% sodium azide, yeast/moulds on YGC. **Limitations:** n = 2 parallels; **no statistics reported**; the paper's own framing is "preliminary results"; figures dominate and exact values are not tabulated. The comparison with ordinary salt is asserted qualitatively with **no numbers and no side-by-side trial reported in this paper.**

---

### 2.4 Wiander & Korhonen (2011) — mineral salt + isolated LAB + herbs/spices (FULL TEXT OBTAINED)

**CLAIM.** Mineral salt at 0.9% (final NaCl 0.5%) plus isolated LAB starters plus herbs/spices yields sauerkraut juice of good microbiological and sensory quality, with pH 4.0 reached in ~20–25 hours.

**NUMBERS.**
- Mineral salt: **28% KCl and 57% NaCl**; **final NaCl in sliced cabbage mixture = 0.5%**.
- **pH fell to 4.0 in ≈20–25 hours** (starter-assisted) — "considerably shorter fermentation time compared to what is needed in natural sauerkraut fermentations."
- **Raw material:** LAB **10 cfu/g** in cabbage and **15 cfu/g** in mint; yeasts and moulds **2 250 cfu/g** (cabbage) and **13 500 cfu/g** (mint); enterobacteria **148 cfu/g** (cabbage) and **440 cfu/g** (mint).
- **Trial 1 (mint, 2%, triplicate, 6 kg cabbage, 20 °C):** LAB in pressed juice **0.23 × 10⁸ cfu/ml with mint vs 0.17 × 10⁶ cfu/ml without mint**. Yeasts and moulds in pressed juice **12 cfu/ml (mint) vs 22 cfu/ml (control)**. **No enterobacteria detected** in any pressed juice.
- **Trial 2 (0.9% mineral salt, 1.6 kg cabbage, 21 °C, single run per treatment):** aniseed/fennel/caraway/dill/garlic; pH reached **4.0 in 24 h** in all; pH reduction slower with garlic; **LAB growth slowest with garlic**. No yeasts, moulds or enterobacteria detected in any pressed juice.
- **Sensory (5-point):** mint, aniseed, fennel, dill **5/5**; garlic **4/5**; control **4/5**; **caraway 2/5** (acceptable but not appealing).

**SOURCE.** Wiander B, Korhonen HJT (2011). "Preliminary studies on using LAB strains isolated from spontaneous sauerkraut fermentation in combination with mineral salt, herbs and spices in sauerkraut and sauerkraut juice fermentations." *Agricultural and Food Science* **20**(2):176–182. **Open access; PDF downloaded from** https://journal.fi/afs/article/download/6017/5214/14196 (article landing page: https://journal.fi/afs/article/view/6017)

**CONFIDENCE.** **Strong** for the numbers listed (read directly from the PDF).
**QUALITY NOTE.** Real food; trial 1 triplicate (n = 3), trial 2 **n = 1 per treatment**; no statistics reported; authors label it "preliminary". **Note the internal oddity:** the 100-fold LAB gap between mint (0.23 × 10⁸) and no-mint (0.17 × 10⁶) is reported without replication statistics and should be treated cautiously.

---

### 2.5 Müller et al. (2018) — IODIZED table salt vs non-iodized (the folklore claim, tested)

**CLAIM.** Iodine in iodized table salt does **not** inhibit the lactic acid bacteria of sauerkraut fermentation. The popular belief that it does has no basis in this trial.

**NUMBERS.**
- **1.0% table salt**; iodine effect tested with selected starter cultures and without starters (spontaneous).
- ***Lactobacillus plantarum* + *Leuconostoc mesenteroides* starters at ≈1 × 10⁷ cfu ml⁻¹** → rapid LAB predominance, reaching **1 × 10⁹ cfu ml⁻¹ after 24 h**, **pH < 4.0**.
- **Control (no starter):** LAB rose more slowly from **1 × 10⁵ cfu ml⁻¹ to 1 × 10⁹ cfu ml⁻¹**; **pH < 4.0 only after 3 days**.
- **Metagenomics:** more diverse bacterial community without starters (enterobacteria and pseudomonads in the first days; lactococci later). With starters, lactobacilli predominated; leuconostocs occurred at much lower sequence abundance and did not predominate.
- **Iodine concentration was not affected by the fermentation.**
- **Statistics:** iodized salt did **not statistically significantly** influence microbial populations. A **near-significant effect (p = 0.06)** was noted for iodine on **yeasts and moulds** in fermentations **without starter cultures** — flagged by the authors for further work because sauerkraut is usually produced without starters.

**SOURCE.** Müller A, Rösch N, Cho GS, Meinhardt AK, Kabisch J, Habermann D, Böhnlein C, Brinks E, Greiner R, Franz CMAP (2018). "Influence of iodized table salt on fermentation characteristics and bacterial diversity during sauerkraut fermentation." *Food Microbiology* **76**:473–480. DOI: [10.1016/j.fm.2018.07.009](https://doi.org/10.1016/j.fm.2018.07.009), PMID 30166176. Abstract retrieved via PubMed E-utilities: https://pubmed.ncbi.nlm.nih.gov/30166176/

**CONFIDENCE.** **Strong** for the abstract's stated findings.
**QUALITY NOTE.** Real food, starter vs spontaneous factorial design, culture-based enumeration + metagenomic community profiling, iodine quantified analytically. Full text not retrieved (abstract only) — n, replicate counts and exact iodine concentrations (mg/kg) are **not** available from what I retrieved.

---

### 2.6 Li et al. (2022) — KCl-for-NaCl replacement in Northeast China sauerkraut

**CLAIM.** The proportion of KCl substituting NaCl significantly affects sauerkraut fermentation kinetics, organic-acid profile and sensory quality; substitution should not exceed 50%.

**NUMBERS (from the abstract only).**
- KCl proportion had a **significant impact on fermentation kinetics**, especially titratable acid (TTA) and reducing sugar (RS).
- **Malic acid, acetic acid, lactic acid and succinic acid differed significantly between treatments (p < 0.05).**
- **LAB numbers were also affected by KCl.**
- **QDA (quality descriptive analysis): KCl substitution ratio ≤ 50%** to avoid unacceptable taste and low overall liking.
- *(Absolute concentrations of the four organic acids are in the full text, which I could not retrieve — Wiley paywall. I do not invent them.)*

**SOURCE.** Li Z, Xie S, Sun B, Zhang Y, Liu K, Liu L (2022). "Effect of KCl replacement of NaCl on fermentation kinetics, organic acids and sensory quality of sauerkraut from Northeast China." *Journal of Food Processing and Preservation* **46**(9); DOI: [10.1111/jfpp.16622](https://doi.org/10.1111/jfpp.16622) (published online 24 Apr 2022, print Sept 2022). **CrossRef returns `page: None` and `article-number: None` for this record, so no page or article number is asserted here.** Abstract retrieved at https://dev.europepmc.org/pub/databases/pmc/article-html/AGR/07/9/3/5/agr-IND607935697.html; bibliographic metadata confirmed via CrossRef API.

**CONFIDENCE.** **Moderate** (clear directional findings and a concrete sensory threshold, but no numeric values in the retrieved abstract; full text paywalled).
**QUALITY NOTE.** Real food (Northeast China sauerkraut), kinetics + organic acids + QDA. n and replicate structure not available from the abstract.

---

### 2.7 Wiander & Ryhänen (2008) — CITED BUT NOT RETRIEVED

**Citation only (taken from the reference list of Wiander & Korhonen 2011, which I did read in full):** Wiander B & Ryhänen E-L (2008). "Identification of lactic acid bacteria strains isolated from spontaneously fermented sauerkraut and their use in fermentation of sauerkraut and sauerkraut juice in combination with a low NaCl content." *Milchwissenschaft* **63**:386–389.

I did **not** retrieve this paper's abstract or full text. I therefore make **no claim** about its numbers. It is listed here only because it belongs to the Finnish low-NaCl/mineral-salt sauerkraut series. **Confidence: not assessable.**

---

## 3. Naming note: "Pansalt" vs "Pansuola"

The requester asked about "**Pansalt**". In the retrieved Finnish papers the product is named **Pansuola®** (Finnish for "salt substitute"), marketed by Oriola Oy, Espoo, Finland, with the composition given in §2.3 (57% NaCl, 28% KCl, 12% MgSO₄, 2% lysine HCl, 1% SiO₂, 0.0036% KI). **None of the retrieved papers uses the brand string "Pansalt"**; "Pansalt" is the international brand name of the same KCl-based concept. No paper I retrieved tests a product explicitly labelled "Pansalt" in sauerkraut.

---

## 4. Sauerkraut adjacent evidence: salt CONCENTRATION (NOT salt type)

These are listed to **delimit** the evidence and to prevent conflation. **None of them varies salt type.**

| Study | Salts tested | Key numbers |
|---|---|---|
| Yang X et al. (2020) *J Appl Microbiol* 129(6):1458–1471, DOI [10.1111/jam.14786](https://doi.org/10.1111/jam.14786), PMID 32677269 | **0.5, 1.5, 2.5, 3.5% (w/w)** NaCl only | LAB population significantly highest at **2.5%**; fastest pH decrease and acid accumulation at 2.5%; glucose (HPLC) consumed most completely at 2.5%; PCA showed clear metabolite separation by salt level; **higher level of volatiles by HS-SPME/GC-MS at 2.5%**; best sensory at 2.5% |
| Yang X et al. (2020) *Food Res Int* 130:108926, DOI [10.1016/j.foodres.2019.108926](https://doi.org/10.1016/j.foodres.2019.108926), PMID 32156375 | salt **concentrations**, starter *Ln. mesenteroides* ORC 2 + *L. plantarum* HBUAS 51041 | **46 flavour metabolites** by HS-SPME/GC-MS; most abundant *Lactobacillus* (**88.46%**) in 0.5% salted sauerkraut at day 30; highest esters/aldehydes/ketones at **0.5%**; 2.5% and 3.5% characterised by higher acids, alcohols, isothiocyanates, hydrocarbons; Spearman correlations with *Lactobacillus*, *Leuconostoc*, Enterobacteriaceae, *Pseudomonas*, *Staphylococcus*, *Bacillus* |
| Peñas E et al. (2010) *J Agric Food Chem* 58:3549–3557 | different **NaCl levels** | cited in Wiander & Palva 2011 reference list; not independently retrieved |
| Johanningsmeier SD et al. (2007) *J Food Sci* 72:M166–M172 | **reduced salt concentrations** + *Ln. mesenteroides* starter | cited in Wiander & Palva 2011 reference list; not independently retrieved |
| Tolonen M et al. (2002) *J Agric Food Chem* 50:6798–6803, DOI [10.1021/jf0109017](https://doi.org/10.1021/jf0109017) | low-salt sauerkraut | Cited by the Wiander papers as a low-NaCl study; **abstract not retrievable** (CrossRef returned no abstract). Listed as citation-only. |

---

## 5. Salt type in OTHER vegetable ferments

### 5.1 Kimchi — the richest body of salt-type evidence anywhere in vegetable fermentation

#### 5.1.1 Chang, Kim & Chang (2011) — 4-year solar salt vs 1-year solar salt vs purified salt

**CLAIM.** Aged solar salt (esp. 4-year) outperforms purified salt in kimchi fermentation.

**NUMBERS.** Chinese cabbage brined with **four-years aged solar salt (FS)**, **one-year aged solar salt (OS)**, **purified salt (PS)**; **7 °C for 33 days**.
- **pH/acidity:** changes were **slower with PS** than with FS/OS; PS reached the optimal edible stage later but acidity then rose sharply.
- **LAB:** FS and OS rose from **7.10–7.22 log CFU/mL (day 0)** to **9.26–9.42 log CFU/mL (day 12)**, then declined to **8.04–8.75 log CFU/mL by day 33**. PS rose slowly from **7.24 log CFU/mL (day 0)** to **8.99 log CFU/mL (day 27)**, then fell sharply to **7.92 log CFU/mL by day 33**.
- **Yellowness (b):** PS **59.10** > FS **53.68** ≈ OS **53.77**.
- **Hardness:** FS kimchi firmest after 33 d.
- **Dominance of the starter *Leuconostoc citreum* GJ7 at day 33:** FS **80.2%**, OS **75.8%**, PS **61.3%**.
- **Sensory:** FS scored highest. Authors attribute differences to Na, Cl and **various mineral composition and concentration of the salts**.

**SOURCE.** Chang J-Y, Kim I-C, Chang H-C (2011). "Effect of Solar Salt on the Fermentation Characteristics of Kimchi." *Food Science and Preservation* **18**(2):256–265. DOI: [10.11002/kjfp.2011.18.2.256](https://doi.org/10.11002/kjfp.2011.18.2.256) — retrieved at http://koreascience.kr/article/JAKO201120661418110.pub. *(Journal-name note: the publisher page gives "Food Science and Preservation"; the CrossRef record for the same DOI gives "Korean Journal of Food Preservation" — the journal was renamed, same ISSNs 3022-5477 / 3022-5485.)*

**CONFIDENCE.** **Strong** for the listed numbers (abstract retrieved with full numeric detail, both English and Korean).
**QUALITY NOTE.** Real food, 7 °C/33 d, three salt types, bacteriocin-producing *Leuc. citreum* GJ7 starter used to equalise fermentation conditions. **Limitation:** it is a **solar-salt ageing** comparison (1 yr vs 4 yr) plus a purified-salt control — it isolates *salt type* but confounds it with *salt age*; the mineral data are invoked in discussion, not reported in the retrieved abstract.

#### 5.1.2 Lee KW et al. (2018) — purified vs solar (1 yr, 3 yr) vs bamboo salt

**CLAIM.** Solar salt kimchi maintains more coccus-type LAB and suppresses yeasts relative to purified salt.

**NUMBERS.** Purified salt (**PS**), solar salt 1 year (**SS1**), solar salt 3 years (**SS3**), bamboo salt (**BS**) — with *Ln. mesenteroides* P30 starter kimchi and non-starter control kimchi; **stored at −1 °C for 20 weeks**.
- **Titratable acidity reached 0.96–1.01% (pH 3.73–3.83) at 20 weeks.**
- **Coccus-type LAB as % of total LAB, non-starter kimchi:** at 2 weeks — SS3 **44.7%**, SS1 **41.6%**, BS **32.1%**, PS **29.7%**; at 20 weeks — SS3 **11.5%**, SS1 **12.8%**, BS **6.7%**, PS **5.8%**.
- **Yeasts:** SS kimchi had **much lower yeast counts than PS kimchi**. In starter kimchi, yeasts were detected in PS kimchi at **10 weeks**, but not until **18 weeks** in SS1 and BS kimchi and **20 weeks** in SS3 kimchi.

**SOURCE.** Lee KW, Shim JM, Kim DW, Yao Z, Kim JA, Kim H-J, Kim JH (2018). "Effects of different types of salts on the growth of lactic acid bacteria and yeasts during kimchi fermentation." *Food Science and Biotechnology* **27**(2):489–498. DOI: [10.1007/s10068-017-0251-7](https://doi.org/10.1007/s10068-017-0251-7), PMID 30263773, PMCID PMC6049633. Abstract retrieved via PubMed E-utilities.

**CONFIDENCE.** **Strong** for the percentages and timepoints (directly from the abstract).
**QUALITY NOTE.** Real food, 4 salt types × 2 starter regimes, 20-week storage at −1 °C, microbiological enumeration with LAB differentiation. **Retrieval note:** PMC lists it as **not open access** (`isOpenAccess: N`); Europe PMC full-text XML returned HTTP 404. Numbers above are abstract-level only; mineral composition tables are not retrievable.

#### 5.1.3 Kim DW et al. (2017) — purified salt vs mineral-rich sea salt: the only salt-type metabolomics study in a cabbage ferment

**CLAIM.** The different mineral profiles of purified salt (PS) vs mineral-rich sea salt (MRS) change the bacterial profile and the metabolite profile of kimchi.

**NUMBERS.** Culture-dependent **16S rRNA sequencing** + **mass-based metabolomics**.
- MRS caused **an increase of *Leuconostoc* species**, which **decreased the *Lactobacillus/Leuconostoc* ratio**.
- This led to changes in metabolites including **sugars, amino acids, organic acids, lipids, sulfur compounds and terpenoids** associated with kimchi quality.
- MRS positively affected kimchi mineral contents, bacterial growth and metabolite profiles. *(Exact fold-changes and metabolite concentrations are in the full text, which I did not retrieve.)*

**SOURCE.** Kim DW, Kim B-M, Lee H-J, Jang G-J, Song SH, Lee J-I, Lee SB, Shim JM, Lee KW, Kim JH, Ham K-S, Chen F, Kim H-J (2017). "Effects of Different Salt Treatments on the Fermentation Metabolites and Bacterial Profiles of Kimchi." *Journal of Food Science* **82**(5):1124–1131. DOI: [10.1111/1750-3841.13713](https://doi.org/10.1111/1750-3841.13713). Abstract retrieved via CrossRef API (https://api.crossref.org/works/10.1111/1750-3841.13713); see also https://pubmed.ncbi.nlm.nih.gov/28440871/

**CONFIDENCE.** **Moderate** (clear directional claim from a peer-reviewed JFS paper, but no numeric values in the retrieved abstract; full text paywalled).
**QUALITY NOTE.** Real food (kimchi), two salt types with analytically characterised differing mineral profiles, 16S sequencing + untargeted metabolomics — **methodologically the strongest salt-type study in this entire report.** **This is the key study to point to for "salt type changes the metabolite profile".** It is **kimchi, not sauerkraut.**

#### 5.1.4 Yu & Hwang (2011) — six commercial salt types + a salt replacer

**CLAIM.** Different commercial salts change kimchi fermentation rate and LAB growth.

**NUMBERS.** Salts compared: **Hanju salt, deep sea water salt, *Salicornia herbacea* salt, Guwoon (baked) salt, bamboo salt, and a salt replacement (CS-17)**; fermentation at **10 °C**.
- **CS-17 and *Salicornia* salt** showed the slowest pH change; **CS-17 had the lowest retardation level, 0.97%**.
- **Salinity during fermentation:** table salt (control) **2.17–2.5%** vs CS-17 **1.72–1.99%**.
- **Na content:** CS-17 **562.5 mg%** vs table salt **879.0 mg%**.
- ***Leuconostoc* sp.:** highest **1.5 × 10⁸ cfu/g at day 6** with CS-17, vs highest **2.3 × 10⁷ cfu/g at day 7** with table salt.
- ***Lactobacillus* sp.:** rose to **3.0 × 10⁸ cfu/g (CS-17)** vs **6.0 × 10⁷ cfu/g (table salt)** at day 8.

**SOURCE.** Yu K-W, Hwang J-H (2011). "Fermentative Characteristics of Low-Sodium Kimchi Prepared with Salt Replacement." *Journal of the Korean Society of Food Science and Nutrition* **24**(4):753–760. UCI: G704-001059.2011.24.4.039 — retrieved at https://kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001615816

**CONFIDENCE.** **Strong** for the listed numbers.
**QUALITY NOTE.** Real food, 10 °C, six salt types screened plus a focused Na-reduction comparison. **Limitation:** the six-salt screen is reported qualitatively ("slowest pH change"); only the table-salt vs CS-17 pair is reported numerically.

#### 5.1.5 Kimchi salt-type papers retrieved as CITATION / TITLE ONLY (no abstract obtained)

I retrieved only titles/metadata for these via the reference list of Chang et al. 2011 or via CrossRef. **I make no numeric claims about them.** They are listed because they clearly belong to the salt-type literature and a full literature review should name them.

| Reference | Venue | DOI / link |
|---|---|---|
| Choi S-Y, Beuchat LR, Perkins LM, Nakayama T (1994). Fermentation and sensory characteristics of kimchi containing potassium chloride as a partial replacement for sodium chloride | *Int J Food Microbiol* **21**:335–340 | https://www.semanticscholar.org/paper/74866c1977e61f3cbb8233272a9370c4287a6e35 |
| Hahn YS (2003). Effect of salt type and concentration on the growth of lactic acid bacteria isolated from kimchi | *Korean J Food Sci Technol* **35**:743–747 | — |
| Kim SJ, Kim HL, Ham KS (2005). Characterization of kimchi fermentation prepared with various salts | *Korean J Food Preserv* **12**:395–401 | — |
| Han G-J, Son A-R, Lee S-M, Jung J-K, Kim S-H, Park K-Y (2009). Improved Quality and Increased in Vitro Anticancer Effect of Kimchi by Using Natural Sea Salt without Bittern and Baked (Guwun) Salt | *J Korean Soc Food Sci Nutr* **38**(8):996–1002 | [10.3746/jkfn.2009.38.8.996](https://doi.org/10.3746/jkfn.2009.38.8.996) |
| Chang MS, Cho SD, Kim GH (2010). Physiochemical and sensory properties of kimchi prepared with various salts | *Korean J Food Preserv* **17**:30–35 | — |
| Lee I-S, Kim H-S, Kim H-Y (2012). Quality Characteristics of Baechu Kimchi Prepared with Domestic and Imported Solar Salts during Storage | *Korean J Food Cookery Sci* **28**(4):363–374 | [10.9724/kfcs.2012.28.4.363](https://doi.org/10.9724/kfcs.2012.28.4.363) |
| Lee HM, Lee WK, Jin JH, Kim IC (2013). Physicochemical Properties and Microbial Analysis of Korean Solar Salt and Flower of Salt | *J Korean Soc Food Sci Nutr* **42**(7):1115–1124 | [10.3746/jkfn.2013.42.7.1115](https://doi.org/10.3746/jkfn.2013.42.7.1115) |
| Chang J-Y, Kim I-C, Chang H-C (2014). Effect of Solar Salt on Kimchi Fermentation during Long-term Storage | *Korean J Food Sci Technol* **46**(4):456–464 | [10.9721/KJFST.2014.46.4.456](https://doi.org/10.9721/KJFST.2014.46.4.456) |
| Kim D-M, Kim K-H (2014). Growth of Lactic Acid Bacteria and Quality Characteristics of Baechu Kimchi Prepared with Various Salts and Concentration | *J Korean Soc Food Culture* **29**(3):286–297 | [10.7318/KJFC/2014.29.3.286](https://doi.org/10.7318/KJFC/2014.29.3.286) |
| Yu T, Park E-S, Zhao X, Yi R-K, Park K-Y (2020). Lower Mg and S contents in solar salt used in kimchi enhances the taste and anticancer effects on HT-29 colon carcinoma cells | *RSC Advances* **10**(9):5351–5360 | [10.1039/c9ra09032k](https://doi.org/10.1039/c9ra09032k) |

> **Relevance flags worth following up:** Lee HM et al. 2013 is a **characterisation of "flower of salt"** (fleur de sel equivalent) — the closest published work to a "sel gris" question, but it analyses **salt**, not fermentation. Yu et al. 2020 varies **Mg and S content** of solar salt used **in kimchi** — mechanistically the closest analogue to the unrefined-salt-mineral hypothesis.

---

### 5.2 Suan-tsai (Taiwanese pickled mustard cabbage) — refined vs coarse vs deep-sea-water salt

**CLAIM.** Deep-sea-water (DSW) salt, which is richer in Mg, Ca, K, Li, Fe, B, Sr, Co, Ga, Bi and Tl than refined and coarse salt, shortens suan-tsai fermentation and increases LAB counts and acidity, with good sensory acceptance.

**NUMBERS (as available in the retrieved record).**
- Mineral analysis found **Mg, Ca, K, Li, Fe, B, Sr, Co, Ga, Bi and Tl higher in deep-sea-water salt than in refined salt (精鹽) and coarse salt (粗鹽)**.
- Fermentations compared **refined salt, coarse salt and deep-sea-water salt at 5.5%, 7.5% and 10%** salt concentrations.
- DSW salt **shortened fermentation time**, promoted faster entry into the **exponential phase**, and **raised both acidity and LAB counts**.
- ***Lactobacillus plantarum*** identified as the dominant LAB during suan-tsai fermentation by **dnaK gene** sequencing.
- DSW-salt suan-tsai had **good sensory acceptance**.
- *(No numeric pH, CFU/g or acidity values appear in the retrieved abstract, and I did not obtain the thesis.)*

**SOURCE.** Peng Y-L (彭于玲) (2012). *Study on the effects of deep sea water salt on the growth of lactic acid bacteria during the fermentation of suan-tsai* (探討深層海水鹽對酸菜發酵期間乳酸菌生長之影響). **Master's thesis**, National Ilan University, Taiwan (NDLTD ID `101NIU07404002`). Records retrieved at:
- http://www.etdic.org.tw/zh-tw/Research/ResearchDetail/746 (Eastern Deep Sea Water Innovation R&D Center, record dated 2016-09-10, thesis year 2012)
- NDLTD index record: `oai:union.ndltd.org:TW/101NIU07404002`

**CONFIDENCE.** **Weak-or-contested** — this is **a master's thesis, NOT peer-reviewed**, and I could not retrieve the thesis itself (only a structured abstract on a government R&D database). It is nevertheless the **only study I found anywhere that directly compares unrefined "coarse salt" against refined salt against a mineral-rich sea salt in a cabbage-family vegetable ferment.**
**QUALITY NOTE.** Model system: real food (mustard cabbage), 3 salt types × 3 concentrations (5.5/7.5/10%). **Not peer-reviewed; n, replicates and statistics unknown; no numeric results retrievable.**

---

### 5.3 Cucumber / pickle brine

#### 5.3.1 Yoo, Hwang, Eog & Moon (2006) — bay salt vs purified salt, with Ca/Mg-matched controls

**CLAIM.** The advantage of bay (unrefined) salt over purified salt in pickled cucumber is attributable to its **Ca²⁺ and Mg²⁺ content** — a salt matched to bay salt's Ca/Mg reproduces the benefit better than bay salt itself.

**NUMBERS.** **Four salt types:** bay salt, purified salt, **prepared salt 1** (containing the **same amount of Ca²⁺ and Mg²⁺ as bay salt**), and **prepared salt 2** (a **3-fold higher** Ca²⁺ and Mg²⁺ concentration than bay salt). **Two brine preheat temperatures: 98 °C and 65 °C. All samples fermented 30 d at 25 °C.** pH, total acidity, alcohol-insoluble solids and mineral contents measured; texture + sensory evaluation + microscopy.
- **Pickled cucumbers with 98 °C preheated brine had better texture** than those with 65 °C.
- **Prepared salt 1 (Ca²⁺/Mg²⁺ matched to bay salt) gave the best result of all samples tested** in sensory, textural and physical properties.

**SOURCE.** Yoo KM, Hwang IK, Eog G, Moon B (2006). "Effects of Salts and Preheating Temperature of Brine on the Texture of Pickled Cucumbers." *Journal of Food Science* **71**(2). DOI: [10.1111/j.1365-2621.2006.tb08889.x](https://doi.org/10.1111/j.1365-2621.2006.tb08889.x). Abstract retrieved via CrossRef API; landing page: https://ift.onlinelibrary.wiley.com/doi/10.1111/j.1365-2621.2006.tb08889.x

**CONFIDENCE.** **Strong** for the design and the directional conclusions (explicit in the abstract).
**QUALITY NOTE.** Real food, 4 salt types × 2 temperatures, 30 d at 25 °C, full physicochemical + texture + sensory + microscopy. **This is the cleanest "is it the salt type or the salt's minerals?" experiment in the whole report** — it decomposes bay salt into its Ca/Mg fraction and shows the minerals, not the provenance, carry the effect.

#### 5.3.2 Yousefi, Arianfar, Hakimzadeh & Rafe (2025) — mineral cation salts at ppm levels

**CLAIM.** Calcium salts most improve cucumber pickle firmness; among the salts tested firmness ranks Ca-acetate > CaCl₂ > KCl > MgCl₂ > AlCl₃.

**NUMBERS.** Brines with **KCl, CaCl₂, MgCl₂, AlCl₃ and calcium acetate at 50, 100, 200 and 400 ppm**, alongside **6% NaCl**; storage over **6 months**, monthly analysis.
- When **pH declined to 3.6**, undesirable textural and sensory properties appeared.
- Pickles treated with **CaCl₂ and calcium acetate had higher pH** than other samples after 6 months.
- **Firmness order: Ca(C₂H₃O₂)₂ > CaCl₂ > KCl > MgCl₂ > AlCl₃.**
- Positive relationship between firmness and crispness and colour values; Ca²⁺ improved consumer acceptance.

**SOURCE.** Yousefi M, Arianfar A, Hakimzadeh V, Rafe A (2025). "Enhancing the Texture and Sensory Properties of Pickled Cucumbers with Different Brine Solutions." *Foods* **14**(3):336. DOI: [10.3390/foods14030336](https://doi.org/10.3390/foods14030336), PMID 39941928, PMCID PMC11817513. Abstract retrieved via PubMed E-utilities.

**CONFIDENCE.** **Strong** for the abstract's numbers.
**QUALITY NOTE.** Real food, 6-month storage, 5 salts × 4 concentrations (ppm-level) against a 6% NaCl base, physicochemical + sensory + texture. **Not a salt-origin study** — it holds NaCl constant and varies the minor mineral cations, which is precisely the mechanistic question behind "does unrefined salt matter?".

#### 5.3.3 Park MW & Park YK — Oiji (pickled cucumber) with different salts — RETRIEVED AS SCAN ONLY

**Citation (as given in the reference list of Chang et al. 2011):** Park MW, Park YK. "Changes of physicochemical and sensory characteristics of Oiji (Korean pickled cucumbers) prepared with different salts." *Journal of the Korean Society of Food Science and Nutrition* **27**:419–424.

**RETRIEVAL NOTE.** I downloaded the Korean-language PDF at http://koreascience.or.kr/article/JAKO199811920155440.pdf (312 KB, 6 pages) but **`pdftotext` extracted only 6 bytes — it is an image-only scanned PDF.** I therefore **cannot report any content or numbers** from it, and I flag that the year is inconsistent across citations (the reference list says 1988 while volume 27 and the repository filename `JAKO1998…` indicate 1998). **Confidence: not assessable.**

---

### 5.4 Pepper mash / chilli fermentation

**BOTTOM LINE: NO EXPERIMENTAL EVIDENCE FOUND for salt TYPE or salt ORIGIN in pepper mash.** PubMed queries `"pepper mash" AND salt` returned **0 records**; `"pepper mash" AND fermentation` returned **1 record**, which is not a salt-type study. Multiple web and CrossRef searches for sea-salt-vs-refined, KCl replacement, or salt-origin comparisons in *Capsicum* mash returned nothing on point.

The closest adjacent work retrieved:

1. **Flores NC, VanLeeuwen D, Pennock RD (2007).** "The effect of calcium on microbial quality and consistency of chile pepper (*Capsicum annuum* cv. Mesilla Cayenne) mash during fermentation." *LWT – Food Science and Technology* **40**(8):1482–1487. DOI: [10.1016/j.lwt.2006.08.005](https://doi.org/10.1016/j.lwt.2006.08.005).
   - **RETRIEVAL FAILURE:** ScienceDirect returned HTTP 403; I retrieved **title, authors, journal, volume, pages and DOI only** via the CrossRef API. **No abstract and no numbers.** I therefore make no claim about its findings beyond the title/scope. It is relevant because calcium is a key unrefined-sea-salt mineral, and it is the only pepper-mash paper with a mineral-variable design that I located.

2. **Torán-Pereg P, Deba-Rementeria S, Estrada O, Pardo G, Vázquez-Araújo L (2023).** "Physicochemical and Sensory Evaluation Data to Drive the Development of a Green Chili Pepper Hot Sauce from Unexploited Raw Materials." *Foods* **12**(19):3536. DOI: [10.3390/foods12193536](https://doi.org/10.3390/foods12193536), PMID 37835189, PMCID PMC10572888.
   - Pepper **mash** characterised for pH, sugar, instrumental colour, **volatile composition**, sensory (discriminant test) and total plate count; two fermentation processes compared.
   - **Explicit finding relevant to this review:** "the ingredients added to make the sauces were determinant and had a **higher impact on the organoleptic profile of the final product than the fermentation process**."
   - **This study does NOT vary salt type.** Listed to document that the pepper-mash volatile/sensory literature exists but does not address salt type.

3. **"FERMENTATION OF JALAPENO PEPPER MASH."** *HortScience* **40**(3):880f (2005). DOI: [10.21273/hortsci.40.3.880f](https://doi.org/10.21273/hortsci.40.3.880f). ASHS **meeting abstract**. CrossRef returned title/venue only; SciProfiles landing page returned HTTP 403. **Salt variables unknown. Not usable as evidence.**

4. **Embrapa (Brazil):** "Comparação entre os processos fermentativos naturais de polpas de pimenta tabasco (*Capsicum frutescens*) com e sem adição de sal." Record page https://www.alice.cnptia.embrapa.br/alice/handle/doc/883315 — **`web_fetch` failed with a network error**, so I retrieved nothing beyond the search-result title. The title indicates **salt addition vs no salt**, i.e. **presence/absence, not salt type**. Not usable as evidence here.

---

## 6. Explicitly what does NOT exist

Stated as plainly as the evidence requires. Each of these is a genuine gap, not a failure of search.

1. **NO EXPERIMENTAL EVIDENCE FOUND for sel gris / grey salt / gray salt in sauerkraut.** I searched `"sel gris" sauerkraut`, `"grey salt" OR "gray salt" sauerkraut kimchi fermentation experiment`, `"sel gris" fermentation study peer reviewed salt`, and `"sel gris" OR "grey salt" OR "gray salt" sauerkraut cabbage fermentation study research`. **No peer-reviewed experimental study exists that I could find.** The only Korean hit for "gray salt" was a library catalogue record, not a fermentation trial.

2. **NO EXPERIMENTAL EVIDENCE FOUND for Himalayan pink salt in sauerkraut or any other vegetable ferment.** Search returned only blogs, retailer pages and recipe content.

3. **NO EXPERIMENTAL EVIDENCE FOUND for salt *origin/provenance* (region, artisanal vs industrial, rock vs solar vs bay vs flake) as a variable in SAUERKRAUT fermentation.** Searched `"artisanal salt" OR "salt origin" fermented vegetables sauerkraut research study`, `salt origin sauerkraut fermentation artisanal salt`, `sauerkraut salt type comparison rock salt sea salt study fermentation Germany`. **PubMed reports 0 indexed records for `sauerkraut AND "sea salt"` and 0 for `sauerkraut AND "mineral salt"`.** The sauerkraut "salt quality" literature is essentially absent from PubMed — it lives in *Food Microbiology*, *LWT* and *European Food Research and Technology*.

4. **NO 16S amplicon study of sauerkraut as a function of salt ORIGIN or unrefined-ness.** The only sauerkraut community studies with a salt-type variable are Wolkers-Rooijackers et al. 2013 (**PCR-DGGE + cloning**, KCl/MgCl₂/CaCl₂ replacement) and Müller et al. 2018 (**metagenomics**, iodized vs non-iodized). Searches for `unrefined salt sauerkraut microbial community 16S` and `unrefined salt sauerkraut microbial community 16S sequencing` surfaced no such study.

5. **NO GC-MS volatile study of sauerkraut as a function of salt TYPE.** The sauerkraut volatilome literature (Yang et al. 2020, *Food Res Int*; Yang et al. 2020, *J Appl Microbiol*) varies salt **CONCENTRATION** only. The **only** salt-type metabolite/volatile study in a cabbage ferment is **Kim DW et al. 2017 in KIMCHI** (purified salt vs mineral-rich sea salt; 16S + mass-based metabolomics, incl. sulfur compounds and terpenoids).

6. **NO EXPERIMENTAL EVIDENCE FOUND for salt type in pepper mash / chilli mash.** See §5.4.

7. **NO controlled comparison of "unrefined sea salt vs refined NaCl" in sauerkraut exists in the peer-reviewed literature I could locate.** The nearest approximations are: (a) Wolkers-Rooijackers 2013 [C], which *simulates* the mineral fraction with MgCl₂ + CaCl₂; (b) Yoo et al. 2006 in **cucumber**, which tests bay salt against purified salt *and* against Ca/Mg-matched prepared salts; (c) Peng 2012 in **suan-tsai** (thesis, not peer-reviewed), which tests coarse salt vs refined salt vs deep-sea-water salt.

8. **Viander et al. 2003 full numeric detail does not exist in any open source.** Per-day pH curves and absolute lactic/acetic acid concentrations are behind the Elsevier paywall and are not reproduced in any open abstract, repository record, or citing work I retrieved.

---

## 7. Non-peer-reviewed claims encountered — flagged, NOT evidence

These appeared repeatedly in the searches and are the origin of most consumer-facing claims about salt type in sauerkraut. **None is peer-reviewed; none is experimental evidence.** Listed only so they are not mistaken for literature:

- lieblingsglas.com — "Salt in the Fermentation Process: Your Guide for Perfect Results" (retailer blog)
- cafebaerbucha.com — "Best Salt for Fermenting!" (retailer blog)
- gutbasket.com — "Unrefined Natural Sea Salt for Fermentation" (product page)
- The Fermentation Podcast, Episode 10 — "Types of Salt, Brine Basics, and Weight Ratios in Fermentation" (podcast; https://www.ivoox.com/en/episode-10-8211-types-of-salt-brine-basics-audios-mp3_rf_7441099_1.html)
- hobbyfarms.com, iamcountryside.com, farmersjournal.ie, bostonglobe.com, tastingtable.com, epicurious.com — recipe/lifestyle coverage
- thehotpepper.com forum thread "Salt ratio for mash ferment?" — forum discussion

**One of these claims has actually been tested and not supported:** the widely repeated belief that **iodized salt inhibits sauerkraut fermentation** was tested by Müller et al. 2018 (§2.5), which found **no statistically significant effect** on microbial populations (with one near-significant p = 0.06 effect on yeasts/moulds in non-starter fermentations).

---

## 8. What the evidence, taken together, actually supports

1. **Sodium reduction by KCl substitution is the only well-studied "salt quality" question in sauerkraut.** Optimal KCl share appears to be **≤ 40–50%** of the salt: Wolkers-Rooijackers 2013 found 40% replacement (with MgCl₂/CaCl₂) sensory-equal to control, while Li et al. 2022 put the ceiling at ≤ 50% before taste becomes unacceptable.
2. **Simple salt reduction without mineral replacement is different from and worse than partial replacement.** Wolkers-Rooijackers 2013 [B] (9 g/kg NaCl, no replacement) gave **unacceptably soft texture**, whereas [C] (9 g/kg NaCl + KCl + MgCl₂ + CaCl₂) matched the 15 g/kg control on texture and sensory. This is the strongest sauerkraut evidence that the **non-NaCl mineral fraction is functionally important**.
3. **Adding the divalent cations that unrefined sea salt naturally carries (Ca²⁺, Mg²⁺) has measurable, quantified effects in brined vegetables** — cucumber firmness ranks Ca-acetate > CaCl₂ > KCl > MgCl₂ > AlCl₃ (Yousefi 2025) and the bay-salt advantage in cucumber is reproducible with a Ca/Mg-matched prepared salt (Yoo 2006).
4. **Salt type demonstrably shifts the microbial and metabolite profile in kimchi** — purified vs mineral-rich sea salt changed the *Lactobacillus/Leuconostoc* ratio and altered sugars, amino acids, organic acids, lipids, sulfur compounds and terpenoids (Kim DW et al. 2017).
5. **Mineral-salt sauerkraut performs at least as well as, and by sensory panels sometimes better than, NaCl-only sauerkraut** in the Finnish series (Viander 2003: mineral-salt juice best taste; Wiander & Palva 2011: 0.8% mineral salt best sensory at 4–5/5; Wiander & Ryhänen 2005: highly acceptable). **But these are all KCl-based "mineral salts", not unrefined sea salts**, and the comparisons against ordinary salt are qualitative in the sources I could retrieve.
6. **The specific claim that unrefined/artisanal salt (sel gris, grey salt, Himalayan pink) improves sauerkraut fermentation is, as of this search, UNTESTED in the peer-reviewed literature.** Anyone asserting it from evidence is over-reading the record. The honest position is: the *mechanistically analogous* variables (KCl, MgCl₂, CaCl₂, salt minerals) have been tested with positive and quantifiable results; the *origin/purity variable itself* has not been tested in sauerkraut at all.

---

## 9. Retrieval failures, logged for transparency

| Target | Method | Outcome |
|---|---|---|
| Viander 2003 full text | `web_fetch` + browser-UA `curl` on ScienceDirect | **HTTP 403**; Semantic Scholar reports `openAccessPdf: CLOSED`. Abstract obtained from two mirrors instead. |
| Wolkers-Rooijackers 2013 full text | ScienceDirect; WUR `library.wur.nl/WebQuery/wurpubs/fulltext/291541` | ScienceDirect **403**; WUR returned **HTML 403 error page, not a PDF**. Full AGRIS abstract obtained instead. |
| Lee KW et al. 2018 full text | PMC / Europe PMC `fullTextXML` | Europe PMC `isOpenAccess: N`; **XML HTTP 404**. Abstract obtained via PubMed E-utilities. |
| Müller et al. 2018 full text | not retrievable open access | Abstract only via PubMed E-utilities. |
| Li et al. 2022 full text | Wiley paywall | Abstract only via Europe PMC AGR. |
| Kim DW et al. 2017 full text | Wiley paywall; Springer/other mirrors | Abstract only via CrossRef API. |
| Flores et al. 2007 (pepper mash Ca) | ScienceDirect | **HTTP 403**; metadata only via CrossRef. |
| Park & Park (Oiji) | PDF download from koreascience.or.kr | PDF obtained (312 KB, 6 pp) but is **image-only**; `pdftotext` yielded 6 bytes. **No content reported.** |
| Peng 2012 suan-tsai thesis | ETDIC record; NDLTD index | **Structured abstract only**; thesis itself not retrievable. |
| Embrapa tabasco pulp record | `web_fetch` | **Network error**; nothing retrieved beyond search-result title. |
| "FERMENTATION OF JALAPENO PEPPER MASH" | SciProfiles | **HTTP 403**; CrossRef metadata only. |
| MDPI (Foods 14(3):336 landing page) | `web_fetch` + `curl` | **HTTP 403 / Akamai block**; abstract obtained via PubMed E-utilities instead. |
| Springer (Food Sci Biotechnol 27(2)) | `web_fetch` + `curl` | Redirect to IdP / 3 KB challenge page; abstract obtained via PubMed E-utilities instead. |
| OpenAlex API | REST queries | **HTTP 429 — daily budget exhausted**; not used. |
| Semantic Scholar API | REST queries | **HTTP 429 rate-limited** for most queries; used only for one successful DOI lookup. |
| Korean-language sources | — | Several key papers (Hahn 2003; Kim 2005; Chang 2010) have **no retrievable English abstract**; listed as citation-only. |

---

## 10. Priority follow-ups if this line of work continues

1. **Obtain the Viander et al. 2003 publisher PDF** — it is the only source of the per-day pH and lactic/acetic acid curves at 430 kg scale. Nothing open substitutes for it.
2. **Obtain Kim DW et al. 2017 (JFS 82:1124–1131)** — the only salt-type metabolomics study in a cabbage ferment, and the best template for designing a sauerkraut equivalent.
3. **The obvious unfilled experiment:** a controlled sauerkraut trial — refined NaCl vs unrefined sea salt vs sel gris vs KCl-based mineral salt, **matched for total NaCl and total ionic strength** — with 16S amplicon profiling, HS-SPME/GC-MS volatilome, organic acids by HPLC, texture, and a trained sensory panel. As far as this search can determine, **that experiment has not been published.** The design should follow Wolkers-Rooijackers 2013 (salt-composition arms + PCR/sequencing) and Kim DW et al. 2017 (metabolomics + 16S), with Yoo et al. 2006's Ca/Mg-matched control as the critical design element that separates *provenance* from *mineral content*.
