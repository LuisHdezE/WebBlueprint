import { describe, expect, it } from 'vitest';
import rawView from '@/features/authentication/password-reset/infrastructure/password-reset.view.json';
import { JsonPasswordResetContentProvider } from '@/features/authentication/password-reset/infrastructure/JsonPasswordResetContentProvider';
import { MockPasswordResetGateway } from '@/features/authentication/password-reset/infrastructure/MockPasswordResetGateway';
import { mapPasswordResetViewDto } from '@/features/authentication/password-reset/infrastructure/mappers/mapPasswordResetViewDto';

describe('password reset adapters', () => {
  it('maps governed JSON content into the view DTO', () => {
    const view = mapPasswordResetViewDto(rawView);

    expect(view.form.title).toBe('Restablecer contraseña');
    expect(view.form.email.autocomplete).toBe('email');
    expect(view.form.backToSignIn.href).toBe('/authentication/sign-in');
  });

  it('exposes mapped content through the provider', () => {
    const provider = new JsonPasswordResetContentProvider();

    expect(provider.getView().branding.name).toBe('WebBlueprint');
  });

  it('supports deterministic success and unavailable gateway modes', async () => {
    await expect(new MockPasswordResetGateway('success').requestReset({ email: 'user@example.com' })).resolves.toEqual({ status: 'success' });
    await expect(new MockPasswordResetGateway('unavailable').requestReset({ email: 'user@example.com' })).resolves.toEqual({ status: 'failure', reason: 'unavailable' });
  });
});
