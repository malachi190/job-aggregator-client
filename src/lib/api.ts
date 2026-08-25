import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { User } from "@/types";

export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.startsWith(url));

  if (!isPublic) {
    const { token, provider } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (provider) {
        config.headers["x-auth-provider"] = provider;
      }
    }
  }

  return config;
});

// api.interceptors.request.use(
//   (config) => {
//     const { token, provider } = useAuthStore.getState();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       config.headers["x-auth-provider"] = provider;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network errors (no response from server)
    if (!error.response) {
      return Promise.reject(error);
    }

    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest?.url?.startsWith(url),
    );

    // 401 on protected endpoint → try refresh or redirect
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isPublic
    ) {
      originalRequest._retry = true;
      const state = useAuthStore.getState();

      if (state.provider === "password" && state.refreshToken) {
        try {
          const res = await api.post("/auth/refresh", {
            refreshToken: state.refreshToken,
          });
          const { accessToken, refreshToken } = res.data.data;
          useAuthStore
            .getState()
            .setToken(accessToken, refreshToken, "password", state.user as User);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers["x-auth-provider"] = "password";
          return api(originalRequest);
        } catch {
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }

      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Only toast for non-401 errors. 401s are either:
    // - Handled above (protected endpoints → refresh/redirect)
    // - Handled by calling code (public endpoints like login/register)
    if (error.response.status !== 401) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     const isLoginRequest = error.config?.url?.startsWith("/auth/login");
//     if ((error.response?.status === 401 && !originalRequest._retry) && !isLoginRequest) {
//       originalRequest._retry = true;
//       const state = useAuthStore.getState();

//       if (state.provider === "password" && state.refreshToken) {
//         try {
//           const res = await axios.post("/auth/refresh", {
//             refreshToken: state.refreshToken,
//           });
//           const { accessToken } = res.data.data;
//           useAuthStore
//             .getState()
//             .setToken(
//               accessToken,
//               state.refreshToken,
//               "password",
//               state.user as User,
//             );
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return api(originalRequest);
//         } catch {
//           useAuthStore.getState().clearAuth();
//           window.location.href = "/login";
//           return Promise.reject(error);
//         }
//       }

//       useAuthStore.getState().clearAuth();
//       window.location.href = "/login";
//     }

//     const message = error.response?.data?.message || "Something went wrong";
//     toast.error(message);

//     return Promise.reject(error);
//   },
// );
