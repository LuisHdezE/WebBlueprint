# Authentication · Password Reset v1

Status: IMPLEMENTED · compact revision preview QA passed

QA status: PASS

## Scope

This checkpoint replaces only `/authentication/password-reset` with a real standalone authentication view. Sign In remains unchanged and continues to be the accepted reference. Sign Up, 2FA, lock-screen and the remaining authentication routes stay as placeholders until reviewed individually.

The feature was merged through PR #27 and deployed successfully to EliasWorks at merge SHA `36e8b4513e067e7c3546fe09e5e54380a41ac075`. Product-owner runtime review then reopened the visual gate because the desktop composition used too much vertical whitespace and required scrolling in a 1365×611 viewport.

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

The visual-density revision changes only presentation spacing/sizing and browser QA. DTOs, contracts, adapters, routing, mock behavior and user-facing copy remain unchanged.

## UX contract

- Standalone authentication surface without application sidebar/header.
- Desktop preserves the accepted Style 1 two-panel authentication composition.
- Desktop must fit the complete initial view inside a 1365×611 viewport without vertical scrolling.
- The semantic success state must also fit inside the same 1365×611 desktop viewport without vertical scrolling.
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

## Historical QA evidence

The pre-revision implementation passed its technical gates before product-owner visual feedback reopened the checkpoint:

- PR preview CI #166: PASS on exact HEAD `00f4bd74358d4d91bed550195c6c2610684274ab`.
- Main CI #167 after PR #27: PASS on exact merge SHA `36e8b4513e067e7c3546fe09e5e54380a41ac075`.
- EliasWorks deployment #94: PASS on the same merge SHA.
- Production browser QA: Sign In 27 checks PASS; Password Reset 21 checks PASS.
- Canonical subdomain and SPA deep-link smoke: PASS.

Those results remain valid historical evidence for functionality, architecture, deployment and the previous responsive contract. They do not replace the compact-revision QA below.

## Compact revision QA evidence

Preview candidate CI #174 on implementation HEAD `e411051c9d1bff961a49751cbe86b6cfec5f917c`: PASS.

- TypeScript/typecheck: PASS.
- ESLint with zero warnings allowed: PASS.
- Automated tests and production build: PASS.
- Automated architecture/data QA gate: PASS.
- Sign In browser regression: PASS.
- Password Reset browser QA: 23 checks PASS.
- Desktop 1365×611 complete initial view without vertical scroll: PASS.
- Desktop 1365×611 semantic success state without vertical scroll: PASS.
- Desktop horizontal-overflow and two-panel layout assertions: PASS.
- Mobile recovery-flow visibility and horizontal-overflow assertions: PASS.
- Runtime exception/unhandled-rejection checks: PASS.
- Browser QA evidence artifact upload: PASS.
- Exported React project smoke: PASS.
- Deployable SPA fallback: PASS.
- PR preview artifact: PASS.
- Technical visual review of exact implementation-head desktop initial, desktop success and mobile screenshots: PASS.

### Current QA verdict

`PASS`

The compact revision is technically accepted for preview. Product-owner runtime/visual acceptance remains PENDING and must be explicit after this revision is merged and deployed to EliasWorks.

## Out of scope

- Real password-reset backend/API.
- Sending email or tokens.
- Reset-token verification/new-password form.
- Sign Up, 2FA and lock-screen implementation.
- Final Composer/export integration for the Authentication family.

The export mechanism remains frozen while real catalog views are being built.
