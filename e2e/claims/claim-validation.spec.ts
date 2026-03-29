/**
 * TC-CLAIM-002 — Claim Submission Validation
 *
 * Requirement: FR-5 – Claim / Return Request
 * Priority:    High
 * Type:        Negative
 *
 * Tests that the backend correctly rejects invalid claim attempts:
 *   1. Cannot claim a pending (not-yet-approved) item
 *   2. Cannot claim your own item
 *   3. Cannot submit a duplicate claim on the same item
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
  tryCreateClaim,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from '../fixtures/test-data'

test.describe('TC-CLAIM-002: Claim Submission Validation', () => {
  let adminToken: string
  let ownerToken: string
  let otherToken: string

  let pendingItemId: number    // not yet approved
  let approvedItemId: number   // approved, for duplicate test

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

    const ownerReg = await registerUser(request, {
      email: uniqueEmail('claim-owner'),
      full_name: 'Item Owner',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    ownerToken = ownerReg.tokens.access

    const otherReg = await registerUser(request, {
      email: uniqueEmail('claim-other'),
      full_name: 'Other User',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    otherToken = otherReg.tokens.access

    const categories = await fetchCategories(request, ownerToken)
    const locations = await fetchLocations(request, ownerToken)

    // Pending item (not approved)
    const pendingItem = await createItem(request, ownerToken, {
      title: `E2E Pending Item ${Date.now()}`,
      description: 'Item that stays pending for validation test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    pendingItemId = pendingItem.id

    // Approved item (for own-item and duplicate tests)
    const approvedItem = await createItem(request, ownerToken, {
      title: `E2E Approved Item ${Date.now()}`,
      description: 'Item that gets approved for validation test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    approvedItemId = approvedItem.id
    await approveItem(request, adminToken, approvedItemId)
  })

  test.afterAll(async ({ request }) => {
    for (const id of [pendingItemId, approvedItemId]) {
      try { await deleteItem(request, ownerToken, id) } catch { /* best-effort */ }
    }
  })

  test('cannot claim a pending (not-yet-approved) item', async ({ request }) => {
    const result = await tryCreateClaim(request, otherToken, {
      item: pendingItemId,
      message: 'Trying to claim a pending item',
    })

    expect(result.status).toBe(400)
  })

  test('cannot claim your own item', async ({ request }) => {
    const result = await tryCreateClaim(request, ownerToken, {
      item: approvedItemId,
      message: 'Trying to claim my own item',
    })

    expect(result.status).toBe(400)
  })

  test('cannot submit a duplicate claim on the same item', async ({ request }) => {
    // First claim — should succeed
    await createClaim(request, otherToken, {
      item: approvedItemId,
      message: 'First claim',
    })

    // Second claim by same user — should be rejected
    const duplicate = await tryCreateClaim(request, otherToken, {
      item: approvedItemId,
      message: 'Duplicate claim attempt',
    })

    expect(duplicate.status).toBe(400)
  })
})
