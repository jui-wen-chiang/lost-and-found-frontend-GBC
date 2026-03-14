import { useMemo } from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'

function scorePassword(pw: string): number {
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

export default function PasswordStrength({ password }: { password: string }) {
  const score = useMemo(() => scorePassword(password), [password])
  const label = score <= 1 ? 'Weak' : score <= 3 ? 'Medium' : 'Strong'
  const color: 'error' | 'warning' | 'success' =
    score <= 1 ? 'error' : score <= 3 ? 'warning' : 'success'

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={(score / 5) * 100}
        color={color}
        sx={{ borderRadius: 999, height: 8 }}
      />
      <Typography variant="caption" color="text.secondary">
        Password strength: {label}
      </Typography>
    </Box>
  )
}