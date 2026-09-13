# Temperature Dependence of Kimchi Lactic Acid Fermentation — Quantitative, Cited Data

**Compiled:** literature retrieval pass, all sources below were actually fetched and read.
**Rule applied:** every number is quoted from a document I retrieved. Nothing is inferred, extrapolated, or recalled from memory. Where a number is behind a paywall or only seen in an abstract, that is stated. Where I could not find a number, I say so.

---

## 0. Method note (why you can trust the numbers below)

Most of these are old Korean journal papers whose PDFs are **scanned images with no text layer** (`pdftotext` returns empty). I downloaded the PDFs, rendered the pages to PNG at 200–500 dpi, and read them visually, then re-cropped critical numbers at 400–500 dpi to confirm individual digits.

This mattered: my first low-resolution pass misread **two** numbers that later crops corrected:

| Number | First (200 dpi) misread | Corrected (400 dpi) |
|---|---|---|
| Mheen & Kwon p.447, Song et al. optimum-ripening pH | "5.4-5.2" | **"4.5-4.2"** |
| Chung et al. 1996 Table 2, acidity k at 20 °C | "0.3856" | **"0.3685"** |

Everything reported as **strong** below was confirmed at ≥400 dpi or came from a native digital text layer.

Local copies of every PDF I used are in `kimchi_refs/` alongside this file.

---

## 1. THE KEY PAPER — Mheen & Kwon (1984), full text obtained

**Mheen, Tae-Ick & Kwon, Tai-Wan (1984).** "Effect of Temperature and Salt Concentration on Kimchi Fermentation." *Korean Journal of Food Science and Technology* **16(4): 443–450.** Korean title: 「김치발효에 미치는 온도 및 식염농도의 영향」. pISSN 0367-6293. Published 1984-12-30. Authors' affiliation: Dept. of Biological Science and Engineering, KAIST, Seoul.

**Working URLs (all verified):**
- Article page (English + Korean abstracts, metadata): <https://koreascience.kr/article/JAKO198403041899994.pub?&lang=en>
- **Full-text PDF (8 pp, scanned):** <https://koreascience.kr/article/JAKO198403041899994.pdf>
- Byte-identical mirror: <http://pdf.medrang.co.kr/Fsnb/KJournal/1984/Fsnb-016-04-13.pdf>
- Korean Traditional Knowledge Portal record: <https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=SPGHB5-1984-v16n4-443&tempLang=en>
  (⚠️ the koreantk *PDF* link `.../thesis/pdf/original/SPGHB5-1984-v16n4-443.view` returns a **login page**, not the paper — use the koreascience PDF instead.)

**Confidence: STRONG** (primary full text, read page by page; key digits re-verified at 400 dpi).

### 1.1 Experimental conditions (p.444 — this is where several common misquotes originate)

- Chinese cabbage cut into 4–5 cm pieces, salted in **15% brine for 3 h**, washed twice with 2.0% brine.
- Final salt concentrations adjusted to **2.25, 3.5, 5.0 and 7.0%**.
- 200 g samples in nylon film bags (12 × 20 cm), sealed.
- **"Fermentation of *Kimchi* was carried out at 30, 20, 14, and 5 °C for a period of 10, 20, 40, and 180 days respectively."**

> ⚠️ **The low temperature is 14 °C, not 15 °C.** Many later papers and reviews render this set as "5, 10, 15, 20, 25, 30 °C" — that is wrong for this study. There were **four** temperatures: 30, 20, 14, 5 °C.
>
> ⚠️ **Internal inconsistency in the original:** one sentence on p.445 says *"pH and acidity at 10 °C changed more slowly compare to high temperature tested. Maximum total acid produced in *Kimchi* at 20 °C and 15 °C is 1.6% but it never exceeds total acidity of 1.2% at 10 °C."* The figures and Table 1 use 30/20/14/5 °C. The "15 °C"/"10 °C" in that single sentence do not match the paper's own experimental design (verified verbatim at 400 dpi). Treat that sentence as a typo in the original.

- pH: Heath pH meter. Acidity: titration with 0.1 N NaOH to phenolphthalein, **calculated as lactic acid**.

### 1.2 ★ Table 1 — "Optimum ripening time and eatable period of Kimchi" (p.447)

Values are **days** (footnote: `* Days`, `- Not ripened`). Verified at 400 dpi.

| Fermentation temp. (°C) | 2.25% salt | 3.5% salt | 5.0% salt | 7.0% salt |
|---|---|---|---|---|
| **30** | 1–2 | 1–2 | 2 | 2 |
| **20** | **2–3** | **2–3** | 3–5 | 10–16 |
| **14** | 5–10 | 5–12 | 10–18 | 13–22 |
| **5** | **35–180** | 55–180 | 90–180 | — (not ripened) |

The columns are ranges spanning "optimum ripening time" to "eatable period" — i.e. the first number is when it ripens, the second is the end of the eatable window.

### 1.3 ★ Definition of "optimum ripening" (two independent statements, both 400-dpi verified)

