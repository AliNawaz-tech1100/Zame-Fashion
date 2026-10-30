import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin.server";
import { ordersClient } from "@/lib/sanity/client";
import { orderByIdQuery } from "@/lib/sanity/queries";
import { sendOrderNotification } from "@/lib/whatsapp.server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { OrderDocument } from "@/types";

export const dynamic = "force-dynamic";

const ID_PATTERN = /^order-[A-Za-z0-9_.-]{1,160}$/;

/**
 * POST /api/admin/orders/[id]/notify — (re)send the WhatsApp order notification.
 * Safe to retry: it never creates or modifies the order itself, only the
 * notification status recorded on it.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(`admin-notify:${getClientIp(request)}`, 15, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please wait." }, { status: 429 });
  }

  const id = params.id;
  if (!ID_PATTERN.test(id)) {
    return NextResponse.json({ ok: false, error: "Invalid order id." }, { status: 400 });
  }

  try {
    const order = await ordersClient.fetch<OrderDocument | null>(orderByIdQuery, { id }, { cache: "no-store" });
    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    }

    const result = await sendOrderNotification(order);
    await ordersClient
      .patch(id, {
        set: {
          notification: {
            status: result.status,
            messageId: result.messageId,
            error: result.error,
            attempts: (order.notification?.attempts || 0) + 1,
            lastAttemptAt: new Date().toISOString(),
          },
        },
      })
      .commit();

    return NextResponse.json({ ok: result.status === "sent", status: result.status, error: result.error });
  } catch (error) {
    console.error("[Admin] Notification retry failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Failed to send the notification." }, { status: 500 });
  }
}
