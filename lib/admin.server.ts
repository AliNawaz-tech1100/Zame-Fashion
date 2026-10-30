import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Lightweight admin authentication using environment credentials and an
 * HMAC-signed, HTTP-only session cookie. No external auth provider needed.
 *
 * Required env vars: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET.
 */

export const ADMIN_COOKIE = "zame_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret() || "").update(value).digest("hex");
}

function constantTimeEquals(a: string, b: string): boolean {
  const hashA = createHmac("sha256", "compare").update(a).digest();
  const hashB = createHmac("sha256", "compare").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && getSecret());
}

/** Validate submitted credentials against env vars (constant-time). */
export function verifyAdminCredentials(username: string, password: string): boolean {
  if (!isAdminConfigured()) return false;
  return (
    constantTimeEquals(username, process.env.ADMIN_USERNAME as string) &&
    constantTimeEquals(password, process.env.ADMIN_PASSWORD as string)
  );
}

/** Create a signed session cookie value: `<expiryMs>.<hmac>`. */
export function createSessionValue(): { value: string; maxAge: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return { value: `${expiresAt}.${sign(String(expiresAt))}`, maxAge: SESSION_TTL_MS / 1000 };
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!value || !getSecret()) return false;
  const [expiresRaw, signature] = value.split(".");
  const expiresAt = Number(expiresRaw);
  if (!expiresRaw || !signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = sign(expiresRaw);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function isAdminAuthenticated(): boolean {
  const store = cookies();
  return verifySessionValue(store.get(ADMIN_COOKIE)?.value);
}

/** Guard for admin server pages — redirects to login when unauthenticated. */
export function requireAdmin(): void {
  if (!isAdminConfigured()) {
    redirect("/admin/login/?error=not-configured");
  }
  if (!isAdminAuthenticated()) {
    redirect("/admin/login/");
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
