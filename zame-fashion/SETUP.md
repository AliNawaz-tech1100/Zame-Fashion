# ZAMÉ Fashion — Sanity CMS, COD Checkout & Admin Setup Guide

This guide covers the integration: Sanity CMS product management, Cash-on-Delivery-only
checkout with server-validated orders, email order notifications, and the secured admin
order dashboard.

**Projects**

| Project | Path | Purpose |
|---|---|---|
| Storefront (Next.js 14) | `zame-fashion/` | The store, checkout, admin dashboard, API routes |
| Sanity Studio | `studio-zame-fashion/` | Standalone CMS (two workspaces: Store + Orders) |

**Sanity project:** `95981i5a` · **Datasets:** `production` (public catalog) + `orders` (private, customer PII)

---

## 1. What was implemented

### Products from Sanity CMS
- Studio schemas: `product`, `category`, `collection`, `order`.
- Storefront pages (home, shop, product detail, sitemap) fetch live data from Sanity with
  ISR (`revalidate: 60`) plus tag-based revalidation via webhook.
- Existing design preserved — Sanity data is mapped onto the existing `Product` type, so all
  Tailwind styling, components and responsive behavior are unchanged.
- `data/products.ts` remains only as the source for the seed script (marketing copy stays static).
- Homepage sections hide themselves automatically when a Sanity collection/category is empty.

### Cash-on-Delivery-only checkout
- Card / Easypaisa / JazzCash options and the mock payment service were removed.
- Checkout is a 2-step flow: cart review → delivery details (COD only).

### Server-validated, idempotent orders (never trust the client)
- `POST /api/orders` re-fetches every product from Sanity and recomputes **all** prices,
  discounts and delivery server-side. Tampered client prices are ignored.
- Validates: Pakistani mobile numbers, address length, required size/color selections,
  stock availability, quantity caps.
- Delivery: **free over PKR 2,000, otherwise PKR 250** (`lib/pricing.ts`).
- Stock is decremented atomically in the same transaction that creates the order.
- Idempotency: the checkout page generates a UUID per session; the order document ID is
  `order-<uuid>`. Re-submitting the same session returns the existing order instead of
  creating a duplicate.
- Rate limiting: 10 order attempts/minute/IP (in-memory, `lib/rate-limit.ts`).
- Orders are stored in the **private** `orders` dataset. Anonymous queries return empty results.

### Email order notifications (SMTP — no third-party SaaS)
- Sent **only after** the order is saved, from the server, using `SMTP_HOST` / `SMTP_USER` /
  `SMTP_PASS` / `ORDER_NOTIFICATION_EMAIL`. Credentials never reach the browser.
- Works with any SMTP mailbox (hosting/cPanel, Gmail App Password, Zoho…). 10s timeout.
- If email fails, the order stays saved; the failure is recorded on the order document and
  can be retried from the admin dashboard.
- **Leave the SMTP variables empty to disable email alerts** — orders still save normally.
- The confirmation page never falsely claims delivery:
  - sent → "Our team has been notified about your order via email."
  - failed → "Your order is saved. We had trouble sending an instant team notification…"
  - skipped (not configured) → "Your order has been recorded. Our team will be in touch if needed."

### Admin dashboard (`/admin`)
- Env-var credentials (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) — no new
  auth packages. Session = HMAC-signed, HTTP-only, 12h cookie (constant-time comparisons).
- Lists orders with status / date-range / text filters; detail page shows items, customer,
  totals; actions to change order + payment status and retry the email notification.
- Unauthenticated requests are redirected to `/admin/login/`; forged cookies leak zero data.
- Admin routes are excluded from indexing.

---

## 2. Where orders live (and how to see them in the Studio)

Orders are saved in the main `production` dataset so they appear in the standard Sanity
Content workspace and in the storefront admin dashboard.

| Workspace | Dataset | URL (local) | URL (deployed) |
|---|---|---|---|
| Store + Orders | `production` | `http://localhost:3333/storefront` | `https://95981i5a.sanity.studio/storefront` |

> The `/admin/orders` dashboard on the site remains the day-to-day way to manage orders
> (status updates, payment status, notification retry). The Studio "Orders" document type
> is a raw view of the same data in the main production dataset.

If the deployed Studio still does not show your newly created order documents, redeploy it:
```bash
cd studio-zame-fashion && npm run deploy
```

---

## 3. Files added / changed

### Sanity Studio (`studio-zame-fashion/`)
```
schemaTypes/product.ts       product: name, slug, price, originalPrice, stock, sizes, colors,
                             images, category/collection refs, featured/new/bestseller/sale flags
schemaTypes/category.ts      category: name, slug, image
schemaTypes/collection.ts    collection: title, slug, description, image
schemaTypes/order.ts         order: read-only view of placed orders (email notification status)
schemaTypes/index.ts         exports productionTypes + ordersTypes
sanity.config.ts             two workspaces: /storefront (production) + /orders (orders)
```

