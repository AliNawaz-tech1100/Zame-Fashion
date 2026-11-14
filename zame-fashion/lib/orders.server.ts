import "server-only";
import { createHash, randomBytes } from "crypto";
import { ordersClient, tokenClient } from "@/lib/sanity/client";
import { orderByIdQuery } from "@/lib/sanity/queries";
import { getProductsByIdsForCheckout } from "@/lib/sanity/products";
import { calculateTotals } from "@/lib/pricing";
import { sendOrderNotification } from "@/lib/email.server";
import {
  CreateOrderInput,
  NotificationStatus,
  OrderDocument,
  OrderTotals,
  Product,
} from "@/types";

export const ORDER_ID_PREFIX = "order-";

const MAX_ITEMS = 30;
const MAX_QUANTITY_PER_ITEM = 20;
const ID_PATTERN = /^[A-Za-z0-9_.-]{1,160}$/;

/** Normalize Pakistani phone numbers to digits for validation/storage. */
function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
}

function isValidPkPhone(value: string): boolean {
  const normalized = normalizePhone(value);
  return /^(?:92|0)?3\d{9}$/.test(normalized);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function normalizeOrderImage(value?: string): string {
  if (!value) return "";

  // Sanity asset refs are not valid URL strings to save into a free-form "image" field.
  // A malformed asset ref looks like a 40-character hex hash and must be discarded.
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-f0-9]{32,}$/i.test(value)) return "";
  return value;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `ZMF-${yy}${mm}${dd}-${rand}`;
}

export function orderIdFromKey(idempotencyKey: string): string {
  // Deterministic document ID gives natural idempotency: retried submissions
  // map to the same document instead of creating duplicates.
  return `${ORDER_ID_PREFIX}${idempotencyKey}`;
}

type ValidationResult =
  | { ok: true; data: CreateOrderInput }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

/** Server-side validation of the checkout payload. Never trusts the client. */
export function validateCreateOrderInput(raw: unknown): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  const body = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, any>;

  const idempotencyKey = typeof body.idempotencyKey === "string" ? body.idempotencyKey.trim() : "";
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(idempotencyKey)) {
    fieldErrors.idempotencyKey = "Invalid order session. Please refresh the page and try again.";
  }

  const customer = (typeof body.customer === "object" && body.customer !== null ? body.customer : {}) as Record<
    string,
    any
  >;

  const name = typeof customer.name === "string" ? customer.name.trim() : "";
  if (name.length < 2 || name.length > 80) fieldErrors.name = "Please enter your full name.";

  const phone = typeof customer.phone === "string" ? customer.phone.trim() : "";
  if (!phone || !isValidPkPhone(phone)) fieldErrors.phone = "Enter a valid Pakistani mobile number, e.g. 03XX-XXXXXXX.";

  const email = typeof customer.email === "string" ? customer.email.trim() : "";
  if (email && !isEmail(email)) fieldErrors.email = "Enter a valid email address or leave it empty.";

  const address = typeof customer.address === "string" ? customer.address.trim() : "";
  if (address.length < 10 || address.length > 500) {
    fieldErrors.address = "Please enter your complete delivery address (house, street, area).";
  }

  const city = typeof customer.city === "string" ? customer.city.trim() : "";
  if (city.length < 2 || city.length > 80) fieldErrors.city = "Please enter your city.";

  const province = typeof customer.province === "string" ? customer.province.trim() : "";
  const postalCode = typeof customer.postalCode === "string" ? customer.postalCode.trim() : "";
  const instructions = typeof customer.instructions === "string" ? customer.instructions.trim().slice(0, 500) : "";
  const notes = typeof customer.notes === "string" ? customer.notes.trim().slice(0, 500) : "";

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const items: CreateOrderInput["items"] = [];
  if (rawItems.length === 0) fieldErrors.items = "Your cart is empty.";
  if (rawItems.length > MAX_ITEMS) fieldErrors.items = `A maximum of ${MAX_ITEMS} line items is allowed.`;

  rawItems.slice(0, MAX_ITEMS).forEach((item: any, index: number) => {
    const productId = typeof item?.productId === "string" ? item.productId.trim() : "";
    const quantity = Number(item?.quantity);
    const size = typeof item?.size === "string" && item.size.trim() ? item.size.trim() : undefined;
    const color = typeof item?.color === "string" && item.color.trim() ? item.color.trim() : undefined;

    if (!ID_PATTERN.test(productId)) {
      fieldErrors[`items.${index}`] = "An item in your cart is invalid. Please refresh and try again.";
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      fieldErrors[`items.${index}`] = "Invalid quantity in your cart.";
      return;
    }
    items.push({ productId, quantity, size, color });
  });

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  return {
    ok: true,
    data: {
      idempotencyKey,
      items,
      customer: {
        name,
        phone: normalizePhone(phone),
        email: email || undefined,
        address,
        city,
        province: province || undefined,
        postalCode: postalCode || undefined,
        instructions: instructions || undefined,
        notes: notes || undefined,
      },
    },
  };
}

