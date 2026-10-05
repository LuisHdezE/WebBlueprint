import { describe, expect, it } from 'vitest';
import type { StorefrontInteractiveCart } from './storefront.cart';
import type { StorefrontShippingViewDto } from './storefront.dto';
import {
  deriveStorefrontCheckoutPricing,
  formatStorefrontMoney,
  resolveStorefrontShippingQuote,
} from './storefront.shipping';

const shipping: StorefrontShippingViewDto = {
  eyebrow: 'Envíos',
  title: 'Tarifas',
  description: 'Demo',
  stateLabel: 'Demo',
  returnToCheckoutLabel: 'Volver',
  returnToCheckoutHref: '/store/checkout',
  pickup: {
    id: 'pickup',
    title: 'Retiro',
    description: 'Sin costo',
    price: { amountMinor: 0, currencyCode: 'UYU' },
    etaLabel: 'Coordinar',
  },
  zones: [
    {
      id: 'zone-a',
      name: 'Zona A',
      description: 'Centro',
      price: { amountMinor: 18000, currencyCode: 'UYU' },
      etaLabel: '24 h',
      coverageLabel: 'A',
    },
  ],
  addressPreview: {
    title: 'Dirección',
    description: 'Demo',
    fields: [],
  },
  notices: [],
};

const cart: StorefrontInteractiveCart = {
  lines: [],
  itemCount: 2,
  subtotalMinor: 658000,
  currencyCode: 'UYU',
  hasMixedCurrencies: false,
};

describe('storefront shipping calculation', () => {
  it('resolves pickup from structured provider money without parsing labels', () => {
    const quote = resolveStorefrontShippingQuote(shipping, { method: 'pickup' });

    expect(quote?.amountMinor).toBe(0);
    expect(quote?.currencyCode).toBe('UYU');
    expect(quote?.method).toBe('pickup');
  });

  it('resolves a delivery zone and adds its structured tariff to checkout', () => {
    const quote = resolveStorefrontShippingQuote(shipping, { method: 'delivery', zoneId: 'zone-a' });
    const pricing = deriveStorefrontCheckoutPricing(cart, quote);

    expect(quote?.amountMinor).toBe(18000);
    expect(pricing.shippingMinor).toBe(18000);
    expect(pricing.totalMinor).toBe(676000);
    expect(pricing.shippingSelected).toBe(true);
    expect(pricing.hasCurrencyMismatch).toBe(false);
  });

  it('keeps subtotal visible while shipping is still unselected', () => {
    const pricing = deriveStorefrontCheckoutPricing(cart, null);

    expect(pricing.totalMinor).toBe(658000);
    expect(pricing.shippingMinor).toBeUndefined();
    expect(pricing.shippingSelected).toBe(false);
  });

  it('rejects unknown zones and refuses cross-currency addition', () => {
    expect(resolveStorefrontShippingQuote(shipping, { method: 'delivery', zoneId: 'missing' })).toBeNull();

    const usdShipping = {
      ...shipping,
      zones: [{
        ...shipping.zones[0],
        price: { amountMinor: 500, currencyCode: 'USD' },
      }],
    };
    const quote = resolveStorefrontShippingQuote(usdShipping, { method: 'delivery', zoneId: 'zone-a' });
    const pricing = deriveStorefrontCheckoutPricing(cart, quote);

    expect(pricing.totalMinor).toBeUndefined();
    expect(pricing.hasCurrencyMismatch).toBe(true);
  });

  it('formats structured minor-unit money for display', () => {
    expect(formatStorefrontMoney('UYU', 32000)).toBe('UYU 320');
  });
});
