"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Check, Gift } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(""); }
  };

  return (
    <section className="py-16 lg:py-24 bg-blush/40 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-gold" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">
            Stay in the Loop
          </h2>
          <p className="font-body text-warm-gray mb-8">
            Be the first to discover new collections, exclusive offers and Zame Fashion updates.
            Subscribers get 10% off their first order.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 bg-soft-mint/30 text-charcoal py-4 px-6 rounded-card">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-body text-sm font-medium">You&apos;re in! Check your inbox for a welcome gift 🎀</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 bg-white border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <Button type="submit" className="w-full sm:w-auto">
                <Gift className="w-4 h-4 mr-2" /> Subscribe
              </Button>
            </form>
          )}

          <p className="font-body text-xs text-warm-gray mt-4">
            No spam, ever. Unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
