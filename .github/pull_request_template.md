## Summary

<!-- Describe the scoped change. -->

## Scope guard

- [ ] Change is limited to the approved view/feature or explicitly documented supporting infrastructure.
- [ ] No unrelated view was modified.

## Technical evidence

- [ ] Typecheck PASS.
- [ ] Lint PASS.
- [ ] Unit/application/adapter/architecture tests PASS as applicable.
- [ ] Build PASS.

## Mandatory QA gate

QA status: `PENDING`

- [ ] Automated QA gate PASS.
- [ ] Primary functional path verified.
- [ ] Validation/error/loading/success states verified as applicable.
- [ ] DTO/contracts/data-boundary review PASS.
- [ ] Presentation has no direct infrastructure/JSON/fetch/business-storage coupling.
- [ ] Style 1 visual review PASS.
- [ ] Responsive desktop/mobile review PASS.
- [ ] Accessibility interaction review PASS.
- [ ] Regression review PASS.
- [ ] Newly completed route is covered by canonical production deep-link smoke.

## Runtime acceptance

- [ ] Main CI PASS after merge.
- [ ] EliasWorks deploy PASS.
- [ ] Production deep-link smoke PASS.
- [ ] Product-owner runtime/visual acceptance PASS when the change affects UI/UX.

A PR must not be presented as ready for merge while mandatory pre-merge QA remains `PENDING` or `FAIL`.
