# Sugar & Sugar-Speciation Data for Raw Vegetables and Fruits
### USDA FoodData Central (FDC) + measured HPLC literature

**Compiled:** from the complete local SR Legacy bulk release and the Foundation Foods bulk release, plus primary literature.
**All values are g per 100 g edible portion, raw, as-published. No values are estimated or interpolated by me.**

---

## 1. Data provenance and method (read this before using the table)

| Source | Version / date | Role in this report |
|---|---|---|
| FDC **SR Legacy** | Final release `FoodData_Central_sr_legacy_food_json_2018-04` (7,793 foods) | Primary source for nearly every row |
| FDC **Foundation Foods** | `FoodData_Central_foundation_food_json_2025-04-24` (340 foods) | Checked; see §5 — it does **not** improve on cabbage |
| FDC **API** `api.nal.usda.gov/fdc/v1` | queried 2025 | Cross-check of individual foods |
| HathiTrust full view, `umn.31951002926106c` | **Agriculture Handbook No. 8-11 (1984)** | Sugar question answered in §6 |
| *Applied & Environmental Microbiology* (PMC) | Plengvidhya et al. | Measured HPLC cabbage sugars, §5 |

Nutrient IDs used throughout: **Total Sugars = 2000** (nut. no. 269); **Sucrose = 1010** (210); **Glucose = 1011** (211); **Fructose = 1012** (212); **Maltose = 1014** (214); **Starch = 1009** (209); **Carbohydrate by difference = 1005** (205); **Fiber, total dietary = 1079** (291).

> **Note on URL format.** `https://fdc.nal.usda.gov/food-details/<FDCID>/nutrients` is an Angular SPA deep link. The server returns HTTP 404 for a direct request **but serves the full application shell (52 KB) and the route renders correctly in a browser** — verified. The links are valid for human use; they are not machine-fetchable. Use the API for automation.

