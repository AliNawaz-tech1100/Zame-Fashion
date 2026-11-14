import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * POST /api/revalidate — CMS webhook endpoint.
 * Point a Sanity webhook (or any CI job) here when product/category content
 * changes so the storefront updates immediately instead of waiting for ISR.
 *
 * Authenticate with the REVALIDATE_SECRET env var sent as the
 * `x-revalidate-secret` header.
 */
async function handle(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ revalidated: false, error: "REVALIDATE_SECRET is not configured." }, { status: 503 });
  }

  const provided = request.headers.get("x-revalidate-secret");
  if (!provided || provided !== secret) {
    return NextResponse.json({ revalidated: false, error: "Invalid secret." }, { status: 401 });
  }

  revalidateTag("products");
  revalidateTag("categories");
  revalidateTag("collections");
  revalidatePath("/");
  revalidatePath("/shop/");
  console.log("[Revalidate] Storefront caches invalidated by CMS webhook");
  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
