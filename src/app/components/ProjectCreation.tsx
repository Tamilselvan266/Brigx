import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, Plus, ArrowRight, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

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

  const handleMapSelect = () => {
    // Simulate map location selection
    const mockCoordinates = {
      lat: 12.9716 + (Math.random() - 0.5) * 0.1,
      lng: 77.5946 + (Math.random() - 0.5) * 0.1,
    };
    setCoordinates(mockCoordinates);
    toast.success('Location pinned successfully!');
  };

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

              {/* Mock Map */}
              <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 rounded-xl border-2 border-gray-200 overflow-hidden">
                {/* Map grid overlay */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-gray-400" />
                    ))}
                  </div>
                </div>

                {/* Roads simulation */}
                <div className="absolute top-1/3 left-0 right-0 h-8 bg-gray-400 opacity-30" />
                <div className="absolute top-0 bottom-0 left-1/2 w-8 bg-gray-400 opacity-30" />

                {/* Map controls */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search location..."
                      className="pl-8 w-64"
                    />
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="absolute right-4 top-4 bg-white rounded-lg shadow-lg p-1 flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <div className="h-px bg-gray-200" />
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <span className="text-lg font-bold">−</span>
                  </Button>
                </div>

                {/* Pin location button */}
                {!coordinates && (
                  <motion.button
                    onClick={handleMapSelect}
                    className="absolute inset-0 flex items-center justify-center cursor-crosshair group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-shadow">
                      <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Click to pin location</p>
                    </div>
                  </motion.button>
                )}

                {/* Pinned location */}
                {coordinates && (
                  <motion.div
                    initial={{ scale: 0, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <MapPin className="w-12 h-12 text-orange-600 fill-orange-600 drop-shadow-lg" />
                    </motion.div>
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-lg text-xs font-medium">
                      {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </div>
                  </motion.div>
                )}
              </div>

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
