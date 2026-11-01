# SourDough hostile review — findings report

> **For the coding agent:** work top-down. Each finding has a file/line reference, an evidence/reproduction, and a suggested fix. This file is a review report, not a specification: verify each finding before changing code, and open one PR per logical group rather than trying to fix everything at once.

Repo reviewed: `tuncoglu/SourDough` at `ff0e897` (`main`), 2026-11-01.  
Working tree stayed clean during the review; no repo files were modified by the review itself.

## What I ran

- `SourDoughMobile`: `npx tsc --noEmit` — pass.
- `SourDoughMobile`: `npx jest --silent` — **30 suites / 473 tests pass** (includes `packages/calc` and `functions`).
- `functions` and `packages/calc`: `tsc -p` — pass.
- Web apps: Vitest **48** (bread), **54** (yogurt), **60** (lacto), **15** (hub) — all pass.
- Web apps: `npx vite build` — pass.
- On this Android/Termux host, `npm run build` in the web apps cannot run because TypeScript 7's `@typescript/typescript-android-arm64` binary is unavailable. A TypeScript 6 typecheck of each app passes, so this is a host/toolchain portability issue, not a source failure.
- `npm audit --omit=dev` in `SourDoughMobile`: **34 vulnerabilities — 1 critical, 12 high, 20 moderate, 1 low**.
- No secrets were found in the 201-commit history.

No critical security leak was found. The serious problems are model correctness, silent fallback behaviour, and claims that do not match the shipped bread path.

---

## Confirmed findings, ranked

### 1. High — [Model] High-temperature response is inverted; 45 °C and 100 °C both return a 2 h bulk

**Where:** `packages/calc/src/lib/calculations.ts:121-130`, `:314-317`, `:576-577`

**What is wrong:** Above `MAX_EFFECTIVE_TEMP_BREAD` (38 °C), the "penalty" multiplies the rate by a number **greater than 1**:

```ts
const capped = Math.min(temp, 38);
let rate = Math.pow(2.5, (capped - 26) / 10);
if (temp > 38) {
  const penalty = overshoot <= 7 ? 1 + overshoot / 7 : 2 + (overshoot - 7) * 0.5;
  rate *= penalty;
}
```

So 45 °C ferments faster than 38 °C, and 80 °C faster still. The minimum-hours floor then hides the problem:

| Dough temp | Rate multiplier | Reported bulk |
|---:|---:|---:|
| 26 °C | 1.00 | 4 h |
| 32 °C | 1.73 | 2.5 h |
| 38 °C | 3.00 | 2 h |
| 45 °C | 6.01 | 2 h |
| 80 °C | 58.6 | 2 h |
| 100 °C | — | 2 h |

The advice text at `:576-577` says: "Above ~40°C yeast cells start to die — the estimate assumes slowing". The estimate does the opposite. The floor is `MIN_FERMENTATION_HOURS = 2` at `:40`, applied at `:316`.

**Reproduction:**

```ts
estimateFermentation(45, 20, 70, 'Generic: Bread Flour').hours // 2
estimateFermentation(80, 20, 70, 'Generic: Bread Flour').hours // 2
tempRateMultiplier(45) // 6.006
tempRateMultiplier(38) // 3.003
```

**Fix:** Replace the Q10+increasing-penalty curve with a cardinal or piecewise rate that falls toward zero above the yeast optimum. Above the maximum viable temperature, return a stalled/undefined estimate, not `2 h`. Remove or re-scope the floor for hot dough. Add tests that assert the rate is non-increasing from 30 → 38 → 42 → 45 → 50 °C, or that hot dough is explicitly stalled.

---

### 2. High — [Model/Failure] Native bread uses the outdoor temperature as the kitchen and ignores the Settings kitchen temperature

**Where:** `SourDoughMobile/src/hooks/useCalculatorInputs.ts:186-197`, `SourDoughMobile/src/lib/location.ts:103-110`, `SourDoughMobile/app/(tabs)/bread.tsx:150,157,191-199`, `SourDoughMobile/app/(tabs)/settings.tsx:193-208`, `SourDoughMobile/src/hooks/useKitchenTemp.ts:22-25`

**What is wrong:** `useCalculatorInputs` auto-fills `ambientTemp` from `locationData.ambientTemp`, which is the **outdoor** Open-Meteo temperature. `bread.tsx` then uses that as `roomTempC`, and as the default flour temperature. `fermTempOverride` — the Settings field explicitly described as "the temperature where the jar actually sits" — is never read by the bread calculator. Only the Starter tab uses it via `useKitchenTemp`.

