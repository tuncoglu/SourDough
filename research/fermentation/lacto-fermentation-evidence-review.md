# Substrate and Process Drivers of Vegetable Lactic Acid Fermentation
### An evidence review to validate a consumer calculator's timing model

**Scope.** Eight questions on how the vegetable (substrate) and the process (inoculation,
preparation, vessel) change the rate and success of lactic acid fermentation, with concrete
numbers and citations. Focus throughout on: *is this effect big enough to model, or is it
second-order noise?*

**What the calculator currently does** (from `SourDoughMobile/src/lib/lactoCalculations.ts`
and `src/data/vegetables.ts`):

```
days = typicalDays × temperatureFactor × saltFactor × waterFactor × vegFactor
temperatureFactor = Q10^((22 − T)/10),  Q10 = 2.5
saltFactor        = (saltPct / typicalSaltPct)^1.0, clamped 0.6–2.0
waterFactor       = 1 + 0.0004 × (hardness − 120), clamped 0.9–1.1
vegFactor         = 1 / vegSpeedRatio    (opaque per-vegetable constant, cabbage = 1.0)
pH anchors: start 6.5, target 4.0, safety 4.6, final 3.5; pH-shape exponent 1.7
Not modelled: inoculation, particle size, headspace/O2, batch size, added sugar, buffering
```

**Headline verdict.**

0. **The per-vegetable `speedFactor` values are unsourced and two are contradicted by
   measurement.** They trace to a non-peer-reviewed recipe blog (`sourchad.com`) that
   misattributes PMIDs; its own pages contradict the ratios; and direct measurement shows
   **cauliflower reaches pH < 4.0 in 2 days** (rated 0.9, "slow") while **beetroot takes 96 h to
   reach pH 4.00** (rated 1.8, "fast"). Napa cabbage at 1.6× is unresolvable — two studies
   disagree by ~3×. Peppers are slow because of **8–10 % brine salt**, not capsaicin. See §1.5.
1. **Three first-order factors are missing entirely.** In order of effect size:
   **particle size / tissue disruption** (shredded vs whole cabbage = 15 vs 28 days;
   2 mm shred vs whole leaf = ~5 vs ~13 days to 8 log LAB), **buffering capacity** (acid demand
   spans 57.6 → 210 mM across vegetables; it sets an *achievable pH floor*, not just a rate), and
   **inoculation** (a defined starter takes shredded cabbage to pH 4.0 in <24 h vs 3 days, and
   saves ~14 days on whole heads).
2. **Temperature — the coefficient is fine, the *shape* is wrong at both ends.** Q10 = 2.5 sits
   inside the 95 % CI of the best direct measurement of lactic-acid production rate
   (2.64 [2.30–3.04]). Keep it over 15–30 °C, but flatten it above 30 °C (Ratkowsky gives 1.46),
   steepen it below 15 °C, and add a **hard floor at ≤5 °C** — at 0 °C kimchi shows no
   exponential phase for 14 days. The missing floor is the model's biggest temperature defect.
3. **Salt is the factor with the wrong *sign*.** Over 1.5–2.5 % the rate response is flat;
   below ~1.5 % the fermentation is *slower* and far more spoilage-prone; the break point to
   real inhibition is between 2.25 % and 3.5 %. The current monotonic `(salt/typical)^1` term
   says the opposite over the range users actually operate in.
4. **Oxygen, vessel and batch size are spoilage variables, not rate variables** — with two
   exceptions worth a low-priority nod: a controlled same-size test found **~25 %** from vessel
   material alone, and vessel *closure* produces a ~0.5 pH-unit gap at day 3.
5. **Spices are second-order — except clove, which is a genuine failure mode** (2 % clove powder
   cut kimchi LAB by 5.4 log while leaving yeasts and moulds untouched). Recipe-level dried
   spices deliver 1–125 ppm against LAB MICs of 1,000–2,100 ppm, so they cannot stall a ferment.
6. **Backslopping with mature brine should be a *warning*, not a speed-up** — 80 % v/v reused
   brine bought only +5–11 % in rate constant, and FAO states mature brine gives poor quality by
   suppressing the fast *Leuconostoc* initiator.
7. **The dominant uncertainty is the vegetable, not the process.** Measured sugar in broccoli
   was 14× the USDA reference value *within one harvest*, and green pea 2.9×. Cabbage's
   fermentable sugar has two ARS HPLC measurements that disagree by ~1.5× (**2.8–3.96** vs **4.9** g/100 g). Napa cabbage
   swings 2–3× between spring and autumn. The point estimate should be treated as the label on
   the range, not the answer.

---

## 1. Fermentable sugar / carbohydrate content as the driver of acidification rate

### 1.1 The stoichiometry sets an upper bound, not a rate

| Quantity | Value | Source | Confidence |
|---|---|---|---|
| Homofermentative yield | 1 mol glucose (180.2 g) → 2 mol lactic acid (180.2 g) = **1.00 g lactic acid per g hexose** | [FAO, *Fermented Fruits and Vegetables: A Global Perspective*, Ch. 5](https://www.fao.org/4/x0560e/x0560e10.htm) | Strong (textbook biochemistry) |
| Heterofermentative yield | 1 mol glucose → 1 mol lactic acid + 1 mol ethanol + 1 mol CO2 = **0.50 g lactic acid per g hexose** (plus acetate under some conditions) | FAO Ch. 5 | Strong |
| Working number for a mixed wild fermentation | **≈0.6–0.8 g lactic acid per g sugar consumed** | Derived; FAO states heterofermenters give "about 50 % lactic acid plus 25 % acetic acid and ethyl alcohol and 25 % carbon dioxide" | Moderate |

### 1.2 Measured sugar content of fermentation vegetables

Best single primary source: **Little, Cruz-Martínez, … Pérez-Díaz (2022), *J. Food Sci.*
87:2121–2132**, [USDA-ARS PDF](https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p447.pdf),
which measured glucose, fructose and sucrose enzymatically in fresh tissue *and* compared to
the USDA reference values. Converting their mM to g/100 g fresh weight (`mM × MW / 10 000`):

| Vegetable | Measured sugars, this study (g/100 g FW) | USDA-reference-derived (g/100 g) | Discrepancy |
|---|---|---|---|
| Green bell pepper | 2.71 | 2.47 | −10 % |
| Green bean | 1.81 | 3.14 | +73 % |
| Red ripe tomato | 3.63 | 3.30 | −9 % |
| Green pea | 0.95 | 2.75 | **+189 %** |
| Broccoli | **0.10** | 1.41 | **+1310 %** |
| Green leaf lettuce | 1.24 | 0.78 | −37 % |
| Orange sweet potato | 3.78 | 4.38 | +16 % |
| Sweet yellow corn | 2.66 | 6.25 | **+135 %** |

**Finding 1.2a — lot-to-lot and variety-to-variety sugar variation is 2–10×, and it is
larger than most of the between-vegetable differences the calculator encodes.** The authors
state plainly that "sugar content varies within vegetable type… related to variety,
physiological stage, and sources". *Confidence: strong* (measured, triplicate lots, direct
comparison against the reference database). **Modelling consequence: any per-vegetable
constant carries an irreducible ±50–100 % uncertainty from the lot alone.** This is the
single best argument for representing vegetable speed as a *range* rather than a point value.

Note also that USDA FoodData Central "total sugars" for cabbage (≈3.2 g/100 g) is a
*reference* figure, not a measured one for the user's cabbage.

### 1.3 Sugar is NOT generally the rate-limiting substrate for typical vegetables

**This is the most important correction to the naive model.**

**Andersson, Daeschel & Eriksson (1988), "Controlled Lactic Acid Fermentation of Vegetables"**,
8th Int. Biotechnol. Symposium, Paris, pp. 855–871 — [USDA-ARS Pickle Pubs p210](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf), p. 862:

> "Glucose, fructose and sucrose are the primary plant carbohydrates that are fermented by the
> lactic acid bacteria. **More sugar than necessary is present in the vegetables to produce the
> acids required for preservation.** But in order to avoid secondary fermentations, it is
> important to ascertain that the lactic acid bacteria are able to ferment all sugar. Since the
> bacterial cultures may be inhibited by low pH and some vegetables contain as much as 10 %
> (w/w) of fermentable sugars, **additional buffering prolongs the activity** of the lactic acid
> bacteria, which in turn reduces the risk of secondary fermentations, e.g. by yeasts."

**Finding 1.3a — sugar supply exceeds acid demand by 3–7× in most vegetables.** Little et al.
(2022) quantified both sides directly: they titrated each vegetable slurry to pH 3.0 to measure
*acid demand*, and computed *acid supply* from the measured sugars assuming complete
homofermentation.

| Vegetable | Acid needed to reach pH 3.0 (mM) | Max lactic acid obtainable from intrinsic sugar (mM) | Supply / demand |
|---|---|---|---|
| Green leaf lettuce | 135 ± 15 | 86 | **0.64×** (cannot complete) |
| Broccoli | 173 ± 13 | 157 | **0.91×** (marginal) |
| Green bell pepper | 64.8 ± 3.0 | 276 | 4.3× |
| Red ripe tomato | 65.0 ± 3.0 | 366 | 5.6× |
| Green bean | 57.6 ± 1.5 | 351 | 6.1× |
| Orange sweet potato | 72.3 ± 2.0 | 502 | 6.9× |
| Sweet yellow corn | 210 ± 14 | 700 | 3.3× |

*Source: Little et al. 2022, Table 2. Confidence: strong for the titration numbers (n = 3 lots);
moderate for the "supply" column, which assumes complete homofermentation — the authors note a
heterofermentative yield would be half.*

**Interpretation.** The supply:demand ratio spans an order of magnitude (0.64× to 6.9×). A
ratio near or below 1 means the fermentation **cannot reach full acidity at all** (lettuce,
broccoli) — a *ceiling* problem. A ratio of 5–7 means sugar is abundant and something else
(buffering, pH inhibition, species succession, tissue structure) sets the pace. **Sugar content
therefore behaves as a threshold/gate — is there enough to finish? — far more than as a
proportional rate multiplier.**

### 1.4 Does 2× the sugar give 2× the speed? No — the relationship saturates and then inverts

- **Saturation.** In a cucumber brine at 20° salometer, brine sugar peaked at ~1.2 g/100 mL on
  day 5 and then *fell* to near zero by day 21, while titratable acidity plateaued at ≈0.8 %
  from day 7 onward — i.e. the sugar was not the limiter after roughly day 7.
  *Jones & Etchells (1943), "Physical and Chemical Changes in Cucumber Fermentation",
  Food Industries, Jan. 1943; reprinted as [USDA-ARS Pickle Pubs p19](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p19.pdf). Confidence: moderate
  (single 45-gal cask trial, but replicated across three salt schedules; the paper is a
  foundational ARS primary source).*
- **Inversion.** Vegetables with *excess* sugar relative to buffer reach the LAB-inhibitory
  pH before the sugar is consumed and then stall: Little et al. found sweet potato, sweet corn
  and green bean fermentations "incomplete" with residual sugar, ending at pH 3.1 ± 0.2.
  *Confidence: moderate* (their brines were pre-acidified with vinegar to pH 4.70, so the
  trajectory is not a natural wild fermentation).

**Finding 1.4a — sugar content is a gate, and only weakly a rate.** Once a vegetable clears
roughly 1.5–2 g/100 g of fermentable sugar it has ample substrate; beyond that the rate is set
by buffering, species, temperature and tissue structure, not by how much sugar is present.
*Confidence: moderate* (mechanistically well supported, but no single study has regressed
time-to-pH on sugar across many vegetables).

### 1.4b Cabbage specifically: **two ARS HPLC datasets disagree by ~1.5×** — treat the value as a range

Two USDA-ARS HPLC measurements of fermentable sugars in *fresh* cabbage exist and they do **not**
agree. This is a genuine, unresolved conflict and the honest answer is a range, not a point value.

