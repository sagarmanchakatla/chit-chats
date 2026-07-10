# Task 2 Report: Redesign ChitCard Component

## What I Implemented

Rewrote `src/components/chit-card.tsx` from a centered-emoji + text + button layout to an image-dominant card:

- **Full-bleed gif**: `gif_url` renders as `<img>` with `object-cover` filling the card
- **Shimmer skeleton**: `animate-shimmer` overlay while gif loads
- **Emoji fallback**: Radial gradient background with large emoji when `gif_url` is missing or fails to load
- **Gradient scrim overlay**: Text (title + description) overlays the bottom with `from-black/60 via-black/20 to-transparent`
- **Full-card click**: Whole card is clickable (`role="button"`, `tabIndex`, `onClick`, `onKeyDown` for Enter/Space) — no separate redeem button
- **Size prop**: New required `size: "regular" | "wide" | "tall"` prop with CSS aspect-ratio (`4/3`, `16/9`, `3/4`) and grid spans (`col-span-2` for wide, `row-span-2` for tall)
- **Preserved behavior**: Hover lift (-4px), spring transition, redeemed state (saturate-0, opacity-60, badge), `useReducedMotion()` support

Also updated `src/components/chit-grid.tsx` to pass the `size` prop via index-based assignment (wide at indices 1, 8, 12; tall at 3, 10) and added `[grid-auto-flow:dense]` to the grid container.

## Files Changed

| File                           | Change                                                         |
| ------------------------------ | -------------------------------------------------------------- |
| `src/components/chit-card.tsx` | Full rewrite — image-dominant layout                           |
| `src/components/chit-grid.tsx` | Added size assignment, dense grid flow, reduced gap to `gap-4` |

## Testing

- `npx tsc --noEmit` — **passed**, zero errors
- No test framework exists in this project; verification is type-checking only

## Self-Review Findings

1. **Minor: `rounded-2xl` vs `rounded-3xl`** — Plan specified `rounded-2xl` (vs old `rounded-3xl`). This is intentional per plan spec for tighter bento feel.
2. **Grid gap changed from `gap-5` to `gap-4`** — Matches plan spec for "tight but breathable spacing".
3. **Card height removed from old design** — Old card used flex layout with spacer; new card uses aspect-ratio, which is the correct approach for a bento grid.
4. **`imgStatus` initial state** — If `gif_url` is present but empty string, `Boolean("")` is `false`, so it correctly falls back to emoji. Good edge case handling.

## Assumptions

1. **gif_url content**: Current `gif_url` values are Tenor share-page links, not direct media URLs. They will fail to render as `<img>` and trigger the emoji fallback. The user will replace them with direct media URLs.
2. **chit-grid update scope**: Updated chit-grid.tsx to pass the new required `size` prop so types compile. Task 3 will do the full bento grid rewrite — this is a minimal compatibility update.
3. **No existing tests**: Project has no test framework; verified via `tsc --noEmit` only.

Writing the chit-card component...

Write updated chit-card.tsx with retry logic, lazy loading, and flip animation
bash

cat > /home/claude/fix/chit-card.tsx << 'EOF'
"use client";

import type { Database } from "@/types/database";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useCallback, useRef } from "react";

type LoveChit = Database["public"]["Tables"]["love_chits"]["Row"];

type CardSize = "regular" | "wide" | "tall" | "large";

interface ChitCardProps {
chit: LoveChit;
size: CardSize;
gifPath?: string;
onRedeem?: (chit: LoveChit, resolvedGif?: string | null) => void;
}

const sizeStyles: Record<CardSize, { aspect: string; colSpan: string; rowSpan: string }> = {
regular: { aspect: "aspect-square", colSpan: "", rowSpan: "" },
wide: { aspect: "aspect-[16/9]", colSpan: "col-span-2", rowSpan: "" },
tall: { aspect: "aspect-[3/4]", colSpan: "", rowSpan: "row-span-2" },
large: { aspect: "aspect-square", colSpan: "col-span-2", rowSpan: "row-span-2" },
};

// Large gifs loaded 20+ at a time can hit the browser's per-host connection
// limit and stall/error out even though the file exists. Retry a couple of
// times with a cache-busting query param before giving up on a card.
const MAX_RETRIES = 2;

