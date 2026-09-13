# Temperature vs. SPEED of vegetable lactic acid fermentation — quantitative, cited findings

**Scope:** sauerkraut, kimchi, cucumber pickles, pepper mash.
**Question:** measured acidification curves at controlled temperatures; time-to-target-pH/acidity; rate ratios between temperatures; Q10 / Arrhenius Ea; the Korean "optimum ripening temperature" literature; the classic USDA / Pederson & Albury temperature studies.
**Compiled:** from primary sources retrieved and read. Nothing here is invented; every number carries a URL and a confidence mark.

## How to read the confidence marks

| Mark | Meaning |
|---|---|
| **STRONG** | I retrieved the primary source and read the actual number/table/text. |
| **MODERATE** | Peer-reviewed abstract, review statement, extension publication, or a table I read in a scan rather than a text layer. |
| **WEAK** | Secondary citation, single unreplicated trial, or a number I could not re-verify. |
| **DERIVED** | Arithmetic I performed on someone else's published numbers. Not a published value. |

A note on method: several key sources (Pederson & Albury's bulletins, the 1984 Mheen & Kwon paper) exist only as image-only scans. I installed an OCR engine and/or read rendered page images to get at them, and I independently re-verified the headline numbers of every sub-search rather than relaying them. One relayed number was wrong and has been corrected here (see §2.2 note).

---

# 1. SAUERKRAUT

## 1.1 The cleanest days-vs-temperature dataset in the entire literature

**Parmele, H.B., Fred, E.B., Peterson, W.H., McConkie, J.E. & Vaughn, R.H. (1927),** *Journal of Agricultural Research* **35**(11): 1021–1038. **STRONG** — full public-domain text read.
URL: https://archive.org/details/sim_journal-of-agricultural-research_1927-12-01_35_11

Days required to reach **0.5% titratable acidity (as lactic acid)**, by initial vat temperature. Verbatim:

> "It can be seen that it was necessary for fermentation to go on for 11 days in the vat whose initial temperature was 44° F. before an acidity of 0.5 per cent was reached. This period was shortened to six days in the vat whose initial temperature was 53° F., to 3 days in the 65° vat, and to 24 hours in the 76° vat."

| Initial vat temp | Time to 0.5% TA | Relative rate | Implied Q10 over the step |
|---|---|---|---|
| 44 °F (6.7 °C) | **11 days** | 1.0× | — |
| 53 °F (11.7 °C) | **6 days** | 1.8× | 3.4 |
| 65 °F (18.3 °C) | **3 days** | 3.7× | 2.9 |
| 76 °F (24.4 °C) | **24 hours** | 11.0× | 6.1 |

Also verbatim: *"When the temperature of the shredded cabbage is between 65° and 75° the acidity increases rapidly during the first part of the fermentation, after which it increases slowly. When the temperature is below 65° the rise in acidity is more gradual and uniform throughout the entire process."*

**Caveats:** "initial" vat temperature — active vats self-heat several °F, so the effective temperature is above the nominal one, which flattens the true temperature response. One vat per temperature point. The 76 °F point (24 h) is rounded to the nearest day and dominates any Arrhenius fit, which is why the step Q10s are erratic.

**DERIVED** (my arithmetic on the table above): Arrhenius fit over 6.7–24.4 °C gives **Ea ≈ 91 kJ/mol, R² = 0.981**; overall **Q10(6.7→24.4 °C) ≈ 3.9**. Treat as indicative only, for the reason above.

## 1.2 Pederson & Albury — the classic Cornell temperature studies

Four bulletins from the New York State Agricultural Experiment Station (Cornell University), all open access on Cornell eCommons. All four were retrieved and read.

### Bulletin 824 (1969) — *The Sauerkraut Fermentation* — **STRONG**
Carl S. Pederson & Margaret N. Albury, 84 pp. https://hdl.handle.net/1813/4794
(PDF, verified working: https://ecommons.cornell.edu/bitstreams/202bc83c-d66d-471d-93f5-e826c1df866b/download — image-only scan, 87 pages, no text layer; I read the tables and the temperature section from rendered page images.)

Section "Influence of Temperature" (printed p. 7), verbatim numbers:

| Nominal temperature | Measured outcome (verbatim) |
|---|---|
| **7.5 °C (45.5 °F)**, 2.25% salt | *"fermentation is very slow. Leuconostoc mesenteroides will grow slowly and an acidity of only 0.8 to 0.9 per cent total acid, calculated as lactic acid, may be attained in a month; however … an acidity of about 0.4 per cent is attained in about 10 days."* … *"The kraut may not be completely fermented for 6 months or more or until the temperature in the vat slowly rises…"* (In Fig. 6a the vat was moved to a 65 °F room after 70 days to finish it.) |
| **18 °C (64.4 °F)**, 2.25% salt — "normal" for US kraut areas | Final total acidity **1.7–2.3%** as lactic acid; acetic:lactic ratio **≈1:4**. No day-count given. |
| **23 °C (73.4 °F)**, 2.25% salt | *"the rate of fermentation will be greater so that a brine acidity of 1.0 to 1.5 per cent … may be attained in 8 to 10 days. Active growth of Lactobacillus brevis and Lactobacillus plantarum may be initiated in 3 to 5 days and the kraut may be completely fermented in approximately 1 month."* |
| **32 °C (89.6 °F)**, 2.25% salt | *"the rate of fermentation may be very rapid and an acidity of 1.8 to 2.0 may be attained in 8 to 10 days."* Flavour *"will be inferior; it may be likened to acidified cabbage"*; kraut darkens, poorer shelf life, more subject to yeast spoilage, lower acetic acid and lower ascorbic acid. |

Fig. 6 caption (verbatim), noting a typo in the printed caption: *"…6(a) at 7.5 °C (44.6 °F) until 70th day; 6(b) at 18 °C (64.4 °F); 6(c) at 23 °C (73.4 °F); and 6(d) at 32 °C (89.6 °F)."* The caption prints 44.6 °F where the body text prints 45.5 °F; 45.5 °F = 7.5 °C exactly, so the **body text is correct and the caption is a typo**.

### Bulletin 824, **Table 1** — the best *isothermal* multi-temperature dataset available — **STRONG**

"TABLE 1.—The More Rapid Initiation of Acid Production by *Leuconostoc mesenteroides* than by *Lactobacillus brevis* and *Lactobacillus plantarum*." Values are **percentage of maximum acidity produced**, at 1 / 2 / 10 days:

| Temperature | *Lc. mesenteroides* | *L. brevis* | *L. plantarum* |
|---|---|---|---|
| **10 °C (50 °F)** | **3 / 25 / 62** | 0 / 0 / 10 | 0 / 0 / 18 |
| **15 °C (59 °F)** | **19 / 47 / 90** | 0 / 0 / 48 | 0 / 0 / 55 |
| **20 °C (68 °F)** | **50 / 84 / 100** | 8 / 18 / 74 | 12 / 31 / 80 |
| **25 °C (77 °F)** | **77 / 94 / 100** | 15 / 33 / 91 | 34 / 54 / 92 |

This is the single most useful table in the literature for the question asked, because it isolates the *initiating* organism and shows both the temperature effect and the species-succession effect. Note in particular that **at 10 °C both lactobacilli are still at 0% at 2 days** — at cold temperatures the fermentation is carried almost entirely by *Leuconostoc*.

**DERIVED** (my arithmetic on Table 1, *Lc. mesenteroides*, 2-day column): rate ratio **20 °C / 10 °C = 3.36×**; 15/10 = 1.88×; 25/15 = 2.0×. Arrhenius fit: **Ea ≈ 64 kJ/mol, R² = 0.94**. This is the most defensible sauerkraut Ea estimate available, and it lands inside the general LAB band (§5).

### Bulletin 614 (1932) — commercial-vat variability — **STRONG**
https://hdl.handle.net/1813/4545
125 commercial vats; days to reach **1.60% acidity ranged from 14 to 80 days** purely on weather. Verbatim: *"in 1929 (Table 1) it required from 14 to 80 days to ferment various tanks of kraut. Seven tanks filled between October 4 and 11 required from 15 to 80 days for the kraut to cure."* This is the real-world spread that no single-temperature curve captures.

### Bulletin 595 (1931) — **MODERATE**
https://hdl.handle.net/1813/4572
Verbatim: *"The temperature in the plant is often raised, and the fermentation of the kraut is ordinarily completed in from 3 weeks to a month. That is, the kraut has attained an acidity 1.5 per cent or more of acid…"* Also notes that lower natural temperatures favour the flavour-producing *Leuconostoc* over the straight acid producers.
**Flag:** a sub-search reported that Bulletin 595 states fermentations at 30–60 °F stall near 1% acid and are still incomplete at 4–5 months. **I could not re-locate that passage**, so I am not reporting it as verified. The equivalent claim *is* verified for cucumbers (Bulletin 744, §3.1).

### Bulletin 744 (1950) — **cucumbers**, but relevant to the temperature question — **STRONG**
Carl S. Pederson & Margaret N. Albury, *"Effect of Temperature upon Bacteriological and Chemical Changes in Fermenting Cucumbers"*, Bulletin 744, August 1950. https://hdl.handle.net/1813/4307
Temperatures **45, 65, 75, 86, 97 °F**; salt 2.5, 5, 7.5%. Raw total-acid data (2.5% salt series):

| Series | Temp | Selected total acidity (% as lactic) by day |
|---|---|---|
| H | **45 °F (7.2 °C)** | 11 d = 0.26 · 14 d = 0.42 · 18 d = 0.56 · **21 d = 0.60** · 28 d = 0.57 · 35 d = 0.56 |
| J | **65 °F (18.3 °C)** | 0.11 · 0.15 · 0.26 · 0.38 · 0.51 · 0.54 · 0.67 · **0.77** |
| K | **75 °F (23.9 °C)** | 1 d = 0.16 · 3 d = 0.45 · 4 d = 0.51 · **7 d = 0.67** · 9 d = 0.80 |

Verbatim conclusion: *"It is obvious from the results that fermentations at 50° F are retarded to such a degree that even after 5 months normal acidity is not attained."*
**DERIVED:** ~0.6–0.67% acidity is reached in **21 days at 45 °F vs 7 days at 75 °F → ≈3× faster for +30 °F (16.7 °C)**.

## 1.3 The only modern full pH-vs-time curve at a controlled temperature

**Tlais, A.Z.A., Lemos Junior, W.J.F., Filannino, P., Campanaro, S., Gobbetti, M. & Di Cagno, R. (2022),** *Microbiology Spectrum* **10**(4): e00168-22. **STRONG** (Table 1 read in full text).
https://pmc.ncbi.nlm.nih.gov/articles/PMC9430578/ · https://doi.org/10.1128/spectrum.00168-22

Sauerkraut at **15 °C** for 42 days:

| Day | 0 | 2 | 3 | 4 | 5 | 7 | 14 | 21 | 28 | 35 | 42 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pH | 5.87 | 5.70 | 5.15 | 4.69 | 4.36 | 3.93 | 3.74 | 3.67 | 3.54 | 3.49 | 3.36 |

**DERIVED** crossings at 15 °C: **pH 4.6 at ≈4.3 d · pH 4.0 at ≈6.5 d · pH 3.5 at ≈31 d.**

## 1.4 What does NOT exist for sauerkraut (plainly stated)

- **There is no published pH-vs-time grid at 7.5 / 18 / 32 °C.** Pederson & Albury measured *titratable acidity*, not pH, and argued explicitly that pH was the inferior measure. Any source claiming a pH-4.6 time at 7.5 °C is extrapolating.
- **There is no published Q10 or Arrhenius Ea for the sauerkraut fermentation rate.** (See §5.)
- **The USDA ARS Fleming/Breidt sauerkraut programme contains no temperature-rate study.** Their work is starters, nisin, bacteriophage, microbial ecology and salt reduction. The 7.5/18/32 °C work is Pederson & Albury at Cornell, not ARS.
- **A frequently-repeated citation, "Sodium chloride, temperature, and pH effects on sauerkraut fermentation", does not appear to exist** in Crossref, Europe PMC, or the ARS publication list. Do not cite it.

---

# 2. KIMCHI (Korean literature)

## 2.1 Mheen & Kwon (1984) — the classic Korean temperature/salt study — **STRONG**

**Mheen, Tae-Ick & Kwon, Tai-Wan (1984),** "Effect of Temperature and Salt Concentration on Kimchi Fermentation", *Korean Journal of Food Science and Technology* **16**(4): 443–450. KAIST.
Record: https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=SPGHB5-1984-v16n4-443&tempLang=en · PDF: http://pdf.medrang.co.kr/Fsnb/KJournal/1984/Fsnb-016-04-13.pdf
*(image-only scan; I OCR'd it and read the tables as page images)*

**Methods (verbatim):** fermentations carried out at **30, 20, 14, and 5 °C** for 10, 20, 40, and 180 days respectively; salt adjusted to **2.25, 3.5, 5.0, 7.0%**.

**Optimum ripening defined by panel test as pH 4.2 and 0.6% acidity (as lactic acid).** Verbatim: *"we found that optimum pH, acidity and salt content of Kimchi were 4.2, 0.6–0.8% (as lactic acid) and 3.0%, and Kimchi fermented [at] low temperature (5–14 °C) is more tasty than that of fermented at higher temperature (20–30 °C)."*

**Table 1 — "Optimum ripening time and eatable period of Kimchi" (days), by salt content:**

| Temp | 2.25% salt | 3.5% salt | 5.0% salt | 7.0% salt |
|---|---|---|---|---|
| **30 °C** | 1–2* | 1–2 | 2 | 2 |
| **20 °C** | 2–3 | 2–3 | 3–5 | 10–16 |
| **14 °C** | 5–10 | 5–12 | 10–18 | 13–22 |
| **5 °C** | **35–180** | **55–180** | **90–180** | **not ripened** |

Footnote: *"* Days — Not ripened"*. I initially misread the 30 °C row as 1–2/1–2/1–2/not-ripened; on re-reading the scan at 400 dpi the row is unambiguously **1–2 / 1–2 / 2 / 2**, and only the **5 °C / 7.0% salt** cell is blank (not ripened). The values above are the corrected ones.

Supporting body text: 0.6% acidity reached within **1 day at 30 °C** (2.25–3.5% salt) and in **2–4 days at 5.0 and 7.0% salt**; at 20 °C maximum acidity 1.6% after **16 days**; at 14 °C (2.25% salt) 1.5% in **21 days**; at 5 °C *"there was no significant increase in acidity up to 16 days"*, reaching only 0.63% at 27 days and 0.67% at 37 days.

**Flag — an internal inconsistency in the published paper:** the text/methods and Table 1 and Fig. 3 all use **30 / 20 / 14 / 5 °C**, but the legend of Fig. 2 prints **30 / 20 / 15 / 10 °C**. Fig. 3's own panel labels read 30, 20, 14, 5 °C, and Table 1's rows are 30, 20, 14, 5 °C. Treat the Fig. 2 legend as a typographical error and the Table 1 values as authoritative.

**DERIVED:** optimum-ripening time at 2.25% salt, 30 : 20 : 14 : 5 °C ≈ 1.5 : 2.5 : 7.5 : 35+ days → roughly **1.7× per 10 °C** in the warm range and **≈7× from 14 → 5 °C**.

**Additional acidity-vs-time detail from the same paper** (verified at 400 dpi): at 30 °C, 0.6% acidity is reached in **under 1 day** at 2.25–3.5% salt and in 2–4 days at 5.0–7.0% salt, with 1.55% by day 5. At 20 °C maximum acidity is 1.6% at **16 days** (2.25/3.5% salt) and 1.4% / 1.0% at 20 days (5.0/7.0%). At 14 °C, 1.5% at **21 days** (2.25%) and 1.48 / 1.44 / 1.20% at 26 days (3.5 / 5.0 / 7.0%). At 5 °C, 0.63% and 0.67% at **27 and 37 days** (2.25 and 3.5% salt), holding 0.84% at 90 days, while 5.0–7.0% salt never exceeded 0.55%. *Leuconostoc mesenteroides* peaked at **1 d / 30 °C, 3 d / 20 °C, 6 d / 14 °C, 27 d / 5 °C**.

**Note:** this paper reports **no pH table** — pH appears only in figures, so per-day pH values cannot be extracted from it. Its defined optimum is a *panel* optimum (pH 4.2 + 0.6% acidity), not a measured pH-vs-time series.

**Design caveat:** the four temperatures are **30 / 20 / 14 / 5 °C** (for 10 / 20 / 40 / 180 days). One sentence on p. 445 contains the strings "15 °C" and "10 °C"; taken against the Methods, Table 1 and Fig. 3 (all of which read 30/20/14/5), that sentence is a typo in the original.

## 2.2 Modern controlled kimchi curves — the best rate ratios available

### Kim, Jeong, Lee et al. (2020), *Foods* **9**(8): 1075 — **STRONG**
https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/ · https://doi.org/10.3390/foods9081075
Kimchi stored at **0, 5, 10 and 20 °C**; initial pH **5.93**; acidity by titration as lactic acid.

| Temperature | pH trajectory (verbatim from Results) | Time to ~0.95% acidity |
|---|---|---|
| **20 °C** | pH **4.43 in just two days**, 3.83 in ten days; acidity 0.24% → **1.11% within 7 days** | **7 days** |
| **10 °C** | pH **4.14–4.24 in 10 days**, then 4.05–4.15 to end | **14 days** |
| **5 °C** | pH **4.14–4.24 in 20 days**, then 4.05–4.15 to end | **35 days** |
| **0 °C** | still 5.93–6.06 at day 14; 4.57 by day 28; 4.22–4.37 from day 28 to day 63 | no exponential phase |

**Time to pH ≈4.5: 20 °C = 2 d · 10 °C = 10 d · 5 °C = 20 d · 0 °C = 28 d.**
**DERIVED ratios:** 20 °C is **10× faster than 5 °C** and **14× faster than 0 °C**; 10 °C is 2× faster than 5 °C.
**DERIVED Arrhenius** on the pH-4.5 times: Ea ≈ 90 kJ/mol (R² = 0.97); on the acidity times: Ea ≈ 70 kJ/mol (R² = 0.94).

This paper also publishes a **usable rate equation** (Table 3, with 95% CIs):
> **μmax(T) = 0.0709 + 0.0152·T + 0.00233·T²**  (T in °C, 0–20 °C; a₀ = 7.09×10⁻² [6.00, 8.38]×10⁻², a₁ = 1.52×10⁻² [9.86, 23.4]×10⁻³, a₂ = 2.33×10⁻³ [1.90, 2.87]×10⁻³)

**DERIVED from that equation:** rate ratio **10 → 20 °C = 2.87×**; **5 → 15 °C = 4.01×**; **5 → 20 °C = 6.4×**; **0 → 20 °C = 18.4×**.

> **Correction to an earlier interim note.** A relayed version of this paper reported the acidity threshold as "0.6 N after 8, 16 and 35 days at 20, 10 and 5 °C" and times of "56/28/16/7 d at 0/5/10/20 °C". Both are wrong. The actual sentence is: *"At 10 and 5 °C, the acidity entered the exponential growth phase after a certain lag phase and increased to **0.95–0.96% after 14 and 35 days** of storage, respectively"*, and the 20 °C figure is *"increased sharply from 0.24% to 1.11% within 7 days"*. The values in the tables above are the corrected ones.

### Kim, Park, Moon & Kim (2025), *Foods* **14**(16): 2826 — the explicit "N times faster" statement — **STRONG**
https://pmc.ncbi.nlm.nih.gov/articles/PMC12385461/ · https://doi.org/10.3390/foods14162826
Napa cabbage kimchi at **4 °C and 15 °C**; initial pH **5.57**; optimal ripening defined as **pH 4.0–4.5**, over-ripe as pH < 4.0.

| | 4 °C | 15 °C |
|---|---|---|
| Optimally fermented | pH 4.32 ± 0.01 **after 47 days** | pH 4.36 ± 0.00 **after 3 days** |
| Excessively fermented | pH 3.98 ± 0.01 at **day 168** | pH 3.89 ± 0.00 at **day 14** |

The paper states outright, in its own words:
> *"These findings suggest that kimchi stored at 15 °C ferments **approximately 15 times faster** than at 4 °C in terms of reaching the optimal pH range."*

47/3 ≈ 15.7 — the arithmetic checks out. **This is a directly quotable published rate ratio.**

### Chang & Kim (2000), *Applied Biological Chemistry* (J. Korean Soc. Appl. Biol. Chem.) **43**(1): 7–11 — **STRONG**
https://koreascience.kr/article/JAKO200003043024439.pub?&lang=ko
Response-surface study, 0–15 °C × 1.5–4.0% salt:
- Optimum **pH 4.2 reached within 14–24 days at 5–15 °C**; at **0–5 °C it was not reached even after 24 days**.
- **0.75% acidity reached within 8 days at 15 °C**; at **0 °C only 0.35–0.43% after 24 days**.
- **Edible period (acidity 0.40–0.75%) at 2.75% salt: 15 °C = 4 days · 10 °C = 10 days · 5 °C = 18 days.**
- At 5 °C, raising salt from 1.50% to 4.00% lengthened the edible period from 14 to 19 days.

**DERIVED ratios:** 15 °C is **4.5× faster than 5 °C** and 2.5× faster than 10 °C; 10 °C is 1.8× faster than 5 °C. Arrhenius fit: Ea ≈ 100 kJ/mol (R² = 0.98) — high, and driven by the very steep 10→15 °C step.

### Jung, Hwang & Lee (2024), *Heliyon* **10**(5): e27174 — **MODERATE**
https://pmc.ncbi.nlm.nih.gov/articles/PMC10926072/
Kimchi (commercial, already partially fermented) at **4, 10, 15 °C**, sampled weekly for 4 weeks. Reproduced as printed:
- 4 °C: pH 5.09 (wk 1) → 4.54 (wk 2) → 4.37 (wk 4)
- 10 °C: pH 4.21 (wk 1) → 4.02 (wk 2) → 4.02 (wk 4)
- 15 °C: pH 4.07 (wk 1) → 3.81 (wk 2) → 3.63 (wk 4)
**Flag:** the paper's paired pH and titratable-acidity values are mutually inconsistent (e.g. it reports pH 4.07 with 1.83% acidity, and pH 4.21 with 1.69% — a kimchi at 1.7–1.8% lactic acid is normally near pH 3.7–3.8, and one at pH 4.07 is nearer 0.7%). The **pH** series is internally plausible; the **acidity** series appears mis-scaled. Use this source for the pH trend only. Its LC-MS lactic-acid values (3.74 g/L → 14.43 / 20.60 / 27.69 g/L at 24 / 18 / 12 days at 8 / 15 / 25 °C) are from a different experiment and are more coherent.

### Lee, Haque & Cho (2020), *J. Appl. Biol. Chem.* **63**(4): 429–437 — **STRONG**
https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002659723
Kimchi at **8, 15, 25 °C**; initial pH 6.17, acidity 0.24%. pH fell to **3.92 after 54 d at 8 °C**, **3.79 after 30 d at 15 °C**, **3.48 after 24 d at 25 °C**; acidity rose to **1.12 / 1.35 / 1.54%** respectively. Lactic acid rose from 3.74 g/L to **14.43 g/L at day 24 (8 °C)**, **20.60 g/L at day 18 (15 °C)**, **27.69 g/L at day 12 (25 °C)**. Note the *final* acidities differ substantially by temperature — warmer is not merely faster, it goes further.

## 2.3 Optimum ripening temperature, and the "temperature–time combination" practice

- **Optimum ripening is defined by pH 4.2–4.5 and 0.6–0.8% titratable acidity (as lactic).** Confirmed independently by Mheen & Kwon (1984) — panel-tested optimum at **pH 4.2, 0.6%** — and by Kim et al. (2025), who define the optimal window as **pH 4.0–4.5**.
- **Optimum ripening temperature:** Mheen & Kwon found **5–14 °C gives better-tasting kimchi than 20–30 °C**, despite being slower. The Korean literature does not converge on a single "optimum temperature" — it converges on a *temperature–time pair*.
- **The "temperature–time combination" (TTT) is a real, experimentally-studied Korean design**, not folk advice:
  - **Kang, Kang, Ahn, Yoo & Chung (2004),** "Effect of the Combination of Fermentation Temperature and Time on the Properties of Baechu Kimchi", *J. Korean Soc. Food Cult.* **19**(1): 30–42. https://koreascience.kr/article/JAKO200404637314422.page · https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001128476
    Four modes tested in a kimchi refrigerator, 16 weeks. **20 °C for 24 h then −1 °C** gave the best overall acceptability at **4 weeks**; **5 °C for 3 days** or **5 °C for 6 days** then −1 °C gave the best acceptability at **8 weeks**. Sourness peaked at 8 weeks (20 °C/24 h mode) vs 12 weeks (5 °C modes).
  - **Kang, Kang, Ahn & Chung (2003),** "Quality Properties of Chonggak Kimchi Fermented at different Combination of Temperature and Time", *J. Korean Soc. Food Cult.* **18**(6): 551–561. https://kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000886606
    Same design on ponytail radish kimchi.
  - **This is the real basis of the "warm for a short time, then cold" recommendation** — a 20 °C/24 h pre-fermentation followed by near-freezing storage, not "20 °C for 3 days".
- **On the specific claim "kimchi at 20 °C for 3 days ≈ kimchi at 5 °C for 30 days":** I could **not** trace that exact numeric pairing to any primary measurement, and a dedicated search of MFDS/식품공전, KFRI, koreascience, KCI, DBpia and koreantk failed to find it. What the measurements actually support is a **~10× ratio in time-to-pH-4.5 between 20 °C and 5 °C** (Kim et al. 2020: 2 d vs 20 d) and a **4.5× ratio between 15 °C and 5 °C** (Chang & Kim 2000: 4 d vs 18 d).
  - The **"20 °C / 3 days"** half *is* defensible: Mheen & Kwon's Table 1 puts optimum ripening at 20 °C at **2–3 days** (2.25 and 3.5% salt).
  - The **"5 °C / 30 days"** half is **not**: Mheen & Kwon give **35–180 days** at 5 °C. "30 days" is a real measured optimum, but at **10 °C**, not 5 °C: **Rhie & Chun (1982),** *J. Korean Soc. Food Sci. Nutr.* **11**(3): 63–66 — https://koreascience.kr/article/JAKO198203042254349.pdf — found the best-tasting stage at **10 °C / 30 days** and **0 °C / 60 days** (best taste at pH ≈ 4.0 at 10 °C, and pH 4.5–4.3 at 0 °C).
  - **Conclusion: "20 °C for 3 days vs 5 °C for 30 days" appears to be a conflation of Mheen & Kwon's 27-day/0.63%-acidity figure with Rhie & Chun's 10 °C/30-day figure. Do not attribute it verbatim to any paper.** If you need a citable version, say *"roughly 10× faster at 20 °C than at 5 °C"* and cite Kim et al. (2020).
- **Cheigh & Park (1994),** *Critical Reviews in Food Science and Nutrition* **34**(2): 175–203 — the standard English-language kimchi review — is **paywalled**, and its abstract contains **no** temperature, time, pH or acidity numbers. I could neither confirm nor refute that its full text contains a ripening-time table. Do not cite it for a number without reading it.

---

# 3. CUCUMBER PICKLES (brined cucumbers)

## 3.1 Pederson & Albury, Bulletin 744 (1950) — see §1.2 for the table
The single best days-vs-temperature dataset for cucumbers: **45 / 65 / 75 / 86 / 97 °F**, 2.5 / 5 / 7.5% salt. Headline: **~0.6–0.67% acid in 21 days at 45 °F vs 7 days at 75 °F (≈3× for +30 °F)**, and *"fermentations at 50 °F are retarded to such a degree that even after 5 months normal acidity is not attained."* **STRONG**

## 3.2 Etchells, Costilow, Anderson & Bell (1964) — the pure-culture temperature series — **STRONG**
*Applied Microbiology* **12**(6): 523–535. Free full text: https://europepmc.org/articles/PMC1058172?pdf=render · https://pmc.ncbi.nlm.nih.gov/articles/PMC1058172/
Conditions: cucumbers brined to equilibrate at 5.4–5.6% NaCl; pure culture of *Pediococcus cerevisiae* + *Lactobacillus plantarum* + *L. brevis*; incubation at **21, 27, 32 °C**.

Verbatim (p. 528) — *I verified this passage directly in the full text*:
> "The incubation temperature greatly affected bacterial growth and acid production in pure culture fermentations (Fig. 6). However, the greatest effect was on the time required for maximal levels of both growth and acid production to be attained, rather than on the maximal levels reached. Thus, **a temperature decrease from 32 to 27 C or from 27 to 21 C extended the time required to attain maximal cell populations by about 1 day, and had a similar delaying effect on acid production.**"

Abstract: *"The rates of growth and acid production … increased as the incubation temperature was increased from 21 to 27 to 32 C; however, the maximal populations and acidities attained were essentially the same for fermentations at each temperature."*

**Important structural point:** over 21→32 °C (11 °C) the *endpoint* was unchanged and the time saving was only ~2 days total. This is a **much weaker temperature sensitivity than a Q10≈2 rule of thumb**, and it is a different regime from sauerkraut because the cucumber brine is inoculated with a large, fast, homofermentative population.

## 3.3 Etchells, Fleming, Hontz, Bell & Monroe (1975) — 27 vs 32 °C — **STRONG**
*Journal of Food Science* **40**(3): 569–575. Paywalled at Wiley (https://doi.org/10.1111/j.1365-2621.1975.tb12530.x); full issue scan read at http://lib3.dss.go.th/fulltext/scan_ebook/j.food_sci_1975_v40_n3.pdf
55-gal drums, 25° salometer, acetic acid to pH 4.7, inoculated *L. plantarum*, controlled rooms at **27 or 32 °C**, no N₂ purge.

| Treatment | Total bloaters % | pH | Acid % (lactic) at 10 d | Max CO₂ mg/100 mL |
|---|---|---|---|---|
| Controlled **32 °C** | **48.0** | 3.34 | **1.32** | 68.5 |
| Controlled **27 °C** | **24.5** | 3.38 | **1.30** | 66.5 |

Verbatim, p. 571: *"In controlled fermentations of brined cucumbers incubated at 32 °C and 25° salometer, fermentable sugars were **rapidly and completely converted to acid, usually within 7–10 days** … After completion of fermentation, the pH was 3.3–3.4."*
Verbatim: *"bloater damage was less at 27 °C than at 32 °C"*; ANOVA temperature MS = 69.44, P < 0.01.

**Key practical point:** at 10 days the acidity was essentially identical at 27 and 32 °C (1.30 vs 1.32%), but **bloater damage roughly doubled** at the higher temperature. **Speed and quality decouple.**

## 3.4 Modern cucumber data
- **Pérez-Díaz et al. (2023),** *Front. Microbiol.* **14**: 1210190 — **STRONG**. https://pmc.ncbi.nlm.nih.gov/articles/PMC10410858/ — 48-h pH in cucumber juice medium: **4.86 ± 0.34 and 3.96 ± 0.10 at 15 °C** vs **3.77 ± 0.38 and 3.70 ± 0.25 at 30 °C**. Methods also note *Lvb. brevis* *"grows faster at ambient temperature (21 ± 1 °C) than at 37 °C"*. Caveat: the four treatments confound temperature with initial pH and NaCl.
- **Pérez-Díaz et al. (2023),** *Food Sci. Nutr.* **11**(10): 6178–6187 — **MODERATE**. https://pmc.ncbi.nlm.nih.gov/articles/PMC10563668/ — *"The fermentation … proceeds to completion in **21–30 days depending on the ambient temperature**."*
- **NCHFP / USDA (extension)** — **MODERATE**. https://nchfp.uga.edu/how/ferment/recipes/dill-pickles/ — *"Store where temperature is between **70 °F and 75 °F for about 3 to 4 weeks** … Temperatures of **55° to 65 °F** are acceptable, but the fermentation will take **5 to 6 weeks**. Avoid temperatures above **80 °F**, or pickles will become too soft."* **DERIVED:** ≈1.5–1.8× longer for ~6–8 °C cooler.

## 3.5 Cucumber gaps
- **No source gives days-to-0.4/0.6/0.8/1.0% titratable acidity at each temperature.** Those curves exist only as *figures* (Etchells et al. 1964 Figs. 1, 2, 3, 5, 6; Etchells et al. 1975 Figs. 1–2). Digitising those free PDFs is the concrete next step.
- **No primary data on low-temperature brining at ≤10 °C** was retrievable.
- The commonly-assumed "controlled ~18–21 °C vs ambient 24–27 °C" contrast is **not supported** by anything retrievable; the documented USDA contrasts are **21/27/32 °C** and **27/32 °C**.

---

# 4. PEPPER MASH / CHILLI

## 4.1 Alberto, Perera & Arena (2013) — the one solid controlled-temperature pepper study — **STRONG**
*Food and Nutrition Sciences* **4**(11A): 47–55. https://doi.org/10.4236/fns.2013.411A007 · free PDF: https://ri.conicet.gov.ar/bitstream/handle/11336/6886/CONICET_Digital_Nro.9067_A.pdf?sequence=2&isAllowed=y
*Capsicum annuum* var. *grossum*, heat-treated, **4% NaCl**, 2 or 20 g/L glucose, spontaneous vs *L. plantarum* / *Lc. mesenteroides* / *P. pentosaceus* inocula; **22 vs 30 °C**.

Verbatim:
> *"At 30 °C in media with 2 g/l glucose, after one day incubation in the inoculated samples, the pH decreased nearly 1.5 units … At 22 °C in all the cases the diminution was lower than at 30 °C, and less than a unit."*
> *"At 30 °C, after 2 days of incubation average pH was 3.5. At room temperature (22 °C), the same value was reached after 5 days. … Final pH at 22 °C was reached between 10 and 20 days."*

| Metric | 22 °C | 30 °C |
|---|---|---|
| Days to pH 3.5 | **5** | **2** |
| Lactate at 30 d (mixed culture, 2 g/L glucose) | 1.18 g/L | 2.38 g/L |

**DERIVED:** **≈2.5× faster for +8 °C**, implying a nominal Q10 ≈ 3 — *my arithmetic, not the authors'*.

**Caveat:** a 4%-salt model system, not a 10–15% salt Tabasco-style mash.

## 4.2 Pepper mash in practice
- **Watts et al. (2018),** *Int. J. Food Sci. Technol.* **53**(8): 1816–1823 — **MODERATE** (abstract). https://doi.org/10.1111/ijfs.13792 — *"Production of hot sauce may require fermentation of red hot pepper mash in barrels **from 2 weeks up to 3 years**."* Volatiles rose significantly over the **first 60 days** and declined after **300 days**.
- **Torán-Pereg et al. (2023),** *Foods* **12**(19): 3536 — **STRONG**. https://pmc.ncbi.nlm.nih.gov/articles/PMC10572888/ — green chilli mash at **21–24 °C for 15 days**: pH 5.22 → **4.83** (spontaneous) vs **3.66** (*L. plantarum*-inoculated).

## 4.3 Pepper gaps — stated plainly
- **No controlled-temperature pepper *mash* study (high salt, months) was retrievable.** The classic "≈1 month at high temperature vs ≈1 year at ambient" claim **could not be traced to any document with data.** Treat it as unverified.
- **No Q10 or Arrhenius Ea for pepper mash exists** in anything retrievable.
- Two high-value unreached leads: the LSU repository (holds the Koh 2005 Tabasco-mash thesis) and a McGill thesis on *Capsicum frutescens* fermentation whose index shows a table *"pH and titratable acidity of laboratory ferments during storage at 22 °C"*. Both were unreachable from this environment. Worth retrying from an unrestricted network.
- **"Palmgren, M.A."** as an author on pepper-mash fermentation returned **zero** results in Crossref and Europe PMC. **Do not cite it** on this evidence.

---

# 5. Q10 AND ARRHENIUS ACTIVATION ENERGIES

## 5.1 The honest headline

> **No published Q10 exists for sauerkraut or kimchi fermentation rate, and no Ea exists for sauerkraut.** For **kimchi**, however, there IS a real, primary Arrhenius literature — it is simply published in Korean journals that are not indexed in the English-language databases where this question is usually asked. It is reported in §5.2b below.

## 5.2 The Korean kimchi Arrhenius literature — the genuine answer for kimchi

This is the one place where the question "what is the activation energy of vegetable lactic fermentation?" has a real, citable answer.

| Source | System | Ea reported |
|---|---|---|
| **Ku, Kang & Kim (1988),** *Korean J. Food Sci. Technol.* **20**(4): 476–482 | Kimchi, **4–35 °C**; Ea from the intermediate stage where pH falls rapidly | **15.67 kcal/mol for pH change = 65.6 kJ/mol** · **18.99 kcal/mol for acidity change = 79.5 kJ/mol** |
| **Chung, Yeo & Kim (1996),** *J. Food Sci. Nutr.* **1**(1): 41–45 | Kimchi, **4 / 12 / 20 / 28 °C**; first-order k | one-step/mean **≈16.0–16.1 kcal/mol ≈ 67–68 kJ/mol** (acidity and pH) |
| **Kim & Chang (1999),** *J. Food Sci. Nutr.* **4**(4): 240–250 | Kimchi, **0 / 5 / 10 / 15 °C** × 1.5 / 2.75 / 4.0% salt | one-step Ea **61.1–68.8 kJ/mol** (pH) and **62.4–68.8 kJ/mol** (acidity); two-step Ea **32.7–40.3** (pH) and **39.3–45.4 kJ/mol** (acidity) |
| **Lee, Cho & Pyun (1991),** *Korean J. Food Sci. Technol.* **23**(3): 306–310 | Kimchi; models Mheen & Kwon's 5/14/20/30 °C data directly; **broken-Arrhenius** (two regimes) | **23.00 kcal/mol = 96.2 kJ/mol below 15 °C**; **30.32 kcal/mol = 126.9 kJ/mol at 15–30 °C**. Recommends the 30.32 value above 10 °C and 23.00 below 10 °C. Tolerable-acidity threshold 0.75%. |

**Consensus value: kimchi acidification Ea ≈ 60–80 kJ/mol** (Ku et al. 1988; Chung et al. 1996; Kim & Chang 1999 all agree closely — and Chung and Kim & Chang both explicitly cite Ku et al.'s figures as the literature values, so this is a consistent, cross-referenced lineage rather than three independent measurements). Note this sits **above** the general LAB *growth* band (§5.4, 45–77 kJ/mol), which is expected: acidification is a product of both growth and per-cell metabolism, and the cold end steepens the apparent Ea.

**Chung, Yeo & Kim (1996) first-order rate constants — useful directly:**

| Temperature | acidity k (day⁻¹) | pH k (day⁻¹) | Shelf life to 1.0% acidity |
|---|---|---|---|
| 4 °C | 0.0504 | 0.0099 | **33.1 days** |
| 12 °C | 0.0878 | 0.0146 | **9.4 days** |
| 20 °C | 0.3685 | 0.0723 | **4.1 days** |
| 28 °C | 0.4227 | 0.0755 | **2.8 days** |

**Kim & Chang (1999):** at 2.75% salt, first-order pH k rose from 0.008 to 0.017 day⁻¹ and acidity k from 0.028 to 0.072 day⁻¹ across **0 → 15 °C**. Raising salt from 1.5% to 4.0% at 5 °C cut pH k only from 0.013 to 0.010 and acidity k from 0.039 to 0.036 — i.e. **temperature dominates salt**, quantitatively.

**Caution on one often-quoted figure:** Lee, Cho & Pyun (1991) also tabulate time-to-pH-4.2 as **10 d at 4 °C, 2.4 d at 15 °C, 1 d at 25 °C, 19 h at 35 °C** (citing Ku et al. 1988). These are **far faster than every other dataset** — Kim et al. (2020) measure 10 days to pH 4.14–4.24 at **10 °C**, and 20 days at 5 °C. The Lee/Cho/Pyun values are a *secondary* rendering of Ku et al. whose original I could not retrieve. **Do not use them** without checking Ku et al. directly.

**Q10 for kimchi:** no paper reports one. DERIVED from Chung et al. (1996) k values: Q10(4→12 °C) = 2.00, Q10(12→20 °C) = **6.01**, Q10(20→28 °C) = 1.19, Q10(4→28 °C) = 2.43. **Non-monotonic — a single Q10 is a poor model for kimchi. Use Ea, or the two-regime broken-Arrhenius form.**

## 5.3 Published values for non-kimchi systems

| Value | System | Source | Confidence |
|---|---|---|---|
| **Lactic acid production: Ea = 71.9 ± 5.3 kJ/mol, Q10 = 2.64 [2.30; 3.04]** | water kefir (LAB + yeast), 17–29 °C | Laureys, Leroy, Vandamme & De Vuyst (2022), *Front. Microbiol.* **13**: 871550 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9120925/ | **STRONG**, but not a vegetable system |
| Acetic acid 62.2 kJ/mol, Q10 2.32 · ethanol 63.6 / 2.37 · glycerol 76.3 / 2.81 · mannitol 45.8 / 1.86 | same | same | STRONG |
| **Ea = 47.23 kJ/mol** (R² = 0.957) — total acid vs temperature, 25/35/45 °C | **Sichuan sauerkraut — but this is STORAGE of already-fermented kraut, i.e. the acidification tail, NOT the fermentation rate** | Du et al. (2022), *Foods* **11**(12): 1762 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/ | **STRONG for the number; do NOT quote it as a fermentation Ea** |

## 5.4 Q10 for the relevant organisms, from published growth rates

| Organism | Temperature interval | Q10 | Basis |
|---|---|---|---|
| *Leuconostoc mesenteroides* | 10.5 → 24.5 °C | **2.19** (aerobic) / **2.62** (anaerobic) | DERIVED from published μmax |
| *Lactobacillus plantarum* | 20 → 30 °C | **2.17** | DERIVED |
| *Lactobacillus sakei* | 20 → 30 °C | **2.29** | DERIVED |
| *Weissella viridescens* | 20 → 30 °C | **1.81** | DERIVED |

**Conclusion: the "Q10 ≈ 2–3" rule of thumb is empirically defensible for LAB in the 10–30 °C window.** *Leuconostoc mesenteroides* — the organism that actually initiates sauerkraut and kimchi — sits at the **top** of that band (2.2–2.6), which is why cold sauerkraut stalls so hard.

## 5.5 Q10 is NOT constant — and this matters for cold ferments

- **Ratkowsky et al. (1982)**, verbatim: the Arrhenius law *"does not adequately describe the effect of temperature on bacterial growth… graphs of the logarithm of the growth rate constant against reciprocal absolute temperature result in **curves rather than straight lines**."* https://pmc.ncbi.nlm.nih.gov/articles/PMC216584/
- In the square-root model, Q10 falls monotonically with temperature. For *Lc. mesenteroides* Le.m.68: **Q10 = 3.88 at 10 °C → 2.23 at 20 °C → 1.77 at 30 °C**.
- **Above the optimum, rate falls**, so Q10 < 1. DERIVED from published cardinal-temperature parameters: *L. plantarum* ITM21B at Topt→Topt+3 °C gives **Q10 = 0.52**; *L. paracasei* P40 gives **0.43**.
- **Practical consequence:** the temperature sensitivity is *steepest in the cold*. Moving a ferment from 12 °C to 18 °C buys much more than moving it from 24 °C to 30 °C. And the classic sauerkraut observation — that below ~10 °C fermentation essentially stops rather than merely slowing — is exactly what a rising Q10 predicts.

## 5.6 Cardinal / square-root parameters (so you can compute any ratio yourself)

**Ratkowsky √μ = b·(T − Tmin):**

| Organism | b | Tmin (°C) | Source |
|---|---|---|---|
| *Leuconostoc mesenteroides* 68 | 0.013 ± 0.000 | **−5.3 ± 0.1** | Stupar et al. (2023), *Heliyon* **9**: e19887 |
| *Leuconostoc mesenteroides* 299 | 0.011 ± 0.000 | **−11.5 ± 1.1** | same |
| *Lactobacillus sakei* ATCC 15521 | 0.028 | **−1.32** | da Silva et al. (2018), *Braz. Arch. Biol. Technol.* **61**: e18160159 |
| *Lactobacillus plantarum* ATCC 8014 | 0.031 | **4.10** | same |
| *Weissella viridescens* | 0.028 | −1.36 | same |

**CTMI cardinal temperatures:** *Lactobacillus plantarum* ITM21B — Tmin 2.40 / **Topt 34.35** / Tmax 39.47 °C, μopt = 0.78 h⁻¹ (Di Biase et al. 2022, *Foods* **11**(23): 3942). *Lacticaseibacillus paracasei* **in white cabbage** (4 strains) — Tmin −0.97…+1.95, Topt 32.6–35.7, Tmax 37.5–40.7 °C; measured μmax in cabbage: 0.101 (15 °C), 0.196 (20 °C), 0.242 (25 °C), 0.470 h⁻¹ (35 °C) (Di Biase et al. 2022, *Front. Microbiol.* **13**: 907393).

**DERIVED square-root rate ratios:**

| Organism | 15 → 25 °C | 10 → 20 °C |
|---|---|---|
| *L. plantarum* (Tmin 4.10) | **3.68×** | **7.26×** |
| *L. sakei* (Tmin −1.32) | 2.60× | 3.55× |
| *Lc. mesenteroides* Le.m.68 (−5.3) | 2.23× | 2.73× |
| *Lc. mesenteroides* Le.m.299 (−11.5) | 1.90× | 2.15× |
| *L. paracasei* in cabbage (CTMI) | 2.49× | 3.87× |

The *L. paracasei*-in-cabbage model prediction of 2.49× for 15→25 °C cross-checks against the **measured** cabbage data (0.242/0.101 = **2.40×**), which is a good validation of the approach.
**Warning:** do not use the square-root model within a few °C of Tmin — for *L. plantarum* (Tmin 4.10 °C) it implies an absurd Q10 of ~146 at 10 °C. That is a model pathology, not biology. This is also why cold-ferment predictions from these models should not be trusted below ~10 °C.

---

# 6. THE MASTER RATE-RATIO TABLE

All ratios are time-to-target ratios (how many times faster the warmer ferment is).

| System | Target | Cooler | Warmer | Ratio | Source | Conf. |
|---|---|---|---|---|---|---|
| Sauerkraut | 0.5% TA | 6.7 °C | 24.4 °C | **11×** | Parmele et al. 1927 | STRONG |
| Sauerkraut | 0.5% TA | 11.7 °C | 18.3 °C | 2× | Parmele et al. 1927 | STRONG |
| Sauerkraut, *Lc. mesenteroides* | % of max acidity @2 d | 10 °C | 20 °C | **3.4×** | Pederson & Albury 1969, Table 1 | STRONG |
| Sauerkraut, *Lc. mesenteroides* | % of max acidity @10 d | 10 °C | 25 °C | 1.6× | same | STRONG |
| Sauerkraut | ~1.0–1.5% acid | 7.5 °C | 23 °C | **~3–9×** (see note) | Pederson & Albury 1969 §Temp | MODERATE |
| Cucumber | max population/acid | each −5 °C step (32→21) | — | **+1 day per 5 °C** | Etchells et al. 1964 | STRONG |
| Cucumber | ~0.6% acid | 45 °F (7.2 °C) | 75 °F (23.9 °C) | **3×** | Pederson & Albury 1950, Bull. 744 | STRONG |
| Kimchi | pH 4.0–4.5 | 4 °C | 15 °C | **~15×** (authors' own statement) | Kim et al. 2025, *Foods* 14:2826 | STRONG |
| Kimchi | pH ~4.5 | 5 °C | 20 °C | **10×** | Kim et al. 2020, *Foods* 9:1075 | STRONG |
| Kimchi | pH ~4.5 | 5 °C | 10 °C | 2× | same | STRONG |
| Kimchi | 0.95% acidity | 5 °C | 20 °C | **5×** | same | STRONG |
| Kimchi | 0.95% acidity | 10 °C | 20 °C | 2× | same | STRONG |
| Kimchi | edible window | 5 °C | 15 °C | **4.5×** | Chang & Kim 2000 | STRONG |
| Kimchi | edible window | 10 °C | 15 °C | 2.5× | same | STRONG |
| Kimchi | optimum ripening | 5 °C | 30 °C | **>20×** | Mheen & Kwon 1984, Table 1 | STRONG |
| Kimchi (model) | μmax equation | 10 °C | 20 °C | 2.87× | Kim et al. 2020, Table 3 | STRONG |
| Kimchi | shelf life to 1.0% acidity | 4 °C | 20 °C | **8×** | Chung, Yeo & Kim 1996 | STRONG |
| Kimchi | shelf life to 1.0% acidity | 12 °C | 20 °C | 2.3× | same | STRONG |
| Pepper | pH 3.5 | 22 °C | 30 °C | **2.5×** | Alberto et al. 2013 | STRONG |

**Note on the sauerkraut 7.5 → 23 °C row:** Pederson & Albury give overlapping, not matched, endpoints (0.4% at 10 d and 0.8–0.9% at 1 month at 7.5 °C, vs 1.0–1.5% at 8–10 d at 23 °C). A like-for-like ratio cannot be computed from the printed text; the honest statement is that **7.5 °C is qualitatively in a different regime — the fermentation does not complete at all without warming**, which is a stronger claim than any ratio.

---

# 7. WHERE POPULAR HOME-FERMENTATION ADVICE CONFLICTS WITH THE DATA

**1. "Ferment at 65–75 °F (18–24 °C) for 3–4 weeks."**
The *timing* is roughly right for the warm end and badly wrong for the cool end; the *temperature advice* contradicts every primary source that measured quality.

- Every source that measured **quality**, not just speed, concluded **60–65 °F (15.5–18 °C) is superior**: Parmele et al. (1927) and Marten et al. (1929) *"found … 60 °F to 65 °F … to result in superior kraut"*; Vaughn suggested 55–65 °F; Durach recommended below 60 °F (all quoted in Pederson & Albury 1969).
- Pederson & Albury trace the "keep it warm" doctrine to its origin and reject it, verbatim: *"Round and LeFevre observed that kraut organisms grow best at 86 °F and advocated sufficient warming of the cabbage to attain this temperature in the vats. Bell, in Germany, said a temperature of 86 °F was best … this temperature theory, however, was predicated upon the results of bacteriological studies of only a few kraut isolates made by the U. S. Department of Agriculture scientists and **recommendations should be changed to agree with later observations**."*
- At 32 °C / 89.6 °F the same bulletin finds the product *"inferior; it may be likened to acidified cabbage"*, darkened, with poorer shelf life and lower ascorbic acid.
- **So: 70–75 °F is not "ideal". It is the top of the acceptable range, it produces a measurably worse product than 60–65 °F, and the advice descends from an explicitly retracted 86 °F recommendation.**

**2. "3–4 weeks" is temperature-blind.**
At 21 °C, 3–4 weeks is right (Pederson & Albury: *"completely fermented in approximately 1 month"* at 23 °C). At **12–15 °C it is far too short** — at 15 °C sauerkraut is only at pH 4.0 by day ~6.5 but does not reach pH 3.5 until ~day 31 (Tlais et al. 2022). Below ~10 °C it does not finish at all: *"The kraut may not be completely fermented for 6 months or more"* at 7.5 °C (Pederson & Albury 1969), and for cucumbers *"even after 5 months normal acidity is not attained"* at 50 °F (Pederson & Albury 1950). **Home advice almost never says this, and it is the single most consequential omission — a cool cellar does not mean "slower", it means "may never finish".**

**3. "Warmer = faster" hides a quality cliff.**
- In cucumbers, going from 27 °C to 32 °C changed the 10-day acidity by 0.02 percentage points (1.30 → 1.32%) but **doubled bloater damage** (24.5% → 48.0%) (Etchells et al. 1975).
- In kimchi, higher temperatures do not merely accelerate the same endpoint — they **change it**. Maximum acidity rose with storage temperature (Kim et al. 2020), and final acidity at 25 °C (1.54%) far exceeded that at 8 °C (1.12%) (Lee et al. 2020). Warm kimchi is not fast kimchi; it is different kimchi.
- Mheen & Kwon (1984), from panel testing: *"Kimchi fermented [at] low temperature (5–14 °C) is more tasty than that of fermented at higher temperature (20–30 °C)."*

**4. The pH-4.6 safety framing runs on a different clock from the classic endpoint.**
The entire classic sauerkraut literature used **titratable acidity (1.5–2.0% as lactic)** and Pederson & Albury argued pH was the inferior measure. The two clocks are not interchangeable, and pH 4.6 is reached very early — well before the fermentation is anywhere near complete. At 15 °C, sauerkraut crosses pH 4.6 at about **day 4.3** but does not cross pH 3.5 until about **day 31** (DERIVED from Tlais et al. 2022). Quoting "pH 4.6 at day 4" as though it meant "done" would be badly misleading.

**5. Kimchi: "leave it at room temperature for 2–3 days".**
The Korean experimental literature supports **20 °C for ~24 hours** as a pre-fermentation, followed by near-freezing storage — not 20 °C for 3 days (Kang et al. 2003, 2004). At 20 °C the optimum pH window is reached in **2 days** and the kimchi is over-ripe by day 10 (Kim et al. 2020). Three days at 20 °C is already past optimum.

---

# 8. NEGATIVE FINDINGS — things that do NOT exist, so you don't have to look

1. **No pH-vs-time grid at 7.5 / 18 / 32 °C for sauerkraut.** Pederson & Albury measured titratable acidity.
2. **No published Q10 for sauerkraut *or* kimchi fermentation rate, and no published Ea for sauerkraut.** Kimchi *does* have a real Ea literature — see §5.2b.
3. **The "20 °C for 3 days vs 5 °C for 30 days" kimchi pairing is not traceable to any primary measurement** — it appears to be a conflation of two different papers at two different temperatures (see §2.3).
4. **No days-to-target-titratable-acidity table at each temperature for cucumbers** — the data exist only in figures.
5. **No controlled-temperature pepper *mash* (high-salt, months-long) study was retrievable**, and the classic "1 month warm vs 1 year ambient" claim is untraceable.
6. **No primary data on cucumber brining at ≤10 °C.**
7. **The USDA ARS Fleming/Breidt programme has no sauerkraut temperature-rate study.** The 7.5/18/32 °C work is Pederson & Albury at Cornell.
8. **"Sodium chloride, temperature, and pH effects on sauerkraut fermentation"** — this frequently-repeated citation does not appear to exist.
9. **"Palmgren, M.A."** on pepper mash — no such paper found in Crossref or Europe PMC.
10. **Cheigh & Park (1994)**, the standard English kimchi review, is paywalled and its abstract has no numbers — not usable for a temperature-rate figure without full-text access.
11. **Ku, Kang & Kim (1988)** — the *original* source of the kimchi Ea values — could not be retrieved in full text. The values are quoted from its abstract and corroborated by two later papers that cite it, so they are well-attested, but I have not read the primary derivation.

**Environment limitations that shaped this:** Wiley (ift.onlinelibrary.wiley.com) returns HTTP 403; MDPI and ASM block automated fetches (their PMC mirrors were used instead); ScienceDirect returns 403 even for OA articles (the Qiao & Gänzle 2026 sauerkraut 10 vs 20 °C paper, doi:10.1016/j.ijfoodmicro.2025.111571, could not be read — **this is the single highest-value unread paper for this question**); ComBase was unreachable; LSU and McGill repositories were DNS- or rate-limit-blocked. Most classic USDA bulletins and Korean journal articles are image-only scans with no text layer.

---

# 9. SOURCE LIST

**Sauerkraut**
- Parmele, Fred, Peterson, McConkie & Vaughn (1927), *J. Agric. Res.* **35**(11): 1021–1038 — https://archive.org/details/sim_journal-of-agricultural-research_1927-12-01_35_11
- Pederson & Albury (1969), *The Sauerkraut Fermentation*, NYS Agric. Exp. Stn. Geneva, **Bulletin 824** — https://hdl.handle.net/1813/4794
- Pederson & Albury (1932), **Bulletin 614** — https://hdl.handle.net/1813/4545
- Pederson & Albury (1931), **Bulletin 595** — https://hdl.handle.net/1813/4572
- Marten, Peterson, Fred & Vaughn (1929), *J. Agric. Res.* **39**(4): 285–292 — https://archive.org/details/sim_journal-of-agricultural-research_1929-08-15_39_4
- Tlais et al. (2022), *Microbiol. Spectr.* **10**(4): e00168-22 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9430578/
- FAO, *Fermented fruits and vegetables: a global perspective*, Ch. 5 — https://www.fao.org/4/x0560e/x0560e10.htm (qualitative; optimum ~21 °C, 18–22 °C for *Lc. mesenteroides*, >22 °C favours lactobacilli)
- Penn State Extension — https://extension.psu.edu/tips-for-making-sauerkraut · Oregon State Extension — https://extension.oregonstate.edu/food/preservation/sauerkraut-problems-solutions · UW-Madison (Oconto Co.) — https://oconto.extension.wisc.edu/files/2017/04/Fermenting-Foods-at-Home-1.pdf

**Kimchi**
- Mheen & Kwon (1984), *Korean J. Food Sci. Technol.* **16**(4): 443–450 — https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=SPGHB5-1984-v16n4-443&tempLang=en · scan: http://pdf.medrang.co.kr/Fsnb/KJournal/1984/Fsnb-016-04-13.pdf
- Kim, Jeong, Lee et al. (2020), *Foods* **9**(8): 1075 — https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/
- Kim, Park, Moon & Kim (2025), *Foods* **14**(16): 2826 — https://pmc.ncbi.nlm.nih.gov/articles/PMC12385461/
- Chang & Kim (2000), *Appl. Biol. Chem.* **43**(1): 7–11 — https://koreascience.kr/article/JAKO200003043024439.pub?&lang=ko
- Lee, Haque & Cho (2020), *J. Appl. Biol. Chem.* **63**(4): 429–437 — https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002659723
- Jung, Hwang & Lee (2024), *Heliyon* **10**(5): e27174 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10926072/
- Kang, Kang, Ahn, Yoo & Chung (2004), *J. Korean Soc. Food Cult.* **19**(1): 30–42 — https://koreascience.kr/article/JAKO200404637314422.page
- Kang, Kang, Ahn & Chung (2003), *J. Korean Soc. Food Cult.* **18**(6): 551–561 — https://kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000886606
- **Ku, Kang & Kim (1988),** *Korean J. Food Sci. Technol.* **20**(4): 476–482 — https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=SPGHB5-1988-v20n4-476&tempLang=en *(original source of the kimchi Ea values; abstract only)*
- **Chung, Yeo & Kim (1996),** *J. Food Sci. Nutr.* **1**(1): 41–45 — http://www.koreascience.kr/article/JAKO199611920124199.pdf
- **Kim & Chang (1999),** *J. Food Sci. Nutr.* **4**(4): 240–250 — http://www.koreascience.kr/article/JAKO199911920126261.pdf
- **Lee, Cho & Pyun (1991),** *Korean J. Food Sci. Technol.* **23**(3): 306–310 — http://koreascience.or.kr/article/JAKO199103041971435.pdf *(broken-Arrhenius shelf-life model; models Mheen & Kwon's data)*
- **Rhie & Chun (1982),** *J. Korean Soc. Food Sci. Nutr.* **11**(3): 63–66 — https://koreascience.kr/article/JAKO198203042254349.pdf *(10 °C / 30 d and 0 °C / 60 d sensory optima)*
- Cheigh & Park (1994), *Crit. Rev. Food Sci. Nutr.* **34**(2): 175–203 — https://doi.org/10.1080/10408399409527656 *(paywalled; abstract contains no numbers)*

**Cucumber**
- Etchells, Costilow, Anderson & Bell (1964), *Appl. Microbiol.* **12**(6): 523–535 — https://europepmc.org/articles/PMC1058172?pdf=render
- Etchells, Fleming, Hontz, Bell & Monroe (1975), *J. Food Sci.* **40**(3): 569–575 — scan: http://lib3.dss.go.th/fulltext/scan_ebook/j.food_sci_1975_v40_n3.pdf · doi:10.1111/j.1365-2621.1975.tb12530.x
- Pederson & Albury (1950), **Bulletin 744** — https://hdl.handle.net/1813/4307
- Pérez-Díaz et al. (2023), *Front. Microbiol.* **14**: 1210190 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10410858/
- Pérez-Díaz et al. (2023), *Food Sci. Nutr.* **11**(10): 6178–6187 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10563668/
- NCHFP/USDA, *Dill Pickles* — https://nchfp.uga.edu/how/ferment/recipes/dill-pickles/

**Pepper**
- Alberto, Perera & Arena (2013), *Food Nutr. Sci.* **4**(11A): 47–55 — https://ri.conicet.gov.ar/bitstream/handle/11336/6886/CONICET_Digital_Nro.9067_A.pdf?sequence=2&isAllowed=y
- Watts et al. (2018), *Int. J. Food Sci. Technol.* **53**(8): 1816–1823 — https://doi.org/10.1111/ijfs.13792
- Torán-Pereg et al. (2023), *Foods* **12**(19): 3536 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10572888/

**Temperature dependence / kinetics**
- Laureys et al. (2022), *Front. Microbiol.* **13**: 871550 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9120925/
- Du et al. (2022), *Foods* **11**(12): 1762 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9222660/
- Ratkowsky et al. (1982) — https://pmc.ncbi.nlm.nih.gov/articles/PMC216584/
- Stupar et al. (2023), *Heliyon* **9**: e19887 · da Silva et al. (2018), *Braz. Arch. Biol. Technol.* **61**: e18160159 · Di Biase et al. (2022), *Foods* **11**(23): 3942 · Di Biase et al. (2022), *Front. Microbiol.* **13**: 907393
- De Silvestri et al. (2018), *Front. Microbiol.* **9**: 3023 — https://pmc.ncbi.nlm.nih.gov/articles/PMC6290036/

**Working files from this investigation**
- `research_temperature_vs_fermentation_speed.md` — **this file**, the consolidated report
- `research_sauerkraut_temp.md` — full sauerkraut sub-review
- `research_kimchi_temp.md` — kimchi sub-review (includes the Korean Ea lineage and the negative trace on the "3 d vs 30 d" claim); source PDFs in `kimchi_refs/`
- `research_pickles_pepper_temp.md` — cucumber + pepper sub-review
- `research_Q10_arrhenius.md` — kinetics sub-review, with all arithmetic and a 20-entry citation list
- `sk_sources/` — retrieved source texts, including `b824_clean.txt` (Pederson & Albury 1969) and `bulletin744_cucumbers_c.txt` (Pederson & Albury 1950)

## Verification note

Every headline number in this report was checked against the primary text, and in several cases against a **second, independent rendering** (OCR text plus direct reading of the scanned page image at 400 dpi). Three numbers that were relayed to me from sub-searches were found to be **wrong** on verification and have been corrected here rather than propagated:

1. Kim et al. (2020) kimchi acidity thresholds were relayed as "0.6 N at 8/16/35 days" and "56/28/16/7 d at 0/5/10/20 °C"; the actual values are 0.95–0.96% at **14 and 35 days** (10 and 5 °C) and 1.11% at **7 days** (20 °C). Corrected in §2.2.
2. My own first reading of Mheen & Kwon's Table 1 gave the 30 °C row as 1–2/1–2/1–2/not-ripened; re-reading at 400 dpi shows **1–2 / 1–2 / 2 / 2**. Corrected in §2.1.
3. A claim that Bulletin 595 states fermentations at 30–60 °F stall near 1% acid for 4–5 months could not be re-located in the source and is therefore **not reported as verified** in §1.2; the equivalent, verified statement is the 50 °F cucumber finding in Bulletin 744.
