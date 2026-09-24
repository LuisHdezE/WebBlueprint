# Authentication · Password Reset v1

Status: IMPLEMENTED · production QA passed · product-owner acceptance pending

QA status: PASS

Product-owner acceptance: PENDING

## Scope

This checkpoint replaces only `/authentication/password-reset` with a real standalone authentication view. Sign In remains unchanged and continues to be the accepted reference. Sign Up, 2FA, lock-screen and the remaining authentication routes stay as placeholders until reviewed individually.

## Architecture

The view follows the same feature-first boundary accepted for Sign In:

- `application/dtos/passwordReset.dto.ts` defines boundary DTOs.
- `application/contracts/passwordReset.contracts.ts` defines the content-provider and recovery-gateway ports.
- `application/passwordReset.usecases.ts` owns email validation, normalization and submit orchestration.
- `infrastructure/password-reset.view.json` owns user-facing copy and demo configuration.
- `infrastructure/mappers/mapPasswordResetViewDto.ts` validates and maps unknown JSON into the typed DTO.
- `infrastructure/JsonPasswordResetContentProvider.ts` adapts static JSON content.
- `infrastructure/MockPasswordResetGateway.ts` provides replaceable deterministic success/unavailable modes without magic account identifiers.
- `presentation/PasswordResetPage.tsx` consumes only application contracts and DTOs. It does not import JSON or infrastructure and does not call `fetch`, `localStorage` or `sessionStorage`.
- `AppRouter.tsx` remains the composition root.

## UX contract

- Standalone authentication surface without application sidebar/header.
- Desktop preserves the accepted Style 1 two-panel authentication composition.
- Mobile hides the promotional hero and prioritizes the recovery form.
- Theme-token driven primary color and configurable brand identity.
- Email-only recovery request with client-side required/format validation.
- Loading, semantic success and unavailable failure states.
- Explicit navigation back to `/authentication/sign-in`.
- Accessible label, autocomplete, invalid-state association, keyboard-visible focus and live success feedback.

## Security and data rules

- No user-facing copy is hardcoded in the page component; content comes from `password-reset.view.json` through a mapped DTO boundary.
- The visible success response is intentionally generic and does not disclose whether the supplied email belongs to an existing account.
- The mock gateway does not inspect usernames/emails to decide success. Behavior is selected only by an explicit deterministic adapter mode.
- A future HTTP/OIDC/Auth recovery provider can replace the gateway without changing Presentation.

## Mandatory QA evidence

Final PR candidate CI #166 on exact feature HEAD `00f4bd74358d4d91bed550195c6c2610684274ab`: PASS.

- TypeScript/typecheck: PASS.
- ESLint with zero warnings allowed: PASS.
- Automated test suite: 18 test files PASS, 50 tests PASS; the normal export integration test remains intentionally skipped in the generic suite and is executed separately by the export smoke.
- Production build: PASS.
- Automated architecture/data QA gate: PASS with 2 registered real views.
- Sign In browser regression: PASS, 27 checks.
- Password Reset browser functional/accessibility/responsive/runtime QA: PASS, 21 checks.
- Browser QA gate: PASS for both registered real views.
- Browser QA evidence artifact upload: PASS.
- Exported React project smoke: PASS, including generated project typecheck, lint, tests and build.
- Deployable SPA fallback check: PASS.
- PR preview artifact build/upload: PASS.

### Merge and production evidence

- PR #27 merged from exact approved HEAD `00f4bd74358d4d91bed550195c6c2610684274ab`.
- Merge commit / current production candidate: `36e8b4513e067e7c3546fe09e5e54380a41ac075`.
- Main-branch CI #167 on the merged SHA: PASS.
- The exact CI-tested `web-production` bundle was consumed by deployment, not rebuilt independently.
- EliasWorks deployment #94 on the same merged SHA: PASS.
- Canonical subdomain and SPA deep-link smoke: PASS, including `/authentication/password-reset`.
- Browser QA against `https://webblueprint.eliasworks.uy`: PASS.
- Production Sign In regression: PASS, 27 checks.
- Production Password Reset QA: PASS, 21 checks.
- Production browser QA gate: PASS for both registered real views.
- Production browser evidence artifact upload: PASS.

### Current QA verdict

`TECHNICAL PASS · PRODUCT-OWNER ACCEPTANCE PENDING`

The implementation, merged main SHA, deployment and production browser QA are all green. The view is not yet formally closed as a completed catalog view because explicit product-owner runtime/visual acceptance has not been recorded. No later Authentication view should use this checkpoint as formally closed until that approval is given.

## Out of scope

- Real password-reset backend/API.
- Sending email or tokens.
- Reset-token verification/new-password form.
- Sign Up, 2FA and lock-screen implementation.
- Final Composer/export integration for the Authentication family.

The export mechanism remains frozen while real catalog views are being built.
