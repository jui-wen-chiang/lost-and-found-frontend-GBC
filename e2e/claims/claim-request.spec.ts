/**
 * TC-CLAIM-001 — Submit Claim Request and Schedule Appointment
 *
 * Requirement: FR-5 – Claim Request and Appointment Scheduling
 * Priority:    High
 * Type:        Positive
 *
 * ⚠️  SKIPPED — BACKEND NOT IMPLEMENTED
 *
 * Current state:
 *   - Backend: Claim model exists (api/models/claim.py) with fields:
 *     item, claimant, message, status (pending/approved/rejected/completed).
 *     However, NO views or URL routes are implemented for claims.
 *     The api/urls.py has no claim-related endpoints.
 *
 *   - Backend: Appointment model exists (api/models/appointment.py) with:
 *     claim, location, scheduled_at, status (scheduled/cancelled/completed).
 *     Again, NO views or URL routes are implemented.
 *
 *   - Frontend: ClaimRequestPage.tsx is a placeholder that uses mock submission
 *     (console.log + setTimeout). It does NOT call any backend API.
 *
 *   - Frontend: AppointmentSchedulerPage.tsx appears to be a stub/placeholder.
 *
 * Re-enable this test when:
 *   1. POST /api/claims/ endpoint is implemented (create claim)
 *   2. GET /api/claims/ endpoint is implemented (list user claims)
 *   3. POST /api/appointments/ endpoint ties claims to scheduled times
 *   4. Frontend ClaimRequestPage connects to real API
 *   5. Frontend AppointmentSchedulerPage is fully implemented
 */
import { test, expect } from '../fixtures/auth.fixture'

test.describe('TC-CLAIM-001: Submit Claim and Schedule Appointment', () => {
  test.skip(true, 'Backend claim/appointment endpoints not implemented — see file header')

  test('should submit a claim for a found item and schedule an appointment', async ({
    authenticatedPage: page,
  }) => {
    // Test steps (to be implemented when backend is ready):
    //
    // Pre-condition: create a found item owned by a DIFFERENT user via API
    //
    // 1. Navigate to the detail page of the found item
    //    await page.goto(`/items/${itemId}`)
    //
    // 2. Click the "Claim" button
    //    await page.getByRole('button', { name: /claim item/i }).click()
    //
    // 3. Fill in the claim form with identifying details:
    //    - Full name, student ID, email, phone
    //    - Item description / verification answer
    //    await page.getByLabel('Full Name').fill('Claimant Name')
    //    await page.getByLabel('Student ID').fill('100123456')
    //    ...
    //
    // 4. Select preferred appointment date and time
    //    await page.getByLabel(/date/i).fill('2026-04-01')
    //    await page.getByLabel(/time/i).fill('14:00')
    //
    // 5. Submit the claim request
    //    await page.getByRole('button', { name: /submit/i }).click()
    //
    // Expected Results:
    //    - Claim is created: verify redirect to confirmation page
    //    - Appointment is scheduled: verify visible in /appointments
    //    - Confirmation displayed on screen
    //    await expect(page.getByText(/claim.*submitted/i)).toBeVisible()
  })
})
