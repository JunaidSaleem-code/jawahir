# GlamGallery Ecommerce – Technical Overview

## 1) Introduction
GlamGallery is a modern ecommerce web application built on Next.js (App Router). It offers a premium product browsing experience with AR preview hooks, a performant cart, a reviews and ratings system, and a modular admin CMS. This document explains the tech stack, architecture, data flows, configuration, and operational guidance to help developers quickly understand and extend the project.

## 2) Tech Stack
- Framework: Next.js 15 App Router (React 18) – SSR/SSG/ISR capable
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS (+ shadcn/ui primitives), custom theme tokens
- Animations: Framer Motion
- State management: Zustand (cart, reviews, wishlist, admin settings, account)
- Icons: lucide-react
- Charts: Recharts (via `components/ui/chart.tsx` helpers)
- Images: `next/image` (with remote images allowed for Pexels)
- AR/Computer Vision: MediaPipe (Face Mesh, Hands), react-webcam
- Tooling: ESLint, TSConfig path alias (`@/*`)
- Optional DB/Admin (prepared): Prisma schema; AdminJS plan; middleware-based auth

## 3) Repository & Folder Structure
- `app/`: Route segments and pages (App Router)
  - `page.tsx`: Landing page (hero, grids, feature sections)
  - `shop/`: Product listing (search/filters/sort with URL state)
  - `product/[id]/`: Product detail page (PDP)
  - `cart/`, `wishlist/`, `account/`, `search/`: User flows
  - `ar-tryon/`: AR try-on experience with camera integration
  - `virtual-preview/`, `preview/`: Preview experiences
  - `admin/`: Admin panel (layout, dashboard, sections, reviews moderation)
  - `legal/`, `support/`, `company/`: Static content placeholders
  - `not-found.tsx`, `error.tsx`: Global error boundaries
  - `loading.tsx`: Page-level skeletons (shop/product)
- `components/`: UI and composite components
  - `ui/`: shadcn-styled primitives (button, input, dialog, drawer, chart, data-table, textarea, etc.)
  - `ProductCard`, `ProductGrid`, `Header`, `Footer`, etc.
  - `ARCamera`, `EnhancedJewelryOverlay`, `JewelrySelector`, `MediaPipeTracker`: AR try-on components
- `features/`: Domain-level barrels to simplify imports
  - `cart/`, `reviews/`, `wishlist/`
- `hooks/`: Client state stores via Zustand
  - `use-ar-store`, `use-toast`, `use-reviews`, `use-wishlist`, `use-account`, `use-admin-settings`
- `lib/`: Utilities, config and data
  - `utils.ts`, `public-config.ts` (env + runtime admin overrides), `types.ts`, `mock-data.ts`
- `docs/`: Documentation for architecture, testing, and project overview
  - `ARCHITECTURE.md`, `PROJECT_OVERVIEW.md` (this file), `TESTS.md` (E2E Test Suite)
- `middleware.ts`: Basic auth for `/admin/*` via env variables
- `prisma/`: Prisma schema for future DB-backed AdminJS (optional)

## 4) Key Features & Modules
### 4.1 Catalog (Shop & PDP)
- Shop (`app/shop/page.tsx`)
  - Filters (categories), price slider, search input, sort, and grid/list view
  - URL state persistence: `?q=&cats=&priceMin=&priceMax=&sort=&view=`
  - View mode persists to `localStorage` as `gg-view`
- ProductCard (`components/ProductCard.tsx`)
  - Hover overlay with Quick View (Dialog), Add to Cart, AR preview hook
  - Prefetch to PDP on hover for snappier nav
  - Displays live rating from reviews store
- PDP (`app/product/[id]/page.tsx`)
  - Image gallery (thumbnails) using `next/image`
  - Variant/size selector, quantity, sticky mobile Add-to-Cart bar
  - Tabs: Description, Details, Shipping, Reviews
  - Reviews tab integrates summary, list (filter/sort), form

### 4.2 Cart
- Provider at the root (`app/layout.tsx`): `CartProvider`
- Features
  - Add items (size-aware), update quantity, remove, clear
  - Mini-cart drawer from Header
  - `localStorage` persistence (`gg-cart`)

