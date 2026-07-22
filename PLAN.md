# 🥖 SourDough — Improvement Plan

Based on the architecture review of 25 findings. Organized in 6 phases by
dependency order: each phase can be worked on in parallel within itself,
but later phases build on earlier ones.

> ✅ = Done &nbsp;&nbsp; 🔧 = In Progress &nbsp;&nbsp; ⬜ = Not Started

---

## Phase 0 — Clean Slate (Foundation) ✅

These are standalone cleanups with no dependencies. Do first to clear the
deck for heavier refactoring.

### ✅ #2 · Brand Reconciliation
**Problem:** Repo = "SourDough", app UI = "Just Dough It", UA = `JustDoughIt/3.0`.

**Plan:**
- Keep repo name `SourDough` (already published, GitHub URL stable)
- Standardize all code-level identifiers to `just-dough-it`:
  - `USER_AGENT` → `'SourDough/3.0 (JustDoughIt)'`
  - Root `_headers` / CSP referencs → match
  - README intro: "Just Dough It (SourDough)" to connect both names
- Add a one-liner in README: "The app is called Just Dough It; the open-source
  project is SourDough."

**Files:** `src/lib/api.ts`, `public/_headers`, `README.md`

---

### ✅ #4 · Remove Dead Boilerplate
**Problem:** Root `components/` (Themed.tsx, StyledText.tsx, etc.) is unused
Expo starter code. Root `recipes.txt` is stale from the retired Python CLI.

**Plan:**
- Delete `SourDoughMobile/components/` entirely (all 6 files)
- Delete root `recipes.txt`
- Verify no imports reference the deleted components
- Update README "Project Structure" to remove mention of the retired Python CLI
  and keep only `SourDoughMobile/`

**Files to delete:**
- `SourDoughMobile/components/EditScreenInfo.tsx`
- `SourDoughMobile/components/ExternalLink.tsx`
- `SourDoughMobile/components/StyledText.tsx`
- `SourDoughMobile/components/Themed.tsx`
- `SourDoughMobile/components/useClientOnlyValue.ts`
- `SourDoughMobile/components/useClientOnlyValue.web.ts`
- `SourDoughMobile/components/useColorScheme.ts`
- `SourDoughMobile/components/useColorScheme.web.ts`
- `recipes.txt`
- Note: `src/components/` is the actual components directory — keep it.

---

### ✅ #17 · Simplify Web Share Clipboard
**Problem:** Triple-fallback on web (navigator.share → clipboard API →
document.execCommand). The middle fallback handles 99% of cases.

**Plan:**
- Extract a `copyToClipboard(text: string): Promise<boolean>` utility
- Remove `document.execCommand` path (deprecated since 2018)
- Keep: `navigator.share` (mobile/desktop web) → `navigator.clipboard.writeText`
- In both `index.tsx` and `recipe/[id].tsx`, use the shared utility

**Files:** New `src/lib/clipboard.ts`, edit `app/(tabs)/index.tsx`,
`app/recipe/[id].tsx`

---

### ✅ #3 · Extract Duplicated `generateShareText`
**Problem:** Full recipe-to-text formatter duplicated verbatim in two screens.

**Plan:**
- Create `src/lib/recipeFormatter.ts`
- Export `formatRecipeText(recipe: SavedRecipe): string` and
  `formatRecipeTextFromState(...): string`
- Replace both inline copies with imports
- The `formatRecipeTextFromState` from index.tsx and the standalone
  `generateShareText` from recipe/[id].tsx should be unified — the state
  version can be built by constructing a temporary `SavedRecipe` object.

**Files:** New `src/lib/recipeFormatter.ts`, edit both screen files

---

### ✅ #5 · Consolidate Blend Utilities
**Problem:** `getBlend()` in `flourSearch.ts`, `getBlendProtein()` and
`getBlendFermentFactor()` in `calculations.ts`, `validateBlend()` in
`flourSearch.ts`.

