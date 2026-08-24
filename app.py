"""Rangeland Observatory Dashboard — modular Shiny dashboard."""

from shiny import App, ui
from starlette.routing import Route

from modules.climate_history import climate_history_server, climate_history_ui
from modules.drought_monitor import drought_monitor_server, drought_monitor_ui
from modules.home import home_server, home_ui
from modules.resource_management import resource_management_server, resource_management_ui
from services.grassland_tiles import grassland_tile


app_ui = ui.page_navbar(
    ui.nav_spacer(),
    ui.nav_panel(
        ui.span("Overview", data_i18n="nav.overview"),
        home_ui("home"),
        value="Overview",
        icon=ui.tags.i(class_="bi bi-grid-1x2-fill"),
    ),
    ui.nav_panel(
        ui.span("Grassland health", data_i18n="nav.grassland_health"),
        drought_monitor_ui("drought"),
        value="Grassland health",
        icon=ui.tags.i(class_="bi bi-activity"),
    ),
    ui.nav_panel(
        ui.span("Climate history", data_i18n="nav.climate_history"),
        climate_history_ui("climate"),
        value="Climate history",
        icon=ui.tags.i(class_="bi bi-graph-up"),
    ),
    ui.nav_panel(
        ui.span("County planning", data_i18n="nav.county_planning"),
        resource_management_ui("resources"),
        value="County planning",
        icon=ui.tags.i(class_="bi bi-map-fill"),
    ),
    ui.nav_control(
        ui.tags.button(
            "EN / SW",
            id="language-toggle",
            type="button",
            class_="btn language-toggle-btn",
            aria_label="Switch dashboard language between English and Swahili",
        ),
    ),
    title=ui.div(
        ui.span("Rangeland", class_="brand-mark"),
        ui.span("Observatory Dashboard", class_="brand-name"),
        class_="brand-lockup",
    ),
    id="primary_nav",
    navbar_options=ui.navbar_options(bg="#123d3a", theme="dark", collapsible=True),
    header=ui.tags.head(
        ui.tags.meta(name="viewport", content="width=device-width, initial-scale=1"),
        ui.tags.link(rel="preconnect", href="https://fonts.googleapis.com"),
        ui.tags.link(rel="preconnect", href="https://fonts.gstatic.com", crossorigin=""),
        ui.tags.link(
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap",
            rel="stylesheet",
        ),
        ui.tags.link(
            rel="stylesheet",
            href="https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css",
        ),
        ui.tags.script(src="https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js"),
        ui.include_css("www/styles.css"),
        ui.include_js("www/maplibre-maps.js"),
        ui.include_js("www/loading-skeletons.js"),
        ui.include_js("www/page-navigation.js"),
        ui.include_js("www/resource-location.js"),
        ui.include_js("www/i18n.js"),
    ),
    footer=ui.div(
        ui.span("© Rangeland Observatory Dashboard 2026"),
        class_="app-footer",
    ),
)


def server(input, output, session):
    home_server("home")
    drought_monitor_server("drought")
    climate_history_server("climate")
    resource_management_server("resources")


app = App(app_ui, server)
app.starlette_app.router.routes.insert(
    0,
    Route("/grassland_cog_v2/{z:int}/{x:int}/{y:int}.png", grassland_tile),
)