### 4.3 Reviews & Ratings
- Store: `hooks/use-reviews.ts` (persisted `gg-reviews`)
  - Review moderation state (`pending/approved/rejected`)
  - Helpfulness voting and product stats computation
  - Duplicate prevention for the same user/product
  - Auto-approve toggle (via admin settings)
- UI
  - `components/Reviews.tsx`: Summary (distribution/avg), List (filter/sort), Form (images)
  - `components/RatingStars.tsx`: display + input
  - Admin: `/admin/reviews` to approve/reject/delete

### 4.4 Wishlist
- Store: `hooks/use-wishlist.ts` (`gg-wishlist`)
- UI: Heart toggle on `ProductCard`, listing at `/wishlist`

### 4.5 Search
- `/search` page: Client-side search over mock data (title/artist/category)
- Renders `ProductCard` results and an empty state

### 4.6 AR Try-On Experience
- **Page**: `/ar-tryon` - Premium AR try-on interface with Cartier-inspired design
- **Camera Integration**: 
  - `react-webcam` with 1280x720 resolution and mirror functionality for selfie-style experience
  - Automatic camera activation with user permission handling
  - Real-time video feed with smooth performance optimization
- **Computer Vision & Tracking**:
  - **MediaPipe Integration**: Face Mesh detection for earrings and necklaces, Hands detection for rings
  - **Dynamic Imports**: Resolves SSR compatibility issues with Next.js
  - **Fallback System**: `SimpleMediaPipeTracker` provides basic functionality when MediaPipe fails
  - **Adaptive Tracking**: `AdaptiveMediaPipeTracker` intelligently switches between full and simple tracking
- **Jewelry Positioning**:
  - **Automatic Placement**: Based on facial landmarks (earlobes for earrings, neck for necklaces) and hand landmarks (fingers for rings)
  - **Manual Controls**: Drag, resize, rotate functionality with visual feedback and real-time updates
  - **Debug Overlay**: Visual debugging tools with position indicators, scale controls, and tracking quality display
- **Jewelry Collection**:
  - **Cartier-Inspired Collections**: Trinity, Love, Juste un Clou, and Panthere collections
  - **High-Quality Images**: Unsplash-sourced jewelry images with proper fallback handling
  - **Category Organization**: Earrings, Rings, and Necklaces with smooth tab navigation
  - **Luxury Pricing**: PKR 45,000 - 250,000 range reflecting premium positioning
- **User Experience**:
  - **Interactive Selection**: Jewelry selector with hover effects and selection feedback
  - **Real-Time Preview**: Live jewelry overlay with smooth animations and transitions
  - **Capture & Share**: Snapshot functionality with WhatsApp integration for product details and pricing
  - **Responsive Design**: Mobile-optimized interface with touch-friendly controls
- **Technical Implementation**:
  - **State Management**: Camera activation, selected jewelry, tracking status, landmark data
  - **Error Handling**: Graceful fallbacks for image loading failures and tracking errors
  - **Performance**: Optimized rendering with proper cleanup and memory management
  - **Accessibility**: Keyboard navigation and screen reader support
