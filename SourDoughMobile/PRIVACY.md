# Privacy Policy for Just Dough It

**Last updated:** September 25, 2026

Just Dough It ("the App") is a baking tool with calculators for sourdough
bread, yogurt, and lacto-fermentation. This policy explains what data the
App handles and how it is used.

## Data we collect

**The App does not require an account and does not collect personal
identifiers for the calculators.** The native apps do not include an
analytics SDK. The website may use optional Cloudflare Web Analytics;
see below.

All your app data — starter feeding history, saved recipes, fermentation
history, and settings — is stored **only on your device** using local
storage. Ferments you calculate are recorded automatically (there is no save
button) and are rotated out after 12 months. We do not have access to this
data.

### Optional waitlist email

If you choose to join the launch waitlist on the website, we collect the
email address you provide for the sole purpose of notifying you when the
iOS and Android apps are available. You can unsubscribe or ask us to delete
it at any time by emailing info@sourdoughcalculator.uk.

If the website is configured with a waitlist endpoint (for example, a
form service or Cloudflare Worker), your email is sent directly to that
processor. If no endpoint is configured, your email is not transmitted to
us automatically — the site opens a pre-filled email in your mail app, and
you choose whether to send it.

## Location data

With your permission, the App accesses your device's coarse location
solely to determine your local ambient temperature and water hardness,
which affect fermentation timing and hydration calculations.

When you grant location permission, your coordinates are sent to two
third-party services:

| Service | Purpose | Privacy Policy |
|---|---|---|
| [Open-Meteo](https://open-meteo.com/) | Current temperature at your location | [open-meteo.com/en/privacy](https://open-meteo.com/en/privacy) |
| [OpenStreetMap / Nominatim](https://nominatim.openstreetmap.org/) | Reverse geocoding (coordinates → city/region) | [osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy) |

These requests contain **only** your coordinates and a user-agent string
identifying the App. No account information, device identifiers, or
other personal data is attached.

The App may request location permission when you open a calculator, or
when you tap its location refresh control. You can decline permission
and enter temperature values manually. Entering a postcode uses
geocoding to refine the local conditions.

## Optional website analytics

If enabled for the website, Cloudflare Web Analytics receives page-view
and performance data from a browser beacon. Cloudflare says this feature
does not use cookies or local storage to measure visits and does not
track individual visitors across customer sites. It does not receive
your saved recipes or starter logs.

## Google Calendar links (optional)

The lacto-fermentation calculator can add a ferment to your calendar. This
is not a background integration: nothing is sent anywhere until you tap the
button. Tapping it opens a `calendar.google.com` link in your browser or the
Google Calendar app, with the event details (ferment style, batch, salt,
timings) encoded in that URL. Google therefore receives those details, and
whatever your Google account does with them is governed by
[Google's Privacy Policy](https://policies.google.com/privacy). The App
itself does not connect to Google — it only hands the link to your device's
browser. Skip the button and nothing is transmitted.

## Data sharing

Beyond the location, optional calendar, waitlist, and website analytics
flows described above, the App does not sell your data or transmit your
saved recipes and starter logs to third parties. There are no advertising
networks or analytics SDKs in the native apps.

## Data retention

All locally stored data (recipes, starter history, settings) remains on
your device until you delete the App or clear its storage. We have no
servers and retain none of your data.

## Children's privacy

The App is not directed at children under 13 and does not knowingly
collect data from them.

## Changes to this policy

Updates will be posted at this URL. Continuing to use the App after
changes constitutes acceptance.

## Contact

For questions about this policy, email info@sourdoughcalculator.uk,
open an issue at the App's repository, or contact the developer via
the Play Store listing.

---

*This policy is also available at the App's public repository.*
