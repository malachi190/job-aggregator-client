import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import type { ApiResponse, User } from "@/types";

interface AuthResponse {
  accessToken: string;
  user: User;
}

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080" : "");

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.startsWith(url));

  if (!isPublic) {
    const { token, provider } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (provider) config.headers["x-auth-provider"] = provider;
    }
  }

  return config;
});

let passwordRefreshPromise: Promise<string> | null = null;

export function refreshPasswordSession(): Promise<string> {
  if (passwordRefreshPromise) return passwordRefreshPromise;

  passwordRefreshPromise = api
    .post<ApiResponse<AuthResponse>>("/auth/refresh")
    .then(({ data }) => {
      const session = data.data;
      useAuthStore
        .getState()
        .setSession(session.accessToken, "password", session.user);
      return session.accessToken;
    })
    .finally(() => {
      passwordRefreshPromise = null;
    });

  return passwordRefreshPromise;
}

function redirectToLogin(): void {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    if (!error.response) return Promise.reject(error);

    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest?.url?.startsWith(url),
    );

    if (error.response.status === 401 && originalRequest && !isPublic) {
      const state = useAuthStore.getState();

      if (!originalRequest._retry && state.provider === "password") {
        originalRequest._retry = true;
        try {
          const accessToken = await refreshPasswordSession();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers["x-auth-provider"] = "password";
          return api(originalRequest);
        } catch {
          useAuthStore.getState().clearAuth();
          redirectToLogin();
          return Promise.reject(error);
        }
      }

      useAuthStore.getState().clearAuth();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      toast.error(error.response.data?.message || "Something went wrong");
    }

    return Promise.reject(error);
  },
);
