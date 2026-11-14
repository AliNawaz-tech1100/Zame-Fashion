"use client";

import Link from "next/link";
import { collections } from "@/data/products";
import { ArrowUpRight } from "lucide-react";

export function CollectionsGrid() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">
            Curated For You
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">
            Shop by Collection
          </h2>
          <p className="font-body text-warm-gray max-w-md mx-auto">
            Discover our carefully curated collections, each designed to bring out your unique style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/shop/?collection=${col.slug}`}
              className="group relative aspect-[3/4] rounded-card overflow-hidden bg-cream"
            >
              <img
                src={col.image}
                alt={col.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white mb-1">
                      {col.name}
                    </h3>
                    <p className="font-body text-xs text-white/70 line-clamp-1 mb-1">{col.description}</p>
                    <p className="font-body text-xs text-white/50">{col.productCount} products</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
