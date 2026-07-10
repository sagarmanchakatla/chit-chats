"use client";

import { Heart, Lock } from "lucide-react";
import { useActionState } from "react";
import { signIn } from "@/actions/auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="grid md:grid-cols-2">
            {/* Left */}
            <div className="flex flex-col justify-center p-8 md:p-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                }}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15">
                  <Heart className="h-8 w-8 text-orange-400" fill="currentColor" />
                </div>
              </motion.div>

              <h1 className="text-center text-3xl font-bold text-white">Love Chits ❤️</h1>

              <p className="mt-2 mb-8 text-center text-sm text-gray-400">
                Enter the secret password to continue
              </p>

              <form action={formAction} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pr-4 pl-11 text-white placeholder:text-gray-400 focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 py-3 font-semibold text-white shadow-lg"
                >
                  {isPending ? "Signing in..." : "Enter 💕"}
                </motion.button>
              </form>

              {state && "error" in state && (
                <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
                  {state.error}
                </div>
              )}
            </div>

            {/* Right */}
            <div className="relative hidden md:block">
              <img src="/login.gif" alt="Love" className="h-full w-full object-cover" />

              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/10" />
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
