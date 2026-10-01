import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Pencil,
  Upload,
  MessageSquare,
  LogOut,
  Star,
  Eye,
  Download,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ProjectCreation } from '../ProjectCreation';
import { toast } from 'sonner';
import { ChatSystem } from '../Chatsystem';

interface DashboardProps {
  mobile: string;
  onLogout: () => void;
}

export function ArchitectDashboard({ mobile, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('portfolio');

  const [portfolio, setPortfolio] = useState([
    { id: 1, name: 'Modern Villa Design', type: '3BHK', views: 245, likes: 89, status: 'Published' },
    { id: 2, name: 'Office Space Layout', type: 'Commercial', views: 178, likes: 56, status: 'Published' },
    { id: 3, name: 'Apartment Complex', type: '2BHK', views: 312, likes: 124, status: 'Published' },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const requests = [
    { id: 1, client: 'Rahul Verma', project: 'Villa Design', budget: '₹2,50,000', status: 'New', time: '2 hours ago' },
    { id: 2, client: 'Priya Sharma', project: 'Office Renovation', budget: '₹1,80,000', status: 'In Discussion', time: '1 day ago' },
  ];

  const initialProjects = [
    { id: 1, name: '2BHK Villa for Amit Kumar', progress: 75, deadline: '10 days', status: 'On Track' },
    { id: 2, name: 'Office Layout for TechCorp', progress: 40, deadline: '15 days', status: 'On Track' },
  ];

  const [projects, setProjects] = useState(initialProjects);

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showProjectCreator, setShowProjectCreator] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatConfig, setChatConfig] = useState<any>(null);
  const [selectedDesign, setSelectedDesign] = useState<any>(null);

  const [profile, setProfile] = useState({
    name: 'Architect Name',
    firm: 'Design Studio',
    email: '',
    bio: 'Experienced architect specializing in residential and commercial projects.',
  });

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
            <img
              src="/brigx.png"
              alt="BRIGX Logo"
              className="h-27 w-auto-contain"
            />
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">Architect</p>
              <p className="font-semibold text-gray-900">+91 {mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative" onClick={() => {
              setChatConfig({
                chatType: 'group',
                chatName: 'General Chat',
                participants: [
                  { id: 'arch-1', name: 'Architect', role: 'architect' },
                  { id: 'builder-1', name: 'Builder', role: 'builder' },
                ],
                currentUserId: 'arch-1',
              });
              setChatOpen(true);
            }}>
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
            <TabsTrigger value="portfolio" className="gap-2">
              <Pencil className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <FileText className="w-4 h-4" />
              Requests
              {requests.filter(r => r.status === 'New').length > 0 && (
                <Badge className="ml-1 bg-orange-600">{requests.filter(r => r.status === 'New').length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Active Projects
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Portfolio</h2>
              <div>
                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => fileInputRef.current?.click()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Design
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const newEntry = {
                      id: portfolio.length + 1,
                      name: file.name,
                      type: 'Custom',
                      views: 0,
                      likes: 0,
                      status: 'Published',
                    };
                    setPortfolio((prev) => [...prev, newEntry]);
                    toast.success('Design uploaded');
                    e.target.value = '';
                  }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Pencil className="w-16 h-16 text-white opacity-50" />
                      </div>
                      <Badge className="absolute top-3 right-3 bg-white text-purple-700">
                        {design.type}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-3">{design.name}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {design.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {design.likes}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {design.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedDesign(design)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                          navigator.clipboard?.writeText(`https://brigx.app/design/${design.id}`);
                          toast.success('Link copied to clipboard!', { description: `Share link for "${design.name}"` });
                        }}>
                          <Download className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Client Requests</h2>
            </div>

            <div className="space-y-3">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${request.status === 'New' ? 'border-2 border-orange-500' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {request.client.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{request.client}</h3>
                              {request.status === 'New' && (
                                <Badge className="bg-orange-600">New</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">{request.project}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="font-semibold text-green-600">{request.budget}</span>
                              <span className="text-gray-500">{request.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setChatConfig({
                              chatType: 'private',
                              chatName: `Chat with ${request.client}`,
                              participants: [
                                { id: 'arch-1', name: 'Architect', role: 'architect' },
                                { id: `client-${request.id}`, name: request.client, role: 'client' },
                              ],
                              currentUserId: 'arch-1',
                            });
                            setChatOpen(true);
                          }}>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => toast.success('Request accepted')}>
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Active Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
              <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setShowProjectCreator(true)}>
                <Plus className="w-4 h-4 mr-1" /> New Project
              </Button>
            </div>

            <div className="space-y-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {project.deadline} remaining
                          </div>
                        </div>
                        <Badge className="bg-green-600">{project.status}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-purple-600">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success('File uploaded')}>
                          <Upload className="w-4 h-4 mr-1" />
                          Upload Files
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                          setChatConfig({
                            chatType: 'private',
                            chatName: `Project: ${project.name}`,
                            participants: [
                              { id: 'arch-1', name: 'Architect', role: 'architect' },
                              { id: 'client-1', name: 'Client', role: 'client' },
                            ],
                            currentUserId: 'arch-1',
                          });
                          setChatOpen(true);
                        }}>
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 flex-1" onClick={() => setShowProjectCreator(true)}>
                          <Pencil className="w-4 h-4 mr-1" />
                          Start Design
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Design Modal */}
      {selectedDesign && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{selectedDesign.name}</h3>
              <Button size="icon" variant="ghost" onClick={() => setSelectedDesign(null)}>
                <X />
              </Button>
            </div>
            <div className="h-56 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Pencil className="w-20 h-20 text-white opacity-50" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{selectedDesign.type}</Badge>
                <Badge className="bg-green-100 text-green-700">{selectedDesign.status}</Badge>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {selectedDesign.views} views</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {selectedDesign.likes} likes</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => {
                navigator.clipboard?.writeText(`https://brigx.app/design/${selectedDesign.id}`);
                toast.success('Link copied!');
              }}>
                <Download className="w-4 h-4 mr-1" /> Share
              </Button>
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={() => setSelectedDesign(null)}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Project Creation Modal */}
      {showProjectCreator && (
        <ProjectCreation
          onClose={() => setShowProjectCreator(false)}
          onProjectCreated={(project) => {
            setProjects((prev) => [...prev, {
              id: prev.length + 1,
              name: project.name || 'New Project',
              progress: 0,
              deadline: '30 days',
              status: 'On Track',
            }]);
            toast.success('Project created successfully!');
            setShowProjectCreator(false);
          }}
        />
      )}

      {/* Chat System */}
      {chatOpen && chatConfig && (
        <ChatSystem
          chatType={chatConfig.chatType}
          chatName={chatConfig.chatName}
          participants={chatConfig.participants}
          currentUserId={chatConfig.currentUserId}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

// add modals outside component? (none)