| Dataset | Material | Glucose | Fructose | Sucrose | **Total** |
|---|---|---|---|---|---|
| **Fleming & McFeeters (1985)**, 1984 Sauerkraut Seminar, NY State Agric. Exp. Sta. Special Report 56:25–29 — [ARS p182](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p182.pdf) | Fresh **market** cabbage | 2.3 % | 2.3 % | 0.3 % | **4.9 g/100 g** |
| **Plengvidhya, Breidt, Lu & Fleming**, *Appl. Environ. Microbiol.*, [PMC2168044](https://pmc.ncbi.nlm.nih.gov/articles/PMC2168044/) | Commercial Wisconsin plant, **shredded**, 4 tanks over 2 years | 1.47–2.15 % | 1.33–1.64 % | 0–0.17 % | **2.80–3.96 g/100 g** |
| **USDA FoodData Central 169975** "Cabbage, raw" | — | 1.67 | 1.45 | 0.08 | **3.2 g/100 g** (derivation code `NC` = *calculated, not measured*) |
| **Pederson & Albury (1969)**, NY Agr. Exp. Sta. Bull. 824 (secondary citation) | — | — | — | — | **2.9–8.7 %** |
| **Hughes & Lindsay (1985)**, *J. Food Sci.* 50(6):1662–1667, doi:[10.1111/j.1365-2621.1985.tb10560.x](https://doi.org/10.1111/j.1365-2621.1985.tb10560.x) | Across cabbage cultivars | — | — | — | **6.3–9.4 %** (paywalled; not obtained) |

**Finding 1.4b — a defensible working figure for cabbage is ~3–5 g/100 g of fermentable sugar,
with the ARS measurements bracketing 2.8–4.9.** The Plengvidhya dataset *corroborates* FDC's
3.2 g; the Fleming & McFeeters figure is ~1.5× higher; the classic literature cites up to 9.4 %.
*Confidence: strong that the disagreement is real; moderate for any single value.* **Practical
consequence: do not build a rate model on cabbage sugar content to better than ±50 %.**

**Data-quality caveat that applies to the whole catalogue:** in the FDC SR Legacy release, only
**18 of 92** raw produce rows carry an analytically measured total-sugars value. Cabbage's 3.2 g
is derivation `NC` (*calculated* — though its individual glucose 1.67 / fructose 1.45 / sucrose
0.08 are analytical `JA` and do sum to 3.21); garlic's 1.00 g is `T` (*taken from another
source*); daikon 2.50 g is `T`; beetroot 6.76 g is `O` (*imputed*); jalapeño 5.10 g is `BFSN`
(*calculated from a similar food*); **napa cabbage 1.41 g is `BFSN` too**; and **FDC assumes
zero sugar for canned ripe olives** (`Z`, "assumed zero") — which is plainly wrong for a fruit.
Separately, **USDA Agriculture Handbook No. 8 reports no sugar values at all** (verified directly
via HathiTrust full view); its "carbohydrate" is a by-difference residue that *includes crude
fiber*, so it cannot be used as a fermentable-sugar figure either. *Confidence: strong.*
**Do not treat FDC "total sugars" as measured data for vegetables, and do not use napa's 1.41 g
as a substrate figure.**

**Speciation (Fleming, McFeeters & Humphries 1988, reproduced as Table 2 in Fleming 1987,
"Considerations for the controlled fermentation and storage of sauerkraut",
[ARS Pickle Pubs p201](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf)):**

| Tissue | Sucrose | Glucose | Fructose | Malic acid | Total sugars |
|---|---|---|---|---|---|
| Leaves | 7.0 mM (0.25 %) | 132.5 mM (2.38 %) | 114.2 mM (2.05 %) | 12.2 mM | **4.68 %** |
| Core | 53.1 mM (1.91 %) | 75.7 mM (1.36 %) | 60.3 mM (1.08 %) | — | **4.35 %** |

The core is only ~23 % of cabbage weight, so whole-cabbage sucrose is low (~0.44 %) — i.e.
**trimming versus including the core materially changes the sugar *profile*, though not the
total much.**

**Real sauerkraut endpoints (Fleming & McFeeters 1985, Tables 1 and 3):** raw sauerkraut
**pH 3.2–3.4 with titratable acidity 2.1–3.3 %**; finished commercial product titratable acidity
**0.93–2.75 %** (9.3–27.5 g lactic acid per kg), with residual fermentable sugars
**0.00–1.89 %** and several products at exactly 0.00. (APHA *Compendium* Ch. 51 Table 51.1 gives
the same pH band, 1.5–2.5 % lactic acidity, and **residual sugar 0–0.05 % glucose** for finished
sauerkraut — residual values must not be confused with raw cabbage sugar.)

### 1.4c The direct sugar → endpoint relationship, measured in napa cabbage

**Shim, Kim & Kyung (1990), *Korean J. Food Sci. Technol.* 22(3):278–284** — the best quantitative
sugar-to-acidity relationship for any fermentation vegetable:

- Spring-sown napa cabbage: **1.20–3.40 °Brix**; autumn-sown: **3.8–6.6 °Brix**. **Season
  outweighs variety** — a 2–3× swing in substrate.
- **Final titratable acidity is directly proportional to soluble solids: TA = 0.30·x + 0.078**
  (x = °Brix).
- The relationship implies napa needs **≈2.6 °Brix minimum** or it physically cannot
  over-acidify in prolonged storage.

*Confidence: moderate — Korean-language, 1990, abstract-only retrieval, n not stated. But it is
the only direct sugar→final-acidity regression found, and it independently supports the
"supply vs demand" framing of §1.3.*

### 1.4d Sugar is not merely non-limiting — its concentration in the brine *rises* while pH falls fastest

**Fleming (1987), [ARS p201](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf)**,
controlled fermentor, Figs 3–4: during the gaseous phase (days 0–8), **glucose in the brine
*increased* from 35 to 76 mM while the pH fell from 6.2 to 4.4.** Acid production was "relatively
rapid during the gaseous stage, slowed at about 8 days, and then increased again."

**Finding 1.4d — the fastest part of a sauerkraut fermentation happens while the brine sugar
concentration is still rising.** The early rate is set by microbial growth and species
succession, not by sugar availability. *Confidence: strong (replicated lab fermentor).* This is
the cleanest single piece of evidence that sugar content cannot be a proportional rate term.

### 1.4e The measured carbon split — do not assume 1 g sugar → 1 g lactic acid

Homofermentative stoichiometry gives 1.00 g lactic acid per g hexose; heterofermentative gives
0.50 (plus ethanol and CO₂). **In a real sauerkraut fermentation, roughly 50–70 % of fermented
sugar ends up as lactic acid.** Fleming (1987, p201) day-60 carbon balance: lactic acid ~250 mM,
**mannitol ~100 mM**, acetic acid ~90 mM, ethanol ~60 mM. In cucumbers under controlled
anaerobic conditions the split is much cleaner: "**lactic acid accounting for 95 % of the cucumber
sugars fermented**" (Fleming, McFeeters, Daeschel, Humphries & Thompson 1988, *J. Food Sci.*
53(1):127–133, doi:[10.1111/j.1365-2621.1988.tb10192.x](https://doi.org/10.1111/j.1365-2621.1988.tb10192.x)).
Green bean fructose is "nearly quantitatively reduced to mannitol with a concomitant accumulation
of acetic acid" (Chen, McFeeters & Fleming 1983, *J. Food Sci.* 48(3):967–971,
doi:[10.1111/j.1365-2621.1983.tb14942.x](https://doi.org/10.1111/j.1365-2621.1983.tb14942.x)).
*Confidence: strong for the cucumber figure; moderate-to-strong for the sauerkraut split (read
from plotted curves, ±10 %).*

### 1.5 What this means for the per-vegetable speed factors — **they are unsourced, and two of them are contradicted by measurement**

**This is the most actionable finding in the review.**

**Provenance.** The per-vegetable `speedFactor` ratios (napa 1.6, beetroot 1.8, cauliflower 0.9,
green beans 0.8, jalapeño 1.2) **trace to a non-peer-reviewed recipe blog, `sourchad.com`**,
which does not itself state them as a table — and which **misattributes PMIDs**. Worked example:
the site cites **PMID 38144756** (Choi et al. 2023, on ingredient *size* in radish kimchi — see
§2.2) for the claim "glucose content was directly predictive of pH decline rate". That paper
tested cube size, not sugar predictiveness, and does not support the claim. **The ratios are not
derivable from any study: no research measures time-to-target-pH for these six vegetables under a
common protocol, so the normalisation the claim requires does not exist.** Full audit trail:
`fermentation-rate-report.md` in this workspace.

**The source's own pages contradict the ratios.** The blog's napa page implies ~2.8–3.5× (not
1.6×), and its vegetable guide lists beets at 7–14 days versus cauliflower at 5–10 days — i.e.
**cauliflower *faster* than beetroot**, the inverse of the app's 0.9 vs 1.8.

**Two of the ratios are directly contradicted by measurement:**

| Vegetable | App `speedFactor` | Measured | Verdict |
|---|---|---|---|
| **Cauliflower** | 0.9 ("slow") | Reached **pH < 4.0 in 2 days and pH 3.60 in 3 days** at 25–30 °C in 5 % NaCl (Qinghang et al. 2023, *Curr. Res. Food Sci.* 6:100493, [PMC10070088](https://pmc.ncbi.nlm.nih.gov/articles/PMC10070088/)) | **Contradicted — cauliflower is fast** |
| **Beetroot** | 1.8 ("fast") | Took **96 h to reach pH 4.00** (Duyar, Sari & Karaoglan 2024, *Heliyon* 10(9):e30448, doi:[10.1016/j.heliyon.2024.e30448](https://doi.org/10.1016/j.heliyon.2024.e30448), [PMC11088329](https://pmc.ncbi.nlm.nih.gov/articles/PMC11088329/)) | **Contradicted — beetroot is not notably fast** |
| Napa cabbage | 1.6 | **Unresolvable from the literature.** Kim et al. (2025) put kimchi at pH 4.36 on day 3 / 3.89 on day 14 at 15 °C; Jung et al. (2024) put commercial kimchi at pH 4.07 on day 7 at 15 °C — i.e. *equal to sauerkraut*. The two disagree by ~3× | **Unresolvable — do not present as a point value** |
| Jalapeño / peppers | 1.2 | Sugar does **not** explain the ordering (jalapeño 4.12 g/100 g vs green cabbage 3.20). Real pepper brines are slow because they are **8–10 % NaCl**, not because of capsaicin — Huang et al. (2025), *Food Chem. X* 26:102551, [PMC12148400](https://pmc.ncbi.nlm.nih.gov/articles/PMC12148400/), used 9 % NaCl + 2.5 % sugar at 25 °C and pH only stabilised at 3.31–3.38 by **day 66–77** | **Wrong mechanism — it is salt, not the pepper** |
| Broccoli | 0.9 | Measured sugar 0.10 g/100 g, acid demand 173 mM, supply/demand **0.91×** — the most marginal vegetable in the Little et al. set | Plausibly too fast, but note the cauliflower counter-example above |
| Green beans | 0.8 | Acid demand **lowest of the eight** (57.6 mM) — easiest to acidify | Plausibly too slow |

**Finding 1.5a — the per-vegetable speed factors should be treated as unvalidated placeholders,
not as data.** Two are contradicted by direct measurement, one is unresolvable, and one encodes
the wrong mechanism. *Confidence: strong for the provenance and for the cauliflower/beetroot
contradictions; strong that the required normalisation study does not exist.*

**Finding 1.5b — the sugar data do not support a proportional speed factor in any case.** Apples
(10–14 g/100 g sugar) are rated 1.3; cabbage (4.9 g/100 g measured) is rated 1.0. If sugar drove
the rate, apples would be 2–3×. And cauliflower has the *least* sugar of the six vegetables
(1.91 g/100 g) yet acidifies fast. *Confidence: strong.* **Recommendation: retire the
speedFactor as a data claim; keep it only as a UI-level heuristic, or re-derive it from
`bufferCapacity × fermentableSugar` (§7).**

**Source-integrity warnings carried forward** (documented in the companion reports rather than
propagated here): three peer-reviewed sources contain internal numerical contradictions — Jung
et al. 2024 (*Heliyon* 10(6):e27174) has organic-acid units ~1000× too low and a week-1 acidity
sentence stating week-0 values; Duyar et al. 2024 (*Heliyon* 10(9):e30448) has a spontaneous-arm
regression coefficient impossible against its own endpoint; and a 2018 MDPI kimchi paper's stated
pH conclusion contradicts its own numbers.

---

## 2. Particle size / pretreatment — **a first-order factor the model omits**

### 2.1 Whole vs shredded cabbage: a 1.9× difference in fermentation time

**Niksic, Niebuhr, Dickson, Mendonca, Koziczkowski & Ellingson (2005), "Survival of *Listeria
monocytogenes* and *Escherichia coli* O157:H7 during sauerkraut fermentation", *J. Food Prot.*
68:1367–1374**, doi:[10.4315/0362-028X-68.7.1367](https://doi.org/10.4315/0362-028X-68.7.1367):

- Shredded cabbage: fermentation complete at **15 days**.
- Whole-head cabbage: fermentation complete at **28 days** — **1.87× longer**.
- Final pH was *lower* in whole-head kraut but titratable acidity was *significantly higher* in
  shredded kraut (the shredded ferment produced more total acid, faster).
- Crucially: "within cabbage type, **neither salt nor fermentation temperature had significant
  effects**" (salt 1.8 / 2.25 / 3 %; temperature 18 / 22 °C).

*Confidence: strong for the shredded-vs-whole ratio (designed factorial, two processing types,
two temperatures, three salt levels). The "no salt/temperature effect" result is strong within
this study but conflicts with the wider literature (see §5 and §8) and should be treated as
"the effect is smaller than commonly assumed over these ranges", not "zero".*

### 2.1b The cleanest controlled experiment: 2 mm shreds vs whole leaves, 160 jars

**Valence et al. (2025), *Peer Community Journal* 5:e49 (INRAE)**,
doi:[10.24072/pcjournal.553](https://doi.org/10.24072/pcjournal.553) — open access:

- Design: white cabbage, **shredded to 2 mm** vs **6 × 8 cm leaf pieces**, brined, 19 °C, **160 jars**.
- LAB reached 8 log CFU/g in **~5 days (shredded)** vs **~13 days (leaf)** — **8 days, ≈2.6×**.
- pH differed by **0.47 units at 86 h**.
- Enterobacteriaceae were undetectable at 14 days in shredded cabbage but **still present at one
  month** (*Hafnia alvei*) in the leaf ferment.
- Cut surface area was **~26× greater** in the shredded treatment.

*Confidence: strong — this is the best-controlled particle-size experiment in the literature
(160 jars, one cabbage lot, one temperature) and it isolates cut form as the only variable.*

### 2.2 Cube size in radish kimchi: effect concentrated in the first 5 days

**Choi, Park, Kim, Seo, Whon & Son (2023), "Effects of ingredient size on microbial communities
and metabolites of radish kimchi", *Food Chemistry: X* 20:100950**,
doi:[10.1016/j.fochx.2023.100950](https://doi.org/10.1016/j.fochx.2023.100950) (open access,
[PMC10739756](https://pmc.ncbi.nlm.nih.gov/articles/PMC10739756/)):

- Design: radish cubes **1×1×1, 2×2×2, 3×3×3 cm**; 20 °C for 6 h then 4 °C for 50 days; n = 5.
- Small cubes: highest glucose early, highest LAB relative abundance at day 5, fastest pH fall
  and fastest titratable-acidity rise. Doubling the cube edge doubles surface area per unit
  volume **halved** (2 cm vs 3 cm = 1.5× S/V; 1 cm vs 3 cm = **3× S/V**).
- The authors state the size effect is "most notably during the first 5 days of fermentation",
  and that by day 50 all three groups had converged.
*Confidence: strong for the direction and for the "early phase only" qualifier (n = 5,
  full 16S + metabolomics); moderate for the magnitude, which is given graphically rather than
  as a single ratio.*

**Supporting kimchi datum — cut *style*, not just cut *size*.** Moon et al. (2019), *J. Korean
Soc. Food Culture* 34(2):217 (World Institute of Kimchi): 3 × 3 cm "mat" (whole-leaf) vs
"pogi" (2-cut) cabbage kimchi at 6 °C — LAB peak **9.09 vs 8.08 log CFU/g** (≈10×), week-2
titratable acidity **0.91 % vs 0.73 %** (+25 %), headspace CO₂ **8.5 % vs 6.2 %**; the two
converged by weeks 5–6. *Confidence: strong for the rate difference; moderate for the
generalisability (one cultivar, one temperature).*

### 2.2b Whole cucumbers: the 18–24 h inoculation delay, and a real salt threshold

**Fleming, Thompson, Bell & Hontz (1978), *J. Food Sci.* 43(3):888** —
[USDA-ARS Pickle Pubs p136](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p136.pdf)
(scanned; read from page images):

- Whole cucumbers require an **18–24 h delay before starter inoculation** because salt and sugar
  must diffuse first. **Sliced cucumbers can be inoculated immediately**, reached 0.2–0.5 % acid
  within 24 h and were >80 % complete in 6 days.
- **But**: "the time for complete fermentation did not differ greatly between slices and whole
  cucumbers." Cutting removes the *lag*, not the total duration, for cucumbers.
- Salt: up to **3.9 % NaCl does not slow the rate; 6.5 % does** — an independent confirmation of
  the flat salt response below ~4 % (§5.5).
- Blanching (77 °C / 3.5 min) cost ~0.18 % of fresh weight in sugar and cut final acidity to
  **0.76–0.88 % vs 1.14–1.30 %** in unblanched controls, while raising firmness from 3.1 to 7.9.

*Confidence: strong (designed ARS trials).*

### 2.3 The mechanism is confirmed at the tissue level — and it is diffusion, not just surface area

**Fleming and co-workers established that in *whole* vegetables the sugar must diffuse *out*
into the brine before LAB can use it, and that this diffusion is the rate-limiting step.**

- **Andersson, Daeschel & Eriksson (1988)** ([p210](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf), p. 861), summarising Fleming et al. (1980): "The fermentation is, to a large extent, dependent upon the diffusion of fermentable sugars from the cucumber out into the brine where the bacteria can ferment them. Bringing the bacteria into the cucumber by O2-exchange may enhance the fermentation rate, since **sugar diffusion may no longer be a rate-limiting step**." With O2-exchange, cucumbers reached "a fully cured appearance within a few days, as compared with **several months** for cucumbers not exposed to O2."
- **Passos, Felder, Fleming, McFeeters & Ollis (2005), "Dynamic model for mass transfer of solutes in cucumber fermentation", *J. Food Engineering* 68:297–302**, doi:[10.1016/j.jfoodeng.2004.06.002](https://doi.org/10.1016/j.jfoodeng.2004.06.002): solute exchange between whole cucumbers and brine is controlled by **mass transfer through the stomata**, and lactic-acid transport through stomata is **three orders of magnitude** faster than through the epidermis. Neither brine film diffusion nor epidermal diffusion was significant.

*Confidence: strong. Two independent ARS lines of work (gas-exchange experiments and a fitted
mass-transfer model) converge.*

### 2.4 Freezing / thawing, blanching, maceration, and other pretreatments

**Freezing/thawing is not an accelerator — and there is no study showing it is.**
I found **no peer-reviewed measurement** of freeze–thaw on time-to-target-pH for any
fermentation vegetable, and what evidence exists points the other way:
- Freeze–thaw costs **>2 log CFU/g of LAB** (Kim 2020, *Korean J. Food Eng.* 24(4):235).
- Drip loss of 28–52 %; pH and titratable acidity essentially flatline under frozen storage
  (Kang 2025, *Food Chem. X* 29:102610).
- Commercial kimchi freezing is used to **stop** fermentation, not start it.
*Confidence: strong that freezing is not a rate accelerator; strong that the specific
freeze-then-ferment time-to-pH experiment has not been done.*

**Blanching is a texture and safety tool, not a rate tool.**
- 75 °C / 30 s changed cucumber fermentation "little" (Lu 2002, [ARS p306](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p306.pdf)).
- 80 °C / 90 s gives ≥2 log kill with **no firmness loss**, and a consumer panel (n = 110) could
  not distinguish treated from untreated (LaFountain et al. 2022, *J. Food Sci.* 87(4):1475,
  [ARS p446](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p446.pdf)).
- Counter to folk belief, blanching at **55–65 °C makes cabbage 1.6× and Chinese cabbage 1.8×
  *firmer*** via pectin methylesterase activation (Ni et al. 2005, *J. Food Eng.* 70:546).
- **Blanching costs fermentable sugar**: 77 °C / 3.5 min removed ~0.18 % of fresh weight as sugar
  and cut final acidity to **0.76–0.88 % vs 1.14–1.30 %** (Fleming et al. 1978, §2.2b).
*Confidence: strong.* **Verdict: blanching is a boolean, not a multiplier — it kills the native
culture, so it only works if you inoculate (§3).**

**Maceration / extreme pretreatments.**
- **Lye treatment of olives is a large *negative* lever.** Industrial Spanish-style processing
  (1.3–2.6 % NaOH, 8–14 h, then 9–10 % brine) strips sugars — fruit glucose down 96 % — and after
  60–120 days the brine pH only moved from **5.04 to 4.27**; many batches **never reach pH 4.0**
  (*Front. Microbiol.* 12:729436, [PMC8600317](https://pmc.ncbi.nlm.nih.gov/articles/PMC8600317/)).
  *Confidence: strong.*
- **Pepper mash is slow but not stalled**: ground Tabasco + 8 % salt reaches pH 3.7–3.9 and
  ~1.6 % titratable acidity within **one month**, then stays flat for 23 more months (Koh 2005,
  LSU thesis 1447). No unground control was ever run, so the mash-vs-brine comparison the app
  encodes as `MASH_SLOWDOWN = 2.2` is **not independently supported**. *Confidence: weak.*
- **Pricking/puncturing: no study exists.** The nearest proxy is that *peeling* cucumbers raised
  solute-equilibration rate constants by **3.7–11.1×** (Potts et al. 1986, *J. Food Sci.*
  51:434, [ARS](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/)). *Confidence:
  weak for pricking specifically; moderate for the peeling proxy.*

### 2.5 Verdict on §2

**Particle size is the largest omitted factor, and the effect is measured in *days*, not
percentages:**

| Comparison | Time difference | Source | Confidence |
|---|---|---|---|
| Shredded 2 mm vs 6×8 cm leaf, cabbage, 19 °C | **~5 d vs ~13 d to 8 log LAB (≈2.6×)**; 0.47 pH units apart at 86 h | Valence et al. 2025 | Strong |
| Shredded vs whole-head cabbage, 18/22 °C | **15 d vs 28 d (1.87×)** | Niksic et al. 2005 | Strong |
| Kimchi 3×3 cm whole-leaf vs 2-cut, 6 °C | **+1.0 log LAB, +25 % TA at week 2**; converged by week 5–6 | Moon et al. 2019 | Strong |
| Radish cubes 1 vs 2 vs 3 cm | Fastest pH fall in the 1 cm group; all differences gone by day 50 | Choi et al. 2023 | Strong (direction) |
| Whole vs sliced cucumber | Slicing removes an **18–24 h** pre-inoculation diffusion delay, but total fermentation time "did not differ greatly" | Fleming et al. 1978 | Strong |

**This belongs in the model**, as a multiplier on the vegetable term: shredded/grated 1.0,
thin-sliced 1.1–1.2, 2-cut/quarters 1.3–1.5, whole-leaf 1.6–2.0, whole intact vegetable 1.8–2.2,
with the honest caveat that whole-vegetable ferments are diffusion-limited and also need an
18–24 h brining head start before the interior even begins.

---

## 3. Inoculation / backslopping / starter cultures — **first-order, and the effect is large**

### 3.1 Head-to-head numbers

| Study | Design | Time to pH 4.0 | Saving |
|---|---|---|---|
| **Müller, Rösch, Cho, et al. (2018)**, *Food Microbiology* 76:473–480, doi:[10.1016/j.fm.2018.07.009](https://doi.org/10.1016/j.fm.2018.07.009) | Sauerkraut, 1.0 % salt. Starter = *L. plantarum* + *Leuconostoc mesenteroides* at ~1×10⁷ CFU/mL vs spontaneous | **< 24 h with starter; 3 days spontaneous** | **≈2 days saved; 3× faster** |
| Same study, LAB growth | Starter vs spontaneous | 10⁹ CFU/mL after **24 h** vs 10⁵ → 10⁹ over 3 days | ~3× |
| **Beganović, Pavunc, Gjuračić, et al. (2011)**, *J. Food Sci.* 76:M124–M129, doi:[10.1111/j.1752-3841.2010.02030.x](https://doi.org/10.1111/j.1752-3841.2010.02030.x) | **Whole cabbage heads** (not shredded). *L. plantarum* L4 + *L. mesenteroides* LMG 7954 vs spontaneous | Starter "considerably accelerated fermentation process **by 14 d**" and allowed salt to drop from 4.0 % to 2.5 % | **14 days saved** |
| **Sørensen, Madsen, Bang-Berthelsen & Hansen (2021)**, *Food Res. Int.* 150:110800, doi:[10.1016/j.foodres.2021.110800](https://doi.org/10.1016/j.foodres.2021.110800) | Seaweed (*Alaria esculenta*, *Saccharina latissima*) + *L. plantarum* starter vs natural microbiota | pH < 4.6 in **2 days** (*Alaria*) / **7 days** (*Saccharina*) with starter. **Spontaneous fermentation gave unsafe product, final pH 4.8–5.2, butyric acid, and *Listeria* survival** | 2–7 days vs **never** |
| **Sarvan et al. (2013)**, *Food Res. Int.* 54:706–710 | Blanched cabbage + *L. paracasei* vs blanched, uninoculated | **pH 4.12 after 71 h** vs **pH 6.10 — no fermentation** | ∞ |
| **Ren, Tao, Li, et al. (2026)**, *Foods* 15:485, doi:[10.3390/foods15030485](https://doi.org/10.3390/foods15030485) | Chinese sauerkraut + *Levilactobacillus brevis* JYX2 (lab and pilot scale) vs spontaneous | "significantly reduced fermentation duration, expedited pH decline, elevated total acid". Nitrite 0.72 vs 1.86 mg/kg | Directional; days not stated in abstract |
| **Zhao et al. (2026)**, *Microorganisms* 14(2):411, doi:[10.3390/microorganisms14020411](https://doi.org/10.3390/microorganisms14020411) ([PMC12943457](https://pmc.ncbi.nlm.nih.gov/articles/PMC12943457/)) — **the only study in the entire search that states a days-saved figure verbatim** | Three real vegetables, triplicate, inoculum 10⁶ CFU/g *L. mesenteroides* AA001; maturity = pH ≤ 4.0 **and** TA ≥ 6 g/kg **and** LAB ≥ 10⁹ CFU/g | Natural fermentation **9–14 days**; inoculated **4–7 days** | **5–7 days saved** |
| **Liu et al. (2024)**, *Foods* 13(23):3947, doi:[10.3390/foods13233947](https://doi.org/10.3390/foods13233947) | **15 commercial sauerkrauts** across starter-culture / additive / natural production methods | **"No significant difference in the physical or chemical indices among the groups"** — including pH and TA. Starter groups differed only in esters, alcohols and microbial diversity (and had fewer pathogens) | **None** |
| **Kim, Lee, Lee, Roh & Kim (2019)**, *J. Microbiology* 57:479–484, doi:[10.1007/s12275-019-9048-0](https://doi.org/10.1007/s12275-019-9048-0) | Kimchi + mixed *Lactococcus lactis* + *Leuconostoc citreum* starter **selected for shelf-life extension** | Starter **prolonged** time to pH 4.2 by **≈1.5×** vs control (12 d at 10 °C) | **−50 % (slower, deliberately)** |
| A 1968 Utah State thesis (cited in the companion report) | *L. plantarum*-inoculated sauerkraut | "slower in fermenting" than spontaneous | Negative — *weak* (thesis, not peer-reviewed) |

**Finding 3.1d — the size of the starter effect is strain- and system-dependent, and it is
contested at the level of *outcome* even where it is clear at the level of *kinetics*.** A
single well-run study gives 5–7 days; a 15-product commercial survey finds no endpoint
difference at all. The defensible claim is about the **lag phase**, not the endpoint: a starter
removes roughly 1–2 days of lag in a shredded vegetable and about a week in a whole one, after
which the two trajectories re-converge. *Confidence: strong for the lag reduction; strong that
the endpoint difference is small-to-absent in real products.*

**Finding 3.1e — there is no dose–response above ~10⁶ CFU/g.** Tripling the inoculum from 1 %
to 3 % (v/v) bought only **+5.5 % to +24.6 %** lactic acid, non-monotonically (Nguyen 2026,
*Food Sci. Nutr.*, [PMC13184175](https://pmc.ncbi.nlm.nih.gov/articles/PMC13184175/)). No study
varies backslopped-brine percentage against lag phase for any vegetable. *Confidence: strong.*
**Modelling consequence: treat inoculation as a step function (starter / no starter), not as a
dose.**

**Finding 3.1a — a defined starter culture cuts time-to-pH-4.0 in shredded cabbage from ~3 days
to <1 day, and in whole-head cabbage by ~14 days (≈50 %).** *Confidence: strong* — two
independent peer-reviewed studies, one of them on whole heads which is the harder case.

**Finding 3.1b — the starter's benefit is largest exactly where the model is weakest: whole
vegetables and low-sugar/high-buffer substrates.** Where the natural epiphytic LAB population
is thin or slow (whole heads, seaweed, blanched material), inoculation is the difference between
a 2-day and a 7-day (or never) fermentation. *Confidence: strong.*

**Finding 3.1c — starters are not automatically faster.** A starter chosen for
bacteriocin production or for slow acidification (a shelf-life-extension culture) can *slow*
the ferment by ~1.5×. "Starter" is not synonymous with "fast". *Confidence: moderate* (one
study, but the mechanism — bacteriocin-mediated inhibition of the native fast starters — is
well described in the ARS literature: Daeschel & Klaenhammer 1985; Daeschel et al. 1986, cited
in [p210](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf) p. 864).

### 3.2 Backslopping with a previous batch's brine: the evidence is *against* a rate benefit in sauerkraut

This is the most counter-intuitive finding in the review, and it matters because home fermenters
backsloop routinely.

**FAO, *Fermented Fruits and Vegetables: A Global Perspective*, Ch. 5**
([x0560e10.htm](https://www.fao.org/4/x0560e/x0560e10.htm)):

> "It is possible to use the juice from a previous kraut fermentation as a starter culture for
> subsequent fermentations. The efficacy of using old juice depends largely on the types of
> organisms present in the juice and its acidity. **If the starter juice has an acidity of 0.3 %
> or more, it results in a poor quality kraut.** This is because the cocci which would normally
> initiate fermentation are suppressed by the high acidity, leaving the bacilli with sole
> responsibility for fermentation. **If the starter juice has an acidity of 0.25 % or less, the
> kraut produced is normal, but there do not appear to be any beneficial effects of adding this
> juice.** Often, the use of old juice produces a sauerkraut which has a softer texture than
> normal."

**Finding 3.2a — backslopping mature brine (>0.3 % acidity, i.e. anything past ~day 3–5 of a
normal ferment) suppresses the *Leuconostoc mesenteroides* initiation phase.** Since
*L. mesenteroides* is the fast, gas-producing initiator, this predicts *slower* early
acidification and a less complete fermentation — the opposite of the intuitive expectation.
*Confidence: moderate-to-strong for the mechanism* (it follows directly from the well-established
succession and the acidity thresholds, and FAO states it as settled practice), *weak for a
specific day count* — I found **no controlled modern study** that measured time-to-pH for
backslopped vs spontaneous sauerkraut.

**But the only *quantitative* backslopping measurement is much more modest, and it is
industrial.** Zhang et al. (2022/23), *Foods* 12(1):101: industrial pickled chilli, **80 % (v/v)
reused brine** — the fermentation rate constant k rose only **+5 % (pool) / +11 % (jar)**
compared with fresh brine. In the *same study*, changing the **vessel** changed k by
**+59 % to +68 %** — an order of magnitude more than the inoculum. *Confidence: strong for the
measurement, moderate for generalisation (one product, industrial scale; the numbers were read
from the full text and should be spot-checked before being hard-coded).* **This is the single
best argument that inoculation-with-brine is not the lever people think it is.**

**There is also no peer-reviewed wild-vs-backslopped sauerkraut study at all** — multiple
query formulations across two independent searches returned nothing. The FAO text above is
practical guidance, not an experiment.

**And backslopping does not automatically skip the *Leuconostoc* phase.** Hu et al. (2024),
*J. Sci. Food Agric.* 104:8604: backslopped sauerkraut *without* vinegar stayed
*Leuconostoc*-dominated; only with vinegar did it shift to ~90 % *Lactiplantibacillus*. A
*Leuconostoc* starter actually *increased* *Leuconostoc*/*Weissella* abundance (Jung et al. 2012,
*Int. J. Food Microbiol.* 153:378). And *Leuconostoc* is the **fast** acidifier — 1 day to
pH 4.4 vs 2 days for *L. plantarum* (Seo et al. 2021, *Foods* 10:1435) — so the folk logic
"backsloop to skip ahead to the strong acid producers" is backwards. *Confidence: strong.*

**Andersson, Daeschel & Eriksson (1988)** place backslopping in the same category as any other
inoculation route and note the real limits of the whole idea ([p210](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf), pp. 863–864):

> "The lactic acid bacteria necessary for a spontaneous fermentation can be introduced from the
> plant raw material, processing equipment and **from the recycled fermented brine**. …
> Although early studies have been made of pure culture inoculation of cabbage, cucumbers and
> olives, **the commercial use of starter cultures is limited to the fermentation of cucumbers**.
> … the microbial process involved in the lactic acid fermentation of vegetables is too complex
> and poorly understood to allow its imitation in starter cultures."

### 3.3 Bacteriophage risk in backslopping and starter use

**Mudgal, Breidt, Lubkin & Sandeep (2006), "Quantifying the significance of phage attack on
starter cultures: a mechanistic model for population dynamics of phage and their hosts isolated
from fermenting sauerkraut", *Appl. Environ. Microbiol.* 72:3908–3915**,
doi:[10.1128/AEM.02429-05](https://doi.org/10.1128/AEM.02429-05) ([PMC1489654](https://pmc.ncbi.nlm.nih.gov/articles/PMC1489654/)):

- Phage infecting *Leuconostoc mesenteroides* are **naturally present in sauerkraut
  fermentations**.
- Phage-resistant sub-populations existed in the starter cultures and **replaced the
  phage-sensitive cells even at very low initial phage density (P₀ < 1×10³ PFU/mL,
  MOI < 10⁻⁴)**.

**Finding 3.3a — phage pressure is real and measurable but self-limiting: resistant mutants
take over, so the practical outcome is a *shift in strain composition*, not a failed ferment.**
The authors' own conclusion is that the model needs temperature and pH terms before it can be
applied to commercial fermentations. *Confidence: moderate* (validated in MRS broth, not in
sauerkraut; mechanistic model + experiments with two strains). **Modelling consequence: do not
model phage. Do not model backslopping as a speed-up either.**

### 3.4 Verdict on §3

| Practice | Effect on time | Worth modelling? |
|---|---|---|
| Commercial defined starter culture (LAB ≥10⁶–10⁷ CFU/mL) | **×0.3 to ×0.5** in shredded cabbage; **×0.5** in whole heads | **Yes — first order** |
| Backslop with brine from a previous batch | ≈×1.0, possibly ×1.1–1.2 *slower* and softer if the brine is mature (>0.3 % acidity) | Yes, but as a *warning*, not a speed-up |
| No inoculation (wild) | ×1.0 (reference) | — |

A defensible encoding: fold "starter culture used" into the recipe anchor as a ×0.35–0.5
duration multiplier for shredded vegetables, and either ignore backslopping or show a caution
when the user proposes re-using brine that has already soured.

---

## 4. Oxygen / headspace / vessel / stirring

### 4.1 The decisive experiment: aeration rate changes both rate and outcome

**Potts, E.A. & Fleming, H.P. (1979), "Changes in dissolved oxygen and microflora during
fermentation of aerated, brined cucumbers", *J. Food Sci.* 44(2):429–434** —
[USDA-ARS Pickle Pubs p138](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p138.pdf).
I verified these figures against the scanned original (p. 431).

Design: cucumbers, 5-gal pails, 20° salometer (≈5.3 % NaCl) brine, 50:50 pack-out, 23–28 °C,
purged continuously with **N₂** vs **air at 5 mL/min/gal** vs **air at 100 mL/min/gal**.

| Quantity | N₂ purge | Air, 5 mL/min/gal | Air, 100 mL/min/gal |
|---|---|---|---|
| pH at day 14 | **3.4** | 3.7 | **> 7.0 — all titratable acidity consumed and gone by day 6** |
| Titratable acidity (as lactic) at day 14 | 1.1 % | 0.7 % | 0 |
| LAB count | >10⁷/mL within **4 days** | <10⁴/mL at day 4 | <10³/mL even after 8 days |
| Yeast count | never exceeded 10²/mL | reached 10⁶/mL | reached ~10⁹/mL |
| Dissolved O₂ (% saturation) | — | 68 % by day 2 (peak 75 %) | **97 % by day 2** |
| O₂ uptake rate of brine | 0.85 % sat/min | 2.6 % sat/min | **38 % sat/min** |

*Confidence: strong — a designed, replicated, three-arm experiment in the USDA-ARS Food
Fermentation Laboratory, and I read the source table directly.*

**Caveat carried by the authors themselves:** the lab purge rates (≈106 and ≈2120 scfh
equivalent) are **higher** than the 20–50 scfh recommended for commercial 5,000–10,000 gal
tanks. So the 5 mL/min/gal arm is already several times normal commercial aeration. At realistic
low aeration the rate penalty is modest (**pH 3.7 vs 3.4 at day 14**, i.e. ~0.3 pH units, or
roughly half a day to a day to reach a given pH); at high aeration it is catastrophic (net acid
*consumption*).

### 4.1b The essential counterweight: in kimchi, oxygen changed spoilage but **not** the LAB rate

**Yu, Park, Kim, Choi & Min (2023), *J. Food Sci. Technol.* 60(10):2695–2703** (World Institute
of Kimchi), doi:[10.1007/s13197-023-05795-z](https://doi.org/10.1007/s13197-023-05795-z),
[PMC10439095](https://pmc.ncbi.nlm.nih.gov/articles/PMC10439095/) — open access:

Design: three packaging regimes, kimchi at 4–5 °C, **90 days, n = 3, full statistics**:
S1 = fully sealed; S2 = one-way valve (gas out only); S3 = gas in *and* out.

| Measure | S1 sealed | S2 one-way valve | S3 gas in and out |
|---|---|---|---|
| LAB counts | **Not significantly different across treatments** | — | — |
| pH at day 10 | ~4.16–4.25 (all three, essentially identical) | — | — |
| pH at day 30 → day 90 | 4.22 → **3.93** | → **4.03** | 4.22 → **4.39 (rose)** |
| Titratable acidity at day 90 | 1.19 % | 1.13 % | 0.95 % |
| Yeast/mould at day 10 | not detected | not detected | **5.21 log CFU/g, rising to 8.32** |
| Coliforms | not detected | not detected | **detected** |

**Finding 4.1b — this is the cleanest demonstration that oxygen exclusion is fundamentally a
*spoilage/ecology* control.** LAB growth and the initial pH drop were statistically
indistinguishable across all three regimes. What differed was that oxygen ingress let yeasts
and coliforms establish and then **consume the acid**, reversing the pH (+0.17 units) and
dropping titratable acidity by 20 %. *Confidence: strong for the design (n = 3, 90 days,
statistics); moderate as a guide to warm fermentation — this is 4–5 °C storage, not a 20 °C
ferment.*

**Finding 4.1c — the paradox resolved: LAB are not harmed by oxygen; they are out-competed in
it.** *Leuconostoc mesenteroides* grows **better** aerobically — Plihon, Taillandier &
Strehaiano (1995), *Appl. Microbiol. Biotechnol.* 43:117–122,
doi:[10.1007/BF00170632](https://doi.org/10.1007/BF00170632), found growth under N₂, air and
pure O₂, with oxygen consumption *improving* growth yield and specific growth rate (Yx/s up to
46.8 g/mol, µmax 0.69 h⁻¹). *Lactiplantibacillus plantarum* likewise "grew faster under aerobic
conditions" with **no significant difference in lactic acid production** (Smetanková et al.
2012, *Acta Chimica Slovaca* 5(2):204–210,
doi:[10.2478/v10188-012-0031-1](https://doi.org/10.2478/v10188-012-0031-1)). *Confidence:
moderate-to-strong; note the literature is contested — Fu & Mathews (1999) report the opposite
for lactic acid yield.* **So the reason to exclude oxygen is not that LAB need anaerobiosis;
it is that oxygen feeds the competitors ~1000× more effectively than it feeds the LAB (Potts &
Fleming: LAB suppressed to <10⁴/mL while yeast rose to 10⁶–10⁹/mL) and that oxidative yeasts
and moulds *consume* the acid the LAB produce.**

### 4.2 Is oxygen exclusion a rate effect or a spoilage effect?

Both — but the ARS framing is ecological, and the rate effect is dose-dependent.

**Andersson, Daeschel & Eriksson (1988)**, [p210](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf), p. 861:

> "**In most, if not all, lactic acid fermentations of vegetables, it is necessary to exclude
> oxygen to provide anaerobiosis. This will inhibit the growth of aerobic spoilage
> microorganisms, such as bacteria, molds and oxidative yeasts, and stimulate the activity of
> the lactic bacterial flora.** From a practical point of view, anaerobiosis can be
> self-achieved via the respiratory action of the vegetables and the indigenous microbial flora.
> Regarding shredded and sliced vegetables, oxygen can be removed by carefully pressing the
> vegetables in the fermentation vessel. Cucumbers can be purged using either air or N₂.
> A continuous flushing of CO₂ or N₂ has also been successfully used… **It is well documented
> that CO₂ stimulates the growth of lactic acid bacteria but inhibits most of the Gram negative
> bacteria.**"

**Finding 4.2a — the *stated* rationale for anaerobiosis is spoilage/ecology control
(and the CO₂ atmosphere), not faster acidification. But Potts & Fleming (1979) shows the rate
effect is real and grows with aeration.** At realistic home-vessel aeration the rate penalty is
small (§4.1 caveat); the *spoilage* penalty (yeast 10² → 10⁶–10⁹/mL) is enormous.
*Confidence: strong.*

**Finding 4.2b — dissolved O₂ in a real commercial tank is a *gradient*, not a number.**
Commercial cucumber tanks run at 20–75 % of O₂ saturation, highest (50–75 %) at the side-arm
outlet ~6 in below the brine surface and lowest (20–45 %) ~5 ft beneath it
(Andersson et al. 1988, same review). *Confidence: moderate.* **Consequence for modelling:**
surface-area-to-volume ratio matters, but it is a spoilage/safety variable, not a clean rate
multiplier.

### 4.3 Headspace and vessel configuration

**Concrete headspace guidance does exist, and the sources disagree by an inch:**

| Source | Recommendation |
|---|---|
| USDA *Complete Guide to Home Canning* (2015 rev., AIB-539), Guide 6, p. 6-7 | Crock "deep enough so that its rim is at least **4 or 5 inches** above the cabbage" = **10–13 cm** |
| Oregon State Extension PNW 355, *Pickling Vegetables* | identical wording, **10–13 cm** |
| Penn State Extension, *Let's Preserve: Fermentation* | fill "within **three (7.5 cm) to four inches (10 cm)** from its top" |
| USDA Guide 6, p. 6-6 (a *different* rule — submersion) | "Cabbage and cucumbers must be kept **1 to 2 inches under brine** while fermenting" |

**Finding 4.3a — no source expresses headspace as a percentage of vessel volume, and no
experiment varies headspace *volume* with pH/time as the outcome.** The one study that varied
headspace *oxygen* (Yu et al. 2023, §4.1b) found the LAB rate unchanged. *Confidence: strong
that the evidence does not exist.* **Do not invent a headspace term.**

**Finding 4.3b — what a headspace is actually for is the CO₂ blanket, and that has been
measured.** Preuss, Peterson & Fred (1928), "Gas Production in the Making of Sauerkraut",
*Ind. Eng. Chem.* 20(11):1187–1190, doi:[10.1021/ie50227a021](https://doi.org/10.1021/ie50227a021):
a 58-gal (220 L) barrel with 300 lb (136 kg) shredded cabbage at ~2.5 % NaCl produced gas that
reached **98–99.6 % CO₂ with only 0.2–0.3 % O₂**; "**all the residual air in the barrel had been
displaced at the end of the second day**". Total gas production across four experiments was
212–415 L, i.e. **[calc] 1.6–3.0 L of CO₂ per kg of cabbage**. *Confidence: strong for the
numbers (four metered and analysed experiments); moderate for generalisation (n = 1 per
condition, 1928 methods).* **The practical read: the anaerobic atmosphere is self-establishing
within ~48 h of a healthy start — which is exactly why the first two days are the vulnerable
window, and why seal integrity in days 1–3 matters more than headspace size.**

**Finding 4.3c — and a CO₂ blanket is NOT guaranteed in a cold, small, slow ferment.** Kang, Lee
& Min (2003), *J. Food Sci.* 68(3), doi:[10.1111/j.1365-2621.2003.tb08254.x](https://doi.org/10.1111/j.1365-2621.2003.tb08254.x):
kimchi in a glass jar at **5 °C**, day 2 → day 27: pH 4.3 → 3.8; headspace **O₂ 14.3 % → 1.3 %**;
headspace **CO₂ 27.7 % → 45.3 %**. *Confidence: moderate — the publisher is Cloudflare-blocked
and the paper is not in PMC, so this is a secondary reading of the full text; spot-check before
relying on the digits.* **Unlike the sauerkraut barrel (98–99.6 % CO₂), the kimchi headspace
never gets past 45.3 % CO₂ and still holds 1.3 % O₂ at day 27.** Do not assume a
sauerkraut-like CO₂ blanket in a cold, slow, small ferment. *Four headspace gas time-series now
exist in total: Preuss 1928 (sauerkraut barrel), Kang 2003 (kimchi jar), Kim & Hu 2023 (onggi),
Humphries & Fleming 1988 (cucumber tank exhaust).*

**Finding 4.3e — the vessel question is not "how much headspace" but "can CO₂ escape and can
air get in".** Andersson et al. (1988, p. 860) give the engineering history directly:

> "Cucumber pickles have traditionally been fermented in open-top wooden vessels ranging in size
> from approximately **8 000 to 32 000 litres**. … The sunlight (UV radiation) striking the
> surface of the brine prevents the growth of oxidative spoilage microorganisms. In addition,
> **the open top allows the escape of CO₂** generated during fermentation. Problems that exist
> with an open-top tank design include: brine evaporation, rainwater accumulation and
> contamination with dirt, dust and insects. Numerous attempts have been made to develop
> enclosure devices for cucumber tanks, **but none have proven to be commercially feasible.
> The major impediment to adopting a closed system was that it did not provide an escape for CO₂
> evolved during fermentation. Excessive CO₂ accumulation during fermentation can result in
> physical disruption of the cucumber tissue due to gas pressure.** With the introduction of N₂
> purging to dissipate CO₂ … it is now technically feasible to consider a closed-top system."

**Finding 4.3f — for sauerkraut the traditional answer is a weighted, plastic-sheeted,
water-sealed cover.** "Anaerobiosis is necessary to prevent oxidation of the sauerkraut and the
growth of aerobic spoilage microorganisms. During the initial gaseous stage, the sauerkraut mass
is prone to expansion or 'heaving' due to CO₂ entrapped within the sauerkraut. This can lead to
deterioration of the sauerkraut if the expanding kraut causes a breach in the anaerobic seal."
(Andersson et al. 1988, p. 861.) *Confidence: strong for the mechanism.*

**Practical translation for a consumer calculator:** an airlocked jar and a well-weighted open
crock are not very different in *rate*; they differ in *spoil rate*. The failure mode to warn
about is a breach of the seal during the first 3–5 days (the gaseous phase), not the size of
the headspace.

### 4.4 Stirring

**Finding 4.4a — the only explicit guidance I found says stirring is harmful, and there is no
evidence it speeds fermentation.** FAO, Ch. 5
([x0560e10.htm](https://www.fao.org/4/x0560e/x0560e10.htm)):

> "**If the brine is stirred, it may introduce air, which makes conditions more favourable for
> the growth of spoilage bacteria.** In general, if the pickles are well covered with brine, the
> salt concentration is maintained and the temperature is at an optimum, it should be quite
> simple to produce good quality pickles."

I found **no** controlled study showing that stirring, punching down or daily pressing shortens
time-to-pH. *Confidence: strong that the evidence does not exist; moderate that stirring is
mildly harmful in an open vessel.* **Do not model stirring as a speed-up. If the app mentions
it at all, it should advise against it (or advise it only to submerge floating material, without
agitation).**

### 4.5 Kahm yeast and mould — where the folklore is wrong

**Finding 4.5a — "kahm yeast" has no peer-reviewed literature at all.** A Europe PMC title
search for "kahm" returns **zero hits**; it is a craft term. The science lives under
"white colony-forming yeast (WCFY)", "pellicle" and "film-forming yeast". In Sichuan pickle the
surface film is partly **bacterial** (*Bacillus amyloliquefaciens*, *B. subtilis*,
*Citrobacter freundii*). *Confidence: strong.*

**Finding 4.5b — salt does NOT suppress it. This is the most commonly repeated falsehood in
home fermentation advice.** Three independent studies:
- Satora, Skotniczny, Strnad & Ženišová (2020), *Int. J. Mol. Sci.* 21(24):9699,
  doi:[10.3390/ijms21249699](https://doi.org/10.3390/ijms21249699) ([PMC7767181](https://pmc.ncbi.nlm.nih.gov/articles/PMC7767181/)):
  246 isolates, 8 cabbage cultivars. "**All isolates could grow at NaCl concentrations higher
  than 5 %**"; most "grew very well even in an environment containing **10 % sodium chloride**."
  Dominant species *Debaryomyces hansenii*, plus *Clavispora lusitaniae*, *Rhodotorula
  mucilaginosa*, *Cryptococcus macerans*, *Nakazawaea holstii*, *Meyerozyma guilliardii*,
  *Candida sake*, *Pichia fermentans*, *Tausonia pullulans*.
- Kim M-J et al. (2021), *Foods* 10(3):645, doi:[10.3390/foods10030645](https://doi.org/10.3390/foods10030645)
  ([PMC8003234](https://pmc.ncbi.nlm.nih.gov/articles/PMC8003234/)): at **20 % NaCl all five
  WCFY strains survived**; high-salt brining "did not have a significant effect on inhibiting
  white colony formation."
- Xian et al. (2022), *Food Res. Int.*, doi:[10.1016/j.foodres.2022.111130](https://doi.org/10.1016/j.foodres.2022.111130):
  **7 % (w/v) salt did not inhibit pellicle** formation; 1.5 % (v/v) baijiu did.

*Confidence: strong.* **Do not tell users that more salt prevents kahm.**

**Finding 4.5c — pH and temperature thresholds are narrow and refrigeration only slows it.**
Most sauerkraut isolates grew at **pH 3.6** and were inhibited at **pH 3.4–3.2** (Satora 2020);
all five strains in Kim 2021 grew at pH 3, 4 and 5 (in HCl-acidified YPD, not brine — a real
caveat). All five strains grew at 4, 10 and 20 °C; only three at 0 °C. *Confidence: moderate.*
**Note: the widely quoted "kahm grows pH 2.5–8.0, optimum 4.0–4.5" is untraceable to any
primary source and should not be cited.**

**Finding 4.5d — oxygen delays it but does not prevent it; these are at minimum facultative.**
Rao et al. (2019), *RSC Advances*, doi:[10.1039/C9RA05994F](https://doi.org/10.1039/C9RA05994F):
continuous O₂ → pellicle by day 32; intermittent → day 48; no oxygen → none in 64 days. **But
Kim 2021 found WCFY colonies forming *anaerobically* at 4/10/20 °C**, contradicting the
"obligate aerobe" claim. *Confidence: moderate; the two datasets conflict.*

**Finding 4.5e — the organisms are not a safety hazard, but the acid consumption is.**
Jeong et al. (2022), *Food Microbiology* 106:104057,
doi:[10.1016/j.fm.2022.104057](https://doi.org/10.1016/j.fm.2022.104057): formal toxicology on
WCFY — **no cytotoxicity** in Caco-2/HepG2 up to 2.5×10⁵ CFU/mL, **no rat toxicity** to
5×10⁸ CFU/head/day, **no toxin or antimicrobial-resistance genes**. The hazard is indirect:
Franco & Pérez-Díaz (2012), doi:[10.1016/j.fm.2012.07.013](https://doi.org/10.1016/j.fm.2012.07.013),
showed *Issatchenkia occidentalis* and *Pichia manshurica* **utilise lactic and acetic acid
aerobically**, raising pH. *Confidence: strong.* **This is the mechanism by which a surface
film becomes a safety issue: it eats the acid.** No study has prospectively compared pH/time in
kahm-positive vs clean ferments, so a persistent film is at least as much a *marker* of a
stalled fermentation as a cause.

**Finding 4.5f — mould is the real hazard, and the classic "mould raises pH → botulism" study
is about tomato juice, not sauerkraut.** Mundt (1978), *J. Food Prot.* 41(4):267–268,
doi:[10.4315/0362-028X-41.4.267](https://doi.org/10.4315/0362-028X-41.4.267): 58 mould species
on **tomato juice**, 35 days — pH rose from 4.1 to **4.9 and above 9.0**, with 53 % of Fungi
Imperfecti above pH 7.0. There is **no sauerkraut equivalent** — a Europe PMC abstract search
for sauerkraut + botulinum returns **zero hits**, and **no botulism outbreak has ever been
traced to sauerkraut**. *Confidence: strong (negative result).*

**Finding 4.5g — and the acid that protects sauerkraut is the *weakest* mould inhibitor of the
three.** Potts & Fleming (1982), *J. Food Sci.* 47(5):1723–1727,
doi:[10.1111/j.1365-2621.1982.tb05020.x](https://doi.org/10.1111/j.1365-2621.1982.tb05020.x)
([ARS p151](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p151.pdf)):
- 0.16 % **acetic** acid (equilibrated) prevented mould-induced softening; 0.12 % and below failed.
- **"Growth of four mold isolates from soft cucumbers was inhibited by 0.3 % acetic (pH 4.0) but
  NOT by up to 0.9 % lactic acid (pH 3.0) at 5.3 % NaCl."**

**Lactic acid at pH 3.0 did not inhibit these moulds.** This matters directly: sauerkraut and
kimchi are *lactic*-dominated, so a low pH achieved with lactic acid alone is a weaker mould
barrier than the pH number suggests. *Confidence: strong (dose-response, replicated, lab plus
two commercial plants).*

**Finding 4.5h — the practical discard/keep rule, and it is official.** UC Davis (2022),
*Troubleshooting Fermented Fruits and Vegetables*
([PDF](https://ucfoodsafety.ucdavis.edu/sites/g/files/dgvnsk7366/files/media/documents/Troubleshooting%20fermented%20fruits%20and%20vegetables%20FINAL.pdf)):
kahm is filed under **"Normal: Yeast"** — "yeast should be periodically removed" and "the pH can
be checked periodically to ensure it does not rise above 4.6." **Confirmed mould is
"immediately discarded."** USDA/NCHFP agrees: "remove scum as often as needed."
*Confidence: strong (regulatory/extension consensus).*

### 4.6 Vessel side-by-side: the one study that ran it

**Satora & Strnad (2024), "The Influence of Fermentation Vessels on Yeast Microbiota and Main
Parameters of Sauerkraut", *Applied Sciences* 14(1):236**,
doi:[10.3390/app14010236](https://doi.org/10.3390/app14010236) — open access.

Design: **glass jars with airlock lids, small headspace** vs **stoneware with LDPE foil and
pressure stones**; n = 3, 20 °C, 14 days, 2.5 % NaCl.

| Day | 0 | 1 | 2 | 3 | 4 | 7 | 10 | 14 |
|---|---|---|---|---|---|---|---|---|
| Glass (airlock) | 6.04 | 5.78 | 5.73 | **4.64** | **4.10** | 3.82 | **3.81** | 3.73 |
| Stoneware (foil + stones) | 6.04 | 5.70 | 5.57 | **5.13** | **4.53** | 4.06 | 3.91 | 3.86 |

- Lactic acid at day 7: **glass 12.42 g/L vs stoneware 6.95 g/L (1.8×)**; stoneware also had
  several-fold more acetic acid.
- Glass reached the end-of-fermentation marker (pH 3.8, 1.5 % lactic acid) on **day 10**;
  stoneware was still at pH 3.86 on **day 14**.
- Stoneware grew more spoilage yeasts (*Rhodorula*, *Wickerhamomyces*).

**Finding 4.6a — vessel configuration produced a ~0.5 pH-unit gap at day 3, narrowing
thereafter, and a 1.8× difference in lactic acid at day 7.** The gap is widest in the first
~4 days — exactly the window before the CO₂ blanket forms (Preuss 1928: ~48 h) and exactly when
oxygen ingress matters. *Confidence: moderate-to-strong* (n = 3; the abstract was independently
verified but the day-by-day table could not be re-verified because MDPI was unreachable from
the research environment — treat the trajectory as moderate). **Important caveat: the study
confounds *material* (glass vs ceramic) with *closure* (airlock vs foil + stones). Given the
packaging physics below, the closure is almost certainly the controlling variable.**

**Finding 4.6b — the seal, not the wall material, is the controlling oxygen path.** Oxygen
transmission rates (Robertson, *Food Packaging: Principles and Practice*, 3rd ed., Tables
11.1–11.2): HDPE **39–72** cm³·mm/(m²·day·atm), PP 59–151, PET 3.6–4.9, LDPE 197–440; glass and
stainless steel are effectively absolute barriers. But the arithmetic is decisive:
**[calc] for a 20 L HDPE bucket, wall plus lid admit ≈2.07 cm³ O₂/day (≈2.7 mg), while a 2 L
headspace holds 418 cm³ ≈ 597 mg of O₂ — about 220 days' worth of wall ingress.** Kim & Hu
(2023), *J. R. Soc. Interface* 20(201):20230034,
doi:[10.1098/rsif.2023.0034](https://doi.org/10.1098/rsif.2023.0034): a "hermetically sealed"
**glass** jar measured gas permeability attributable **entirely to lid leakage**, only 2.1×
lower than a deliberately **porous unglazed onggi** pot. *Confidence: strong.*
**Modelling consequence: vessel material is second-order for both rate and oxygen ingress;
closure design is first-order. An LDPE bag liner is a mechanical aid (submersion, excluding
headspace), not a barrier — 25 µm LDPE over the same area admits ~370× more O₂ than a 2 mm
HDPE wall.**

**Finding 4.6c — the one measured vessel-material rate effect attaches to *porosity*, not to
"ceramic".** Kim & Hu (2023): unglazed onggi vs hermetic glass, 200 g cabbage, 2 wt% brine,
25 °C — CO₂ generation **0.695 vs 0.552 mmol/h (+26 %, p = 0.0498)**; internal CO₂ "less than
half" the sealed-container level; steady-state internal pressure 4.1 kPa. The mechanism is CO₂
**venting** (relieving product inhibition), not oxygen ingress. *Confidence: moderate.*
**A vitrified, well-glazed crock would be expected to behave like glass — and no study tests
that. There is no glass-vs-HDPE-vs-PP-vs-stainless head-to-head with rate as the outcome.**

**Finding 4.6d — the material question that *is* first-order is safety, and it runs against the
artisanal option.** FDA compliance policy guides set leachable-lead action levels (CPG Sec.
545.450, [PDF](https://www.fda.gov/media/71764/download)): large hollowware (≥1.1 L) **1.0
µg/mL**, pitchers 0.5, cups/mugs 0.5; cadmium 0.25 µg/mL for large hollowware (CPG Sec. 545.400).
Measured reality: Belgaied (2003), *Food Chem. Toxicol.* 41(1):95–98,
doi:[10.1016/S0278-6915(02)00207-0](https://doi.org/10.1016/S0278-6915(02)00207-0) — Tunisian
glazed mugs leached **up to 51 µg Pb/mL (~100× the action level)**. Castellanos-Carrizal et al.
(2026), *J. Public Health Manag. Pract.* 32(2):268–275 — 33 glazed-clay items: **acidic food
median 103.4 mg/kg Pb vs 11.19 mg/kg for non-acidic (≈9× more)**, p < .05. FDA's own guidance:
"No amount of washing, boiling, or other process can remove lead from pottery" — do not use for
cooking, serving **or storing**. *Confidence: strong for the hazard class; **no study has tested
a purpose-built fermentation crock, and the compliance test is 24 h while a ferment runs 1–4
weeks** — the exposure is uncharacterised and, if anything, understated.* **Glass and stainless
have no identified leaching pathway into acidic brine and are the conservative choice.**

### 4.7 Verdict on §4

| Factor | Rate effect | Spoilage effect | Worth modelling? |
|---|---|---|---|
| Oxygen ingress | Modest at realistic aeration (<1 day); LAB rate statistically unchanged in kimchi; catastrophic only at ~40–100× commercial aeration rates | **Very large**: yeasts 10² → 10⁶–10⁹/mL; pH can *rise* +0.17 units as acid is consumed | Model as a **risk/safety** modifier, not a rate term |
| Headspace volume | Not demonstrated | Indirect | Do **not** model |
| Vessel closure (airlock / water seal / one-way valve) | ~0.5 pH units at day 3, 1.8× lactic acid at day 7 vs foil + stones | **Yes** — days 1–3 are the vulnerable window before the CO₂ blanket (≈48 h) forms | Model as advice + a first-days risk flag |
| Vessel material (non-porous) | **~25 % in a controlled same-size test (glass/plastic > porcelain)** | Safety: leaded glaze is the one real hazard | Low priority; safety advice only |
| Porous ceramic (onggi) | **+26 % CO₂ production** via venting | — | Not modellable for a generic user |
| Stirring / punching down | **No study exists at all**; FAO advises against | Mildly harmful | Do **not** model as a speed-up |
| CO₂ retention | *Stimulates* LAB, inhibits Gram-negatives; blanket self-forms in ~48 h | Favourable | Not separately modellable |
| Kahm yeast | No prospective evidence either way; it *follows* stalling as often as it causes it | Cosmetic per UC Davis; hazard only via acid consumption and pH rise above 4.6 | Model as advice, not a number |
| Mould | n/a | **Discard.** Lactic acid at pH 3.0 does not inhibit the relevant moulds | Advice; strong wording |

---

## 5. Batch size, vessel size and salt distribution

### 5.1 Does batch size change fermentation rate? Almost certainly not at kitchen scale

**Qiao & Gänzle (2026), "From phyllosphere to fermentation: Impact of fermentation scale and
temperature on sauerkraut fermentation", *Int. J. Food Microbiology* 447:111571**,
doi:[10.1016/j.ijfoodmicro.2025.111571](https://doi.org/10.1016/j.ijfoodmicro.2025.111571):

- Scales tested: **0.8 g, 8 g, 30 g** chopped white cabbage in 2.5 % (w/w) NaCl, at **10 °C and
  20 °C**, two cabbage sources, 20 replicates per group.
- **0.8 g** with one cabbage source: Enterobacterales grew but **LAB did not** — the
  fermentation failed. 8 g: *Lactiplantibacillus* established as dominant. 30 g at 20 °C:
  *Lactiplantibacillus* dominated regardless of cabbage source; at 10 °C *Leuconostoc* or
  *Rahnella* remained dominant.
- Conclusion: "the establishment of LAB communities" depends on scale, temperature and cabbage
  source.

**Finding 5.1a — there IS a scale effect, but it lives at the sub-gram-to-30-gram boundary and
it is a *colonisation* effect (can the inoculum establish at all?), not a thermal-mass effect.**
The mechanism is that a tiny substrate volume carries too few epiphytic LAB to initiate, and
loses its reducing atmosphere to the headspace. Between 1 L and 30 L — the entire range a
consumer calculator cares about — no such failure mode has been demonstrated. *Confidence:
moderate-to-strong* (well-replicated design, but not open access so I could not read the pH
curves; only the abstract).

**Finding 5.1b — there is no published evidence that a 20 L crock and a 1 L jar ferment at
different *rates*.** I searched specifically for this and found nothing. *Confidence: strong
that the evidence does not exist.*

### 5.2 Thermal mass: real but second-order for a kitchen ferment

No published temperature-lag measurement exists for a fermenting vegetable vessel, but the
calculation can now be done on **measured** properties rather than assumed ones: cabbage petiole
thermal conductivity k = 0.43–0.47 W/m/K raw (Kim et al. 1991, *Korean J. Food Sci. Technol.*
23(3):325); root-vegetable thermal diffusivity **α = 1.15–1.47 × 10⁻⁷ m²/s** (Muramatsu et al.
2020, *Food Sci. Technol. Res.* 26(6):717) — adopting α = 1.15 × 10⁻⁷ m²/s. Using
τ = R²/(2.4048²α):

| Vessel | Radius | τ | Sensible heat per K |
|---|---|---|---|
| 1 L jar | 4.73 cm | **0.94 h** | 3.9 kJ |
| 20 L crock | 12.85 cm | **6.90 h** | 78.0 kJ (20×) |

The ratio is exactly **7.37× = 20^(2/3)**, as the geometry requires.

**Finding 5.2a — the most useful derived number is the diurnal penetration depth,
δ = √(2α/ω) = 5.6 cm in cabbage.** A 24-hour ambient swing barely penetrates beyond a 1 L jar's
radius. So: **the core of a 1 L jar sees ~43 % of a 24 h ambient swing; the core of a 20 L crock
sees ~10 %, lagged by ~9 hours.** *Confidence: moderate — the material properties are measured;
the specific heat (3,900 J/kg/K) is a flagged design value because the measured figure is
paywalled. **These numbers supersede an earlier first-principles estimate of ~14 min / ~65 min,
which was ~4× too fast.***

**Finding 5.2b — vessel size changes the *stability* of the rate, not the rate itself.** A 1 L
jar tracks ambient closely; a 20 L crock substantially damps a diurnal swing. This matters only
if the calculator uses an hourly forecast rather than a daily mean — because the Arrhenius
average of a fluctuating temperature is **higher** than the rate at the mean (Jensen's
inequality). *Confidence: moderate; still no direct measurement.*

**Measured temperature sensitivity in a real 136 kg barrel** (Preuss et al. 1928):

| Experiment | Temperature | Time | Final acidity |
|---|---|---|---|
| I | 6.1 °C | 260 h | **0.26 %** |
| II | 20 °C | 423 h | 1.90 % |
| III | 25–28 °C | 305 h | 2.24 % |
| IV | 25–28 °C | 141 h | 2.1 % |

The authors also recorded a direct perturbation: "As the temperature dropped from 17.5° to
10.5 °C, the gas and acid production decreased markedly, the acid production more so than the
gas. As the temperature again increased to 20 °C, there was an increase in acidity."
*Confidence: strong for direction; moderate for magnitude (n = 1 per condition).*

**The codified optimum is 2.0–2.25 % salt at 18 °C** (Pederson & Albury 1969, NY State Agric.
Exp. Sta. Bulletin 824, as restated verbatim by Johanningsmeier, McFeeters, Fleming & Thompson
2007, *J. Food Sci.* 72(5):M166–M172,
[ARS p348](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf)). Note that
18 °C is *below* the 20–30 °C optimum for *L. mesenteroides* — it is a **quality/ecology**
control (slowing the heterofermentative first stage relative to homofermentative *L. plantarum*),
not a speed maximisation.

**A caution against extrapolating small-vessel results:** Daeschel & Fleming (1981),
*Appl. Environ. Microbiol.* 42(6):1111–1118,
[ARS p149](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p149.pdf), found that
oxygen-exchanged cucumbers cured within a day in the lab — and then, in 80-bushel (≈2.9 m³)
wooden tanks, reported that "**in contrast to our previous laboratory data, serious bloater
damage occurred** in the oxygen-exchanged cucumbers about 4 to 5 days after brining." This is an
**outcome reversal**, not an effect-size change, and it is the cleanest published warning that
bench-scale vessel results do not always survive scale-up.

### 5.3 Surface-to-volume ratio

For a cube of edge *a*: S/V = 6/a. Doubling the edge halves S/V (radish kimchi, §2.2). For
cylinders (jars/crocks) of the same aspect ratio, S/V ∝ 1/radius, so a 20 L crock has roughly
**2.7× lower S/V** than a 1 L jar. This affects (a) how fast O₂ diffuses into the bulk, and
(b) the size of the brine–air interface where kahm yeast and moulds grow. **It does not affect
the rate of acid production in the bulk, which is anaerobic and diffusion-limited by tissue, not
by headspace.** *Confidence: strong on the geometry; strong that the rate consequence is small.*

### 5.4 Salt and sugar diffusion into whole vegetables — the best-quantified topic in this review

**Potts, Fleming, McFeeters & Guinnup (1986), "Equilibration of Solutes in Nonfermenting,
Brined Pickling Cucumbers", *J. Food Sci.* 51(2):434–439**,
doi:[10.1111/j.1365-2621.1986.tb11149.x](https://doi.org/10.1111/j.1365-2621.1986.tb11149.x)
([ARS p190](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p190.pdf)).

Design: 1-gal glass jars, 50:50 pack-out, 10 % NaCl + 0.8 % acid cover brine, ~25 °C, microbial
growth suppressed so this is **pure physical diffusion**. Four cucumber size grades.

Measured first-order rate coefficients Kp (day⁻¹) and the authors' own "% equilibrium per day",
unpeeled:

| Grade (diameter) | Sugar Kp | NaCl Kp | Lactic acid Kp |
|---|---|---|---|
| 1 (1.9–2.7 cm) | 0.472 (37.6 %/d) | 1.673 (81.2 %/d) | 1.973 (86.1 %/d) |
| 2 (2.7–3.8 cm) | 0.146 (13.6 %) | 0.679 (49.3 %) | 0.720 (51.3 %) |
| 3 (3.8–5.1 cm) | 0.077 (7.4 %) | 0.301 (26.1 %) | 0.356 (30.0 %) |
| 4 (5.1–6.4 cm) | 0.045 (4.4 %) | 0.170 (15.6 %) | 0.189 (17.2 %) |

**[calc] Converted to practical times (t₉₅ = 3.00/Kp):**

| Grade | NaCl t₉₅ | Lactic acid t₉₅ | **Sugar t₉₅** |
|---|---|---|---|
| 1 (small) | 1.8 d | 1.5 d | **6.4 d** |
| 3 (typical pickling size) | 10.0 d | 8.4 d | **39 d** |
| 4 (largest) | 17.6 d | 15.9 d | **67 d** |

**Finding 5.4a — SUGAR is the rate-limiting solute, not salt, and it is 5–15× slower to
equilibrate.** For a typical pickling cucumber, salt reaches 95 % of equilibrium in ~10 days
while the sugar the LAB actually need takes ~39 days. *Confidence: strong* (replicated,
multi-size, temperature series, Arrhenius analysis).

**Finding 5.4b — the skin is the rate-limiting barrier, and the transport is stomatal.**
"Peeling increased Kp values **6.9- to 11.1-fold** for reducing sugar, 10.6-fold for malic acid,
**3.7- to 7.3-fold for NaCl**, and 3.5- to 8.1-fold for lactic acid equilibration." The Kp vs
total-surface-area regression gave r² = 0.968. **A 2.4× increase in diameter reduced the NaCl
Kp by 9.8×.** *Confidence: strong.* This is the quantitative basis for the app's particle-size
term, and it explains why the *skin* — not the interior — governs the rate.

**Finding 5.4c — solutes move IN faster than OUT, so the interior acidifies before it is
depleted.** Fasina, Fleming & Thompson (2002), *J. Food Sci.* 67(1):181–187,
[ARS p299](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p299.pdf): sorption rate
constants k (h⁻¹) for NaCl fell from 0.233 (17.0 mm) to 0.0450 (46.1 mm) — a 5.2× fall across a
2.7× diameter increase. The ratio k(NaCl)/k(sugar) ran from 5.14 (smallest) to 2.21 (largest).
*Confidence: strong.*

**Finding 5.4d — for sugar, the cucumber behaves as a lumped body with NO significant internal
gradient.** Fasina et al. computed mass-transfer Biot numbers of 2.6–5.5, all **below the
critical value of 10**, and concluded "there is no significant difference in sugar concentration
between the surface and center of the fruit." **The limitation is at the skin/brine interface,
not inside the fruit.** *Confidence: strong.* (This refutes the intuitive "hollow centre because
the middle ferments last" model — hollow centres are a *gas* phenomenon, below.)

**Finding 5.4e — commercial practice does not wait for equilibration.** "Cucumbers are held in
acidified brines for **18 to 24 h** to allow nutrients to diffuse into the brine and NaCl and
acetic acid to diffuse into the cucumbers. The brine is then adjusted to about pH 4.5 and
inoculated with lactic acid bacteria" (Fasina et al. 2002). *Confidence: strong.*

**Finding 5.4f — bloater damage (hollow cucumbers) is a CO₂ problem, not a diffusion problem.**
LAB enter and grow inside brined cucumbers; malic acid is decarboxylated to lactic acid + CO₂;
"This microbially produced CO₂ is a major cause of bloater damage." CO₂ accumulates faster than
it diffuses out, and "once the gas accumulates in the cucumber tissue in concentrations high
enough to displace it, the irreversible formation of hollow cavities or bloaters occurs"
(Wehner & Fleming 1984). Mitigation: N₂ purging for at least the first 2 days, or acidifying the
cover brine. Fleming, Etchells, Thompson & Bell (1975), *J. Food Sci.* 40(6):1304–1310,
[ARS p125](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p125.pdf): continuous N₂
cut bloater damage from **84 % (unpurged) to 8 %**. *Confidence: strong.*

**Also measured, from Jones & Etchells (1943)** — [p19](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p19.pdf), pp. 1–2:

> "When cucumbers are placed in brine they undergo rapid physical and chemical changes. There
> is a vigorous withdrawal of water from the cucumbers and, therefore, **a decided shrinkage of
> the fruit as well as a great dilution of the brine.** … the greatest dilution occurs during the
> **first 48 hours** of the curing process. … During the first 48 hours of the salting process,
> the brine causes a marked increase in weight of the fruit due to loss of water and soluble
> substances."

**The first 48 h in a brine ferment is dilution and equilibration, not fermentation.** Salt must
be dosed to allow for the vegetable diluting the brine by a large, load-dependent amount.

### 5.4b Dry-salt vs brine: salt distribution

**Finding 5.4g — dry salting wins on speed on strong physical grounds.** Shreds (~1–2 mm)
equilibrate essentially instantly; whole cucumbers take t₉₅ of 1.8–17.6 d for salt and 6.4–67 d
for sugar (§5.4). FAO Ch. 5 states plainly: "**The use of salt brines is not recommended in
sauerkraut making, but is common in vegetables that have a low water content.**" *Confidence:
strong for the guidance; **no study directly compares dry-salted vs brine-salted cabbage with
pH/time as the outcome** — the claim rests on physics and adjacent measurements.*

**The closest measured salt-distribution intervention** is tumbling-assisted dry salting of
kimchi cabbage: Yang, Min, Yang, Lee, Park, Eun & Chung (2024), *J. Food Eng.* 361:111742,
doi:[10.1016/j.jfoodeng.2023.111742](https://doi.org/10.1016/j.jfoodeng.2023.111742) — "the
effective salt diffusion coefficient during tumbling-assisted dry salting increased by **29.12
times** compared to conventional salting", with comparable texture and appearance. Agitation
raises the *surface* mass-transfer coefficient, which is the rate-limiting step. *Confidence:
moderate (one study, endpoint is salt content not pH) — but it is the only quantitative support
found anywhere for the idea that agitating a brine ferment matters.*

### 5.5 The rate-vs-salt curve: **the calculator's salt term has the wrong shape, and for the
practical range the sign may be inverted**

The calculator uses `saltFactor = saltPct / typicalSaltPct`, clamped 0.6–2.0 — i.e. **less salt
always means proportionally faster**. The evidence says the opposite over the practical range.

**The quantitative curve — Stamer, Stoyla & Dunckel (1971)**, "Growth Rates and Fermentation
Patterns of Lactic Acid Bacteria Associated with the Sauerkraut Fermentation", *J. Milk Food
Technol.* 34(11):521–525 (Cornell / NY State Agric. Exp. Sta.). Design: five species, pure
cultures, three salt levels × four pH levels, **filter-sterilised cabbage juice** (real
substrate), 30 °C.

Maximum acid production rate (meq titratable acid per 100 mL juice per hour during log growth),
**pH 6.2**:

| Species | No salt | 2.25 % | 3.50 % |
|---|---|---|---|
| *L. mesenteroides* C33 | 0.87 | 0.56 (−36 %) | 0.20 (**−77 %**) |
| *L. plantarum* B246 | 0.43 | 0.35 (−19 %) | 0.30 (**−30 %**) |
| *L. brevis* B155 | 0.39 | 0.33 (−15 %) | 0.10 (**−74 %**) |
| *P. cerevisiae* E66 | 0.60 | 0.55 (−8 %) | 0.50 (**−16 %**) |

Generation times (min), pH 6.2:

| Species | No salt | 2.25 % | 3.50 % |
|---|---|---|---|
| *L. mesenteroides* | 40 | 43 (**+8 %**) | 66 (**+65 %**) |
| *L. plantarum* | 43 | 45 (**+5 %**) | 72 (**+67 %**) |
| *L. brevis* | 83 | 91 (**+10 %**) | 110 (+33 %) |
| *P. cerevisiae* | 41 | 43 (+5 %) | 40 (**0 %**) |

**Finding 5.5a — the break point is between 2.25 % and 3.5 %, and it is sharp.** At 2.25 %
generation times are within 5–10 % of the no-salt control; at 3.5 % they are 33–67 % longer.
The authors' own summary: at 2.25 % "the most pronounced inhibition, 37 %, was noted with
*L. mesenteroides* and the least retardation, 8 %, with *P. cerevisiae*"; raising salt to 3.5 %
"produced a 90 % reduction in the acid rates of the heterolactic species" while "*L. plantarum*
were reduced 30 %, whereas *P. cerevisiae* was inhibited only 16 %." *Confidence: strong.*
*(Note an internal inconsistency in the paper: the stated "90 %" does not match its own table
(−77 % and −74 %). Both are reported here; the table is the measured data.)*

**Finding 5.5b — the optimum is 2.0–2.5 %, confirmed independently.** Yang, Hu, Xiu, Jiang,
Yang, Saren, Ji, Guan & Feng (2020), *J. Appl. Microbiol.* 129(6):1458–1471,
doi:[10.1111/jam.14786](https://doi.org/10.1111/jam.14786): across **0.5 / 1.5 / 2.5 / 3.5 %**
salt, "the population of lactic acid bacteria in **2.5 %-salted sauerkraut was significantly
higher** than that in the other samples. Correspondingly, **the speed of decrease in pH and
accumulation of acids were the highest in 2.5 %-salted sauerkraut**." *Confidence: strong for
the design; the paper is paywalled so I have the abstract only and cannot give absolute pH-vs-time
values at each salt level.* **This is the single most actionable missing number in the whole
review: a published table of "days to pH 4.0 at 1.5 / 2.5 / 3.5 % salt" does not appear to exist
in the open literature.**

**(a) Large-scale trial: 0.5 % vs 1.2 % NaCl, 430 kg vessels.**
Viander, Mäki & Palva (2003), "Impact of low salt concentration, salt quality on natural
large-scale sauerkraut fermentation", *Food Microbiology* 20:391–395,
doi:[10.1016/S0740-0020(02)00150-8](https://doi.org/10.1016/S0740-0020(02)00150-8):
- "**The pH decreased somewhat faster when 1.2 % NaCl was used**… no significant differences
  could be observed after the sixth fermentation day."
- LAB reached 10⁸ CFU/mL on **day 3** at 1.2 % NaCl, on **day 4** at 0.5 % NaCl, and on
  **day 6** at 0.5 % mineral salt (giving only 0.3 % NaCl).
- Lactic acid production was clearly lower after 2 weeks in the 0.5 % mineral-salt trial.
*Confidence: strong* (three parallel 430 kg trials per treatment).

**(b) Factorial sauerkraut trial: 1.8 / 2.25 / 3 % NaCl, 18 and 22 °C.**
Niksic et al. (2005): "within cabbage type, **neither salt nor fermentation temperature had
significant effects**." *Confidence: strong within the study; the range tested (1.8–3 %) is
exactly the range the calculator operates in. Taken with Stamer 1971, the reading is that
1.8–2.5 % sits on the flat part of the curve and 3 % is at the knee — not that salt never
matters.*

**(c) Reduced salt is safe only with a starter.** Johanningsmeier et al. (2007),
[ARS p348](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf): 3 × 2
factorial, 0.5 / 1.0 / 2.0 % NaCl ± *L. mesenteroides* LA 81 at 10⁶ CFU/g, 18 °C, 10 months.
"Cabbage fermented with *L. mesenteroides* consistently resulted in sauerkraut with **firm texture
and reduced off-flavors across all salt levels** (P < 0.05). Conversely, sauerkraut quality was
**highly variable, with softening and off-flavors occurring as salt concentrations were
decreased in natural fermentations**." Starter allowed a **50 % NaCl reduction**. *Confidence:
strong.* **Below ~2 % salt the wild fermentation becomes unreliable — the failure is competitive
exclusion by spoilage organisms, not a failure of LAB kinetics.**

**(d) Above ~5 % salt genuinely does slow things; ~10 % stops fermentation.**
Andersson, Daeschel & Eriksson (1988), [p210](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf), p. 862:
"Pederson (1979) showed that **about 10 % NaCl in the brine is the upper limit** for fermentation
of vegetables and that the growth of lactic acid bacteria is greatly retarded even below this
concentration. **Leuconostoc mesenteroides is highly influenced in the range from 1 to 3.5 %**,
while *Pediococcus pentosaceus* can withstand higher NaCl concentrations." Independent
confirmation of the >4 % threshold: Fleming et al. (1978, §2.2b) found **up to 3.9 % NaCl does
not slow the rate; 6.5 % does**. *Confidence: strong.*

**(e) The brine-salt ladder, measured.** Jones & Etchells (1943), Fig. 2, cucumber brine at
20° / 40° / 60° salometer (≈5.3 % / 10.6 % / 15.9 % NaCl):

| Brine | pH at day 7 | pH at day 14 | pH at day 28 | Acidity at day 14 |
|---|---|---|---|---|
| 20° salometer (5.3 %) | ≈4.2 | ≈3.8 | ≈3.7 | ≈0.8 % |
| 40° (10.6 %) | ≈4.7 | ≈4.2 | ≈4.2 | ≈0.5 % |
| 60° (15.9 %) | ≈5.5 | ≈5.4 | ≈5.2 | ≈0.1–0.2 % (largely acetic, from yeasts) |

FAO Ch. 5 confirms the mechanism at the top end: at ~40° salometer "the sequence is skewed
towards the development of a homofermentation, dominated by *Lactobacillus plantarum*"; at
~60° salometer "**the lactic fermentation ceases to function**."

**(f) Water-activity arithmetic shows why 2–3 % is nearly inert.** Troller & Stinson (1981),
*Appl. Environ. Microbiol.* 42:682–687 ([PMC244083](https://pmc.ncbi.nlm.nih.gov/articles/PMC244083/)):
"none of the sauerkraut organisms grew at aw levels of <0.95 when NaCl was the solute."
3 % NaCl gives aw ≈ 0.982 — nowhere near the 0.95 limit. *Confidence: strong.* Salt at
sauerkraut levels is not exerting its effect through water activity.

**Finding 5.5c — salt in the 1.5–3 % range is a *selector*, not a *brake*.** Its job is to
inhibit the Gram-negative spoilage flora and draw juice; at 2–2.5 % the cocci are largely
unaffected while the lactobacilli are mildly inhibited (FAO Ch. 5). **Below ~1.5 % the
fermentation is actually somewhat slower and much more prone to spoilage** (because the
spoilage organisms are no longer held back and compete with the LAB), not faster. Above ~3.5 %
it slows markedly; above ~4–5 % markedly more; above ~10 % it stops.

**Recommended replacement for `saltTimeFactor`:**

```
saltTimeFactor(saltPct):            # relative to the ~2.0–2.5 % reference
  < 1.0 %     -> 1.0–1.3    (slower AND unreliable without a starter)
  1.0–1.5 %   -> 1.0–1.15   (slightly slower; spoilage risk ↑↑)
  1.5–2.5 %   -> 1.00       (flat — no measurable effect; this is the optimum)
  2.5–3.5 %   -> 1.00–1.30  (mild slowing; heterolactic species most affected)
  3.5–5.0 %   -> 1.30–1.8
  5.0–10 %    -> 1.8–4.0    (marked slowing; long ferment / salt-stock)
  > 10 %      -> fermentation does not proceed
  (if a starter culture is used, the sub-2 % penalty largely disappears)
```

*Confidence: strong that the current monotonic term is wrong in sign over 1–2 %; strong for the
flat 1.5–3.5 % plateau and the >5 % rise; moderate for the exact multipliers above 3.5 %.*

### 5.6 Vessel material

**Finding 5.6a — there IS a controlled same-size material comparison, and it found a ~25 %
rate difference.** Liu, She, Chen, Qian, Tao, Li, Guo, Xiang, Liu & Rao (2020), "Microbiota
Succession and Chemical Composition Involved in the Radish Fermentation Process in Different
Containers", *Frontiers in Microbiology* 11:445,
doi:[10.3389/fmicb.2020.00445](https://doi.org/10.3389/fmicb.2020.00445)
([PMC7146078](https://pmc.ncbi.nlm.nih.gov/articles/PMC7146078/)) — **open access**:

- Design: radish in **glass**, **porcelain** and **plastic** jars, **10 L each, 3 kg radish,
  6 % NaCl, 22–25 °C**. Identical size, identical brine — only the material varies.
- "The changes in pH values suggested that **plastic may facilitate the quickest fermentation**
  of the pickles, while the process in **porcelain progressed at the lowest rate**."
- pH 3.5 reached on **day 4 in glass and plastic vs day 5 in porcelain** — ~25 % from material
  alone.
- Counterpoint in the same paper: "The container materials had **no significant influence on the
  microbial structure**, wherein *Lactobacillus* was the absolute dominant genus in all
  containers."

*Confidence: moderate-to-strong for the ordering (glass ≈ plastic > porcelain); moderate for the
day-4/day-5 magnitudes; note the ferment is high-salt (6 % NaCl), which is not the calculator's
regime.* **This finding supersedes an earlier conclusion in this review that no material rate
difference exists.**

**Finding 5.6b — the likely mechanism is gas exchange, not a material property.** Porous
unglazed onggi **vents CO₂** (helping — §4.6c: +26 % CO₂ production); a glazed vitrified
porcelain jar is gas-tight and **holds CO₂ in** (hurting); HDPE/PP have finite CO₂ permeability
and can vent slowly through the wall (helping). That reading is mechanistic inference, not
something Liu et al. measured. **There is still no four-way glass / HDPE / PP / stainless
head-to-head with rate as the outcome.** *Confidence: moderate.*

**Finding 5.6c — for the seal question, the closure dominates.** See §4.6b: the headspace holds
~220× more O₂ than a 20 L HDPE bucket's wall and lid admit per day, and a "hermetically sealed"
glass jar leaked within 2.1× of a deliberately porous ceramic pot, entirely through its lid.
**A water-seal crock's *principle* is endorsed in ARS commercial practice** ("the tank is
covered with plastic sheeting upon which water is placed, providing a weighted, air-tight seal
against the tank wall" — p210), **but no independent experimental test of a branded water-seal
crock exists.** The manufacturer's own site for the best-known brand is dead and essentially
unarchived (the Wayback Machine holds only a 2005 `robots.txt`), so **the manufacturer's claim
itself is not retrievable — if you see it quoted anywhere, the quotation is unverifiable.**

**Finding 5.6d — categories with zero data at all:** vacuum-bag sauerkraut (no controlled
pH/time study), Fido jars, silicone airlock lids, and pickle-pipe style waterless airlocks. Do
not make rate claims about any of them.

**Finding 5.6e — the one material hazard with documented poisoning-level exposure is leaded
glaze (§4.6d).** Glass and stainless steel have no identified leaching pathway into acidic
brine. FAO Ch. 5 adds the salt-quality dimension: iron impurities blacken the vegetable,
magnesium imparts bitterness, carbonates soften texture, anti-caking agents cloud the brine.
*Confidence: strong.*

### 5.7 Verdict on §5

| Factor | Effect on rate | Worth modelling? |
|---|---|---|
| Batch/vessel size, 1 L–30 L | Not demonstrated; colonisation failure only below ~1 g; no study varies vessel size with pH/time as the outcome | **No** |
| Thermal mass of a large crock | Damps daily swings (95 % response ≈42 min at 1 L vs ≈3.3 h at 20 L); ~10 % on a forecast-integrated estimate | Marginal — only if using an hourly forecast |
| Surface-to-volume ratio | A/V ∝ 1/L: 0.566 cm⁻¹ at 1 L → 0.122 at 100 L. Affects O₂ ingress and the spoilage interface, not bulk rate | No (safety only) |
| **Sugar diffusion into whole vegetables** | **The rate-limiting step: t₉₅ ≈ 39 d for sugar vs ≈10 d for salt in a typical pickling cucumber; peeling speeds it 7–11×** | **Yes — this *is* the particle-size term** |
| Salt diffusion into whole vegetables | Salt itself reaches 95 % in ~1–18 d depending on size; the first ~48 h is dilution/equilibration, not fermentation | Yes, as part of the particle-size term |
| **Salt concentration 1.5–3 %** | **Flat to slightly inverted** — Stamer 1971: generation times within 5–10 % of no-salt at 2.25 %, +33–67 % at 3.5 %; 2.5 % is the confirmed optimum | **Yes — the current monotonic term is wrong** |
| Salt concentration <1.5 % | Slightly slower *and* unreliable without a starter | Yes |
| Salt concentration >3.5 % | Real, non-linear slowing; ~10 % stops fermentation | Yes (if the app allows it) |
| Vessel material (non-porous) | No rate effect demonstrated; the seal controls gas exchange | No |
| Vessel closure | ~0.5 pH units at day 3, 1.8× lactic acid at day 7 (glass+airlock vs stoneware+foil) | Advice + first-3-days risk flag |
| Agitation/tumbling during salting | Salt diffusion coefficient ×29 for kimchi cabbage | Not modellable (no pH outcome measured) |

---

## 6. Naturally present inhibitory compounds in ingredients

### 6.1 Garlic (*Allium sativum*) — allicin and thiosulfinates

**The in-model-system evidence is contradictory, which is itself the finding.**

| Study | Design | Result |
|---|---|---|
| **Choi, Park, Kim, Seo, Whon, Roh & Son (2024)**, "Selective influence of garlic as a key ingredient in kimchi on lactic acid bacteria in a fermentation model system", *Heliyon* 10:e24503, doi:[10.1016/j.heliyon.2024.e24503](https://doi.org/10.1016/j.heliyon.2024.e24503) | Controlled kimchi model, 9 LAB strains, mixed and individual starters, ±garlic | "**The group without garlic using mixed starters showed the highest LAB growth activity**, which influenced lactic acid production, pH, and titratable acidity." Garlic changed LAB composition (*Latilactobacillus sakei*, *Levilactobacillus brevis*, *Leuconostoc*, *Weissella koreensis*) |
| **Jang, Kim, Jeong, Hwang & Lee (2024)**, "Exploring the influence of garlic on microbial diversity and metabolite dynamics during kimchi fermentation", *Heliyon* 10:e24919, doi:[10.1016/j.heliyon.2024.e24919](https://doi.org/10.1016/j.heliyon.2024.e24919) | Kimchi with **0 / 1 / 2 / 4 % (w/w) garlic**, full time course | In early fermentation "**the count of LAB, operational taxonomic units (OTUs), and Shannon index increased linearly with the increase in garlic content**"; garlic ≥2 % increased *Lactobacillus* and *Leuconostoc* abundance. Garlic behaves as a **nutrient/inoculum source**, not an inhibitor |
| **Choi, Lim, Kang, et al. (2024)**, "Changes in bacterial composition and metabolite profiles during kimchi fermentation with different garlic varieties", *Heliyon* 10:e24283, doi:[10.1016/j.heliyon.2024.e24283](https://doi.org/10.1016/j.heliyon.2024.e24283) | Kimchi ±garlic, several varieties | Garlic ↑ *Leuconostoc* and *Weissella*, ↑ mannitol and fructose — but **↓ lactic acid and putrescine**. So garlic *shifts* the fermentation and slightly *lowers* total acid |

**Finding 6.1a — garlic's real target is *yeast*, not LAB, and at 2–4 % it makes the ferment
*faster*, not slower.** The dose–response study is decisive: in real kimchi at 0 / 1 / 2 / 4 %
garlic, the **4 % batch acidified fastest** — lactic acid **29.85 vs 6.37 mM at week 1**
(Jang et al. 2024). Direct LAB suppression is demonstrable only when garlic's *own* epiphytic
LAB flora is autoclaved away first (Choi et al. 2024, model system). Garlic's large, repeatable
win is anti-yeast: **no white-colony yeast at day 100 with garlic, white colonies without**,
and a **17-day delay** in white-colony formation from a garlic-powder spray. Note the
preparation dependency: **raw only — drying destroys alliinase**, so garlic powder had *more*
alliin but *less* activity.
**Verdict: do not model garlic as a rate brake.** If anything it is a mild accelerator and a
real anti-kahm agent. *Confidence: moderate-to-strong for the anti-yeast effect; strong that it
does not slow acidification at recipe levels.*

### 6.2 Mustard / horseradish / wasabi — allyl isothiocyanate (AITC)

- AITC is a genuinely potent, broad-spectrum antimicrobial, used commercially in active
  packaging at part-per-million vapour concentrations.
- **AITC is a native volatile of sauerkraut itself.** Trial, Fleming, Young & McFeeters (1996),
  *J. Food Quality* 19:15–30, found AITC among the seven main sulfur compounds in the headspace
  of commercial sauerkraut juice — i.e. sauerkraut normally *makes* AITC from cabbage
  glucosinolates and ferments perfectly well. Kimchi likewise: 14 intact glucosinolates were
  quantified in kimchi and **total glucosinolate content fell 31–97 % during fermentation**
  (Kim SY, Yang J, Dang YM & Ha JH 2022, *Food Chemistry: X* 16:100417,
  doi:[10.1016/j.fochx.2022.100417](https://doi.org/10.1016/j.fochx.2022.100417)) — LAB
  metabolise these compounds; they do not stop them.

**Finding 6.2a — the AITC-vs-LAB literature is internally contradictory by ~100× and should
not be quoted as a MIC.** Two good datasets differ: **60–80 ppm biocidal** in broth versus
**no MIC up to 7,500 ppm** on agar. The most likely reconciliation is AITC's **volatility** —
it partitions into the headspace and escapes the brine in either system, so neither number
describes a real crock. *Confidence: weak-or-contested.* **Verdict: second-order for rate; do
not model.**

### 6.3 Hot peppers — capsaicin

**Finding 6.3a — there is no MIC of capsaicin against any LAB anywhere in the literature, and
the one controlled dose–response found no effect.** Across **4–50 mg/kg capsaicinoids** there
was **no pH or titratable-acidity difference**. Meanwhile gochugaru (Korean chilli powder)
carries **16.8–29.9 % free sugar** by weight — so in any real recipe the chilli is a *sugar
source*. *Confidence: strong that capsaicin is not a brake.* **Verdict: do not model capsaicin.
The app's chilli speed factors (jalapeño 1.2 → birds-eye 1.4 → habanero 1.3) should be
re-derived from sugar and tissue, not from Scoville — they currently have no mechanistic
basis.**

### 6.4 Tannins — grape leaves, oak leaves, tea, bay, horseradish leaves

**This one is real, well characterised, and it is a *texture* effect, not a rate effect.**

**Bell, Etchells, Williams & Porter (1950s), "Inhibition of Pectinase and Cellulase by Certain
Plants", *Botanical Gazette*** — [USDA-ARS Pickle Pubs p72](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p72.pdf). I read the original.

- Screened **71 leaf samples representing 61 species in 32 families**.
- The grape-leaf inhibitor (GLI) for pectinase and cellulase was "characterized as a
  water-soluble, heat-stable, high-molecular-weight organic substance", identified as
  **tannin-like** (precipitated by caffeine, nicotine sulfate and gelatin).
- "**Increasing concentrations of GLI caused a reduction of pectinase enzyme activity
  approaching 100 % inhibition**; reduction of cellulase activity was also obtained, but the
  percentage of inhibition was dependent on the enzyme source used."
- The **muscadine** grape group (*V. rotundifolia*) contained far more inhibitor than the Concord
  variety (*V. labrusca*).
- Etchells et al. (cited within) reported that "**increasing levels of grape-leaf extract gave
  increasing firmness to cucumbers**". The commercial process was not adopted, but home practice
  (one grape leaf per jar) reproduces exactly the assay conditions.

Follow-up work identifies the active principle precisely: a **condensed tannin
(leucoanthocyanidin polymer) of 17,000–20,000 Da** that works by **competitive inhibition of
polygalacturonase** (Bell & Etchells 1958, *Bot. Gaz.* 119:192; Bell, Etchells & Smart 1965,
*Bot. Gaz.* 126:40). Concentration and dose-response:
- Muscadine grape leaf contains **1,034 mg/100 g fresh leaf (~1.03 % FW)**; Concord ~5× less.
- **5 ppm → ~50 % inhibition; 25 ppm → >90 %; 100 ppm → >95 %** of both pectinase and cellulase.
- A practical dose of **23–47 g fresh leaf per kg cucumber** extracts to roughly 50–100 ppm —
  **right at the effective threshold.**
- **Drying destroys >50 % of the activity** (the inhibitor itself is heat-stable, losing only
  ~12 % in a boiling bath) — **so use fresh leaves; a dried leaf is worth about half a fresh one.**
- **Tea is a poor source** — *Thea sinensis* scored 1+ out of 61 species screened.

**Finding 6.4a — grape leaves work by tannin inhibition of the pectinase that softens pickles,
and the fermentation rate is genuinely unaffected — confirmed twice.** The USDA-ARS work states
"no apparent influence on total brine acidity, pH, and optical density"; Staninska-Pięta et al.
(2024), *Sustainability* 16:2431, doi:[10.3390/su16062431](https://doi.org/10.3390/su16062431),
found pH 3.50–3.58 with "no statistically significant changes in the kinetics of pH".
*Confidence: strong.* The reason is that LAB are **tannin-tolerant and tannase-positive** —
*L. plantarum* resumes growth up to 2.5 mM tannin (~4,250 µg/mL), and all 29 strains screened
carried the `tanB_Lp` gene.

**Note the measurement gap: there is no instrumental firmness data (newtons, grams-force or
shear) anywhere in the ARS corpus — the entire firmness evidence base is sensory panels. Do not
quote a firmness figure in newtons.**

### 6.5 Cinnamon, clove, allspice, oregano, thyme — essential-oil compounds

**Measured MICs against LAB — Dunn, Davidson & Critzer (2016), *J. Food Sci.* 81:M438,
doi:[10.1111/1750-3841.13202](https://doi.org/10.1111/1750-3841.13202)** (9 LAB species, MRS agar), against yeast/mould MICs (Nißl et al. 2021, *J. Fungi* 7:872, 13 strains):

| Compound | LAB MIC | Yeast/mould MIC | Selectivity window |
|---|---|---|---|
| **Cinnamaldehyde** | **~2,100 ppm** | **33–263 ppm** | **8–64× — the only favourable window** |
| Carvacrol | ~976 ppm | 1,952–3,904 ppm | None (yeasts *more* resistant) |
| Thymol | ~1,000 ppm | — | — |
| **Eugenol (clove)** | **~2,120 ppm** | 1,067–4,268 ppm | **None — overlapping, no usable dose** |
| Linalool | — | 870–6,960 ppm | — |

**Finding 6.5a — the decisive arithmetic: whole dried spices cannot stall a ferment.** At
realistic recipe amounts (0.1–3 % w/w), whole dried spices deliver roughly **1–125 ppm of active
compound** against LAB MICs of **1,000–2,100 ppm** — **one to three orders of magnitude short.**
Only *essential oils* and *high-dose clove* exceed the MIC, and both are actively harmful rather
than helpful. *Confidence: strong.* **Recipe-level spicing cannot stall a vegetable
fermentation — the fermentation's own lactic acid is a far more potent inhibitor than anything
in the spice rack** (see §6.6).

**Finding 6.5b — but two specific interventions demonstrably break a ferment:**

**1. Clove — the one clear demonstration, with the worst possible selectivity.**
Kang, Park & Yoo (2019), *Food Sci. Nutr.* 7(2): — 0.5 / 1.0 / 2.0 % clove powder in kimchi:
LAB **7.57 → 4.47 → 3.31 log at day 5**; by day 20 the control had fallen 6.73 → **1.30 log
(−5.4 log)** — **while yeasts and moulds were essentially untouched (5.45 → 5.18 log).**
**It kills the protection and spares the spoilage.** *Confidence: strong.*

**2. Thyme essential oil at 150 ppm — a real sauerkraut fermentation failed.**
Tuțulescu, Ionică & Stoica (2026), *Foods* 15(15):2746,
doi:[10.3390/foods15152746](https://doi.org/10.3390/foods15152746): LAB at day 12 fell
**6.47 → 4.06 log (−2.4 log)** and the terminal pH was **4.91 — above the 4.6 safety threshold**.
The authors chose the dose specifically to be *sub*-inhibitory; it was not. *Confidence: strong
for the failure; note this contradicts the agar MIC by ~15×, so the "sub-inhibitory" assumption
did not hold in a real brine — flagged as contested in magnitude, unambiguous in direction.*

**Finding 6.5c — cinnamon has the right selectivity and the wrong dose.** 1 g/kg delivers only
**6–20 ppm** cinnamaldehyde — **100–350× below the LAB MIC** — so a normal pinch is inert in both
directions. *Confidence: strong.* (A cinnamon *extract* concentrate is a different matter, and
10 % garlic powder + 1.75 % cinnamon extract delayed white-colony formation by 17 days at
10 °C — Kim M-J et al. 2021 — but that is not a recipe-level dose.)

**Finding 6.5d — a thymol/carvacrol meta-analysis claims LAB are resistant, but its own numbers
contradict the claim**: the lactobacilli median MIC (39.25 mg/L) was the **lowest** of any
microbial group it reviewed (Speranza et al. 2023). *Confidence: weak-or-contested.*

**Ranking of inhibitory risk in a real vegetable ferment:**

| Rank | Ingredient | Effect at recipe level | Evidence |
|---|---|---|---|
| 1 | **Clove** (ground, ≥1 %) | **Measured −5.4 log LAB kill at 2 %; spoilage untouched** | Strong |
| 2 | **Thyme/oregano essential oil** (≥150 ppm) | **Measured −2.4 log LAB; terminal pH 4.91 — failed** | Strong |
| 3 | Garlic (1–4 %) | ~1.0× or slightly **faster**; strong anti-yeast (≈17-day delay in white-colony formation) | Moderate-to-strong |
| 4 | Cinnamon / allspice (normal pinch) | ~1.0× — dose is 100–350× below MIC | Strong (inert) |
| 5 | Mustard/horseradish (seed/root) | ~1.0×; AITC effect is transient and volatile | **Contested (~100× MIC discrepancy)** |
| 6 | Chilli / cayenne | ~1.0× — **no capsaicin MIC against any LAB exists**; gochugaru is 16.8–29.9 % free sugar | Strong (inert) |
| 7 | Grape/oak leaves (1–2 fresh leaves per jar) | ~1.0× (rate unaffected); measurably firmer | Strong (mechanism), N/A (rate) |
| 8 | Salt (control) | The only ingredient with a large, measurable rate effect | §5.5. Strong |

### 6.6 Salt's own inhibition curve (the one that actually matters)

- **2–2.5 % NaCl:** lactobacilli slightly inhibited, cocci unaffected → *selects for the desirable
  fast initiator* (FAO Ch. 5).
- **1–3.5 %:** "*Leuconostoc mesenteroides* is highly influenced" (Andersson et al. 1988, p. 862).
- **10 %:** the upper limit for vegetable fermentation (Pederson 1979).
- **aw limits:** no sauerkraut organism grew below aw 0.95 with NaCl as the solute
  (Troller & Stinson 1981, *Appl. Environ. Microbiol.* 42:682–687). 3 % NaCl ≈ aw 0.982, so the
  aw mechanism is irrelevant at sauerkraut salt levels.

---

## 7. Starting pH and buffering capacity of the vegetable — **first-order, and completely unmodelled**

### 7.1 The measured quantity: acid demand at pH 3.0

The calculator's pH model uses one global starting pH (6.5) and one shape exponent. In reality
vegetables differ by more than a full pH unit at the start and, far more importantly, by
**3.6× in how much acid they absorb** on the way down.

**Little et al. (2022), *J. Food Sci.* 87:2121–2132**, Table 2 —
[PDF](https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p447.pdf).
Titration of fresh vegetable slurries, three lots each, to pH 3.0:

| Vegetable | Lactic acid needed (mM) | Same, as % w/v lactic acid | Lactic + acetic needed (mM) | Acetic acid alone (mM) |
|---|---|---|---|---|
| Green bean | **57.6 ± 1.5** | 0.52 % | 154 ± 14 | 463 ± 14 |
| Green bell pepper | 64.8 ± 3.0 | 0.58 % | 91 ± 7 | 189 ± 20 |
| Red ripe tomato | 65.0 ± 3.0 | 0.59 % | 77 ± 7 | >130 |
| Orange sweet potato | 72.3 ± 2.0 | 0.65 % | 350 ± 10 | 699 ± 28 |
| Green leaf lettuce | 135 ± 15 | 1.22 % | 98 ± 7 | 255 ± 15 |
| Broccoli | 173 ± 13 | 1.56 % | 189 ± 7 | 225 ± 20 |
| Sweet yellow corn | **210 ± 14** | 1.89 % | 133 ± 7 | 90 ± 5 |

**Finding 7.1a-ii — and the *anion* matters enormously, which is the most under-appreciated
number in this review.** The same table gives acid demand separately for **lactic** and **acetic**
acid, and the two orderings are almost *inverted*:

| Vegetable | Lactic acid to pH 3.0 (mM) | Acetic acid to pH 3.0 (mM) | Ratio |
|---|---|---|---|
| Green bean | **57.6** (lowest) | **463** (highest) | 8.0× |
| Sweet yellow corn | 210 (highest) | 90 (lowest) | 0.43× |
| Green bell pepper | 64.8 | 189 | 2.9× |
| Green leaf lettuce | 135 | 255 | 1.9× |
| Broccoli | 173 | 225 | 1.3× |

Acetic acid (pK 4.76) is largely **undissociated** at pH 3.0 and therefore a far weaker acidifier
per mole than lactic acid (pK 3.86) — **it takes 8× as much acetic acid as lactic to move green
bean to the same pH.** That is precisely why a heterofermentative, acetic-rich fermentation
(green bean, and any ferment dominated by *Leuconostoc*/*L. brevis*) **stalls with sugar still
present**: the acid it makes is the wrong acid for dropping pH. *Confidence: strong (measured,
triplicate).* **Modelling consequence: a calculator that tracks only "total acid" will
mis-predict pH for any vegetable whose fermentation is heterofermentative.**

⚠ **Denominator caveat, verified and flagged:** the titration was performed on a **50:50
vegetable:water slurry**, while the "calculated lactic acid equivalents" in the same table are
per unit vegetable tissue. **The two columns have different denominators and must not be
subtracted from one another.** Per-kg-of-tissue values are approximately double the slurry values.

**Finding 7.1a — the acid needed to acidify a vegetable to a fixed pH spans 57.6 → 210 mM, a
3.6× range.** Green bean needs 0.52 % lactic acid to reach pH 3.0; sweet corn needs 1.89 %.
*Confidence: strong* (three lots per vegetable, standard titration, published table).

**Finding 7.1b — the buffering is *not* primarily carbonate or protein; in cucumber it is
malic acid.** Breidt & Skinner (2022), *J. Food Protection* 85:1273–1281,
doi:[10.4315/JFP-22-068](https://doi.org/10.4315/JFP-22-068): "Malic acid was found to be the
principal buffer in this pH range [2–7], and the initial concentration correlated with sugar
utilization and final medium pH." Anthony & Breidt (2026), *J. Food Protection* 89:100718,
doi:[10.1016/j.jfp.2026.100718](https://doi.org/10.1016/j.jfp.2026.100718): removing malic acid
from a synthetic cucumber medium (normally ~9 mM at the start of commercial brines) cut lactic
acid production at 72 h from **70–90 mM to 33.9 ± 3 mM** and reduced growth from log₁₀ 9.0 to
log₁₀ 7.9 CFU/mL. *Confidence: strong for cucumber; moderate for generalisation to other
vegetables.*

### 7.2 The pH drop can be predicted from acid concentration and buffer capacity

**Breidt & Skinner (2022)** developed buffer models for cucumber juice fermented with
*Leuconostoc mesenteroides* (heterolactic) and *Lactiplantibacillus pentosus* (homolactic).
Predicting pH from measured acid concentration using the measured buffer capacity of the
*unfermented* medium gave a **root-mean-square error of 0.064 pH units** across 24 h and 48 h
samples. The models explicitly include a term for the malolactic reaction (malate → lactate +
CO₂), which is itself pH-relevant. *Confidence: strong — this is the best-validated
pH-from-acid model that exists for a vegetable fermentation.*

**Finding 7.2a — a calculator *can* do better than a fixed exponential pH curve: it can carry
per-vegetable (a) starting pH, (b) buffer capacity, and (c) initial malate, and compute pH from
cumulative acid. The published RMSE for that approach is 0.06 pH units.** This is the single
highest-value structural upgrade available to the timing model.

### 7.2b The buffer-capacity definition to use, and the published model to copy

**Lu, Fleming & McFeeters (2002)**, *J. Food Sci.* 67:2934–2939, define buffer capacity as
"**the milliequivalents of HCl required to reduce a 100-g sample of cucumber juice from the
initial pH to pH 3.5**" — i.e. anchored at the fermentation target, not at an arbitrary pH.
They found **buffer capacity *decreased* as cucumber diameter increased (27 → 51 mm)**, while
malic acid, pH and dry matter also decreased and glucose/fructose *increased*. So in cucumbers,
**bigger fruit = less buffer but more sugar** — which is exactly why the size effect on
*completion* runs opposite to the size effect on *rate*.

**Breidt & Skinner (2022)**, *J. Food Prot.* 85:1273–1281,
[free ARS PDF](https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p450.pdf),
give the model to copy — a buffer-capacity formulation, not an exponential pH curve:

```
β = 2.303 × [ Σ Ci·Ki·[H+]/([H+]+Ki)²  +  Kw/[H+]  +  [H+] ]        (their eq. 2)
0 = Σ[Ca·Ka/(Ka+[H+])] − Σ[Cb·[H+]/([H+]+Kb)] + Kw/[H+] − [H+] + adjC   (their eq. 3)
pK adjusted for ionic strength (Davies): pKadj = pKa − 1.02[√I/(1+√I) − 0.3I];  I = 0.342 M for 2 % NaCl
```

Their measured cucumber-juice buffers in the pH 3–5 region (the region that matters):
CJ1 (small, <27 mm) **18.15 mM at pK 3.27** and **16.70 mM at pK 4.46**; CJ2 14.85/13.94;
CJ3 (large) 13.68/12.50. **pH prediction RMSE = 0.064 pH units.** Their conclusion:
"**greater buffering in CJ1 compared with CJ2 and CJ3 explains the differences in sugar
utilization and acid production**."

**Free tooling exists:** Breidt (2023), "BufferCapacity3", *SoftwareX* 22:101351,
doi:[10.1016/j.softx.2023.101351](https://doi.org/10.1016/j.softx.2023.101351) — a Matlab GUI
that computes buffer capacity from titration data; and IngredientDB (*SoftwareX* 24:101545) ships
buffer-capacity matrices for 41+ food ingredients. *Confidence: strong.*

**Finding 7.2b — a calculator can adopt a published, validated pH model rather than inventing
one.** The two-buffer (pK ≈ 3.2 and pK ≈ 4.4) representation is sufficient for cucumber and is
the natural starting shape for other vegetables. *Confidence: strong for cucumber; moderate for
transferability.*

### 7.2c How much acid to reach pH 4.0 / 3.5

**No published table gives grams of lactic acid per kg to reach pH 4.0 or 3.5 for any individual
vegetable — it must be computed.** The nearest published table is Little et al.'s at pH 3.0,
converted to g per kg of their 50:50 vegetable:water slurry
(×0.09008 g/mmol):

| Vegetable | g lactic acid per kg *slurry* | ≈ g/kg *vegetable* |
|---|---|---|
| Green bean | 5.19 | ≈10 |
| Green bell pepper | 5.84 | ≈12 |
| Red ripe tomato | 5.86 | ≈12 |
| Orange sweet potato | 6.51 | ≈13 |
| Green leaf lettuce | 12.16 | ≈24 |
| Broccoli | 15.58 | ≈31 |
| Sweet yellow corn | 18.92 | ≈38 |

**Indirect anchors for cabbage** (Fleming 1987, [p201](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p201.pdf),
Fig. 3, interpolated — titratable acidity expressed as lactic acid; measured points 0.84 % at
pH 4.4, 1.40 % at pH 3.9, 2.20 % at pH 3.4):

| Target pH | Lactic acid required |
|---|---|
| **pH 4.0** | **≈ 8–12 g per kg vegetable** |
| pH 4.4 | ≈ 8–9 g/kg |
| **pH 3.5** | **≈ 18–22 g per kg vegetable** |
| pH 3.4 | ≈ 20 g/kg |

Real sauerkraut endpoints: raw kraut pH 3.2–3.4 at titratable acidity 2.1–3.3 %; finished
commercial product 0.93–2.75 % (Fleming & McFeeters 1985,
[p182](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p182.pdf)).
*Confidence: strong for the Little et al. table; moderate for the cabbage conversions ([my calc]
on plotted titration curves, ±15 %).*

**★ Finding 7.2c-i — the single most important structural insight for a timing model: pH 4.0 is
reached after only ~25–40 % of the sugar has been consumed.** Cabbage needs ~8–12 g lactic acid
per kg to reach pH 4.0 but ~18–22 g/kg to reach pH 3.5 — so **"time to pH 4.0" and "time to full
fermentation" differ by roughly a factor of two to four, not by a small margin.** A calculator
that reports one number for "ready" is conflating two genuinely different endpoints:
*acidification to safety* and *complete conversion of sugar*. *Confidence: moderate-to-strong
([my calc] on measured titration data).* **This is the strongest argument in the review for
surfacing two separate dates in the UI.**

**And no published "extra days per unit buffer capacity" figure exists** — the high-buffer
penalty manifests as **incomplete fermentation, not merely more days** (sweet potato and sweet
corn never finished in 21 days with substantial sugar remaining, Little et al. 2022), so it
cannot be expressed as a duration multiplier at all.

### 7.3 Does buffering change *time* to pH 4.0/3.5 materially?

- **Yes, mechanically.** At a fixed acid-production rate, time to a target pH scales with
  buffer capacity. A 3.6× spread in acid demand (§7.1) means up to ~3.6× in time-to-pH if the
  acid-production rate were equal — i.e. **sweet corn would take ~3.5× as long as green bean**
  to reach the same pH.
- **But the acid-production rate is not equal**, and high-buffer vegetables tend to also be
  high-sugar, which partially compensates — until the pH inhibition sets in.
- **Empirically, high-buffer vegetables stall rather than merely slow.** Little et al. found
  that the moderate/high-sugar, high-buffer vegetables (green bean, green bell pepper, tomato,
  sweet potato, sweet corn) finished **incomplete at pH 3.1 ± 0.2 with residual sugar**, and the
  authors' stated diagnostic is that spoilage typically develops "in batches that reach a pH of
  3.3, prior to the complete disappearance of simple sugars". *Confidence: moderate* (single
  study, pre-acidified brines, 30 °C).

**Finding 7.3a — the right way to model buffering is as a *floor*, not a multiplier.** A
vegetable with high buffer capacity and finite sugar does not ferment slowly to pH 3.5; it
ferments normally to some achievable pH and stops. The achievable pH is set by
(sugar × yield) vs (buffer capacity). This is the model Little et al. used, and they validated
it across eight vegetables. *Confidence: moderate-to-strong.*

### 7.4 Starting pH of raw vegetables

The calculator assumes pH 6.5 for everything. Fresh vegetables are typically pH 5.3–6.5, and a
few are meaningfully lower:

| Vegetable | Typical fresh pH | Note |
|---|---|---|
| Cabbage, napa, most leafy brassicas | 5.8–6.4 | Reference assumption 6.5 is at the top of the range |
| Cucumber | 5.1–5.7 | |
| Tomato (ripe) | 4.1–4.6 | **A ripe tomato is already an acid food under 21 CFR 114** |
| Beetroot | 5.3–6.0 | |
| Onion | 5.3–5.8 | |
| Green bean, pepper | 5.4–6.0 | |

**Measured values (from the primary studies cited elsewhere in this review), which are stronger
than the handbook ranges above:**

| Vegetable | Measured pH | Source |
|---|---|---|
| Pickling cucumber, cv. Hanzil | **5.92 ± 0.11** (n = 3) | Fan et al. (2024), *J. Food Compos. Anal.* 129:106065 |
| Pickling cucumber, cv. Vlaspik | **5.93 ± 0.13** (n = 3) | Same |
| Cauliflower | **5.46** | Qinghang et al. (2023), *Curr. Res. Food Sci.* 6:100493 |
| Broccoli | **5.32** | Same |
| Green leaf lettuce | **5.90 ± 0.04** | Little et al. (2022) |
| Green pea | **6.00 ± 0.60** | Same |
| Red ripe tomato | **4.60 ± 0.50** | Same |
| Cabbage must (day 0) | **≈6.2** | Fleming (1987), ARS p201, Fig. 3 |

Note the tomato: at pH 4.6 it is *already* an acid food under 21 CFR 114, so a tomato ferment
starts at the safety threshold rather than approaching it. And cucumber measured pH 5.9 is
**0.6 units below the calculator's assumed 6.5** — worth fixing, since it is free accuracy.

*Confidence: strong for the measured rows; weak-to-moderate for the handbook ranges — I could
not find a single primary source tabulating measured pH for all of cabbage/napa/carrot/beet/
radish/garlic/onion with n and method. That is a genuine (if minor) gap.*

*Confidence: moderate — these are well-established ranges but I did not locate a single
primary table that gives all of them under one method; treat as handbook values, not measured
data. **The consequence of a starting-pH error of ±0.5 is small** (roughly 1/6 of the total
pH span to 4.0), so this is second-order compared with buffer capacity.*

### 7.5 Verdict on §7

**Buffer capacity is the largest unmodelled substrate property and belongs in the model.**
Practical encoding: give each vegetable a `bufferCapacity` (mM acid per pH unit, or simply
"mM lactic acid to reach pH 3.0" from the Little et al. table) and a `fermentableSugar`
(g/100 g), then compute `achievableMinPH` and scale time-to-target by the ratio of the user's
vegetable buffer to the recipe's reference buffer. Starting pH matters much less; keep 6.5 or
use a per-category value (brassicas 6.2, cucurbits 5.5, tomato 4.4).

---

## 8. What "READY" means scientifically

### 8.1 The regulatory thresholds

| Threshold | Meaning | Source | Confidence |
|---|---|---|---|
| **pH 4.6** | Boundary between "acid" and "low-acid" food. *Acid foods* = natural pH ≤ 4.6. *Acidified foods* = low-acid foods with acid added, **aw > 0.85 and finished equilibrium pH ≤ 4.6**. *Low-acid foods* = **finished equilibrium pH > 4.6 and aw > 0.85** — the *C. botulinum* risk class | **21 CFR § 114.3** (definitions), [law.cornell.edu/cfr/text/21/114.3](https://www.law.cornell.edu/cfr/text/21/114.3) | **Strong — it is the regulation** |
| **pH 3.3** | Above pH 3.3, acidified vegetable products **must be heat-processed** to assure destruction of *E. coli* O157:H7, *Salmonella*, *Listeria monocytogenes*. Below 3.3, fermentation metabolites alone are accepted as the antimicrobial | Breidt, Sandeep & Arritt (2010), "Use of Linear Models for Thermal Processing of Acidified Foods", *Food Protection Trends* 30(5):268–272, [USDA-ARS p368](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p368.pdf) | **Strong** |
| **pH 3.3** (biological, not regulatory) | Reported as the pH at which *Lactiplantibacillus plantarum* growth is inhibited; continued acid production can push the pH to ~3.0 | Little et al. (2022), citing Di Cagno et al. 2008; McDonald et al. 1991 | Moderate |
| **≥1.5 % acid as lactic acid, 2–3 % salt** | The US grade standard definition of fully fermented bulk sauerkraut: "the product of characteristic acid flavor, obtained by **the full fermentation, chiefly lactic**, of properly prepared and shredded cabbage in the presence of **not less than 2 percent nor more than 3 percent of salt**. It contains, upon completion of the fermentation, **not less than 1.5 percent of acid, expressed as lactic acid**." Grade A shreds are "uniformly cut to approximately **1/32-inch** in thickness" | USDA AMS, [Bulk Sauerkraut Grades and Standards](https://www.ams.usda.gov/grades-standards/bulk-sauerkraut-grades-and-standards) | **Strong** |
| **pH < 4.1 AND lactic acid ≥ 0.75 g/100 mL** | The German *Leitsätze für Gemüseerzeugnisse* §8 specification for sauerkraut, measured in the expressed juice (*Presslake*) | German Food Code (*Leitsätze*), §8 | Moderate (translated secondary citation) |

**Finding 8.1a — the calculator's three anchors (4.6 safety, 4.0 target, 3.5 final) are the
right anchors, but it is missing the 3.3 threshold that determines whether the product is
*self-preserving*.** pH 4.0 is a good "ready to eat" marker; pH 3.3 is the marker for "safe to
store without refrigeration or heat treatment". *Confidence: strong.*

**Finding 8.1b — three commonly repeated "thresholds" are not what people claim:**
- **"pH 4.6 must be reached within 24 h" is NOT in 21 CFR 114.** §114.80(a)(1) says only
  "within the time designated in the scheduled process." The 24 h figure traces to Acosta et al.
  (2014), *J. Food Prot.* 77:788, *characterising* federal rules, not to the regulation.
  Separately, the Pennsylvania Department of Agriculture's "24 h" is a **measurement-wait rule**
  (wait 24 h before taking the equilibrium pH reading), not a deadline. The two are constantly
  conflated. *Confidence: strong.*
- **Penn State Extension contains no numeric pH target for sauerkraut, and the USDA *Complete
  Guide to Home Canning* Guide 6 contains zero occurrences of "pH" in 36 pages** (both verified
  by full-text extraction). Extension guidance for home fermenters is process-based, not
  pH-based. *Confidence: strong.*
- **"Commercial sauerkraut targets pH 3.5–3.8" is not substantiated.** Commercial kraut is
  specified by **titratable acidity: 0.9–1.5 % across eight US producers** (Trial, Fleming,
  Young & McFeeters 1996). pH 3.5 and 3.8 are USDA-ARS *experimental* bands, not mandates.
  *Confidence: strong.*

### 8.2 Where real products actually finish

| Product | pH | Titratable acidity | Salt | Source |
|---|---|---|---|---|
| Commercial canned US sauerkraut | — | **0.9–1.5 %** (as lactic) | 1.4–2.0 % | Trial, Fleming, Young & McFeeters (1996), *J. Food Quality* 19:15–30, doi:[10.1111/j.1745-4557.1996.tb00402.x](https://doi.org/10.1111/j.1745-4557.1996.tb00402.x) |
| Bulk sauerkraut, US grade standard | — | **≥1.5 %** at completion | 2–3 % | USDA AMS (above) |
| Wild cucumber brine, 20° salometer | **3.4–3.8** by day 7–14, ≈3.7 at day 28 | 0.8 % by day 7, plateau | 5.3 % brine | Jones & Etchells (1943), [p19](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p19.pdf) Fig. 1/2 |
| N₂-purged cucumber tank | **3.4 at day 14** | 1.1 % | 2.7–4.6 % equilibrated | Potts & Fleming (1979), [p138](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p138.pdf) |
| Kimchi, fresh → optimal → over-fermented | 5.5 → **4.6** → 3.8 | 0.48 % → **0.70 %** → higher | — | Oun, Roy, Hong, Shin, Yoo & Kim (2024), *Int. J. Biol. Macromol.* 270:132343, doi:[10.1016/j.ijbiomac.2024.132343](https://doi.org/10.1016/j.ijbiomac.2024.132343) |
| Sinki (non-salted fermented radish, 30 °C) | 6.7 → **3.3** in 12 days | — | none | FAO Ch. 5 |
| Pit fermentation (starchy roots) | 6.7 → **3.7** in ~4 weeks | — | none | FAO Ch. 5 |

**Finding 8.2a — "fully sour" sauerkraut is operationally 1.5 % lactic acid, which corresponds
to roughly pH 3.4–3.6, not pH 4.0.** pH 4.0 is where a ferment is *safe and pleasantly sour*;
pH 3.5 is where it is *fully sour and shelf-stable*. **Kimchi is a different product with a
different target: Koreans eat it at pH 4.2–4.6 (fresh/optimal) and consider pH 3.8
over-fermented.** *Confidence: strong for sauerkraut (regulatory + survey data agree); moderate
for kimchi (one packaging study's classification, though it matches common practice).*

### 8.3 The sensory map onto time — half-sour to full-sour

The classic acidity staging of a sauerkraut fermentation (FAO Ch. 5, describing the Pederson
succession):

1. ***Leuconostoc mesenteroides*** initiates. "When the acidity reaches **0.25 to 0.3 %**
   (calculated as lactic acid), these bacteria slow down and begin to die off."
2. Lactobacilli (*L. plantarum*, *L. cucumeris*) continue "until an acidity level of **1.5 to
   2 %** is attained."
3. *L. pentoaceticus* (*L. brevis*) "continues the fermentation, bringing the acidity to
   **2 to 2.5 %** thus completing the fermentation."

**Finding 8.3a — the transition from "half-sour" to "full-sour" corresponds to crossing roughly
0.3 % → 1.0–1.5 % titratable acidity, i.e. the handoff from the heterofermentative
*Leuconostoc* phase to the homofermentative *Lactobacillus* phase.** For dill pickles the same
distinction is commercial practice: "overnight dill" pickles are fermented in **2–4 % NaCl**;
"genuine dill" pickles in **4–5 % NaCl**; "salt-stock" cucumbers in **5–8 % NaCl** followed by
raising to **10–16 %** (Andersson, Daeschel & Eriksson 1988, [p210](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf), p. 858, citing Fleming 1984).
*Confidence: strong for the acidity thresholds and the salt classification; **weak** for a
published sensory panel mapping those thresholds onto named "half-sour"/"full-sour" labels —
I could not find a peer-reviewed sensory-time study that does this explicitly.*

### 8.4 Time vs temperature: the numbers the model needs

**The cleanest published temperature–time curve is for kimchi.** Kim JY et al. (2020),
*Foods* 9(8):1075 (Korea Food Research Institute),
doi:[10.3390/foods9081075](https://doi.org/10.3390/foods9081075)
([PMC7465714](https://pmc.ncbi.nlm.nih.gov/articles/PMC7465714/)), as reproduced in the BCCDC
*Guidelines for Fermented Foods* §3.3 — **days to pH 4.6**:

| Temperature | Days to pH 4.6 |
|---|---|
| 20 °C | **2** |
| 10 °C | **6** |
| 5 °C | **15** |
| 0 °C | **35** |

Full trajectories (initial pH 5.93): at 20 °C → 4.43 at day 2 and 3.83 at day 10; at 10 °C →
4.14–4.24 by day 10, then flat at 4.05–4.15; at 5 °C → 4.14–4.24 by day 20; at **0 °C the pH
held at 5.93–6.06 for 14 days and only reached 4.57 by day 28 — no exponential phase at all.**
Terminal acidity rises with temperature: Nmax = 0.878 + 0.0160·T.

*Confidence: strong for the day counts (single well-instrumented study, reproduced by a public
health authority).*

**Finding 8.4a — the temperature response is NOT Arrhenius; there is a threshold near 5 °C.**
Kim et al. use a polynomial µmax(T) model rather than Arrhenius, and the implied Q10 is not
constant: **[calc, derived — not a published figure] Q10 ≈ 3 (Ea ≈ 76 kJ/mol) over 10–20 °C,
but Q10 ≈ 5.8 (Ea ≈ 113 kJ/mol) over 0–10 °C.** *Confidence: moderate — this is my arithmetic
on published day counts, and the non-constant Ea is the signature of a threshold rather than a
true Arrhenius process.* **Modelling consequence: use Q10 ≈ 2–3 only over roughly 10–30 °C, and
treat ≤ 5 °C as near-arrest rather than extrapolating.** (See §8.5 for the full reconciliation:
the calculator's 2.5 is well supported in the 15–30 °C core, but too shallow below ~12 °C and
too steep above ~30 °C.)

**Other measured temperature–time anchors:**

| Vegetable / system | Temperature | Time to target | Source |
|---|---|---|---|
| Shredded cabbage sauerkraut (wild) | 18–22 °C | pH < 4.0 in **3 days** | Müller et al. 2018 |
| Shredded cabbage sauerkraut (starter) | — | pH < 4.0 in **< 24 h** | Müller et al. 2018 |
| Shredded cabbage sauerkraut (wild, with pathogens) | 18 / 22 °C | Complete at **15 days** | Niksic et al. 2005 |
| Whole-head cabbage sauerkraut | 18 / 22 °C | Complete at **28 days** | Niksic et al. 2005 |
| Whole-head cabbage + starter | — | **14 days faster** | Beganović et al. 2011 |
| Blanched cabbage + *L. paracasei* | 25 °C | **pH 4.12 in 71 h** | Sarvan et al. 2013 |
| Cucumber, 20° salometer brine (wild) | summer ambient (≈23–30 °C) | **pH ≈3.8–4.2 at day 7; ≈3.7–3.8 at day 14** | Jones & Etchells 1943 |
| Cucumber, N₂-purged, 2.7–4.6 % NaCl, *L. plantarum* | 23–28 °C | **pH 3.4 at day 14** | Potts & Fleming 1979 |
| Cabbage, 58-gal barrel, 2.5 % salt | 6.1 / 20 / 25–28 °C | Final acidity **0.26 % / 1.90 % / 2.24 %** in 260 / 423 / 305 h | Preuss et al. 1928 |
| Sichuan sauerkraut, total-acid development | 25 / 35 / 45 °C, **Ea = 47.23 kJ/mol** for total acid | — | Du et al. (2022), *Foods* 11:1762, doi:[10.3390/foods11121762](https://doi.org/10.3390/foods11121762) |
| **Sauerkraut optimum as codified** | **2.0–2.25 % salt, 18 °C** | — | Pederson & Albury 1969, restated by Johanningsmeier et al. 2007, [ARS p348](https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf) |
| Sauerkraut initiation optimum | **18–22 °C** (optimum for *L. mesenteroides*); "temperatures above 22 °C favour *Lactobacillus*" | — | FAO Ch. 5; Andersson et al. 1988 (optima: *L. mesenteroides* 20–30 °C, other LAB 30–35 °C) |
| **Sauerkraut, practical extension guidance** | **21–24 °C → 3–4 weeks; ~16 °C → 5–6 weeks** | — | Oregon State Extension PNW 355, *Pickling Vegetables* |
| **Sauerkraut, practical extension guidance** | **21–24 °C (70–75 °F) → 3–4 weeks; 16–18 °C (60–65 °F) → 6 weeks; below 16 °C may not ferment; above 27 °C spoils** | — | Penn State Extension, *Sauerkraut* |
| Sauerkraut, optimal band | **15–20 °C optimal; 10–25 °C limits** | — | BCCDC *Guidelines for Fermented Foods* |
| Kimchi, week-1 chemistry | 4 °C → pH 5.09 / 0.75 % acid; 10 °C → pH 4.21 / 1.69 % acid | — | Jung et al. (2024), *Heliyon* 10:e27174 |
| **★ Kimchi, days to optimal pH 4.0–4.5** | **3 days at 15 °C vs 47 days at 4 °C — a ~15× span** | — | Kim J et al. (2025), *Foods* 14(16):2826, doi:[10.3390/foods14162826](https://doi.org/10.3390/foods14162826) ([PMC12385461](https://pmc.ncbi.nlm.nih.gov/articles/PMC12385461/)) |
| **★ Sauerkraut, commercial vats, days to 0.5 % titratable acidity** | **6.7 °C → 11 d; 11.7 °C → 6 d; 18.3 °C → 3 d; 24.4 °C → 1 d** | — | **Parmele, Fred, Peterson, McConkie & Vaughn (1927)**, *J. Agric. Res.* 35(11):1021, p. 1025 — [archive.org full text](https://archive.org/download/sim_journal-of-agricultural-research_1927-12-01_35_11/sim_journal-of-agricultural-research_1927-12-01_35_11_djvu.txt) |
| **★ Sauerkraut, controlled isothermal (Pederson & Albury 1969, Bulletin 824, Fig. 6)** | 7.5 °C: 0.4 % acid @ ~10 d, 0.8–0.9 % @ ~30 d, **may take 6+ months to complete**. 18 °C: final 1.7–2.3 % (acetic:lactic ≈ 1:4). **23 °C: 1.0–1.5 % @ 8–10 d; complete in ~1 month**. 32 °C: 1.8–2.0 % @ 8–10 d | — | Pederson & Albury (1969), NY State Agric. Exp. Sta. Bulletin **824**, [handle 1813/4794](https://hdl.handle.net/1813/4794) |
| **★ Isothermal acid production, % of each species' maximum** (Pederson & Albury 1969, Table 1) | *Lc. mesenteroides* at 1 / 2 days: 3/25 (10 °C), 19/47 (15 °C), 50/84 (20 °C), 77/94 (25 °C). *L. plantarum* at 2 days: 0 (10 °C), 0 (15 °C), 31 (20 °C), 54 (25 °C) | — | Same |

**Finding 8.4b — the practical sauerkraut anchors now triangulate well:** 3–4 weeks at 21–24 °C and
5–6 weeks at ~16 °C (two independent extension sources), which is **~1.6–1.7× per 6–8 K** — flatter
than the calculator's Q10 = 2.5 implies. See §8.5.

### 8.5 **The temperature coefficient: Q10 = 2.5 is well supported in the 15–30 °C core — the errors are at the ends of the range**

This is the factor the calculator already models, and the honest verdict is more favourable than
an earlier draft of this review suggested. The calculator uses **Q10 = 2.5**, implying Ea ≈ 68.6
kJ/mol at a 22 °C reference. Seven independent estimates bracket it:

| Source | What was measured | Implied Q10 |
|---|---|---|
| **Laureys et al. (2022)**, *Front. Microbiol.* 13:871550, doi:[10.3389/fmicb.2022.871550](https://doi.org/10.3389/fmicb.2022.871550) — **the single best direct measurement** | Volumetric **lactic acid production rate**, Arrhenius fit over **17–29 °C** (water kefir; LAB-dominated) | **2.64 [95 % CI 2.30–3.04]** |
| Same paper, other metabolites | Ea 45.8–76.3 kJ/mol | 1.86–2.81 |
| **Zurera-Cosano et al. (2006)**, via Wang et al. (2013), doi:[10.1371/journal.pone.0064995](https://doi.org/10.1371/journal.pone.0064995) | *Lc. mesenteroides* **growth rate**, 10.5–24.5 °C, 3.25 % NaCl | **2.19 (aerobic) – 2.62 (anaerobic)** |
| **Pederson & Albury (1969)**, NY State Agric. Exp. Sta. Bulletin 824, [handle](https://hdl.handle.net/1813/4794) | *L. plantarum* acid production, isothermal broth, 20→25 °C | **1.74** |
| Same, *Lc. mesenteroides*, 15→25 °C | isothermal broth | **2.0** (and ~3.4 over 10→20 °C) |
| **Parmele, Fred, Peterson, McConkie & Vaughn (1927)**, *J. Agric. Res.* 35(11):1021, [archive.org](https://archive.org/download/sim_journal-of-agricultural-research_1927-12-01_35_11/sim_journal-of-agricultural-research_1927-12-01_35_11_djvu.txt) | Commercial vats: days to 0.5 % titratable acidity | **≈3.0 (7→18 °C); ≈3.6 (18→24 °C)** |
| **Du et al. (2022)**, *Foods* 11:1762, doi:[10.3390/foods11121762](https://doi.org/10.3390/foods11121762) | Ea for total-acid change in sauerkraut, **25–45 °C storage** | **1.88** |
| **Ratkowsky fit for *L. plantarum*** (Zwietering et al. 1994, *Appl. Environ. Microbiol.* 60:195) | μmax(T) | 2.03 (15→20 °C), **1.67 (20→25 °C)**, 1.46 (25→30 °C) |
| **Kim JY et al. (2020)**, *Foods* 9(8):1075, doi:[10.3390/foods9081075](https://doi.org/10.3390/foods9081075) | Kimchi, days to pH 4.6, **[calc, derived]** | 3.0 (10→20 °C); **5.8 (0→10 °C)** |
| **Calculator's Q10 = 2.5** | — | **2.50** |

**Finding 8.5a — Q10 = 2.5 sits inside the measured confidence interval of the best direct
measurement (2.64, CI 2.30–3.04) and in the middle of the whole measured band (1.7–3.0). Keep
it for the 15–30 °C core.** An earlier draft of this review recommended reducing it to ~1.9 on
the strength of the sauerkraut storage Ea alone; that was over-correction. The sauerkraut Ea
(47.23 kJ/mol) is a **storage** parameter measured at 25–45 °C, and it is the *lowest* of the
seven estimates, not the most representative. *Confidence: strong that 2.5 is defensible in the
core range.*

**Finding 8.5b — the real errors are at the two ends of the range, and both are structural, not
coefficient errors.**

| Range | What the evidence says | Recommended treatment |
|---|---|---|
| **> 30 °C** | Q10 falls to ~1.3–1.5 (Ratkowsky); the LAB community shifts to *Lactobacillus*/*Pediococcus* (optimum 30–35 °C) | **Flatten** the curve (Q10 ≈ 1.4) and reframe the existing >35 °C penalty as a *quality* penalty (softer, differently flavoured), not purely a rate one |
| **15–30 °C** | Q10 ≈ 1.7–2.6 across every source | **Keep 2.5** — this is the calculator's home range |
| **10–15 °C** | Q10 ≈ 2.5–3.0 | Slightly **steepen** |
| **5–10 °C** | Kimchi-derived Q10 ≈ 5.8; the fermentation is clearly into a different regime | **Steepen to ≈3.5–4.5** |
| **≤ 5 °C** | **At 0 °C kimchi held pH 5.93–6.06 for 14 days with no exponential phase at all**, reaching only 4.57 by day 28; at 5 °C, 15 days to pH 4.6. Pederson & Albury: at 7.5 °C sauerkraut reached only 0.4 % acid in ~10 days and "may not be completely fermented for 6 months or more" | **Add a floor.** This is the model's single biggest temperature defect: it will return "3 days" for a 4 °C ferment that will in practice take a month or stall |

*Confidence: moderate-to-strong for the shape; moderate for the specific steepened values in the
cold range, which rest partly on derived arithmetic. Note the honest tension: a Ratkowsky fit
implies Ea ≈ 87 kJ/mol over 15–25 °C, while the sauerkraut storage measurement gives 47.2 — a
factor of ~1.8. **Any single Ea here should be treated as ±2×, and the disagreement is itself
the finding: this process is not Arrhenius.***

**Finding 8.5c — the stage-dependence explains the apparent contradictions between sources.**
Early, *Leuconostoc*-dominated acidification is steeply temperature-dependent, while the later
homofermentative stage is flatter. That is exactly what the isothermal data show: *Lc.
mesenteroides* acid production rises ~3.4× from 10 to 20 °C, whereas *L. plantarum* rises only
~1.7× from 20 to 25 °C. A single-Q10 model is a compromise between two regimes with different
coefficients — which is a further argument for a piecewise curve rather than a constant.

**Finding 8.5d — the model's >35 °C cliff is directionally right.** FAO and ARS both place the
*L. mesenteroides* optimum at 18–22 °C (ARS: 20–30 °C) and the *Lactobacillus*/*Pediococcus*
optimum at 30–35 °C, so the community does shift above ~30 °C. But the shift makes fermentation
*differently flavoured and softer*, not necessarily slower. *Confidence: moderate.*

**Finding 8.5e — salt and temperature interact, and the model ignores it.** Zurera-Cosano's
*Lc. mesenteroides* data show the anomalous shape expected under salt stress: only ~1.25× from
10.5 to 17.5 °C but ~2.4× from 17.5 to 24.5 °C at 3.25 % NaCl. **Salt suppresses the rate at the
cold end specifically**, because the organism is already stressed. *Confidence: moderate
(single dataset). A defensible refinement, if the app ever wants one: make the low-temperature
penalty worse at higher salt.*

### 8.6 pH versus titratable acidity as the readiness metric

**Finding 8.6a — pH is the safety metric; titratable acidity is the taste metric; the
calculator should expose both.** pH is what determines whether *C. botulinum* can grow (4.6) and
whether the product is self-preserving (3.3). Titratable acidity is what the palate reads and
what the US grade standard specifies (≥1.5 % as lactic acid). They are not interchangeable
because buffer capacity changes during fermentation — Breidt & Skinner (2022) show pH must be
predicted from acid *plus* buffer capacity plus the malolactic reaction, with 0.064 pH units
RMSE. *Confidence: strong.*

**Finding 8.6b — for sensory ripeness, titratable acidity predicts better than pH.** Across all
four temperatures tested in the kimchi ripening study, TA correlated with sensory ripeness at
**r = 0.93–0.95, versus r = −0.86 to −0.92 for pH**. Kimchi's optimum is **TA 0.5–0.8 %**
(over-ripened above ~1.0 %), corresponding to **pH ≈4.2–4.3**. *Confidence: moderate-to-strong.*
**Practical consequence: if the app ever offers a "taste check", the honest proxy is
"sourness ≈ time × temperature", not a pH number — and the consumer-facing target for a
kimchi-style ferment (pH 4.2–4.6) is genuinely different from a sauerkraut-style one
(pH 3.5–3.8).**

### 8.7 The achievability question — will it get there at all?

The calculator assumes every ferment reaches pH 3.5. Little et al. (2022) show that is not true.
Their rule — compare the acid obtainable from intrinsic sugar against the acid buffered by the
matrix before the LAB-inhibitory pH (they use 3.30) — classified all eight test vegetables
correctly:

| Vegetable | Prediction | Observed |
|---|---|---|
| Green leaf lettuce, broccoli, green pea | low sugar → **will complete** | completed |
| Green bell pepper, tomato, green bean | moderate sugar → **incomplete** | incomplete at pH 3.1 ± 0.2 |
| Sweet potato, sweet corn | high sugar → **incomplete** | incomplete |

**Finding 8.7a — a consumer calculator should carry a per-vegetable `achievableMinPH` and warn
when the requested target is below it, rather than extrapolating the timeline to a pH the
vegetable cannot reach.** This is precisely the `daysMin`/`daysMax` failure mode users will hit
with broccoli, lettuce, green bean and corn. *Confidence: moderate-to-strong — one study, but
the prediction succeeded across all eight vegetables and the underlying arithmetic is simple
stoichiometry plus a titration.*

**Finding 8.7b — the commonly cited "LAB stall at pH 3.3 and spoilage then develops" is a real
warning, not a safety floor.** Little et al.: "spoilage of fermented vegetables typically
develops in batches that reach a pH of 3.3, prior to the complete disappearance of simple
sugars." The stall is *because* the LAB are pH-inhibited while sugar remains — which is exactly
the condition under which yeasts and moulds can take over. *Confidence: moderate.*

---

## 9. Consolidated verdict: what to model, what to drop

### 9.1 First-order — the calculator is missing these

| # | Factor | Effect size | Recommended encoding |
|---|---|---|---|
| 1 | **Particle size / tissue disruption** | Shredded 2 mm vs whole leaf: **~5 d vs ~13 d** to 8 log LAB (Valence 2025). Shredded vs whole-head cabbage: **15 d vs 28 d** (Niksic 2005). Radish 1 vs 3 cm cubes: all differences in the first 5 days. Mechanism: sugar *diffuses out* of tissue and is the rate-limiting solute (t₉₅ ≈ 39 d vs 10 d for salt in a whole pickling cucumber; peeling speeds sugar 7–11×) | Multiplier on the vegetable term: shredded/grated **1.0**, thin-sliced **1.1–1.2**, 2-cut/quarters **1.3–1.5**, whole-leaf **1.6–2.0**, whole intact **1.8–2.2**, plus an 18–24 h "diffusion head start" note for whole vegetables |
| 2 | **Buffer capacity + fermentable sugar → achievable minimum pH** | Acid demand spans **57.6 → 210 mM** across vegetables (3.6×). Supply:demand spans **0.64× (lettuce, cannot finish) → 6.9× (sweet potato)**. Breidt & Skinner predict pH from acid + buffer capacity at **RMSE 0.064 pH units** | Per-vegetable `bufferCapacity` (mM lactic acid to pH 3.0, from Little et al. Table 2) and `fermentableSugar` (g/100 g). Compute `achievableMinPH`; **warn instead of extrapolating** when the target is unreachable |
| 3 | **Inoculation (defined starter culture)** | Shredded cabbage: pH < 4.0 in **< 24 h vs 3 days** (Müller 2018). Whole heads: **14 days saved** (Beganović 2011). Three vegetables to maturity: **9–14 d → 4–7 d** (Zhao 2026). But 15 commercial krauts showed **no endpoint difference** (Liu 2024) | Boolean "starter used" → **×0.35–0.5** duration, applied to the *lag*, not the whole curve. Treat as a step function, not a dose (no dose–response above ~10⁶ CFU/g) |
| 4 | **Salt, re-shaped** | Stamer 1971: generation time at 2.25 % is within **5–10 %** of no-salt; at 3.5 % it is **+33 to +67 %**. 2.5 % is the confirmed optimum in a 4-level trial (Yang 2020). Viander 2003 (430 kg): 0.5 % fermented **slower** than 1.2 % | Replace the monotonic power law with the piecewise curve in §5.5: flat **1.5–2.5 %**, rising above 3.5 %, no fermentation above ~10 % |

### 9.2 Calibration corrections to factors already modelled

| Factor | Current | Recommended | Why |
|---|---|---|---|
| Temperature coefficient | **A single Q10 = 2.5** (Ea ≈ 68.6 kJ/mol), plus a >35 °C penalty | **Keep Q10 = 2.5 for the 15–30 °C core** — it sits inside the 95 % CI of the best direct measurement (2.64 [2.30–3.04], Laureys et al. 2022). Make it **piecewise**: flatten to ≈1.4 above 30 °C (Ratkowsky: 1.46 at 25→30 °C), steepen to ≈2.5–3.0 at 10–15 °C and ≈3.5–4.5 at 5–10 °C, and add a **hard floor at ≤5 °C**. Reframe the >32 °C penalty as a *quality* penalty | The coefficient is fine; the **shape** is wrong at both ends. At 0 °C kimchi shows no exponential phase for 14 days (only pH 4.57 by day 28); at 7.5 °C sauerkraut reaches just 0.4 % acid in 10 days and may take 6+ months. Above 30 °C Q10 falls below 1.5 and the community shifts to *Lactobacillus*/*Pediococcus*. Salt and temperature also interact — salt suppresses the rate specifically at the cold end |
| Salt term | `(saltPct/typicalSaltPct)^1.0`, clamp 0.6–2.0 | Piecewise, **flat 1.5–2.5 %** | Two of the largest studies find low salt neutral-to-slower; the molecular data put the break point between 2.25 % and 3.5 % |
| Water hardness | ±10 % cap | Keep as is (or drop) | Correctly identified by the authors as texture-dominated; I found nothing contradicting the ±10 % cap, and no evidence it should be larger |
| Starting pH | 6.5 for everything | 6.2 brassicas / 5.5 cucurbits & roots / 4.4 tomato | ±0.5 pH is ~1/6 of the span to 4.0 — second-order but free to fix |
| pH shape exponent | 1.7, global | Buffer-model pH (acid + buffer capacity + malate) | Breidt & Skinner (2022) achieve 0.064 pH-unit RMSE this way. Malic acid is the principal buffer in cucumber over pH 2–7, and removing it halves acid production |
| pH targets | 4.6 / 4.0 / 3.5 | Add **3.3** as "self-preserving, no refrigeration needed" | Regulatory threshold for acidified vegetables (Breidt et al. 2010). Also worth a **kimchi-specific target of pH 4.2–4.6 / TA 0.5–0.8 %**, which is genuinely different from sauerkraut |
| **"Ready" as one number** | Single target pH 4.0 | **Report two endpoints.** Cabbage needs ~8–12 g lactic acid/kg to reach **pH 4.0** but ~18–22 g/kg to reach **pH 3.5** — so pH 4.0 arrives after only **~25–40 % of the sugar is consumed**, and "time to pH 4.0" vs "time to full fermentation" differ by **2–4×**. Show *safe-to-eat* and *fully-soured* as separate dates | This is the largest single source of user-visible error in a one-number model: the app's 7-day shredded-cabbage anchor is plausible for pH 4.0 but roughly half the time a full sour actually takes |
| Backslopping | (not modelled) | Add as a **caution**, not a speed-up | 80 % v/v reused brine bought only **+5–11 %** in rate constant (Zhang 2022/23); FAO says mature brine gives poor quality by suppressing the *Leuconostoc* initiator; and *Leuconostoc* is the **fast** acidifier, so "skip to the lactobacilli" is backwards |

### 9.3 Second-order — do not model numerically

| Factor | Why not |
|---|---|
| **Sugar content as a proportional rate multiplier** | Saturates: supply exceeds demand 3–7× in most vegetables; the real role is as a *gate* (supply/demand ≥ ~1) and as the numerator of the achievable-pH calculation |
| **Oxygen / headspace volume / vessel material** | LAB growth rate statistically unchanged by oxygen in kimchi; the large effect (yeast 10² → 10⁶–10⁹/mL, pH *rising* +0.17 units as acid is consumed) is spoilage. The headspace holds ~220× more O₂ than an HDPE wall admits per day, so the **seal**, not the material, is what matters. Model as advice and a days-1–3 risk flag |
| **Stirring / punching down** | **No study exists at all.** FAO advises against (air ingress). Do not offer it as an accelerator |
| **Batch size / vessel size 1 L–30 L** | No demonstrated rate effect; no study varies vessel size with pH/time as the outcome. Sub-gram scales fail for colonisation reasons irrelevant to a kitchen |
| **Vessel material** | A controlled same-size comparison (10 L glass vs porcelain vs plastic, identical brine) found **~25 % rate difference**: pH 3.5 on day 4 in glass and plastic vs day 5 in porcelain (Liu et al. 2020). Likely gas-exchange (CO₂ venting) rather than a material property. Still no four-way head-to-head; the closure dominates the wall for O₂ ingress |
| **Garlic, chilli, mustard, grape leaves** | No measurable rate effect at recipe levels. Garlic may mildly *accelerate* and is a real anti-yeast agent; grape leaves are a *firmness* intervention (fresh leaves only — drying destroys >50 % of the activity) |
| **Cinnamon (normal pinch)** | 1 g/kg delivers 6–13 ppm against a LAB MIC of ~2,100 ppm — 160–350× below threshold |
| **Bacteriophage** | Real and abundant (9 phages from two 90-ton sauerkraut tanks active against a starter, Yoon 2002), but resistant mutants take over and **no vegetable fermentation failure has ever been measured**. In cucumber, phage is *protective* — MOI 1–100 gave a 5-log kill of *Enterobacter* within 3 h (Lu 2020) |
| **Thermal mass of a large crock** | 95 % thermal response ≈42 min (1 L) vs ≈3.3 h (20 L); under ~10 % on a forecast-integrated estimate. Only matters with hourly weather data |
| **Freezing / thawing as an accelerator** | No study exists, and freeze–thaw costs >2 log LAB; commercially freezing is used to *stop* kimchi fermentation |
| **Blanching as an accelerator** | It is a texture/safety tool. 77 °C/3.5 min costs 0.18 % of fresh weight in sugar and drops final acidity from 1.14–1.30 % to 0.76–0.88 %. Model as a **boolean**: blanched and not inoculated → will not ferment |
| **Pricking / puncturing** | No study exists |

### 9.3b One spice that *is* first-order — as a warning

**Clove, at ≥1–2 %, is the one common spice that demonstrably breaks a ferment, and it has the
worst possible selectivity: 2 % clove powder in kimchi took LAB from 6.73 to 1.30 log CFU/g by
day 20 (−5.4 log) while yeasts and moulds were essentially untouched (5.45 → 5.18 log).**
*Confidence: strong.* Everything else in the spice rack is second-order. This deserves a
user-facing warning, not a multiplier.

### 9.4 The honest uncertainty budget

The largest single source of error in any consumer fermentation-timing calculator is **not** any
of the factors above — it is **the vegetable itself**. Little et al. (2022) measured broccoli at
**0.10 g/100 g** sugar where the USDA reference says **1.41 g/100 g** (14×), and green pea at
0.95 vs 2.75 g/100 g (2.9×), within a single harvest. The app's `speedFactor` constants are
point estimates carrying that much underlying variance. The `daysMin`/`daysMax` band the model
already returns should therefore be treated as **the primary output**, and the point estimate as
the label on it — a ±40 % band is well justified; a ±20 % band is not.

**Suggested calibration anchors (what a well-calibrated calculator should reproduce):**

| Scenario | Should predict |
|---|---|
| Shredded cabbage, dry salt 2 %, 22 °C, wild, to pH 4.0 | ~3 days |
| Same, to pH 3.5 / full sour (≥1.5 % lactic acid) | ~7–14 days at 21–24 °C; **3–4 weeks** on extension guidance. **Note this is 2–4× the pH 4.0 time, not a small increment** |
| Same, at ~16 °C, to full sour | **5–6 weeks** (Oregon State PNW 355; Penn State) |
| Same, to pH 4.0, with a *L. plantarum* starter | < 1 day |
| Whole-head cabbage, 2 % salt, 22 °C, to full sour | ~28 days |
| Same, with a starter | ~14 days |
| Shredded **2 mm** vs **6×8 cm leaf**, 19 °C | ~5 d vs ~13 d to 8 log LAB |
| Shredded cabbage at 12 °C, wild, to pH 4.0 | ~6 days (steepened cold-range model); the current Q10 = 2.5 gives ~8.1 — the current model is too slow here |
| Shredded cabbage at 28 °C, wild, to pH 4.0 | current Q10 = 2.5 gives ~1.7 days; a flattened Q10 ≈ 1.5 gives ~2.1 — the current model is **~20 % too fast** above 30 °C |
| Whole cucumber, 5 % brine, ~25 °C, to pH 3.8 | ~7–14 days (and the interior salts only after ~48 h) |
| Cucumber at **0 °C / 5 °C**, to pH 4.6 | **35 d / 15 d** (kimchi proxy); near-arrest |
| Cabbage at 3 % salt vs 2 % salt | No measurable difference |
| Cabbage at 5 % salt vs 2 % salt | Noticeably longer |
| Cabbage at 0.5–1.2 % salt, wild | **Slightly slower**, and unreliable quality |
| Kimchi (napa, 2.5 % salt, 4 °C), to pH 4.6 | ~2 weeks (10 °C → 6 d; 20 °C → 2 d) |
| Kimchi at optimum ripeness | TA 0.5–0.8 %, pH ≈ 4.2–4.3 |
| Any vegetable with supply:demand < 1 (broccoli, lettuce) | **Cannot reach pH 3.5** — warn, do not extrapolate |

### 9.5 The three highest-value data gaps

If someone wants to close the remaining uncertainty rather than live with it:

1. **A days-to-pH-4.0/3.5 table across 15–30 °C.** No such table exists. The two best routes:
   OCR the three image-only USDA-ARS sauerkraut scans (Pickle Pubs **p201, p155, p182**), and
   obtain **Yang et al. (2020)**, *J. Appl. Microbiol.* 129:1458 —
   doi:[10.1111/jam.14786](https://doi.org/10.1111/jam.14786) — which ran 0.5/1.5/2.5/3.5 % salt
   and almost certainly contains the salt-vs-time curves. This is the single biggest gap for a
   timing model.
2. **The AITC concentration actually achieved in a mustard-seed brine.** The in-vitro MIC
   literature disagrees by ~100× (60–80 ppm in broth vs no MIC to 7,500 ppm on agar), almost
   certainly because AITC volatilises out of the brine. One measurement would settle it.
3. **An MIC for capsaicin against any LAB.** A complete literature void — a small experiment
   would convert it into a number and definitively retire the "hot peppers slow fermentation"
   idea.

**And one housekeeping item:** `kimchi_refs/mheen1984.pdf` in this workspace is a **failed
download** — a 6.5 KB login page, not the Mheen & Kwon 1984 paper. Do not cite it.

---

## 10. Source index

### Primary ARS / USDA sources (all freely available)
| Source | URL |
|---|---|
| Andersson, Daeschel & Eriksson (1988), *Controlled Lactic Acid Fermentation of Vegetables* — the ARS review chapter (Pickle Pubs p210) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p210.pdf |
| Jones & Etchells (1943), *Physical and Chemical Changes in Cucumber Fermentation* (p19) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p19.pdf |
| Potts & Fleming (1979), aerated brined cucumbers (p138) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p138.pdf |
| Potts, Fleming, McFeeters & Guinnup (1986), solute equilibration (p190) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p190.pdf |
| Fasina, Fleming & Thompson (2002), mass transfer and solute diffusion (p299) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p299.pdf |
| Fleming, Thompson, Bell & Hontz (1978), sliced cucumbers, incl. the 18–24 h delay (p136) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p136.pdf |
| Fleming, Etchells, Thompson & Bell (1975), N₂ purging and bloater damage (p125) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p125.pdf |
| Potts & Fleming (1982), mould inhibition by acetic vs lactic acid (p151) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p151.pdf |
| Bell, Etchells, Williams & Porter, *Inhibition of Pectinase and Cellulase by Certain Plants* (p72) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p72.pdf |
| Daeschel & Fleming (1981), LAB entry into cucumbers, incl. the pilot-scale reversal (p149) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p149.pdf |
| Johanningsmeier, McFeeters, Fleming & Thompson (2007), reduced-salt sauerkraut + starter (p348) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p348.pdf |
| Breidt, Sandeep & Arritt (2010), acidified foods and the pH 3.3 heat-process threshold (p368) | https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p368.pdf |
| Little et al. (2022), *J. Food Sci.* 87:2121 — sugar vs buffer capacity across eight vegetables | https://www.ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p447.pdf |
| USDA AMS, *Bulk Sauerkraut Grades and Standards* | https://www.ams.usda.gov/grades-standards/bulk-sauerkraut-grades-and-standards |
| 21 CFR § 114.3 (definitions: acid / acidified / low-acid foods) | https://www.law.cornell.edu/cfr/text/21/114.3 |
| FDA CPG Sec. 545.450 (leachable lead, ceramicware) | https://www.fda.gov/media/71764/download |
| UC Davis (2022), *Troubleshooting Fermented Fruits and Vegetables* | https://ucfoodsafety.ucdavis.edu/sites/g/files/dgvnsk7366/files/media/documents/Troubleshooting%20fermented%20fruits%20and%20vegetables%20FINAL.pdf |
| FAO, *Fermented Fruits and Vegetables: A Global Perspective*, Ch. 5 | https://www.fao.org/4/x0560e/x0560e10.htm |

### Peer-reviewed studies cited
Alle, A. et al. — see inline. Key DOIs, in order of appearance:
- Niksic et al. (2005) *J. Food Prot.* 68:1367 — [10.4315/0362-028X-68.7.1367](https://doi.org/10.4315/0362-028X-68.7.1367)
- Valence et al. (2025) *Peer Community Journal* 5:e49 — [10.24072/pcjournal.553](https://doi.org/10.24072/pcjournal.553)
- Choi et al. (2023) *Food Chem. X* 20:100950 — [10.1016/j.fochx.2023.100950](https://doi.org/10.1016/j.fochx.2023.100950)
- Passos et al. (2005) *J. Food Eng.* 68:297 — [10.1016/j.jfoodeng.2004.06.002](https://doi.org/10.1016/j.jfoodeng.2004.06.002)
- Sarvan et al. (2013) *Food Res. Int.* 54:706 — [10.1016/j.foodres.2013.07.065](https://doi.org/10.1016/j.foodres.2013.07.065)
- Müller et al. (2018) *Food Microbiol.* 76:473 — [10.1016/j.fm.2018.07.009](https://doi.org/10.1016/j.fm.2018.07.009)
- Beganović et al. (2011) *J. Food Sci.* 76:M124 — [10.1111/j.1752-3841.2010.02030.x](https://doi.org/10.1111/j.1752-3841.2010.02030.x)
- Sørensen et al. (2021) *Food Res. Int.* 150:110800 — [10.1016/j.foodres.2021.110800](https://doi.org/10.1016/j.foodres.2021.110800)
- Zhao et al. (2026) *Microorganisms* 14(2):411 — [10.3390/microorganisms14020411](https://doi.org/10.3390/microorganisms14020411)
- Liu et al. (2024) *Foods* 13(23):3947 — [10.3390/foods13233947](https://doi.org/10.3390/foods13233947)
- Kim et al. (2019) *J. Microbiol.* 57:479 — [10.1007/s12275-019-9048-0](https://doi.org/10.1007/s12275-019-9048-0)
- Zhang et al. (2022/23) *Foods* 12(1):101 — [10.3390/foods12010101](https://doi.org/10.3390/foods12010101)
- Mudgal et al. (2006) *Appl. Environ. Microbiol.* 72:3908 — [10.1128/AEM.02429-05](https://doi.org/10.1128/AEM.02429-05)
- Yoon et al. (2002) *Appl. Environ. Microbiol.* 68(2):973 — [10.1128/AEM.68.2.973-979.2002](https://doi.org/10.1128/AEM.68.2.973-979.2002)
- Lu et al. (2003) *Appl. Environ. Microbiol.* 69(6):3192 — [10.1128/AEM.69.6.3192-3201.2003](https://doi.org/10.1128/AEM.69.6.3192-3201.2003)
- Yu et al. (2023) *J. Food Sci. Technol.* 60:2695 — [10.1007/s13197-023-05795-z](https://doi.org/10.1007/s13197-023-05795-z)
- Kim JY et al. (2020) *Foods* 9(8):1075 — [10.3390/foods9081075](https://doi.org/10.3390/foods9081075)
- Preuss, Peterson & Fred (1928) *Ind. Eng. Chem.* 20:1187 — [10.1021/ie50227a021](https://doi.org/10.1021/ie50227a021)
- Satora & Strnad (2024) *Applied Sciences* 14(1):236 — [10.3390/app14010236](https://doi.org/10.3390/app14010236)
- Satora et al. (2020) *Int. J. Mol. Sci.* 21(24):9699 — [10.3390/ijms21249699](https://doi.org/10.3390/ijms21249699)
- Kim M-J et al. (2021) *Foods* 10(3):645 — [10.3390/foods10030645](https://doi.org/10.3390/foods10030645)
- Jeong et al. (2022) *Food Microbiol.* 106:104057 — [10.1016/j.fm.2022.104057](https://doi.org/10.1016/j.fm.2022.104057)
- Franco & Pérez-Díaz (2012) *Food Microbiol.* — [10.1016/j.fm.2012.07.013](https://doi.org/10.1016/j.fm.2012.07.013)
- Stamer, Stoyla & Dunckel (1971) *J. Milk Food Technol.* 34(11):521
- Yang et al. (2020) *J. Appl. Microbiol.* 129:1458 — [10.1111/jam.14786](https://doi.org/10.1111/jam.14786)
- Viander, Mäki & Palva (2003) *Food Microbiol.* 20:391 — [10.1016/S0740-0020(02)00150-8](https://doi.org/10.1016/S0740-0020(02)00150-8)
- Breidt & Skinner (2022) *J. Food Prot.* 85:1273 — [10.4315/JFP-22-068](https://doi.org/10.4315/JFP-22-068)
- Anthony & Breidt (2026) *J. Food Prot.* 89:100718 — [10.1016/j.jfp.2026.100718](https://doi.org/10.1016/j.jfp.2026.100718)
- Du et al. (2022) *Foods* 11:1762 — [10.3390/foods11121762](https://doi.org/10.3390/foods11121762)
- Hughes & Lindsay (1985) *J. Food Sci.* 50:1662 — [10.1111/j.1365-2621.1985.tb10560.x](https://doi.org/10.1111/j.1365-2621.1985.tb10560.x)
- Plengvidhya et al. (2007) *Appl. Environ. Microbiol.* 73:7697 — [PMC2168044](https://pmc.ncbi.nlm.nih.gov/articles/PMC2168044/)
- Laureys et al. (2022) *Front. Microbiol.* 13:871550 — [10.3389/fmicb.2022.871550](https://doi.org/10.3389/fmicb.2022.871550)
- Kim JY et al. (2020) *Foods* 9:1075 — [10.3390/foods9081075](https://doi.org/10.3390/foods9081075)
- Lu, Fleming & McFeeters (2002) *J. Food Sci.* 67:2934 — [10.1111/j.1365-2621.2002.tb08840.x](https://doi.org/10.1111/j.1365-2621.2002.tb08840.x)
- Breidt (2023) *SoftwareX* 22:101351 — [10.1016/j.softx.2023.101351](https://doi.org/10.1016/j.softx.2023.101351)
- Trial, Fleming, Young & McFeeters (1996) *J. Food Quality* 19:15 — [10.1111/j.1745-4557.1996.tb00402.x](https://doi.org/10.1111/j.1745-4557.1996.tb00402.x)
- Jang et al. (2024) *Heliyon* 10:e24919 — [10.1016/j.heliyon.2024.e24919](https://doi.org/10.1016/j.heliyon.2024.e24919)
- Choi et al. (2024) *Heliyon* 10:e24503 — [10.1016/j.heliyon.2024.e24503](https://doi.org/10.1016/j.heliyon.2024.e24503)
- Tuțulescu, Ionică & Stoica (2026) *Foods* 15:2746 — [10.3390/foods15152746](https://doi.org/10.3390/foods15152746)
- Kim SY et al. (2022) *Food Chem. X* 16:100417 — [10.1016/j.fochx.2022.100417](https://doi.org/10.1016/j.fochx.2022.100417)
- Troller & Stinson (1981) *Appl. Environ. Microbiol.* 42:682 — [PMC244083](https://pmc.ncbi.nlm.nih.gov/articles/PMC244083/)
- Plihon, Taillandier & Strehaiano (1995) *Appl. Microbiol. Biotechnol.* 43:117 — [10.1007/BF00170632](https://doi.org/10.1007/BF00170632)
- Kim & Hu (2023) *J. R. Soc. Interface* 20:20230034 — [10.1098/rsif.2023.0034](https://doi.org/10.1098/rsif.2023.0034)
- Qiao & Gänzle (2026) *Int. J. Food Microbiol.* 447:111571 — [10.1016/j.ijfoodmicro.2025.111571](https://doi.org/10.1016/j.ijfoodmicro.2025.111571)

### Companion research files in this workspace
The deep-dive reports produced alongside this review, all in the workspace root:

| File | Contents |
|---|---|
| `lactic-acid-fermentation-quantitative-report.md` | **Q2 + Q3** — particle size/pretreatment and inoculation/backslopping. 970 lines, every URL, per-item confidence, explicit 18-item "could not find" list |
| `Q4_Q5_oxygen_headspace_vessel_batchsize_report.md` | **Q4 + Q5** — oxygen, headspace, vessel, batch size, salt diffusion. 1246 lines; includes OCR of scanned ARS Pickle Pubs |
| `kahm_yeast_and_mould_report.md` | Kahm yeast and mould deep dive — 681 lines, 71 URLs |
| `lab_fermentation_inhibitors_and_readiness.md` | **Q6 + Q8** — 1322 lines, 84 URLs, 48 explicit "data not found" flags |
| `fermentation-vessel-materials-report.md` | Vessel materials, oxygen transmission rates, leachates |
| `headspace_vessel_report.md` | Headspace, closures, water seals |
| `research_Q10_arrhenius.md` | Q10 / Ea / Ratkowsky parameters for LAB — the source of §8.5 |
| `research_sauerkraut_temp.md` | Sauerkraut temperature–time primary sources (Parmele 1927, Pederson & Albury 1969) |
| `vegetable_fermentation_temperature_evidence.md` | How temperature changes the *character* (organism, end-products, texture) of the ferment |
| `pH_thresholds_vegetable_lactic_fermentation.md` | Regulatory and extension pH thresholds |
| `salt-type-fermentation-evidence-report.md`, `salt_mineral_evidence_report.md`, `salt_water_chemistry_fermentation_review.md`, `B5_KCl_CaCl2_evidence_review.md`, `magnesium_lab_experimental_data.md`, `iodine_salttype_findings.md`, `water_chlorine_minerals_findings.md` | Salt type, mineral content, water chemistry |
| `vegetable-starter-cultures-report.md`, `literature-search-wild-vs-backslopped-vs-starter.md` | Starter cultures and backslopping |
| `AITC_capsaicin_research.md`, `antimicrobial_plant_compounds_lab_fermentation.md`, `pepper_mash_fermentation_evidence.md` | Antimicrobial plant compounds |
| `literature-freezing-blanching-fermentation.md` | Freezing and blanching |
| `fermentation-rate-report.md`, `research_temperature_vs_fermentation_speed.md`, `research_kimchi_temp.md`, `research_pickles_pepper_temp.md` | Rate and temperature syntheses |

**Bookkeeping note:** `kimchi_refs/mheen1984.pdf` is a **failed download** — a 6.5 KB login
page, not the Mheen & Kwon 1984 paper. Do not cite it.