The web bread app at least warns: "It is the outdoor figure, so type your room temperature if it differs" (`apps/bread/src/Cards.tsx:219-222`). The native app shows only an "auto" badge.

**Evidence:** With the default 500 g / 75 % / 20 % / 100 % starter, using the real `estimateLazyLoaf`:

| Room temp | Bulk |
|---:|---:|
| 4 °C | 30 h |
| 20 °C | 8 h |
| 26 °C | 5 h |

A winter outdoor reading of 4 °C therefore triples the estimate compared with a 20 °C kitchen, and setting 20 °C in Settings changes nothing on the bread page. `useStarterStatus(roomTempC)` on `bread.tsx:157` has the same problem, so the starter/peak forecast is also based on outdoor weather.

**Fix:** Resolve `roomTempC` as: `fermTempOverride > 0` → use it; else use a clearly labelled outdoor fallback, not an "auto" kitchen temperature. Do the same for the starter status and for the flour temperature. Add a test with `fermTempOverride = 20` and an outdoor value of 4 that asserts the estimate uses 20.

---

### 3. High — [Failure] Weather failure after a successful geocode silently becomes 22 °C / 18 °C with an "auto" badge

**Where:** `SourDoughMobile/src/lib/location.ts:41-58`, `:103-110`; `SourDoughMobile/src/hooks/useCalculatorInputs.ts:188-196`; `SourDoughMobile/src/components/LocationBar.tsx:120-130`

**What is wrong:** `detectAll` performs the reverse geocode first. If it succeeds, it then fetches ambient temperature, hourly forecast, and tap-water temperature. All three can return `null`; `detectAll` still returns a non-null `LocationData` with `ambientTemp: null`. `getAutoTemps` substitutes 22 °C and 18 °C. `useCalculatorInputs` auto-fills those values and `bread.tsx` shows the room-temp field with `isAuto={!!inputs.locationData}` — so the UI claims the 22 °C is auto-detected.

`LocationProvider` only sets `locError` when `detectAll` returns `null`, so there is no error, no banner, and no indication the estimate is degraded.

**Reproduction:** Mock `getAmbientTemp`, `fetchHourlyForecast`, and `estimateWaterTemp` to return `null` while `reverseGeocode` succeeds. `locationData.ambientTemp` is `null`, the bread page uses 22 °C, and the summary still shows the city and water hardness.

**Fix:** Distinguish "location resolved" from "weather resolved". If ambient/forecast are null, surface a warning such as "Weather unavailable — using 22 °C default; enter your kitchen temperature", do not set the `auto` badge, and do not silently feed defaults into the model. Same for the tap temperature.

---

### 4. High — [Model/Claims] "Dynamic fermentation" is not used, and the dynamic model is 4× wrong if used

**Where:** `packages/calc/src/lib/breadPlan.ts:242` (passes `null` as the forecast), `SourDoughMobile/app/(tabs)/bread.tsx:147-149` ("No weather forecast is used"), `packages/calc/src/lib/calculations.ts:416-454`, `README.md:46`

**What is wrong:** Both the native and web bread pages call `planBread`, which passes `null` to `estimateLazyLoaf`. `estimateLazyLoaf` then falls back to `staticFermentHours`; `estimateDynamicFermentation` never runs in production. The README still advertises "Dynamic fermentation — hour-by-hour model accounting for ambient drift".

Even if it were used, the time step is wrong. The loop iterates over **hourly** forecast points but advances progress and dough temperature by `DT = 0.25` each iteration:

```ts
for (const point of forecast) {
  doughTemp += (amb - doughTemp) * (1 - Math.exp(-DT / TAU));
  progress += rate * DT;
  steps++;
}
const bulkHours = steps * DT;
```

So 4 forecast hours count as 1 modelled hour.

**Evidence:**

- Constant 26 °C: reported bulk `4 h`, but the profile contains 16 hourly forecast points (05:00–20:00).
- 10 °C for 12 h, then 30 °C: reported bulk `6.5 h`; an hourly integration gives about `12.9 h` (12 h at 10 °C plus ~0.85 h at 30 °C).
- 20 °C for 10 h, then 30 °C: reported bulk `5 h`; hourly integration completes at about `6.9 h` at 20 °C.
- The profile timestamps span 24 h while `bulkHours` says 6.5 h.

`fermentAdvice` at `:573-574` also says "The dynamic estimate above accounts for this", but in the bread path there is no dynamic estimate.

