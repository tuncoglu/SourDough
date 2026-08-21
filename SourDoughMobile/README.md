# 🥖 Just Dough It — Mobile App

The mobile companion to [SourDough](https://github.com/tuncoglu/SourDough) —
a location-aware sourdough baking calculator for iOS, Android, and web.

<p align="center">
  <img src="./assets/images/icon.png" width="120" alt="Just Dough It icon" />
</p>

---

## Why This App?

Most sourdough recipes tell you "ferment for 4 hours." But in a cold kitchen,
that could be 7 hours. In a warm one, it could be 3. Just Dough It uses
your **real location** to detect ambient temperature and water hardness, then
adjusts fermentation timelines and hydration targets accordingly.

Built for bakers who want predictable results without the guesswork.

---

## Screenshots

<!-- TODO: Add screenshots once available -->
<!--
<p align="center">
  <img src="docs/screenshots/starter-tracker.png" width="200" alt="Starter Tracker" />
  <img src="docs/screenshots/recipe-builder.png" width="200" alt="Recipe Builder" />
  <img src="docs/screenshots/fermentation-timeline.png" width="200" alt="Fermentation Timeline" />
  <img src="docs/screenshots/flour-picker.png" width="200" alt="Flour Picker" />
</p>
-->

*Screenshots coming soon! Run the app to see it live.*

---

## Features

- 🧪 **Starter tracker** — Log feedings with flour, water, and ratio. View your starter's history at a glance. Get reminders when it's time to feed again (coming soon).
- 📋 **Recipe engine** — Build recipes by flour mix, hydration percentage, and inoculation. Every ingredient scales live as you tweak the numbers.
- 📍 **Auto-location** — One-tap detection pulls your local temperature (via Open-Meteo) and water hardness by region, then adjusts your fermentation schedule.
- 🔒 **Manual mode** — Enter your own temperature and postcode. No location permission needed.
- ⏱️ **Fermentation timeline** — Step-by-step schedule: autolyse, stretch-and-folds, bulk fermentation, shaping, proofing, and bake — all adjusted to your conditions.
- 🌾 **Flour database** — 60+ profiles: bread flour, whole wheat, rye, spelt, einkorn, and more.
- 🔔 **Feeding reminders** — Notifications so your starter never goes neglected (coming soon).
- 📱 **Cross-platform** — iOS, Android, and web from a single codebase.

---

## Yogurt Calculator

- 🥛 **10 starter cultures** — from classic thermophilic blends to mesophilic heirloom styles
- 🌡️ **Thermophilic & mesophilic** — separate incubation models for each culture type
- 🥛 **Milk picker** — cow, goat, sheep, and plant-based milks with adjusted yield
- ⏱️ **Incubation timeline** — target window, min/max range, and temperature cap
- ⚖️ **Yield & nutrition** — accounts for evaporation and straining losses
- ♻️ **Previous-batch starter** — use yesterday's yogurt as today's inoculum

---

## Lacto-Fermentation Calculator

- 🥬 **7+ ferment styles** — dry salt, brine, and mash methods with volume conversion
- 🥒 **25+ vegetables** — density and water-release data for common ferments
- 🧂 **Salt calculator** — converts between grams, percentage, and volume measures
- 📅 **Day-by-day timeline** — LAB succession from Leuconostoc to Lactobacillus
- 🌡️ **Temperature-adjusted Q10 model** — duration and pH timeline adapt to ambient temperature

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (or use `npx expo`)

### Setup

```bash
# Clone the repo
git clone https://github.com/tuncoglu/SourDough.git
cd SourDough/SourDoughMobile

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for web
- Scan the QR code with [Expo Go](https://expo.dev/go) to run on a physical device

### Web Deployment

The web version deploys automatically to Cloudflare Pages on every push to `main`.
To deploy manually:

```bash
npx expo export --platform web
cp -f public/_headers dist/_headers
npx wrangler pages deploy dist --project-name=sourdough
```

---

## Project Structure

```
SourDoughMobile/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Landing page (pick bread, yogurt, or lacto)
│   ├── (tabs)/             # Tab-based navigation (6 tabs)
│   └── recipe/             # Recipe detail screens
├── src/
│   ├── components/         # Reusable UI components
│   ├── data/               # Flour database, water hardness data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core calculation engine
│   ├── models/             # TypeScript types/interfaces
│   ├── store/              # State management
│   └── theme/              # Colors, spacing, typography
├── assets/
│   ├── fonts/              # Custom fonts
│   └── images/             # Icons, splash, favicon
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration
└── package.json            # Dependencies and scripts
```

### Key Dependencies

| Package | Purpose |
|---|---|
| `expo` ~56 | Expo SDK |
| `expo-router` ~56 | File-based routing |
| `expo-location` ~56 | GPS location access |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `react-native-reanimated` | Smooth animations |
| `react` 19 / `react-native` 0.85 | UI framework |

---

## Architecture

A **landing page** (`app/index.tsx`) greets users with three cards — bread, yogurt, lacto-fermentation — routing to six tabs under `app/(tabs)/`:

- **Sourdough** (`index.tsx`) — bread calculator: flour blends, pre-ferments, cold proof, ready-by planner
- **Yogurt** (`yogurt.tsx`) — incubation calculator with 10 culture types, milk picker, yield & nutrition
- **Lacto-ferment** (`ferments.tsx`) — vegetable fermentation with salt calculator and day-by-day timeline
- **History** (`history.tsx`) — saved recipes with search, filter chips, edit, duplicate, delete
- **Settings** (`settings.tsx`) — defaults, water hardness override, theme, units
- **About** (`about.tsx`) — app overview, privacy notice, and acknowledgements

**Calculation engines** (`src/lib/`) are pure, React-free functions — `calculations.ts` (bread FDT, Q10 fermentation, cold proof), `yogurtCalculations.ts`, `lactoCalculations.ts`, `blendUtils.ts`, `unitConversion.ts` — fully unit-testable without the RN runtime. **Hooks** (`src/hooks/`) orchestrate UI state; **stores** (`src/store/`) persist to AsyncStorage (recipes, settings, starter) with an in-memory settings cache (60s TTL). The **theme system** (`src/theme/`) provides light/dark palettes, a `useAppTheme()` hook, and design tokens (spacing, font sizes, radii, `cardStyle`/`cardStyleLg`/`sectionTitleStyle`).

All internal math is metric (g, °C); unit conversion happens only at the display boundary.

---

## Contributing

Contributions are welcome! Here's the flow:

1. **Fork** the repo
2. **Branch** — `git checkout -b feature/cool-thing`
3. **Code** — follow the existing TypeScript/React Native patterns
4. **Test** — run `npx expo start` and verify on at least one platform
5. **PR** — open a pull request with a clear description

### What to work on?

- 🐛 Bug fixes — especially platform-specific edge cases
- 🌾 New flour profiles — add entries to the flour data
- 🎨 UI polish — the app follows a warm, bakery-inspired design
- 📱 Accessibility — screen reader support, sufficient contrast
- 🌍 i18n — translations for the baking interface

### Before submitting

- Does it work on both iOS and Android (or web, if applicable)?
- Are new dependencies justified and lightweight?
- Does it match the existing UI style (warm neutrals, rounded corners, clear typography)?

---

## F-Droid / degoogled Android builds

The Android build intentionally excludes `expo-location` from autolinking
(see `expo.autolinking.android.exclude` in `package.json`) and uses the local
`modules/sourdough-location` module, which talks to Android's `LocationManager`
directly instead of Google Play Services. `expo-store-review` has been removed.

## Privacy

**No accounts required. No tracking. No cloud storage.** Everything stays on your device.

When you grant location permission, only your coordinates are sent to
Open-Meteo (weather) and OpenStreetMap (geocoding). Nothing else.

The website has an optional email waitlist for iOS/Android launch updates;
your address is used only for that purpose. Full details: [PRIVACY.md](PRIVACY.md)

---

## License

MIT — see [LICENSE](LICENSE) for the full text.

---

## Contact

Questions, feedback or privacy concerns: info@sourdoughcalculator.uk

## Related

- [SourDough](https://github.com/tuncoglu/SourDough) — open-source project home
- [Shipton Mill](https://www.shipton-mill.com/) — source of our flour data
- [Open-Meteo](https://open-meteo.com/) — free weather API
