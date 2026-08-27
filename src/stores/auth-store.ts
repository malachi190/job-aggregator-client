import { create } from "zustand";
import type { User } from "@/types";

type AuthProvider = "clerk" | "password";

interface AuthState {
  token: string | null;
  provider: AuthProvider | null;
  user: User | null;
  isInitialized: boolean;
  isAuthenticated: () => boolean;
  setSession: (token: string, provider: AuthProvider, user: User) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
}

// Deliberately not persisted: access tokens only live in memory. Password
// sessions are restored through the HttpOnly refresh cookie on application load.
export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  provider: null,
  user: null,
  isInitialized: false,
  isAuthenticated: () => Boolean(get().token),
  setSession: (token, provider, user) => set({ token, provider, user }),
  clearAuth: () => set({ token: null, provider: null, user: null }),
  setInitialized: (value) => set({ isInitialized: value }),
}));
