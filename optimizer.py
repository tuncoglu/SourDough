#!/usr/bin/env python3
"""
Sourdough Bread Process Optimizer
==================================
Auto-detects location, ambient temperature, tap-water temperature, and water
hardness.  Calculates FDT from your actual temperatures, estimates fermentation
time, and gives you practical, directive guidance — no targets to set.

Usage:
    python3 optimizer.py          → interactive CLI (rich)
    python3 optimizer.py --gui    → Tkinter window
"""

import sys
import subprocess
import json
import math
import threading
from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional, Dict, List

# ── Auto-install missing packages ─────────────────────────────────────────────
def _ensure_package(import_name: str, pip_name: str) -> None:
    try:
        __import__(import_name)
    except ImportError:
        print(f"📦 The '{pip_name}' package is required but not installed.")
        print(f"   Run: pip install {pip_name}")
        print(f"   Or press Enter to install it now (Ctrl+C to cancel).")
        try:
            input("   > ")
        except (KeyboardInterrupt, EOFError):
            print("❌ Installation cancelled. Exiting.")
            sys.exit(1)

        # Try multiple install methods
        methods = [
            [sys.executable, "-m", "pip", "install", pip_name],
            [sys.executable, "-m", "pip", "install", "--user", pip_name],
            ["pip3", "install", pip_name],
        ]
        for method in methods:
            try:
                subprocess.check_call(method)
                print(f"✅ Installed '{pip_name}' successfully.")
                return
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
        print(f"❌ Could not install '{pip_name}'. Please run: pip install {pip_name}")
        sys.exit(1)

_ensure_package("rich", "rich")
_ensure_package("requests", "requests")

import requests

# ── Flour catalogue — Shipton Mill + generic fallbacks ─────────────────────────
# Each entry: (display_label, protein_pct, product_number, notes)
# Protein is midpoint of spec range where available, rounded to nearest 0.5%.
# Generic entries at bottom serve as fallbacks.

SHIPTON_MILL_FLOURS: List[Tuple[str, float, str, str]] = [
    # ── White Bread Flours ──────────────────────────────────────────────────
    ("No. 4 Organic White (105)",       13.0, "105",
     "Shipton's flagship organic bread flour. Blend of English & continental wheats. "
     "W=275, P/L=1.0. Perfect for sourdough, yeasted & enriched breads."),
    ("French Type 55 (102)",            12.5, "102",
     "French-style T55. French, Canadian & English wheat blend. "
     "W=260, P/L=0.9, Ash 0.50-0.55%. Great for baguettes, doughnuts, pain au lait."),
    ("Canadian Strong White (112)",     14.5, "112",
     "High-protein blend with Canadian Prairie wheats. "
     "14.1-15.3% protein, Ash 0.56-0.60%. Long-fermentation sourdoughs & yeasted loaves."),
    ("Italian Type 00 (118)",           13.5, "118",
     "Farina di Tipo 00. Very fine, low-ash. "
     "W=340, P/L=1.0, Ash 0.45-0.50%. Pizza, pasta, viennoiserie."),
    ("Pizza & Pasta Type 00 Organic (120)", 13.5, "120",
     "Organic 00 for Neapolitan pizza & silky pasta. "
     "W=320, P/L=0.8, Ash 0.45-0.55%."),
    ("Finest Bakers White No. 1",       11.5, "No.1",
     "Premium white flour. Slightly softer than No.4. Good all-rounder."),
    ("Traditional White (704)",         12.0, "704",
     "Traditional (non-organic) white bread flour."),
    ("Stoneground White (119)",         11.5, "119",
     "Organic stoneground white. More flavour from stone milling."),
    ("Maris Wigeon Heritage White",     12.0, "MW",
     "Single-variety heritage wheat grown within 30 miles of the mill. "
     "Distinctive flavour."),
    ("Ciabatta Organic Flour",          12.5, "ciabatta",
     "Blended for high-hydration Italian-style breads."),

    # ── Wholemeal Flours ────────────────────────────────────────────────────
    ("100% Wholemeal Organic (205)",    14.0, "205",
     "Great all-round wholemeal. 12.9-15.2% protein, Ash 1.25-1.45%. "
     "Canadian & English organic wheat blend. Sourdoughs, yeasted loaves, rolls."),
    ("Stoneground Strongest Wholemeal (209)", 14.5, "209",
     "Maximum-strength wholemeal for powerful rise in artisan loaves."),
    ("Strong Canadian Wholemeal (214)", 14.5, "214",
     "Canadian hard wheat wholemeal blend. Maximum oven spring."),
    ("Extra Coarse Wholemeal Organic (216)", 13.0, "216",
     "Coarse-ground for rustic texture."),
    ("Stoneground Wholemeal Organic (706)", 13.5, "706",
     "Stoneground wholemeal — full flavour."),
    ("Biodynamic Stoneground Wholemeal (218)", 13.5, "218",
     "Biodynamic-certified wholemeal."),
    ("Self Raising Wholemeal Organic (217)", 10.5, "217",
     "Wholemeal with raising agent added."),
    ("Finely Ground Wholemeal Pastry (203)", 10.0, "203",
     "Finely milled wholemeal for pastry. Softer, lower protein."),

    # ── Brown, Malted & Seeded ──────────────────────────────────────────────
    ("3 Malts & Sunflower Brown (705)", 11.5, "705",
     "Brown flour with wheat, rye & barley malts plus sunflower seeds."),
    ("Light Malthouse (301)",           12.0, "301",
     "Lightly malted flour — malty sweetness for tin loaves & rolls."),
    ("Swiss Dark Flour (409)",          11.5, "409",
     "Dark Swiss-style flour. Rustic loaves."),
    ("Irish Soda Coarse Brown (406)",   10.5, "406",
     "Coarse brown flour blended for Irish soda bread."),
    ("Seeded White Organic (419)",      12.0, "419",
     "White flour with mixed seeds."),
    ("5 Seed Blend (401)",              12.0, "401",
     "Flour blend with 5-seed mix for seeded loaves."),

    # ── Spelt Flours ────────────────────────────────────────────────────────
    ("White Spelt Organic (408)",       11.0, "408",
     "Organic white spelt. 9.8-11.8% protein, Ash 0.58-0.63%. "
     "Nutty flavour — bread, pastry, cakes, sauces."),
    ("White Spelt (418)",               11.0, "418",
     "Non-organic white spelt."),
    ("Wholemeal Spelt Organic (407)",   12.5, "407",
     "Organic wholemeal spelt. Min 12.2% protein, Ash 1.4-1.5%. "
     "Soda bread, cookies, biscuits. Dense texture."),
    ("Wholemeal Spelt (417)",           12.5, "417",
     "Non-organic wholemeal spelt."),
    ("Fig, Spelt & Pumpkin Seed (420)", 10.5, "420",
     "Spelt flour blended with fig & pumpkin seed."),

    # ── Ancient & Heritage Grains ───────────────────────────────────────────
    ("Einkorn Wholemeal Organic (412)", 13.0, "412",
     "Ancient grain — the original wheat. Rich, nutty. High protein for an ancient grain."),
    ("Emmer Wholemeal Organic (414)",   13.0, "414",
     "Ancient grain, closely related to durum. Earthy flavour."),
    ("Khorasan Organic (413)",          12.5, "413",
     "Khorasan (Kamut®) — buttery flavour, high protein."),
    ("T80 UK Wheat Heritage",          12.0, "T80",
     "High-extraction (T80) flour from 100% UK organic heritage wheat. "
     "More flavour & minerals than white, lighter than wholemeal."),
    ("Heritage Solina White Organic",   11.0, "solina-white",
     "Heritage Italian Solina variety. White."),
    ("Heritage Solina Wholemeal Organic", 12.0, "solina-wholemeal",
     "Heritage Solina, wholemeal."),

    # ── Rye Flours ──────────────────────────────────────────────────────────
    ("Dark Rye Type 1350 Organic (603)",  8.5, "603",
     "Wholemeal dark rye. Min 8.5% protein, Ash 1.30-1.45%. "
     "Dense rye breads, pumpernickel. Dough handles differently — stickier."),
    ("Light Rye Type 997 Organic (601)",  8.0, "601",
     "Light rye — less ash than dark rye. Milder flavour, lighter crumb."),
    ("Chopped Rye for Pumpernickel (607)", 8.0, "607",
     "Chopped rye grains for authentic pumpernickel."),

    # ── Other Grains ────────────────────────────────────────────────────────
    ("Barley Flour Organic (405)",       9.0, "405",
     "Barley flour — low gluten. Add 10-20% for flavour."),
    ("Chapati Atta Organic (421)",      11.0, "421",
     "Fine wholemeal for chapatis & flatbreads."),
    ("Semolina Organic (507)",          12.5, "507",
     "Durum semolina. Pasta, pizza dusting, crusty breads."),
    ("Medium Oatmeal Organic (404)",    11.0, "404",
     "Oatmeal flour for biscuits & texture. Low gluten."),

    # ── Cake, Pastry & Soft Flours ──────────────────────────────────────────
    ("Soft Cake & Pastry Organic (117)",  9.5, "117",
     "Soft white flour. 8.8-11.6% protein, W=120, P/L=0.7. "
     "English organic soft wheat. Cakes, sponges, shortcrust pastry."),
    ("Self Raising Organic White (113)", 10.0, "113",
     "9.9-10.7% protein. English organic wheat + raising agents. "
     "Cakes, scones — work quickly once water is added."),
    ("French Type 45 White",            10.0, "T45",
     "Very white, soft French-style flour. Pastry, brioche, croissants."),

    # ── Gluten-Free Flours ──────────────────────────────────────────────────
    # (Protein listed for nutrition; none form gluten)
    ("GF All Purpose Plain White (810)",  5.0, "810",
     "GF blend for all-purpose baking. No gluten."),
    ("GF White Bread Mix (809)",          5.0, "809",
     "GF bread mix. Use GF-specific recipes."),
    ("GF Brown Teff (818)",              11.0, "818",
     "Gluten-free. Malty flavour. Injera, flatbreads."),
    ("GF White Teff (803)",              11.0, "803",
     "Gluten-free white teff."),
    ("GF Oat Flour (801)",               10.0, "801",
     "Gluten-free oat flour. Moisture-retentive."),
    ("GF Brown Rice Flour (816)",         7.0, "816",
     "Gluten-free. Slightly gritty — blend with starches."),
    ("GF White Rice Flour (802)",         6.0, "802",
     "GF white rice flour. Neutral flavour."),
    ("GF Buckwheat Flour (811)",         12.0, "811",
     "GF buckwheat — despite name, no wheat. Strong flavour."),
    ("GF Chestnut Flour (812)",           5.0, "812",
     "GF chestnut flour. Sweet, nutty."),
    ("GF Gram / Chickpea Flour (813)",   20.0, "813",
     "GF chickpea flour. High protein. Socca, flatbreads."),
    ("GF Maize Flour (805)",              7.0, "805",
     "GF maize/corn flour."),
    ("GF Millet Flour (814)",            10.0, "814",
     "GF millet flour. Mild, slightly sweet."),
    ("GF Quinoa Flour (815)",            13.0, "815",
     "GF quinoa flour. High protein, slightly bitter."),
    ("GF Sorghum Flour (817)",           10.0, "817",
     "GF sorghum flour. Mild, whole-grain-like."),

    # ── Malt & Brewing Adjuncts ─────────────────────────────────────────────
    ("Diastatic Malt Flour (307)",       10.0, "307",
     "Active malt flour — boosts enzyme activity. Use 0.5-2% of flour weight."),
    ("Malted Wheat Flakes (305)",        10.0, "305",
     "Malted wheat flakes for texture."),
    ("Cut Malted Rye Grains (306)",       8.0, "306",
     "Cut malted rye grains — soaker for texture."),

    # ── Generic fallbacks (no product number) ────────────────────────────────
    ("Generic: Bread Flour",             12.5, "-",
     "Strong white bread flour."),
    ("Generic: All-Purpose / AP",        10.5, "-",
     "Standard plain flour. 10-11% protein."),
    ("Generic: Whole Wheat / WW",        14.0, "-",
     "Standard wholemeal / whole wheat flour."),
    ("Generic: Rye Flour",               9.0, "-",
     "Generic rye flour."),
    ("Generic: Spelt Flour",             13.0, "-",
     "Generic spelt flour."),
    ("Generic: High-Gluten Flour",       14.5, "-",
     "Very strong flour for bagels, high-ratio breads."),
    ("Generic: Pastry Flour",            9.0, "-",
     "Soft/low-protein flour for pastry & biscuits."),
    ("Generic: Cake Flour",              8.0, "-",
     "Very soft flour for cakes."),
]

