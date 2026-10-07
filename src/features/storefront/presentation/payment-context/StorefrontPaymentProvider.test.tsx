import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StorefrontPaymentProvider } from './StorefrontPaymentProvider';
import { useStorefrontPayment } from './useStorefrontPayment';

describe('StorefrontPaymentProvider', () => {
  it('uses memoized context value for rerender optimization', () => {
    const source = readFileSync('src/features/storefront/presentation/payment-context/StorefrontPaymentProvider.tsx', 'utf8');

    expect(source).toContain('useMemo(() => ({');
    expect(source).toContain('selectedPaymentMethodId: getSelectedPaymentMethodId(state)');
    expect(source).toContain('selectPaymentMethod: handleSelectPaymentMethod');
    expect(source).toContain('resetPayment: handleResetPayment');
    expect(source).toContain('}), [handleResetPayment, handleSelectPaymentMethod, state])');
  });

  it('propagates initial payment state to consumers', () => {
    function Probe() {
      const payment = useStorefrontPayment();
      return <span>{payment.selectedPaymentMethodId ?? 'empty'}</span>;
    }

    expect(renderToString(
      <StorefrontPaymentProvider>
        <Probe />
      </StorefrontPaymentProvider>,
    )).toContain('empty');
  });
});
