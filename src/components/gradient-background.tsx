"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GradientBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Pure black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Bright yellow core */}
      <motion.div
        className="absolute bottom-[-250px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,0,0.45) 0%, rgba(255,180,0,0.25) 35%, transparent 70%)",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                scale: [1, 1.08, 1],
                opacity: [0.8, 1, 0.8],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orange glow spread */}
      <motion.div
        className="absolute bottom-[-350px] left-1/2 h-[1000px] w-[1400px] -translate-x-1/2 rounded-full blur-[180px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,120,0,0.30) 0%, rgba(255,90,0,0.18) 40%, transparent 75%)",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary warm glow */}
      <motion.div
        className="absolute bottom-[-150px] left-[20%] h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(255,150,0,0.15), transparent 70%)",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                x: [-20, 20, -20],
                y: [0, -20, 0],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