# Build lookup dicts: key → (display, protein, product_no, notes)
FLOUR_PROTEIN_MAP: Dict[str, float] = {}
FLOUR_LOOKUP: Dict[str, Tuple[str, float, str, str]] = {}
for _entry in SHIPTON_MILL_FLOURS:
    _label, _protein, _pno, _notes = _entry
    # Multiple keys for each flour — match by product number, by abbreviated name, etc.
    _keys = [
        _label.lower(),
        _label.lower().split(" (")[0],                    # "no. 4 organic white"
        _label.lower().split(" organic")[0].split(" gf")[0],  # strip organic/gf suffix
    ]
    # Also add product-number-only key
    if _pno != "-":
        _keys.append(_pno.lower())
    for _k in _keys:
        _k = _k.strip()
        if _k and _k not in FLOUR_PROTEIN_MAP:
            FLOUR_PROTEIN_MAP[_k] = _protein
            FLOUR_LOOKUP[_k] = (_label, _protein, _pno, _notes)

# Collapsed display labels for the UI dropdown (just the clean names)
FLOUR_TYPES = [_e[0] for _e in SHIPTON_MILL_FLOURS]


def find_flour(query: str) -> Tuple[str, float, str, str]:
    """
    Fuzzy-match a user's flour input against the catalogue.
    Returns (display_name, protein_pct, product_number, notes).
    Falls back to Generic: Bread Flour if nothing matches.
    """
    q = query.lower().strip()
    if not q:
        return FLOUR_LOOKUP.get("generic: bread flour",
               ("Generic: Bread Flour", 12.5, "-", "Fallback."))

    # Direct lookup
    if q in FLOUR_LOOKUP:
        return FLOUR_LOOKUP[q]

    # Try prefix match (e.g. "no. 4" matches "no. 4 organic white")
    for key, entry in FLOUR_LOOKUP.items():
        if key.startswith(q) or q in key:
            return entry

    # Try word-by-word scoring
    best_score, best_entry = 0, None
    q_words = set(q.split())
    for key, entry in FLOUR_LOOKUP.items():
        k_words = set(key.split())
        score = len(q_words & k_words)
        if score > best_score:
            best_score = score
            best_entry = entry

    if best_entry and best_score >= 1:
        return best_entry

    # Fallback
    return ("Generic: Bread Flour", 12.5, "-",
            f"Unknown flour '{query}' — using bread flour default.")

# ── Water hardness by country/region (mg/L CaCO₃ → classification) ───────────
WATER_HARDNESS_TABLE: Dict[str, Tuple[float, str, str]] = {
    "us-northeast":     (45,  "soft",            "Granite/glacial aquifers"),
    "us-southeast":     (90,  "moderately soft", "Coastal plain sediments"),
    "us-midwest":       (220, "hard",            "Limestone aquifers — very hard in IN/OH"),
    "us-southwest":     (200, "hard",            "Desert carbonates"),
    "us-west":          (80,  "moderately soft", "Mountain runoff — softer near coast"),
    "us-pacific":       (35,  "very soft",       "Rain-fed, low mineral content"),
    "ca-east":          (60,  "soft",            "Canadian Shield — granite"),
    "ca-west":          (80,  "moderately soft", "Mountain sources"),
    "ca-prairies":      (180, "moderately hard", "Sedimentary bedrock"),
    "gb-england-se":    (280, "very hard",       "Chalk downs — London & SE"),
    "gb-england-nw":    (120, "moderately soft", "Mixed geology"),
    "gb-scotland":      (30,  "very soft",       "Granite & peat — perfect for bread"),
    "gb-wales":         (60,  "soft",            "Upland catchments"),
    "de": (160, "moderately hard", "Mixed — harder in south (limestone)"),
    "fr": (180, "moderately hard", "Harder in the Paris basin"),
    "it": (200, "hard",            "Carbonate aquifers — harder in centre/south"),
    "es": (180, "moderately hard", "Regional variation high"),
    "nl": (130, "moderately soft", "Soft groundwater"),
    "be": (220, "hard",            "Limestone regions"),
    "ch": (180, "moderately hard", "Mountain & carbonate mix"),
    "at": (170, "moderately hard", "Alpine sources softer, Vienna basin harder"),
    "pl": (200, "hard",            "Sedimentary basin"),
    "cz": (160, "moderately hard", "Mixed geology"),
    "se": (50,  "soft",            "Granite bedrock"),
    "no": (30,  "very soft",       "Mountain granite"),
    "fi": (40,  "soft",            "Glacial shield"),
    "dk": (220, "hard",            "Chalk aquifers"),
    "pt": (150, "moderately hard", "Mixed — softer north, harder south"),
    "gr": (190, "moderately hard", "Limestone & karst"),
    "ie": (130, "moderately soft", "Limestone in centre, granite elsewhere"),
    "au-east": (80,  "moderately soft", "Coastal catchments"),
    "au-west": (130, "moderately hard", "Ancient shield — harder bore water"),
    "nz": (50,  "soft",            "Volcanic & rain-fed sources"),
    "jp": (60,  "soft",            "Volcanic geology"),
    "kr": (100, "moderately soft", "Mixed geology"),
    "cn": (140, "moderately hard", "Very regionally variable"),
    "in": (160, "moderately hard", "Harder in central peninsula"),
    "br": (60,  "soft",            "Tropical weathering, many soft sources"),
    "ar": (140, "moderately hard", "Pampas aquifer"),
    "cl": (160, "moderately hard", "Andean mineral sources"),
    "co": (90,  "moderately soft", "Mountain catchments"),
    "za": (100, "moderately soft", "Mixed geology"),
    "eg": (190, "moderately hard", "Nile — moderate to hard"),
    "ng": (80,  "moderately soft", "Tropical weathering"),
    "il": (180, "moderately hard", "Carbonate aquifers"),
    "tr": (170, "moderately hard", "Mixed — harder in central plateau"),
    "mx": (160, "moderately hard", "Carbonate regions"),
}

