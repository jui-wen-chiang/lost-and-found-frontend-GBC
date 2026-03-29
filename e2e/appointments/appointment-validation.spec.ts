/**
 * TC-APPT-002 — Appointment Scheduling Validation
 *
 * Requirement: FR-11 – Appointment Management
 * Priority:    High
 * Type:        Negative
 *
 * Tests that the backend correctly rejects invalid appointment attempts:
 *   1. Cannot schedule an appointment in the past
 *   2. Cannot create a duplicate appointment for the same claim
 *   3. A non-claimant cannot schedule on behalf of another user's claim
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
  createAppointment,
  tryCreateAppointment,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from '../fixtures/test-data'

function futureDateISO(daysFromNow: number): string {
  const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 19)
}

function pastDateISO(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 19)
}

test.describe('TC-APPT-002: Appointment Scheduling Validation', () => {
  let adminToken: string
  let finderToken: string
  let claimantToken: string
  let strangerToken: string

  let itemId: number
  let claimId: number

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
      email: uniqueEmail('appt-val-finder'),
      full_name: 'Appt Validation Finder',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    finderToken = finderReg.tokens.access

    const claimantReg = await registerUser(request, {
      email: uniqueEmail('appt-val-claimant'),
      full_name: 'Appt Validation Claimant',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    claimantToken = claimantReg.tokens.access

    const strangerReg = await registerUser(request, {
      email: uniqueEmail('appt-val-stranger'),
      full_name: 'Appt Validation Stranger',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    strangerToken = strangerReg.tokens.access

    const categories = await fetchCategories(request, finderToken)
    const locations = await fetchLocations(request, finderToken)

    const item = await createItem(request, finderToken, {
      title: `E2E Appt Validation ${Date.now()}`,
      description: 'Found item for appointment validation tests',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    itemId = item.id
    await approveItem(request, adminToken, itemId)

    const claim = await createClaim(request, claimantToken, { item: itemId, message: 'Mine' })
    claimId = claim.id
    await updateClaimStatus(request, adminToken, claimId, 'approved')
  })

  test.afterAll(async ({ request }) => {
    try { await deleteItem(request, finderToken, itemId) } catch { /* best-effort */ }
  })

  test('cannot schedule an appointment in the past', async ({ request }) => {
    const result = await tryCreateAppointment(request, claimantToken, {
      claim: claimId,
      scheduled_at: pastDateISO(1),
    })

    expect(result.status).toBe(400)
  })

  test('cannot create a second appointment for the same claim', async ({ request }) => {
    // First appointment — should succeed
    await createAppointment(request, claimantToken, {
      claim: claimId,
      scheduled_at: futureDateISO(10),
    })

    // Second attempt — should be rejected
    const duplicate = await tryCreateAppointment(request, claimantToken, {
      claim: claimId,
      scheduled_at: futureDateISO(11),
    })

    expect(duplicate.status).toBe(400)
  })

  test('a stranger cannot schedule an appointment for another user\'s claim', async ({ request }) => {
    // Create a fresh claim for this test (the one above already has an appointment)
    const categories = await fetchCategories(request, finderToken)
    const locations = await fetchLocations(request, finderToken)
    const item2 = await createItem(request, finderToken, {
      title: `E2E Stranger Appt ${Date.now()}`,
      description: 'Found item for stranger appointment test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    await approveItem(request, adminToken, item2.id)
    const claim2 = await createClaim(request, claimantToken, { item: item2.id, message: 'Mine' })
    await updateClaimStatus(request, adminToken, claim2.id, 'approved')

    // Stranger tries to schedule on claimant's claim
    const result = await tryCreateAppointment(request, strangerToken, {
      claim: claim2.id,
      scheduled_at: futureDateISO(15),
    })

    expect(result.status).toBe(403)

    // Cleanup
    try { await deleteItem(request, finderToken, item2.id) } catch { /* best-effort */ }
  })
})
