import { createContext } from 'react';
import type { StorefrontShippingSelection } from '../application/storefront.shipping';

export interface StorefrontShippingContextValue {
  selection: StorefrontShippingSelection | null;
  selectPickup: () => void;
  selectZone: (zoneId: string) => void;
  clearSelection: () => void;
}

export const StorefrontShippingContext = createContext<StorefrontShippingContextValue | null>(null);