- **p.445:** *"As a result of panel test, it was evaluated that the pH and acidity of optimum ripening period of *Kimchi* were **4.2 and 0.6% (as lactic acid)** respectively."*
- **p.447:** *"In this study, we found that optimum pH, acidity and salt content of *Kimchi* were **4.2, 0.6-0.8% (as lactic acid) and 3.0%**, and *Kimchi* fermented low temperature (**5-14 °C**) is more tasty than that of fermented at higher temperature (**20-30 °C**)."*
- *(moderate confidence, read at 200 dpi only)* **p.448–449:** *"Kimchi is less acidic product than sauerkraut and the optimum acidity and pH of *Kimchi* is **0.6-0.8% and 4.2** respectively while that of sauerkraut is 1.6% and 3.5 respectively."*

### 1.4 Acidity vs time, by temperature (pp.445–446, 400-dpi verified)

**30 °C** (p.445):
> *"At 30 °C and 2.25-3.5% salt content, acidity of *Kimchi* was maintained in the same pattern throughout. The acidity of 1.55% is reached in 5 days and is maintained at 1.6% thereafter, but at 5.0 and 7.0% salt content acidity reached 1.4 and 1.05% after 5 and 6 days, respectively."*
> *"**Optimum acidity (0.6%) of *Kimchi* was reached within 1 day at 30 °C** and at 2.25-3.5% salt content, and the same level of acidity was reached in **2-4 days at 5.0 and 7.0% salt content**."*

**20 °C** (p.445):
> *"At 20 °C, **maximum acidity (1.6%) was reached after 16 days** at 2.25 and 3.5% salt content, and the maximum of **1.4 and 1.0% acidity was reached after 20 days** at 5.0 and 7.0% salt content, respectively."*

**14 °C** (pp.445–446):
> *"At 14 °C and 2.25% salt content, total acid increased more slowly than at higher temperature (30-20 °C) and reached up to **1.5% in 21 days** and the same level of acidity was maintained thereafter (40 days). But at 3.5 and 5.0 and 7.0% salt content, total acid increased much more slowly than at 2.25% salt content and reached **1.48 and 1.44 and 1.20% acids respectively in 26 days**. After 40 days, the level of acidity was maintained 1.5% at 3.5 and 5.0% salt content."*

**5 °C** (p.446) — **this is the key low-temperature measurement**:
> *"However, there was no significant increase in acidity up to 16 days at 5 °C and then increase slowly depending on the salt content. **At 2.25 and 3.5% salt content total acidity reached 0.63 and 0.67% in 27 and 37 days, respectively**, and 0.84% of acidity was maintained after 90 days. At 5.0 and 7.0% salt content, maximum acidity was not more than 0.55-0.3% during the completed period of fermentation. These acidities refer no optimum ripening of *Kimchi* by panel test."*

**Read together with §1.3 (optimum = 0.6% acidity):** at 5 °C, 2.25% salt, the panel-defined optimum acidity is crossed at **~27 days**; by the paper's own Table 1 the *optimum ripening window* at 5 °C/2.25% is **35–180 days**. Those two figures are in mild tension inside the same paper — worth knowing if you cite either.

### 1.5 Microbial corroboration of the time scale (p.447, read at 400 dpi)

> *"At 30 °C and 2.25% salt content, total viable count reached maximum number (1.0×10⁹ cells/ml) in 1 day… At 20 °C, maximum number reached after 3 days at 2.25, 3.5, and 5.0% salt content… At 14 °C, the maximum number (7.0-8.0×10⁸ cells/ml) reached after 6 days at 2.25% salt content… When *Kimchi* was fermented at 5 °C, the maximum number reached after 27 days at 2.25 and 3.5% salt content, but at 5.0% salt content maximum number reached only after 37 days."* (p.447)

> *"…the total number of *Leu. mesenteroides* were more at lower salt content than at higher salt content. The maximum number reached after **1 day at 30 °C, 3 days at 20 °C, 6 days at 14 °C, and 27 days at 5 °C**."* (p.449, read at 200 dpi)

### 1.6 The two older sensory criteria Mheen & Kwon themselves cite

These are the *original* sources for two competing definitions of "optimum ripening", and Mheen & Kwon's own panel disagreed with both:

- **Song, S.H., Cho, J.S. & Kim, K. (1966), *Report Army Res Test Lab. (Korea)* 5** — cited as ref. 12 (p.447, 400-dpi verified):
  > *"Song et al.(12) found that initial pH of *Kimchi* starts from 5.5-5.8, reducing to **4.5-4.2 at optimum ripening period** and dropped to 4.0 upon over-ripening. They also reported that salt concentration is not changed during *Kimchi* fermentation."*
- **Lee, Y.H. & Yang, L.W. (1970), *J. Korea Agr. Chem. Soc.* 13, 107** — cited as ref. 13 (p.447, 400-dpi verified):
  > *"Lee and Yang(13) have reported that **acidity at the optimum ripening period of *Kimchi* is 0.4-0.75 percent (as lactic acid)**, reaching 1.0 percent upon over-ripening and reaches 1.5-2.0 percent at the stage of spoilage."*

I did **not** retrieve Song et al. 1966 or Lee & Yang 1970 directly — they are known to me only through Mheen & Kwon's citation. **Confidence: moderate (secondary citation).**

---

