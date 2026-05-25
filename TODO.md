# Rewaya Books — Master TODO

Complete checklist for the Wix headless bookstore. Work **top to bottom** within each phase.

| | |
|---|---|
| **Context** | Existing Wix site · products already in Stores catalog |
| **Stack** | Next.js 16 · Wix SDK (Stores, CMS, Ecom, Members) · shadcn (mauve) · nuqs · t3-env |
| **Status** | `[ ]` todo · `[~]` in progress · `[x]` done |

---

## Progress overview

| Phase | Focus | Done |
|-------|--------|:----:|
| 0 | Foundation, env, structure, catalog audit | [ ] |
| 1 | Wix CMS collections (bundles + homepage) | [ ] |
| 2 | Data layer (`lib/wix` split + queries) | [ ] |
| 3 | Search UX | [ ] |
| 3B | Product detail page (PDP) | [ ] |
| 3C | Shop + collection pages | [ ] |
| 4 | Bundles + Google Ads landing page | [ ] |
| 5 | Cart (Wix-backed) | [ ] |
| 6 | Auth (Wix Members) | [ ] |
| 7 | Checkout | [ ] |
| 8 | Account (orders, profile, settings) | [ ] |
| 9 | Homepage dynamic blocks | [ ] |
| 11 | Site essentials (footer, policies, etc.) | [ ] |
| 10 | Production hardening + launch QA | [ ] |

---

## How to use this file

1. Finish **Phase 0** completely before CMS work.
2. **Phases 1 → 2** unlock all catalog/CMS features.
3. **Phases 3 → 3C → 4** = discovery (search, PDP, shop, bundles).
4. **Phases 5 → 7** = purchase flow (cart → checkout).
5. **Phases 6 → 8** = logged-in experience (can parallelize after Phase 5).
6. **Phases 9 + 11** = marketing surface + trust pages.
7. **Phase 10** = last — SEO, errors, analytics, full QA.

**Bundle cart rule:** CMS defines bundle books → `addBundleToCart` adds **each catalog line** to Wix cart (optional `couponCode` at checkout). No duplicate products in CMS.

---

## Codebase structure (follow while building)

```
src/
├── app/
│   ├── layout.tsx, page.tsx
│   ├── (store)/          search, shop, product, bundles, cart, checkout
│   ├── (marketing)/      bundles/offer — Google Ads LP
│   ├── (auth)/           login + callback
│   ├── (account)/        profile, orders, favorites
│   └── (site)/           about, contact, policies, faq
├── features/             cart · products · bundles · search · home · account
│   └── <domain>/actions/ components/ context/ index.ts
├── components/ui/        shadcn only
├── components/layout/    navbar, footer, breadcrumb, grid
├── lib/wix/              client, stores, ecom, cms, members, orders, search
├── env/server.ts         t3-env
└── lib/search-params.ts  nuqs
```

| Rule | |
|------|--|
| Thin `app/` pages | Fetch + metadata + compose `<Feature />` |
| Logic in `features/` | Server actions colocated per domain |
| No god file | Split `lib/wix/index.ts` in Phase 2 |
| RSC first | `'use client'` only for cart, search, variant picker |

- [ ] Add `docs/ARCHITECTURE.md` summarizing the above (Phase 0)

---

# Phase 0 — Foundation

> **Done when:** `pnpm build` validates env · `/shop` shows your products · nuqs works · architecture doc exists

## 0.1 — T3 Env

- [x] `pnpm add @t3-oss/env-nextjs zod`
- [ ] Create `src/env/server.ts`:
  - [x] `WIX_CLIENT_ID` — `z.string().min(1)`
  - [x] `SITE_URL` — `z.string().url().default("http://localhost:3000")`
  - [x] `NODE_ENV` — `z.enum(["development","production","test"])`
  - [x] `experimental__runtimeEnv: process.env`
  - [ ] `skipValidation: !!process.env.SKIP_ENV_VALIDATION`
