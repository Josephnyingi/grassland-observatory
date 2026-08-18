# [Rangeland Observatory Dashboard](https://grassland-observatory.josenyingi.workers.dev)

Rangeland Observatory Dashboard is a ward-level grassland monitoring and county planning dashboard for Kenya's arid and semi-arid lands (ASALs). It combines vegetation, rainfall, temperature and surface-variability observations with local resource information to support early field verification and grazing decisions.

The dashboard therefore helps users:

- identify wards where grazing condition is poor or deteriorating
- compare current conditions with the usual value for the same month
- distinguish vegetation stress from rainfall and temperature effects;
- find stronger wards within the selected county or directly across its border
- make use of crowd sourcing to record boreholes, animal watering points, nurseries and grass seed banks
- generate a county planning brief for evaluation

This is a screening tool, not a movement instruction or weather forecast. Recommendations must be checked against water availability, land tenure, conflict risk, resource ownership and local authority guidance.

## Data sources

- **Ward and county boundaries** (`data/ASAL_wards.geojson`, `data/ASAL_Counties.geojson`): the 45 wards of Samburu, Marsabit and Isiolo, from HDX's [Administrative Wards in Kenya (1450)](https://data.humdata.org/dataset/administrative-wards-in-kenya-1450) dataset.
- **Grassland cover raster** (`data/Raster/esa_grassland_samburu_marsabit_isiolo.tif`): reclassified from [ESA WorldCover 10m v200 (2021)](https://esa-worldcover.org/), grassland class only, downsampled to 30 m.
- **Place-name gazetteer** (`data/gazetteer/KE.zip`): the Kenya extract from [GeoNames](https://www.geonames.org/).
- **Ward-month indicators (NDVI, rainfall, temperature, MSDI, GCI)** (`data/merged_ward_indicators_with_gci.csv`): synthetic, generated to match this repo's GCI formula and this region's documented climate history — the bimodal long/short rains cycle, the 2020–2023 Horn of Africa drought and the 2023 El Niño short-rains recovery — since the original satellite-derived export was lost. Not a live Earth Engine feed; replace with a real GEE export before using this for operational decisions.

## Indicators and formulas

### Grazing Condition Index

The input archive supplies a monthly Grazing Condition Index (GCI) for each ward. Its conceptual weighting is:

```text
GCI = 0.35 × NDVI_score
    + 0.25 × rainfall_score
    + 0.20 × (100 - temperature_score)
    + 0.20 × (100 - MSDI_score)
```

Each component is normalized to a common 0–100 scale before weighting. Temperature and MSDI are reverse-scored because excess heat and high local red-band variability reduce the grazing-condition score.

| GCI | Classification |
| ---: | --- |
| 0–19.9 | Very poor |
| 20–39.9 | Poor |
| 40–59.9 | Moderate |
| 60–79.9 | Good |
| 80–100 | Very good |

### Supporting indicators

- **NDVI:** `(NIR - Red) / (NIR + Red)`. Higher values generally indicate greener, more photosynthetically active vegetation.
- **Rainfall:** monthly precipitation total in millimetres.
- **Temperature:** monthly land-surface temperature in degrees Celsius. Negative source values are treated as missing data.
- **MSDI:** the moving standard deviation of the Landsat 8/9 OLI red band in a 3 × 3-pixel neighbourhood

### Long-term monthly reference

The reference line is fixed by calendar month. For example, the January reference is the mean of all available January county observations across the full archive.
Changing the selected year changes the comparison line but not this long-term monthly reference.

### Next-month trend range

For the next calendar month, the county report fits a linear trend to prior observations of that same month to obtain a probability range. This range represents statistical trend uncertainty; it is not a meteorological forecast.

## Technology stack

- **Application:** Python, Shiny for Python, Uvicorn and Starlette
- **Analysis:** pandas and NumPy
- **Vector geospatial processing:** GeoPandas and Shapely
- **Resource storage:** GeoPackage through Pyogrio
- **Maps:** MapLibre GL JS with OpenFreeMap basemaps
- **Raster tiles:** Rio-tiler serving the local cloud-optimized GeoTIFF on demand
- **Charts:** Plotly
- **Reports:** ReportLab PDF generation
- **Place search:** packaged GeoNames Kenya gazetteer
- **Interface:** HTML, CSS, Bootstrap icons and small JavaScript helpers loaded by Shiny
- **Deployment:** Docker image run as a Cloudflare Container, fronted by a Cloudflare Worker (see [Deploy](#deploy))

## Project layout

```text
app.py                  Shiny application and ASGI entry point
modules/                Overview, grassland health and county planning UI/server modules
services/               Climate, spatial, raster, resource and PDF services
www/                    Styles and browser-side map/location helpers
data/                   Ward/county boundaries, grassland raster, gazetteer and climate archive (see Data sources)
output/                 Sample generated artifacts (e.g. a county report PDF)
requirements.txt        Python runtime dependencies
Dockerfile              Container image used for the Cloudflare deployment
wrangler.jsonc          Cloudflare Worker + Container configuration
package.json            Node dependencies for the Wrangler deploy tooling
src/index.js            Worker entry point that proxies requests to the container
```

## Install and launch

Run these commands from the project directory using Bash:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in a browser.

To stop the server, press `Ctrl+C`. To leave the virtual environment:

```bash
deactivate
```

For access from another machine on the same trusted network, bind to all interfaces:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Deploy

The live deployment runs as a [Cloudflare Container](https://developers.cloudflare.com/containers/) behind a Worker (Cloudflare Pages cannot run this app directly — it's a full Python ASGI backend, not static assets). Requires Node.js and a Cloudflare account on the Workers Paid plan.

```bash
npm install
npx wrangler deploy
```

This builds the image from the `Dockerfile`, pushes it to Cloudflare's registry, and deploys the Worker in `src/index.js` that proxies every request to the container.
