import type { StorefrontPaymentMethodDto, StorefrontPaymentViewDto } from './storefront.payment.dto';

export type StorefrontPaymentSelection = string | null;

export interface StorefrontResolvedPayment {
  methodId: string;
  kind: StorefrontPaymentMethodDto['kind'];
  title: string;
  description: string;
  statusLabel: string;
  summaryLabel: string;
  amountMinor: number;
  currencyCode: string;
}

export interface StorefrontCheckoutPayment {
  paymentSelected: boolean;
  paymentEnabled: boolean;
  methodId?: string;
  methodTitle?: string;
  methodKind?: StorefrontPaymentMethodDto['kind'];
  statusLabel?: string;
  summaryLabel?: string;
  feeMinor?: number;
  currencyCode?: string;
}

export function isPaymentEnabled(method: StorefrontPaymentMethodDto): boolean {
  return method.enabled;
}

export function resolvePayment(
  payment: StorefrontPaymentViewDto,
  selection: StorefrontPaymentSelection,
): StorefrontResolvedPayment | null {
  const methodId = selection ?? payment.defaultMethodId;
  const method = payment.methods.find((candidate) => candidate.id === methodId);

  if (!method || !isPaymentEnabled(method)) return null;

  return {
    methodId: method.id,
    kind: method.kind,
    title: method.title,
    description: method.description,
    statusLabel: method.statusLabel,
    summaryLabel: method.summaryLabel,
    amountMinor: method.fee.amountMinor,
    currencyCode: method.fee.currencyCode,
  };
}

export function deriveCheckoutPayment(
  payment: StorefrontPaymentViewDto,
  selection: StorefrontPaymentSelection,
): StorefrontCheckoutPayment {
  const resolved = resolvePayment(payment, selection);

  if (!resolved) {
    return {
      paymentSelected: false,
      paymentEnabled: false,
    };
  }

  return {
    paymentSelected: true,
    paymentEnabled: true,
    methodId: resolved.methodId,
    methodTitle: resolved.title,
    methodKind: resolved.kind,
    statusLabel: resolved.statusLabel,
    summaryLabel: resolved.summaryLabel,
    feeMinor: resolved.amountMinor,
    currencyCode: resolved.currencyCode,
  };
}