**Fix:** Either ship the dynamic model properly — pass the forecast (or a constant ambient series derived from the room temperature), advance one hour per forecast point, and set `bulkHours` from the forecast clock — or remove the dynamic claim and the "dynamic estimate above" copy. Add a test using a step-change forecast that asserts the profile's wall-clock span equals `bulkHours`.

---

### 5. High — [Data/Failure] All of England outside London gets London's 280 mg/L "very hard" water

**Where:** `packages/calc/src/data/waterHardness.ts:91-100` (`england: 'gb-england-se'`), `SourDoughMobile/src/lib/api.ts:181-182` (uses only `addr.state || addr.county`), `packages/calc/src/data/waterHardness.ts:130-138`

**What is wrong:** Nominatim returns `state: "England"` for Manchester, Leeds, and Birmingham — verified live. The reverse geocoder ignores `state_district` and `ISO3166-2-lvl8`. `lookupWaterHardness('gb', 'England')` matches the broad `england` keyword and returns `gb-england-se` = **280 mg/L, very hard**. The app's own postcode table says Manchester (`M`) is 120 mg/L, and real Manchester water is soft.

This is the app's headline "water hardness for your exact spot" feature, and it is confidently wrong for most of England.

**Evidence:**

- Live Nominatim for Manchester: `state: 'England'`, `state_district: 'Greater Manchester'`, `country_code: 'gb'`.
- `lookupWaterHardness('gb', 'England')` → 280 mg/L.
- `lookupUkPostcodeHardness('M1')` → 120 mg/L.
- Leeds and Birmingham also come back as just `state: 'England'`.

**Fix:** Use `state_district` / `ISO3166-2-lvl8` in `reverseGeocode`, add a city/region mapping or require a postcode for England, and never map all of England to the South East. Add tests for Manchester, Leeds, Birmingham, London, Scotland, and Wales.

---

### 6. Medium — [Model] Cold-end Q10 is too fast, and the code already knows it

**Where:** `packages/calc/src/lib/calculations.ts:49,122-130`; `packages/calc/src/lib/starterStatus.ts:12-23`

**What is wrong:** The bread engine uses the same `Q10 = 2.5` down to fridge temperatures. At 4 °C that gives a rate of `2.5^(-2.2) = 0.133`, so a 20 % starter dough is estimated at **30 h**. The app's own starter model says the simple Q10 model gives ~19 % at 4 °C, "far too fast", and hardcodes `FRIDGE_RATE = 0.06` — which would imply about **67 h**. The cold-proof comment at `:629-635` also admits a uniform Q10 does not capture the cold response.

**Evidence:**

```ts
estimateFermentation(4, 20, 70).hours  // 30
estimateFermentation(20, 20, 70).hours // 7
```

**Fix:** Use a low-temperature floor / Arrhenius breakpoint or a separate cold rate, calibrated against cold-retard data. Add tests for 4, 10, 15, 20 °C ratios, not just "colder is longer".

---

### 7. Medium — [Model] The static estimate holds the initial FDT for the whole bulk; the dough never warms

**Where:** `packages/calc/src/lib/calculations.ts:289-316`, `:724-767`; `packages/calc/src/lib/lazyPlan.ts:119`

**What is wrong:** `estimateFermentation` takes one `fdt` and uses it for the entire fermentation. It never drifts toward `roomTempC`. With a fridge-cold starter, the default 26 °C dough starts at FDT ≈ 23.6 °C and stays there; in reality it warms to room temperature in roughly 1.5 h (the `TAU = 1.5` constant is defined but only used by the unused dynamic model). The model therefore systematically overestimates time whenever the starter or water is colder than the room.

The saved-recipe advice even says "The dynamic estimate above accounts for this" (`calculations.ts:573-574`) when no dynamic estimate exists.

**Fix:** Integrate a simple thermal drift toward `roomTempC` even without a weather forecast, then compute the rate over that trajectory. Alternatively, use the dynamic model with a constant ambient series. Add a test comparing a 4 °C starter with a room-temperature starter at the same kitchen temperature.

---

### 8. Medium — [Model/UI] Form percentages are of bowl flour, but the engine and the "total hydration" display use total flour

**Where:** `packages/calc/src/lib/breadPlan.ts:204-205`; `packages/calc/src/lib/lazyPlan.ts:83-98`; `apps/bread/src/Cards.tsx:193-200`

**What is wrong:** Water and starter percentages are multiplied by `flourGrams`, the bowl flour:

```ts
const waterGrams = (flourGrams * form.waterPct) / 100;
const starterGrams = (flourGrams * form.starterPct) / 100;
```

But salt is a percentage of total flour including the starter's flour, and `estimateLazyLoaf` derives the actual hydration from total flour. With the default 500 g flour, 75 % water, 20 % starter at 100 % hydration:

