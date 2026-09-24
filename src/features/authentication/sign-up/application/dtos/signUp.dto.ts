export interface SignUpBrandingDto {
  mark: string;
  name: string;
  logoUrl: string | null;
  contextLabel: string;
}

export interface SignUpHighlightDto {
  id: string;
  title: string;
  description: string;
}

export interface SignUpFieldDto {
  label: string;
  placeholder: string;
  autocomplete: string;
}

export interface SignUpValidationCopyDto {
  fullNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordTooShort: string;
  passwordMinLength: number;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
  termsRequired: string;
}

export interface SignUpFeedbackDto {
  successTitle: string;
  successMessage: string;
  unavailable: string;
}

export interface SignUpViewDto {
  branding: SignUpBrandingDto;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    highlights: readonly SignUpHighlightDto[];
  };
  form: {
    eyebrow: string;
    title: string;
    description: string;
    fullName: SignUpFieldDto;
    email: SignUpFieldDto;
    password: SignUpFieldDto;
    confirmPassword: SignUpFieldDto;
    passwordHint: string;
    terms: {
      prefix: string;
      termsLabel: string;
      termsHref: string;
      connector: string;
      privacyLabel: string;
      privacyHref: string;
    };
    submitLabel: string;
    submittingLabel: string;
    backToSignIn: {
      prompt: string;
      label: string;
      href: string;
    };
    validation: SignUpValidationCopyDto;
    feedback: SignUpFeedbackDto;
  };
  legal: {
    privacyLabel: string;
    privacyHref: string;
    termsLabel: string;
    termsHref: string;
  };
}

export interface SignUpRequestDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface SignUpCommandDto {
  fullName: string;
  email: string;
  password: string;
}

export type SignUpValidationErrorCode =
  | 'full-name-required'
  | 'email-required'
  | 'email-invalid'
  | 'password-required'
  | 'password-too-short'
  | 'confirm-password-required'
  | 'passwords-mismatch'
  | 'terms-required';

export interface SignUpValidationErrorsDto {
  fullName?: SignUpValidationErrorCode | undefined;
  email?: SignUpValidationErrorCode | undefined;
  password?: SignUpValidationErrorCode | undefined;
  confirmPassword?: SignUpValidationErrorCode | undefined;
  acceptTerms?: SignUpValidationErrorCode | undefined;
}

export type SignUpFailureReasonDto = 'unavailable';

export type SignUpResultDto =
  | { status: 'success' }
  | { status: 'failure'; reason: SignUpFailureReasonDto };
