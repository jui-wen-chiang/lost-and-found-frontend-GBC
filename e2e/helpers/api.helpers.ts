/**
 * Direct API helpers using Playwright's APIRequestContext.
 * These bypass the UI for fast test data setup / teardown.
 */
import { APIRequestContext } from '@playwright/test'

const API_BASE = 'http://127.0.0.1:8000'

// ─── Auth helpers ────────────────────────────────────────────────────────────

interface RegisterPayload {
  email: string
  full_name: string
  password: string
  password_confirm: string
  role?: string
}

interface AuthTokens {
  access: string
  refresh: string
}

interface RegisterResponse {
  tokens: AuthTokens
  user: { id: number; email: string; role: string }
}

interface LoginResponse {
  access: string
  refresh: string
  user: { id: number; email: string; role: string }
}

/** Register a new user via the API and return tokens + user info. */
export async function registerUser(
  request: APIRequestContext,
  data: RegisterPayload,
): Promise<RegisterResponse> {
  const res = await request.post(`${API_BASE}/api/auth/register/`, {
    data: { role: 'student', ...data },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Register failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Log in and return access + refresh tokens. */
export async function loginUser(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await request.post(`${API_BASE}/api/auth/login/`, {
    data: { email, password },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Login failed (${res.status()}): ${body}`)
  }
  return res.json()
}

// ─── Item helpers ────────────────────────────────────────────────────────────

interface ItemPayload {
  title: string
  description: string
  item_type: 'lost' | 'found'
  category: number
  location: number
  lost_at?: string
  found_at?: string
}

interface ApiItem {
  id: number
  title: string
  description: string
  item_type: string
  status: string
  category: number
  location: number
  owner: number
  [key: string]: unknown
}

/** Create an item via the API (requires auth token). */
export async function createItem(
  request: APIRequestContext,
  token: string,
  data: ItemPayload,
): Promise<ApiItem> {
  const res = await request.post(`${API_BASE}/api/items/`, {
    headers: { Authorization: `Bearer ${token}` },
    multipart: {
      title: data.title,
      description: data.description,
      item_type: data.item_type,
      category: String(data.category),
      location: String(data.location),
      ...(data.lost_at ? { lost_at: data.lost_at } : {}),
      ...(data.found_at ? { found_at: data.found_at } : {}),
    },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Create item failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Update (partial) an item via the API (requires auth token — owner or admin). */
export async function updateItem(
  request: APIRequestContext,
  token: string,
  itemId: number,
  data: Partial<ItemPayload>,
): Promise<ApiItem> {
  // ItemDetailView uses MultiPartParser only — must send multipart/form-data
  const multipartData: Record<string, string> = {}
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) multipartData[k] = String(v)
  }
  const res = await request.patch(`${API_BASE}/api/items/${itemId}/`, {
    headers: { Authorization: `Bearer ${token}` },
    multipart: multipartData,
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Update item failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Delete an item via the API (requires auth token). */
export async function deleteItem(
  request: APIRequestContext,
  token: string,
  itemId: number,
): Promise<void> {
  const res = await request.delete(`${API_BASE}/api/items/${itemId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok() && res.status() !== 404) {
    const body = await res.text()
    throw new Error(`Delete item failed (${res.status()}): ${body}`)
  }
}

// ─── Reference data helpers ─────────────────────────────────────────────────

interface Category {
  id: number
  name: string
}

interface Location {
  id: number
  name: string
  campus: string
}

/** Fetch all categories. */
export async function fetchCategories(
  request: APIRequestContext,
  token: string,
): Promise<Category[]> {
  const res = await request.get(`${API_BASE}/api/categories/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

/** Fetch all locations. */
export async function fetchLocations(
  request: APIRequestContext,
  token: string,
): Promise<Location[]> {
  const res = await request.get(`${API_BASE}/api/locations/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

// ─── Admin helpers ───────────────────────────────────────────────────────────

/** Fetch the admin audit queue (pending items). */
export async function fetchAuditQueue(
  request: APIRequestContext,
  adminToken: string,
): Promise<ApiItem[]> {
  const res = await request.get(`${API_BASE}/api/admin/audit/posts/`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Fetch audit queue failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Approve an item (admin). */
export async function approveItem(
  request: APIRequestContext,
  adminToken: string,
  itemId: number,
): Promise<void> {
  const res = await request.patch(`${API_BASE}/api/admin/items/${itemId}/approve/`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Approve item failed (${res.status()}): ${body}`)
  }
}

// ─── Claim helpers ───────────────────────────────────────────────────────────

interface ClaimPayload {
  item: number
  message: string
}

interface ApiClaim {
  id: number
  item: number
  claimant: number
  message: string
  status: string
  created_at: string
}

/** Create a claim via the API. */
export async function createClaim(
  request: APIRequestContext,
  token: string,
  data: ClaimPayload,
): Promise<ApiClaim> {
  const res = await request.post(`${API_BASE}/api/claims/`, {
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Create claim failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Update claim status (admin). */
export async function updateClaimStatus(
  request: APIRequestContext,
  adminToken: string,
  claimId: number,
  status: string,
): Promise<void> {
  const res = await request.patch(`${API_BASE}/api/claims/${claimId}/status/`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { status },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Update claim status failed (${res.status()}): ${body}`)
  }
}

// ─── Appointment helpers ─────────────────────────────────────────────────────

interface AppointmentPayload {
  claim: number
  scheduled_at: string
  location?: number
}

/** Create an appointment via the API. */
export async function createAppointment(
  request: APIRequestContext,
  token: string,
  data: AppointmentPayload,
): Promise<{ message: string; appointment_id: number }> {
  const res = await request.post(`${API_BASE}/api/appointments/`, {
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Create appointment failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Update appointment status (admin). */
export async function updateAppointmentStatus(
  request: APIRequestContext,
  adminToken: string,
  appointmentId: number,
  status: string,
): Promise<{ message: string; status: string }> {
  const res = await request.patch(
    `${API_BASE}/api/appointments/${appointmentId}/status/`,
    {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { status },
    },
  )
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Update appointment status failed (${res.status()}): ${body}`)
  }
  return res.json()
}

// ─── Coupon helpers ──────────────────────────────────────────────────────────

interface ApiCoupon {
  id: number
  code: string
  is_redeemed: boolean
  expires_at: string
}

/** Fetch coupons for a user. */
export async function fetchUserCoupons(
  request: APIRequestContext,
  token: string,
): Promise<ApiCoupon[]> {
  const res = await request.get(`${API_BASE}/api/coupons/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Fetch coupons failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Activate a coupon by code (owner user). */
export async function activateCoupon(
  request: APIRequestContext,
  token: string,
  code: string,
): Promise<{ message: string }> {
  const res = await request.post(`${API_BASE}/api/coupons/activate/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { code },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Activate coupon failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Reject an item (admin). */
export async function rejectItem(
  request: APIRequestContext,
  adminToken: string,
  itemId: number,
  reason = '',
): Promise<void> {
  const res = await request.patch(`${API_BASE}/api/admin/items/${itemId}/reject/`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { reason },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Reject item failed (${res.status()}): ${body}`)
  }
}

/**
 * Attempt to create a claim and return the raw response status + body.
 * Unlike createClaim, this does NOT throw on non-2xx — useful for negative tests.
 */
export async function tryCreateClaim(
  request: APIRequestContext,
  token: string,
  data: { item: number; message: string },
): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await request.post(`${API_BASE}/api/claims/`, {
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  const body = await res.json().catch(() => ({}))
  return { status: res.status(), body }
}

/**
 * Attempt to create an appointment and return the raw response.
 * Does NOT throw on non-2xx — useful for negative tests.
 */
export async function tryCreateAppointment(
  request: APIRequestContext,
  token: string,
  data: { claim: number; scheduled_at: string },
): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await request.post(`${API_BASE}/api/appointments/`, {
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  const body = await res.json().catch(() => ({}))
  return { status: res.status(), body }
}

/**
 * Attempt to update claim status and return the raw response.
 * Does NOT throw on non-2xx — useful for negative/state-machine tests.
 */
export async function tryUpdateClaimStatus(
  request: APIRequestContext,
  adminToken: string,
  claimId: number,
  status: string,
): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await request.patch(`${API_BASE}/api/claims/${claimId}/status/`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { status },
  })
  const body = await res.json().catch(() => ({}))
  return { status: res.status(), body }
}

// ─── Expiration helpers ──────────────────────────────────────────────────────

/** Trigger expiration scan (admin). */
export async function triggerExpiration(
  request: APIRequestContext,
  adminToken: string,
): Promise<{ executed_at: string; expired_count: number }> {
  const res = await request.post(`${API_BASE}/api/reports/trigger-expire/`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Trigger expiration failed (${res.status()}): ${body}`)
  }
  return res.json()
}
