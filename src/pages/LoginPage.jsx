import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // ✅ demo role selection
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = (() => {
    if (!touched.email) return ''
    if (!email.trim()) return 'Email is required.'
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email.'
    return ''
  })()

  const passwordError = (() => {
    if (!touched.password) return ''
    if (!password) return 'Password is required.'
    return ''
  })()

  const canSubmit = email.trim() && emailRegex.test(email.trim()) && password

  const onSubmit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!canSubmit) return

    // ✅ For now: simulate login + role (backend later)
    login({ email: email.trim().toLowerCase(), role })

    navigate('/')
  }

  return (
    <div style={{ maxWidth: 420, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 12 }}>Login</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            autoComplete="email"
            placeholder="you@example.com"
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
            autoComplete="current-password"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          {passwordError ? <small style={{ color: '#b00020' }}>{passwordError}</small> : null}
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Login as (demo)</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <small style={{ color: '#666' }}>
            Demo only. In real life the backend decides roles.
          </small>
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
          Login
        </button>

        <small>
          Don’t have an account? <Link to="/register">Register</Link>
        </small>
      </form>
    </div>
  )
}

export default LoginPage