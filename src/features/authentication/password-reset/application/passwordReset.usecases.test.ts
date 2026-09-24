import { describe, expect, it } from 'vitest';
import type { PasswordResetGateway } from '@/features/authentication/password-reset/application/contracts/passwordReset.contracts';
import type { PasswordResetRequestDto } from '@/features/authentication/password-reset/application/dtos/passwordReset.dto';
import {
  hasPasswordResetValidationErrors,
  submitPasswordReset,
  validatePasswordResetRequest,
} from '@/features/authentication/password-reset/application/passwordReset.usecases';

class CapturingGateway implements PasswordResetGateway {
  request: PasswordResetRequestDto | null = null;

  async requestReset(request: PasswordResetRequestDto) {
    this.request = request;
    return { status: 'success' as const };
  }
}

describe('password reset use cases', () => {
  it('rejects empty and malformed email addresses', () => {
    expect(validatePasswordResetRequest({ email: '   ' })).toEqual({ email: 'email-required' });
    expect(validatePasswordResetRequest({ email: 'not-an-email' })).toEqual({ email: 'email-invalid' });
    expect(hasPasswordResetValidationErrors({ email: 'email-invalid' })).toBe(true);
  });

  it('accepts a valid email address', () => {
    expect(validatePasswordResetRequest({ email: 'user@example.com' })).toEqual({});
    expect(hasPasswordResetValidationErrors({})).toBe(false);
  });

  it('normalizes the email before crossing the gateway boundary', async () => {
    const gateway = new CapturingGateway();

    await submitPasswordReset(gateway, { email: '  User@Example.COM  ' });

    expect(gateway.request).toEqual({ email: 'user@example.com' });
  });
});