**Plan:**
- Create `src/lib/blendUtils.ts` as the single home for all blend logic
- Move: `getBlend()`, `getBlendDisplayLabel()`, `validateBlend()` from `flourSearch.ts`
- Move: `getBlendProtein()`, `getBlendFermentFactor()`, `mergeBlendWithStarter()` from `calculations.ts`
- Re-export from old locations with `@deprecated` JSDoc for backward compat,
  then update all internal imports
- `flourSearch.ts` keeps only flour catalogue search (`findFlour`, `findFlourLabel`)

**Files:** New `src/lib/blendUtils.ts`, edit `src/lib/flourSearch.ts`,
`src/lib/calculations.ts`, and all import sites

---

## Phase 1 — Code Quality Hardening ✅

Builds on Phase 0. Tests go first so refactoring in later phases has a
safety net.

### ✅ #6 · Add Test Suite
**Problem:** Zero tests.

**Plan:**
- Install `jest`, `jest-expo`, `@testing-library/react-native`
- Configure `jest.config.js` with Expo preset
- Write unit tests for pure functions first (no RN dependency):
  1. `calculations.test.ts`:
     - `calculateFDT` — verify the 4-input average
     - `calculateIngredients` — verify basic recipe, verify starter decomposition,
       verify pre-ferment decomposition, verify oil path, verify zero-oil path
     - `estimateFermentation` — baseline (26°C, 20%, 70%, white) ≈ 4h,
       verify cold (16°C → longer), hot (30°C → shorter),
       verify inoculation effect (5% vs 40%), verify rye factor
     - `estimateDynamicFermentation` — mock hourly forecast, verify progress
       reaches 100%, verify profile points are generated
     - `getBlendProtein`, `getBlendFermentFactor`, `mergeBlendWithStarter`
  2. `blendUtils.test.ts`:
     - `validateBlend` — valid, sum≠100, too many flours, empty
     - `getBlend` — new recipe with blend, legacy scalar
  3. `flourSearch.test.ts`:
     - `findFlour` — exact match, product number, fuzzy, unknown fallback
  4. `waterHardness.test.ts`:
     - UK postcode lookup (PO6, G, SW, S10)
     - Country/region fallback chain
     - Manual override priority
- Add a `test` script to `package.json`: `"test": "jest"`

**Files:** `jest.config.js`, `SourDoughMobile/__tests__/`, `package.json`

---

### ✅ #7 · Document Magic Numbers
**Problem:** `0.6` proof multiplier, unexplained constants, unreachable branch
in `mergeBlendWithStarter`.

**Plan:**
- In `calculations.ts`, add a `// ── Physical Constants ──` block at the top:
  ```ts
  /** Thermal time constant (hours) — how fast dough approaches ambient */
  const TAU = 1.5;
  /** Q10 coefficient — rate multiplier per 10°C */
  const Q10 = 2.5;
  /** Proof time ≈ 60% of bulk fermentation (empirical, Hammelman) */
  const PROOF_FRACTION = 0.6;
  ```
- Reference these named constants everywhere instead of inline literals
- In `mergeBlendWithStarter`: the unreachable `else` branch (no blend, scalar
  flour) is actually reachable for legacy saved recipes. Add a clarifying
  comment and a test for that path.
- In the ready-by planner in `index.tsx`, reference `PROOF_FRACTION` instead
  of hardcoded `0.6`.
- In `MethodTimeline.tsx`, use the same constant.

**Files:** `src/lib/calculations.ts`, `app/(tabs)/index.tsx`,
`src/components/MethodTimeline.tsx`

---

### ✅ #8 · Eliminate `any` and Enable Strict Mode
**Problem:** `catch (e: any)`, `as any` for navigation, loose types.

**Plan:**
- Create `src/lib/errors.ts`:
  ```ts
  export class ApiError extends Error {
    constructor(message: string, public readonly statusCode?: number) {
      super(message);
      this.name = 'ApiError';
    }
  }
  ```
