import { describe, expect, it } from 'vitest';
import { JsonSignInContentProvider } from '@/features/authentication/sign-in/infrastructure/JsonSignInContentProvider';
import { MockSignInGateway } from '@/features/authentication/sign-in/infrastructure/MockSignInGateway';

describe('sign-in infrastructure adapters', () => {
  it('maps the JSON view contract into a typed DTO', () => {
    const view = new JsonSignInContentProvider().getView();

    expect(view.form.title).toBe('Iniciar sesión');
    expect(view.form.validation.passwordMinLength).toBe(8);
    expect(view.hero.highlights.length).toBeGreaterThan(0);
  });

  it('supports deterministic mock outcomes without magic credentials', async () => {
    const gateway = new MockSignInGateway('invalid-credentials');

    await expect(
      gateway.signIn({ email: 'user@example.com', password: 'password', rememberMe: false }),
    ).resolves.toEqual({ status: 'failure', reason: 'invalid-credentials' });
  });
});
