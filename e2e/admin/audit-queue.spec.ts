/**
 * TC-ADMIN-001 — Admin Approves and Rejects a Post
 *
 * Requirement: FR-9 – Admin Content Moderation
 * Priority:    High
 * Type:        Positive (UI-only)
 *
 * Pre-conditions: User is logged in with admin privileges,
 *                 at least one pending post exists.
 *
 * ⚠️  PARTIAL COVERAGE — UI MOCK ONLY
 *
 * The AdminAuditQueuePage and AdminAuditDetailPage currently use hardcoded
 * mock data (mockPendingPosts array). There is no backend endpoint to:
 *   - List pending posts for admin review
 *   - PATCH /api/items/:id/ to change status to "approved" or "rejected"
 *
 * Backend models support item status (pending/approved/claimed/completed) but
 * no admin moderation view or endpoint exists yet.
 *
 * These tests validate the mock UI flow only. Re-enable full E2E testing when:
 *   1. A GET /api/items/?status=pending admin endpoint is added
 *   2. A PATCH /api/items/:id/status/ endpoint (admin-only) is implemented
 */
import { test, expect } from '../fixtures/auth.fixture'

test.describe('TC-ADMIN-001: Admin Approve/Reject Post (UI Mock)', () => {
  test('should display the audit queue with pending posts', async ({ adminPage: page }) => {
    await page.goto('/admin/audit')

    // Expected: audit queue heading visible
    await expect(page.getByText(/admin audit queue/i)).toBeVisible({ timeout: 10_000 })

    // Expected: mock pending posts are listed
    await expect(page.getByText('Black Wallet')).toBeVisible()
    await expect(page.getByText('Blue Backpack')).toBeVisible()
    await expect(page.getByText('Student Card')).toBeVisible()
  })

  test('should open a post detail and approve it', async ({ adminPage: page }) => {
    await page.goto('/admin/audit')
    await expect(page.getByText(/admin audit queue/i)).toBeVisible({ timeout: 10_000 })

    // Click "View Details" on the first post
    await page.getByRole('link', { name: /view details/i }).first().click()

    // Expected: detail page loads
    await expect(page.getByText(/post audit detail/i)).toBeVisible()
    await expect(page.getByText('Black Wallet')).toBeVisible()

    // Click Approve
    await page.getByRole('button', { name: /approve/i }).click()

    // Expected: success alert shown
    await expect(page.getByText(/approved/i)).toBeVisible()
  })

  test('should reject a post with a reason', async ({ adminPage: page }) => {
    await page.goto('/admin/audit/202')

    await expect(page.getByText(/post audit detail/i)).toBeVisible({ timeout: 10_000 })

    // Fill rejection reason (required for reject)
    await page.getByLabel(/reason for rejection/i).fill('Item description is too vague')

    // Click Reject
    await page.getByRole('button', { name: /reject/i }).click()

    // Expected: rejection alert shown with reason
    await expect(page.getByText(/rejected/i)).toBeVisible()
    await expect(page.getByText(/item description is too vague/i)).toBeVisible()
  })

  test('should navigate back to queue from detail page', async ({ adminPage: page }) => {
    await page.goto('/admin/audit/201')
    await expect(page.getByText(/post audit detail/i)).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: /back to queue/i }).click()
    await expect(page).toHaveURL(/\/admin\/audit$/)
  })
})
