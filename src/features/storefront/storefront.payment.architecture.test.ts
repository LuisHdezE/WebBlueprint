import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('storefront payment architecture', () => {
  it('keeps payment method selection provider-driven and non-transactional', () => {
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const dto = readFileSync('src/features/storefront/application/storefront.payment.dto.ts', 'utf8');
    const domain = readFileSync('src/features/storefront/application/storefront.payment.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const source = readFileSync('src/features/storefront/infrastructure/storefront.payment.json', 'utf8');

    expect(contracts).toContain('getPaymentView()');
    expect(dto).toContain('StorefrontPaymentMethodDto');
    expect(dto).toContain('StorefrontPaymentViewDto');
    expect(domain).toContain('resolvePayment');
    expect(domain).toContain('deriveCheckoutPayment');
    expect(domain).toContain('isPaymentEnabled');
    expect(provider).toContain("import rawPayment from './storefront.payment.json'");
    expect(provider).toContain('getPaymentView()');
    expect(source).toContain('"amountMinor"');
    expect(source).toContain('"currencyCode"');
    expect(source).toContain('"card"');
    expect(source).toContain('"cash"');
    expect(source).toContain('"mercado-pago"');
  });

  it('does not introduce payment SDKs, backend calls, storage or order mutation', () => {
    const files = [
      'src/features/storefront/application/storefront.payment.ts',
      'src/features/storefront/application/storefront.payment.dto.ts',
      'src/features/storefront/infrastructure/JsonStorefrontProvider.ts',
      'src/features/storefront/infrastructure/storefront.payment.json',
    ].map((path) => readFileSync(path, 'utf8'));

    files.forEach((file) => {
      expect(file).not.toContain('localStorage');
      expect(file).not.toContain('sessionStorage');
      expect(file).not.toContain('fetch(');
      expect(file).not.toContain('Stripe');
      expect(file).not.toContain('MercadoPago');
      expect(file).not.toContain('createOrder');
      expect(file).not.toContain('inventory');
    });
  });
});