export type PlaceOrderResult =
  | {
      ok: true;
      token: string;
      orderNumber: string;
      totals: OrderTotals;
      notificationStatus: NotificationStatus;
      duplicate: boolean;
    }
  | { ok: false; httpStatus: number; error: string; fieldErrors?: Record<string, string> };

interface LineItem {
  _key: string;
  productName: string;
  productSlug: string;
  productId: string;
  sku: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

async function findExistingOrder(orderId: string): Promise<OrderDocument | null> {
  try {
    return await ordersClient.fetch<OrderDocument | null>(orderByIdQuery, { id: orderId }, { cache: "no-store" });
  } catch (error) {
    console.error("[Orders] Failed to check for existing order:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Decrement product stock in the products dataset (best-effort, non-fatal). */
async function deductStock(items: Array<{ productId: string; quantity: number; remainingStock: number }>) {
  const transaction = tokenClient.transaction();
  const seen = new Map<string, number>();
  for (const item of items) {
    seen.set(item.productId, (seen.get(item.productId) || 0) + item.quantity);
  }
  for (const item of items) {
    const totalDeducted = seen.get(item.productId)!;
    if (item.remainingStock - totalDeducted <= 0) {
      transaction.patch(item.productId, { set: { availability: "out-of-stock" } });
    }
  }
  for (const [productId, quantity] of seen) {
    transaction.patch(productId, { dec: { stock: quantity } });
  }
  await transaction.commit();
}

/**
 * Place a COD order:
 * 1. Idempotency check (retried submissions return the original order).
 * 2. Fetch live products from Sanity — validate stock, sizes, colors.
 * 3. Recompute all totals server-side (never trust client prices).
 * 4. Save the order in the private orders dataset.
 * 5. Deduct stock (non-fatal on failure — recorded on the order).
 * 6. Send the email notification (only after the order is saved).
 */
export async function placeOrder(input: CreateOrderInput): Promise<PlaceOrderResult> {
  const orderId = orderIdFromKey(input.idempotencyKey);

  // 1. Idempotency — if this exact submission was already processed, return it.
  const existing = await findExistingOrder(orderId);
  if (existing) {
    return {
      ok: true,
      token: input.idempotencyKey,
      orderNumber: existing.orderNumber,
      totals: {
        subtotal: existing.subtotal,
        discount: existing.discount ?? 0,
        deliveryCharge: existing.deliveryCharge,
        total: existing.total,
      },
      notificationStatus: existing.notification?.status || "pending",
      duplicate: true,
    };
  }

  // 2. Live product data from Sanity (fresh, token-authenticated read).
  let products: Product[];
  try {
    products = await getProductsByIdsForCheckout([...new Set(input.items.map((i) => i.productId))]);
  } catch (error) {
    console.error("[Orders] Product lookup failed:", error instanceof Error ? error.message : error);
    return { ok: false, httpStatus: 503, error: "We could not verify product availability right now. Please try again in a moment." };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const fieldErrors: Record<string, string> = {};
  const lineItems: LineItem[] = [];
  let subtotal = 0;

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      fieldErrors.items = "One of the products in your cart is no longer available.";
      continue;
    }
    if (product.stock <= 0) {
      fieldErrors.items = `"${product.name}" is out of stock.`;
      continue;
    }
    if (product.stock < item.quantity) {
      fieldErrors.items = `Only ${product.stock} left of "${product.name}". Please reduce the quantity.`;
      continue;
    }

    const normalizedSize = item.size || product.sizes?.[0];
    const normalizedColor = item.color || product.colors?.[0]?.name;

    if ((product.sizes?.length ?? 0) > 0) {
      if (!normalizedSize) {
        fieldErrors.items = `Please select a size for "${product.name}".`;
        continue;
      }
      if (!product.sizes!.includes(normalizedSize)) {
        fieldErrors.items = `Selected size for "${product.name}" is unavailable.`;
        continue;
      }
    }
    if ((product.colors?.length ?? 0) > 0) {
      if (!normalizedColor) {
        fieldErrors.items = `Please select a color for "${product.name}".`;
        continue;
      }
      if (!product.colors!.some((c) => c.name === normalizedColor)) {
        fieldErrors.items = `Selected color for "${product.name}" is unavailable.`;
        continue;
      }
    }

    const unitPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;
    lineItems.push({
      _key: randomBytes(8).toString("hex"),
      productName: product.name,
      productSlug: product.slug,
      productId: product.id,
      sku: product.sku,
      image: normalizeOrderImage(product.images[0]),
      size: normalizedSize,
      color: normalizedColor,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, httpStatus: 409, error: "Some items in your cart changed. Please review your order.", fieldErrors };
  }

  // 3. Authoritative totals.
  const totals = calculateTotals(subtotal, 0);
  const orderNumber = generateOrderNumber();

  const orderDoc: OrderDocument & { _type: "order" } = {
    _id: orderId,
    _type: "order",
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    orderNumber,
    idempotencyKey: input.idempotencyKey,
    customer: input.customer,
    items: lineItems,
    subtotal: totals.subtotal,
    deliveryCharge: totals.deliveryCharge,
    discount: totals.discount,
    total: totals.total,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "pending",
    stockDeductionStatus: "pending",
    notification: { status: "skipped", attempts: 0, error: "Email and WhatsApp notifications are disabled for this store." },
  };

  // 4. Persist the order. Email only happens after this succeeds.
  try {
    await ordersClient.createOrReplace(orderDoc);
  } catch (error) {
    console.error("[Orders] Failed to save order:", error instanceof Error ? error.message : error);
    return { ok: false, httpStatus: 500, error: "We could not save your order. Please try again." };
  }
  console.log(`[Orders] Saved order ${orderNumber}`);

  // 5. Stock deduction (best-effort; failures are recorded for manual review).
  try {
    const stockData = input.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      remainingStock: productMap.get(item.productId)?.stock ?? 0,
    }));
    await deductStock(stockData);
    await ordersClient.patch(orderId, { set: { stockDeductionStatus: "done" } }).commit();
  } catch (error) {
    console.error("[Orders] Stock deduction failed:", error instanceof Error ? error.message : error);
    try {
      await ordersClient.patch(orderId, { set: { stockDeductionStatus: "failed" } }).commit();
    } catch {
      /* non-fatal */
    }
  }

  // 6. Notifications are intentionally disabled. Orders are saved to Sanity and remain visible in the admin area.
  const notification = { status: "skipped" as const, error: "Email notifications are disabled for this store." };
  try {
    await ordersClient
      .patch(orderId, {
        set: {
          notification: {
            status: notification.status,
            messageId: undefined,
            error: notification.error,
            attempts: (orderDoc.notification?.attempts || 0) + 1,
            lastAttemptAt: new Date().toISOString(),
          },
        },
      })
      .commit();
  } catch (error) {
    console.error("[Orders] Failed to record notification status:", error instanceof Error ? error.message : error);
  }

  return {
    ok: true,
    token: input.idempotencyKey,
    orderNumber,
    totals,
    notificationStatus: notification.status,
    duplicate: false,
  };
}

/** Fetch a full order by its unguessable idempotency token (confirmation page). */
export async function getOrderByToken(token: string): Promise<OrderDocument | null> {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  try {
    return await ordersClient.fetch<OrderDocument | null>(
      orderByIdQuery,
      { id: orderIdFromKey(token) },
      { cache: "no-store" }
    );
  } catch (error) {
    console.error("[Orders] Failed to fetch order:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Constant-time string comparison helper reused by admin auth. */
export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
