# B12 · Storefront Catalog Route Completion

## Baseline

- Repository: `LuisHdezE/WebBlueprint`
- Base: `main@de45ce25a5c3505c5159dd9693ed9d829345266c`
- Branch: `feat/storefront-catalog-route-completion`
- Previous increment: B11 · Storefront Warranty / Returns Skeleton

## Goal

Complete the Storefront catalog links that were still placeholders and route them through one reusable, provider-driven catalog page instead of creating duplicate page implementations.

## Completed routes

Static catalog routes:

- `/store/spare-parts`
- `/store/used-phones`
- `/store/brands`

Dynamic category route:

- `/store/categories/:category`

Configured category variants:

- `/store/categories/displays`
- `/store/categories/batteries`
- `/store/categories/charge-connectors`
- `/store/categories/accessories`

## Architecture

B12 adds:

- `StorefrontCatalogRouteViewDto`
- `StorefrontCatalogViewDto`
- `StorefrontProvider.getCatalogView()`
- `StorefrontProvider.getCatalogRouteView(key)`
- `storefront.catalog.json`
- reusable `StorefrontCatalogPage`

The catalog route JSON stores product IDs only. The provider resolves those IDs against the existing `productListing.products` collection, so B12 does not duplicate product card data.

All route variants reuse:

- `StorefrontPageIntro`
- `StorefrontProductCard`
- Storefront theme tokens
- existing Storefront shell

## Sidebar coverage

The Blueprint sidebar adds deterministic entries for every completed public catalog destination:

- Repuestos
- Celulares usados
- Marcas
- Categoría · Displays
- Categoría · Baterías
- Categoría · Conectores
- Categoría · Accesorios

The dynamic `/store/categories/:category` route therefore has explicit preview entries, following the same rule already used by dynamic product detail.

## Explicitly excluded

- no backend catalog query
- no real search
- no applied filters
- no inventory mutation
- no cart mutation
- no order mutation
- no new product persistence
- no localStorage
- no sessionStorage
- no duplicate Ecommerce legacy provider
- no duplicated product card implementation

## QA contract

Automated QA verifies:

- all seven completed catalog destinations respond
- static routes resolve their configured provider variant
- dynamic category slug resolves its configured variant
- catalog cards are the shared `StorefrontProductCard`
- product data comes from the existing product listing
- sidebar exposes completed destinations
- no legacy Ecommerce coupling
- no client persistence or fetch logic is introduced
- no horizontal overflow
- production smoke includes all completed catalog routes

## Next candidate

**B13 · Storefront Product Discovery Interaction Skeleton**

Potential scope:

- make search/filter/sort controls stateful in-memory
- no backend yet
- no localStorage/sessionStorage
- reusable filtering application service
- URL/query-string behavior can be evaluated separately before implementation
