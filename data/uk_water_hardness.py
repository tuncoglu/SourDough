"""
UK water hardness by postcode area.

Each entry maps a postcode area (first 1–2 letters, e.g. "KT", "SW", "B")
to (mg/L CaCO₃, classification, note).

Data sources:
  - Water company published hardness reports (PDFs extracted via pdftotext)
  - Water company service-area maps cross-referenced with postcode areas
  - Ofwat / EA Water Resource Zone boundaries
  - DWI annual reports

Where supply-zone granularity is available from company reports, specific
postcode districts (e.g. "KT6") are given their own entry.  The lookup
function checks the longest matching prefix first, so finer-grained
entries take priority.

Last updated: 2026-07-02
"""

from typing import Dict, Tuple

HardnessEntry = Tuple[float, str, str]  # (mg/L CaCO₃, classification, note)

# ── UK postcode → hardness ────────────────────────────────────────────────────
# Postcode area codes (first letters) are the primary key.
# Longer prefixes (districts) refine the area-level value where data exists.

UK_POSTCODE_HARDNESS: Dict[str, HardnessEntry] = {
    # ══════════════════════════════════════════════════════════════════════════
    # Scotland – Scottish Water  (very soft, granite & peat uplands)
    # ══════════════════════════════════════════════════════════════════════════
    "AB": (30, "very soft", "Scottish Water — Aberdeen, granite catchment"),
    "DD": (35, "very soft", "Scottish Water — Dundee, soft upland water"),
    "DG": (40, "soft", "Scottish Water — Dumfries & Galloway, mixed geology"),
    "EH": (30, "very soft", "Scottish Water — Edinburgh, Pentland Hills"),
    "FK": (25, "very soft", "Scottish Water — Falkirk, Central Belt soft"),
    "G":  (20, "very soft", "Scottish Water — Glasgow, Loch Katrine (legendary for bread)"),
    "HS": (15, "very soft", "Scottish Water — Outer Hebrides, peat staining possible"),
    "IV": (25, "very soft", "Scottish Water — Inverness, Highland soft water"),
    "KA": (30, "very soft", "Scottish Water — Kilmarnock/Ayrshire, soft upland"),
    "KW": (20, "very soft", "Scottish Water — Kirkwall/Orkney, very soft"),
    "KY": (30, "very soft", "Scottish Water — Kirkcaldy/Fife, soft"),
    "ML": (25, "very soft", "Scottish Water — Motherwell, Central Belt"),
    "PA": (20, "very soft", "Scottish Water — Paisley, soft upland"),
    "PH": (25, "very soft", "Scottish Water — Perth, Highland edge soft"),
    "TD": (35, "very soft", "Scottish Water — Borders, slightly harder than Highlands"),
    "ZE": (15, "very soft", "Scottish Water — Shetland, very soft peat water"),

    # ══════════════════════════════════════════════════════════════════════════
    # Wales – Dŵr Cymru / Welsh Water  (soft, upland catchments)
    # ══════════════════════════════════════════════════════════════════════════
    "CF": (65, "soft", "Welsh Water — Cardiff, moderately soft"),
    "LD": (50, "soft", "Welsh Water — Llandrindod Wells, soft upland"),
    "LL": (45, "soft", "Welsh Water — Llandudno/North Wales, very soft upland"),
    "NP": (70, "soft", "Welsh Water — Newport, slightly harder near Severn"),
    "SA": (55, "soft", "Welsh Water — Swansea, soft upland sources"),

    # ══════════════════════════════════════════════════════════════════════════
    # Northern Ireland – NI Water  (soft to moderately soft)
    # ══════════════════════════════════════════════════════════════════════════
    "BT": (80, "moderately soft", "NI Water — mixed, softer in Mourne uplands"),

    # ══════════════════════════════════════════════════════════════════════════
    # Thames Water  — London & Thames Valley  (hard to very hard, chalk aquifers)
    # ══════════════════════════════════════════════════════════════════════════
    "E":  (280, "very hard", "Thames Water — East London, chalk aquifer"),
    "EC": (280, "very hard", "Thames Water — City of London, chalk aquifer"),
    "N":  (280, "very hard", "Thames Water — North London, chalk aquifer"),
    "NW": (280, "very hard", "Thames Water — North-West London, chalk aquifer"),
    "SE": (280, "very hard", "Thames Water — South-East London, chalk aquifer"),
    "SW": (280, "very hard", "Thames Water — South-West London, chalk aquifer"),
    "W":  (280, "very hard", "Thames Water — West London, chalk aquifer"),
    "WC": (280, "very hard", "Thames Water — Central London, chalk aquifer"),
    "KT": (285, "very hard", "Thames Water — Kingston/Surrey borders, chalk & clay"),
    "TW": (275, "very hard", "Thames Water — Twickenham, Thames gravels over chalk"),
    "RG": (270, "very hard", "Thames Water — Reading, chalk aquifer"),
    "SL": (280, "very hard", "Thames Water — Slough, chalk aquifer"),
    "OX": (260, "very hard", "Thames Water — Oxford, oolitic limestone & chalk"),
    # Reading / West Berkshire area
    # Swindon – part Thames, part Wessex
    "SN": (260, "hard", "Thames Water / Wessex Water boundary — chalk & limestone"),

    # ══════════════════════════════════════════════════════════════════════════
    # Affinity Water  (very hard, chalk aquifers — Herts, Beds, Bucks, NW Surrey)
    # ══════════════════════════════════════════════════════════════════════════
    "AL": (300, "very hard", "Affinity Water — St Albans, deep chalk aquifer"),
    "EN": (290, "very hard", "Affinity Water — Enfield, chalk aquifer"),
    "HA": (295, "very hard", "Affinity Water — Harrow, chalk aquifer"),
    "HP": (290, "very hard", "Affinity Water / Thames — Hemel Hempstead, Chiltern chalk"),
    "LU": (300, "very hard", "Affinity Water — Luton, Chiltern chalk aquifer"),
    "SG": (290, "very hard", "Affinity Water — Stevenage, chalk aquifer"),
    "UB": (285, "very hard", "Affinity Water — Uxbridge, chalk aquifer"),
    "WD": (295, "very hard", "Affinity Water — Watford, chalk aquifer"),

    # ══════════════════════════════════════════════════════════════════════════
    # SES Water  (Sutton & East Surrey — moderately hard, mixed sources)
    # ══════════════════════════════════════════════════════════════════════════
    "CR": (180, "moderately hard", "SES Water — Croydon, mixed chalk & greensand"),
    "SM": (180, "moderately hard", "SES Water — Sutton, mixed geology"),

    # ══════════════════════════════════════════════════════════════════════════
    # Portsmouth Water — hard to very hard  (chalk boreholes)
    # Based on Portsmouth Water Hardness Values 2025 report (PDF extracted)
    # Supply zones: ZFA1-FA4 Farlington, ZHH1-HH3 Hoads Hill, ZLH1 Littleheath,
    #               ZLO1 Lovedean, ZLV1-LV2 Lavant, ZNE1 Nelson, ZSB1 Soberton,
    #               ZWA1 Walderton, ZWE1 Worlds End
    # Average across all zones: ~290 mg/L  (range 267–315)
    # ══════════════════════════════════════════════════════════════════════════
    "PO1": (294, "very hard", "Portsmouth Water — Farlington zone (ZFA1)"),
    "PO2": (279, "hard", "Portsmouth Water — Farlington East (ZFA2)"),
    "PO3": (288, "very hard", "Portsmouth Water — Farlington Central (ZFA3)"),
    "PO4": (283, "hard", "Portsmouth Water — Farlington South (ZFA4)"),
    "PO6": (288, "very hard", "Portsmouth Water — Nelson zone (ZNE1)"),
    "PO7": (275, "hard", "Portsmouth Water — Soberton zone (ZSB1)"),
    "PO8": (293, "very hard", "Portsmouth Water — Hoads Hill (ZHH2/ZHH3)"),
    "PO9": (310, "very hard", "Portsmouth Water — Littleheath zone (ZLH1, VH)"),
    "PO10": (302, "very hard", "Portsmouth Water — Lovedean zone (ZLO1, VH)"),
    "PO11": (294, "very hard", "Portsmouth Water — Farlington North (ZFA1)"),
    "PO12": (294, "very hard", "Portsmouth Water — Farlington North (ZFA1)"),
    "PO13": (288, "very hard", "Portsmouth Water — Farlington Central (ZFA3)"),
    "PO14": (288, "very hard", "Portsmouth Water — Farlington Central (ZFA3)"),
    "PO15": (275, "hard", "Portsmouth Water — Soberton zone (ZSB1)"),
    "PO16": (288, "very hard", "Portsmouth Water — Nelson zone (ZNE1)"),
    "PO17": (275, "hard", "Portsmouth Water — Soberton zone (ZSB1)"),
    "PO18": (267, "hard", "Portsmouth Water — Walderton zone (ZWA1)"),
    "PO19": (273, "hard", "Portsmouth Water — Lavant North (ZLV1)"),
    "PO20": (288, "very hard", "Portsmouth Water — Lavant South (ZLV2)"),
    "PO21": (288, "very hard", "Portsmouth Water — Lavant South (ZLV2)"),
    "PO22": (288, "very hard", "Portsmouth Water — Lavant South (ZLV2)"),
    "PO30": (315, "very hard", "Portsmouth Water — Worlds End zone (ZWE1, VH)"),
    "PO33": (315, "very hard", "Portsmouth Water — Worlds End zone (ZWE1)"),
    # Generic Portsmouth Water fallback for other PO districts
    "PO":  (290, "very hard", "Portsmouth Water — chalk boreholes, hard to very hard"),

    # ══════════════════════════════════════════════════════════════════════════
    # South Staffs Water  (moderately hard to very hard, mixed geology)
    # Based on South Staffs Water hardness report (PDF extracted)
    # Supply zones: BB/Barr Beacon, Burton, Cannock High, Cawney Hill, Glascote,
    #   Hayley Green, Hopwas, Rugeley Cannock Low, Sedgely Darlaston,
    #   Springsmire, Sutton Coldfield, Shavers End, Uttoxeter,
    #   Walsall, West Bromwich, Winshill
    # Average across all zones: ~190 mg/L  (range 106–391)
    # ══════════════════════════════════════════════════════════════════════════
    "WS": (175, "moderately hard", "South Staffs Water — Walsall/Sutton Coldfield area"),
    "WV": (165, "moderately hard", "South Staffs Water — Wolverhampton, moderate"),
    "DY": (155, "moderately hard", "South Staffs Water — Dudley, mixed geology"),
    # Burton-on-Trent — very hard groundwater
    "DE14": (235, "very hard", "South Staffs Water — Burton zone (BUR1, hard to very hard)"),
    "DE15": (221, "very hard", "South Staffs Water — Burton zone (BUR2, hard to very hard)"),
    "DE13": (225, "very hard", "South Staffs Water — Uttoxeter zone (UTT, hard to very hard)"),
    # Winshill — the hardest in the South Staffs region
    # Cannock
    "WS11": (163, "moderately hard", "South Staffs Water — Cannock High (CH)"),
    "WS12": (134, "moderately soft", "South Staffs Water — Cawney Hill (CW, softer)"),
    "WS15": (152, "moderately hard", "South Staffs Water — Rugeley Cannock Low (RCL)"),
    # West Bromwich
    "B70": (133, "moderately soft", "South Staffs Water — West Bromwich (WB, softer)"),
    "B71": (133, "moderately soft", "South Staffs Water — West Bromwich (WB)"),
    # Sedgley / Darlaston
    "DY3": (152, "moderately hard", "South Staffs Water — Sedgely Darlaston (SGD)"),
    # General fallback for South Staffs region
    "ST": (180, "moderately hard", "South Staffs Water / Severn Trent boundary, mixed"),
    "B":  (200, "hard", "Severn Trent / South Staffs Water boundary, mixed geology"),

    # ══════════════════════════════════════════════════════════════════════════
    # Cambridge Water  (hard to very hard, chalk aquifer)
    # Based on Cambridge Water hardness report (PDF extracted)
    # Supply zones: Z1-Z10 (Cambridge North/South/Rural, Linton, Heydon,
    #   Coton, Odsey, Bluntisham, Earith Bridge)
    # Average: ~310 mg/L  (range 268–352)
    # ══════════════════════════════════════════════════════════════════════════
    "CB1": (295, "very hard", "Cambridge Water — Cambridge North (Z1)"),
    "CB2": (286, "very hard", "Cambridge Water — Cambridge South (Z2)"),
    "CB3": (294, "very hard", "Cambridge Water — Cambridge Rural (Z3)"),
    "CB21": (334, "very hard", "Cambridge Water — Linton (Z4, hard to very hard)"),
    "CB22": (294, "very hard", "Cambridge Water — Coton (Z6)"),
    "CB23": (306, "very hard", "Cambridge Water — Earith Bridge (Z10)"),
    "CB24": (287, "very hard", "Cambridge Water — Bluntisham (Z9)"),
    "CB25": (352, "very hard", "Cambridge Water — Odsey (Z8, exceptionally hard)"),
    # SG8 falls under Cambridge Water (Royston area)
    "SG8": (268, "hard", "Cambridge Water — Heydon (Z5)"),
    # General Cambridge Water fallback
    "CB":  (310, "very hard", "Cambridge Water — chalk aquifer, hard to very hard"),

    # ══════════════════════════════════════════════════════════════════════════
    # Anglian Water  (hard to very hard, chalk & limestone)
    # ══════════════════════════════════════════════════════════════════════════
    "CM": (290, "very hard", "Anglian Water — Chelmsford, chalk aquifer"),
    "CO": (280, "very hard", "Anglian Water — Colchester, chalk aquifer"),
    "IP": (300, "very hard", "Anglian Water — Ipswich, chalk & crag"),
    "LN": (250, "hard", "Anglian Water — Lincoln, limestone aquifer"),
    "NR": (280, "very hard", "Anglian Water — Norwich, chalk aquifer"),
    "PE": (290, "very hard", "Anglian Water — Peterborough, limestone & chalk"),
    "SS": (270, "very hard", "Anglian Water / Essex & Suffolk, chalk aquifer"),

    # ══════════════════════════════════════════════════════════════════════════
    # Severn Trent  (moderately hard to hard, mixed geology)
    # ══════════════════════════════════════════════════════════════════════════
    "CV": (220, "hard", "Severn Trent — Coventry, sandstone & mixed"),
    "LE": (210, "hard", "Severn Trent — Leicester, sandstone aquifer"),
    "NG": (190, "moderately hard", "Severn Trent — Nottingham, sandstone aquifer"),
    "WR": (230, "hard", "Severn Trent — Worcester, mixed geology"),
    "DE": (200, "hard", "Severn Trent — Derby, mixed — harder near Burton"),
    "DE1": (200, "hard", "Severn Trent — Derby city, mixed geology"),
    "DE3": (200, "hard", "Severn Trent — Derby, mixed geology"),
    "DE21": (200, "hard", "Severn Trent — Derby, mixed geology"),
    "DE22": (200, "hard", "Severn Trent — Derby, mixed geology"),
    "DE23": (200, "hard", "Severn Trent — Derby, mixed geology"),
    "DE24": (200, "hard", "Severn Trent — Derby, mixed geology"),
    "DE4": (160, "moderately hard", "Severn Trent — Matlock area, softer upland"),
    "DE5": (200, "hard", "Severn Trent — Ripley area, mixed"),
    "DE6": (160, "moderately hard", "Severn Trent — Ashbourne, softer upland"),
    "DE7": (200, "hard", "Severn Trent — Ilkeston, mixed"),
    "DE11": (200, "hard", "Severn Trent — Swadlincote, mixed"),
    "DE12": (200, "hard", "Severn Trent — mixed"),

    # ══════════════════════════════════════════════════════════════════════════
    # United Utilities  (moderately soft to moderately hard, varied geology)
    # North-West England
    # ══════════════════════════════════════════════════════════════════════════
    "CA": (90, "moderately soft", "United Utilities — Carlisle, soft upland"),
    "CH": (140, "moderately hard", "United Utilities — Chester, mixed sandstone"),
    "CW": (160, "moderately hard", "United Utilities — Crewe, mixed geology"),
    "LA": (70, "soft", "United Utilities — Lancaster/Lakes, soft upland"),
    "M":  (120, "moderately soft", "United Utilities — Manchester, Lake District sources"),
    "PR": (110, "moderately soft", "United Utilities — Preston, soft upland"),
    "WA": (140, "moderately hard", "United Utilities — Warrington, mixed"),
    "WN": (100, "moderately soft", "United Utilities — Wigan, soft Pennine water"),
    "L":  (130, "moderately soft", "United Utilities — Liverpool, mixed sources"),
    "BB": (90, "moderately soft", "United Utilities — Blackburn, soft Pennine water"),
    "BL": (90, "moderately soft", "United Utilities — Bolton, soft Pennine water"),
    "FY": (100, "moderately soft", "United Utilities — Blackpool/Fylde, soft"),
    "OL": (90, "moderately soft", "United Utilities — Oldham, soft Pennine water"),
    "SK": (120, "moderately soft", "United Utilities — Stockport, Pennine edge"),

    # ══════════════════════════════════════════════════════════════════════════
    # Yorkshire Water  (soft to hard, varied geology from Pennines to chalk)
    # ══════════════════════════════════════════════════════════════════════════
    "BD": (100, "moderately soft", "Yorkshire Water — Bradford, soft Pennine water"),
    "HD": (90, "moderately soft", "Yorkshire Water — Huddersfield, soft Pennine"),
    "HG": (120, "moderately soft", "Yorkshire Water — Harrogate, mixed"),
    "HU": (180, "moderately hard", "Yorkshire Water — Hull, chalk aquifer"),
    "HX": (90, "moderately soft", "Yorkshire Water — Halifax, soft Pennine"),
    "LS": (110, "moderately soft", "Yorkshire Water — Leeds, mostly soft Pennine"),
    "S":  (140, "moderately hard", "Yorkshire Water — Sheffield, mixed — harder east"),
    "WF": (130, "moderately soft", "Yorkshire Water — Wakefield, mixed"),
    "YO": (150, "moderately hard", "Yorkshire Water — York, increasingly hard toward Wolds"),
    "DN": (160, "moderately hard", "Yorkshire Water / Severn Trent / Anglian boundary"),

    # ══════════════════════════════════════════════════════════════════════════
    # Northumbrian Water  (moderately soft to moderately hard)
    # ══════════════════════════════════════════════════════════════════════════
    "DH": (140, "moderately hard", "Northumbrian Water — Durham, mixed"),
    "DL": (120, "moderately soft", "Northumbrian Water — Darlington, softer"),
    "NE": (100, "moderately soft", "Northumbrian Water — Newcastle, soft upland sources"),
    "SR": (130, "moderately soft", "Northumbrian Water — Sunderland, mixed"),
    "TS": (150, "moderately hard", "Northumbrian Water — Teesside, harder groundwater"),

    # ══════════════════════════════════════════════════════════════════════════
    # Wessex Water  (hard to very hard, chalk & limestone)
    # ══════════════════════════════════════════════════════════════════════════
    "BA": (250, "hard", "Wessex Water — Bath, limestone aquifer"),
    "BH": (260, "hard", "Wessex Water — Bournemouth, chalk aquifer"),
    "BS": (240, "hard", "Wessex Water — Bristol, limestone"),
    "DT": (230, "hard", "Wessex Water — Dorchester, chalk & limestone"),
    "SP": (240, "hard", "Wessex Water — Salisbury, chalk aquifer"),
    "TA": (220, "hard", "Wessex Water — Taunton, mixed"),

    # ══════════════════════════════════════════════════════════════════════════
    # South West Water  (moderately soft to moderately hard, granite & moorland)
    # ══════════════════════════════════════════════════════════════════════════
    "EX": (120, "moderately soft", "South West Water — Exeter, mixed geology"),
    "PL": (90, "moderately soft", "South West Water — Plymouth, granite/moorland"),
    "TQ": (110, "moderately soft", "South West Water — Torquay, mixed"),
    "TR": (100, "moderately soft", "South West Water — Truro/Cornwall, granite"),

    # ══════════════════════════════════════════════════════════════════════════
    # Southern Water  (moderately hard to hard, chalk along South Downs)
    # ══════════════════════════════════════════════════════════════════════════
    "BN": (220, "hard", "Southern Water — Brighton, chalk South Downs"),
    "CT": (240, "hard", "Southern Water — Canterbury, chalk aquifer"),
    "ME": (240, "hard", "Southern Water — Medway, chalk aquifer"),
    "RH": (200, "moderately hard", "Southern Water — Redhill, mixed greensand & chalk"),
    "TN": (200, "moderately hard", "Southern Water — Tunbridge Wells, mixed geology"),
    "SO": (230, "hard", "Southern Water — Southampton, chalk aquifer"),

    # ══════════════════════════════════════════════════════════════════════════
    # South East Water  (moderately hard to hard)
    # ══════════════════════════════════════════════════════════════════════════
    # Overlaps with Southern Water in many areas; values are for SE Water supply zones
    "TN4": (180, "moderately hard", "South East Water — Tunbridge Wells area"),
    "TN5": (180, "moderately hard", "South East Water"),
    "TN6": (160, "moderately hard", "South East Water — Crowborough, slightly softer"),
    "TN7": (160, "moderately hard", "South East Water"),
    "TN8": (170, "moderately hard", "South East Water — Edenbridge"),
    "TN9": (190, "moderately hard", "South East Water — Tonbridge"),
    "TN10": (190, "moderately hard", "South East Water — Tonbridge"),
    "TN11": (190, "moderately hard", "South East Water"),
    "TN12": (180, "moderately hard", "South East Water — Staplehurst"),
    "TN17": (170, "moderately hard", "South East Water — Cranbrook"),
    "TN18": (170, "moderately hard", "South East Water"),
    "TN19": (170, "moderately hard", "South East Water"),
    "TN20": (160, "moderately hard", "South East Water — Mayfield"),
    "TN22": (160, "moderately hard", "South East Water — Uckfield"),
    "TN27": (180, "moderately hard", "South East Water"),
    "TN30": (180, "moderately hard", "South East Water"),
    "TN31": (180, "moderately hard", "South East Water"),

    # ══════════════════════════════════════════════════════════════════════════
    # Additional postcode areas not covered above
    # ══════════════════════════════════════════════════════════════════════════

    # Isle of Man
    "IM": (60, "soft", "Isle of Man — soft upland water"),

    # Channel Islands (not UK water companies, but included for completeness)
    "JE": (120, "moderately soft", "Jersey Water — mixed sources"),
    "GY": (100, "moderately soft", "Guernsey Water — mixed sources"),

    # ── Remaining English postcode areas ──────────────────────────────────────

    # SY — Shrewsbury area (Severn Trent / Welsh Water / Hafren Dyfrdwy boundary)
    "SY": (150, "moderately hard", "Severn Trent / Welsh Water — mixed"),
    # GL — Gloucester (Severn Trent / Wessex / Thames / Welsh Water boundary)
    "GL": (220, "hard", "Severn Trent / Wessex / Thames boundary, mixed"),
    # NN — Northampton (Anglian / Severn Trent boundary)
    "NN": (250, "hard", "Anglian Water / Severn Trent — limestone"),
    # MK — Milton Keynes (Anglian / Affinity boundary)
    "MK": (280, "very hard", "Anglian Water / Affinity Water — chalk & limestone"),
    # TF — Telford (Severn Trent)
    "TF": (190, "moderately hard", "Severn Trent — Telford, mixed geology"),
    # CW — Crewe / Nantwich
    # HR — Hereford (Welsh Water / Severn Trent)
    "HR": (180, "moderately hard", "Welsh Water / Severn Trent — mixed"),
    # IG — Ilford (Essex & Suffolk / Thames)
    "IG": (280, "very hard", "Essex & Suffolk Water / Thames — chalk"),
    # RM — Romford (Essex & Suffolk Water)
    "RM": (280, "very hard", "Essex & Suffolk Water — chalk aquifer"),
    # DA — Dartford (Thames / Southern boundary)
    "DA": (270, "very hard", "Thames Water — chalk aquifer"),
    # BR — Bromley (Thames Water)
    "BR": (275, "very hard", "Thames Water — chalk aquifer"),
    # WD — Watford
    # SG — Stevenage
    # AL — St Albans
    # HP — Hemel Hempstead
    # LU — Luton
    # UB — Uxbridge
    # EN — Enfield
    # HA — Harrow
    # WD — Watford
    # CR — Croydon
    # SM — Sutton
    # KT — Kingston (already covered by Thames Water and SES Water overlap)
    # TW — Twickenham (already covered by Thames Water)
    # GU — Guildford (Thames Water / Affinity / South East)
    "GU": (240, "hard", "Thames Water / South East Water — mixed chalk & greensand"),
    # RH — Redhill
    # BN — Brighton
    # TN — Tunbridge Wells (already covered)
    # CT — Canterbury
    # ME — Medway
    # DA — Dartford
    # BR — Bromley
    # IG — Ilford
    # RM — Romford
    # SS — Southend
    # CO — Colchester
    # CM — Chelmsford
    # IP — Ipswich
    # NR — Norwich
    # PE — Peterborough
    # LN — Lincoln
    # DN — Doncaster
    # HU — Hull
    # YO — York
    # HG — Harrogate
    # LS — Leeds
    # BD — Bradford
    # HX — Halifax
    # HD — Huddersfield
    # WF — Wakefield
    # S — Sheffield
    # S postcode districts — more granular
    "S1":  (140, "moderately hard", "Yorkshire Water — Sheffield city centre"),
    "S2":  (140, "moderately hard", "Yorkshire Water — Sheffield"),
    "S3":  (130, "moderately soft", "Yorkshire Water — Sheffield NW"),
    "S4":  (130, "moderately soft", "Yorkshire Water — Sheffield NE"),
    "S5":  (130, "moderately soft", "Yorkshire Water — Sheffield N"),
    "S6":  (120, "moderately soft", "Yorkshire Water — Sheffield NW, softer Pennine"),
    "S7":  (140, "moderately hard", "Yorkshire Water — Sheffield S"),
    "S8":  (145, "moderately hard", "Yorkshire Water — Sheffield S, slightly harder"),
    "S9":  (135, "moderately soft", "Yorkshire Water — Sheffield NE"),
    "S10": (120, "moderately soft", "Yorkshire Water — Sheffield W, Pennine edge"),
    "S11": (135, "moderately soft", "Yorkshire Water — Sheffield SW"),
    "S12": (145, "moderately hard", "Yorkshire Water — Sheffield SE, harder"),
    "S13": (145, "moderately hard", "Yorkshire Water — Sheffield E, harder"),
    "S17": (135, "moderately soft", "Yorkshire Water — Sheffield SW, mixed"),
    "S18": (150, "moderately hard", "Yorkshire Water — Dronfield, harder"),
    "S20": (145, "moderately hard", "Yorkshire Water — Sheffield SE"),
    "S21": (150, "moderately hard", "Yorkshire Water — Renishaw, harder"),
    "S25": (155, "moderately hard", "Yorkshire Water — Dinnington, harder SE"),
    "S26": (155, "moderately hard", "Yorkshire Water — Wales, harder SE"),
    "S32": (135, "moderately soft", "Yorkshire Water — Hope Valley edge"),
    "S33": (120, "moderately soft", "Yorkshire Water — Hope Valley, softer"),
    "S35": (130, "moderately soft", "Yorkshire Water — Sheffield N"),
    "S36": (120, "moderately soft", "Yorkshire Water — Penistone, Pennine edge"),
    "S40": (155, "moderately hard", "Yorkshire Water — Chesterfield, harder"),
    "S41": (155, "moderately hard", "Yorkshire Water — Chesterfield N"),
    "S42": (155, "moderately hard", "Yorkshire Water — Chesterfield S"),
    "S43": (155, "moderately hard", "Yorkshire Water — Staveley, harder"),
    "S44": (155, "moderately hard", "Yorkshire Water — Bolsover"),
    "S45": (155, "moderately hard", "Yorkshire Water — Clay Cross"),
    "S60": (145, "moderately hard", "Yorkshire Water — Rotherham"),
    "S61": (145, "moderately hard", "Yorkshire Water — Rotherham N"),
    "S62": (145, "moderately hard", "Yorkshire Water — Rawmarsh"),
    "S63": (150, "moderately hard", "Yorkshire Water — Wath upon Dearne"),
    "S64": (155, "moderately hard", "Yorkshire Water — Mexborough"),
    "S65": (145, "moderately hard", "Yorkshire Water — Rotherham E"),
    "S66": (150, "moderately hard", "Yorkshire Water — Maltby, harder"),
    "S70": (130, "moderately soft", "Yorkshire Water — Barnsley"),
    "S71": (130, "moderately soft", "Yorkshire Water — Barnsley N"),
    "S72": (130, "moderately soft", "Yorkshire Water — Barnsley E"),
    "S73": (130, "moderately soft", "Yorkshire Water — Barnsley S"),
    "S74": (130, "moderately soft", "Yorkshire Water — Barnsley W"),
    "S75": (125, "moderately soft", "Yorkshire Water — Barnsley NW, softer"),
    "S80": (160, "moderately hard", "Severn Trent — Worksop, harder"),
    "S81": (160, "moderately hard", "Severn Trent — Worksop area"),

    # ══════════════════════════════════════════════════════════════════════════
    # Remaining English postcode areas not yet covered
    # ══════════════════════════════════════════════════════════════════════════

    # East Midlands

    # West Midlands

    # South West

    # South East

    # East of England

    # East Midlands / South East Midlands

    # London commuter belt
}


