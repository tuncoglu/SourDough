# Fermentation Vessel Materials — Glass vs Glazed Ceramic vs Plastic (HDPE/PP) vs Stainless Steel

**Scope:** rate and safety of vegetable fermentation vessels. Quantitative parameters only, with full citations.

**Method note.** Every number below was retrieved from a source I fetched in this session (full text, abstract, or authoritative database record), except where explicitly marked **snippet-only**. Confidence ratings:

- **strong** — primary regulatory text, standard, or peer-reviewed measurement with stated method/units.
- **moderate** — peer-reviewed but single study / small n / indirect derivation.
- **weak-or-contested** — vendor claim, search snippet only, or contested derivation.

Blocks marked **[MY CALCULATION]** are my own arithmetic, not sourced values.

---

## 1. Oxygen permeability / OTR

### 1.1 Master permeability table

Primary source: Table 11.1 and Table 11.2 in the supplementary tables to *Food Science and Technology* (Campbell-Platt, Wiley), adapted from **Robertson, G.L., *Food Packaging: Principles and Practice*, 3rd ed., Taylor & Francis, 2013** (Table 11.1) and **Mathlouthi, M. (2003)** (Table 11.2).
URL: https://www.wiley.com/legacy/wileychi/campbell_platt/supp/ta/ch11.pdf
**Confidence: moderate.** Textbook compilation of primary measurements; values are given as ranges across many commercial grades, so no single "true" value exists. Internally consistent (see cross-check below).

**Table 11.1 — permeability coefficients in barrer (25 °C, 0% RH unless noted)**

| Polymer | O₂ (barrer) | CO₂ (barrer) | N₂ (barrer) |
|---|---|---|---|
| LLDPE | 1.3–3.0 | 13 | 1.5 |
| **LDPE** | **3.0–6.7** | 13–28 | 0.6–1.98 |
| **HDPE** | **0.6–1.1** | **1.7–4.5** | 0.14–0.33 |
| EVA copolymer | 3.0–4.2 | 13.1–17.3 | 29 |
| **PP** | **0.9–2.3** | **9.2** | 0.44 |
| PVC film | 0.005–0.12 | 0.03–1.0 | 0.04 |
| PS film (oriented) | 1.1–2.7 | 8.8–10.5 | 0.29–0.78 |
| Nylon-6 | 0.012–0.038 | 0.04–0.16 | 0.01 |
| **PET (amorphous)** | **0.055–0.075** | 0.21–0.30 | 0.005 |
| PET (40% crystalline) | 0.018–0.030 | 0.12–0.16 | 0.006 |
| PVdC/PVC copolymer | 0.0006 | 0.0022–0.0036 | 0.0009 |
| EVOH (32% ethylene) | 0.00012 | 0.00036 | 0.000012 |

**Table 11.2 — OTR and WVTR of 25 µm films**

| Polymer (25 µm) | OTR @ 23 °C/0% RH (mL·m⁻²·d⁻¹) | WVTR @ 38 °C/90% RH (g·m⁻²·d⁻¹) | WVTR @ 25 °C/75% RH (g·m⁻²·d⁻¹) |
|---|---|---|---|
| LDPE | 7400 | 12.50 | 4.00 |
| **HDPE** | **1600** | **3.70** | **1.45** |
| PP (cast) | 3040 | 8.20 | 3.30 |
| PP (oriented) | 1550 | 5.00 | 1.35 |
| PP (acrylic-coated) | 1200 | 4.60 | 1.80 |
| PP (oriented + metallized) | 35 | 1.00 | — |
| PVC (rigid) | 120 | 32.00 | 12.00 |
| **PET** | **55** | 20.00 | 7.00 |
| Nylon-6 | 40 | 280 | 80–110 |
| EVOH (32% ethylene) | 0.2–80.0 | 32.0 | — |

### 1.2 Values in the units you asked for

**[MY CALCULATION] — barrer → cm³·mm/(m²·day·atm), and → cm³·mil/(100 in²·day·atm).**

Derivation: 1 barrer = 10⁻¹⁰ cm³(STP)·cm·cm⁻²·s⁻¹·cmHg⁻¹.
Convert thickness cm→mm (×10), area cm⁻²→m⁻² (×10⁴), time s→day (×86400), pressure cmHg→atm (×76):
10⁻¹⁰ × 10 × 10⁴ × 86400 × 76 = **1 barrer = 65.66 cm³·mm/(m²·day·atm)**
And cm³·mm/(m²·day·atm) → cm³·mil/(100 in²·day·atm): × 39.37 (mil/mm) × 0.064516 (100 in²/m²) = **× 2.540**

| Material | P, cm³·mm/(m²·day·atm) | P, cm³·mil/(100 in²·day·atm) | Confidence |
|---|---|---|---|
| **HDPE** | **39–72** | **100–183** | moderate |
| **PP** | **59–151** | **150–384** | moderate |
| **PET (amorphous)** | **3.6–4.9** | **9.2–12.5** | moderate |
| **LDPE** | **197–440** | **500–1117** | moderate |
| LLDPE | 85–197 | 217–500 | moderate |
| Nylon-6 | 0.79–2.5 | 2.0–6.3 | moderate |
| EVOH (32% et.) | 0.0079 | 0.020 | moderate |

**Cross-check (independent, within the same source).** Table 11.2 gives HDPE 25 µm OTR = 1600 mL·m⁻²·d⁻¹. Converting: P = 1600 × 0.025 mm = **40 cm³·mm/(m²·day·atm)** — inside the 39–72 range derived from the barrer column. The two tables agree. This gives me reasonable confidence in the HDPE figure of **P(O₂) ≈ 40 cm³·mm/(m²·day·atm)**.

**OTR at stated thickness (pure O₂, 1 atm, 23 °C) — [MY CALCULATION] from P above:**

| Material | 25 µm | 100 µm | 1 mm | 2 mm | 3 mm |
|---|---|---|---|---|---|
| HDPE (P=40) | 1600 | 400 | 40 | 20 | 13.3 |
| PP (P=76, cast) | 3040 | 760 | 76 | 38 | 25.3 |
| LDPE (P=185) | 7400 | 1850 | 185 | 92.5 | 61.7 |
| PET (P=1.4) | 55 | 14 | 1.4 | 0.7 | 0.46 |