### Storefront data layer (`zame-fashion/lib/sanity/`)
```
client.ts      Sanity clients: storefront (anon), token-backed, orders (private dataset) + urlFor
queries.ts     GROQ queries for products/categories/collections/orders
mappers.ts     Sanity → app Product/Category/Collection mapping (incl. Portable Text helpers)
products.ts    ISR fetchers (getProducts, getProductBySlug, getRelatedProducts, slugs…)
```

### Order system (`zame-fashion/lib/`)
```
pricing.ts           delivery-charge rules (free ≥ PKR 2,000, else 250)
rate-limit.ts        in-memory sliding-window limiter
orders.server.ts     validation, PK phone rules, placeOrder (idempotent), getOrderByToken
email.server.ts      SMTP order notification (never throws)
admin.server.ts      HMAC session cookie auth (login/logout/requireAdmin)
```

### API routes (`zame-fashion/app/api/`)
```
orders/route.ts                    POST — create order (rate-limited)
admin/login/route.ts               POST login / DELETE logout
admin/logout/route.ts              POST logout
admin/orders/[id]/route.ts         PATCH order/payment status (auth required)
admin/orders/[id]/notify/route.ts  POST retry email notification (auth required)
revalidate/route.ts                POST — CMS webhook cache invalidation (secret header)
```

### Pages & components
```
app/admin/login/page.tsx                     admin login
app/admin/orders/page.tsx                    order list + filters
app/admin/orders/[id]/page.tsx               order detail + actions
app/admin/layout.tsx                         admin top bar (only when authenticated)
app/order-confirmation/[token]/page.tsx      public, tokenized confirmation (honest notify status)
components/admin/OrderActions.tsx            status selects + email retry (client)
components/admin/LogoutButton.tsx
app/sitemap.ts                               products from Sanity
scripts/seed-sanity.ts                       idempotent catalog migration (uploads images)
scripts/fix-array-keys.ts                    repair missing `_key`s on array items (Studio warnings)
```

### Changed
```
app/checkout/page.tsx               COD-only, 2-step, server-validated, idempotency key
app/shop/page.tsx + components/shop/ShopContent.tsx   Sanity-backed, + ?q= search
app/product/[slug]/page.tsx         Sanity-backed SSR/SSG, generateMetadata, notFound()
app/page.tsx + components/sections/*  Featured/NewArrivals/BestSellers/Categories from Sanity
components/layout/Header.tsx        search submits to /shop/?q=
types/index.ts                      OrderStatus, PaymentStatus, CreateOrderInput/Response, OrderDocument
next.config.js                      images.remotePatterns += cdn.sanity.io
tsconfig.json                       target ES2017
.env.example                        complete variable reference (placeholders only)
package.json                        nodemailer + server-only deps
```

### Removed
```
services/payment.ts                 mock payment gateway (COD only now)
app/loading.tsx                     root spinner — streamed the shell before notFound()
                                    resolved, forcing HTTP 200 on missing products (soft-404).
                                    Removing it restores correct 404 status codes.
```

---

## 4. Environment variables

Copy `zame-fashion/.env.example` → `zame-fashion/.env.local` and fill in:

| Variable | Where to get it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | pre-filled `95981i5a` | public |
| `NEXT_PUBLIC_SANITY_DATASET` | pre-filled `production` | public |
| `NEXT_PUBLIC_SANITY_API_VERSION` | pre-filled | public |
| `SANITY_API_READ_TOKEN` | sanity.io/manage → 95981i5a → API → Tokens → **Viewer** | server-only |
| `SANITY_API_WRITE_TOKEN` | same page → **Editor** token | server-only. Needed for stock + order writes. **Never** put in `NEXT_PUBLIC_` vars |
| `SANITY_ORDERS_DATASET` | pre-filled `orders` | private dataset holding customer PII |
| `SMTP_HOST` | your mail provider (e.g. `smtp.gmail.com`) | server-only. Empty = email alerts disabled |
| `SMTP_PORT` | `587` (STARTTLS) or `465` (SSL) | |
| `SMTP_SECURE` | `true` for port 465 | |
| `SMTP_USER` / `SMTP_PASS` | mailbox login / app password | |
| `ORDER_NOTIFICATION_EMAIL` | inbox that should receive new-order alerts | |
| `ORDER_NOTIFICATION_FROM` | optional From address | defaults to `SMTP_USER` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | you choose | long random password |
| `ADMIN_SESSION_SECRET` | `openssl rand -hex 32` | signs the admin cookie |
| `REVALIDATE_SECRET` | you choose (`openssl rand -hex 32`) | CMS webhook secret |
| `NEXT_PUBLIC_SITE_URL` | your deployed origin | used in sitemap + admin links |

> ⚠️ `.env.example` is committed to git — never put real tokens or passwords in it.
> Real values belong in `.env.local` (git-ignored) or your host's env settings.

---

## 5. First-time setup

