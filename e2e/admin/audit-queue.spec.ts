/**
 * TC-ADMIN-001 — Admin Approves and Rejects a Post
 *
 * Requirement: FR-9 – Admin Content Moderation
 * Priority:    High
 * Type:        Positive + Negative
 *
 * Tests:
 *   1. Admin can fetch the audit queue — pending items appear
 *   2. Admin can approve a pending item → status becomes 'approved'
 *   3. Admin can reject a pending item with a reason → status becomes 'rejected'
 *   4. Non-admin cannot access the audit queue (403)
 *   5. Non-admin cannot approve an item (403)
 *   6. Admin cannot approve an already-approved item (400)
 */
import { test, expect } from '../fixtures/auth.fixture'
import {
  registerUser,
  loginUser,
  createItem,
  deleteItem,
  fetchCategories,
  fetchLocations,
  fetchAuditQueue,
  approveItem,
  rejectItem,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from '../fixtures/test-data'

const API_BASE = 'http://127.0.0.1:8000'

test.describe('TC-ADMIN-001: Admin Approve/Reject Post', () => {
  let adminToken: string
  let userToken: string
  let categoryId: number
  let locationId: number

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

    const userReg = await registerUser(request, {
      email: uniqueEmail('audit-user'),
      full_name: 'Audit Test User',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    userToken = userReg.tokens.access

    const categories = await fetchCategories(request, userToken)
    const locations = await fetchLocations(request, userToken)
    categoryId = categories[0].id
    locationId = locations[0].id
  })

  test('admin can fetch audit queue and see pending items', async ({ request }) => {
    const item = await createItem(request, userToken, {
      title: `E2E Audit Queue ${Date.now()}`,
      description: 'Item for audit queue test',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    const queue = await fetchAuditQueue(request, adminToken)
    const ids = queue.map((i: { id: number }) => i.id)
    expect(ids).toContain(item.id)

    await deleteItem(request, userToken, item.id)
  })

  test('admin can approve a pending item → status becomes approved', async ({ request }) => {
    const item = await createItem(request, userToken, {
      title: `E2E Approve Item ${Date.now()}`,
      description: 'Item to be approved',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    await approveItem(request, adminToken, item.id)

    // Verify status changed
    const res = await request.get(`${API_BASE}/api/items/${item.id}/`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const body = await res.json()
    expect(body.status).toBe('approved')

    await deleteItem(request, userToken, item.id)
  })

  test('admin can reject a pending item with a reason → status becomes rejected', async ({ request }) => {
    const item = await createItem(request, userToken, {
      title: `E2E Reject Item ${Date.now()}`,
      description: 'Item to be rejected',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    await rejectItem(request, adminToken, item.id, 'Description too vague for E2E test')

    const res = await request.get(`${API_BASE}/api/items/${item.id}/`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const body = await res.json()
    expect(body.status).toBe('rejected')

    await deleteItem(request, userToken, item.id)
  })

  test('non-admin cannot access the audit queue (403)', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/admin/audit/posts/`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    expect(res.status()).toBe(403)
  })

  test('non-admin cannot approve an item (403)', async ({ request }) => {
    const item = await createItem(request, userToken, {
      title: `E2E Non-Admin Approve ${Date.now()}`,
      description: 'A regular user should not approve this',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    const res = await request.patch(`${API_BASE}/api/admin/items/${item.id}/approve/`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    expect(res.status()).toBe(403)

    await deleteItem(request, userToken, item.id)
  })

  test('admin cannot approve an already-approved item (400)', async ({ request }) => {
    const item = await createItem(request, userToken, {
      title: `E2E Double Approve ${Date.now()}`,
      description: 'Should not be approved twice',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    await approveItem(request, adminToken, item.id)

    // Second approve — should fail
    const res = await request.patch(`${API_BASE}/api/admin/items/${item.id}/approve/`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status()).toBe(400)

    await deleteItem(request, userToken, item.id)
  })
})
