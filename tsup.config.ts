import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    sources: "sources/main.ts",
  },
  format: ["esm", "cjs"],
  outDir: "outputs",
  dts: true,
  clean: true,
  sourcemap: true,
});