# ── Constants ─────────────────────────────────────────────────────────────────
BASE_FERMENTATION_TEMP = 26.0
BASE_FERMENTATION_HOURS = 4.0
MIN_FERMENTATION_HOURS = 2.0
ADD_TIME_PER_DEGREE_BELOW = 0.5
SUB_TIME_PER_DEGREE_ABOVE = 0.25
WATER_TEMP_MIN = 0.0
WATER_TEMP_MAX = 65.0

# ── Geolocation & weather ─────────────────────────────────────────────────────
def _http_get(url: str, timeout: int = 8) -> Optional[dict]:
    try:
        r = requests.get(url, timeout=timeout,
                         headers={"User-Agent": "SourDoughOptimizer/2.0"})
        return r.json() if r.status_code == 200 else None
    except Exception:
        return None

def detect_location() -> Optional[dict]:
    """HTTPS-only IP geolocation via ipapi.co (free, no API key required)."""
    data = _http_get("https://ipapi.co/json/")
    if data and "latitude" in data:
        return {"lat": data["latitude"], "lon": data["longitude"],
                "city": data.get("city", "Unknown"),
                "region": data.get("region", ""),
                "country": data.get("country_name", "Unknown"),
                "country_code": data.get("country_code", "").lower()}
    return None

def get_ambient_temp(lat: float, lon: float) -> Optional[float]:
    url = (f"https://api.open-meteo.com/v1/forecast"
           f"?latitude={lat}&longitude={lon}"
           f"&current=temperature_2m&timezone=auto")
    data = _http_get(url)
    return data["current"].get("temperature_2m") if data and "current" in data else None

def estimate_water_temp(lat: float, lon: float) -> Optional[float]:
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=22)
    url = (f"https://archive-api.open-meteo.com/v1/archive"
           f"?latitude={lat}&longitude={lon}"
           f"&start_date={start.isoformat()}&end_date={end.isoformat()}"
           f"&daily=temperature_2m_mean&timezone=UTC")
    data = _http_get(url, timeout=12)
    if not data or "daily" not in data:
        return None
    temps = [t for t in data["daily"].get("temperature_2m_mean", []) if t is not None]
    if not temps:
        return None
    weights = [math.exp(-0.1 * (len(temps) - 1 - i)) for i in range(len(temps))]
    return round(sum(t * w for t, w in zip(temps, weights)) / sum(weights), 1)

def fetch_hourly_forecast(lat: float, lon: float) -> Optional[list]:
    """
    Fetch 24-hour temperature forecast from Open-Meteo.
    Returns list of (datetime, temp_c) or None on failure.
    """
    url = (f"https://api.open-meteo.com/v1/forecast"
           f"?latitude={lat}&longitude={lon}"
           f"&hourly=temperature_2m&timezone=auto&forecast_days=2")
    data = _http_get(url, timeout=10)
    if not data or "hourly" not in data:
        return None
    times = data["hourly"]["time"]
    temps = data["hourly"]["temperature_2m"]
    result = []
    for t_str, temp in zip(times, temps):
        try:
            dt = datetime.fromisoformat(t_str)
            result.append((dt, temp))
        except ValueError:
            continue
    return result if result else None


def estimate_dynamic_fermentation(fdt: float, hourly_forecast: list,
                                  inoculation_pct: float = 20.0,
                                  hydration_pct: float = 70.0,
                                  start_hour: int = None) -> dict:
    """
    Model dough fermentation with changing ambient temperature,
    variable inoculation rate, and hydration level.

    The dough starts at FDT and drifts toward ambient with a thermal time
    constant τ ≈ 1.5 h.  Fermentation rate follows Q10 ≈ 2.5 (rate
    doubles every 10°C).  Higher inoculation/hydration = faster baseline.
    We integrate in 15-min steps until completion.

    Returns dict with:
      - total_hours: estimated completion time (float)
      - profile: list of (hour_label, ambient_c, dough_c, rate_multiplier, progress_pct)
      - peak_rate: max rate multiplier seen
      - avg_ambient: average ambient over the window
    """
    TAU = 1.5      # hours — thermal time constant
    Q10 = 2.5      # rate multiplier per 10°C
    T_BASE = 26.0  # baseline temp
    TARGET = 4.0   # baseline hours at rate 1.0 (20% inoc, 70% hyd, 26°C)
    DT = 0.25      # integration step (15 min)

    # Inoculation + hydration multipliers
    INOC_RATE = math.sqrt(inoculation_pct / 20.0)
    HYD_RATE = (hydration_pct / 70.0) ** 0.6
    BASE_RATE = INOC_RATE * HYD_RATE

    # Find starting index
    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    if start_hour is not None:
        now = now.replace(hour=start_hour)

    start_idx = 0
    for i, (t, _) in enumerate(hourly_forecast):
        if t >= now:
            start_idx = i
            break

    # Extend forecast linearly if it runs out
    forecast = list(hourly_forecast[start_idx:])
    if len(forecast) < 2:
        return None

    # Extend by repeating the last temp trend if too short
    last_temp = forecast[-1][1]
    last_time = forecast[-1][0]
    while len(forecast) < 200:  # plenty of headroom
        last_time = last_time + timedelta(hours=1)
        forecast.append((last_time, last_temp))

    dough_temp = fdt
    progress = 0.0
    steps = 0
    profile = []
    peak_rate = 0.0
    ambient_sum = 0.0
    ambient_count = 0
    last_logged_hour = -1

    for i, (t, amb) in enumerate(forecast):
        # Thermal drift: dough approaches ambient
        dough_temp += (amb - dough_temp) * (1 - math.exp(-DT / TAU))

        # Fermentation rate: baseline × temp × inoc × hydration
        rate = BASE_RATE * (Q10 ** ((dough_temp - T_BASE) / 10.0))
        peak_rate = max(peak_rate, rate)

        progress += rate * DT
        ambient_sum += amb
        ambient_count += 1
        steps += 1

        # Log hourly
        current_hour = int(progress / TARGET * 24)  # rough hour marker
        if t.hour != last_logged_hour or progress >= TARGET:
            pct = min(progress / TARGET * 100, 100)
            profile.append((
                t.strftime("%H:%M"),
                round(amb, 1),
                round(dough_temp, 1),
                round(rate, 2),
                round(pct, 0),
            ))
            last_logged_hour = t.hour

        if progress >= TARGET:
            break

    total_hours = steps * DT
    avg_ambient = round(ambient_sum / max(ambient_count, 1), 1)

    return {
        "total_hours": round(total_hours * 2) / 2,  # nearest 0.5 h
        "profile": profile[:25],  # keep it manageable
        "peak_rate": round(peak_rate, 1),
        "avg_ambient": avg_ambient,
    }


def lookup_water_hardness(country_code: str, region: str) -> dict:
    country = country_code.lower()
    region_map = {
        "us": {"northeast": "us-northeast", "new england": "us-northeast",
               "new york": "us-northeast", "pennsylvania": "us-northeast",
               "southeast": "us-southeast", "florida": "us-southeast",
               "georgia": "us-southeast", "carolina": "us-southeast",
               "midwest": "us-midwest", "ohio": "us-midwest", "indiana": "us-midwest",
               "illinois": "us-midwest", "michigan": "us-midwest",
               "southwest": "us-southwest", "texas": "us-southwest",
               "arizona": "us-southwest", "new mexico": "us-southwest",
               "west": "us-west", "colorado": "us-west", "utah": "us-west",
               "nevada": "us-west", "pacific": "us-pacific",
               "california": "us-pacific", "oregon": "us-pacific", "washington": "us-pacific"},
        "ca": {"ontario": "ca-east", "québec": "ca-east", "quebec": "ca-east",
               "new brunswick": "ca-east", "nova scotia": "ca-east",
               "british columbia": "ca-west", "alberta": "ca-prairies",
               "saskatchewan": "ca-prairies", "manitoba": "ca-prairies"},
        "gb": {"england-south": "gb-england-se", "london": "gb-england-se",
               "south east": "gb-england-se", "south west": "gb-england-se",
               "england-north": "gb-england-nw", "north west": "gb-england-nw",
               "yorkshire": "gb-england-nw", "midlands": "gb-england-se",
               "scotland": "gb-scotland", "wales": "gb-wales"},
        "au": {"queensland": "au-east", "new south wales": "au-east",
               "victoria": "au-east", "western australia": "au-west",
               "south australia": "au-west", "tasmania": "au-east"},
    }
    region_lower = region.lower() if region else ""
    if country in region_map:
        for keyword, key in region_map[country].items():
            if keyword in region_lower and key in WATER_HARDNESS_TABLE:
                mg_l, cls, note = WATER_HARDNESS_TABLE[key]
                return {"mg_l": mg_l, "classification": cls, "note": note, "key": key}
    if country in WATER_HARDNESS_TABLE:
        mg_l, cls, note = WATER_HARDNESS_TABLE[country]
        return {"mg_l": mg_l, "classification": cls, "note": note, "key": country}
    return {"mg_l": 120, "classification": "moderately soft",
            "note": "Unknown region — assuming moderate", "key": "fallback"}

