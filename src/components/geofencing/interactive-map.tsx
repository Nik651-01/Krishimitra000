
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import 'leaflet-geometryutil';
import { useLocationStore } from '@/lib/location-store';
import { Loader2 } from 'lucide-react';

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
    if (mapRef.current && !mapInstance.current && initialized && location) {
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
          polygon: {
            allowIntersection: false,
            showArea: true,
            metric: false, // Turn off metric area calculation
            feet: false,
            // @ts-ignore
            showLength: false,
          },
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
                if (mapInstance.current) {
                    const latlng = clickEvent.latlng;
                    const identifier = `${latlng.lat},${latlng.lng}`;
                    onFirstVertex(identifier);
                    mapInstance.current.off('click', onFirstClick);
                }
            };
            mapInstance.current?.on('click', onFirstClick);
        }
      });

      mapInstance.current.on(L.Draw.Event.CREATED, (e: any) => {
        if (e.layerType === 'polygon') {
            const layer = e.layer;
            drawnItems.addLayer(layer);
            
            const geoJSON = layer.toGeoJSON();
            const identifier = JSON.stringify(geoJSON.geometry.coordinates);
            
            const areaMeters = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
            const areaAcres = areaMeters * 0.000247105;
            
            onAreaSelect(identifier, areaAcres);
        }
      });

      mapInstance.current.on('draw:deleted', () => {
          onClear();
      });

    }

    // Cleanup function to run when the component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  // We remove the handler functions from the dependency array because they
  // are wrapped in `useCallback` in the parent component, which memoizes them.
  // Their references will not change across re-renders.
  }, [initialized, location, onAreaSelect, onClear, onFirstVertex]);

  if (!initialized) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-full text-center p-4">
        <p className="text-muted-foreground">Please allow location access on the dashboard to view and interact with the map.</p>
      </div>
    );
  }

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} className="rounded-md" />;
}
