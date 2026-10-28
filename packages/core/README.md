# @sourdough/core

Shared by the standalone web apps (`apps/*`). Not React, not calculations (those are `@sourdough/calc`), and not styled (that is `@sourdough/ui`).

| File | What |
| --- | --- |
| `src/storage.ts` | `localStorage` that never throws: private windows, blocked storage and corrupt JSON all fall back to defaults |
| `src/settings.ts` | The settings every app has (theme, units, kitchen temperature), and how to apply the theme |
| `src/weather.ts` | The optional location lookup: Open-Meteo (current temperature, hourly forecast, and a tap-water temperature estimate) and, if asked, Nominatim (the town, for water hardness). Only runs when the person asks |
| `src/precache.ts` | A Vite plugin that writes `sw.js` at build time so the whole app is cached on first visit |

Imported as `@sourdough/core/<file>`. Each app's `vite.config.ts` and `tsconfig.json` map the alias; there is no npm workspace.
