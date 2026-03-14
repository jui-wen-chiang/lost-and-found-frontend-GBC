/**
 * TC-APPT-001 — Admin Manages Appointment Requests
 *
 * Requirement: FR-11 – Appointment Management
 * Priority:    Medium
 * Type:        Positive
 *
 * ⚠️  SKIPPED — BACKEND NOT IMPLEMENTED
 *
 * Current state:
 *   - Backend: Appointment model exists (api/models/appointment.py) with fields:
 *     claim (FK to Claim), location (FK), scheduled_at, status
 *     (scheduled/cancelled/completed). NO views or URL routes implemented.
 *
 *   - Frontend: AppointmentsPage.tsx is a minimal stub placeholder with
 *     almost no content.
 *
 *   - Frontend: AdminAppointmentsPage.tsx (admin side) is also likely a stub.
 *
 * Re-enable this test when:
 *   1. GET /api/appointments/ endpoint is implemented (list appointments)
 *   2. PATCH /api/appointments/:id/ endpoint supports status changes
 *      (confirm = "scheduled" → "completed", reject = "scheduled" → "cancelled")
 *   3. Frontend AppointmentsPage displays real appointment data
 *   4. Frontend AdminAppointmentsPage allows admin to confirm/reject
 */
import { test, expect } from '../fixtures/auth.fixture'

test.describe('TC-APPT-001: Admin Processes Appointment Request', () => {
  test.skip(true, 'Backend appointment endpoints not implemented — see file header')

  test('admin should review and confirm an appointment request', async ({
    adminPage: page,
  }) => {
    // Test steps (to be implemented when backend is ready):
    //
    // Pre-condition: Create a claim with a scheduled appointment via API
    //
    // 1. Navigate to Appointments management page
    //    await page.goto('/admin/appointments')
    //
    // 2. Review a pending appointment request
    //    await expect(page.getByText(/scheduled/i)).toBeVisible()
    //
    // 3. Confirm the appointment
    //    await page.getByRole('button', { name: /confirm/i }).click()
    //
    // Expected Results:
    //    - Appointment status updated to "completed"
    //    - Change reflected in user's dashboard
    //    await expect(page.getByText(/completed/i)).toBeVisible()
  })

  test('admin should reject an appointment request', async ({
    adminPage: page,
  }) => {
    // 1. Navigate to Appointments management page
    //    await page.goto('/admin/appointments')
    //
    // 2. Reject the appointment
    //    await page.getByRole('button', { name: /reject|cancel/i }).click()
    //
    // Expected: status updated to "cancelled"
    //    await expect(page.getByText(/cancelled/i)).toBeVisible()
  })
})
