'use client';

import { useAuth } from '@/hooks/useAuth';
import { useLeadsSocket } from '@/hooks/useLeadsSocket';
import { Loading } from '@/components/ui/loading';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  useLeadsSocket();

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