Units: cm³(STP)·m⁻²·day⁻¹.

**CO₂ transmission, HDPE** — [MY CALCULATION from Table 11.1]: CO₂ = 1.7–4.5 barrer = **112–295 cm³·mm/(m²·day·atm)**; at 25 µm that is **4480–11 800 cm³·m⁻²·d⁻¹**; at 2 mm, **56–148 cm³·m⁻²·d⁻¹**. CO₂ is roughly **3–4× more permeable than O₂ in HDPE** (midpoint ratio 3.1/0.85 = 3.6). Confidence: moderate (range spans ~2.6×).

**Water vapour, HDPE:** **3.70 g·m⁻²·d⁻¹ at 38 °C/90% RH** and **1.45 g·m⁻²·d⁻¹ at 25 °C/75% RH**, both for 25 µm film (Table 11.2, source Mathlouthi 2003). Confidence: moderate. [MY CALCULATION] for a 2 mm HDPE wall at 25 °C/75% RH: 1.45 × 0.025/2 = **0.018 g·m⁻²·d⁻¹**; over 0.47 m² ≈ **8.5 mg water/day** — negligible against a 20 L brine.

### 1.3 Glass, glazed ceramic, stainless steel

**Glass — no finite room-temperature OTR is published, and this is not an oversight.** Packaging practice treats glass as an absolute barrier and does not assign it an OTR.

- **Strongest available bound is empirical, from a peer-reviewed study.** Kim, S. & Hu, D.L. (2023), *J. R. Soc. Interface* **20**(201): 20230034, doi:10.1098/rsif.2023.0034, open access at https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/. They built a "hermetically sealed" glass jar for kimchi fermentation and measured its gas permeability as **k_g = 0.796 × 10⁻¹⁸ m²**. They state explicitly that "the permeability of the glass container was due to leaks from the three-dimensional-printed top" — i.e. **100% of the measured gas transport was closure leakage, not the glass wall**. This is the cleanest published demonstration that container glass itself is effectively impermeable. **Confidence: strong** for the qualitative conclusion; the number is a leak rate, not a glass property.
- **High-temperature diffusion bound (do not use as a room-temperature value).** Norton, F.J. (1961), "Permeation of Gaseous Oxygen through Vitreous Silica", *Nature* **191**: 701, https://www.nature.com/articles/191701a0. Measured over **950–1080 °C**; diffusion coefficient pre-exponential D₀ = 2.88 × 10⁻⁶ m²/s and **activation energy 113 kJ/mol** for O₂ in vitreous silica (values as tabulated in a thesis summary: https://etd.ohiolink.edu/acprod/odb_etd/ws/send_file/send?accession=osu1754387730186966&disposition=inline). **Confidence: moderate for the tabulated values; the measurement is at ~1000 °C.** Extrapolating to 25 °C would be a ~10²⁰-fold extrapolation and I explicitly decline to present a derived room-temperature number.
- A glass-jar manufacturer states glass offers a "True Zero" oxygen barrier: https://wetroyesmasonjars.com/glass-vs-plastic-oxygen-transmission-rate/ — **confidence: weak (vendor marketing page, no measurement, no method).** Included only to document that the "zero" framing is industry convention, not a measured value.

**Glazed ceramic / stoneware — NOT CHARACTERISED. There is no published OTR or oxygen permeability coefficient for glazed ceramic fermentation crocks.** I searched specifically for this and found nothing. Two honest partial statements:
- Porcelain (a vitrified, glazed ceramic) is described in the peer-reviewed literature as **impermeable to gas**: "porcelain's ingredients and processing cause its uniformly fine particles to be impermeable to gas" (Kim & Hu 2023, citing Kim et al.). **Confidence: moderate.** This is a qualitative statement with no numeric OTR attached.
- A glazed surface is a glassy layer, so by analogy it behaves like glass — but I found **no measurement** on a fired glaze on a ceramic body. Glaze can also craze/crack, which would bypass the barrier entirely; no quantified leak-rate data found.

**Unglazed porous stoneware (onggi) IS characterised** — this matters because it is the one ceramic vessel with real numbers:
| Parameter | Value | Source |
|---|---|---|
| Porosity ε | **4.72 ± 0.16 %** (CT, 2 µm voxel) | Kim & Hu 2023 |
| Porosity (literature comparison) | **7.21 ± 0.30 %** (Hg porosimetry); **18.71 ± 0.08 %** (Seo et al.) | Kim & Hu 2023 |
| Pore diameter | **1–100 µm, mean 5 µm**; characteristic d_p = 10 µm | Kim & Hu 2023 (SEM) |
| Gas permeability k_g | **1.701 × 10⁻¹⁸ m²** | Kim & Hu 2023 |
| Gas permeance | **3.4 × 10⁻³ mol·kPa⁻¹·m⁻²·h⁻¹** | Kim & Hu 2023 |
| Gas permeance, prior literature (unglazed onggi) | **1.7 – 49.4 × 10⁻³ mol·kPa⁻¹·m⁻²·h⁻¹** | Kim & Hu 2023, citing refs [3],[20] |
| Liquid permeability k | **(4.58 ± 1.10) × 10⁻¹⁵ m²** | Kim & Hu 2023 |
| Hydraulic conductivity K | **(4.58 ± 1.10) × 10⁻⁸ m/s** | Kim & Hu 2023 |
| Water loss through wall | **0.75 ± 0.18 g/h** (R² = 0.989); Q_e = 2.1 ± 0.5 × 10⁻¹⁰ m³/s | Kim & Hu 2023 |
Confidence: **strong** (peer-reviewed, open access, stated methods and uncertainties).

**Stainless steel — zero, and no OTR is defined.** Metals are not permeable to gases in bulk; there is no permeation mechanism analogous to polymer solubility–diffusion. **No published OTR for stainless steel fermentation vessels exists, and the absence is physically expected rather than a data gap.** Gas exchange in a stainless vessel occurs only through the closure, fittings, airlock, or weld defects. I found no measured leak rate for a stainless fermentation vessel. **Confidence: strong** for "zero bulk permeability"; the practical leak rate through seals is unquantified in the literature I could reach.

### 1.4 Effect of temperature on OTR

**Partially characterised — I could not verify a numeric activation energy from a source I was able to read.**

