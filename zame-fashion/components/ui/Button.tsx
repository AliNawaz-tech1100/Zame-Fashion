"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center font-body font-medium transition-all duration-200 rounded-pill disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-gold text-white hover:bg-gold-dark shadow-soft": variant === "primary",
          "bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-white": variant === "secondary",
          "bg-transparent text-charcoal hover:bg-blush": variant === "ghost",
          "bg-white border border-champagne text-charcoal hover:border-gold hover:shadow-soft": variant === "outline",
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },
        className
      )}
    >
      {children}
    </button>
  );
}
