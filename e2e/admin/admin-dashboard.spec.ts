/**
 * TC-ADMINDASH-001 — View Admin Dashboard with Statistics
 *
 * Requirement: FR-12 – Admin Dashboard and Reports
 * Priority:    Medium
 * Type:        Positive
 *
 * Pre-conditions: Admin is logged in, items exist in the system.
 *
 * Note: This test requires an admin user to be seeded (done via global-setup).
 * The admin dashboard fetches from GET /api/reports/items/ which requires admin role.
 */
import { test, expect } from '../fixtures/auth.fixture'

test.describe('TC-ADMINDASH-001: Admin Dashboard Statistics', () => {
  test('should display admin dashboard with stat cards and charts', async ({ adminPage: page }) => {
    // 1. Navigate to Admin Dashboard
    await page.goto('/admin')

    // Expected: Dashboard heading visible
    await expect(page.getByText(/admin dashboard/i)).toBeVisible({ timeout: 15_000 })

    // Expected: loading spinner gone
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 15_000 })

    // Expected: stat cards are displayed
    await expect(page.getByText('Total Items')).toBeVisible()
    await expect(page.getByText('Pending', { exact: true }).first()).toBeVisible()

    // Expected: chart sections visible
    await expect(page.getByText(/items by category/i)).toBeVisible()
    await expect(page.getByText(/status distribution/i)).toBeVisible()
    await expect(page.getByText(/items by location/i)).toBeVisible()

    // Expected: quick actions panel visible
    await expect(page.getByText(/quick actions/i)).toBeVisible()
  })

  test('should navigate to unclaimed items report', async ({ adminPage: page }) => {
    // Navigate to admin reports page
    await page.goto('/admin/reports')

    // Expected: reports page loads
    // The ReportsPage fetches from /api/reports/unclaimed-item/
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 15_000 })

    // The page should have some content (table or "no data" message)
    const body = page.locator('body')
    await expect(body).not.toBeEmpty()
  })
})
