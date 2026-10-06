import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StorefrontPaymentProvider } from './StorefrontPaymentProvider';
import { useStorefrontPayment } from './useStorefrontPayment';

describe('useStorefrontPayment', () => {
  it('requires StorefrontPaymentProvider', () => {
    function Probe() {
      useStorefrontPayment();
      return null;
    }

    expect(() => renderToString(<Probe />)).toThrow('useStorefrontPayment must be used inside StorefrontPaymentProvider.');
  });

  it('exposes selectPaymentMethod inside the provider', () => {
    function Probe() {
      const payment = useStorefrontPayment();
      return <span>{typeof payment.selectPaymentMethod}</span>;
    }

    expect(renderToString(
      <StorefrontPaymentProvider>
        <Probe />
      </StorefrontPaymentProvider>,
    )).toContain('function');
  });

  it('exposes resetPayment inside the provider', () => {
    function Probe() {
      const payment = useStorefrontPayment();
      return <span>{typeof payment.resetPayment}</span>;
    }

    expect(renderToString(
      <StorefrontPaymentProvider>
        <Probe />
      </StorefrontPaymentProvider>,
    )).toContain('function');
  });
});
