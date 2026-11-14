"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, cn } from "@/lib/utils";
import { Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();
  const subtotal = getSubtotal();
  const shipping = subtotal > 2000 ? 0 : 250;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Looks like you haven't added anything cute yet. Let's fix that!"
          action={{ label: "Start Shopping", href: "/shop/" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-charcoal mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.salePrice || item.product.price;
              return (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="bg-white rounded-card p-4 sm:p-5 shadow-card flex gap-4">
                  <Link href={`/product/${item.product.slug}/`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-image overflow-hidden bg-cream shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${item.product.slug}/`}>
                          <h3 className="font-body text-sm font-medium text-charcoal hover:text-gold transition-colors line-clamp-1">{item.product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {item.selectedColor && <span className="font-body text-xs text-warm-gray">Color: {item.selectedColor}</span>}
                          {item.selectedSize && <span className="font-body text-xs text-warm-gray">Size: {item.selectedSize}</span>}
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="p-1.5 text-warm-gray hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.product.id, q)} className="scale-90 origin-left" />
                      <span className="font-body text-sm font-semibold text-charcoal">{formatPrice(price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={clearCart} className="font-body text-sm text-warm-gray hover:text-red-500 transition-colors">Clear Cart</button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-card p-6 shadow-card sticky top-24">
              <h2 className="font-display text-lg font-semibold text-charcoal mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Subtotal</span><span className="text-charcoal">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Shipping</span><span className={cn("text-charcoal", shipping === 0 && "text-green-600")}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                {shipping > 0 && <p className="font-body text-xs text-warm-gray flex items-center gap-1"><Truck className="w-3 h-3" /> Free shipping on orders over PKR 2,000</p>}
                <div className="border-t border-champagne pt-3 flex justify-between"><span className="font-body text-base font-semibold text-charcoal">Total</span><span className="font-display text-xl font-bold text-charcoal">{formatPrice(total)}</span></div>
              </div>
              <Link href="/checkout/"><Button size="lg" className="w-full mb-3">Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              <Link href="/shop/"><Button variant="ghost" className="w-full">Continue Shopping</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
