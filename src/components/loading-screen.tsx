"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40">
      <div className="h-1.5 w-full bg-slate-200/60" />
      <div className="flex flex-col items-center gap-3 p-5">
        <div className="h-16 w-16 rounded-2xl bg-slate-200/60" />
        <div className="h-4 w-28 rounded-full bg-slate-200/60" />
        <div className="h-3 w-44 rounded-full bg-slate-200/60" />
        <div className="h-3 w-36 rounded-full bg-slate-200/60" />
        <div className="mt-2 h-12 w-full rounded-xl bg-slate-200/60" />
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12"
      role="status"
      aria-label="Loading"
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="text-love-pink h-10 w-10" fill="currentColor" />
        </motion.div>
        <p className="text-sm text-slate-400">Loading your love chits...</p>
        <span className="sr-only">Loading...</span>
      </motion.div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <SkeletonCard />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
