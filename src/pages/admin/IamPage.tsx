import { useState } from 'react'
import {
  Alert,
  Box,
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
  TextField,
  Typography,
} from '@mui/material'
import { useAdminUsers, useUpdateUserRole } from '../../hooks/useAdmin'

const roleColor: Record<string, 'primary' | 'secondary' | 'error'> = {
  student: 'primary',
  staff: 'secondary',
  admin: 'error',
}

function IamPage() {
  const { data: users, isLoading, error } = useAdminUsers()
  const updateRole = useUpdateUserRole()
  const [search, setSearch] = useState('')

  const filtered = (users ?? []).filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Admin — User &amp; Role Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        View all registered users and manage their roles.
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <Typography variant="body2" color="text.secondary">
          {filtered.length} user(s)
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load users.
        </Alert>
      )}

      {!isLoading && !error && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Change Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      color={roleColor[u.role] ?? 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.is_active ? 'Active' : 'Disabled'}
                      size="small"
                      color={u.is_active ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {u.date_joined
                      ? new Date(u.date_joined).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 110 }}>
                      <Select
                        value={u.role}
                        onChange={(e) =>
                          updateRole.mutate({ id: u.id, role: e.target.value })
                        }
                      >
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No users found.
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

export default IamPage
