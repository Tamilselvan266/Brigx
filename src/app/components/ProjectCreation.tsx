import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';

// ── Inline satellite picker (click-to-pin using Google Maps) ─────────────────
type PinState = 'loading' | 'ready' | 'error';

let _mapsLoaded: PinState = 'idle' as unknown as PinState;
let _mapsCallbacks: Array<(ok: boolean) => void> = [];

function ensureMapsLoaded(cb: (ok: boolean) => void) {
  const state = _mapsLoaded as unknown as string;
  if (state === 'ready') { cb(true); return; }
  if (state === 'error') { cb(false); return; }
  _mapsCallbacks.push(cb);
  if (state === 'loading') return;
  (_mapsLoaded as unknown as string) = 'loading';
  // Re-use already loaded script if present
  if (window.google?.maps) {
    (_mapsLoaded as unknown as string) = 'ready';
    _mapsCallbacks.forEach(c => c(true));
    _mapsCallbacks = [];
    return;
  }
  const existing = document.getElementById('google-maps-script');
  if (existing) {
    // script already injected by GoogleSatelliteMap — wait for it
    const poll = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(poll);
        (_mapsLoaded as unknown as string) = 'ready';
        _mapsCallbacks.forEach(c => c(true));
        _mapsCallbacks = [];
      }
    }, 200);
    return;
  }
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  if (!key) {
    (_mapsLoaded as unknown as string) = 'error';
    _mapsCallbacks.forEach(c => c(false));
    _mapsCallbacks = [];
    return;
  }
  const s = document.createElement('script');
  s.id = 'google-maps-script';
  s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry`;
  s.async = true; s.defer = true;
  s.onload = () => { (_mapsLoaded as unknown as string) = 'ready'; _mapsCallbacks.forEach(c => c(true)); _mapsCallbacks = []; };
  s.onerror = () => { (_mapsLoaded as unknown as string) = 'error'; _mapsCallbacks.forEach(c => c(false)); _mapsCallbacks = []; };
  document.head.appendChild(s);
}

interface SatellitePickerProps {
  onPinned: (lat: number, lng: number) => void;
  pinned: { lat: number; lng: number } | null;
}

function SatellitePicker({ onPinned, pinned }: SatellitePickerProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    ensureMapsLoaded((ok) => {
      if (!ok) { setState('error'); return; }
      if (!divRef.current || !window.google?.maps) { setState('error'); return; }
      // Default centre: India
      const defaultCenter = { lat: 20.5937, lng: 78.9629 };
      const map = new google.maps.Map(divRef.current, {
        center: defaultCenter,
        zoom: 5,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });
      mapRef.current = map;

      // If already pinned, show that marker
      if (pinned) {
        map.setCenter(pinned);
        map.setZoom(18);
        markerRef.current = new google.maps.Marker({
          position: pinned,
          map,
          title: 'Construction Site',
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 7,
            fillColor: '#EA580C',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
      }

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        // Move or create marker
        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
        } else {
          markerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map,
            title: 'Construction Site',
            animation: google.maps.Animation.DROP,
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 7,
              fillColor: '#EA580C',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });
        }
        onPinned(lat, lng);
      });

      setState('ready');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200" style={{ height: '400px' }}>
      {state === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gray-100">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading map…</p>
        </div>
      )}
      {state === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gray-100">
          <MapPin className="w-8 h-8 text-orange-500" />
          <p className="text-sm font-semibold text-gray-700">Map unavailable</p>
          <p className="text-xs text-gray-400">Check your API key in .env</p>
        </div>
      )}
      <div ref={divRef} style={{ height: '100%', width: '100%' }} />
      {state === 'ready' && !pinned && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-700 pointer-events-none">
          📍 Click on the satellite map to pin your construction site
        </div>
      )}
    </div>
  );
}

interface ProjectCreationProps {
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}


export function ProjectCreation({ onClose, onProjectCreated }: ProjectCreationProps) {
  const [step, setStep] = useState<'details' | 'map'>('details');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // No mock map select needed – real map handles click-to-pin

  const handleCreateProject = () => {
    if (!projectName || !projectType || !coordinates) {
      toast.error('Please complete all fields and select location');
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName,
      type: projectType,
      location,
      coordinates,
      progress: 0,
      status: 'Planning',
      createdAt: new Date(),
    };

    onProjectCreated(newProject);
    toast.success('Project created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {step === 'details' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., 2BHK Villa Construction"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="projectType">Project Type</Label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="mt-2 w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>

              <div>
                <Label htmlFor="location">Location / Address</Label>
                <Input
                  id="location"
                  placeholder="e.g., Whitefield, Bangalore"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => setStep('map')}
                disabled={!projectName || !projectType || !location}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Next: Select Location on Map
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label>Pin Exact Plot Location</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Click on the map to mark your construction site
                </p>
              </div>

              {/* Real Google Maps Satellite — click to pin construction site */}
              <SatellitePicker
                pinned={coordinates}
                onPinned={(lat, lng) => {
                  setCoordinates({ lat, lng });
                  toast.success('Location pinned successfully!');
                }}
              />

              {coordinates && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-900">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <p className="font-semibold">Location Pinned</p>
                        <p className="text-sm">
                          Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!coordinates}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  Create Project
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
