# Mandatory QA Gate

Status: ACTIVE

This document defines the mandatory Quality Assurance gate for every real catalog view implemented in WebBlueprint.

## Core rule

CI success is necessary but is not QA approval.

A view MUST NOT be considered ready, completed, or eligible for merge until the QA evidence required for its stage is explicit and the gate status is PASS.

For visual/product work, a green `typecheck`, lint, unit-test, build, or deployment smoke result does not replace functional, visual, responsive, accessibility, or runtime QA.

## Required delivery sequence

1. Implementation on a feature branch.
2. Unit, application, adapter, architecture, and contract tests as applicable.
3. CI quality gate.
4. Automated QA gate.
5. Functional QA against the implemented view.
6. Visual and responsive QA against the approved Style 1 baseline.
7. Accessibility QA appropriate to the surface.
8. PR review and explicit QA status.
9. Explicit user merge approval.
10. Main-branch CI.
11. Canonical EliasWorks deployment.
12. Production deep-link/runtime smoke for every newly completed view.
13. Final runtime/visual acceptance.

A failure at any QA stage blocks progression to the next view.

## QA evidence required per view

### Architecture and data

- DTOs exist for feature-boundary data.
- Application contracts/ports are explicit.
- Presentation does not import infrastructure implementations.
- Presentation does not read JSON directly.
- Presentation does not call `fetch` directly.
- Presentation does not use business `localStorage` or `sessionStorage` directly.
- User-facing/demo content is supplied through the configured data boundary rather than duplicated in the view.
- Mock adapters are replaceable by future API/auth providers without rewriting Presentation.

### Functional

- Primary happy path works.
- Required validation paths work.
- Loading, success, error, and empty/unavailable states are exercised when applicable.
- Navigation/actions resolve to the intended routes or contracts.
- No console/runtime exception is accepted as a PASS.

### Visual and responsive

- Conforms to the official Style 1 baseline.
- Desktop and mobile layouts preserve hierarchy and usability.
- No clipped, overflowing, overlapping, or inaccessible controls.
- Theme tokens are respected.
- Standalone surfaces do not accidentally inherit application chrome.

### Accessibility

- Inputs have programmatic labels.
- Validation feedback is associated with the affected control.
- Keyboard focus remains visible and usable.
- Interactive controls expose meaningful accessible names.
- Live feedback uses appropriate semantics when applicable.

### Regression

- Existing CI remains green.
- Export smoke remains green while export is frozen.
- Existing routes remain reachable.
- No unrelated view is changed without explicit scope.

### Production

Every completed real view MUST be included in the canonical deployment deep-link smoke list until a stronger runtime QA system replaces that mechanism.

## Gate statuses

Only these statuses are valid:

- `PENDING`: QA has not been completed.
- `FAIL`: one or more mandatory checks failed.
- `PASS`: all mandatory checks for the current stage passed.

`CI PASS`, `DEPLOY PASS`, or `SMOKE PASS` MUST NOT be presented as `QA PASS` unless the complete QA evidence for that stage has also passed.

## Product-owner visual acceptance

For views where visual/interaction quality is part of the acceptance contract, final QA remains `PENDING` until the runtime view has been visually reviewed and accepted by the product owner. Automated checks provide evidence, not a substitute for that approval.

## Registry

`qa/view-registry.json` is the machine-readable list of completed real views covered by the automated QA gate and production deep-link contract. Each newly completed view must be added to that registry as part of its implementation PR.