- water = 375 g
- starter = 100 g → 50 g flour + 50 g water
- total flour = 550 g
- total water = 425 g
- **actual hydration = 77.3 %, not 75 %**

The web app shows "Total hydration 77 %" right next to the 75 % input (`Cards.tsx:200`). For a 50 % hydration starter the actual is 72.1 %; for 200 % it is 82.8 %. The model uses the actual value, so the displayed formula and the estimate disagree.

**Fix:** Define the input percentages consistently — either solve for total flour so 75 % really means 75 % of total flour, or clearly label them "of bowl flour" and show the resulting total hydration. Add tests for starter hydrations of 50, 100, and 200 %.

---

### 9. Medium — [Model/UI] No range validation; native inputs can produce absurd output

**Where:** `SourDoughMobile/app/(tabs)/bread.tsx:50-62` (`PercentField` only checks decimal syntax); `packages/calc/src/lib/lazyPlan.ts:76-79` (only `> 0` and finite); `packages/calc/src/lib/calculations.ts:103-109`, `:304`

**What is wrong:** The native PercentField has no min/max, and `estimateLazyLoaf` does not enforce ranges. The following are accepted:

| Input | Result |
|---|---|
| 1000 % starter, fed at room temp | bulk ≈ 1 h |
| 1000 % starter, fridge-cold | bulk ≈ 6.5 h |
| 1000 % water | bulk 2 h, hydration 918 % |
| 100 °C room | bulk 2 h |
| 1,000,000,000 g flour | bulk 5 h, dough 1.97 billion g |

The direct library API is worse: `estimateFermentation(26, 20, 0)` returns `Infinity`; negative hydration returns `NaN`; `NaN` inoculation returns `NaN`; `Infinity` inoculation returns `0 h`. `estimateLazyLoaf` guards non-finite values but not sensible ranges.

**Fix:** Clamp in both UI and engine: starter 5–50 %, water 50–100 %, salt 0–4 %, temperature −10–60 °C, flour and batch size to a sane maximum. Reject `NaN`/`Infinity` at the API boundary. Add property/fuzz tests that assert all outputs are finite and within a plausible band.

---

### 10. Medium — [Failure/Data] Unknown water hardness is displayed as a measured value

**Where:** `packages/calc/src/lib/hardnessUtils.ts:11-15`; `SourDoughMobile/src/lib/location.ts:62-73`; `SourDoughMobile/src/components/LocationBar.tsx:152-157`

**What is wrong:** When the country/region is not in the table, `lookupWaterHardness` returns `FALLBACK_HARDNESS` (120 mg/L, note "Unknown — assuming moderate"). `buildSummary` always renders:

```ts
`🧪 Water ${hardness.classification} (${hardness.mgL} mg/L)`
```

So the user sees "Water slightly hard (120 mg/L)" as if it were local data. The fallback banner only appears when `!locationData`; it does not check `hardness.key === 'fallback'`. The water advice then says "Ideal range for most sourdough" for this guess. The web `hardnessFor` has a `source: 'assumed'` and the web UI says "water hardness unknown"; the native UI does not.

**Fix:** Check `hardness.key === 'fallback'` / `source === 'assumed'` and render "unknown — assuming 120 mg/L" plus a warning. Do not call an assumed value "ideal".

---

### 11. Medium — [Failure] Arbitrary text can be used as a postcode and maps to a postcode area; "London" becomes Liverpool

**Where:** `SourDoughMobile/src/hooks/useLocation.tsx:261-275` (no validation); `packages/calc/src/data/waterHardness.ts:121-125`; `packages/calc/src/data/ukWaterHardness.ts:260-283`

**What is wrong:** `refineWithPostcode` accepts any text and passes it to `geocodePostcode`, then to `detectAll` as a postcode. The UK hardness branch accepts any non-empty string when the reverse-geocoded country is GB. `lookupUkPostcodeHardness` falls back to the first letter:

```ts
lookupUkPostcodeHardness('London')  // ['130', 'moderately soft', 'Liverpool...']
lookupUkPostcodeHardness('M1')      // 120, Manchester
lookupUkPostcodeHardness('SW1A 1AA')// 280, South West London
```

So a user who types "London" into the "postcode" field gets London weather but **Liverpool** water hardness. `geocodePostcode` also omits `addressdetails=1`, so its returned city/country fields are `Unknown`; that is currently masked because `detectAll` reverse-geocodes again, but it is fragile.

