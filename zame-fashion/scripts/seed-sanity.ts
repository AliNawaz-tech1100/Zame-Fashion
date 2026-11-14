/**
 * Seed Sanity with the existing Zame Fashion catalog in data/products.ts.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> npx tsx scripts/seed-sanity.ts [--dry-run]
 *
 * - Reads .env.local automatically for NEXT_PUBLIC_SANITY_* / SANITY_API_* vars.
 * - Idempotent: products/categories/collections are matched by slug and
 *   updated in place, so re-running is safe.
 * - Remote (Unsplash) images are downloaded and uploaded to Sanity assets.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient, SanityClient } from "@sanity/client";
import { products, categories as staticCategories, collections as staticCollections } from "../data/products";
import { plainToPortableText } from "../lib/sanity/mappers";

// ─── Minimal .env.local loader (no extra dependency) ───────────────
const envPath = resolve(__dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined && match[2] && !match[2].startsWith("#")) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "95981i5a";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-01";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!token) {
  console.error("✗ SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) is required. See SETUP.md.");
  process.exit(1);
}

const client: SanityClient = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

/** Bump Unsplash image width for better storefront quality. */
function largerImage(url: string): string {
  return url.replace(/([?&])w=\d+/, "$1w=1400");
}

const assetCache = new Map<string, string>();

