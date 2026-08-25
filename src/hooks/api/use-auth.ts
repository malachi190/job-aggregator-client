import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiResponse, User } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

interface ClerkLoginInput {
  token: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const res = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login?provider=password",
        credentials,
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status && data.data) {
        const { accessToken, refreshToken, user } = data.data;
        setToken(accessToken, refreshToken, "password", user);
        toast.success("Logged in successfully");
        // Let login.tsx useEffect handle redirect reactively,
        // OR uncomment below for immediate navigation:
        // navigate({ to: '/dashboard', replace: true });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
}

export function useClerkLogin() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: async (input: ClerkLoginInput) => {
      const res = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login?provider=clerk",
        {},
        { headers: { Authorization: `Bearer ${input.token}` } },
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status && data.data) {
        const { accessToken, refreshToken, user } = data.data;
        setToken(accessToken, refreshToken, "clerk", user);
        toast.success("Welcome back");
      }
    },
    retry: false,
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const res = await api.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        input,
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status && data.data) {
        const { accessToken, refreshToken, user } = data.data;
        setToken(accessToken, refreshToken, user.authProvider, user);
        toast.success("Account created — welcome to Crawler");
      }
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      clearAuth();
      toast.success("Logged out");
      navigate({ to: "/login", replace: true });
    },
    onError: () => {
      clearAuth(); // still clear locally
      toast.error("Logout failed — cleared local session");
      navigate({ to: "/login", replace: true });
    },
  });
}
