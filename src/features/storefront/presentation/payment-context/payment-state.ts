export interface StorefrontPaymentState {
  selectedPaymentMethodId: string | null;
}

export const initialStorefrontPaymentState: StorefrontPaymentState = {
  selectedPaymentMethodId: null,
};