- Replace `catch (e: any)` with `catch (e: unknown)` using an `isError` type
  guard
- For expo-router `router.push(path as any)`: use the typed route helper
  pattern from Expo Router 4 (`router.push({ pathname: '/recipe/[id]', params: { id } })` already used in places — standardize)
- Run `tsc --noEmit` with `strict: true` in tsconfig and fix all errors
- Enable `strict: true` permanently in `tsconfig.json`

**Files:** `src/lib/api.ts`, `src/lib/errors.ts` (new), all `catch` sites,
`tsconfig.json`

---

### ✅ #9 · Input Debouncing
**Problem:** Every keystroke re-renders the entire component tree.

**Plan:**
- Use React 18's `useDeferredValue` on the numeric string inputs that feed
  into `doCalculate`. This keeps the input responsive (immediate value) while
  deferring the expensive blend-bar recalculation.
- Specifically, wrap `hydration`, `starterWeight`, `saltPct`, and all
  temperature strings with `useDeferredValue` to get deferred versions for
  the blend bar and summary text.
- The `mixRows` grams inputs should also be deferred — the percentage bar
  doesn't need frame-perfect updates.

**Files:** `app/(tabs)/index.tsx`

---

### ✅ #10 · Add Strategic Memoization
**Problem:** `buildBlend()` recalculates on every render, large JSX trees
reconstruct.

**Plan:**
- `buildBlend(mixRows, totalFlourWeight)` result → `useMemo`
- `inputPanels` → wrap in `useMemo` keyed on all input state
- `resultsPanel` → wrap in `useMemo` keyed on `results`
- The daily recommendation computation → `useMemo`
- Note: don't memoize `FlourPicker` itself (it uses a Modal and needs
  fresh render), but the `filtered` list inside it already uses `useMemo`

**Files:** `app/(tabs)/index.tsx`

---

## Phase 2 — Component Architecture ✅

Builds on Phase 1. The monolith split is the biggest single change.

### ✅ #1 · Split Monolith `index.tsx`
**Problem:** 1956 lines in one component.

**Plan:** Extract in order of independence:

#### Step A — Custom Hooks (no visual change)

| Hook | Responsibility |
|---|---|
| `useCalculatorInputs(settings)` | All input string state, mixRows, init from settings |
| `useFlourBlend(mixRows)` | `buildBlend`, `totalFlourWeight`, `handleAdd/Remove/Update` |
| `useRecipePreset()` | `breadType`, `selectedPreset`, `handlePresetSelect`, oil/preferment sync |
| `useStarterTracker()` | `lastFed`, `hoursSince`, `recentFeedings`, `feedLogging`, `handleFeedNow`, `refreshStarterData` |
| `useReadyByPlanner()` | `planByReadyEnabled`, `readyByHour`, `readyByMinute`, schedule computation |
| `useRecipeCalculation(inputs)` | `doCalculate`, `results`, `calculating` |
| `useRecipeActions(results, inputs)` | `handleSave`, `saving`, share text generation |
| `useDailyRecommendation(ambientTemp, breadType)` | The recommendation logic |

All hooks live in `src/hooks/`. The component becomes orchestrator that
calls hooks and passes data to sub-components.

#### Step B — Extract Sub-Components

| Component | Extracted from |
|---|---|
| `<DailyRecommendationCard>` | Lines ~730-770 |
| `<StarterCard>` | Lines ~780-860 |
| `<FlourBlendCard>` | Lines ~865-950 |
| `<PreFermentCard>` | Lines ~955-975 |
| `<ReadyByPlannerCard>` | Lines ~978-1030 |
| `<TemperatureCard>` | Lines ~1035-1055 |
| `<FdtResultCard>` | Lines ~1058-1095 |
| `<ReadyByResultCard>` | Lines ~1098-1150 |
| `<ResultsSection>` | Composes FDT + Fermentation + ReadyBy + Ingredients + Advice + Method + Save/Share |

