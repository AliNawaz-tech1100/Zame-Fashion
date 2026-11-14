"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";
import { calculateTotals } from "@/lib/pricing";
import { CreateOrderResponse } from "@/types";
import { Banknote, Check, ChevronLeft, Shield, Truck, Loader2, AlertTriangle } from "lucide-react";

function generateIdempotencyKey(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through to the manual fallback below */
  }
  const random = Math.random().toString(36).slice(2, 18).padEnd(16, "0");
  return `${Date.now().toString(36)}-${random}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const [step, setStep] = useState<"shipping" | "review">("shipping");
  const [isPlacing, setIsPlacing] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // One key per checkout session: retried submissions map to the same order
  // instead of creating duplicates (server-side idempotency).
  const idempotencyKey = useRef<string>("");
  if (!idempotencyKey.current) idempotencyKey.current = generateIdempotencyKey();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    instructions: "",
    notes: "",
  });

  const subtotal = getSubtotal();
  const totals = calculateTotals(subtotal, 0);

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setStep("review");
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPlacing) return;
    setIsPlacing(true);
    setServerError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey.current,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
          })),
          customer: {
            name: formData.name,
            phone: formData.phone,
            whatsappNumber: formData.whatsappNumber || undefined,
            email: formData.email || undefined,
            address: formData.address,
            city: formData.city,
            province: formData.province || undefined,
            postalCode: formData.postalCode || undefined,
            instructions: formData.instructions || undefined,
            notes: formData.notes || undefined,
          },
        }),
      });

      const data = (await response.json().catch(() => ({}))) as CreateOrderResponse;

      if (!response.ok || !data.ok) {
        setServerError(data.error || "We could not place your order. Please try again.");
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
          if (data.fieldErrors.items || data.fieldErrors.idempotencyKey) {
            setStep("shipping");
          }
        }
        return;
      }

      // Order saved — clear the cart and show the confirmation page.
      clearCart();
      router.push(`/order-confirmation/${data.token}/`);
    } catch {
      setServerError("Network error — your order was NOT placed. Please check your connection and try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl font-semibold text-charcoal mb-2">Your Cart is Empty</h1>
          <p className="font-body text-warm-gray mb-6">Add some items before checking out.</p>
          <Link href="/shop/"><Button>Start Shopping</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={cn("flex items-center gap-2", step === "shipping" ? "text-gold" : "text-charcoal")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-medium", step === "shipping" ? "bg-gold text-white" : "bg-gold/10 text-gold")}>1</div>
              <span className="font-body text-sm font-medium hidden sm:inline">Shipping</span>
            </div>
            <div className="w-12 h-px bg-champagne" />
            <div className={cn("flex items-center gap-2", step === "review" ? "text-gold" : "text-warm-gray")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-medium", step === "review" ? "bg-gold text-white" : "bg-light-gray text-warm-gray")}>2</div>
              <span className="font-body text-sm font-medium hidden sm:inline">Review & Pay on Delivery</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-input px-4 py-3 mb-4 flex items-start gap-2 font-body text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {step === "shipping" ? (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-1">Shipping Information</h2>
                <p className="font-body text-xs text-warm-gray mb-6">Delivered across Pakistan. Pay cash when your order arrives.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Full Name *</label>
                    <input required type="text" value={formData.name} onChange={(e) => setField("name", e.target.value)} className={cn("w-full px-4 py-2.5 bg-cream border rounded-input font-body text-sm focus:outline-none focus:border-gold", fieldErrors.name ? "border-red-400" : "border-champagne")} placeholder="Enter your full name" />
                    {fieldErrors.name && <p className="font-body text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Phone *</label>
                    <input required type="tel" value={formData.phone} onChange={(e) => setField("phone", e.target.value)} className={cn("w-full px-4 py-2.5 bg-cream border rounded-input font-body text-sm focus:outline-none focus:border-gold", fieldErrors.phone ? "border-red-400" : "border-champagne")} placeholder="03XX-XXXXXXX" />
                    {fieldErrors.phone && <p className="font-body text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">WhatsApp Number <span className="text-warm-gray font-normal">(if different)</span></label>
                    <input type="tel" value={formData.whatsappNumber} onChange={(e) => setField("whatsappNumber", e.target.value)} className={cn("w-full px-4 py-2.5 bg-cream border rounded-input font-body text-sm focus:outline-none focus:border-gold", fieldErrors.whatsappNumber ? "border-red-400" : "border-champagne")} placeholder="03XX-XXXXXXX" />
                    {fieldErrors.whatsappNumber && <p className="font-body text-xs text-red-600 mt-1">{fieldErrors.whatsappNumber}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Email <span className="text-warm-gray font-normal">(optional)</span></label>
                    <input type="email" value={formData.email} onChange={(e) => setField("email", e.target.value)} className={cn("w-full px-4 py-2.5 bg-cream border rounded-input font-body text-sm focus:outline-none focus:border-gold", fieldErrors.email ? "border-red-400" : "border-champagne")} placeholder="you@example.com" />
                    {fieldErrors.email && <p className="font-body text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Complete Delivery Address *</label>
                    <input required type="text" value={formData.address} onChange={(e) => setField("address", e.target.value)} className={cn("w-full px-4 py-2.5 bg-cream border rounded-input font-body text-sm focus:outline-none focus:border-gold", fieldErrors.address ? "border-red-400" : "border-champagne")} placeholder="House #, Street, Area, Landmark" />
                    {fieldErrors.address && <p className="font-body text-xs text-red-600 mt-1">{fieldErrors.address}</p>}
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">City *</label>
                    <input required type="text" value={formData.city} onChange={(e) => setField("city", e.target.value)} className={cn("w-full px-4 py-2.5 bg-cream border rounded-input font-body text-sm focus:outline-none focus:border-gold", fieldErrors.city ? "border-red-400" : "border-champagne")} placeholder="Lahore" />
                    {fieldErrors.city && <p className="font-body text-xs text-red-600 mt-1">{fieldErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Province *</label>
                    <select required value={formData.province} onChange={(e) => setField("province", e.target.value)} className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold">
                      <option value="">Select Province</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad">Islamabad Capital Territory</option>
                      <option value="GB">Gilgit-Baltistan</option>
                      <option value="AJK">Azad Kashmir</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Postal Code <span className="text-warm-gray font-normal">(optional)</span></label>
                    <input type="text" value={formData.postalCode} onChange={(e) => setField("postalCode", e.target.value)} className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold" placeholder="54000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Delivery Instructions <span className="text-warm-gray font-normal">(optional)</span></label>
                    <textarea rows={2} value={formData.instructions} onChange={(e) => setField("instructions", e.target.value)} className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold resize-none" placeholder="Any special instructions for delivery" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Order Notes <span className="text-warm-gray font-normal">(optional)</span></label>
                    <textarea rows={2} value={formData.notes} onChange={(e) => setField("notes", e.target.value)} className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold resize-none" placeholder="Notes about your order" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Link href="/cart/" className="flex items-center gap-1 font-body text-sm text-warm-gray hover:text-charcoal"><ChevronLeft className="w-4 h-4" /> Back to Cart</Link>
                  <Button type="submit">Review Order</Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-6">Review & Confirm</h2>

                {/* COD — the only payment method */}
                <div className="border-2 border-gold bg-gold/5 rounded-input p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0"><Banknote className="w-5 h-5 text-gold" /></div>
                    <div>
                      <p className="font-body text-sm font-medium text-charcoal">Cash on Delivery</p>
                      <p className="font-body text-xs text-warm-gray">Pay the total amount in cash when your order arrives. No online payment required.</p>
                    </div>
                    <div className="ml-auto w-6 h-6 rounded-full bg-gold flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Shipping recap */}
                <div className="bg-cream rounded-input p-4 mb-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-body text-sm text-charcoal">
                      <p className="font-medium">{formData.name}</p>
                      <p className="text-warm-gray text-xs mt-0.5">{formData.phone}{formData.whatsappNumber ? ` · WhatsApp: ${formData.whatsappNumber}` : ""}</p>
                      <p className="text-warm-gray text-xs mt-0.5">{formData.address}, {formData.city}{formData.province ? `, ${formData.province}` : ""}{formData.postalCode ? ` — ${formData.postalCode}` : ""}</p>
                      {formData.instructions && <p className="text-warm-gray text-xs mt-1">Note: {formData.instructions}</p>}
                    </div>
                    <button type="button" onClick={() => setStep("shipping")} className="font-body text-xs text-gold hover:text-gold-dark underline shrink-0">Edit</button>
                  </div>
                </div>

                {/* Payable amount */}
                <div className="border-t border-champagne pt-4 space-y-2 mb-6">
                  <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Subtotal</span><span className="text-charcoal">{formatPrice(totals.subtotal)}</span></div>
                  <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Discount</span><span className="text-charcoal">{totals.discount > 0 ? `- ${formatPrice(totals.discount)}` : formatPrice(0)}</span></div>
                  <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Delivery Charges</span><span className={cn("text-charcoal", totals.deliveryCharge === 0 && "text-green-600")}>{totals.deliveryCharge === 0 ? "Free" : formatPrice(totals.deliveryCharge)}</span></div>
                  <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-champagne"><span>Payable on Delivery</span><span>{formatPrice(totals.total)}</span></div>
                </div>

                <div className="bg-soft-mint/20 rounded-input px-4 py-3 mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-700 shrink-0" />
                  <p className="font-body text-xs text-green-800">You will pay <strong>{formatPrice(totals.total)}</strong> in cash when your order is delivered. No card or online payment needed.</p>
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => { setStep("shipping"); window.scrollTo(0, 0); }} className="flex items-center gap-1 font-body text-sm text-warm-gray hover:text-charcoal"><ChevronLeft className="w-4 h-4" /> Back to Shipping</button>
                  <Button type="submit" disabled={isPlacing}>
                    {isPlacing ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</span>
                    ) : (
                      `Place Order • ${formatPrice(totals.total)}`
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-card p-6 shadow-card sticky top-24">
              <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream shrink-0"><img src={item.product.images[0]} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-medium text-charcoal line-clamp-1">{item.product.name}</p>
                      <p className="font-body text-[10px] text-warm-gray">
                        Qty: {item.quantity}
                        {item.selectedSize ? ` · Size: ${item.selectedSize}` : ""}
                        {item.selectedColor ? ` · ${item.selectedColor}` : ""}
                      </p>
                    </div>
                    <span className="font-body text-xs font-medium text-charcoal">{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-champagne pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Subtotal</span><span className="text-charcoal">{formatPrice(totals.subtotal)}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Discount</span><span className="text-charcoal">{formatPrice(totals.discount)}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Delivery</span><span className={cn("text-charcoal", totals.deliveryCharge === 0 && "text-green-600")}>{totals.deliveryCharge === 0 ? "Free" : formatPrice(totals.deliveryCharge)}</span></div>
                <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-champagne"><span>Total</span><span>{formatPrice(totals.total)}</span></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-warm-gray"><Banknote className="w-4 h-4" /><span className="font-body text-xs">Cash on Delivery</span></div>
              <div className="mt-2 flex items-center gap-2 text-warm-gray"><Truck className="w-4 h-4" /><span className="font-body text-xs">Free delivery over PKR 2,000</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
