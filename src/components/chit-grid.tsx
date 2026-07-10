"use client";

import type { Database } from "@/types/database";
import { ChitCard } from "@/components/chit-card";
import { RedeemDialog } from "@/components/redeem-dialog";
import { SuccessAnimation } from "@/components/success-animation";
import { Confetti } from "@/components/confetti";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useCallback } from "react";

type LoveChit = Database["public"]["Tables"]["love_chits"]["Row"];

type CardSize = "regular" | "wide" | "tall";

interface ChitGridProps {
  chits: LoveChit[];
}

const WIDE_INDICES = new Set([1, 8, 12]);
const TALL_INDICES = new Set([3, 10]);

function getCardSize(index: number): CardSize {
  if (WIDE_INDICES.has(index)) return "wide";
  if (TALL_INDICES.has(index)) return "tall";
  return "regular";
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export function ChitGrid({ chits }: ChitGridProps) {
  const [selectedChit, setSelectedChit] = useState<LoveChit | null>(null);
  const [localChits, setLocalChits] = useState(chits);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleRedeem = useCallback((chit: LoveChit) => {
    setSelectedChit(chit);
    setDialogOpen(true);
  }, []);

  const handleConfirmRedeem = useCallback(async () => {
    if (!selectedChit) return;

    const { redeemChit } = await import("@/actions/chits");
    const result = await redeemChit(selectedChit.id);

    if (result.success) {
      setLocalChits((prev) =>
        prev.map((c) =>
          c.id === selectedChit.id
            ? { ...c, redeemed: true, redeemed_at: new Date().toISOString() }
            : c,
        ),
      );
      setDialogOpen(false);
      setShowConfetti(true);
      setShowSuccess(true);
    } else {
      setDialogOpen(false);
    }

    setSelectedChit(null);
  }, [selectedChit]);

  const handleSuccessComplete = useCallback(() => {
    setShowSuccess(false);
    setShowConfetti(false);
  }, []);

  return (
    <>
      <motion.div
        variants={shouldReduceMotion ? undefined : container}
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        className="grid grid-cols-1 gap-4 [grid-auto-flow:dense] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {localChits.map((chit, index) => (
          <ChitCard
            key={chit.id}
            chit={chit}
            size={getCardSize(index)}
            onRedeem={handleRedeem}
          />
        ))}
      </motion.div>

      <RedeemDialog
        chit={selectedChit}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmRedeem}
      />

      <SuccessAnimation show={showSuccess} onComplete={handleSuccessComplete} />
      <Confetti show={showConfetti} />
    </>
  );
}