async function uploadImage(url: string): Promise<string | null> {
  const key = largerImage(url);
  if (assetCache.has(key)) return assetCache.get(key)!;
  if (dryRun) {
    const fakeRef = `image-dryrun-${assetCache.size}`;
    assetCache.set(key, fakeRef);
    return fakeRef;
  }
  try {
    const response = await fetch(key);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const asset = await client.assets.upload("image", buffer, { filename: key.split("/").pop()?.split("?")[0] || "image.jpg", contentType });
    assetCache.set(key, asset._id);
    return asset._id;
  } catch (error) {
    console.warn(`  ! Skipped image ${key}: ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

async function existingByType(type: string): Promise<Map<string, string>> {
  const docs = await client.fetch<Array<{ _id: string; slug?: { current?: string } }>>(
    `*[_type == $type && defined(slug.current)]{ _id, slug }`,
    { type }
  );
  return new Map(docs.filter((d) => d.slug?.current).map((d) => [d.slug!.current!, d._id]));
}

async function main() {
  console.log(`Seeding Sanity project ${projectId}, dataset "${dataset}"${dryRun ? " (DRY RUN)" : ""}\n`);

  // ─── Categories ────────────────────────────────────────────────
  const categoryIds = await existingByType("category");
  for (const cat of staticCategories) {
    const imageId = cat.image ? await uploadImage(cat.image) : null;
    const doc = {
      _type: "category",
      name: cat.name,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
      ...(imageId ? { image: { _type: "image", asset: { _type: "reference", _ref: imageId } } } : {}),
    };
    const existingId = categoryIds.get(cat.slug);
    if (existingId) {
      if (!dryRun) await client.patch(existingId).set(doc).commit();
      console.log(`  ↻ category: ${cat.name}`);
    } else {
      if (!dryRun) await client.create(doc);
      console.log(`  + category: ${cat.name}`);
      categoryIds.set(cat.slug, "pending");
    }
  }

  // ─── Collections ───────────────────────────────────────────────
  const collectionIds = await existingByType("collection");
  const collectionDocs = staticCollections.filter((col) => products.some((p) => p.collection === col.slug));
  // Also cover collection slugs that only exist on products (e.g. "stars").
  const knownSlugs = new Set(collectionDocs.map((c) => c.slug));
  for (const slug of new Set(products.map((p) => p.collection).filter(Boolean))) {
    if (!knownSlugs.has(slug)) {
      collectionDocs.push({
        id: `col-${slug}`,
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        slug,
        image: "",
        description: "",
        productCount: 0,
      });
    }
  }
  for (const col of collectionDocs) {
    const imageId = col.image ? await uploadImage(col.image) : null;
    const doc = {
      _type: "collection",
      name: col.name,
      slug: { _type: "slug", current: col.slug },
      description: col.description,
      ...(imageId ? { image: { _type: "image", asset: { _type: "reference", _ref: imageId } } } : {}),
    };
    const existingId = collectionIds.get(col.slug);
    if (existingId) {
      if (!dryRun) await client.patch(existingId).set(doc).commit();
      console.log(`  ↻ collection: ${col.name}`);
    } else {
      if (!dryRun) await client.create(doc);
      console.log(`  + collection: ${col.name}`);
      collectionIds.set(col.slug, "pending");
    }
  }

  // Re-read ids created above (handles the "pending" placeholders).
  const freshCategoryIds = dryRun ? categoryIds : await existingByType("category");
  const freshCollectionIds = dryRun ? collectionIds : await existingByType("collection");

  // ─── Products ──────────────────────────────────────────────────
  const productIds = await existingByType("product");
  let created = 0;
  let updated = 0;

  for (const p of products) {
    const imageRefs: Array<{ _key: string; _type: "image"; asset: { _type: "reference"; _ref: string } }> = [];
    for (const [imageIndex, url] of p.images.entries()) {
      const ref = await uploadImage(url);
      if (ref) imageRefs.push({ _key: `img-${imageIndex}`, _type: "image", asset: { _type: "reference", _ref: ref } });
    }

    const categoryId = freshCategoryIds.get(p.category);
    if (!categoryId) {
      console.warn(`  ! Product "${p.name}" references missing category "${p.category}" — skipping category link.`);
    }
    const collectionId = p.collection ? freshCollectionIds.get(p.collection) : undefined;

    const doc = {
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      shortDescription: p.shortDescription,
      description: plainToPortableText(p.description),
      images: imageRefs,
      price: p.salePrice ?? p.price,
      ...(p.salePrice ? { originalPrice: p.price } : {}),
      sku: p.sku,
      ...(categoryId ? { category: { _type: "reference", _ref: categoryId } } : {}),
      ...(collectionId ? { collection: { _type: "reference", _ref: collectionId } } : {}),
      tags: p.tags,
      sizes: p.sizes ?? [],
      colors: (p.colors ?? []).map((c, i) => ({ _key: `color-${i}`, _type: "color" as const, name: c.name, hex: c.hex })),
      stock: p.stock,
      availability: "available",
      featured: p.featured,
      newArrival: p.newArrival,
      bestSeller: p.bestSeller,
      specifications: (p.specifications ?? []).map((s, i) => ({ _key: `spec-${i}`, _type: "spec" as const, label: s.label, value: s.value })),
      ...(p.materials ? { materials: p.materials } : {}),
      careInstructions: p.careInstructions ?? [],
      ...(p.shippingInfo ? { shippingInfo: p.shippingInfo } : {}),
      ...(p.returnPolicy ? { returnPolicy: p.returnPolicy } : {}),
      sizeGuide: (p.sizeGuide ?? []).map((s, i) => ({ _key: `row-${i}`, _type: "row" as const, label: s.label, measurements: s.measurements })),
      ...(p.modelInfo ? { modelInfo: p.modelInfo } : {}),
      rating: p.rating,
      reviewCount: p.reviewCount,
      seo: { seoTitle: `${p.name} | ZAMÉ Fashion`, metaDescription: p.shortDescription.slice(0, 160) },
    };

    const existingId = productIds.get(p.slug);
    if (existingId) {
      if (!dryRun) await client.patch(existingId).set(doc).commit();
      console.log(`  ↻ product: ${p.name}`);
      updated += 1;
    } else {
      if (!dryRun) await client.create(doc);
      console.log(`  + product: ${p.name}`);
      created += 1;
    }
  }

  console.log(`\n✓ Done. ${created} created, ${updated} updated, ${products.length} total products.`);
  if (dryRun) console.log("  (dry run — nothing was written)");
  console.log("  Products are published immediately; storefront pages refresh within ~60s or via /api/revalidate.");
}

main().catch((error) => {
  console.error("✗ Seed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
