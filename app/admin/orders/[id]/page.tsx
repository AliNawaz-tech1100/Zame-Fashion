import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin.server";
import { ordersClient } from "@/lib/sanity/client";
import { orderByIdQuery } from "@/lib/sanity/queries";
import { OrderDocument, OrderStatus, PaymentStatus } from "@/types";
import { OrderActions } from "@/components/admin/OrderActions";
import { formatPrice, cn } from "@/lib/utils";
import { ChevronLeft, MessageCircle, Truck, Banknote } from "lucide-react";

export const metadata: Metadata = { title: "Order Details — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ID_PATTERN = /^order-[A-Za-z0-9_.-]{1,160}$/;

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(value?: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });
  } catch {
    return value;
  }
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  requireAdmin();

  if (!ID_PATTERN.test(params.id)) notFound();

  let order: OrderDocument | null = null;
  try {
    order = await ordersClient.fetch<OrderDocument | null>(orderByIdQuery, { id: params.id }, { cache: "no-store" });
  } catch (error) {
    console.error("[Admin] Failed to fetch order:", error instanceof Error ? error.message : error);
  }

  if (!order) notFound();

  const notification = order.notification;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/admin/orders/" className="inline-flex items-center gap-1 font-body text-sm text-warm-gray hover:text-charcoal mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-charcoal">{order.orderNumber}</h1>
          <p className="font-body text-sm text-warm-gray mt-1">Placed {formatDate(order._createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("px-3 py-1.5 rounded-pill font-body text-xs font-semibold capitalize", STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-600")}>
            {order.orderStatus}
          </span>
          <span className={cn(
            "px-3 py-1.5 rounded-pill font-body text-xs font-semibold capitalize",
            order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : order.paymentStatus === "pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
          )}>
            Payment: {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex items-center gap-4">
                  {item.image ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream shrink-0">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-cream shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-charcoal">
                      {item.productSlug ? (
                        <Link href={`/product/${item.productSlug}/`} target="_blank" className="hover:text-gold transition-colors">
                          {item.productName}
                        </Link>
                      ) : item.productName}
                    </p>
                    <p className="font-body text-xs text-warm-gray mt-0.5">
                      {item.sku ? `SKU: ${item.sku}` : ""}
                      {item.size ? ` · Size: ${item.size}` : ""}
                      {item.color ? ` · Color: ${item.color}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-body text-sm font-semibold text-charcoal">{formatPrice(item.lineTotal)}</p>
                    <p className="font-body text-[11px] text-warm-gray">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-champagne mt-5 pt-4 space-y-2">
              <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Subtotal</span><span className="text-charcoal">{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Discount</span><span className="text-charcoal">{formatPrice(order.discount ?? 0)}</span></div>
              <div className="flex justify-between font-body text-sm"><span className="text-warm-gray">Delivery Charges</span><span className="text-charcoal">{order.deliveryCharge === 0 ? "Free" : formatPrice(order.deliveryCharge)}</span></div>
              <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-champagne"><span>COD Amount</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Customer & delivery */}
          <div className="bg-white rounded-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-gold" />
              <h2 className="font-display text-lg font-semibold text-charcoal">Customer & Delivery</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 font-body text-sm">
              <div><span className="text-warm-gray">Name:</span> <span className="text-charcoal font-medium">{order.customer?.name}</span></div>
              <div><span className="text-warm-gray">Phone:</span> <span className="text-charcoal font-medium">{order.customer?.phone}</span></div>
              <div><span className="text-warm-gray">WhatsApp:</span> <span className="text-charcoal">{order.customer?.whatsappNumber || "—"}</span></div>
              <div><span className="text-warm-gray">Email:</span> <span className="text-charcoal">{order.customer?.email || "—"}</span></div>
              <div className="sm:col-span-2"><span className="text-warm-gray">Address:</span> <span className="text-charcoal">{order.customer?.address}</span></div>
              <div><span className="text-warm-gray">City:</span> <span className="text-charcoal">{order.customer?.city}</span></div>
              <div><span className="text-warm-gray">Province:</span> <span className="text-charcoal">{order.customer?.province || "—"}</span></div>
              <div><span className="text-warm-gray">Postal Code:</span> <span className="text-charcoal">{order.customer?.postalCode || "—"}</span></div>
              {order.customer?.instructions && (
                <div className="sm:col-span-2"><span className="text-warm-gray">Delivery Instructions:</span> <span className="text-charcoal">{order.customer.instructions}</span></div>
              )}
              {order.customer?.notes && (
                <div className="sm:col-span-2"><span className="text-warm-gray">Order Notes:</span> <span className="text-charcoal">{order.customer.notes}</span></div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OrderActions order={order} />

          {/* Payment method */}
          <div className="bg-white rounded-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Banknote className="w-4 h-4 text-gold" />
              <h3 className="font-body text-sm font-semibold text-charcoal">Payment Method</h3>
            </div>
            <p className="font-body text-sm text-charcoal">Cash on Delivery</p>
            <p className="font-body text-xs text-warm-gray mt-1">
              Mark payment as <strong>paid</strong> once the cash is collected on delivery.
            </p>
            {order.stockDeductionStatus && (
              <p className="font-body text-xs text-warm-gray mt-3">
                Stock deduction:{" "}
                <span className={cn("font-semibold capitalize", order.stockDeductionStatus === "done" ? "text-green-700" : order.stockDeductionStatus === "failed" ? "text-red-600" : "text-charcoal")}>
                  {order.stockDeductionStatus}
                </span>
              </p>
            )}
          </div>

          {/* WhatsApp notification */}
          <div className="bg-white rounded-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className={cn("w-4 h-4", notification?.status === "failed" ? "text-red-500" : "text-gold")} />
              <h3 className="font-body text-sm font-semibold text-charcoal">WhatsApp Notification</h3>
            </div>
            <p className="font-body text-sm text-charcoal capitalize">Status: {notification?.status || "pending"}</p>
            {notification?.messageId && (
              <p className="font-body text-xs text-warm-gray mt-1 break-all">Message ID: {notification.messageId}</p>
            )}
            {notification?.error && (
              <p className="font-body text-xs text-red-600 mt-1 break-words">Error: {notification.error}</p>
            )}
            {notification?.lastAttemptAt && (
              <p className="font-body text-xs text-warm-gray mt-1">Last attempt: {formatDate(notification.lastAttemptAt)} ({notification.attempts || 1} attempt{(notification.attempts || 1) > 1 ? "s" : ""})</p>
            )}
            {notification?.status === "failed" && (
              <p className="font-body text-xs text-amber-700 mt-2">
                The order is saved regardless. Use &quot;Retry WhatsApp Notification&quot; to resend after fixing the configuration.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
