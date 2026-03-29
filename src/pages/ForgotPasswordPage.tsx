import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
import { requestPasswordResetApi } from '../api/services/auth'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const emailError = (() => {
    if (!touched) return ''
    if (!email.trim()) return 'Email is required.'
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email.'
    return ''
  })()

  const canSubmit = email.trim() && emailRegex.test(email.trim()) && !submitting

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    setSubmitError('')
    if (!canSubmit) return

    setSubmitting(true)
    try {
      await requestPasswordResetApi({ email: email.trim().toLowerCase() })
      setSuccess(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your email and we'll send you a link to reset your password.
        </Typography>

        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            If an account with that email exists, a reset link has been sent. Check your inbox.
          </Alert>
        ) : (
          <>
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
                  onBlur={() => setTouched(true)}
                  error={!!emailError}
                  helperText={emailError || ' '}
                  autoComplete="email"
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
                  {submitting ? 'Sending…' : 'Send Reset Link'}
                </Button>
              </Stack>
            </Box>
          </>
        )}

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login" underline="hover">
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  )
}
