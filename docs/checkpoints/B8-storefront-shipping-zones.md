# B8 · Storefront Shipping Zone Skeleton

## Baseline

- Repository: `LuisHdezE/WebBlueprint`
- Base: `main@5fb000fc0aaef086e964231cb1955a81df723a0a`
- Branch: `feat/storefront-shipping-zones`
- Previous increment: B7.7 · Storefront Product Card Density

## Goal

Introduce a dedicated Storefront shipping view with deterministic demo zones and costs, connected to checkout but still fully non-transactional.

## Route

- `/store/shipping`

## Included

- `StorefrontShippingZoneDto`
- `StorefrontShippingViewDto`
- `StorefrontProvider.getShippingView()`
- JSON-backed shipping-zone catalog
- four demo delivery zones with deterministic display prices
- pickup-without-shipping-cost option
- disabled address preview fields
- return-to-checkout action
- checkout link to shipping zones
- Storefront sidebar entry
- provider tests
- architecture tests
- Browser QA
- production deep-link smoke

## Demo zones

- Montevideo · Centro → UYU 180
- Montevideo · Metropolitana → UYU 250
- Canelones · Sur → UYU 320
- Interior del país → UYU 450
- Retiro en tienda → Sin costo

These are UI/demo values only. They are not calculated from a real address and do not mutate a checkout total.

## Explicitly excluded

- no address persistence
- no geocoding
- no postal-code lookup
- no delivery carrier integration
- no shipping API
- no dispatch creation
- no route optimization
- no checkout total mutation
- no order creation
- no inventory mutation
- no localStorage
- no sessionStorage
- no backend

## Sidebar rule

Because B8 introduces a completed Storefront route, `/store/shipping` is added to the **Tienda online** Blueprint sidebar in the same PR.

The existing architecture guardrail continues to require all completed static Storefront routes to be represented in `templateNavigation`.

## QA contract

Automated checks verify:

- provider exposes four deterministic zones
- pickup remains zero-cost
- checkout exposes `/store/shipping`
- shipping page renders inside Storefront shell
- address preview fields remain disabled
- persistence/carrier/order-mutation guardrails are visible
- production smoke includes `/store/shipping`
- no horizontal overflow

## Next candidate

**B9 · Storefront Favorites/Wishlist Skeleton**

Potential boundary:

- dedicated `/store/favorites`
- visual saved-products list
- provider/DTO boundary
- no persistence yet
- no customer-state mutation
- sidebar coverage in the same PR