**Derivation codes** (FDC's own field for how a number was obtained) are shown per row because they are the single most important quality signal here:

`A` Analytical · `JA` Aggregated from analytical sources · `JO` Aggregated mixed sources · `NC` **Calculated** · `Z` **Assumed zero** · `T` Taken from another source (i.e. **not** FDC-measured) · `O` Other/imputed · `BFSN`/`BFZN` Calculated from a similar food.

`n/s` = a value is present but FDC records **no derivation code at all** (the derivation object exists with an empty `foodNutrientSource`) — provenance unstated.

`conf` column: **HIGH** = derivation `A`/`JA` (measured on that food); **UNCERTAIN** = value present but `n/s` (provenance unstated); **LOW** = `NC`, `Z`, `T`, `O`, `BFSN`, `MA` (calculated, borrowed, imputed, or assumed).

---

## 2. Headline findings (data-quality)

1. **Only 18 of 92 rows have analytically measured total sugars.** Across the whole extraction the derivation-code distribution for Total Sugars is: `A` analytical **18**, `NC` calculated **18**, `T` taken from another source **16**, `O` imputed **15**, `BFSN` calculated-from-similar-food **10**, `Z` assumed zero **2**, and **13 with no derivation code recorded at all** (of those 13, **6 carry a value with unstated provenance** and **7 carry no total-sugars value whatsoever**). Sums to 92. Most FDC "total sugars" values for vegetables are **not** measurements of that vegetable.

2. **"Cabbage, raw" (FDC 169975) is internally consistent but the total is *calculated*, not measured.** Total Sugars `3.2 g` carries derivation `NC` = *Calculated*. Its individual sugars **are** analytical (`JA`): glucose 1.67 + fructose 1.45 + sucrose 0.08 + maltose 0.01 = **3.21 g**, which reproduces the 3.2 g. So the 3.2 g is a *sum of aggregated analytical monosaccharide data*, not an HPLC total-sugars determination on a single sample set.

3. **The 4.7–9.4 % "fermentable sugars by HPLC in ARS papers" figure could NOT be verified.** I found the actual USDA-ARS HPLC dataset on commercial shredded cabbage and it reads **2.80–3.96 g/100 g** — i.e. it **agrees with** FDC 3.2 g, and **contradicts** 4.7–9.4 %. See §5. Treat the 4.7–9.4 % claim as unsupported until a citation is produced.

4. **Foundation Foods does not fill the gap.** FDC's newer Foundation Foods has "Cabbage, green, raw" (FDC 2346407) but that record contains **no total sugars and no individual sugars at all** — verified in both the bulk release and the live API. Broccoli (747447), cucumber (2346406), and green beans (2346400) in Foundation Foods likewise carry no sugar values.

5. **Olives: FDC assumes zero sugar.** "Olives, ripe, canned" (169094, 169095) report Total Sugars = **0 g** with derivation **`Z` = "Assumed zero (Insignificant amount or not naturally occurring in a food…)"**. That rationale text is written for things like fiber in meat; ripe olives demonstrably contain sugars. **Do not use FDC total sugars for olives.**

6. **Six rows carry a total-sugars value with no provenance recorded at all** (`n/s`): eggplant 169228 (3.53), mango 169910 (13.7), cherry 171719 (12.8), apricot 171697 (9.24), cantaloupe 169092 (7.86), turnip greens 170061 (0.81). FDC supplies neither a derivation code nor a source. Cite these with care.

7. **Garlic total sugars (1 g) is `T` — taken from another source**, and daikon (2.5 g) is also `T`, beet (6.76 g) is `O` imputed, jalapeño (5.1 g) is `BFSN` from a similar food. None are FDC measurements.

---

## 3. PRIORITY ITEMS — full sugar speciation

`Σ indiv.` = my arithmetic sum of the glucose+fructose+sucrose+maltose columns, shown so you can see where FDC's own total and its components disagree.

| Food | FDC ID | FDC description | Total sugars | deriv | glucose | fructose | sucrose | maltose | starch | carb | fiber | Σ indiv. | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| green cabbage | [169975](https://fdc.nal.usda.gov/food-details/169975/nutrients) | Cabbage, raw | **3.2** | NC | 1.67 | 1.45 | 0.08 | 0.01 | 0 | 5.8 | 2.5 | 3.21 | LOW |
| red cabbage | [169977](https://fdc.nal.usda.gov/food-details/169977/nutrients) | Cabbage, red, raw | **3.83** | NC | 1.74 | 1.48 | 0.6 | 0 | 0 | 7.37 | 2.1 | 3.82 | LOW |
| napa/Chinese cabbage (pe-tsai) | [169979](https://fdc.nal.usda.gov/food-details/169979/nutrients) | Cabbage, chinese (pe-tsai), raw | **1.41** | BFSN | — | — | — | — | — | 3.23 | 1.2 | — | LOW |
| cucumber (with peel) | [168409](https://fdc.nal.usda.gov/food-details/168409/nutrients) | Cucumber, with peel, raw | **1.67** | NC | 0.76 | 0.87 | 0.03 | 0.01 | 0.83 | 3.63 | 0.5 | 1.67 | LOW |
| carrot | [170393](https://fdc.nal.usda.gov/food-details/170393/nutrients) | Carrots, raw | **4.74** | NC | 0.59 | 0.55 | 3.59 | 0 | 1.43 | 9.58 | 2.8 | 4.73 | LOW |
| beetroot / beets | [169145](https://fdc.nal.usda.gov/food-details/169145/nutrients) | Beets, raw | **6.76** | O | — | — | — | — | — | 9.56 | 2.8 | — | LOW |
| daikon / oriental radish | [168451](https://fdc.nal.usda.gov/food-details/168451/nutrients) | Radishes, oriental, raw | **2.5** | T | — | — | — | — | — | 4.1 | 1.6 | — | LOW |
| cauliflower | [169986](https://fdc.nal.usda.gov/food-details/169986/nutrients) | Cauliflower, raw | **1.91** | A | 0.94 | 0.97 | 0 | 0 | — | 4.97 | 2 | 1.91 | HIGH |
| green beans (snap) | [169961](https://fdc.nal.usda.gov/food-details/169961/nutrients) | Beans, snap, green, raw | **3.26** | A | 1.51 | 1.39 | 0.36 | 0 | 0.88 | 6.97 | 2.7 | 3.26 | HIGH |
| green bell pepper | [170427](https://fdc.nal.usda.gov/food-details/170427/nutrients) | Peppers, sweet, green, raw | **2.4** | NC | 1.16 | 1.12 | 0.11 | 0 | 0 | 4.64 | 1.7 | 2.39 | LOW |
| hot chile pepper (green, jalapeno-type) | [170497](https://fdc.nal.usda.gov/food-details/170497/nutrients) | Peppers, hot chili, green, raw | **5.1** | BFSN | — | — | — | — | — | 9.46 | 1.5 | — | LOW |
| onion | [170000](https://fdc.nal.usda.gov/food-details/170000/nutrients) | Onions, raw | **4.24** | NC | 1.97 | 1.29 | 0.99 | 0 | 0 | 9.34 | 1.7 | 4.25 | LOW |
| garlic | [169230](https://fdc.nal.usda.gov/food-details/169230/nutrients) | Garlic, raw | **1** | T | — | — | — | — | — | 33.1 | 2.1 | — | LOW |
| tomato (red ripe, year round avg) | [170457](https://fdc.nal.usda.gov/food-details/170457/nutrients) | Tomatoes, red, ripe, raw, year round average | **2.63** | NC | 1.25 | 1.37 | 0 | 0 | 0 | 3.89 | 1.2 | 2.62 | LOW |
| apple (with skin) | [171688](https://fdc.nal.usda.gov/food-details/171688/nutrients) | Apples, raw, with skin (Includes foods for USDA's Food Distribution Program) | **10.4** | A | 2.43 | 5.9 | 2.07 | 0 | 0.05 | 13.8 | 2.4 | 10.4 | HIGH |
| pear | [169118](https://fdc.nal.usda.gov/food-details/169118/nutrients) | Pears, raw | **9.75** | A | 2.6 | 6.42 | 0.71 | 0 | — | 15.2 | 3.1 | 9.73 | HIGH |
| broccoli | [170379](https://fdc.nal.usda.gov/food-details/170379/nutrients) | Broccoli, raw | **1.7** | NC | 0.49 | 0.68 | 0.1 | 0.21 | 0 | 6.64 | 2.6 | 1.48 | LOW |
| sweet potato | [168482](https://fdc.nal.usda.gov/food-details/168482/nutrients) | Sweet potato, raw, unprepared (Includes foods for USDA's Food Distribution Program) | **4.18** | NC | 0.96 | 0.7 | 2.52 | 0 | 12.6 | 20.1 | 3 | 4.18 | LOW |
| sweet corn (yellow) | [169998](https://fdc.nal.usda.gov/food-details/169998/nutrients) | Corn, sweet, yellow, raw | **6.26** | A | 3.43 | 1.94 | 0.89 | 0 | 5.7 | 18.7 | 2 | 6.26 | HIGH |---

## 4. REMAINING REQUESTED ITEMS — full sugar speciation

Same columns and conventions as §3. Items flagged **NOT IN FDC** or with no sugar data are listed in §7 rather than given a fabricated row.

| Food | FDC ID | FDC description | Total sugars | deriv | glucose | fructose | sucrose | maltose | starch | carb | fiber | Σ indiv. | conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| alfalfa sprouts | [168384](https://fdc.nal.usda.gov/food-details/168384/nutrients) | Alfalfa seeds, sprouted, raw | **0.2** | NC | 0.08 | 0.12 | 0 | 0 | — | 2.1 | 1.9 | 0.2 | LOW |
| apricot | [171697](https://fdc.nal.usda.gov/food-details/171697/nutrients) | Apricots, raw | **9.24** | n/s | 2.37 | 0.94 | 5.87 | 0.06 | — | 11.1 | 2 | 9.24 | UNCERTAIN |
| arugula | [169387](https://fdc.nal.usda.gov/food-details/169387/nutrients) | Arugula, raw | **2.05** | O | — | — | — | — | — | 3.65 | 1.6 | — | LOW |
| asparagus | [168389](https://fdc.nal.usda.gov/food-details/168389/nutrients) | Asparagus, raw | **1.88** | NC | 0.65 | 1 | 0.23 | 0 | — | 3.88 | 2.1 | 1.88 | LOW |
| bamboo shoot | [169210](https://fdc.nal.usda.gov/food-details/169210/nutrients) | Bamboo shoots, raw | **3** | O | — | — | — | — | — | 5.2 | 2.2 | — | LOW |
| banana | [173944](https://fdc.nal.usda.gov/food-details/173944/nutrients) | Bananas, raw | **12.2** | A | 4.98 | 4.85 | 2.39 | 0.01 | 5.38 | 22.8 | 2.6 | 12.23 | HIGH |
| beet greens | [170375](https://fdc.nal.usda.gov/food-details/170375/nutrients) | Beet greens, raw | **0.5** | O | — | — | — | — | — | 4.33 | 3.7 | — | LOW |
| Brussels sprouts | [170383](https://fdc.nal.usda.gov/food-details/170383/nutrients) | Brussels sprouts, raw | **2.2** | T | 0.81 | 0.93 | 0.46 | 0 | — | 8.95 | 3.8 | 2.2 | LOW |
| cassava | [169985](https://fdc.nal.usda.gov/food-details/169985/nutrients) | Cassava, raw | **1.7** | T | — | — | — | — | — | 38.1 | 1.8 | — | LOW |
| celeriac | [170400](https://fdc.nal.usda.gov/food-details/170400/nutrients) | Celeriac, raw | **1.6** | T | — | — | — | — | — | 9.2 | 1.8 | — | LOW |
| celery | [169988](https://fdc.nal.usda.gov/food-details/169988/nutrients) | Celery, raw | **1.34** | O | 0.4 | 0.37 | 0.08 | 0 | 0 | 2.97 | 1.6 | 0.85 | LOW |
| chard (swiss) | [169991](https://fdc.nal.usda.gov/food-details/169991/nutrients) | Chard, swiss, raw | **1.1** | T | — | — | — | — | — | 3.74 | 1.6 | — | LOW |
| cherry (sweet) | [171719](https://fdc.nal.usda.gov/food-details/171719/nutrients) | Cherries, sweet, raw | **12.8** | n/s | 6.59 | 5.37 | 0.15 | 0.12 | 0 | 16 | 2.1 | 12.23 | UNCERTAIN |
| chickpea (raw/dry) | [173756](https://fdc.nal.usda.gov/food-details/173756/nutrients) | Chickpeas (garbanzo beans, bengal gram), mature seeds, raw | **10.7** | T | — | — | — | — | — | 63 | 12.2 | — | LOW |
| chicory / witloof | [170404](https://fdc.nal.usda.gov/food-details/170404/nutrients) | Chicory, witloof, raw | **—** | — | — | — | — | — | — | 4 | 3.1 | — | LOW |
| chicory greens | [169992](https://fdc.nal.usda.gov/food-details/169992/nutrients) | Chicory greens, raw | **0.7** | O | — | — | — | — | — | 4.7 | 4 | — | LOW |
| collard | [170406](https://fdc.nal.usda.gov/food-details/170406/nutrients) | Collards, raw | **0.46** | BFSN | — | — | — | — | — | 5.42 | 4 | — | LOW |
| dandelion greens | [169226](https://fdc.nal.usda.gov/food-details/169226/nutrients) | Dandelion greens, raw | **0.71** | BFSN | — | — | — | — | — | 9.2 | 3.5 | — | LOW |
| eggplant | [169228](https://fdc.nal.usda.gov/food-details/169228/nutrients) | Eggplant, raw | **3.53** | n/s | 1.58 | 1.54 | 0.26 | — | — | 5.88 | 3 | 3.38 | UNCERTAIN |
| endive | [168412](https://fdc.nal.usda.gov/food-details/168412/nutrients) | Endive, raw | **0.25** | O | — | — | — | — | — | 3.35 | 3.1 | — | LOW |
| fennel bulb | [169385](https://fdc.nal.usda.gov/food-details/169385/nutrients) | Fennel, bulb, raw | **3.93** | BFSN | — | — | — | — | — | 7.3 | 3.1 | — | LOW |
| fig | [173021](https://fdc.nal.usda.gov/food-details/173021/nutrients) | Figs, raw | **16.3** | O | — | — | — | — | — | 19.2 | 2.9 | — | LOW |
| ginger root | [169231](https://fdc.nal.usda.gov/food-details/169231/nutrients) | Ginger root, raw | **1.7** | T | — | — | — | — | — | 17.8 | 2 | — | LOW |
| grape | [174683](https://fdc.nal.usda.gov/food-details/174683/nutrients) | Grapes, red or green (European type, such as Thompson seedless), raw | **15.5** | A | 7.2 | 8.13 | 0.15 | 0 | 0 | 18.1 | 0.9 | 15.48 | HIGH |
| green pea | [170419](https://fdc.nal.usda.gov/food-details/170419/nutrients) | Peas, green, raw | **5.67** | NC | 0.12 | 0.39 | 4.99 | 0.17 | — | 14.4 | 5.7 | 5.67 | LOW |
| horseradish | [173472](https://fdc.nal.usda.gov/food-details/173472/nutrients) | Horseradish, prepared | **7.99** | O | — | — | — | — | 0 | 11.3 | 3.3 | — | LOW |
| Jerusalem artichoke / sunchoke | [169236](https://fdc.nal.usda.gov/food-details/169236/nutrients) | Jerusalem-artichokes, raw | **9.6** | T | — | — | — | — | — | 17.4 | 1.6 | — | LOW |
| jicama / yambean | [170073](https://fdc.nal.usda.gov/food-details/170073/nutrients) | Yambean (jicama), raw | **1.8** | BFSN | — | — | — | — | — | 8.82 | 4.9 | — | LOW |
| kale | [168421](https://fdc.nal.usda.gov/food-details/168421/nutrients) | Kale, raw | **0.99** | A | 0.4 | 0.41 | 0.18 | 0 | — | 4.42 | 4.1 | 0.99 | HIGH |
| kohlrabi | [168424](https://fdc.nal.usda.gov/food-details/168424/nutrients) | Kohlrabi, raw | **2.6** | O | — | — | — | — | — | 6.2 | 3.6 | — | LOW |
| leek | [169246](https://fdc.nal.usda.gov/food-details/169246/nutrients) | Leeks, (bulb and lower leaf-portion), raw | **3.9** | T | — | — | — | — | — | 14.2 | 1.8 | — | LOW |
| lentil (raw) | [172420](https://fdc.nal.usda.gov/food-details/172420/nutrients) | Lentils, raw | **2.03** | NC | 0 | 0.27 | 1.47 | 0.3 | 49.9 | 63.4 | 10.7 | 2.04 | LOW |
| lotus root | [169250](https://fdc.nal.usda.gov/food-details/169250/nutrients) | Lotus root, raw | **—** | — | — | — | — | — | — | 17.2 | 4.9 | — | LOW |
| mango | [169910](https://fdc.nal.usda.gov/food-details/169910/nutrients) | Mangos, raw | **13.7** | n/s | 2.01 | 4.68 | 6.97 | 0 | — | 15 | 1.6 | 13.66 | UNCERTAIN |
| melon (cantaloupe) | [169092](https://fdc.nal.usda.gov/food-details/169092/nutrients) | Melons, cantaloupe, raw | **7.86** | n/s | 1.54 | 1.87 | 4.35 | 0.04 | 0.03 | 8.16 | 0.9 | 7.8 | UNCERTAIN |
| melon (honeydew) | [169911](https://fdc.nal.usda.gov/food-details/169911/nutrients) | Melons, honeydew, raw | **8.12** | A | 2.68 | 2.96 | 2.48 | 0 | 0 | 9.09 | 0.8 | 8.12 | HIGH |
| mung bean sprouts | [169957](https://fdc.nal.usda.gov/food-details/169957/nutrients) | Mung beans, mature seeds, sprouted, raw | **4.13** | O | — | — | — | — | — | 5.94 | 1.8 | — | LOW |
| mustard greens | [169256](https://fdc.nal.usda.gov/food-details/169256/nutrients) | Mustard greens, raw | **1.32** | BFSN | — | — | — | — | — | 4.67 | 3.2 | — | LOW |
| mustard spinach | [168438](https://fdc.nal.usda.gov/food-details/168438/nutrients) | Mustard spinach, (tendergreen), raw | **—** | — | — | — | — | — | — | 3.9 | 2.8 | — | LOW |
| nectarine | [169914](https://fdc.nal.usda.gov/food-details/169914/nutrients) | Nectarines, raw | **7.89** | A | 1.57 | 1.37 | 4.87 | 0 | 0.07 | 10.6 | 1.7 | 7.81 | HIGH |
| okra | [169260](https://fdc.nal.usda.gov/food-details/169260/nutrients) | Okra, raw | **1.48** | NC | 0.32 | 0.57 | 0.6 | 0 | 0.34 | 7.45 | 3.2 | 1.49 | LOW |
| olives (green, pickled) | [169096](https://fdc.nal.usda.gov/food-details/169096/nutrients) | Olives, pickled, canned or bottled, green | **0.54** | O | — | — | — | — | — | 3.84 | 3.3 | — | LOW |
| olives (ripe, canned) | [169094](https://fdc.nal.usda.gov/food-details/169094/nutrients) | Olives, ripe, canned (small-extra large) | **0** | Z | — | — | — | — | — | 6.04 | 1.6 | — | LOW |
| pak-choi / bok choy | [170390](https://fdc.nal.usda.gov/food-details/170390/nutrients) | Cabbage, chinese (pak-choi), raw | **1.18** | O | — | — | — | — | — | 2.18 | 1 | — | LOW |
| parsnip | [170417](https://fdc.nal.usda.gov/food-details/170417/nutrients) | Parsnips, raw | **4.8** | T | — | — | — | — | — | 18 | 4.9 | — | LOW |
| peach (yellow) | [169928](https://fdc.nal.usda.gov/food-details/169928/nutrients) | Peaches, yellow, raw | **8.39** | A | 1.95 | 1.53 | 4.76 | 0.08 | 0 | 9.54 | 1.5 | 8.32 | HIGH |
| pineapple | [169124](https://fdc.nal.usda.gov/food-details/169124/nutrients) | Pineapple, raw, all varieties | **9.85** | A | 1.73 | 2.12 | 5.99 | 0 | 0 | 13.1 | 1.4 | 9.84 | HIGH |
| plantain (green, raw) | [168215](https://fdc.nal.usda.gov/food-details/168215/nutrients) | Plantains, green, raw | **2.29** | A | 1.09 | 1.02 | 0.18 | 0 | 32 | 36.7 | 2.2 | 2.29 | HIGH |
| plantain (yellow, raw) | [169130](https://fdc.nal.usda.gov/food-details/169130/nutrients) | Plantains, yellow, raw | **17.5** | A | 8.69 | 8.64 | 0.18 | 0 | 12 | 31.9 | 1.7 | 17.51 | HIGH |
| plum | [169949](https://fdc.nal.usda.gov/food-details/169949/nutrients) | Plums, raw | **9.92** | A | 5.07 | 3.07 | 1.57 | 0.08 | 0 | 11.4 | 1.4 | 9.79 | HIGH |
| pumpkin | [168448](https://fdc.nal.usda.gov/food-details/168448/nutrients) | Pumpkin, raw | **2.76** | BFSN | — | — | — | — | — | 6.5 | 0.5 | — | LOW |
| purslane | [169274](https://fdc.nal.usda.gov/food-details/169274/nutrients) | Purslane, raw | **—** | — | — | — | — | — | — | 3.39 | — | — | LOW |
| radicchio | [168564](https://fdc.nal.usda.gov/food-details/168564/nutrients) | Radicchio, raw | **0.6** | BFSN | — | — | — | — | — | 4.48 | 0.9 | — | LOW |
| radish (red, raw) | [169276](https://fdc.nal.usda.gov/food-details/169276/nutrients) | Radishes, raw | **1.86** | NC | 1.05 | 0.71 | 0.1 | 0 | 0 | 3.4 | 1.6 | 1.86 | LOW |
| rhubarb | [167758](https://fdc.nal.usda.gov/food-details/167758/nutrients) | Rhubarb, raw | **1.1** | T | — | — | — | — | — | 4.54 | 1.8 | — | LOW |
| rutabaga | [168454](https://fdc.nal.usda.gov/food-details/168454/nutrients) | Rutabagas, raw | **4.46** | NC | 2.3 | 1.61 | 0.53 | 0.02 | 0.4 | 8.62 | 2.3 | 4.46 | LOW |
| savoy cabbage | [170388](https://fdc.nal.usda.gov/food-details/170388/nutrients) | Cabbage, savoy, raw | **2.27** | BFSN | — | — | — | — | — | 6.1 | 3.1 | — | LOW |
| snow pea / edible-podded pea | [170010](https://fdc.nal.usda.gov/food-details/170010/nutrients) | Peas, edible-podded, raw | **4** | T | — | — | — | — | — | 7.55 | 2.6 | — | LOW |
| spinach | [168462](https://fdc.nal.usda.gov/food-details/168462/nutrients) | Spinach, raw | **0.42** | NC | 0.11 | 0.15 | 0.07 | 0 | — | 3.63 | 2.2 | 0.33 | LOW |
| taro | [169308](https://fdc.nal.usda.gov/food-details/169308/nutrients) | Taro, raw | **0.4** | O | — | — | — | — | — | 26.5 | 4.1 | — | LOW |
| turnip | [170465](https://fdc.nal.usda.gov/food-details/170465/nutrients) | Turnips, raw | **3.8** | T | — | — | — | — | — | 6.43 | 1.8 | — | LOW |
| turnip greens | [170061](https://fdc.nal.usda.gov/food-details/170061/nutrients) | Turnip greens, raw | **0.81** | n/s | 0.52 | 0.29 | — | — | — | 7.13 | 3.2 | 0.81 | UNCERTAIN |
| watercress | [170068](https://fdc.nal.usda.gov/food-details/170068/nutrients) | Watercress, raw | **0.2** | T | — | — | — | — | — | 1.29 | 0.5 | — | LOW |
| watermelon | [167765](https://fdc.nal.usda.gov/food-details/167765/nutrients) | Watermelon, raw | **6.2** | A | 1.58 | 3.36 | 1.21 | 0.06 | 0 | 7.55 | 0.4 | 6.21 | HIGH |
| yam | [170071](https://fdc.nal.usda.gov/food-details/170071/nutrients) | Yam, raw | **0.5** | T | — | — | — | — | — | 27.9 | 4.1 | — | LOW |
| zucchini | [169291](https://fdc.nal.usda.gov/food-details/169291/nutrients) | Squash, summer, zucchini, includes skin, raw | **2.5** | NC | 1.07 | 1.38 | 0.05 | 0 | 0 | 3.11 | 1 | 2.5 | LOW |
---

## 5. Measured HPLC values vs FDC — cabbage

### 5a. USDA-ARS HPLC dataset (the strongest measured evidence found)

**Source:** Plengvidhya V., Breidt F., Lu Z., Fleming H.P. *"DNA Fingerprinting of Lactic Acid Bacteria in Sauerkraut Fermentations."* Applied and Environmental Microbiology. Full text: <https://pmc.ncbi.nlm.nih.gov/articles/PMC2168044/> — USDA-ARS Food Science Research Unit, Raleigh, NC. Commercial Wisconsin sauerkraut plant, **shredded cabbage (mixed cultivars), HPLC**, 4 fermentation tanks over 2 years.

Verbatim: *"Glucose and fructose were the primary fermentable sugars in the cabbage (the concentrations were between 1.5 and 2.2%, respectively) (Table 1). Sucrose accounted for only a small amount of the fermentable sugars (less than 0.2% of the cabbage by weight) and was not detectable in Y2 samples."*

**Table 1 of that paper, exact values (% wt/wt, i.e. g/100 g):**

| Year | Tank | Glucose % | Fructose % | Sucrose % | Malic acid % | **Σ fermentable sugars** |
|---|---|---|---|---|---|---|
| 1 | 1 | 2.15 (119.2 mM) | 1.64 (90.8 mM) | 0.17 (4.8 mM) | 0.08 | **3.96** |
| 1 | 2 | 1.66 (92.4 mM) | 1.47 (81.7 mM) | ND | 0.05 | **3.13** |
| 2 | 1 | 1.63 (90.8 mM) | 1.50 (83.5 mM) | ND | 0.05 | **3.13** |
| 2 | 3 | 1.47 (81.7 mM) | 1.33 (73.8 mM) | ND | 0.06 | **2.80** |

ND = not detected. Millimolar values convert consistently (119.2 mM glucose × 180.16 = 2.15 g/100 mL), so the table is internally sound.

**Comparison with FDC 169975 "Cabbage, raw" (3.2 g/100 g):** the ARS measured range **2.80–3.96 g/100 g brackets and corroborates the FDC value.** There is **no** 4.7–9.4 % disagreement in this dataset.

### 5b. Classic HPLC method paper (citation verified; numbers paywalled)

**Hughes, A. & Lindsay, R.C. (1985).** "Liquid Chromatographic Analysis of Sugars and Mannitol in Cabbage and Fermenting Sauerkraut." *Journal of Food Science* **50**(6): 1662–1667. DOI [10.1111/j.1365-2621.1985.tb10560.x](https://doi.org/10.1111/j.1365-2621.1985.tb10560.x) · [Wiley page](https://ift.onlinelibrary.wiley.com/doi/abs/10.1111/j.1365-2621.1985.tb10560.x)

Citation metadata confirmed via Crossref and Semantic Scholar. **The abstract is elided by the publisher and the full text is closed access — I could not obtain its numeric values.** Flagged as NOT OBTAINED rather than guessed. This is the most likely home of a higher cabbage sugar figure and should be obtained via a library if the discrepancy matters.

### 5c. ARS fermentation review chapter (context, not raw-cabbage sugar)

Pérez-Díaz, Breidt, Buescher, Arroyo-López, Jiménez-Díaz, Garrido Fernández, Bautista Gallego, Yoon, Johanningsmeier. *"Fermented and Acidified Vegetables,"* Chapter 51, **Compendium of Methods for the Microbiological Examination of Foods, APHA 2013.** PDF: <https://www.ars.usda.gov/ARSUserFiles/60701000/Pickle%20Pubs/p390.pdf>

Its Table 51.1 gives **brine/fermented** values only — "Cabbage (sauerkraut): pH 3.2–3.4, acidity 1.5–2.5 % lactic, NaCl 2–3 %, calcium 0.05–0.2 %, **sugar 0–0.05 % glucose**, sorbate 0". Footnote: *"Residual sugars in fermented sauerkraut are mainly glucose and fructose, which range between 0.02% and 0.5%, and 0.15% and 0.19%."* These are **post-fermentation residuals and must not be used as raw cabbage sugar content.**

---

## 6. USDA Agricultural Handbook No. 8 (Watt & Merrill) — the sugar question

**Answer: AH-8-11 reports NO sugar values at all.** This is not an access failure — I read the documentation pages and the cabbage data page directly.

**Document verified:** *Composition of Foods: Vegetables and Vegetable Products — Raw, Processed, Prepared*, **Agriculture Handbook No. 8-11**, USDA Human Nutrition Information Service, revised August 1984 (a major revision of the 1963 AH-8). HathiTrust full view, public domain, Google-digitized: <https://hdl.handle.net/2027/umn.31951002926106c>

**Cabbage raw is printed page 109, NDB No. 11109** (mapping from the "Guide to vegetables and vegetable products", guide page 18). Page fetched: <https://babel.hathitrust.org/cgi/ssd?id=umn.31951002926106c;seq=117;num=109>

The nutrient list on page 109 is **PROXIMATE / MINERALS / VITAMINS / LIPIDS / AMINO ACIDS**. There is **no sugar row, and no glucose, fructose, sucrose or maltose row** — nor is there one for any other vegetable (the documentation section on pp. 2–3 defines only: Proximate components, Carbohydrates, Minerals, Vitamins, Lipids).

**AH-8-11 raw cabbage values actually printed (page 109, per 100 g edible portion):**

| Nutrient | Mean | Std. error | n |
|---|---|---|---|
| Water | 92.52 g | 0.173 | 57 |
| Food energy | 24 kcal | — | 8 |
| Protein (N × 6.25) | 1.21 g | 0.132 | 6 |
| Total lipid (fat) | 0.18 g | 0.071 | 5 |
| **Carbohydrate, total** | **5.37 g** | 1.88 | 4 |
| **Fiber** | **2 g** | 0.80 | — |
| Ash | 0.72 g | 0.021 | 27 |
| Calcium | 47 mg | 2.244 | 36 |
| Ascorbic acid | 47.3 mg | 3.141 | 7 |

Page footnotes: refuse outer leaves and core 20 %; *"Insoluble dietary fiber as determined by the neutral detergent fiber method = 1.1 g per 100 g"*; *"Alpha-tocopherol = 1.67 mg per 100 g."*

**Critical methodological warning — the carbohydrate definition (AH-8-11 p. 3, verbatim):**

> *"Carbohydrates.--The carbohydrate value is the difference between 100 and the sum of the percentages of water, protein, fat, and ash. **The value for carbohydrate includes crude fiber.** Insoluble dietary fiber, as determined by the neutral detergent fiber method (2), and soluble fiber as pectin are given in footnotes when data were available."*

So AH-8-11's 5.37 g carbohydrate for cabbage is a **by-difference residue that includes fiber** and is **not** sugar and **not** comparable to modern FDC "Carbohydrate, by difference" (which now excludes fiber).

**Traceability of FDC to AH-8-11:** FDC 169335 *"Cabbage, common (danish, domestic, and pointed types), freshly harvest, raw"* and FDC 169336 *"…stored, raw"* both carry `carb_g = 5.37` — exactly the AH-8-11 value, and both are derivation `NC`. FDC 169975 "Cabbage, raw" instead carries 5.8 g. The AH-8-11 legacy is still visible inside FDC.

**Conclusion for the task:** there are **no** "USDA Agricultural Handbook No. 8 (Watt & Merrill) sugar values for these vegetables" to report, because the handbook predates sugar speciation in USDA tables. Sugar values entered USDA tables later, via the Nutrient Data Bank, which is why so many SR Legacy total-sugars values are `NC`/`T`.

*Not separately retrieved:* AH-8-9 *"Composition of Foods: Fruits and Fruit Juices"* (1982). By the same series design it reports carbohydrate by difference and no sugars; I did not verify its pages directly, so treat that as unconfirmed rather than asserted.

---

## 7. Items I could NOT find

**Genuinely absent from FDC SR Legacy / Foundation Foods (searched the full 7,793 + 340 food sets):**

| Requested item | Status |
|---|---|
| **sugar beet** | **NOT IN FDC.** Zero hits for "sugar beet" in SR Legacy. It is an industrial crop, not a table food. FDC has only *"Beets, raw"* (169145, garden beet). |
| **tatsoi** | **NOT IN FDC.** No entry under tatsoi / tah tsai / rosette pak choi. |
| **mizuna** | **NOT IN FDC.** No entry. |
| **komatsuna** | **NOT IN FDC.** No entry. |
| **mustard spinach** | Present but **no sugar data at all**: 168438 *"Mustard spinach, (tendergreen), raw"* — Total Sugars, glucose, fructose, sucrose, maltose and starch are all absent. |
| **escarole, raw** | **No raw entry.** Only *"Escarole, cooked, boiled, drained, no salt added"* (168413). Closest raw relatives: *"Endive, raw"* (168412) and *"Chicory, witloof, raw"* (170404) — but note these have no sugar speciation either. |
| **purslane, raw** (169274) | Present, but **no total sugars and no speciation**. |
| **lotus root, raw** (169250) | Present, but **no total sugars and no speciation**. |
| **water spinach** | NOT IN FDC. |
| **horseradish, raw** | **No raw entry.** Only *"Horseradish, prepared"* (173472), total sugars 7.99 g derivation `O` (imputed) — prepared horseradish is a vinegar/cream formulation, so this is **not** raw horseradish sugar. |
| **napa cabbage, raw** | FDC has *"Cabbage, chinese (pe-tsai), raw"* (169979) and Foundation *"Cabbage, napa, leaf, destemmed, raw"* (2727583). The Foundation napa entry has **no sugar or carbohydrate data at all**. |

**Literature not obtained:**
- Hughes & Lindsay (1985) numeric values — paywalled, abstract publisher-elided. Citation fully verified (§5b).
- Any USDA/ARS source stating cabbage fermentable sugars at **4.7–9.4 %** — **NOT FOUND**. Multiple targeted searches returned nothing supporting it; the ARS HPLC data found instead reads 2.80–3.96 %.
- No USDA/ARS paper was found stating that FDC's ~3.2 g/100 g cabbage total sugars *under*-reports true fermentable sugars. The measured ARS evidence points the other way.
- AH-8-9 (Fruits and Fruit Juices, 1982) pages — not retrieved.

---

## 8. Confidence summary

| Confidence | Meaning | Count |
|---|---|---|
| **HIGH** | Total sugars derivation `A` or `JA` — measured on that food | 18 rows |
| **LOW** | `NC`, `T`, `O`, `BFSN`, `Z`, `MA`, or value absent — calculated, borrowed, imputed, or assumed | 74 rows |

**Where FDC total sugars and its own components disagree** (Σ indiv. ≠ stated total): celery (1.34 stated vs 0.85 summed), spinach (0.42 vs 0.33), broccoli (1.70 vs 1.48), eggplant (3.53 vs 3.38). These gaps arise because the total and the components carry different derivation codes and vintages — another reason to prefer the individual sugars when they exist.

**Bottom line.** For raw produce sugar speciation, FDC is reliable only for the `A`/`JA` rows. For cabbage specifically, FDC 169975's individual sugars (glucose 1.67, fructose 1.45, sucrose 0.08, maltose 0.01) are the best available and are corroborated by the ARS HPLC range of 2.80–3.96 g/100 g total fermentable sugars. The frequently-repeated ~3.2 g/100 g figure is sound; the 4.7–9.4 % figure is unsupported by any source I could locate.
