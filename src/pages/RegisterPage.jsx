import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrength from "../components/PasswordStrength";
import { useAuth } from '../context/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  }
}

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false })
  const [submitError, setSubmitError] = useState('')

  const checks = useMemo(() => getPasswordChecks(password), [password])

  const emailError = (() => {
    if (!touched.email) return ''
    if (!email.trim()) return 'Email is required.'
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.'
    return ''
  })()

  const passwordError = (() => {
    if (!touched.password) return ''
    if (!password) return 'Password is required.'
    const ok = Object.values(checks).every(Boolean)
    if (!ok) return 'Password does not meet the policy requirements.'
    return ''
  })()

  const confirmError = (() => {
    if (!touched.confirm) return ''
    if (!confirmPassword) return 'Please confirm your password.'
    if (confirmPassword !== password) return 'Passwords do not match.'
    return ''
  })()

  const canSubmit =
    email.trim() &&
    emailRegex.test(email.trim()) &&
    password &&
    Object.values(checks).every(Boolean) &&
    confirmPassword &&
    confirmPassword === password

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitError('')

    // Force errors to show if user clicks submit too early
    setTouched({ email: true, password: true, confirm: true })
    if (!canSubmit) return

    // ✅ For now: mock success (backend integration later)
    login({ email: email.trim(), role: 'student' })
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 420, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 12 }}>Register</h1>

      {submitError ? (
        <div style={{ border: '1px solid #f5c2c7', padding: 10, borderRadius: 8, marginBottom: 12 }}>
          {submitError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="you@example.com"
            autoComplete="email"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {emailError ? <small style={{ color: '#b00020' }}>{emailError}</small> : null}
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            type="password"
            autoComplete="new-password"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <PasswordStrength password={password} />
          <div style={{ display: 'grid', gap: 4 }}>
            <small>{checks.length ? '✅' : '❌'} 8+ characters</small>
            <small>{checks.upper ? '✅' : '❌'} Uppercase letter</small>
            <small>{checks.lower ? '✅' : '❌'} Lowercase letter</small>
            <small>{checks.number ? '✅' : '❌'} Number</small>
            <small>{checks.symbol ? '✅' : '❌'} Symbol</small>
          </div>
          {passwordError ? <small style={{ color: '#b00020' }}>{passwordError}</small> : null}
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Confirm Password</span>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            type="password"
            autoComplete="new-password"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {confirmError ? <small style={{ color: '#b00020' }}>{confirmError}</small> : null}
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            padding: 10,
            borderRadius: 8,
            border: '1px solid #ddd',
            background: canSubmit ? '#fff' : '#f5f5f5',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          Create account
        </button>

        <small>
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </form>
    </div>
  )
}

export default RegisterPage