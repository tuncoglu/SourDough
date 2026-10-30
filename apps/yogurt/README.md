# Yogurt Calculator

Lives at https://yogurt.sourdoughcalculator.uk. Incubation time, starter, yield and a timeline for ten yogurt cultures (thermophilic and mesophilic) and eight milks. **Guidance, not guarantee.**

Offline-first, mobile-first PWA in the same family as the pasta app: Vite + React, static files with relative paths, a service worker written at build time, no backend, no accounts, no analytics. State and settings live in `localStorage` on this device. The only network call is the optional weather lookup, made only when you tap "Use my location for the forecast" (or turn on auto-detect), and only for mesophilic cultures, which ferment at room temperature.

The maths is `@sourdough/calc` (`../../packages/calc`), the same code the Expo app runs, so the numbers never disagree. The look is `@sourdough/ui`, and settings, storage, weather and the offline build are `@sourdough/core`. There is no npm workspace: the aliases are in `vite.config.ts` and `tsconfig.json`.

## Run

```sh
npm install
npm run dev        # dev server (the service worker is only registered in production builds)
npm test           # this app, plus the tests of packages/core and packages/ui
npm run build      # type-check + static files in dist/
npm run preview    # serve dist/ to try the PWA and offline mode
npm run icons      # regenerate public/icons (no dependencies)
```

## Layout

| Path | What |
| --- | --- |
| `src/form.ts` | The form and its rules: culture defaults, starter amounts that follow the milk volume until typed, stored-state validation |
| `src/Calculator.tsx`, `src/Results.tsx` | The calculator screen and the result cards |
| `src/display.ts` | Turns the engine's text (emoji, em dashes) into the design's plain sentences |
| `src/SettingsPage.tsx` | Settings: kitchen temperature, theme, units, reset. Opens from the More tab (`MorePage` in `@sourdough/ui`), which also lists the other calculators; the bar is Calculator and More |
| `src/store.ts` | Storage keys and the "is this weather still fresh" rule |
| `scripts/make-icons.mjs` | The jar icon, drawn without dependencies |

## Behaviour worth knowing

- It calculates live: there is no Calculate button, so a result is never out of date.
- A thermophilic culture is held at its own temperature, so the weather and the kitchen do not change its time. A mesophilic culture uses the kitchen temperature from Settings if set, else the forecast if you asked for it, else 22 °C (and says so).
- The time is an estimate (a Q10 model from the typical time at the ideal temperature) and is labelled as one. The set check, tilting the jar, is how you know it is done.
- A weather reading older than three hours is ignored, because the forecast is read from "today".

## Deploying

A Cloudflare Pages project with `apps/yogurt` as the root, build command `npm ci && npm run build`, output `dist`. `public/_headers` sets the cache rules. Deployed automatically to the `yogurt` project by `.github/workflows/web-apps.yml` on a push to `main`.