#### Step C — The Slim Index

After extraction, `index.tsx` becomes:
```tsx
export default function CalculatorScreen() {
  const inputs = useCalculatorInputs(settings);
  const blend = useFlourBlend(inputs.mixRows);
  const preset = useRecipePreset();
  const starter = useStarterTracker();
  const planner = useReadyByPlanner();
  const { results, doCalculate, calculating } = useRecipeCalculation(...);
  const { handleSave, saving } = useRecipeActions(results, inputs);
  const recommendation = useDailyRecommendation(...);

  // ~50 lines of layout JSX composing the sub-components
}
```

**New files (8 hooks + 10 components):**
`src/hooks/useCalculatorInputs.ts`, `src/hooks/useFlourBlend.ts`,
`src/hooks/useRecipePreset.ts`, `src/hooks/useStarterTracker.ts`,
`src/hooks/useReadyByPlanner.ts`, `src/hooks/useRecipeCalculation.ts`,
`src/hooks/useRecipeActions.ts`, `src/hooks/useDailyRecommendation.ts`

`src/components/DailyRecommendationCard.tsx`, `src/components/StarterCard.tsx`,
`src/components/FlourBlendCard.tsx`, `src/components/PreFermentCard.tsx`,
`src/components/ReadyByPlannerCard.tsx`, `src/components/TemperatureCard.tsx`,
`src/components/FdtResultCard.tsx`, `src/components/ReadyByResultCard.tsx`,
`src/components/ResultsSection.tsx`

---

## Phase 3 — UX Fixes ✅

These modify existing components and can be done in any order once Phase 2
is complete (the extracted components make each change smaller).

### ✅ #11 · Preset Selection Won't Overwrite Manual Edits
**Problem:** Choosing a preset always resets hydration, starter, salt, oil.

**Plan:**
- Add a `isDirty` flag for each field that the user has manually changed
- When switching presets, only pre-fill fields that are NOT dirty
- Show a subtle "reset to preset default" link next to each pre-filled field
  that the preset overrode
- Alternative lighter-weight approach: add a confirmation Alert when
  switching presets if any input differs from the current preset defaults:
  "Apply this preset's settings? Your current values will be replaced."

**Files:** `src/hooks/useRecipePreset.ts`, `app/(tabs)/index.tsx`

---

### ✅ #12 · Fix Oil Field Visibility
**Problem:** Oil field disappears when switching to a preset without oil,
even if user has set a value.

**Plan:**
- Decouple visibility from preset: if `oilPct > 0` (user has set a value),
  always show the field
- Only hide when `oilPct === 0` AND `selectedPreset?.dough.oilPct` is
  undefined or 0
- Add a "Hide" button on the oil field itself to let users dismiss it

**Files:** `src/components/FlourBlendCard.tsx` (or the parent)

---

### ✅ #13 · Pre-ferment Validation
**Problem:** `prefermentFlourPct` can exceed 100%, producing negative bowl
flour.

**Plan:**
- In the `NumberInput` for pre-ferment flour %, add `max={100}` prop
- In `doCalculate`, add validation: if `prefermentFlourPct > 100`, show
  Alert and return early
- Display a warning in the pre-ferment card when `> 50`:
  "High pre-ferment percentage — this will significantly change the dough
  character."

**Files:** `src/components/PreFermentCard.tsx`, `src/hooks/useRecipeCalculation.ts`

---

### ✅ #14 · Ready-By Planner Accounts for Pre-ferment
**Problem:** Schedule ignores poolish build time (8-12h).

**Plan:**
- When pre-ferment is enabled, add a `poolishTime` constant (12h for poolish,
  16h for biga — configurable in the preset profile)
- Add to total minutes calculation in the schedule
- Display in breakdown: "poolish ~12h · autolyse 45min · ..."
- If the ready-by time minus pre-ferment lead time is in the past, warn:
  "You should have started your poolish yesterday. Consider a direct dough
  or delay your bake."