- The peer-reviewed study on this is **Mrkić, S., Galić, K. & Ivanković, M. (2007), "Effect of Temperature and Mechanical Stress on Barrier Properties of Polymeric Films Used for Food Packaging", *Journal of Plastic Film & Sheeting* **23**(3): 239–256**, doi:10.1177/8756087907086102, https://journals.sagepub.com/doi/10.1177/8756087907086102. Verified abstract (via Crossref API, doi:10.1177/8756087907086102): permeance of CO₂, O₂, N₂ and air through PE, BOPP and PA films measured over **10–60 °C**; the **highest activation energy for the permeability coefficient P was obtained for PE film**; the ordering of activation energies was **N₂ = air > CO₂ > O₂**. **Confidence: moderate** — this confirms the direction and the ranking, but the abstract does not report the numeric E_a values and the full text is paywalled, so I have no number to give.
- **Gap flagged:** I could not verify an activation energy in kJ/mol for O₂ permeation in HDPE, nor a "×N per 10 °C" rule, from any source I was able to read. Do not use an invented value.

### 1.5 **[MY CALCULATION]** 20 L HDPE bucket — oxygen ingress rate

**Inputs (all inputs labelled by source):**
- P(O₂, HDPE) = **40 cm³·mm/(m²·day·atm)** — base case, from Table 11.2 (Mathlouthi 2003 / Robertson 2013); range 39–72 from Table 11.1.
- Geometry, assumed typical 20 L HDPE pail (my assumption, not from a datasheet): height **0.35 m**, diameter **0.30 m**.
  - Side wall = πDH = **0.330 m²**; bottom = πD²/4 = **0.0707 m²**; lid = **0.0707 m²**; total **0.471 m²** (wetted wall + bottom = 0.401 m²).
- Wall thickness **2.0 mm** (base); lid **1.5 mm** (typical HDPE pail lid is thinner).
- Driving force: air is **20.9% O₂**, so Δp(O₂) = **0.209 atm**, assuming internal pO₂ ≈ 0 during active fermentation.

**Step 1 — wall flux.**
Q_wall = P · A_wall · Δp / t = 40 × 0.401 × 0.209 / 2.0 = **1.67 cm³(STP)/day**

**Step 2 — lid flux.**
Q_lid = 40 × 0.0707 × 0.209 / 1.5 = **0.39 cm³(STP)/day**

**Step 3 — total, converted to mass.**
Q_total = 2.07 cm³(STP)/day ÷ 22 414 cm³/mol = 9.24 × 10⁻⁵ mol/day × 32.00 g/mol = 2.96 × 10⁻³ g/day

> ### **Oxygen ingress ≈ 3.0 mg O₂/day at STP; ≈ 2.7 mg O₂/day at 25 °C**
> **Plausible range across P and thickness: ≈ 2–7 mg O₂/day.**

Sensitivity: low case (P = 39, t_wall = 2.5 mm) → 2.1 mg/day; high case (P = 72, t_wall = 1.5 mm, t_lid = 1.0 mm) → 6.6 mg/day.

**Wall vs lid split (base case): wall 81%, lid 19%** — geometrically the **wall dominates ~4:1**, *but only if the lid seals perfectly*. See §5: in real vessels it does not, and the closure dominates.

### 1.6 **[MY CALCULATION]** Wall ingress vs the oxygen already present

| Oxygen reservoir | Amount | Equivalent days of wall+lid ingress (at 2.7 mg/day) |
|---|---|---|
| Headspace, 2 L of air (10% of a 20 L bucket) | 2 L × 0.209 = 418 cm³ = **597 mg O₂** | **221 days** |
| Dissolved O₂ in 20 L brine, air-saturated (8.3 mg/L at 25 °C; standard water-quality value) | **166 mg O₂** | **61 days** |
| **Wall + lid ingress, per day** | **2.7 mg O₂/day** | 1 day |

**Interpretation:** the initial headspace alone holds ~**220× more oxygen than the entire bucket wall admits in a day**. The wall is not the oxygen problem; the headspace is.

### 1.7 **[MY CALCULATION]** A thin LDPE bag liner is a *far worse* barrier than the HDPE wall

Same exposed area (0.4 m²), air driving force (0.209 atm):
- 25 µm LDPE: P = 185 cm³·mm/(m²·day·atm) (Table 11.2: 7400 mL·m⁻²·d⁻¹ at 25 µm)
  Q = 185 × 0.4 × 0.209 / 0.025 = **619 cm³/day ≈ 810 mg O₂/day**
- 2 mm HDPE wall: **1.67 cm³/day ≈ 2.2 mg O₂/day**

Ratio ≈ **370×** — driven mostly by the 80× thickness difference, partly by LDPE's 4.6× higher P.

**Practical consequence:** a thin LDPE liner is not an oxygen barrier. Its value is *mechanical* — it excludes the headspace air from contacting the produce surface and holds the mash submerged. Anyone choosing a liner for its "barrier" properties has the physics backwards.

---

## 2. Leachates / migration from HDPE and PP into acidic and salty media

### 2.1 Regulatory limits (strong)

| Limit | Value | Source |
|---|---|---|
| EU overall migration limit (OML), plastics | **10 mg total constituents per dm² of food-contact surface** | Commission Regulation (EU) No 10/2011, **Article 12(1)** — https://www.legislation.gov.uk/eur/2011/10/article/12/data.xht?wrap=true |
| EU OML, food for infants/young children | **60 mg/kg of food simulant** | Same, **Article 12(2)** |
| EU OML summary (secondary confirmation) | "10 mg/dm² of material except for materials in contact with children's food, for which the limit is 60 mg/kg of food" | https://www.contactalimentaire.fr/en/regulations-governing-materials-contact-food/regulation-eu-no-102011-january-14-2011 |
| FDA — polypropylene resin specs | n-hexane extractable **6.4 % max at reflux**; xylene soluble **9.8 % max at 25 °C** | 21 CFR 177.1520(c) item 1.1a — https://www.law.cornell.edu/cfr/text/21/177.1520 |
| FDA — polyethylene, food contact (not cooking) | n-hexane extractable **5.5 % max at 50 °C**; xylene soluble **11.3 % max at 25 °C** | 21 CFR 177.1520(c) item 2.1 |
| FDA — polyethylene, packing/holding food during cooking | n-hexane extractable **2.6 % max at 50 °C** | 21 CFR 177.1520(c) item 2.2 |
| FDA — PE density range | **0.85–1.00 g/cm³** | 21 CFR 177.1520(c) items 2.1–2.3 |
| Confidence | **strong** — primary regulatory/legal text | |

