# Lacto-ferment Calculator

Lives at https://lactoferment.sourdoughcalculator.uk. Salt, timing and a day-by-day timeline for sauerkraut, kimchi, pickles, pepper mash, kvass and more, with 25+ vegetables, mixes, curated combinations and a Google Calendar reminder. **Guidance, not guarantee.**

Same family as the yogurt and pasta apps: Vite + React PWA, static files with relative paths, a service worker written at build time, no backend, no accounts, no analytics. State, settings and history live in `localStorage`. The only network calls are the optional weather lookup (Open-Meteo) and, with it, the town lookup for water hardness (Nominatim), made only when you tap "Use my location for the forecast" (or turn on auto-detect). The calendar buttons are plain links to Google Calendar; nothing is sent until you tap one.

The maths and the form rules are `@sourdough/calc` (`lib/lactoCalculations`, `lib/lactoPlan`, `lib/lactoForm`), the same code the Expo app runs. The look is `@sourdough/ui`, and settings, storage, weather and the offline build are `@sourdough/core`. There is no npm workspace.

## Run

```sh
npm install
npm run dev
npm test           # this app, plus the tests of packages/core and packages/ui
npm run build      # type-check + static files in dist/
npm run preview
npm run icons
```

## Layout

| Path | What |
| --- | --- |
| `src/Calculator.tsx` | Style, vegetable (swap or mix), batch, jar temperature, then the results |
| `src/Results.tsx` | Salt, timeline with the arithmetic, calendar links, taste check, tips, water, science |
| `src/HistoryPage.tsx`, `src/recorder.ts` | The history: recorded by itself once the inputs settle; edits to the same jar shortly after replace the last entry |
| `src/form.ts`, `src/store.ts` | Stored-state validation, storage keys, the "is this weather still fresh" rule |
| `src/SettingsPage.tsx` | Kitchen temperature, water hardness, theme, units, reset |

## Behaviour worth knowing

- It calculates live: no Calculate button, so a result is never out of date.
- The jar temperature you set (here or in Settings, the same value) always wins over the outdoor forecast, because a jar on a counter sits warmer than the street. With neither, 22 °C is assumed and the page says so.
- The date is an estimate: the recipe's documented duration at 22 °C, adjusted for temperature, salt, water, vegetables, cut size and starter, with every adjustment listed. A temperature too hot or cold for the bacteria shows the reason instead of a date.
- Water hardness comes from, in order: a value you type, a UK postcode (a table inside the app, no network), or the town found from your location (OpenStreetMap's Nominatim, only on the location tap), else an assumed 120 mg/L, and Settings says which. It only matters for brine ferments, so the Water card appears only for them.
- Weights are entered in grams in both unit settings; results and temperatures follow the units setting.

## Deploying

A Cloudflare Pages project with `apps/lacto` as the root, build command `npm ci && npm run build`, output `dist`. Deployed automatically to the `lactoferment` project by `.github/workflows/web-apps.yml` on a push to `main`.
