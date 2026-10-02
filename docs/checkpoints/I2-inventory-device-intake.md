# I2 — Inventory · Device Intake

## Scope

Adds the first operational Device Intake slice after the Inventory Dashboard foundation.

Completed real views:

- `/apps/inventory/devices`
- `/apps/inventory/devices/new`

## Domain story

The slice supports the first step of the inventory workflow:

`Device Intake → Evaluation → Dismantling / Refurbishment`

The list is designed for growing physical stock and exposes deterministic demo devices with search, filtering, selection and pagination.

The intake form captures a minimal operational identity before deeper evaluation:

- manufacturer
- model
- IMEI / serial
- storage
- color
- power state
- physical condition
- account-lock state
- acquisition source
- acquisition cost
- initial destination
- notes

Initial destinations are governed by provider data and include Pending Evaluation, Donor, Refurbish, Hold and Discard.

## Architecture

- Reuses the shared `DataTable`, `StatusBadge`, `TextField`, `SelectField`, `TextAreaField`, `SurfaceCard` and `PageShell` primitives.
- Device fixtures, labels, options and defaults live in `inventory.devices.json`.
- Presentation consumes `InventoryDemoProvider` only.
- Device Intake DTOs live in `devices.dto.ts`.
- No production backend, database or persistence is introduced.
- Demo submission explicitly communicates that no backend persistence occurs.
- Detailed technical evaluation remains outside this increment.

## QA

- Adapter tests validate deterministic device data, unique IDs, filters and intake defaults/options.
- Architecture tests prevent JSON/infrastructure imports and domain fixture leakage into Presentation.
- Browser QA covers deep links, desktop/mobile layout, list search/filter/pagination and intake submission interaction.
- Production smoke includes both Device Intake routes.

QA status: PENDING — final CI and Browser QA must pass on the final PR HEAD before merge approval is requested.
