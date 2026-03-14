/**
 * Reusable Playwright fixtures that extend `test` with pre-authenticated pages.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/auth.fixture'
 *   test('my test', async ({ authenticatedPage }) => { ... })
 */
import { test as base, expect, Page, BrowserContext } from '@playwright/test'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from './test-data'
import { registerUser, loginUser } from '../helpers/api.helpers'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthFixtures {
  /** A Page that is already logged in as a regular (student) user. */
  authenticatedPage: Page
  /** Credentials of the logged-in user (email, password, userId). */
  testUser: { email: string; password: string; userId: number; token: string }
}

interface AdminFixtures {
  /** A Page that is already logged in as an admin user. */
  adminPage: Page
  /** Admin auth token for direct API calls. */
  adminToken: string
}

// ─── Helper: inject auth tokens into browser storage ─────────────────────────

async function injectTokens(page: Page, access: string, refresh: string) {
  // Register an init script that sets tokens BEFORE any app JS runs.
  // This avoids the race condition where the SPA redirects (destroying
  // the execution context) before a page.evaluate() can complete.
  await page.addInitScript(
    ([a, r]) => {
      localStorage.setItem('access_token', a)
      localStorage.setItem('refresh_token', r)
    },
    [access, refresh],
  )
  await page.goto('/')
  await page.waitForLoadState('networkidle')
}

// ─── Fixtures ────────────────────────────────────────────────────────────────

export const test = base.extend<AuthFixtures & AdminFixtures>({
  testUser: async ({ request }, use) => {
    const email = uniqueEmail()
    const password = STRONG_PASSWORD
    const reg = await registerUser(request, {
      email,
      full_name: 'E2E Test User',
      password,
      password_confirm: password,
    })
    await use({
      email,
      password,
      userId: reg.user.id,
      token: reg.tokens.access,
    })
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Use the token obtained during registration (testUser fixture)
    await injectTokens(page, testUser.token, '')
    await use(page)
  },

  adminPage: async ({ browser, request }, use) => {
    // Try to register admin (will fail if already exists, that's fine)
    try {
      await registerUser(request, {
        email: ADMIN_CREDENTIALS.email,
        full_name: ADMIN_CREDENTIALS.full_name,
        password: ADMIN_CREDENTIALS.password,
        password_confirm: ADMIN_CREDENTIALS.password,
        role: 'admin',
      })
    } catch {
      // Admin likely already exists
    }

    const login = await loginUser(request, ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password)
    const context = await browser.newContext()
    const page = await context.newPage()
    await injectTokens(page, login.access, login.refresh)
    await use(page)
    await context.close()
  },

  adminToken: async ({ request }, use) => {
    try {
      await registerUser(request, {
        email: ADMIN_CREDENTIALS.email,
        full_name: ADMIN_CREDENTIALS.full_name,
        password: ADMIN_CREDENTIALS.password,
        password_confirm: ADMIN_CREDENTIALS.password,
        role: 'admin',
      })
    } catch {
      // Already exists
    }
    const login = await loginUser(request, ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password)
    await use(login.access)
  },
})

export { expect }
