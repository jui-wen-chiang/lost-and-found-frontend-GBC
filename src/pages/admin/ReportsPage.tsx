import { useState, useMemo } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { useUnclaimedItems } from '../../hooks/useReports'
import { useCategories } from '../../hooks/useCategories'
import { useLocations } from '../../hooks/useLocations'

// ─── Row type for display ─────────────────────────────────────────────────────

interface DisplayRow {
  id: number
  title: string
  category: string
  location: string
  campus: string
  dateFound: string
  status: string
  daysOverdue: number
}

// ─── CSV export helper ────────────────────────────────────────────────────────

function exportToCSV(items: DisplayRow[]) {
  const headers = ['ID', 'Title', 'Category', 'Location', 'Campus', 'Date Found', 'Days Overdue', 'Status']
  const rows = items.map((item) => [
    item.id,
    `"${item.title}"`,
    item.category,
    `"${item.location}"`,
    item.campus,
    item.dateFound,
    item.daysOverdue,
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
  const { data: report, isLoading, error } = useUnclaimedItems()
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()

  const [category, setCategory] = useState('All')
  const [campus, setCampus] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories])
  const locMap = useMemo(() => Object.fromEntries(locations.map((l) => [l.id, { name: l.name, campus: l.campus ?? '' }])), [locations])

  const rows: DisplayRow[] = useMemo(
    () =>
      (report?.items ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        category: catMap[item.category] ?? 'Unknown',
        location: locMap[item.location]?.name ?? 'Unknown',
        campus: locMap[item.location]?.campus ?? '',
        dateFound: item.found_at ?? item.created_at.slice(0, 10),
        status: item.status,
        daysOverdue: item.days_overdue,
      })),
    [report, catMap, locMap],
  )

  const categoryOptions = useMemo(() => ['All', ...new Set(rows.map((r) => r.category))], [rows])
  const campusOptions = useMemo(() => ['All', ...new Set(rows.map((r) => r.campus).filter(Boolean))], [rows])

  const filtered = useMemo(() => {
    return rows.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (campus !== 'All' && item.campus !== campus) return false
      if (dateFrom && item.dateFound < dateFrom) return false
      if (dateTo && item.dateFound > dateTo) return false
      return true
    })
  }, [rows, category, campus, dateFrom, dateTo])

  const hasActiveFilters = category !== 'All' || campus !== 'All' || !!dateFrom || !!dateTo

  function clearFilters() {
    setCategory('All')
    setCampus('All')
    setDateFrom('')
    setDateTo('')
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load unclaimed items report.</Alert>
      </Container>
    )
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
              {categoryOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Campus</InputLabel>
            <Select value={campus} onChange={(e) => setCampus(e.target.value)} label="Campus">
              {campusOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
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
                <TableCell sx={{ fontWeight: 700 }}>Days Overdue</TableCell>
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
                    <TableCell>{item.dateFound}</TableCell>
                    <TableCell>{item.daysOverdue}</TableCell>
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
                Showing {filtered.length} of {report?.count ?? 0} unclaimed items
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  )
}

export default ReportsPage
