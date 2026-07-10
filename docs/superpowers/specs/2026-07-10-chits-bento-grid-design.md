# Chits Page Bento Grid Redesign

## Overview

Visual-only update to the chits page (protected route). Replace the uniform card grid with a Pinterest-style bento layout where cards vary in size, images/gifs are the dominant visual element, and the whole card is clickable to trigger redemption.

**Scope:** Layout and card component redesign only. All data-fetching, server actions, redemption logic, and the RedeemDialog remain untouched.

## Grid Layout

**Approach:** CSS Grid with explicit span assignments and `grid-auto-flow: dense`.

### Card Size Variants

| Variant | Grid span | CSS classes | Aspect ratio | Count |
|---------|-----------|-------------|-------------|-------|
| Regular (1x1) | default | (none) | 4:3 | 9 |
| Wide (2x1) | col-span-2 | `col-span-2` | 16:9 | 3 |
| Tall (1x2) | row-span-2 | `row-span-2` | 3:4 | 2 |

### Size Assignment Pattern

By card index (cycling every 7):
- `index % 7 === 1` → **wide**
- `index % 7 === 3` → **tall**
- Everything else → **regular**

Result for 14 cards: indices 1, 8, 12 are wide; 3, 10 are tall; rest are regular.

### Responsive Breakpoints

| Breakpoint | Columns | Wide cards | Tall cards |
|------------|---------|------------|------------|
| `xl` (1280px+) | 4 | col-span-2 | row-span-2 |
| `lg` (1024px+) | 3 | col-span-2 | row-span-2 |
| `sm` (640px+) | 2 | col-span-2 (full width) | row-span-2 |
| `< sm` | 1 | no span | no span |

### Grid CSS

```css
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  grid-auto-flow: dense;
}
@media (min-width: 640px)  { grid-template-columns: repeat(2, 1fr); }
@media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
@media (min-width: 1280px) { grid-template-columns: repeat(4, 1fr); }
```

## Card Component

### Layout Structure

```
┌─────────────────────────┐
│                         │
│    [gif or emoji bg]    │  ← media area (aspect-ratio per variant)
│                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← gradient scrim overlay
│  ▓ Title                │
│  ▓ Description          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
└─────────────────────────┘
```

### Media Area

- Renders `gif_url` as an `<img>` tag (native gif looping, no Framer Motion animation)
- `object-fit: cover` inside a container with `aspect-ratio` matching the card variant
- While loading: shimmer skeleton overlay
- On error or missing URL: emoji centered on a soft radial gradient using the chit's `theme` color
- `prefers-reduced-motion`: gif still renders and loops (native browser behavior), but card animations are disabled

### Text Overlay

- Absolutely positioned at the bottom of the card
- Gradient scrim: `bg-gradient-to-t from-black/60 via-black/20 to-transparent`
- Title: `text-white font-semibold`, left-aligned, 1 line with ellipsis overflow
- Description: `text-white/80 text-sm`, left-aligned, 2 lines max with ellipsis
- Padding: `p-4` at bottom, ensuring text is readable over any image

### Card States

| State | Visual treatment |
|-------|-----------------|
| Default | Full color, shadow, hover lift |
| Loading (gif) | Shimmer skeleton on media area |
| Gif error | Emoji on theme gradient background |
| Redeemed | `saturate-0 opacity-60`, "Redeemed" badge top-right, no click action |
| Hover | Lift -4px, shadow-card-hover, scale 1.01 |
| Reduced motion | No lift/shadow animation, hover effects disabled |

### Rounded corners

`rounded-2xl` (tighter than current `rounded-3xl` to suit image-heavy cards).

### Shadow

- Rest: `0 1px 3px rgba(0,0,0,0.04), 0 8px 32px ${theme}12`
- Hover: `0 8px 40px ${theme}20`

## Interactions

### Card Click

1. Card raises on press (Framer Motion `whileTap: { scale: 0.98 }`)
2. `RedeemDialog` opens (existing component, reused as-is)
3. User confirms → `redeemChit()` server action runs
4. Card updates to redeemed state in local state
5. Confetti + success animation fires (existing, unchanged)

### Hover Animation

- Framer Motion `whileHover`: `{ y: -4, boxShadow: ... }`
- Spring transition: `{ type: "spring", stiffness: 300, damping: 24 }`
- Disabled for redeemed cards and `prefers-reduced-motion`

### Stagger Animation

- Container: `staggerChildren: 0.06`, `delayChildren: 0.1`
- Each card: `initial: { opacity: 0, y: 24 }`, `animate: { opacity: 1, y: 0 }`
- Disabled when `prefers-reduced-motion` is set

## Error Handling

### gif_url Issues

The current seed data has `gif_url` values that are Tenor share-page links (`tenor.com/view/...`), not direct media URLs. These will fail to load as `<img>` sources. The emoji fallback will display in this case until the user replaces them with direct media URLs.

### Loading State

- `<img>` has `onLoad` / `onError` handlers
- Loading: shimmer animation on the media area
- Error: smooth transition to emoji fallback
- No broken image icons visible to the user

## Files to Modify

| File | Change |
|------|--------|
| `src/components/chit-grid.tsx` | Replace uniform grid with bento grid CSS, update size assignment logic |
| `src/components/chit-card.tsx` | Complete redesign: image-dominant layout, gradient text overlay, full-card click, gif loading/error handling |
| `src/app/globals.css` | Add bento grid utility classes if needed |
| `src/types/database.ts` | Add `gif_url: string | null` to the `love_chits` Row/Insert types |
| `src/actions/chits.ts` | Add `gif_url` to the Zod chit schema (the seed data already includes it) |

## Files Unchanged

- `src/app/(protected)/page.tsx` — no changes
- `src/components/redeem-dialog.tsx` — reused as-is
- `src/components/success-animation.tsx` — unchanged
- `src/components/confetti.tsx` — unchanged
- `src/components/gradient-background.tsx` — unchanged
- `src/components/glass-card.tsx` — unchanged
- `src/actions/chits.ts` — no changes to server actions or seed data
- `src/components/ui/*` — shadcn primitives unchanged

## Assumptions

1. **gif_url as media source:** The card uses `gif_url` from the chit data as the primary visual. The current seed data has Tenor share-page links (not direct media URLs), so the emoji fallback will display until the user replaces them with direct URLs like `https://media.tenor.com/.../filename.gif`.
2. **gif_url field addition:** The `gif_url` field exists in the seed data object but is missing from the DB schema, Zod types, and TypeScript types. We add it as `gif_url: string | null` to `database.ts` types and the Zod schema in `chits.ts`. The seed data already inserts it, so this aligns the types with reality.
3. **Reduced motion:** Both CSS (`prefers-reduced-motion: reduce` in globals.css) and Framer Motion (`useReducedMotion()`) are respected. Gif playback is native browser behavior and unaffected by reduced motion settings.
4. **No /public images needed yet:** Cards use `gif_url` directly. The user will drop real images/URLs later. No local image path convention is needed at this stage.
