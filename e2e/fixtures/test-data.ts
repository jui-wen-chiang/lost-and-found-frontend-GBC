/**
 * Shared test data generators for E2E tests.
 * Uses timestamps to ensure uniqueness across test runs.
 */

const TS = () => Date.now()

/** Generate a unique email that won't collide across runs. */
export function uniqueEmail(prefix = 'e2euser') {
  return `${prefix}_${TS()}@test.example.com`
}

/** Password that satisfies the backend policy (8+ chars, upper, lower, digit, symbol). */
export const STRONG_PASSWORD = 'Test@1234!'

/** A deliberately weak password for negative test cases. */
export const WEAK_PASSWORD = 'abc'

/** Sample item data for creating test posts. */
export function sampleItem(overrides: Record<string, unknown> = {}) {
  return {
    title: `E2E Test Item ${TS()}`,
    description: 'Automatically created by Playwright E2E tests.',
    item_type: 'found' as const,
    ...overrides,
  }
}

/** Admin credentials — must match a pre-seeded admin user in the dev DB. */
export const ADMIN_CREDENTIALS = {
  email: 'admin@test.example.com',
  password: STRONG_PASSWORD,
  full_name: 'E2E Admin',
}
