import type { PropsWithChildren } from 'react';
import { SessionProvider } from '@/auth/SessionContext';

export function AppProviders({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
