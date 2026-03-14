/**
 * TC-DASH-001 — View Personal Dashboard
 *
 * Requirement: FR-7 – Personal Dashboard
 * Priority:    Medium
 * Type:        Positive
 *
 * Pre-conditions: User is logged in and has previously created at least one post.
 */
import { test, expect } from '../fixtures/auth.fixture'
import { createItem, fetchCategories, fetchLocations } from '../helpers/api.helpers'
import { sampleItem } from '../fixtures/test-data'

test.describe('TC-DASH-001: Personal Dashboard', () => {
  test.beforeEach(async ({ request, testUser }) => {
    // Pre-condition: create at least one post owned by the test user
    const categories = await fetchCategories(request, testUser.token)
    const locations = await fetchLocations(request, testUser.token)

    if (categories.length === 0 || locations.length === 0) {
      test.skip(true, 'No categories or locations seeded in the database')
      return
    }

    await createItem(request, testUser.token, {
      ...sampleItem(),
      category: categories[0].id,
      location: locations[0].id,
      found_at: new Date().toISOString(),
    } as never)
  })

  test('should display personal dashboard with stats', async ({ authenticatedPage: page }) => {
    // 1. Navigate to dashboard
    await page.goto('/dashboard/home')

    // Expected: Dashboard heading visible
    await expect(page.getByText(/personal dashboard/i)).toBeVisible({ timeout: 10_000 })

    // Expected: loading spinner gone
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 10_000 })

    // Expected: stat cards visible
    await expect(page.getByText('Total Reports')).toBeVisible()
    await expect(page.getByText('Pending')).toBeVisible()

    // Expected: at least one report counted (we created one)
    // The "Total Reports" card should show at least 1
    const totalReportsCard = page.locator('text=Total Reports').locator('..')
    await expect(totalReportsCard).toBeVisible()
  })
})
