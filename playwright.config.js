// Playwright configuration for Gracie's Shop end-to-end tests.
// Run with: npm run test:e2e

const os = require('node:os');
const path = require('node:path');
const { defineConfig, devices } = require('@playwright/test');

const PORT = 3100;

// Tests use their own database file, so they never change your real data in server/db/shop.db
const TEST_DB_PATH = path.join(os.tmpdir(), 'gracies-shop-e2e.db');

module.exports = defineConfig({
  testDir: './tests/e2e',

  // Tests run one at a time, in a predictable order. They share one database,
  // and some of them change stock levels.
  workers: 1,
  fullyParallel: false,

  // Don't retry failures: a failing test should be looked at, not hidden
  retries: 0,

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: `http://localhost:${PORT}`,
    // Keep a screenshot and a trace (step-by-step recording) only when a test fails
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Before the tests: reset the test database with the seed data, then start the app
  webServer: {
    command: 'node server/db/seed.js && node server/server.js',
    url: `http://localhost:${PORT}/api/health`,
    env: { DB_PATH: TEST_DB_PATH, PORT: String(PORT) },
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