- [x] Top of `next.config.ts`: `import "./src/env/server"`
- [ ] Create `.env.example` (see plan; never commit `.env.local`)
- [x] Replace `process.env.WIX_CLIENT_ID` in `src/proxy.ts` → `import { env } from "@/env/server"`
- [x] Same in `src/lib/wix/index.ts` (until Phase 2 split)
- [ ] `src/lib/utils.ts`: `baseUrl` = `env.SITE_URL` (full URL, no `https://` prefix hack)
- [ ] Delete `validateEnvironmentVariables()` from `src/lib/utils.ts`

## 0.2 — Connect existing Wix site

- [x] Wix dashboard → your **existing** Rewaya site → Headless / OAuth app
- [x] Copy Client ID → `.env.local` as `WIX_CLIENT_ID`
- [x] Allowed redirect domains: `http://localhost:3000`, production `SITE_URL`
- [ ] Register paths: `/login/callback`, `/checkout/success`
- [ ] Confirm **Stores**, **Members**, **Checkout** are active
- [ ] Update `README.md`: setup, env vars, `pnpm dev` / `pnpm build`

## 0.3 — App infrastructure

- [x] `pnpm add nuqs`
- [x] Wrap root layout with `NuqsAdapter`
- [ ] Create `src/lib/search-params.ts` — parsers: `q`, `sort`, `collection`, `type`, `inStock`
- [x] Fix `.cursorrules` / docs: auth = **Wix Members** (not better-auth)

## 0.4 — Catalog audit (existing products)

- [ ] `pnpm dev` → open `/shop` → **your** products appear
- [ ] Record 2–3 real product **slugs** for PDP testing
- [ ] Record 2–3 **collection** handles for `/shop/[handle]`
- [ ] Confirm product images load (`static.wixstatic.com`)
- [ ] Note: variants? sale prices? out-of-stock behavior?
- [ ] Map collections → future homepage blocks (notes in README)

## 0.5 — Scaffold structure (no feature code yet)

- [ ] `docs/ARCHITECTURE.md`
- [x] Folders + `index.ts`: `src/features/search`, `bundles`, `home`, `account`
- [ ] `src/features/cart/index.ts` (export existing cart public API)
- [ ] `src/features/products/index.ts`
- [ ] `src/types/` (empty or README stub)
- [ ] `src/lib/wix/cms-ids.ts` (placeholder constants)

---

# Phase 1 — Wix CMS (on existing site)

> **Done when:** Sample `BookBundles` entry references real products · collection IDs in `cms-ids.ts`

## 1.1 — Create CMS collections (Wix dashboard)

- [ ] **BookBundles** (primary)
- [ ] **HomepageBlocks**
- [ ] **FeaturedDeals**
- [ ] **CuratedLists**
- [ ] (Optional) **Policies** — shipping, returns, privacy
- [ ] Grant Headless OAuth app **read** permission on all

## 1.2 — BookBundles fields

| Field | Type | Required |
|-------|------|:--------:|
| title | Text | ✓ |
| slug | Text (unique) | ✓ |
| tagline | Text | |
| description | Rich text | ✓ |
| coverImage | Image | ✓ |
| products | Multi-ref → **Stores/Products** | ✓ |
| offerStartsAt | Date/time | ✓ |
| offerEndsAt | Date/time | ✓ |
| isPublished | Boolean | ✓ |
| sortOrder | Number | |
| featuredOnHome | Boolean | |
| discountLabel | Text | |
| couponCode | Text | |
| seoTitle, seoDescription | Text | |
| bundleSku | Text | |
| faq | Rich text | optional |
| landingPageEnabled | Boolean | optional |
| adsHeadline, adsSubheadline, adsCtaLabel | Text | optional (Google Ads) |

## 1.3 — HomepageBlocks fields

- [ ] `blockKey` — current_deals \| children \| today_deals \| bundles \| recommended \| new_arrivals \| best_sellers
- [ ] `title`, `subtitle`, `isEnabled`, `sortOrder`, `maxItems`

