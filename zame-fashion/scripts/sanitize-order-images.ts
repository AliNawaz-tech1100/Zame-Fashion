/**
 * Repair: replace malformed order item images (bare Sanity asset refs like
 * `4c17734c4041acd9b380f80959e034ecf13eba6c`) with an empty string so
 * Sanity Studio stops crashing when rendering order documents.
 *
 * A real image URL starts with http(s)://. A bare 32+ character hex hash is
 * not a valid Sanity asset reference (which looks like
 * `image-<id>-<dims>-<ext>`), so it is discarded.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> npx tsx scripts/sanitize-order-images.ts [--dry-run]
 *
 * Safe to re-run: only documents that actually contain a malformed image are
 * patched.
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@sanity/client";

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
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-01";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
const dataset = process.env.SANITY_ORDERS_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const dryRun = process.argv.includes("--dry-run");

if (!token) {
  console.error("✗ SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) is required.");
  process.exit(1);
}

/** A malformed asset ref: a bare 32+ character hex hash. */
const MALFORMED_REF = /^[a-f0-9]{32,}$/i;

/** True when the value is a usable image URL. */
function isValidImage(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

/** Sanitize one order document's items[].image fields. */
function sanitizeOrder(doc: Record<string, unknown>): { patch: Record<string, unknown>; count: number } | null {
  const items = doc.items;
  if (!Array.isArray(items)) return null;

  const patch: Record<string, unknown> = { ...doc };
  let changed = false;
  let count = 0;

  const nextItems = items.map((item, index) => {
    if (!item || typeof item !== "object") return item;
    const obj = item as Record<string, unknown>;
    const image = obj.image;
    if (isValidImage(image)) return obj;
    if (MALFORMED_REF.test(String(image ?? ""))) {
      changed = true;
      count += 1;
      return { ...obj, image: "" };
    }
    return obj;
  });

  if (!changed) return null;
  patch.items = nextItems;
  return { patch, count };
}

async function main() {
  console.log(`Sanitizing order images in project ${projectId}, dataset "${dataset}"${dryRun ? " (DRY RUN)" : ""}\n`);

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "published" });

  let docs: Array<Record<string, unknown>>;
  try {
    docs = await client.fetch<Record<string, unknown>[]>(`*[_type == "order"]{ _id, items { _key, image } }`);
  } catch (error) {
    console.error(`✗ could not read orders — ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  let patched = 0;
  let fixed = 0;

  for (const doc of docs) {
    const result = sanitizeOrder(doc);
    if (!result) continue;

    const label = `order ${String(doc._id)}`;
    if (dryRun) {
      console.log(`  ~ ${label}: would fix ${result.count} image(s)`);
    } else {
      try {
        await client.patch(String(doc._id)).set(result.patch).commit();
        console.log(`  ✓ ${label}: fixed ${result.count} image(s)`);
      } catch (error) {
        console.warn(`  ! ${label}: patch failed — ${error instanceof Error ? error.message : error}`);
        continue;
      }
    }
    patched += 1;
    fixed += result.count;
  }

  console.log(`\n✓ Done. ${patched} document(s) patched, ${fixed} image(s) sanitized.`);
  if (dryRun) console.log("  (dry run — nothing was written)");
}

main().catch((error) => {
  console.error("✗ Sanitize failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
