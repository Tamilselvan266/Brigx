import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Plus, 
  Users, 
  MessageSquare, 
  Satellite, 
  ShoppingBag, 
  LogOut,
  Search,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ProjectCreation } from '../ProjectCreation';
import { ProjectMonitoring } from '../ProjectMonitoring';
import { ChatSystem } from '../ChatSystem';

interface DashboardProps {
  mobile: string;
  onLogout: () => void;
}

export function HomeOwnerDashboard({ mobile, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectCreation, setShowProjectCreation] = useState(false);
  const [selectedProjectForMonitoring, setSelectedProjectForMonitoring] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  // Mock data
  const projects = [
    {
      id: 1,
      name: '2BHK Villa Construction',
      location: 'Whitefield, Bangalore',
      status: 'In Progress',
      progress: 45,
      architect: 'Riya Sharma',
      engineer: 'Amit Kumar',
      lastUpdate: '2 hours ago',
    },
    {
      id: 2,
      name: 'Office Renovation',
      location: 'MG Road, Bangalore',
      status: 'Planning',
      progress: 15,
      architect: 'Priya Singh',
      engineer: 'Pending',
      lastUpdate: '1 day ago',
    },
  ];

  const architects = [
    { id: 1, name: 'Riya Sharma', experience: '12 years', rating: 4.8, projects: 45, verified: true },
    { id: 2, name: 'Priya Singh', experience: '8 years', rating: 4.6, projects: 32, verified: true },
    { id: 3, name: 'Karthik Menon', experience: '15 years', rating: 4.9, projects: 67, verified: true },
  ];

  const engineers = [
    { id: 1, name: 'Amit Kumar', experience: '10 years', rating: 4.7, specialization: 'Civil', verified: true },
    { id: 2, name: 'Suresh Reddy', experience: '14 years', rating: 4.9, specialization: 'Structural', verified: true },
  ];

  const materials = [
    { id: 1, name: 'Premium Cement', supplier: 'BuildMart', price: '₹350/bag', rating: 4.5 },
    { id: 2, name: 'Steel TMT Bars', supplier: 'IronWorks', price: '₹55/kg', rating: 4.7 },
    { id: 3, name: 'Premium Tiles', supplier: 'TileWorld', price: '₹450/sqft', rating: 4.6 },
  ];

  return (
    <div className="size-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

            {/* ✅ WHITE LOGO BOX */}
            
              <img
                src="/src/assets/brigx.png"
                alt="BRIGX Logo"
                className="h-27 w-auto-contain"
              />

            <div className="hidden md:block">
              <p className="text-sm text-gray-500">Home Owner</p>
              <p className="font-semibold text-gray-900">+91 {mobile}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-600 rounded-full" />
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>


      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="projects" className="gap-2">
              <Home className="w-4 h-4" />
              My Projects
            </TabsTrigger>
            <TabsTrigger value="architects" className="gap-2">
              <Users className="w-4 h-4" />
              Architects
            </TabsTrigger>
            <TabsTrigger value="engineers" className="gap-2">
              <Users className="w-4 h-4" />
              Engineers
            </TabsTrigger>
            <TabsTrigger value="materials" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Materials
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setShowProjectCreation(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid gap-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
                          variant={project.status === 'In Progress' ? 'default' : 'secondary'}
                          className={project.status === 'In Progress' ? 'bg-green-600' : ''}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
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

                      {/* Team */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Architect</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                                {project.architect.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{project.architect}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Engineer</p>
                          <div className="flex items-center gap-2">
                            {project.engineer !== 'Pending' ? (
                              <>
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                    {project.engineer.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{project.engineer}</span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Not assigned</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedChat(project)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedProjectForMonitoring(project)}>
                          <Satellite className="w-4 h-4 mr-2" />
                          Monitor
                        </Button>
                      </div>

                      {/* Last Update */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                        <Clock className="w-3 h-3" />
                        Last updated {project.lastUpdate}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Architects Tab */}
          <TabsContent value="architects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Find Architects</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search architects..." className="pl-9" />
              </div>
            </div>

            <div className="grid gap-4">
              {architects.map((architect, index) => (
                <motion.div
                  key={architect.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="text-lg bg-purple-100 text-purple-700">
                              {architect.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{architect.name}</h3>
                              {architect.verified && (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{architect.experience} experience</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="font-semibold">{architect.rating}</span>
                              </div>
                              <span className="text-sm text-gray-500">{architect.projects} projects</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request Design
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Engineers Tab */}
          <TabsContent value="engineers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Verified Engineers</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search engineers..." className="pl-9" />
              </div>
            </div>

            <div className="grid gap-4">
              {engineers.map((engineer, index) => (
                <motion.div
                  key={engineer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="text-lg bg-green-100 text-green-700">
                              {engineer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{engineer.name}</h3>
                              {engineer.verified && (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {engineer.specialization} Engineer • {engineer.experience} experience
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-yellow-500">★</span>
                              <span className="font-semibold">{engineer.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Hire
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Raw Materials</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search materials..." className="pl-9" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <p className="text-sm text-gray-500">{material.supplier}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-2xl font-bold text-orange-600">{material.price}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold">{material.rating}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Creation Modal */}
      {showProjectCreation && (
        <ProjectCreation 
          onClose={() => setShowProjectCreation(false)} 
          onProjectCreated={(project) => {
            console.log('Project created:', project);
            setShowProjectCreation(false);
          }}
        />
      )}

      {/* Project Monitoring Modal */}
      {selectedProjectForMonitoring && (
        <ProjectMonitoring 
          project={selectedProjectForMonitoring} 
          onClose={() => setSelectedProjectForMonitoring(null)} 
        />
      )}

      {/* Chat System Modal */}
      {selectedChat && (
        <ChatSystem 
          chatType="group"
          chatName={selectedChat.name}
          participants={[
            { id: '1', name: selectedChat.architect, role: 'Architect' },
            { id: '2', name: selectedChat.engineer, role: 'Engineer' },
            { id: '3', name: 'You', role: 'Home Owner' },
          ]}
          currentUserId="3"
          onClose={() => setSelectedChat(null)} 
        />
      )}
    </div>
  );
}