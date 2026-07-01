# 🥖 SourDough — Location-Aware Sourdough Optimizer

**Bake better bread by listening to your kitchen, not a textbook.**

SourDough is a two-part project that takes the guesswork out of sourdough
baking. It auto-detects your local temperature, water hardness, and location,
then calculates your ideal final dough temperature (FDT), hydration targets,
and fermentation timeline — all adjusted to your *actual* environment.

---

## Why SourDough?

Most sourdough recipes assume a warm, standard kitchen and medium-hard water.
But your kitchen might be chilly in winter, your tap water might be soft, and
your flour might have different protein than what the recipe expects.
SourDough adapts everything to where you really are:

- 🌡 **Live ambient temperature** via Open-Meteo weather data
- 💧 **Regional water hardness** from open water-quality datasets
- 🌾 **Flour-specific hydration** from a built-in catalogue of 60+ flours
- 📍 **Location-aware** — auto-detects your city or lets you enter a postcode

---

## Project Structure

| Directory | What it is |
|---|---|
| `optimizer.py` | Python CLI + Tkinter GUI — the original desktop tool |
| `SourDoughMobile/` | React Native (Expo) mobile app — iOS, Android, and web |

Both share the same baking science engine. The Python tool is great for
desktop use; the mobile app goes with you into the kitchen.

---

## Features

### 🖥 Python CLI / GUI (`optimizer.py`)

```
python3 optimizer.py          → rich interactive terminal
python3 optimizer.py --gui    → Tkinter window
```

- **Auto-location** — IP geolocation → reverse geocode → precise city name
- **Postcode refinement** — prompts for your postcode when location is vague
- **Weather integration** — live Open-Meteo temperature + forecast
- **Water hardness** — regional lookup by UK water hardness zones
- **Flour database** — 60+ Shipton Mill flours with protein %, plus generic fallbacks
- **FDT calculation** — computes required water temperature to hit target dough temp
- **Fermentation timeline** — bulk ferment estimate adjusted to ambient conditions
- **Recipe history** — saves every bake to `recipes.txt` for reference
- **Rich TUI** — colorful tables, panels, and progress indicators

### 📱 Mobile App (`SourDoughMobile/`)

Built with Expo SDK 56, React Native 0.85, and TypeScript.

- **Starter tracker** — log feedings by flour, water, and ratio; get reminders
- **Recipe engine** — build recipes with live ingredient scaling
- **Auto-location** — one-tap GPS → temperature + water hardness
- **Manual mode** — enter temperature and postcode without granting location
- **Fermentation timeline** — step-by-step schedule: autolyse → folds → bulk → shape → proof → bake
- **Flour picker** — browse and customize flour profiles
- **Fully offline-capable** — all data stored locally via AsyncStorage
- **Notifications** — feeding reminders via expo-notifications

---

## Screenshots

<!-- TODO: Add screenshots here -->
<!--
![CLI optimizer](docs/screenshots/cli.png)
![GUI window](docs/screenshots/gui.png)
![Mobile — Recipe Builder](docs/screenshots/mobile-recipe.png)
![Mobile — Fermentation Timeline](docs/screenshots/mobile-timeline.png)
![Mobile — Starter Tracker](docs/screenshots/mobile-starter.png)
-->

*Screenshots coming soon. In the meantime, run the tool or app to see it in action!*

---

## Getting Started

### Python Tool (CLI/GUI)

```bash
# Clone the repo
git clone https://github.com/tuncoglu/SourDough.git
cd SourDough

# Run the optimizer (auto-installs dependencies)
python3 optimizer.py

# Or launch the GUI
python3 optimizer.py --gui
```

**Requirements:** Python 3.8+. The script auto-installs `rich` and `requests`
if they're missing. Tkinter is bundled with most Python distributions.

### Mobile App

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

The web version is deployed at the project's Cloudflare Pages URL on every
push to `main`.

---

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  IP / GPS   │ ──▶ │  Open-Meteo  │ ──▶ │  Ambient Temp    │
│  Location   │     │  Weather API │     │  + Forecast      │
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

## Contributing

Contributions are welcome! Whether it's a bug fix, a new flour profile, or a
feature idea, here's how to contribute:

1. **Fork** the repository
2. **Create a branch** — `git checkout -b fix/something` or `git checkout -b feature/your-idea`
3. **Make your changes** — follow the existing code style
4. **Test** — run `python3 optimizer.py` for the Python tool, or `npx expo start` for the mobile app
5. **Commit** — use clear commit messages describing what changed and why
6. **Push** and open a **Pull Request**

### What makes a good contribution?

- **New flours** — add entries to the `SHIPTON_MILL_FLOURS` list in `optimizer.py` or the mobile app's flour data
- **Bug fixes** — include steps to reproduce in your PR description
- **New features** — open an issue first to discuss the approach
- **Docs** — improvements to READMEs, comments, or error messages

### Code style

- Python: standard PEP 8, type hints where practical
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

See [PRIVACY.md](PRIVACY.md) for the Python tool and
[SourDoughMobile/PRIVACY.md](SourDoughMobile/PRIVACY.md) for the mobile app.

---

## Acknowledgements

- Weather data: [Open-Meteo](https://open-meteo.com/) — free, open-source weather API
- Geocoding: [OpenStreetMap / Nominatim](https://nominatim.openstreetmap.org/)
- Flour data: [Shipton Mill](https://www.shipton-mill.com/) — amazing flour, amazing mill
- Mobile app built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
