/**
 * TC-COUPON-002 — Coupon Issued to Finder After Confirmed Return
 *
 * Requirement: FR-13 – Automatic Coupon Issuance
 * Priority:    High
 * Type:        Positive
 *
 * ⚠️  SKIPPED — BACKEND NOT IMPLEMENTED
 *
 * Current state:
 *   - The Coupon model exists (api/models/coupon.py) but has no API endpoints.
 *   - The Claim model exists but has no API endpoints.
 *   - There is no backend logic to automatically issue a coupon when
 *     an admin confirms a successful item return (claim status → "completed").
 *   - The frontend CouponsPage uses hardcoded mock data.
 *
 * This feature requires a complete chain:
 *   1. Admin confirms item return → Claim.status = "completed"
 *   2. Backend signal/hook creates a Coupon record for the finder
 *   3. Coupon appears on the finder's /coupons page
 *
 * Re-enable this test when:
 *   1. PATCH /api/claims/:id/ endpoint supports status = "completed"
 *   2. Backend signal/post_save creates coupon on claim completion
 *   3. GET /api/coupons/ endpoint returns user's coupons
 *   4. Frontend CouponsPage is connected to real API
 */
import { test, expect } from '../fixtures/auth.fixture'

test.describe('TC-COUPON-002: Automatic Coupon Issuance on Return', () => {
  test.skip(true, 'Automatic coupon issuance not implemented — see file header')

  test('coupon should be issued to finder after confirmed return', async ({
    authenticatedPage: page,
  }) => {
    // Test steps (to be implemented when backend is ready):
    //
    // Pre-conditions:
    //   - User A (finder) reports a found item
    //   - User B (claimant) submits a claim
    //   - Admin approves the claim
    //   - Admin schedules and completes the appointment
    //
    // 1. Admin confirms item return:
    //    const adminPage = ... (use admin fixture)
    //    await adminPage.goto('/admin/appointments')
    //    await adminPage.getByRole('button', { name: /confirm return/i }).click()
    //
    // 2. Log in as the finder (User A)
    //    await page.goto('/coupons')
    //
    // Expected:
    //    - A new coupon appears in the finder's coupons list
    //    await expect(page.getByText(/new coupon/i)).toBeVisible()
    //    - Coupon has valid discount and expiry
    //    - Coupon can be activated to show QR code
  })
})
