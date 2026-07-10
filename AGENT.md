Create a comprehensive AGENT.md file for the following project.

The AGENT.md should act as the single source of truth for building the project. It should explain the architecture, coding standards, implementation details, folder structure, development workflow, UI philosophy, security rules, database schema, animations, and deployment strategy.

The AGENT.md should be detailed enough that another AI agent can build the complete application without additional guidance.

---

# Project Name

Love Chits ❤️

---

# Project Goal

This is a personal gift project for my girlfriend.

The application should feel magical, elegant, minimal, emotional, and premium.

The main focus is NOT functionality.

The biggest priority is creating a beautiful user experience with cute animations and delightful interactions.

Every screen should feel handcrafted.

Think Apple + Notion + Pinterest + Studio Ghibli aesthetic.

The project should have soft colors, rounded corners, floating cards, smooth transitions, glassmorphism, subtle gradients, and tasteful micro animations.

The UI should make someone smile.

---

# Tech Stack

Use:

- Next.js (latest App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Supabase
- React Hook Form
- Zod
- Lucide Icons
- Resend (for emails)
- Vercel deployment

---

# Authentication

There should only ever be ONE user.

My girlfriend.

No signup page.

No registration.

No multiple users.

Authentication should use Supabase Auth.

The email should be hardcoded inside environment variables.

Only that email can log in.

If another email tries to authenticate:

- reject login
- show friendly message

The application should not support user creation.

---

# Core Concept

The application consists of "Love Chits".

A chit is basically a beautiful coupon.

Examples:

Breakfast Date

Movie Night

Unlimited Hugs

Massage

One Surprise

Ice Cream Date

Shopping Together

Drive Anywhere

Cook Together

One Free Kiss

Coffee Date

Game Night

Sleep Call

Custom Surprise

Each chit contains:

id

title

description

emoji

theme color

illustration

status

created_at

redeemed_at

animation

Redeeming a chit should feel satisfying.

Think:

card expands

confetti

heart animation

soft vibration (mobile)

fade transition

success message

---

# Redemption Flow

When girlfriend presses Redeem:

Ask confirmation.

Animate card.

Mark chit redeemed.

Store redeemed_at.

Disable future redemption.

Immediately send email notification.

---

# Email Notifications

Whenever ANY chit is redeemed:

Send email to

sagarmanchakatla02@gmail.com

Email should include:

Chit title

Time

Description

Cute message

Example:

"❤️ Your girlfriend redeemed the 'Movie Night' chit."

Use Resend.

Never expose email keys to frontend.

Emails should only be triggered from secure server actions or API routes.

---

# Database

Use Supabase.

Tables:

profiles

id

email

created_at

love_chits

id

title

description

emoji

theme

illustration

redeemed

redeemed_at

created_at

order_index

Only one profile exists.

Enable Row Level Security.

Only authenticated user can read/update.

---

# UI Design

The UI is the most important part.

Design principles:

Minimal

Cute

Elegant

Romantic

Premium

No clutter.

Use lots of whitespace.

Rounded cards.

Soft shadows.

Glassmorphism.

Pastel gradients.

Animated blobs.

Floating hearts.

Tiny sparkles.

Beautiful typography.

Every interaction should feel alive.

---

# Color Palette

Background

#FFF8F8

Primary Pink

#F472B6

Lavender

#C4B5FD

Sky

#BFDBFE

Peach

#FED7AA

Cream

#FFF7ED

Success

#34D399

Text

Slate-800

---

# Animations

Use Framer Motion.

Animations should include:

page transitions

staggered card loading

hover lift

button bounce

heart pop

confetti

card flip

fade

blur

scale

floating background decorations

Use spring animations.

Nothing should feel abrupt.

---

# Home Page

Large greeting.

Example:

Hello Love ❤️

Subheading.

Animated background.

Grid of beautiful chits.

Redeemed cards become grayscale with ribbon saying:

Redeemed ❤️

Unused cards glow slightly.

---

# Chit Card

Beautiful coupon style.

Rounded edges.

Cute icon.

Large emoji.

Decorative border.

Hover animation.

Click expands.

Inside:

Description

Redeem button

Cute illustration

---

# Empty State

If all chits redeemed:

Show celebration page.

Confetti.

Cute message.

Floating hearts.

Maybe:

"You've redeemed every little promise ❤️"

---

# Components

Create reusable components.

Examples:

AnimatedButton

FloatingHearts

Confetti

GlassCard

CouponCard

CuteHeader

GradientBackground

RedeemDialog

SuccessAnimation

Navbar

Footer

LoadingScreen

Sparkles

---

# Accessibility

Keyboard accessible.

Screen reader friendly.

High contrast text.

Large touch targets.

Respect reduced motion.

---

# Folder Structure

Use scalable architecture.

Example:

app/

components/

features/

lib/

hooks/

types/

styles/

utils/

actions/

emails/

supabase/

public/

---

# Server Actions

Use Server Actions whenever possible.

Database writes happen server side.

Email sending happens server side.

Never expose secrets.

---

# Environment Variables

SUPABASE_URL

SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

RESEND_API_KEY

ALLOWED_EMAIL

OWNER_NOTIFICATION_EMAIL

---

# Security

Never trust frontend.

Validate every request.

Check authenticated user.

Verify email equals allowed email.

Protect all writes.

Use RLS.

Never expose service role key.

---

# Nice Extras

Daily quote

Love countdown

Relationship duration

Random compliments

Floating music toggle

Cute loading screen

Heart cursor effects

Dark mode

Polaroid memories section (future)

---

# Code Quality

Strict TypeScript.

Reusable components.

No duplicated code.

Server Components by default.

Client Components only when needed.

Use Zod validation.

Clean architecture.

Well documented code.

Meaningful file names.

ESLint clean.

No console logs in production.

---

# Performance

Optimize images.

Lazy load animations.

Avoid unnecessary client rendering.

Use Suspense.

Use dynamic imports where appropriate.

Fast initial load.

---

# Deployment

Deploy on Vercel.

Supabase backend.

Resend emails.

Environment variables documented.

Include setup instructions.

---

# AI Coding Rules

When implementing features:

- Prefer reusable components.
- Keep code modular.
- Avoid large files.
- Prefer composition over duplication.
- Use Server Components first.
- Use server actions instead of client fetches where possible.
- Keep animations tasteful and smooth.
- Prioritize user experience over flashy effects.
- Every commit should leave the app in a working state.
- Build incrementally:
  1. Project setup
  2. Authentication
  3. Database
  4. Chit UI
  5. Redemption flow
  6. Email notifications
  7. Animations
  8. Polish
  9. Testing
  10. Deployment

The AGENT.md should be comprehensive, opinionated, and written as if it will guide an autonomous AI software engineer from project initialization through deployment.
