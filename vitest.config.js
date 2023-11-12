import { defineConfig } from "vitest/dist/config";

const testProd = !!process.env.TEST_PROD;
const coverage = !!process.env.COVERAGE;

export default defineConfig({
  esbuild: false,
  test: {
    coverage: {
      all: false,
      include: ["src/**/*"],
      enabled: coverage && !testProd,
      provider: "istanbul",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
    },
    browser: {
      enabled: true,
      headless: !testProd,
      name: "firefox",
    },
    watch: !testProd,
  },
  resolve: {
    alias: {
      "../../src/oyc.js": testProd
        ? "../../dist/oyc.min.js"
        : "../../src/oyc.js",
    },
  },
});
