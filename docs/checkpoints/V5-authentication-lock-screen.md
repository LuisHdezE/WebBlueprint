# V5 · Authentication / Lock Screen

## Scope

This increment promotes `authentication/lock-screen` from the CORK placeholder to a governed, standalone Style 1 authentication view. It covers the locked-session identity card, password unlock flow, explicit demo boundary, responsive layout and accessibility contracts.

## Implementation

- Presentation: `src/features/authentication/lock-screen/presentation/LockScreenPage.tsx`
- Application: DTOs, contracts and use case with blank-input validation and failure mapping.
- Infrastructure: governed JSON content, fail-closed mapper, JSON provider and deterministic mock gateway.
- Route: `/authentication/lock-screen`
- QA: registry entry, Vitest architecture/adapter/use-case tests, browser QA and production smoke route.

## Acceptance evidence

Status: `IN PROGRESS`

QA status: PASS (local implementation gate)

The view must pass `npm run check`, `npm run qa`, export smoke, CI and deployed browser QA before merge. Production acceptance remains pending explicit owner approval of the PR HEAD.
