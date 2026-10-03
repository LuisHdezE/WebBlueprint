# B4 — Storefront Product Detail Skeleton

## Scope

Adds a public product detail skeleton route for the Storefront lane.

## Included

- Dedicated `/store/products/:slug` route.
- Product detail page inside `StorefrontShell`.
- Provider-driven product detail DTOs and JSON data.
- Slug-based lookup through `StorefrontProvider`.
- Public product detail layout with:
  - gallery placeholders,
  - price,
  - replacement cost label where applicable,
  - stock demo,
  - compatibility,
  - condition,
  - warranty label,
  - specs,
  - notices.
- Controlled not-found state for unknown product slugs.
- Disabled cart placeholder.
- Consultation link placeholder.
- Browser QA coverage through the registered Storefront product scenario.
- Production deep-link smoke for `/store/products/iphone-13-display-oled`.

## Explicitly not included

This increment does not add:

- Functional add-to-cart behavior.
- Cart persistence.
- Checkout.
- Authentication gate.
- Mercado Pago.
- Card payment integration.
- WhatsApp API integration.
- Backend/persistence/localStorage.
- Inventory stock mutation.
- Order creation.
- Real product image uploads.
- Coupling to the legacy Ecommerce demo.

## Route

```txt
/store/products/:slug
```

Initial smoke route:

```txt
/store/products/iphone-13-display-oled
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
- `qa/browser/storefront-products.browser-qa.mjs`
- `.github/workflows/deploy-eliasworks.yml`

Added:

- `src/features/storefront/presentation/StorefrontProductDetailPage.tsx`
- `docs/checkpoints/B4-storefront-product-detail-skeleton.md`

## Data boundary

All B4 detail content is stored in:

```txt
src/features/storefront/infrastructure/storefront.view.json
```

The presentation reads it only through:

```txt
JsonStorefrontProvider -> StorefrontProvider -> StorefrontProductDetailPage
```

## Commercial behavior

B4 is a detail skeleton only:

- Product detail is resolved by slug.
- Product detail shows commercial info and demo labels.
- Consultation action links to a future public contact route.
- Cart action is disabled and marked as pending.
- No order is created.
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

The Storefront product Browser QA validates both listing and detail:

- `/store/products` deep link responds.
- `/store/products/iphone-13-display-oled` deep link responds.
- Product listing remains intact.
- Product detail renders inside StorefrontShell.
- Detail page renders title, price, stock and compatibility.
- Replacement-cost label renders where applicable.
- Future transaction notice renders.
- Add-to-cart behavior is not active.
- Admin sidebar remains absent.
- Public blueprint header copy remains absent.
- Desktop and mobile avoid horizontal overflow.

## Follow-up

Next planned increment:

`B5 · Storefront Cart Shell`

Expected focus:

- Public cart route skeleton.
- Cart empty state.
- Cart line item visual structure.
- No persistence or payment yet.
