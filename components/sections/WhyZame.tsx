"use client";

import { brandValues } from "@/data/products";
import { Gem, Palette, Truck, RefreshCw, ShieldCheck, Heart } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  gem: <Gem className="w-6 h-6" />,
  palette: <Palette className="w-6 h-6" />,
  truck: <Truck className="w-6 h-6" />,
  "refresh-cw": <RefreshCw className="w-6 h-6" />,
  "shield-check": <ShieldCheck className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
};

export function WhyZame() {
  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal">
            Why Zame Fashion
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {brandValues.map((value) => (
            <div
              key={value.id}
              className="bg-white rounded-card p-6 shadow-card hover:shadow-hover transition-shadow duration-300 text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                {iconMap[value.icon]}
              </div>
              <h3 className="font-display text-base font-semibold text-charcoal mb-2">
                {value.title}
              </h3>
              <p className="font-body text-xs text-warm-gray leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
