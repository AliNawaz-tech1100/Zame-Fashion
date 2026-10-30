"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blush/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-soft-lavender/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px] py-12 lg:py-0">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-blush/60 px-4 py-2 rounded-pill mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-body text-sm text-charcoal font-medium">Launch Sale — 50% Off</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-6">
              Cute Accessories{" "}
              <span className="text-gold">For Every</span>{" "}
              Mood
            </h1>
            <p className="font-body text-base sm:text-lg text-warm-gray leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Discover our curated collection of imported hair clips, bows, keychains & more.
              Soft pastels, dreamy designs, and that extra touch of cute.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/shop/">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/shop/?new=true">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-4 bg-blush/30 rounded-card rotate-3" />
              <div className="absolute inset-4 bg-soft-lavender/20 rounded-card -rotate-2" />
              <div className="relative rounded-card overflow-hidden shadow-hover bg-white">
                <img
                  src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80"
                  alt="ZAMÉ Fashion Accessories Collection"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-card shadow-hover px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-soft-pink/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-body text-xs text-warm-gray">100% Imported</p>
                  <p className="font-display text-sm font-semibold text-charcoal">Premium Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
