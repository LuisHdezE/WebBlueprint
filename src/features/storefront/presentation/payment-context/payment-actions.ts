export type StorefrontPaymentAction =
  | { type: 'payment/select-method'; paymentMethodId: string }
  | { type: 'payment/reset' };

export function selectPaymentMethod(paymentMethodId: string): StorefrontPaymentAction {
  return { type: 'payment/select-method', paymentMethodId };
}

export function resetPayment(): StorefrontPaymentAction {
  return { type: 'payment/reset' };
}
