import { describe, expect, it } from 'vitest';
import rawView from './lock-screen.view.json';
import { JsonLockScreenContentProvider } from './JsonLockScreenContentProvider';
import { MockLockScreenGateway } from './MockLockScreenGateway';
import { mapLockScreenViewDto } from './mappers/mapLockScreenViewDto';
describe('lock screen adapters', () => {
  it('maps governed content', () => { const view = new JsonLockScreenContentProvider().getView(); expect(view.form.password.autocomplete).toBe('current-password'); expect(view.form.demoNotice).toContain('demostración'); expect(view.form.identity.initials).toBe('LH'); });
  it.each([null, [], {}, { ...rawView, branding: null }, { ...rawView, form: { ...rawView.form, password: {} } }, { ...rawView, form: { ...rawView.form, feedback: { ...rawView.form.feedback, unavailable: '' } } }])('fails closed for malformed content', (value) => expect(() => mapLockScreenViewDto(value)).toThrow());
  it.each(['success', 'invalid-password', 'unavailable'] as const)('keeps mock mode %s independent of password', async (mode) => { const gateway = new MockLockScreenGateway(mode, 0); const expected = mode === 'success' ? { status: 'success' } : { status: 'failure', reason: mode }; expect(await gateway.unlock({ password: 'anything' })).toEqual(expected); });
});
