'use client';

import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';

// Fix for default icon issue with Leaflet and Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});


export default function InteractiveMap() {

  const onCreated = (e: any) => {
    const layer = e.layer;
    console.log('Polygon created:', layer.toGeoJSON());
    // Here you would trigger the API calls to Bhuvan and SoilGrids
    
    const lulcContainer = document.getElementById('lulc-data');
    if(lulcContainer) {
        lulcContainer.innerHTML = '<p>Loading LULC data for the selected area...</p>'
    }

    const soilContainer = document.getElementById('soil-data');
    if(soilContainer) {
        soilContainer.innerHTML = '<p>Loading SoilGrids data for the selected area...</p>'
    }

    // Example of displaying placeholder data after a delay
    setTimeout(() => {
        if(lulcContainer) {
            lulcContainer.innerHTML = `
                <p class="text-sm">Bhuvan LULC data would be displayed here. Ready for API integration.</p>
                <table class="w-full text-sm mt-2">
                    <thead><tr class="text-left"><th class="p-2 border-b">Land Use</th><th class="p-2 border-b">Area (sq. km)</th></tr></thead>
                    <tbody>
                        <tr><td class="p-2">Built-up</td><td class="p-2">0.05</td></tr>
                        <tr><td class="p-2">Agriculture</td><td class="p-2">0.80</td></tr>
                        <tr><td class="p-2">Fallow</td><td class="p-2">0.15</td></tr>
                    </tbody>
                </table>
            `
        }
        if(soilContainer) {
            soilContainer.innerHTML = `
                <p class="text-sm">SoilGrids data would be displayed here. Ready for API integration.</p>
                <table class="w-full text-sm mt-2">
                    <thead><tr class="text-left"><th class="p-2 border-b">Property</th><th class="p-2 border-b">Value</th></tr></thead>
                    <tbody>
                        <tr><td class="p-2">pH</td><td class="p-2">6.8</td></tr>
                        <tr><td class="p-2">Organic Carbon</td><td class="p-2">1.2%</td></tr>
                        <tr><td class="p-2">Nitrogen</td><td class="p-2">75 kg/ha</td></tr>
                    </tbody>
                </table>
            `
        }
    }, 2000);
  };

  const onEdited = (e: any) => {
    console.log('Geofences edited:', e.layers.toGeoJSON());
  };

  const onDeleted = (e: any) => {
    console.log('Geofences deleted:', e.layers.toGeoJSON());
  };

  return (
    <MapContainer
      center={[19.9975, 73.7898]} // Centered on Nashik
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="rounded-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={onCreated}
          onEdited={onEdited}
          onDeleted={onDeleted}
          draw={{
            rectangle: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
