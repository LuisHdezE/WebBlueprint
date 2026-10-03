# B7 · Storefront Customer Identity Skeleton

## Baseline

- Repository: `LuisHdezE/WebBlueprint`
- Base: `main@85869e4ee65a2441e6658b42db6059d3cf5c8b8c`
- Branch: `feat/storefront-customer-identity`
- Previous increment: B6 · Storefront Checkout/Auth Gate Skeleton

## Goal

Introduce a customer-facing identity skeleton dedicated to Storefront and keep it separated from the existing administrative authentication lane.

## Routes

- `/store/account` → redirects to customer sign-in
- `/store/account/sign-in`
- `/store/account/register`

## Included

- `StorefrontCustomerIdentityViewDto`
- customer identity provider boundary
- JSON-backed sign-in/register demo content
- reusable `StorefrontCustomerIdentityPage`
- separate sign-in and register modes
- return-to-checkout navigation
- checkout auth gate now links to customer identity routes
- provider tests
- architecture tests
- Browser QA desktop/mobile
- production deep-link smoke

## Explicitly excluded

- no real authentication
- no account creation
- no password validation
- no session
- no token
- no backend
- no localStorage
- no sessionStorage
- no customer persistence
- no admin authentication reuse
- no order creation
- no payment processing
- no inventory mutation

## Architectural guardrail

The Storefront customer identity lane must remain separate from:

- `authentication/sign-in`
- `authentication/sign-up`
- `SignInPage`
- `SignUpPage`
- admin/user account settings

The Storefront page consumes only `StorefrontProvider` and Storefront DTOs.

## QA contract

Browser QA verifies:

- sign-in and register deep links respond
- both render inside `StorefrontShell`
- sign-in has 2 disabled visual fields
- register has 4 disabled visual fields
- submit actions remain disabled
- cross-navigation between sign-in/register works
- return to checkout exists
- no-persistence guardrail is visible
- no admin sidebar leaks
- desktop/mobile avoid horizontal overflow

## Next increment

Candidate:

**B8 · Storefront Shipping Zone Skeleton**

Expected boundary:

- shipping-zone selection model
- demo zone catalog
- deterministic demo shipping amounts
- no real address persistence
- no carrier integration
- no order mutation
