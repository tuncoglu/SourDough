# Salt and Water Chemistry Effects on Vegetable Lactic Fermentation
### Evidence review to validate a fermentation-timing model
Compiled for the SourDough calculator. Scope: sauerkraut, kimchi, cucumber pickles, pepper mash, plus adjacent vegetable LAB ferments (brined peppers, beetroot, suancai/paocai) where they supply the only quantitative data. Every finding carries a number, a source with URL, and a confidence label (strong / moderate / weak-or-contested). Where no experimental evidence exists, that is stated explicitly rather than filled with folklore.

---

## 0. Bottom line: verdicts on the current model

| Model component as implemented | Verdict | What to change |
|---|---|---|
| Salt = proportional rate effect, **+1% salt above recipe ⇒ ~33% longer**, clamped 0.6–2.0× | **Half right.** Direction is right on the high side of ~2%; **wrong (non-monotonic) below ~1.5–2%**; **understates the effect at ≥5%**; and the effect lands mostly on the **lag/onset**, not the exponential acidification rate. | Make the response U-shaped with an optimum at ~2–2.5% (sauerkraut/kimchi) and ~5–8% (cucumbers/peppers). Split into a lag multiplier and a (much smaller) rate multiplier. Widen the clamp on the high-salt side (to ~3×) for cold fermentations. |
| Water hardness (mg/L CaCO₃) → small effect, **capped ±10%**, harder = slower, mechanism "carbonate buffers lactic acid + calcium firms pectin" | **Chemically real but mis-parameterised and overstated.** The buffer is **alkalinity (HCO₃⁻/CO₃²⁻, meq/L)**, not hardness (Ca+Mg). At tap-water concentrations the effect is **≈1–2% of total fermentation time and ≈2–6% of the early (time-to-pH-4.6) phase** for typical water; only ≥400–500 mg/L as CaCO₃ approaches the 10% cap. The **pectin/calcium "firming" story is a texture effect and must not be wired into the rate at all.** | Feed the model **alkalinity** (mg/L as CaCO₃ or meq/L), not hardness. Compute a proton-neutralisation credit (1 meq/L = 1 mmol H⁺/L) and apply it to the early (time-to-pH-4.6) phase only. Cap at ~5% for typical water, ~10% only for very hard/alkaline water. |
| Hardness effect applied **only to brine ferments**, because dry-salted and mashed ferments add no water | **Correct in principle**, with a caveat: kimchi cabbage is *brined* (8–10% soak) and then rinsed, so little of that water enters the ferment; pepper mash is salted, not brined, and its salt level (6–15%) is so high that the salt term dominates everything else. | Keep. Optionally zero the water term for kimchi and pepper mash by default. |
| Iodized salt | Not modelled — correct. The "never use iodized salt" warning is **folklore** and is contradicted by every controlled experiment. | **Do not add an iodine term.** (Optional cosmetic note: *iodate*-iodized salt can darken/soften light-coloured pickles; US salt is *iodide*-iodized.) |
| Chlorine/chloramine in tap water | Not modelled — correct. No experimental evidence of inhibition at domestic concentrations; residual chlorine is consumed within minutes by vegetable organic load. | **Do not add a chlorine term.** Add instead a **sulfite warning**: dechlorinating with 1 Campden tablet per gallon adds 67–78 ppm SO₂ against a 5 mg/L LAB-inhibitory threshold — the "treatment" is the only realistic way tap water stalls a ferment. |
| Water temperature | Not in the model as a *water* attribute, but this is the water property that actually moves the rate | Feed into the existing temperature model, not a separate water factor. **Q₁₀ ≈ 2.6 (measured, 95% CI 2.3–3.0, over 17–29 °C), rising sharply below ~15 °C**; NCHFP: 21–24 °C → 3–4 weeks, 16–18 °C → 5–6 weeks. |
| Salt type / crystal density for volume conversion | Already modelled; numbers below are verified. | Update density table (below). Note Morton **Canning & Pickling salt = 6.0 g/tsp**, identical to table salt. |
| All other water minerals (Mn, Mg, K, Fe, F⁻, NO₃⁻, SO₄²⁻, Cu, chlorite/chlorate) | **Noise — 10³–10⁶× below any concentration shown to matter.** | Give them **no coefficients**. Do not add "mineral cofactor" or "fluoride" terms. |

---

## 1. Salt concentration vs acidification rate

### 1.1 The honest state of the data
There is **no single study that reports time-to-pH-4.0 or -4.6 for a clean 1 / 2 / 2.5 / 3 / 4 / 5% NaCl matrix in sauerkraut**. The model's apparent precision exceeds the literature. What exists is: (a) one strong time-course of *LAB population onset* across 2/5/8% brine, (b) several studies showing an **optimum near 2–2.5%** with both lower and higher salt slower, and (c) one figure-resolution kimchi pH time-course at 1.5/2.5/3.5%. Assembled:

