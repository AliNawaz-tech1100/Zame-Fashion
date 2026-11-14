import { Metadata } from "next";
import Link from "next/link";
import { getOrderByToken } from "@/lib/orders.server";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";
import { Check, Truck, Banknote, MessageCircle, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    });
  } catch {
    return value;
  }
}

export default async function OrderConfirmationPage({ params }: { params: { token: string } }) {
  const order = await getOrderByToken(params.token);

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-white rounded-card p-8 shadow-card">
          <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-warm-gray" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-charcoal mb-2">Order Not Found</h1>
          <p className="font-body text-sm text-warm-gray mb-6">
            We could not find an order for this link. If you just placed an order and saw an error,
            please contact us with your phone number so we can check.
          </p>
          <Link href="/shop/"><Button className="w-full">Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  const notification = order.notification;
  const notificationSent = notification?.status === "sent";
  const notificationFailed = notification?.status === "failed";

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-card p-8 shadow-card text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-soft-mint/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-charcoal mb-2">Order Received!</h1>
          <p className="font-body text-warm-gray mb-4">
            Thank you, {order.customer?.name || "valued customer"}! Your order has been saved and our team will process it shortly.
          </p>
          <div className="inline-flex flex-col items-center bg-cream rounded-input px-6 py-3">
            <span className="font-body text-xs text-warm-gray uppercase tracking-wider">Order Number</span>
            <span className="font-display text-xl font-bold text-charcoal">{order.orderNumber}</span>
          </div>
          <p className="font-body text-xs text-warm-gray mt-3">Placed on {formatDate(order._createdAt)}</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-card p-6 shadow-card mb-6">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex items-center gap-3">
                {item.image ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream shrink-0"><img src={item.image} alt={item.productName} className="w-full h-full object-cover" /></div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-cream shrink-0" />
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-body text-sm font-medium text-charcoal">{item.productName}</p>
                  <p className="font-body text-xs text-warm-gray">
                    Qty: {item.quantity}
                    {item.size ? ` · Size: ${item.size}` : ""}
                    {item.color ? ` · ${item.color}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-body text-sm font-medium text-charcoal">{formatPrice(item.lineTotal)}</p>
                  <p className="font-body text-[10px] text-warm-gray">{formatPrice(item.unitPrice)} each</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-champagne mt-4 pt-4 space-y-2">
            <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Subtotal</span><span className="text-charcoal">{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Discount</span><span className="text-charcoal">{formatPrice(order.discount ?? 0)}</span></div>
            <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Delivery Charges</span><span className={order.deliveryCharge === 0 ? "text-green-600" : "text-charcoal"}>{order.deliveryCharge === 0 ? "Free" : formatPrice(order.deliveryCharge)}</span></div>
            <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-champagne"><span>Cash to Pay on Delivery</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        {/* Delivery & payment */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-gold" />
              <h3 className="font-body text-sm font-semibold text-charcoal">Delivery Address</h3>
            </div>
            <p className="font-body text-sm text-charcoal">{order.customer?.name}</p>
            <p className="font-body text-sm text-warm-gray">{order.customer?.phone}</p>
            {order.customer?.whatsappNumber && <p className="font-body text-sm text-warm-gray">WhatsApp: {order.customer.whatsappNumber}</p>}
            <p className="font-body text-sm text-warm-gray mt-1">{order.customer?.address}</p>
            <p className="font-body text-sm text-warm-gray">{order.customer?.city}{order.customer?.province ? `, ${order.customer.province}` : ""}{order.customer?.postalCode ? ` — ${order.customer.postalCode}` : ""}</p>
            {order.customer?.instructions && <p className="font-body text-xs text-warm-gray mt-2">Instructions: {order.customer.instructions}</p>}
          </div>
          <div className="bg-white rounded-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Banknote className="w-4 h-4 text-gold" />
              <h3 className="font-body text-sm font-semibold text-charcoal">Payment</h3>
            </div>
            <p className="font-body text-sm text-charcoal">Cash on Delivery</p>
            <p className="font-body text-xs text-warm-gray mt-1">Pay {formatPrice(order.total)} in cash when your order arrives.</p>
            <div className="mt-3 pt-3 border-t border-champagne/50">
              <p className="font-body text-xs text-warm-gray">Order Status: <span className="font-medium text-charcoal capitalize">{order.orderStatus}</span></p>
            </div>

            {/* Honest notification status — only claims acceptance when the API confirmed it */}
            <div className="mt-3 pt-3 border-t border-champagne/50">
              <div className="flex items-start gap-2">
                <MessageCircle className={cn("w-4 h-4 mt-0.5 shrink-0", notificationSent ? "text-green-600" : notificationFailed ? "text-amber-600" : "text-warm-gray")} />
                <p className="font-body text-xs text-warm-gray">
                  {notificationSent
                    ? "Our team has been notified about your order via WhatsApp."
                    : notificationFailed
                      ? "Your order is saved. We had trouble sending an instant team notification — our team will still process your order."
                      : "Your order has been recorded. Our team will be in touch if needed."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/shop/"><Button size="lg">Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
