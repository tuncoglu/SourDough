# @sourdough/calc

The calculation engines behind Dough & Ferment Calculators, shared by the Expo app, the Cloudflare Pages Function for "Ask the baker", and (next) the standalone calculators at `bread.`, `yogurt.` and `lactoferment.sourdoughcalculator.uk`.

**Pure TypeScript.** No React, no storage, no network, no environment variables, and no npm dependencies. A module that needs any of those belongs in the app (`SourDoughMobile/src/`), not here. Everything that gets in here is a function of its inputs, so it can be tested without a runtime and run anywhere.

| Folder | What |
| --- | --- |
| `src/lib/` | The engines: bread (FDT, Q10 rise, flour blends, the lazy method and its schedule), starter (status, learned peak, feed amounts), yogurt, lacto-ferment, unit conversion, calendar links, ferment history rules |
| `src/data/` | Flours, vegetables, ferment presets, yogurt cultures, water hardness, bread presets |
| `src/models/` | Shared types |
| `__tests__/` | Jest tests for all of it |

## Using it

Imports are by subpath: `@sourdough/calc/lib/lazyPlan`, `@sourdough/calc/data/flours`, `@sourdough/calc/models/types`.

- **Expo app:** `metro.config.js` resolves `@sourdough/calc` to `packages/calc/src`, and `tsconfig.json` maps it with `paths`.
- **Jest:** `moduleNameMapper` in `SourDoughMobile/jest.config.js`, which also runs this package's tests.
- **Pages Functions:** `functions/api/assist.ts` imports by relative path.
- **Vite apps:** a `resolve.alias` for `@sourdough/calc` pointing at `packages/calc/src` is all they need.

## Checking it

From `SourDoughMobile/`: `npx jest` runs the tests, and `npx tsc -p ../packages/calc` typechecks the package on its own.
