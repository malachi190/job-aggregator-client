import { useAuth, useUser } from "@clerk/tanstack-react-start";
import { useEffect, useRef } from "react";
import { api, refreshPasswordSession } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiResponse, User } from "@/types";

interface AuthResponse {
  accessToken: string;
  user: User;
}

export function useSessionBootstrap() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const started = useRef(false);

  useEffect(() => {
    if (!isLoaded || started.current) return;
    if (isSignedIn && !clerkUser) return;

    started.current = true;
    // Clear credentials left by older versions that persisted auth in Zustand.
    window.localStorage.removeItem("auth-storage");

    const restoreSession = async () => {
      if (isSignedIn) {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Missing Clerk session token");

        const { data } = await api.post<ApiResponse<AuthResponse>>(
          "/auth/login?provider=clerk",
          {},
          { headers: { Authorization: `Bearer ${clerkToken}` } },
        );
        useAuthStore
          .getState()
          .setSession(data.data.accessToken, "clerk", data.data.user);
        return;
      }

      await refreshPasswordSession();
    };

    void restoreSession()
      .catch(() => useAuthStore.getState().clearAuth())
      .finally(() => useAuthStore.getState().setInitialized(true));
  }, [clerkUser, getToken, isLoaded, isSignedIn]);
}
