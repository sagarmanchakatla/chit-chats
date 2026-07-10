"use client";

import { Heart, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessAnimationProps {
  show: boolean;
  onComplete: () => void;
}

function FloatingHeart({ delay, offset }: { delay: number; offset: number }) {
  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-20, -60, -120],
        x: [0, offset, offset * 0.5],
        scale: [0, 1, 0.8, 0],
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: "easeOut",
      }}
    >
      <Heart className="text-love-pink h-6 w-6" fill="currentColor" />
    </motion.div>
  );
}

function FloatingSparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, scale: 0, x, y }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
        y: [y, y - 40],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: "easeOut",
      }}
    >
      <Sparkles className="text-love-warm h-4 w-4" />
    </motion.div>
  );
}

export function SuccessAnimation({ show, onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="relative flex flex-col items-center gap-4"
          >
            {/* Floating hearts */}
            <div className="pointer-events-none absolute -inset-20">
              <FloatingHeart delay={0} offset={-30} />
              <FloatingHeart delay={0.15} offset={25} />
              <FloatingHeart delay={0.3} offset={-15} />
              <FloatingHeart delay={0.45} offset={35} />
              <FloatingHeart delay={0.6} offset={-25} />
              <FloatingSparkle delay={0.2} x={-60} y={-10} />
              <FloatingSparkle delay={0.4} x={60} y={-20} />
              <FloatingSparkle delay={0.6} x={-40} y={20} />
            </div>

            {/* Main heart */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeInOut",
              }}
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <Heart className="text-love-pink h-16 w-16 drop-shadow-lg" fill="currentColor" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-xl font-semibold tracking-tight text-white drop-shadow-md"
            >
              Redeemed with love! ❤️
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
