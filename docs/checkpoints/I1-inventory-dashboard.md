# I1 — Inventory Foundation · Dashboard

## Scope
First auditable increment of Stage 1 from the WebBlueprint Master SPEC: an operational inventory dashboard at `/apps/inventory/dashboard`.

## Domain story
The deterministic demo dataset represents physical devices moving through evaluation, donor/dismantling, extracted-parts testing, sale readiness and refurbishment. The dashboard answers what needs attention next through KPIs plus an operational queue.

## Architecture
- Feature boundary: `src/features/inventory`.
- Presentation consumes `InventoryDemoProvider`; it does not import JSON or infrastructure.
- Deterministic demo content lives in infrastructure and is typed by application DTOs.
- Reuses `MetricCard`, `StatusBadge`, `SurfaceCard` and `PageShell`.
- No backend, persistence, authentication changes, checkout or finance logic.
- Route is explicit and precedes the generic public `apps/:slug` route.

## QA
- Adapter tests: deterministic dashboard, KPI coverage, stable unique queue identities.
- Architecture tests: provider boundary, primitive reuse, no presentation fixtures, route precedence.
- Browser QA: deep link, 8 KPIs, operational queue, desktop/mobile and horizontal-overflow checks.
- Deployment smoke: `apps/inventory/dashboard`.

QA status: PASS — CI #253 passed Quality gate, Automated QA, Browser QA, exported React project smoke, SPA fallback and PR build preview on I1 HEAD `a889dccef242805036b344f17f69314ce4a0215e`. Final merge remains subject to a green CI run on this checkpoint commit and explicit approval of the exact PR HEAD.
