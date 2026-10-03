# A2 — Admin Master Data Views

## Scope

Adds read-only Backoffice / Admin views for the first canonical Master Data foundation introduced in A1.

## Included views

- `/admin/master-data/brands`
- `/admin/master-data/device-models`
- `/admin/master-data/categories`

## Architecture

This increment keeps two boundaries separated:

```text
Canonical master data
  JsonMasterDataProvider
    ↓
  Brand / DeviceModel / Category DTOs

Admin view content
  JsonMasterDataAdminViewProvider
    ↓
  Admin titles, breadcrumbs, table labels and empty states
```

Presentation receives both providers and composes tables without importing JSON or infrastructure directly.

## Reused primitives

- `PageShell`
- `DataTable`
- `StatusBadge`

No new table primitive was created.

## Explicitly not included

This PR does not migrate Inventory Intake yet.

This PR does not change Ecommerce or Storefront.

This PR does not introduce backend persistence, write forms or real CRUD behavior.

This PR does not create product/catalog/compatibility flows.

## QA contract

QA status: PASS — CI, Automated QA, Browser QA, export smoke and deploy smoke must pass on the final PR HEAD before merge approval is requested.

- Adapter tests cover canonical catalog and admin view content.
- Architecture tests guard provider boundaries and route registration.
- Browser QA validates all three admin routes in desktop and mobile.
- `qa/view-registry.json` registers all three views.
- Production smoke includes the three deep links.

## Follow-up

Next planned increment:

`A3 · Inventory Intake Master Data Migration`

That migration should consume canonical brands and device models without breaking the existing Inventory flow.
