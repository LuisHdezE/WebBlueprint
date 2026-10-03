# A5 — Inventory Forms Master Data Migration

## Scope

Migrates Inventory intake form fields from free-text capture to canonical Master Data IDs for normalized attributes introduced in A4.

## Included

- `storageCapacityId` replaces free-text `storage` in Inventory intake.
- `colorId` replaces free-text `color` in Inventory intake.
- `conditionId` replaces local `physicalCondition` capture in Inventory intake.
- Intake still uses `brandId` and `deviceModelId` from A3.
- Intake submit now requires brand, model, storage, color, condition and IMEI/serial.
- Browser QA selects canonical values from Master Data.
- Adapter tests assert the new intake fields and defaults.
- Architecture tests require Master Data provider access for the normalized fields.

## Explicitly not included

This PR does not migrate the historical device list rows to IDs. The list remains read-only demo text in this increment.

This PR does not change:

- Storefront.
- Ecommerce.
- Backend/persistence/localStorage.
- Product/ProductVariant model.
- Spare part compatibility.
- Device evaluation persistence.
- Finance/Sales/Orders.

## Master Data dependencies

This increment depends on A4 collections:

- Colors.
- Storage capacities.
- Conditions.

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

The Inventory intake browser scenario validates:

- Deep link for `/apps/inventory/devices/new`.
- Brand select from Master Data.
- Model select filtered by selected brand.
- Storage select from Master Data.
- Color select from Master Data.
- Condition select from Master Data.
- Submit remains disabled until canonical required fields are selected.
- Canonical hint shows brand, model, storage and color.
- Condition hint shows condition name and grade.
- Desktop and mobile avoid horizontal overflow.

## Follow-up

Next planned increment:

`B1 · Storefront Shell Foundation`

Expected focus:

- Separate public Storefront shell from AdminShell.
- Add commercial header, navigation, footer and route skeleton.
- Do not reuse admin sidebar/dashboard shell for storefront.
