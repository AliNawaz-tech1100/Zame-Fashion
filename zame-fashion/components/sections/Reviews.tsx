"use client";

import { testimonials } from "@/data/products";
import { RatingStars } from "@/components/ui/RatingStars";
import { Quote, MapPin } from "lucide-react";

export function Reviews() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">
            What Our Customers Say
          </h2>
          <p className="font-body text-warm-gray max-w-md mx-auto">
            Real reviews from real customers who love their ZAMÉ accessories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((review) => (
            <div key={review.id} className="bg-cream rounded-card p-6 relative group hover:shadow-hover transition-shadow duration-300">
              <Quote className="w-8 h-8 text-gold/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-3">
                <RatingStars rating={review.rating} size="sm" />
              </div>
              <p className="font-body text-sm text-charcoal leading-relaxed mb-4">
                “{review.comment}”
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center">
                      <span className="font-body text-sm font-bold text-gold">{review.author.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-body text-sm font-semibold text-charcoal">{review.author}</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-warm-gray" />
                      <p className="font-body text-xs text-warm-gray">{review.location}</p>
                    </div>
                  </div>
                </div>
                {review.verified && (
                  <span className="font-body text-[10px] font-semibold tracking-wider uppercase text-soft-mint bg-soft-mint/20 px-2 py-1 rounded-pill">
                    Verified
                  </span>
                )}
              </div>
              {review.productName && (
                <p className="font-body text-xs text-warm-gray/70 mt-3 pt-3 border-t border-champagne/30">
                  Purchased: {review.productName}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
