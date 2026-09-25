import { describe, expect, it } from 'vitest';
import type { SignUpGateway } from '@/features/authentication/sign-up/application/contracts/signUp.contracts';
import type { SignUpCommandDto } from '@/features/authentication/sign-up/application/dtos/signUp.dto';
import {
  hasSignUpValidationErrors,
  submitSignUp,
  validateSignUpRequest,
} from '@/features/authentication/sign-up/application/signUp.usecases';

class CapturingGateway implements SignUpGateway {
  command: SignUpCommandDto | null = null;

  async createAccount(command: SignUpCommandDto) {
    this.command = command;
    return { status: 'success' as const };
  }
}

const validRequest = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'secure-pass',
  confirmPassword: 'secure-pass',
  acceptTerms: true,
};

describe('sign up use cases', () => {
  it('requires the complete registration contract', () => {
    const errors = validateSignUpRequest(
      { fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
      8,
    );

    expect(errors).toEqual({
      fullName: 'full-name-required',
      email: 'email-required',
      password: 'password-required',
      confirmPassword: 'confirm-password-required',
      acceptTerms: 'terms-required',
    });
    expect(hasSignUpValidationErrors(errors)).toBe(true);
  });

  it('rejects malformed email, short password and mismatched confirmation', () => {
    expect(
      validateSignUpRequest(
        {
          ...validRequest,
          email: 'not-an-email',
          password: 'short',
          confirmPassword: 'different',
        },
        8,
      ),
    ).toEqual({
      email: 'email-invalid',
      password: 'password-too-short',
      confirmPassword: 'passwords-mismatch',
    });
  });

  it('accepts a valid request and normalizes only the gateway command', async () => {
    const gateway = new CapturingGateway();
    const request = {
      ...validRequest,
      fullName: '  Ada   Lovelace  ',
      email: '  Ada@Example.COM ',
    };

    expect(validateSignUpRequest(request, 8)).toEqual({});
    expect(hasSignUpValidationErrors({})).toBe(false);

    await submitSignUp(gateway, request);

    expect(gateway.command).toEqual({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secure-pass',
    });
  });
});
