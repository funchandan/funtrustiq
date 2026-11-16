import { defineConfig } from "vite";

// GitHub Pages serves from https://funchandan.github.io/funtrustiq/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/funtrustiq/" : "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
  server: {
    port: 8787,
    strictPort: true,
  },
  preview: {
    port: 8787,
    strictPort: true,
  },
}));
