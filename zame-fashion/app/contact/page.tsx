import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Instagram, MapPin, Clock, Package, CreditCard, RotateCcw, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | ZAMÉ Fashion",
  description:
    "Contact ZAMÉ Fashion Pakistan for order help, exchanges, and questions about hair accessories, bows, headbands, and keychains.",
};

// TODO (Ali): Add a business Phone / WhatsApp number here once you want it public.
// No phone number is rendered on this page until a real one is provided.

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="font-body text-white/60 max-w-xl mx-auto">
            We&apos;re here to help — questions about an order, delivery, an exchange, or which
            accessory will suit your outfit? Message us and we will always try to sort your issue fairly.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-8">
        <section className="bg-white rounded-card p-6 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Fastest ways to reach us
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://instagram.com/zame_fashion"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream rounded-input p-4 block hover:bg-blush transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Instagram className="w-4 h-4 text-gold" />
                <p className="font-body text-sm font-semibold text-charcoal">Instagram (fastest for product questions)</p>
              </div>
              <p className="font-body text-sm text-warm-gray">@zame_fashion — DM us anytime</p>
            </a>
            <a
              href="mailto:alinawazahad@gmail.com"
              className="bg-cream rounded-input p-4 block hover:bg-blush transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gold" />
                <p className="font-body text-sm font-semibold text-charcoal">Email</p>
              </div>
              <p className="font-body text-sm text-warm-gray">
                alinawazahad@gmail.com — please include your order number (if you have one) in the subject line.
              </p>
            </a>
            <div className="bg-cream rounded-input p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gold" />
                <p className="font-body text-sm font-semibold text-charcoal">Location</p>
              </div>
              <p className="font-body text-sm text-warm-gray">
                Lahore, Pakistan — we are an online store and deliver nationwide. We do not have a walk-in retail outlet at this time.
              </p>
            </div>
            <div className="bg-cream rounded-input p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gold" />
                <p className="font-body text-sm font-semibold text-charcoal">Replies</p>
              </div>
              <p className="font-body text-sm text-warm-gray">
                We reply as quickly as we can during working hours.
              </p>
            </div>
          </div>
          <p className="font-body text-sm text-warm-gray mt-6">
            To message us, email{" "}
            <a href="mailto:alinawazahad@gmail.com" className="text-gold underline underline-offset-2">
              alinawazahad@gmail.com
            </a>{" "}
            with your name, phone number, order number (if applicable), and your message — or DM us on{" "}
            <a
              href="https://instagram.com/zame_fashion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-2"
            >
              Instagram @zame_fashion
            </a>
            . By contacting us you agree to our{" "}
            <Link href="/privacy-policy/" className="text-gold underline underline-offset-2">
              Privacy Policy
            </Link>
            . We only use your details to reply to your message.
          </p>
        </section>

        <section className="bg-white rounded-card p-6 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Before you message — quick answers
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="font-body text-sm text-warm-gray">
                <span className="font-semibold text-charcoal">Delivery charges?</span> Free delivery across Pakistan on orders over PKR 2,000.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="font-body text-sm text-warm-gray">
                <span className="font-semibold text-charcoal">Payment?</span> Cash on Delivery (COD) nationwide — pay when your parcel arrives.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="font-body text-sm text-warm-gray">
                <span className="font-semibold text-charcoal">Exchange?</span> 7-day exchange on unused items in original packaging. See our{" "}
                <Link href="/terms/" className="text-gold underline underline-offset-2">Terms &amp; Conditions</Link>{" "}
                and{" "}
                <Link href="/shipping-returns/" className="text-gold underline underline-offset-2">Shipping &amp; Returns</Link>{" "}
                pages.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="font-body text-sm text-warm-gray">
                <span className="font-semibold text-charcoal">Bulk / gift orders?</span> Yes — message us on Instagram or email for bulk orders of keychains, bows, and kids&apos; clips for events, schools, and gifting.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-card p-6 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-4">
            Wholesale &amp; collaborations
          </h2>
          <p className="font-body text-sm leading-relaxed text-warm-gray">
            For bulk orders, salon / boutique stocking, or creator collaborations, email{" "}
            <a href="mailto:alinawazahad@gmail.com" className="text-gold underline underline-offset-2">
              alinawazahad@gmail.com
            </a>{" "}
            with the subject &quot;Wholesale&quot; or &quot;Collaboration&quot; and tell us quantities and timelines.
          </p>
        </section>
      </div>
    </div>
  );
}
