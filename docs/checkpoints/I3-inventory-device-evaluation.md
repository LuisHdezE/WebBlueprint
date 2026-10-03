# I3 — Inventory · Device Evaluation

## Scope

Adds the first Device Evaluation slice after Device Intake.

Completed real view:

- `/apps/inventory/devices/evaluation`

The existing devices list now links a device ID to the evaluation view.

## Domain story

The slice supports the workflow step:

`Device Intake → Evaluation → Donor / Refurbish / Hold / Discard`

The evaluation view is intentionally separate from the quick intake form. Intake captures enough information to register a physical device. Evaluation reviews the already registered device and prepares the operational decision.

## Evaluation coverage

The demo evaluation includes:

- device identity and acquisition context
- current inventory destination
- visual checks
- functional checks
- account-lock context
- estimated recoverable value
- estimated parts value
- estimated refurbishment cost
- profitability signal
- recommended operational destination
- evaluator notes
- demo decision submission feedback

## Architecture

- Evaluation data lives in `inventory.device-evaluation.json`.
- Presentation consumes `InventoryDemoProvider.getDeviceEvaluationView()` only.
- The view reuses shared primitives: `MetricCard`, `StatusBadge`, `SelectField`, `TextAreaField`, `SurfaceCard` and `PageShell`.
- No production backend, persistence, inventory mutation or dynamic route handling is introduced.
- The route is explicit, `/apps/inventory/devices/evaluation`, to match the current Blueprint real-view registry pattern.
- Future dynamic detail routes can reuse this view structure and provider boundary.

## QA

- Adapter tests validate deterministic evaluation data, checks and decision options.
- Architecture tests prevent JSON/infrastructure imports and fixture leakage into Presentation.
- Browser QA covers deep-link rendering, summary metrics, visual/functional sections, destination decision changes, demo submit feedback and mobile layout.
- Production smoke includes the evaluation route.

QA status: PENDING — final CI and Browser QA must pass on the final PR HEAD before merge approval is requested.