**Important caveat on the FDA numbers.** These are **resin-level solvent-extraction specifications**, measured in n-hexane at 50 °C or reflux and in xylene at 25 °C. They are **not** migration values into food or into an acidic brine, and they are not comparable to the EU OML. Do not present them as "how much leaches into sauerkraut".

### 2.2 Measured migration values — what exists and what does not

The best available synthesis is a PRISMA systematic review: **Badarou, A.S.-D., Lagnika, C., Hounhouigan, H.M., Gantonbge, A.T., Amoussa, A.M., Song, J. & Lagnika, L. (2025), "Migration of Antimony and Phthalate Esters from Plastic Food Packaging: A Systematic Review of Reported Levels, Food Matrix Effects and Influencing Factors", *Current Research in Nutrition and Food Science* 13(3): 1079–1105**, doi:10.12944/CRNFSJ.13.3.4, open access: https://www.foodandnutritionjournal.org/download/24945. **Confidence: moderate** — PRISMA protocol, 1317 records screened, 45 studies retained (2010–2025); but it is a synthesis of heterogeneous studies, and its scope is dominated by **PET (antimony) and plasticised PVC (phthalates)**, not HDPE/PP.

Findings I verified in the full text:

- **Acidic and fatty matrices increase migration.** The review states phthalate levels are "consistently higher in lipid-rich or acidic matrices", and lists the factors most strongly associated with increased migration as **elevated temperature (40–70 °C), prolonged storage (months to >1 year), and matrix composition (acidic or fatty foods)**. **Confidence: moderate** — a qualitative synthesis conclusion, no pooled effect size given.
- **Antimony (from PET, not HDPE/PP):** generally **< 5 µg/L** in bottled water under ambient storage, but **up to 18.5 µg/L** under stress (high temperature or **acidic simulants**). In soy sauce, total Sb up to **6.6 µg/L**. Regulatory limit cited: **5 µg/L Sb** (EU 10/2011). Acidic simulant data (3% acetic acid, 40 °C, 10 days, PET): **0.5–1.2 µg/L**; vinegar 0.45–0.50 µg/L; reuse with acetic acid reached **6.4 µg/L**.
- **HDPE-specific measured values I could verify (all in water, not brine):**
  - HDPE film sachets (Ghana), **8 °C / 30 °C / 40 °C, up to 28 days**: DMP **0.27–1.83 µg/L**; DEP **0.55–1.96 µg/L**; DBP **ND–2.59 µg/L**; BBP **up to 1.03 µg/L**; DEHP **< 5 µg/L**.
  - PE film, simulants isooctane / ethanol / **acetic acid** / sucrose, −18 to 60 °C, up to 240 h: **DEHP up to 1.64 mg/kg; BBP up to 0.45 mg/kg**. *(This is the only HDPE/PE + acetic-acid entry I found — but it is a film, in a simulant, not a fermentation vessel.)*
  - Regulatory limit cited for DEHP: **1.5 mg/kg**.
- **Measured migration from PET into food simulants** (for method-comparison only): distilled water / 3% acetic acid / 10–20% ethanol / oils / vinegars, 40 °C 10 days + 60 °C 10 days, reuse: **0.5–1.2 µg/L** in aqueous simulants; **<LOQ in oils**; vinegar 0.45–0.50 µg/L. Another study, 22 PAEs from beverages and simulants (distilled water, 3% acetic acid) at 40 °C/10 days: DIBP up to **48.5 ng/kg**, DBP up to **498.8 ng/kg**, DEHP up to **4 ng/kg**, DNOP up to **18.1 ng/kg**.

### 2.3 **NO DATA FOUND — this is the single biggest gap in this report**

I searched specifically and repeatedly for each of the following. **None exists in anything I could reach:**

1. **Total (overall) migration from HDPE or PP into a pH < 4.0, 2–5% NaCl aqueous brine** at fermentation temperature (15–25 °C) over a realistic fermentation period (1–4 weeks), expressed in mg/kg or mg/dm². **No such measurement found.**
2. **Any measurement of specific migrants (oligomers, Irganox 1010/1076, Irgafos 168, erucamide/oleamide, NIAS) from an HDPE or PP vessel into an actual fermenting vegetable mash or brine.** No such study found.
3. **Any study measuring chemical migration from a food-grade plastic bucket used for sauerkraut, kimchi or pickles.** No such study found. The "plastic bucket sauerkraut" literature appears to be entirely extension-service guidance and anecdote, not measurement.
4. **Microplastic release into sauerkraut or kimchi from the fermentation vessel.** I found only popular-press coverage of a study about *fermented foods helping the body clear microplastics* — the opposite direction, and not a vessel-migration study. **No vessel-release measurement found.**
5. **Effect of lactic acid specifically on polyolefin migration.** I found acetic-acid data (above) but **nothing on lactic acid**, which is the actual acid in sauerkraut and kimchi. Unquantified.
6. **Effect of NaCl / ionic strength on migration from HDPE or PP.** No data found.

**Bottom line for §2:** the *regulatory* framework is solid and the *general* principle that acid and time increase migration is documented. But the specific question — "how much leaches out of an HDPE bucket into sauerkraut brine over three weeks?" — **has not been answered by any study I could locate.** Anyone asserting a number for this is inventing it.

---

## 3. Lead and cadmium in glazed ceramic

### 3.1 Regulatory action levels (strong — primary FDA text)

**FDA Compliance Policy Guide Sec. 545.450 — Pottery (Ceramics); Import and Domestic — Lead Contamination (November 2005).**
Full text: https://www.fda.gov/media/71764/download · Guidance page: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cpg-sec-545450-pottery-ceramics-import-and-domestic-lead-contamination

| Category | Sampling criterion | Action level (µg Pb per mL of leaching solution) |
|---|---|---|
| Flatware | average of 6 units | **3.0** |
| Small hollowware, other than cups and mugs | any one of 6 units | **2.0** |
| Cups / mugs | any one of 6 units | **0.5** |
| Large hollowware, other than pitchers | any one of 6 units | **1.0** |
| Pitchers | any one of 6 units | **0.5** |

