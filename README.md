# 🥖 SourDough — Location-Aware Sourdough Optimizer

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
- 🌾 **Flour-specific hydration** from a built-in catalogue of 60+ flours
- 📍 **Location-aware** — auto-detects your city via GPS or postcode lookup

---

## Features

Built with Expo SDK 56, React Native 0.85, and TypeScript. Runs on web, iOS,
and Android from a single codebase.

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
- **Notifications** — configurable feeding reminders via expo-notifications
- **History** — browse past feedings to track your starter's rhythm

### 📦 Data & Privacy
- **Fully offline-capable** — all data stored locally via AsyncStorage; no accounts
- **No tracking** — no analytics, no telemetry, no cloud storage
- **Location is transient** — coordinates are sent only to fetch weather and geocode your city; never stored or shared

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

**Requirements:** Node.js 22+, Expo SDK 56. Use the [Expo Go](https://expo.dev/go)
app for quick testing on a physical device, or build a development client with
EAS Build.

The web version is deployed on every push to `main` via GitHub Actions →
Cloudflare Pages.

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
| `SourDoughMobile/` | React Native (Expo) app — iOS, Android, and web |
| `worker/` | Cloudflare Worker — routes custom domain to Pages deployment |

> **Note:** The original Python CLI/GUI (`optimizer.py`) has been retired.
> The mobile/web app is the canonical SourDough experience. The baking science
> lives in `SourDoughMobile/src/lib/calculations.ts`.

---

## Contributing

Contributions are welcome! Whether it's a bug fix, a new flour profile, or a
feature idea:

1. **Fork** the repository
2. **Create a branch** — `git checkout -b fix/something` or `git checkout -b feature/your-idea`
3. **Make your changes** — follow the existing TypeScript/React Native patterns
4. **Test** — run `npx expo start` and verify on web or device
5. **Commit** — use clear commit messages describing what changed and why
6. **Push** and open a **Pull Request**

### What makes a good contribution?

- **New flours** — add entries to `SourDoughMobile/src/data/flours.ts`
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

- ❌ **No accounts** — no sign-up, no login
- ❌ **No tracking** — no analytics, no telemetry
- ❌ **No cloud storage** — your recipes stay on your device
- ✅ **Location is transient** — coordinates are sent only to fetch weather and geocode your city; never stored or shared

See [SourDoughMobile/PRIVACY.md](SourDoughMobile/PRIVACY.md) for details.

---

## Acknowledgements

- Weather data: [Open-Meteo](https://open-meteo.com/) — free, open-source weather API
- Geocoding: [OpenStreetMap / Nominatim](https://nominatim.openstreetmap.org/)
- Flour data: [Shipton Mill](https://www.shipton-mill.com/) — amazing flour, amazing mill
- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
