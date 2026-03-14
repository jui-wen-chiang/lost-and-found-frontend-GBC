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
  const res = await request.post(`${API_BASE}/api/items/items/`, {
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  if (!res.ok()) {
    const body = await res.text()
    throw new Error(`Create item failed (${res.status()}): ${body}`)
  }
  return res.json()
}

/** Delete an item via the API (requires auth token). */
export async function deleteItem(
  request: APIRequestContext,
  token: string,
  itemId: number,
): Promise<void> {
  const res = await request.delete(`${API_BASE}/api/items/items/${itemId}/`, {
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
  const res = await request.get(`${API_BASE}/api/categories/categories/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

/** Fetch all locations. */
export async function fetchLocations(
  request: APIRequestContext,
  token: string,
): Promise<Location[]> {
  const res = await request.get(`${API_BASE}/api/locations/locations/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
