import { useCallback, useMemo, useReducer, type ReactNode } from 'react';
import { resetPayment, selectPaymentMethod } from './payment-actions';
import { storefrontPaymentReducer } from './payment-reducer';
import { getSelectedPaymentMethodId } from './payment-selectors';
import { initialStorefrontPaymentState } from './payment-state';
import { StorefrontPaymentContext } from './StorefrontPaymentContext';

export function StorefrontPaymentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storefrontPaymentReducer, initialStorefrontPaymentState);
  const handleSelectPaymentMethod = useCallback((paymentMethodId: string) => {
    dispatch(selectPaymentMethod(paymentMethodId));
  }, []);
  const handleResetPayment = useCallback(() => {
    dispatch(resetPayment());
  }, []);

  const value = useMemo(() => ({
    state,
    selectedPaymentMethodId: getSelectedPaymentMethodId(state),
    selectPaymentMethod: handleSelectPaymentMethod,
    resetPayment: handleResetPayment,
  }), [handleResetPayment, handleSelectPaymentMethod, state]);

  return (
    <StorefrontPaymentContext.Provider value={value}>
      {children}
    </StorefrontPaymentContext.Provider>
  );
}
