# Tunisian Mining Hub - Interactive Web Platform

A modern, fully responsive website for exploring and visualizing mining titles across Tunisia. Built with Leaflet.js, GeoJSON, and modern web technologies.

## Features

✨ **Modern UI/UX Design**
- Responsive design that works on all devices
- Smooth scrolling and animations
- Professional color scheme and typography
- Interactive statistics dashboard

🗺️ **Interactive Mapping**
- Leaflet.js-powered map with OpenStreetMap tiles
- Color-coded mining titles by commodity type (Copper, Phosphate, Iron)
- Status indicators (Exploration, Active, Producing)
- Zoom and pan functionality
- Click features to view detailed information

📊 **Data Management**
- Upload custom GeoJSON files
- Filter by status and commodity type
- Search mining titles by name
- Real-time statistics updates
- Sample dataset included (5 mining titles)

📱 **Fully Responsive**
- Desktop, tablet, and mobile support
- Adaptive layouts and navigation
- Touch-friendly controls

## Quick Start

### Using Python (Recommended)
```bash
cd path/to/Tunisian-Mining-Hub
python -m http.server 8000
```

### Using Node.js
```bash
npx http-server -c-1
```

### Using Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

Then open your browser to `http://localhost:8000` or the address shown by your server.

## File Structure

```
Tunisian-Mining-Hub/
├── index.html                  # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css          # Modern responsive styles
│   ├── js/
│   │   └── main.js            # Map and UI logic
│   └── data/
│       └── mining_titles.geojson  # Sample dataset
└── README.md                   # This file
```

## Usage

### Search for a Title
1. Type the title name in the "Search Title" input
2. Press Enter
3. Map will zoom to the location and open details

### Filter by Status
1. Select a status from the "Filter by Status" dropdown
2. Only matching titles will be visible on the map
3. Select "All Statuses" to reset

### Filter by Commodity
1. Select a commodity from the "Filter by Commodity" dropdown
2. Only matching titles will be visible
3. Select "All Commodities" to reset

### Upload Custom Data
1. Prepare your mining data in GeoJSON format
2. Click "Upload GeoJSON" and select your file
3. The map will update with your data
4. Statistics will recalculate automatically

### Reset View
1. Click the "Reset View" button to return to the default map extent
2. All filters will be cleared
3. Search input will be emptied

## GeoJSON Format

Expected GeoJSON structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "title_id": "MT-001",
        "name": "Mining Title Name",
        "status": "Exploration|Active|Producing",
        "commodity": "Copper|Phosphate|Iron|Other",
        "holder": "Company Name"
      }
    }
  ]
}
```

## Customization

### Change Colors
Edit the CSS variables in `assets/css/style.css`:
```css
:root {
  --primary-color: #1a5f7a;
  --secondary-color: #d4a574;
  --accent-color: #2b7a78;
  /* ... more variables */
}
```

### Add More Commodities
1. Add commodity to GeoJSON data
2. Add color mapping in `assets/js/main.js`:
```javascript
const commodityColors = {
  'Copper': '#b5651d',
  'Phosphate': '#2b7a78',
  'NewCommodity': '#yourcolor'
};
```

### Customize Map Tiles
Edit the `L.tileLayer` in `assets/js/main.js` to use different map providers.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Dependencies

- **Leaflet.js** (1.9.4) - Interactive mapping
- **Font Awesome** (6.4.0) - Icons
- **OpenStreetMap** - Map tiles
- No backend required - fully client-side!

## Sample Data

The platform includes 5 sample mining titles:
1. El Kasserine Copper Prospect (Exploration)
2. Gafsa Phosphate Mine (Producing)
3. Sfax Iron Prospect (Active)
4. Djerba Phosphate Extension (Producing)
5. Sousse Iron Deposits (Active)

## Tips & Troubleshooting

**Map not loading?**
- Check browser console (F12) for errors
- Ensure you're using a local server, not opening the file directly
- Try a different browser

**GeoJSON upload not working?**
- Validate your GeoJSON at https://geojson.io/
- Ensure coordinates are in [longitude, latitude] format
- Check browser console for error messages

**Performance with large datasets?**
- Consider using clustering for 1000+ features
- Pre-filter data before uploading
- Use vector tiles for very large datasets

## Future Enhancements

- [ ] Marker clustering for dense datasets
- [ ] Export filtered data as GeoJSON/CSV
- [ ] Draw tools to create mining areas
- [ ] Historical timeline of mining projects
- [ ] Backend API integration for live data
- [ ] User authentication and data management
- [ ] Advanced analytics and reporting

## License

MIT License - Feel free to use and modify

## Support

For issues, questions, or suggestions, please contact:
- Email: info@tunisianmininghub.tn
- GitHub Issues: https://github.com/gisfortunisia-max/Tunisian-Mining-Hub/issues

---

Made with ❤️ for Tunisia's mining sector
