import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from shiny import module, render, ui
from shinywidgets import output_widget, render_widget

from services.gee_climate import climate_data
from services.grassland_health import county_signal_series
from .data import AOIS
from .loading import loading_frame

DROUGHT_START, DROUGHT_END = "2020-10-01", "2023-03-01"
WET_ANOMALY_START, WET_ANOMALY_END = "2023-10-01", "2023-12-31"
COUNTY_COLORS = {"Isiolo": "#27866f", "Marsabit": "#dc5f45", "Samburu": "#5a9b52"}


def _yearly_county_means() -> pd.DataFrame:
    data = climate_data().copy()
    data["year"] = data["date"].dt.year
    rows = []
    for (year, county), group in data.groupby(["year", "ADM1_EN"]):
        valid = group[["GCI", "area"]].dropna()
        score = float(np.average(valid["GCI"], weights=valid["area"])) if not valid.empty else np.nan
        rows.append({"year": year, "county": county, "GCI": score})
    return pd.DataFrame(rows)


@module.ui
def climate_history_ui():
    return ui.div(
        ui.div(
            ui.div(
                ui.tags.span("CLIMATE HISTORY", class_="eyebrow", data_i18n="history.eyebrow"),
                ui.h1("Grazing conditions through wet and dry cycles", data_i18n="history.heading"),
                ui.p(
                    "See the full 2019–2026 record for one county, including the documented "
                    "2020–2023 Horn of Africa drought and the 2023 El Niño short-rains recovery.",
                    data_i18n="history.subtitle",
                ),
                ui.div(
                    ui.span(ui.tags.i(class_="bi bi-graph-up"), " Multi-year trend", data_i18n="history.chip_trend"),
                    ui.span("GCI · NDVI · rainfall · temperature", data_i18n="history.chip_signals"),
                    class_="hero-chips light-chips",
                ),
            ),
            class_="page-hero module-hero resource-hero drought-hero",
        ),
        ui.div(
            ui.input_select("aoi", ui.span("Focus county", data_i18n="filter.focus_county"), AOIS),
            class_="county-report-filters",
        ),
        ui.card(
            ui.card_header(
                ui.span("Grazing Condition Index · full record", data_i18n="history.gci_card_title"),
                ui.output_ui("history_note"),
            ),
            loading_frame(output_widget("gci_history_chart"), "chart", 340),
            class_="panel-card chart-card grassland-chart-card",
        ),
        ui.card(
            ui.card_header("Vegetation, rainfall and temperature · full record", data_i18n="history.signals_card_title"),
            loading_frame(output_widget("signal_history_chart"), "chart", 300),
            class_="panel-card chart-card grassland-chart-card",
        ),
        ui.card(
            ui.card_header("Mean annual GCI by county", data_i18n="history.yearly_card_title"),
            loading_frame(output_widget("yearly_comparison_chart"), "chart", 320),
            class_="panel-card chart-card grassland-chart-card",
        ),
        ui.div(
            ui.tags.i(class_="bi bi-info-circle"),
            ui.span(
                "Shaded periods mark a documented regional drought and recovery, not a forecast for any single ward.",
                data_i18n="history.disclaimer",
            ),
            class_="method-note",
        ),
        class_="page-shell drought-page",
    )


@module.server
def climate_history_server(input, output, session):
    @render.ui
    def history_note():
        return ui.span(f"{AOIS[input.aoi()]} · Jan 2019 – present", class_="header-note")

    @render_widget
    def gci_history_chart():
        series = county_signal_series(AOIS[input.aoi()])
        fig = go.Figure()
        fig.add_vrect(
            x0=DROUGHT_START, x1=DROUGHT_END,
            fillcolor="#c95f4b", opacity=0.12, line_width=0,
            annotation_text="2020–2023 drought", annotation_position="top left",
            annotation_font_size=10, annotation_font_color="#c95f4b",
        )
        fig.add_vrect(
            x0=WET_ANOMALY_START, x1=WET_ANOMALY_END,
            fillcolor="#3d83b8", opacity=0.14, line_width=0,
            annotation_text="2023 El Niño short rains", annotation_position="top left",
            annotation_font_size=10, annotation_font_color="#3d83b8",
        )
        fig.add_trace(go.Scatter(
            x=series["date"], y=series["GCI"], mode="lines",
            line={"color": "#27866f", "width": 2, "shape": "spline", "smoothing": 0.4},
            fill="tozeroy", fillcolor="rgba(39,134,111,.10)",
            hovertemplate="%{x|%b %Y}<br>GCI %{y:.1f}<extra></extra>",
        ))
        fig.update_layout(
            height=340, margin={"l": 45, "r": 20, "t": 20, "b": 35},
            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
            font={"family": "DM Sans", "color": "#52635f"},
            yaxis={"title": "GCI", "range": [0, 100], "gridcolor": "#e6ebe8"},
            xaxis={"gridcolor": "#e6ebe8"},
            showlegend=False,
        )
        return fig

    @render_widget
    def signal_history_chart():
        series = county_signal_series(AOIS[input.aoi()])
        fig = make_subplots(rows=1, cols=3, subplot_titles=("NDVI", "Rainfall (mm)", "Land temperature (°C)"))
        traces = [("NDVI", 1, "#23977d"), ("prcp", 2, "#3d83b8"), ("lst", 3, "#df7955")]
        for column, col, color in traces:
            fig.add_trace(
                go.Scatter(
                    x=series["date"], y=series[column], mode="lines",
                    line={"color": color, "width": 1.5}, showlegend=False,
                    hovertemplate=f"%{{x|%b %Y}}<br>{column}: %{{y:.2f}}<extra></extra>",
                ),
                row=1, col=col,
            )
            fig.update_xaxes(showgrid=False, row=1, col=col)
            fig.update_yaxes(gridcolor="#e5ebe7", zeroline=False, row=1, col=col)
        fig.update_layout(
            height=300, margin={"l": 35, "r": 15, "t": 35, "b": 30},
            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
            font={"family": "DM Sans", "color": "#52635f", "size": 10},
        )
        return fig

    @render_widget
    def yearly_comparison_chart():
        summary = _yearly_county_means()
        fig = go.Figure()
        for county in sorted(summary["county"].unique()):
            subset = summary[summary["county"] == county].sort_values("year")
            fig.add_bar(
                x=subset["year"], y=subset["GCI"], name=county,
                marker_color=COUNTY_COLORS.get(county, "#82918c"),
                hovertemplate=f"{county}<br>%{{x}}: %{{y:.1f}}<extra></extra>",
            )
        fig.update_layout(
            barmode="group", height=320, margin={"l": 45, "r": 20, "t": 20, "b": 35},
            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
            font={"family": "DM Sans", "color": "#52635f"},
            yaxis={"title": "Mean GCI", "range": [0, 100], "gridcolor": "#e6ebe8"},
            xaxis={"gridcolor": "#e6ebe8", "tickformat": "d"},
            legend={"orientation": "h", "y": 1.14, "x": 0},
            hovermode="x unified",
        )
        return fig
