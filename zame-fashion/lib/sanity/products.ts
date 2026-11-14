import "server-only";
import { Product, Category, Collection } from "@/types";
import { sanityClient, tokenClient } from "./client";
import {
  allProductsQuery,
  productBySlugQuery,
  productsByIdsQuery,
  featuredProductsQuery,
  newArrivalsQuery,
  bestSellersQuery,
  relatedProductsQuery,
  productSlugsQuery,
  categoriesQuery,
  collectionsQuery,
} from "./queries";
import { mapSanityProduct, mapSanityCategory, mapSanityCollection, SanityProductDoc } from "./mappers";

/**
 * Keep storefront content fresh after CMS edits.
 * Using `revalidate: 0` avoids stale product/category data while still allowing
 * the /api/revalidate webhook to clear these tags when a deployment or webhook fires.
 */
const PRODUCTS_REVALIDATE: { next: { revalidate: number; tags: string[] } } = {
  next: { revalidate: 0, tags: ["products"] },
};
const CATEGORIES_REVALIDATE: { next: { revalidate: number; tags: string[] } } = {
  next: { revalidate: 0, tags: ["categories"] },
};

/** Fetch without any caching — used for live price/stock checks at checkout. */
const NO_STORE = { cache: "no-store" } as const;

function logFetchError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  // Log the failure reason only — no tokens or customer data.
  console.error(`[Sanity] Failed to fetch ${scope}: ${message}`);
}

export async function getProducts(): Promise<Product[]> {
  try {
    const docs = await sanityClient.fetch<SanityProductDoc[]>(allProductsQuery, {}, PRODUCTS_REVALIDATE);
    return docs.map(mapSanityProduct);
  } catch (error) {
    logFetchError("products", error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const docs = await sanityClient.fetch<SanityProductDoc[]>(featuredProductsQuery, {}, PRODUCTS_REVALIDATE);
    return docs.map(mapSanityProduct).slice(0, limit);
  } catch (error) {
    logFetchError("featured products", error);
    return [];
  }
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  try {
    const docs = await sanityClient.fetch<SanityProductDoc[]>(newArrivalsQuery, {}, PRODUCTS_REVALIDATE);
    return docs.map(mapSanityProduct).slice(0, limit);
  } catch (error) {
    logFetchError("new arrivals", error);
    return [];
  }
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  try {
    const docs = await sanityClient.fetch<SanityProductDoc[]>(bestSellersQuery, {}, PRODUCTS_REVALIDATE);
    return docs.map(mapSanityProduct).slice(0, limit);
  } catch (error) {
    logFetchError("best sellers", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const doc = await sanityClient.fetch<SanityProductDoc | null>(productBySlugQuery, { slug }, PRODUCTS_REVALIDATE);
    return doc ? mapSanityProduct(doc) : null;
  } catch (error) {
    logFetchError(`product "${slug}"`, error);
    return null;
  }
}

export async function getRelatedProducts(product: Pick<Product, "id" | "category" | "collection">): Promise<Product[]> {
  try {
    const docs = await sanityClient.fetch<SanityProductDoc[]>(
      relatedProductsQuery,
      { id: product.id, category: product.category, collection: product.collection || "__none__" },
      PRODUCTS_REVALIDATE
    );
    return docs.map(mapSanityProduct);
  } catch (error) {
    logFetchError("related products", error);
    return [];
  }
}

export async function getProductSlugs(): Promise<string[]> {
  try {
    const docs = await sanityClient.fetch<{ slug: string }[]>(productSlugsQuery, {}, PRODUCTS_REVALIDATE);
    return docs.map((d) => d.slug).filter(Boolean);
  } catch (error) {
    logFetchError("product slugs", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const docs = await sanityClient.fetch<any[]>(categoriesQuery, {}, CATEGORIES_REVALIDATE);
    return docs.map(mapSanityCategory);
  } catch (error) {
    logFetchError("categories", error);
    return [];
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const docs = await sanityClient.fetch<any[]>(collectionsQuery, {}, CATEGORIES_REVALIDATE);
    return docs.map(mapSanityCollection);
  } catch (error) {
    logFetchError("collections", error);
    return [];
  }
}

/**
 * Live product fetch for the order API — always reads fresh published data
 * with a token (never trusts prices/stock sent by the browser).
 */
export async function getProductsByIdsForCheckout(ids: string[]): Promise<Product[]> {
  const docs = await tokenClient.fetch<SanityProductDoc[]>(productsByIdsQuery, { ids }, NO_STORE);
  return docs.map(mapSanityProduct);
}
