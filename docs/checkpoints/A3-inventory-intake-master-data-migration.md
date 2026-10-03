# A3 — Inventory Intake Master Data Migration

## Scope

Migrates the Inventory Device Intake view from free-text manufacturer/model capture to canonical Master Data references.

## Included route

- `/apps/inventory/devices/new`

## What changed

- Device Intake now receives `MasterDataProvider` from the app router.
- Brand selection is loaded from canonical `MasterDataProvider.getBrands()`.
- Device model selection is loaded from canonical `MasterDataProvider.getDeviceModels()`.
- Device model options are filtered by the selected brand.
- Changing the selected brand resets the selected model.
- Submit remains disabled until `brandId`, `deviceModelId` and serial/IMEI are present.
- The intake side note explicitly states that brand/model come from Datos Maestros.

## DTO changes

`InventoryDeviceIntakeViewDto` now describes brand/model capture as:

- `brandId`
- `deviceModelId`

The existing device list still exposes display strings for historical demo rows in this PR.

## Explicitly not included

This PR does not migrate:

- Inventory list rows to canonical brand/model references.
- Device Evaluation data.
- Color.
- Storage.
- RAM.
- Conditions.
- Spare part types.
- Ecommerce.
- Storefront.
- Persistence/backend/localStorage.

## QA status

QA status: PASS — CI, Automated QA, Browser QA, export smoke and deploy smoke must pass on the final PR HEAD before merge approval is requested.

Browser QA validates:

- route deep link;
- brand select sourced from Master Data;
- model select waits for brand selection;
- model select filters by selected brand;
- canonical brand/model hint;
- submit enablement using brand/model IDs plus serial/IMEI;
- success feedback;
- desktop screenshot;
- mobile screenshot;
- no horizontal overflow.

## Follow-up

Next planned increment:

`A4 · Extended Master Data`

Expected additions:

- Colors.
- Storage capacities.
- RAM capacities.
- Conditions.
- Spare part types.

After A4, Inventory forms can migrate the remaining free-text attributes in A5.
