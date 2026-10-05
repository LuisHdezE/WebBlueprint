import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { StorefrontCustomerSession } from '../application/storefront.session';

interface StorefrontSessionContextValue {
  customer: StorefrontCustomerSession | null;
  signIn: (customer: StorefrontCustomerSession) => void;
  signOut: () => void;
}

const StorefrontSessionContext = createContext<StorefrontSessionContextValue | undefined>(undefined);

export function StorefrontSessionProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<StorefrontCustomerSession | null>(null);

  const value = useMemo<StorefrontSessionContextValue>(() => ({
    customer,
    signIn: setCustomer,
    signOut: () => setCustomer(null),
  }), [customer]);

  return <StorefrontSessionContext.Provider value={value}>{children}</StorefrontSessionContext.Provider>;
}

export function useStorefrontSession() {
  const value = useContext(StorefrontSessionContext);
  if (!value) throw new Error('useStorefrontSession must be used inside StorefrontSessionProvider.');
  return value;
}
