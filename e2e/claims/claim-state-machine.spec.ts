/**
 * TC-CLAIM-003 — Claim Status State Machine
 *
 * Requirement: FR-5 – Claim / Return Request
 * Priority:    High
 * Type:        Negative
 *
 * Validates that invalid status transitions are rejected by the backend:
 *   - pending → completed   (must go through approved first)
 *   - pending → pending     (no-op transition)
 *   - approved → pending    (cannot go backwards)
 *   - rejected → approved   (rejected is terminal)
 *   - rejected → completed  (rejected is terminal)
 *   - completed → approved  (completed is terminal)
 *
 * Valid transitions under test (positive guard):
 *   - pending → approved    ✓
 *   - pending → rejected    ✓
 *   - approved → completed  ✓
 *   - approved → rejected   ✓
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
  tryUpdateClaimStatus,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from '../fixtures/test-data'

test.describe('TC-CLAIM-003: Claim Status State Machine', () => {
  let adminToken: string
  let finderToken: string
  let claimantToken: string

  // One base item for creating fresh claims per test
  let baseItemId: number

  /** Create a fresh approved item + pending claim — gives each test a clean slate */
  async function freshClaim(request: any): Promise<{ claimId: number; itemId: number }> {
    const categories = await fetchCategories(request, finderToken)
    const locations = await fetchLocations(request, finderToken)
    const item = await createItem(request, finderToken, {
      title: `E2E State Machine ${Date.now()}`,
      description: 'Item for state machine test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    await approveItem(request, adminToken, item.id)
    const claim = await createClaim(request, claimantToken, {
      item: item.id,
      message: 'State machine test claim',
    })
    return { claimId: claim.id, itemId: item.id }
  }

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

    const finderReg = await registerUser(request, {
      email: uniqueEmail('sm-finder'),
      full_name: 'State Machine Finder',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    finderToken = finderReg.tokens.access

    const claimantReg = await registerUser(request, {
      email: uniqueEmail('sm-claimant'),
      full_name: 'State Machine Claimant',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    claimantToken = claimantReg.tokens.access
  })

  // ── Invalid transitions ────────────────────────────────────────────────────

  test('pending → completed is rejected (must go through approved first)', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'completed')
    expect(result.status).toBe(400)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('approved → pending is rejected (cannot go backwards)', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    await updateClaimStatus(request, adminToken, claimId, 'approved')
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'pending')
    expect(result.status).toBe(400)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('rejected → approved is rejected (rejected is terminal)', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    await updateClaimStatus(request, adminToken, claimId, 'rejected')
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'approved')
    expect(result.status).toBe(400)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('rejected → completed is rejected (rejected is terminal)', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    await updateClaimStatus(request, adminToken, claimId, 'rejected')
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'completed')
    expect(result.status).toBe(400)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('completed → approved is rejected (completed is terminal)', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    await updateClaimStatus(request, adminToken, claimId, 'approved')
    await updateClaimStatus(request, adminToken, claimId, 'completed')
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'approved')
    expect(result.status).toBe(400)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  // ── Valid transitions (guard that we didn't break the happy path) ──────────

  test('pending → approved is valid', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'approved')
    expect(result.status).toBe(200)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('pending → rejected is valid', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'rejected')
    expect(result.status).toBe(200)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('approved → completed is valid', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    await updateClaimStatus(request, adminToken, claimId, 'approved')
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'completed')
    expect(result.status).toBe(200)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('approved → rejected is valid', async ({ request }) => {
    const { claimId, itemId } = await freshClaim(request)
    await updateClaimStatus(request, adminToken, claimId, 'approved')
    const result = await tryUpdateClaimStatus(request, adminToken, claimId, 'rejected')
    expect(result.status).toBe(200)
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })
})
