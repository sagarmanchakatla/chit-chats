import { Heart } from "lucide-react";
import { getChits } from "@/actions/chits";
import { signOut } from "@/actions/auth";
import { ChitGrid } from "@/components/chit-grid";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: chits, error } = await getChits();

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Heart className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </main>
    );
  }

  if (!chits || chits.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="space-y-6 text-center">
          <div className="text-6xl">💝</div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Your love chits are waiting
          </h2>
          <p className="text-sm text-slate-500">
            This collection of promises is being prepared with love...
          </p>
        </div>
      </main>
    );
  }

  const allRedeemed = chits.every((chit) => chit.redeemed);
  const redeemedCount = chits.filter((chit) => chit.redeemed).length;

  return (
    <main className="flex flex-1 flex-col px-4 py-8 md:px-8 lg:px-12">
      {/* Header */}
      <header className="mx-auto mb-10 w-full max-w-7xl">
        <div className="overflow-hidden rounded-3xl">
          <video className="h-64 w-full rounded-2xl object-cover" autoPlay muted loop playsInline>
            <source src="/herorooror.mp4" type="video/mp4" />
          </video>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500 md:text-base">
          {allRedeemed
            ? "You've redeemed every little promise 💕"
            : `${redeemedCount} of ${chits.length} promises redeemed`}
        </p>
      </header>

      {/* Celebration state */}
      {allRedeemed && (
        <div className="border-love-pink/20 shadow-card mx-auto mb-10 w-full max-w-5xl rounded-3xl border bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-sky-50/80 p-10 text-center backdrop-blur-sm">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-800">
            You&apos;ve redeemed every little promise ❤️
          </h2>
          <p className="text-sm text-slate-500">Thank you for making every moment special.</p>
        </div>
      )}

      {/* Chit grid */}
      <div className="mx-auto w-full max-w-5xl">
        <ChitGrid chits={chits} />
      </div>

      {/* Sign out */}
      <footer className="mt-12 text-center">
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xs text-slate-400 transition-colors hover:text-slate-500"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </form>
      </footer>
    </main>
  );
}
