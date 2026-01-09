import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Satellite, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Download,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Project {
  id: number;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
}

interface ProjectMonitoringProps {
  project: Project;
  onClose: () => void;
}

export function ProjectMonitoring({ project, onClose }: ProjectMonitoringProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'satellite'>('photos');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const photos = [
    { 
      id: 1, 
      date: new Date(Date.now() - 2 * 3600000), 
      engineer: 'Amit Kumar',
      location: project.location,
      coordinates: { lat: 12.9716, lng: 77.5946 },
    },
    { 
      id: 2, 
      date: new Date(Date.now() - 5 * 3600000), 
      engineer: 'Amit Kumar',
      location: project.location,
      coordinates: { lat: 12.9716, lng: 77.5946 },
    },
    { 
      id: 3, 
      date: new Date(Date.now() - 24 * 3600000), 
      engineer: 'Suresh Reddy',
      location: project.location,
      coordinates: { lat: 12.9716, lng: 77.5946 },
    },
  ];

  const satelliteImages = [
    { id: 1, date: new Date(Date.now() - 7 * 24 * 3600000), label: '1 week ago' },
    { id: 2, date: new Date(Date.now() - 14 * 24 * 3600000), label: '2 weeks ago' },
    { id: 3, date: new Date(Date.now() - 30 * 24 * 3600000), label: '1 month ago' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{project.location}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1">
              <TabsTrigger value="photos" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Engineer Photos ({photos.length})
              </TabsTrigger>
              <TabsTrigger value="satellite" className="gap-2">
                <Satellite className="w-4 h-4" />
                Satellite Imagery ({satelliteImages.length})
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Photo Timeline</h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>

              <div className="grid gap-4">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedImage(photo.id)}
                    >
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          {/* Thumbnail */}
                          <div className="relative w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 group overflow-hidden">
                            <ImageIcon className="w-12 h-12 text-white" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <Badge className="absolute top-2 right-2 text-xs">
                              #{photo.id}
                            </Badge>
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">Site Progress Photo</h4>
                                <p className="text-sm text-gray-600 mt-1">By {photo.engineer}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2 mt-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                {photo.date.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {photo.location} • {photo.coordinates.lat.toFixed(4)}, {photo.coordinates.lng.toFixed(4)}
                              </div>
                            </div>

                            <div className="mt-3 flex gap-2">
                              <Badge variant="secondary" className="text-xs">Auto-tagged</Badge>
                              <Badge variant="secondary" className="text-xs">GPS Verified</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Satellite Tab */}
            <TabsContent value="satellite" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Satellite Imagery Timeline</h3>
                <Button 
                  variant={compareMode ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setCompareMode(!compareMode)}
                  className={compareMode ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  {compareMode ? 'Exit Compare Mode' : 'Compare Before/After'}
                </Button>
              </div>

              {!compareMode ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {satelliteImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <div className="relative h-64 bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-t-lg overflow-hidden">
                          {/* Satellite view simulation */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-500 rounded-full blur-3xl" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Satellite className="w-16 h-16 text-white opacity-40" />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <Badge className="absolute top-3 right-3 bg-white text-gray-900">
                            {image.label}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {image.date.toLocaleDateString()}
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Before & After Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Before */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Before (1 month ago)</p>
                        <div className="relative h-80 bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-lg overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Satellite className="w-20 h-20 text-white opacity-30" />
                          </div>
                          <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                            Initial State
                          </Badge>
                        </div>
                      </div>

                      {/* After */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">After (Current)</p>
                        <div className="relative h-80 bg-gradient-to-br from-green-700 via-green-600 to-blue-800 rounded-lg overflow-hidden">
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-orange-500 rounded" />
                            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gray-700 rounded" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Satellite className="w-20 h-20 text-white opacity-30" />
                          </div>
                          <Badge className="absolute top-3 left-3 bg-orange-600">
                            Current State
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Changes Detected</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Foundation work completed (approx. 800 sq ft)</li>
                        <li>• Ground floor structure visible</li>
                        <li>• Construction materials stockpiled on site</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-32 h-32 text-white opacity-50" />
                <Badge className="absolute top-4 left-4 text-lg px-3 py-1">
                  Photo #{selectedImage}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    const currentIndex = photos.findIndex(p => p.id === selectedImage);
                    if (currentIndex > 0) {
                      setSelectedImage(photos[currentIndex - 1].id);
                    }
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    const currentIndex = photos.findIndex(p => p.id === selectedImage);
                    if (currentIndex < photos.length - 1) {
                      setSelectedImage(photos[currentIndex + 1].id);
                    }
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
