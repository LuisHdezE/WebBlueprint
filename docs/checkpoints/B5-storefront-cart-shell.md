# B5 — Storefront Cart Shell

## Scope

Adds a public cart shell route for the Storefront lane.

## Included

- Dedicated `/store/cart` route.
- Cart page inside `StorefrontShell`.
- Provider-driven cart DTOs and JSON data.
- Cart empty state.
- Visual cart line structure.
- Visual summary panel.
- Disabled checkout placeholder.
- Notices for:
  - no persistence,
  - no checkout,
  - no inventory mutation.
- Browser QA coverage through the registered Storefront product scenario.
- Production deep-link smoke for `/store/cart`.

## Explicitly not included

This increment does not add:

- Functional add-to-cart behavior.
- Cart persistence.
- Quantity mutation.
- Remove item behavior.
- Checkout.
- Authentication gate.
- Mercado Pago.
- Card payment integration.
- WhatsApp API integration.
- Shipping calculation by zone.
- Backend/persistence/localStorage/sessionStorage.
- Inventory stock reservation.
- Inventory stock mutation.
- Order creation.
- Coupling to the legacy Ecommerce demo.

## Route

```txt
/store/cart
```

## Files

Modified:

- `src/app/router/AppRouter.tsx`
- `src/features/storefront/application/storefront.dto.ts`
- `src/features/storefront/application/storefront.contracts.ts`
- `src/features/storefront/infrastructure/JsonStorefrontProvider.ts`
- `src/features/storefront/infrastructure/storefront.adapters.test.ts`
- `src/features/storefront/storefront.architecture.test.ts`
- `qa/browser/storefront-products.browser-qa.mjs`
- `.github/workflows/deploy-eliasworks.yml`

Added:

- `src/features/storefront/infrastructure/storefront.cart.json`
- `src/features/storefront/presentation/StorefrontCartPage.tsx`
- `docs/checkpoints/B5-storefront-cart-shell.md`

## Data boundary

Cart content is stored in:

```txt
src/features/storefront/infrastructure/storefront.cart.json
```

The presentation reads it only through:

```txt
JsonStorefrontProvider -> StorefrontProvider -> StorefrontCartPage
```

## Commercial behavior

B5 is a cart shell only:

- Cart line items are provider demo data.
- Empty state is rendered and reusable.
- Summary is visual only.
- Checkout button is disabled.
- No cart data is persisted.
- No item quantity changes are possible.
- No item removal is possible.
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

The Storefront product Browser QA now validates listing, detail and cart:

- `/store/products` deep link responds.
- `/store/products/iphone-13-display-oled` deep link responds.
- `/store/cart` deep link responds.
- Product listing remains intact.
- Product detail remains intact.
- Cart renders inside StorefrontShell.
- Cart empty state renders.
- Cart demo lines render.
- Cart summary renders.
- Checkout remains disabled.
- Cart announces future registration/checkout flow.
- Admin sidebar remains absent.
- Public blueprint header copy remains absent.
- Desktop and mobile avoid horizontal overflow.

## Follow-up

Next planned increment:

`B6 · Storefront Checkout/Auth Gate Skeleton`

Expected focus:

- Public checkout route skeleton.
- Registration/login requirement notice.
- Shipping zone placeholder.
- Payment method placeholders.
- No real payment or order creation yet.
