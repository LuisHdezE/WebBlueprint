# B1 — Storefront Shell Foundation

## Scope

Creates the first public Storefront foundation as a separate visual and routing lane from the admin blueprint.

## Included

- Dedicated `/store` route.
- Dedicated `StorefrontShell`.
- Provider-driven Storefront DTO/contract/data.
- Storefront home placeholder.
- Commercial header with:
  - Store identity.
  - Search input.
  - Primary navigation.
  - Category navigation.
  - Account, favorites and cart actions.
  - Mobile menu.
- Commercial footer with support and grouped links.
- Browser QA for desktop and mobile.
- View registry entry for `storefront.shell`.
- Adapter and architecture tests.

## Explicitly not included

This increment does not add:

- Product listing.
- Product detail.
- Cart behavior.
- Checkout.
- Authentication gate.
- Payment integration.
- Mercado Pago.
- WhatsApp API integration.
- Backend/persistence/localStorage.
- Reuse of the legacy Ecommerce demo.

## Shell separation

The storefront intentionally does not use:

- `TemplateShell`.
- `TemplateSidebar`.
- `TemplateTopbar`.
- `PublicShell`.
- Admin dashboard layout.

The purpose is to create a public commercial lane with its own grammar before product catalog work begins.

## Route

```txt
/store
```

## Files

- `src/features/storefront/application/storefront.dto.ts`
- `src/features/storefront/application/storefront.contracts.ts`
- `src/features/storefront/infrastructure/storefront.view.json`
- `src/features/storefront/infrastructure/JsonStorefrontProvider.ts`
- `src/features/storefront/presentation/StorefrontHomePage.tsx`
- `src/shell/StorefrontShell.tsx`
- `qa/browser/storefront-shell.browser-qa.mjs`

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
- Commercial header navigation renders.
- Search inputs render.
- Footer support links render.
- Admin sidebar is absent.
- Public blueprint header copy is absent.
- Desktop and mobile avoid horizontal overflow.

## Follow-up

Next planned increment:

`B2 · Storefront Catalog Home Sections`

Expected focus:

- Add public product/category sections using provider-driven demo data.
- Start public catalog DTOs without using legacy Ecommerce demo.
- Keep product list/detail/cart/checkout for later increments.
