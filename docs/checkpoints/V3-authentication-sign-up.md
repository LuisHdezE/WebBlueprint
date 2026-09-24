# Authentication · Sign Up v1

Status: IMPLEMENTED · preview QA passed

QA status: PASS

## Scope

This checkpoint replaces only `/authentication/sign-up` with a real standalone authentication view. Sign In and Password Reset remain unchanged and preserve their final accepted contracts. Two-factor verification, lock-screen and the remaining authentication routes stay as placeholders until reviewed individually.

CORK classifies the boxed Sign Up reference as `ADAPT` and the cover variant as `MERGE`, so WebBlueprint keeps one governed registration capability rather than parallel routes for visual variants.

## Architecture

The view follows the same feature-first boundary accepted for the previous authentication views:

- `application/dtos/signUp.dto.ts` defines view, request, validation, command and result DTOs.
- `application/contracts/signUp.contracts.ts` defines content-provider and account-creation gateway ports.
- `application/signUp.usecases.ts` owns validation, normalization and submit orchestration.
- `infrastructure/sign-up.view.json` owns user-facing copy and demo configuration.
- `infrastructure/mappers/mapSignUpViewDto.ts` validates and maps unknown JSON into the typed DTO.
- `infrastructure/JsonSignUpContentProvider.ts` adapts static JSON content.
- `infrastructure/MockSignUpGateway.ts` provides replaceable deterministic success/unavailable modes without inspecting account identifiers.
- `presentation/SignUpPage.tsx` consumes only application contracts and DTOs. It does not import JSON or infrastructure and does not call `fetch`, `localStorage` or `sessionStorage`.
- `AppRouter.tsx` remains the composition root and wires the standalone route explicitly before `TemplateShell`.

## Functional contract

The registration request captures:

- full name;
- email;
- password;
- password confirmation;
- explicit terms/privacy acceptance.

Application validation requires a name, valid email, minimum password length, matching confirmation and accepted terms. The gateway receives only a normalized `SignUpCommandDto` with full name, email and password. Confirmation and checkbox state remain presentation/application concerns and do not cross the account-creation port.

## UX contract

- Standalone authentication surface without application sidebar/header.
- Desktop preserves the accepted Style 1 two-panel authentication composition.
- Desktop must fit the complete initial view inside a 1365×611 viewport without vertical scrolling.
- The semantic success state must also fit inside the same 1365×611 desktop viewport without vertical scrolling.
- Name/email and password/confirmation use compact two-column rows on desktop and stack naturally on mobile.
- Mobile hides the promotional hero and prioritizes the registration form.
- Theme-token driven primary color and configurable brand identity.
- Accessible labels, autocomplete metadata, associated validation messages, keyboard-visible focus and semantic success/failure feedback.
- Explicit navigation back to `/authentication/sign-in`.
- Terms and privacy destinations remain explicit navigation contracts.

## Security and data rules

- No user-facing copy is hardcoded in the page component; content comes from `sign-up.view.json` through a mapped DTO boundary.
- Presentation has no direct API, persistence or browser-storage dependency.
- The mock gateway does not inspect name, email or password to decide behavior. Result mode is explicit and deterministic.
- The demo success state does not claim that a real account was persisted, verified or provisioned.
- Password confirmation and terms checkbox state never cross the gateway boundary.
- A future HTTP/OIDC/Auth provider can replace the gateway without changing Presentation.

## Preview QA evidence

The first PR run, CI #179 on implementation HEAD `0937264c523ff3b8bed90c4786eaf2aca455c4db`, correctly failed at TypeScript because `exactOptionalPropertyTypes` rejected clearing optional validation fields with explicit `undefined`. The DTO state contract was corrected without weakening compiler settings or bypassing the gate.

CI #180 on corrected implementation HEAD `bb135cd989136ba3f1f7b47f49ab628f19f1f134`: PASS.

- TypeScript/typecheck: PASS.
- ESLint with zero warnings allowed: PASS.
- Test files: 21 passed, 1 intentionally skipped integration test in the normal suite.
- Tests: 56 passed, 1 intentionally skipped integration test in the normal suite.
- Production build: PASS.
- Automated architecture/data QA gate: PASS with 3 registered real views.
- Sign In browser regression: 27 checks PASS.
- Password Reset browser regression: 23 checks PASS.
- Sign Up browser QA: 28 checks PASS.
- Desktop 1365×611 complete initial view without vertical scroll: PASS.
- Desktop 1365×611 semantic success state without vertical scroll: PASS.
- Desktop two-panel layout and horizontal-overflow assertions: PASS.
- Required, invalid-email, short-password, password-mismatch and terms validation assertions: PASS.
- Keyboard-visible focus and accessible field/error associations: PASS.
- Success feedback avoids echoing submitted identifiers or password: PASS.
- Mobile hero suppression, registration flow and horizontal-overflow assertions: PASS.
- Runtime exception/unhandled-rejection checks: PASS.
- Browser QA evidence artifact upload: PASS.
- Exported React project smoke: PASS.
- Deployable SPA fallback: PASS.
- PR preview artifact: PASS.
- Technical visual review of exact-head desktop initial, desktop success and mobile screenshots: PASS.

### Current QA verdict

`PASS`

The Sign Up candidate is technically accepted for preview. Product-owner runtime/visual acceptance remains PENDING and must be explicit after this revision is merged and deployed to EliasWorks.

## Out of scope

- Real account-creation backend/API or database persistence.
- Email verification or activation tokens.
- Social/OAuth registration providers.
- Two-factor verification and lock-screen implementation.
- Final Composer/export integration for the Authentication family.

The export mechanism remains frozen while real catalog views are being built.
