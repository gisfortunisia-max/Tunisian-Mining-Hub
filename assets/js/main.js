// Initialize map
const map = L.map('map').setView([34.0, 9.0], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

// Global variables
let geojsonLayer = null;
let features = [];
let currentStatusFilter = 'all';
let currentCommodityFilter = 'all';

// Color mapping by commodity
const commodityColors = {
  'Copper': '#b5651d',
  'Phosphate': '#2b7a78',
  'Iron': '#6b6bde',
  'default': '#888'
};

// Status colors
const statusColors = {
  'Exploration': '#f39c12',
  'Active': '#2b7a78',
  'Producing': '#27ae60',
  'default': '#888'
};

function getColorByCommodity(commodity) {
  if (!commodity) return commodityColors.default;
  return commodityColors[commodity] || commodityColors.default;
}

function getColorByStatus(status) {
  if (!status) return statusColors.default;
  return statusColors[status] || statusColors.default;
}

function styleFeature(feature) {
  const commodity = feature.properties?.commodity || 'Unknown';
  const status = feature.properties?.status || 'Unknown';
  
  return {
    radius: 10,
    fillColor: getColorByCommodity(commodity),
    color: getColorByStatus(status),
    weight: 3,
    opacity: 1,
    fillOpacity: 0.8
  };
}

function onEachFeature(feature, layer) {
  const props = feature.properties || {};
  const html = `
    <div class="popup-content">
      <h4>${props.name || 'Unnamed Title'}</h4>
      <table class="popup-table">
        <tr><td><strong>Title ID:</strong></td><td>${props.title_id || '—'}</td></tr>
        <tr><td><strong>Status:</strong></td><td><span class="status-badge ${(props.status || '').toLowerCase()}">${props.status || '—'}</span></td></tr>
        <tr><td><strong>Commodity:</strong></td><td>${props.commodity || '—'}</td></tr>
        <tr><td><strong>Holder:</strong></td><td>${props.holder || '—'}</td></tr>
      </table>
    </div>
  `;
  layer.bindPopup(html, { maxWidth: 300 });
}

function loadGeoJSON(geojson) {
  // Remove existing layer
  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
  }

  features = geojson.features || [];
  geojsonLayer = L.geoJSON(geojson, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, styleFeature(feature));
    },
    onEachFeature: onEachFeature
  }).addTo(map);

  // Fit bounds
  if (geojsonLayer.getLayers().length > 0) {
    const bounds = geojsonLayer.getBounds();
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  // Update statistics
  updateStatistics();

  // Apply filters
  applyFilters();
}

function updateStatistics() {
  if (!features || features.length === 0) {
    document.getElementById('stat-titles').textContent = '0';
    document.getElementById('stat-commodities').textContent = '0';
    document.getElementById('stat-producing').textContent = '0';
    document.getElementById('stat-exploration').textContent = '0';
    return;
  }

  const commodities = new Set();
  let producingCount = 0;
  let explorationCount = 0;

  features.forEach(feature => {
    const commodity = feature.properties?.commodity;
    const status = feature.properties?.status;

    if (commodity) commodities.add(commodity);
    if (status === 'Producing') producingCount++;
    if (status === 'Exploration') explorationCount++;
  });

  document.getElementById('stat-titles').textContent = features.length;
  document.getElementById('stat-commodities').textContent = commodities.size;
  document.getElementById('stat-producing').textContent = producingCount;
  document.getElementById('stat-exploration').textContent = explorationCount;
}

function applyFilters() {
  if (!geojsonLayer) return;

  geojsonLayer.eachLayer(layer => {
    const props = layer.feature.properties || {};
    const status = props.status || 'Unknown';
    const commodity = props.commodity || 'Unknown';

    const statusMatch = currentStatusFilter === 'all' || status === currentStatusFilter;
    const commodityMatch = currentCommodityFilter === 'all' || commodity === currentCommodityFilter;

    if (statusMatch && commodityMatch) {
      layer.addTo(map);
    } else {
      map.removeLayer(layer);
    }
  });
}

// Load initial sample data
fetch('./assets/data/mining_titles.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load GeoJSON: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Sample data loaded successfully:', data);
    loadGeoJSON(data);
  })
  .catch(error => {
    console.error('Error loading sample data:', error);
    // Create empty map if data fails
    document.getElementById('map').innerHTML += '<div style="padding: 20px; color: #666;">Failed to load sample data. You can upload your own GeoJSON file.</div>';
  });

// Search functionality
const searchInput = document.getElementById('search');
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const match = features.find(f => {
      const name = (f.properties?.name || '').toLowerCase();
      return name.includes(query);
    });

    if (match) {
      const coords = match.geometry.coordinates;
      map.setView([coords[1], coords[0]], 12);
      
      // Find and open popup for matched feature
      geojsonLayer.eachLayer(layer => {
        if (layer.feature === match) {
          layer.openPopup();
        }
      });
    } else {
      alert('No matching mining title found.');
    }
  }
});

// Filter by status
document.getElementById('filter-status').addEventListener('change', function(e) {
  currentStatusFilter = e.target.value;
  applyFilters();
});

// Filter by commodity
document.getElementById('filter-commodity').addEventListener('change', function(e) {
  currentCommodityFilter = e.target.value;
  applyFilters();
});

// Upload GeoJSON
document.getElementById('upload-geojson').addEventListener('change', function(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const geojson = JSON.parse(event.target.result);
      
      if (!geojson.type === 'FeatureCollection' && !geojson.features) {
        throw new Error('Invalid GeoJSON format');
      }

      loadGeoJSON(geojson);
      alert('GeoJSON loaded successfully! ' + (geojson.features?.length || 0) + ' features found.');
      searchInput.value = '';
    } catch (error) {
      console.error('Error parsing GeoJSON:', error);
      alert('Error: Invalid GeoJSON file. Please check the format.\n\n' + error.message);
    }
  };
  reader.onerror = function() {
    alert('Error reading file');
  };
  reader.readAsText(file);
});

// Reset view
document.getElementById('reset-view').addEventListener('click', function() {
  map.setView([34.0, 9.0], 6);
  searchInput.value = '';
  document.getElementById('filter-status').value = 'all';
  document.getElementById('filter-commodity').value = 'all';
  currentStatusFilter = 'all';
  currentCommodityFilter = 'all';
  applyFilters();
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navbar = document.querySelector('.navbar');

menuToggle?.addEventListener('click', function() {
  navbar.style.display = navbar.style.display === 'flex' ? 'none' : 'flex';
});