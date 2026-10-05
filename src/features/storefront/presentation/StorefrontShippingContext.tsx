import { useMemo, useState, type ReactNode } from 'react';
import type { StorefrontShippingSelection } from '../application/storefront.shipping';
import { StorefrontShippingContext } from './storefrontShipping.context';

export function StorefrontShippingProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<StorefrontShippingSelection | null>(null);

  const value = useMemo(() => ({
    selection,
    selectPickup: () => setSelection({ method: 'pickup' }),
    selectZone: (zoneId: string) => setSelection({ method: 'delivery', zoneId }),
    clearSelection: () => setSelection(null),
  }), [selection]);

  return (
    <StorefrontShippingContext.Provider value={value}>
      {children}
    </StorefrontShippingContext.Provider>
  );
}
