'use client';

import { reqGetUser } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const { replace } = useRouter();

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await reqGetUser();
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setUser(res.data.data);
    } catch {
      setUser(null);
      replace('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isLoading };
}
