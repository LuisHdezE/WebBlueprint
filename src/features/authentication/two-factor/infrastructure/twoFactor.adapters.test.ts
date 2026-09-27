import { describe, expect, it } from 'vitest';
import rawView from './two-factor.view.json';
import { JsonTwoFactorContentProvider } from './JsonTwoFactorContentProvider';
import { MockTwoFactorGateway } from './MockTwoFactorGateway';
import { mapTwoFactorViewDto } from './mappers/mapTwoFactorViewDto';

describe('two factor adapters', () => {
  it('maps the governed content into a complete DTO', () => {
    const view = new JsonTwoFactorContentProvider().getView();
    expect(view.form.code.autocomplete).toBe('one-time-code');
    expect(view.form.codeLength).toBe(6);
    expect(view.form.demoNotice).toContain('demostración');
    expect(view.form.backToSignIn.href).toBe('/authentication/sign-in');
  });
  it.each([null, [], {}, { ...rawView, branding: null }, { ...rawView, form: { ...rawView.form, code: {} } }, { ...rawView, form: { ...rawView.form, codeLength: 0 } }, { ...rawView, form: { ...rawView.form, codeLength: 6.5 } }, { ...rawView, form: { ...rawView.form, feedback: { ...rawView.form.feedback, expiredCode: '' } } }])('fails closed for malformed content', (value) => {
    expect(() => mapTwoFactorViewDto(value)).toThrow();
  });
  it.each(['success', 'invalid-code', 'expired-code', 'unavailable'] as const)('keeps mock mode %s independent of submitted code', async (mode) => {
    const gateway = new MockTwoFactorGateway(mode, 0);
    const expected = mode === 'success' ? { status: 'success' } : { status: 'failure', reason: mode };
    for (const code of ['000000', '123456']) expect(await gateway.verifyCode({ code })).toEqual(expected);
  });
});
