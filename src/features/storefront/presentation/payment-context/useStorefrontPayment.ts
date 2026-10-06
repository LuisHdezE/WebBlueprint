import { useContext } from 'react';
import { StorefrontPaymentContext } from './StorefrontPaymentContext';

export function useStorefrontPayment() {
  const context = useContext(StorefrontPaymentContext);
  if (!context) throw new Error('useStorefrontPayment must be used inside StorefrontPaymentProvider.');
  return context;
}
