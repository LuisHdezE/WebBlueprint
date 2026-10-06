import { describe, expect, it } from 'vitest';
import type { StorefrontPaymentViewDto } from './storefront.payment.dto';
import { deriveCheckoutPayment, isPaymentEnabled, resolvePayment } from './storefront.payment';

const paymentView: StorefrontPaymentViewDto = {
  eyebrow: 'Pago demo',
  title: 'Selecciona un método de pago',
  description: 'Métodos visuales sin integración transaccional.',
  stateLabel: 'Demo sin cobros reales',
  defaultMethodId: 'card',
  methods: [
    {
      id: 'card',
      kind: 'card',
      title: 'Tarjeta',
      description: 'Pago con tarjeta mediante proveedor futuro.',
      statusLabel: 'Demo habilitado',
      summaryLabel: 'Tarjeta demo',
      enabled: true,
      fee: { amountMinor: 0, currencyCode: 'UYU' },
    },
    {
      id: 'cash',
      kind: 'cash',
      title: 'Efectivo',
      description: 'Pago coordinado al retirar o recibir.',
      statusLabel: 'Demo habilitado',
      summaryLabel: 'Efectivo demo',
      enabled: true,
      fee: { amountMinor: 0, currencyCode: 'UYU' },
    },
    {
      id: 'disabled-method',
      kind: 'mercado-pago',
      title: 'Método deshabilitado',
      description: 'No debe resolverse.',
      statusLabel: 'No disponible',
      summaryLabel: 'No disponible',
      enabled: false,
      fee: { amountMinor: 0, currencyCode: 'UYU' },
    },
  ],
  disabledNotice: {
    title: 'Método no disponible',
    description: 'Selecciona otro método demo.',
  },
  notices: [],
};

describe('storefront payment domain', () => {
  it('resolves the default enabled payment method without processing a payment', () => {
    const payment = resolvePayment(paymentView, null);

    expect(payment).toMatchObject({
      methodId: 'card',
      kind: 'card',
      title: 'Tarjeta',
      amountMinor: 0,
      currencyCode: 'UYU',
    });
  });

  it('resolves an explicit enabled selection', () => {
    const payment = resolvePayment(paymentView, 'cash');

    expect(payment?.methodId).toBe('cash');
    expect(payment?.summaryLabel).toBe('Efectivo demo');
  });

  it('does not resolve unknown or disabled methods', () => {
    expect(resolvePayment(paymentView, 'missing')).toBeNull();
    expect(resolvePayment(paymentView, 'disabled-method')).toBeNull();
    expect(isPaymentEnabled(paymentView.methods[2])).toBe(false);
  });

  it('derives checkout payment state from the selected method', () => {
    const payment = deriveCheckoutPayment(paymentView, 'card');

    expect(payment).toEqual({
      paymentSelected: true,
      paymentEnabled: true,
      methodId: 'card',
      methodTitle: 'Tarjeta',
      methodKind: 'card',
      statusLabel: 'Demo habilitado',
      summaryLabel: 'Tarjeta demo',
      feeMinor: 0,
      currencyCode: 'UYU',
    });
  });

  it('keeps unsupported checkout payment state safe and non-transactional', () => {
    const payment = deriveCheckoutPayment(paymentView, 'disabled-method');

    expect(payment).toEqual({
      paymentSelected: false,
      paymentEnabled: false,
    });
  });
});
