import { useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
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
import { confirmPasswordResetApi } from '../api/services/auth'

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState({ password: false, confirm: false })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const passwordError = (() => {
    if (!touched.password) return ''
    if (!password) return 'Password is required.'
    if (password.length < 8) return 'At least 8 characters.'
    return ''
  })()

  const confirmError = (() => {
    if (!touched.confirm) return ''
    if (!confirm) return 'Please confirm your password.'
    if (confirm !== password) return 'Passwords do not match.'
    return ''
  })()

  const canSubmit = password.length >= 8 && confirm === password && !submitting

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ password: true, confirm: true })
    setSubmitError('')
    if (!canSubmit || !token) return

    setSubmitting(true)
    try {
      await confirmPasswordResetApi({
        token,
        new_password: password,
        new_password_confirm: confirm,
      })
      setSuccess(true)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Invalid or expired token. Please request a new reset link.'
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Reset Password
        </Typography>

        {success ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset successfully!
            </Alert>
            <Button component={RouterLink} to="/login" variant="contained" fullWidth>
              Go to Login
            </Button>
          </>
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
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  error={!!passwordError}
                  helperText={passwordError || ' '}
                  autoComplete="new-password"
                  fullWidth
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
                  {submitting ? 'Resetting…' : 'Reset Password'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/forgot-password" underline="hover">
                Request a new link
              </Link>
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  )
}