## 2. ★ THE "20 °C for 3 days vs 5 °C for 30 days" CLAIM — provenance verdict

**Verdict: partially traceable, but the exact phrasing is not verbatim in any source I could retrieve, and the "5 °C / 30 days" half does not match its best candidate source cleanly.**

What I actually found:

| Candidate | What it actually says | Fit to the quote |
|---|---|---|
| **Mheen & Kwon 1984, Table 1** <https://koreascience.kr/article/JAKO198403041899994.pdf> | 20 °C optimum ripening = **2–3 days** (2.25% and 3.5% salt). 5 °C optimum ripening = **35–180 days** (2.25% salt); 55–180 (3.5%); 90–180 (5.0%) | **"20 °C → 3 days" fits well** (upper end of 2–3 d). **"5 °C → 30 days" does NOT fit** — the table says 35–180 d. The nearest measurement is 0.63% acidity (the panel optimum) at **27 days**, §1.4 |
| **Rhie & Chun 1982** <https://koreascience.kr/article/JAKO198203042254349.pdf> | Optimum-ripening (성숙적기) by sensory panel: **10 °C → 30 days**, **0 °C → 60 days** | **"30 days" fits, but at 10 °C, not 5 °C.** This is a strong candidate for the origin of the "30 days" number |
| **Korean Food Code (식품공전) / MFDS** | **Not found.** I searched and could not retrieve any MFDS/식품공전 text containing a temperature-vs-ripening-time statement | — |
| **KFRI (Korea Food Research Institute)** | I retrieved a KFRI-authored paper (Foods 2020, §5.4) but it contains no "20 °C/3 days vs 5 °C/30 days" statement | — |
| **Cheigh & Park 1994 review** | Paywalled; abstract retrieved contains no numbers (§6) | Cannot confirm or deny |

**Bottom line for the parent agent:** if you need a citable primary source for "20 °C ≈ 3 days to optimum", **Mheen & Kwon 1984 Table 1 is defensible** (2–3 days at 2.25–3.5% salt). For "5 °C ≈ 30 days to optimum", **no source I retrieved says that**; the defensible statements are (a) Mheen & Kwon: 0.63% acidity (panel optimum) in **27 days** at 5 °C/2.25% salt, with the optimum *window* starting at 35 days; and (b) Rhie & Chun: **10 °C → 30 days**. "5 °C / 30 days" looks like a conflation of those two. **Do not attribute it verbatim to any of these papers.**

---

## 3. What defines "optimum ripening"? — every measured criterion I retrieved

| Source (year) | Criterion for optimum ripeness | Basis | Confidence |
|---|---|---|---|
| Song, Cho & Kim (1966) *via* Mheen & Kwon | **pH 4.5–4.2** | cited in Mheen & Kwon p.447 | moderate (secondary) |
| Lee & Yang (1970) *via* Mheen & Kwon | **acidity 0.4–0.75%** (as lactic acid) | cited in Mheen & Kwon p.447 | moderate (secondary) |
| **Mheen & Kwon (1984)** | **pH 4.2 AND acidity 0.6%** (p.445); **pH 4.2, acidity 0.6–0.8%, salt 3.0%** (p.447) | trained panel | **strong** |
| **Rhie & Chun (1982)** | **10 °C → best taste at pH ≈ 4.0**; **0 °C → best taste at pH 4.5–4.3** | 10 trained panelists + pH | **strong** |
| **Ku, Kang & Kim (1988)** | sensory fresh-sourness/odor/fracturability **increased until pH ≈ 4.0**, then decreased; moldy taste/odor rose rapidly thereafter | sensory | **strong** (abstract) |
| **Lee, Cho & Pyun (1991)** | *"the pH range at which kimchi taste is most appropriate is about **pH 4.2**"*; model assumes **tolerable acceptability at 0.75% total acidity** | derived from Ku et al. + own organoleptic tests | **strong** |
| **Lee, Haque & Cho (2020)** | *"the best quality of kimchi can be obtained at **pH 4.2 to 4.5 and acidity of 1.5 to 2.0%**"* | cites refs [1,5] | **strong** (full text, open access) |
| **Kim et al. (2020), Foods** | *"the acidity of Kimchi increases to **0.2–0.4%** in the early phase of fermentation, **0.5–0.8%** in the moderately or optimally fermented stage, and **over 1.0%** when over-fermented"* (citing Jung 2004; Nam 2017; Chang 2000) | review of prior work | **strong** |
| **Heliyon (2022)** | *"In a study by **Ku et al. (1988)**, the optimal flavor of kimchi was reached at a **pH of 4.2–4.4**"* | secondary citation of Ku 1988 | **strong** (full text) but it is a *secondary* attribution of Ku 1988 |

**Reconciling the pH values:** there is no single consensus number. The reported optimum pH values cluster as **4.0 (Ku 1988; Rhie & Chun at 10 °C) → 4.2 (Mheen & Kwon; Lee/Cho/Pyun) → 4.2–4.4 (Ku 1988 as cited by Heliyon 2022) → 4.2–4.5 (Lee 2020)**, with **0 °C being the outlier at pH 4.5–4.3**. The **0.6–0.8% acidity** convention traces to **Mheen & Kwon 1984** and is repeated by Lee, Cho & Pyun (1991).

