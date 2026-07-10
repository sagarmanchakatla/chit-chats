"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Database } from "@/types/database";
import { useState } from "react";
import { motion } from "framer-motion";

type LoveChit = Database["public"]["Tables"]["love_chits"]["Row"];

interface RedeemDialogProps {
  chit: LoveChit | null;
  gifPath?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function RedeemDialog({ chit, gifPath, open, onOpenChange, onConfirm }: RedeemDialogProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleConfirm = async () => {
    setIsRedeeming(true);
    await onConfirm();
    setIsRedeeming(false);
  };

  if (!chit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[32px] border border-white/10 bg-neutral-950 p-0 shadow-[0_30px_80px_rgba(0,0,0,.65)] backdrop-blur-2xl sm:max-w-lg">
        {/* Hero */}
        <div className="relative h-72 overflow-hidden">
          {gifPath ? (
            <motion.img
              src={gifPath}
              alt={chit.title}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${chit.theme}40, #111827)`,
              }}
            >
              <span className="text-8xl">{chit.emoji}</span>
            </div>
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/20 to-transparent" />

          {/* Floating Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className="absolute top-6 left-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl backdrop-blur-xl"
          >
            {chit.emoji}
          </motion.div>

          {/* Title */}
          <div className="absolute right-6 bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white">{chit.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-8 p-6">
          <p className="leading-7 text-neutral-400">{chit.description}</p>

          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              disabled={isRedeeming}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 font-medium text-neutral-300 transition hover:bg-white/10"
            >
              Maybe Later
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 18,
              }}
              onClick={handleConfirm}
              disabled={isRedeeming}
              className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-3 font-semibold text-white shadow-[0_0_35px_rgba(249,115,22,.45)]"
            >
              {isRedeeming ? "Redeeming..." : "Redeem ❤️"}
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
