# V14 — Applications · Ecommerce · Shop

## Scope
Commercial shop surface at `/applications/ecommerce/shop`, built on the canonical Ecommerce catalog introduced in V13.

## Architecture
- Reuses the single `EcommerceCatalogProvider` and canonical `ProductDto` catalog.
- `shop.view.json` is governed through `getShopView(): ShopViewDto`; Presentation does not import JSON or infrastructure.
- Draft products are excluded locally from the commercial surface; published and out-of-stock products remain represented.
- Search and category filtering are local UI state.
- Reuses `PageShell`, `SurfaceCard`, `SearchField`, `SelectField`, `ProductCard` and `ProductStatus`.
- No cart, checkout, backend or persistence is introduced in V14.

## QA
- Adapter tests cover the governed Shop configuration and shared catalog identity.
- Architecture tests guard the provider boundary, primitive reuse, absence of presentation fixtures and explicit routing.
- Browser QA covers deep link, desktop/mobile, search, category filtering, four commercial products, draft exclusion, out-of-stock behavior and horizontal overflow.
- Production smoke includes `applications/ecommerce/shop`.

QA status: PASS — CI #247 (`36877762042`) on implementation HEAD `73ba2b4bf4c9a7ee1bbe393d6c7be7ab76fe2a09`: Quality Gate, Automated QA Gate, Browser QA Gate, exported React smoke and deployable SPA fallback all passed.
