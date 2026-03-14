import { useState } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
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
import { useAuth } from '../context/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const from = (location.state as { from?: string })?.from ?? '/'

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

  const canSubmit = email.trim() && emailRegex.test(email.trim()) && password && !submitting

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setTouched({ email: true, password: true })
    if (!canSubmit) return

    setSubmitting(true)
    try {
      await login({ email: email.trim().toLowerCase(), password })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Invalid email or password.'
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Login
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate>
          <Stack spacing={2.5}>
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

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              error={!!passwordError}
              helperText={passwordError || ' '}
              autoComplete="current-password"
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
              {submitting ? 'Logging in…' : 'Login'}
            </Button>

            <Typography variant="body2" textAlign="center">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover">
                Register
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage
