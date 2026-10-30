"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export function RatingStars({ rating, size = "md", className, showValue = false }: RatingStarsProps) {
  const sizeClasses = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < Math.floor(rating) ? "text-gold fill-gold" : "text-champagne"
          )}
        />
      ))}
      {showValue && (
        <span className="font-body text-sm text-warm-gray ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
