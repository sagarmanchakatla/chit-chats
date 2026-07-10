"use client";

import { GradientBackground } from "@/components/gradient-background";
import { motion, useReducedMotion } from "framer-motion";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-1 flex-col">
      <GradientBackground />
      <motion.main
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.main>
    </div>
  );
}
