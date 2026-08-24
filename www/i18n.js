(function () {
  // Client-side i18n: this app's static UI chrome is built once at import time by
  // Shiny (@module.ui), not re-rendered per request, so a server-side reactive
  // language switch would mean converting every UI function into a reactive
  // render.ui. Swapping text after render — like the existing raster/geojson
  // helpers already do for map data — gets the same visible result without
  // touching the Python reactive architecture.
  //
  // Coverage: static chrome (headings, nav, disclaimers, form labels) plus the
  // small fixed vocabulary that gets rendered dynamically but only ever takes a
  // known value (GCI classes, metric names, resource types). Ward names,
  // dates, numbers, and compound sentences that interpolate data are left in
  // English — translating those would need real template-based i18n, not a
  // text-swap layer.
  //
  // Table cell values inside Shiny's DataGrid widgets (the ward assessment and
  // resource register tables) are rendered by that widget's own JS, not by
  // this app's markup, so they are out of reach for this layer and stay in
  // English.

  const translations = {
    en: {
      "nav.overview": "Overview",
      "nav.grassland_health": "Grassland health",
      "nav.climate_history": "Climate history",
      "nav.county_planning": "County planning",

      "filter.focus_county": "Focus county",
      "filter.county": "County",
      "filter.year": "Year",
      "filter.month": "Month",

      "gci_class.very_poor": "Very poor",
      "gci_class.poor": "Poor",
      "gci_class.moderate": "Moderate",
      "gci_class.good": "Good",
      "gci_class.very_good": "Very good",
      "gci_class.no_data": "No data",

      "metric_name.gci": "GCI",
      "metric_name.ndvi": "NDVI",
      "metric_name.rainfall": "Rainfall",
      "metric_name.temperature": "Temperature",
      "metric_name.msdi": "MSDI",
      "metric_name.grazing_condition": "Grazing condition",
      "metric_name.land_temperature": "Land temperature",

      "metric_card.very_poor": "Very poor",
      "metric_card.poor": "Poor",
      "metric_card.good_very_good": "Good / very good",
      "metric_card.median_gci": "Median GCI",
      "metric_card_note.very_poor": "Immediate field verification",
      "metric_card_note.poor": "Priority monitoring",
      "metric_card_note.good_very_good": "Potential local alternatives",

      "resource_type.grass_seed_bank": "Grass seed bank",
      "resource_type.borehole": "Borehole",
      "resource_type.nursery": "Nursery",
      "resource_type.animal_watering_point": "Animal watering point",

      "gci_panel.kicker": "HOW TO READ THE INDEX",
      "gci_panel.heading": "One grazing score, four environmental signals",
      "gci_panel.subtitle": "GCI combines normalized satellite and climate observations into a 0–100 monthly ward score. Higher values indicate more favorable grazing conditions.",
      "gci_panel.score_mark_note": "Monthly ward condition",
      "gci_panel.formula_note": "All components are normalized to a common 0–100 scale before weighting.",

      "gci_signal.ndvi.name": "NDVI",
      "gci_signal.ndvi.description": "Vegetation greenness and photosynthetic vigor from satellite imagery.",
      "gci_signal.ndvi.direction": "Greener vegetation raises GCI",
      "gci_signal.rainfall.name": "Rainfall",
      "gci_signal.rainfall.description": "Monthly precipitation supporting pasture growth and recovery.",
      "gci_signal.rainfall.direction": "More available rainfall raises GCI",
      "gci_signal.temperature.name": "Temperature",
      "gci_signal.temperature.description": "Land-surface heat pressure affecting vegetation and water demand.",
      "gci_signal.temperature.direction": "Reverse scored · excess heat lowers GCI",
      "gci_signal.landsat_red_band_msdi.name": "Landsat red-band MSDI",
      "gci_signal.landsat_red_band_msdi.description": "A 3×3 moving standard deviation measuring fine-scale variation in red reflectance.",
      "gci_signal.landsat_red_band_msdi.direction": "Reverse scored · higher variability lowers GCI",

      "drought.eyebrow": "GRASSLAND EARLY ACTION",
      "drought.heading": "Grassland health intelligence",
      "drought.subtitle": "Track the supplied Grazing Condition Index across wards and identify areas requiring attention or offering stronger conditions.",
      "drought.chip_ward_level": " Ward-level analysis",
      "drought.chip_signals": "GCI · NDVI · rainfall · temperature",
      "drought.map_card_title": "Ward grazing conditions",
      "drought.raster_legend": "ESA grassland cover",
      "drought.signal_card_title": "Monthly signals vs long-term average",
      "drought.movement_card_title": "Grazing movement guidance",
      "drought.table_card_title": "Ward assessment",
      "drought.table_card_note": "Selected monthly GCI observation with supporting indicators",
      "drought.disclaimer": "Movement guidance is a screening signal, not a movement instruction. Confirm water access, land tenure, conflict risk and local authority advice before action.",
      "drought.guidance_none_kicker": "NO STRONG DECLINE SIGNAL",
      "drought.guidance_none_heading": "Maintain local monitoring",
      "drought.guidance_none_body": "No wards in the selected county are currently classified as poor or very poor.",
      "drought.guidance_kicker": "EARLY-ACTION SCREEN",
      "drought.guidance_body": "Assess good or very good wards within the county or directly across its border, limited to roughly 150 km from a poor-condition ward:",
      "drought.guidance_no_destination": "No suitable stable or stronger ward was found locally or directly across the county border.",

      "history.eyebrow": "CLIMATE HISTORY",
      "history.heading": "Grazing conditions through wet and dry cycles",
      "history.subtitle": "See the full 2019–2026 record for one county, including the documented 2020–2023 Horn of Africa drought and the 2023 El Niño short-rains recovery.",
      "history.chip_trend": " Multi-year trend",
      "history.chip_signals": "GCI · NDVI · rainfall · temperature",
      "history.gci_card_title": "Grazing Condition Index · full record",
      "history.signals_card_title": "Vegetation, rainfall and temperature · full record",
      "history.yearly_card_title": "Mean annual GCI by county",
      "history.disclaimer": "Shaded periods mark a documented regional drought and recovery, not a forecast for any single ward.",

      "home.live": "LIVE",
      "home.ops_picture": "REGIONAL OPERATIONS PICTURE",
      "home.headline_1": "Monitoring grasslands",
      "home.headline_2": "in the ASAL regions.",
      "home.hero_subtitle": "Use earth observation to understand grazing conditions and compare ward-level changes across the ASAL region.",
      "home.intel_1_label": "AREAS MONITORED",
      "home.intel_1_note": "ASAL counties",
      "home.intel_2_label": "POOR / VERY POOR",
      "home.intel_2_value": "10 wards",
      "home.intel_2_note": "Priority grazing-condition screen",
      "home.intel_3_label": "GOOD / VERY GOOD",
      "home.intel_3_value": "12 wards",
      "home.intel_3_note": "Potential alternatives to assess",
      "home.evidence_eyebrow": "GRASSLAND EVIDENCE",
      "home.evidence_heading": "Remote Sensing for Grassland Management",
      "home.evidence_subtitle": "Combine vegetation, rainfall, heat and surface-variability indicators into an actionable view of grazing conditions.",
      "home.teaser_1_kicker": "GRASSLAND MONITORING",
      "home.teaser_1_heading": "Monitor grazing condition",
      "home.teaser_1_body": "Map GCI classes alongside NDVI, rainfall and heat to identify poor wards and stronger alternatives.",
      "home.teaser_1_link": "Explore grasslands  →",
      "home.teaser_2_kicker": "COUNTY ACTION PLANNING",
      "home.teaser_2_heading": "Connect conditions to resources",
      "home.teaser_2_body": "Create a county brief and use the power of crowdsourcing to map resources in the rangelands and connect them to grazing conditions.",
      "home.teaser_2_link": "Open county planning  →",

      "resources.eyebrow": "COUNTY ACTION REPORT",
      "resources.heading": "Plan from conditions to resources",
      "resources.subtitle": "Turn monthly grazing indicators into a county brief, then map the assets available for early action.",
      "resources.chip_brief": " Data-driven county brief",
      "resources.chip_inventory": " Mapped resource inventory",
      "resources.map_card_kicker": "COUNTY RESOURCE MAP",
      "resources.record_button": "Record resource",
      "resources.brief_card_title": "County planning brief",
      "resources.download_pdf": "Download PDF",
      "resources.comparison_card_title": "Selected month vs long-term reference",
      "resources.forecast_card_title": "Next-month trend outlook",
      "resources.register_card_title": "Registered county resources",
      "resources.download_gpkg": "Download GeoPackage",
      "resources.none_this_month": "None in this month",
      "resources.priority_wards_kicker": "PRIORITY WARDS",
      "resources.priority_wards_heading": "Poor / very poor",
      "resources.stronger_wards_kicker": "STRONGER WARDS",
      "resources.stronger_wards_heading": "Good / very good",
      "resources.outlook_kicker": "NEXT-MONTH OUTLOOK",
      "resources.forecast_method_note": "Ranges come from a linear trend fitted only to prior observations for the forecast month; they express statistical uncertainty, not a weather forecast.",
      "resources.planning_checks_heading": "Recommended planning checks",
      "resources.brief_caveat": "This report is a screening brief. Confirm resource access, ownership, condition and local authority guidance before deployment.",

      "resources.form_step": "COUNTY RESOURCE INVENTORY",
      "resources.field_name": "Resource name",
      "resources.field_type": "Resource type",
      "resources.field_ward": "Ward",
      "resources.field_village": "Village / settlement",
      "resources.field_status": "Operating status",
      "resources.field_capacity": "Capacity / availability",
      "resources.field_geocode": "Find a Kenyan town or settlement",
      "resources.field_use_location": "Use my location",
      "resources.field_or_manual": "or enter coordinates manually below",
      "resources.field_location_status": "Choose GPS, town search, or manual coordinates.",
      "resources.field_geocoder_disclosure": "Town autocomplete runs locally from the GeoNames Kenya gazetteer. ",
      "resources.field_latitude": "Latitude",
      "resources.field_longitude": "Longitude",
      "resources.field_notes": "Notes",
      "resources.save_button": "Save resource ",
    },
    sw: {
      "nav.overview": "Muhtasari",
      "nav.grassland_health": "Afya ya Malisho",
      "nav.climate_history": "Historia ya Hali ya Hewa",
      "nav.county_planning": "Mipango ya Kaunti",

      "filter.focus_county": "Kaunti Lengwa",
      "filter.county": "Kaunti",
      "filter.year": "Mwaka",
      "filter.month": "Mwezi",

      "gci_class.very_poor": "Mbaya sana",
      "gci_class.poor": "Mbaya",
      "gci_class.moderate": "Wastani",
      "gci_class.good": "Nzuri",
      "gci_class.very_good": "Nzuri sana",
      "gci_class.no_data": "Hakuna data",

      "metric_name.gci": "GCI",
      "metric_name.ndvi": "NDVI",
      "metric_name.rainfall": "Mvua",
      "metric_name.temperature": "Joto",
      "metric_name.msdi": "MSDI",
      "metric_name.grazing_condition": "Hali ya malisho",
      "metric_name.land_temperature": "Joto la ardhi",

      "metric_card.very_poor": "Mbaya sana",
      "metric_card.poor": "Mbaya",
      "metric_card.good_very_good": "Nzuri / nzuri sana",
      "metric_card.median_gci": "Wastani wa GCI",
      "metric_card_note.very_poor": "Uthibitisho wa haraka uwandani",
      "metric_card_note.poor": "Ufuatiliaji wa kipaumbele",
      "metric_card_note.good_very_good": "Njia mbadala za karibu",

      "resource_type.grass_seed_bank": "Benki ya mbegu za nyasi",
      "resource_type.borehole": "Kisima",
      "resource_type.nursery": "Kitalu",
      "resource_type.animal_watering_point": "Sehemu ya kunyweshea mifugo",

      "gci_panel.kicker": "JINSI YA KUSOMA KIELEZO",
      "gci_panel.heading": "Alama moja ya malisho, ishara nne za mazingira",
      "gci_panel.subtitle": "GCI huchanganya uchunguzi wa satelaiti na hali ya hewa uliosawazishwa kuwa alama ya kata ya kila mwezi kati ya 0–100. Thamani za juu zaidi zinaonyesha hali bora zaidi za malisho.",
      "gci_panel.score_mark_note": "Hali ya kata kila mwezi",
      "gci_panel.formula_note": "Vipengele vyote vinasawazishwa kwa kipimo cha pamoja cha 0–100 kabla ya kupimwa uzito.",

      "gci_signal.ndvi.name": "NDVI",
      "gci_signal.ndvi.description": "Ubichi wa mimea na nguvu ya usanisinuru kutoka picha za satelaiti.",
      "gci_signal.ndvi.direction": "Mimea mibichi zaidi huinua GCI",
      "gci_signal.rainfall.name": "Mvua",
      "gci_signal.rainfall.description": "Jumla ya mvua ya kila mwezi inayosaidia ukuaji na urejeshaji wa malisho.",
      "gci_signal.rainfall.direction": "Mvua zaidi inayopatikana huinua GCI",
      "gci_signal.temperature.name": "Joto",
      "gci_signal.temperature.description": "Shinikizo la joto la ardhi linaloathiri mimea na mahitaji ya maji.",
      "gci_signal.temperature.direction": "Alama iliyogeuzwa · joto kupita kiasi hupunguza GCI",
      "gci_signal.landsat_red_band_msdi.name": "MSDI ya bendi nyekundu ya Landsat",
      "gci_signal.landsat_red_band_msdi.description": "Mkengeuko wa kawaida unaosogea wa 3×3 unaopima tofauti ndogondogo za mng'ao mwekundu.",
      "gci_signal.landsat_red_band_msdi.direction": "Alama iliyogeuzwa · tofauti kubwa hupunguza GCI",

      "drought.eyebrow": "HATUA YA MAPEMA YA MALISHO",
      "drought.heading": "Ufahamu wa afya ya malisho",
      "drought.subtitle": "Fuatilia Kielezo cha Hali ya Malisho kilichotolewa kwa kila kata na tambua maeneo yanayohitaji uangalizi au yanayotoa hali bora zaidi.",
      "drought.chip_ward_level": " Uchambuzi wa kila kata",
      "drought.chip_signals": "GCI · NDVI · mvua · joto",
      "drought.map_card_title": "Hali za malisho za kata",
      "drought.raster_legend": "Mfuniko wa nyasi wa ESA",
      "drought.signal_card_title": "Ishara za kila mwezi dhidi ya wastani wa muda mrefu",
      "drought.movement_card_title": "Mwongozo wa uhamishaji wa mifugo",
      "drought.table_card_title": "Tathmini ya kata",
      "drought.table_card_note": "Uchunguzi wa GCI wa mwezi uliochaguliwa pamoja na viashiria vinavyounga mkono",
      "drought.disclaimer": "Mwongozo wa uhamishaji ni ishara ya uchunguzi, si amri ya kuhama. Thibitisha upatikanaji wa maji, umiliki wa ardhi, hatari ya migogoro na ushauri wa mamlaka za mtaa kabla ya kuchukua hatua.",
      "drought.guidance_none_kicker": "HAKUNA ISHARA KUBWA YA KUSHUKA",
      "drought.guidance_none_heading": "Endelea na ufuatiliaji wa kawaida",
      "drought.guidance_none_body": "Hakuna kata katika kaunti uliyochagua inayoainishwa kuwa mbaya au mbaya sana kwa sasa.",
      "drought.guidance_kicker": "UCHUNGUZI WA HATUA YA MAPEMA",
      "drought.guidance_body": "Chunguza kata zilizo na hali nzuri au nzuri sana ndani ya kaunti au moja kwa moja ng'ambo ya mpaka wake, hadi kilomita 150 kutoka kata yenye hali mbaya:",
      "drought.guidance_no_destination": "Hakuna kata thabiti au bora zaidi iliyopatikana karibu au ng'ambo ya moja kwa moja ya mpaka wa kaunti.",

      "history.eyebrow": "HISTORIA YA HALI YA HEWA",
      "history.heading": "Hali za malisho katika misimu ya mvua na ukame",
      "history.subtitle": "Angalia rekodi kamili ya 2019–2026 kwa kaunti moja, ikiwemo ukame wa Pembe ya Afrika wa 2020–2023 na urejeshaji wa mvua fupi za El Niño za 2023.",
      "history.chip_trend": " Mwelekeo wa miaka mingi",
      "history.chip_signals": "GCI · NDVI · mvua · joto",
      "history.gci_card_title": "Kielezo cha Hali ya Malisho · rekodi kamili",
      "history.signals_card_title": "Mimea, mvua na joto · rekodi kamili",
      "history.yearly_card_title": "Wastani wa GCI wa kila mwaka kwa kaunti",
      "history.disclaimer": "Vipindi vilivyotiwa kivuli vinaonyesha ukame na urejeshaji uliothibitishwa wa kikanda, si utabiri wa kata yoyote mahususi.",

      "home.live": "MOJA KWA MOJA",
      "home.ops_picture": "PICHA YA UTENDAJI WA KIKANDA",
      "home.headline_1": "Ufuatiliaji wa malisho",
      "home.headline_2": "katika maeneo ya ASAL.",
      "home.hero_subtitle": "Tumia uchunguzi wa dunia kuelewa hali za malisho na kulinganisha mabadiliko ya kila kata katika eneo la ASAL.",
      "home.intel_1_label": "MAENEO YANAYOFUATILIWA",
      "home.intel_1_note": "Kaunti za ASAL",
      "home.intel_2_label": "MBAYA / MBAYA SANA",
      "home.intel_2_value": "kata 10",
      "home.intel_2_note": "Uchunguzi wa kipaumbele wa hali ya malisho",
      "home.intel_3_label": "NZURI / NZURI SANA",
      "home.intel_3_value": "kata 12",
      "home.intel_3_note": "Njia mbadala zinazoweza kuchunguzwa",
      "home.evidence_eyebrow": "USHAHIDI WA MALISHO",
      "home.evidence_heading": "Uchunguzi wa Mbali kwa Usimamizi wa Malisho",
      "home.evidence_subtitle": "Changanya viashiria vya mimea, mvua, joto na tofauti za uso kuwa mtazamo unaoweza kutekelezwa wa hali za malisho.",
      "home.teaser_1_kicker": "UFUATILIAJI WA MALISHO",
      "home.teaser_1_heading": "Fuatilia hali ya malisho",
      "home.teaser_1_body": "Onyesha madaraja ya GCI pamoja na NDVI, mvua na joto kutambua kata mbaya na njia mbadala bora.",
      "home.teaser_1_link": "Chunguza malisho  →",
      "home.teaser_2_kicker": "MIPANGO YA HATUA ZA KAUNTI",
      "home.teaser_2_heading": "Unganisha hali na rasilimali",
      "home.teaser_2_body": "Tengeneza muhtasari wa kaunti na tumia nguvu ya ushirikiano wa jamii kuweka ramani ya rasilimali za malisho na kuziunganisha na hali za malisho.",
      "home.teaser_2_link": "Fungua mipango ya kaunti  →",

      "resources.eyebrow": "RIPOTI YA HATUA ZA KAUNTI",
      "resources.heading": "Panga kutoka hali hadi rasilimali",
      "resources.subtitle": "Geuza viashiria vya malisho vya kila mwezi kuwa muhtasari wa kaunti, kisha weka ramani ya rasilimali zinazopatikana kwa hatua za mapema.",
      "resources.chip_brief": " Muhtasari wa kaunti unaotokana na data",
      "resources.chip_inventory": " Orodha ya rasilimali zilizowekwa ramani",
      "resources.map_card_kicker": "RAMANI YA RASILIMALI ZA KAUNTI",
      "resources.record_button": "Sajili rasilimali",
      "resources.brief_card_title": "Muhtasari wa mipango ya kaunti",
      "resources.download_pdf": "Pakua PDF",
      "resources.comparison_card_title": "Mwezi uliochaguliwa dhidi ya rejeleo la muda mrefu",
      "resources.forecast_card_title": "Mtazamo wa mwelekeo wa mwezi ujao",
      "resources.register_card_title": "Rasilimali za kaunti zilizosajiliwa",
      "resources.download_gpkg": "Pakua GeoPackage",
      "resources.none_this_month": "Hakuna mwezi huu",
      "resources.priority_wards_kicker": "KATA ZA KIPAUMBELE",
      "resources.priority_wards_heading": "Mbaya / mbaya sana",
      "resources.stronger_wards_kicker": "KATA BORA",
      "resources.stronger_wards_heading": "Nzuri / nzuri sana",
      "resources.outlook_kicker": "MTAZAMO WA MWEZI UJAO",
      "resources.forecast_method_note": "Viwango hutokana na mwelekeo wa mstari uliolinganishwa na uchunguzi wa awali wa mwezi huo pekee; vinaonyesha kutokuwa na uhakika wa kitakwimu, si utabiri wa hali ya hewa.",
      "resources.planning_checks_heading": "Ukaguzi wa mipango unaopendekezwa",
      "resources.brief_caveat": "Ripoti hii ni muhtasari wa uchunguzi. Thibitisha upatikanaji wa rasilimali, umiliki, hali na mwongozo wa mamlaka za mtaa kabla ya kutekeleza.",

      "resources.form_step": "ORODHA YA RASILIMALI ZA KAUNTI",
      "resources.field_name": "Jina la rasilimali",
      "resources.field_type": "Aina ya rasilimali",
      "resources.field_ward": "Kata",
      "resources.field_village": "Kijiji / makazi",
      "resources.field_status": "Hali ya uendeshaji",
      "resources.field_capacity": "Uwezo / upatikanaji",
      "resources.field_geocode": "Tafuta mji au makazi ya Kenya",
      "resources.field_use_location": "Tumia mahali nilipo",
      "resources.field_or_manual": "au weka viwianishi mwenyewe hapa chini",
      "resources.field_location_status": "Chagua GPS, utafutaji wa mji, au viwianishi vya mkono.",
      "resources.field_geocoder_disclosure": "Utambuzi wa miji hufanya kazi ndani ya kifaa kutoka orodha ya maeneo ya Kenya ya GeoNames. ",
      "resources.field_latitude": "Latitudo",
      "resources.field_longitude": "Longitudo",
      "resources.field_notes": "Maelezo",
      "resources.save_button": "Hifadhi rasilimali ",
    },
  };

  const STORAGE_KEY = "rod-language";

  function currentLang() {
    return document.documentElement.dataset.lang || "en";
  }

  function applyTranslations(root) {
    const lang = currentLang();
    const scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const text = translations[lang] && translations[lang][key];
      if (text !== undefined) el.textContent = text;
    });
  }

  function setLanguage(lang) {
    document.documentElement.dataset.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable (private browsing, etc.) -- toggle still works for this page view.
    }
    applyTranslations(document);
    const toggle = document.getElementById("language-toggle");
    if (toggle) toggle.setAttribute("aria-pressed", lang === "sw" ? "true" : "false");
  }

  document.addEventListener("DOMContentLoaded", () => {
    let stored = "en";
    try {
      stored = localStorage.getItem(STORAGE_KEY) || "en";
    } catch {
      // ignore
    }
    setLanguage(stored === "sw" ? "sw" : "en");

    document.addEventListener("click", (event) => {
      const button = event.target.closest("#language-toggle");
      if (!button) return;
      setLanguage(currentLang() === "sw" ? "en" : "sw");
    });

    // Shiny re-renders reactive outputs (render.ui, tab switches) as fresh DOM
    // nodes -- reuse the same MutationObserver pattern as maplibre-maps.js and
    // loading-skeletons.js so newly-inserted content gets translated too.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) =>
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          applyTranslations(node);
        })
      );
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("shown.bs.tab", () => applyTranslations(document));
  });
})();
