# Authentication · Sign In v1

Status: COMPLETE · production accepted

QA status: PASS

## Scope

This checkpoint replaces only `/authentication/sign-in` with a real standalone authentication view. The remaining authentication routes stay registered as placeholders until they are reviewed individually.

## Architecture

The view follows a feature-first boundary:

- `application/dtos/signIn.dto.ts` defines the DTOs that cross the feature boundaries.
- `application/contracts/signIn.contracts.ts` defines the content-provider and authentication-gateway ports.
- `application/signIn.usecases.ts` owns loading, validation, normalization, and submit orchestration.
- `infrastructure/sign-in.view.json` owns user-facing copy and demo configuration.
- `infrastructure/mappers/mapSignInViewDto.ts` validates and maps unknown JSON into the typed DTO.
- `infrastructure/JsonSignInContentProvider.ts` adapts static JSON content.
- `infrastructure/MockSignInGateway.ts` provides a replaceable deterministic authentication adapter for the catalog.
- `presentation/SignInPage.tsx` consumes only application contracts and DTOs. It does not import JSON or infrastructure and does not call `fetch`, `localStorage`, or `sessionStorage`.
- `AppRouter.tsx` is the composition root that wires the mock adapters to the page.

## UX contract

- Standalone authentication surface without application sidebar/header.
- Desktop uses the Style 1 two-panel composition.
- Mobile prioritizes the authentication form and brand identity; the promotional hero is desktop-only.
- Theme-token driven primary color.
- Configurable brand mark/logo and copy.
- Email and password fields with client-side validation.
- Show/hide password control exposes state through `aria-controls` and `aria-pressed` and does not overlap the password field on mobile.
- Remember-me option.
- Password-recovery and account-creation navigation.
- Loading, success, invalid-credentials, and unavailable submission states supported by the gateway contract.
- Accessible labels, autocomplete hints, invalid-state associations, live feedback, and keyboard-visible focus.

## Data rules

No user-facing content is hardcoded in the page component. Static demo content is supplied through `sign-in.view.json`, mapped at the infrastructure boundary, and exposed as `SignInViewDto`.

The mock gateway uses explicit deterministic modes instead of magic usernames/passwords. A future HTTP/OIDC/Auth provider can replace it without changing `SignInPage`.

## Mandatory QA evidence

All mandatory QA items are PASS.

- Automated architecture/data QA gate: PASS.
- Feature/application/adapter/architecture tests: PASS.
- Browser functional QA against rendered preview: PASS.
- Browser accessibility-interaction checks: PASS.
- Browser desktop responsive/layout checks: PASS.
- Browser mobile responsive/layout checks: PASS after QA discovered and corrected two defects: the promotional hero preceding the form and the password-visibility control overlapping the field.
- Style 1 technical visual review of generated desktop/mobile evidence: PASS.
- Browser runtime exception/unhandled-rejection checks: PASS.
- Preview browser report: 27 checks PASS, 0 failures.
- Export regression smoke: PASS.
- Production deep-link coverage for `/authentication/sign-in`: PASS.
- Browser-QA candidate merged through PR #25 at merge commit `437fa89050a24c02595c9adfe53a1cbfd7d7b139`.
- Main-branch CI #161 on the merged production candidate: PASS.
- EliasWorks deployment #88 on the same merged SHA: PASS.
- Browser QA against `https://webblueprint.eliasworks.uy/authentication/sign-in`: PASS.
- Production browser report: 27 checks PASS, 0 failures.
- Production desktop/mobile screenshot review: PASS.
- Product-owner runtime/visual acceptance: PASS, explicitly approved on 2026-09-23.

### Final QA verdict

`PASS`

The Sign In view is formally closed as the first completed real catalog view and may now serve as the quality reference for the remaining Authentication views. Any later regression reopens QA for the affected scope.

## Out of scope

- Real backend authentication.
- Session/token persistence.
- Sign-up, password reset, 2FA, and lock-screen implementation.
- Composer/export integration for the final authentication feature family.

The export mechanism remains frozen while real catalog views are being built.
