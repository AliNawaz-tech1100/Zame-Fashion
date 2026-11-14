import { Truck, RotateCcw, Clock, MapPin, Package, AlertCircle, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns | ZAMÉ Fashion",
  description: "Learn about ZAMÉ Fashion's shipping, delivery, and returns policy. Free shipping on orders over PKR 2,000. 7-day hassle-free returns.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Shipping & Returns
          </h1>
          <p className="font-body text-white/60 max-w-xl mx-auto">
            Everything you need to know about delivery, shipping charges, and our hassle-free return policy.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Shipping */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-gold" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-charcoal">Shipping & Delivery</h2>
          </div>
          <div className="bg-white rounded-card p-6 shadow-card space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-cream rounded-input p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <p className="font-body text-sm font-semibold text-charcoal">Processing Time</p>
                </div>
                <p className="font-body text-sm text-warm-gray">1–2 business days</p>
              </div>
              <div className="bg-cream rounded-input p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <p className="font-body text-sm font-semibold text-charcoal">Delivery Time</p>
                </div>
                <p className="font-body text-sm text-warm-gray">3–5 business days nationwide</p>
              </div>
              <div className="bg-cream rounded-input p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gold" />
                  <p className="font-body text-sm font-semibold text-charcoal">Free Shipping</p>
                </div>
                <p className="font-body text-sm text-warm-gray">On all orders over PKR 2,000</p>
              </div>
              <div className="bg-cream rounded-input p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-gold" />
                  <p className="font-body text-sm font-semibold text-charcoal">COD Available</p>
                </div>
                <p className="font-body text-sm text-warm-gray">Cash on Delivery nationwide</p>
              </div>
            </div>
            <div className="border-t border-champagne pt-4">
              <h3 className="font-body text-sm font-semibold text-charcoal mb-2">Shipping Charges</h3>
              <ul className="space-y-1 font-body text-sm text-warm-gray">
                <li>• Standard Delivery: PKR 250 (free over PKR 2,000)</li>
                <li>• Express Delivery (Lahore & Karachi): PKR 400</li>
                <li>• Remote Areas: PKR 350</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Returns */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-gold" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-charcoal">Returns & Exchanges</h2>
          </div>
          <div className="bg-white rounded-card p-6 shadow-card space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-cream rounded-input p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <p className="font-body text-sm font-semibold text-charcoal">Return Window</p>
                </div>
                <p className="font-body text-sm text-warm-gray">7 days from delivery date</p>
              </div>
              <div className="bg-cream rounded-input p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-gold" />
                  <p className="font-body text-sm font-semibold text-charcoal">Condition</p>
                </div>
                <p className="font-body text-sm text-warm-gray">Unused, original packaging intact</p>
              </div>
            </div>
            <div className="border-t border-champagne pt-4 space-y-3">
              <h3 className="font-body text-sm font-semibold text-charcoal">How to Return</h3>
              <ol className="space-y-2 font-body text-sm text-warm-gray list-decimal list-inside">
                <li>Contact us within 7 days of receiving your order</li>
                <li>Pack the item(s) in original packaging with tags attached</li>
                <li>Include your order number and reason for return</li>
                <li>Ship to our Lahore warehouse (return shipping is customer-paid unless defective)</li>
                <li>Refunds are processed within 5–7 business days of receiving the return</li>
              </ol>
            </div>
            <div className="bg-soft-pink/10 rounded-input p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm font-semibold text-charcoal mb-1">Important Notes</p>
                <p className="font-body text-xs text-warm-gray">Sale items are final sale and cannot be returned unless defective. Personalized or custom orders are non-returnable. Please inspect your order upon delivery and report any defects within 48 hours.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
