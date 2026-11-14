"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "sale" | "new" | "bestseller" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-body font-semibold tracking-wider uppercase rounded-pill",
        {
          "bg-soft-pink text-charcoal": variant === "sale",
          "bg-soft-mint text-charcoal": variant === "new",
          "bg-gold text-white": variant === "bestseller",
          "bg-light-gray text-warm-gray": variant === "default",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
