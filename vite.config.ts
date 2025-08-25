/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    sitemap({ hostname: "https://www.saarland-events-new.de/" }),

     VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Saarland Events',
        short_name: 'Saarland Events',
        description: 'Alle Veranstaltungen im Saarland. Konzerte, Festivals, Ausstellungen und mehr.',
        theme_color: '#ffffff', 
        background_color: '#ffffff', 
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
