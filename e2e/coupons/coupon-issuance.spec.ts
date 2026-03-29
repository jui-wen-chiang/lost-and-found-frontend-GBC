/**
 * TC-COUPON-002 — Coupon Issued to Finder After Confirmed Return
 *
 * Requirement: FR-13 – Automatic Coupon Issuance
 * Priority:    High
 * Type:        Positive
 *
 * Tests the complete coupon issuance chain:
 *   1. Finder reports a found item → admin approves
 *   2. Claimant submits a claim → admin approves claim
 *   3. Admin marks the claim as "completed" → backend auto-creates coupon
 *   4. Claimant verifies coupon appears on /coupons page
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
  createClaim,
  updateClaimStatus,
  fetchUserCoupons,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from '../fixtures/test-data'

test.describe('TC-COUPON-002: Automatic Coupon Issuance on Return', () => {
  let finderToken: string
  let claimantToken: string
  let adminToken: string
  let itemId: number

  test.beforeAll(async ({ request }) => {
    // Register admin
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

    // Register finder
    const finderEmail = uniqueEmail('finder')
    const finderReg = await registerUser(request, {
      email: finderEmail,
      full_name: 'Finder For Coupon',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    finderToken = finderReg.tokens.access

    // Register claimant
    const claimantEmail = uniqueEmail('claimant')
    const claimantReg = await registerUser(request, {
      email: claimantEmail,
      full_name: 'Claimant For Coupon',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    claimantToken = claimantReg.tokens.access

    // Create & approve item
    const categories = await fetchCategories(request, finderToken)
    const locations = await fetchLocations(request, finderToken)
    const item = await createItem(request, finderToken, {
      title: `E2E Coupon Item ${Date.now()}`,
      description: 'Found item for coupon E2E test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    itemId = item.id
    await approveItem(request, adminToken, itemId)

    // Claimant creates claim → admin approves → admin completes (triggers coupon)
    const claim = await createClaim(request, claimantToken, {
      item: itemId,
      message: 'This is mine, I lost it yesterday',
    })
    await updateClaimStatus(request, adminToken, claim.id, 'approved')
    await updateClaimStatus(request, adminToken, claim.id, 'completed')
  })

  test.afterAll(async ({ request }) => {
    try {
      await deleteItem(request, finderToken, itemId)
    } catch {
      // Best-effort cleanup
    }
  })

  test('coupon should be issued to claimant after confirmed return', async ({
    request,
  }) => {
    // Verify coupon was auto-created for the claimant
    const coupons = await fetchUserCoupons(request, claimantToken)

    expect(coupons.length).toBeGreaterThanOrEqual(1)

    const coupon = coupons[0]
    expect(coupon.code).toBeTruthy()
    expect(coupon.is_redeemed).toBe(false)
    expect(coupon.expires_at).toBeTruthy()
  })
})
