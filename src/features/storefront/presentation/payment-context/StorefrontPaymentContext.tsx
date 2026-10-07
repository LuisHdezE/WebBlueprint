import { createContext } from 'react';
import type { StorefrontPaymentState } from './payment-state';

export interface StorefrontPaymentContextValue {
  state: StorefrontPaymentState;
  selectedPaymentMethodId: string | null;
  selectPaymentMethod: (paymentMethodId: string) => void;
  resetPayment: () => void;
}

export const StorefrontPaymentContext = createContext<StorefrontPaymentContextValue | null>(null);
