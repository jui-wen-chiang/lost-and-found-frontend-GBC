/**
 * TC-QR-001 — Generate QR Code for a Found Item
 *
 * Requirement: FR-10 – QR Code Generation
 * Priority:    Medium
 * Type:        Positive
 *
 * Pre-conditions: User is logged in, a found item exists.
 */
import { test, expect } from '../fixtures/auth.fixture'
import { createItem, fetchCategories, fetchLocations } from '../helpers/api.helpers'
import { sampleItem } from '../fixtures/test-data'

test.describe('TC-QR-001: QR Code Generation', () => {
  let itemId: number

  test.beforeEach(async ({ request, testUser }) => {
    const categories = await fetchCategories(request, testUser.token)
    const locations = await fetchLocations(request, testUser.token)

    if (categories.length === 0 || locations.length === 0) {
      test.skip(true, 'No categories or locations seeded in the database')
      return
    }

    const data = sampleItem({
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
      found_at: new Date().toISOString(),
    })

    const item = await createItem(request, testUser.token, data as never)
    itemId = item.id
  })

  test('should display a QR code on the item detail page', async ({ authenticatedPage: page }) => {
    // 1. Navigate to detail page of a found item
    await page.goto(`/items/${itemId}`)

    // 2. Wait for page to load
    await expect(page.locator('[role="progressbar"]')).not.toBeVisible({ timeout: 10_000 })

    // 3. QR code element should be visible (rendered by qrcode.react as canvas or svg)
    const qrCode = page.locator('canvas, svg').filter({ hasText: '' }).first()
    // Alternative: look for the QRCodeDisplay component wrapper
    const qrSection = page.getByText(`Item #${itemId}`)

    // At least one QR indicator should be present
    const qrVisible = await qrSection.isVisible().catch(() => false)
    const canvasVisible = await page.locator('canvas').first().isVisible().catch(() => false)

    expect(qrVisible || canvasVisible).toBeTruthy()
  })
})