**Fix:** Gate the postcode path with `looksLikeUkPostcode` (already in `hardnessFor`), use the geocoded country, and add `addressdetails=1` to the search URL. Test "London", "SW1A 1AA", "M1", and invalid text.

---

### 12. Medium — [Privacy/Failure] Android "Approximate" location is treated as denial; privacy says coarse but the app requests fine

**Where:** `SourDoughMobile/src/hooks/useLocation.tsx:158-174`; `SourDoughMobile/PRIVACY.md:24`; `SourDoughMobile/modules/sourdough-location/android/src/main/java/com/sourdough/location/SourdoughLocationModule.kt:29-41`

**What is wrong:** The app requests only `ACCESS_FINE_LOCATION` and returns `granted === PermissionsAndroid.RESULTS.GRANTED`. On Android 12+, if the user chooses "Approximate", the fine permission is denied while coarse is granted; the app then reports "Location permission denied" and does not use the coarse fix. Coarse location is plenty for weather and water hardness.

The privacy policy says "coarse location", but the app requests fine and the custom module uses GPS. `PLAY_RELEASE.md` says Data Safety declares both approximate and precise. The privacy text is inaccurate either way.

**Fix:** Request/accept `ACCESS_COARSE_LOCATION` (or both and accept either), use the coarse fix for these lookups, and update the privacy policy to match what is actually requested. Add a test/manual check for the Android 12 approximate flow.

---

### 13. Medium — [Failure] Stale last-known location is used silently

**Where:** `SourDoughMobile/modules/sourdough-location/android/src/main/java/com/sourdough/location/SourdoughLocationModule.kt:46-49`, `:74-79`

**What is wrong:** If no provider is enabled, the module returns `lastKnown` of **any age**. If the 15 s timeout fires, it also returns `lastKnown`, regardless of age. A user who travelled with location off can get weather and water hardness for a place they left days ago, with no warning.

**Fix:** Reject or clearly label a `lastKnown` older than 10–30 minutes; prefer a fresh fix. Add an age check in the no-provider and timeout branches.

---

### 14. Medium — [Model] `computeFermentTemp` averages past hours and whole calendar days

**Where:** `packages/calc/src/lib/lactoCalculations.ts:1067-1106`

**What is wrong:** The function buckets all forecast points by local calendar day and uses **full days**, including hours before `now`. A yogurt started at 18:00 with a 1-day fermentation averages the 18 hot afternoon hours it will never see.

**Reproduction:** 24 forecast hours: 00:00–17:00 at 30 °C, 18:00–23:00 at 10 °C, `estimatedDays = 1`. `computeFermentTemp` returns an effective **25.7 °C**, even though the fermentation only sees the 10 °C evening. The `summary` says "Today: 30 / 10".

**Fix:** Filter to `datetime >= now` and take the next `ceil(estimatedDays * 24)` hours, rather than calendar days. Add a test with a mid-day start and a step change.

---

### 15. Medium — [Deps] Nominatim usage is a policy and scale risk

**Where:** `packages/core/src/weather.ts:191-238` (no throttle), `SourDoughMobile/src/lib/api.ts:12,82-89` (per-process throttle, generic UA), no geocode cache

**What is wrong:** The public Nominatim policy asks for at most 1 request/second, an identifying User-Agent or Referer, and caching. The native client sends `SourDough/3.0 (JustDoughIt)` with no contact URL/email, and only throttles inside one JS process. The web client has no throttle at all and calls Nominatim directly. No reverse-geocode result is cached. Each launch/postcode makes a request. At scale, the public instance may block the app, and there is no fallback geocoder.

**Fix:** Centralise throttle + cache (localStorage/AsyncStorage), add a contact URL/email to the UA, handle 429 with backoff, and use a self-hosted/paid geocoder or a Cloudflare proxy for production scale.

---

### 16. Medium — [Security/Release] Dependency vulnerabilities; no audit gate

**Where:** `SourDoughMobile/package.json`, `package-lock.json`, `.github/workflows/*.yml`

**What is wrong:** `npm audit --omit=dev` reports 34 vulnerabilities: 1 critical (`shell-quote`), 12 high (including `expo-router` / `query-string` / `decode-uri-component`), 20 moderate, 1 low. Many are in Expo CLI/build tooling, but `expo-router` is a direct runtime dependency. CI runs typecheck/tests but no dependency audit or Dependabot. `npm audit fix` proposes a semver-major Expo/router change, so this needs deliberate triage.

**Fix:** Separate runtime from build-only advisories, upgrade Expo/router (or use overrides), add Dependabot or an `npm audit` gate, and test the packaged build after upgrades.

---

