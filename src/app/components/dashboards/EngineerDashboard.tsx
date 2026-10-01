import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ChatSystem } from '../Chatsystem';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { GoogleSatelliteMap } from '../GoogleSatelliteMap';

interface DashboardProps {
  mobile: string;
  onLogout: () => void;
}

export function EngineerDashboard({ mobile, onLogout }: DashboardProps) {
  const TOTAL_TIME = 10800; // 3 hours

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [photos, setPhotos] = useState<
    Array<{
      id: number;
      timestamp: Date;
      location: string;
      status: 'success';
      uploader?: 'engineer' | 'builder' | 'homeowner';
      projectId?: number;
    }>
  >([
    {
      id: 1,
      timestamp: new Date(Date.now() - 6 * 3600000),
      location: 'Plot 123, Whitefield',
      status: 'success',
      uploader: 'engineer',
      projectId: 1,
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3 * 3600000),
      location: 'Plot 123, Whitefield',
      status: 'success',
      uploader: 'engineer',
      projectId: 2,
    },
  ]);

  // 🔥 Camera input reference
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= PROJECTS ================= */
  const [projects] = useState([
    { id: 1, name: 'Residential Villa - Whitefield' },
    { id: 2, name: 'Apartment Block - Indiranagar' },
    { id: 3, name: 'Public Park - Koramangala' },
  ]);

  const [selectedProject, setSelectedProject] = useState<number | null>(projects[0]?.id ?? null);
  const [viewMode, setViewMode] = useState<'list' | 'project'>('list');

  /* ================= SATELLITE & FILTER ================= */
  const [satelliteView, setSatelliteView] = useState(false);
  const [onlyEngineerPhotos, setOnlyEngineerPhotos] = useState(false);

  /* ================= TIMER ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          toast.error('Photo upload deadline missed!', {
            description: 'Alert sent to homeowner and officials',
          });
          return TOTAL_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeRemaining === 1800) {
      toast.warning('Upload reminder', {
        description: '30 minutes remaining to upload site photo',
      });
    }
    if (timeRemaining === 300) {
      toast.error('Urgent: Upload required!', {
        description: 'Only 5 minutes left',
      });
    }
  }, [timeRemaining]);

  /* ================= HELPERS ================= */
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((TOTAL_TIME - timeRemaining) / TOTAL_TIME) * 100;

  const timerColor =
    timeRemaining > 3600
      ? 'text-green-600'
      : timeRemaining > 1800
        ? 'text-yellow-600'
        : 'text-red-600';

  const timerBg =
    timeRemaining > 3600
      ? 'from-green-500 to-green-600'
      : timeRemaining > 1800
        ? 'from-yellow-500 to-yellow-600'
        : 'from-red-500 to-red-600';

  /* ================= CAMERA ================= */
  const handleCapturePhoto = () => {
    fileInputRef.current?.click(); // 🔥 opens real camera
  };

  /* ================= CHAT ================= */
  type Participant = { id: string; name: string; role: string };

  const engineerId = `engineer-${mobile}`;
  const builder: Participant = { id: 'builder-1', name: 'Builder', role: 'builder' };
  const homeowner: Participant = { id: 'owner-1', name: 'Homeowner', role: 'homeowner' };

  const [showChatMenu, setShowChatMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatConfig, setChatConfig] = useState<{
    chatType: 'group' | 'private';
    chatName: string;
    participants: Participant[];
  } | null>(null);

  const openPrivateChat = (target: 'builder' | 'owner') => {
    const targetParticipant = target === 'builder' ? builder : homeowner;
    setChatConfig({
      chatType: 'private',
      chatName: `Chat with ${targetParticipant.name}`,
      participants: [
        { id: engineerId, name: 'Engineer', role: 'engineer' },
        targetParticipant,
      ],
    });
    setShowChatMenu(false);
    setChatOpen(true);
  };

  const openGroupChat = () => {
    setChatConfig({
      chatType: 'group',
      chatName: 'Builder & Homeowner',
      participants: [
        { id: engineerId, name: 'Engineer', role: 'engineer' },
        builder,
        homeowner,
      ],
    });
    setShowChatMenu(false);
    setChatOpen(true);
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const now = new Date();

    const newPhoto = {
      id: photos.length + 1,
      timestamp: now,
      location: 'Plot 123, Whitefield, Bangalore',
      status: 'success' as const,
      uploader: 'engineer' as const,
      projectId: selectedProject ?? projects[0]?.id,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setTimeRemaining(TOTAL_TIME);

    toast.success('Photo uploaded successfully!', {
      description: 'GPS & timestamp recorded automatically',
    });

    e.target.value = ''; // reset input
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/brigx.png"
            alt="BRIGX Logo"
            className="h-27 w-auto-contain"
          />
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Engineer</p>
            <p className="font-semibold">+91 {mobile}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatMenu((s) => !s)}
            >
              Chat
            </Button>

            {showChatMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-md z-50">
                <div className="flex flex-col p-2">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => openPrivateChat('builder')}
                  >
                    Chat with Builder
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => openPrivateChat('owner')}
                  >
                    Chat with Homeowner
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={openGroupChat}
                  >
                    Chat with Both
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">

        {viewMode === 'list' ? (
          <div className="grid gap-4">
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedProject(p.id); setViewMode('project'); }}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{p.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">Chennai</span>
                        </div>
                      </div>
                      <Badge className="bg-orange-600 text-white">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                      <Clock className="w-3 h-3" />
                      <span>Project ID: {p.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mb-4">
            <Button variant="ghost" onClick={() => setViewMode('list')}>
              ← Back to projects
            </Button>
          </div>
        )}

        {viewMode === 'project' && (
          <Card
            className={`border-2 ${timeRemaining <= 1800 ? 'border-red-500' : 'border-orange-200'
              }`}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Next Photo Upload
                </CardTitle>
                {timeRemaining <= 1800 && (
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Urgent
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Project</p>
                  <h3 className="text-lg font-semibold">{projects.find((x) => x.id === selectedProject)?.name ?? 'All Projects'}</h3>
                </div>
                <div className={`text-6xl font-bold ${timerColor}`}>
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-gray-500">Time remaining</p>
              </div>

              <Progress value={progressPercentage} className="h-3" />

              {/* CAMERA BUTTON */}
              <Button
                onClick={handleCapturePhoto}
                className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${timerBg}`}
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture & Upload Photo
              </Button>

              {/* 🔥 HIDDEN CAMERA INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoSelected}
              />
            </CardContent>
          </Card>
        )}

        {/* PHOTO TIMELINE */}
        {viewMode === 'project' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Photo Timeline
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSatelliteView((s) => !s)}>
                    {satelliteView ? 'Hide Satellite' : 'Satellite View'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setOnlyEngineerPhotos((s) => !s)}>
                    {onlyEngineerPhotos ? 'Show All Photos' : 'Engineer Photos'}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {satelliteView ? (
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <Badge className="absolute top-3 right-3 z-10 bg-orange-600 text-white">
                      Live Satellite View
                    </Badge>
                    <GoogleSatelliteMap
                      lat={12.9716}
                      lng={77.5946}
                      height="300px"
                      siteName={projects.find(x => x.id === selectedProject)?.name || 'Construction Site'}
                      zoom={18}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { label: '1 week ago', date: new Date(Date.now() - 7 * 24 * 3600000) },
                      { label: 'Current', date: new Date() },
                    ].map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
                          <div className="relative">
                            <Badge className="absolute top-3 right-3 z-10 bg-white text-gray-900">
                              {image.label}
                            </Badge>
                            <GoogleSatelliteMap
                              lat={12.9716}
                              lng={77.5946}
                              height="160px"
                              siteName={projects.find(x => x.id === selectedProject)?.name || 'Site'}
                              zoom={18}
                              className="rounded-t-lg rounded-b-none"
                            />
                          </div>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>
                                <Calendar className="w-4 h-4 inline mr-1" />
                                {image.date.toLocaleDateString()}
                              </span>
                              <Badge variant="secondary" className="text-xs">{image.label}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              <AnimatePresence>
                {photos
                  .filter((p) => (selectedProject ? p.projectId === selectedProject : true))
                  .filter((p) => (onlyEngineerPhotos ? p.uploader === 'engineer' : true))
                  .map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 p-4 border rounded-lg mb-3"
                    >
                      <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Camera className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Site Photo #{photo.id}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {photo.timestamp.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {photo.location}
                        </p>
                        <p className="text-xs text-gray-400">Uploaded by: {photo.uploader || 'unknown'}</p>
                        <p className="text-xs text-gray-400">Project: {photo.projectId ?? 'N/A'}</p>
                      </div>
                      <CheckCircle className="text-green-600" />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}

      </main>
      {chatOpen && chatConfig && (
        <ChatSystem
          chatType={chatConfig.chatType}
          chatName={chatConfig.chatName}
          participants={chatConfig.participants}
          currentUserId={engineerId}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
