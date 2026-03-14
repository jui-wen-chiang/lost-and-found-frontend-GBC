/**
 * TC-AUTH-001 — Successful User Login
 *
 * Requirement: FR-2 – User Authentication
 * Priority:    High
 * Type:        Positive + Negative
 *
 * Pre-conditions: User account exists with valid credentials,
 *                 application services are operational.
 */
import { test, expect } from '@playwright/test'
import { uniqueEmail, STRONG_PASSWORD } from '../fixtures/test-data'
import { registerUser } from '../helpers/api.helpers'

test.describe('TC-AUTH-001: User Login', () => {
  let email: string
  const password = STRONG_PASSWORD

  test.beforeEach(async ({ request }) => {
    // Pre-condition: create a fresh user via API
    email = uniqueEmail('login')
    await registerUser(request, {
      email,
      full_name: 'Login Test User',
      password,
      password_confirm: password,
    })
  })

  test('should log in with valid credentials and redirect to home', async ({ page }) => {
    // 1. Navigate to Login page
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()

    // 2-4. Enter credentials
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill(password)

    // 5. Click Login
    await page.getByRole('button', { name: /^login$/i }).click()

    // Expected: redirected away from /login
    await expect(page).not.toHaveURL(/\/login/)

    // Expected: token stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('access_token'))
    expect(token).toBeTruthy()

    // Expected: no error messages
    await expect(page.getByRole('alert')).not.toBeVisible()
  })

  test('should show error for wrong password', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill('WrongPassword@99')
    await page.getByRole('button', { name: /^login$/i }).click()

    // Expected: error alert displayed
    await expect(page.getByRole('alert')).toBeVisible()

    // Should remain on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show error for non-existent email', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('nonexistent_user_xyz@test.example.com')
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: /^login$/i }).click()

    // Expected: error alert displayed
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should disable login button when fields are empty', async ({ page }) => {
    await page.goto('/login')

    // Button should be disabled with empty fields
    await expect(page.getByRole('button', { name: /^login$/i })).toBeDisabled()
  })

  test('should navigate to register page via link', async ({ page }) => {
    await page.goto('/login')
    await page.locator('form').getByRole('link', { name: /register/i }).click()
    await expect(page).toHaveURL(/\/register/)
  })
})
