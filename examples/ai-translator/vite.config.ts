import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "ai-translator": resolve(__dirname, "../../packages/ai-translator/src"),
    },
  },
});
