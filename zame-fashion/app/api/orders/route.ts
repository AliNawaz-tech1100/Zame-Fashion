import { NextRequest, NextResponse } from "next/server";
import { placeOrder, validateCreateOrderInput } from "@/lib/orders.server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const RATE_LIMIT_PER_MINUTE = 10;

/**
 * POST /api/orders — place a Cash on Delivery order.
 * - Validates all input server-side.
 * - Re-fetches live prices/stock from Sanity (client prices are never trusted).
 * - Idempotent via the client-generated idempotency key (double-click safe).
 * - Sends the email notification only after the order is saved.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`orders:${ip}`, RATE_LIMIT_PER_MINUTE, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many order attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateCreateOrderInput(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error, fieldErrors: validation.fieldErrors },
      { status: 400 }
    );
  }

  try {
    const result = await placeOrder(validation.data);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error, fieldErrors: result.fieldErrors },
        { status: result.httpStatus }
      );
    }
    return NextResponse.json({
      ok: true,
      token: result.token,
      orderNumber: result.orderNumber,
      totals: result.totals,
      notificationStatus: result.notificationStatus,
      duplicate: result.duplicate,
    });
  } catch (error) {
    // Never expose internals — log for the operator only.
    console.error("[API] Unexpected error placing order:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
