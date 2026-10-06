import { describe, expect, it } from 'vitest';
import { JsonStorefrontProvider } from './JsonStorefrontProvider';

describe('storefront payment provider', () => {
  it('exposes payment methods from dedicated provider JSON without real payment behavior', () => {
    const provider = new JsonStorefrontProvider();
    const payment = provider.getPaymentView();

    expect(payment.title).toContain('método de pago');
    expect(payment.defaultMethodId).toBe('card');
    expect(payment.methods.map((method) => method.id)).toEqual(['card', 'cash', 'mercado-pago']);
    expect(payment.methods.map((method) => method.kind)).toEqual(['card', 'cash', 'mercado-pago']);
    expect(payment.methods.every((method) => method.enabled)).toBe(true);
    expect(payment.methods.every((method) => method.fee.currencyCode === 'UYU')).toBe(true);
    expect(payment.methods.every((method) => method.fee.amountMinor === 0)).toBe(true);
    expect(payment.notices.map((notice) => notice.id)).toEqual([
      'no-payment-sdk',
      'no-backend',
      'no-order-mutation',
    ]);
  });
});
