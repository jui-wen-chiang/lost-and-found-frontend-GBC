import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Report as ReportIcon,
} from '@mui/icons-material'
import type { Item } from 'src/types/item'

// ─── Mock data (replace with API call when backend is ready) ──────────────────

const MOCK_UNCLAIMED: Item[] = [
  { id: 1, type: 'found', title: 'Black Wallet', category_id: 1, category: 'Accessories', location_id: 1, location: 'Library', campus: 'Waterfront', date_lost_found: '2026-02-01', status: 'unclaimed', posted_by: 'John D.' },
  { id: 2, type: 'found', title: 'Blue Backpack', category_id: 2, category: 'Bags', location_id: 2, location: 'Cafeteria', campus: 'North', date_lost_found: '2026-02-10', status: 'unclaimed', posted_by: 'Sara M.' },
  { id: 3, type: 'found', title: 'Student Card', category_id: 3, category: 'ID / Cards', location_id: 3, location: 'Gym', campus: 'Downtown', date_lost_found: '2026-01-25', status: 'unclaimed', posted_by: 'Alex K.' },
  { id: 4, type: 'found', title: 'Airpods Case', category_id: 1, category: 'Electronics', location_id: 1, location: 'Classroom 201', campus: 'Waterfront', date_lost_found: '2026-01-30', status: 'unclaimed', posted_by: 'Maria L.' },
  { id: 5, type: 'found', title: 'Red Scarf', category_id: 4, category: 'Clothing', location_id: 2, location: 'Hallway B', campus: 'North', date_lost_found: '2026-02-14', status: 'unclaimed', posted_by: 'Tom B.' },
  { id: 6, type: 'found', title: 'House Keys', category_id: 5, category: 'Keys', location_id: 3, location: 'Parking Lot', campus: 'Downtown', date_lost_found: '2026-02-20', status: 'unclaimed', posted_by: 'Nina S.' },
  { id: 7, type: 'found', title: 'Umbrella', category_id: 6, category: 'Other', location_id: 1, location: 'Entrance', campus: 'Waterfront', date_lost_found: '2026-03-01', status: 'unclaimed', posted_by: 'Paul R.' },
  { id: 8, type: 'found', title: 'Glasses', category_id: 1, category: 'Accessories', location_id: 2, location: 'Study Room', campus: 'North', date_lost_found: '2026-03-05', status: 'unclaimed', posted_by: 'Elena V.' },
]

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'ID / Cards', 'Bags', 'Keys', 'Accessories', 'Other']
const CAMPUSES = ['All', 'Waterfront', 'North', 'Downtown']

// ─── CSV export helper ────────────────────────────────────────────────────────

function exportToCSV(items: Item[]) {
  const headers = ['ID', 'Title', 'Category', 'Location', 'Campus', 'Date Found', 'Posted By', 'Status']
  const rows = items.map((item) => [
    item.id,
    `"${item.title}"`,
    item.category,
    `"${item.location}"`,
    item.campus ?? '',
    item.date_lost_found,
    item.posted_by ?? '',
    item.status,
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `unclaimed-items-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ─── Component ────────────────────────────────────────────────────────────────

function ReportsPage() {
  const [category, setCategory] = useState('All')
  const [campus, setCampus] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return MOCK_UNCLAIMED.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (campus !== 'All' && item.campus !== campus) return false
      if (dateFrom && item.date_lost_found < dateFrom) return false
      if (dateTo && item.date_lost_found > dateTo) return false
      return true
    })
  }, [category, campus, dateFrom, dateTo])

  const hasActiveFilters = category !== 'All' || campus !== 'All' || !!dateFrom || !!dateTo

  function clearFilters() {
    setCategory('All')
    setCampus('All')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <ReportIcon color="error" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>Unclaimed Item Report</Typography>
            <Typography variant="body2" color="text.secondary">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''} match current filters
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => exportToCSV(filtered)}
          disabled={filtered.length === 0}
        >
          Export CSV
        </Button>
      </Stack>

      {/* ── Filters ── */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <FilterIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>Filters</Typography>
          {hasActiveFilters && (
            <Chip label="Clear all" size="small" onDelete={clearFilters} onClick={clearFilters} />
          )}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Campus</InputLabel>
            <Select value={campus} onChange={(e) => setCampus(e.target.value)} label="Campus">
              {CAMPUSES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Date from"
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />

          <TextField
            label="Date to"
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />
        </Stack>
      </Paper>

      {/* ── Unclaimed Items Table ── */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Campus</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date Found</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Posted By</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                    No unclaimed items match the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.campus}</TableCell>
                    <TableCell>{item.date_lost_found}</TableCell>
                    <TableCell>{item.posted_by}</TableCell>
                    <TableCell>
                      <Chip label="Unclaimed" size="small" color="warning" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filtered.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1.5, textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Showing {filtered.length} of {MOCK_UNCLAIMED.length} unclaimed items
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  )
}

export default ReportsPage
