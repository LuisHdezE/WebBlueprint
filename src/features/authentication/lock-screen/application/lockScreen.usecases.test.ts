import { describe, expect, it, vi } from 'vitest';
import { submitLockScreen, validateLockScreenRequest } from './lockScreen.usecases';
describe('lock screen use cases', () => {
  it.each(['', '   '])('requires a password: %j', (password) => expect(validateLockScreenRequest({ password })).toBe('password-required'));
  it('does not cross the gateway when blank', async () => { const gateway = { unlock: vi.fn() }; expect(await submitLockScreen(gateway, { password: ' ' })).toEqual({ status: 'invalid', error: 'password-required' }); expect(gateway.unlock).not.toHaveBeenCalled(); });
  it('preserves password semantics for the gateway', async () => { const gateway = { unlock: vi.fn().mockResolvedValue({ status: 'success' }) }; expect(await submitLockScreen(gateway, { password: '  secret  ' })).toEqual({ status: 'success' }); expect(gateway.unlock).toHaveBeenCalledWith({ password: '  secret  ' }); });
  it('maps provider exceptions to unavailable', async () => { const gateway = { unlock: vi.fn().mockRejectedValue(new Error('private')) }; expect(await submitLockScreen(gateway, { password: 'secret' })).toEqual({ status: 'failure', reason: 'unavailable' }); });
  it.each(['invalid-password', 'unavailable'] as const)('preserves gateway failure %s', async (reason) => { const gateway = { unlock: vi.fn().mockResolvedValue({ status: 'failure', reason }) }; expect(await submitLockScreen(gateway, { password: 'secret' })).toEqual({ status: 'failure', reason }); });
});
