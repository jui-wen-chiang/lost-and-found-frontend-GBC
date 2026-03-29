import {
  Alert,
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
import { useAdminClaims, useUpdateClaimStatus } from '../../hooks/useClaims'

const STATUS_COLOR: Record<string, 'warning' | 'success' | 'error' | 'info' | 'default'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  completed: 'info',
}

export default function AdminClaimsPage() {
  const { data: claims, isLoading, error } = useAdminClaims()
  const updateStatus = useUpdateClaimStatus()

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin — Claims
      </Typography>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load claims.</Alert>}

      {!isLoading && !error && (claims ?? []).length === 0 && (
        <Alert severity="info">No claim requests found.</Alert>
      )}

      {!isLoading && (claims ?? []).length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Claimant</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(claims ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.item}</TableCell>
                  <TableCell>{c.claimant}</TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.message || '—'}
                  </TableCell>
                  <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={c.status}
                      size="small"
                      color={STATUS_COLOR[c.status] ?? 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    {c.status === 'pending' && (
                      <Stack direction="row" spacing={0.5}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disabled={updateStatus.isPending}
                          onClick={() => updateStatus.mutate({ id: c.id, status: 'approved' })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={updateStatus.isPending}
                          onClick={() => updateStatus.mutate({ id: c.id, status: 'rejected' })}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                    {c.status === 'approved' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: c.id, status: 'completed' })}
                      >
                        Complete
                      </Button>
                    )}
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
