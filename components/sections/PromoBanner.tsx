"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { promoBanners } from "@/data/products";
import { cn } from "@/lib/utils";

export function PromoBanners() {
  return (
    <section className="py-8 lg:py-12 bg-cream space-y-6">
      {promoBanners.map((banner, index) => (
        <div key={banner.id} className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className={cn(
              "relative rounded-card overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-[450px] flex items-center",
              banner.align === "center" ? "justify-center text-center" :
              banner.align === "right" ? "justify-end text-right" : "justify-start text-left"
            )}
          >
            {/* Background Image */}
            <img
              src={banner.desktopImage}
              alt={banner.heading}
              className="absolute inset-0 w-full h-full object-cover hidden sm:block"
            />
            <img
              src={banner.mobileImage}
              alt={banner.heading}
              className="absolute inset-0 w-full h-full object-cover sm:hidden"
            />
            {/* Overlay */}
            <div className={cn(
              "absolute inset-0",
              banner.overlay === "dark" ? "bg-charcoal/50" :
              banner.overlay === "light" ? "bg-white/40" : ""
            )} />
            {/* Content */}
            <div className={cn(
              "relative z-10 p-8 sm:p-12 lg:p-16 max-w-xl",
              banner.align === "center" ? "mx-auto" : ""
            )}>
              {banner.badge && (
                <span className="inline-block bg-gold text-white font-body text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-pill mb-4">
                  {banner.badge}
                </span>
              )}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {banner.heading}
              </h2>
              <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-md">
                {banner.description}
              </p>
              <Link href={banner.ctaLink}>
                <Button size="lg" className="bg-white text-charcoal hover:bg-cream">
                  {banner.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
