import { OrderTotals } from "@/types";

/**
 * Single source of truth for pricing rules.
 * The checkout UI estimates with these helpers; the order API recomputes
 * authoritatively with the same functions using live Sanity prices.
 */
export const FREE_SHIPPING_THRESHOLD = 2000;
export const DEFAULT_DELIVERY_CHARGE = 250;

export function getDeliveryCharge(subtotalAfterDiscount: number): number {
  return subtotalAfterDiscount > FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_DELIVERY_CHARGE;
}

export function calculateTotals(subtotal: number, discount = 0): OrderTotals {
  const safeDiscount = Math.max(0, Math.min(discount, subtotal));
  const deliveryCharge = getDeliveryCharge(subtotal - safeDiscount);
  return {
    subtotal,
    discount: safeDiscount,
    deliveryCharge,
    total: subtotal - safeDiscount + deliveryCharge,
  };
}