**On "optimum ripening temperature is 10 °C or 20 °C":**
- **10 °C** is supported as a *sensory optimum* by **Rhie & Chun (1982)** — panel scores at 10 °C and 0 °C, and the finding that the best-tasting stage came at 30 days/10 °C vs 60 days/0 °C. (Note: their Table 2 panel scores actually *decline* monotonically; the "optimum" is defined in the text by the pH at which taste was best, not by a peak in Table 2. Read the paper directly before citing a "peak".)
- **20 °C** finds no support as an *optimum* temperature in anything I retrieved. Mheen & Kwon explicitly state the opposite: kimchi fermented at **5–14 °C is more tasty** than at 20–30 °C (p.447). 20 °C appears in the literature as a *convenient accelerated-ripening / shelf-life-test* temperature, not as a sensory optimum.

---

## 4. ★ Time to reach optimum ripeness (pH 4.2–4.5) at each temperature — all retrieved datasets

### 4.1 Mheen & Kwon (1984), 0.6% acidity threshold — strong
| Temp | Time to 0.6% acidity (the panel optimum) | Salt |
|---|---|---|
| 30 °C | **< 1 day** | 2.25–3.5% |
| 30 °C | 2–4 days | 5.0–7.0% |
| 5 °C | **27 days** (to 0.63%) | 2.25% |
| 5 °C | 37 days (to 0.67%) | 3.5% |

### 4.2 ★ Lee, Cho & Pyun (1991) — time to reach pH 4.2, attributed to Ku et al. (1988) — strong (verbatim, 400-dpi verified)
> *"Looking at the time to reach pH 4.2, the most suitable range for kimchi taste, at each fermentation temperature: about **10 days at 4 °C, 2.4 days at 15 °C, 1 day at 25 °C, and 19 hours at 35 °C**."*
(Original Korean: 「김치의 맛이 가장 적합한 범위인 pH 4.2 정도에 이르는 시간을 각 발효 온도별로 보면 4℃일 때 10일, 15℃에서 2.4일, 25℃에서 1일, 그리고 35℃에서 19시간 정도이며」)

> ⚠️ **Use with caution.** These times are far faster than every other dataset here (e.g. 15 °C → 2.4 days vs. 24 days in Lee et al. 2020; 25 °C → 1 day vs. 15 days). They describe **Ku et al. (1988)'s** fermentation conditions (15% NaCl brine 2 h), and this is a *secondary* rendering of Ku's data. I could not retrieve Ku et al. 1988's full text to verify. Flag it as "reported by Lee, Cho & Pyun 1991, citing Ku et al. 1988" — never as a standalone measurement.

### 4.3 Chung, Yeo & Kim (1996) Table 4 — shelf-life to 1.0% acidity — strong
| Fermentation temp. (°C) | Shelf-life (days) |
|---|---|
| 4 | **33.1** |
| 12 | **9.4** |
| 20 | **4.1** |
| 28 | **2.8** |

(Their own abstract states: *"The shelf-lives based on the time to reach the 1.0% of acidity were 33.1 day at 4 °C and 2.8 day 28 °C."*)

### 4.4 Lee, Haque & Cho (2020), 8/15/25 °C — strong, open access
- pH fell from **6.17** initially to **3.92, 3.79, 3.48** after **54, 30 and 24 days** at 8, 15 and 25 °C respectively; acidity rose from **0.24%** to **1.12, 1.35, 1.54%**.
- Optimal stage: **8 °C → pH 4.16, acidity 1.14% at 54 days** (the "optimum ripening stage that occurred after 54 days"); **15 °C → optimum pH and acidity after 24 days**; **25 °C → optimum pH and acidity after 15 days**.
- Lactic acid: 3.74 g/L initially → **14.43, 20.60, 27.69 g/L after 24, 18 and 12 days** at 8, 15 and 25 °C.

### 4.5 Kim et al. (2020), Foods — 0/5/10/20 °C — strong, open access
- Initial pH **5.93**, initial acidity **0.24%**.
- **20 °C:** pH fell to **4.43 in just 2 days** and to **3.83 in 10 days**; acidity entered exponential phase with no lag, rising **0.24% → 1.11% within 7 days**, then held at 1.2–1.3% to day 10.
- **10 °C and 5 °C:** pH fell to **4.14–4.24 in 10 and 20 days** respectively; acidity reached **0.95–0.96% after 14 and 35 days** respectively.
- **0 °C:** pH stayed at **5.93–6.06 until day 14**, then fell to **4.57 by day 28**, then held **4.22–4.37 to day 63**.
- Cites Codex Alimentarius: *"the composition of acidity for fermented kimchi should not be more than 1%."*

