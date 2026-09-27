import { describe, expect, it, vi } from 'vitest';
import { submitTwoFactor, validateTwoFactorRequest } from './twoFactor.usecases';

describe('two factor use cases', () => {
  it.each(['', '   '])('requires a code: %j', (code) => {
    expect(validateTwoFactorRequest({ code }, 6)).toBe('code-required');
  });
  it.each(['12345', '1234567', '12a456', '123 456', '１２３４５６', '123.45', '-12345'])('rejects malformed code: %j', async (code) => {
    const gateway = { verifyCode: vi.fn() };
    expect(await submitTwoFactor(gateway, { code }, 6)).toEqual({ status: 'invalid', error: 'code-invalid' });
    expect(gateway.verifyCode).not.toHaveBeenCalled();
  });
  it('blocks a blank submission before crossing the port', async () => {
    const gateway = { verifyCode: vi.fn() };
    expect(await submitTwoFactor(gateway, { code: ' ' }, 6)).toEqual({ status: 'invalid', error: 'code-required' });
    expect(gateway.verifyCode).not.toHaveBeenCalled();
  });
  it('normalizes outer whitespace and preserves leading zeros', async () => {
    const gateway = { verifyCode: vi.fn().mockResolvedValue({ status: 'success' }) };
    expect(await submitTwoFactor(gateway, { code: ' 001234 ' }, 6)).toEqual({ status: 'success' });
    expect(gateway.verifyCode).toHaveBeenCalledExactlyOnceWith({ code: '001234' });
  });
  it('uses the governed code length and rejects invalid configuration', () => {
    expect(validateTwoFactorRequest({ code: '0012' }, 4)).toBeUndefined();
    for (const length of [0, 3, 9, 6.5, NaN]) expect(validateTwoFactorRequest({ code: '001234' }, length)).toBe('code-invalid');
  });
  it.each(['invalid-code', 'expired-code', 'unavailable'] as const)('preserves gateway failure %s', async (reason) => {
    const gateway = { verifyCode: vi.fn().mockResolvedValue({ status: 'failure', reason }) };
    expect(await submitTwoFactor(gateway, { code: '001234' }, 6)).toEqual({ status: 'failure', reason });
  });
  it('maps rejected gateway requests to unavailable without exposing the exception', async () => {
    const gateway = { verifyCode: vi.fn().mockRejectedValue(new Error('internal provider detail')) };
    expect(await submitTwoFactor(gateway, { code: '001234' }, 6)).toEqual({ status: 'failure', reason: 'unavailable' });
  });
});
