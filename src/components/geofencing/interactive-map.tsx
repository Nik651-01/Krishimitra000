
'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { useLocationStore } from '@/lib/location-store';

// Fix for default icon issue with Leaflet and Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { location, initialized } = useLocationStore();

  useEffect(() => {
    // Initialize map only if the ref is available and map hasn't been initialized yet
    if (mapRef.current && !mapInstance.current && location) {
      mapInstance.current = L.map(mapRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      const drawnItems = new L.FeatureGroup();
      mapInstance.current.addLayer(drawnItems);
      
      const drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polygon: true,
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
        },
        edit: {
          featureGroup: drawnItems,
        },
      });
      mapInstance.current.addControl(drawControl);

      mapInstance.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        console.log('Polygon created:', layer.toGeoJSON());
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);
        
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
      });
    }

    // Cleanup function to run when the component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [location]);

  if (!initialized) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Initializing...</p>
        </div>
    )
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please allow location access on the dashboard to view the map.</p>
      </div>
    );
  }

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} className="rounded-md" />;
}
