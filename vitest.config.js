import { defineConfig } from "vitest/dist/config";

const testProd = !!process.env.TEST_PROD;

export default defineConfig({
  test: {
    coverage: {
      all: false,
      include: ["src/**/*"],
      enabled: !testProd,
      provider: 'istanbul',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage'
    },
    browser: {
      enabled: true,
      headless: !testProd,
      name: 'firefox'
    },
    watch: !testProd
  },
  resolve: {
    alias: {
      '../../src/oyc.js': testProd ? '../../dist/oyc.min.js' : '../../src/oyc.js'
    }
  }
});