/**
 * TC-COUPON-002 — Correct Coupon Recipient After Confirmed Return
 *
 * Requirement: FR-13 – Automatic Coupon Issuance
 * Priority:    High
 * Type:        Positive
 *
 * Business rule:
 *   - FOUND item claimed: coupon goes to the FINDER (item.owner) who honestly posted it
 *   - LOST item returned: coupon goes to the RETURNER (claimant) who found & returned it
 *
 * Tests:
 *   1. FOUND item flow → finder receives coupon, claimant does not
 *   2. LOST item flow  → returner (claimant) receives coupon, poster (owner) does not
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

test.describe('TC-COUPON-002: Correct Coupon Recipient By Item Type', () => {
  let adminToken: string

  // FOUND item flow
  let finderToken: string
  let claimantToken: string
  let foundItemId: number

  // LOST item flow
  let lostPosterToken: string
  let returnerToken: string
  let lostItemId: number

  test.beforeAll(async ({ request }) => {
    try {
      await registerUser(request, {
        email: ADMIN_CREDENTIALS.email,
        full_name: ADMIN_CREDENTIALS.full_name,
        password: ADMIN_CREDENTIALS.password,
        password_confirm: ADMIN_CREDENTIALS.password,
        role: 'admin',
      })
    } catch { /* already exists */ }
    const adminLogin = await loginUser(request, ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password)
    adminToken = adminLogin.access

    const categories = await fetchCategories(request, adminToken)
    const locations = await fetchLocations(request, adminToken)

    // ── FOUND item flow setup ────────────────────────────────────────────────
    const finderReg = await registerUser(request, {
      email: uniqueEmail('coupon-finder'),
      full_name: 'Coupon Finder',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    finderToken = finderReg.tokens.access

    const claimantReg = await registerUser(request, {
      email: uniqueEmail('coupon-claimant'),
      full_name: 'Coupon Claimant',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    claimantToken = claimantReg.tokens.access

    const foundItem = await createItem(request, finderToken, {
      title: `E2E Coupon FOUND ${Date.now()}`,
      description: 'Found item for coupon recipient test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    foundItemId = foundItem.id
    await approveItem(request, adminToken, foundItemId)
    const foundClaim = await createClaim(request, claimantToken, {
      item: foundItemId,
      message: 'This is mine, I lost my bag',
    })
    await updateClaimStatus(request, adminToken, foundClaim.id, 'approved')
    await updateClaimStatus(request, adminToken, foundClaim.id, 'completed')

    // ── LOST item flow setup ─────────────────────────────────────────────────
    const lostPosterReg = await registerUser(request, {
      email: uniqueEmail('coupon-lost-poster'),
      full_name: 'Lost Item Poster',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    lostPosterToken = lostPosterReg.tokens.access

    const returnerReg = await registerUser(request, {
      email: uniqueEmail('coupon-returner'),
      full_name: 'Item Returner',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    returnerToken = returnerReg.tokens.access

    const lostItem = await createItem(request, lostPosterToken, {
      title: `E2E Coupon LOST ${Date.now()}`,
      description: 'Lost item for coupon recipient test',
      item_type: 'lost',
      category: categories[0].id,
      location: locations[0].id,
    })
    lostItemId = lostItem.id
    await approveItem(request, adminToken, lostItemId)
    const lostClaim = await createClaim(request, returnerToken, {
      item: lostItemId,
      message: 'I found this item and want to return it',
    })
    await updateClaimStatus(request, adminToken, lostClaim.id, 'approved')
    await updateClaimStatus(request, adminToken, lostClaim.id, 'completed')
  })

  test.afterAll(async ({ request }) => {
    for (const [token, id] of [[finderToken, foundItemId], [lostPosterToken, lostItemId]] as [string, number][]) {
      try { await deleteItem(request, token, id) } catch { /* best-effort */ }
    }
  })

  test('FOUND item: coupon issued to finder (item owner), not to claimant', async ({ request }) => {
    const finderCoupons = await fetchUserCoupons(request, finderToken)
    const claimantCoupons = await fetchUserCoupons(request, claimantToken)

    expect(finderCoupons.length).toBeGreaterThanOrEqual(1)
    expect(finderCoupons[0].code).toBeTruthy()
    expect(finderCoupons[0].is_redeemed).toBe(false)
    expect(finderCoupons[0].expires_at).toBeTruthy()

    // Claimant (the owner who claimed their lost item back) gets no coupon
    expect(claimantCoupons.length).toBe(0)
  })

  test('LOST item: coupon issued to returner (claimant), not to the poster who lost it', async ({ request }) => {
    const returnerCoupons = await fetchUserCoupons(request, returnerToken)
    const lostPosterCoupons = await fetchUserCoupons(request, lostPosterToken)

    expect(returnerCoupons.length).toBeGreaterThanOrEqual(1)
    expect(returnerCoupons[0].code).toBeTruthy()
    expect(returnerCoupons[0].is_redeemed).toBe(false)
    expect(returnerCoupons[0].expires_at).toBeTruthy()

    // The person who lost the item and posted it gets no coupon
    expect(lostPosterCoupons.length).toBe(0)
  })
})
