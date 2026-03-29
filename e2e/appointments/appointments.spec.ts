/**
 * TC-APPT-001 — Admin Manages Appointment Requests
 *
 * Requirement: FR-11 – Appointment Management
 * Priority:    Medium
 * Type:        Positive
 *
 * Tests the appointment management flow:
 *   1. Setup: finder creates item → admin approves → claimant submits claim
 *      → admin approves claim → claimant creates appointment via API
 *   2. Admin confirms (completes) an appointment via API
 *   3. Admin cancels an appointment via API
 *
 * Note: The admin appointments page (GET /api/appointments/) does not have
 * a backend list endpoint, so admin actions are tested via direct API calls
 * and the user-facing appointment scheduler is tested through the UI.
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

test.describe('TC-APPT-001: Admin Processes Appointment Request', () => {
  let finderToken: string
  let claimantToken: string
  let adminToken: string
  let itemId: number
  let claimId: number

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
      full_name: 'Finder User',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    finderToken = finderReg.tokens.access

    // Register claimant
    const claimantEmail = uniqueEmail('claimant')
    const claimantReg = await registerUser(request, {
      email: claimantEmail,
      full_name: 'Claimant User',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    claimantToken = claimantReg.tokens.access

    // Create and approve a found item
    const categories = await fetchCategories(request, finderToken)
    const locations = await fetchLocations(request, finderToken)
    const item = await createItem(request, finderToken, {
      title: `E2E Appointment Item ${Date.now()}`,
      description: 'Found item for appointment E2E test',
      item_type: 'found',
      category: categories[0].id,
      location: locations[0].id,
    })
    itemId = item.id
    await approveItem(request, adminToken, itemId)

    // Claimant submits a claim, admin approves it
    const claim = await createClaim(request, claimantToken, {
      item: itemId,
      message: 'This is my item',
    })
    claimId = claim.id
    await updateClaimStatus(request, adminToken, claimId, 'approved')
  })

  test.afterAll(async ({ request }) => {
    try {
      await deleteItem(request, finderToken, itemId)
    } catch {
      // Best-effort cleanup
    }
  })

  test('admin should confirm an appointment request', async ({ request }) => {
    // Create an appointment for the approved claim
    const appt = await createAppointment(request, claimantToken, {
      claim: claimId,
      scheduled_at: '2026-03-10T10:00:00',
    })

    // Admin marks it as completed
    const result = await updateAppointmentStatus(
      request,
      adminToken,
      appt.appointment_id,
      'completed',
    )

    expect(result.status).toBe('completed')
    expect(result.message).toBe('Appointment status updated')
  })

  test('admin should reject an appointment request', async ({ request }) => {
    // Create another appointment (different time slot)
    const appt = await createAppointment(request, claimantToken, {
      claim: claimId,
      scheduled_at: '2026-03-11T09:30:00',
    })

    // Admin cancels it
    const result = await updateAppointmentStatus(
      request,
      adminToken,
      appt.appointment_id,
      'rejected',
    )

    expect(result.status).toBe('rejected')
    expect(result.message).toBe('Appointment status updated')
  })
})
