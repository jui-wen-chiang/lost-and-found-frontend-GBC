/**
 * TC-CLAIM-001 — Submit Claim Request
 *
 * Requirement: FR-5 – Claim Request and Appointment Scheduling
 * Priority:    High
 * Type:        Positive
 *
 * Tests the full claim submission flow through the UI:
 *   1. A finder posts a found item (via API setup)
 *   2. Admin approves the item (via API setup)
 *   3. A different (claimant) user navigates to the claim form
 *   4. Fills in identifying details and submits
 *   5. Verifies success message with "Pending" status
 */
import { test, expect } from '../fixtures/auth.fixture'
import {
  registerUser,
  loginUser,
  createItem,
  deleteItem,
  fetchCategories,
  fetchLocations,
  approveItem,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD } from '../fixtures/test-data'

test.describe('TC-CLAIM-001: Submit Claim and Schedule Appointment', () => {
  let finderToken: string
  let itemId: number

  test.beforeAll(async ({ request }) => {
    // Register a separate "finder" user who owns the item
    const finderEmail = uniqueEmail('finder')
    const finderReg = await registerUser(request, {
      email: finderEmail,
      full_name: 'E2E Finder',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    finderToken = finderReg.tokens.access

    // Fetch reference data
    const categories = await fetchCategories(request, finderToken)
    const locations = await fetchLocations(request, finderToken)

    // Create a found item owned by the finder
    const item = await createItem(request, finderToken, {
      title: `E2E Claimable Item ${Date.now()}`,
      description: 'Found item for claim E2E test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    itemId = item.id

    // Admin approves the item
    const { ADMIN_CREDENTIALS } = await import('../fixtures/test-data')
    try {
      await registerUser(request, {
        email: ADMIN_CREDENTIALS.email,
        full_name: ADMIN_CREDENTIALS.full_name,
        password: ADMIN_CREDENTIALS.password,
        password_confirm: ADMIN_CREDENTIALS.password,
        role: 'admin',
      })
    } catch {
      // Admin already exists
    }
    const adminLogin = await loginUser(request, ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password)
    await approveItem(request, adminLogin.access, itemId)
  })

  test.afterAll(async ({ request }) => {
    // Clean up the test item
    try {
      await deleteItem(request, finderToken, itemId)
    } catch {
      // Best-effort cleanup
    }
  })

  test('should submit a claim for a found item', async ({
    authenticatedPage: page,
  }) => {
    // Navigate directly to the claim form for the item
    await page.goto(`/claims/new/${itemId}`)
    await page.waitForLoadState('networkidle')

    // Fill in the claim form
    await page.getByLabel('Full Name').fill('Test Claimant')
    await page.getByLabel('Student ID').fill('101234567')
    await page.getByLabel('Email').fill('claimant@test.example.com')
    await page.getByLabel('Phone').fill('416-555-0100')
    await page.getByLabel('Describe the item').fill('Blue backpack with laptop inside')
    await page.getByLabel('Verification — something only the true owner would know').fill('Has a scratch on the left side')

    // Submit the claim
    await page.getByRole('button', { name: 'Submit Claim Request' }).click()

    // Verify success: alert with "Pending" chip and success message
    await expect(page.getByText('Claim request submitted. Status: Pending.')).toBeVisible({
      timeout: 10000,
    })

    // Verify the "View My Claims" button appears
    await expect(page.getByRole('button', { name: 'View My Claims' })).toBeVisible()
  })
})
