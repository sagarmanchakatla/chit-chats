<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Update the UI of the chits page (protected route) in this project. Use the frontend-design skill for aesthetic direction (typography, spacing, color, avoiding
templated/default-looking layouts).

Reference images are in public/design —
look at them before making changes. I want the chit grid to match a
Pinterest-style bento layout like these: varied card sizes (not a uniform
grid), some cards wider or taller than others, images as the dominant visual
element, tight but breathable spacing.

Requirements for the chit page:

1. Layout
   - Bento grid: mix of card sizes (e.g. some 1x1, some 2x1 or 1x2), not a
     rigid uniform grid. Use CSS grid with grid-row/column spans, responsive
     down to a clean single/double column on mobile.
   - Each chit card shows: image (from /public, matched by chit id or slug),
     title, short description, all overlaid or arranged tastefully on the
     card — follow the reference images for how text sits over/under images.

2. Interaction
   - Cards keep existing hover/lift animation from Framer Motion, refined
     to match the new card style.
   - On clicking the card should raise and flip to opens a confirmation dialog (reuse/adapt the existing
     RedeemDialog if present) asking the user to confirm redemption — do
     not change the redemption logic, only the trigger and visual entry
     point (card click instead of a separate button, if that fits the
     reference layout better).

3. Constraints
   - Keep all existing data-fetching, server actions, and redemption logic
     untouched — this is a visual/layout update only.
   - Keep the styling and color scheme same as the reference image provided in /public/design
   - Respect prefers-reduced-motion.
   - Dont use

Show me the updated grid component and card component when done, and note
any assumptions you made about image filenames/paths since I'll be dropping
real images into /public myself.
