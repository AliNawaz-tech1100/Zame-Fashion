"use client";

import Link from "next/link";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { ProductCard } from "@/components/sections/ProductCard";
import { Clock } from "lucide-react";

export function RecentlyViewed() {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-charcoal">Recently Viewed</h2>
            <p className="font-body text-sm text-warm-gray">Pick up where you left off</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
