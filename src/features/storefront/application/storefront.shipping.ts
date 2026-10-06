import type { StorefrontInteractiveCart } from './storefront.cart';
import type { StorefrontShippingViewDto } from './storefront.dto';

export type StorefrontShippingSelection =
  | { method: 'pickup' }
  | { method: 'delivery'; zoneId: string };

export interface StorefrontShippingQuote {
  method: StorefrontShippingSelection['method'];
  optionId: string;
  title: string;
  description: string;
  amountMinor: number;
  currencyCode: string;
  etaLabel: string;
  coverageLabel?: string;
}

export interface StorefrontCheckoutPricing {
  subtotalMinor: number;
  shippingMinor?: number;
  totalMinor?: number;
  currencyCode?: string;
  shippingSelected: boolean;
  hasCurrencyMismatch: boolean;
}

export function resolveStorefrontShippingQuote(
  shipping: StorefrontShippingViewDto,
  selection: StorefrontShippingSelection | null,
): StorefrontShippingQuote | null {
  if (!selection) return null;

  if (selection.method === 'pickup') {
    return {
      method: 'pickup',
      optionId: shipping.pickup.id,
      title: shipping.pickup.title,
      description: shipping.pickup.description,
      amountMinor: shipping.pickup.price.amountMinor,
      currencyCode: shipping.pickup.price.currencyCode,
      etaLabel: shipping.pickup.etaLabel,
    };
  }

  const zone = shipping.zones.find((candidate) => candidate.id === selection.zoneId);
  if (!zone) return null;

  return {
    method: 'delivery',
    optionId: zone.id,
    title: zone.name,
    description: zone.description,
    amountMinor: zone.price.amountMinor,
    currencyCode: zone.price.currencyCode,
    etaLabel: zone.etaLabel,
    coverageLabel: zone.coverageLabel,
  };
}

export function deriveStorefrontCheckoutPricing(
  cart: StorefrontInteractiveCart,
  quote: StorefrontShippingQuote | null,
): StorefrontCheckoutPricing {
  const currencyCode = cart.currencyCode;

  if (!currencyCode || cart.hasMixedCurrencies) {
    return {
      subtotalMinor: cart.subtotalMinor,
      shippingSelected: Boolean(quote),
      hasCurrencyMismatch: false,
    };
  }

  if (!quote) {
    return {
      subtotalMinor: cart.subtotalMinor,
      totalMinor: cart.subtotalMinor,
      currencyCode,
      shippingSelected: false,
      hasCurrencyMismatch: false,
    };
  }

  if (quote.currencyCode !== currencyCode) {
    return {
      subtotalMinor: cart.subtotalMinor,
      shippingMinor: quote.amountMinor,
      currencyCode,
      shippingSelected: true,
      hasCurrencyMismatch: true,
    };
  }

  return {
    subtotalMinor: cart.subtotalMinor,
    shippingMinor: quote.amountMinor,
    totalMinor: cart.subtotalMinor + quote.amountMinor,
    currencyCode,
    shippingSelected: true,
    hasCurrencyMismatch: false,
  };
}

export function formatStorefrontMoney(currencyCode: string, amountMinor: number) {
  const integerAmount = Math.round(amountMinor / 100);
  return `${currencyCode} ${new Intl.NumberFormat('es-UY', {
    maximumFractionDigits: 0,
  }).format(integerAmount)}`;
}
