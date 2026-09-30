# V13 — Applications · Ecommerce · Products

## Scope
Real product-management view at `/applications/ecommerce/products`.

## Architecture
- One canonical product catalog is introduced for the whole Ecommerce family.
- Products, Shop, Product Detail and Editor must consume the same product DTO/catalog rather than duplicate fixtures.
- Products view has its own governed view configuration.
- Reuses PageShell, SurfaceCard, DataTable, SearchField, SelectField and StatusBadge.
- Search and category filtering are local UI state.

## QA
- Adapter validates the canonical catalog and product view.
- Architecture tests guard governed content, primitive reuse and explicit routing.
- Browser QA covers search, category filtering, mobile and overflow.
- Production smoke includes the products route.

QA status: PENDING CI AND BROWSER QA
