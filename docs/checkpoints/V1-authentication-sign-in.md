# Authentication · Sign In v1

Status: implementation candidate

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
- Responsive two-panel layout that collapses naturally on smaller screens.
- Theme-token driven primary color.
- Configurable brand mark/logo and copy.
- Email and password fields with client-side validation.
- Show/hide password control.
- Remember-me option.
- Password-recovery and account-creation navigation.
- Loading, success, invalid-credentials, and unavailable submission states supported by the gateway contract.
- Accessible labels, autocomplete hints, invalid-state associations, live feedback, and keyboard-visible focus.

## Data rules

No user-facing content is hardcoded in the page component. Static demo content is supplied through `sign-in.view.json`, mapped at the infrastructure boundary, and exposed as `SignInViewDto`.

The mock gateway uses explicit deterministic modes instead of magic usernames/passwords. A future HTTP/OIDC/Auth provider can replace it without changing `SignInPage`.

## Out of scope

- Real backend authentication.
- Session/token persistence.
- Sign-up, password reset, 2FA, and lock-screen implementation.
- Composer/export integration for the final authentication feature family.

The export mechanism remains frozen while real catalog views are being built.
