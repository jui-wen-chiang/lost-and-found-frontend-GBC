/**
 * TC-EXPIRE-001 — Unclaimed Items Marked as Expired
 *
 * Requirement: FR-14 – Automated Expiration System
 * Priority:    Medium
 * Type:        Positive
 *
 * ⚠️  SKIPPED — BACKEND TRIGGER NOT IMPLEMENTED
 *
 * The backend has expiration logic in ReportUtils.get_unclaimed_expired_items()
 * (api/utils/report_utils.py) which calculates expiration based on
 * category.expires_day. However:
 *
 *   - No Django management command or scheduled task (cron/celery) triggers
 *     the actual status update of items from "approved" to "expired".
 *   - The unclaimed items report (/api/reports/unclaimed-item/) correctly
 *     calculates days_overdue but doesn't change item status.
 *   - The frontend ItemDetailPage shows an expired warning based on
 *     client-side daysOld() calculation (30+ days), but this is display-only.
 *
 * Re-enable this test when:
 *   1. A management command or celery task is added to mark items as expired
 *   2. An "expired" status is added to the Item model choices
 *   3. The status change is reflected in both user and admin views
 */
import { test, expect } from '../fixtures/auth.fixture'

test.describe('TC-EXPIRE-001: Automated Expiration of Unclaimed Items', () => {
  test.skip(true, 'Backend expiration trigger not implemented — see file header for details')

  test('unclaimed items should be marked as expired after retention period', async ({
    authenticatedPage: page,
  }) => {
    // Test steps (to be implemented when backend is ready):
    //
    // 1. Create an item via API with a creation date older than the retention period
    //    (e.g., set created_at to 60 days ago via direct DB manipulation or test fixture)
    //
    // 2. Trigger the expiration scan:
    //    - Option A: Call management command `python manage.py expire_unclaimed_items`
    //    - Option B: Call a scheduled task endpoint
    //
    // 3. Verify the item's status changed to "expired" via:
    //    - GET /api/items/:id/ — check status field
    //    - Navigate to item detail page — verify "Expired" status chip
    //
    // 4. Verify the expired item appears in admin unclaimed report:
    //    - Navigate to /admin/reports
    //    - Verify the item is listed with correct days_overdue
    //
    // 5. Verify user dashboard reflects the expired status
  })
})