**Files:** `src/models/types.ts` (add `prefermentLeadHours` to `DoughProfile`),
`src/data/recipePresets.ts` (set values for baguette, ciabatta, etc.),
`app/(tabs)/index.tsx` (schedule computation)

---

### ✅ #15 · Daily Recommendation Non-Destructive
**Problem:** Once dismissed, the daily recommendation card never returns.

**Plan:**
- Store dismiss state with a date key: `dismissed_on_YYYY-MM-DD`
- On each new day (or new app launch), reset to not dismissed
- Add a small "💡 Tips" toggle in the settings screen that re-enables the
  daily recommendation card (in case user wants to turn it off permanently)
- Also reset when `breadType` changes back to `'custom'` from a non-custom
  preset (user is exploring again)

**Files:** `src/components/DailyRecommendationCard.tsx`,
`app/(tabs)/settings.tsx`, `src/models/types.ts` (add `showDailyTips` to
`UserSettings`)

---

### ✅ #16 · Show Full Fermentation Profile
**Problem:** Table truncated to 12 rows.

**Plan:**
- Show first 12 rows by default
- Add a "Show all N rows" / "Show less" toggle button below the table
- Or: use a collapsible `FlatList` with `maxHeight` and scroll
- The key insight rows for long ferments are the later ones (dough temp
  converging to ambient), so a "Jump to completion" link would also help

**Files:** `src/components/FermentationTimeline.tsx`

---

## Phase 4 — New Features ✅

Each is self-contained. Do in order of user impact.

### ✅ #18 · Cold Retard / Proof Model
**Problem:** No support for cold-proofing (4°C fridge overnight).

**Plan:**
- Add a "Cold proof" toggle in the calculator (near the temperatures card
  or as a section in the fermentation card)
- When enabled, prompt for fridge temperature (default 4°C) and duration
  (default 12h)
- Model: at 4°C, fermentation rate ≈ 0.05× baseline (Q10 model extended
  downward). The dough cools from FDT to 4°C following the thermal time
  constant τ ≈ 2h (thicker thermal mass than room temperature drift).
- Integrate into `estimateDynamicFermentation` by appending fridge hours
  to the forecast with constant 4°C ambient
- Add advice: "Cold proofing develops flavour through acetic acid production
  (more active at low temperatures). Expect a tangier crumb."
- Show in method timeline: "Cold proof — 12h at 4°C" as a step

**Files:** `src/lib/calculations.ts` (new `estimateColdProof` function),
`src/components/TemperatureCard.tsx` (or new `ColdProofCard.tsx`),
`src/components/MethodTimeline.tsx`, `src/models/types.ts` (add
`coldProofHours?`, `coldProofTemp?` to `RecipeInputs`)

---

### ✅ #19 · Starter ↔ Recipe Readiness Integration
**Problem:** Starter status and recipe calculation are separate silos.

**Plan:**
- In the calculator flow, after the starter card, show a readiness badge:
  - If starter is at peak (4-8h since feeding): 🟢 "Your starter is at peak
    activity — perfect timing for this recipe."
  - If starter is past peak: 🟡 "Your starter was fed {hours}h ago. Still
    viable but may take longer to rise. Adjust your inoculation up by 5%."
  - If starter is hungry (>24h): 🔴 "Feed your starter first. Hungry starter
    produces weak fermentation and overly sour bread."
- Add `starterStatus` to the calculation inputs (optional) so the ferment
  model can adjust rate based on starter vitality
- Simple model: if hours-since-feeding > 12, apply a vitality factor
  (linearly decreasing from 1.0 at 12h to 0.7 at 24h)

**Files:** `src/hooks/useStarterTracker.ts`, `src/lib/calculations.ts`,
`src/components/StarterCard.tsx`

---

### ✅ #20 · Recipe History Search & Filter
**Problem:** Flat scroll, no search.

