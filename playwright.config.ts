import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'e2e/playwright-report' }]],
  outputDir: 'e2e/test-results',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    /* ── Setup: seed admin user ─────────────────────────────────── */
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
      teardown: 'teardown',
    },
    {
      name: 'teardown',
      testMatch: /global-teardown\.ts/,
    },

    /* ── Public (no auth required) ─────────────────────────────── */
    {
      name: 'public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /e2e\/auth\/.*/,
      dependencies: ['setup'],
    },

    /* ── Student / authenticated user ──────────────────────────── */
    {
      name: 'student',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /e2e\/(items|dashboard|coupons|claims|appointments)\/.*/,
      dependencies: ['setup'],
    },

    /* ── Admin ─────────────────────────────────────────────────── */
    {
      name: 'admin',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /e2e\/admin\/.*/,
      dependencies: ['setup'],
    },
  ],

  /* ── Dev servers ─────────────────────────────────────────────────── */
  webServer: [
    {
      command: 'cd ../lost-and-found-backend-GBC && source venv/bin/activate && python manage.py runserver 8000',
      url: 'http://127.0.0.1:8000/api/docs/',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
  ],
})
