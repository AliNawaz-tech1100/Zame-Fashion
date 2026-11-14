import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionValue,
  isAdminConfigured,
  sessionCookieOptions,
  verifyAdminCredentials,
} from "@/lib/admin.server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ATTEMPTS_PER_MINUTE = 5;

/** POST /api/admin/login — env-credential login that sets an HMAC session cookie. */
export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin login is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`admin-login:${ip}`, ATTEMPTS_PER_MINUTE, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many login attempts. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password || !verifyAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
  }

  const session = createSessionValue();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session.value, { ...sessionCookieOptions, maxAge: session.maxAge });
  return response;
}
