import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

type SessionUser = {
  id: string;
  displayName: string;
};

type SessionContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  signIn: (displayName: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      signIn: (displayName) => {
        const normalizedName = displayName.trim();

        if (!normalizedName) {
          throw new Error('A display name is required to start the demo session.');
        }

        setUser({ id: 'mock-user', displayName: normalizedName });
      },
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }

  return context;
}
