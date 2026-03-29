import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  useAdminAppointments,
  useAppointmentReminders,
  useUpdateAppointmentStatus,
} from '../../hooks/useAdminAppointments'
import type { AppointmentStatus } from '../../types/api'

const STATUS_COLOR: Record<AppointmentStatus, 'info' | 'success' | 'error'> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'error',
}

function AdminAppointmentsPage() {
  const { data: appointments, isLoading, error } = useAdminAppointments()
  const { data: reminders } = useAppointmentReminders()
  const updateStatus = useUpdateAppointmentStatus()

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin — Appointments
      </Typography>

      {/* Reminders banner */}
      {reminders && reminders.reminders.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {reminders.reminders.length} upcoming appointment{reminders.reminders.length > 1 ? 's' : ''} need attention.
        </Alert>
      )}

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load appointments.</Alert>}

      {!isLoading && !error && (appointments ?? []).length === 0 && (
        <Alert severity="info">No appointments found.</Alert>
      )}

      {!isLoading && (appointments ?? []).length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Claim</TableCell>
                <TableCell>Scheduled At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(appointments ?? []).map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>{apt.id}</TableCell>
                  <TableCell>{apt.claim}</TableCell>
                  <TableCell>{new Date(apt.scheduled_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={apt.status}
                      color={STATUS_COLOR[apt.status] ?? 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {apt.status === 'scheduled' && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              updateStatus.mutate({ id: apt.id, status: 'completed' })
                            }
                          >
                            Complete
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              updateStatus.mutate({ id: apt.id, status: 'cancelled' })
                            }
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {apt.status !== 'scheduled' && (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default AdminAppointmentsPage
