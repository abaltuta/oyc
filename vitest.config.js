import { resolve } from "path";
import { defineConfig } from "vitest/dist/config";

const testProd = !!process.env.TEST_PROD;
const coverage = !!process.env.COVERAGE;

const srcPath = "src/";
const distPath = "dist/";

const aliases = ["oyc", "plugins/class/class"];

const generatedAliases = Object.fromEntries(
  aliases.map((alias) => [
    alias,
    resolve(testProd ? `${distPath}${alias}.min.js` : `${srcPath}${alias}.js`),
  ]),
);

export default defineConfig({
  esbuild: false, // Don't do anything.
  publicDir: "./test-html",
  test: {
    fakeTimers: {
      // by default vitest attempts to patch `setImmediate` this doesn't exist in most browsers apart from old versions of Edge
      // We pass in what we want to fake manually to avoid this issue. We don't need the whole api faked anyway
      toFake: ["setTimeout"],
    },
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
      headless: true,
      name: "firefox",
    },
    watch: !testProd,
  },
  resolve: {
    alias: generatedAliases,
  },
});
