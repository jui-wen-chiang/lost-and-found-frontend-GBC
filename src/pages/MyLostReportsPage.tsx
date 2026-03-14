import { useMemo } from 'react'
import { apiItemToItem } from 'src/types/item'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { useLocations } from '../hooks/useLocations'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, isAuthError } from '../utils/errorMessages'
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

const statusColorMap: Record<string, 'info' | 'warning' | 'success'> = {
  pending: 'warning',
  approved: 'success',
  claimed: 'success',
  completed: 'success',
}

export default function MyLostReportsPage() {
  const { user } = useAuth()
  const { data: apiItems, isLoading, error } = useItems({ item_type: 'lost' })
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()

  const items = useMemo(
    () =>
      (apiItems ?? [])
        .filter((ai) => ai.owner === user?.id)
        .map((ai) => apiItemToItem(ai, categories, locations)),
    [apiItems, categories, locations, user?.id],
  )

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Lost Item Reports
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert
          severity={isAuthError(error) ? 'info' : 'error'}
          action={
            isAuthError(error) ? (
              <Button color="inherit" size="small" href="/login">
                Sign In
              </Button>
            ) : undefined
          }
        >
          {getErrorMessage(error, 'Failed to load lost reports.')}
        </Alert>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          You haven't reported any lost items yet.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {items.map((r) => (
            <Paper
              key={r.id}
              sx={{
                p: 2,
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {r.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {r.location}
                </Typography>
              </div>

              <Chip
                label={r.status}
                size="small"
                color={statusColorMap[r.status] ?? 'default'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  )
}