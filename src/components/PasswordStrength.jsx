import { useMemo } from 'react'

function scorePassword(pw) {
  let score = 0
  if (!pw) return 0
  if (pw.length >= 8) score += 1
  if (pw.length >= 12) score += 1
  if (/[A-Z]/.test(pw)) score += 1
  if (/[a-z]/.test(pw)) score += 1
  if (/\d/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return Math.min(score, 5)
}

export default function PasswordStrength({ password }) {
  const score = useMemo(() => scorePassword(password), [password])

  const label = score <= 1 ? 'Weak' : score <= 3 ? 'Medium' : 'Strong'

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ height: 8, borderRadius: 999, background: '#eee', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${(score / 5) * 100}%`,
            background: '#999',
            transition: 'width 120ms ease',
          }}
        />
      </div>
      <small>Password strength: {label}</small>
    </div>
  )
}