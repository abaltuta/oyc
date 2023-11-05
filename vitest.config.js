import { defineConfig } from "vitest/dist/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage'
    },
    benchmark: {
      reporters: ['json'],
      outputFile: 'benchmark-results.json',      
    },
    browser: {
      enabled: true,
      // headless: true,
      name: 'firefox'
    }
  }
});