import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PasswordStrength from '../components/PasswordStrength'
import { useAuth } from '../context/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getPasswordChecks(password: string) {
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
  const { register } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false, confirm: false })
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const checks = useMemo(() => getPasswordChecks(password), [password])

  const fullNameError = (() => {
    if (!touched.fullName) return ''
    if (!fullName.trim()) return 'Full name is required.'
    return ''
  })()

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
    fullName.trim() &&
    email.trim() &&
    emailRegex.test(email.trim()) &&
    password &&
    Object.values(checks).every(Boolean) &&
    confirmPassword &&
    confirmPassword === password &&
    !submitting

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setTouched({ fullName: true, email: true, password: true, confirm: true })
    if (!canSubmit) return

    setSubmitting(true)
    try {
      await register({
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        role: 'student',
        password,
        password_confirm: confirmPassword,
      })
      navigate('/')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      if (data) {
        const messages = Object.values(data).flat().join(' ')
        setSubmitError(messages || 'Registration failed.')
      } else {
        setSubmitError('Registration failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const passwordChecks: [boolean, string][] = [
    [checks.length, '8+ characters'],
    [checks.upper, 'Uppercase letter'],
    [checks.lower, 'Lowercase letter'],
    [checks.number, 'Number'],
    [checks.symbol, 'Symbol'],
  ]

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Register
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
              error={!!fullNameError}
              helperText={fullNameError || ' '}
              autoComplete="name"
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={!!emailError}
              helperText={emailError || ' '}
              autoComplete="email"
              fullWidth
            />

            <Box>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                error={!!passwordError}
                helperText={passwordError || ' '}
                autoComplete="new-password"
                fullWidth
              />
              <PasswordStrength password={password} />
              <Stack spacing={0.25} sx={{ mt: 1 }}>
                {passwordChecks.map(([ok, label]) => (
                  <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {ok
                      ? <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                      : <CancelIcon color="error" sx={{ fontSize: 16 }} />}
                    <Typography variant="caption" color={ok ? 'success.main' : 'text.secondary'}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              error={!!confirmError}
              helperText={confirmError || ' '}
              autoComplete="new-password"
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!canSubmit}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>

            <Typography variant="body2" textAlign="center">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Login
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default RegisterPage