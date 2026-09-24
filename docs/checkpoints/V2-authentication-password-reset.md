# Authentication · Password Reset v1

Status: IMPLEMENTED · preview QA passed

QA status: PASS

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

Preview candidate CI #165 on exact feature HEAD `5e8568781ea16f146a2774c932dd05fab7b6bae0`: PASS.

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

### Current QA verdict

`PASS`

This verdict covers the PR preview candidate. Production acceptance remains a separate post-merge gate after the exact merged SHA deploys to EliasWorks.

## Out of scope

- Real password-reset backend/API.
- Sending email or tokens.
- Reset-token verification/new-password form.
- Sign Up, 2FA and lock-screen implementation.
- Final Composer/export integration for the Authentication family.

The export mechanism remains frozen while real catalog views are being built.