## 1.4 — FeaturedDeals fields

- [ ] `title`, `productRefs`, `startsAt`, `endsAt`, `badgeLabel`, `priority`

## 1.5 — CuratedLists fields

- [ ] `listKey`, `title`, `productRefs`, `collectionSlug` (optional)

## 1.6 — Seed content

- [ ] 1 published bundle → pick **existing** books from catalog
- [ ] 2–3 HomepageBlocks rows enabled
- [ ] 1 FeaturedDeal (optional)
- [ ] Copy exact collection IDs into `src/lib/wix/cms-ids.ts`

---

# Phase 2 — Data layer

> **Done when:** `getBookBundleBySlug("…")` returns bundle + hydrated product cards on server

## 2.1 — Split `lib/wix`

- [ ] `client.ts` — `getWixClient()`, session cookie read
- [ ] `stores.ts` — products, collections, reshape helpers
- [ ] `ecom.ts` — cart, checkout, recommendations
- [ ] `cms.ts` — all `@wix/data` queries
- [ ] `members.ts` — `getCurrentMember`, auth helpers
- [ ] `orders.ts` — stub for Phase 8
- [ ] `search.ts` — product + bundle search queries
- [ ] `types.ts` — `BookBundle`, `HomepageBlock`, `FeaturedDeal`, `CuratedList`
- [ ] `index.ts` — re-export public API (backward compatible imports)
- [ ] Remove / shrink old monolithic `index.ts`

## 2.2 — CMS queries

- [ ] `getBookBundles({ activeOnly?, featuredOnly? })` — filter published + date window
- [ ] `getBookBundleBySlug(slug)`
- [ ] `getHomepageBlocks()` — enabled, sorted
- [ ] `getFeaturedDeals()` — active window
- [ ] `getCuratedList(listKey)`
- [ ] `expandProductRefs(ids)` → full `Product[]` from Stores

## 2.3 — Caching

- [ ] Tag cached fetches: `products`, `bundles`, `homepage`
- [ ] Document revalidation approach (manual / webhook later)

## 2.4 — Structure

- [ ] (Optional) Move `src/proxy.ts` → `src/lib/wix/session.ts`

---

# Phase 3 — Search

> **Done when:** Cmd+K + navbar search → suggestions → `/search?q=…` with filters in URL

## 3.1 — Routes & data

- [ ] `src/app/(store)/search/page.tsx`
- [ ] `features/search/actions/search-suggestions.ts`
- [ ] `lib/wix/search.ts` — `searchProducts`, `searchBundles`, `searchAll`
- [ ] Widen product query: name + description + tags (not name-only)

## 3.2 — UI (`features/search/`)

- [ ] `search-combobox.tsx` — navbar, 300ms debounce
- [ ] `search-command-dialog.tsx` — Cmd+K / Ctrl+K
- [ ] `search-results-header.tsx` — count, query highlight, filter chips
- [ ] `search-filters-sidebar.tsx` — desktop
- [ ] `search-filters-sheet.tsx` — mobile
- [ ] `search-empty-state.tsx`
- [ ] `recent-searches.tsx` — localStorage, max 5
- [ ] `features/search/index.ts`

## 3.3 — Integration

- [ ] Replace `components/layout/navbar/search.tsx` with combobox + command trigger
- [ ] Mobile: search icon → full-height `Sheet`
- [ ] Refactor `/shop` — remove search-first behavior; link search to `/search`
- [ ] a11y: listbox roles, arrow keys, Escape

---

# Phase 3B — Product detail page (PDP)

> **Done when:** `/product/{real-slug}` works end-to-end with add-to-cart UI (wired in Phase 5)

## 3B.1 — Route

- [ ] `src/app/(store)/product/[handle]/page.tsx`
- [ ] `loading.tsx`, `not-found.tsx`
- [ ] `generateMetadata` + canonical URL
- [ ] JSON-LD `Product` schema

