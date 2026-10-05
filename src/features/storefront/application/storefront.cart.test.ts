import { describe, expect, it } from 'vitest';
import type { StorefrontCartLineDto } from './storefront.dto';
import {
  deriveStorefrontCart,
  formatCartMoney,
  getInitialCartQuantities,
  setCartLineQuantity,
} from './storefront.cart';

const lines: readonly StorefrontCartLineDto[] = [
  {
    id: 'display',
    title: 'Display',
    subtitle: 'OLED',
    href: '/display',
    badgeLabel: 'Repuesto',
    initialQuantity: 1,
    maxQuantity: 3,
    currencyCode: 'UYU',
    unitPriceMinor: 489000,
    quantityLabel: 'Cantidad demo: 1',
    unitPriceLabel: 'UYU 4.890',
    lineTotalLabel: 'UYU 4.890',
    stockLabel: 'Stock demo: 3',
    compatibilityLabel: 'iPhone 13',
  },
  {
    id: 'battery',
    title: 'Battery',
    subtitle: 'S21',
    href: '/battery',
    badgeLabel: 'Batería',
    initialQuantity: 1,
    maxQuantity: 5,
    currencyCode: 'UYU',
    unitPriceMinor: 169000,
    quantityLabel: 'Cantidad demo: 1',
    unitPriceLabel: 'UYU 1.690',
    lineTotalLabel: 'UYU 1.690',
    stockLabel: 'Stock demo: 5',
    compatibilityLabel: 'Galaxy S21',
  },
];

describe('storefront cart interaction', () => {
  it('builds deterministic initial quantities from provider data', () => {
    expect(getInitialCartQuantities(lines)).toEqual({ display: 1, battery: 1 });
  });

  it('derives item count and subtotal without mutating provider lines', () => {
    const cart = deriveStorefrontCart(lines, { display: 2, battery: 1 });

    expect(cart.itemCount).toBe(3);
    expect(cart.subtotalMinor).toBe(1147000);
    expect(cart.currencyCode).toBe('UYU');
    expect(cart.hasMixedCurrencies).toBe(false);
    expect(cart.lines.map((item) => [item.line.id, item.quantity])).toEqual([
      ['display', 2],
      ['battery', 1],
    ]);
    expect(lines[0].initialQuantity).toBe(1);
  });

  it('clamps quantity to stock demo and removes a line at zero', () => {
    expect(setCartLineQuantity({ display: 1 }, lines[0], 99)).toEqual({ display: 3 });
    expect(setCartLineQuantity({ display: 1, battery: 1 }, lines[0], 0)).toEqual({ battery: 1 });
  });

  it('detects mixed currencies instead of summing them as one total', () => {
    const usdLine = { ...lines[1], id: 'usd', currencyCode: 'USD', unitPriceMinor: 19500 };
    const cart = deriveStorefrontCart([lines[0], usdLine], { display: 1, usd: 1 });

    expect(cart.hasMixedCurrencies).toBe(true);
    expect(cart.currencyCode).toBeUndefined();
  });

  it('formats provider monetary values for storefront display', () => {
    expect(formatCartMoney('UYU', 489000)).toBe('UYU 4.890');
  });
});
