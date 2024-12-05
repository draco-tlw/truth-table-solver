import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["/fonts/*, /favicon-512x512.png", "/favicon-192x192.png"],
      manifest: {
        name: "Truth Table Solver",
        short_name: "Truth Table Solver",
        start_url: "/",
        description:
          "Truth Table Solver is a web app to generate and solve truth tables for logical expressions, simplify equations, and more.",
        icons: [
          {
            src: "/favicon-512x512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any",
          },
          {
            src: "/favicon-192x192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any",
          },
        ],
        background_color: "#f8f9fa",
        theme_color: "#0d6efd",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
    }),
  ],
  css: {
    modules: {
      scopeBehaviour: "local", // 'global' or 'local'
      globalModulePaths: [/global\.scss$/],
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`, // For global Sass variables
      },
    },
  },
});
