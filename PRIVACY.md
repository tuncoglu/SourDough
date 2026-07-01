# Privacy Policy for Sourdough Bread Process Optimizer

**Last updated:** July 1, 2026

Sourdough Bread Process Optimizer ("the Tool") is a CLI/GUI baking calculator
that auto-detects your location to provide accurate fermentation guidance. This
policy explains what data the Tool handles and how it is used.

## Data we collect

**The Tool does not require an account, does not collect personal identifiers,
and does not use analytics or tracking.**

Your recipes, saved preferences, and history are stored **only on your
machine** in the `recipes.txt` file alongside the script. We do not have access
to this data.

## Location data

The Tool determines your approximate location to fetch local ambient
temperature and water hardness — both critical inputs for sourdough
fermentation calculations.

Your IP address or coordinates are sent to these third-party services:

| Service | Purpose | Privacy Policy |
|---|---|---|
| [ipapi.co](https://ipapi.co/) | IP-based geolocation (city/region detection) | [ipapi.co/privacy](https://ipapi.co/privacy/) |
| [Open-Meteo](https://open-meteo.com/) | Current temperature and weather forecast at your location | [open-meteo.com/en/privacy](https://open-meteo.com/en/privacy) |
| [OpenStreetMap / Nominatim](https://nominatim.openstreetmap.org/) | Reverse geocoding (coordinates → city/region) and postcode geocoding | [osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy) |

These requests contain **only** your IP address or coordinates and a
user-agent string identifying the Tool. No account information, device
identifiers, or other personal data is attached.

You can skip automatic location detection and enter your ambient temperature
and water hardness manually — no network requests are made in that case.

## Data sharing

Beyond the API calls described above, the Tool **does not share, sell, or
transmit** any data to third parties. There are no advertising networks,
analytics SDKs, or tracking frameworks in the Tool.

## Data retention

All locally stored data (recipes, preferences) remains on your machine in the
`recipes.txt` file. Delete it to remove all saved data. The Tool has no
servers and retains none of your data.

## Children's privacy

The Tool is not directed at children under 13 and does not knowingly collect
data from them.

## Changes to this policy

Updates will be posted at the Tool's repository. Continuing to use the Tool
after changes constitutes acceptance.

## Contact

For questions about this policy, open an issue at the Tool's repository.

---

*This policy is also available at the Tool's public repository.*
