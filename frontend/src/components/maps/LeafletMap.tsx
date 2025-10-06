/**
 * LeafletMap Component
 * Free OpenStreetMap-based map component (no API key required)
 */
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    description?: string;
  }>;
  className?: string;
}

export default function LeafletMap({
  latitude,
  longitude,
  zoom = 13,
  height = '400px',
  markers = [],
  className = '',
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([latitude, longitude], zoom);

    // Add OpenStreetMap tiles (FREE - no API key needed!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add main marker
    const mainMarker = L.marker([latitude, longitude]).addTo(map);
    mainMarker.bindPopup('<b>Location</b>').openPopup();

    // Add additional markers
    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(map);
      if (marker.title || marker.description) {
        const popupContent = `
          ${marker.title ? `<b>${marker.title}</b>` : ''}
          ${marker.description ? `<br/>${marker.description}` : ''}
        `;
        leafletMarker.bindPopup(popupContent);
      }
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, markers]);

  return (
    <div className={className}>
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%', borderRadius: '0.5rem' }}
      />
      <p className="text-xs text-gray-500 mt-2">
        Powered by{' '}
        <a
          href="https://www.openstreetmap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          OpenStreetMap
        </a>{' '}
        - Free & Open Source
      </p>
    </div>
  );
}
