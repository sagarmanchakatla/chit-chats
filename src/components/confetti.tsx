"use client";

import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface ConfettiProps {
  show: boolean;
}

const COLORS = ["#F472B6", "#C4B5FD", "#BFDBFE", "#FED7AA", "#34D399", "#FB7185", "#FBBF24"];

// Deterministic pseudo-random based on seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  shape: "circle" | "square";
  delay: number;
  duration: number;
  drift: number;
}

function makePiece(index: number): ConfettiPiece {
  const seed = index * 2654435761;
  return {
    id: index,
    x: seededRandom(seed) * 100,
    color: COLORS[index % COLORS.length],
    size: 4 + (index % 4) * 2,
    rotation: seededRandom(seed + 1) * 360,
    shape: (index % 2 === 0 ? "circle" : "square") as "circle" | "square",
    delay: seededRandom(seed + 2) * 0.2,
    duration: 1.5 + seededRandom(seed + 3) * 0.8,
    drift: (seededRandom(seed + 4) - 0.5) * 80,
  };
}

export function Confetti({ show }: ConfettiProps) {
  const shouldReduceMotion = useReducedMotion();

  const pieces: ConfettiPiece[] = useMemo(
    () => Array.from({ length: shouldReduceMotion ? 12 : 40 }).map((_, i) => makePiece(i)),
    [shouldReduceMotion],
  );

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                top: "-10px",
                width: piece.size,
                height: piece.size,
                borderRadius: piece.shape === "circle" ? "50%" : "2px",
                backgroundColor: piece.color,
              }}
              initial={{ y: -20, x: 0, rotate: 0, opacity: 0 }}
              animate={{
                y: [0, "100vh"],
                x: [0, piece.drift],
                rotate: [0, piece.rotation * 3],
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