def build_location_summary(loc: dict, ambient: Optional[float],
                           water_temp: Optional[float], hardness: dict) -> str:
    parts = [f"📍 {loc['city']}, {loc['country']}"]
    if ambient is not None:
        parts.append(f"🌡 Ambient {ambient}°C")
    if water_temp is not None:
        parts.append(f"💧 Tap ~{water_temp}°C")
    parts.append(f"🧪 Water {hardness['classification']} ({hardness['mg_l']} mg/L)")
    return "  │  ".join(parts)

def geocode_postcode(postcode: str, country_code: str = "") -> Optional[dict]:
    """
    Geocode a postcode/ZIP to coordinates using OpenStreetMap Nominatim.
    Returns dict with lat, lon, city, region, country, country_code, or None.
    """
    import urllib.parse
    query = postcode.strip()
    if country_code:
        query += f", {country_code}"
    url = (f"https://nominatim.openstreetmap.org/search"
           f"?q={urllib.parse.quote(query)}&format=json&limit=1")
    try:
        r = requests.get(url, timeout=8, headers={
            "User-Agent": "SourDoughOptimizer/2.0"})
        if r.status_code == 200:
            results = r.json()
            if results:
                r0 = results[0]
                # Extract city/region/country from address
                addr = r0.get("address", {})
                return {
                    "lat": float(r0["lat"]),
                    "lon": float(r0["lon"]),
                    "city": addr.get("city") or addr.get("town") or
                            addr.get("village") or addr.get("suburb") or "Unknown",
                    "region": addr.get("state") or addr.get("county") or "",
                    "country": addr.get("country", "Unknown"),
                    "country_code": addr.get("country_code", "").lower(),
                }
    except Exception:
        pass
    return None


def reverse_geocode(lat: float, lon: float) -> Optional[dict]:
    """
    Reverse-geocode coordinates to a precise location name using Nominatim.
    Returns dict with lat, lon, city, region, country, country_code, or None.
    This gives neighbourhood-level precision (e.g. 'Surbiton' vs 'Greater London').
    """
    url = (f"https://nominatim.openstreetmap.org/reverse"
           f"?lat={lat}&lon={lon}&format=json&zoom=18")
    try:
        r = requests.get(url, timeout=8, headers={
            "User-Agent": "SourDoughOptimizer/2.0"})
        if r.status_code == 200:
            data = r.json()
            addr = data.get("address", {})
            if addr:
                return {
                    "lat": lat,
                    "lon": lon,
                    "city": (addr.get("suburb") or addr.get("village") or
                             addr.get("town") or addr.get("city") or "Unknown"),
                    "region": addr.get("state") or addr.get("county") or "",
                    "country": addr.get("country", "Unknown"),
                    "country_code": addr.get("country_code", "").lower(),
                }
    except Exception:
        pass
    return None


def detect_all(postcode: str = "") -> dict:
    """
    Run all auto-detection. If postcode provided, geocode it for
    better accuracy. Returns dict with loc, ambient, water_temp,
    hardness, auto, loc_summary, hourly_forecast.
    """
    loc = None
    used_postcode = False

    # Try postcode geocoding first if provided
    if postcode.strip():
        loc = geocode_postcode(postcode)
        if loc:
            used_postcode = True

    # Fall back to IP geolocation
    if not loc:
        loc = detect_location()
        # IP geolocation sometimes returns vague city names like "Greater London".
        # When the city is a broad region or the coordinates are imprecise,
        # reverse-geocode through Nominatim for neighbourhood-level precision.
        if loc:
            city = loc.get("city", "")
            # Vague city names that suggest a broad area rather than a specific town
            vague_cities = {"greater london", "london", "greater manchester",
                           "manchester", "west midlands", "west yorkshire",
                           "south yorkshire", "merseyside", "tyne and wear",
                           "birmingham", "glasgow", "edinburgh", "cardiff",
                           "belfast", "bristol", "leeds", "sheffield",
                           "nottingham", "liverpool", "unknown"}
            if city.lower() in vague_cities:
                refined = reverse_geocode(loc["lat"], loc["lon"])
                if refined:
                    # Keep the refined suburb/village but retain the IP country/region
                    # if Nominatim returned something less useful
                    rcity = refined.get("city", "")
                    if rcity.lower() not in vague_cities and rcity != "unknown":
                        loc = refined
    if loc:
        ambient = get_ambient_temp(loc["lat"], loc["lon"])
        est_water_temp = estimate_water_temp(loc["lat"], loc["lon"])
        hardness = lookup_water_hardness(loc["country_code"], loc["region"])
    else:
        ambient = None
        est_water_temp = None
        hardness = {"mg_l": 120, "classification": "unknown",
                    "note": "Could not detect location", "key": "fallback"}
    auto = {
        "ambient_temp": ambient if ambient is not None else 22.0,
        "flour_temp": ambient if ambient is not None else 22.0,
        "water_temp": est_water_temp if est_water_temp is not None else 18.0,
        "starter_temp": ambient if ambient is not None else 22.0,
    }
    loc_summary = build_location_summary(
        loc or {"city": "Unknown", "country": "Unknown"}, ambient, est_water_temp, hardness)
    # Fetch hourly forecast for dynamic fermentation
    hourly_forecast = None
    if loc:
        hourly_forecast = fetch_hourly_forecast(loc["lat"], loc["lon"])
    return {"loc": loc, "ambient": ambient, "water_temp": est_water_temp,
            "hardness": hardness, "auto": auto, "loc_summary": loc_summary,
            "hourly_forecast": hourly_forecast}

# ── Core calculations ─────────────────────────────────────────────────────────
def calculate_fdt(flour_temp: float, water_temp: float,
                  ambient_temp: float, starter_temp: float) -> float:
    return (flour_temp + water_temp + ambient_temp + starter_temp) / 4.0

def calculate_ingredients(fresh_flour: float, hydration_pct: float,
                          starter_weight: float, salt_pct: float,
                          starter_hydration: float) -> Dict[str, float]:
    """
    Compute exact gram weights. The user enters the flour they physically
    scoop into the bowl. Hydration and salt percentages apply to the TRUE
    total flour (fresh flour + flour contributed by the starter).
    """
    # Split starter into its flour and water components
    starter_flour_pct = 100.0 / (100.0 + starter_hydration)
    starter_water_pct = starter_hydration / (100.0 + starter_hydration)
    starter_flour = starter_weight * starter_flour_pct
    starter_water = starter_weight * starter_water_pct

    # True total flour = what's in the bowl + what's in the starter
    total_flour = fresh_flour + starter_flour

    water_total = (hydration_pct / 100.0) * total_flour
    added_water = water_total - starter_water
    salt = (salt_pct / 100.0) * total_flour
    total_dough = fresh_flour + added_water + starter_weight + salt
    starter_pct_display = (starter_weight / total_flour) * 100.0

    return {
        "fresh_flour": round(fresh_flour, 1),
        "flour_from_starter": round(starter_flour, 1),
        "total_flour": round(total_flour, 1),
        "added_water": round(added_water, 1),
        "water_from_starter": round(starter_water, 1),
        "total_water": round(water_total, 1),
        "starter_total": round(starter_weight, 1),
        "salt": round(salt, 1),
        "total_dough_weight": round(total_dough, 1),
        "hydration_pct": hydration_pct,
        "starter_pct": round(starter_pct_display, 1),
    }

def estimate_fermentation(fdt: float, inoculation_pct: float = 20.0,
                          hydration_pct: float = 70.0) -> Tuple[float, str]:
    """
    Baseline: 4 h at 26°C, 20% inoculation, 70% hydration.
    Higher inoculation → faster. Higher hydration → faster.
    Temperature adjustment is layered on top.
    """
    # Inoculation factor: more starter = faster (time ∝ 1/√(inoc%))
    inoc_rate = math.sqrt(inoculation_pct / 20.0)
    # Hydration factor: wetter dough = faster (rate ∝ (hyd% / 70)^0.6)
    hyd_rate = (hydration_pct / 70.0) ** 0.6
    base_hours = BASE_FERMENTATION_HOURS / (inoc_rate * hyd_rate)

    delta = fdt - BASE_FERMENTATION_TEMP
    if delta < 0:
        hours = base_hours + abs(delta) * ADD_TIME_PER_DEGREE_BELOW
    else:
        hours = base_hours - delta * SUB_TIME_PER_DEGREE_ABOVE
    hours = max(hours, MIN_FERMENTATION_HOURS / max(inoc_rate, 0.5))
    hours_rounded = round(hours * 2) / 2

    inoc_note = ""
    if inoculation_pct > 30:
        inoc_note = f" {inoculation_pct:.0f}% inoculation speeds things up."
    elif inoculation_pct < 12:
        inoc_note = f" {inoculation_pct:.0f}% inoculation slows things down."

    if delta < -3:
        note = (f"Dough is {abs(delta):.1f}°C below baseline — "
                f"significantly extending fermentation." + inoc_note)
    elif delta < 0:
        note = (f"Dough is {abs(delta):.1f}°C below baseline — "
                f"slightly extending fermentation." + inoc_note)
    elif delta > 3:
        note = (f"Dough is {delta:.1f}°C above baseline — "
                f"significantly shortening fermentation. Watch closely!" + inoc_note)
    elif delta > 0:
        note = (f"Dough is {delta:.1f}°C above baseline — "
                f"slightly shortening fermentation." + inoc_note)
    else:
        note = "At baseline temperature." + inoc_note
    return hours_rounded, note

