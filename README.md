# 🥖 SourDough — Location-Aware Sourdough Optimizer

> **The app is called Dough & Ferment Calculators; the open-source project is SourDough.**

**Bake better bread by listening to your kitchen, not a textbook.**

SourDough takes the guesswork out of sourdough baking. It auto-detects your
local temperature, water hardness, and location, then calculates your ideal
final dough temperature (FDT), hydration targets, and fermentation timeline —
all adjusted to your *actual* environment.

---

## Why SourDough?

Most sourdough recipes assume a warm, standard kitchen and medium-hard water.
But your kitchen might be chilly in winter, your tap water might be soft, and
your flour might have different protein than what the recipe expects.
SourDough adapts everything to where you really are:

- 🌡 **Live ambient temperature** via Open-Meteo weather data
- 💧 **Regional water hardness** from open water-quality datasets
- 🌾 **Flour-specific protein data** from a built-in catalogue of 60+ flours
- 📍 **Location-aware** — auto-detects your city via GPS or postcode lookup

---

## Features

The calculators come in two forms that share one set of baking rules
(`packages/calc`):

- **Android/iOS app** (`SourDoughMobile/`) — built with Expo SDK 57, React
  Native 0.86 and TypeScript. A landing page greets you with three cards — pick
  bread, yogurt, or lacto-fermentation — then dive into the full calculator.
