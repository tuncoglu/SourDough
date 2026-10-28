# Bread Calculator

Will live at https://bread.sourdoughcalculator.uk. Lazy sourdough: one bowl, no kneading. A temperature-aware rise estimate, your starter tracked properly, and a plan worked back from when you want to slice. **Guidance, not guarantee.**

Same family as the yogurt, lacto-ferment and pasta apps: Vite + React PWA, static files with relative paths, a service worker written at build time, no backend, no accounts, no analytics. State, the feeding log and saved loaves live in `localStorage`. The only network calls are the optional location lookup (Open-Meteo for the forecast and tap-water estimate, OpenStreetMap's Nominatim for your town), made only when you tap the button or turn on auto-detect.

The maths and the page's rules are `@sourdough/calc` (`lib/breadPlan`, `lib/lazyPlan`, `lib/lazyMethod`, `lib/lazySchedule`, `lib/starterStatus`, `lib/starterLog`), the same engines the Expo app runs. The look is `@sourdough/ui`; settings, storage, weather and the offline build are `@sourdough/core`. There is no npm workspace.

## Run

```sh
npm install
npm run dev
npm test           # this app, plus the tests of packages/core and packages/ui
npm run build      # type-check + static files in dist/
npm run preview
npm run icons
```

## Tabs

| Tab | What |
| --- | --- |
| Calculator | Flour (up to three), your starter (fed first or from the fridge), dough percentages, kitchen, vessel, **When** (mix now, or ready to slice by a time), then the recipe, the steps with a clock time each, a rise check, and what the estimate assumes |
| Starter | Its state from the feeding log, your next bake, how fast it runs in your kitchen, your own learned peak, what its state does to the rise, a feed form (up to three flours) and the log |
| History | Loaves you saved, to open again |
| Settings | Default values, kitchen temperature, water hardness, theme, units, reset |

## Behaviour worth knowing

- Live: no Calculate button, so a result is never out of date.
- "I've mixed" saves the mix time (the clock survives closing the app) and logs the jar going into the fridge, as the starter's lazy loop. "Reset the clock" undoes the mix time.
- A starter fed in the last 24 hours and not in the fridge counts as fed for this loaf, and the plan follows its peak.
- The rise is the engine's estimate: 4 h at 26 °C as the baseline, ×2.5 per 10 °C, starter amount, hydration, flour. Starter activity and the peak window are labelled heuristics; after three marked peaks at similar ratios the app uses your own median.
- The room temperature is the kitchen temperature in Settings, else the outdoor reading if you asked for it, else 22 °C (and it says so).
- Water hardness comes from, in order: a value you type, a UK postcode (looked up in a table inside the app, no network), or the town found from your location (OpenStreetMap's Nominatim, only when you tap the location button), else an assumed 120 mg/L, and the page says which. The tap-water temperature is estimated from the last three weeks of temperatures (Open-Meteo archive) on the same tap.
- Ask the baker is not in the web apps: it needs the Cloudflare Function and a consent screen.

## Deploying

A Cloudflare Pages project with `apps/bread` as the root, build command `npm ci && npm run build`, output `dist`. Not deployed yet.
