import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  provider: 'clerk' | 'password' | null;
  user: User | null;
  hasHydrated: boolean;
  isAuthenticated: () => boolean;
  setToken: (token: string, refreshToken: string, provider: 'clerk' | 'password', user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      provider: null,
      user: null,
      hasHydrated: false,
      isAuthenticated: () => Boolean(get().token),
      setToken: (token, refreshToken, provider, user) => 
        set({ token, refreshToken, provider, user }),
      clearAuth: () => 
        set({ token: null, refreshToken: null, provider: null, user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
