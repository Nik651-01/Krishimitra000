
'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import 'leaflet-geometryutil';
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

type InteractiveMapProps = {
  onAreaSelect: (areaIdentifier: string, areaInAcres: number) => void;
  onFirstVertex: (areaIdentifier: string) => void;
  onClear: () => void;
};


export default function InteractiveMap({ onAreaSelect, onFirstVertex, onClear }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const { location, initialized } = useLocationStore();

  useEffect(() => {
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
      drawnItemsRef.current = drawnItems;
      
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

      mapInstance.current.on(L.Draw.Event.DRAWSTART, (e: any) => {
        if (e.layerType === 'polygon') {
            drawnItems.clearLayers();
            onClear();

            const onFirstClick = (clickEvent: L.LeafletMouseEvent) => {
                const latlng = clickEvent.latlng;
                const identifier = `${latlng.lat},${latlng.lng}`;
                onFirstVertex(identifier);
                mapInstance.current?.off('click', onFirstClick);
            };
            mapInstance.current?.on('click', onFirstClick);
        }
      });

      mapInstance.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        const geoJSON = layer.toGeoJSON();
        const identifier = JSON.stringify(geoJSON.geometry.coordinates);
        
        // Calculate area
        const areaMeters = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        const areaAcres = areaMeters * 0.000247105;

        drawnItems.clearLayers();
        drawnItems.addLayer(layer);
        
        onAreaSelect(identifier, areaAcres);
      });

      mapInstance.current.on('draw:deletestart', () => {
        if(drawnItemsRef.current?.getLayers().length) {
            onClear();
        }
      });
    }

    // Cleanup function to run when the component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [location, onAreaSelect, onClear, onFirstVertex]);

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
