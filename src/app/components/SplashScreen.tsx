import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="size-full bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 flex items-center justify-center overflow-hidden relative">

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-20 left-20 w-40 h-40 border-2 border-white rounded-lg"
          animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-32 h-32 border-2 border-white rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white"
          animate={{ rotate: [0, -90, -180, -270, -360], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center gap-10 z-10">

        {/* LOGO + BIG BRIGHT GLOW */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* 🔥 EXTRA LARGE BRIGHT WHITE GLOW */}
          <motion.div
            className="absolute w-[420px] h-[420px] bg-white rounded-full blur-[120px]"
            animate={{
              scale: [0.7, 1.35, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* LOGO IMAGE */}
          <motion.img
            src="/src/assets/brigx.png"
            alt="BRIGX Logo"
            className="w-60 h-auto relative z-10"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0, y: [0, -10, 0] }}
            transition={{
              rotateY: { duration: 1, delay: 0.6, ease: 'easeOut' },
              y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          {['Build', 'Track', 'Verify'].map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.8 + index * 0.2 }}
              className="text-white text-xl font-medium"
            >
              {word}
              {index < 2 && <span className="mx-2 text-white/60">•</span>}
            </motion.span>
          ))}
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.7 }}
          className="mt-6"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
