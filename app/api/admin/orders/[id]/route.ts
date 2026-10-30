import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin.server";
import { ordersClient } from "@/lib/sanity/client";
import { orderByIdQuery } from "@/lib/sanity/queries";
import { OrderDocument, OrderStatus, PaymentStatus } from "@/types";

export const dynamic = "force-dynamic";

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];
const ID_PATTERN = /^order-[A-Za-z0-9_.-]{1,160}$/;

/**
 * PATCH /api/admin/orders/[id] — update order status and/or payment status.
 * Protected by the admin session cookie.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id;
  if (!ID_PATTERN.test(id)) {
    return NextResponse.json({ ok: false, error: "Invalid order id." }, { status: 400 });
  }

  let body: { orderStatus?: string; paymentStatus?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const patch: Record<string, string> = {};
  if (body.orderStatus !== undefined) {
    if (!ORDER_STATUSES.includes(body.orderStatus as OrderStatus)) {
      return NextResponse.json({ ok: false, error: "Invalid order status." }, { status: 400 });
    }
    patch.orderStatus = body.orderStatus;
  }
  if (body.paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(body.paymentStatus as PaymentStatus)) {
      return NextResponse.json({ ok: false, error: "Invalid payment status." }, { status: 400 });
    }
    patch.paymentStatus = body.paymentStatus;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to update." }, { status: 400 });
  }

  try {
    const existing = await ordersClient.fetch<OrderDocument | null>(
      orderByIdQuery,
      { id },
      { cache: "no-store" }
    );
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    }
    const updated = await ordersClient.patch(id).set(patch).commit<OrderDocument>();
    console.log(`[Admin] Order ${existing.orderNumber} updated:`, Object.keys(patch).join(", "));
    return NextResponse.json({ ok: true, orderStatus: updated.orderStatus, paymentStatus: updated.paymentStatus });
  } catch (error) {
    console.error("[Admin] Failed to update order:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Failed to update the order." }, { status: 500 });
  }
}
