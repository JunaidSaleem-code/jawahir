### E2E Test Suite Overview

This document outlines the end-to-end (E2E) tests currently implemented, what user journeys they cover, and how to run and extend them.

### Quick start

```bash
npm install
npx playwright install
npm run test:e2e
```

- To run a single test file:
```bash
npx playwright test tests/e2e/cart.spec.ts
```

### Environment and config

- Admin routes use Basic Auth. Set env vars if you plan to test admin flows manually:
```bash
set ADMIN_USER=admin
set ADMIN_PASS=admin
```
- Images are loaded from `images.pexels.com` via Next.js `next/image` remote config.
- Playwright config: `playwright.config.ts` (expect timeout 8s, 1 retry, not fully parallel to reduce flakiness).

### Test files and coverage

1) `tests/e2e/smoke.spec.ts`
- Purpose: Basic navigation smoke checks
- Flows:
  - Home renders with hero; header navigation to Shop
  - Product card Quick View opens and is visible
- Key selectors: header nav links by role, product card quick view button by role

2) `tests/e2e/cart.spec.ts`
- Purpose: Add to cart from Quick View and verify cart state
- Flows:
  - Go to Shop → open first product Quick View → Add to Cart
  - Open mini-cart from header, verify subtotal, then go to Cart page
  - Verify totals are visible on Cart page
- Key selectors: `getByRole('button', { name: /Quick View/i })`, dialog `getByRole('button', { name: /Add to Cart/i })`, header `[data-testid="cart-button"]`, cart link `View Cart & Checkout`

3) `tests/e2e/reviews.spec.ts`
- Purpose: Submit a product review (auto-approve on) and verify it appears on PDP
- Flows:
  - Navigate to a product detail page
  - Open Reviews tab, fill form (rating, title, body), submit
  - Verify newly submitted review becomes visible
- Key selectors: Reviews tab text, `[data-testid="review-title"]`, `[data-testid="review-text"]`
- Notes: Waits for summary to hydrate and scrolls into view; may retry once on Chromium.

4) `tests/e2e/orders.spec.ts`
- Purpose: Admin orders drawer open and status update
- Flows:
  - Navigate to `/admin/orders` (Basic Auth)
  - Click an order ID to open the drawer
  - Change status (e.g., Shipped) and click Update, then Close
- Key selectors: order link by text, drawer container `[data-testid="order-drawer"]`
- Notes: Drawer animation timing can cause flakiness on Chromium. We now wait for the drawer to attach and the "Order Details" heading to be visible before assertions.

5) `tests/e2e/wishlist.spec.ts`
- Purpose: Deterministic wishlist rendering from persisted state
- Flows:
  - Seed `gg-wishlist` in `localStorage` before navigation
  - Visit `/wishlist` and assert items via `data-testid` selectors
- Key selectors: `[data-testid="wishlist-item"]`, `[data-testid="wishlist-empty"]`
 
6) `tests/e2e/search.spec.ts`
- Purpose: Verify search filters results on `/search`
- Flows:
  - Go to Search → type query → expect matching results visible, non-matching not visible
- Key selectors: search input placeholder, product titles

7) `tests/e2e/account.spec.ts`
- Purpose: Account form reflects/persists values via localStorage
- Flows:
  - Seed `gg-account` with initScript before navigation, then assert inputs reflect values immediately
- Key selectors: `[data-testid="account-name"]`, `[data-testid="account-email"]`

8) `tests/e2e/ar-tryon.spec.ts` (Planned)
- Purpose: AR try-on functionality and jewelry selection
- Flows:
  - Navigate to `/ar-tryon` page
  - Verify camera activation button and initial state
  - Test jewelry selection from different categories (earrings, rings, necklaces)
  - Verify jewelry overlay appears when selected
  - Test manual controls (drag, resize, rotate) if available
  - Test snapshot capture and WhatsApp sharing functionality
- Key selectors: `[data-testid="camera-toggle"]`, `[data-testid="jewelry-item"]`, `[data-testid="jewelry-overlay"]`, `[data-testid="capture-button"]`
- Notes: Requires camera permissions; may need to mock camera access for CI/CD

### Feature coverage matrix

| Area | Covered By |
| --- | --- |
| Home navigation | smoke.spec |
| Product card quick view | smoke.spec |
| Add to cart (quick view) | cart.spec |
| Mini-cart and cart page | cart.spec |
| Reviews submit + display | reviews.spec |
| Admin orders drawer + status | orders.spec |
| Wishlist toggle + page | wishlist.spec |
| Checkout session (Stripe redirect) | checkout.spec |
| AR try-on camera activation | ar-tryon.spec (planned) |
| AR jewelry selection | ar-tryon.spec (planned) |
| AR jewelry overlay | ar-tryon.spec (planned) |

### Data-test attributes used

- `[data-testid="cart-button"]` in header for opening the mini-cart
- `[data-testid="order-drawer"]` in admin orders for the drawer container
- New: Checkout uses network interception and navigation assertion to `https://checkout.stripe.com`.

### Running tips

- Headed mode for debugging:
```bash
npx playwright test --headed --debug
```
- Single project/browsers:
```bash
npx playwright test --project=chromium
```

### Troubleshooting flakiness

- Ensure the app is built and linking correctly; dynamic UI elements (drawers, dialogs, toasts) may require short waits tied to visibility rather than explicit timeouts. We use role/text-based visibility checks and `data-testid` anchors.
- If admin tests fail with 401, verify `ADMIN_USER` and `ADMIN_PASS` env vars match your middleware expectations.
- On CI or slower machines, consider increasing `expect` timeout and enabling `retries` in `playwright.config.ts`.

### Adding new tests

### Latest run status

- Runtime: ~1m 15s on local (Chromium + WebKit)
- First pass: 16/18 green; 2 retried and passed (both Reviews)
- Stabilizations since last run:
  - Dev server auto-start via Playwright `webServer` config
  - Wishlist: switched to deterministic seeding and `data-testid` assertions
  - Reviews: assert on `[data-testid="review-title"]`/`review-text` instead of summary; retried once on Chromium
  - Orders drawer: attach + heading waits with `data-testid` anchors
  - Account: initScript seeds `gg-account`; inputs assert immediately
  - Checkout: add-to-cart via Quick View, mini-cart navigation to cart, intercept `/api/checkout`, assert blocked navigation to Stripe

- Remaining flake to monitor:
  - Reviews: Form fields visibility can lag after tab click; we scroll and wait on fields. Retries resolve.

- Place new specs under `tests/e2e/*`.
- Prefer robust selectors: roles, labels, `data-testid` where appropriate.
- Model tests after the existing files for structure and reliability.

    