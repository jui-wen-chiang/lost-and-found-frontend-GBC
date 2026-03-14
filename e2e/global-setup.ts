/**
 * Global setup: runs once before all test suites.
 * Seeds the admin user if it doesn't exist yet.
 */
import { test as setup } from '@playwright/test'
import { registerUser } from './helpers/api.helpers'
import { ADMIN_CREDENTIALS, STRONG_PASSWORD } from './fixtures/test-data'

setup('seed admin user', async ({ request }) => {
  try {
    await registerUser(request, {
      email: ADMIN_CREDENTIALS.email,
      full_name: ADMIN_CREDENTIALS.full_name,
      password: ADMIN_CREDENTIALS.password,
      password_confirm: ADMIN_CREDENTIALS.password,
      role: 'admin',
    })
    console.log('✔ Admin user seeded')
  } catch {
    console.log('ℹ Admin user already exists (or seeding skipped)')
  }
})
