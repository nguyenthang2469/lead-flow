import { create } from 'zustand';
import type { TUser } from '@repo/types';
import { reqLogout } from '@/services/auth.service';

interface AuthState {
  user: TUser | null;
  isLoading: boolean; // Checking authentication status
  setUser: (user: TUser | null) => void;
  setLoading: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => {
    set({ user, isLoading: false });
  },
  setLoading: (status) => set({ isLoading: status }),
  logout: async () => {
    try {
      await reqLogout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      set({ user: null, isLoading: false });
      window.location.href = '/login';
    }
  },
}));
