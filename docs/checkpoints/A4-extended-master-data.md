# A4 — Extended Master Data

## Scope

Adds extended master data collections required before continuing Inventory form migration and before building Storefront catalog flows.

## Included canonical collections

- Colors.
- Storage capacities.
- RAM capacities.
- Conditions.
- Spare part types.

## Included admin routes

- `/admin/master-data/colors`
- `/admin/master-data/storage-capacities`
- `/admin/master-data/ram-capacities`
- `/admin/master-data/conditions`
- `/admin/master-data/spare-part-types`

## What changed

- `MasterDataCatalogDto` now includes the five extended collections.
- `MasterDataProvider` exposes collection-specific methods for the five new collections.
- `JsonMasterDataProvider` validates required collections, unique ids and spare part type parent references.
- `master-data.catalog.json` contains deterministic demo seed data for the five collections.
- `ExtendedMasterDataAdminPages.tsx` adds a reusable compact CRUD mock screen for simple master data.
- App routes and sidebar navigation expose the new admin pages under Master Data.
- Browser QA validates the new routes, modal opening/closing, canonical rows and desktop/mobile overflow.

## Explicitly not included

This PR does not migrate:

- Inventory storage field to `storageCapacityId`.
- Inventory color field to `colorId`.
- Inventory condition field to `conditionId`.
- Inventory RAM field.
- Spare part compatibility.
- Storefront.
- Ecommerce.
- Backend/persistence/localStorage.

## QA status

QA status: PASS required before merge.

Required gates:

- Typecheck.
- Lint.
- Unit/adapter tests.
- Architecture tests.
- Automated QA.
- Browser QA.
- Export smoke.
- SPA fallback smoke.

## Browser QA expectations

The extended master data browser scenario validates:

- Deep links for all five routes.
- Canonical demo data is rendered.
- Create actions are available.
- Compact create modals open and close.
- Tables render rows.
- Desktop screenshots.
- Mobile screenshot.
- No horizontal overflow.

## Follow-up

Next planned increment:

`A5 · Inventory Forms Migration`

Expected focus:

- Use `colorId` instead of free-text color.
- Use `storageCapacityId` instead of free-text storage.
- Use `conditionId` where applicable.
- Keep Inventory provider-driven and demo-only until persistence/backend is explicitly introduced.