**Plan:**
- Add a `SearchBar` to the history screen header
- Filter by: flour label, bread type name, date, location city
- Add filter chips: "All", "Boules", "Pizza", "Flatbreads", "Enriched",
  "Advanced" — filter by preset category/difficulty
- Use `useMemo` with search query + active filter for a derived filteredList
- Empty state when filters yield no results: "No recipes match your search"

**Files:** `app/(tabs)/history.tsx`, new `src/components/RecipeSearchBar.tsx`

---

### ✅ #21 · Edit & Duplicate Saved Recipes
**Problem:** View-only or delete from history.

**Plan:**
- Add "Duplicate" button on recipe detail screen → constructs a new
  `SavedRecipe` with fresh `id` and `createdAt`, saves it
- Add "Edit" button → loads the recipe's inputs into the calculator,
  navigates to the calculator tab with pre-filled values
- Use expo-router params or a shared store to pass the recipe data
- For "Edit": `router.push({ pathname: '/', params: { editRecipeId: id } })`,
  the calculator reads this param and pre-fills all inputs
- Both buttons in the recipe detail header or as footer actions

**Files:** `app/recipe/[id].tsx`, `app/(tabs)/index.tsx`,
`src/store/recipeStore.ts` (add `duplicateRecipe`)

---

### ✅ #22 · Metric / Imperial Toggle
**Problem:** Everything metric.

**Plan:**
- Add `unitSystem: 'metric' | 'imperial'` to `UserSettings`
- Create `src/lib/unitConversion.ts`:
  ```ts
  export function gramsToOz(g: number): number; // /28.35
  export function ozToGrams(oz: number): number; // *28.35
  export function celsiusToFahrenheit(c: number): number;
  export function fahrenheitToCelsius(f: number): number;
  ```
- In the calculator: all weight displays use a format helper that reads
  `unitSystem` from context and converts on-the-fly
- Temperature displays: show °F in imperial mode, but the calculation
  engine always works in °C internally (convert at input/output boundaries)
- Add the toggle in Settings > Appearance
- Flour weights: round to nearest 0.1 oz; water to 0.1 fl oz
- Water hardness: show both mg/L and grains per gallon (gpg)

**Files:** New `src/lib/unitConversion.ts`, `src/models/types.ts`,
`app/(tabs)/settings.tsx`, `src/theme/index.ts` (add to context or a
separate `UnitSystemProvider`), all display components

---

## Phase 5 — Performance & Robustness ✅

### ✅ #23 · API Retry Logic
**Problem:** Single attempt, no retry.

**Plan:**
- Add a generic `fetchWithRetry(url, options?, maxRetries = 2)` wrapper:
  - Retry on network errors and 5xx responses
  - Exponential backoff: 1s → 3s → (skip third)
  - Do NOT retry on 4xx responses
- Use it in `api.ts` for Open-Meteo and Nominatim calls
- Nominatim has a 1 req/s rate limit — add a simple in-memory throttle
  (track `lastNominatimCall` timestamp, delay if needed)

**Files:** `src/lib/api.ts` (add `fetchWithRetry`, refactor existing calls),
new `src/lib/rateLimiter.ts`

---

### ✅ #24 · Settings Cache
**Problem:** AsyncStorage re-read on every tab focus.

**Plan:**
- Create a simple in-memory cache module `src/store/settingsCache.ts`:
  ```ts
  let cached: { settings: UserSettings; loadedAt: number } | null = null;
  const CACHE_TTL_MS = 60_000; // 1 minute

  export async function getSettings(): Promise<UserSettings> {
    if (cached && Date.now() - cached.loadedAt < CACHE_TTL_MS) {
      return cached.settings;
    }
    const settings = await loadSettings();
    cached = { settings, loadedAt: Date.now() };
    return settings;
  }

  export async function updateSettings(s: UserSettings): Promise<void> {
    await saveSettings(s);
    cached = { settings: s, loadedAt: Date.now() };
  }
  ```
