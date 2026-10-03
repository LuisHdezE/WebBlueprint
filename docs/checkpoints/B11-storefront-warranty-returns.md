# B11 · Storefront Warranty / Returns Skeleton

## Baseline

- Repository: `LuisHdezE/WebBlueprint`
- Base: `main@d1e9c1a5057fd1477a4a0a53cd748411b60d0bdd`
- Branch: `feat/storefront-warranty-returns`
- Previous increment: B10 · Storefront Contact / WhatsApp Landing Skeleton

## Goal

Add a dedicated public warranty and returns view so customers can understand demo coverage, exclusions, eligibility requirements and next steps without creating real support or return operations.

## Route

- `/store/warranty`

## Included

- `StorefrontWarrantyPolicyDto`
- `StorefrontWarrantyViewDto`
- `StorefrontProvider.getWarrantyView()`
- provider-backed warranty JSON
- warranty policy card
- returns policy card
- disabled eligibility preview
- support and product links
- **Garantía y devoluciones** entry in Blueprint sidebar
- provider tests
- architecture tests
- Browser QA
- production deep-link smoke
- checkpoint documentation

## Explicitly excluded

- no return request creation
- no warranty claim creation
- no order lookup
- no customer history lookup
- no payment mutation
- no inventory restock
- no refund
- no shipping-label creation
- no backend
- no localStorage
- no sessionStorage

## QA contract

Checks verify:

- `/store/warranty` responds
- page renders inside Storefront shell
- warranty and returns policies render
- eligibility remains disabled/non-transactional
- guardrails for requests, orders and inventory are visible
- sidebar contains the completed route
- production smoke covers the route
- no horizontal overflow

## Next candidate

**B12 · Storefront Catalog Route Completion**

Potential scope:

- complete currently linked public category routes
- `/store/spare-parts`
- `/store/used-phones`
- `/store/brands`
- `/store/categories/:category`
- reuse listing/card primitives
- provider-driven route variants
- no backend filtering yet
