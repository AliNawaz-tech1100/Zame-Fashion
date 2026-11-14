/**
 * Repair: add the missing `_key` property to every object item inside arrays
 * (product images, colors, specifications, size guide rows, Portable Text
 * blocks/spans, order items, …).
 *
 * Sanity Studio requires a unique `_key` on each array item; documents written
 * directly through the API can omit it, which makes Studio show a
 * "Missing keys" warning and disables drag-and-drop editing for that field.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> npx tsx scripts/fix-array-keys.ts [--dry-run]
 *
 * Safe to re-run: only documents that actually miss keys are patched.
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { randomBytes } from "crypto";
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
const dryRun = process.argv.includes("--dry-run");

if (!token) {
  console.error("✗ SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) is required.");
  process.exit(1);
}

const SYSTEM_FIELDS = new Set(["_id", "_type", "_rev", "_createdAt", "_updatedAt", "_consistency", "_version"]);

type WalkResult = { value: unknown; changed: boolean };

/** Recursively ensure every object inside an array has a unique `_key`. */
function ensureKeys(value: unknown): WalkResult {
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((entry) => {
      if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        let obj = entry as Record<string, unknown>;
        let entryChanged = false;
        if (typeof obj._key !== "string" || !obj._key) {
          obj = { ...obj, _key: randomBytes(8).toString("hex") };
          entryChanged = true;
        }
        const walked = ensureKeys(obj);
        if (walked.changed) entryChanged = true;
        if (entryChanged) changed = true;
        return walked.value;
      }
      // Arrays of primitives (tags, sizes) need no keys.
      return entry;
    });
    return { value: next, changed };
  }

  if (value && typeof value === "object") {
    let changed = false;
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const walked = ensureKeys(child);
      if (walked.changed) changed = true;
      out[key] = walked.value;
    }
    return { value: out, changed };
  }

  return { value, changed: false };
}

async function repairDataset(dataset: string, types: string[]) {
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
  let docs: Array<Record<string, unknown>> = [];
  try {
    docs = await client.fetch(`*[_type in $types]`, { types });
  } catch (error) {
    console.warn(`✗ ${dataset}: could not read documents — ${error instanceof Error ? error.message : error}`);
    return { checked: 0, patched: 0, keysAdded: 0 };
  }

  let patched = 0;
  let keysAdded = 0;

  for (const doc of docs) {
    const patch: Record<string, unknown> = {};
    let docKeys = 0;

    for (const [field, raw] of Object.entries(doc)) {
      if (SYSTEM_FIELDS.has(field)) continue;
      const walked = ensureKeys(raw);
      if (walked.changed) {
        patch[field] = walked.value;
        docKeys += countKeys(walked.value) - countKeys(raw);
      }
    }

    if (Object.keys(patch).length === 0) continue;

    const label = `${doc._type} ${String(doc._id)}`;
    if (dryRun) {
      console.log(`  ~ ${label}: would add ${docKeys} key(s)`);
    } else {
      try {
        await client.patch(String(doc._id)).set(patch).commit();
        console.log(`  ✓ ${label}: added ${docKeys} key(s)`);
      } catch (error) {
        console.warn(`  ! ${label}: patch failed — ${error instanceof Error ? error.message : error}`);
        continue;
      }
    }
    patched += 1;
    keysAdded += docKeys;
  }

  return { checked: docs.length, patched, keysAdded };
}

/** Count `_key` properties in a value (for reporting only). */
function countKeys(value: unknown): number {
  if (Array.isArray(value)) return value.reduce((n, v) => n + countKeys(v), 0);
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce(
      (n, [k, v]) => n + (k === "_key" ? 1 : 0) + countKeys(v),
      0
    );
  }
  return 0;
}

async function main() {
  console.log(`Fixing missing array keys in project ${projectId}${dryRun ? " (DRY RUN)" : ""}\n`);

  const targets = [
    { dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", types: ["product", "category", "collection"] },
    { dataset: process.env.SANITY_ORDERS_DATASET || "orders", types: ["order"] },
  ];

  let totalPatched = 0;
  let totalKeys = 0;
  for (const target of targets) {
    console.log(`Dataset "${target.dataset}":`);
    const result = await repairDataset(target.dataset, target.types);
    console.log(`  checked ${result.checked}, patched ${result.patched}, keys added ${result.keysAdded}\n`);
    totalPatched += result.patched;
    totalKeys += result.keysAdded;
  }

  console.log(`✓ Done. ${totalPatched} document(s) patched, ${totalKeys} key(s) added.`);
  if (dryRun) console.log("  (dry run — nothing was written)");
}

main().catch((error) => {
  console.error("✗ Repair failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
