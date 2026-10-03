# B2 — Storefront Catalog Home Sections

## Scope

Adds provider-driven commercial catalog sections to the public Storefront home.

## Included

- Featured category section.
- Featured demo product cards.
- Commercial promo band for future cart/auth/checkout flow.
- Storefront DTO expansion for:
  - Category cards.
  - Product cards.
  - Promo band.
- Storefront JSON demo data expansion.
- Home rendering for catalog-ready sections.
- Adapter tests for new section data.
- Architecture tests that guard provider-driven rendering and legacy Ecommerce separation.
- Browser QA assertions for desktop and mobile.

## Explicitly not included

This increment does not add:

- Product listing route.
- Product detail route.
- Functional filters.
- Cart behavior.
- Checkout.
- Authentication gate.
- Mercado Pago.
- Card payment integration.
- WhatsApp API integration.
- Backend/persistence/localStorage.
- Inventory stock mutation.
- Order creation.
- Coupling to the legacy Ecommerce demo.

## Route

```txt
/store
```

## Files

Modified:

- `src/features/storefront/application/storefront.dto.ts`
- `src/features/storefront/infrastructure/storefront.view.json`
- `src/features/storefront/presentation/StorefrontHomePage.tsx`
- `src/features/storefront/infrastructure/storefront.adapters.test.ts`
- `src/features/storefront/storefront.architecture.test.ts`
- `qa/browser/storefront-shell.browser-qa.mjs`

Added:

- `docs/checkpoints/B2-storefront-catalog-home-sections.md`

## Data boundary

All B2 content is stored in:

```txt
src/features/storefront/infrastructure/storefront.view.json
```

The presentation reads it only through:

```txt
JsonStorefrontProvider -> StorefrontProvider -> StorefrontHomePage
```

## Commercial section behavior

B2 introduces visual sections only:

- Category cards navigate to future Storefront routes.
- Product cards navigate to future product detail routes.
- Product cards expose demo pricing labels and replacement cost labels.
- No product card adds to cart.
- No product card creates an order.
- No inventory is mutated.

## QA status

QA status: PASS required before merge.

Required gates:

- Typecheck.
- Lint.
- Unit/adapter tests.
- Architecture tests.
- Automated QA.
- Browser QA.
- Export smoke.
- SPA fallback smoke.

## Browser QA expectations

The Storefront browser scenario validates:

- `/store` deep link responds.
- Storefront shell renders.
- Storefront home renders.
- Category section renders 4 category cards.
- Product section renders 3 demo product cards.
- Product cards expose replacement cost labels.
- Promo band communicates future registration/checkout flow.
- Product cards do not expose add-to-cart behavior yet.
- Admin sidebar remains absent.
- Public blueprint header copy remains absent.
- Desktop and mobile avoid horizontal overflow.

## Follow-up

Next planned increment:

`B3 · Storefront Product Listing Skeleton`

Expected focus:

- Add `/store/products` skeleton.
- Introduce public catalog listing DTOs.
- Add search/filter UI placeholders.
- Keep cart, checkout, auth and payments for later increments.
