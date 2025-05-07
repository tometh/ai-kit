import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Core",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ["src/**/*.ts"],
      outDir: "dist",
    }),
  ],
});
