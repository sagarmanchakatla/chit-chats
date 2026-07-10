"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        className={cn("glass-card rounded-2xl transition-colors duration-300", className)}
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                y: -4,
                boxShadow: "0 8px 40px rgba(244, 114, 182, 0.12)",
              }
        }
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </motion.div>
    );
  },
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
