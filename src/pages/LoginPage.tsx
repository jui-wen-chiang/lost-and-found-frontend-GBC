import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!canSubmit) return
    login({ email: email.trim().toLowerCase(), role })
    navigate('/')
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Login
        </Typography>

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

            <FormControl fullWidth>
              <InputLabel>Login as (demo)</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Login as (demo)"
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
              <FormHelperText>Demo only — backend decides roles in production.</FormHelperText>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!canSubmit}
            >
              Login
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
