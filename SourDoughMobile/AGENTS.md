# Just Dough It — Architecture

## Routes (app/)
- **Landing** (index.tsx, "/") — Three-card picker: bread, yogurt, or lacto-fermentation. Footer links to saved recipes, about, and settings.

## Tabs (app/(tabs)/)
- **Sourdough** (bread.tsx, "/bread") — The one bread page: a lazy-sourdough formula (flour weight + water/starter/salt as baker's %) and six fixed steps from `lib/lazyMethod.ts` (mix, rise, shape, proof, bake, cool — no autolyse, kneading, fold schedule, pre-shape or scoring). Weights and the rise estimate are computed live (no Calculate button, so results are never stale); "I've mixed" stores the mix time in AsyncStorage so the check-the-dough clock survives closing the app. Edit from History reopens a saved loaf here. Between the method card and Save/Share sits the optional **Ask the baker** card (`components/AskCard.tsx`, client helpers in `lib/assist.ts`), hidden unless `EXPO_PUBLIC_ASSISTANT_ENABLED=1`; see Assistant below. Do not reintroduce a second bread mode or route.
  NOTE: the tab screen is deliberately named "bread" — a group index at (tabs)/index.tsx would collide with the landing route "/".
- **Yogurt** (yogurt.tsx) — Yogurt incubation calculator with 10 culture types, milk picker, yield & nutrition. Calculates live (no Calculate button); the maths is `lib/yogurtPlan.ts`. A thermophilic culture is held at its own temperature; a mesophilic one uses the room temperature: the Settings kitchen temperature when set, otherwise the outdoor forecast
- **Lacto-ferment** (ferments.tsx) — Vegetable fermentation with salt calculator, 25+ vegetables, day-by-day timeline, and Google Calendar export. Calculates live (no Calculate button); the maths is `lib/lactoPlan.ts`, and the history is recorded after the inputs settle (see State Management)
- **History** (history.tsx) — Two segments. **Bread**: saved loaves with search, edit, duplicate, delete. **Ferments**: every ferment you work out is recorded automatically (no save button; the live calculator records once the inputs have sat still for a moment, replacing the entry it just made for the same ferment), with search, delete and "Calculate again" to load the inputs back into the calculator
- **Settings** (settings.tsx) — Default values, water hardness override, theme (light/dark/system), units (metric/imperial)
- **About** (about.tsx) — App overview, privacy notice, and acknowledgements

## Calculation Engines (src/lib/)
- **calculations.ts** — Bread FDT (mass-weighted specific heat), ingredient weights, Q10 fermentation model, cold proof
- **yogurtCalculations.ts** — Yogurt incubation (Q10), yield (evaporation + straining), nutrition, timeline
- **lazyMethod.ts** — The lazy bread method: step copy, bake temperatures per vessel (cocotte/tin), proof estimate from bulk hours.
- **lazyPlan.ts** — The lazy loaf's numbers, shared by the bread page and the assistant Function: `estimateLazyLoaf` (weights and rise estimate via `runAllCalculations`) and `planLazyBake` (work back from a ready time to a mix time, counter or fridge proof; with `feed` it adds an optional first step that feeds the starter so it is at its peak at the mix, and the window in which mixing keeps it there. That is a choice about the starter, not a second method: the six steps stay). No React imports — `functions/api/assist.ts` bundles it. `estimateLazyLoaf` also takes the starter's state (`starterTempC`, `starterHoursSinceFed` as effective hours, `starterFlourBlend` for a starter fed with several flours), all optional: left out, it is a fridge-cold starter at full strength. The bread page passes them from `useStarterStatus`; the assistant Function does not yet, so its what-if estimates assume the defaults.
- **starterStatus.ts** — The starter model. Readiness from the feeding log in *effective hours*: an hour of a 1:1:1 feed on a 22 °C counter. Counter time runs at `starterPace(tempC)` (×2.5 per 10 °C, capped at 38 °C, the rise model's Q10), fridge time at ~6%, and a bigger feed is stretched by `feedSizeFactor` (peak time grows with the log of the dilution: 1:2:2 ≈ ×1.5, 1:5:5 ≈ ×2.2). The six zones and the vitality model stay in effective hours. `DEFAULT_PEAK_EFFECTIVE_HOURS` (6) is the app's own figure and baker guides only roughly agree, so `learnedPeakEffectiveHours` replaces it with the median of the user's own marked peaks (`StarterFeeding.peakedAt`) once there are three at similar feed sizes. Also `starterTimeToPeakHours`, `starterPeakWindowHours`, `starterFeedAmounts`, and the helpers recipe estimates use (`usableStarterStatus` ignores a stale counter log, `starterTempFor`, `starterFlourBlendFromFeeding`). The temperature, feed-size and warm-kitchen effects are reasoned estimates, not measurements; that is why it learns.
- **lactoCalculations.ts** — Lacto-fermentation salt (dry/brine/mash methods), timing, pH timeline, safety. `estimateFermentTiming(tempC, input)` is the only timing entry point: each recipe's `typicalDays` (its reference duration at 22 °C with its own vegetables, salt level and prep, taken from the range recorded in `documentedDays`) is the anchor, multiplied by the user's conditions — temperature (cardinal-temperature/CTMI curve, forecast-integrated), salt (U-shaped, flat 1.5–2.75%), water chemistry (alkalinity proxy, ±3% cap, brine only), vegetable mix and cut size. It returns the factors it applied, so the UI and the calendar event show the arithmetic rather than asserting a number. Timing includes one additive term: a starter culture saves a capped, temperature-scaled number of days off the lag phase (`STARTER_LAG_SAVING_DAYS`) rather than a percentage, because the endpoint evidence is mixed. `acidBalanceVerdict(veg)` is a separate, non-timing check: measured acid demand vs intrinsic sugar per vegetable (Little et al. 2022) says whether a ferment can reach full sourness at all — sugar is a gate, not a rate. Vegetables nobody has titrated report `unknown`, never "fine".

  NO FLAT TIMING CLAIMS IN COPY: `documentedDays` is provenance and is never rendered. No preset or combo tip/description states a number of days — the app's computed date is the only timing statement the user sees, because a flat "7–14 days" contradicts the estimate whenever the user's conditions differ from 22 °C. Two tests enforce this: anchors must sit inside their documented range, and no tip or description may match a day-range pattern. Evidence dossiers live in `../research/fermentation/`
- **fermentSetup.ts** — Curated-combo → calculator inputs (method, water, mix, salt) plus the timing anchors (`recommendedSaltPct`, `presetReferenceSpeed`, `comboReferenceSpeed`, `mixSpeedFactor`, `relativeVegSpeed`)
- **blendUtils.ts** — Flour blend protein (weighted avg), ferment factors by category, validation
- **unitConversion.ts** — Metric/imperial display conversion (g↔oz, °C↔°F). Engine always uses metric internally.
- **calendar.ts** — Google Calendar `action=TEMPLATE` links for ferments (ready day / taste check / whole-ferment span). Pure date math + URL building; no native calendar module or permissions. Day 0 defaults to today, all-day dates are encoded as local `YYYYMMDD` (never UTC), and `end` is exclusive.

## Assistant
- "Ask the baker" — spec and every product decision in `../ASSISTANT_SPEC.md`. The Cloudflare Pages Function is `../functions/api/assist.ts` (guards, KV rate limits, tool loop over `lib/lazyPlan.ts`); all provider code (DeepSeek today) is in `../functions/api/llm.ts`. The model never produces a number: times, durations, temperatures and weights come from engine tools, and the plan in a `show_plan` action is always the engine's. The Functions have no npm dependencies; their tests run under this package's Jest config.

## State Management
- **Hooks** (src/hooks/) — UI state and orchestration (useCalculatorInputs, useStarterStatus, useYogurtCalculator, etc.). `useStarterStatus(roomTempC)` reads the feeding log for recipe estimates (status at the kitchen's pace, learned peak); there is no starter screen yet, so with an empty log it returns null and the bread page assumes a fridge-cold starter at full strength
- **useLocation** — shared context provider mounted in `app/_layout.tsx`; runs location detection once for all three calculator tabs (GPS, weather, water hardness, postcode refinement)
- **Stores** (src/store/) — AsyncStorage persistence (recipeStore, fermentHistoryStore, settingsStore, starterStore). `fermentHistoryStore` keeps a rolling 12 months (`FERMENT_RETENTION_DAYS`), merges repeat calculations of the same jar by input signature, and caps at 200; the rotation/merge rules are pure and live in lib/fermentHistory.ts
- **settingsCache.ts** — In-memory cache for settings with 60s TTL to avoid re-reading AsyncStorage

## Theme (src/theme/)
- LightColors / DarkColors palettes with warm bakery aesthetic
- useAppTheme() hook provides colors, themeMode (system/light/dark), unitSystem (metric/imperial)
- Spacing, FontSize, BorderRadius design tokens

## Key Patterns
- Expo SDK 56, React Native 0.85, TypeScript
- File-based routing via expo-router
- Pure calculation functions (no React dependency) — testable without RN runtime
- Unit conversion at display boundary only — all internal math is metric (g, °C)