### 4.6 Lee, Cho & Pyun (1991) Table 2 — organoleptic shelf-life (time to unacceptable), compiled from prior workers — strong
| Temp (°C) | Organoleptic shelf-life (day) | Predicted from shelf-life plot (day) | Predicted by model at 3% NaCl (day) |
|---|---|---|---|
| 0 | 80, 88.5, 90, 100 | 159.1 | — |
| 4 | 10, 20, 22, 30, 36.2 | 55.0 | — |
| 5 | 20, 29.0, 54 | 45.8 | — |
| 6 | 45 | 23.4 | 36.2 |
| 7 | 18 | 28.8 | 29.0 |
| 14 | 8 | 7.1 | 8.1 |
| 15 | 2.4 | 6.3 | 7.1 |
| 18 | 5.5, 6, 20 | 5.5 | 5.0 |
| 22 | 1.9 | 2.5 | 3.2 |
| 25 | 1.5, 1.6, 1.8 | 1.5 | 1.8 |
| 30 | 0.8 | 1.0 | 1.6 |
| 35 | 0.8 | 0.6 | 0.6 |

(multiple values in a cell = independent literature values; superscript reference numbers omitted here — see the PDF.)

---

## 5. ★ KINETICS: activation energies, rate constants, Q10

### 5.1 Activation energy (Ea) — reported values

