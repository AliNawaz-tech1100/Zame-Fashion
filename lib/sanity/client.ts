import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "95981i5a";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-01";

/**
 * Client for published storefront content.
 * Runs server-side only (used from Server Components / route handlers).
 */
export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Token-bearing client for server-only reads (live stock/price checks at checkout).
 * The read token is never exposed to the browser — all fetching happens server-side.
 */
export const tokenClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || "",
});

/**
 * Client for the dedicated PRIVATE `orders` dataset.
 * Order documents contain customer PII and must never be readable anonymously.
 */
export const ordersClient: SanityClient = createClient({
  projectId,
  dataset: process.env.SANITY_ORDERS_DATASET || "orders",
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN || "",
});

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** Convert a Sanity image (with optional hotspot) into a storefront URL string. */
export function imageToUrl(
  image: { asset?: { _ref?: string; url?: string }; hotspot?: unknown } | undefined,
  width = 800
): string | undefined {
  if (!image) return undefined;
  try {
    return urlFor(image).width(width).auto("format").url();
  } catch {
    return undefined;
  }
}

/** True when Sanity env vars are present so content fetching can work. */
export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
