# Just Dough It — Architecture

## Routes (app/)
- **Landing** (index.tsx, "/") — Three-card picker: bread, yogurt, or lacto-fermentation. Footer links to saved recipes, about, and settings.

## Tabs (app/(tabs)/)
- **Sourdough** (bread.tsx, "/bread") — Bread recipe calculator with flour blends, pre-ferments, cold proof, ready-by planner.
  NOTE: the tab screen is deliberately named "bread" — a group index at (tabs)/index.tsx would collide with the landing route "/".
- **Yogurt** (yogurt.tsx) — Yogurt incubation calculator with 10 culture types, milk picker, yield & nutrition
- **Lacto-ferment** (ferments.tsx) — Vegetable fermentation with salt calculator, 25+ vegetables, day-by-day timeline, and Google Calendar export
- **History** (history.tsx) — Saved recipes with search, filter chips, edit, duplicate, delete
- **Settings** (settings.tsx) — Default values, water hardness override, theme (light/dark/system), units (metric/imperial)
- **About** (about.tsx) — App overview, privacy notice, and acknowledgements

## Calculation Engines (src/lib/)
- **calculations.ts** — Bread FDT (mass-weighted specific heat), ingredient weights, Q10 fermentation model, cold proof
- **yogurtCalculations.ts** — Yogurt incubation (Q10), yield (evaporation + straining), nutrition, timeline
- **lactoCalculations.ts** — Lacto-fermentation salt (dry/brine/mash methods), timing, pH timeline, safety. `estimateFermentTiming(tempC, input)` is the only timing entry point: each recipe's `typicalDays` (its reference duration at 22 °C with its own vegetables, salt level and prep, taken from the range recorded in `documentedDays`) is the anchor, multiplied by the user's conditions — temperature (cardinal-temperature/CTMI curve, forecast-integrated), salt (U-shaped, flat 1.5–2.75%), water chemistry (alkalinity proxy, ±3% cap, brine only), vegetable mix and cut size. It returns the factors it applied, so the UI and the calendar event show the arithmetic rather than asserting a number. Timing includes one additive term: a starter culture saves a capped, temperature-scaled number of days off the lag phase (`STARTER_LAG_SAVING_DAYS`) rather than a percentage, because the endpoint evidence is mixed. `acidBalanceVerdict(veg)` is a separate, non-timing check: measured acid demand vs intrinsic sugar per vegetable (Little et al. 2022) says whether a ferment can reach full sourness at all — sugar is a gate, not a rate. Vegetables nobody has titrated report `unknown`, never "fine".

  NO FLAT TIMING CLAIMS IN COPY: `documentedDays` is provenance and is never rendered. No preset or combo tip/description states a number of days — the app's computed date is the only timing statement the user sees, because a flat "7–14 days" contradicts the estimate whenever the user's conditions differ from 22 °C. Two tests enforce this: anchors must sit inside their documented range, and no tip or description may match a day-range pattern. Evidence dossiers live in `../research/fermentation/`
- **fermentSetup.ts** — Curated-combo → calculator inputs (method, water, mix, salt) plus the timing anchors (`recommendedSaltPct`, `presetReferenceSpeed`, `comboReferenceSpeed`, `mixSpeedFactor`, `relativeVegSpeed`)
- **blendUtils.ts** — Flour blend protein (weighted avg), ferment factors by category, validation
- **unitConversion.ts** — Metric/imperial display conversion (g↔oz, °C↔°F). Engine always uses metric internally.
- **calendar.ts** — Google Calendar `action=TEMPLATE` links for ferments (ready day / taste check / whole-ferment span). Pure date math + URL building; no native calendar module or permissions. Day 0 defaults to today, all-day dates are encoded as local `YYYYMMDD` (never UTC), and `end` is exclusive.

## State Management
- **Hooks** (src/hooks/) — UI state and orchestration (useCalculatorInputs, useStarterTracker, useYogurtCalculator, etc.)
- **useLocation** — shared context provider mounted in `app/_layout.tsx`; runs location detection once for all three calculator tabs (GPS, weather, water hardness, postcode refinement)
- **Stores** (src/store/) — AsyncStorage persistence (recipeStore, settingsStore, starterStore)
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
