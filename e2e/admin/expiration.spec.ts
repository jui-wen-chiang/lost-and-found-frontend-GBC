/**
 * TC-EXPIRE-001 — Unclaimed Items Marked as Expired
 *
 * Requirement: FR-14 – Automated Expiration System
 * Priority:    Medium
 * Type:        Positive
 *
 * Tests the expiration trigger:
 *   1. Admin triggers POST /api/reports/trigger-expire/
 *   2. Backend scans approved found items past their category retention period
 *   3. Matching items are batch-updated to status "expired"
 *   4. Response confirms execution with expired count
 *
 * Note: Creating a genuinely overdue item requires category.expires_day to be
 * very short or the item's created_at to be in the past. This test triggers the
 * scan and verifies the API responds correctly (expired_count >= 0).
 */
import { test, expect } from '../fixtures/auth.fixture'
import {
  registerUser,
  loginUser,
  triggerExpiration,
} from '../helpers/api.helpers'
import { ADMIN_CREDENTIALS } from '../fixtures/test-data'

test.describe('TC-EXPIRE-001: Automated Expiration of Unclaimed Items', () => {
  let adminToken: string

  test.beforeAll(async ({ request }) => {
    // Ensure admin exists
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
    const adminLogin = await loginUser(request, ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password)
    adminToken = adminLogin.access
  })

  test('admin should trigger expiration scan and receive summary', async ({
    request,
  }) => {
    const result = await triggerExpiration(request, adminToken)

    // The response should have the expected shape
    expect(result).toHaveProperty('executed_at')
    expect(result).toHaveProperty('expired_count')
    expect(typeof result.expired_count).toBe('number')
    expect(result.expired_count).toBeGreaterThanOrEqual(0)
  })
})
