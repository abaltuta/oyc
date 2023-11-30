import { defineConfig } from "vitest/dist/config";

const testProd = !!process.env.TEST_PROD;
const coverage = !!process.env.COVERAGE;

const srcPath = "../../src/";
const distPath = "../../dist/";

const aliases = ["oyc.js", "plugins/class/class.js"];

const generatedAliases = (() => {
  aliases.map(alias => testProd ? `${distPath}${alias}` : `${srcPath}${alias}`)
})();

export default defineConfig({
  esbuild: false,
  test: {
    coverage: {
      all: false,
      include: ["src/**/*"],
      enabled: coverage && !testProd,
      provider: "istanbul",
      reporter: ["text"],
      reportsDirectory: "coverage",
    },
    browser: {
      enabled: true,
      headless: true,
      name: "firefox",
    },
    watch: !testProd,
  },
  resolve: {
    alias: generatedAliases,
  },
});
