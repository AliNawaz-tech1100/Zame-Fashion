import "server-only";
import nodemailer from "nodemailer";
import { NotificationStatus, OrderDocument } from "@/types";

/**
 * SMTP email notification (no third-party SaaS — uses your own mailbox).
 * Sends a NEW COD ORDER notification to the business owner's email
 * AFTER the order has been saved. All credentials stay server-side.
 *
 * Works with any SMTP provider: your hosting/cPanel mailbox, Gmail
 * (app password), Zoho, etc. See SETUP.md / .env.example for config.
 */

const REQUEST_TIMEOUT_MS = 10_000;

export interface NotificationResult {
  status: Extract<NotificationStatus, "sent" | "failed" | "skipped">;
  messageId?: string;
  error?: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
}

function getConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!host || !user || !pass || !to) return null;

  const port = Number(process.env.SMTP_PORT) || 587;
  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    user,
    pass,
    to,
    from: process.env.ORDER_NOTIFICATION_FROM || user,
  };
}

export function isEmailConfigured(): boolean {
  return getConfig() !== null;
}

/** Human-readable items block used in the email body. */
export function buildItemsSummary(order: Pick<OrderDocument, "items">): string {
  const lines = order.items.slice(0, 30).map((item) => {
    const variants = [item.size, item.color].filter(Boolean).join(" / ");
    return `${item.productName}${variants ? ` (${variants})` : ""} x${item.quantity} — PKR ${item.lineTotal}`;
  });
  if (order.items.length > 30) lines.push(`…and ${order.items.length - 30} more item(s)`);
  return lines.join("\n");
}

function buildAdminUrl(orderId: string): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
  return `${base}/admin/orders/${orderId}/`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(order: OrderDocument): string {
  const c = order.customer;
  const itemRows = order.items
    .map((item) => {
      const variants = [item.size, item.color].filter(Boolean).join(" / ");
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.productName)}${variants ? ` <small>(${escapeHtml(variants)})</small>` : ""}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">PKR ${item.lineTotal}</td>
      </tr>`;
    })
    .join("");

  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
    <h2 style="color:#b8860b;">New COD Order — ${escapeHtml(order.orderNumber)}</h2>
    <p><strong>Customer:</strong> ${escapeHtml(c.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(c.phone)}${c.email ? `<br/><strong>Email:</strong> ${escapeHtml(c.email)}` : ""}</p>
    <p><strong>Address:</strong> ${escapeHtml(c.address)}, ${escapeHtml(c.city)}${c.province ? `, ${escapeHtml(c.province)}` : ""}${c.postalCode ? ` ${escapeHtml(c.postalCode)}` : ""}</p>
    ${c.instructions ? `<p><strong>Instructions:</strong> ${escapeHtml(c.instructions)}</p>` : ""}
    ${c.notes ? `<p><strong>Notes:</strong> ${escapeHtml(c.notes)}</p>` : ""}
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <thead>
        <tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #333;">Item</th><th style="padding:8px 0;border-bottom:2px solid #333;">Qty</th><th style="text-align:right;padding:8px 0;border-bottom:2px solid #333;">Total</th></tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <tr><td>Subtotal</td><td style="text-align:right;">PKR ${order.subtotal}</td></tr>
      <tr><td>Delivery</td><td style="text-align:right;">PKR ${order.deliveryCharge}</td></tr>
      ${order.discount ? `<tr><td>Discount</td><td style="text-align:right;">- PKR ${order.discount}</td></tr>` : ""}
      <tr><td style="font-weight:bold;padding-top:8px;font-size:16px;">Total (COD)</td><td style="text-align:right;font-weight:bold;padding-top:8px;font-size:16px;">PKR ${order.total}</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="${buildAdminUrl(order._id)}" style="background:#b8860b;color:#fff;padding:10px 18px;text-decoration:none;border-radius:999px;font-size:14px;">Open order in admin</a>
    </p>
  </div>`;
}

/**
 * Send the order notification email. Never throws — failures are returned so
 * the order record can be kept and the notification retried from the admin.
 */
export async function sendOrderNotification(order: OrderDocument): Promise<NotificationResult> {
  console.info(`[Email] Order notifications are disabled. Order ${order.orderNumber} was saved in Sanity without sending email.`);
  return { status: "skipped", error: "Email notifications are disabled for this store." };
}
