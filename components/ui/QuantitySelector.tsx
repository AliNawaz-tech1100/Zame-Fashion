"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, className }: QuantitySelectorProps) {
  return (
    <div className={cn("inline-flex items-center border border-champagne rounded-input bg-cream", className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="p-2 hover:bg-blush transition-colors rounded-l-input"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 text-charcoal" />
      </button>
      <span className="w-10 text-center font-body text-sm text-charcoal">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="p-2 hover:bg-blush transition-colors rounded-r-input"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4 text-charcoal" />
      </button>
    </div>
  );
}
