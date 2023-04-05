import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
const manifest = {
  name: "DoNote",
  short_name: "DoNote",
  theme_color: "#d7dede",
  icons: [
    {
      src: "android-chrome-192x192.png", // <== don't add slash, for testing
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/android-chrome-512x512.png", // <== don't remove slash, for testing
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "android-chrome-512x512.png", // <== don't add slash, for testing
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      mode: "development",
      base: "/",
      manifest: manifest,
      registerType: "autoUpdate",
      // injectRegister: "null",
      devOptions: {
        enabled: process.env.SW_DEV === "true",
        type: "module",
      },
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    host: true,
  },
});