**FDA Compliance Policy Guide Sec. 545.400 — Pottery (Ceramics); Import and Domestic — Cadmium Contamination (November 2005).**
Full text: https://www.fda.gov/media/71762/download · Guidance page: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cpg-sec-545400-pottery-ceramics-import-and-domestic-cadmium-contamination

| Category | Sampling criterion | Action level (µg Cd per mL of leaching solution) |
|---|---|---|
| Flatware | average of 6 units | **0.5** |
| Small hollowware | any one of 6 units | **0.5** |
| Large hollowware | any one of 6 units | **0.25** |

µg/mL is numerically identical to ppm.

**Category definitions (both CPGs):**
- **Flatware:** internal depth ≤ **25 mm**.
- **Hollowware:** internal depth > **25 mm**.
- **Small hollowware:** capacity < **1.1 L**. **Large hollowware:** capacity ≥ **1.1 L**.
- Cups/mugs: small hollowware for hot beverages, normally ~**240 mL (8 fl. oz.)**, with a handle.
- Pitchers: large hollowware for storing/dispensing **fruit and vegetable juices or other acidic beverages at or below room temperature**, normally without a lid, with handle and lip spout.

> **Applying this to a fermentation crock:** a 5 L ceramic sauerkraut crock is **large hollowware** (≥1.1 L, depth >25 mm, not a pitcher). Its applicable FDA action levels are **1.0 µg/mL lead** and **0.25 µg/mL cadmium**. Note the CPG's own logic — pitchers get the stricter 0.5 µg/mL precisely *because* they hold acidic liquid at room temperature, which is exactly what a fermentation crock does. **There is a reasonable argument that a crock is functionally a pitcher and should meet 0.5 µg/mL, but the CPG as written assigns it 1.0 µg/mL.** *(This reasoning is mine, not FDA's.)*

### 3.2 Leach test conditions (strong — primary FDA method)

**FDA Elemental Analysis Manual, Method 4.6, "Inductively Coupled Plasma–Optical Emission Spectrometric Determination of Cadmium and Lead Extracted from Ceramic Foodware", Version 1.0 (January 2020).**
URL: https://www.fda.gov/media/95170/download

Exact conditions: **4% acetic acid**, vessel filled to **within 6–7 mm of overflowing**, leached for **24 hours at 22 ± 2 °C**. FDA states this is the same extraction procedure as **AOAC Official Methods 973.32 and 999.17**, **ASTM Standard Test Method C738-94**, and EAM Method 4.1. The method applies to "silicate-based materials (earthenware, glazed ceramicware, decorated ceramicware, decorated glass, and lead crystal glass)". Confidence: **strong**.

### 3.3 Measured lead release from artisanal / traditional pottery

**Belgaied, J.E. (2003), "Release of heavy metals from Tunisian traditional earthenware", *Food and Chemical Toxicology* 41(1): 95–98**, doi:10.1016/S0278-6915(02)00202-8, https://pubmed.ncbi.nlm.nih.gov/12453733/
- Yellow/green and white/green **mugs** filled with acetic acid solutions released **up to 51 µg Pb per mL of leachate** — exceeding the FDA 24 h leaching limit (for mugs, 0.5 µg/mL) by **~100×**.
- Using **leben** (a traditional fermented milk derivative) as the leaching agent: **up to 1407 µg of lead ingested per mug** consumed.
- **Confidence: moderate** — peer-reviewed but single-laboratory, small sample, and the vessel type (mugs) is not a crock. Note it tested a **fermented dairy** product, which is the closest thing I found to a fermented-food leaching test.

**Castellanos-Carrizal, C., Castillo-Ruiz, O., Ramírez-Quintanilla, L.Y., Carrizales-Yañéz, L. & Montes, S. (2026), "Enhanced Leaching of Soluble Lead by Cooking Acidic Food in Glazed Pottery Sold at the Mexico-US Border", *Journal of Public Health Management and Practice* 32(2): 268–275**, doi:10.1097/PHH.0000000000002305, https://pubmed.ncbi.nlm.nih.gov/41576409/
- 33 glazed-clay pottery items collected in Reynosa, Tamaulipas, Mexico. Official Mexican lead-leaching test run on 8 cookware items: **only 1 of 8 met the standard; the other 7 exceeded the maximum permissible level.**
- 25 lead-glazed items used to cook real traditional dishes:
  - **Acidic food: median 103.4 mg/kg Pb (IQR 14.8–186.1)**
  - **Non-acidic food: median 11.19 mg/kg Pb (IQR 2.17–27.82)**, P < .05
  - → **acidic food extracted ~9× more lead than non-acidic food**
- **Confidence: strong for the acidity effect** (peer-reviewed, 2026, real foods not simulants, significance test reported); **moderate for transferability** — Mexican artisanal cookware, cooking temperatures, and mg/kg in food rather than µg/mL in leachate, so not directly comparable to the CPG action levels.

**FDA (November 2010), "Questions and Answers on Lead-Glazed Traditional Pottery"**, https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-lead-glazed-traditional-pottery — **confidence: strong (authority)**:
- FDA has received reports that traditional pottery from several Mexican manufacturers **labelled "lead free" in fact contained extractable lead comparable to lead-glazed pottery, and in some cases in excess of FDA's action levels**.
- Mechanism: improper firing leaves lead unfused; also **kiln cross-contamination** — potters using non-lead glazes in old kilns that previously fired lead glazes can unintentionally contaminate "lead free" ware.
- High-risk "problem types": **handmade with crude appearance or irregular shape; antique; damaged or excessively worn; bought from flea markets or street vendors; brightly decorated in orange, red, or yellow.**
- **"No amount of washing, boiling, or other process can remove lead from pottery."**
- FDA directs that any "problem type" item should not be used for cooking, serving, **or storing** food or drink.

### 3.4 Effect of acidity — with numbers

