import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { localPaperPlugin } from "./scripts/local-paper-plugin.mjs";
export default defineConfig({
  plugins: [react(), localPaperPlugin()],
  build: { rollupOptions: { output: { manualChunks: { three: ["three"] } } } },
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
});
