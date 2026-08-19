import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tsconfigPaths(), tanstackStart(), react()],
  server: {
    proxy: {
      "/auth": { target: "http://localhost:8080", changeOrigin: true },
      "/profiles": { target: "http://localhost:8080", changeOrigin: true },
      "/feed": { target: "http://localhost:8080", changeOrigin: true },
      "/search": { target: "http://localhost:8080", changeOrigin: true },
      "/base-cvs": { target: "http://localhost:8080", changeOrigin: true },
      "/admin": { target: "http://localhost:8080", changeOrigin: true },

      // Overlapping: /applications (frontend page + backend API)
      "/applications": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass(req) {
          const path = req.url?.split("?")[0] || "";
          // Frontend page load → serve SPA, don't proxy
          if (path === "/applications") return req.url;
          return undefined; // proxy -backend
        },
      },

      // Overlapping: /tailoring (frontend pages + backend API)
      "/tailoring": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass(req) {
          const path = req.url?.split("?")[0] || "";
          // Frontend routes — serve SPA
          if (path === "/tailoring/prep") return req.url;
          if (/^\/tailoring\/[0-9a-f-]+$/i.test(path)) return req.url;
          // Backend routes — proxy (generate, refine, accept, etc.)
          return undefined;
        },
      },
    },
  },
});
