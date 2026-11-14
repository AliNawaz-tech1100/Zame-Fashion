import Link from "next/link";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin.server";
import { ordersClient } from "@/lib/sanity/client";
import { ordersQuery } from "@/lib/sanity/queries";
import { AdminOrderListItem, OrderStatus, PaymentStatus } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Package, Search } from "lucide-react";

export const metadata: Metadata = { title: "Orders — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const NOTIFICATION_STYLES: Record<string, string> = {
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  skipped: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-800",
};

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });
  } catch {
    return value;
  }
}

function isoDate(value: string | undefined, endOfDay = false): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString();
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; from?: string; to?: string; q?: string };
}) {
  requireAdmin();

  const status = searchParams.status || undefined;
  const q = searchParams.q?.trim() || undefined;

  let orders: AdminOrderListItem[] = [];
  let fetchError = false;
  try {
    orders = await ordersClient.fetch<AdminOrderListItem[]>(
      ordersQuery,
      {
        status: status || null,
        from: isoDate(searchParams.from) || null,
        to: isoDate(searchParams.to, true) || null,
        q: q || null,
      },
      { cache: "no-store" }
    );
  } catch (error) {
    fetchError = true;
    console.error("[Admin] Failed to fetch orders:", error instanceof Error ? error.message : error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Orders</h1>
          <p className="font-body text-sm text-warm-gray mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <form method="GET" action="/admin/orders/" className="bg-white rounded-card p-4 shadow-card mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block font-body text-xs font-medium text-charcoal mb-1">Status</label>
          <select
            name="status"
            defaultValue={searchParams.status || ""}
            className="px-3 py-2 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block font-body text-xs font-medium text-charcoal mb-1">From</label>
          <input type="date" name="from" defaultValue={searchParams.from || ""}
            className="px-3 py-2 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block font-body text-xs font-medium text-charcoal mb-1">To</label>
          <input type="date" name="to" defaultValue={searchParams.to || ""}
            className="px-3 py-2 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block font-body text-xs font-medium text-charcoal mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
            <input type="text" name="q" defaultValue={searchParams.q || ""} placeholder="Order number, name, phone"
              className="w-full pl-9 pr-3 py-2 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold" />
          </div>
        </div>
        <button type="submit" className="px-5 py-2 bg-gold text-white rounded-pill font-body text-sm font-medium hover:bg-gold-dark transition-colors">
          Filter
        </button>
        <Link href="/admin/orders/" className="px-4 py-2 font-body text-sm text-warm-gray hover:text-charcoal transition-colors">
          Clear
        </Link>
      </form>

      {fetchError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-card p-6 font-body text-sm">
          Could not load orders. Check that SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN) has access to the
          private <code>orders</code> dataset and that the server can reach Sanity.
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-card p-12 shadow-card text-center">
          <Package className="w-10 h-10 text-warm-gray mx-auto mb-3" />
          <p className="font-body text-sm text-warm-gray">No orders match your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-champagne bg-cream/60">
                  <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Order</th>
                  <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Customer</th>
                  <th className="text-center font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Items</th>
                  <th className="text-right font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Total (COD)</th>
                  <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Payment</th>
                  <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Notifications</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-champagne/50 last:border-0 hover:bg-cream/40 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order._id}/`} className="font-body text-sm font-semibold text-gold hover:text-gold-dark">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-warm-gray whitespace-nowrap">{formatDate(order._createdAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-body text-sm text-charcoal">{order.customerName}</p>
                      <p className="font-body text-xs text-warm-gray">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-body text-sm text-charcoal">{order.itemCount}</td>
                    <td className="px-4 py-3 text-right font-body text-sm font-semibold text-charcoal whitespace-nowrap">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-block px-2.5 py-1 rounded-pill font-body text-[11px] font-semibold capitalize", STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-600")}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-block px-2.5 py-1 rounded-pill font-body text-[11px] font-semibold capitalize",
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : order.paymentStatus === "pending" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
                      )}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.notificationStatus && (
                        <span className={cn("inline-block px-2.5 py-1 rounded-pill font-body text-[11px] font-semibold capitalize", NOTIFICATION_STYLES[order.notificationStatus] || "bg-gray-100 text-gray-600")}>
                          {order.notificationStatus === "skipped" ? "Disabled" : order.notificationStatus === "sent" ? "Email ✓" : order.notificationStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
