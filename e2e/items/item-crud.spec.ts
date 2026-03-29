/**
 * TC-ITEM-002 — Item CRUD Operations
 *
 * Requirement: FR-6 – Create, Edit, Delete Posts
 * Priority:    High
 * Type:        Positive + Negative
 *
 * Tests:
 *   1. A user can create a found item → status is 'pending'
 *   2. A user can create a lost item → status is 'pending'
 *   3. Owner can update their item's title and description
 *   4. Owner can delete their item
 *   5. Admin can edit any item
 *   6. Non-owner cannot delete another user's item (403)
 *   7. Non-owner cannot edit another user's item (403)
 */
import { test, expect } from '../fixtures/auth.fixture'
import {
  registerUser,
  loginUser,
  createItem,
  updateItem,
  deleteItem,
  fetchCategories,
  fetchLocations,
} from '../helpers/api.helpers'
import { uniqueEmail, STRONG_PASSWORD, ADMIN_CREDENTIALS } from '../fixtures/test-data'

test.describe('TC-ITEM-002: Item CRUD Operations', () => {
  let adminToken: string
  let ownerToken: string
  let strangerToken: string

  let categoryId: number
  let locationId: number

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
    } catch { /* already exists */ }
    const adminLogin = await loginUser(request, ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password)
    adminToken = adminLogin.access

    const ownerReg = await registerUser(request, {
      email: uniqueEmail('item-owner'),
      full_name: 'Item Owner',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    ownerToken = ownerReg.tokens.access

    const strangerReg = await registerUser(request, {
      email: uniqueEmail('item-stranger'),
      full_name: 'Item Stranger',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })
    strangerToken = strangerReg.tokens.access

    const categories = await fetchCategories(request, ownerToken)
    const locations = await fetchLocations(request, ownerToken)
    categoryId = categories[0].id
    locationId = locations[0].id
  })

  // ── Create ─────────────────────────────────────────────────────────────────

  test('user can create a found item — status is pending', async ({ request }) => {
    const item = await createItem(request, ownerToken, {
      title: `E2E Found Item ${Date.now()}`,
      description: 'A found item created by E2E tests',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    expect(item.id).toBeTruthy()
    expect(item.item_type).toBe('found')
    expect(item.status).toBe('pending')

    await deleteItem(request, ownerToken, item.id)
  })

  test('user can create a lost item — status is pending', async ({ request }) => {
    const item = await createItem(request, ownerToken, {
      title: `E2E Lost Item ${Date.now()}`,
      description: 'A lost item created by E2E tests',
      item_type: 'lost',
      category: categoryId,
      location: locationId,
    })

    expect(item.id).toBeTruthy()
    expect(item.item_type).toBe('lost')
    expect(item.status).toBe('pending')

    await deleteItem(request, ownerToken, item.id)
  })

  // ── Update ─────────────────────────────────────────────────────────────────

  test('owner can update their item title and description', async ({ request }) => {
    const item = await createItem(request, ownerToken, {
      title: `E2E Update Before ${Date.now()}`,
      description: 'Original description',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    const updated = await updateItem(request, ownerToken, item.id, {
      title: 'Updated Title',
      description: 'Updated description',
    })

    expect(updated.title).toBe('Updated Title')
    expect(updated.description).toBe('Updated description')

    await deleteItem(request, ownerToken, item.id)
  })

  test('admin can edit any item', async ({ request }) => {
    const item = await createItem(request, ownerToken, {
      title: `E2E Admin Edit ${Date.now()}`,
      description: 'Before admin edit',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    const updated = await updateItem(request, adminToken, item.id, {
      description: 'Edited by admin',
    })

    expect(updated.description).toBe('Edited by admin')

    await deleteItem(request, ownerToken, item.id)
  })

  // ── Delete ─────────────────────────────────────────────────────────────────

  test('owner can delete their item', async ({ request }) => {
    const item = await createItem(request, ownerToken, {
      title: `E2E Delete Me ${Date.now()}`,
      description: 'This item will be deleted',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    // Should not throw
    await deleteItem(request, ownerToken, item.id)

    // Confirm it is gone — GET should return 404
    const res = await request.get(`http://127.0.0.1:8000/api/items/${item.id}/`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    })
    expect(res.status()).toBe(404)
  })

  // ── Negative: ownership enforcement ────────────────────────────────────────

  test('non-owner cannot delete another user\'s item (403)', async ({ request }) => {
    const item = await createItem(request, ownerToken, {
      title: `E2E No-Delete ${Date.now()}`,
      description: 'A stranger should not delete this',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    const res = await request.delete(`http://127.0.0.1:8000/api/items/${item.id}/`, {
      headers: { Authorization: `Bearer ${strangerToken}` },
    })
    expect(res.status()).toBe(403)

    await deleteItem(request, ownerToken, item.id)
  })

  test('non-owner cannot edit another user\'s item (403)', async ({ request }) => {
    const item = await createItem(request, ownerToken, {
      title: `E2E No-Edit ${Date.now()}`,
      description: 'A stranger should not edit this',
      item_type: 'found',
      category: categoryId,
      location: locationId,
    })

    const res = await request.patch(`http://127.0.0.1:8000/api/items/${item.id}/`, {
      headers: { Authorization: `Bearer ${strangerToken}` },
      data: { title: 'Hacked title' },
    })
    expect(res.status()).toBe(403)

    await deleteItem(request, ownerToken, item.id)
  })
})
