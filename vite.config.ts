/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { sitemap } from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    sitemap({ hostname: "https://www.saarland-events-new.de/" }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
