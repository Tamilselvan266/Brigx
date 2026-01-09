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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface DashboardProps {
  mobile: string;
  onLogout: () => void;
}

interface PhotoEntry {
  id: number;
  timestamp: Date;
  location: string;
  status: 'success';
}

export function BuilderDashboard({ mobile, onLogout }: DashboardProps) {
  const TOTAL_TIME = 10800; // 3 hours

  const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME);
  const [photos, setPhotos] = useState<PhotoEntry[]>([
    {
      id: 1,
      timestamp: new Date(Date.now() - 6 * 3600000),
      location: 'Plot 123, Whitefield',
      status: 'success',
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3 * 3600000),
      location: 'Plot 123, Whitefield',
      status: 'success',
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= TIMER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          toast.error('Photo upload deadline missed!', {
            description: 'Alert sent to homeowner and officials',
          });
          return TOTAL_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
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
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent =
    ((TOTAL_TIME - timeRemaining) / TOTAL_TIME) * 100;

  const timerTextColor =
    timeRemaining > 3600
      ? 'text-green-600'
      : timeRemaining > 1800
      ? 'text-yellow-600'
      : 'text-red-600';

  const timerGradient =
    timeRemaining > 3600
      ? 'from-green-500 to-green-600'
      : timeRemaining > 1800
      ? 'from-yellow-500 to-yellow-600'
      : 'from-red-500 to-red-600';

  /* ================= CAMERA ================= */
  const openCamera = () => {
    fileInputRef.current?.click();
  };

  const onPhotoSelected = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const now = new Date();

    const newPhoto: PhotoEntry = {
      id: photos.length + 1,
      timestamp: now,
      location: 'Plot 123, Whitefield, Bangalore',
      status: 'success',
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setTimeRemaining(TOTAL_TIME);

    toast.success('Photo uploaded successfully!', {
      description: 'GPS & timestamp recorded automatically',
    });

    e.target.value = '';
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
              <img
                src="/src/assets/brigx.png"
                alt="BRIGX Logo"
                className="h-27 w-auto-contain"
              />
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Builder</p>
            <p className="font-semibold">+91 {mobile}</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      {/* MAIN */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* TIMER CARD */}
        <Card
          className={`border-2 ${
            timeRemaining <= 1800
              ? 'border-red-500'
              : 'border-orange-200'
          }`}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Next Photo Upload
              </CardTitle>

              {timeRemaining <= 1800 && (
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-6xl font-bold ${timerTextColor}`}>
                {formatTime(timeRemaining)}
              </div>
              <p className="text-gray-500">Time remaining</p>
            </div>

            <Progress value={progressPercent} className="h-3" />

            <Button
              onClick={openCamera}
              className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${timerGradient}`}
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture & Upload Photo
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPhotoSelected}
            />
          </CardContent>
        </Card>

        {/* PHOTO TIMELINE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Photo Timeline
            </CardTitle>
          </CardHeader>

          <CardContent>
            <AnimatePresence>
              {photos.map((photo) => (
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
                    <h4 className="font-semibold">
                      Site Photo #{photo.id}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {photo.timestamp.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {photo.location}
                    </p>
                  </div>

                  <CheckCircle className="text-green-600" />
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