def ferment_advice(fdt: float, inoculation_pct: float = 20.0,
                   hydration_pct: float = 70.0,
                   dynamic_hours: Optional[float] = None) -> List[str]:
    """
    Holistic guidance considering FDT, inoculation, hydration,
    and the dynamic (ambient-aware) estimate if available.
    """
    advice = []
    effective_hours = dynamic_hours if dynamic_hours else None

    # ── Speed assessment — the number that matters ─────────────────────
    if effective_hours is not None:
        if effective_hours <= 3:
            advice.append(f"⚡ FAST ferment ahead — ~{effective_hours:.1f}h to completion.")
            advice.append("   → Don't walk away! Check at 2h and every 30 min after.")
        elif effective_hours <= 5:
            advice.append(f"🏃 Steady-quick ferment — ~{effective_hours:.1f}h to completion.")
            advice.append("   → Check at the 3h mark, then every 45 min.")
        elif effective_hours <= 7:
            advice.append(f"🚶 Steady ferment — ~{effective_hours:.1f}h to completion.")
            advice.append("   → Check around 4-5h and go by look and feel.")
        else:
            advice.append(f"🐢 Long, slow ferment — ~{effective_hours:.1f}h to completion.")
            advice.append("   → Great for flavour. Check at 6h, then hourly.")

    # ── What's driving the speed? ──────────────────────────────────────
    drivers = []

    if inoculation_pct >= 40:
        drivers.append(f"high inoculation ({inoculation_pct:.0f}% — you used a LOT of starter)")
    elif inoculation_pct >= 25:
        drivers.append(f"elevated inoculation ({inoculation_pct:.0f}%)")
    elif inoculation_pct <= 10:
        drivers.append(f"low inoculation ({inoculation_pct:.0f}% — lean starter, longer ferment)")

    if hydration_pct >= 80:
        drivers.append(f"high hydration ({hydration_pct:.0f}% — wet dough moves faster)")
    elif hydration_pct <= 60:
        drivers.append(f"low hydration ({hydration_pct:.0f}% — stiff dough moves slower)")

    if fdt > 27:
        drivers.append(f"warm dough ({fdt:.1f}°C)")
    elif fdt < 20:
        drivers.append(f"cold dough ({fdt:.1f}°C)")

    if drivers:
        advice.append("   ⚙  What's driving this: " + "; ".join(drivers) + ".")

    # ── Practical tip ──────────────────────────────────────────────────
    if inoculation_pct >= 40 and effective_hours and effective_hours <= 4:
        advice.append("   💡 With this much starter, consider reducing to 20-30% next time "
                      "for more flavour development and a more manageable schedule.")
    elif inoculation_pct <= 10 and effective_hours and effective_hours >= 8:
        advice.append("   💡 With so little starter, consider upping to 20% if you want "
                      "a faster turnaround.")
    if fdt < 21 and (inoculation_pct < 30):
        advice.append("   💡 Your dough starts cool but will warm with the room. "
                      "The dynamic estimate above accounts for this.")

    return advice

def water_hardness_advice(hardness: dict) -> List[str]:
    tips = []
    mg_l = hardness["mg_l"]
    cls = hardness["classification"]
    if mg_l < 60:
        tips.append(f"🧪 Your water is {cls} ({mg_l} mg/L CaCO₃).")
        tips.append("   → Soft water produces extensible, slack dough — good for "
                     "high-hydration breads.")
        tips.append("   → May lack minerals for yeast health. If your starter is "
                     "sluggish, try adding a pinch (0.02%) of MgSO₄ (Epsom salt).")
    elif mg_l < 120:
        tips.append(f"🧪 Your water is {cls} ({mg_l} mg/L CaCO₃).")
        tips.append("   → Ideal range for most sourdough — good gluten development "
                     "and yeast activity.")
    elif mg_l < 200:
        tips.append(f"🧪 Your water is {cls} ({mg_l} mg/L CaCO₃).")
        tips.append("   → Slightly hardening — tightens gluten. Good for lower "
                     "hydration doughs. May slightly slow fermentation.")
    else:
        tips.append(f"🧪 Your water is {cls} ({mg_l} mg/L CaCO₃).")
        tips.append("   → Hard water tightens gluten and buffers acid production. "
                     "Expect a slightly slower, tangier ferment.")
        tips.append("   → If dough feels too tight, increase hydration by 2–3%.")
    tips.append(f"   → Source geology: {hardness['note']}.")
    return tips

