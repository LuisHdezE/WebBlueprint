import type { StorefrontPaymentState } from './payment-state';

export function getSelectedPaymentMethodId(state: StorefrontPaymentState): string | null {
  return state.selectedPaymentMethodId;
}
