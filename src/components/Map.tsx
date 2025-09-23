import { useEffect, useRef } from 'react';

type LatLng = { lat: number; lng: number };

type MapProps = {
  center: LatLng;
  zoom?: number;
  markerTitle?: string;
  className?: string;
};

declare global {
  interface Window {
    google?: any;
    __googleMapsInitPromise?: Promise<any>;
  }
}

function loadGoogleMaps(apiKey?: string) {
  if (window.google && window.google.maps) return Promise.resolve(window.google);
  if (window.__googleMapsInitPromise) return window.__googleMapsInitPromise;

  const key = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Promise.reject(new Error('Missing Google Maps API key (VITE_GOOGLE_MAPS_API_KEY)'));
  }

  window.__googleMapsInitPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
  return window.__googleMapsInitPromise;
}

export function Map({ center, zoom = 11, markerTitle = 'Location', className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    loadGoogleMaps().then((google) => {
      if (!isMounted || !mapRef.current) return;
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: false,
        });
        markerRef.current = new google.maps.Marker({ position: center, map: mapInstanceRef.current, title: markerTitle });
      } else {
        mapInstanceRef.current.setCenter(center);
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        markerRef.current = new google.maps.Marker({ position: center, map: mapInstanceRef.current, title: markerTitle });
      }
    }).catch(() => {
      // Render simple fallback if key missing or load failed
      if (mapRef.current) {
        mapRef.current.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#f3f4f6;color:#374151;">Map failed to load. Check API key.</div>';
      }
    });
    return () => { isMounted = false; };
  }, [center.lat, center.lng, zoom, markerTitle]);

  return <div ref={mapRef} className={className} style={{ width: '100%', height: '400px' }} />;
}


