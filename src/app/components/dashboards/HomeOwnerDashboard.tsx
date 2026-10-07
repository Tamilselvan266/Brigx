import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatSystem } from '../ChatSystem';
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
  CheckCircle2,
  X,
} from 'lucide-react';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Avatar,
  AvatarFallback,
} from '../ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';

import { ProjectCreation } from '../ProjectCreation';
import { ProjectMonitoring } from '../ProjectMonitoring';

interface DashboardProps {
  mobile: string;
  onLogout: () => void;
}

interface Project {
  id: number;
  name: string;
  type?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
  status: string;
  progress: number;
  architect: string;
  engineer: string;
  lastUpdate: string;
  createdAt?: Date;
}

export function HomeOwnerDashboard({
  mobile,
  onLogout,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('projects');

  const [showProjectCreation, setShowProjectCreation] =
    useState(false);

  const [selectedProjectForMonitoring, setSelectedProjectForMonitoring] =
    useState<Project | null>(null);

  const [selectedChat, setSelectedChat] =
    useState<Project | null>(null);

  // Profile / action state
  const [selectedArchitect, setSelectedArchitect] =
    useState<any>(null);

  const [selectedEngineer, setSelectedEngineer] =
    useState<any>(null);

  const [cartMaterial, setCartMaterial] =
    useState<any>(null);

  // Additional feature state
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [hiredEngineers, setHiredEngineers] = useState<number[]>([]);

  // ============================================================
  // PROJECTS STATE
  // ============================================================
  // IMPORTANT:
  // This is now useState instead of a normal const array.
  // This allows newly created projects to immediately appear
  // inside the Home Owner Dashboard.
  // ============================================================

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: '2BHK Villa Construction',
      location: 'Whitefield, Bangalore',
      coordinates: {
        lat: 12.9698,
        lng: 77.7499,
      },
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
      coordinates: {
        lat: 12.9756,
        lng: 77.6066,
      },
      status: 'Planning',
      progress: 15,
      architect: 'Priya Singh',
      engineer: 'Pending',
      lastUpdate: '1 day ago',
    },
  ]);

  // ============================================================
  // CART FUNCTIONS
  // ============================================================

  const handleAddToCart = (material: any) => {
    setCartMaterial(material);
  };

  const confirmAddToCart = () => {
    if (cartMaterial) {
      setCart((prev) => [...prev, cartMaterial]);
      setCartMaterial(null);
    }
  };

  // ============================================================
  // ENGINEER FUNCTIONS
  // ============================================================

  const handleHire = (engineer: any) => {
    if (hiredEngineers.includes(engineer.id)) return;

    setHiredEngineers((prev) => [
      ...prev,
      engineer.id,
    ]);

    setSelectedEngineer({
      ...engineer,
      hire: true,
    });
  };

  // ============================================================
  // CREATE PROJECT
  // ============================================================
  //
  // This function receives the project created by
  // ProjectCreation.tsx.
  //
  // The project is then added to the beginning of the
  // projects array.
  //
  // Therefore the newly created project immediately appears
  // in "My Projects".
  // ============================================================

  const handleProjectCreated = (project: any) => {
    console.log('New project received:', project);

    const newDashboardProject: Project = {
      id: project.id || Date.now(),

      name: project.name,

      type: project.type,

      location:
        project.location || 'Location not specified',

      coordinates:
        project.coordinates || null,

      status: 'Planning',

      progress: 0,

      architect:
        project.architect || 'Not assigned',

      engineer:
        project.engineer || 'Pending',

      lastUpdate: 'Just now',

      createdAt:
        project.createdAt || new Date(),
    };

    // Add new project to dashboard
    setProjects((previousProjects) => [
      newDashboardProject,
      ...previousProjects,
    ]);

    // Close project creation modal
    setShowProjectCreation(false);

    // Automatically switch to My Projects tab
    setActiveTab('projects');

    console.log(
      'Project added to Home Owner Dashboard:',
      newDashboardProject
    );
  };

  // ============================================================
  // MOCK DATA
  // ============================================================

  const architects = [
    {
      id: 1,
      name: 'Riya Sharma',
      experience: '12 years',
      rating: 4.8,
      projects: 45,
      verified: true,
    },
    {
      id: 2,
      name: 'Priya Singh',
      experience: '8 years',
      rating: 4.6,
      projects: 32,
      verified: true,
    },
    {
      id: 3,
      name: 'Karthik Menon',
      experience: '15 years',
      rating: 4.9,
      projects: 67,
      verified: true,
    },
  ];

  const engineers = [
    {
      id: 1,
      name: 'Amit Kumar',
      experience: '10 years',
      rating: 4.7,
      specialization: 'Civil',
      verified: true,
    },
    {
      id: 2,
      name: 'Suresh Reddy',
      experience: '14 years',
      rating: 4.9,
      specialization: 'Structural',
      verified: true,
    },
  ];

  const materials = [
    {
      id: 1,
      name: 'Premium Cement',
      supplier: 'BuildMart',
      price: '₹350/bag',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Steel TMT Bars',
      supplier: 'IronWorks',
      price: '₹55/kg',
      rating: 4.7,
    },
    {
      id: 3,
      name: 'Premium Tiles',
      supplier: 'TileWorld',
      price: '₹450/sqft',
      rating: 4.6,
    },
  ];

  return (
    <div className="size-full bg-gray-50 flex flex-col overflow-hidden">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <motion.header
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            {/* LOGO */}

            <img
              src="/brigx.png"
              alt="BRIGX Logo"
              className="h-27 w-auto-contain"
            />

            <div className="hidden md:block">
              <p className="text-sm text-gray-500">
                Home Owner
              </p>

              <p className="font-semibold text-gray-900">
                +91 {mobile}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <MessageSquare className="w-5 h-5" />

              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-600 rounded-full" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>

          </div>
        </div>
      </motion.header>

      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <div className="flex-1 overflow-auto p-6">

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >

          {/* ================================================== */}
          {/* TAB LIST */}
          {/* ================================================== */}

          <TabsList className="bg-white border border-gray-200 p-1">

            <TabsTrigger
              value="projects"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              My Projects
            </TabsTrigger>

            <TabsTrigger
              value="architects"
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Architects
            </TabsTrigger>

            <TabsTrigger
              value="engineers"
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Engineers
            </TabsTrigger>

            <TabsTrigger
              value="materials"
              className="gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Materials
            </TabsTrigger>

          </TabsList>

          {/* ================================================== */}
          {/* PROJECTS TAB */}
          {/* ================================================== */}

          <TabsContent
            value="projects"
            className="space-y-4"
          >

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  My Projects
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {projects.length} project
                  {projects.length !== 1 ? 's' : ''} in your dashboard
                </p>
              </div>

              {/* NEW PROJECT BUTTON */}

              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setShowProjectCreation(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>

            </div>

            {/* ================================================== */}
            {/* PROJECT LIST */}
            {/* ================================================== */}

            {projects.length === 0 ? (

              <Card>
                <CardContent className="p-10 text-center">

                  <Home className="w-12 h-12 mx-auto text-gray-300 mb-4" />

                  <h3 className="text-lg font-semibold text-gray-700">
                    No Projects Yet
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Create your first construction project.
                  </p>

                  <Button
                    className="mt-5 bg-orange-600 hover:bg-orange-700"
                    onClick={() =>
                      setShowProjectCreation(true)
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>

                </CardContent>
              </Card>

            ) : (

              <div className="grid gap-4">

                {projects.map((project, index) => (

                  <motion.div
                    key={project.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                  >

                    <Card className="hover:shadow-lg transition-shadow">

                      {/* ================================================== */}
                      {/* PROJECT HEADER */}
                      {/* ================================================== */}

                      <CardHeader>

                        <div className="flex justify-between items-start">

                          <div>

                            <CardTitle className="text-xl">
                              {project.name}
                            </CardTitle>

                            {/* LOCATION */}

                            <div className="flex items-center gap-2 mt-2 text-gray-500">

                              <MapPin className="w-4 h-4" />

                              <span className="text-sm">
                                {project.location}
                              </span>

                            </div>

                            {/* PINNED COORDINATES */}

                            {project.coordinates && (
                              <div className="flex items-center gap-2 mt-2">

                                <Badge
                                  variant="outline"
                                  className="text-xs border-green-300 text-green-700 bg-green-50"
                                >
                                  <MapPin className="w-3 h-3 mr-1" />
                                  Location Pinned
                                </Badge>

                                <span className="text-xs text-gray-500">
                                  {project.coordinates.lat.toFixed(6)},
                                  {' '}
                                  {project.coordinates.lng.toFixed(6)}
                                </span>

                              </div>
                            )}

                          </div>

                          {/* STATUS */}

                          <Badge
                            variant={
                              project.status === 'In Progress'
                                ? 'default'
                                : 'secondary'
                            }
                            className={
                              project.status === 'In Progress'
                                ? 'bg-green-600'
                                : ''
                            }
                          >
                            {project.status}
                          </Badge>

                        </div>

                      </CardHeader>

                      <CardContent className="space-y-4">

                        {/* ================================================== */}
                        {/* PROJECT TYPE */}
                        {/* ================================================== */}

                        {project.type && (
                          <div>

                            <p className="text-xs text-gray-500">
                              Project Type
                            </p>

                            <p className="text-sm font-medium capitalize mt-1">
                              {project.type}
                            </p>

                          </div>
                        )}

                        {/* ================================================== */}
                        {/* PROGRESS */}
                        {/* ================================================== */}

                        <div>

                          <div className="flex justify-between text-sm mb-2">

                            <span className="text-gray-600">
                              Progress
                            </span>

                            <span className="font-semibold text-orange-600">
                              {project.progress}%
                            </span>

                          </div>

                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                            <motion.div
                              initial={{
                                width: 0,
                              }}
                              animate={{
                                width: `${project.progress}%`,
                              }}
                              transition={{
                                duration: 1,
                                delay: 0.3,
                              }}
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                            />

                          </div>

                        </div>

                        {/* ================================================== */}
                        {/* TEAM */}
                        {/* ================================================== */}

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">

                          {/* ARCHITECT */}

                          <div>

                            <p className="text-xs text-gray-500 mb-1">
                              Architect
                            </p>

                            <div className="flex items-center gap-2">

                              <Avatar className="w-6 h-6">

                                <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                                  {project.architect !== 'Not assigned'
                                    ? project.architect
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                    : 'NA'}
                                </AvatarFallback>

                              </Avatar>

                              <span className="text-sm font-medium">
                                {project.architect}
                              </span>

                            </div>

                          </div>

                          {/* ENGINEER */}

                          <div>

                            <p className="text-xs text-gray-500 mb-1">
                              Engineer
                            </p>

                            <div className="flex items-center gap-2">

                              {project.engineer !== 'Pending' ? (

                                <>

                                  <Avatar className="w-6 h-6">

                                    <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                      {project.engineer
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>

                                  </Avatar>

                                  <span className="text-sm font-medium">
                                    {project.engineer}
                                  </span>

                                </>

                              ) : (

                                <span className="text-sm text-gray-400 italic">
                                  Not assigned
                                </span>

                              )}

                            </div>

                          </div>

                        </div>

                        {/* ================================================== */}
                        {/* ACTION BUTTONS */}
                        {/* ================================================== */}

                        <div className="flex gap-2 pt-2">

                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              setSelectedChat(project)
                            }
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              setSelectedProjectForMonitoring(
                                project
                              )
                            }
                          >
                            <Satellite className="w-4 h-4 mr-2" />
                            Monitor
                          </Button>

                        </div>

                        {/* ================================================== */}
                        {/* LAST UPDATE */}
                        {/* ================================================== */}

                        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">

                          <Clock className="w-3 h-3" />

                          Last updated {project.lastUpdate}

                        </div>

                      </CardContent>

                    </Card>

                  </motion.div>

                ))}

              </div>

            )}

          </TabsContent>

          {/* ================================================== */}
          {/* ARCHITECTS TAB */}
          {/* ================================================== */}

          <TabsContent
            value="architects"
            className="space-y-4"
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold text-gray-900">
                Find Architects
              </h2>

              <div className="relative w-64">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  placeholder="Search architects..."
                  className="pl-9"
                />

              </div>

            </div>

            <div className="grid gap-4">

              {architects.map((architect, index) => (

                <motion.div
                  key={architect.id}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >

                  <Card className="hover:shadow-lg transition-shadow">

                    <CardContent className="p-6">

                      <div className="flex items-start justify-between">

                        <div className="flex gap-4">

                          <Avatar className="w-16 h-16">

                            <AvatarFallback className="text-lg bg-purple-100 text-purple-700">
                              {architect.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>

                          </Avatar>

                          <div>

                            <div className="flex items-center gap-2">

                              <h3 className="font-semibold text-lg">
                                {architect.name}
                              </h3>

                              {architect.verified && (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              )}

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              {architect.experience} experience
                            </p>

                            <div className="flex items-center gap-4 mt-2">

                              <div className="flex items-center gap-1">

                                <span className="text-yellow-500">
                                  ★
                                </span>

                                <span className="font-semibold">
                                  {architect.rating}
                                </span>

                              </div>

                              <span className="text-sm text-gray-500">
                                {architect.projects} projects
                              </span>

                            </div>

                          </div>

                        </div>

                        <div className="flex gap-2">

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedArchitect(
                                architect
                              )
                            }
                          >
                            View Profile
                          </Button>

                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() =>
                              setSelectedArchitect({
                                ...architect,
                                request: true,
                              })
                            }
                          >
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

          {/* ================================================== */}
          {/* ENGINEERS TAB */}
          {/* ================================================== */}

          <TabsContent
            value="engineers"
            className="space-y-4"
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold text-gray-900">
                Verified Engineers
              </h2>

              <div className="relative w-64">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  placeholder="Search engineers..."
                  className="pl-9"
                />

              </div>

            </div>

            <div className="grid gap-4">

              {engineers.map((engineer, index) => (

                <motion.div
                  key={engineer.id}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >

                  <Card className="hover:shadow-lg transition-shadow">

                    <CardContent className="p-6">

                      <div className="flex items-start justify-between">

                        <div className="flex gap-4">

                          <Avatar className="w-16 h-16">

                            <AvatarFallback className="text-lg bg-green-100 text-green-700">
                              {engineer.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>

                          </Avatar>

                          <div>

                            <div className="flex items-center gap-2">

                              <h3 className="font-semibold text-lg">
                                {engineer.name}
                              </h3>

                              {engineer.verified && (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              )}

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              {engineer.specialization} Engineer •{' '}
                              {engineer.experience} experience
                            </p>

                            <div className="flex items-center gap-1 mt-2">

                              <span className="text-yellow-500">
                                ★
                              </span>

                              <span className="font-semibold">
                                {engineer.rating}
                              </span>

                            </div>

                          </div>

                        </div>

                        <div className="flex gap-2">

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedEngineer(
                                engineer
                              )
                            }
                          >
                            View Profile
                          </Button>

                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() =>
                              handleHire(engineer)
                            }
                            disabled={hiredEngineers.includes(
                              engineer.id
                            )}
                          >
                            {hiredEngineers.includes(
                              engineer.id
                            )
                              ? 'Hired'
                              : 'Hire'}
                          </Button>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                </motion.div>

              ))}

            </div>

          </TabsContent>

          {/* ================================================== */}
          {/* MATERIALS TAB */}
          {/* ================================================== */}

          <TabsContent
            value="materials"
            className="space-y-4"
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold text-gray-900">
                Raw Materials
              </h2>

              <div className="flex items-center gap-2">

                <div className="relative w-64">

                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <Input
                    placeholder="Search materials..."
                    className="pl-9"
                  />

                </div>

                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() =>
                    setShowCart(true)
                  }
                >
                  Cart ({cart.length})
                </Button>

              </div>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              {materials.map((material, index) => (

                <motion.div
                  key={material.id}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">

                    <CardHeader>

                      <CardTitle className="text-lg">
                        {material.name}
                      </CardTitle>

                      <p className="text-sm text-gray-500">
                        {material.supplier}
                      </p>

                    </CardHeader>

                    <CardContent>

                      <div className="flex justify-between items-center mb-4">

                        <p className="text-2xl font-bold text-orange-600">
                          {material.price}
                        </p>

                        <div className="flex items-center gap-1">

                          <span className="text-yellow-500">
                            ★
                          </span>

                          <span className="font-semibold">
                            {material.rating}
                          </span>

                        </div>

                      </div>

                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() =>
                          handleAddToCart(material)
                        }
                      >
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

      {/* ====================================================== */}
      {/* PROJECT CREATION MODAL */}
      {/* ====================================================== */}

      {showProjectCreation && (

        <ProjectCreation

          onClose={() =>
            setShowProjectCreation(false)
          }

          onProjectCreated={
            handleProjectCreated
          }

        />

      )}

      {/* ====================================================== */}
      {/* PROJECT MONITORING MODAL */}
      {/* ====================================================== */}

      {selectedProjectForMonitoring && (

        <ProjectMonitoring

          project={
            selectedProjectForMonitoring
          }

          onClose={() =>
            setSelectedProjectForMonitoring(
              null
            )
          }

        />

      )}

      {/* ====================================================== */}
      {/* CHAT SYSTEM MODAL */}
      {/* ====================================================== */}

      {selectedChat && (

        <ChatSystem

          chatType="group"

          chatName={
            selectedChat.name
          }

          participants={[
            {
              id: '1',
              name:
                selectedChat.architect,
              role: 'Architect',
            },
            {
              id: '2',
              name:
                selectedChat.engineer,
              role: 'Engineer',
            },
            {
              id: '3',
              name: 'You',
              role: 'Home Owner',
            },
          ]}

          currentUserId="3"

          onClose={() =>
            setSelectedChat(null)
          }

        />

      )}

      {/* ====================================================== */}
      {/* ARCHITECT MODAL */}
      {/* ====================================================== */}

      {selectedArchitect && (

        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <motion.div
            className="bg-white rounded-xl w-full max-w-md p-6 space-y-4"
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: 1,
            }}
          >

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">

                {selectedArchitect.request
                  ? 'Request Design'
                  : 'Profile'}

              </h3>

              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setSelectedArchitect(null)
                }
              >
                <X />
              </Button>

            </div>

            {selectedArchitect.request ? (

              <p>
                Design request sent to{' '}
                {selectedArchitect.name}.
              </p>

            ) : (

              <div>

                <p className="font-semibold text-lg">
                  {selectedArchitect.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedArchitect.experience}{' '}
                  experience
                </p>

                <p className="mt-2">
                  Rating:{' '}
                  <span className="font-semibold">
                    {selectedArchitect.rating}
                  </span>
                </p>

              </div>

            )}

          </motion.div>

        </motion.div>

      )}

      {/* ====================================================== */}
      {/* ENGINEER MODAL */}
      {/* ====================================================== */}

      {selectedEngineer && (

        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <motion.div
            className="bg-white rounded-xl w-full max-w-md p-6 space-y-4"
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: 1,
            }}
          >

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">

                {selectedEngineer.hire
                  ? 'Hire Engineer'
                  : 'Profile'}

              </h3>

              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setSelectedEngineer(null)
                }
              >
                <X />
              </Button>

            </div>

            {selectedEngineer.hire ? (

              <p>
                Request to hire{' '}
                {selectedEngineer.name}{' '}
                has been sent.
              </p>

            ) : (

              <div>

                <p className="font-semibold text-lg">
                  {selectedEngineer.name}
                </p>

                <p className="text-sm text-gray-500">
                  {selectedEngineer.specialization}{' '}
                  • {selectedEngineer.experience}{' '}
                  experience
                </p>

                <p className="mt-2">
                  Rating:{' '}
                  <span className="font-semibold">
                    {selectedEngineer.rating}
                  </span>
                </p>

              </div>

            )}

          </motion.div>

        </motion.div>

      )}

      {/* ====================================================== */}
      {/* ADD TO CART MODAL */}
      {/* ====================================================== */}

      {cartMaterial && (

        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <motion.div
            className="bg-white rounded-xl w-full max-w-sm p-6 space-y-4"
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: 1,
            }}
          >

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">
                Add to Cart
              </h3>

              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setCartMaterial(null)
                }
              >
                <X />
              </Button>

            </div>

            <p>
              {cartMaterial.name} -{' '}
              {cartMaterial.price}
            </p>

            <Button
              onClick={() => {

                const materialName =
                  cartMaterial.name;

                confirmAddToCart();

                alert(
                  `${materialName} added to cart`
                );

              }}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Confirm
            </Button>

          </motion.div>

        </motion.div>

      )}

      {/* ====================================================== */}
      {/* CART MODAL */}
      {/* ====================================================== */}

      {showCart && (

        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <motion.div
            className="bg-white rounded-xl w-full max-w-md p-6 space-y-4"
            initial={{
              scale: 0.9,
            }}
            animate={{
              scale: 1,
            }}
          >

            <div className="flex justify-between items-center">

              <h3 className="text-xl font-bold">
                My Cart
              </h3>

              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setShowCart(false)
                }
              >
                <X />
              </Button>

            </div>

            {cart.length === 0 ? (

              <p>
                Your cart is empty.
              </p>

            ) : (

              <div className="space-y-2">

                {cart.map((item, idx) => (

                  <div
                    key={idx}
                    className="flex justify-between"
                  >
                    <span>
                      {item.name}
                    </span>

                    <span>
                      {item.price}
                    </span>
                  </div>

                ))}

                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => {

                    alert(
                      'Order placed!'
                    );

                    setCart([]);

                    setShowCart(false);

                  }}
                >
                  Place Order
                </Button>

              </div>

            )}

          </motion.div>

        </motion.div>

      )}

    </div>
  );
}