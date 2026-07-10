# Love Chits ❤️

A personal gift web app — a collection of love promises, beautifully presented as redeemable coupons.

Built with Next.js, Supabase, and Framer Motion. Designed to make someone smile.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Magic Link)
- **Email:** Resend
- **Deployment:** Vercel

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd love-chits
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE` | Supabase service role key | Supabase Dashboard → Settings → API |
| `ALLOWED_EMAIL` | Email that can log in | Your girlfriend's email address |
| `RESEND_API_KEY` | Resend API key | [Resend](https://resend.com) → API Keys |
| `OWNER_NOTIFICATION_EMAIL` | Where redemption emails are sent | Your email address |

### 3. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and API keys
3. Go to the SQL Editor in the Supabase dashboard

#### Run the Schema

Copy and paste the contents of `src/supabase/schema.sql` into the SQL Editor and run it.

This will create:
- `profiles` table (auto-populated on first login)
- `love_chits` table (stores all the coupons)
- Row Level Security policies
- Auto-profile trigger

#### Configure Authentication

1. Go to Authentication → Providers
2. Enable Email provider (should be enabled by default)
3. Optionally disable email confirmations for testing

### 4. Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. For production: verify your domain and update the `from` address in `src/emails/redemption.ts`

### 5. Seed the Chits

After first login, you'll need to seed the chits. You can:

Option A: Use the Supabase dashboard to manually insert chits

Option B: Add a temporary seed button to the home page that calls the `seedChits` server action

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### 3. Add Environment Variables

In the Vercel dashboard, go to Settings → Environment Variables and add all the variables from `.env.local`.

### 4. Deploy

Click "Deploy" — Vercel will build and deploy your app.

### 5. Update Supabase Auth Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:
- Add your Vercel domain to "Site URL"
- Add `https://your-app.vercel.app/auth/callback` to "Redirect URLs"

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (protected)/        # Auth-protected routes
│   ├── auth/callback/      # OAuth callback handler
│   └── login/              # Login page
├── actions/                # Server Actions
├── components/             # Reusable UI components
├── emails/                 # Email templates
├── lib/                    # Utility functions & Supabase clients
├── supabase/               # Database schema
└── types/                  # TypeScript types
```

## Features

- **Magic Link Auth** — Passwordless login with email verification
- **Single User** — Only one allowed email can access the app
- **14 Love Chits** — Beautiful coupon cards with unique themes
- **Redemption Flow** — Confirmation dialog + success animation + confetti
- **Email Notifications** — Instant email when a chit is redeemed
- **Responsive Design** — Works beautifully on all devices
- **Accessibility** — Keyboard navigation, screen reader support, reduced motion

## License

Made with love 💕
