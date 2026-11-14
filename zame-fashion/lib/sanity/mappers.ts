import { Product, Category, Collection } from "@/types";
import { imageToUrl } from "./client";

/** Portable Text → plain string (the storefront renders plain paragraphs). */
export function portableTextToPlain(value: unknown): string {
  if (!Array.isArray(value)) return typeof value === "string" ? value : "";
  return value
    .map((block: any) => {
      if (typeof block === "string") return block;
      if (block?._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children
        .map((child: any) => (typeof child?.text === "string" ? child.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

/** Plain string → Portable Text blocks (used by the seed script). */
export function plainToPortableText(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      // Sanity requires a unique `_key` on every array item (Studio editing).
      _key: `pt-${index}`,
      _type: "block",
      style: "normal",
      children: [{ _key: `pt-${index}-s0`, _type: "span", text: paragraph, marks: [] as string[] }],
    }));
}

interface SanityImage {
  asset?: { _ref?: string; url?: string };
  hotspot?: unknown;
  alt?: string;
}

export interface SanityProductDoc {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  name?: string;
  slug?: { current?: string };
  shortDescription?: string;
  description?: unknown;
  price?: number;
  originalPrice?: number;
  sku?: string;
  categorySlug?: string;
  collectionSlug?: string;
  subcategory?: string;
  tags?: string[];
  sizes?: string[];
  colors?: { name?: string; hex?: string }[];
  stock?: number;
  availability?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  specifications?: { label?: string; value?: string }[];
  materials?: string;
  careInstructions?: string[];
  shippingInfo?: string;
  returnPolicy?: string;
  sizeGuide?: { label?: string; measurements?: string }[];
  modelInfo?: string;
  rating?: number;
  reviewCount?: number;
  images?: SanityImage[];
  gallery?: SanityImage[];
  seo?: { seoTitle?: string; metaDescription?: string };
}

/**
 * Map a Sanity product document to the app's Product type so every existing
 * component keeps working unchanged.
 */
export function mapSanityProduct(doc: SanityProductDoc): Product {
  const hasSale =
    typeof doc.originalPrice === "number" && typeof doc.price === "number" && doc.originalPrice > doc.price;

  const mainImages = (doc.images ?? [])
    .map((img) => imageToUrl(img, 800))
    .filter((url): url is string => Boolean(url));
  const galleryImages = (doc.gallery ?? [])
    .map((img) => imageToUrl(img, 800))
    .filter((url): url is string => Boolean(url));

  return {
    id: doc._id,
    name: doc.name || "Untitled product",
    slug: doc.slug?.current || doc._id,
    description: portableTextToPlain(doc.description),
    shortDescription: doc.shortDescription || "",
    images: [...mainImages, ...galleryImages],
    price: hasSale ? doc.originalPrice! : doc.price || 0,
    salePrice: hasSale ? doc.price : undefined,
    sku: doc.sku || "",
    category: doc.categorySlug || "uncategorized",
    collection: doc.collectionSlug || "",
    tags: doc.tags ?? [],
    colors: (doc.colors ?? [])
      .filter((c): c is { name: string; hex: string } => Boolean(c?.name && c?.hex))
      .map((c) => ({ name: c.name, hex: c.hex })),
    sizes: doc.sizes ?? [],
    stock: doc.availability === "out-of-stock" ? 0 : doc.stock ?? 0,
    specifications: (doc.specifications ?? [])
      .filter((s): s is { label: string; value: string } => Boolean(s?.label && s?.value))
      .map((s) => ({ label: s.label, value: s.value })),
    materials: doc.materials,
    careInstructions: doc.careInstructions,
    shippingInfo: doc.shippingInfo,
    returnPolicy: doc.returnPolicy,
    sizeGuide: (doc.sizeGuide ?? [])
      .filter((s): s is { label: string; measurements: string } => Boolean(s?.label && s?.measurements))
      .map((s) => ({ label: s.label, measurements: s.measurements })),
    modelInfo: doc.modelInfo,
    rating: doc.rating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    featured: doc.featured ?? false,
    newArrival: doc.newArrival ?? false,
    bestSeller: doc.bestSeller ?? false,
  };
}

export function mapSanityCategory(doc: {
  _id: string;
  name?: string;
  slug?: { current?: string };
  description?: string;
  image?: SanityImage;
  productCount?: number;
}): Category {
  return {
    id: doc._id,
    name: doc.name || "Category",
    slug: doc.slug?.current || doc._id,
    image: imageToUrl(doc.image, 600) || "",
    description: doc.description || "",
    count: doc.productCount ?? 0,
  };
}

export function mapSanityCollection(doc: {
  _id: string;
  name?: string;
  slug?: { current?: string };
  description?: string;
  image?: SanityImage;
}): Collection {
  return {
    id: doc._id,
    name: doc.name || "Collection",
    slug: doc.slug?.current || doc._id,
    image: imageToUrl(doc.image, 800) || "",
    description: doc.description || "",
    productCount: 0,
  };
}
