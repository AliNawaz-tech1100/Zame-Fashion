"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderDocument, OrderStatus, PaymentStatus } from "@/types";

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "Pending (collect on delivery)" },
  { value: "paid", label: "Paid (cash collected)" },
  { value: "failed", label: "Failed (COD refused)" },
  { value: "refunded", label: "Refunded" },
];

interface OrderActionsProps {
  order: OrderDocument;
}

export function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [saving, setSaving] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const hasChanges = orderStatus !== order.orderStatus || paymentStatus !== order.paymentStatus;

  const handleSave = async () => {
    if (saving || !hasChanges) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/orders/${order._id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        setMessage({ type: "error", text: data.error || "Failed to update the order." });
      } else {
        setMessage({ type: "success", text: "Order updated." });
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "Network error — nothing was changed." });
    } finally {
      setSaving(false);
    }
  };

  const handleResendNotification = async () => {
    if (notifying) return;
    if (!window.confirm("Resend the WhatsApp order notification to the business number?")) return;
    setNotifying(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/orders/${order._id}/notify/`, { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (data.status === "sent") {
        setMessage({ type: "success", text: "WhatsApp notification accepted by the server." });
      } else if (data.status === "skipped") {
        setMessage({ type: "error", text: "WhatsApp is not configured on this server (see SETUP.md)." });
      } else {
        setMessage({ type: "error", text: data.error || "The notification could not be sent." });
      }
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Network error — the notification was not sent." });
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="bg-white rounded-card p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Manage Order</h2>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Fulfillment Status</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
            className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold"
          >
            {ORDER_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
          </select>
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold"
          >
            {PAYMENT_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white rounded-pill font-body text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
        <button
          onClick={handleResendNotification}
          disabled={notifying}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-pill border font-body text-sm font-medium transition-colors disabled:opacity-50",
            order.notification?.status === "failed"
              ? "border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100"
              : "border-champagne text-warm-gray hover:border-gold hover:text-charcoal"
          )}
        >
          {notifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {order.notification?.status === "failed" ? "Retry WhatsApp Notification" : "Resend WhatsApp Notification"}
        </button>
      </div>

      {message && (
        <p className={cn("font-body text-sm mt-3", message.type === "success" ? "text-green-700" : "text-red-600")}>
          {message.text}
        </p>
      )}
    </div>
  );
}
