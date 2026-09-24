import { describe, expect, it } from 'vitest';
import { JsonSignUpContentProvider } from '@/features/authentication/sign-up/infrastructure/JsonSignUpContentProvider';
import { MockSignUpGateway } from '@/features/authentication/sign-up/infrastructure/MockSignUpGateway';

const command = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'secure-pass',
};

describe('sign up adapters', () => {
  it('maps governed JSON content into a typed view contract', () => {
    const view = new JsonSignUpContentProvider().getView();

    expect(view.form.title).toBeTruthy();
    expect(view.form.fullName.autocomplete).toBe('name');
    expect(view.form.email.autocomplete).toBe('email');
    expect(view.form.validation.passwordMinLength).toBeGreaterThan(0);
    expect(view.form.backToSignIn.href).toBe('/authentication/sign-in');
  });

  it('keeps mock behavior explicit and independent from account identifiers', async () => {
    await expect(new MockSignUpGateway('success').createAccount(command)).resolves.toEqual({ status: 'success' });
    await expect(new MockSignUpGateway('unavailable').createAccount(command)).resolves.toEqual({
      status: 'failure',
      reason: 'unavailable',
    });
  });
});
