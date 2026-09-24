import type {
  SignUpCommandDto,
  SignUpRequestDto,
  SignUpResultDto,
  SignUpValidationErrorsDto,
  SignUpViewDto,
} from '@/features/authentication/sign-up/application/dtos/signUp.dto';
import type {
  SignUpContentProvider,
  SignUpGateway,
} from '@/features/authentication/sign-up/application/contracts/signUp.contracts';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function loadSignUpView(provider: SignUpContentProvider): SignUpViewDto {
  return provider.getView();
}

export function validateSignUpRequest(
  request: SignUpRequestDto,
  passwordMinLength: number,
): SignUpValidationErrorsDto {
  const errors: SignUpValidationErrorsDto = {};
  const fullName = request.fullName.trim();
  const email = request.email.trim();

  if (!fullName) errors.fullName = 'full-name-required';

  if (!email) {
    errors.email = 'email-required';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'email-invalid';
  }

  if (!request.password) {
    errors.password = 'password-required';
  } else if (request.password.length < passwordMinLength) {
    errors.password = 'password-too-short';
  }

  if (!request.confirmPassword) {
    errors.confirmPassword = 'confirm-password-required';
  } else if (request.confirmPassword !== request.password) {
    errors.confirmPassword = 'passwords-mismatch';
  }

  if (!request.acceptTerms) errors.acceptTerms = 'terms-required';

  return errors;
}

export function hasSignUpValidationErrors(errors: SignUpValidationErrorsDto): boolean {
  return Object.values(errors).some(Boolean);
}

export function normalizeSignUpCommand(request: SignUpRequestDto): SignUpCommandDto {
  return {
    fullName: request.fullName.trim().replace(/\s+/g, ' '),
    email: request.email.trim().toLowerCase(),
    password: request.password,
  };
}

export async function submitSignUp(
  gateway: SignUpGateway,
  request: SignUpRequestDto,
): Promise<SignUpResultDto> {
  return gateway.createAccount(normalizeSignUpCommand(request));
}
