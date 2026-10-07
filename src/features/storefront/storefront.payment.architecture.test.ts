import { readFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
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
      'src/features/storefront/presentation/StorefrontCheckoutPage.tsx',
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

  it('renders interactive checkout payment selection from the payment context', () => {
    const checkout = readFileSync('src/features/storefront/presentation/StorefrontCheckoutPage.tsx', 'utf8');

    expect(checkout).toContain('provider.getPaymentView()');
    expect(checkout).toContain('deriveCheckoutPayment(paymentView, selectedPaymentMethodId)');
    expect(checkout).toContain('useStorefrontPayment');
    expect(checkout).toContain('selectPaymentMethod(method.id)');
    expect(checkout).toContain('data-storefront-payment-method');
    expect(checkout).toContain('data-storefront-payment-selected');
    expect(checkout).toContain('data-storefront-checkout-payment-summary');
    expect(checkout).not.toContain('checkout.payment.options.map');
  });

  it('keeps payment context memory-only and decoupled from application', () => {
    const contextDirectory = 'src/features/storefront/presentation/payment-context';
    const files = readdirSync(contextDirectory)
      .filter((file) => /\.(ts|tsx)$/.test(file) && !file.endsWith('.test.ts') && !file.endsWith('.test.tsx'))
      .map((file) => readFileSync(`${contextDirectory}/${file}`, 'utf8'));
    const reducer = readFileSync(`${contextDirectory}/payment-reducer.ts`, 'utf8');
    const provider = readFileSync(`${contextDirectory}/StorefrontPaymentProvider.tsx`, 'utf8');
    const hook = readFileSync(`${contextDirectory}/useStorefrontPayment.ts`, 'utf8');
    const state = readFileSync(`${contextDirectory}/payment-state.ts`, 'utf8');
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');

    expect(state).toContain('selectedPaymentMethodId: string | null');
    expect(state).toContain('selectedPaymentMethodId: null');
    expect(provider).toContain('useReducer(storefrontPaymentReducer, initialStorefrontPaymentState)');
    expect(provider).toContain('useMemo(() => ({');
    expect(provider).toContain('<StorefrontPaymentContext.Provider value={value}>');
    expect(hook).toContain('useStorefrontPayment must be used inside StorefrontPaymentProvider.');
    expect(reducer).not.toContain('react');
    expect(router).toContain('StorefrontPaymentProvider');

    files.forEach((file) => {
      expect(file).not.toContain('../application');
      expect(file).not.toContain('@/features/storefront/application');
      expect(file).not.toContain('localStorage');
      expect(file).not.toContain('sessionStorage');
      expect(file).not.toContain('fetch(');
      expect(file).not.toContain('axios');
      expect(file).not.toContain('Stripe');
      expect(file).not.toContain('MercadoPago');
      expect(file).not.toContain('createOrder');
    });
  });
});
