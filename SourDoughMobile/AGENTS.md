# Just Dough It — Architecture

## Routes (app/)
- **Landing** (index.tsx) — Three-card picker: bread, yogurt, or lacto-fermentation. Footer links to saved recipes, about, and settings.

## Tabs (app/(tabs)/)
- **Sourdough** (index.tsx) — Bread recipe calculator with flour blends, pre-ferments, cold proof, ready-by planner
- **Yogurt** (yogurt.tsx) — Yogurt incubation calculator with 10 culture types, milk picker, yield & nutrition
- **Lacto-ferment** (ferments.tsx) — Vegetable fermentation with salt calculator, 25+ vegetables, day-by-day timeline
- **History** (history.tsx) — Saved recipes with search, filter chips, edit, duplicate, delete
- **Settings** (settings.tsx) — Default values, water hardness override, theme (light/dark/system), units (metric/imperial)
- **About** (about.tsx) — App overview, privacy notice, and acknowledgements

## Calculation Engines (src/lib/)
- **calculations.ts** — Bread FDT (mass-weighted specific heat), ingredient weights, Q10 fermentation model, cold proof
- **yogurtCalculations.ts** — Yogurt incubation (Q10), yield (evaporation + straining), nutrition, timeline
- **lactoCalculations.ts** — Lacto-fermentation salt (dry/brine/mash methods), Q10 duration, pH timeline, safety
- **blendUtils.ts** — Flour blend protein (weighted avg), ferment factors by category, validation
- **unitConversion.ts** — Metric/imperial display conversion (g↔oz, °C↔°F). Engine always uses metric internally.

## State Management
- **Hooks** (src/hooks/) — UI state and orchestration (useCalculatorInputs, useStarterTracker, useYogurtCalculator, etc.)
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
