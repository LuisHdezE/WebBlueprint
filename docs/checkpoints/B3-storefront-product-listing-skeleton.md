# B3 — Storefront Product Listing Skeleton

## Scope

Adds the first public product listing route for the Storefront lane.

## Included

- Dedicated `/store/products` route.
- Product listing page inside `StorefrontShell`.
- Provider-driven listing DTOs and JSON data.
- Visual filter sidebar for:
  - Search.
  - Category.
  - Brand/model.
  - Condition.
  - Price demo.
- Visual sort selector.
- Public product grid with 6 demo cards.
- Replacement-cost labels where applicable.
- Listing notice clarifying non-transactional scope.
- Empty-state placeholder for future functional filters.
- Browser QA for desktop and mobile.
- View registry entry for `storefront.product-listing`.
- Production deep-link smoke for `/store/products`.

## Explicitly not included

This increment does not add:

- Functional filtering.
- Functional sorting.
- Product detail implementation.
- Add-to-cart behavior.
- Cart persistence.
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
/store/products
```

## Files

Modified:

- `src/app/router/AppRouter.tsx`
- `src/features/storefront/application/storefront.dto.ts`
- `src/features/storefront/application/storefront.contracts.ts`
- `src/features/storefront/infrastructure/JsonStorefrontProvider.ts`
- `src/features/storefront/infrastructure/storefront.view.json`
- `src/features/storefront/infrastructure/storefront.adapters.test.ts`
- `src/features/storefront/storefront.architecture.test.ts`
- `qa/view-registry.json`
- `.github/workflows/deploy-eliasworks.yml`

Added:

- `src/features/storefront/presentation/StorefrontProductListingPage.tsx`
- `qa/browser/storefront-products.browser-qa.mjs`
- `docs/checkpoints/B3-storefront-product-listing-skeleton.md`

## Data boundary

All B3 listing content is stored in:

```txt
src/features/storefront/infrastructure/storefront.view.json
```

The presentation reads it only through:

```txt
JsonStorefrontProvider -> StorefrontProvider -> StorefrontProductListingPage
```

## Commercial behavior

B3 is a listing skeleton only:

- Filter controls render visually.
- Sort control renders visually.
- Product cards navigate to future detail routes.
- Product cards do not add to cart.
- Product cards do not create orders.
- No inventory is mutated.
- No user authentication is triggered.

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

The Storefront product listing browser scenario validates:

- `/store/products` deep link responds.
- Listing renders inside StorefrontShell.
- Hero and listing notice render.
- 4 visual filter groups render.
- Search and sort controls render.
- 6 demo product cards render.
- Replacement-cost labels render.
- No add-to-cart behavior exists yet.
- Admin sidebar remains absent.
- Public blueprint header copy remains absent.
- Desktop and mobile avoid horizontal overflow.

## Follow-up

Next planned increment:

`B4 · Storefront Product Detail Skeleton`

Expected focus:

- Add product detail route skeleton.
- Show product image placeholder, price, compatibility, stock, and cost labels.
- Keep cart, checkout, auth and payments for later increments.
