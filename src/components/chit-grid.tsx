"use client";

import type { Database } from "@/types/database";
import { ChitCard } from "@/components/chit-card";
import { RedeemDialog } from "@/components/redeem-dialog";
import { SuccessAnimation } from "@/components/success-animation";
import { Confetti } from "@/components/confetti";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useCallback } from "react";

type LoveChit = Database["public"]["Tables"]["love_chits"]["Row"];

type CardSize = "regular" | "wide" | "tall" | "large";

interface ChitGridProps {
  chits: LoveChit[];
}

const GIF_MAP: Record<string, string> = {
  "Breakfast Date": "/breakfast.gif",
  "Movie Night": "/movie-night.gif",
  "Unlimited Hugs": "/hugs.gif",
  Massage: "/massage.gif",
  "One Surprise": "/surprise.gif",
  "Ice Cream Date": "/icecream.gif",
  "Shopping Together": "/shopping.gif",
  "Drive Anywhere": "/driving.gif",
  "Cook Together": "/cooking.gif",
  "One Free Kiss": "/kiss.gif",
  "Coffee Date": "/coffee.gif",
  "Game Night": "/gaming.gif",
  "Sleep Call": "/sleeping.gif",
  "Custom Surprise": "/secret.gif",
  "Video Call Date": "/video-call.gif",
  "Surprise Visit": "/visit.gif",
  "Good Morning Call": "/good-morning-call.gif",
  "Care Package": "/care-package.gif",
  "Virtual Movie Night": "/virtual-movie-night.gif",
  "Countdown to Meeting": "/countdown.gif",
  "Voice Note Marathon": "/voice-note.gif",
  "Plan Our Next Trip": "/trip.gif",
  "Fall Asleep on Call": "/sleep-on-call.gif",
  "Shared Playlist": "/playlist.gif",
};

// Bento layout inspired by Product_Showcase.json
// Grid: 6 columns. Sizes: large=2x2, wide=2x1, tall=1x2, regular=1x1
const BENTO_LAYOUT: Array<{ index: number; size: CardSize }> = [
  { index: 0, size: "large" }, // Breakfast Date — hero card
  { index: 1, size: "wide" }, // Movie Night
  { index: 2, size: "regular" }, // Unlimited Hugs
  { index: 3, size: "regular" }, // Massage
  { index: 4, size: "wide" }, // One Surprise
  { index: 5, size: "large" }, // Ice Cream Date — featured
  { index: 6, size: "regular" }, // Shopping Together
  { index: 7, size: "wide" }, // Drive Anywhere
  { index: 8, size: "regular" }, // Cook Together
  { index: 9, size: "wide" }, // One Free Kiss
  { index: 10, size: "regular" }, // Coffee Date
  { index: 11, size: "wide" }, // Game Night
  { index: 12, size: "regular" }, // Sleep Call
  { index: 13, size: "wide" }, // Custom Surprise
  { index: 14, size: "regular" }, // Video Call Date
  { index: 15, size: "large" }, // Surprise Visit — hero (LDR highlight)
  { index: 16, size: "regular" }, // Good Morning Call
  { index: 17, size: "wide" }, // Care Package
  { index: 18, size: "tall" }, // Virtual Movie Night
  { index: 19, size: "wide" }, // Countdown to Meeting
  { index: 20, size: "regular" }, // Voice Note Marathon
  { index: 21, size: "large" }, // Plan Our Next Trip — featured
  { index: 22, size: "regular" }, // Fall Asleep on Call
  { index: 23, size: "large" }, // Shared Playlist
];

function getCardSize(index: number): CardSize {
  const entry = BENTO_LAYOUT.find((l) => l.index === index);
  return entry?.size || "regular";
}

function getGifPath(chit: LoveChit): string | undefined {
  return GIF_MAP[chit.title];
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
  const [selectedGif, setSelectedGif] = useState<string | undefined>();

  const handleRedeem = useCallback((chit: LoveChit) => {
    setSelectedChit(chit);
    setSelectedGif(getGifPath(chit));
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
        className="grid [grid-auto-flow:dense] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        {localChits.map((chit, index) => (
          <ChitCard
            key={chit.id}
            chit={chit}
            size={getCardSize(index)}
            gifPath={getGifPath(chit)}
            onRedeem={handleRedeem}
          />
        ))}
      </motion.div>

      <RedeemDialog
        chit={selectedChit}
        gifPath={selectedGif}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmRedeem}
      />

      <SuccessAnimation show={showSuccess} onComplete={handleSuccessComplete} />
      <Confetti show={showConfetti} />
    </>
  );
}
