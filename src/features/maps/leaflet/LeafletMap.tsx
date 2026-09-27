import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapLocation {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  tone: 'primary' | 'warning' | 'neutral';
}

interface LeafletMapProps {
  locations: readonly MapLocation[];
  selectedLocationId: string;
  onSelectLocation: (locationId: string) => void;
}

export function LeafletMap({ locations, selectedLocationId, onSelectLocation }: LeafletMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, { zoomControl: false }).setView([-34.9011, -56.1645], 12);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    locations.forEach((location) => {
      const marker = L.circleMarker(location.coordinates, {
        color: location.tone === 'primary' ? '#176b2c' : location.tone === 'warning' ? '#b7791f' : '#64748b',
        fillColor: location.tone === 'primary' ? '#2d9b49' : location.tone === 'warning' ? '#eab308' : '#94a3b8',
        fillOpacity: 0.9,
        radius: location.id === selectedLocationId ? 10 : 7,
        weight: 3,
      })
        .bindPopup(`<strong>${location.name}</strong><br />${location.description}`)
        .on('click', () => onSelectLocation(location.id));

      marker.addTo(map);
      markersRef.current[location.id] = marker;
    });
  }, [locations, onSelectLocation, selectedLocationId]);

  useEffect(() => {
    const selected = locations.find((location) => location.id === selectedLocationId);
    const map = mapRef.current;
    if (selected && map) {
      map.flyTo(selected.coordinates, Math.max(map.getZoom(), 13), { duration: 0.6 });
      markersRef.current[selected.id]?.openPopup();
    }
  }, [locations, selectedLocationId]);

  return <div ref={mapElementRef} className="h-[420px] w-full overflow-hidden rounded-md" aria-label="Mapa interactivo de ubicaciones" />;
}
