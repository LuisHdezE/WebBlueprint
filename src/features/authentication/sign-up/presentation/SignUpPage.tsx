import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import type {
  SignUpContentProvider,
  SignUpGateway,
} from '@/features/authentication/sign-up/application/contracts/signUp.contracts';
import type {
  SignUpFailureReasonDto,
  SignUpRequestDto,
  SignUpValidationErrorCode,
  SignUpValidationErrorsDto,
  SignUpViewDto,
} from '@/features/authentication/sign-up/application/dtos/signUp.dto';
import {
  hasSignUpValidationErrors,
  loadSignUpView,
  submitSignUp,
  validateSignUpRequest,
} from '@/features/authentication/sign-up/application/signUp.usecases';

interface SignUpPageProps {
  contentProvider: SignUpContentProvider;
  gateway: SignUpGateway;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'failure';

function validationMessage(
  code: SignUpValidationErrorCode | undefined,
  view: SignUpViewDto,
): string | undefined {
  switch (code) {
    case 'full-name-required':
      return view.form.validation.fullNameRequired;
    case 'email-required':
      return view.form.validation.emailRequired;
    case 'email-invalid':
      return view.form.validation.emailInvalid;
    case 'password-required':
      return view.form.validation.passwordRequired;
    case 'password-too-short':
      return view.form.validation.passwordTooShort;
    case 'confirm-password-required':
      return view.form.validation.confirmPasswordRequired;
    case 'passwords-mismatch':
      return view.form.validation.passwordsMismatch;
    case 'terms-required':
      return view.form.validation.termsRequired;
    default:
      return undefined;
  }
}

function failureMessage(
  reason: SignUpFailureReasonDto | null,
  view: SignUpViewDto,
): string | null {
  return reason === 'unavailable' ? view.form.feedback.unavailable : null;
}

function BrandIdentity({ branding }: { branding: SignUpViewDto['branding'] }) {
  return (
    <div className="flex items-center gap-3">
      {branding.logoUrl ? (
        <img className="size-11 rounded-xl object-contain" src={branding.logoUrl} alt={branding.name} />
      ) : (
        <div className="grid size-11 place-items-center rounded-xl bg-[var(--theme-primary)] text-sm font-bold tracking-wide text-[var(--theme-on-primary)] shadow-sm">
          {branding.mark}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-slate-900">{branding.name}</p>
        <p className="text-xs text-slate-500">{branding.contextLabel}</p>
      </div>
    </div>
  );
}

export function SignUpPage({ contentProvider, gateway }: SignUpPageProps) {
  const view = loadSignUpView(contentProvider);
  const [request, setRequest] = useState<SignUpRequestDto>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<SignUpValidationErrorsDto>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [failureReason, setFailureReason] = useState<SignUpFailureReasonDto | null>(null);

  const fullNameError = validationMessage(errors.fullName, view);
  const emailError = validationMessage(errors.email, view);
  const passwordError = validationMessage(errors.password, view);
  const confirmPasswordError = validationMessage(errors.confirmPassword, view);
  const termsError = validationMessage(errors.acceptTerms, view);
  const submitFailureMessage = failureMessage(failureReason, view);
  const isSubmitting = submissionState === 'submitting';

  function resetSubmissionState() {
    setFailureReason(null);
    setSubmissionState('idle');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSignUpRequest(request, view.form.validation.passwordMinLength);
    setErrors(nextErrors);
    setFailureReason(null);

    if (hasSignUpValidationErrors(nextErrors)) {
      setSubmissionState('idle');
      return;
    }

    setSubmissionState('submitting');

    try {
      const result = await submitSignUp(gateway, request);
      if (result.status === 'success') {
        setSubmissionState('success');
        return;
      }

      setFailureReason(result.reason);
      setSubmissionState('failure');
    } catch {
      setFailureReason('unavailable');
      setSubmissionState('failure');
    }
  }

  return (
    <main className="min-h-dvh bg-[var(--surface-page)] px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-4" aria-labelledby="sign-up-title">
      <div className="mx-auto grid min-h-[calc(100dvh-1.5rem)] max-w-[1180px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100dvh-2rem)] lg:min-h-[calc(100dvh-2rem)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-[var(--theme-primary-soft)] px-8 py-6 lg:block lg:border-r lg:border-[var(--theme-primary-muted)] xl:px-10 xl:py-7">
          <div className="pointer-events-none absolute -right-24 -top-20 size-72 rounded-full border border-[var(--theme-primary-border)]/60 bg-white/35" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full border border-[var(--theme-primary-border)]/45 bg-white/25" aria-hidden="true" />

          <div className="relative flex h-full flex-col">
            <BrandIdentity branding={view.branding} />

            <div className="mt-8 max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-primary)]">{view.hero.eyebrow}</p>
              <h1 className="mt-2 max-w-lg text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950">
                {view.hero.title}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-5 text-slate-600">{view.hero.description}</p>

              <div className="mt-5 grid gap-2 xl:grid-cols-3">
                {view.hero.highlights.map((highlight) => (
                  <article key={highlight.id} className="rounded-2xl border border-white/80 bg-white/65 p-3.5 shadow-sm backdrop-blur-sm">
                    <div className="mb-2 size-2 rounded-full bg-[var(--theme-primary)]" aria-hidden="true" />
                    <h2 className="text-[13px] font-semibold text-slate-900">{highlight.title}</h2>
                    <p className="mt-1 text-[11px] leading-4 text-slate-600">{highlight.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-5 py-5 sm:px-7 sm:py-6 lg:px-8 lg:py-4 xl:px-10">
          <div className="mx-auto w-full max-w-[500px]">
            <div className="mb-5 lg:hidden">
              <BrandIdentity branding={view.branding} />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-primary)]">{view.form.eyebrow}</p>
            <h2 id="sign-up-title" className="mt-1.5 text-[1.7rem] font-semibold tracking-[-0.03em] text-slate-950">
              {view.form.title}
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-slate-600">{view.form.description}</p>

            <form className="mt-4 space-y-3" noValidate onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-800" htmlFor="sign-up-full-name">
                    {view.form.fullName.label}
                  </label>
                  <input
                    id="sign-up-full-name"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-soft)]"
                    type="text"
                    autoComplete={view.form.fullName.autocomplete}
                    placeholder={view.form.fullName.placeholder}
                    value={request.fullName}
                    aria-invalid={Boolean(fullNameError)}
                    aria-describedby={fullNameError ? 'sign-up-full-name-error' : undefined}
                    onChange={(event) => {
                      setRequest((current) => ({ ...current, fullName: event.target.value }));
                      setErrors((current) => ({ ...current, fullName: undefined }));
                      resetSubmissionState();
                    }}
                  />
                  {fullNameError ? <p id="sign-up-full-name-error" className="mt-1 text-[11px] font-medium text-[var(--semantic-danger)]" role="alert">{fullNameError}</p> : null}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-800" htmlFor="sign-up-email">
                    {view.form.email.label}
                  </label>
                  <input
                    id="sign-up-email"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-soft)]"
                    type="email"
                    autoComplete={view.form.email.autocomplete}
                    placeholder={view.form.email.placeholder}
                    value={request.email}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'sign-up-email-error' : undefined}
                    onChange={(event) => {
                      setRequest((current) => ({ ...current, email: event.target.value }));
                      setErrors((current) => ({ ...current, email: undefined }));
                      resetSubmissionState();
                    }}
                  />
                  {emailError ? <p id="sign-up-email-error" className="mt-1 text-[11px] font-medium text-[var(--semantic-danger)]" role="alert">{emailError}</p> : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-800" htmlFor="sign-up-password">
                    {view.form.password.label}
                  </label>
                  <input
                    id="sign-up-password"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-soft)]"
                    type="password"
                    autoComplete={view.form.password.autocomplete}
                    placeholder={view.form.password.placeholder}
                    value={request.password}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? 'sign-up-password-error' : 'sign-up-password-hint'}
                    onChange={(event) => {
                      setRequest((current) => ({ ...current, password: event.target.value }));
                      setErrors((current) => ({ ...current, password: undefined, confirmPassword: undefined }));
                      resetSubmissionState();
                    }}
                  />
                  {passwordError ? (
                    <p id="sign-up-password-error" className="mt-1 text-[11px] font-medium text-[var(--semantic-danger)]" role="alert">{passwordError}</p>
                  ) : (
                    <p id="sign-up-password-hint" className="mt-1 text-[11px] text-slate-500">{view.form.passwordHint}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-800" htmlFor="sign-up-confirm-password">
                    {view.form.confirmPassword.label}
                  </label>
                  <input
                    id="sign-up-confirm-password"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[var(--theme-primary-soft)]"
                    type="password"
                    autoComplete={view.form.confirmPassword.autocomplete}
                    placeholder={view.form.confirmPassword.placeholder}
                    value={request.confirmPassword}
                    aria-invalid={Boolean(confirmPasswordError)}
                    aria-describedby={confirmPasswordError ? 'sign-up-confirm-password-error' : undefined}
                    onChange={(event) => {
                      setRequest((current) => ({ ...current, confirmPassword: event.target.value }));
                      setErrors((current) => ({ ...current, confirmPassword: undefined }));
                      resetSubmissionState();
                    }}
                  />
                  {confirmPasswordError ? <p id="sign-up-confirm-password-error" className="mt-1 text-[11px] font-medium text-[var(--semantic-danger)]" role="alert">{confirmPasswordError}</p> : null}
                </div>
              </div>

              <div>
                <div className="flex items-start gap-2.5">
                  <input
                    id="sign-up-terms"
                    className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--theme-primary-soft)]"
                    type="checkbox"
                    checked={request.acceptTerms}
                    aria-invalid={Boolean(termsError)}
                    aria-describedby={termsError ? 'sign-up-terms-error' : undefined}
                    onChange={(event) => {
                      setRequest((current) => ({ ...current, acceptTerms: event.target.checked }));
                      setErrors((current) => ({ ...current, acceptTerms: undefined }));
                      resetSubmissionState();
                    }}
                  />
                  <p className="text-xs leading-4 text-slate-600">
                    <label htmlFor="sign-up-terms">{view.form.terms.prefix}</label>{' '}
                    <Link className="font-semibold text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)]" to={view.form.terms.termsHref}>{view.form.terms.termsLabel}</Link>{' '}
                    {view.form.terms.connector}{' '}
                    <Link className="font-semibold text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)]" to={view.form.terms.privacyHref}>{view.form.terms.privacyLabel}</Link>.
                  </p>
                </div>
                {termsError ? <p id="sign-up-terms-error" className="mt-1 text-[11px] font-medium text-[var(--semantic-danger)]" role="alert">{termsError}</p> : null}
              </div>

              {submissionState === 'success' ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2" role="status" aria-live="polite">
                  <p className="text-xs font-semibold text-emerald-800">{view.form.feedback.successTitle}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-emerald-700">{view.form.feedback.successMessage}</p>
                </div>
              ) : null}

              {submissionState === 'failure' && submitFailureMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                  {submitFailureMessage}
                </div>
              ) : null}

              <button
                className="w-full rounded-xl bg-[var(--theme-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--theme-on-primary)] shadow-sm transition hover:bg-[var(--theme-primary-hover)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--theme-primary-soft)] disabled:cursor-not-allowed disabled:opacity-65"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? view.form.submittingLabel : view.form.submitLabel}
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-slate-600">
              {view.form.backToSignIn.prompt}{' '}
              <Link className="font-semibold text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)]" to={view.form.backToSignIn.href}>
                {view.form.backToSignIn.label}
              </Link>
            </p>

            <div className="mt-3 flex items-center justify-center gap-4 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
              <Link className="hover:text-slate-800" to={view.legal.privacyHref}>{view.legal.privacyLabel}</Link>
              <span aria-hidden="true">•</span>
              <Link className="hover:text-slate-800" to={view.legal.termsHref}>{view.legal.termsLabel}</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
