# 🥖 Sourdough Optimizer — Mobile App

The mobile companion to [SourDough](https://github.com/tuncoglu/SourDough) —
a location-aware sourdough baking calculator for iOS, Android, and web.

<p align="center">
  <img src="./assets/images/icon.png" width="120" alt="Sourdough Optimizer icon" />
</p>

---

## Why This App?

Most sourdough recipes tell you "ferment for 4 hours." But in a cold kitchen,
that could be 7 hours. In a warm one, it could be 3. Sourdough Optimizer uses
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

- 🧪 **Starter tracker** — Log feedings with flour, water, and ratio. View your starter's history at a glance. Get reminders when it's time to feed again.
- 📋 **Recipe engine** — Build recipes by flour mix, hydration percentage, and inoculation. Every ingredient scales live as you tweak the numbers.
- 📍 **Auto-location** — One-tap detection pulls your local temperature (via Open-Meteo) and water hardness by region, then adjusts your fermentation schedule.
- 🔒 **Manual mode** — Enter your own temperature and postcode. No location permission needed.
- ⏱️ **Fermentation timeline** — Step-by-step schedule: autolyse, stretch-and-folds, bulk fermentation, shaping, proofing, and bake — all adjusted to your conditions.
- 🌾 **Flour database** — 60+ profiles: bread flour, whole wheat, rye, spelt, einkorn, and more. Customize protein percentages.
- 🔔 **Feeding reminders** — Notifications so your starter never goes neglected.
- 📱 **Cross-platform** — iOS, Android, and web from a single codebase.

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
npx wrangler pages deploy dist --project-name=sourdough
```

---

## Project Structure

```
SourDoughMobile/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── (tabs)/             # Tab-based navigation
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
| `expo-notifications` ~56 | Feeding reminders |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `react-native-reanimated` | Smooth animations |
| `react` 19 / `react-native` 0.85 | UI framework |

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

## Privacy

**No accounts. No tracking. No cloud storage.** Everything stays on your device.

When you grant location permission, only your coordinates are sent to
Open-Meteo (weather) and OpenStreetMap (geocoding). Nothing else.

Full details: [PRIVACY.md](PRIVACY.md)

---

## License

MIT — see [LICENSE](LICENSE) for the full text.

---

## Related

- [SourDough Python Tool](../optimizer.py) — CLI/GUI desktop version
- [Shipton Mill](https://www.shipton-mill.com/) — source of our flour data
- [Open-Meteo](https://open-meteo.com/) — free weather API