def save_recipe(flour_weight: float, flour_type: str, protein: float,
                hydration: float, starter_weight: float, salt_pct: float,
                starter_hydration: float, ambient_temp: float,
                flour_temp: float, water_temp: float, starter_temp: float,
                fdt: float, ingredients: dict,
                fermentation_hours: float, hardness: dict,
                loc_summary: str) -> str:
    """Append recipe to recipes.txt. Returns success message."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        "=" * 65, f"  Sourdough Recipe — {timestamp}", "=" * 65, "",
        f"  {loc_summary}", "",
        "  📋 Inputs",
        f"    Flour:             {flour_weight:.0f} g ({flour_type}, {protein:.1f}% protein)",
        f"    Hydration:          {hydration:.0f}%",
        f"    Starter:            {starter_weight:.0f} g (hydration: {starter_hydration:.0f}%)",
        f"    Salt:               {salt_pct:.1f}%",
        f"    Ambient Temp:       {ambient_temp:.1f} °C",
        f"    Flour Temp:         {flour_temp:.1f} °C",
        f"    Water Temp:         {water_temp:.1f} °C",
        f"    Starter Temp:       {starter_temp:.1f} °C",
        f"    Water Hardness:     {hardness['classification']} ({hardness['mg_l']} mg/L)",
        "", "  🌡  Temperatures",
        f"    Final Dough (FDT):  {fdt:.1f} °C",
        "", "  ⚖️  Ingredients",
        f"    Flour:              {ingredients['fresh_flour']:.1f} g",
        f"    Water:              {ingredients['added_water']:.1f} g",
        f"    Starter:            {ingredients['starter_total']:.1f} g",
        f"    Salt:               {ingredients['salt']:.1f} g",
        f"    Total weight:       {ingredients['total_dough_weight']:.1f} g",
        "", "  ⏱️  Fermentation",
        f"    Bulk ferment:       ~{fermentation_hours:.1f} hours", "",
    ]
    try:
        with open("recipes.txt", "a") as f:
            f.write("\n".join(lines) + "\n")
        return "✓ Recipe saved to recipes.txt"
    except OSError as e:
        return f"⚠ Could not save: {e}"


# ═══════════════════════════════════════════════════════════════════════════════
#  GUI  (Tkinter — zero extra deps)
# ═══════════════════════════════════════════════════════════════════════════════

def run_gui() -> None:
    """Launch the Tkinter GUI."""
    try:
        import tkinter as tk
        from tkinter import ttk, messagebox
    except ImportError:
        print("❌ Tkinter is not available on this system.")
        print("   Install it with: sudo apt install python3-tk  (Debian/Ubuntu)")
        print("   or use the CLI mode: python3 optimizer.py")
        sys.exit(1)

    # ── Shared state ──────────────────────────────────────────────────────
    detection = {"done": False, "result": None}

    def run_detection():
        """Run auto-detection in background, then update UI."""
        result = detect_all()
        detection["result"] = result
        detection["done"] = True
        root.after(0, on_detection_complete)

    def on_detection_complete():
        """Populate temperature fields with auto-detected values."""
        r = detection["result"]
        if r is None:
            return
        auto = r["auto"]
        ambient_var.set(str(auto["ambient_temp"]))
        flour_temp_var.set(str(auto["flour_temp"]))
        water_var.set(str(auto["water_temp"]))
        starter_var.set(str(auto["starter_temp"]))

        loc_text = r["loc_summary"]
        if r["loc"]:
            status_label.config(
                text=f"📍 {r['loc']['city']}, {r['loc']['region']}, {r['loc']['country']}  │  "
                     f"🌡 {r['ambient']}°C  │  💧 Tap ~{r['water_temp']}°C  │  "
                     f"🧪 {r['hardness']['classification']} ({r['hardness']['mg_l']} mg/L)",
                foreground="#2e7d32")
        else:
            status_label.config(text="⚠ Could not detect location — enter temps manually",
                                foreground="#e65100")
        detection["loc_summary"] = loc_text
        detection["hardness"] = r["hardness"]
        detection["hourly_forecast"] = r.get("hourly_forecast")

    def do_calculate():
        """Read all fields, compute, and display results."""
        try:
            fw = float(flour_weight_var.get())
            hyd = float(hydration_var.get())
            sw = float(starter_weight_var.get())
            slt = float(salt_var.get())
            sh = float(starter_hyd_var.get())
            amb = float(ambient_var.get())
            flr = float(flour_temp_var.get())
            wat = float(water_var.get())
            sta = float(starter_var.get())
        except ValueError:
            messagebox.showerror("Invalid input", "All fields must be numbers.")
            return

        ft = flour_type_var.get()
        flour_type, protein, flour_pno, flour_notes = find_flour(ft)

        # Get hardness from detection or fallback
        hw = detection.get("hardness") or {
            "mg_l": 120, "classification": "unknown",
            "note": "Not available", "key": "fallback"}
        loc_s = detection.get("loc_summary") or "📍 Unknown"

        fdt = calculate_fdt(flr, wat, amb, sta)
        ingredients = calculate_ingredients(fw, hyd, sw, slt, sh)
        inoc_pct = ingredients['starter_pct']
        ferm_h, ferm_note = estimate_fermentation(fdt, inoc_pct, hyd)

        warnings_list = []
        if wat <= WATER_TEMP_MIN:
            warnings_list.append(f"Water is near freezing ({wat:.1f}°C). Dough will be very cold.")
        if wat >= WATER_TEMP_MAX:
            warnings_list.append(f"Water is very hot ({wat:.1f}°C). Risk of damaging starter.")

        # Dynamic estimate (before advice so it can inform guidance)
        dyn = None
        hourly_fc = detection.get("hourly_forecast")
        if hourly_fc:
            dyn = estimate_dynamic_fermentation(fdt, hourly_fc, inoc_pct, hyd)

        fa = ferment_advice(fdt, inoc_pct, hyd,
                            dyn["total_hours"] if dyn else None)
        ha = water_hardness_advice(hw)

        # Store for save
        detection["last_calc"] = {
            "flour_weight": fw, "flour_type": flour_type, "protein": protein,
            "hydration": hyd, "starter_weight": sw, "salt_pct": slt,
            "starter_hydration": sh, "ambient_temp": amb, "flour_temp": flr,
            "water_temp": wat, "starter_temp": sta, "fdt": fdt,
            "ingredients": ingredients, "fermentation_hours": ferm_h,
            "hardness": hw, "loc_summary": loc_s,
        }

        # ── Build results text ────────────────────────────────────────────
        if fdt < 21:
            icon, vibe = "❄", "cold — slow ferment ahead"
        elif fdt < 24:
            icon, vibe = "🌤", "cool — good for flavour"
        elif fdt <= 28:
            icon, vibe = "✅", "ideal — goldilocks zone"
        elif fdt <= 30:
            icon, vibe = "🌡", "warm — watch closely"
        else:
            icon, vibe = "🔥", "hot — check early!"

        lines = [
            "━" * 50,
            f"  🌡  FDT: {fdt:.1f}°C  {icon}  ({vibe})",
        ]

        # ── Fermentation (ambient-aware) ──────────────────────────────────
        if dyn:
            lines.append(f"  ⏱️  Bulk fermentation: ~{dyn['total_hours']:.1f} h")
            lines.append(f"       Avg ambient: {dyn['avg_ambient']}°C  │  Peak rate: {dyn['peak_rate']}× baseline")
            lines.append("")
            lines.append("       Hour │ Amb  │Dough │Rate│ Progress")
            lines.append("       ─────┼──────┼──────┼────┼─────────")
            for (hh, amb, dough, rate, pct) in dyn["profile"][:12]:
                bar = "█" * int(pct / 10) + "░" * (10 - int(pct / 10))
                lines.append(f"       {hh} │ {amb:4.1f} │ {dough:4.1f} │{rate:4.1f}│ {bar} {pct:.0f}%")
            lines.append("")
        else:
            # No forecast available — fall back to static
            lines.append(f"  ⏱️  Bulk fermentation: ~{ferm_h:.1f} h")
            lines.append(f"       {ferm_note}")
            lines.append("       ⚡ No hourly forecast — using constant-temp estimate.")
            lines.append("")

        lines.extend([
            "  ⚖️  Ingredients (put this in the bowl):",
            f"       Flour:            {ingredients['fresh_flour']:.1f} g",
            f"       Water:            {ingredients['added_water']:.1f} g",
            f"       Starter:          {ingredients['starter_total']:.1f} g",
            f"       Salt:             {ingredients['salt']:.1f} g",
            f"       ───────────────────────────",
            f"       Total weight:     {ingredients['total_dough_weight']:.1f} g",
            f"       Hydration:        {ingredients['hydration_pct']:.0f}% "
            f"(based on {ingredients['total_flour']:.0f}g total flour incl. starter)",
            "",
        ])
        if warnings_list:
            lines.append("  ⚠  Warnings:")
            for w in warnings_list:
                lines.append(f"       {w}")
            lines.append("")
        if fa:
            lines.append("  🛠  Fermentation advice:")
            for a in fa:
                lines.append(f"       {a}")
            lines.append("")
        if ha:
            lines.append("  🧪  Water hardness:")
            for h in ha:
                lines.append(f"       {h}")
            lines.append("")

        # Update the results text widget
        results_text.config(state="normal")
        results_text.delete("1.0", tk.END)
        results_text.insert("1.0", "\n".join(lines))
        results_text.config(state="disabled")

        save_btn.config(state="normal")

    def do_save():
        """Save the last calculated recipe."""
        lc = detection.get("last_calc")
        if not lc:
            return
        msg = save_recipe(**lc)
        if "✓" in msg:
            status_label.config(text=msg, foreground="#2e7d32")
        else:
            status_label.config(text=msg, foreground="#c62828")

    # ── Build window ──────────────────────────────────────────────────────
    BG = "#FFF5ED"       # warm cream
    CARD = "#FFFFFF"     # white card
    ACCENT = "#C1784B"   # warm terracotta
    TEXT = "#3E2723"     # dark espresso
    MUTED = "#998B82"    # warm grey
    GREEN = "#6B8E4D"    # olive
    RED = "#C44536"      # muted red

    root = tk.Tk()
    root.title("Sourdough Optimizer")
    root.geometry("460x780")
    root.minsize(380, 600)
    root.configure(bg=BG)

    # ── Helpers ──────────────────────────────────────────────────────────
    def _entry(parent, var, width=10, **kw):
        return tk.Entry(parent, textvariable=var, width=width,
                        font=("Helvetica", 11), fg=TEXT, bg=CARD,
                        relief="solid", bd=1, insertbackground=TEXT, **kw)

    def _button(parent, text, command, accent=False, state="normal"):
        bg = ACCENT if accent else "#E8DDD4"
        fg = "white" if accent else TEXT
        btn = tk.Button(parent, text=text, command=command,
                        font=("Helvetica", 12 if accent else 10, "bold"),
                        fg=fg, bg=bg, activebackground="#A86435" if accent else "#D9CEC3",
                        activeforeground="white" if accent else TEXT,
                        relief="flat", bd=0, padx=16, pady=8 if accent else 6,
                        state=state, cursor="hand2")
        if state == "disabled":
            btn.config(fg="#C9C0B8", bg="#F0EBE5")
        return btn

    def _card(parent, title):
        outer = tk.Frame(parent, bg=CARD, bd=0, highlightthickness=1,
                         highlightbackground="#E8DDD4", highlightcolor="#E8DDD4")
        tk.Label(outer, text=title.upper(), font=("Helvetica", 9, "bold"),
                 fg=MUTED, bg=CARD).pack(anchor="w", padx=14, pady=(12, 0))
        inner = tk.Frame(outer, bg=CARD)
        inner.pack(fill="x", padx=14, pady=(4, 12))
        return outer, inner

    def _row(parent, label, var, unit="", width=10, auto=False):
        r = tk.Frame(parent, bg=CARD)
        r.pack(fill="x", pady=3)
        tk.Label(r, text=label, width=14, anchor="w", font=("Helvetica", 10),
                 fg=TEXT, bg=CARD).pack(side="left")
        e = _entry(r, var, width=width)
        e.pack(side="left", padx=(4, 2))
        if unit:
            tk.Label(r, text=unit, font=("Helvetica", 9), fg=MUTED,
                     bg=CARD).pack(side="left")
        if auto:
            tk.Label(r, text="auto", font=("Helvetica", 8, "italic"),
                     fg=GREEN, bg=CARD).pack(side="left", padx=6)
        return e

    # ── Title ────────────────────────────────────────────────────────────
    tk.Label(root, text="🍞  Sourdough Optimizer", font=("Helvetica", 17, "bold"),
             fg=TEXT, bg=BG).pack(pady=(14, 2))

    # ── Status + postcode ────────────────────────────────────────────────
    status_label = tk.Label(root, text="Detecting your location… enter postcode for precision",
                            font=("Helvetica", 9), fg=MUTED, bg=BG)
    status_label.pack(pady=(0, 6))

    pc_frame = tk.Frame(root, bg=BG)
    pc_frame.pack(pady=(0, 8))
    postcode_var = tk.StringVar()
    _entry(pc_frame, postcode_var, width=14).pack(side="left")
    tk.Label(pc_frame, text=" postcode ", font=("Helvetica", 9),
             fg=MUTED, bg=BG).pack(side="left")

    def refine_location():
        pc = postcode_var.get().strip()
        if not pc:
            return
        refine_btn.config(text="…", state="disabled")
        def _run():
            result = detect_all(pc)
            root.after(0, lambda: _apply_refine(result))
        threading.Thread(target=_run, daemon=True).start()

    def _apply_refine(r):
        if r.get("loc"):
            detection["result"] = r
            detection["done"] = True
            on_detection_complete()
            status_label.config(
                text=f"📍 {r['loc']['city']}, {r['loc']['region']} — via postcode",
                fg=GREEN)
        else:
            status_label.config(text="⚠  Couldn't geocode", fg=RED)
        refine_btn.config(text="↺", state="normal")

    refine_btn = _button(pc_frame, " ↺ ", refine_location)
    refine_btn.pack(side="left", padx=3)
    tk.Label(pc_frame, text="for precision", font=("Helvetica", 8, "italic"),
             fg=GREEN, bg=BG).pack(side="left", padx=4)

    # ── Main content frame (no canvas — direct packing) ──────────────────
    content = tk.Frame(root, bg=BG)
    content.pack(fill="both", expand=True, padx=10, pady=(0, 8))

    # ── Flour & Ingredients card ─────────────────────────────────────────
    _, ing_inner = _card(content, "Flour & Ingredients")
    flour_weight_var = tk.StringVar(value="500")
    _row(ing_inner, "Flour", flour_weight_var, "g")
    flour_type_var = tk.StringVar(value="No. 4 Organic White (105)")
    ft_row = tk.Frame(ing_inner, bg=CARD)
    ft_row.pack(fill="x", pady=3)
    tk.Label(ft_row, text="Type", width=14, anchor="w", font=("Helvetica", 10),
             fg=TEXT, bg=CARD).pack(side="left")
    ft_combo = ttk.Combobox(ft_row, textvariable=flour_type_var,
                            values=FLOUR_TYPES, state="readonly", width=28)
    ft_combo.pack(side="left", padx=4)

    hydration_var = tk.StringVar(value="75")
    _row(ing_inner, "Hydration", hydration_var, "%")
    starter_weight_var = tk.StringVar(value="100")
    _row(ing_inner, "Starter", starter_weight_var, "g")
    salt_var = tk.StringVar(value="2.0")
    _row(ing_inner, "Salt", salt_var, "%")
    starter_hyd_var = tk.StringVar(value="100")
    _row(ing_inner, "Starter hyd.", starter_hyd_var, "%")

    # ── Temperatures card ────────────────────────────────────────────────
    _, temp_inner = _card(content, "Temperatures")
    ambient_var = tk.StringVar(value="22")
    _row(temp_inner, "Ambient", ambient_var, "°C", auto=True)
    flour_temp_var = tk.StringVar(value="22")
    _row(temp_inner, "Flour", flour_temp_var, "°C")
    water_var = tk.StringVar(value="18")
    _row(temp_inner, "Water", water_var, "°C", auto=True)
    starter_var = tk.StringVar(value="22")
    _row(temp_inner, "Starter", starter_var, "°C")

    # ── Calculate button ─────────────────────────────────────────────────
    btn_outer = tk.Frame(content, bg=BG)
    btn_outer.pack(fill="x", padx=8, pady=(10, 4))
    calc_btn = _button(btn_outer, "Calculate", do_calculate, accent=True)
    calc_btn.pack(fill="x")
    save_btn = _button(btn_outer, "Save Recipe to recipes.txt", do_save,
                       state="disabled")
    save_btn.pack(fill="x", pady=(6, 0))

    # ── Results card ─────────────────────────────────────────────────────
    _, res_inner = _card(content, "Results")
    results_text = tk.Text(res_inner, font=("Courier", 7), bg="#FFFCF7",
                           fg=TEXT, wrap="word", relief="flat", bd=0,
                           state="disabled", height=28, padx=6, pady=6)
    results_text.pack(fill="both", expand=True)

    results_text.config(state="normal")
    results_text.insert("1.0",
                        "Auto-detecting your location and conditions…\n\n"
                        "Then click Calculate to see your recipe.\n"
                        "Temperatures are pre-filled — override any of them.")
    results_text.config(state="disabled")

    # ── Start detection ──────────────────────────────────────────────────
    threading.Thread(target=run_detection, daemon=True).start()

    root.bind("<Return>", lambda e: do_calculate())
    root.bind("<Control-s>", lambda e: do_save())

    root.mainloop()


# ═══════════════════════════════════════════════════════════════════════════════
#  CLI  (rich)
# ═══════════════════════════════════════════════════════════════════════════════

def run_cli() -> None:
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.prompt import Prompt, Confirm
    from rich.text import Text
    from rich import box

    console = Console()

    def warn(text: str) -> None:
        console.print(f"[bold yellow]⚠  {text}[/bold yellow]")
    def success(text: str) -> None:
        console.print(f"[bold green]✓  {text}[/bold green]")
    def info(text: str) -> None:
        console.print(f"[bold cyan]ℹ  {text}[/bold cyan]")

    def get_float_input(prompt: str, default: Optional[float] = None,
                        min_val: Optional[float] = None,
                        max_val: Optional[float] = None) -> float:
        while True:
            try:
                raw = Prompt.ask(prompt, default=str(default) if default is not None else None)
                val = float(raw)
                if min_val is not None and val < min_val:
                    console.print(f"[red]Must be ≥ {min_val}.[/red]"); continue
                if max_val is not None and val > max_val:
                    console.print(f"[red]Must be ≤ {max_val}.[/red]"); continue
                return val
            except ValueError:
                console.print("[red]Invalid number.[/red]")

    # Header
    console.print()
    console.print(Panel(Text("🍞  Sourdough Bread Process Optimizer  🍞",
                  style="bold yellow"), box=box.DOUBLE_EDGE, border_style="bright_yellow"))
    console.print()

    # Auto-detect
    console.print("[dim]Detecting your location and local conditions…[/dim]")
    console.print()
    det = detect_all()
    loc = det["loc"]
    ambient = det["ambient"]
    est_water_temp = det["water_temp"]
    hardness = det["hardness"]
    auto = det["auto"]
    loc_summary = det["loc_summary"]
    hourly_forecast = det.get("hourly_forecast")

    if not loc:
        warn("Could not auto-detect location (no internet?). Using defaults.")
    else:
        success(f"Detected: {loc['city']}, {loc['region']}, {loc['country']}")
        if ambient is not None:
            info(f"Current ambient temp: {ambient}°C")
        if est_water_temp is not None:
            info(f"Estimated tap-water temp: {est_water_temp}°C (21-day ground-temp avg)")
        info(f"Water hardness: {hardness['classification']} "
             f"({hardness['mg_l']} mg/L CaCO₃) — {hardness['note']}")

    # Ask for postcode to refine — IP geolocation is approximate
    console.print()
    if loc:
        postcode = Prompt.ask(
            f"📍 Detected [bold]{loc['city']}, {loc['region']}[/bold] — "
            f"enter your [bold cyan]postcode[/bold cyan] for precise local conditions "
            f"(or press Enter to use what was detected)",
            default="")
    else:
        postcode = Prompt.ask(
            "Enter your [bold cyan]postcode/ZIP[/bold cyan] for accurate local conditions",
            default="")
    if postcode.strip():
        console.print("[dim]Geocoding postcode and refining…[/dim]")
        det2 = detect_all(postcode)
        if det2.get("loc"):
            det = det2
            loc = det["loc"]
            ambient = det["ambient"]
            est_water_temp = det["water_temp"]
            hardness = det["hardness"]
            auto = det["auto"]
            loc_summary = det["loc_summary"]
            hourly_forecast = det.get("hourly_forecast")
            success(f"Refined: {loc['city']}, {loc['region']}, {loc['country']}")
            if ambient is not None:
                info(f"Updated ambient: {ambient}°C")
            if est_water_temp is not None:
                info(f"Updated tap-water: {est_water_temp}°C")
            info(f"Updated hardness: {hardness['classification']} "
                 f"({hardness['mg_l']} mg/L)")
        else:
            warn("Couldn't geocode that postcode — keeping IP location.")
    console.print()

    # Inputs
    try:
        flour_weight = get_float_input("Flour weight (g)", default=500.0,
                                       min_val=1.0, max_val=50000.0)
        flour_query = Prompt.ask(
            "Flour (type any part of the name to search)",
            default="No. 4 Organic White (105)")
        flour_type, protein, flour_pno, flour_notes = find_flour(flour_query)
        info(f"Matched: {flour_type} ({protein:.1f}% protein)")
        if "Unknown" in flour_notes:
            warn(flour_notes)
        hydration = get_float_input("Hydration (%)", default=75.0,
                                    min_val=40.0, max_val=120.0)
        starter_weight = flour_weight * 0.20
        starter_weight = get_float_input("Starter weight (g)",
                                         default=starter_weight,
                                         min_val=1.0, max_val=10000.0)
        salt_pct = get_float_input("Salt (%)", default=2.0, min_val=0.0, max_val=10.0)
        starter_hydration = get_float_input("Starter hydration (%)",
                                            default=100.0, min_val=50.0, max_val=500.0)
        console.print()
        info("Temperatures — hit Enter to accept auto-detected values:")
        ambient_temp = get_float_input("Ambient / room temperature (°C)",
                                       default=auto["ambient_temp"],
                                       min_val=-10.0, max_val=50.0)
        flour_temp = get_float_input("Flour temperature (°C)",
                                     default=auto["flour_temp"],
                                     min_val=-10.0, max_val=50.0)
        water_temp = get_float_input("Water temperature (°C)",
                                     default=auto["water_temp"],
                                     min_val=0.0, max_val=70.0)
        starter_temp = get_float_input("Starter temperature (°C)",
                                       default=auto["starter_temp"],
                                       min_val=-10.0, max_val=50.0)
    except KeyboardInterrupt:
        console.print("\n[yellow]Cancelled.[/yellow]")
        sys.exit(0)

    # Calculate
    fdt = calculate_fdt(flour_temp, water_temp, ambient_temp, starter_temp)
    ingredients = calculate_ingredients(flour_weight, hydration, starter_weight,
                                        salt_pct, starter_hydration)
    inoc_pct = ingredients['starter_pct']
    ferm_h, ferm_note = estimate_fermentation(fdt, inoc_pct, hydration)

    warnings_list = []
    if water_temp <= WATER_TEMP_MIN:
        warnings_list.append(f"Water near freezing ({water_temp:.1f}°C). Slow ferment.")
    if water_temp >= WATER_TEMP_MAX:
        warnings_list.append(f"Water very hot ({water_temp:.1f}°C). Risk to starter.")

    # Dynamic estimate (before advice so it can inform guidance)
    dyn = None
    if hourly_forecast:
        dyn = estimate_dynamic_fermentation(fdt, hourly_forecast, inoc_pct, hydration)

    fa = ferment_advice(fdt, inoc_pct, hydration,
                        dyn["total_hours"] if dyn else None)
    ha = water_hardness_advice(hardness)

    # Display inputs
    console.print()
    console.print(Panel(loc_summary, border_style="green", box=box.ROUNDED))
    console.print()

    inp_table = Table(title="📋  Input Variables", box=box.ROUNDED,
                      border_style="blue", title_style="bold blue")
    inp_table.add_column("Variable", style="cyan", no_wrap=True)
    inp_table.add_column("Value", style="white", justify="right")
    inp_table.add_row("Flour weight", f"{flour_weight:.0f} g")
    inp_table.add_row("Flour type", f"{flour_type} ({protein:.1f}% protein)")
    inp_table.add_row("Hydration", f"{hydration:.0f}%")
    inp_table.add_row("Starter weight", f"{starter_weight:.0f} g")
    inp_table.add_row("Salt %", f"{salt_pct:.1f}%")
    inp_table.add_row("Starter hydration", f"{starter_hydration:.0f}%")
    inp_table.add_section()
    inp_table.add_row("[bold yellow]Ambient temp[/bold yellow]", f"{ambient_temp:.1f} °C")
    inp_table.add_row("[bold yellow]Flour temp[/bold yellow]", f"{flour_temp:.1f} °C")
    inp_table.add_row("[bold yellow]Water temp[/bold yellow]", f"{water_temp:.1f} °C")
    inp_table.add_row("[bold yellow]Starter temp[/bold yellow]", f"{starter_temp:.1f} °C")
    inp_table.add_section()
    inp_table.add_row("Water hardness", f"{hardness['classification']} ({hardness['mg_l']} mg/L)")
    console.print(inp_table)

    # Display results
    console.print()
    if fdt < 21:
        fdt_style, fdt_icon = "bold cyan", "❄"
    elif fdt < 24:
        fdt_style, fdt_icon = "bold blue", "🌤"
    elif fdt <= 28:
        fdt_style, fdt_icon = "bold green", "✅"
    elif fdt <= 30:
        fdt_style, fdt_icon = "bold yellow", "🌡"
    else:
        fdt_style, fdt_icon = "bold red", "🔥"

    temp_table = Table(box=box.ROUNDED, border_style="magenta",
                       title="🌡   Temperature Summary", title_style="bold magenta")
    temp_table.add_column("Metric", style="cyan")
    temp_table.add_column("Value", style="white", justify="right")
    temp_table.add_row("Final Dough Temperature (FDT)",
                       f"[{fdt_style}]{fdt_icon} {fdt:.1f} °C[/{fdt_style}]")
    console.print(temp_table)

    ing_table = Table(box=box.ROUNDED, border_style="green",
                      title="⚖️   Ingredient Weights", title_style="bold green")
    ing_table.add_column("Ingredient", style="cyan")
    ing_table.add_column("Weight (g)", style="white", justify="right")
    ing_table.add_column("Note", style="dim")
    ing_table.add_row("Flour", f"{ingredients['fresh_flour']:.1f} g",
                      f"(+ {ingredients['flour_from_starter']:.1f}g from starter "
                      f"= {ingredients['total_flour']:.0f}g total)")
    ing_table.add_row("Water", f"{ingredients['added_water']:.1f} g",
                      f"(+ {ingredients['water_from_starter']:.1f}g from starter)")
    ing_table.add_row("Starter", f"{ingredients['starter_total']:.1f} g",
                      f"({ingredients['starter_pct']:.0f}% of total flour)")
    ing_table.add_row("Salt", f"{ingredients['salt']:.1f} g", "")
    ing_table.add_section()
    ing_table.add_row("[bold]Total dough weight[/bold]",
                      f"[bold]{ingredients['total_dough_weight']:.1f} g[/bold]",
                      f"[bold]{ingredients['hydration_pct']:.0f}% hydration[/bold]")
    console.print(ing_table)

    ferm_table = Table(box=box.ROUNDED, border_style="cyan",
                       title="⏱️   Fermentation (ambient-aware)",
                       title_style="bold cyan")
    ferm_table.add_column("Metric", style="cyan")
    ferm_table.add_column("Value", style="white", justify="right")
    if dyn:
        ferm_table.add_row("[bold]Bulk fermentation[/bold]",
                           f"[bold]~{dyn['total_hours']:.1f} hours[/bold]")
        ferm_table.add_row("Avg ambient / Peak rate",
                           f"{dyn['avg_ambient']}°C / {dyn['peak_rate']}×")
    else:
        ferm_table.add_row("[bold]Bulk fermentation[/bold]",
                           f"[bold]~{ferm_h:.1f} hours[/bold]")
        ferm_table.add_row("Note", ferm_note + " (no forecast — constant-temp estimate)")
    console.print(ferm_table)

    # Hourly profile table
    if dyn:
        prof_table = Table(box=box.SIMPLE, border_style="dim cyan",
                           title="📊  Hour-by-hour forecast",
                           title_style="bold cyan")
        prof_table.add_column("Hour", style="dim")
        prof_table.add_column("Amb °C", justify="right")
        prof_table.add_column("Dough °C", justify="right")
        prof_table.add_column("Rate ×", justify="right")
        prof_table.add_column("Progress", style="cyan")
        for (hh, amb, dough, rate, pct) in dyn["profile"][:12]:
            bar = "█" * int(pct / 10) + "░" * (10 - int(pct / 10))
            prof_table.add_row(hh, f"{amb:.1f}", f"{dough:.1f}",
                               f"{rate:.1f}", f"{bar} {pct:.0f}%")
        console.print(prof_table)

    if warnings_list:
        console.print()
        for w in warnings_list:
            warn(w)
    if fa:
        console.print()
        console.print(Panel("\n".join(fa), title="🛠  Fermentation Adjustment",
                            border_style="yellow", box=box.ROUNDED))
    if ha:
        console.print()
        console.print(Panel("\n".join(ha), title="🧪  Water Hardness Note",
                            border_style="blue", box=box.ROUNDED))

    console.print()
    if Confirm.ask("📝 Save this recipe to [bold]recipes.txt[/bold]?", default=False):
        msg = save_recipe(flour_weight, flour_type, protein, hydration,
                          starter_weight, salt_pct, starter_hydration,
                          ambient_temp, flour_temp, water_temp, starter_temp,
                          fdt, ingredients, ferm_h, hardness, loc_summary)
        if "✓" in msg:
            success(msg)
        else:
            warn(msg)

    console.print()
    success("Happy baking! 🍞")


# ═══════════════════════════════════════════════════════════════════════════════
#  Entry point
# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    if "--gui" in sys.argv:
        run_gui()
    elif "--help" in sys.argv or "-h" in sys.argv:
        print(__doc__)
    else:
        run_cli()
