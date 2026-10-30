"use client";

import { useState } from "react";
import { Product } from "@/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";
import { Star, Check, ThumbsUp } from "lucide-react";

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reviews = product.reviews || [];
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews : product.rating;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating > 0 && reviewText.trim() && reviewerName.trim()) {
      setSubmitted(true);
      setNewRating(0);
      setReviewText("");
      setReviewerName("");
    }
  };

  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-semibold text-charcoal mb-8">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="bg-cream rounded-card p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Overall */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="font-display text-5xl font-bold text-charcoal">{avgRating.toFixed(1)}</span>
              <div className="mt-1"><RatingStars rating={avgRating} size="sm" /></div>
              <p className="font-body text-xs text-warm-gray mt-1">Based on {totalReviews} reviews</p>
            </div>
          </div>
          {/* Breakdown */}
          <div className="space-y-2">
            {ratingBreakdown.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="font-body text-xs text-warm-gray w-8">{stars}★</span>
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
                <span className="font-body text-xs text-warm-gray w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-4 mb-10">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-card p-5 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center">
                    <span className="font-body text-sm font-bold text-gold">{review.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-charcoal">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="font-body text-xs text-warm-gray">{review.date}</span>
                    </div>
                  </div>
                </div>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 bg-soft-mint/20 text-green-700 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-pill">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-warm-gray leading-relaxed mb-2">“{review.comment}”</p>
              {review.productName && (
                <p className="font-body text-xs text-warm-gray/70">Purchased: {review.productName}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-cream rounded-card p-8 text-center mb-10">
          <p className="font-body text-sm text-warm-gray">No reviews yet. Be the first to share your experience!</p>
        </div>
      )}

      {/* Write a Review */}
      <div className="bg-white rounded-card p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Write a Review</h3>
        {submitted ? (
          <div className="flex items-center gap-2 bg-soft-mint/20 text-green-700 py-3 px-4 rounded-input">
            <ThumbsUp className="w-5 h-5" />
            <span className="font-body text-sm font-medium">Thank you! Your review has been submitted for moderation.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium text-charcoal mb-2">Your Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "w-6 h-6 transition-colors",
                        (hoverRating ? i < hoverRating : i < newRating) ? "text-gold fill-gold" : "text-champagne"
                      )}
                    />
                  </button>
                ))}
                <span className="font-body text-sm text-warm-gray ml-2">
                  {newRating > 0 ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][newRating - 1] : "Select a rating"}
                </span>
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Your Name</label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Your Review</label>
              <textarea
                required
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold resize-none"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            <button
              type="submit"
              disabled={newRating === 0}
              className="px-6 py-2.5 bg-gold text-white rounded-pill font-body text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
