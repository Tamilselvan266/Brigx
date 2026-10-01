import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Satellite, Image as ImageIcon, Download, LogOut, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { GoogleSatelliteMap } from '../GoogleSatelliteMap';

interface DashboardProps {
  mobile: string;
  onLogout: () => void;
}

export function GovernmentDashboard({ mobile, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('monitoring');

  const projects = [
    { id: 1, name: 'Highway Bridge Construction', location: 'NH-44, Bangalore', progress: 55, compliance: 'Good', alerts: 0 },
    { id: 2, name: 'Municipal Building', location: 'City Center', progress: 30, compliance: 'Warning', alerts: 2 },
    { id: 3, name: 'Water Treatment Plant', location: 'East Zone', progress: 75, compliance: 'Good', alerts: 0 },
  ];

  const recentAlerts = [
    { id: 1, project: 'Municipal Building', type: 'Photo Upload Delay', time: '2 hours ago', severity: 'Medium' },
    { id: 2, project: 'Municipal Building', type: 'Compliance Issue', time: '5 hours ago', severity: 'High' },
  ];

  const photoTimeline = [
    { id: 1, project: 'Highway Bridge', engineer: 'Suresh Reddy', time: '1 hour ago', location: 'NH-44' },
    { id: 2, project: 'Water Treatment', engineer: 'Amit Kumar', time: '3 hours ago', location: 'East Zone' },
  ];

  return (
    <div className="size-full bg-gray-50 flex flex-col overflow-hidden">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
          <img
                src="/brigx.png" 
                alt="BRIGX Logo"
                className="h-27 w-auto-contain"
              />
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">Government Official</p>
              <p className="font-semibold text-gray-900">+91 {mobile}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="monitoring" className="gap-2">
              <Shield className="w-4 h-4" />
              Project Monitoring
            </TabsTrigger>
            <TabsTrigger value="satellite" className="gap-2">
              <Satellite className="w-4 h-4" />
              Satellite View
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Photo Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-4">
            {recentAlerts.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-900">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Alerts ({recentAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{alert.project}</p>
                        <p className="text-sm text-gray-600">{alert.type}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                      <Badge variant={alert.severity === 'High' ? 'destructive' : 'default'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Assigned Projects</h2>
            </div>

            <div className="grid gap-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{project.location}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={project.compliance === 'Good' ? 'default' : 'destructive'}
                          className={project.compliance === 'Good' ? 'bg-green-600' : ''}
                        >
                          {project.compliance}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-orange-600">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                          />
                        </div>
                      </div>

                      {project.alerts > 0 && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{project.alerts} active alert{project.alerts > 1 ? 's' : ''}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Satellite className="w-4 h-4 mr-2" />
                          Satellite View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          View Photos
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="satellite" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Satellite Imagery</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project, index) => {
                // Assign realistic coordinates per project
                const coords = [
                  { lat: 13.0827, lng: 80.2707 },  // Highway Bridge - Chennai
                  { lat: 12.9716, lng: 77.5946 },  // Municipal Building - Bangalore
                  { lat: 17.3850, lng: 78.4867 },  // Water Treatment - Hyderabad
                ];
                const { lat, lng } = coords[index] ?? { lat: 12.9716, lng: 77.5946 };
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                      <div className="relative">
                        <Badge className="absolute top-3 right-3 z-10 bg-white text-gray-900">
                          Satellite View
                        </Badge>
                        <GoogleSatelliteMap
                          lat={lat}
                          lng={lng}
                          height="260px"
                          siteName={project.name}
                          zoom={17}
                          className="rounded-t-lg rounded-b-none"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                          <span className="text-gray-300">|</span>
                          <span className="font-mono text-xs">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          View Before/After Comparison
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Engineer Photo Timeline</h2>
            <div className="space-y-3">
              {photoTimeline.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{photo.project}</h3>
                              <p className="text-sm text-gray-600 mt-1">Engineer: {photo.engineer}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>{photo.time}</span>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {photo.location}
                                </div>
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">View Photo</Button>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
