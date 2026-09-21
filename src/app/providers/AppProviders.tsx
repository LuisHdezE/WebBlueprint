import type { PropsWithChildren } from 'react';
import { SessionProvider } from '@/auth/SessionProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
