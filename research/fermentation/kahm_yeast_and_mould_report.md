# Kahm Yeast and Mould in Fermented Vegetables: Quantitative Thresholds with Full Citations

**Prepared as a food-science literature review. Every number below carries a source, a full URL, and a confidence rating. Gaps are labelled explicitly.**

---

## 0. Method and scope notes (read this first)

**Search strategy.** Europe PMC REST API (indexes MEDLINE + PMC full text), Crossref REST API, publisher sites, USDA/extension sites, plus direct PDF retrieval and text extraction for documents the HTML fetcher refused (PMC/ASM PDFs, extension PDFs).

**What "confidence" means here:**

| Rating | Meaning |
|---|---|
| **strong** | Measured directly on a fermented vegetable matrix (or the exact organism of interest), in a peer-reviewed primary study, with numbers, and corroborated by ≥1 independent study. |
| **moderate** | Peer-reviewed primary data, but measured in a model medium, a different matrix, or a different (though related) organism; or a single uncorroborated study. |
| **weak-or-contested** | Review-level assertion, single study, conflicting evidence, or a claim whose primary source I could not locate. |

**Three corrections to widely repeated claims, stated up front:**

1. **"Kahm yeast" is not a scientific taxon.** It is a home-fermentation term for a surface film. Searching Europe PMC for `TITLE:"kahm"` returns **0 hits**; all 303 full-text hits for "kahm" are author surnames. There is **no peer-reviewed literature on "kahm yeast" as such**. The scientific literature studies the same phenomenon under *"white colony-forming yeast" (WCFY)*, *"pellicle"*, *"film-forming yeast"*, and *"surface yeast"*. Any claim about "what kahm yeast does" must be mapped onto those literatures, and the mapping is not always clean (see §A.5).
2. **The "classic study on mould-induced pH rise in sauerkraut" does not exist — the classic study is on TOMATO JUICE.** The paper almost certainly being referenced is **Mundt, J.O. (1978), "Effect of Mold Growth on the pH of Tomato Juice," *J. Food Prot.* 41(4):267–268** ([doi:10.4315/0362-028X-41.4.267](https://doi.org/10.4315/0362-028X-41.4.267)). It contains no sauerkraut data. I found **no** study measuring pH before/after mould growth in sauerkraut (§B.6).
3. **In some fermentations the surface film is bacterial, not yeast.** In Sichuan pickle, the pellicle-forming organisms identified were predominantly **bacteria**: *Bacillus amyloliquefaciens*, *B. subtilis*, *Citrobacter freundii*, and *Lactobacillus plantarum* (Rao et al. 2018, [doi:10.1111/ijfs.13652](https://doi.org/10.1111/ijfs.13652)). Calling every white film "kahm yeast" is a misidentification risk.

---

# TOPIC A — "KAHM YEAST"

## A.1 Which organisms actually cause the surface film

### A.1.1 Sauerkraut

**Satora P., Skotniczny M., Strnad S., Ženišová K. (2020). "Yeast Microbiota during Sauerkraut Fermentation and Its Characteristics." *Int. J. Mol. Sci.* 21(24):9699.**
URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC7767181/ · [doi:10.3390/ijms21249699](https://doi.org/10.3390/ijms21249699)

- 246 isolates from 8 cabbage cultivars, identified by 5.8S-ITS sequencing. **Nine species:** *Debaryomyces hansenii* (dominant, 4 strains), *Clavispora lusitaniae* (4 strains), *Rhodotorula mucilaginosa* (3 strains), *Cryptococcus macerans*, *Nakazawaea holstii*, *Meyerozyma guilliermondii*, *Candida sake*, *Pichia fermentans*, *Tausonia pullulans*.
- **Yeast counts:** fresh cabbage 0.60 (cv. Cabton) to 3.74 (cv. Manama) log CFU g⁻¹; **maximum 1.82–4.46 log CFU g⁻¹ at 24 h**; decline thereafter; none detected at day 7.
- **Confidence: strong** (primary isolation + sequencing; counts replicated across 8 cultivars; n=1 lab, but methodologically sound).

**Wang J., Sui Y., Liu X., Kong B., Qin L., Chen Q. (2023). "Exploring potential correlations between fungal communities, safety, and quality properties of traditional fermented sauerkraut from Northeast China." *LWT* 185:115185.**
URL: https://www.sciencedirect.com/science/article/pii/S0023643823007648 · [doi:10.1016/j.lwt.2023.115185](https://doi.org/10.1016/j.lwt.2023.115185)
- 27 sauerkrauts, 9 regions. Dominant fungal genera: *Debaryomyces, Candida, Pichia, Dipodascus, Naumovozyma, Kazachstania, Cutaneotrichosporon, Tausonia, Wickerhamomyces, Issatchenkia*. Highest nitrite 16.60 ± 0.07 mg/kg (SH1); highest biogenic amines 233.59 ± 2.85 mg/kg (QQHR1). *Kazachstania, Pichia, Wickerhamomyces, Dipodascus, Candida* significantly correlated with biogenic amines.
- **Confidence: moderate** (large sample, but culture-independent correlation only; no mould quantification).

**Satora P. et al. (2015). "The yeasts profile of home-made and commercial sauerkrauts."** Slovak University of Agriculture proceedings.
URL: http://www.slpk.sk/eldo/2015/zborniky/9788055213149/02-mikrobiologicka/Satora.pdf
- **Confidence: weak** (conference proceedings; superseded by the 2020 IJMS paper).

### A.1.2 Kimchi — the best-characterised "white colony" system

This is where the modern primary literature actually lives.

**Kim J.Y. et al. (2019). "Community structures and genomic features of undesirable white colony-forming yeasts on fermented vegetables." *J. Microbiol.* 57(1):30–37.**
URL: https://pubmed.ncbi.nlm.nih.gov/30392155/ · [doi:10.1007/s12275-019-8487-y](https://doi.org/10.1007/s12275-019-8487-y)
- Deep sequencing found only **8 OTUs** — the WCFY community is very simple. Five most abundant: ***Pichia kluyveri*, *Yarrowia lipolytica*, *Candida sake*, *Hanseniaspora uvarum*, *Kazachstania servazzii***. 41 strains isolated; whole genomes sequenced (8.97–21.32 Mbp). **"no toxin or antimicrobial resistance genes were identified."**
- **Confidence: strong.**

**Moon S.H., Chang M., Kim H.Y., Chang H.C. (2014). "Pichia kudriavzevii is the major yeast involved in film-formation, off-odor production, and texture-softening in over-ripened kimchi." *Food Sci. Biotechnol.* 23(2):489–497.**
URL: https://ouci.dntb.gov.ua/en/works/96vPbDJ9/ · [doi:10.1007/s10068-014-0067-7](https://doi.org/10.1007/s10068-014-0067-7)
- Establishes ***Pichia kudriavzevii*** (= ***Candida krusei***; the two names are one biological species — see Douglass et al. 2018, [doi:10.1371/journal.ppat.1007138](https://doi.org/10.1371/journal.ppat.1007138)) as the major film former. Linked to pectinolytic (polygalacturonase) activity → texture softening.
- **Confidence: strong** for identity and phenotype. **Note for your question:** the *Candida krusei* you asked about is the same organism as *P. kudriavzevii* — this is the single best-attested kahm organism, but the evidence base is kimchi, not sauerkraut.

**Suzuki A., Muraoka N., Nakamura M., Yanagisawa Y., Amachi S. (2018). "Identification of undesirable white-colony-forming yeasts appeared on the surface of Japanese kimchi." *Biosci. Biotechnol. Biochem.* 82(2):334–342.**
URL: https://pubmed.ncbi.nlm.nih.gov/29327670/ · [doi:10.1080/09168451.2017.1419853](https://doi.org/10.1080/09168451.2017.1419853)
- ***Kazachstania exigua* and *K. pseudohumilis*** responsible in Japanese commercial kimchi.
- **Confidence: strong.**

**Kim M.-J., Min S.-g., Shin S.W., Shin J., Kim H.-Y. (2021). "Real-time PCR assays for the quantitative detection of *Kazachstania servazzii* and *Candida sake* related to undesirable white colony on kimchi." *Food Control* 125:107984.**
URL: https://ouci.dntb.gov.ua/en/works/legajgD7/ · [doi:10.1016/j.foodcont.2021.107984](https://doi.org/10.1016/j.foodcont.2021.107984) · **Confidence: moderate** (methods paper; confirms these two as target organisms).

**Xian S. et al. (2022). "Identification of pellicle formation related microorganisms in traditional Sichuan paocai…" *Food Res. Int.* 159:111130.**
URL: https://pubmed.ncbi.nlm.nih.gov/35940746/ · [doi:10.1016/j.foodres.2022.111130](https://doi.org/10.1016/j.foodres.2022.111130)
- Pellicle-related genera: ***Kazachstania, Lactobacillus, Pichia, Candida, Lachancea, Saccharomyces***.
- **Confidence: strong** for the genus list (metagenomics).

**Cai T. et al. (2023). "Inhibition of *Perilla frutescens* Essential Oil on Pellicle Formation of *Candida tropicalis* and *Pichia kluyveri* and Its Effect on Volatile Compounds in Sichuan Pickles." *Foods* 12(8):1593.**
URL: https://www.mdpi.com/2304-8158/12/8/1593 · [doi:10.3390/foods12081593](https://doi.org/10.3390/foods12081593)
- Confirms ***Candida tropicalis*** (one of your listed species) as a pellicle former in fermented vegetables. MIC of *P. frutescens* EO = 0.4 µL/mL; MFC 1.6 µL/mL (*C. tropicalis*), 0.8 µL/mL (*P. kluyveri*).
- **Confidence: moderate** (single lab; the antifungal numbers are strong, the ecological claim is from one pickle system).

### A.1.3 On the species you specifically asked about

| Species you asked about | Status in primary literature on fermented vegetables | Confidence |
|---|---|---|
| *Candida krusei* | = ***Pichia kudriavzevii***; major kimchi film-former (Moon et al. 2014). Well attested. | **strong** |
| *C. tropicalis* | Pellicle former in Sichuan pickle (Cai et al. 2023). | **moderate** |
| *C. lambica* | **NO DATA FOUND** in any fermented-vegetable isolation study I searched. | — |
| *Pichia membranaefaciens* | Referenced as a kimchi spoilage yeast by Kim et al. 2021 (their ref. 27) but I could not retrieve the underlying study. Classic film yeast of wine/beer, not of brined vegetables. | **weak** |
| *P. anomala* | **NO DATA FOUND** for sauerkraut/kimchi. | — |
| *Debaryomyces hansenii* | Dominant sauerkraut yeast (Satora et al. 2020, 4 strains); kimchi WCFY (Kim et al. 2020, 2021; Gwak et al. 2025). | **strong** |
| *Rhodotorula* spp. | *R. mucilaginosa* in sauerkraut (Satora et al. 2020). Causes **pink** discolouration, not white film. Satora et al. attribute pink sauerkraut to salt **>3%**. | **moderate** |
| *Saccharomyces* | Pellicle-related genus in paocai (Xian et al. 2022); *S. servazzii* historically. | **moderate** |

**Botanical/taxonomic caveat:** the *Kazachstania* genus (K. servazzii, K. exigua, K. barnettii, K. pseudohumilis) is arguably the most consistently reported white-colony genus across kimchi studies, and it is **not on your list**. If you are building a species list, add it.

---

## A.2 Environmental conditions for growth

### A.2.1 The single best quantitative dataset — WCFY in kimchi

**Kim M.-J., Kang S.-E., Jeong C.H., Min S.-G., Hong S.W., Roh S.W., Jhon D.-Y., Kim T.-W. (2021). "Growth Inhibitory Effect of Garlic Powder and Cinnamon Extract on White Colony-Forming Yeast in Kimchi." *Foods* 10(3):645.**
URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC8003234/ · [doi:10.3390/foods10030645](https://doi.org/10.3390/foods10030645)

Strains: *Kazachstania servazzii* MGB0660, *Candida sake* MGB0659, *Debaryomyces hansenii* MGB0661 (isolated from kimchi white colonies); *Pichia kudriavzevii* MGB1001, *Hanseniaspora uvarum* MGB1002 (isolated from red pepper powder).

**TEMPERATURE**
- All five strains grew at **4, 10 and 20 °C**.
- At **0 °C, only *K. servazzii*, *C. sake* and *D. hansenii* grew.**
- Authors' conclusion: "WCFYs are able to grow at commercial storage temperature (0–10 °C)."
- **Confidence: strong** for these five strains in YPD broth. **Weak for extrapolation** to arbitrary kahm organisms.

**pH**
- Kimchi pH falls from ~5.0 initially to <4.0 during fermentation.
- Tested at **pH 3, 4 and 5** (YPD broth adjusted with **HCl**, 24 °C, 120 h).
- Result: **"all WCFY grew well at pH 3, 4, and 5."** Authors: "These results explain why white colony was well formed in over-ripened kimchi despite low pH."
- **Confidence: moderate.** Strong within-study, but (a) acidulant was HCl, not lactic/acetic acid — undissociated organic acids are far more inhibitory than mineral acid at the same pH; (b) YPD is a rich medium.

**SALT (NaCl)**
- Tested at **10, 15 and 20 % (w/v)** NaCl on YPD agar.
- Viable counts of *C. sake*, *P. kudriavzevii* and *H. uvarum* **decreased significantly** as salinity rose — **but at 20 % NaCl all five strains survived.**
- Authors: "the high-salt water used to produce kimchi did not have a significant effect on inhibiting white colony formation on kimchi."
- **Confidence: moderate-to-strong** (direct measurement; note 10–15 % is the *salting* brine, not the final kimchi salt level of ~2.5 %).
- Cross-reference cited by the authors: salt also did not significantly inhibit ***Pichia membranifaciens*** in kimchi. *(I could not retrieve that primary study — confidence weak.)*

**OXYGEN**
- Grown **anaerobically** (GasPak EZ Anaerobe Pouch System) at 4, 10 and 20 °C on YPD agar.
- **Colonies formed at all three temperatures under anaerobic conditions.**
- Authors: "Although oxygen exposure has been known as one of the important factors that promote white colony formation on the surface of kimchi, **the limitation of oxygen exposure was not enough to inhibit the appearance of WCFY on kimchi**."
- **Confidence: moderate.** This directly contradicts the common claim that kahm yeast is an obligate aerobe that cannot grow in a sealed vessel. Note, however, that GasPak pouches are not strictly anaerobic for microaerophilic yeasts.

### A.2.2 Sauerkraut yeast stress tolerance — the classical plate data

**Satora et al. 2020, Table 2** (same URL as §A.1.1). Growth scored on a +/++/+++/++++ scale; **control pH 5.6**; **NaCl 5 / 6 / 8 / 10 %**; **lactic acid 6 / 8 / 10 g·L⁻¹**; **pH 3.6 / 3.4 / 3.2** (acidified medium).

Representative rows I extracted from the table:

| Isolate | 5 % NaCl | 10 % NaCl | 6 g/L lactic | 10 g/L lactic | pH 3.6 | pH 3.4 | pH 3.2 |
|---|---|---|---|---|---|---|---|
| *Cryptococcus macerans* I | ++++ | + | ++ | – | ++ | – | – |
| *Debaryomyces hansenii* XII | ++++ | ++ | ++ | – | + | – | – |
| *Debaryomyces hansenii* XV | ++++ | ++++ | + | – | + | + | – |
| *Clavispora lusitaniae* V | ++++ | ++ | +++ | – | +++ | + | – |
| *Meyerozyma guilliermondii* VI | ++++ | +++ | ++ | – | +++ | ++ | – |
| *Nakazawaea holstii* II | ++ | – | – | – | ++ | – | – |

Authors' own summary: **"All isolates could grow at NaCl concentrations higher than 5 %, were relatively resistant to low pH and the presence of lactic acid."**

- **Confidence: moderate.** Careful reading of the table gives useful numbers, but the scale is ordinal (not OD/CFU), single lab, and "pH 3.6/3.4/3.2" was presumably acidified with lactic acid (unclear from the table).
- **Key usable numbers:** sauerkraut yeast isolates tolerated **10 % NaCl**; **none grew at pH 3.2**; **all were inhibited by 10 g/L lactic acid**; several grew weakly at pH 3.4–3.6.

### A.2.3 The apparent contradiction — flag this

Kim et al. (2021) found kimchi WCFY **grew well at pH 3** (HCl-acidified YPD). Satora et al. (2020) found sauerkraut yeasts **did not grow at pH 3.2** (organic-acid-containing medium). These are not necessarily in conflict: the acidulant differs, the media differ, and the species differ. **Do not quote a single "kahm yeast pH range" as if it were settled.** The defensible statement is:

> Kahm/WCFY yeasts grow across at least **pH 3–5** in laboratory media; the lower limit in real brine depends on the **undissociated** lactic/acetic acid concentration, not on pH alone. No study has determined a pH growth limit for these organisms *in sauerkraut brine*.

**Confidence: weak-or-contested** for any single pH-range number.

### A.2.4 Organic acid tolerance

**NO DIRECT QUANTITATIVE DATA FOUND** for minimum inhibitory concentrations of lactic or acetic acid against kahm yeasts *in fermented vegetables*. The Satora et al. (2020) plate data (10 g/L lactic acid inhibited all tested sauerkraut isolates) is the closest available figure and is ordinal only. **Confidence: weak.**

The relevant classical literature exists but I could not retrieve full text:
- ***"Inhibition of the growth of acid tolerant yeasts by acetate, lactate and propionate and their synergistic mixtures."* *J. Appl. Bacteriol.* (1983).** URL: https://enviromicro-journals.onlinelibrary.wiley.com/doi/pdf/10.1111/j.1365-2672.1983.tb01685.x — **not fetched; treat as a lead, not a citation.**

### A.2.5 Temperature — corroborating data

**Suzuki et al. 2018** (URL above): kimchi fermented at **4, 10, 15, 25 °C**. At **4 °C no yeast colonies appeared until 35 days**; formation was **more rapid at 10, 15 and 25 °C**. Inoculation of isolated *Kazachstania* strains reproduced white-colony formation **at 15 °C but not at 4 °C**. *Kazachstania* spp. grew fast at 15 °C **even in the presence of the acidulants commonly added to Japanese kimchi to prevent yeast growth.**
- **Confidence: strong.** This is the cleanest temperature-vs-incidence dataset available.

**Kim M.-J. et al. (2020). "Impact of fermentation conditions on the diversity of white colony-forming yeast and analysis of metabolite changes by white colony-forming yeast in kimchi." *Food Res. Int.* 136:109315.**
URL: https://pubmed.ncbi.nlm.nih.gov/32846523/ · [doi:10.1016/j.foodres.2020.109315](https://doi.org/10.1016/j.foodres.2020.109315)
- Temperatures **4, 10, 20 °C** × packaging **open vs closed**. *K. servazzii* and *K. barnettii* prevalent under **closed** packaging at all three temperatures. Under **open** packaging the community was **more diverse** (*C. sake*, *K. servazzii*, *K. barnettii*, *Tausonia pullulans* at 4 °C; *C. sake*, *K. servazzii*, *K. barnettii*, *D. hansenii* at 10 °C).
- **Conclusion: "fermentation temperature and air exposure can alter WCFY diversity … however, non-volatile metabolite profiles in kimchi soup are not significantly affected."** Glycerol increased in WCFY-harbouring samples.
- **Confidence: strong** for the community-shift finding; **strong** for the negative metabolite finding.

**Bae C.-I. et al. (2025). "Effects of storage temperature on the diversity of white colony-forming yeast… in salted kimchi cabbage." *Food Sci. Biotechnol.* 34(4):1001–1014.**
URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC11833002/ · [doi:10.1007/s10068-024-01739-1](https://doi.org/10.1007/s10068-024-01739-1)
- At 10 / 4 / −1 °C, *Kazachstania* / *Candida* / *Mrakia* respectively became most abundant. *Candida* negatively correlated with *Levilactobacillus*, *Lactiplantibacillus*, *Latilactobacillus*.
- **Confidence: moderate.**

---

## A.3 Is it a FOOD SAFETY issue or cosmetic?

### A.3.1 The direct toxicological answer: cosmetic/sensory, not toxic

**Jeong C.H., Kim J.Y., Oh Y.J., Ko H.I., Roh S.W., Hong S.W., Kwon H.C., Han S.G., Kim T.-W. (2022). "Safety assessment of white colony-forming yeasts in kimchi." *Food Microbiology* 106:104057.**
URL: https://pubmed.ncbi.nlm.nih.gov/35690449/ · [doi:10.1016/j.fm.2022.104057](https://doi.org/10.1016/j.fm.2022.104057)
- Organisms tested: *Kazachstania servazzii*, *Candida sake*, *Pichia kudriavzevii*.
- **In vitro:** no LDH release, no excessive oxidative stress, no mitochondrial damage in human intestinal (Caco-2) and liver (HepG2) cells **up to 2.5 × 10⁵ CFU/mL**.
- **In vivo (Sprague-Dawley rats):** single-dose and 14-day repeated-dose oral toxicity — **no death, no clinical signs, no histological liver alterations, no increase in pro-inflammatory cytokines or CYP2E1 up to 5 × 10⁸ CFU/head/day.**
- **Genomics:** *P. kudriavzevii* **did not harbour toxicity or antimicrobial-resistance genes.**
- Authors' conclusion: **"The current work provides evidence for the safety of accidental major WCFY ingestion via kimchi."**
- **Confidence: strong.** This is a well-designed multi-tier safety assessment. **Scope limit: it tests the yeast cells themselves, not the pH-shift consequence.**

**Kim J.Y. et al. 2019** (genomics, URL above): "no toxin or antimicrobial resistance genes were identified" in the five major WCFY genomes.
- **Confidence: strong.**

**Song H., Dang Y.M., Ki S.H., Park S., Ha J.-H. (2024). "Surface dielectric barrier discharge plasma inactivates white colony-forming yeast in kimchi seasoning." *LWT* 207:116637.**
URL: https://doi.org/10.1016/j.lwt.2024.116637 · [doi:10.1016/j.lwt.2024.116637](https://doi.org/10.1016/j.lwt.2024.116637)
- States plainly: **"Although it does not cause cytotoxic reactions, WCFY on kimchi results in unpleasant odors … resulting in economic losses and food wastage."**
- **Confidence: moderate** (review-style framing within a primary paper).

### A.3.2 The pH-rise / botulism question — the honest answer

**Does the film raise pH? Yes — demonstrated, but by yeasts *and* bacteria, and in pickles/cucumbers, not sauerkraut.**

**Franco W., Pérez-Díaz I.M. (2012). "Role of selected oxidative yeasts and bacteria in cucumber secondary fermentation associated with spoilage of the fermented fruit." *Food Microbiology* 32(2):338–344.**
URL: https://pubmed.ncbi.nlm.nih.gov/22986199/ · [doi:10.1016/j.fm.2012.07.013](https://doi.org/10.1016/j.fm.2012.07.013)
- **"The ability of the yeasts *Issatchenkia occidentalis* and *Pichia manshurica* to utilize lactic and acetic acids during aerobic metabolism was confirmed and associated with increases in brine pH and the chemical reduction of the fermentation matrix."**
- *Lactobacillus buchneri* produced acetic acid at the expense of lactic acid under **both aerobic and anaerobic** conditions, at an initial medium pH of **3.2**.
- *Clostridium bifermentans* and *Enterobacter cloacae* metabolic activity was observed **at medium pH above 4.5**.
- **Confidence: strong** for the mechanism in fermented cucumber. **This is the single best citation for "surface yeasts consume lactic acid and raise pH."**

**Medina E., Pérez-Díaz I.M., Breidt F., Hayes J., Franco W., Butz N., Azcarate-Peril M.A. (2016). "Bacterial Ecology of Fermented Cucumber Rising pH Spoilage as Determined by Nonculture-Based Methods." *J. Food Sci.* 81(1):M121–M129. (USDA-ARS Raleigh + NC State)**
URL: https://europepmc.org/articles/PMC4973622 · [doi:10.1111/1750-3841.13158](https://doi.org/10.1111/1750-3841.13158)
- Commercial spoilage tanks: *L. rapi*, *L. buchneri*, *L. namurensis*, *L. acetotolerans*, *L. panis*, *Acetobacter peroxydans*, *A. aceti*, *A. pasteurianus* **at pH below 3.4**; *Veillonella* and *Dialister* spp. in samples **with pH above 4.0**.
- **"Acetobacter spp. were successfully isolated from commercial samples collected from tanks subjected to air purging… In contrast, Lactobacillus spp. were primarily identified in samples of FCS collected from tanks not subjected to air purging for more than 4 mo. Thus, it is speculated that oxygen availability may be a determining factor in the initiation of spoilage and the leading microbiota."**
- **Confidence: strong** for the microbiology; **moderate** for the oxygen-initiator hypothesis (authors' own word: "speculated").

**Rao Y., Qian Y., She X., Yang J., He P., Jiang Y., Wang M., Xiang W. (2018). "Pellicle formation, microbial succession and lactic acid utilisation during the aerobic deteriorating process of Sichuan pickle." *Int. J. Food Sci. Technol.* 53(3):767–775.**
URL: https://pubmed.ncbi.nlm.nih.gov/ (AGR record: Europe PMC ID IND605893571) · [doi:10.1111/ijfs.13652](https://doi.org/10.1111/ijfs.13652)
- Pellicle formation was "featured by microbial growth, pellicle formation, **lactic acid decrease and pH elevation**."
- **"the resulting pH of 4.8–5.0 initiated the growth of more undesirable organisms, and the pellicle bacterial diversity changed greatly."**
- Pellicle-forming organisms were **bacteria** (*Lb. plantarum*, *Bacillus amyloliquefaciens*, *B. subtilis*, *Citrobacter freundii*, 9 species total).
- **Confidence: strong** for the lactic-acid-consumption → pH-rise sequence. **Important caveat: the organisms were bacterial, not fungal.**

**Does it permit *Clostridium botulinum*? Demonstrated in tomato juice, NOT in sauerkraut.**

**Huhtanen C.N., Naghski J., Custer C.S., Russell R.W. (1976). "Growth and toxin production by *Clostridium botulinum* in moldy tomato juice." *Appl. Environ. Microbiol.* 32(5):711–715. (USDA ARS Eastern Regional Research Center)**
URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC170388/ · [doi:10.1128/aem.32.5.711-715.1976](https://doi.org/10.1128/aem.32.5.711-715.1976)
- Cladosporium sp. and Penicillium sp. formed mats on pH 4.2 tomato juice. **C. botulinum spores germinated, grew out and produced toxin.**
- Toxin titres in mouldy juice reached **10³–10⁴ (reciprocal of titre)**.
- **Sorbic acid at 100 µg/mL completely inhibited the mould for 6 months; 50 µg/mL gave partial inhibition.** With mould inhibited, *C. botulinum* did not grow out or produce gas.
- **Confidence: strong** (definitive primary demonstration; USDA ARS).

**Odlaug T.E., Pflug I.J. (1979). "*Clostridium botulinum* growth and toxin production in tomato juice containing *Aspergillus gracilis*." *Appl. Environ. Microbiol.* 37(3):496–504.**
URL: https://europepmc.org/articles/PMC243244 · [doi:10.1128/aem.37.3.496-504.1979](https://doi.org/10.1128/aem.37.3.496-504.1979)
- **Type A strain grew at pH 4.9 but not pH 4.8; type B strain grew at pH 5.1 but not pH 5.0** (10³ spores/mL, 120 d, 22/32 °C; at 10 spores/mL there was no growth at pH 4.8–5.1).
- In **nonhermetic** units: heavy mycelial mat in 3–5 days; **"The change in pH from 4.2 to approximately pH 6.5 at the surface occurred only when the unit was nonhermetic."** C. botulinum grew and produced toxin at all depths sampled.
- In **hermetic** units: **mould mat was thin; no pH gradient detected (pH stayed 4.2 throughout); but C. botulinum growth and low-level toxin production still occurred, associated with the mycelial mat — <10 LD₅₀/mL, mean 6.5 LD₅₀/mL.** (For scale, the authors note *C. botulinum* can produce up to 2 × 10⁶ LD₅₀/mL under optimum conditions.)
- **"for toxin production C. botulinum and the mold had to occupy the same environment"** — physical separation by dialysis tubing (12,000 MWCO) abolished both growth and toxin.
- Sorbic acid/filterable-growth-factor tests were **negative** — no diffusible mould factor was responsible.
- **Confidence: strong.** Note the important nuance: **even without a measurable pH rise, co-located mould + *C. botulinum* produced low-level toxin.** This complicates the simple "mould raises pH → botulism" story.

**Odlaug T.E., Pflug I.J. (1978). "*Clostridium botulinum* and Acid Foods." *J. Food Prot.* 41(7):566–573.**
URL: https://pubmed.ncbi.nlm.nih.gov/30795102/ · [doi:10.4315/0362-028X-41.7.566](https://doi.org/10.4315/0362-028X-41.7.566)
- **"Clostridium botulinum cannot grow at a pH of ⩽ 4.6."**
- **"Of the 722 total botulism outbreaks reported from 1899 to 1975, only 34 (4.7%) involved acid foods. Home-canned acid foods were implicated in 34 of the 35 acid food outbreaks."**
- Four conditions required for a botulism hazard in an acid food: (a) viable spores, (b) contamination with other microorganisms via process failure/post-process contamination, (c) food composition + storage conditions conducive to growth, (d) **metabiosis**.
- **Confidence: strong** (authoritative review by the same group; the 4.7 % figure is the standard epidemiological anchor).

### A.3.3 Official/extension position on the kahm vs mould distinction

**DiCaprio E., Marco M., Finnegan P., Hanlon M. (2022). "Common issues with fermented fruits and vegetables." UC Davis Department of Food Science and Technology / UC ANR, Version 1.0, 15 March 2022.**
URL: https://ucfoodsafety.ucdavis.edu/sites/g/files/dgvnsk7366/files/media/documents/Troubleshooting%20fermented%20fruits%20and%20vegetables%20FINAL.pdf
Verbatim, under the heading **"Normal: Yeast"**:

> "White, grey, or pink films may form on the surface of fermenting fruits or vegetables. This film is typically yeast, often referred to by home fermenters as **Kahm yeast**. For some fermentations, such as the olives shown below, yeast growth is necessary for flavor and softening of the fruit. For other ferments, such as sauerkraut, yeast should be periodically removed during fermentation. **Excessive yeast growth can lead to off flavors or textures and reduce acidity. The pH can be checked periodically to ensure it does not rise above 4.6.**"

Verbatim, under the heading **"Abnormal: Mold"**:

> "**Molds require oxygen to grow. Molds can grow on the surface of the ferment at the air interface. Mold growth can occur anytime during the fermentation process and is a sign of a failed fermentation. If you confirm mold growth on any part of a ferment, it should be immediately discarded.** Mold is typically green, blue, brown, or black in color."

And, caption to a photograph:

> "White mold growth on sauerkraut stored outside brine, causing it to change color to purple instead of red due to **an increase in pH** and subsequent pigment color change."

- **Confidence: strong** as an *authoritative institutional position*. This is the cleanest official document that (i) names kahm yeast, (ii) classifies it as **normal**, (iii) classifies mould as **abnormal → discard**, and (iv) explicitly ties surface growth to a **pH rise** and the **pH 4.6** threshold.
- **This is the single most useful document in this entire report for your practical question.**

**National Center for Home Food Preservation (USDA-adapted). "Causes and Possible Solutions for Problems with Fermented Pickles," adapted from *So Easy to Preserve*, 6th ed. (2014), Bulletin 989, University of Georgia Cooperative Extension (rev. Andress E.L., Harrison J.A.).**
URL: https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/causes-and-possible-solutions-for-problems-with-fermented-pickles/
Verbatim:

> "**Scum on the brine surfaces while curing cucumbers.** Cause: 1. **Wild yeasts and bacteria that feed on the acid thus reducing the concentration if allowed to accumulate.** Prevention: 1. **Remove scum as often as needed.**"

- **Confidence: strong.** Note this is the UGA/NCHFP position on **pickles**; there is no equivalent scum row in the sauerkraut recipe (which instead says "remove scum if it forms", see §B.5).

**NCHFP "General Information on Fermenting" (adapted from USDA *Complete Guide to Home Canning*, Agriculture Information Bulletin No. 539, revised 2015).**
URL: https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/general-information-on-fermenting/
Verbatim:

> "**Caution: The level of acidity in a pickled product is as important to its safety as it is to taste and texture.** … **There must be a minimum, uniform level of acid throughout the mixed product to prevent the growth of botulinum bacteria.**"

> "the salt used in making fermented sauerkraut and brined pickles not only provides characteristic flavor but also **is vital to safety and texture**. In fermented foods, salt favors the growth of desirable bacteria while inhibiting the growth of others. **Caution: Do not attempt to make sauerkraut or fermented pickles by cutting back on the salt required.**"

> "Pickle products are subject to spoilage from microorganisms, **particularly yeasts and molds**, as well as enzymes…"

- **Confidence: strong** (USDA AIB-539 lineage).

### A.3.4 The bottom line on A.3

| Question | Answer | Confidence |
|---|---|---|
| Are the yeasts themselves toxic? | No — no cytotoxicity, genotoxicity signals, or toxin/AMR genes in the major WCFY. | **strong** |
| Is the film a quality defect? | Yes — off-odours, texture softening, glycerol/erythritol accumulation, economic loss. | **strong** |
| Does the film consume lactic acid and raise pH? | Yes — demonstrated for oxidative yeasts in fermented cucumber. | **strong** |
| Does a raised pH create *C. botulinum* risk? | Mechanistically yes (pH > 4.6 permits growth; mould + *C. botulinum* co-located produced toxin in tomato juice). **But no study has demonstrated this in sauerkraut, and no botulism outbreak has been traced to sauerkraut (see §B.7).** | **moderate** for mechanism, **NO DATA** for sauerkraut specifically |
| Official position | Kahm yeast = normal; remove periodically; keep pH < 4.6. Mould = failed fermentation; discard. | **strong** |

---

## A.4 Quantitative salt and pH thresholds for SUPPRESSION

### A.4.1 Salt — the honest answer is "salt does not reliably suppress it"

| Finding | Source | Confidence |
|---|---|---|
| **20 % (w/v) NaCl did not kill any of 5 WCFY strains**; counts of *C. sake*, *P. kudriavzevii*, *H. uvarum* fell significantly across 10 → 15 → 20 %, but all survived. High-salt kimchi brining "did not have a significant effect on inhibiting white colony formation." | Kim et al. 2021, https://pmc.ncbi.nlm.nih.gov/articles/PMC8003234/ | **strong** |
| **7 % (w/v) salt did NOT inhibit pellicle formation** in Sichuan paocai; **1.5 % (v/v) Baijiu (Chinese liquor) DID inhibit** it. | Xian et al. 2022, [doi:10.1016/j.foodres.2022.111130](https://doi.org/10.1016/j.foodres.2022.111130) | **strong** |
| All sauerkraut yeast isolates grew at **>5 % NaCl**, many at **10 %**. | Satora et al. 2020, https://pmc.ncbi.nlm.nih.gov/articles/PMC7767181/ | **moderate** |
| In Chinese sauerkraut, **"Suitable salt concentration can effectively inhibit the reproduction of fungi and E. coli"**; LAB population and metabolic rate fell and lactic acid yield decreased as salt increased. **Salt levels tested were not extractable from the abstract.** | Xiong T. et al. (2016), *LWT* 69:169–174, [doi:10.1016/j.lwt.2015.12.057](https://doi.org/10.1016/j.lwt.2015.12.057) | **moderate** — *I could not access the full text to get the % values.* |

**Plain reading:** there is **no demonstrated NaCl concentration, within the range compatible with edible sauerkraut (≈1.5–3 %) or even with extreme brining (up to 20 %), that suppresses kahm/white-colony yeast.** The oft-repeated advice "add more salt to prevent kahm" is **not supported by the primary literature**. The one intervention shown to work in a controlled vegetable-fermentation trial was **1.5 % v/v ethanol (Baijiu)**.

**Confidence that "more salt prevents kahm" is unsupported: strong** (three independent studies, three different fermentation systems, all negative).

### A.4.2 pH — what is actually known

- No study has established a pH threshold below which kahm/WCFY yeasts cannot grow in brine. Kim et al. (2021) found growth at **pH 3**; Satora et al. (2020) found no growth at **pH 3.2** in lactic-acid-containing medium. **Confidence: weak-or-contested.**
- The pH 4.6 threshold in extension guidance is a **product-safety** threshold (botulism), **not** a kahm-suppression threshold. UC Davis instructs you to check pH "to ensure it does not rise above 4.6" — because above 4.6 the *product* is unsafe, not because the yeast stops growing.
- **By analogy only (different organisms, different mechanism):** in fermented cucumbers, anaerobic lactic-acid degradation occurred at **pH 3.8, 4.3 and 5.0 regardless of NaCl concentration (0–6 %)**; at **pH 3.2**, only cucumbers fermented with **6 % NaCl** resisted degradation over 18 months at 25 °C. Source: Johanningsmeier S.D., Franco W., Pérez-Díaz I., McFeeters R.F. (2012), *J. Food Sci.* 77(7):M397–M404, [doi:10.1111/j.1750-3841.2012.02780.x](https://doi.org/10.1111/j.1750-3841.2012.02780.x). **Confidence: strong for the study; weak for extrapolation to yeast-driven films.**

### A.4.3 Interventions actually shown to work

| Intervention | Effect | Source | Confidence |
|---|---|---|---|
| **10 % freeze-dried garlic powder + 1.75 % cinnamon ethanol extract + 0.02 % xanthan gum**, sprayed on the kimchi surface | **Delayed white-colony formation by an average of 17 days at 10 °C** vs control | Kim et al. 2021, https://pmc.ncbi.nlm.nih.gov/articles/PMC8003234/ | **strong** |
| **1.5 % (v/v) Baijiu** added to paocai brine | Inhibited pellicle-related microorganism growth | Xian et al. 2022, [doi:10.1016/j.foodres.2022.111130](https://doi.org/10.1016/j.foodres.2022.111130) | **moderate** |
| **Perilla frutescens essential oil** | MIC 0.4 µL/mL; MFC 1.6 µL/mL (*C. tropicalis*), 0.8 µL/mL (*P. kluyveri*) | Cai et al. 2023, [doi:10.3390/foods12081593](https://doi.org/10.3390/foods12081593) | **moderate** (in vitro) |
| **S-DBD plasma**, 67.8 % RH, 120 min, 15.1 °C | Maximum WCFY (*K. servazzii*) reduction; pH/TA/VOCs unchanged | Song et al. 2024, *LWT* 207:116637, [doi:10.1016/j.lwt.2024.116637](https://doi.org/10.1016/j.lwt.2024.116637) | **moderate** |
| **Storage at 4 °C or below** | White colonies did not appear until **35 days at 4 °C**; reproduced at 15 °C but **not at 4 °C** | Suzuki et al. 2018, [doi:10.1080/09168451.2017.1419853](https://doi.org/10.1080/09168451.2017.1419853) | **strong** |
| **Excluding oxygen** | **Did not prevent WCFY growth** (anaerobic colonies formed at 4, 10, 20 °C) | Kim et al. 2021 | **moderate** |

**Active concentrations measured in the garlic/cinnamon work (for reproducibility):**
- Alliin: 10 % FGP **32.73 ± 4.99 mg/L**; 20 % **63.41 ± 9.16**; 30 % **93.38 ± 14.58**; raw garlic filtrate **60.43 ± 0.55 mg/L**.
- Cinnamaldehyde: water extract **581.79 mg/L**; hot-water **89.22**; 30 % EtOH **2 942.29**; 50 % EtOH **9 278.27**; **80 % EtOH 11 521.08**; 100 % EtOH **7 832.66 mg/L**.
- **Confidence: strong.**

---

## A.5 Does kahm presence correlate with SLOWER or ARRESTED acidification?

**Yes — for film-forming oxidative yeasts, in cucumber and pickle systems. This is one of the better-supported claims in the whole report.**

| Finding | Source | Confidence |
|---|---|---|
| *Issatchenkia occidentalis* and *Pichia manshurica* **utilise lactic and acetic acids during aerobic metabolism**, associated with **increases in brine pH** and chemical reduction of the matrix. | Franco & Pérez-Díaz 2012, [doi:10.1016/j.fm.2012.07.013](https://doi.org/10.1016/j.fm.2012.07.013) | **strong** |
| Aerobic deterioration of Sichuan pickle: **"pellicle formation, lactic acid decrease and pH elevation."** The resulting **pH 4.8–5.0** initiated growth of further undesirable organisms. | Rao et al. 2018, [doi:10.1111/ijfs.13652](https://doi.org/10.1111/ijfs.13652) | **strong** |
| **Continuous oxygen exposure → premature pellicle formation and aerobic deterioration by day 32**, with texture destruction and stench (arenes, aldehydes). **Intermittent oxygen exposure → pellicle formation by day 48.** **No oxygen exposure → no pellicle, favourable scent and texture, maintained through 64 days.** | Rao Y., Qian Y., Tao Y., She X., Li Y., Che Z., Li H., Liu L. (2019), *RSC Adv.* 9:38520–38530, [doi:10.1039/C9RA05994F](https://doi.org/10.1039/C9RA05994F) · full text: https://europepmc.org/articles/PMC9075915 | **strong** |
| Sauerkraut in which yeast and mould develop "is characterized by a high content of esters responsible for the aroma of raw cabbage, **while the amount of lactic acid is much lower in it** than in products in which the contaminating microbiota did not occur." | Satora et al. 2020, https://pmc.ncbi.nlm.nih.gov/articles/PMC7767181/ (citing ref. 7 — **I could not retrieve that primary source**) | **weak-or-contested** — review-level assertion via a secondary citation |
| **Converse evidence — the film does not always change the chemistry:** non-volatile metabolite profiles in kimchi soup did **not** differ significantly between open and closed packaging despite different WCFY communities. Glycerol increased. | Kim et al. 2020, [doi:10.1016/j.foodres.2020.109315](https://doi.org/10.1016/j.foodres.2020.109315) | **strong** |
| **Official (non-quantitative) statement:** "Excessive yeast growth can lead to off flavors or textures and **reduce acidity**." | UC Davis 2022, URL in §A.3.3 | **strong as institutional position** |

**Synthesis:** the "reduced acidity" effect is real and mechanistically demonstrated, but the *magnitude* of pH rise attributable to the film specifically (as opposed to concurrent LAB-driven secondary fermentation) is **not quantified in any sauerkraut study I could find**. In cucumber, the acid-consumers are predominantly **bacteria** (*L. buchneri*, *Acetobacter* spp.) at least as much as yeasts. **Confidence: moderate.**

---

## A.6 TOPIC A — explicit NO-DATA flags

1. **No peer-reviewed literature uses the term "kahm yeast."** (Europe PMC `TITLE:"kahm"` = 0 hits.)
2. **No study measures kahm/film yeast growth limits in sauerkraut brine.** All growth-limit data are from YPD broth/agar or WL agar.
3. **No quantitative MIC/MBC of lactic or acetic acid against kahm yeasts in fermented vegetables.**
4. **No established NaCl concentration that suppresses kahm yeast in any fermented vegetable.** (Three studies, all negative.)
5. **No study of *Candida lambica* or *Pichia anomala* in sauerkraut or kimchi** located.
6. **No study measuring the pH delta attributable specifically to the surface film in sauerkraut** (as opposed to total batch pH).
7. **No study of mycotoxin or biogenic-amine production by kahm yeasts in sauerkraut.** (Biogenic amines have been correlated with *Candida*/*Pichia*/*Kazachstania* in Chinese sauerkraut — Wang et al. 2023 — but causation was not established.)

---

# TOPIC B — MOULD ON FERMENTED VEGETABLES

## B.1 Species actually isolated from fermented vegetables

**This section contains a significant negative finding: I could not locate a primary isolation study of filamentous moulds specifically from sauerkraut surface growth.** The available data are from kimchi and from culture-independent fungal community surveys of sauerkraut that are dominated by yeasts.

### B.1.1 Kimchi — best primary dataset

**Seo S.-H., Park S.-E., Kim E.-J., Cho K.-M., Kwon S.-J., Son H.-S. (2020). "Effect of Fungi on Metabolite Changes in Kimchi During Fermentation." *Molecules* 25(21):5040.**
URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC7663158/ · [doi:10.3390/molecules25215040](https://doi.org/10.3390/molecules25215040)
- First ITS2 amplicon study of the kimchi fungal community. Day 30: Ascomycota **72.70 %**, Basidiomycota **1.12 %**, unidentified fungi **25.89 %**.
- **Dominant genera:** ***Cladosporium, Fusarium, Pichia, Botrytis, Alternaria***.
- **Species-level:** ***Botrytis cinerea* 4.64 %**, ***Fusarium oxysporum* 3.87 %**, *Pichia kluyveri* 3.21 %, ***Aspergillus niger* 0.96 %**, *Kodamaea ohmeri* 0.71 %. ***Aspergillus flavus*** also detected.
- **Metabolites attributed to fungi** (unchanged by ampicillin treatment): produced — alanine, thymine, galacturonic acid, malonic acid; consumed — malic acid, oxaloacetic acid, galactitol, glucose, mannitol.
- **Critical statement on mycotoxins: "There is no research on the mycotoxins contained in kimchi."** (as of 2020). The authors note the risk cannot be excluded because red pepper powder is mycotoxin-sensitive.
- **Confidence: strong** for the species list. **Note:** these are largely **field/plant-pathogenic genera arriving on raw ingredients**, not necessarily surface spoilage moulds.

### B.1.2 Sauerkraut / suancai — mostly yeasts, some moulds

**Liang H. et al. (2020). "Effects of salt concentration on microbial diversity and volatile compounds during suancai fermentation." *Food Microbiology* 91:103537.**
URL: https://pubmed.ncbi.nlm.nih.gov/32539973/ · [doi:10.1016/j.fm.2020.103537](https://doi.org/10.1016/j.fm.2020.103537)
- Fungal genera detected included ***Candida*, *Cladosporium*, *Gibberella*, *Aspergillus***. *Cladosporium* was **significantly affected by salt concentration**. **6 % salt** gave higher *Lactobacillus* abundance and better taste quality.
- **Confidence: moderate** (relative abundance only, no isolation).

**Wang et al. 2023** (URL in §A.1.1): sauerkraut fungal community dominated by **yeasts** (*Debaryomyces, Candida, Pichia, Dipodascus, Naumovozyma, Kazachstania, Cutaneotrichosporon, Tausonia, Wickerhamomyces, Issatchenkia*). **No filamentous mould genera reported as dominant.**
- **Confidence: strong** as a negative (i.e., moulds were not a major component of these 27 sauerkrauts).

### B.1.3 Species you asked about — status

| Genus | Reported on fermented vegetables? | Confidence |
|---|---|---|
| *Penicillium* | Yes — in the classic tomato-juice mould work (Huhtanen et al. 1976). **Not confirmed as a sauerkraut surface isolate in any study I found.** | **moderate** (tomato), **NO DATA** (sauerkraut) |
| *Aspergillus* | *A. niger* (0.96 %) and *A. flavus* in kimchi (Seo et al. 2020); *Aspergillus* in suancai (Liang et al. 2020). *A. gracilis* in tomato juice (Odlaug & Pflug 1979). | **strong** (kimchi/suancai) |
| *Mucor* | **NO DATA FOUND** on sauerkraut/kimchi/fermented cucumber. | — |
| *Rhizopus* | **NO DATA FOUND** on sauerkraut/kimchi/fermented cucumber. (Growth-limit data exist for the genus generally — see §B.2.) | — |
| *Botrytis* | *B. cinerea* 4.64 % in kimchi (Seo et al. 2020). | **strong** (kimchi) |
| *Cladosporium* | 4th most abundant genus in kimchi (Seo et al. 2020); in suancai, salt-sensitive (Liang et al. 2020); the mould used in the classic Huhtanen et al. 1976 toxin study. | **strong** |
| *Fusarium* | *F. oxysporum* 3.87 % in kimchi (Seo et al. 2020). | **strong** (kimchi) |
| *Alternaria* | Top-5 genus in kimchi (Seo et al. 2020). | **strong** (kimchi) |
| *Geotrichum* | Cited in the vegetable-silage literature as a surface organism that consumes organic acids under aerobic conditions (*G. candidum* / *Candida mycoderma*). **Source is Satora et al. 2020's introduction citing ref. 6; I could not retrieve the primary source.** | **weak** |

---

## B.2 Growth conditions

**Again — a large NO-DATA area. I found no study reporting pH, a_w, salt or temperature limits for moulds *growing on fermented vegetables*.** The numbers below come from the general food-mycology literature and are **not** measured in brine.

### B.2.1 Water activity (a_w) — the dominant factor

**Racchi I., Scaramuzza N., Hidalgo A., Berni E. (2020). "Combined effect of water activity and pH on the growth of food-related ascospore-forming molds." *Annals of Microbiology* 70:69.**
URL: https://link.springer.com/article/10.1186/s13213-020-01612-6 · [doi:10.1186/s13213-020-01612-6](https://doi.org/10.1186/s13213-020-01612-6)
- 90 days at 25 °C; sucrose-controlled a_w **0.85, 0.88, 0.92, 0.95**; pH **3.20, 3.50, 3.80, 4.20, 4.60**.
- **Minimum conditions for germination and growth:**
  - *Chaetomium flavoviride*: a_w **0.92**, pH **3.50** (46 days)
  - *Chaetomium globosum*: a_w **0.92**, pH **3.80** (39 days)
  - *Talaromyces trachyspermus*: a_w **0.92**, pH **3.20** (13 days)
  - *Talaromyces bacillisporus*: a_w **0.88**, pH **3.20** (39 days)
  - *Aspergillus hiratsukae*: a_w **0.88**, pH **3.20** (33 days)
  - *Aspergillus thermomutatus*: a_w **0.88**, pH **3.20** (27 days)
- **"a_w exerted the largest influence on the growth of all tested species, while pH was significant only for *Chaetomium* isolates."**
- **Confidence: moderate** (excellent design, but these are heat-resistant ascospore formers in juice/jam systems — not brine moulds).

**Gock M.A., Hocking A.D., Pitt J.I., Poulos P.G. (2003). "Influence of temperature, water activity and pH on growth of some xerophilic fungi." *Int. J. Food Microbiol.* 81(1):11–19.**
URL: https://pubmed.ncbi.nlm.nih.gov/12423914/ · [doi:10.1016/S0168-1605(02)00166-6](https://doi.org/10.1016/S0168-1605(02)00166-6)
- *Penicillium roqueforti* germinated at **a_w 0.82 at 25 °C**, **0.86 at 30 °C**, and **could not germinate at 37 °C**.
- *Eurotium repens* germinated at **a_w 0.70 at 30 °C**; **0.74 at 25 and 37 °C**.
- *Chrysosporium xerophilum* and *Xeromyces bisporus* germinated at **a_w 0.70 at all three temperatures**.
- pH tested: **4.5, 5.5, 6.5, 7.5**. **"These fungi all grew faster under acidic than neutral pH conditions."**
- **Confidence: moderate** (rigorous, but xerophiles of baked goods/confectionery — not vegetable-spoilage moulds).

**Dagnas S., Onno B., Membré J.-M. (2014). "Modeling growth of three bakery product spoilage molds as a function of water activity, temperature and pH." *Int. J. Food Microbiol.* 186:95–104.**
URL: https://pubmed.ncbi.nlm.nih.gov/25016208/ · [doi:10.1016/j.ijfoodmicro.2014.06.022](https://doi.org/10.1016/j.ijfoodmicro.2014.06.022) · OA: https://hal.inrae.fr/hal-02638021
- *Eurotium repens*, *Aspergillus niger*, *Penicillium corylophilum*; 428 growth curves; **temperature 15–35 °C, a_w 0.80–0.98, pH 3–7**.
- **"it was not possible to apply the same set of secondary model equations to the three mold species given that the growth rate varied significantly with the factors pH and water activity."**
- **Confidence: moderate** — useful methodologically, and the **key transferable finding is that mould pH/a_w responses are strongly species-specific and cannot be generalised.**

**Dagnas S., Membré J.-M. (2013). "Predicting and preventing mold spoilage of food products." *J. Food Prot.* 76(3):538–551.**
URL: https://pubmed.ncbi.nlm.nih.gov/23462093/ · [doi:10.4315/0362-028X.JFP-12-349](https://doi.org/10.4315/0362-028X.JFP-12-349)
- Review. **"Several polynomial models and gamma-type models quantifying the effect of water activity and temperature on mold growth are available. To a lesser extent, the effect of pH, ethanol, heat treatment, addition of preservatives, and modified atmospheres on mold growth also have been quantified."**
- **Critically: "mold species variability has not yet been properly addressed, and only a few secondary models have been validated for food products."**
- **Confidence: strong as a statement about the state of knowledge** — i.e., a good citation for "the generalisations you see quoted are not well founded."

### B.2.2 The "moulds grow at pH 2–11" claim

**I could not trace the widely repeated "moulds grow over pH 1.5–11 / 2–8.5" figures to a primary measurement.** The standard textbook (Pitt J.I. & Hocking A.D., *Fungi and Food Spoilage*, 3rd ed., Springer, 2009, [doi:10.1007/978-0-387-92207-2](https://doi.org/10.1007/978-0-387-92207-2)) is the usual ultimate citation, but the numbers as commonly quoted are not traceable to a specific experiment.

**What IS measured:** moulds grow *faster* under acidic than neutral conditions (Gock et al. 2003, direct quote above), and several species grow at **pH 3.20** (Racchi et al. 2020). **The practical implication for fermented vegetables is that pH is NOT a barrier to mould.** That conclusion is safe; the specific range endpoints are not.

- **Confidence: strong** for "pH does not control mould in fermented vegetables." **Confidence: weak** for any quoted pH range.

### B.2.3 Water activity in brine — why a_w is not limiting

**NO STUDY FOUND reporting the a_w of sauerkraut brine.** By inspection: sauerkraut brine is roughly 2–3 % NaCl in a dilute vegetable extract — a_w ≈ 0.98–0.99. Even kimchi brining at 10–20 % NaCl would not bring the *product* below a_w ≈ 0.90, whereas most spoilage moulds grow down to a_w 0.80–0.88 (§B.2.1). **a_w is therefore not a practical control point in brine fermentations.** This is a reasoned inference from the data above, **not** a measured result. **Confidence: moderate as inference; NO DATA as measurement.**

### B.2.4 Oxygen — strong qualitative evidence, weak quantitative

- **Odlaug & Pflug 1979** (URL in §A.3.2) is the best controlled oxygen experiment available: **nonhermetic** units → heavy mycelial mat in **3–5 days**, pH 4.2 → **~6.5** at the surface; **hermetic** units → **thin mat**, **no pH gradient**, pH stayed **4.2** throughout. Loosening the cap made the mat thicken again within 3–5 days.
- **Rao et al. 2019** (URL in §A.5): **continuous** oxygen exposure → deterioration by **day 32**; **intermittent** → **day 48**; **none** → no surface growth through **64 days**.
- **UC Davis 2022** (URL in §A.3.3): **"Molds require oxygen to grow. Molds can grow on the surface of the ferment at the air interface."**
- **Confidence: strong** that oxygen is the controlling factor; **NO DATA** on a quantitative %O₂ or headspace-O₂ threshold, or on oxygen transmission rate of containers, for mould incidence in fermented vegetables. The one relevant packaging study I found (Yu H.J. et al. 2023, "Effect of headspace gas composition in kimchi packaging on the quality characteristics of kimchi," *J. Food Sci. Technol.* 60(10):2695–2703, https://pmc.ncbi.nlm.nih.gov/articles/PMC10439095/) addresses quality, not mould incidence.

### B.2.5 Salt and temperature

- **Salt:** no quantitative NaCl inhibition data for moulds on fermented vegetables located. Extrapolating from a_w data: most spoilage moulds tolerate the NaCl levels achievable in edible sauerkraut. **NO DATA.**
- **Temperature:** `Penicillium roqueforti` could not germinate at 37 °C (Gock et al. 2003). `Aspergillus flavus` has been reported with a minimum growth temperature near 10–12 °C, maximum near 43–48 °C (secondary/tertiary source — https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/aspergillus-terreus). **Confidence: weak** — that temperature range comes from a publisher topic page, not a primary measurement, and I would not cite it without checking the underlying paper.

---

## B.3 The critical food-safety mechanism

The mechanism has **four independently established links**, but **the chain has never been demonstrated end-to-end in sauerkraut.**

**Link 1 — *C. botulinum* cannot grow at pH ≤ 4.6.**
> **"Clostridium botulinum cannot grow at a pH of ⩽ 4.6."**
> Odlaug & Pflug (1978), *J. Food Prot.* 41(7):566–573. https://pubmed.ncbi.nlm.nih.gov/30795102/
> **Confidence: strong.**

**Link 2 — Mould growth raises pH, substantially.**
> Mundt J.O. (1978). "Effect of Mold Growth on the pH of Tomato Juice." *J. Food Prot.* 41(4):267–268. https://pubmed.ncbi.nlm.nih.gov/30795065/ · [doi:10.4315/0362-028X-41.4.267](https://doi.org/10.4315/0362-028X-41.4.267)
> **"Fifty-eight species of 21 genera of molds were grown on tomato juice for 35 days… All molds except two raised the pH from the initial pH 4.1 to a range from 4.9 to greater than 9.0. Thirty-three of the Fungi Imperfecti (53%) raised the pH to values above 7.0. None of the Phycomycetes tested raised the pH above 7.0."**
> **Confidence: strong — but note the matrix is TOMATO JUICE, not sauerkraut. This is the paper that is routinely misattributed to sauerkraut.**

**Link 3 — The pH rise is a *gradient*; the bulk product can stay acid while the microenvironment under the mat becomes neutral.**
> Huhtanen et al. (1976), Table 4, *Appl. Environ. Microbiol.* 32(5):711–715. https://pmc.ncbi.nlm.nih.gov/articles/PMC170388/

*Cladosporium* sp. mat on tomato juice, room temperature:

| Portion | Start pH 4.2 (d6 / d9 / d19) | Start pH 4.6 (d6 / d9 / d19) | Start pH 5.2 (d6 / d9 / d19) |
|---|---|---|---|
| **Underside of mould mat** | **5.8 / 7.0 / 7.8** | **6.4 / 7.3 / 7.9** | **7.0 / 7.7 / 8.2** |
| Topmost 0.5 mL | 5.3 / 6.4 / 7.5 | 6.0 / 6.8 / 7.1 | 6.6 / 7.3 / 7.9 |
| Next 0.5 mL | 4.9 / 5.7 / 7.2 | 5.5 / 6.4 / 6.7 | 6.3 / 7.1 / 7.6 |
| Next 0.5 mL | 4.9 / 5.4 / 7.0 | 5.3 / 6.0 / 6.4 | 5.9 / 6.9 / 7.5 |
| Next 0.5 mL | 4.5 / 5.2 / 6.5 | 5.2 / 5.5 / 5.8 | 5.6 / 6.6 / 7.3 |

> Odlaug & Pflug (1979), Tables 5 & 7, *Appl. Environ. Microbiol.* 37(3):496–504. https://europepmc.org/articles/PMC243244
> Nonhermetic, *Aspergillus gracilis* on pH 4.2 tomato juice: **mycelial mat pH 6.5–6.6; 0–10 mm below the mat pH 5.3–5.4; 40–50 mm below pH 4.6–4.8.**
> Hermetic: **mat pH 4.2–4.3, all depths pH 4.2.**
> Authors: **"The change in pH from 4.2 to approximately pH 6.5 at the surface occurred only when the unit was nonhermetic."**

**Confidence: strong.** These are the two definitive quantitative demonstrations. **Both are tomato juice.**

**Link 4 — *C. botulinum* then grows and produces toxin.**
> Huhtanen et al. (1976): **"Clostridium botulinum spores in these moldy tomato juices germinated, grew out, and produced toxin."** Gas and anaerobic colonies appeared **4 days after heavy mat formation** (i.e., ~7 days from inoculation). Toxin titres up to **10³–10⁴**. **Confidence: strong.**
> Odlaug & Pflug (1979): in **nonhermetic** units, toxin at all depths. In **hermetic** units — **"C. botulinum growth and low levels of toxin production (<10 LD₅₀/mL) still occurred and were associated with the mycelial mat"** (mean 6.5 LD₅₀/mL). **"for toxin production C. botulinum and the mold had to occupy the same environment"** — physical separation abolished it. **Confidence: strong.**

**Additional key thresholds from the same body of work:**

| Matrix | Organism | Growth / no growth | Source | Confidence |
|---|---|---|---|---|
| Tomato juice | *C. botulinum* type A (A16037) | **grew at pH 4.9, not at pH 4.8** (10³ spores/mL, 32 °C) | Odlaug & Pflug 1979 | **strong** |
| Tomato juice | *C. botulinum* type B (B15580) | **grew at pH 5.1, not at pH 5.0** | Odlaug & Pflug 1979 | **strong** |
| Tomato juice | *C. botulinum* (10 strains) | **lowest minimum pH observed = 5.24** (type B, strain C7); **no growth in ANY culture at pH 4.76, 4.92 or 5.04** | Huhtanen et al. 1976, Table 1 | **strong** |
| Cucumber puree | *C. botulinum* | **outgrowth inhibited at pH 4.8 but not at pH 5.0** | Ito K.A., Chen J.K., Lerke P.A., Seeger M.L., Unverferth J.A. (1976), *Appl. Environ. Microbiol.* 32(1):121–124, https://europepmc.org/articles/PMC170016 | **strong** |
| Fresh-pack pickles (whole cucumbers) | *C. botulinum* | **0.9 % acetic acid in the brine prevented outgrowth from inocula as high as 10⁶ spores/cucumber** | Ito et al. 1976 (same) | **strong** |
| Various food substrates | *C. botulinum* | **pH 4.70 inhibited growth and toxin production** | Townsend C.T., Yee L., Mercer W.A. (1954), *Food Res.* 19:536–542 (cited in Huhtanen et al. 1976) | **moderate** (secondary citation; I did not access the 1954 paper) |

**Epidemiological anchor:**
> Odlaug & Pflug (1978): **"Of the 722 total botulism outbreaks reported from 1899 to 1975, only 34 (4.7%) involved acid foods. Home-canned acid foods were implicated in 34 of the 35 acid food outbreaks."** Tomato products were implicated in **17 of the 34**. **Confidence: strong.**

**On the historical botulism cases associated with mould:** Huhtanen et al. (1976) recount that among nine acid-food botulism outbreaks: apricots (3), tomato products (3), pears (2, confirmed by Meyer & Gunnison), persimmon (1). **"One of the apricot reports noted the presence of mold on the surface of the canned fruit."** That is the closest thing to a documented mould-associated botulism case in this literature — and it is **canned apricots, not sauerkraut**. **Confidence: moderate** (historical review, not primary outbreak investigation).

---

## B.4 Quantitative summary — how much does pH rise, and how much oxygen is needed?

**pH rise attributable to mould (all in tomato juice):**

| Starting pH | Mould | Duration | Peak pH under mat | Source |
|---|---|---|---|---|
| 4.2 | *Cladosporium* sp. | 19 d | **7.8** | Huhtanen 1976 |
| 4.6 | *Cladosporium* sp. | 19 d | **7.9** | Huhtanen 1976 |
| 5.2 | *Cladosporium* sp. | 19 d | **8.2** | Huhtanen 1976 |
| 4.1 | 58 species / 21 genera | 35 d | **4.9 to >9.0**; 53 % of Fungi Imperfecti >7.0 | Mundt 1978 |
| 4.2 | *Aspergillus gracilis*, nonhermetic | 25 d | **~6.5** (surface only) | Odlaug & Pflug 1979 |
| 4.2 | *Aspergillus gracilis*, **hermetic** | 25 d | **4.2 (no rise)** | Odlaug & Pflug 1979 |

**Oxygen requirement (quantitative, from Odlaug & Pflug 1979):**
- **Nonhermetic** (cap loose, free headspace gas exchange, verified by vacuum test) → **heavy mat in 3–5 days**, mat reaches maximum in **8–10 days**.
- **Hermetic** (cap tight, no headspace exchange) → **thin mat in 3–5 days**, and **"even after 60 days of incubation, the mycelial mat in the hermetic unit did not increase in thickness."**
- **Loosening the cap → mat thickened within 3–5 days.**
- **Confidence: strong.** This is a clean, reproducible dose-response to oxygen availability.
- **NO DATA** on a %O₂ or headspace-O₂ threshold, or on container oxygen-transmission rates, for mould incidence in fermented vegetables.

**Time-to-surface-growth in pickle, from Rao et al. 2019:** continuous O₂ → **day 32**; intermittent O₂ → **day 48**; sealed → none in **64 days**.

**Inhibitor data point (mould-specific):** **sorbic acid 100 µg/mL completely inhibited *Cladosporium* sp. in tomato juice for 6 months; 50 µg/mL gave partial inhibition.** With the mould inhibited, *C. botulinum* did not grow out. Source: Huhtanen et al. 1976. **Confidence: strong.** *(Note: sorbate is permitted in some commercial acidified vegetable products but not in kimchi — see Kim et al. 2021, which notes that the Korean Food Code prohibits chemical preservatives in kimchi and CODEX does not permit them.)*

---

## B.5 USDA / extension guidance: discard the whole batch, or skim?

**The official positions are NOT uniform — and the split is between "mould" and "yeast/scum", not between institutions.**

### Position 1 — MOULD: DISCARD (UC Davis, 2022)

> **"Molds require oxygen to grow. Molds can grow on the surface of the ferment at the air interface. Mold growth can occur anytime during the fermentation process and is a sign of a failed fermentation. If you confirm mold growth on any part of a ferment, it should be immediately discarded. Mold is typically green, blue, brown, or black in color."**

DiCaprio E., Marco M., Finnegan P., Hanlon M. (2022). *Common issues with fermented fruits and vegetables.* UC Davis Dept. of Food Science and Technology / UC ANR, Version 1.0 (15 March 2022).
URL: https://ucfoodsafety.ucdavis.edu/sites/g/files/dgvnsk7366/files/media/documents/Troubleshooting%20fermented%20fruits%20and%20vegetables%20FINAL.pdf

> Also: **"A putrid smell indicates a failed fermentation… If a ferment smells noticeably spoiled, especially in combination with mold growth, it should immediately be discarded."**

**Confidence: strong** as an institutional position. **This is the clearest official "discard the batch" statement I found.**

### Position 2 — SCUM / SURFACE YEAST: REMOVE IT AND KEEP THE PRODUCT (USDA/NCHFP, UGA, Oregon State, and OSU Extension experts)

**USDA *Complete Guide to Home Canning* (AIB-539, rev. 2015), Sauerkraut, as republished by NCHFP:**
> "If you use jars as weight, you will have to check the kraut **2 to 3 times each week and remove scum if it forms**."
URL: https://nchfp.uga.edu/how/ferment/recipes/sauerkraut

**NCHFP / UGA, "Causes and Possible Solutions for Problems with Fermented Pickles":**
> "Scum on the brine surfaces while curing cucumbers. Cause: Wild yeasts and bacteria that feed on the acid thus reducing the concentration if allowed to accumulate. Prevention: **Remove scum as often as needed.**"
URL: https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/causes-and-possible-solutions-for-problems-with-fermented-pickles/

**Oregon State University / Pacific Northwest Extension Publication PNW 355, *Pickling Vegetables*:**
> "Check the container several times a week and **promptly remove surface scum or mold.**"
URL: https://extension.oregonstate.edu/sites/default/files/documents/pnw355.pdf

**Extension expert response (Nellie Oehler, Oregon State University Extension, via Ask Extension, 28 Aug 2025), quoting NCHFP instructions:**
> "As long as you **remove the mold and scum** (the white film that forms on the top) regularly and your pickles do not become mushy, and smell bad they should be safe."
> "**Fermenting pickles cure slowly. Check the container several times a week and promptly remove surface scum or mold. Caution: If the pickles become soft, slimy, or develop a disagreeable odor, discard them.**"
URL: https://ask.extension.org/kb/faq.php?id=915739

**Contrasting expert response (Jeanne Brandt, Oregon State University Extension, Ask Extension, 11 Aug 2014) — discard when the *product* is affected:**
> "A scum can form on the top that is mold and **should be skimmed off as soon as it forms. If allowed to grow, it will spread through the container. No coating should develop on the cucumbers themselves during the process, so that is a bad sign as well.** … I would recommend discarding these without tasting."
URL: https://ask.extension.org/kb/faq.php?id=205768

### How to reconcile

The **discriminating criteria are consistent across all sources**:
1. **Is it on the surface only, or has it penetrated the product?** Coating on the vegetables themselves → discard.
2. **Is the texture intact?** Soft/slimy → discard.
3. **Is the smell acceptable?** Putrid → discard.
4. **What colour is it?** Green/blue/brown/black → mould → UC Davis says discard. White/grey/pink film → yeast → remove and continue, but monitor pH.

**Confidence: strong** that this is the reconciliation, and **strong** that no US authority tells you to discard a batch solely because a white surface film formed.

**The one thing every source agrees on:** keep the produce **submerged**. PNW 355: "Cabbage and cucumbers must be kept **1 to 2 inches under the brine** while fermenting."

**Heat processing resolves it:** NCHFP notes that processing fermented pickles in a boiling-water canner "will prevent both of these problems" (yeast/mould spoilage and enzymes). The NCHFP dill-pickle guidance gives **raw pack pints 10 min / quarts 15 min at 0–1 000 ft**, or **low-temperature pasteurization at 180–185 °F for 30 min**.

---

## B.6 TOPIC B — explicit NO-DATA flags

1. **NO study measuring pH before/after mould growth in SAUERKRAUT.** All quantitative pH-rise data are from tomato juice (Mundt 1978; Huhtanen et al. 1976; Odlaug & Pflug 1979). The "classic sauerkraut study" that is habitually cited **does not exist** — Mundt 1978 is tomato juice.
2. **NO documented botulism outbreak attributed to mouldy sauerkraut.** Europe PMC query `"moldy sauerkraut"` → **0 hits**. `"mouldy sauerkraut" OR "moldy sauerkraut" OR "mouldy cabbage"` → **1 hit, unrelated** (a laundry-odour paper). `ABSTRACT:"sauerkraut" AND ABSTRACT:"botulinum"` → **0 hits**. `"botulism" AND "sauerkraut"` restricted to Case Reports → **0 hits**. **This is a strong, reproducible negative.**
3. **NO primary isolation study of filamentous moulds from sauerkraut surface growth.** Sauerkraut fungal community studies are dominated by yeasts.
4. **NO mycotoxin measurements in sauerkraut or kimchi.** Seo et al. (2020) state explicitly: **"There is no research on the mycotoxins contained in kimchi."**
5. **NO study reporting the water activity of sauerkraut brine.**
6. **NO quantitative %O₂/headspace-O₂ threshold for mould incidence in fermented vegetables.**
7. **NO quantitative NaCl inhibition data for moulds on fermented vegetables.**
8. **NO verified pH-range endpoints for "food spoilage moulds" traceable to a primary measurement.** The "pH 2–11" figure is untraceable.

---

# 3. Master table — *Clostridium botulinum* pH thresholds

| Threshold | Matrix | Source | Confidence |
|---|---|---|---|
| **pH ≤ 4.6 = no growth** | (general, regulatory) | Odlaug & Pflug 1978, https://pubmed.ncbi.nlm.nih.gov/30795102/ | **strong** |
| **4.70 inhibits growth and toxin production** | multiple food substrates | Townsend et al. 1954, *Food Res.* 19:536–542 (secondary) | **moderate** |
| **pH 4.8 inhibits; pH 5.0 does not** | cucumber puree | Ito et al. 1976, https://europepmc.org/articles/PMC170016 | **strong** |
| **Type A: 4.8 no / 4.9 yes; Type B: 5.0 no / 5.1 yes** | tomato juice, 10³ spores/mL | Odlaug & Pflug 1979, https://europepmc.org/articles/PMC243244 | **strong** |
| **Lowest minimum pH for any of 10 strains = 5.24; no growth at pH 4.76, 4.92, 5.04** | tomato juice | Huhtanen et al. 1976, https://pmc.ncbi.nlm.nih.gov/articles/PMC170388/ | **strong** |
| **0.9 % acetic acid in brine prevents outgrowth from 10⁶ spores/cucumber** | fresh-pack whole pickles | Ito et al. 1976 | **strong** |
| **Sorbic acid 100 µg/mL inhibits the mould → no *C. botulinum* outgrowth** | tomato juice | Huhtanen et al. 1976 | **strong** |
| **pH rise is a gradient; bulk can stay <4.6 while the microenvironment exceeds it** | tomato juice + *Aspergillus gracilis* | Odlaug & Pflug 1979 (Tables 5, 7) | **strong** |
| **Even without a measurable pH rise, co-located mould + *C. botulinum* produced <10 LD₅₀/mL toxin** | hermetic tomato juice | Odlaug & Pflug 1979 | **strong** |

**The pattern:** every controlled determination puts the *C. botulinum* pH cut-off between **4.6 and 5.2**, with the most common result being **4.8–5.0** in these vegetable-adjacent matrices. The regulatory **4.6** is conservative. **The gap between a healthy sauerkraut (pH 3.3–3.8) and the danger zone is large — roughly 1.0–1.5 pH units — which is why the pH-rise mechanism requires substantial, sustained acid consumption to become a hazard.**

---

# 4. Claims I could NOT trace to a primary source (do not repeat these)

| Commonly repeated claim | Status |
|---|---|
| "Kahm yeast is *Candida krusei* / *Pichia membranaefaciens* / *Debaryomyces hansenii*" | The **term** has no scientific definition. Each named species has independent evidence (see §A.1) but there is no primary source establishing "kahm yeast = species X." |
| "Kahm yeast grows at pH 2.5–8.0, optimum pH 4.0–4.5" | **No source found.** No study has measured this for surface-film yeasts in brine. The specific numbers appear to be folk knowledge. |
| "Kahm yeast tolerates up to X % NaCl; suppressed above Y %" | **Directly contradicted** by Kim et al. 2021 (survival at 20 % NaCl) and Xian et al. 2022 (7 % salt did not inhibit). No suppression threshold exists in the literature. |
| "Kahm yeast is an obligate aerobe" | **Contradicted** by Kim et al. 2021 (anaerobic colonies formed at 4, 10, 20 °C). |
| "Mundt (1978) showed mould raises sauerkraut pH" | **Misattribution.** Mundt 1978 is **tomato juice**, not sauerkraut. |
| "Mouldy sauerkraut has caused botulism" | **No case report, outbreak report, or primary study found.** |
| "Moulds grow at pH 1.5–11 / 2–8.5" | **No traceable primary measurement.** Cite species-specific data instead (Racchi 2020; Gock 2003). |
| "Discard any ferment that has mould on it" | **Not a uniform official position.** UC Davis (2022) says discard mould. NCHFP/USDA, Oregon State PNW 355, and OSU Extension experts say **remove surface scum/mould** and discard only if soft, slimy, or off-odour. |
| "Mouldy silage is the agricultural analogue of mouldy sauerkraut" | The mechanism is documented in silage (mould → pH rise → *Clostridium* spp. → spoilage/botulism in cattle/livestock) but **I did not retrieve a primary quantitative silage study in this session.** Treat as a lead. The best entry point found was: Tuovinen O.H., Niemelä S.I., Rajala-Schultz P.J. (2025), "The Role of Microbes in Ensiling," *Microorganisms* 13(10):2237, https://pubmed.ncbi.nlm.nih.gov/41156697/ |

---

# 5. Practical synthesis (what the evidence actually supports)

**For kahm yeast / white surface film:**
1. It is a **quality defect, not a toxicological hazard.** The dominant organisms have been through formal safety assessment with no cytotoxicity or toxin/AMR genes (Jeong et al. 2022; Kim et al. 2019).
2. It is **not controlled by salt, by pH within the edible range, or by excluding oxygen.** All three have been tested and failed (Kim et al. 2021; Xian et al. 2022).
3. It **is** controlled by **cold storage** (4 °C delayed onset to 35 d; Suzuki et al. 2018), by **garlic/cinnamon surface treatment** (+17 d at 10 °C; Kim et al. 2021), and by **1.5 % ethanol** (Xian et al. 2022).
4. The **real risk is acid consumption over time.** Monitor pH. UC Davis: check pH "to ensure it does not rise above 4.6." Above 4.6, the product is in botulism territory regardless of what grew there.

**For mould:**
1. Mould on a ferment is **the marker of an aerobic failure** — a seal, headspace, or submersion problem, not a salt problem.
2. The **quantitative mechanism is established** (mould raises pH locally and in bulk; pH > 4.6 permits *C. botulinum*; toxin has been produced in mouldy acid food), **but it has never been demonstrated in sauerkraut.**
3. Guidance is split on discard-vs-skim, and the split tracks **mould vs yeast**, not institution. When mould is confirmed, UC Davis says discard the batch. When it is a white/grey/pink film and the product is firm and smells right, NCHFP/USDA and Oregon State say remove it and continue.
4. **The universal preventive is submersion** ("1 to 2 inches under the brine," PNW 355) plus an airlock or tight lid.

---

*Report compiled from primary literature retrieved 2025. All URLs were fetched and verified during compilation except where explicitly marked "could not retrieve" or "secondary citation".*
