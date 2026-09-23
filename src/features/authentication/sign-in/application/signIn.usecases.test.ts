import { describe, expect, it } from 'vitest';
import type { SignInGateway } from '@/features/authentication/sign-in/application/contracts/signIn.contracts';
import type { SignInCredentialsDto } from '@/features/authentication/sign-in/application/dtos/signIn.dto';
import {
  hasSignInValidationErrors,
  submitSignIn,
  validateSignInCredentials,
} from '@/features/authentication/sign-in/application/signIn.usecases';

describe('sign-in application use cases', () => {
  it('returns validation codes without coupling application rules to presentation copy', () => {
    const errors = validateSignInCredentials(
      { email: 'not-an-email', password: 'short', rememberMe: false },
      { passwordMinLength: 8 },
    );

    expect(errors).toEqual({
      email: 'email-invalid',
      password: 'password-too-short',
    });
    expect(hasSignInValidationErrors(errors)).toBe(true);
  });

  it('normalizes email before crossing the gateway boundary and preserves the password verbatim', async () => {
    let received: SignInCredentialsDto | null = null;
    const gateway: SignInGateway = {
      async signIn(credentials) {
        received = credentials;
        return { status: 'success' };
      },
    };

    await submitSignIn(gateway, {
      email: '  USER@Example.COM  ',
      password: '  exact password  ',
      rememberMe: true,
    });

    expect(received).toEqual({
      email: 'user@example.com',
      password: '  exact password  ',
      rememberMe: true,
    });
  });
});
