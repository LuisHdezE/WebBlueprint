# A1 — Shared Master Data Foundation

## Scope

Introduces the first canonical Master Data module required by the correction roadmap.

This increment adds a shared source for repeated catalog and phone dimensions before any further Inventory, Ecommerce or Storefront expansion.

## Included master data

- Brands
- Device models
- Hierarchical categories

## Files

- `src/features/master-data/application/master-data.dto.ts`
- `src/features/master-data/application/master-data.contracts.ts`
- `src/features/master-data/infrastructure/master-data.catalog.json`
- `src/features/master-data/infrastructure/JsonMasterDataProvider.ts`
- `src/features/master-data/infrastructure/master-data.adapters.test.ts`
- `src/features/master-data/master-data.architecture.test.ts`

## Architecture

The module introduces:

```text
JSON demo catalog
  ↓
MasterData DTOs
  ↓
MasterDataProvider
  ↓
future consumers
├── Inventory
├── Catalog Admin
└── Storefront
```

The provider validates:

- non-empty collections;
- unique IDs inside each collection;
- device models reference existing brands;
- category parents reference existing categories;
- minimal name/slug completeness.

## What is intentionally not changed

This PR does not migrate current Inventory forms yet.

This PR does not create admin Master Data screens yet.

This PR does not create Storefront routes or shell yet.

This PR does not change Ecommerce products or shop views.

This PR does not introduce persistence or backend behavior.

## Follow-up

Next planned increment:

`A2 · Admin Master Data Views`

Then:

`A3 · Inventory Intake Master Data Migration`

## Acceptance

- one canonical source for brands, device models and categories;
- device models reference brands;
- categories support parent/child hierarchy with at least one third-level example;
- application contracts do not import infrastructure or JSON;
- JSON remains behind `JsonMasterDataProvider`;
- adapter and architecture tests cover the foundation;
- no UI behavior changes are introduced.
