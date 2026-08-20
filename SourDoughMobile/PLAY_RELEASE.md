# Google Play Release Preparation — Just Dough It

Status: **all artifacts ready** (2026-08-20). Blocked only on creating a Google
Play developer account.

## Ready artifacts

| Artifact | Location |
|---|---|
| Signed release AAB (69.6 MB, versionCode 1) | `android/app/build/outputs/bundle/release/app-release.aab` (generated — not in git) |
| Upload keystore | `~/.android-keys/sourdough-upload.jks` (backup creds in `CREDENTIALS.txt` next to it) |
| Screenshots ×6 | `../play-assets/screenshots/` (landing, bread, yogurt, lacto, about, settings) |
| Feature graphic 1024×500 | `../play-assets/feature-graphic.png` |
| Store listing text | `STORE_LISTING.md` |
| Privacy policy (hosted) | https://sourdoughcalculator.uk/privacy |

AAB verified: signed with the upload key (SHA-256
`4C:66:E0:B9:...`), **16KB page-size compliant** (zipalign `-c -P 16 4` passes on
all 88 `.so` entries), targetSdk 36, no `useLegacyPackaging`.

## When the developer account exists

1. play.google.com/console → create account ($25, ID verification 1–2 days).
2. **Create app** — name "Just Dough It", app type *App*, free.
3. **App access** — "All functionality is available without special access"
   (no accounts, no login).
4. **Ads** — "No, my app does not contain ads".
5. **Content rating** — questionnaire answers (category: Food & Drink;
   no violence/sexuality/language; no user interaction features beyond app
   usage; location: shared with Open-Meteo/OpenStreetMap only when user grants
   and only to provide the baking feature).
6. **Data safety form** — see answers below.
7. **Target audience** — 13+ (no age gate needed; app has no account system).
8. Upload `app-release.aab` to **Production** (or start with Internal testing).
9. Fill the store listing from `STORE_LISTING.md`, upload screenshots + graphic.
10. Privacy policy URL: `https://sourdoughcalculator.uk/privacy`.
11. Rollout — start with a small country set or internal track if unsure.

## Data Safety form answers (draft)

- **Data collected & shared?** No data is collected or shared by the developer.
  The app stores user-entered recipes/settings on-device only. Location
  coordinates are sent directly to Open-Meteo (weather) and
  OpenStreetMap/Nominatim (geocoding) — third parties, never the developer.
- **Location**: Collected: yes (Precise, only while app is in use, optional).
  Used for: App functionality. Shared: no (sent to third-party APIs listed
  above — declare under "data shared with third parties" as Location → Service
  providers → App functionality).
- **Data types not collected**: Personal info, financial info, health, photos,
  contacts, identifiers, etc. — all "No".
- **Security practices**: Data encrypted in transit (HTTPS to APIs); no
  accounts; data can be deleted by uninstalling or clearing app data.

## Release process (local builds, after account exists)

```bash
cd SourDoughMobile
# bump android.versionCode in app.json for every release
npx expo prebuild --platform android --no-install
cd android && ./gradlew bundleRelease
# upload android/app/build/outputs/bundle/release/app-release.aab in Play Console
```

Signing comes from `keystore.properties` (gitignored) via the
`plugins/withAndroidSigningConfig.js` config plugin — works through every
prebuild. If the keystore or its passwords are lost, Play updates are blocked
(Play App Signing can reset keys, but it is slow and bureaucratic): keep
`~/.android-keys/CREDENTIALS.txt` backed up in a password manager.

## Open items

- Play developer account (user-side, $25)
- Optional: EAS setup if cloud builds are preferred later (`eas.json` already
  has a production profile)
- Optional: app icon A/B check before first store review