## 3B.2 — UI (`features/products/`)

- [ ] `product-gallery.tsx` — main + thumbnails, `next/image`
- [ ] `variant-selector.tsx` — option chips, updates price/image
- [ ] `quantity-field.tsx`
- [ ] `add-to-cart-button.tsx` — stub action until Phase 5
- [ ] `buy-now-button.tsx` — stub until Phase 7
- [ ] `product-tabs.tsx` — description (sanitized HTML), details, shipping
- [ ] `related-products.tsx` — carousel from `getProductRecommendations`
- [ ] `share-button.tsx`
- [ ] `components/layout/site-breadcrumb.tsx` — use on PDP
- [ ] `features/products/index.ts`

## 3B.3 — Wiring

- [ ] All product cards link to `/product/[handle]`
- [ ] Out-of-stock disables ATC
- [ ] Sale / compare-at price if present in Wix data

---

# Phase 3C — Shop & collections

> **Done when:** Navbar category → `/shop/{handle}` shows filtered products

- [ ] `src/app/(store)/shop/page.tsx` — browse all, nuqs filters (no `q`)
- [ ] `src/app/(store)/shop/[handle]/page.tsx` — collection hero + grid
- [ ] `categories-navigations.tsx` → `/shop/[handle]`
- [ ] Pagination or “Load more” if catalog > 50 items
- [ ] Reuse shared product card from `features/products/`

---

# Phase 4 — Bundles

> **Done when:** Bundle PDP adds all books to cart · Ads LP converts on mobile

## 4.1 — Listing & detail

- [ ] `src/app/(store)/bundles/page.tsx`
- [ ] `src/app/(store)/bundles/[slug]/page.tsx`
- [ ] `features/bundles/bundle-card.tsx`
- [ ] `features/bundles/bundle-hero.tsx`
- [ ] `features/bundles/bundle-included-products.tsx` — links to PDPs
- [ ] `features/bundles/bundle-offer-countdown.tsx`
- [ ] `features/bundles/add-bundle-button.tsx`
- [ ] `features/bundles/actions/add-bundle-to-cart.ts` — validate dates + published
- [ ] `features/bundles/index.ts`
- [ ] Expired / unpublished bundle → read-only state
- [ ] SEO + JSON-LD on BDP
- [ ] Related bundles section

## 4.2 — Google Ads marketing page

- [ ] `src/app/(marketing)/layout.tsx` — minimal chrome (logo + CTA)
- [ ] `src/app/(marketing)/bundles/offer/page.tsx` — default campaign LP
- [ ] (Optional) `bundles/offer/[slug]/page.tsx` — per ad group
- [ ] `features/bundles/bundle-landing-page.tsx` — hero, headline, subhead from CMS `ads*`
- [ ] Included books row (3–6 covers) + savings line
- [ ] Countdown to `offerEndsAt`
- [ ] Primary CTA → add bundle or `/bundles/[slug]`
- [ ] Secondary CTA → `/bundles`
- [ ] nuqs: capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
- [ ] `noindex` + `canonical` strategy documented (avoid duplicate SEO with BDP)
- [ ] RSC-first, optimized images (mobile LCP)
- [ ] GTM / gtag placeholder events: `view_promotion`, `add_to_cart`
- [ ] Google Ads final URL = production `/bundles/offer?...`

---

# Phase 5 — Cart

> **Done when:** Refresh keeps cart · qty changes persist in Wix

- [ ] `features/cart/actions/add-to-cart.ts`
- [ ] `features/cart/actions/update-cart-item.ts`
- [ ] `features/cart/actions/remove-from-cart.ts`
- [ ] Wire `cart-context.tsx` — optimistic UI + `revalidatePath` / refresh
- [ ] `src/app/(store)/cart/page.tsx` — lines, qty, subtotal, empty state, checkout CTA
- [ ] Fix `reshapeCart` — real checkout flow URL (not `"/cart-checkout"`)
- [ ] Cart drawer → link “View cart” to `/cart`
- [ ] Bundle cart lines grouped or labeled “Bundle: {title}”
- [ ] Toast on add/remove (`components/ui/toast`)
- [ ] `features/cart/index.ts` exports actions

