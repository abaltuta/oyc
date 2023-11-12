import { defineConfig } from "vitest/dist/config";

const testProd = !!process.env.TEST_PROD;

export default defineConfig({
  test: {
    coverage: {
      enabled: !testProd,
      provider: 'istanbul',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage'
    },
    browser: {
      enabled: true,
      headless: true,
      name: 'firefox'
    },
    watch: !testProd
  },
  resolve: {
    alias: {
      'oyc': testProd ? './dist/oyc.min.js' : './src/oyc.js'
    }
  }
});