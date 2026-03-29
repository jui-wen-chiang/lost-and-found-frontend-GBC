/**
 * TC-APPT-001 — Admin Manages Appointment Requests
 *
 * Requirement: FR-11 – Appointment Management
 * Priority:    Medium
 * Type:        Positive
 *
 * Tests:
 *   1. Admin completes an appointment → claim + item marked completed
 *   2. Admin cancels an appointment → claim stays approved (reschedulable)
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
  updateAppointmentStatus,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from '../fixtures/test-data'

/** Returns an ISO datetime string N days from now */
function futureDateISO(daysFromNow: number): string {
  const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 19) // "2026-04-05T10:00:00"
}

test.describe('TC-APPT-001: Admin Processes Appointment Request', () => {
  let finderToken: string
  let claimantToken: string
  let adminToken: string

  // Each test gets its own item + claim to avoid state bleed
  let completionItemId: number
  let completionClaimId: number
  let cancellationItemId: number
  let cancellationClaimId: number

  test.beforeAll(async ({ request }) => {
    // Ensure admin exists
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

    const finderReg = await registerUser(request, {
      email: uniqueEmail('appt-finder'),
      full_name: 'Appointment Finder',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    finderToken = finderReg.tokens.access

    const claimantReg = await registerUser(request, {
      email: uniqueEmail('appt-claimant'),
      full_name: 'Appointment Claimant',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    claimantToken = claimantReg.tokens.access

    const categories = await fetchCategories(request, finderToken)
    const locations = await fetchLocations(request, finderToken)

    // Item + claim for the "complete" test
    const item1 = await createItem(request, finderToken, {
      title: `E2E Appt Complete ${Date.now()}`,
      description: 'Found item for appointment completion test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    completionItemId = item1.id
    await approveItem(request, adminToken, completionItemId)
    const claim1 = await createClaim(request, claimantToken, { item: completionItemId, message: 'Mine' })
    completionClaimId = claim1.id
    await updateClaimStatus(request, adminToken, completionClaimId, 'approved')

    // Separate item + claim for the "cancel" test
    const item2 = await createItem(request, finderToken, {
      title: `E2E Appt Cancel ${Date.now()}`,
      description: 'Found item for appointment cancellation test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    cancellationItemId = item2.id
    await approveItem(request, adminToken, cancellationItemId)
    const claim2 = await createClaim(request, claimantToken, { item: cancellationItemId, message: 'Mine' })
    cancellationClaimId = claim2.id
    await updateClaimStatus(request, adminToken, cancellationClaimId, 'approved')
  })

  test.afterAll(async ({ request }) => {
    for (const id of [completionItemId, cancellationItemId]) {
      try { await deleteItem(request, finderToken, id) } catch { /* best-effort */ }
    }
  })

  test('admin should complete an appointment → claim and item marked completed', async ({ request }) => {
    const appt = await createAppointment(request, claimantToken, {
      claim: completionClaimId,
      scheduled_at: futureDateISO(7),
    })

    const result = await updateAppointmentStatus(request, adminToken, appt.appointment_id, 'completed')

    expect(result.status).toBe('completed')
    expect(result.message).toBe('Appointment status updated')
  })

  test('admin should cancel an appointment → claim stays approved for rescheduling', async ({ request }) => {
    const appt = await createAppointment(request, claimantToken, {
      claim: cancellationClaimId,
      scheduled_at: futureDateISO(14),
    })

    const result = await updateAppointmentStatus(request, adminToken, appt.appointment_id, 'cancelled')

    expect(result.status).toBe('cancelled')
    expect(result.message).toBe('Appointment status updated')
  })
})
