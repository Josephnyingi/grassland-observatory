from shiny import module, render, ui

from services.grassland_health import STATUS_COLORS, county_health_geojson, ward_health
from .data import i18n_slug
from .maplibre import map_container


@module.ui
def home_ui():
    return ui.div(
        ui.div(
            ui.output_ui("regional_map"),
            ui.div(
                ui.div(ui.span("LIVE", class_="live-badge", data_i18n="home.live"), ui.span("REGIONAL OPERATIONS PICTURE", class_="map-kicker", data_i18n="home.ops_picture"), class_="map-meta"),
                ui.h1(ui.span("Monitoring grasslands", data_i18n="home.headline_1"), ui.tags.br(), ui.span("in the ASAL regions.", data_i18n="home.headline_2")),
                ui.p("Use earth observation to understand grazing conditions and compare ward-level changes across the ASAL region.", data_i18n="home.hero_subtitle"),
                ui.div(ui.output_ui("latest_period"), class_="hero-chips"),
                class_="map-headline",
            ),
            ui.div(*[
                ui.span(ui.span(class_="health-dot", style=f"background:{color}"), ui.span(label, data_i18n=f"gci_class.{i18n_slug(label)}"))
                for label, color in STATUS_COLORS.items()
            ], class_="map-legend grassland-legend"),
            class_="immersive-map",
        ),
        ui.div(
            ui.div(
                ui.div(ui.span("01", class_="intel-index"), ui.div(ui.span("AREAS MONITORED", class_="intel-label", data_i18n="home.intel_1_label"), ui.strong("3"), ui.span("ASAL counties", data_i18n="home.intel_1_note")), class_="intel-stat"),
                ui.div(ui.span("02", class_="intel-index"), ui.div(ui.span("POOR / VERY POOR", class_="intel-label", data_i18n="home.intel_2_label"), ui.strong("10 wards", data_i18n="home.intel_2_value"), ui.span("Priority grazing-condition screen", data_i18n="home.intel_2_note")), class_="intel-stat critical"),
                ui.div(ui.span("03", class_="intel-index"), ui.div(ui.span("GOOD / VERY GOOD", class_="intel-label", data_i18n="home.intel_3_label"), ui.strong("12 wards", data_i18n="home.intel_3_value"), ui.span("Potential alternatives to assess", data_i18n="home.intel_3_note")), class_="intel-stat"),
                class_="overview-intelligence",
                style="background:linear-gradient(135deg,#0b3935,#123f3a)",
            ),
            class_="overview-intelligence-wrap",
        ),
        ui.div(ui.div(ui.tags.span("GRASSLAND EVIDENCE", class_="eyebrow", data_i18n="home.evidence_eyebrow"), ui.h2("Remote Sensing for Grassland Management", data_i18n="home.evidence_heading")), ui.p("Combine vegetation, rainfall, heat and surface-variability indicators into an actionable view of grazing conditions.", data_i18n="home.evidence_subtitle"), class_="section-heading"),
        ui.div(
            ui.tags.a(
                ui.div(ui.tags.i(class_="bi bi-activity"), class_="teaser-icon"),
                ui.span("GRASSLAND MONITORING", class_="teaser-kicker", data_i18n="home.teaser_1_kicker"),
                ui.h3("Monitor grazing condition", data_i18n="home.teaser_1_heading"),
                ui.p("Map GCI classes alongside NDVI, rainfall and heat to identify poor wards and stronger alternatives.", data_i18n="home.teaser_1_body"),
                ui.span("Explore grasslands  →", class_="teaser-link", data_i18n="home.teaser_1_link"),
                href="#",
                aria_label="Open Grassland health",
                onclick="event.preventDefault(); document.querySelector('[data-value=\"Grassland health\"]')?.click();",
                class_="module-teaser module-teaser-link drought-teaser",
            ),
            ui.tags.a(
                ui.div(ui.tags.i(class_="bi bi-pin-map"), class_="teaser-icon"),
                ui.span("COUNTY ACTION PLANNING", class_="teaser-kicker", data_i18n="home.teaser_2_kicker"),
                ui.h3("Connect conditions to resources", data_i18n="home.teaser_2_heading"),
                ui.p("Create a county brief and use the power of crowdsourcing to map resources in the rangelands and connect them to grazing conditions.", data_i18n="home.teaser_2_body"),
                ui.span("Open county planning  →", class_="teaser-link", data_i18n="home.teaser_2_link"),
                href="#",
                aria_label="Open County planning",
                onclick="event.preventDefault(); document.querySelector('[data-value=\"County planning\"]')?.click();",
                class_="module-teaser module-teaser-link resource-teaser",
            ),
            class_="module-teasers reduced-modules",
        ),
        class_="page-shell",
    )


@module.server
def home_server(input, output, session):
    @render.ui
    def latest_period():
        latest = ward_health()["date"].max()
        return ui.span(latest.strftime("Updated %B %Y"))

    @render.ui
    def regional_map():
        geojson = county_health_geojson()
        return map_container(
            [], height=650, label="Latest county grassland health map", geojson=geojson,
            show_controls=False, locked=True, fit_geojson=True,
        )
