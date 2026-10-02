# V15 — Applications · Ecommerce · Detail

## Scope
Product detail surface at `/applications/ecommerce/detail`, resolved from the canonical Ecommerce catalog introduced in V13.

## Architecture
- Reuses the single `EcommerceCatalogProvider` and canonical `ProductDto` catalog.
- `detail.view.json` is governed through `getProductDetailView(): ProductDetailViewDto`; Presentation does not import JSON or infrastructure.
- The configured `productId` is validated against the canonical catalog by the provider.
- Related products come from the same catalog and exclude drafts.
- Reuses `PageShell`, `SurfaceCard`, `ProductCard` and `ProductStatus`.
- No cart, checkout, backend or persistence is introduced in V15.

## QA
- Adapter tests cover governed Detail configuration and canonical catalog resolution.
- Architecture tests guard the provider boundary, primitive reuse, absence of presentation fixtures and explicit routing.
- Browser QA covers deep link, desktop/mobile, configured product identity, SKU, price, status, related products, draft exclusion and horizontal overflow.
- Production smoke includes `applications/ecommerce/detail`.

QA status: PENDING — implementation gate must pass on the final V15 HEAD before merge approval is requested.