| Study | Matrix / scale | NaCl levels | Temp | Measured outcome (numbers as published) | Confidence |
|---|---|---|---|---|---|
| **Xiong et al. 2016**, *LWT* 69:169–174, doi:10.1016/j.lwt.2015.12.057 (numbers as cited in Świder et al. 2021, [PMC8510100](https://pmc.ncbi.nlm.nih.gov/articles/PMC8510100/)) | Chinese sauerkraut, lab | **2, 5, 8%** brine | n.r. | Time for LAB to exceed **8 log CFU/mL: 24 h (2%), 36 h (5%), 72 h (8%)**; counts stayed >8 log to 168 h in all arms | strong (primary data, secondary text) |
| **Yang et al. 2020**, *J Appl Microbiol* 129:1458–1471, doi:10.1111/jam.14786 | NE Chinese sauerkraut, spontaneous | **0.5, 1.5, 2.5, 3.5% (w/w)** | n.r. | "Speed of decrease in pH and accumulation of acids were **highest in 2.5%**"; 0.5% and 3.5% both slower; LAB population highest at 2.5% | strong (published result, direction only) |
| **Hong et al. 2021**, *J Korean Soc Food Sci Nutr* 50(6):648–653, doi:10.3746/jkfn.2021.50.6.648 | Kimchi, 5 ± 1 °C | **1.5, 2.5, 3.5%** | 5 °C | pH curves (Fig. 1). Digitised by eye: time to **pH 5.0 ≈ 0.9 / 1.6 / 2.0 weeks**; time to **pH 4.6 ≈ 1.7 / 2.6 / 3.9 weeks**. 3.5% kimchi still contained 22% non-LAB *Aerosakkonema* at wk 3 | moderate (my digitisation of a published figure, ±0.05 pH / ±0.2 wk) |
| **Müller et al. 2018**, *Food Microbiol* 76:473–480, doi:10.1016/j.fm.2018.07.009 | Sauerkraut, 1.0% salt | **1.0%** | n.r. (~20 °C) | With *L. plantarum* / *L. mesenteroides* starters: LAB 10⁷→10⁹ CFU/mL in **24 h, pH<4.0**. Spontaneous: 10⁵→10⁹, **pH<4.0 only on day 3** | strong |
| **Zabat et al. 2018**, *Foods* 7(5):77, doi:10.3390/foods7050077 | Commercial sauerkraut, 50 lb batch | **2.25%** | ~21 °C | Final **pH <3.6 by day 14**; *Leuconostoc* + *Lactobacillus* dominate from day 2 | strong |
| **Plengvidhya et al. 2007**, *Appl Environ Microbiol* 73:7697–7702, [PMC2168044](https://pmc.ncbi.nlm.nih.gov/articles/PMC2168044/) | Commercial tanks | ~2% ("typically used") | n.r. | Day 14 pH **3.4–3.7**; heterofermentative LAB = 90–100% of isolates on days 1 and 3, homofermentative majority by day 14 | strong |
| **Świder et al. 2021**, *Molecules* 26:5796, doi:10.3390/molecules26195796 | Cucumber brine, model system | **0.5, 1.5, 5.0%** | 11 vs 23 °C | pH<4.0 in **all** arms only after ~4 months; **LAB count at 48 h significantly lower at BOTH 0.5% and 5.0%** (11 °C); at 5% brine Enterobacteriaceae persisted and even thrived | strong |
| **Tang et al. 2024**, *Food Chem X* 22:101594, doi:10.1016/j.fochx.2024.101594 | Pickled peppers, 90 d | brine 24% vs 9% (final ≈**14.4% vs 5.4%**) | 18–25 °C | pH **4.11–4.20 (high salt) vs 4.27–4.39 (low salt)**; total titratable acidity rose **much more slowly** at high salt; at high salt the dominant genera were *Pectobacterium*/*Pseudomonas*, not *Lactobacillus* | strong |
| **Janiszewska-Turak et al. 2024**, *Molecules* 29:4803, doi:10.3390/molecules29204803 | Red beetroot brine | **0, 0.5, 1, 1.5, 2, 3, 4, 6%** | n.r. | **"Adding salt to the brine did not impact the pH during the subsequent days"** — pH fell to ~3.3–3.9 by day 4 in every arm. LAB counts peaked at 2–3%; decline after day 4 fastest at 4–6% | strong |
| **HortScience 2005** 40(3):880, doi:10.21273/hortsci.40.3.880f | Jalapeño pepper mash | **15% salt** | n.r. | Sugars "utilized **gradually** with time indicating **slow fermentation**" | moderate |

### 1.2 How much longer does 4% take than 2%?
Best defensible answer, sauerkraut/kimchi-type ferments at 18–22 °C: **≈1.3–1.6× longer to reach pH 4.0–4.6**, i.e. **+15–27% per +1% NaCl** in the 2–4% band. Derivation:
- Xiong 2016 LAB-onset times: 2%→5% = 24→36 h = **1.50× over 3 points ⇒ +14.5%/1%**; 5%→8% = 36→72 h = **2.00× over 3 points ⇒ +26%/1%**; overall 2%→8% = **3.0× over 6 points ⇒ +20%/1%**.
- The model's own heuristic (+33%/1% ⇒ **1.77× for +2%**) is therefore **~10–35% too aggressive in the 2–4% ambient-temperature band**, and **too timid above 5%** (where the real penalty is 2× per 3 points and the curve is convex, not log-linear).
- Cold ferments are far more salt-sensitive. From the 5 °C kimchi curves: time to pH 4.6 rises 1.7 → 3.9 weeks for 1.5% → 3.5%, i.e. **2.3× over 2 points ⇒ ≈ +50%/1%**. At 5 °C the model's 1.77× for +2% sits almost exactly on the observed 2.3× (within digitisation error) — so **the +33%/1% slope is defensible for cold ferments and too steep for warm ones**. The right structure is a salt × temperature interaction.

### 1.3 Lag phase vs exponential phase — the most important structural finding
**Salt acts predominantly on the LAG / onset phase (time to establish a dominant LAB population and begin vigorous acidification), and only weakly on the exponential acidification rate once LAB dominate.** Evidence:
1. Xiong 2016: time to 8 log CFU/mL is the quantity that triples from 2%→8% (24→72 h), yet after that, counts and acidification proceed >8 log CFU/mL in **all** arms to 168 h — the arms converge.
2. Eilers et al. 2026, *Microbiol Spectr* 14(8), doi:10.1128/spectrum.03578-25 ([PMC13435955](https://pmc.ncbi.nlm.nih.gov/articles/PMC13435955/)): in carrot juice at 2.5% NaCl, *Leuconostoc* exceeded 50% relative abundance **on day 2**; at 1.25% and 0% the same takeover took **7 days** — a pure lag/succession delay, not a growth-rate change. "1.25% NaCl fermentations progressed more slowly but [by day 28] reached the same alpha diversity."
3. Świder 2021: lactobacilli counts converged to 7.09–8.25 log CFU/mL between 144 and 240 h **regardless of salt (0.5–5%) or temperature (11/23 °C)**.
4. Janiszewska-Turak 2024: at 0–6% salt the *pH trajectory itself was unchanged* in beetroot brine — no rate effect at all, only LAB-count differences at the extremes.
5. **Mechanism** (why the lag, not the rate): osmotic stress in LAB is countered by importing compatible solutes (glycine betaine, carnitine, proline, glutamate) from the medium; this accumulation takes time, and LAB that cannot import them synthesise them slowly. Under osmotic stress *L. plantarum* also reduces glucose uptake and reroutes pyruvate away from lactate. Papadimitriou et al. 2016, *Microbiol Mol Biol Rev* 80:837–890, doi:10.1128/MMBR.00036-16 ([PMC4981675](https://pmc.ncbi.nlm.nih.gov/articles/PMC4981675/)). This is a textbook lag-phase mechanism, exactly matching observation 1–3.
6. Consequence for the model: if a **single time multiplier** is used, the error grows the further the target is from the lag phase. Time-to-first-bubble / time-to-pH-4.6 will be much more salt-sensitive than total fermentation time or final acidity.

### 1.4 Non-monotonicity: the model's biggest structural error
Salt vs rate is **U-shaped**, not monotonic:
- **Too little salt (<1.5–2%) slows the pH drop** because LAB do not take over; Enterobacterales/*Pseudomonas*/*Yersinia* persist and compete. Eilers 2026 (above): at 0% and 1.25% NaCl, *Yersinia*, *Chimaeribacter*, *Pseudomonas_E* persisted and succession was delayed to day 7. Świder 2021: at 0.5% brine, LAB at 48 h were significantly lower than at 1.5%; at 5% brine Enterobacteriaceae persisted to 192–240 h.
- **Optimum ≈2–2.5%** for cabbage: BCCDC's public-health guideline states salt "can vary from **0.7% to 3%, with optimal at 2.25% (w/w)**"; "when salt concentrations are too low, 'soft kraut' may occur, **when it takes too long for lactic acids to form**." ([BCCDC Fermented Foods Guideline 3.2 Sauerkraut](https://www.bccdc.ca/resource-gallery/Documents/Educational%20Materials/EH/FPS/Food/Fermented/Fermented%20Foods%20Guideline%20-%203.2%20Sauerkraut.pdf)). Yang 2020 and Hong 2021 agree (2.5% optimal).
- **Too much salt slows and then derails** the ferment: >3.5% "should be avoided as higher amounts are **detrimental to growth of *Leuconostoc*** at the beginning of fermentation" (BCCDC, citing industry work); at 4–6% in beetroot, LAB declined fastest; at 5% in cucumber brine and 14% in pepper brine, non-LAB genera took over (Tang 2024; Świder 2021).
- **Model implication:** a monotonic "more salt = slower" term will *incorrectly speed up* low-salt recipes relative to reality, and will under-warn for under-salted ferments (which are also the spoilage-risk cases). Encode a floor: below the recipe optimum, do **not** reduce the time; add a safety flag instead.

### 1.5 Confidence
- Salt slows fermentation above ~2.5–3%: **strong**.
- Optimum ~2–2.5% for cabbage, U-shape: **strong**.
- Quantitative slope (+15–27%/1% at 2–4%, 18–22 °C; ~+50%/1% at 5 °C): **moderate** (derived from few datasets; the low-temperature figure is my digitisation of one published figure).
- Effect is lag-dominated rather than rate-dominated: **moderate-to-strong** (consistent across 5 independent datasets + mechanism), but no study has formally partitioned λ vs μmax for a vegetable brine.
- Time-to-pH-4.0/4.6 at 1%, 2%, 2.5%, 3%, 4%, 5% in sauerkraut as a clean matrix: **does not exist in the literature** — weak. Do not present model output as if it were measured.

---

## 2. Salt and microbial selection: thresholds and the safety line

### 2.1 The classic succession (strong)
Canonical sauerkraut succession: ***Leuconostoc mesenteroides* (heterofermentative) → *Lactobacillus brevis* / *Pediococcus* → *Lactobacillus plantarum* (homofermentative)**, with *Weissella* now recognised as an early player. Plengvidhya et al. 2007 ([PMC2168044](https://pmc.ncbi.nlm.nih.gov/articles/PMC2168044/)): "the dominant species present in the fermentation **shifts within 2 to 3 days** from less-acid-tolerant heterolactic LAB to more-acid-tolerant homolactic LAB, with sequential populations each reaching **10⁸–10⁹ CFU/g**"; 90–100% of day-1/day-3 isolates were heterofermentative, homofermentative dominated by day 14; *L. mesenteroides* = 179/686 isolates, *L. plantarum* = 280/686. Same paper: "**It is well documented that the concentration of salt has a controlling influence on the microbial succession** in a typical sauerkraut fermentation," and notes the industrial norm is **2% salt, with 1% being explored for salt-waste reduction**. Classical reference: Pederson & Albury 1969, *The sauerkraut fermentation*, NY State Agric Exp Stn Bull 824 (cited as the canonical community description in Zabat 2018).

### 2.2 Concentration thresholds (numbers)
| Threshold | Organism / group | Number | Source | Confidence |
|---|---|---|---|---|
| *Leuconostoc* growth impaired | *Leuconostoc* spp. | **>3.5% NaCl** "should be avoided" | BCCDC guideline (industry-derived) | moderate |
| LAB population boom | LAB (total) | **8 log CFU/mL at 24 h (2%), 36 h (5%), 72 h (8%)** | Xiong 2016 via Świder 2021 | strong |
| Leuconostoc dominance | *Leuconostoc* >50% rel. ab. | **day 2 at 2.5% NaCl vs day 7 at 1.25% and 0%** | Eilers 2026, *Microbiol Spectr*, doi:10.1128/spectrum.03578-25 | strong |
| Enterobacterales suppression | *Yersinia*, *Chimaeribacter*, *Pseudomonas* | persist at **0–1.25%** salt; suppressed at **2.5%** | Eilers 2026 | strong |
| Enterobacterales outcompetition (cucumber) | *Enterobacteriaceae* | outcompeted by lactobacilli **within 36 h** in brined cucumber; γ-proteobacteria inhibited by cover brine containing CaCl₂ + acetic acid + potassium sorbate | Rothwell et al. 2022, *Microbiol Spectr* 10:e01031-21, doi:10.1128/spectrum.01031-21 | strong |
| Community derailment at very high salt | *Pectobacterium*, *Pseudomonas* become dominant; *Lactobacillus* "less salt-tolerant than others" in that matrix | **5.4% vs 14.4%** pepper brine | Tang et al. 2024, doi:10.1016/j.fochx.2024.101594 | strong |
| Yeast/spoilage at high salt | *Rhodotorula* "pink kraut" | salt **too high** favours pink/slimy kraut | BCCDC guideline | moderate |

### 2.3 Where the "safety" threshold sits
- **Salt alone is not the safety hurdle.** The hurdle is **pH ≤ 4.6** (the *C. botulinum* line; FDA acidified-foods rule, [21 CFR 114](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-114)), and in practice the pickle industry targets **pH 3.5** for microbial + textural stability of brined cucumbers at low salt. Fleming et al., *Acidification of commercially fermented cucumbers in bulk tanks to increase microbial stability*, USDA-ARS ([ARS Pickle Pubs p313](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p313.pdf)): brines adjusted to pH 3.5, 4.0 and 4.5 and stored 14 months at room temperature; "**Over a 14-month storage period ... brines adjusted to pH 3.5 were more stable** in chemical composition than the unadjusted, and much more so than the pH 4.0-adjusted samples"; "the pH rises above **4.6**, food safety of the pickles becomes an issue because of potential growth and toxin production by *Clostridium botulinum*." Commercial brines cited in the same paper range **8–16% salt** for bulk storage.
- **Practical reading for the model:** the safety-relevant quantity is *time to pH 4.6*, and it is salt-sensitive mainly through the lag/onset term (§1.3). A low-salt recipe that is slow to start is the dangerous case, and it is exactly the case a monotonic salt model gets backwards.

---

## 3. Water hardness vs alkalinity: what is real, and which measurement matters

### 3.1 Hardness and alkalinity are different measurements and must not be conflated
- **Hardness** = dissolved **Ca²⁺ + Mg²⁺** (reported as mg/L CaCO₃ equivalent, by EDTA titration or calculated from Ca/Mg analysis). USGS classification: soft 0–60, moderately hard 60–120, hard 120–180, very hard >180 mg/L as CaCO₃ ([USGS Water Science School — Hardness](https://www.usgs.gov/special-topics/water-science-school/science/hardness-water)).
- **Alkalinity** = acid-neutralising capacity, titrated with strong acid to pH ~4.5, reported as mg/L CaCO₃ (1 meq/L = 50 mg/L as CaCO₃). It is dominated by **HCO₃⁻/CO₃²⁻** ([USGS Water Science School — Alkalinity](https://www.usgs.gov/special-topics/water-science-school/science/alkalinity-and-water)).
- They usually correlate in groundwater but **decouple**: a water softener swaps Ca²⁺/Mg²⁺ for Na⁺ and leaves the bicarbonate intact (low hardness, unchanged alkalinity); gypsum-rich water is hard with low alkalinity.
- **Chemically, the buffer is the carbonate system, not the cations.** H₂CO₃/HCO₃⁻ has pKa₁ 6.35 and HCO₃⁻/CO₃²⁻ pKa₂ 10.33, so bicarbonate buffers *precisely in the pH 5–7 window* that the early fermentation traverses. **Ca²⁺ and Mg²⁺ are not proton buffers in the pH 3–7 range**; their role in pickling is pectin crosslinking (texture), not pH. Any model term that claims "calcium buffers the acid" is attributing the bicarbonate effect to the wrong variable.

### 3.2 Quantitative bound on the buffering effect (calculation, moderate confidence)
Mass balance for a sauerkraut brine:
- Alkalinity scenarios: 60 / 150 / 300 / 500 mg/L as CaCO₃ = **1.2 / 3.0 / 6.0 / 10.0 meq/L** = the same number of **mmol H⁺ neutralised per litre**.
- Acid produced: final sauerkraut acidity is 1.5–2.5% as lactic acid plus ~0.3–0.5% acetic (BCCDC guideline; Plengvidhya pH 3.4–3.7 at day 14) ⇒ 15–25 g/L lactic (166–278 mmol/L) + 3–5 g/L acetic (50–83 mmol/L) ≈ **215–360 meq H⁺/L**.
- Therefore the **whole-fermentation** effect of water alkalinity is **3.0/280 ≈ 1.1%** for typical water, and **10/280 ≈ 3.6%** for extremely hard water.
- The **early phase** (time to pH 4.6) matters more, because less acid has been produced. If reaching pH 4.6 requires on the order of 50–120 mmol H⁺/L of net acid (order-of-magnitude from the titration range and the 2–4 day timescale in §1.1), then typical water adds **2.5–6%** to that phase and 400–500 mg/L water adds **8–20%** — the latter is where a ±10% cap becomes defensible.
- **Verdict: the mechanism is real, the magnitude is small, and the sign is right (harder/alkaline = slightly slower). But "hardness" is the wrong input; use alkalinity.** For typical municipal water (60–150 mg/L as CaCO₃), a **±2–4% effect on time-to-pH-4.6 and <2% on total fermentation time** is the defensible range. No experimental study in vegetable fermentation was found that measures rate vs water hardness or alkalinity — this is a chemistry bound, not a measured effect. Confidence: **moderate** for the bound; **no experimental evidence found** for a measured rate effect.

### 3.3 Calcium is documented for TEXTURE, not rate — and it does not inhibit fermentation
- Firming by calcium-pectin crosslinking is well established: Hudson & Buescher 1985, *J Food Biochem* 9:209–220, doi:10.1111/j.1745-4514.1985.tb00350.x (pectic substances and firmness of cucumber pickles as influenced by CaCl₂, NaCl and brine storage); Buescher et al. 2011, *J Food Quality* 34:257–262, doi:10.1111/j.1745-4557.2011.00374.x ("Elevated calcium chloride in cucumber fermentation brine prolongs pickle product crispness").
- **High calcium does not slow fermentation.** McFeeters & Pérez-Díaz 2010, *J Food Sci* 75:C291–C296, doi:10.1111/j.1750-3841.2010.01558.x: cucumbers fermented in brine containing **CaCl₂ as the only salt at 100–300 mM** (≈4,000–12,000 mg/L Ca²⁺ — 50–100× harder than the hardest tap water) reached **pH <3.5** with the same metabolite pattern as NaCl brines, stable in storage, no propionic/butyric spoilage. Calcium chloride at 100–300 mM does not impede fermentation and has been used since the 1990s to reduce NaCl in natural cucumber fermentation (Guillou, Floros & Cousin 1992, *J Food Sci* 57:1364–1368, doi:10.1111/j.1365-2621.1992.tb06859.x).
- **Origin of the folklore** — and its actual content. USDA Farmers' Bulletin 1438, LeFevre, *Making Fermented Pickles* ([Project Gutenberg text](https://gutenberg.org/files/48722/48722-h/48722-h.htm)): "*So-called hard waters should not be used in making a brine. The presence of **large quantities of calcium salts** and possibly other salts found in many natural waters **may prevent the proper acid formation**, thus interfering with normal curing. The addition of **a small quantity of vinegar serves to overcome alkalinity** when hard water must be used. If present in any appreciable quantity, **iron** is objectionable, causing a **blackening** of the pickles.*" Note what this 100-year-old bulletin actually says: (i) it is hedged and unquantified; (ii) it explicitly frames the fix as neutralising **alkalinity**; (iii) it attributes a separate defect (blackening) to **iron**, a quality issue. The modern USDA/NCHFP home-preservation guidance contains **no** fermentation-rate warning about chlorine or hardness; the only water-related defect it lists is "dark or discolored pickles — cause: minerals in hard water — prevention: use soft water," i.e. a **quality**, not rate, statement.

### 3.4 Model recommendation for water
1. Replace the hardness input with **alkalinity (mg/L as CaCO₃, or meq/L)**; if only hardness is available, treat it as an upper bound and note softened water breaks the correlation.
2. Apply a proton-neutralisation credit: Δt ≈ (alkalinity in mmol/L) ÷ (acid production rate in mmol/L/day), applied to the early phase only.
3. Clamp the total water-chemistry effect to **±4%** for alkalinity ≤150 mg/L as CaCO₃, **±10%** only for ≥400 mg/L (keeping the existing cap, but making it reachable only by genuinely extreme water).
4. **Delete any rate term justified by "calcium firms pectin"** — that is texture, and calcium at 100 mM does not inhibit fermentation.

---

## 4. Chlorine and chloramine in tap water

**Headline: no experimental evidence that domestic residual chlorine inhibits vegetable lactic fermentation; the direct experiment at 100–500× domestic residual is decisive. Confidence: strong.**

1. **Direct test at ~100–500× domestic residual.** Costilow, Uebersax & Ward 1984, *J Food Sci* 49(2):396–401, doi:10.1111/j.1365-2621.1984.tb12431.x: holding cucumbers in water with even **100 ppm ClO₂** "failed to (a) significantly reduce populations of microbes found in blended samples, (b) **influence the initiation of a natural lactic acid fermentation after brining** the cucumbers, or (c) delay the development of visible microbial growth during storage." Confidence: strong.
2. **The sanitiser acts on the water, not the vegetable.** Reina, Fleming & Humphries 1995, *J Food Prot* 58(5):541–546, doi:10.4315/0362-028X-58.5.541: ClO₂ at 1.3 ppm gave 2–6 log reductions of bacteria **in the hydrocooling water**, but populations **in/on the fruit** were "not greatly influenced … even at 5.1 ppm" because microorganisms on or in plant tissue are physically protected. Confidence: strong.
3. **Chlorine demand is enormous and fast — the arithmetic is not close.** Fresh-cut produce wash water has a chlorine demand of roughly **40–180 mg/L** (Weng et al. 2016, *Food Control* 60:543–551, doi:10.1016/j.foodcont.2015.08.031), and at COD 532–1013 mg/L **93–97% of added free chlorine is consumed** (Zhou et al. 2015, *Food Microbiol* 50:88–96 — reported by our search, bibliographic details not independently re-verified). Apparent first-order rate constants: cut cabbage **β = 0.05–0.10 L mg⁻¹ min⁻¹** (lettuce 0.03–0.06, carrot 0.05–0.09) (Srinivasan et al. 2020, *Postharvest Biol Technol* 161:111092, doi:10.1016/j.postharvbio.2019.111092); Abnavi et al. 2019, *J Food Sci* 84:2736–2744, doi:10.1111/1750-3841.14774, give β = 4.7–7.4 × 10⁻⁴ L mg⁻¹ min⁻¹ with COD as the dominant consumer. At a domestic residual of **0.2–1.0 mg/L against a demand two orders of magnitude larger, free chlorine is gone in minutes**, before the brine equilibrates. Confidence: strong.
4. **Chloramine** is the genuinely persistent species — CDC states standing dissipates free chlorine over "a few days" but "**you cannot remove chloramine this way**" ([CDC, water disinfection with chlorine and chloramine](https://www.cdc.gov/drinking-water/about/about-water-disinfection-with-chlorine-and-chloramine.html)); a rolling boil removes free chlorine essentially on reaching boiling, whereas monochloramine needed **~44 min** in one study (Zhang 2013, *IJERA* 3(5):1647 — low-tier journal, treat as weak); GAC needs **<8–20 min EBCT** for monochloramine (Fairey, Speitel & Katz 2007, *J AWWA* 99(7):110–120, doi:10.1002/j.1551-8833.2007.tb07985.x). But **no experimental evidence was found that chloramine inhibits a vegetable fermentation at 1–4 mg/L**. The documented brewing concern with chloramine/chlorine is **flavour** (chlorophenols from reactions with phenolic compounds), not arrested fermentation. Confidence: moderate (mechanism clear; direct vegetable-fermentation test absent).
5. **Regulatory/extension silence.** USDA/NCHFP sauerkraut and fermented-pickle guidance never mentions chlorine as a fermentation hazard and prescribes no dechlorination step. The only water-related defect NCHFP lists is hardness-related discolouration (§3.3). Confidence: strong (absence of any hazard listing, not a positive test).
6. **The one genuinely risky "water treatment" is over-dosing metabisulfite — and this is the practical warning the model should carry.** The widely quoted "1.34–1.8 mg SO₂ per mg chlorine" is mislabelled: EPA 832-F-00-022 gives **0.9 parts SO₂, or 1.46 parts NaHSO₃, or 1.34 parts Na₂S₂O₅, per 1.0 part residual chlorine** (all three reproduced from stoichiometry). Consequences:
   - **1 Campden tablet (~0.44 g metabisulfite) per US gallon (3.785 L) = 67–78 mg/L SO₂.** That is a **wine-sulfiting dose, not a dechlorination dose.** Per 20 US gallons it is 3.4–3.9 mg/L — the sensible dose.
   - Bound SO₂ inhibits wine LAB from **as low as 5 mg/L**, and is bacteriostatic rather than bacteriocidal (Wells & Osborne 2012, *Lett Appl Microbiol* 54:187–194, doi:10.1111/j.1472-765X.2011.03193.x; organisms: *Oenococcus oeni*, *Pediococcus parvulus*, *P. damnosus*, *Lactobacillus hilgardii*). In a real vegetable brine the growth probability of table-olive LAB fell to 0.01 at **150 mg/L sodium metabisulphite at pH 4.0** (Romero-Gil, Garrido-Fernández & Arroyo-López 2016, *Front Microbiol* 7:1370, doi:10.3389/fmicb.2016.01370).
   - Therefore the folklore practice of one tablet per gallon puts the brine **13–16× above a documented LAB-inhibitory SO₂ concentration**. Dechlorinating 1 gallon of 1 mg/L water needs only ~3.4 mg SO₂ ≈ 5 mg metabisulfite ≈ **1/80 of a tablet**.
   - Caveats to carry: the 0.44 g tablet mass rests on secondary sources (no manufacturer publishes a verified spec, ±15%); and the 5 mg/L threshold is established at wine/olive pH (3.5–4.0), whereas molecular SO₂ is ~2.0% of free SO₂ at pH 3.5 but only ~0.16% at pH 4.6 and ~0.0065% at pH 6.0 — so the effect in an early, still-near-neutral brine is weaker. Confidence: strong on the stoichiometry, moderate on the fermentation impact at early-brine pH.

**Model action: no chlorine term. Rate effect: none demonstrated. Safety effect: none demonstrated. Add one practical warning instead — "if you dechlorinate with metabisulfite, use ~1 tablet per 20 gallons, not per gallon", because the treatment can stall the ferment when the chlorine would not have.**

## 5. Iodized salt

**Headline: the widely repeated warning is folklore. No controlled study shows iodized salt inhibits LAB at realistic doses.** Confidence: **strong**.

- **What is actually in the salt.** US law: "iodized salt" = salt with **iodide** added, as **potassium iodide** (21 CFR 184.1634, ≤0.01% KI ≈ 76.5 mg I/kg) or **cuprous iodide** (21 CFR 184.1265, ≤0.01% ≈ 66.6 mg I/kg); **KIO₃ is GRAS only as a bread dough strengthener** (21 CFR 184.1635), not for table salt. Note the common "0.006–0.01% ⇒ 15–45 mg/kg as I" figure is wrong at the low end: 0.006% KI = 45.9 mg I/kg. Measured US retail salt (88 containers, Dasgupta et al. 2008, *Environ Sci Technol* 42:1315–1323, [PMID 18351111](https://pubmed.ncbi.nlm.nih.gov/18351111/)): **median 44.1, mean 47.5 ± 18.5, range 12.7–129 mg I/kg**, with 1.2–3.3× heterogeneity within a single can. EU/German *Jodsalz* is a **different chemical at roughly half the dose**: KIO₃ 15–25 mg I/kg (BfR/DGE). WHO "adequately iodized" = 15–40 ppm I.
- **The direct sauerkraut experiment.** Müller et al. 2018, *Food Microbiol* 76:473–480, doi:10.1016/j.fm.2018.07.009: sauerkraut at **1.0% salt, iodized vs not**, with and without *L. plantarum*/*L. mesenteroides* starters, 16S sequencing. With starters LAB went 10⁷→10⁹ CFU/mL in 24 h, pH<4.0; spontaneous reached 10⁹ with pH<4.0 **only on day 3**. "The use of iodized salt **did not statistically significantly influence** microbial populations in the fermentation. Thus, **there is no basis for the popular held belief** that the use of iodized salt inhibits the growth of the bacteria important for the sauerkraut fermentation." Only signal: **p = 0.06** for yeasts/moulds in spontaneous fermentations — i.e. if iodine does anything, it targets **yeasts**.
- **Cucumbers.** Stoll et al. 2020, *Food Microbiol* 92:103552, doi:10.1016/j.fm.2020.103552: **5% brine ± iodine, 8 weeks at 20 °C**, 16S — fermentation driven by salt concentration, "**not** by the use of iodized table salt … does not negatively affect the fermentation process."
- **The one real effect is cosmetic and specific to *iodate*.** Amr & Jabay 2004, *J Food Agric Environ* 2(2):151–156: 10% brine with **40 mg/kg I as KI or KIO₃**, 5 vegetables, 12 days. **KIO₃ produced significant (P<0.05) darkening and softening** (cucumber colour score 6.9ᵃ control / 7.0ᵃ KI / **5.4ᵇ KIO₃**); **KI produced none of these effects**; taste unaffected either way. So the folklore has a grain of truth only for iodate-iodized salt and only as a colour/texture defect in light-coloured pickles.
- **Dairy and pickle corroboration:** blinded crossover with 80 jars and 30 judges found no significant sensory difference (Badran et al. 1996, *East Mediterr Health J* 2(2):219–223); systematic review of 34 studies/38 foods found no adverse organoleptic change (Blankenship et al. 2018, *J Food Sci Technol* 55:3341–3352, [PMC6098777](https://pmc.ncbi.nlm.nih.gov/articles/PMC6098777/)); olives with 0.006% KIO₃ over 8 months showed reduced microbial load consisting of yeasts only, with no sensory difference (Lanza et al. 2020, *Foods* 9:301, [PMC7142713](https://pmc.ncbi.nlm.nih.gov/articles/PMC7142713/)). Cheese/Emmental/Gruyère/Camembert/Bulgarian white cheese and yogurt studies at 28–55 ppm I: all null.
- **Origin of the warning is traceable and empty:** "some unpublished reports" (WHO EMRO 1995) → tested by Badran 1996 → no effect found. Modern extension claims (e.g. OSU HYG-5342: "iodine can prevent the bacterial fermentation") carry no citation. USDA/NCHFP explicitly permits iodized salt: "Fermented and non-fermented pickles may be safely made using **either iodized or non-iodized** table salt. However, non-caking materials added to table salts may make the brine cloudy."
- **No MIC exists** for iodine/iodide/iodate against *Lactobacillus*, *Leuconostoc*, *Pediococcus* or *Lactococcus*. Do not invent one. **No iodized-salt study exists for kimchi or pepper mash.**
- **Model action: no iodine term.** Optional cosmetic flag only for KIO₃ salt in light-coloured pickles.

---

## 6. Other water factors

| Factor | Real effect? | Numbers | Source | Confidence |
|---|---|---|---|---|
| **Water temperature** | **The only water parameter with a real, large rate effect — and it should feed the existing temperature model, not a "water factor".** | USDA/NCHFP: **70–75 °F (21–24 °C) → 3–4 weeks; 60–65 °F (16–18 °C) → 5–6 weeks; below 60 °F may not ferment; above 75 °F may go soft** — that pair implies an apparent Q₁₀ ≈ 1.9–2.1 across ~17–23 °C. The best *measured* coefficient for a LAB fermentation is **Q₁₀ = 2.64 (95% CI 2.30–3.04), Ea = 71.9 kJ/mol, for the rate of lactic-acid accumulation over 17–29 °C** (Laureys et al. 2022, *Front Microbiol* — water kefir, i.e. LAB + yeast, not a vegetable: use as a proxy, not as a vegetable measurement). Q₁₀ is strongly reference-temperature dependent and rises below ~15 °C: from *L. plantarum* μ in milk (8 °C 0.0049; 15 °C 0.0641; 21 °C 0.1823; 25 °C 0.2920 h⁻¹; Matejčeková et al. 2016, *Acta Chim Slovaca* 9:104–108, doi:10.1515/acs-2016-0018) the implied Q₁₀ is ~4.6 over 15–25 °C and far larger approaching the ~8 °C growth floor. Measured kimchi: **15 °C reached pH 4.0–4.5 within 3 days**, while 4 °C is a long-term storage regime (Kim et al. 2025, *Foods* 14:2826). Defect thresholds: bloaters and soft pickles both reported "above 75 °F" (NC State Extension); the critical bloating window is days 1–12 and less bloating occurs at lower temperature. | NCHFP sauerkraut guidance https://nchfp.uga.edu/how/ferment/recipes/sauerkraut ; Laureys et al. 2022, *Front Microbiol*; Matejčeková et al. 2016; NC State Extension | strong for direction and rough magnitude; moderate for any specific Q₁₀ in a vegetable matrix |
| **Water pH** | **Noise.** The vegetable/tissue buffer dominates; the water's only pH-relevant contribution is its alkalinity (bounded in §3.2). Initial cabbage + brine pH is 5.9–6.5 whatever the tap pH in the normal 6.5–8.5 range. | BCCDC guideline | moderate |
| **Mn²⁺ as an LAB cofactor** | **Real physiology, irrelevant at tap concentrations by 10⁴–10⁶×.** In cucumber juice fermentation, **10–60 mM Mn (549–3,296 mg/L)** significantly increased glucose and fructose utilisation; above that it reduced it. Tap water Mn median ≈ 2.3 µg/L (statewide median 17 µg/L, N=37,210); EPA secondary MCL 0.05 mg/L. Mechanism is real (*L. plantarum* has no superoxide dismutase and substitutes 20–25 mM intracellular Mn(II); Archibald & Fridovich 1981, *J Bacteriol* 145:442–451, doi:10.1128/jb.145.1.442-451.1981), but the vegetable supplies it. | Lu, Fleming, McFeeters & Yoon 2002, *J Food Sci* 67:1155–1161, doi:10.1111/j.1365-2621.2002.tb09469.x ; Friedman et al. 2024, *J Expo Sci Environ Epidemiol* 34:58–67 | strong that it is noise |
| **Mg²⁺ / K⁺** | **Noise.** No dose–response stimulation is documented for vegetable LAB. What exists are *inhibition* thresholds for *L. pentosus*: KCl NIC ≈8.4%, MgCl₂ NIC ≈9.8% (Bautista-Gallego et al. 2008, *J Food Prot* 71:1412–1421). Tap Mg ≈3.6 mg/L is ~7,000× below. | as cited | strong that it is noise |
| **Fluoride (0.7–1.0 mg/L)** | **Noise.** The lowest fluoride concentration showing LAB inhibition is **1 mM NaF = 19 mg/L F⁻** (5–46% inhibition of oral lactobacilli); 5 mM = 95 mg/L, 20 mM = 380 mg/L. Drinking water at 0.7–1.0 mg/L is **19–27× below the lowest inhibitory concentration**. No fluoride MIC exists for dairy or vegetable starters. | Ahumada Ostengo, Wiese & Nader-Macías 2005, *Can J Microbiol* 51:133–140, doi:10.1139/w04-128 | strong that it is noise |
| **Nitrate** | **Noise for rate; the vegetable, not the water, drives nitrite.** Water at the 10 mg/L EPA MCL contributes ~1% of the vegetable's own nitrate (vegetables carry 10–4,800 mg/kg; lettuce 1,725, cucumber 32). Commercial kimchi: nitrate 121.9 ± 36.8 mg/100 g, nitrite 2.3 ± 0.1; sauerkraut nitrate 26.9–47.2, nitrite 7.2–11.2. Nitrite peak in NE Chinese sauerkraut 32.15 mg/kg at pH 4.7, falling to 0.04 mg/kg at pH 3.6. | Ding et al. 2018, *Food Control* 90:304–311, doi:10.1016/j.foodcont.2018.03.005 ; Xu et al. 2024, *Foods* 13:4168 | strong |
| **Sulfate** | **Noise.** Sulfate suppressed sugar utilisation in cucumber juice only at **10–360 mM (10 mM = 960 mg/L)**; typical tap sulfate ≈25 mg/L is ~38× below the lowest tested level. H₂S spoilage is documented in olive brines (*Desulfovibrio aestuarii*) but no threshold data were obtained. | Lu et al. 2002 (above) | moderate |
| **Iron** | **Quality, not rate.** Documented defect is blackening/oxidation; iron is not nutritionally required by LAB. NCHFP lists "Brass, iron, copper or zinc utensils" as a separate cause of dark pickles, and NC State Extension notes "iron in the water is the worst offender". EPA secondary MCL 0.3 mg/L. **No mg/L Fe dose–response exists for LAB inhibition or pickle darkening** — the guidance is qualitative. | USDA FB 1438; [NCHFP, causes and solutions for problems with fermented pickles](https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/causes-and-possible-solutions-for-problems-with-fermented-pickles/) ; NC State Extension | moderate |
| **Copper** | **No evidence found for fermentation rate.** Copper inhibits wine malolactic bacteria (Vidal et al. 2001, *Am J Enol Vitic* 52:223) but no free-Cu²⁺ MIC for vegetable LAB and no data on copper plumbing/pesticide residues affecting fermentation. EPA secondary MCL 1.0 mg/L. | as cited | no experimental evidence found |
| **Chlorite / chlorate** | **No evidence found.** EPA MCL chlorite 1.0 mg/L (MCLG 0.8); no MIC against LAB and no fermentation effect located. | — | no experimental evidence found |

**Model action:** the only water parameter worth a rate term beyond alkalinity is **water temperature** (which is really ferment temperature). Mn, Mg, K, F⁻, Fe, NO₃⁻, SO₄²⁻, Cu, chlorite/chlorate should have **no coefficients at all** — every one of them is 10³–10⁶× below any concentration shown to matter in a vegetable fermentation.

## 7. Salt type: crystal form, anti-caking agents, impurities

### 7.1 Crystal form and density (strong)
- **Diamond Crystal kosher: 2.8 g/tsp; Morton kosher: 4.8 g/tsp; table salt: 6.0 g/tsp (18 g/tbsp); Morton Canning & Pickling: also 6.0 g/tsp** — its advantage is zero additives, **not** density. The widely repeated "1.4 g per ¼ tsp Diamond Crystal" is a **2× error**; delete it. Maldon flake ≈6.0 g/tsp is contested.
- Bulk densities (Morton product data): **Flour Salt (<212 µm) 0.90–1.04 g/mL; TFC Purex (coarse cubic) 1.14–1.30 g/mL** — i.e. the *finer* grade is the *less* dense one, so "finer = denser" is not a safe rule. No tapped-density values exist.
- Jamming/caking matters more than density for dry-salting: dissolution rate scales with surface area, so flake/kosher salt dissolves and releases brine more slowly than fine salt at equal mass. **No study quantifies this effect on fermentation rate.** Confidence: moderate (physics) / no experimental evidence found (rate).

### 7.2 Anti-caking agents (weak-or-contested)
- Morton table salt uses **calcium silicate**; sodium ferrocyanide (YPS) is also permitted — **US limit 13 ppm** (21 CFR 172.490); **EU limit 20 mg/kg as anhydrous potassium ferrocyanide**. (The common "13 ppm EU" figure is wrong.)
- **No experiment exists** on any anti-caking agent vs LAB growth, fermentation rate, brine clarity, or colour. The "cloudy brine / dark pickles" claim is uncited institutional guidance, and extension services contradict each other. NCHFP's hedged formulation ("non-caking materials added to table salts **may** make the brine cloudy") is the strongest supportable statement.
- Iodized table salt's **dextrose at 0.04% (400 ppm)** → ~10 ppm dextrose in a 2.5%-salt kraut, against several percent sugar already present in cabbage. **No evidence it matters.**
- **Model action:** none for rate. At most a cosmetic "brine may be cloudy" note.

### 7.3 Unrefined / mineral-rich salts (moderate)
- Real, reproducible **community and metabolite** shifts — driven by **Mg and Ca**, not K. ICP-MS (Lee et al. 2022, *Heliyon* 8(11):e11360, doi:10.1016/j.heliyon.2022.e11360): **Mg 262 mg/kg (purified) vs 5,150–12,545 (solar); Ca 465 vs 835–1,893; K is highest in purified salt (2,779 mg/kg)**; Mn/Fe/Zn non-detectable in purified. Solar salt → more *Leuconostoc*/*Weissella*; purified → more *Latilactobacillus sakei*. Solar salt also has its own fermentation literature in kimchi (Chang et al. 2011, *Korean J Food Preservation* 18:256–265, doi:10.11002/kjfp.2011.18.2.256).
- **No rate effect was reported in any of these studies** — the differences are in community composition and metabolites, not in time-to-pH.
- Salt-derived Ca at 2.5% salt contributes only ~4 mM Ca — **5–10× below the 20–40 mM CaCl₂ dose that actually firms pickles** (McFeeters, Fleming & Brenes Balbuena 1995, *J Food Sci* 60:786–788, doi:10.1111/j.1365-2621.1995.tb06229.x), so switching to sea salt will not firm a ferment.
- Contaminant caution: gourmet salt ICP-MS found **Pb above the maximum level in all 10 samples tested** (Di Salvo et al. 2023, *Toxics* 11:705, doi:10.3390/toxics11080705). Confidence: moderate.
- **Model action:** optionally let salt type shift the *community/flavour* prediction; **do not let it change the rate.**

### 7.4 Salt substitutes — KCl and CaCl₂ (strong)
- **KCl up to ~30% of total salt is safe; 50% is the sensory ceiling with measurable bitterness.** Wolkers-Rooijackers et al. 2013, *LWT* 54:383–388, doi:10.1016/j.lwt.2013.07.002 ("Effects of sodium reduction scenarios on fermentation and quality of sauerkraut"): a 30% KCl mix gave equal titratable acidity (15.0 vs 15.0 g/kg), pH 3.5 vs 3.6, and *firmer* kraut (136 N vs 74 N). Li et al. 2022, *J Food Process Preserv* 46:e16622, doi:10.1111/jfpp.16622, specifically measured **fermentation kinetics** under KCl replacement of NaCl in Northeast China sauerkraut and found the substitution tolerable at partial replacement. A 2025 study of NaCl reduction with KCl/CaCl₂ substitution reached the same practical conclusion (Musiienko et al. 2025, *Front Nutr* 12, doi:10.3389/fnut.2025.1657034). **KCl does not inhibit acidification.**
- Inhibitory ranking of chloride salts toward fermentation: **CaCl₂ ≈ NaCl > KCl > MgCl₂**; substitution behaves as an **ionic-strength** effect, not a taste swap.
- **CaCl₂: 20–40 mM for texture**; 100 mM only when removing NaCl. McFeeters & Pérez-Díaz 2010 (*J Food Sci* 75:C291–C296, doi:10.1111/j.1750-3841.2010.01558.x) fermented cucumbers in brine with **CaCl₂ as the only salt at 100–300 mM** and got pH <3.5 with a normal metabolite pattern and no spoilage — i.e. calcium at 50–100× the hardest tap water does **not** slow fermentation. Calcium chloride plus potassium sorbate has been used since the 1990s to reduce NaCl in natural cucumber fermentation (Guillou, Floros & Cousin 1992, *J Food Sci* 57:1364–1368, doi:10.1111/j.1365-2621.1992.tb06859.x; Buescher & Hamilton 1988, *J Food Sci* 53:296–297, doi:10.1111/j.1365-2621.1988.tb10238.x), and consumer acceptance of CaCl₂-brine pickles has been tested (Wilson et al. 2015, *J Food Sci* 80, doi:10.1111/1750-3841.12882). Commercial-scale CaCl₂ brine trials gave terminal pH 3.23 ± 0.09 vs 3.30 ± 0.12 for NaCl, with pickles 1.8 N less firm (P<0.0001) plus colour defects (McMurtrie & Johanningsmeier 2018, *J Food Quality* 2018:8051435, doi:10.1155/2018/8051435). Bitterness threshold in dill chips is **61.8 ± 7.6 mM**, so **≤35 mM is the safe dosing window**. CaCl₂ does **not** reduce bloater damage.
- **Model action:** if salt substitution is offered, encode KCl ≤30% (warn at 50%) and CaCl₂ 20–40 mM as a *texture* input with no rate penalty.

## 8. Recommended parameterisation

```
salt_effect(salt_pct, recipe_pct, temp_C):
    # U-shaped, optimum at the recipe level for cabbage ferments
    d = salt_pct - recipe_pct
    if d >= 0:
        # convex in salt; slopes calibrated to Xiong 2016 + kimchi 5C data
        per_pct = 0.15 if temp_C >= 18 else 0.30      # +15%/1% warm, ~+30-50%/1% cold
        f = (1 + per_pct) ** (d * (1 if salt_pct < 5 else 1.6))   # steeper above 5%
        f = min(f, 3.0)                                # 2%->8% is 3x
    else:
        # low salt does NOT speed the ferment up; it delays LAB takeover
        f = 1.0 + min(0.5, 0.25 * (-d))                # never faster than baseline
        flag_spoilage_risk(salt_pct < 0.015)
    apply f to the LAG term primarily (e.g. lag *= f**0.8, rate *= f**0.2)
    # hard floor: above ~8-10% NaCl the ferment can stall or hand over to
    # Pseudomonas/Pectobacterium/yeasts; flag above 10% and above 4-5% in
    # pepper/cucumber brines where non-LAB taxa take over

water_effect(alkalinity_mgL_as_CaCO3, early_phase_days):
    meq = alkalinity_mgL_as_CaCO3 / 50.0     # = mmol H+ neutralised per litre
    # the early phase needs ~50-120 mmol H+/L of net acid; production ~30-50 mmol/L/day
    delay_days = meq / 40.0                  # conservative middle estimate
    pct = delay_days / early_phase_days
    pct = min(pct, 0.04 if alkalinity_mgL_as_CaCO3 < 150 else 0.10)
    early_phase_days *= (1 + pct)            # applied to the early phase ONLY
    # texture (Ca-pectin) is NOT part of this term; CaCl2 20-40 mM is a texture input
    # if only hardness is available: use it as an upper bound and warn that
    # softened water has low hardness but unchanged alkalinity
```

Also recommended: (a) expose **time-to-pH-4.6** as a distinct model output from **total fermentation time**, since their salt sensitivities differ by design; (b) surface an explicit *uncertainty band* on salt-driven timing (±40% is honest) rather than a point estimate; (c) keep a spoilage flag for salt <1.5% (Enterobacterales) and for salt >3.5% in cabbage / >5% in cucumber / >8% in pepper (non-LAB takeover, yeast/pink kraut).

---

## 9. Explicit evidence gaps (do not fill these with folklore)
1. No study reports a clean salt × time-to-pH matrix (1/2/2.5/3/4/5%) for sauerkraut or kimchi.
2. No study measures fermentation rate as a function of **water hardness or alkalinity**; §3.2 is a mass-balance bound, not a measurement.
3. No dose–response study of free chlorine or chloramine at 0.2–4 mg/L on vegetable LAB; the evidence is at 1–100 ppm ClO₂ plus chlorine-demand kinetics.
4. No MIC for iodine species against vegetable LAB; no iodized-salt study for kimchi or pepper mash.
5. No experiment on anti-caking agents / YPS vs fermentation or brine clarity.
6. No vegetable-brine dose–response for Mn²⁺/Mg²⁺/F⁻ as rate factors.
7. No formal partitioning of salt effects into lag (λ) vs maximum specific rate (μmax) for a vegetable brine; the lag-dominance conclusion (§1.3) is inferred from five consistent datasets plus mechanism.
8. Pepper mash is the least-studied matrix in this review: the classic practice is 6–15% salt with multi-month fermentations, and the only quantitative sources found are Tang 2024 (peppers, 5.4% vs 14.4%), HortScience 2005 (15% jalapeño mash) and Flores et al. 2007 (*LWT* 40:922–928, doi:10.1016/j.lwt.2006.08.005, calcium and pepper-mash consistency).
9. No measured first-order decay constant or half-life for free chlorine in a **standing, unstirred, open** container at 0.2–1.0 mg/L (surface-area/temperature dependence unquantified); no experimental test of **chloramine** at 1–4 mg/L on vegetable LAB.
10. The Campden tablet mass (~0.44 g metabisulfite) rests on secondary sources — no manufacturer publishes a verified spec — and the 5 mg/L SO₂ LAB-inhibitory threshold was established at wine/olive pH 3.5–4.0. At early-brine pH ~6, molecular SO₂ is roughly 300× lower, so the fermentation impact of a sulfite overdose early in a ferment is unquantified.
11. No Q₁₀ or Arrhenius measurement exists for sauerkraut, cucumber brine or pepper mash, and none isolates **water** temperature from bulk fermentation temperature. The 15 °C kimchi point (pH 4.0–4.5 in 3 days) and the NCHFP week-scale guidance are the only two anchors; there is no readable days-to-pH table for kimchi at 5/10/15/20/25 °C.
12. No study measures the **rate** effect of unrefined/solar salt — only community and metabolite differences. Likewise no experiment on anti-caking agents at any dose.

---

## 10. Reference list (with URLs)
Bibliographic details below were verified against Crossref/Europe PMC where a DOI is given. Places where a claim came from a secondary or unverifiable source are marked *[unverified]*.

**Salt × rate / succession**
- Xiong T. et al. (2016) Effects of salt concentration on Chinese sauerkraut fermentation. *LWT* 69:169–174. https://doi.org/10.1016/j.lwt.2015.12.057 (LAB-onset data quoted here as cited in Świder 2021)
- Yang X. et al. (2020) Effect of salt concentration on microbial communities, physicochemical properties and metabolite profile during spontaneous fermentation of Chinese northeast sauerkraut. *J Appl Microbiol* 129:1458–1471. https://doi.org/10.1111/jam.14786
- Yang X. et al. (2019) Effect of salt concentration on quality of Chinese northeast sauerkraut … *Food Bioscience* 30:100421. https://doi.org/10.1016/j.fbio.2019.100421
- Hong G.-H. et al. (2021) Changes in microbial community by salt content in kimchi during fermentation. *J Korean Soc Food Sci Nutr* 50(6):648–653. https://doi.org/10.3746/jkfn.2021.50.6.648
- Świder O. et al. (2021) Time evolution of microbial composition and metabolic profile … model cucumber fermentation brined with 0.5% to 5.0% sodium chloride. *Molecules* 26:5796. https://doi.org/10.3390/molecules26195796
- Eilers T. et al. (2026) From diversity to dominance: how salt and CO₂ shape LAB-dominated ecosystems in vegetable fermentations. *Microbiol Spectr* 14(8). https://doi.org/10.1128/spectrum.03578-25
- Plengvidhya V., Breidt F., Lu Z., Fleming H.P. (2007) DNA fingerprinting of lactic acid bacteria in sauerkraut fermentations. *Appl Environ Microbiol* 73:7697–7702. https://doi.org/10.1128/AEM.01296-07 · https://pmc.ncbi.nlm.nih.gov/articles/PMC2168044/
- Zabat M.A. et al. (2018) Microbial community analysis of sauerkraut fermentation reveals a stable and rapidly established community. *Foods* 7(5):77. https://doi.org/10.3390/foods7050077
- Papadimitriou K. et al. (2016) Stress physiology of lactic acid bacteria. *Microbiol Mol Biol Rev* 80:837–890. https://doi.org/10.1128/MMBR.00036-16
- Rothwell M.A.R. et al. (2022) Growth of γ-proteobacteria in low salt cucumber fermentation is prevented by lactobacilli and the cover brine ingredients. *Microbiol Spectr* 10:e01031-21. https://doi.org/10.1128/spectrum.01031-21
- Tang J. et al. (2024) Effect of salt concentration on the quality and microbial community during pickled peppers fermentation. *Food Chem X* 22:101594. https://doi.org/10.1016/j.fochx.2024.101594
- Janiszewska-Turak E. et al. (2024) Studying the influence of salt concentrations on betalain and selected physical and chemical properties in the lactic acid fermentation process of red beetroot. *Molecules* 29:4803. https://doi.org/10.3390/molecules29204803
- Fleming H.P., Humphreys E.G., Thompson R.L., McFeeters R.F. Acidification of commercially fermented cucumbers in bulk tanks to increase microbial stability. USDA-ARS. https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p313.pdf
- BCCDC *Fermented Foods Guideline — 3.2 Sauerkraut*. https://www.bccdc.ca/resource-gallery/Documents/Educational%20Materials/EH/FPS/Food/Fermented/Fermented%20Foods%20Guideline%20-%203.2%20Sauerkraut.pdf
- FDA, 21 CFR Part 114 (Acidified Foods). https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-114
- NCHFP, Making sauerkraut (temperature/time guidance). https://nchfp.uga.edu/how/ferment/recipes/sauerkraut
- Kim et al. (2025) Effect of fermentation conditions on functional quality of Napa cabbage kimchi. *Foods* 14(16):2826. https://doi.org/10.3390/foods14162826

**Water chemistry**
- USGS Water Science School — Hardness. https://www.usgs.gov/special-topics/water-science-school/science/hardness-water
- USGS Water Science School — Alkalinity. https://www.usgs.gov/special-topics/water-science-school/science/alkalinity-and-water
- McFeeters R.F., Pérez-Díaz I.M. (2010) Fermentation of cucumbers brined with calcium chloride instead of sodium chloride. *J Food Sci* 75:C291–C296. https://doi.org/10.1111/j.1750-3841.2010.01558.x
- McFeeters R.F., Fleming H.P., Brenes Balbuena C. (1995) Softening rates of fermented cucumber tissue: effects of pH, calcium, and temperature. *J Food Sci* 60:786–788. https://doi.org/10.1111/j.1365-2621.1995.tb06229.x
- Hudson J.M., Buescher R.W. (1985) Pectic substances and firmness of cucumber pickles as influenced by CaCl₂, NaCl and brine storage. *J Food Biochem* 9:211–229. https://doi.org/10.1111/j.1745-4514.1985.tb00350.x
- Buescher R. et al. (2011) Elevated calcium chloride in cucumber fermentation brine prolongs pickle product crispness. *J Food Quality* 34:93–99. https://doi.org/10.1111/j.1745-4557.2011.00374.x
- LeFevre E. *Making Fermented Pickles*, USDA Farmers' Bulletin 1438. https://gutenberg.org/files/48722/48722-h/48722-h.htm
- NCHFP, Causes and possible solutions for problems with fermented pickles. https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/causes-and-possible-solutions-for-problems-with-fermented-pickles/
- NC State Extension, Pickle and pickle product problems. https://content.ces.ncsu.edu/pickle-and-pickle-product-problems

**Chlorine / chloramine / dechlorination**
- Costilow R.N., Uebersax M.A., Ward P.J. (1984) Use of chlorine dioxide for controlling microorganisms during the handling and storage of fresh cucumbers. *J Food Sci* 49(2):396–401. https://doi.org/10.1111/j.1365-2621.1984.tb12431.x
- Reina L.D., Fleming H.P., Humphries E.G. (1995) Microbiological control of cucumber hydrocooling water with chlorine dioxide. *J Food Prot* 58(5):541–546. https://doi.org/10.4315/0362-028X-58.5.541
- Srinivasan P. et al. (2020) Towards enhanced chlorine control: mathematical modeling for free chlorine kinetics during fresh-cut produce washing. *Postharvest Biol Technol* 161:111092. https://doi.org/10.1016/j.postharvbio.2019.111092
- Abnavi M.D. et al. (2019) Modeling of free chlorine consumption and *Escherichia coli* O157:H7 cross-contamination during fresh-cut produce wash cycles. *J Food Sci* 84:2736–2744. https://doi.org/10.1111/1750-3841.14774
- Weng S. et al. (2016) Assessment and speciation of chlorine demand in fresh-cut produce wash water. *Food Control* 60:543–551. https://doi.org/10.1016/j.foodcont.2015.08.031
- CDC, About water disinfection with chlorine and chloramine. https://www.cdc.gov/drinking-water/about/about-water-disinfection-with-chlorine-and-chloramine.html
- Fairey J.L., Speitel G.E., Katz L.E. (2007) Monochloramine destruction by GAC. *J AWWA* 99(7):110–120. https://doi.org/10.1002/j.1551-8833.2007.tb07985.x
- Wells A., Osborne J.P. (2012) Impact of acetaldehyde- and pyruvic acid-bound sulphur dioxide on wine lactic acid bacteria. *Lett Appl Microbiol* 54:187–194. https://doi.org/10.1111/j.1472-765X.2011.03193.x
- Romero-Gil V., Garrido-Fernández A., Arroyo-López F.N. (2016) In silico logistic model for table olive related microorganisms as a function of sodium metabisulphite, pH, and temperature. *Front Microbiol* 7:1370. https://doi.org/10.3389/fmicb.2016.01370
- EPA 832-F-00-022, *Wastewater Technology Fact Sheet: Dechlorination* (SO₂ / NaHSO₃ / Na₂S₂O₅ stoichiometry).

**Iodine and salt type**
- Müller A. et al. (2018) Influence of iodized table salt on fermentation characteristics and bacterial diversity during sauerkraut fermentation. *Food Microbiol* 76:473–480. https://doi.org/10.1016/j.fm.2018.07.009 · OA: https://www.openagrar.de/receive/openagrar_mods_00040830
- Stoll D.A. et al. (2020) Influence of salt concentration and iodized table salt on the microbiota of fermented cucumbers. *Food Microbiol* 92:103552. https://doi.org/10.1016/j.fm.2020.103552
- Amr A., Jabay O. (2004) Effect of iodized salt on the physio-chemical and organoleptic quality of vegetable pickles. *J Food Agric Environ* 2(2):151–156. https://www.wlfpublisher.com/admin_1992/pdf/articles/2004_issue2_f27.pdf
- Badran et al. (1996) *East Mediterr Health J* 2(2):219–223. https://www.emro.who.int/emhj-volume-2-1996/volume-2-issue-2/article5.html
- Blankenship et al. (2018) *J Food Sci Technol* 55(9):3341–3352. https://pmc.ncbi.nlm.nih.gov/articles/PMC6098777/
- Dasgupta P.K. et al. (2008) Iodine in US table salt. *Environ Sci Technol* 42:1315–1323. https://pubmed.ncbi.nlm.nih.gov/18351111/
- 21 CFR 184.1634 (potassium iodide) / 184.1265 (cuprous iodide) / 184.1635 (potassium iodate). https://ecfr.io/Title-21/Section-184.1634
- NCHFP, Salts used in pickling. https://nchfp.uga.edu/how/pickle/general-information-pickling/salts-used-in-pickling/
- El-Wakeil F.A. (1958) PhD thesis, Ohio State University (iodized salt vs KI-spiked sauerkraut). https://etd.ohiolink.edu/acprod/odb_etd/etd/r/1501/10?clear=10&p10_accession_num=osu148656241580449
- Lee et al. (2022) Effects of salt type on the metabolites and microbial community in kimchi fermentation. *Heliyon* 8(11):e11360. https://doi.org/10.1016/j.heliyon.2022.e11360
- Di Salvo E. et al. (2023) Gourmet table salts: the mineral composition showdown. *Toxics* 11:705. https://doi.org/10.3390/toxics11080705
- Chang et al. (2011) Effect of solar salt on the fermentation characteristics of kimchi. *Korean J Food Preservation* 18:256–265. https://doi.org/10.11002/kjfp.2011.18.2.256
- Wolkers-Rooijackers J.C.M. et al. (2013) Effects of sodium reduction scenarios on fermentation and quality of sauerkraut. *LWT* 54:383–388. https://doi.org/10.1016/j.lwt.2013.07.002
- Li et al. (2022) Effect of KCl replacement of NaCl on fermentation kinetics, organic acids and sensory quality of sauerkraut from Northeast China. *J Food Process Preserv* 46:e16622. https://doi.org/10.1111/jfpp.16622
- Musiienko et al. (2025) Impact of NaCl reduction and substitution with KCl and CaCl₂ on quality attributes. *Front Nutr* 12. https://doi.org/10.3389/fnut.2025.1657034
- Guillou A.A., Floros J.D., Cousin M.A. (1992) Calcium chloride and potassium sorbate reduce sodium chloride used during natural cucumber fermentation. *J Food Sci* 57:1364–1368. https://doi.org/10.1111/j.1365-2621.1992.tb06859.x
- Buescher R.W., Hamilton C. (1988) Effect of calcium chloride and alum on fermentation, desalting, and firmness retention of cucumber pickles. *J Food Sci* 53:296–297. https://doi.org/10.1111/j.1365-2621.1988.tb10238.x
- Wilson et al. (2015) Consumer acceptability of cucumber pickles produced by fermentation in calcium chloride brine. *J Food Sci* 80. https://doi.org/10.1111/1750-3841.12882
- McMurtrie E.K., Johanningsmeier S.D. (2018) Quality of cucumbers commercially fermented in calcium chloride brine without sodium salts. *J Food Quality* 2018:8051435. https://doi.org/10.1155/2018/8051435

**Mineral cofactors, fluoride, nitrate**
- Lu Z., Fleming H.P., McFeeters R.F., Yoon S.S. (2002) Effects of anions and cations on sugar utilization in cucumber juice fermentation. *J Food Sci* 67:1155–1161. https://doi.org/10.1111/j.1365-2621.2002.tb09469.x
- Archibald F.S., Fridovich I. (1981) Manganese and defenses against oxygen toxicity in *Lactobacillus plantarum*. *J Bacteriol* 145:442–451. https://doi.org/10.1128/jb.145.1.442-451.1981
- Ahumada Ostengo M. del C., Wiese B., Nader-Macías M.E. (2005) Inhibitory effect of sodium fluoride and chlorhexidine on the growth of oral lactobacilli. *Can J Microbiol* 51:133–140. https://doi.org/10.1139/w04-128
- Matejčeková Z. et al. (2016) Characterization of the growth of *Lactobacillus plantarum* in milk in dependence on temperature. *Acta Chim Slovaca* 9:104–108. https://doi.org/10.1515/acs-2016-0018
- Laureys D., Leroy F., Vandamme P., De Vuyst L. (2022) Backslopping time, rinsing of the grains during backslopping, and incubation temperature influence the water kefir fermentation process. *Front Microbiol* 13:871550. https://doi.org/10.3389/fmicb.2022.871550 (measured Q₁₀ = 2.64 for lactic-acid accumulation over 17–29 °C — LAB + yeast proxy, not a vegetable)
- Ding Z. et al. (2018) Evaluation of nitrate and nitrite contents in pickled fruit and vegetable products. *Food Control* 90:304–311. https://doi.org/10.1016/j.foodcont.2018.03.005
- Bautista-Gallego J. et al. (2008) Salt tolerance of *Lactobacillus pentosus* (KCl/MgCl₂ NIC and MIC). *J Food Prot* 71:1412–1421.
- Flores N., VanLeeuwen D., Pennock R. (2007) The effect of calcium on microbial quality and consistency of chile pepper mash during fermentation. *LWT* 40:922–928. https://doi.org/10.1016/j.lwt.2006.08.005
- HortScience (2005) Fermentation of jalapeño pepper mash. 40(3):880. https://doi.org/10.21273/hortsci.40.3.880f
