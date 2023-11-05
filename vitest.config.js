import { defineConfig } from "vitest/dist/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage'
    },
    browser: {
      enabled: true,
      // headless: true,
      name: 'firefox'
    }
  }
});