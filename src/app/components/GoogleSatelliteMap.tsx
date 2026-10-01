import { useEffect, useRef, useState, useCallback } from 'react';
import { AlertTriangle, Loader2, MapPin } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  label?: string;
}

export interface MapPolygon {
  paths: { lat: number; lng: number }[];
  strokeColor?: string;
  fillColor?: string;
  fillOpacity?: number;
}

export interface GoogleSatelliteMapProps {
  /** Latitude of the map centre */
  lat: number;
  /** Longitude of the map centre */
  lng: number;
  /** Initial zoom level (default 18) */
  zoom?: number;
  /** Height of the map container (default "400px") */
  height?: string;
  /** Width of the map container (default "100%") */
  width?: string;
  /** Extra CSS class names applied to the wrapper div */
  className?: string;
  /** Markers to pin on the map */
  markers?: MapMarker[];
  /** Optional polygon / site boundary */
  polygon?: MapPolygon;
  /** Human-readable label shown in error & loading states */
  siteName?: string;
}

// ── Google Maps loader (singleton) ──────────────────────────────────────────

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

let loaderState: LoadState = 'idle';
const pendingCallbacks: Array<(ok: boolean) => void> = [];

function loadGoogleMapsScript(apiKey: string, callback: (ok: boolean) => void) {
  if (loaderState === 'ready') { callback(true); return; }
  if (loaderState === 'error') { callback(false); return; }

  pendingCallbacks.push(callback);

  if (loaderState === 'loading') return; // already in flight

  loaderState = 'loading';

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  // API key is read exclusively from the Vite environment variable — never hardcoded
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    loaderState = 'ready';
    pendingCallbacks.forEach((cb) => cb(true));
    pendingCallbacks.length = 0;
  };

  script.onerror = () => {
    loaderState = 'error';
    pendingCallbacks.forEach((cb) => cb(false));
    pendingCallbacks.length = 0;
  };

  document.head.appendChild(script);
}

// ── Coordinate validation ────────────────────────────────────────────────────

function isValidCoord(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function GoogleSatelliteMap({
  lat,
  lng,
  zoom = 18,
  height = '400px',
  width = '100%',
  className = '',
  markers = [],
  polygon,
  siteName,
}: GoogleSatelliteMapProps) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  const [status, setStatus] = useState<'loading' | 'ready' | 'api-error' | 'coord-error' | 'init-error'>('loading');

  // API key read from the single Vite env variable — never printed or logged
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const initMap = useCallback(() => {
    if (!mapDivRef.current || !window.google?.maps) {
      setStatus('init-error');
      return;
    }

    try {
      const mapOptions: google.maps.MapOptions = {
        center: { lat, lng },
        zoom,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      };

      const map = new google.maps.Map(mapDivRef.current, mapOptions);
      mapInstanceRef.current = map;

      // ── Clear old markers ─────────────────────────────────────
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Primary construction-site marker
      const primaryMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: siteName || 'Construction Site',
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#EA580C',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        animation: google.maps.Animation.DROP,
      });
      markersRef.current.push(primaryMarker);

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;padding:4px 8px;">
          <strong style="color:#EA580C;">📍 ${siteName || 'Construction Site'}</strong><br/>
          <span style="font-size:12px;color:#555;">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
        </div>`,
      });
      primaryMarker.addListener('click', () => {
        infoWindow.open(map, primaryMarker);
      });

      // Extra user-supplied markers
      markers.forEach((m) => {
        if (!isValidCoord(m.lat, m.lng)) return;
        const marker = new google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map,
          title: m.title,
          label: m.label,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#EA580C',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
        markersRef.current.push(marker);
      });

      // ── Polygon / Site boundary ───────────────────────────────
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
      if (polygon) {
        const poly = new google.maps.Polygon({
          paths: polygon.paths,
          strokeColor: polygon.strokeColor ?? '#EA580C',
          strokeOpacity: 0.9,
          strokeWeight: 2,
          fillColor: polygon.fillColor ?? '#EA580C',
          fillOpacity: polygon.fillOpacity ?? 0.15,
          map,
        });
        polygonRef.current = poly;
      }

      setStatus('ready');
    } catch {
      setStatus('init-error');
    }
  }, [lat, lng, zoom, siteName, markers, polygon]);

  // ── Load Maps script, then init ───────────────────────────────────────────
  useEffect(() => {
    if (!apiKey) {
      setStatus('api-error');
      return;
    }
    if (!isValidCoord(lat, lng)) {
      setStatus('coord-error');
      return;
    }

    setStatus('loading');

    if (window.google?.maps) {
      initMap();
      return;
    }

    loadGoogleMapsScript(apiKey, (ok) => {
      if (ok) {
        initMap();
      } else {
        setStatus('api-error');
      }
    });
  }, [apiKey, lat, lng, zoom, initMap]);

  // ── Re-centre when coords change post-init ────────────────────────────────
  useEffect(() => {
    if (status !== 'ready' || !mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter({ lat, lng });
    mapInstanceRef.current.setZoom(zoom);
  }, [lat, lng, zoom, status]);

  // ── Error / Loading UI ────────────────────────────────────────────────────
  if (status === 'api-error') {
    return (
      <div
        style={{ height, width }}
        className={`flex flex-col items-center justify-center gap-3 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 ${className}`}
      >
        <AlertTriangle className="w-10 h-10 text-orange-500" />
        <div className="text-center px-4">
          <p className="font-semibold text-gray-800">Google Maps API Error</p>
          <p className="text-sm text-gray-500 mt-1">
            The Maps API key is missing or invalid. Please check your{' '}
            <code className="bg-gray-200 px-1 rounded">.env</code> file and ensure the{' '}
            <strong>Maps JavaScript API</strong> is enabled in Google Cloud Console.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'coord-error') {
    return (
      <div
        style={{ height, width }}
        className={`flex flex-col items-center justify-center gap-3 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 ${className}`}
      >
        <MapPin className="w-10 h-10 text-orange-500" />
        <div className="text-center px-4">
          <p className="font-semibold text-gray-800">Invalid Coordinates</p>
          <p className="text-sm text-gray-500 mt-1">
            Please provide valid latitude (−90 to 90) and longitude (−180 to 180) for this site.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'init-error') {
    return (
      <div
        style={{ height, width }}
        className={`flex flex-col items-center justify-center gap-3 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 ${className}`}
      >
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <div className="text-center px-4">
          <p className="font-semibold text-gray-800">Map Initialization Failed</p>
          <p className="text-sm text-gray-500 mt-1">
            The map could not be initialized. Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width }} className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-100">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-sm text-gray-600 font-medium">Loading satellite imagery…</p>
        </div>
      )}
      {/* Google Maps renders into this div */}
      <div ref={mapDivRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
