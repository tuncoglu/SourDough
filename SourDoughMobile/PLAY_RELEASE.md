# Google Play Release — Dough & Ferment Calculators

Play Console app: **Dough & Ferment Calculators**, package `com.sourdough.optimizer`,
created 2026-10-29 in the ENFTC organisation account (free, App). The launcher label
on the phone is the shorter **Dough & Ferment** (`app.json` `name`).

Release access: service account `play-publisher@gen-lang-client-0819398282.iam.gserviceaccount.com`
(key `~/.play-key.json`, helper scripts in `~/.config/play-publisher/`). It can see this
package; a draft release goes up with `play-upload.sh`.

## Status (2026-10-29)

| Item | State |
|---|---|
| Console app created | done |
| Release AAB on the internal track | published to internal testing 2026-10-30 (build 3, versionCode 3, 3.0.0; tester list "HR Buzz testers"), see "Builds" |
| Store listing | saved in Console, "Ready to send for review" (title, short and full description, icon, feature graphic, 7 screenshots); source `STORE_LISTING.md` |
| Privacy policy | https://sourdoughcalculator.uk/privacy (renders `PRIVACY.md`); needs a push to show the new name |
| Setup forms in Console | all done (content rating by the user; AI-generated-assets declaration: icon and feature graphic labelled; the new icon and feature graphic are code-drawn by Claude, so keep the label) |
| Screenshots | 7 uploaded (they show the old 7-tab bar; re-render them to match the four-tools-and-More bar before the next submission) (`../play-assets/screenshots/`), rendered from the app's own web build at phone size (412x824 at 2.62x, 1079x2158) because the emulator crashes on this machine and the phone was not connected; native status bar and nav bar are not in them. Promotion eligibility wants 1080 px or more per side, these are 1079 wide |
| Feature graphic | done (`../play-assets/feature-graphic.png`, 1024x500) |
| Sent for review | yes, 2026-10-30: 8 changes (listing, content rating, audience, privacy policy, ads, data safety, health, category); Play's quick checks run first, review usually takes up to about 7 days |
| **Review result** | **Rejected 2026-10-30 (Metadata policy, "Hi-res icon (en-GB)")**: the store icon was the Expo template's blue chevron on a blueprint grid, nothing to do with the app. The same placeholder was the launcher icon, adaptive icon, monochrome icon, splash and favicon. Replaced on 2026-10-30 by a new set (loaf and a bubbling jar on a cream disc, dark brown field, the same family as the web apps' icons) in `assets/images/`, plus `../play-assets/icon-512.png` and a feature graphic that uses it. Build 4 (3.0.1) is on the internal track and the listing's icon and feature graphic were replaced through the API on 2026-10-30 (committed with `changesNotSentForReview=true`: the API refuses to send changes for review itself). On 2026-10-30 the two listing changes (icon, feature graphic) were sent for review from the Console (Publishing overview) on their own. The user's pending PRODUCTION release (build 3, 3.0.0, 177 countries + rest of world, notes "Initial release") was deliberately held back with "Save for later": build 3 still has the old chevron icon and 7-tab bar. Before releasing to production: repoint that release at build 4 (or newer), re-render the screenshots for the new bar, and wait for the icon review to pass. Production already holds build 3 per the API, so check what the Console says before submitting |

## Builds

Signing comes from `keystore.properties` (gitignored) via `plugins/withAndroidSigningConfig.js`;
the upload key is `~/.android-keys/sourdough-upload.jks` (SHA-256 starts `4C:66:E0:B9`).
`android.versionCode` in `app.json` (now 4) must go up for every upload; Play rejects a reused code.

```bash
cd SourDoughMobile
export JAVA_HOME=~/.jdks/temurin-21.0.12.1          # the default JDK 25 breaks Gradle
npx expo prebuild --platform android --no-install
cd android && ./gradlew bundleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a,x86_64,x86
bash ~/.config/play-publisher/play-upload.sh ~/.play-key.json com.sourdough.optimizer \
  app/build/outputs/bundle/release/app-release.aab internal draft "<versionCode> (<version>)"
```

Permissions in the release manifest: location (coarse and fine), internet, vibrate. The
template's `SYSTEM_ALERT_WINDOW` and external-storage permissions are blocked in `app.json`
(`blockedPermissions`); the app needs none of them. `android.permission.DUMP` in the merged
manifest only guards the AndroidX profile-installer receiver.

## Console checklist

1. **App access**: all functionality available without special access (no accounts).
2. **Ads**: no.
3. **Content rating**: category utility/reference or "all other app types"; no violence,
   sexuality, language, gambling, user-generated content or user interaction features.
4. **Target audience**: 18+ (the app is not for children).
5. **Data safety**: see below.
6. **Government apps**: no. **Financial features**: none. **Health apps**: none (it is a
   cooking tool, not a health app). **Advertising ID**: no.
7. **Store listing**: from `STORE_LISTING.md`, icon, feature graphic, phone screenshots.
8. **Privacy policy URL**: `https://sourdoughcalculator.uk/privacy`.
9. **Contact**: info@sourdoughcalculator.uk, https://sourdoughcalculator.uk.
10. **Testers** for the internal track, then promote to closed or production when ready.

The user ticks the policy and export declarations and any legal attestation; everything else
can be filled through the Console with browser tools.

## Data Safety answers

- **Collects or shares user data?** Yes, only location, and only when the user allows it.
- **Location (approximate and precise)**: collected, shared (with Open-Meteo for the weather
  and OpenStreetMap Nominatim for the place name; the developer receives nothing), optional,
  purpose **App functionality**. The app asks first and works without it.
- **Everything else** (personal info, financial, health, messages, photos, files, contacts,
  calendar, app activity, web browsing, device ids): not collected. Recipes, starter log and
  history stay on the device.
- **Encrypted in transit?** Yes (HTTPS).
- **Can users ask for data to be deleted?** The developer holds no data; uninstalling or
  clearing app data removes everything.
- **Google Calendar links**: a link opened by the user's own tap in the browser or Calendar
  app; the app does not transmit anything itself.

## Open items

- Wait for review; then promote to closed or production when ready. Add a deobfuscation file only if R8/proguard is enabled (Play warns about its absence).
- Optional: native screenshots from the phone, at 1080 px or more wide.
- Expo hooks and the Android builds still use `com.sourdough.optimizer` unchanged; the app
  name is not the package name, so nothing needs migrating.
