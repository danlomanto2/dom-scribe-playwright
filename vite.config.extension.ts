import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Vite config specifically for building the Chrome extension
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-extension",
    lib: {
      entry: {
        popup: path.resolve(__dirname, "src/extension/popup-entry.tsx"),
        "content-script": path.resolve(__dirname, "src/extension/content-script.ts"),
        "injected-script": path.resolve(__dirname, "src/extension/injected-script.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        format: "es",
      },
    },
  },
  define: {
    global: "globalThis",
  },
});