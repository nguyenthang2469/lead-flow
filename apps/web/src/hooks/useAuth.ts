'use client';

import { reqGetUser } from '@/services/user.service';
import { useAuthStore } from '@/store/auth.store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const { replace } = useRouter();

  const getCurrentUser = async (signal: AbortSignal) => {
    try {
      setLoading(true);
      const data = await reqGetUser(signal);
      setUser(data);
    } catch (err) {
      if (axios.isCancel(err)) return;
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

    const controller = new AbortController();

    getCurrentUser(controller.signal);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isLoading };
}