| Comparison | Result | Source | Confidence |
|---|---|---|---|
| Acidic vs non-acidic food, glazed pottery | **103.4 vs 11.19 mg/kg Pb (median); ~9× ; P < .05** | Castellanos-Carrizal 2026 | strong |
| Acetic acid vs FDA mug action level | **up to 51 µg/mL vs 0.5 µg/mL limit (~100×)** | Belgaied 2003 | moderate |
| Acidic food vs non-acidic, framework | FDA CPGs assign the **strictest limits (0.5 µg/mL) to pitchers** — "acidic beverages at or below room temperature" | FDA CPG 545.450 | strong |

**Caution on over-reading the 9× figure:** it compares food *cooked* in the vessel (heat + acid + time) and is measured as mg/kg in food. It is directionally solid but is not a clean pH-series experiment.

### 3.5 **NO DATA FOUND (ceramics)**

1. **No measurement of lead or cadmium release from a purpose-built ceramic fermentation crock** (sauerkraut crock, kimchi pot, pickling crock) under realistic multi-week fermentation. Every study I found tested mugs, plates, cookware, or decorative ware. **Substituting teaware data for crock data is an extrapolation, and I flag it as such.**
2. **No study of lead leaching by lactic acid.** I found acetic acid (the standard test acid) only. Lactic acid is the dominant acid in sauerkraut and kimchi. Unquantified.
3. **No multi-day/multi-week extraction study.** All standard tests are **24 h**. A vegetable fermentation runs **1–4 weeks** in the same vessel. Whether a 24 h test under- or over-estimates a 3-week exposure is **not characterised in any source I found**. This is a real and consequential gap: cumulative extraction generally increases with time, but the standard test cannot see it.
4. **No data on glaze crazing/cracking increasing leaching** with quantified effect.
5. Cadmium-specific measured values from artisanal ware: I found the CPG action levels, but **no measured cadmium survey data** comparable to the lead surveys.

---

## 4. Does vessel material change the RATE of vegetable fermentation?

**Yes — and there is a genuine side-by-side study. But the effect is driven by CO₂ removal, not by oxygen ingress.**

### 4.1 The side-by-side study (all four material classes in one experiment)

**Jeong, J.-K., Kim, Y.-W., Choi, H.-S., Lee, D.S., Kang, S.-A. & Park, K.-Y. (2011), "Increased quality and functionality of kimchi when fermented in Korean earthenware (onggi)", *International Journal of Food Science & Technology* 46(10): 2015–2021**, doi:10.1111/j.1365-2621.2011.02710.x.
Record with full abstract: https://agris.fao.org/search/en/records/65df8ed70f3e94b9e5d9d684 · Wiley: https://ifst.onlinelibrary.wiley.com/doi/abs/10.1111/j.1365-2621.2011.02710.x

**Design:** kimchi fermented at **4 °C for 4 weeks** in: **glazed onggi**, **non-glazed onggi**, **polyethylene plastic containers**, **polypropylene kimchi-refrigerator containers**, **stainless steel**, and **glass bottles**. This is the only study I found that puts all of glass / glazed ceramic / plastic / stainless steel in the same comparison.

**Reported results:**
| Outcome | Onggi | Others |
|---|---|---|
| Acidity change over 4 weeks | "relatively stable" | less stable |
| Lactic acid bacteria at week 4 | **10⁸–10⁹ CFU/g** | lower |
| General aerobic bacteria | **slower** multiplication | faster |
| Springiness at week 4 | **> 50%** | lower |
| Sensory (carbonic acid taste, overall acceptability) | excellent | lower |
| Antioxidative & cancer-cell antiproliferative activity | greater | lower |
| Glazed vs non-glazed onggi | **non-glazed onggi better on both properties and functionality** | — |
| Gas permeability | **higher than PE plastic containers and glass bottles, because of porous structure** | lower |

Also reported (as cited in Kim & Hu 2023, ref [3]): kimchi in onggi over four weeks had **~100× higher LAB counts** than in plastic and steel containers, and onggi **slowed foul-tasting aerobic bacteria ~100×**.

**Confidence: moderate.** Peer-reviewed and directly on point, but: one fermentation trial, no replication reported in the abstract, no numeric pH/acidity time series in the abstract, and the full text is paywalled. The LAB numbers (10⁸–10⁹ CFU/g, "100×") are order-of-magnitude statements, not precise effect sizes.

### 4.2 The mechanism study — measured rate difference

**Kim, S. & Hu, D.L. (2023), "Onggi's permeability to carbon dioxide accelerates kimchi fermentation", *Journal of the Royal Society Interface* 20(201): 20230034**, doi:10.1098/rsif.2023.0034, open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/

**Design:** salted napa cabbage (**200 g**, 2 wt% brine for 6 h), fermented in a **4.6 L unglazed onggi** and a **1.9 L hermetically sealed glass jar**, held at **25 °C** in darkness; 3 trials each; CO₂, O₂ and pressure logged in the headspace; a mass-balance model with gas permeability as a free parameter.

**Measured results:**

| Quantity | Glass jar | Onggi | Note |
|---|---|---|---|
| CO₂ generation rate | **0.552 mmol/h** | **0.695 mmol/h** | **+26%**, one-tailed t-test **p = 0.0498** |
| CO₂ generation per unit cabbage | **2915 mg·kg⁻¹·day⁻¹** | **3670 mg·kg⁻¹·day⁻¹** | literature comparison: kimchi in glass, 25 °C, 2 wt% salt = **2531 mg·kg⁻¹·day⁻¹** |
| Gas permeability k_g | 0.796 × 10⁻¹⁸ m² | 1.701 × 10⁻¹⁸ m² | glass value = **lid leakage**, not glass |
| Model fit R² | 0.954 | 0.850 | |
| Steady-state internal gas pressure | — | **4.1 kPa** | |
| CO₂ plateau | higher | **"less than half the values of hermetically sealed containers"** | |

