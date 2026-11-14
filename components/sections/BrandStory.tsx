"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homepageContent } from "@/data/products";

export function BrandStory() {
  const { brandStory } = homepageContent;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-card overflow-hidden shadow-card">
              <img
                src={brandStory.image}
                alt="About Zame Fashion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-gold text-white rounded-card p-6 shadow-hover max-w-[200px]">
              <p className="font-display text-3xl font-bold">100%</p>
              <p className="font-body text-sm">Imported Accessories</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">
              Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-4">
              {brandStory.headline}
            </h2>
            <p className="font-display text-xl text-gold italic mb-6">
              “{brandStory.quote}”
            </p>
            <div className="space-y-4 mb-8">
              {brandStory.paragraphs.map((para, i) => (
                <p key={i} className="font-body text-sm text-warm-gray leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
            <Link
              href={brandStory.ctaLink}
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-gold hover:text-gold-dark transition-colors group"
            >
              {brandStory.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
