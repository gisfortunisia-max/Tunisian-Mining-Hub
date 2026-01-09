// Main JS for Tunisian Mining Hub interactive map

const map = L.map('map').setView([34.0, 9.0], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let geojsonLayer = null;
let features = []; 

function getColorByCommodity(c){
  if(!c) return '#888';
  c = c.toLowerCase();
  if(c.includes('copper')) return '#b5651d';
  if(c.includes('phosphate')) return '#2b7a78';
  if(c.includes('iron')) return '#6b6bde';
  return '#888';
}

function styleFeature(feature){
  const commodity = feature.properties && feature.properties.commodity;
  return {
    radius: 8,
    fillColor: getColorByCommodity(commodity),
    color: '#222',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
  };
}

function onEachFeature(feature, layer){
  const p = feature.properties || {};
  const html = `
    <div>
      <strong>${p.name || 'Unnamed'}</strong><br/>
      <small>Title ID: ${p.title_id || '—'}</small><br/>
      <small>Status: ${p.status || '—'}</small><br/>
      <small>Commodity: ${p.commodity || '—'}</small><br/>
      <small>Holder: ${p.holder || '—'}</small>
    </div>
  `;
  layer.bindPopup(html);
}

function loadGeoJSON(geojson){
  if(geojsonLayer) map.removeLayer(geojsonLayer);
  features = geojson.features || [];
  geojsonLayer = L.geoJSON(geojson, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng, styleFeature(feature));
    },
    onEachFeature: onEachFeature
  }).addTo(map);
  map.fitBounds(geojsonLayer.getBounds(), {padding:[20,20]});
}

// Initial load from bundled sample data
fetch('assets/data/mining_titles.geojson')
  .then(r=>r.json())
  .then(data=>loadGeoJSON(data))
  .catch(err=>console.error('Failed to load sample data', err));

// Search by name
const searchInput = document.getElementById('search');
searchInput.addEventListener('keydown', function(e){
  if(e.key === 'Enter'){
    const q = searchInput.value.trim().toLowerCase();
    if(!q) return;
    const match = features.find(f => (f.properties && (f.properties.name||'').toLowerCase().includes(q)));
    if(match){
      const coords = match.geometry.coordinates; // [lon, lat]
      map.setView([coords[1], coords[0]], 12);
      geojsonLayer.eachLayer(layer => {
        if(layer.feature === match) layer.openPopup();
      });
    } else {
      alert('No matching title found.');
    }
  }
});

// Filter by status
const filterSelect = document.getElementById('filter-status');
filterSelect.addEventListener('change', function(){
  const val = filterSelect.value;
  if(!geojsonLayer) return;
  geojsonLayer.eachLayer(layer => {
    const s = (layer.feature.properties && layer.feature.properties.status) || 'Unknown';
    const visible = (val === 'all') || (s === val);
    if(visible) layer.addTo(map); else map.removeLayer(layer);
  });
});

// Upload GeoJSON
const uploadInput = document.getElementById('upload-geojson');
uploadInput.addEventListener('change', function(){
  const file = uploadInput.files && uploadInput.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const json = JSON.parse(e.target.result);
      loadGeoJSON(json);
      alert('GeoJSON loaded successfully.');
    }catch(err){
      alert('Invalid GeoJSON file');
    }
  };
  reader.readAsText(file);
});

// Reset view
document.getElementById('reset-view').addEventListener('click', function(){
  map.setView([34.0, 9.0], 6);
});
