# B9 · Storefront Favorites / Wishlist Skeleton

## Baseline

- Repository: `LuisHdezE/WebBlueprint`
- Base: `main@c8fa6ba7df4d3c206bdeb215cc48d025a4d570f5`
- Branch: `feat/storefront-favorites`
- Previous increment: B8 · Storefront Shipping Zone Skeleton

## Goal

Add a dedicated customer-facing favorites view to the Storefront without introducing persistence or customer-state mutation yet.

## Route

- `/store/favorites`

## Included

- `StorefrontFavoritesViewDto`
- `StorefrontProvider.getFavoritesView()`
- provider-backed favorites JSON
- three demo favorite products
- shared `StorefrontProductCard`
- reusable empty state
- non-persistence notices
- route in Storefront shell
- **Favoritos** entry in Blueprint sidebar
- production deep-link smoke
- provider tests
- architecture tests
- Browser QA
- checkpoint documentation

## Explicitly excluded

- no localStorage
- no sessionStorage
- no backend persistence
- no authenticated customer state
- no add/remove favorite mutations
- no cart mutation
- no inventory mutation
- no order creation
- no cross-device sync

## Sidebar rule

Because B9 adds a completed static Storefront route, `/store/favorites` is added to the **Tienda online** section in the same PR.

## QA contract

Checks verify:

- route responds
- page renders inside Storefront shell
- three provider-driven products render
- shared `StorefrontProductCard` is reused
- empty state remains visible
- no-persistence notice is visible
- no cart mutation language/behavior is introduced
- no horizontal overflow
- production smoke includes `/store/favorites`

## Next candidate

**B10 · Storefront Contact / WhatsApp Landing Skeleton**

Potential boundary:

- dedicated `/store/contact`
- WhatsApp CTA
- service area and contact hours
- provider-backed contact DTO
- no messaging API yet
- sidebar coverage in same PR