### 17. Medium — [Legal/Deps] Data licences and provenance are missing

**Where:** `packages/calc/src/data/ukWaterHardness.ts:1-14`, `packages/calc/src/data/waterHardness.ts`, `packages/calc/src/data/flours.ts:1-7`, `LICENSE`

**What is wrong:** The UK water table lists source organisations but no licence/attribution terms. The country-level table has no sources at all. The flour catalogue is derived from Shipton Mill product pages with no permission statement. The repo's MIT `LICENSE` purports to cover everything, including third-party data that may not be MIT-licensed.

**Fix:** Add a `DATA_LICENCES.md` with source URLs, licences, attribution, and retrieval dates; confirm permission for Shipton Mill product data; exclude third-party data from the MIT grant or license it separately.

---

### 18. Medium — [Security/Release] CI deploy step is unpinned and over-privileged

**Where:** `.github/workflows/web-apps.yml:43-44,86-89`, `.github/workflows/ci.yml:18-20`

**What is wrong:** The deploy step runs `npx --yes wrangler@4` at deploy time with `CLOUDFLARE_API_TOKEN` in the environment. `wrangler@4` is a floating major range, not an exact version; a compromised/new release could exfiltrate the token. Actions are pinned to tags (`actions/checkout@v6`, `actions/setup-node@v6`), not commit SHAs, and there is no explicit `permissions:` block, so the default `GITHUB_TOKEN` scope depends on repo settings.

**Fix:** Pin `wrangler` to an exact version (or use `cloudflare/wrangler-action` pinned by SHA), pin actions by SHA, add `permissions: contents: read` at workflow level, and keep the Cloudflare token scoped to Pages Edit only.

---

### 19. Low/Medium — [Model, latent] Pre-ferment above ~90 % double-counts flour and can zero added water

**Where:** `packages/calc/src/lib/calculations.ts:235-265`

**What is wrong:** `prefermentFlour = totalFlour * pct/100` includes the starter's flour, then `bowlFlour = max(0, freshFlour - prefermentFlour)` while the starter flour is still added. At 100 % pre-ferment:

- total flour = 550 g
- pre-ferment flour = 550 g
- bowl flour = 0
- starter flour = 50 g → **600 g of flour accounted for**
- added water clamps to 0
- total dough = 1211 g instead of 973.5 g
- reported hydration = 75 %, actual ≈ 109 %

At 90 % the total dough is 1106 g instead of 973.5 g. No current UI passes a pre-ferment, so this is latent, but the package API is public.

**Fix:** Base the pre-ferment on fresh flour, or subtract the starter flour from `totalFlour` for the pre-ferment calculation. Reject combinations where pre-ferment water exceeds the recipe water. Add mass-balance tests for 30/90/100 % pre-ferment.

---

### 20. Low — [Model, latent] Saved recipes record the bowl flour as the starter flour

**Where:** `SourDoughMobile/app/(tabs)/bread.tsx:271`

**What is wrong:** `handleSave` passes:

```ts
starterFlourLabel: flourRow.flour.label
```

If the starter is fed with rye but the bowl flour is white, the saved `inputs.starterFlourType` is wrong. The saved results snapshot is correct, but editing/recalculating from saved inputs can use the wrong fermentation factor.

**Fix:** Pass the starter's actual flour blend (`starter.flourBlend` or the feeding record), not the bowl flour label.

---

### 21. Low — [UI copy] Lacto water factor says "±10 %" but the code clamps to ±3 %

**Where:** `packages/calc/src/lib/lactoCalculations.ts:435-440`, `:599-600`

**What is wrong:** `waterHardnessTimeFactor` clamps to `[0.97, 1.03]`, i.e. ±3 %. The user-facing factor detail says "Capped at ±10 %". The app claims to show its arithmetic; this is one of the shown lines.

**Fix:** Change the copy to ±3 % or widen the code and update the tests. Add a test that the displayed factor detail matches the actual clamp.

---

### 22. Low/Medium — [Claims] README claims that do not match the current bread page

**Where:** `README.md:9,40-48,215-217`; `packages/calc/src/lib/lazyMethod.ts:89-120`; `packages/calc/src/lib/calculations.ts:759-767,823`

