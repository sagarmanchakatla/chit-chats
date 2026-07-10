"use client";

import type { Database } from "@/types/database";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useCallback } from "react";

type LoveChit = Database["public"]["Tables"]["love_chits"]["Row"];

type CardSize = "regular" | "wide" | "tall";

interface ChitCardProps {
  chit: LoveChit;
  size: CardSize;
  onRedeem?: (chit: LoveChit) => void;
}

const sizeStyles: Record<CardSize, { aspect: string; colSpan: string; rowSpan: string }> = {
  regular: { aspect: "aspect-[4/3]", colSpan: "", rowSpan: "" },
  wide: { aspect: "aspect-[16/9]", colSpan: "col-span-2", rowSpan: "" },
  tall: { aspect: "aspect-[3/4]", colSpan: "", rowSpan: "row-span-2" },
};

export function ChitCard({ chit, size, onRedeem }: ChitCardProps) {
  const isRedeemed = chit.redeemed;
  const shouldReduceMotion = useReducedMotion();
  const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "error">(
    chit.gif_url ? "loading" : "error",
  );

  const hasMedia = Boolean(chit.gif_url) && imgStatus !== "error";

  const handleImgLoad = useCallback(() => setImgStatus("loaded"), []);
  const handleImgError = useCallback(() => setImgStatus("error"), []);

  const handleClick = useCallback(() => {
    if (!isRedeemed && onRedeem) {
      onRedeem(chit);
    }
  }, [chit, isRedeemed, onRedeem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !isRedeemed && onRedeem) {
        e.preventDefault();
        onRedeem(chit);
      }
    },
    [chit, isRedeemed, onRedeem],
  );

  const { aspect, colSpan, rowSpan } = sizeStyles[size];

  const cardTransition = shouldReduceMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 300, damping: 24 };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      role={isRedeemed ? undefined : "button"}
      tabIndex={isRedeemed ? undefined : 0}
      aria-label={`${chit.title} - ${isRedeemed ? "Redeemed" : "Tap to redeem"}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-white/50 transition-colors duration-300",
        aspect,
        colSpan,
        rowSpan,
        isRedeemed
          ? "cursor-default opacity-60 saturate-0"
          : "cursor-pointer glass-card",
      )}
      style={{
        boxShadow: isRedeemed ? "none" : `0 1px 3px rgba(0,0,0,0.04), 0 8px 32px ${chit.theme}12`,
      }}
      whileHover={
        isRedeemed || shouldReduceMotion
          ? {}
          : {
              y: -4,
              boxShadow: `0 8px 40px ${chit.theme}20`,
            }
      }
      whileTap={isRedeemed || shouldReduceMotion ? {} : { scale: 0.98 }}
      transition={cardTransition}
    >
      {/* Media area — gif or emoji fallback */}
      {hasMedia ? (
        <>
          {/* Shimmer loading skeleton */}
          {imgStatus === "loading" && (
            <div className="absolute inset-0 z-10 animate-shimmer bg-gradient-to-r from-slate-200/60 via-white/40 to-slate-200/60 bg-[length:200%_100%]" />
          )}
          <img
            src={chit.gif_url!}
            alt={chit.title}
            loading="lazy"
            onLoad={handleImgLoad}
            onError={handleImgError}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
              imgStatus === "loaded" ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      ) : (
        /* Emoji fallback on gradient background */
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${chit.theme}30 0%, ${chit.theme}08 70%, transparent 100%)`,
          }}
        >
          <span className="text-6xl leading-none opacity-80 sm:text-5xl" role="img" aria-label={chit.title}>
            {chit.emoji}
          </span>
        </div>
      )}

      {/* Gradient scrim + text overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-4 pb-4 pt-12">
        <h3 className="truncate text-base font-semibold leading-tight text-white">
          {chit.title}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/80">
          {chit.description}
        </p>
      </div>

      {/* Redeemed badge */}
      {isRedeemed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-3 right-3 z-30"
        >
          <div className="rounded-full bg-love-pink/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-white shadow-sm">
            Redeemed ❤️
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
