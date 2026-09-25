import type {
  SignUpBrandingDto,
  SignUpFeedbackDto,
  SignUpFieldDto,
  SignUpHighlightDto,
  SignUpValidationCopyDto,
  SignUpViewDto,
} from '@/features/authentication/sign-up/application/dtos/signUp.dto';

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown, field: string): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid ${field}: expected object`);
  }
  return value as JsonRecord;
}

function asString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid ${field}: expected non-empty string`);
  }
  return value;
}

function asNullableString(value: unknown, field: string): string | null {
  return value === null ? null : asString(value, field);
}

function asPositiveInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid ${field}: expected positive integer`);
  }
  return value;
}

function mapBranding(value: unknown): SignUpBrandingDto {
  const record = asRecord(value, 'branding');
  return {
    mark: asString(record.mark, 'branding.mark'),
    name: asString(record.name, 'branding.name'),
    logoUrl: asNullableString(record.logoUrl, 'branding.logoUrl'),
    contextLabel: asString(record.contextLabel, 'branding.contextLabel'),
  };
}

function mapHighlights(value: unknown): readonly SignUpHighlightDto[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('Invalid hero.highlights: expected non-empty array');
  }
  return value.map((item, index) => {
    const record = asRecord(item, `hero.highlights[${index}]`);
    return {
      id: asString(record.id, `hero.highlights[${index}].id`),
      title: asString(record.title, `hero.highlights[${index}].title`),
      description: asString(record.description, `hero.highlights[${index}].description`),
    };
  });
}

function mapField(value: unknown, field: string): SignUpFieldDto {
  const record = asRecord(value, field);
  return {
    label: asString(record.label, `${field}.label`),
    placeholder: asString(record.placeholder, `${field}.placeholder`),
    autocomplete: asString(record.autocomplete, `${field}.autocomplete`),
  };
}

function mapValidation(value: unknown): SignUpValidationCopyDto {
  const record = asRecord(value, 'form.validation');
  return {
    fullNameRequired: asString(record.fullNameRequired, 'form.validation.fullNameRequired'),
    emailRequired: asString(record.emailRequired, 'form.validation.emailRequired'),
    emailInvalid: asString(record.emailInvalid, 'form.validation.emailInvalid'),
    passwordRequired: asString(record.passwordRequired, 'form.validation.passwordRequired'),
    passwordTooShort: asString(record.passwordTooShort, 'form.validation.passwordTooShort'),
    passwordMinLength: asPositiveInteger(record.passwordMinLength, 'form.validation.passwordMinLength'),
    confirmPasswordRequired: asString(record.confirmPasswordRequired, 'form.validation.confirmPasswordRequired'),
    passwordsMismatch: asString(record.passwordsMismatch, 'form.validation.passwordsMismatch'),
    termsRequired: asString(record.termsRequired, 'form.validation.termsRequired'),
  };
}

function mapFeedback(value: unknown): SignUpFeedbackDto {
  const record = asRecord(value, 'form.feedback');
  return {
    successTitle: asString(record.successTitle, 'form.feedback.successTitle'),
    successMessage: asString(record.successMessage, 'form.feedback.successMessage'),
    unavailable: asString(record.unavailable, 'form.feedback.unavailable'),
  };
}

export function mapSignUpViewDto(value: unknown): SignUpViewDto {
  const root = asRecord(value, 'sign-up view');
  const hero = asRecord(root.hero, 'hero');
  const form = asRecord(root.form, 'form');
  const terms = asRecord(form.terms, 'form.terms');
  const backToSignIn = asRecord(form.backToSignIn, 'form.backToSignIn');
  const legal = asRecord(root.legal, 'legal');

  return {
    branding: mapBranding(root.branding),
    hero: {
      eyebrow: asString(hero.eyebrow, 'hero.eyebrow'),
      title: asString(hero.title, 'hero.title'),
      description: asString(hero.description, 'hero.description'),
      highlights: mapHighlights(hero.highlights),
    },
    form: {
      eyebrow: asString(form.eyebrow, 'form.eyebrow'),
      title: asString(form.title, 'form.title'),
      description: asString(form.description, 'form.description'),
      fullName: mapField(form.fullName, 'form.fullName'),
      email: mapField(form.email, 'form.email'),
      password: mapField(form.password, 'form.password'),
      confirmPassword: mapField(form.confirmPassword, 'form.confirmPassword'),
      passwordHint: asString(form.passwordHint, 'form.passwordHint'),
      terms: {
        prefix: asString(terms.prefix, 'form.terms.prefix'),
        termsLabel: asString(terms.termsLabel, 'form.terms.termsLabel'),
        termsHref: asString(terms.termsHref, 'form.terms.termsHref'),
        connector: asString(terms.connector, 'form.terms.connector'),
        privacyLabel: asString(terms.privacyLabel, 'form.terms.privacyLabel'),
        privacyHref: asString(terms.privacyHref, 'form.terms.privacyHref'),
      },
      submitLabel: asString(form.submitLabel, 'form.submitLabel'),
      submittingLabel: asString(form.submittingLabel, 'form.submittingLabel'),
      backToSignIn: {
        prompt: asString(backToSignIn.prompt, 'form.backToSignIn.prompt'),
        label: asString(backToSignIn.label, 'form.backToSignIn.label'),
        href: asString(backToSignIn.href, 'form.backToSignIn.href'),
      },
      validation: mapValidation(form.validation),
      feedback: mapFeedback(form.feedback),
    },
    legal: {
      privacyLabel: asString(legal.privacyLabel, 'legal.privacyLabel'),
      privacyHref: asString(legal.privacyHref, 'legal.privacyHref'),
      termsLabel: asString(legal.termsLabel, 'legal.termsLabel'),
      termsHref: asString(legal.termsHref, 'legal.termsHref'),
    },
  };
}