---

# Phase 6 — Auth (Wix Members)

> **Done when:** Login → callback → navbar shows name · cart still works

- [ ] `features/account/actions/login.ts` — `generateOAuthData` + `getAuthUrl`
- [ ] `src/app/(auth)/login/page.tsx` — CTA triggers login action
- [ ] `src/app/(auth)/login/callback/page.tsx` — `getMemberTokens`, save cookie
- [ ] `src/app/(account)/layout.tsx` — guard: redirect guests to `/login`
- [ ] `lib/wix/members.ts` — `getCurrentMember()`
- [ ] Navbar: Sign in / avatar + logout
- [ ] `proxy.ts`: never replace member tokens with new visitor tokens
- [ ] `features/account/index.ts`

---

# Phase 7 — Checkout

> **Done when:** Test purchase completes · lands on `/checkout/success`

- [ ] `features/cart/actions/start-checkout.ts`
- [ ] `createCheckoutFromCurrentCart` — `channelType: OTHER_PLATFORM`
- [ ] `sessions.syncWithWixPages()` before first `createRedirectSession`
- [ ] `createRedirectSession` — `postFlowUrl: ${env.SITE_URL}/checkout/success`
- [ ] `src/app/(store)/checkout/success/page.tsx`
- [ ] Cart page + PDP “Buy now” call `startCheckout`
- [ ] Handle checkout errors with toast + retry

---

# Phase 8 — Account

> **Done when:** Member sees orders list + detail · can open address/payment on Wix

- [ ] `lib/wix/orders.ts` — list + get by id (member-scoped)
- [ ] `src/app/(account)/profile/page.tsx` — name, email
- [ ] `src/app/(account)/profile/orders/page.tsx`
- [ ] `src/app/(account)/profile/orders/[id]/page.tsx`
- [ ] Redirect actions: manage addresses (Wix hosted)
- [ ] Redirect actions: payment methods (Wix hosted)
- [ ] `features/account/components/order-card.tsx`, `order-detail.tsx`

---

# Phase 9 — Homepage

> **Done when:** `/` renders 7 CMS-driven sections; disable block in CMS → hidden on site

- [ ] `features/home/current-deals-section.tsx` ← FeaturedDeals
- [ ] `features/home/children-section.tsx` ← CuratedLists or collection
- [ ] `features/home/today-deals-section.tsx`
- [ ] `features/home/bundles-section.tsx` ← BookBundles `featuredOnHome`
- [ ] `features/home/recommended-section.tsx` ← recommendations API
- [ ] `features/home/new-arrivals-section.tsx` ← newest products
- [ ] `features/home/best-sellers-section.tsx` ← collection or CuratedLists
- [ ] `features/home/index.ts`
- [ ] `src/app/page.tsx` — load `HomepageBlocks`, render in `sortOrder`
- [ ] Shared `product-carousel.tsx` in `features/products/` or `components/layout/`

---

# Phase 11 — eCommerce essentials

> **Done when:** New shopper can find help, policies, and navigate entire store

## 11.1 — Layout

- [ ] `components/layout/site-footer.tsx` — shop, bundles, search, policies, contact
- [ ] Add footer to root `layout.tsx`
- [ ] `site-breadcrumb.tsx` on PDP, BDP, collection, cart
- [ ] Mobile nav audit (cart badge, search, account)

## 11.2 — Info pages (`(site)/`)

- [ ] `/about`
- [ ] `/contact` — form or mailto + store info
- [ ] `/faq` — bundles, shipping, orders
- [ ] `/policies/shipping`
- [ ] `/policies/returns`
- [ ] `/policies/privacy`