```bash
# 1. App dependencies
cd zame-fashion && npm install

# 2. Studio dependencies
cd ../studio-zame-fashion && npm install

# 3. Seed the catalog (idempotent, safe to re-run)
cd ../zame-fashion
SANITY_API_WRITE_TOKEN=<your-editor-token> npx tsx scripts/seed-sanity.ts
# dry-run first if you prefer:  ... npx tsx scripts/seed-sanity.ts --dry-run

# 4. (If Studio shows "Missing keys" warnings) repair existing documents
SANITY_API_WRITE_TOKEN=<your-editor-token> npx tsx scripts/fix-array-keys.ts

# 5. Run both dev servers
npm run dev                               # storefront → http://localhost:3000
cd ../studio-zame-fashion && npm run dev  # Studio → http://localhost:3333
```

**Deploy the Studio** so the Orders workspace is available online:
```bash
cd studio-zame-fashion && npm run deploy
# → https://95981i5a.sanity.studio/storefront  and  /orders
```

**Dataset privacy** (verify after any dataset change):
```bash
npx sanity datasets visibility set orders private
npx sanity datasets visibility set production public
```

---

## 6. Optional: instant cache revalidation (Sanity webhook)

Without a webhook, storefront changes appear within 60s (ISR). For instant updates, create a
webhook in sanity.io/manage → Dataset → Webhooks:

- **URL:** `https://<your-domain>/api/revalidate/`
- **Method:** POST
- **Headers:** `x-revalidate-secret: <your REVALIDATE_SECRET>`
- **Trigger:** on create/update/delete of `product`, `category`, `collection`

The endpoint revalidates the `products` + `categories` tags and the `/` and `/shop/` paths.
It returns `503` if `REVALIDATE_SECRET` is unset and `401` on a wrong secret.

---

## 7. Deploying

**Storefront** (Vercel / any Node host):
1. Import the `zame-fashion` folder; framework preset **Next.js**.
2. Set all env vars from §4 in the project settings (server vars as encrypted secrets).
3. Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
4. Deploy. Product pages are SSG'd at build + ISR for new products.

**Studio:** `cd studio-zame-fashion && npm run deploy`

---

## 8. Testing

```bash
cd zame-fashion && npm run lint && npm run build
npm run dev
```

Verified end-to-end (all passing):

| Test | Expected |
|---|---|
| `POST /api/orders` with tampered `unitPrice: 1` | order created at the **real** Sanity price |
| Re-POST same `idempotencyKey` | same order returned, `"duplicate": true`, no double stock decrement |
| Invalid phone / short address / missing required color | `400` + per-field errors, no order created |
| Stock after order | decremented atomically in Sanity |
| 11 rapid POSTs from one IP | `429` on the 11th |
| New order with email configured | order saved, owner receives the email |
| New order with SMTP unset | order saved, notification `skipped` — nothing breaks |
| `/admin/orders/` unauthenticated | redirected to `/admin/login/`, zero order data in HTML |
| Forged/tampered session cookie | rejected, no data leak |
| Login wrong password | `401` "Invalid username or password" |
| `PATCH` invalid status value | `400` "Invalid order status" |
| `/api/revalidate/` wrong secret | `401`; unset secret → `503` |
| `/product/<unknown-slug>/` | proper `404` status + Product Not Found UI |
| `/order-confirmation/<bogus-token>/` | "We could not find an order for this link." |
| `/shop/?q=zzznope` | "No products" empty state |
| Anonymous GROQ query on `orders` dataset | empty result (private) |

Quick manual order test with curl:
```bash
curl -X POST http://localhost:3000/api/orders/ -H 'Content-Type: application/json' -d '{
  "items":[{"productId":"<sanity-id>","slug":"<slug>","name":"<name>","unitPrice":1,"quantity":1,"color":"Blush Pink"}],
  "customer":{"name":"Test User","phone":"03001234567","address":"House 1, Street 4, DHA","city":"Karachi"},
  "idempotencyKey":"12345678-1234-4234-8234-123456789012"
}'
```
(`unitPrice` is ignored on purpose — the server charges the Sanity price.)

---

## 9. Remaining manual configuration

1. **Sanity tokens** — Viewer + Editor token in `.env.local` / host env.
2. **Email notifications (optional)** — set the `SMTP_*` + `ORDER_NOTIFICATION_EMAIL` vars.
   Leave empty to disable alerts; orders still save.
3. **Admin credentials** — `ADMIN_USERNAME` / `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`.
4. **`REVALIDATE_SECRET`** + webhook (§6) — optional but recommended.
5. **`NEXT_PUBLIC_SITE_URL`** — production domain on deploy.
6. **Deploy the Studio** — so the Orders workspace is live (`npm run deploy`).
7. **Review the catalog in Studio** — prices, stock, images and flags seeded from your data.

---

## 10. Security notes

- All order validation, pricing and stock logic runs **server-side**; the browser is never
  trusted for prices or availability.
- All secrets are server-only env vars — nothing sensitive is prefixed `NEXT_PUBLIC_`.
- Customer PII lives in the private `orders` dataset; anonymous queries return empty.
- Admin sessions are HMAC-signed HTTP-only cookies (12h TTL, `sameSite=lax`, `secure` in prod);
  comparisons are constant-time.
- The public confirmation page uses an unguessable per-order token (the idempotency UUID),
  not the Sanity document ID.
- Order API endpoints are rate-limited; error messages are generic to avoid leaking internals.
