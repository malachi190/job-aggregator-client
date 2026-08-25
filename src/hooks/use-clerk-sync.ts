import { useAuth, useUser } from "@clerk/tanstack-react-start";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useClerkLogin } from "./api/use-auth";

export function useClerkSync() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const provider = useAuthStore((state) => state.provider);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clerkLogin = useClerkLogin();
  const attemptCount = useRef(0);

  useEffect(() => {
    if (!isLoaded || !hasHydrated) return;

    if (isSignedIn && clerkUser && !token) {
      if (attemptCount.current >= 3) return;
      attemptCount.current++;

      void getToken().then((sessionToken) => {
        if (sessionToken) {
          clerkLogin.mutate(
            { token: sessionToken },
            {
              onError: () => {
                // Don't reset — let it retry up to 3 times total
              },
            },
          );
        }
      });
      return;
    }

    if (!isSignedIn && provider === "clerk") {
      clearAuth();
      attemptCount.current = 0;
      return;
    }

  }, [isLoaded, isSignedIn, hasHydrated, clerkUser, getToken, token, provider]);
}