| Source | Method | Ea for **acidity** | Ea for **pH** | Confidence |
|---|---|---|---|---|
| **Ku, Kang & Kim (1988)**, *Korean J. Food Sci. Technol.* **20(4): 476–482** | Arrhenius on the intermediate (rapid pH-drop) stage, 4–35 °C | **18.99 kcal/mol = 79.45 kJ/mol** | **15.67 kcal/mol = 65.56 kJ/mol** | **strong** (from the paper's own English abstract) |
| **Chung, Yeo & Kim (1996)** | traditional two-step Arrhenius | **16.125 kcal/mol = 67.47 kJ/mol** | **16.003 kcal/mol = 66.96 kJ/mol** | **strong** (full text) |
| **Chung, Yeo & Kim (1996)** | non-linear regression, **zero order** | **16.070 kcal/mol** (avg; per-temp 15.900–16.166) | **15.522 kcal/mol** (avg; per-temp 14.867–15.797) | **strong** |
| **Chung, Yeo & Kim (1996)** | non-linear regression, **first order** | **16.006 kcal/mol** (avg; per-temp 15.756–16.153) | **15.813 kcal/mol** (avg; per-temp 15.303–16.455) | **strong** |
| **Kim & Chang (1999)** | **one-step** method | **62.417 – 68.772 kJ/mol** | **61.057 – 66.886 kJ/mol** | **strong** (abstract + full text) |
| **Kim & Chang (1999)** | **two-step** method | **39.275 – 45.442 kJ/mol** | **32.727 – 40.275 kJ/mol** | **strong** |
| **Lee, Cho & Pyun (1991)** | shelf-life plot, ln θ vs 1/T | **23.00 kcal/mol = 96.23 kJ/mol below 15 °C; 30.32 kcal/mol = 126.86 kJ/mol at 15–30 °C** | same (shelf-life, not pH) | **strong** (400-dpi verified) |

**Cross-validation that confirms the Ku et al. (1988) lineage:** 15.67 kcal/mol × 4.184 = **65.56 kJ/mol** and 18.99 × 4.184 = **79.45 kJ/mol** — exactly the "other literature results, 65.56 kJ/mole and 79.45 kJ/mole" cited by Kim & Chang (1999) as ref. 18 (= Ku et al. 1988), and the "18.99 kcal/mole and 15.67 kcal/mole" cited by Chung et al. (1996) as ref. 16 (= the same paper). Both 1996 and 1999 independently point back to Ku, Kang & Kim (1988).

**Practical recommendation stated in Lee, Cho & Pyun (1991):** *"for predicting the shelf-life of kimchi, it is reasonable to use an activation energy of **30.32 kcal/mole for temperatures above 10 °C** and **23.00 kcal/mole below 10 °C**."* (broken Arrhenius / two Ea regimes.)

### 5.2 Rate constants — Chung, Yeo & Kim (1996) Table 2, first order — strong (400-dpi verified)

Food: Chinese cabbage, 28.12 cm, 11.50 cm, 2.43 kg, moisture 93.76%.

| Fermentation temp. (°C) | Acidity k (day⁻¹) | r² | pH k (day⁻¹) | r² |
|---|---|---|---|---|
| 4 | 0.0504 | 0.9616*** | 0.0099 | −0.9017** |
| 12 | 0.0878 | 0.7632* | 0.0146 | −0.6821* |
| 20 | **0.3685** | 0.8671** | 0.0723 | −0.9376*** |
| 28 | **0.4227** | 0.8892** | 0.0755 | −0.8763** |

> ⚠️ The **running text of the same paper gives the 28 °C pH rate as 0.0759 day⁻¹** while its own Table 2 prints **0.0755**. Minor internal inconsistency in the original.
>
> Text also states: *"the reaction rates of acidity were increased from 0.0504 day⁻¹ to 0.4227 day⁻¹, and those of pH were also increased from 0.0099 day⁻¹ to 0.0759 day⁻¹"* — consistent with the table for acidity, off by 0.0004 for pH.
>
> Note the non-monotonic jump: k(acidity) rises ~4.2× from 12→20 °C but only ~1.15× from 20→28 °C. The authors comment: *"The rate constants for acidity and pH in Kimchi were increased rapidly with the fermentation temperature increased from 12 °C to 20 °C. While, the rate constants for pH were increased slowly with the fermentation temperature increased from 20 °C to 28 °C."*

### 5.3 Rate constants — Kim & Chang (1999) Table 2, two-step method — strong (400-dpi verified)

k in day⁻¹; r = correlation coefficient. Salt concentrations 1.50 / 2.75 / 4.00%.

**Zero order:**

| Temp (°C) | pH k @1.50% | Acidity k @1.50% | pH k @2.75% | Acidity k @2.75% | pH k @4.00% | Acidity k @4.00% |
|---|---|---|---|---|---|---|
| 0 | 0.044 | 0.013 | 0.041 | 0.010 | 0.032 | 0.010 |
| 5 | 0.054 | 0.020 | 0.051 | 0.018 | 0.050 | 0.017 |
| 10 | 0.080 | 0.036 | 0.078 | 0.032 | 0.061 | 0.027 |
| 15 | 0.087 | 0.054 | 0.080 | 0.053 | 0.069 | 0.051 |

**First order:**

| Temp (°C) | pH k @1.50% | Acidity k @1.50% | pH k @2.75% | Acidity k @2.75% | pH k @4.00% | Acidity k @4.00% |
|---|---|---|---|---|---|---|
| 0 | 0.009 | 0.034 | **0.008** | **0.028** | 0.006 | 0.027 |
| 5 | **0.013** | **0.039** | 0.010 | 0.038 | **0.010** | **0.036** |
| 10 | 0.017 | 0.071 | 0.014 | 0.064 | 0.013 | 0.057 |
| 15 | 0.019 | 0.074 | **0.017** | **0.072** | 0.015 | 0.070 |

Text (verified against the table): *"As the fermentation temperature increased from 0 °C to 15 °C at 2.75% of salt concentration, the reaction rate constants … increased from 0.008 day⁻¹ to 0.017 day⁻¹ [pH], and those of acidity were also increased from 0.028 day⁻¹ to 0.072 day⁻¹. As the salt concentration increased from 1.5% to 4.0% at 5 °C …, the reaction rate of pH by first order reaction decreased from 0.013 day⁻¹ to 0.010 day⁻¹, and those of acidity were also decreased from 0.039 day⁻¹ to 0.036 day⁻¹."*

**Salt effect size:** going 1.5% → 4.0% salt reduces k only modestly (e.g. acidity k at 5 °C: 0.039 → 0.036; at 10 °C: 0.071 → 0.057). **Temperature dominates salt** in this dataset.

### 5.4 Q10 values

**I found NO paper that reports a Q10 for kimchi fermentation.** Every source reports Arrhenius Ea instead. Stating this plainly rather than guessing.

For convenience I computed Q10 myself from the retrieved rate constants — **these are my own derivations, not published values; label them as such if reused**:

| Dataset | Q10 (4→12 °C) | Q10 (12→20 °C) | Q10 (20→28 °C) | Q10 (4→28 °C) |
|---|---|---|---|---|
| Chung 1996, acidity k | 2.00 | **6.01** | 1.19 | 2.43 |
| Chung 1996, shelf-life to 1.0% acidity | **4.82** | 2.82 | 1.61 | 2.80 |

The very high Q10 over 12–20 °C (from k) vs. the smoother shelf-life-derived values reflects the non-monotonic k series noted in §5.2. **Q10 for kimchi is not constant with temperature — a single Q10 is not a good model here.** Use the Ea values in §5.1 instead.

---

## 6. Cheigh & Park (1994) review — retrieved, but NO usable numbers

**Cheigh, H.S. & Park, K.Y. (1994).** "Biochemical, microbiological, and nutritional aspects of kimchi (Korean fermented vegetable products)." *Critical Reviews in Food Science and Nutrition* **34(2): 175–203.** DOI: [10.1080/10408399409527656](https://doi.org/10.1080/10408399409527656). PMID 8011144.

- **Status: PAYWALLED.** Europe PMC reports `isOpenAccess: N`.
- I retrieved the **complete abstract** from the Europe PMC REST API (<https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8011144&resultType=core&format=json>).
- **The abstract contains no temperature, time, pH or acidity numbers at all.** It is a purely narrative summary ("Kimchi fermentation is initiated by various microorganisms originally present in the raw materials, but the fermentation is gradually dominated by lactic acid bacteria…").
- **I could not obtain the full text**, so I **cannot confirm or refute** that it reproduces a temperature-vs-ripening-time table. If you need Cheigh & Park's numbers specifically, that requires a subscription or an institutional library.

---

## 7. Complete source inventory (every URL below was fetched successfully)

### Primary kimchi temperature/fermentation studies

1. **Mheen & Kwon (1984)** — *Korean J. Food Sci. Technol.* 16(4):443–450. Full text PDF: <https://koreascience.kr/article/JAKO198403041899994.pdf> · Abstract page: <https://koreascience.kr/article/JAKO198403041899994.pub?&lang=en> · Mirror: <http://pdf.medrang.co.kr/Fsnb/KJournal/1984/Fsnb-016-04-13.pdf>
2. **Rhie, Seung-Gyo & Chun, Sung-Kyu (1982)** — "The Influence of Temperature on Fermentation of Kimchi" (김치의 숙성에 미치는 온도의 영향), *J. Korean Soc. Food Sci. Nutr.* **11(3): 63–66**. PDF: <https://koreascience.kr/article/JAKO198203042254349.pdf> · Abstract page: <https://koreascience.kr/article/JAKO198203042254349.do>
3. **Ku, Kyung-Hyung; Kang, Kun-Og & Kim, Woo-Jung (1988)** — "Some Quality Changes during Fermentation of Kimchi", *Korean J. Food Sci. Technol.* **20(4): 476–482**. Abstract (EN + KO) with the Ea values: <https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=SPGHB5-1988-v20n4-476&tempLang=en> (the koreantk PDF requires login; no free full-text PDF located)
4. **Lee, Kwang-Hyuck; Cho, Hyung-Yong & Pyun, Yu-Ryang (1991)** — "Kinetic Modelling for the Prediction of Shelf-life of Kimchi Based on Total Acidity as a Quality Index", *Korean J. Food Sci. Technol.* **23(3): 306–310**. Full text PDF: <http://koreascience.or.kr/article/JAKO199103041971435.pdf> · AGRIS record: <https://agris.fao.org/search/en/records/6471e64f2a40512c710e8d6a>
5. **Chung, Hae-Kyung; Yeo, Kyung-Mok & Kim, Myung-Hwan (1996)** — "Kinetic Modeling for Quality Prediction During Kimchi Fermentation", *J. Food Sci. Nutr.* **1(1): 41–45**. Full text PDF: <http://www.koreascience.kr/article/JAKO199611920124199.pdf> · Abstract page: <https://koreantk.com/ktkp2014/thesis/thesis-view.view?ctrlNo=E1FSA3-1996-v1n1-41&&&tempLang=en>
6. **Kim, Myung Hwan & Chang, Moon Jeong (1999)** — "Kimchi Quality Kinetics during Isothermal and Nonisothermal Fermentation Conditions", *J. Food Sci. Nutr.* **4(4): 240–250**. Full text PDF: <http://www.koreascience.kr/article/JAKO199911920126261.pdf>
7. **Lee, Hee Yul; Haque, Md. Azizul & Cho, Kye Man (2020)** — "Changes in physicochemical property and lactic acid bacterial community during kimchi fermentation at different temperatures", *J. Appl. Biol. Chem.* **63(4): 429–437**. DOI: [10.3839/jabc.2020.056](https://doi.org/10.3839/jabc.2020.056). PDF: <https://koreascience.kr/article/JAKO202008337072317.pdf> · Abstract page: <https://koreascience.kr/article/JAKO202008337072317.pub?&lang=en>
8. **Kim, Ji-Young; Kim, Byeong-Sam; Kim, Jong-Hoon; Oh, Seung-Il & Koo, Junemo (2020)** — "Development of Dynamic Model for Real-Time Monitoring of Ripening Changes of Kimchi during Distribution", *Foods* **9(8): 1075**. DOI: [10.3390/foods9081075](https://doi.org/10.3390/foods9081075). Open access via Europe PMC: <https://europepmc.org/articles/PMC7465714> (⚠️ mdpi.com returns HTTP 403 to this fetch path; use Europe PMC)
9. **Cheigh & Park (1994)** — *Crit. Rev. Food Sci. Nutr.* 34(2):175–203. DOI: [10.1080/10408399409527656](https://doi.org/10.1080/10408399409527656). Abstract only via Europe PMC REST: <https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8011144&resultType=core&format=json>
10. **Heliyon (2022)** — "Effects of salt type on the metabolites and microbial community in kimchi fermentation", *Heliyon* **8**: e11360. DOI: [10.1016/j.heliyon.2022.e11360](https://doi.org/10.1016/j.heliyon.2022.e11360). PMC9663873. Full text via Europe PMC REST: <https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9663873/fullTextXML> (⚠️ cell.com returns 403)
11. **Jaisan, C. & Lee, D.S. (2017)** — "A mathematical model to predict ripening degree of kimchi, a Korean fermented vegetable for meeting consumer preference and controlling shelf life on real time basis", *Food Packaging and Shelf Life* **12: 23–27**. DOI: [10.1016/j.fpsl.2017.02.002](https://doi.org/10.1016/j.fpsl.2017.02.002) — **citation verified via Crossref; full text NOT retrieved (paywalled).** No numbers from it appear in this report.

### Other papers identified but NOT retrieved (listed so you don't re-hunt)
- **Chang, M.-J. (2000)** — "Fermentation Property of Chinese Cabbage Kimchi by Fermentation Temperature and Salt Concentration", *Appl. Biol. Chem.* **43: 7–11**. Identified via the Foods 2020 reference list (ref. 31) as one of the sources for the 0.2–0.4 / 0.5–0.8 / >1.0% acidity bands. Full text not retrieved.
- **Jung, E.S.; Kim, K.H.; Song, K.Y.; Yoon, S.S. & Shin, W.C. (2004)** — *Korean J. Microbiol. Biotechnol.* **32: 249–255**. Also a source for the acidity bands. Not retrieved.
- **Nam, D.-G. et al. (2017)** — *Korean J. Food Cook. Sci.* **33: 162–173**. Also a source for the acidity bands. Not retrieved.
- **Song, Cho & Kim (1966)**, *Report Army Res Test Lab. (Korea)* 5 — pH 4.5–4.2 optimum. Not retrieved (known only via Mheen & Kwon).
- **Lee & Yang (1970)**, *J. Korea Agr. Chem. Soc.* 13, 107 — 0.4–0.75% acidity optimum. Not retrieved (known only via Mheen & Kwon).

---

## 8. What I could NOT find — stated plainly

1. **"5 °C for 30 days" as a literal, measured statement.** Not found in any retrieved source. See §2 for the closest real numbers (Mheen & Kwon: 27 days to 0.63% acidity, window starts at 35 days; Rhie & Chun: 10 °C, 30 days).
2. **The "20 °C 3 days vs 5 °C 30 days" pairing as a quoted standard.** I could not trace it to the Korean Food Code (식품공전 / MFDS), to KFRI, or to any textbook or review whose text I retrieved. **The MFDS Food Code was searched but no relevant text was retrieved** — this is a search failure, not proof of absence. If this quote matters, the Food Code would need to be checked directly (foodsafetykorea.go.kr) and Cheigh & Park 1994 would need to be read behind the paywall.
3. **Any reported Q10 value for kimchi.** Nothing. All sources use Arrhenius Ea. See §5.4 for my own derived Q10 values, clearly labelled.
4. **Cheigh & Park (1994) numeric content.** Abstract retrieved; it contains no numbers; full text is paywalled.
5. **Mheen & Kwon pH-vs-time data in tabular form.** The paper reports pH only as **figures** (Fig. 2 for pH + total acidity at 3.0% salt; Fig. 3 for total acidity by salt level; Fig. 4/5 for volatile/non-volatile acids). **There is no pH number table.** The pH information is (a) the optimum-ripening pH = 4.2, and (b) the curves in Fig. 2. I did **not** attempt to digitise the figures, so I have **no per-day pH values** from this paper — only the acidity percentages quoted in the text (§1.4) and the reported maxima.
6. **Ku, Kang & Kim (1988) full text.** Only the abstract was retrievable. Their per-temperature data, and thus the basis of the 10 d / 2.4 d / 1 d / 19 h times to pH 4.2, remain unverified at source.
7. **Any kimchi study using exactly 25 °C or 15 °C in the Mheen & Kwon design.** The 1984 design is 30/20/14/5 °C. If you need a 25 °C point, the best retrieved options are Chung et al. 1996 (28 °C) or Lee et al. 2020 (25 °C).

---

## 9. Conflicts and caveats you should carry forward

1. **Mheen & Kwon's internal typo** — p.445 mentions "15 °C" and "10 °C" although the experiment used 14 and 5 °C (§1.1).
2. **Mheen & Kwon's own tension at 5 °C** — 0.63% acidity (their panel optimum threshold) is reached at 27 days, but Table 1 lists optimum ripening at 5 °C/2.25% salt as 35–180 days (§1.4).
3. **Chung et al. 1996** — pH rate constant at 28 °C is 0.0755 in Table 2 but 0.0759 in the text; and the acidity-k series is non-monotonic (0.0878 at 12 °C → 0.3685 at 20 °C → 0.4227 at 28 °C), which makes a single Q10 meaningless.
4. **Ea values differ by ~2× across methods for the same data** — Kim & Chang (1999) report 61–69 kJ/mol by the one-step method but only 33–45 kJ/mol by the two-step method on the *same* experiments. Always state the method when quoting an Ea.
5. **Lee, Cho & Pyun's pH-4.2 times (10 d / 2.4 d / 1 d / 19 h) are wildly faster** than every other retrieved dataset and are a secondary rendering of Ku et al. 1988 (§4.2). Do not use them without the caveat.
6. **"Optimum ripeness" is not one number.** Reported values: pH 4.0, 4.2, 4.2–4.4, 4.5–4.2, 4.2–4.5; acidity 0.4–0.75%, 0.6%, 0.6–0.8%, 0.5–0.8%. The **0.6% (Mheen & Kwon 1984) → 0.6–0.8% → 0.75% tolerable (Lee et al. 1991)** chain is the most traceable. Note Lee et al. 2020's much higher "acidity of 1.5 to 2.0%" statement, which contradicts the older convention and appears to be an error or a different acidity basis — flag it if you cite that paper.
7. **Salt concentration matters but is secondary.** Mheen & Kwon (1984) and Kim & Chang (1999) both show salt shifting rate constants only modestly relative to a 10 °C temperature change.

---

*Files in `kimchi_refs/`: source PDFs (`JAKO198403041899994.pdf`, `JAKO198203042254349.pdf`, `JAKO199103041971435.pdf`, `JAKO199611920124199.pdf`, `JAKO199911920126261.pdf`, `JAKO202008337072317.pdf`, `foods2020.pdf`), extracted text (`p2020.txt`, `foods2020_full.txt`, `heliyon.txt`), rendered page images, and the high-resolution verification crops (`T1full-5.png` = Mheen & Kwon Table 1; `crop_t2_1996.png`, `crop_t2_1999_left.png` = rate constants; `crop_1991_pH42.png`; `crop_1982_pH2.png`).*
