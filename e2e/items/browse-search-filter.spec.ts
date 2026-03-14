/**
 * TC-SEARCH-001 — Browse, Search, and Filter Lost/Found Items
 *
 * Requirement: FR-3 – Browse, Search, and Filter Items
 * Priority:    High
 * Type:        Positive
 *
 * Pre-conditions: User is logged in, at least one item exists in the system.
 */
import { test, expect } from '../fixtures/auth.fixture'
import { createItem, fetchCategories, fetchLocations } from '../helpers/api.helpers'
import { sampleItem } from '../fixtures/test-data'

test.describe('TC-SEARCH-001: Browse, Search, and Filter Items', () => {
  let itemTitle: string

  test.beforeEach(async ({ request, testUser }) => {
    // Pre-condition: create a test item via API
    const categories = await fetchCategories(request, testUser.token)
    const locations = await fetchLocations(request, testUser.token)

    if (categories.length === 0 || locations.length === 0) {
      test.skip(true, 'No categories or locations seeded in the database')
      return
    }

    const data = sampleItem({
      category: categories[0].id,
      location: locations[0].id,
      found_at: new Date().toISOString(),
    })
    itemTitle = data.title
    await createItem(request, testUser.token, data as never)
  })

  test('should display items on the home page', async ({ authenticatedPage: page }) => {
    // 1. Navigate to items listing
    await page.goto('/')
    await expect(page.getByText(/browse lost & found items/i)).toBeVisible()

    // Results should load (no perpetual spinner)
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 10_000 })
  })

  test('should search items by keyword', async ({ authenticatedPage: page }) => {
    await page.goto('/')
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 10_000 })

    // 2. Enter keyword into search bar and submit
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill(itemTitle)

    // Wait for client-side filtering to apply
    await page.waitForTimeout(500)

    // Items matching the search keyword should be displayed
    await expect(page.getByText(itemTitle)).toBeVisible()
  })

  test('should toggle between grid and list view', async ({ authenticatedPage: page }) => {
    await page.goto('/')
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 10_000 })

    // Click list view toggle
    await page.getByRole('button', { name: /list view/i }).click()

    // Click grid view toggle
    await page.getByRole('button', { name: /grid view/i }).click()
  })
})