| Claim | Reality |
|---|---|
| "Dynamic fermentation — hour-by-hour model accounting for ambient drift" | `planBread` passes `null`; dynamic never runs. See finding 4. |
| "Fermentation timeline: autolyse → folds → bulk → shape → proof → bake" | The lazy method is `mix → rise → shape → proof → bake → cool`; no autolyse, no folds. The app's own bread page says "No autolyse, no kneading, no folding schedule." |
| "Hydration targets" | Only actual hydration is computed from the user's water input; there is no target calculation. |
| "Water hardness … all adjusted to your actual environment" | Bread timing ignores hardness; hardness only feeds the advice strings. Lacto applies a ±3 % factor; yogurt ignores it. |
| "Weighted protein and fermentation" | Protein is weighted for display, but `resolveFermentFactor` uses flour category only; protein never enters the timing model. |
| "Location is transient" | Coordinates are not saved, but every saved recipe stores `locationSummary` (city/country + hardness). |
| "No analytics — neither the apps nor the websites measure your use" | No analytics SDK is present, but `+html.tsx` can inject Cloudflare Web Analytics when `EXPO_PUBLIC_CF_BEACON_TOKEN` is set. Not active in the current deployed apps, but the claim is not enforced by code. |
| "Offline PWAs" | True for the three calculators: `precachePlugin` emits `sw.js`, and `main.tsx` registers it in production. The hub is intentionally not a PWA, as the README says. |
| "Ask the baker is switched off" | True in the current build: `assistantEnabled()` requires `EXPO_PUBLIC_ASSISTANT_ENABLED=1`; the Function is documented as not deployed. |

**Fix:** Update the README to the lazy method and the actual model; either implement hydration targets/water-hardness timing or remove the claims. Remove the analytics beacon or document it as an opt-in that changes the privacy policy.

---

### 23. Low — [Security] Tracked Claude settings grant broad command permissions

**Where:** `.claude/settings.local.json:10,18,32,45`

**What is wrong:** The public repo tracks a settings file allowing `Bash(python3 *)`, `Bash(npm install *)`, `Bash(curl *)`, and `Bash(git push *)` without approval. Any agent run in the repo inherits this. It is not a secret, but it is an avoidable agent supply-chain risk.

**Fix:** Remove the file from git and add `.claude/` to `.gitignore`, or scope the allowlist to the exact commands actually needed.

---

## Suspicions / not verified

1. **Q10 = 2.5 and the hydration exponent 0.6 are uncalibrated heuristics.** The direction of the high-temperature error is confirmed, but the exact corrected curve needs bread-specific data. The repo's own research dossier says local Q10 falls with temperature and goes below 1 above the optimum; the bread engine does not use that.
2. **Dry-salt "effective salinity" may be overstated.** `calculateFermentSalt` assumes all salt enters the released vegetable water; at equilibrium, some salt remains in the solids. The 2 % cabbage example displays ~3.8 % brine. This needs a measured brine-salinity check.
3. **UK water-hardness values and Shipton Mill flour data may be inaccurate or unlicensed.** I verified the England mapping bug, not every table value or the source permissions.
4. **Cloudflare edge cookies/analytics and the actual Play Data Safety console answers** cannot be verified from the repo. `PLAY_RELEASE.md` says location is declared as approximate and precise; the privacy policy says coarse.
5. **`npm audit` exploitability in the packaged Android app** is unclear; many advisories are in Expo CLI/build tooling. The runtime ones (`expo-router`/`query-string`) still need triage.
6. **Nominatim enforcement** is a policy risk, not an observed block. I did not test the public service under load.
7. **The disabled `functions/` endpoint** is documented as not deployed. If it is re-enabled, the native `AskCard` sends no `Origin` header and the Function's exact-origin check would likely reject it; the KV rate limiter is also read-then-write, not atomic.

---

## Areas checked with no real problem

- **Secrets:** No API keys, private keys, keystores, `.dev.vars`, or tokens were found in the tracked tree or the 201-commit history. `keystore.properties` and `.dev.vars` are gitignored.
- **Units:** No confirmed conversion bug. The engine uses grams/°C internally and converts at display; `formatTempDiff` correctly treats a temperature difference without the +32 offset. The percent-base problem in finding 8 is semantic, not a conversion bug.
- **Empty blends / zero flour:** Handled in the shipped path. `getBlendFermentFactor([])` returns 1, `mergeBlendWithStarter` falls back, and `estimateLazyLoaf` rejects zero flour. I did not find a crash or NaN from an empty blend.
- **Offline PWAs:** The Vite precache plugin emits a real `sw.js`, `main.tsx` registers it in production, and the service-worker tests pass. The hub is correctly described as a plain static page.
- **Ask the Baker current state:** Off in the app (`EXPO_PUBLIC_ASSISTANT_ENABLED` gate), and the Function is documented as not deployed. No current user request is sent.
- **Lacto model:** The strongest part of the repo. It uses a cardinal-temperature curve, has stall detection, monotonic temperature tests, a salt/prep/starter factor breakdown, and copy/data consistency tests. The only issue I found is the ±10 %/±3 % copy mismatch.