**Interpretation (the authors'):** "permeable onggi permits carbon dioxide to escape the container, which in turn accelerates the rate of fermentation. Porosity thus acts as a safety valve for carbon dioxide... The positive pressure inside the onggi and the constant outflow through its walls act as a safety valve for bacteria growth by blocking the entry of external contaminants without mechanical components."

**Confidence: strong** (peer-reviewed, open access, methods and uncertainties stated, significance test reported). **Caveats:** n = 3 per condition; 200 g cabbage is a small-scale model, not a 20 L crock; the "glass" control leaked at its lid, so the onggi-vs-glass contrast is partly a permeability contrast and partly a leak contrast; and the fermentation was at 25 °C, not the typical ~10 °C.

### 4.3 Direct answer, and the honest gap

- **Onggi (unglazed porous ceramic) vs plastic / glass / stainless steel: yes, a measured rate difference exists** — +26% CO₂ generation (p = 0.0498) in the best-controlled study, with larger quality/microbiology differences reported in the 4-week study.
- **Glass vs HDPE vs PP vs stainless steel, head-to-head: NO DATA.** Jeong 2011 lumped PE, PP, stainless steel and glass together as the "other containers" comparison group; I found **no study that measures a fermentation-rate difference among those four**. Anyone claiming glass ferments faster than food-grade plastic, or that stainless is faster than glass, is **not speaking from data**.
- **Safety vs rate:** for the non-porous materials (glass, HDPE, PP, stainless), the literature supports a **safety and quality** distinction (leachates, §2–3) far more than a **rate** distinction. For ceramic, the rate effect is real but attaches specifically to **porosity**, not to "ceramic" as a category — a fully vitrified, well-glazed crock would be expected to behave like glass, and I found no study testing that.

---

## 5. Does the vessel's oxygen permeability matter in practice, given the headspace is already air?

**Largely no — for glass, HDPE, PP and stainless steel. The headspace dominates by ~2 orders of magnitude, and the closure dominates over the wall. For porous ceramic, permeability matters a great deal, but through CO₂ *exit*, not O₂ *entry*.**

**5.1 Quantitative treatment — the headspace arithmetic.** [MY CALCULATION, §1.6] A 2 L headspace in a 20 L bucket holds **597 mg O₂**; the HDPE wall+lid admits **2.7 mg O₂/day**. The headspace is worth **~221 days of wall ingress**. Even a brim-full, air-saturated brine holds 166 mg dissolved O₂ ≈ 61 days of wall ingress. **Diffusion through a 2 mm polyolefin wall is simply not a competitive oxygen source on the timescale of a 1–4 week fermentation.**

**5.2 Quantitative treatment — the closure beats the wall.** This is the strongest published evidence, and it is direct: in Kim & Hu (2023), the "hermetically sealed" **glass jar** — whose wall is impermeable — measured a gas permeability of **0.796 × 10⁻¹⁸ m²**, which the authors attribute **entirely to leakage through its 3D-printed lid**. The onggi, at **1.701 × 10⁻¹⁸ m²**, was only **2.1× higher**. In other words: **a vessel with a perfectly impermeable wall still leaked at a rate within a factor of ~2 of a deliberately porous ceramic pot, because of its lid.** For any real bucket or crock, **the seal — not the wall material — is the controlling oxygen path.**

**5.3 [MY CALCULATION] Onggi vs HDPE wall, same units.**
Convert the HDPE wall to the units Kim & Hu use for onggi (mol·kPa⁻¹·m⁻²·h⁻¹):
P = 40 cm³·mm/(m²·day·atm) at t = 2 mm → permeance = 20 cm³(STP)/(m²·day·atm)
= 20 / 22 414 = 8.92 × 10⁻⁴ mol/(m²·day·atm)
÷ 101.325 kPa/atm = 8.81 × 10⁻⁶ mol/(m²·day·kPa)
÷ 24 = **3.67 × 10⁻⁷ mol·kPa⁻¹·m⁻²·h⁻¹**

Onggi (measured, Kim & Hu 2023) = **3.4 × 10⁻³ mol·kPa⁻¹·m⁻²·h⁻¹**

> **Ratio ≈ 9 × 10³ — the onggi wall is roughly four orders of magnitude more gas-permeable than a 2 mm HDPE bucket wall.**

**Caveat (important):** this ratio is **my own conversion** across two different measurement conventions (a polymer permeability coefficient vs a porous-media permeance). Treat it as an **order-of-magnitude** indication (≈10³–10⁴), not a precise figure. It is consistent with Jeong 2011's qualitative statement and with Kim & Hu's framing.

**5.4 Why onggi's permeability matters anyway — and it is not about oxygen.** The onggi effect operates through **CO₂ removal and positive internal pressure**:
- CO₂ kept at **less than half** the level of a sealed container (Kim & Hu 2023).
- **+26% CO₂ generation** (p = 0.0498) — i.e. faster fermentation.
- **Positive pressure of 4.1 kPa** inside the onggi, with continuous outflow that the authors argue blocks entry of external contaminants "without mechanical components".
- Onggi is also **liquid-permeable**: it loses **0.75 ± 0.18 g water/h** through its walls and forms salt crystals on the outside ("salt flower"). It is therefore **not a closed system at all** — a salting/brining vessel that continuously wicks and evaporates brine.

**5.5 What I could NOT find.** **No study quantifies the O₂ ingress rate into a fermentation vessel through its wall** — for any material — nor relates it to off-flavour, mould, or *Acetobacter* growth. The oxygen-side argument in the fermentation literature is made qualitatively ("keep it submerged", "minimise headspace", "use an airlock"); the CO₂-side argument is the one with numbers. **The correct practical conclusion is that headspace elimination and seal quality are the levers that matter, and wall-material oxygen permeability is a second-order effect for glass/HDPE/PP/stainless.**

---

## 6. Consolidated register of "NO DATA"

| # | Question | Status |
|---|---|---|
| 1 | OTR / O₂ permeability of **glazed ceramic or stoneware** | **Not characterised.** No published value for a fired glaze on a ceramic body. Porcelain described qualitatively as "impermeable to gas" (no number). |
| 2 | Room-temperature O₂ permeability of **container glass** | **No finite value published.** Glass is treated as an absolute barrier and not assigned an OTR. Best empirical evidence is indirect (Kim & Hu 2023: glass jar leaked only at its lid). |
| 3 | **Stainless steel** OTR | **No value exists and none is expected** — bulk metals are impermeable. Seal/fitting leak rates unquantified. |
| 4 | **Activation energy (kJ/mol) for O₂ permeation in HDPE**, or a "×N per 10 °C" rule | **Not verified.** Direction and ranking confirmed (Mrkić 2007: E_a order N₂ = air > CO₂ > O₂; PE highest), but no numeric E_a obtained. |
| 5 | **Overall migration from HDPE/PP into pH<4, 2–5% NaCl brine** over 1–4 weeks | **Not found.** No study. |
| 6 | **Specific migrants** (Irganox 1010/1076, Irgafos 168, erucamide, oligomers, NIAS) from an HDPE/PP **fermentation vessel** into mash or brine | **Not found.** |
| 7 | Migration from a **food-grade plastic bucket used for sauerkraut/kimchi/pickles** | **Not found.** No measurement exists that I could locate. |
| 8 | **Microplastic release into sauerkraut/kimchi from the vessel** | **Not found.** |
| 9 | Effect of **lactic acid** (as opposed to acetic acid) on migration from polyolefins | **Not found.** |
| 10 | Effect of **NaCl / ionic strength** on polyolefin migration | **Not found.** |
| 11 | Lead/cadmium release from a **purpose-built ceramic fermentation crock** | **Not found.** All ceramic studies tested mugs, plates, cookware or decorative ware. |
| 12 | **Multi-week** (vs 24 h standard) lead extraction | **Not found.** Standard tests are 24 h; no study of 1–4 week exposure. |
| 13 | Measured **cadmium** survey values from artisanal ware | **Not found** (action levels exist; survey data equivalent to the lead surveys does not). |
| 14 | Fermentation-**rate** comparison among **glass vs HDPE vs PP vs stainless steel** | **Not found.** Jeong 2011 grouped them together. |
| 15 | Measured **O₂ ingress rate through a fermentation vessel wall** and its effect on spoilage | **Not found** for any material. |

---

## 7. What the evidence actually supports

**Rate.** Only one material shows a measured rate effect: **unglazed porous ceramic (onggi)**, via CO₂ venting — **+26% CO₂ generation, p = 0.0498** (Kim & Hu 2023), with **10⁸–10⁹ CFU/g LAB** and better texture/sensory at 4 weeks (Jeong 2011). **Among glass, HDPE, PP and stainless steel there is no rate data at all** — treat any ranked claim as unsupported.

**Safety — the asymmetry is stark and runs *against* the artisanal option.**
- **Glazed ceramic is the only vessel class with documented, quantified, real-world poisoning-level hazard.** FDA action levels are **1.0 µg/mL Pb / 0.25 µg/mL Cd for large hollowware** (a crock); real artisanal ware measured **up to 51 µg Pb/mL** (Belgaied 2003) and **103.4 mg/kg Pb in acidic food vs 11.19 mg/kg in non-acidic** (~9×, P<.05; Castellanos-Carrizal 2026); **7 of 8** tested cookware items failed the national standard; and "lead free" labelling is unreliable due to kiln cross-contamination (FDA 2010). Critically, **a 1–4 week acidic fermentation is a longer and more aggressive exposure than the 24 h test that defines compliance**, and no study has characterised that.
- **HDPE/PP are the best-characterised materials by regulation** (FDA 21 CFR 177.1520 resin specs; EU 10/2011 OML 10 mg/dm²) but the specific migration question that matters — into brine, over weeks — **is simply unstudied**. The regulatory limits are not evidence of zero migration.
- **Glass and stainless steel carry no comparable documented hazard** and are the only two classes with no identified leaching pathway into an acidic brine. They are the conservative choice on safety grounds.

**Oxygen, in one line.** For glass, HDPE, PP and stainless, the headspace holds ~**220× more O₂ than the wall admits per day**, and the closure leaks more than the wall — so **eliminate headspace and seal well; the wall material is second-order.** For porous ceramic the wall is ~10³–10⁴× more permeable, which matters because it lets CO₂ **out**, not because it lets O₂ in.

---

### Sources (all URLs verified reachable in this session)

1. Robertson, G.L., *Food Packaging: Principles and Practice*, 3rd ed. (2013) / Mathlouthi, M. (2003) — Tables 11.1 & 11.2 — https://www.wiley.com/legacy/wileychi/campbell_platt/supp/ta/ch11.pdf
2. FDA CPG Sec. 545.450, Lead Contamination (Nov 2005) — https://www.fda.gov/media/71764/download
3. FDA CPG Sec. 545.400, Cadmium Contamination (Nov 2005) — https://www.fda.gov/media/71762/download
4. FDA Elemental Analysis Manual Method 4.6, v1.0 (Jan 2020) — https://www.fda.gov/media/95170/download
5. FDA Compliance Program Guidance Manual 7304.019, Toxic Elements in Food and Foodware (8 Aug 2023) — https://www.fda.gov/media/142504/download
6. FDA, Questions and Answers on Lead-Glazed Traditional Pottery (Nov 2010) — https://www.fda.gov/food/environmental-contaminants-food/questions-and-answers-lead-glazed-traditional-pottery
7. Kim, S. & Hu, D.L. (2023) *J. R. Soc. Interface* 20(201):20230034 — https://pmc.ncbi.nlm.nih.gov/articles/PMC10072942/
8. Jeong, J.-K. et al. (2011) *Int. J. Food Sci. Technol.* 46(10):2015–2021 — https://agris.fao.org/search/en/records/65df8ed70f3e94b9e5d9d684
9. Belgaied, J.E. (2003) *Food Chem. Toxicol.* 41(1):95–98 — https://pubmed.ncbi.nlm.nih.gov/12453733/
10. Castellanos-Carrizal, C. et al. (2026) *J. Public Health Manag. Pract.* 32(2):268–275 — https://pubmed.ncbi.nlm.nih.gov/41576409/
11. Badarou, A.S.-D. et al. (2025) *Curr. Res. Nutr. Food Sci.* 13(3):1079–1105 — https://www.foodandnutritionjournal.org/download/24945
12. Commission Regulation (EU) No 10/2011, Article 12 — https://www.legislation.gov.uk/eur/2011/10/article/12/data.xht?wrap=true
13. 21 CFR 177.1520 Olefin polymers — https://www.law.cornell.edu/cfr/text/21/177.1520
14. Mrkić, S., Galić, K. & Ivanković, M. (2007) *J. Plast. Film Sheeting* 23(3):239–256 — https://journals.sagepub.com/doi/10.1177/8756087907086102
15. Norton, F.J. (1961) *Nature* 191:701 — https://www.nature.com/articles/191701a0 (tabulated values via https://etd.ohiolink.edu/acprod/odb_etd/ws/send_file/send?accession=osu1754387730186966&disposition=inline)