def lookup_uk_postcode_hardness(postcode: str) -> HardnessEntry:
    """
    Look up water hardness for a UK postcode.

    Tries the longest matching prefix first (down to postcode district,
    e.g. "PO6"), then falls back to area ("PO"), then returns a UK
    geological fallback.

    Args:
        postcode: A UK postcode string (case-insensitive, spaces ignored).

    Returns:
        (mg/L CaCO₃, classification, note)
    """
    if not postcode:
        return (180, "moderately hard", "UK fallback — unknown postcode area")

    # Normalise: uppercase, strip whitespace
    code = postcode.upper().replace(" ", "").strip()

    # Try from longest prefix (district-level, e.g. "PO6" or "S10") down
    for length in range(len(code), 0, -1):
        prefix = code[:length]
        if prefix in UK_POSTCODE_HARDNESS:
            return UK_POSTCODE_HARDNESS[prefix]

    # Check first two letters (postcode area)
    area = code[:2]
    if area in UK_POSTCODE_HARDNESS:
        return UK_POSTCODE_HARDNESS[area]

    # Check first letter
    letter = code[:1]
    if letter in UK_POSTCODE_HARDNESS:
        return UK_POSTCODE_HARDNESS[letter]

    # UK geological fallback
    return (180, "moderately hard", "UK fallback — unable to match postcode area")


# ── Classification helper ────────────────────────────────────────────────────

def classify_hardness(mg_l: float) -> str:
    """Classify water hardness in mg/L CaCO₃."""
    if mg_l < 30:
        return "very soft"
    elif mg_l < 60:
        return "soft"
    elif mg_l < 120:
        return "moderately soft"
    elif mg_l < 200:
        return "moderately hard"
    elif mg_l < 300:
        return "hard"
    else:
        return "very hard"
