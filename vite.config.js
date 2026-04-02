import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {

      '/backend': {
        target: 'http://localhost/chetak-plus',
        changeOrigin: true,
      },
      '/product': {
        target: 'http://localhost/chetak-plus',
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
