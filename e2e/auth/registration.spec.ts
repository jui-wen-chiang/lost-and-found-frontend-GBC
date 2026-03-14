/**
 * TC-REG-001 — Successful Account Creation
 *
 * Requirement: FR-1 – Account Creation
 * Priority:    High
 * Type:        Positive + Negative
 *
 * Pre-conditions: Application services are operational,
 *                 email address is not already registered.
 */
import { test, expect } from '@playwright/test'
import { uniqueEmail, STRONG_PASSWORD, WEAK_PASSWORD } from '../fixtures/test-data'

test.describe('TC-REG-001: Account Registration', () => {
  test('should register a new user successfully', async ({ page }) => {
    const email = uniqueEmail('reg')
    const fullName = 'Test Registrant'

    // 1. Navigate to Registration page
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible()

    // 2. Fill in valid registration data
    await page.getByLabel('Full Name').fill(fullName)
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password', { exact: true }).fill(STRONG_PASSWORD)
    await page.getByLabel('Confirm Password').fill(STRONG_PASSWORD)

    // 3. Submit the form
    await page.getByRole('button', { name: /create account/i }).click()

    // 4. Expected: redirected away from /register (to home or login)
    await expect(page).not.toHaveURL(/\/register/)

    // 5. No error alerts displayed
    await expect(page.getByRole('alert')).not.toBeVisible()
  })

  test('should show error for duplicate email', async ({ page, request }) => {
    const email = uniqueEmail('dup')

    // Pre-condition: register the user via API first
    const { registerUser } = await import('../helpers/api.helpers')
    await registerUser(request, {
      email,
      full_name: 'First User',
      password: STRONG_PASSWORD,
      password_confirm: STRONG_PASSWORD,
    })

    // Try to register again with the same email via UI
    await page.goto('/register')
    await page.getByLabel('Full Name').fill('Duplicate User')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password', { exact: true }).fill(STRONG_PASSWORD)
    await page.getByLabel('Confirm Password').fill(STRONG_PASSWORD)
    await page.getByRole('button', { name: /create account/i }).click()

    // Expected: error message displayed
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('should show validation errors for weak password', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Full Name').fill('Weak Pass User')
    await page.getByLabel('Email').fill(uniqueEmail('weak'))
    await page.getByLabel('Password', { exact: true }).fill(WEAK_PASSWORD)
    await page.getByLabel('Password', { exact: true }).blur()

    // The "Create account" button should be disabled when password is weak
    await expect(page.getByRole('button', { name: /create account/i })).toBeDisabled()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Full Name').fill('Mismatch User')
    await page.getByLabel('Email').fill(uniqueEmail('mismatch'))
    await page.getByLabel('Password', { exact: true }).fill(STRONG_PASSWORD)
    await page.getByLabel('Confirm Password').fill('DifferentPass@1')
    await page.getByLabel('Confirm Password').blur()

    // Expect mismatch helper text
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })
})
