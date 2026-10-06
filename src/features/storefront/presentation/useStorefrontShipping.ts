import { useContext } from 'react';
import { StorefrontShippingContext } from './storefrontShipping.context';

export function useStorefrontShipping() {
  const context = useContext(StorefrontShippingContext);
  if (!context) throw new Error('useStorefrontShipping must be used inside StorefrontShippingProvider.');
  return context;
}
