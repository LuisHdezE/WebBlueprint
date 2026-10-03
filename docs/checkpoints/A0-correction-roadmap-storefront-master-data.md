# A0 — Correction Roadmap · Storefront + Master Data

## Status

Approved checkpoint.

This checkpoint freezes the previous linear Inventory expansion and establishes the architectural correction required before new Inventory, Ecommerce, or Storefront views are added.

## Trigger

The correction is based on the uploaded specification:

`WEBBLUEPRINT_CORRECCION_RUMBO_TIENDA_ONLINE_MASTER_DATA.md`

Core decision:

- WebBlueprint must explicitly separate Backoffice / Administration from Tienda Online / public Storefront.
- Storefront must not be visually or functionally wrapped by the administrative dashboard shell.
- Shared Master Data must exist before expanding forms that depend on repeated phone/catalog dimensions.
- PuntoPhone-v2 must be used as a conceptual source, not copied blindly.

## Current protected work

The following completed work remains valid as Admin / Backoffice functionality:

- Inventory Dashboard
- Inventory Devices list
- Device Intake quick registration
- Device Evaluation
- shared admin primitives such as PageShell, SurfaceCard, DataTable, MetricCard, StatusBadge, charts and form fields
- provider/DTO/JSON demo boundary pattern
- QA registry, Browser QA and production smoke workflow

These views must remain working during migration.

## Frozen work

Do not continue with Dismantling Queue yet.

Do not extend the current Applications / Ecommerce views as if they were the final public online store.

Do not add product detail, cart, checkout or storefront-like pages under the administrative TemplateShell.

## Known current mismatch

### Inventory

Current Inventory device DTOs still use local strings for repeated phone dimensions:

- manufacturer
- model
- storage
- color

These must gradually move to canonical Master Data references.

### Ecommerce

Current Ecommerce demo data is generic and admin-wrapped:

- category is a string;
- price is a display string;
- product does not distinguish Product, ProductVariant and DeviceUnit;
- no canonical Brand / DeviceModel / Category / Color / Storage / RAM references exist;
- no public StorefrontShell exists.

The current Ecommerce implementation is still useful as an admin/catalog experiment, but it is not the final Tienda Online architecture.

### PuntoPhone-v2

Useful concepts to reuse conceptually:

- brands;
- hierarchical categories;
- products;
- product images;
- product specifications;
- showroom sections;
- inventory / stock / visibility ideas;
- sales and configuration concepts.

Known limitations to improve:

- model must not remain free text;
- color must not remain free text;
- storage must not remain free text;
- RAM must not remain free text;
- public storefront and admin must not collapse into one visual shell.

## New architectural direction

```text
WEBBLUEPRINT
│
├── Admin / Backoffice
│   ├── Dashboard
│   ├── Inventory
│   ├── Catalog Admin
│   ├── Sales / Orders
│   ├── Customers
│   ├── Finance
│   ├── Settings
│   └── Master Data
│
└── Storefront / Tienda Online
    ├── Home
    ├── Product Listing
    ├── Product Detail
    ├── Brands
    ├── Spare Parts
    ├── Used Phones
    ├── Favorites
    ├── Cart
    ├── Checkout
    └── Customer Account

Shared Domain
├── Master Data
├── Catalog
└── Theme Engine
```

## Provider direction

Target conceptual dependency order:

```text
MasterDataProvider
  ↓
CatalogProvider
  ↓
├── InventoryProvider
└── StorefrontProvider
```

A separate `StorefrontThemeProvider` may be introduced for public theme tokens.

## Component split

### Shared base primitives

Can remain shared when visual intent is neutral:

- button primitives;
- input primitives;
- select primitives;
- icons;
- accessibility utilities;
- token utilities.

### Admin-specific

- TemplateShell / AdminShell;
- PageShell;
- SurfaceCard;
- MetricCard;
- DataTable;
- dashboard charts;
- admin filters;
- admin navigation sidebar.

### Storefront-specific

Create separately when needed:

- StorefrontShell;
- StoreHeader;
- StoreMegaMenu;
- StoreSearch;
- StoreProductCard;
- StoreProductGrid;
- StorePrice;
- StoreStockBadge;
- StoreCategoryCard;
- StoreBrandCard;
- StoreCampaignBanner;
- StoreFooter;
- StoreCartDrawer;
- StoreBreadcrumbs;
- StoreFilterPanel.

Do not force visual reuse when the UX intent is different.

## Required PR sequence

### A1 · Shared Master Data Foundation

Scope:

- create `src/features/master-data/`;
- add `Brand`, `DeviceModel`, and hierarchical `Category` DTOs;
- add deterministic JSON demo data;
- add `MasterDataProvider` contract;
- add `JsonMasterDataProvider`;
- add adapter/architecture tests;
- no UI migration yet.

Acceptance:

- one canonical source for brands, device models and categories;
- device models reference brands;
- categories support parent/child hierarchy;
- no consumer imports JSON directly;
- no backend or persistence is introduced.

### A2 · Admin Master Data Views

Scope:

- add read-only admin views for brands, device models and categories;
- use AdminShell / TemplateShell and shared admin DataTable;
- register QA and browser QA.

### A3 · Inventory Intake Master Data Migration

Scope:

- migrate device intake to consume canonical brands and device models;
- implement brand -> model dependent selection;
- keep existing Inventory views working;
- do not introduce backend persistence.

### A4 · Extended Master Data

Scope:

- colors;
- storage capacities;
- RAM capacities;
- product conditions;
- spare part types.

### A5 · Storefront Foundation

Scope:

- create StorefrontShell;
- create `/store` route family;
- add commercial header/footer/search/navigation skeleton;
- no sidebar admin;
- no final product catalog yet.

### A6 · Storefront Theme Foundation

Scope:

- add StorefrontTheme DTO/provider;
- add primary color and derived token concept;
- add minimal preview / settings groundwork;
- avoid per-view hardcoded storefront colors.

### B1+ · Storefront catalog flow

After A1-A6:

- Storefront Home;
- StoreProductCard / StoreProductGrid;
- Product Listing;
- Product Detail;
- compatibility for spare parts;
- used phones specialization;
- favorites/cart/checkout.

## Explicit guardrails

Do not:

- copy MANCRU branding, assets, text, source, exact colors or proprietary identity;
- use AdminShell for the public storefront;
- duplicate brands/categories between Inventory, Ecommerce and Storefront;
- represent model/color/storage/RAM as local strings once canonical master data exists;
- create a real database inside WebBlueprint;
- fake persistence;
- fake payments;
- expose internal acquisition cost, margin, supplier cost, technician notes or full IMEI in Storefront;
- implement this correction as a mega PR.

Do:

- keep existing views working;
- migrate gradually;
- keep DTO/provider boundaries;
- keep Browser QA desktop/mobile;
- build small auditable increments;
- use PuntoPhone-v2 only as conceptual prior work.

## Immediate next step

Proceed with A1 only after this checkpoint is merged.
