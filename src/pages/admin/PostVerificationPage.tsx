import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useVerifiedItems } from '../../hooks/useAdmin'
import { useCategories } from '../../hooks/useCategories'
import { useLocations } from '../../hooks/useLocations'
import type { ItemStatus } from '../../types/api'

const statusColor: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  approved: 'success',
  claimed: 'info',
  completed: 'warning',
  rejected: 'default',
}

const typeColor: Record<string, 'error' | 'success'> = {
  lost: 'error',
  found: 'success',
}

function PostVerificationPage() {
  const navigate = useNavigate()
  const { data: items, isLoading, error } = useVerifiedItems()
  const { data: categories } = useCategories()
  const { data: locations } = useLocations()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const catMap = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]))
  const locMap = Object.fromEntries((locations ?? []).map((l) => [l.id, l.name]))

  const filtered = (items ?? []).filter(
    (i) => statusFilter === 'all' || i.status === statusFilter
  )

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Admin — Post Verification
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Track the lifecycle of all reviewed posts — from approval through claim to completion.
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="claimed">Claimed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {filtered.length} post(s)
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load posts.
        </Alert>
      )}

      {!isLoading && !error && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Updated</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.item_type.toUpperCase()}
                      size="small"
                      color={typeColor[item.item_type] ?? 'default'}
                    />
                  </TableCell>
                  <TableCell>{catMap[item.category] ?? item.category}</TableCell>
                  <TableCell>{locMap[item.location] ?? item.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      size="small"
                      color={statusColor[item.status] ?? 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(item.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/items/${item.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No posts match the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default PostVerificationPage
