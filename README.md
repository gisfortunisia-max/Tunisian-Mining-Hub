````markdown
# Tunisian Mining Hub - Website

This repository contains a static website scaffold for the Tunisian Mining Hub. The site includes an interactive Leaflet map preloaded with a small sample GeoJSON of mining titles.

Files added:

- `index.html` — main static site
- `assets/css/style.css` — simple styles
- `assets/js/main.js` — map logic and UI handlers (Leaflet)
- `assets/data/mining_titles.geojson` — small sample dataset

How to run locally

1. Clone the repo or pull these files.
2. Serve the folder using a static server (recommended):

   - Python 3: `python -m http.server 8000`
   - Node (http-server): `npx http-server -c-1`

3. Open `http://localhost:8000` in your browser.

Notes & next steps

- Replace the sample GeoJSON with your authoritative dataset (same schema or adapt `main.js`).
- Add clustering for dense datasets (`leaflet.markercluster`) or integrate a backend API for live data.
- Add authentication and data editing workflows if you need title management from the website.

````
