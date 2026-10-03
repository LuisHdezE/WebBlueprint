# B6 · Storefront Checkout/Auth Gate Skeleton

## Baseline

- Repository: `LuisHdezE/WebBlueprint`
- Base: `main@28ea2f48416f3a7646ad242863cff2aba541dc17`
- Branch: `feat/storefront-checkout-auth-gate`
- Previous increment: B5 · Storefront Cart Shell
- Public route introduced: `/store/checkout`

## Goal

Introduce the first checkout shell for the dedicated Storefront lane while keeping the flow explicitly non-transactional.

B6 establishes the visual boundary for:

1. mandatory customer authentication/registration,
2. purchase summary,
3. shipping/zone information,
4. future payment methods,
5. explicit guards against order creation, inventory mutation and client-side persistence.

## Included

- `StorefrontCheckoutViewDto`
- `StorefrontProvider.getCheckoutView()`
- deterministic JSON-backed checkout data
- `StorefrontCheckoutPage`
- route `/store/checkout`
- cart-to-checkout preview navigation
- visual authentication/registration gate
- demo shipping section
- payment placeholders:
  - Mercado Pago
  - card
  - WhatsApp-assisted purchase
- order summary demo
- disabled confirmation action
- provider tests
- architecture tests
- Browser QA on desktop and mobile
- production deep-link smoke

## Explicitly excluded

B6 does **not** implement:

- real authentication
- customer registration
- session creation
- backend checkout
- order creation
- payment processing
- Mercado Pago SDK/API
- card processing
- WhatsApp API
- shipping-zone calculation
- address persistence
- cart mutation
- inventory reservation
- inventory decrement
- sales/accounting mutation
- `localStorage`
- `sessionStorage`
- coupling to legacy Ecommerce

## Guardrails

The checkout UI must visibly communicate that:

- authentication or registration is required before a real purchase,
- shipping cost remains pending until zone logic exists,
- all payment methods are placeholders,
- no order is created,
- no inventory is mutated,
- no checkout/customer data is persisted.

## QA contract

Browser QA must verify:

- `/store/checkout` responds successfully,
- checkout renders inside `StorefrontShell`,
- authentication/registration requirement is visible,
- shipping placeholder is visible,
- Mercado Pago/card/WhatsApp placeholders are visible,
- confirmation remains disabled,
- no-order and no-persistence guardrails are visible,
- admin sidebar and blueprint public branding do not leak into Storefront,
- desktop and mobile avoid horizontal overflow,
- cart exposes one navigation path to the checkout preview.

## Next increment

After B6 is merged and deployed, the next block should remain incremental. Candidate:

**B7 · Storefront Customer Identity Skeleton**

Expected boundary:

- dedicated Storefront sign-in/register visual flow,
- customer identity DTOs/provider boundary,
- no real auth/token/session yet,
- return-to-checkout path,
- keep admin authentication separate.