- **Design System**:
  - **Color Palette**: Ivory (#FAFAF8), Gold (#C6A664), Burgundy (#7A1E1E) with gradient variations
  - **Typography**: Cormorant Garamond for luxury headings, Inter for body text
  - **Animations**: Framer Motion for smooth transitions and premium feel
  - **UI Components**: Custom Cartier-inspired buttons, cards, and overlays

### 4.7 Account
- Store: `hooks/use-account.ts` (`gg-account`)
- `/account` page: Profile (name/email/phone) and addresses (shipping/billing)

### 4.8 Admin CMS (UI-only demo)
- Layout: `/admin/layout.tsx` with sidebar sections (Dashboard, Products, Categories, Orders, Customers, Inventory, Discounts, Content, Payments, Reports, Settings, Security, Reviews)
- Dashboard: summary cards and a sample chart (`recharts` via helpers)
- Products: DataTable with search/sort, column visibility, pagination, CSV export, Add/Edit dialog (UI demo)
- Categories: Create/list with parent option (UI demo)
- Orders: DataTable with status filter and drawer containing:
  - Summary fields, editable status, tracking input
  - Line items, simple timeline
  - Shipping & billing address textareas
  - Internal notes
- Customers: DataTable with search/sort/pagination/export
- Reviews: Moderation UI wired to reviews store
- Security: Role explanation toggles, CAPTCHA flag, recent activity (UI demo)

### 4.9 Configuration & Runtime Overrides
- Public configuration: `lib/public-config.ts`
  - Defaults read from `NEXT_PUBLIC_*` env
  - `useRuntimePublicConfig()` merges admin UI overrides (`/admin/settings`) via `use-admin-settings` with env
- Admin Settings UI: `/admin/settings`
  - Site name, contact details, social URLs
  - Persisted via `gg-admin-settings`

### 4.10 Payments (Stripe)
- Server route: `/api/checkout` creates a Stripe Checkout Session
- Redirects: `/success` (thank you), `/cancel` (back to cart)
- Webhook skeleton: `/api/webhooks/stripe` (log-only; add verification with `STRIPE_WEBHOOK_SECRET` for prod)
- Env:
  - `STRIPE_SECRET_KEY` (server). Required to create sessions
  - `NEXT_PUBLIC_SITE_URL` (optional). Overrides success/cancel base URL

### 4.11 Security
- Basic Auth for `/admin/*` via middleware
  - Env vars: `ADMIN_USER`, `ADMIN_PASS`
  - If unset, middleware allows access (dev fallback)
- Future: Supabase Auth or other identity provider with RBAC

## 5) Data & State
- In-memory and persisted (Zustand + localStorage): cart, reviews, wishlist, admin settings, account
- Product/catalog is mock data (`lib/mock-data.ts`). Easy to replace with API requests or server actions.
- Prisma schema (`prisma/schema.prisma`) prepared for DB-backed reviews/orders/products if needed. AdminJS recommended for production CMS.

## 6) Flows
### 6.1 User Flows
- Browse → Filter/Sort/Search → PDP → Add to cart → Cart/Checkout (UI) → Admin processes order
- Review flow: Delivered order (future server check) → review form → moderation → publish
- Wishlist: Save from card → view at `/wishlist`
- Account: Update profile/address (local persistence)

### 6.2 Admin Flows
- Login (Basic Auth via browser dialog)
- Dashboard quick links and reports
- Products/Categories CRUD (UI demo). To make real, replace with API routes/DB mutations
- Orders: Manage status, tracking, addresses, notes
- Reviews: Approve/Reject/Delete; auto-approve toggle in Admin Settings
- Settings: Update site/contact/socials (runtime override)

## 7) Performance & UX Practices
- `next/image` for key images (hero, PDP, wishlist)
- Prefetch PDP on card hover
- URL-based filters and persisted view mode
- Skeleton loading for shop/product
- Framer Motion animations with reduced-motion consideration (future enhancement)

## 8) Accessibility
- aria-labels on header icons and mobile CTA
- Keyboard-friendly dialogs/drawers (shadcn/radix primitives)
- Add focus states and `prefers-reduced-motion` adjustments where appropriate

## 9) Analytics (Planned)
- Event hooks for add_to_cart, review_submit, checkout_start
- Integrate with PostHog/Segment/Plausible via a thin adapter

## 10) Environment Variables
Public (safe for client):
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `NEXT_PUBLIC_CONTACT_ADDRESS`
- `NEXT_PUBLIC_SOCIAL_INSTAGRAM`
- `NEXT_PUBLIC_SOCIAL_FACEBOOK`
- `NEXT_PUBLIC_SOCIAL_TWITTER`

Server (private):
- `ADMIN_USER`, `ADMIN_PASS` (Basic Auth for admin)
- Future: Payment keys (Stripe), email service credentials, DB URL

## 11) Local Development
1. Install deps and run
   - `npm i`
   - `npm run dev`
2. Optional admin protection
   - Set `ADMIN_USER` and `ADMIN_PASS` in `.env.local`
3. Configure public defaults (`NEXT_PUBLIC_*`) as needed

## 12) Deployment
- Frontend: Vercel (recommended) or any Node hosting
- Prepare env vars on host/provider
- Incrementally adopt server routes/DB as needed

## 13) Making it Production-Ready
- Replace mock data with API endpoints or server actions
- Adopt Prisma + Postgres (Supabase) and AdminJS for a real CMS
- Secure authentication & RBAC (Supabase Auth/Auth.js)
- Move reviews verified-purchase check to the server (order status = Delivered)
- Rate limit review routes (Edge Middleware or Ratelimit package) + CAPTCHA
- Add 100% `next/image` coverage and Lighthouse budget checks
- Add E2E tests (Playwright) and unit tests (Vitest/Jest) for stores and components

## 14) Extending the System
- Search: Transition from client filter to Typesense/Meilisearch/pg_trgm based server search
- Payments: Integrate Stripe (Checkout) + webhooks → update Order status
- Discounts: Attach discount code engine and eligibility rules
- Content: Replace static pages with CMS models (banners, pages, posts)
- Analytics: Dashboards for conversion funnels and cohort analysis

## 15) File Reference Highlights
- Layout & Providers: `app/layout.tsx`
- Header/Footer: `components/Header.tsx`, `components/Footer.tsx`
- Product UI: `components/ProductCard.tsx`, `components/ProductGrid.tsx`
- Reviews: `hooks/use-reviews.ts`, `components/Reviews.tsx`, `components/RatingStars.tsx`
- Cart: `components/CartProvider.tsx` (+ Header mini-cart)
- Wishlist: `hooks/use-wishlist.ts`, `/wishlist`
- Account: `hooks/use-account.ts`, `/account`
- Admin: `app/admin/*`, `components/ui/data-table.tsx`
- Config: `lib/public-config.ts`, `hooks/use-admin-settings.ts`
- Types & Data: `lib/types.ts`, `lib/mock-data.ts`
- Middleware (Admin Auth): `middleware.ts`
- Prisma schema (optional backend): `prisma/schema.prisma`

## 16) Support & Ownership
- Primary modules are deliberately small and discoverable (one file per unit where possible)
- Feature barrels in `features/*` simplify imports and reinforce domain boundaries
- This documentation and `docs/ARCHITECTURE.md` should be kept in sync with changes

## 17) Route Map
Public
- `/` – Landing
- `/shop` – Catalog with filters/sort/search
- `/product/[id]` – PDP with reviews
- `/cart` – Shopping cart
- `/wishlist` – Saved items
- `/search` – Search results
- `/account` – Profile and addresses
- `/ar-tryon` – AR try-on experience with camera
- `/preview`, `/virtual-preview` – Preview experiences
- Static: `/about`, `/contact`, `/support/*`, `/company/*`, `/legal/*`

Admin
- `/admin` – Dashboard
- `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/customers`, `/admin/inventory`, `/admin/discounts`, `/admin/content`, `/admin/payments`, `/admin/reports`, `/admin/settings`, `/admin/security`, `/admin/reviews`

System
- `not-found`, `error`, `loading` files per App Router


## 18) Client State Stores (Zustand)
- Cart (`components/CartProvider.tsx`) – key: `gg-cart`
- Reviews (`hooks/use-reviews.ts`) – key: `gg-reviews`
- Wishlist (`hooks/use-wishlist.ts`) – key: `gg-wishlist`
- Admin Settings (`hooks/use-admin-settings.ts`) – key: `gg-admin-settings`
- Account (`hooks/use-account.ts`) – key: `gg-account`

Notes
- All persisted stores use JSON in `localStorage`
- Safe for client; avoid secrets in client stores


## 19) Component & Feature Catalog
UI Primitives (shadcn-inspired)
- Inputs: `button`, `input`, `textarea`, `select`
- Overlays: `dialog`, `drawer`, `toast`, `alert-dialog`
- Layout/Content: `card`, `tabs`, `accordion`, `data-table`, `chart`

Feature Composites
- ProductCard, ProductGrid, Header (mini-cart trigger), Footer
- Reviews: `ReviewsSummary`, `ReviewsList`, `ReviewForm`, `RatingStars`
- Admin: DataTable-powered lists; Orders drawer


## 20) Coding Standards & Conventions
- TypeScript strict, descriptive names; no 1–2 letter identifiers
- Components: small, focused; lift state up only when shared
- Avoid deep nesting; use guard clauses and early returns
- Comment “why” not “how”; keep comments short
- UI: prefer composition over prop-bloat; reuse primitives
- Imports: use `@/*` alias; group stdlib, vendor, local
- Files: colocate per feature; re-export via `features/*` barrels


## 21) Performance Budget & Optimizations
- Images: `next/image` with `sizes`, avoid layout shift
- Prefetch: PDP route on card hover
- URL state: avoids heavy global state, supports shareable links
- Virtualization (future): long lists (reviews/admin tables)
- Code-splitting: heavy components (AR, charts) behind dynamic imports
- Caching (future): server routes with ISR or edge caching as needed


## 22) Accessibility Checklist
- Labels: `aria-label` on icon buttons (search/cart/wishlist)
- Focus: visible outlines on interactive elements
- Overlays: focus trap in dialogs/drawers (radix)
- Motion: respect `prefers-reduced-motion` (tune framer transitions)
- Semantics: headings are hierarchical; lists use `ul/ol`


## 23) Security Checklist
- Admin protection: Basic Auth via `middleware.ts` (env-based); replace with proper auth
- Inputs: sanitize text (server-side when adding APIs)
- Rate limiting & CAPTCHA for reviews (planned)
- HTTPS-only in production; secure cookies for future sessions
- Secrets never in client; use server envs for payments/auth/email


## 24) Testing Strategy
- Unit: Zustand stores and pure utils (Vitest/Jest)
- Component: key UI (ProductCard, Reviews)
- E2E: Playwright – see `docs/TESTS.md` for current coverage and how to run
- Accessibility: Axe checks in CI (basic rules)


## 25) Deployment & Environments
- Dev: `npm run dev` (Vercel recommended for preview)
- Env vars: set `NEXT_PUBLIC_*` and `ADMIN_USER/ADMIN_PASS` on host
- Images: ensure remotePatterns include external hosts
- Monitoring (future): add Vercel Analytics/Log drains or Sentry


## 26) Near-Term Roadmap
- Replace mock data with server route handlers and a typed API layer
- Supabase Auth (RBAC) for `/admin/*` and user accounts
- Prisma + Postgres (Supabase) for products/orders/reviews
- Review verification against delivered orders; rate limit + CAPTCHA
- Stripe Checkout integration and webhook-driven order status
- AdminJS-backed CMS (or Payload/Strapi) for full content and catalog
- Internationalization (i18n) and currency formatting
- Analytics adapter (PostHog/Segment/Plausible)

## 27) Development Status (Last updated: 2025-01-27)

Implemented
- Catalog: URL-based filters/sort/search, grid/list with localStorage view persistence
- PDP: next/image gallery, size/qty, sticky mobile Add-to-Cart, reviews tab
- Cart: global provider, mini-cart drawer, persistence, header count
- Reviews: store, moderation UI, helpful voting, ratings on cards/PDP
- Wishlist: persisted list and page
- Search: client-side search page rendering ProductCards
- Account: profile and addresses (persisted)
- AR Try-On: Camera integration with MediaPipe tracking, jewelry overlay system, WhatsApp sharing
- Admin: layout + sections, DataTable with search/sort/columns/pagination/export, orders drawer with line items, addresses, notes
- Security: Basic Auth middleware for /admin via env (`ADMIN_USER`, `ADMIN_PASS`)
- Docs: architecture and this overview; feature barrels and centralized types/mock-data

Planned (near-term)
- Swap mock data for API routes/server actions; adopt Prisma + Postgres (Supabase)
- Supabase Auth or Auth.js for admin/user auth with RBAC
- Server-verified reviews (order delivered), rate limiting + CAPTCHA
- Stripe Checkout + webhooks updating order status
- Reusable admin order/customer detail drawers with full audit timeline

Known improvements
- Expand next/image coverage across all images
- Add virtualization for long lists (reviews/admin tables)
- Add E2E (Playwright) and unit tests; add accessibility checks

## 28) Docs Maintenance Checklist
- When routes change: update Route Map (Section 17)
- When state stores change: update Client State Stores (Section 18)
- When UI primitives/features change: update Component & Feature Catalog (Section 19)
- When configs/envs change: update Environment Variables (Section 10) and Configuration (Section 4.8)
- When security/auth changes: update Security (Section 4.9/23) and middleware/auth notes
- When performance work lands: update Performance (Section 21)
- After milestones: update Development Status (Section 27) and Roadmap (Section 26)

## 29) High-level Architecture Diagram

```mermaid
flowchart LR
  A[Next.js Frontend (App Router)] <--> B[API Routes / Server Actions]
  B <--> C[(Database - Postgres via Prisma/Supabase)]
  B <--> D[(Object Storage - Supabase Buckets/CDN)]
  B <--> E[Auth Provider (Supabase Auth/Auth.js)]
  B --> F[Payments (Stripe/Local Gateways)]
  G[Edge/Middleware (RBAC, Rate-limit)] --> A
```

Notes
- Today the app uses client stores and mock data. This diagram reflects the near-term production target.
- Server actions or route handlers will mediate all writes; Zod schemas validate request payloads.

## 30) Production-Readiness Checklist

Documentation & Structure
- [ ] CONTRIBUTING.md with commit style (Conventional Commits), branching, PR rules
- [ ] CHANGELOG.md or auto-generated release notes from commit messages
- [ ] API Contracts documented (OpenAPI) when server routes land

Database & Backend
- [ ] Prisma migrations strategy per env (dev/staging/prod) with `prisma migrate`
- [ ] Seed script for local data (products/categories/reviews)
- [ ] Indexes for search filters (price, category, title)
- [ ] Audit log table to track admin actions (approvals, order updates)

Admin CMS
- [ ] RBAC roles: super-admin, manager, support (route/menu gating)
- [ ] Draft vs published content for products/blogs/banners
- [ ] Bulk actions: approve reviews, update orders
- [ ] Localization and multi-currency ready (PKR default)

Reviews & Trust
- [ ] Verified-buyer enforcement: only after order status = Delivered
- [ ] Photo/video reviews stored in Supabase buckets (with compression)
- [ ] Fraud prevention: rate limiting, IP throttling, CAPTCHA

Performance & Scalability
- [ ] CDN strategy for images (Supabase Storage → CDN)
- [ ] Edge/ISR caching for products/categories with invalidation hooks
- [ ] Virtualization for long lists (reviews/admin tables)
- [ ] Bundle analysis via next-bundle-analyzer; budgets in CI

Security
- [ ] Upgrade auth to Supabase/Auth.js with JWT + refresh tokens
- [ ] Zod validation for all server actions/routes; strict type guards
- [ ] Secrets managed via Vercel/Supabase envs; never exposed to client
- [ ] Monitoring/alerts: Sentry + Supabase logs

Testing & QA
- [ ] Unit tests for utils/stores (target ≥70% coverage)
- [ ] Playwright E2E: Add-to-Cart, Checkout, Review submit, Admin approval
- [ ] Automated Axe accessibility checks in CI
- [ ] Optional visual regression (Percy/Chromatic)

DevOps & Deployment
- [ ] Env isolation: dev, staging, prod
- [ ] Vercel previews connected to Supabase staging DB
- [ ] Nightly DB/storage backups
- [ ] CI/CD (GitHub Actions): lint, type-check, test, build, deploy

Roadmap Enhancements
- [ ] Payments: Stripe + Pakistani gateways (JazzCash/EasyPaisa)
- [ ] Search: Typesense/Meilisearch for relevance ranking
- [ ] Headless commerce adapters (Shopify/Medusa) compatibility layer
- [ ] Mobile App/PWA using the same API

Developer Experience
- [ ] Storybook for primitives and composites
- [ ] Rich mocks/fixtures (`lib/mock-data.ts`) + factories for tests
- [ ] Friendly error boundaries with retry and diagnostics
- [ ] DX scripts: lint, format, type-check, db:reset, seed, test

## 31) CI/CD & Versioning
- Conventional Commits (`feat:`, `fix:`, `chore:`) → auto version bump & changelog
- GitHub Actions pipeline: install → lint → type-check → test → build → deploy
- Preview deployments for PRs; status checks required before merge

## 32) API Contracts (Future Server Routes)
- Document with OpenAPI (YAML) checked into `docs/api.yaml`
- Generate typed clients if needed (or zodios/typebox for runtime validation)
- All mutations require auth + RBAC; reads leverage ISR with cache tags