- Replace all direct `loadSettings()` / `saveSettings()` calls with
  `getSettings()` / `updateSettings()`
- The cache is invalidated on save, so edits are always reflected

**Files:** New `src/store/settingsCache.ts`, update all consumers

---

### ✅ #25 · Error Boundary & Crash Reporting
**Problem:** No error boundary UI, no crash reporting.

**Plan:**
- Create `src/components/ErrorFallback.tsx`:
  - Shows friendly message: "Something went wrong 😔"
  - Shows error details in dev mode
  - "Reload" button that calls `expo-router` reload
  - "Report" button that opens the GitHub issues page
- Wrap the root layout with it in `app/_layout.tsx` (alongside the exported
  `ErrorBoundary`)
- For crash reporting: add optional Sentry integration
  - `expo-sentry` plugin in `app.json`
  - `Sentry.init()` in the root layout
  - Only enabled if `SENTRY_DSN` env var is set (opt-in, privacy-preserving)
  - Document in README: "Crash reporting is disabled by default. Set
    SENTRY_DSN in your build environment to enable anonymous error tracking."

**Files:** New `src/components/ErrorFallback.tsx`, `app/_layout.tsx`,
`app.json`, `README.md`

---

## Implementation Order Summary

```
Phase 0 (Clean Slate) ✅
  ✅ #4 Remove dead code
  ✅ #2 Brand reconciliation
  ✅ #3 Extract shared formatter
  ✅ #17 Simplify clipboard
  ✅ #5 Consolidate blend utils

Phase 1 (Code Quality) ✅
  ✅ #7 Document magic numbers
  ✅ #6 Add test suite
  ✅ #8 Eliminate any + strict mode
  ✅ #9 Input debouncing
  ✅ #10 Strategic memoization

Phase 2 (Architecture) ✅
  ✅ #1 Split monolith index.tsx

Phase 3 (UX Fixes) ✅
  ✅ #11 Preset overwrite protection
  ✅ #12 Oil field visibility
  ✅ #13 Pre-ferment validation
  ✅ #14 Ready-by pre-ferment
  ✅ #15 Daily recommendation reset
  ✅ #16 Full fermentation profile

Phase 4 (Features) ✅
  ✅ #20 History search/filter
  ✅ #21 Edit & duplicate
  ✅ #18 Cold retard model
  ✅ #19 Starter integration
  ✅ #22 Metric/imperial

Phase 5 (Robustness) ✅
  ✅ #23 API retry
  ✅ #24 Settings cache
  ✅ #25 Error boundary
```

**All 25 items complete.** 🎉

---

## Post-Plan Fixes

### #26 · Total Fermentation Time (Bulk + Proof)
**Problem:** The dynamic fermentation model calculated only bulk fermentation
time. The `PROOF_FRACTION` constant (0.6 = proof is ~60% of bulk) was defined
but never applied to `totalHours`. The main display showed just bulk hours,
missing the proof phase entirely.

**Fix:**
- Added `bulkHours` field to `DynamicFermentation` to distinguish bulk from total
- `runAllCalculations` now adds warm proof time (`bulk * 0.6`) to `totalHours`
  when cold proof isn't used
- `estimateColdProof` correctly sets `totalHours = bulk + cold` and preserves
  `bulkHours`
- All UI labels updated: main display shows "~Xh total", breakdown shows
  "Bulk ~Xh + proof ~Yh", recipe cards show total time
- `fullProcessHours` now includes proof even for custom recipe presets
- Ready-by planner uses `bulkHours` for accurate ferment breakdown

**Files:** `src/models/types.ts`, `src/lib/calculations.ts`,
`src/components/FermentationTimeline.tsx`, `src/components/ResultsSection.tsx`,
`src/components/RecipeCard.tsx`, `src/lib/recipeFormatter.ts`,
`app/(tabs)/index.tsx`
