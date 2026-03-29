import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useQuery } from '@tanstack/react-query'
import { fetchAppointments } from '../api/services/appointments'
import type { ApiAppointment, AppointmentStatus } from '../types/api'

const STATUS_COLOR: Record<AppointmentStatus, 'info' | 'success' | 'error'> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'error',
}

function AppointmentsPage() {
  const navigate = useNavigate()
  const { data: appointments, isLoading, error } = useQuery<ApiAppointment[]>({
    queryKey: ['appointments', 'mine'],
    queryFn: fetchAppointments,
  })

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">My Appointments</Typography>
        <Button variant="contained" onClick={() => navigate('/claims')}>
          Schedule from My Claims
        </Button>
      </Box>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load appointments.</Alert>}

      {!isLoading && !error && (appointments ?? []).length === 0 && (
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <CalendarMonthIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No appointments yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Once your claim is approved, you can schedule a pickup appointment from the My Claims page.
          </Typography>
          <Stack direction="row" spacing={1.5} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/claims')}>
              View My Claims
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Browse Items
            </Button>
          </Stack>
        </Paper>
      )}

      {!isLoading && (appointments ?? []).length > 0 && (
        <Stack spacing={1.5}>
          {(appointments ?? []).map((apt) => (
            <Paper key={apt.id} sx={{ p: 2, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Appointment #{apt.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Claim #{apt.claim} &bull; {new Date(apt.scheduled_at).toLocaleString()}
                  </Typography>
                </Box>
                <Chip
                  label={apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  color={STATUS_COLOR[apt.status] ?? 'default'}
                  size="small"
                />
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  )
}

export default AppointmentsPage
