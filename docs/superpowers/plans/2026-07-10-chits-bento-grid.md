# Chits Bento Grid Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the uniform chit card grid with a Pinterest-style bento layout featuring image-dominant cards with gif support, gradient text overlays, and full-card click-to-redeem.

**Architecture:** CSS Grid with explicit column/row spans and `grid-auto-flow: dense` for the bento layout. Each card renders `gif_url` as a full-bleed `<img>` with emoji+gradient fallback on error. Text overlays the bottom of the card via absolute positioning and gradient scrim. The existing `RedeemDialog` is reused — the trigger changes from a button to a whole-card click.

**Tech Stack:** React, Tailwind CSS v4 (CSS-only config), Framer Motion, `@base-ui/react` Dialog

## Global Constraints

- All existing server actions (`getChits`, `redeemChit`), `RedeemDialog`, `SuccessAnimation`, `Confetti`, and auth flow are **untouched**
- Respect `prefers-reduced-motion` (CSS + Framer Motion `useReducedMotion()`)
- Keep existing color theme: `love-pink`, `love-lavender`, `love-sky`, `love-peach`, `love-cream`
- Inter font, `rounded-2xl` card corners, glass-card utility where appropriate
- No new dependencies

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/types/chit.ts` | Modify | Add `gif_url` to Zod schema |
| `src/types/database.ts` | Modify | Add `gif_url` to love_chits Row/Insert/Update types |
| `src/components/chit-card.tsx` | Rewrite | Image-dominant card with gif support, gradient overlay, full-card click |
| `src/components/chit-grid.tsx` | Rewrite | Bento grid CSS, size assignment by index |

---

### Task 1: Add `gif_url` to Zod Schema and Database Types

**Files:**
- Modify: `src/types/chit.ts`
- Modify: `src/types/database.ts`

**Interfaces:**
- Produces: `gif_url: string | null` available on `LoveChit` type (used by Task 2 and Task 3)

- [ ] **Step 1: Add gif_url to Zod chit schema**

Open `src/types/chit.ts` and add `gif_url` field to `chitSchema`:

```typescript
import { z } from "zod/v4";

export const chitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  emoji: z.string().min(1, "Emoji is required").max(10),
  theme: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Theme must be a valid hex color"),
  illustration: z.string().max(500).nullable(),
  order_index: z.number().int().min(0),
  gif_url: z.string().max(500).nullable(),
});

export const chitIdSchema = z.object({
  id: z.string().uuid("Invalid chit ID"),
});

export type ChitInput = z.infer<typeof chitSchema>;
```

- [ ] **Step 2: Add gif_url to database types**

Open `src/types/database.ts` and add `gif_url: string | null` to each of the `love_chits` type variants (Row, Insert, Update). The Row type gets it as required nullable, Insert as optional nullable, Update as optional nullable:

```typescript
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      love_chits: {
        Row: {
          id: string;
          title: string;
          description: string;
          emoji: string;
          theme: string;
          illustration: string | null;
          redeemed: boolean;
          redeemed_at: string | null;
          created_at: string;
          order_index: number;
          gif_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          emoji: string;
          theme: string;
          illustration?: string | null;
          redeemed?: boolean;
          redeemed_at?: string | null;
          created_at?: string;
          order_index: number;
          gif_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          emoji?: string;
          theme?: string;
          illustration?: string | null;
          redeemed?: boolean;
          redeemed_at?: string | null;
          created_at?: string;
          order_index?: number;
          gif_url?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to this change)

- [ ] **Step 4: Commit**

```bash
git add src/types/chit.ts src/types/database.ts
git commit -m "feat: add gif_url field to chit types and zod schema"
```

---

### Task 2: Redesign the ChitCard Component

**Files:**
- Rewrite: `src/components/chit-card.tsx`

**Interfaces:**
- Consumes: `LoveChit` type (from `@/types/database`, now includes `gif_url`)
- Consumes: `onRedeem: (chit: LoveChit) => void` callback (from Task 3's ChitGrid)
- Produces: Renders a clickable card with image media, gradient text overlay, and hover animation

- [ ] **Step 1: Rewrite chit-card.tsx with image-dominant layout**

Replace the entire contents of `src/components/chit-card.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit`
Expected: No new errors. The `size` prop is now required — Task 3 will pass it from ChitGrid.

- [ ] **Step 3: Commit**

```bash
git add src/components/chit-card.tsx
git commit -m "feat: redesign chit-card with image-dominant layout and gif support"
```

---

### Task 3: Redesign the ChitGrid Component with Bento Layout

**Files:**
- Modify: `src/components/chit-grid.tsx`

**Interfaces:**
- Consumes: `chits: LoveChit[]` prop (unchanged)
- Consumes: `ChitCard` with new `size` prop (from Task 2)
- Produces: Bento grid layout with size assignment, passes `size` to each card

- [ ] **Step 1: Rewrite chit-grid.tsx with bento layout**

Replace the entire contents of `src/components/chit-grid.tsx` with:

```tsx
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
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/chit-grid.tsx
git commit -m "feat: replace uniform grid with bento layout and size assignment"
```

---

### Task 4: Verify Build and Visual Check

**Files:**
- None (verification only)

- [ ] **Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors. Warnings about missing gif_url images in /public are expected (the emoji fallback handles this).

- [ ] **Step 2: Start dev server and visual check**

Run: `npm run dev`
Then open the app in a browser and verify:
1. The grid displays as a bento layout with varied card sizes (some wider, some taller)
2. Cards show the emoji on a gradient background (since gif_url values are Tenor share links, not direct media)
3. Text (title + description) overlays the bottom of each card with a gradient scrim
4. Hovering a card lifts it with shadow enhancement
5. Clicking a non-redeemed card opens the RedeemDialog
6. Redeeming a card shows the "Redeemed" badge and desaturates the card
7. The layout is responsive: 4 cols on desktop, 2 on tablet, 1 on mobile
8. The "Hello Love" header and sign-out footer are unchanged

- [ ] **Step 3: Commit (if any visual fixes needed)**

```bash
git add -A
git commit -m "fix: visual polish for bento grid layout"
```

---

## Assumptions

1. **gif_url Tenor links:** All current `gif_url` values are Tenor share-page links that will fail to render as `<img>` sources. The emoji+gradient fallback will display. The user will replace these with direct media URLs later.
2. **No test framework:** This project has no test setup. Verification is visual (dev server check) and type-checking (`tsc --noEmit`).
3. **DB column:** The `gif_url` column must exist in the Supabase `love_chits` table for seed data to insert successfully. If it doesn't exist yet, the seed will fail — this is outside the scope of this visual update.
