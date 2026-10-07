import { initialStorefrontPaymentState, type StorefrontPaymentState } from './payment-state';
import type { StorefrontPaymentAction } from './payment-actions';

export function storefrontPaymentReducer(
  state: StorefrontPaymentState,
  action: StorefrontPaymentAction,
): StorefrontPaymentState {
  switch (action.type) {
    case 'payment/select-method':
      return {
        selectedPaymentMethodId: action.paymentMethodId,
      };
    case 'payment/reset':
      return initialStorefrontPaymentState;
    default:
      return state;
  }
}