## 11.3 — Favorites

- [ ] `features/account/favorite-button.tsx` on product + bundle cards
- [ ] `src/app/(account)/favorites/page.tsx` — wired list (member or cookie V1)
- [ ] Empty favorites state

## 11.4 — Shared product card

- [ ] `features/products/product-card.tsx` — image, title, price, badge, stock, link, favorite
- [ ] Use in: home, shop, search, collection, bundles

## 11.5 — Errors & discovery

- [ ] `src/app/not-found.tsx` — search + top categories
- [ ] `loading.tsx` on store routes: product, bundles, search, shop

---

# Phase 10 — Production & launch

> **Done when:** All items in **Launch gate** below are checked

## 10.1 — SEO & crawling

- [ ] `src/app/sitemap.ts` — products, bundles, collections, key pages
- [ ] `src/app/robots.ts`
- [ ] Metadata audit: product, bundle, collection, search, LP
- [ ] Open Graph images on PDP + BDP

## 10.2 — Resilience

- [ ] `error.tsx` in `(store)`, `(account)`, `(marketing)`
- [ ] No secrets in client bundle (WIX_CLIENT_ID server-only)
- [ ] `SKIP_ENV_VALIDATION` documented for CI

## 10.3 — Analytics

- [ ] Events: `search`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (success page)
- [ ] Bundle LP: `view_promotion`, CTA click
- [ ] UTM params logged or passed to analytics

## 10.4 — i18n & RTL

- [ ] CTA / empty-state strings via `lib/i18n` keys
- [ ] RTL layout check on search, cart, PDP

## 10.5 — Full QA path

- [ ] Visitor: browse → search → PDP → add to cart
- [ ] Visitor: bundle BDP → add bundle → cart shows N lines
- [ ] Guest checkout → success page
- [ ] Register/login → cart persists
- [ ] Member: orders page shows new order
- [ ] Google Ads LP → CTA → checkout (mobile)
- [ ] 404, empty search, empty cart, out-of-stock PDP
- [ ] `pnpm build` clean · `pnpm lint` clean

---

# Launch gate (final checklist)

Copy this when you think you’re done — every box must be `[x]`:

- [ ] Phase 0 — env + catalog on `/shop`
- [ ] Phase 1 — CMS bundle + homepage content live
- [ ] Phase 2 — data layer split and tested
- [ ] Phase 3 — search UX
- [ ] Phase 3B — product PDP
- [ ] Phase 3C — shop + collections
- [ ] Phase 4 — bundle BDP + Ads LP
- [ ] Phase 5 — real Wix cart
- [ ] Phase 6 — login / logout
- [ ] Phase 7 — checkout + success
- [ ] Phase 8 — orders in profile
- [ ] Phase 9 — homepage blocks
- [ ] Phase 11 — footer, policies, favorites, shared card
- [ ] Phase 10 — sitemap, errors, analytics, QA

---

# Google Ads — quick reference

| Item | Value |
|------|--------|
| Default LP URL | `{SITE_URL}/bundles/offer?utm_source=google&utm_medium=cpc&utm_campaign={name}` |
| Per-bundle LP | `{SITE_URL}/bundles/offer/{slug}?...` |
| Conversion page | `/checkout/success` |
| Speed target | Mobile LCP < 2.5s on LP |
| Indexing | Prefer `noindex` on LP if canonical → BDP |

- [ ] Campaign doc with final URLs + UTM template saved for marketing team

---

# Reference links

| Resource | URL |
|----------|-----|
| Wix Headless | https://dev.wix.com/docs/go-headless |
| T3 Env | https://env.t3.gg/docs/nextjs |
| nuqs | https://nuqs.47ng.com/ |
| Wix commerce template | https://github.com/wix/headless-templates/tree/main/nextjs/commerce |
| Detailed plan | `.cursor/plans/rewaya_phased_roadmap_f433386b.plan.md` |

---

*Last updated: project planning session — check off items as you ship.*