- **Web calculators** (`apps/`) — one small static site per calculator, plus a
  hub page that links them. See [Web](#-web).

### 📱 Recipe Engine
- **Auto-location** — one-tap GPS → weather + water hardness for your exact spot
- **Postcode refinement** — enter a postcode for precise local conditions
- **Manual mode** — set temperature and postcode without granting location
- **Flour picker** — browse 60+ Shipton Mill flours by category, with protein %
- **Multi-flour blends** — mix flours at custom ratios; weighted protein and fermentation
- **FDT calculation** — computes your final dough temperature from the four inputs
- **Dynamic fermentation** — hour-by-hour model accounting for ambient drift, inoculation, hydration, and flour type
- **Fermentation timeline** — step-by-step schedule: autolyse → folds → bulk → shape → proof → bake
- **Water hardness advice** — tailored tips for soft, hard, and ideal water

### 🧪 Starter Tracker
- **Feeding log** — record each feeding by flour, water, and ratio
- **Notifications** — configurable feeding reminders via expo-notifications (coming soon)
- **History** — browse past bakes, search and filter saved recipes

### 📦 Data & Privacy
- **Private by design** — no accounts, all data stored locally via AsyncStorage (weather and water-hardness detection need network; manual mode works offline)
- **Local recipe data** — no account or cloud recipe storage, and no analytics
- **Location is transient** — with permission, coordinates are sent to fetch weather and geocode your city; they are not saved with recipes
- **No assistant for now** — "Ask the baker" (an optional AI question box) is switched off: it is hidden in the app, and nothing is sent anywhere for it. The code stays in the repo (`functions/`, `SourDoughMobile/src/components/AskCard.tsx`); the privacy policy will be updated before it comes back

### 🌐 Web

| Site | Source |
|---|---|
| [sourdoughcalculator.uk](https://sourdoughcalculator.uk) — hub, About and Privacy pages | `apps/hub` |
| [bread.sourdoughcalculator.uk](https://bread.sourdoughcalculator.uk) | `apps/bread` |
| [yogurt.sourdoughcalculator.uk](https://yogurt.sourdoughcalculator.uk) | `apps/yogurt` |
| [lactoferment.sourdoughcalculator.uk](https://lactoferment.sourdoughcalculator.uk) | `apps/lacto` |
| [pasta.sourdoughcalculator.uk](https://pasta.sourdoughcalculator.uk) | its own repository |

- **Installable PWAs** — the calculators add to the home screen and work offline once loaded (the hub is a plain static page)
- **No accounts, no analytics, no cookies** — everything you save stays in your browser; location is only used when you tap the button for it
- **Shared code** — each app is a Vite + React build on `packages/calc` (rules), `packages/core` (settings, storage, weather, offline build) and `packages/ui` (look)

### 🥛 Yogurt Calculator
- **10 starter cultures** — thermophilic and mesophilic, each with its own incubation model
- **Milk picker** — cow, goat, sheep, and plant-based milks with adjusted yield
- **Incubation timeline** — target window, min/max range, and temperature cap
- **Yield & nutrition** — accounts for evaporation and straining losses
- **Previous-batch starter** — use yesterday's yogurt as today's inoculum

### 🥬 Lacto-Fermentation Calculator
- **7+ ferment styles** — dry salt, brine, and mash methods with volume conversion
- **25+ vegetables** — density and water-release data for common ferments
- **Salt calculator** — converts between grams, percentage, and volume measures
- **Day-by-day timeline** — LAB succession from Leuconostoc to Lactobacillus
- **Conditions-aware timing** — the duration starts from the recipe's own documented baseline and is adjusted to your kitchen: forecast temperature (a cardinal-temperature curve, not a flat Q10), salt level, water chemistry, vegetable mix and how finely you cut it — with the arithmetic shown in the app and carried into the calendar event
- **Fermentation ceiling** — measured acid-demand vs sugar data flags vegetables that cannot reach full sourness (broccoli stops near pH 4.3) instead of pretending they will
- **Cut size, starter culture** — the two levers that matter most after salt, modelled from trial data rather than guesswork
- **Automatic history** — every ferment you calculate is recorded (no save button) and kept for 12 months, with one tap to load the inputs back into the calculator
- **Add to Google Calendar** — one tap drops the ready day, the first taste check, or the whole ferment into your calendar, with batch, salt and the day-by-day schedule filled in

---

## Getting Started

```bash
cd SourDoughMobile

# Install dependencies
npm install

# Start the Expo dev server
npx expo start

# Run on a specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

**Requirements:** Node.js 22+, Expo SDK 57. Use the [Expo Go](https://expo.dev/go)
app for quick testing on a physical device, or build a development client with
EAS Build.

The web calculators in `apps/` each have their own README (`npm install`,
`npm run dev`, `npm test`, `npm run build`).

### Deployment

A push to `main` that touches `apps/` or the shared packages runs
`.github/workflows/web-apps.yml`: it type-checks, tests and builds the hub,
bread, yogurt and lacto apps, and once all four pass it deploys each to its
Cloudflare Pages project (`hub`, `bread`, `yogurt`, `lactoferment`). The Expo
web build is no longer deployed; the Android app is released through Google
Play (see `SourDoughMobile/PLAY_RELEASE.md`). `ci.yml` type-checks and tests
the mobile app, the calculation package and the Pages Function.

---

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  GPS /       │ ──▶ │  Open-Meteo  │ ──▶ │  Ambient Temp    │
│  Postcode    │     │  Weather API │     │  + Forecast      │
└─────────────┘     └──────────────┘     └──────────────────┘
       │                                         │
       ▼                                         ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│ Nominatim   │     │  Water       │     │  FDT Calculator  │
│ Geocoding   │     │  Hardness DB │     │  + Hydration     │
└─────────────┘     └──────────────┘     └──────────────────┘
       │                                         │
       ▼                                         ▼
┌─────────────┐     ┌──────────────────────────────────────┐
│ City Name   │     │  Final Recipe:                       │
│ + Region    │     │  • Water temperature to use          │
└─────────────┘     │  • Ingredient weights                │
                    │  • Bulk ferment duration             │
                    │  • Step-by-step timeline             │
                    └──────────────────────────────────────┘
```

---

## Project Structure

| Directory | What it is |
|---|---|
| `SourDoughMobile/` | React Native (Expo) app — Android and iOS |
| `apps/` | The web calculators: `hub`, `bread`, `yogurt`, `lacto` |
| `packages/calc` | The baking rules and data (pure TypeScript), shared by the app and the web apps |
| `packages/core` | Settings, storage, weather and the offline build, for the web apps |
| `packages/ui` | The shared look of the web apps |
| `functions/` | The Cloudflare Pages Function for "Ask the baker" (currently switched off) |

> **Note:** The original Python CLI/GUI (`optimizer.py`) has been retired.
> The baking science lives in `packages/calc/src/lib/` (start with
> `calculations.ts`).

---

## Contributing

Contributions are welcome! Whether it's a bug fix, a new flour profile, or a
feature idea:

1. **Fork** the repository
2. **Create a branch** — `git checkout -b fix/something` or `git checkout -b feature/your-idea`
3. **Make your changes** — follow the existing TypeScript/React Native patterns
4. **Test** — run `npm test` in the app you changed (`SourDoughMobile/` or `apps/<name>/`) and check it on web or device
5. **Commit** — use clear commit messages describing what changed and why
6. **Push** and open a **Pull Request**

### What makes a good contribution?

- **New flours** — add entries to `packages/calc/src/data/flours.ts`
- **Bug fixes** — include steps to reproduce in your PR description
- **New features** — open an issue first to discuss the approach
- **Docs** — improvements to READMEs, comments, or error messages

### Code style

- TypeScript: follow the existing Expo/React Native patterns
- Keep it readable — this is a baking tool, not a spaceship

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE)
for the full text.

In short: you can use, modify, distribute, and even sell this code. Just keep
the copyright notice and don't hold us liable.

---

## Privacy

SourDough takes your privacy seriously:

- ❌ **No accounts required** — no sign-up, no login
- ✅ **No analytics** — neither the apps nor the websites measure your use
- ❌ **No cloud storage** — your recipes stay on your device
- ✅ **Location is transient** — if you allow location access, coordinates are used to fetch weather and identify your area; they are not saved with recipes
- ✅ **No AI service** — the optional "Ask the baker" assistant is switched off

See [SourDoughMobile/PRIVACY.md](SourDoughMobile/PRIVACY.md) for details.

---

## Acknowledgements

- Weather data: [Open-Meteo](https://open-meteo.com/) — free, open-source weather API
- Geocoding: [OpenStreetMap / Nominatim](https://nominatim.openstreetmap.org/)
- Flour data: [Shipton Mill](https://www.shipton-mill.com/) — amazing flour, amazing mill
- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
