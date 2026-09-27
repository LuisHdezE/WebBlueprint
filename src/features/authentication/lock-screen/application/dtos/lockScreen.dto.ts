export interface LockScreenBrandingDto { mark: string; name: string; logoUrl: string | null; contextLabel: string; }
export interface LockScreenHighlightDto { id: string; title: string; description: string; }
export interface LockScreenFieldDto { label: string; placeholder: string; autocomplete: string; }
export interface LockScreenValidationCopyDto { passwordRequired: string; }
export interface LockScreenFeedbackDto { successTitle: string; successMessage: string; invalidPassword: string; unavailable: string; }
export interface LockScreenViewDto {
  branding: LockScreenBrandingDto;
  hero: { eyebrow: string; title: string; description: string; highlights: readonly LockScreenHighlightDto[] };
  form: {
    eyebrow: string; title: string; description: string; identity: { name: string; detail: string; initials: string };
    password: LockScreenFieldDto; passwordHint: string; submitLabel: string; submittingLabel: string; demoNotice: string;
    backToSignIn: { prompt: string; label: string; href: string }; validation: LockScreenValidationCopyDto; feedback: LockScreenFeedbackDto;
  };
  legal: { privacyLabel: string; privacyHref: string; termsLabel: string; termsHref: string };
}
export interface LockScreenRequestDto { password: string; }
export interface LockScreenCommandDto { password: string; }
export type LockScreenValidationErrorCode = 'password-required';
export type LockScreenFailureReasonDto = 'invalid-password' | 'unavailable';
export type LockScreenResultDto = { status: 'success' } | { status: 'failure'; reason: LockScreenFailureReasonDto };
export type LockScreenSubmissionDto = LockScreenResultDto | { status: 'invalid'; error: LockScreenValidationErrorCode };