export function ChitCard({ chit, size, gifPath, onRedeem }: ChitCardProps) {
const isRedeemed = chit.redeemed;
const shouldReduceMotion = useReducedMotion();
const baseMediaSrc = gifPath || chit.gif_url || null;

const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "error">(
baseMediaSrc ? "loading" : "error",
);
const [cacheBust, setCacheBust] = useState(0);
const retriesRef = useRef(0);
const [isFlipping, setIsFlipping] = useState(false);

const mediaSrc =
baseMediaSrc && cacheBust > 0 ? `${baseMediaSrc}?r=${cacheBust}` : baseMediaSrc;
const hasMedia = Boolean(baseMediaSrc) && imgStatus !== "error";

const handleImgLoad = useCallback(() => {
retriesRef.current = 0;
setImgStatus("loaded");
}, []);

const handleImgError = useCallback(() => {
if (retriesRef.current < MAX_RETRIES) {
retriesRef.current += 1;
const delay = 400 * retriesRef.current;
window.setTimeout(() => {
setCacheBust((n) => n + 1);
setImgStatus("loading");
}, delay);
} else {
setImgStatus("error");
}
}, []);

const handleClick = useCallback(() => {
if (!isRedeemed && onRedeem && !isFlipping) {
setIsFlipping(true);
}
}, [isRedeemed, onRedeem, isFlipping]);

const handleKeyDown = useCallback(
(e: React.KeyboardEvent) => {
if ((e.key === "Enter" || e.key === " ") && !isRedeemed && onRedeem && !isFlipping) {
e.preventDefault();
setIsFlipping(true);
}
},
[isRedeemed, onRedeem, isFlipping],
);

// Fires when the flip animation settles (both the 0→90 flip-out and the
// 90→0 flip-back). Only act on the flip-out leg.
const handleAnimationComplete = useCallback(() => {
if (isFlipping) {
onRedeem?.(chit, hasMedia ? baseMediaSrc : null);
setIsFlipping(false);
}
}, [isFlipping, onRedeem, chit, hasMedia, baseMediaSrc]);

const { aspect, colSpan, rowSpan } = sizeStyles[size];

const cardTransition = shouldReduceMotion
? { duration: 0.2 }
: { type: "spring" as const, stiffness: 300, damping: 24 };

const flipTransition = shouldReduceMotion
? { duration: 0.15 }
: { duration: 0.32, ease: "easeIn" as const };

return (
<div className={cn(aspect, colSpan, rowSpan)} style={{ perspective: 1200 }}>
<motion.article
layout
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0, rotateY: isFlipping ? 90 : 0 }}
onAnimationComplete={handleAnimationComplete}
role={isRedeemed ? undefined : "button"}
tabIndex={isRedeemed ? undefined : 0}
aria-label={`${chit.title} - ${isRedeemed ? "Redeemed" : "Tap to redeem"}`}
onClick={handleClick}
onKeyDown={handleKeyDown}
className={cn(
"group relative flex h-full w-full overflow-hidden rounded-2xl border border-white/50 transition-colors duration-300",
isRedeemed ? "cursor-default opacity-60 saturate-0" : "cursor-pointer glass-card",
)}
style={{
          boxShadow: isRedeemed ? "none" : `0 1px 3px rgba(0,0,0,0.04), 0 8px 32px ${chit.theme}12`,
          transformStyle: "preserve-3d",
        }}
whileHover={
isRedeemed || shouldReduceMotion || isFlipping
? {}
: {
y: -4,
boxShadow: `0 8px 40px ${chit.theme}20`,
}
}
whileTap={isRedeemed || shouldReduceMotion || isFlipping ? {} : { scale: 0.98 }}
transition={isFlipping ? flipTransition : cardTransition} >
{/* Media area — gif or emoji fallback _/}
{hasMedia ? (
<>
{imgStatus === "loading" && (
<div className="absolute inset-0 z-10 animate-shimmer bg-gradient-to-r from-slate-200/60 via-white/40 to-slate-200/60 bg-[length:200%_100%]" />
)}
<img
key={mediaSrc}
src={mediaSrc!}
alt={chit.title}
loading="lazy"
decoding="async"
onLoad={handleImgLoad}
onError={handleImgError}
className={cn(
"absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
imgStatus === "loaded" ? "opacity-100" : "opacity-0",
)}
/>
</>
) : (
/_ Emoji fallback on gradient background */
<div
className="absolute inset-0 flex items-center justify-center"
style={{
              background: `radial-gradient(circle at 50% 40%, ${chit.theme}30 0%, ${chit.theme}08 70%, transparent 100%)`,
            }} >
<span
              className="text-6xl leading-none opacity-80 sm:text-5xl"
              role="img"
              aria-label={chit.title}
            >
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
    </div>

);
}
EOF
