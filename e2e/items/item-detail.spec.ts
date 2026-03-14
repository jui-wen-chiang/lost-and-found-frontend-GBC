/**
 * TC-ITEM-001 — View Detailed Item Information
 *
 * Requirement: FR-4 – View Item Details
 * Priority:    Medium
 * Type:        Positive
 *
 * Pre-conditions: User is logged in, at least one item exists.
 */
import { test, expect } from '../fixtures/auth.fixture'
import { createItem, fetchCategories, fetchLocations } from '../helpers/api.helpers'
import { sampleItem } from '../fixtures/test-data'

test.describe('TC-ITEM-001: View Item Details', () => {
  let itemId: number
  let itemTitle: string

  test.beforeEach(async ({ request, testUser }) => {
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

    const item = await createItem(request, testUser.token, data as never)
    itemId = item.id
  })

  test('should display item details on the detail page', async ({ authenticatedPage: page }) => {
    // 1. Navigate directly to item detail page
    await page.goto(`/items/${itemId}`)

    // 2. Expected: title is displayed
    await expect(page.getByRole('heading', { name: itemTitle })).toBeVisible({ timeout: 10_000 })

    // 3. Expected: description is displayed
    await expect(page.getByText(/automatically created by playwright/i)).toBeVisible()

    // 4. Expected: category label is visible
    await expect(page.getByText('Category')).toBeVisible()

    // 5. Expected: location label is visible
    await expect(page.getByText('Location')).toBeVisible()

    // 6. Expected: date label is visible
    await expect(page.getByText(/date found/i)).toBeVisible()
  })

  test('should show "No photos available" when item has no images', async ({ authenticatedPage: page }) => {
    await page.goto(`/items/${itemId}`)
    await expect(page.getByRole('heading', { name: itemTitle })).toBeVisible({ timeout: 10_000 })

    // Since we didn't upload images, the placeholder should show
    await expect(page.getByText(/no photos available/i)).toBeVisible()
  })

  test('should have a back button that navigates away', async ({ authenticatedPage: page }) => {
    await page.goto(`/items/${itemId}`)
    await expect(page.getByRole('heading', { name: itemTitle })).toBeVisible({ timeout: 10_000 })

    // Click Back button
    await page.getByRole('button', { name: /back/i }).click()

    // Should navigate away from the detail page
    await expect(page).not.toHaveURL(`/items/${itemId}`)
  })
})