---

## Tests: what passes, what is misleading, what is missing

### Results

All 473 mobile/calc/function tests and 177 web-app test executions pass. This is a good regression base, especially for the lacto engine.

### Tests that would still pass if the model were wrong

1. **`packages/calc/__tests__/calculations.test.ts:111-118`** — the "caps runaway acceleration above ~38 °C" test only asserts `at45 >= 1.5` and `at45 >= at38 * 0.6`. The current inverted model returns 2 h at both 38 and 45, so it passes. A correct model returning 8 h at 45 would also pass. It never asserts that 45 °C is slower than 38 °C or that the ferment stalls.
2. **`calculations.test.ts:15-30`** — all FDT tests call the four-argument fallback, which is a simple arithmetic average. The production weighted specific-heat path (`runAllCalculations` with nine arguments) is never tested. The weighted formula could be removed and these tests would still pass.
3. **`calculations.test.ts:172-178`** — the dynamic profile test only checks non-null and length. It does not check that the profile's timestamps span `bulkHours`, so the 4× step bug passes.
4. **`calculations.test.ts:203-207`** — "agrees with the static model" uses a constant-temperature forecast. It passes despite the 4× bug because both paths use the same target; a step-change forecast would catch it.
5. **`calculations.test.ts:193-201`** — the zero-inoculation test encodes the 1 % clamp as expected behaviour. It does not test negative inoculation, `NaN`, `Infinity`, or 1000 %.
6. **`packages/calc/__tests__/breadPlan.test.ts:31-35,65-68`** — the default loaf test only requires `bulkHours > 5`; a 30 h model would pass. The water test only asserts `cold >= room`, which would pass if water temperature were ignored entirely.
7. **No tests** cover `SourDoughMobile/src/lib/api.ts`, `location.ts`, `useLocation`, `useCalculatorInputs`, the Android permission flow, the weather-failure path, or the assumed-hardness display. These are the highest-risk integration points.

### Highest-value missing tests

1. Weighted FDT with real masses; assert the result lies between the min and max input temperatures and changes correctly with a cold starter.
2. High-temperature monotonicity/stall: `estimateFermentation(45) > estimateFermentation(38)` or an explicit stalled result; `tempRateMultiplier` non-increasing above 38.
3. Dynamic model with a step-change forecast: assert the profile's wall-clock span equals `bulkHours` and the result matches an hourly integration.
4. Native bread temperature source: set `fermTempOverride=20`, outdoor=4, assert the plan uses 20; same for starter status.
5. Location pipeline with mocked Nominatim/Open-Meteo: weather failure, missing hardness, invalid postcode, England/Manchester, stale last-known location, Android approximate permission.
6. Boundary/property tests for starter 0/1000 %, water 0/1000 %, salt 0/1000 %, room temperature −40/100 °C, huge batches, `NaN`/`Infinity`; assert finite, bounded output or a validation error.
7. Pre-ferment mass balance: total flour and total dough must be invariant between 0 % and 100 % pre-ferment; 90/100 % must be rejected or correctly modeled.
8. `fetchWithRetry` 429/`Retry-After`, 5xx, and timeout paths; assert the user sees a degraded-state message rather than a silent 22 °C.

---

## Top five things to fix before the next release

1. **Fix the temperature model.** The high-temperature "penalty" must reduce the rate, not multiply it; above the viable range the app should say "too hot / stalled", not "2 h". Calibrate the cold end too — the current 4 °C estimate contradicts the app's own starter model. Add monotonic/stall tests.
2. **Fix the native kitchen temperature source.** Use `fermTempOverride` when set, label any outdoor fallback as outdoor, do not use outdoor temperature for flour/starter, and use the same source for the starter/peak forecast.
3. **Stop silent weather fallbacks.** If Open-Meteo fails after a successful geocode, show a degraded-state warning and do not auto-fill 22 °C/18 °C with an "auto" badge.
4. **Fix location/hardness.** Correct the England region mapping, disclose assumed hardness, validate postcode text, accept Android approximate location, and reject stale last-known fixes.
5. **Fix the dynamic path or remove it.** Either pass the forecast/constant ambient and advance one hour per forecast point (with a test that profile span equals bulk time), or delete the "dynamic fermentation" claim and the "dynamic estimate above" advice. Then clamp inputs and fix the percentage bases before submission; the privacy (coarse vs fine), dependency-audit, and CI-pinning items should also be closed before the next Play release.
