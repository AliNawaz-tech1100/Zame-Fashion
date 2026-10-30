import "server-only";
import { NotificationStatus, OrderDocument } from "@/types";

/**
 * WhatsApp Business Cloud API integration (official Meta API).
 * Sends a NEW COD ORDER notification to the business owner's WhatsApp number
 * AFTER the order has been saved. All credentials stay server-side.
 *
 * Business-initiated messages must use an approved template (see SETUP.md
 * for the exact template body to submit for approval).
 */

const GRAPH_API_VERSION = "v21.0";
const REQUEST_TIMEOUT_MS = 10_000;
/** Template body limit is 1024 chars including placeholders. */
const MAX_SUMMARY_LENGTH = 500;

export interface NotificationResult {
  status: Extract<NotificationStatus, "sent" | "failed" | "skipped">;
  messageId?: string;
  error?: string;
}

interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessNumber: string;
  templateName: string;
  templateLanguage: string;
}

function getConfig(): WhatsAppConfig | null {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const businessNumber = process.env.WHATSAPP_BUSINESS_NUMBER;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;

  if (!accessToken || !phoneNumberId || !businessNumber || !templateName) return null;

  return {
    accessToken,
    phoneNumberId,
    businessNumber,
    templateName,
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en",
  };
}

export function isWhatsAppConfigured(): boolean {
  return getConfig() !== null;
}

/** Digits only, with the leading country-code 0 expanded is left to the user's config. */
function toE164Digits(value: string): string {
  return value.replace(/[^\d]/g, "");
}

/** Human-readable items block used as a template parameter. */
export function buildItemsSummary(order: Pick<OrderDocument, "items">): string {
  const lines = order.items.slice(0, 15).map((item) => {
    const variants = [item.size, item.color].filter(Boolean).join(" / ");
    return `• ${item.productName}${variants ? ` (${variants})` : ""} x${item.quantity} — PKR ${item.lineTotal}`;
  });
  if (order.items.length > 15) lines.push(`…and ${order.items.length - 15} more item(s)`);
  const summary = lines.join("\n");
  return summary.slice(0, MAX_SUMMARY_LENGTH);
}

function buildAdminUrl(orderId: string): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
  return `${base}/admin/orders/${orderId}/`;
}

/**
 * Send the order notification. Never throws — failures are returned so the
 * order record can be kept and the notification retried from the admin.
 */
export async function sendOrderNotification(order: OrderDocument): Promise<NotificationResult> {
  const config = getConfig();
  if (!config) {
    console.warn(
      "[WhatsApp] Skipped order notification — WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_BUSINESS_NUMBER / WHATSAPP_TEMPLATE_NAME not configured"
    );
    return { status: "skipped", error: "WhatsApp credentials not configured" };
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.phoneNumberId}/messages`;
  const to = toE164Digits(config.businessNumber);

  const parameters = [
    { type: "text", text: order.customer?.name || "-" }, // {{1}} customer name
    { type: "text", text: order.orderNumber }, // {{2}} order number
    { type: "text", text: String(order.total) }, // {{3}} COD amount
    { type: "text", text: buildItemsSummary(order) }, // {{4}} items summary
    { type: "text", text: buildAdminUrl(order._id) }, // {{5}} admin order link
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "template",
        template: {
          name: config.templateName,
          language: { code: config.templateLanguage },
          components: [{ type: "body", parameters }],
        },
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as {
      messages?: { id?: string }[];
      error?: { message?: string; code?: number; error_data?: { details?: string } };
    };

    if (!response.ok) {
      const fbMessage = payload.error?.message || `HTTP ${response.status}`;
      const fbCode = payload.error?.code ? ` (code ${payload.error.code})` : "";
      console.error(`[WhatsApp] Notification rejected for order ${order.orderNumber}: ${fbMessage}${fbCode}`);
      return { status: "failed", error: `${fbMessage}${fbCode}`.slice(0, 500) };
    }

    const messageId = payload.messages?.[0]?.id;
    console.log(`[WhatsApp] Notification accepted for order ${order.orderNumber} (messageId: ${messageId ?? "n/a"})`);
    return { status: "sent", messageId };
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    const message = isAbort ? "Request timed out" : error instanceof Error ? error.message : "Unknown error";
    console.error(`[WhatsApp] Notification failed for order ${order.orderNumber}: ${message}`);
    return { status: "failed", error: message.slice(0, 500) };
  } finally {
    clearTimeout(timeout);
  }
}
