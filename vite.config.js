import "dotenv/config";
import { defineConfig } from "vite";
import hotfilePlugin from "vite-hotfile-plugin";

export default defineConfig({
  server: {
    port: parseInt(process.env.HTTP_PORT || 5000) + 1,
    host: process.env.HTTP_HOST || "localhost",
  },
  build: {
    outDir: "dist",
    assetsDir: "",
    rollupOptions: {
      input: {
        client_js: "app/client.js",
        client_css: "app/client.scss",
      },
    },
    manifest: "vite.manifest.json",
  },
  plugins: [
    hotfilePlugin({
      publicDirectory: "dist",
      hotFileName: "vite.hot",
      logging: false,
    }),
  ],
});
