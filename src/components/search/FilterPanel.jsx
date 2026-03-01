import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'

import { CATEGORIES, LOCATIONS } from '../items/ItemPostForm'

/**
 * FilterPanel – advanced filter drawer/panel.
 *
 * Props:
 *   open       – boolean, whether panel is visible
 *   filters    – { type, categories, locationId, dateFrom, dateTo }
 *   onChange   – (updatedFilters) => void
 */
function FilterPanel({ open, filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  const toggleCategory = (catId) => {
    const current = filters.categories || []
    const next = current.includes(catId)
      ? current.filter((c) => c !== catId)
      : [...current, catId]
    update('categories', next)
  }

  const activeCampuses = [...new Set(LOCATIONS.map((l) => l.campus_name))]

  return (
    <Collapse in={open}>
      <Box
        sx={{
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          p: 3,
          mt: 1,
        }}
      >
        <Grid container spacing={3} alignItems="flex-start">
          {/* Item Type */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormLabel sx={{ fontWeight: 600, fontSize: 14, display: 'block', mb: 1 }}>
              Item Type
            </FormLabel>
            <ToggleButtonGroup
              value={filters.type || 'all'}
              exclusive
              onChange={(_, val) => val && update('type', val)}
              size="small"
              fullWidth
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="lost">Lost</ToggleButton>
              <ToggleButton value="found">Found</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* Date Range */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormLabel sx={{ fontWeight: 600, fontSize: 14, display: 'block', mb: 1 }}>
              Date Range
            </FormLabel>
            <Stack spacing={1.5}>
              <TextField
                label="From"
                type="date"
                size="small"
                value={filters.dateFrom || ''}
                onChange={(e) => update('dateFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="To"
                type="date"
                size="small"
                value={filters.dateTo || ''}
                onChange={(e) => update('dateTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          </Grid>

          {/* Campus + Location */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Campus</InputLabel>
                <Select
                  value={filters.campus || ''}
                  onChange={(e) => update('campus', e.target.value)}
                  label="Campus"
                >
                  <MenuItem value="">All Campuses</MenuItem>
                  {activeCampuses.map((campus) => (
                    <MenuItem key={campus} value={campus}>
                      {campus}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={filters.locationId || ''}
                  onChange={(e) => update('locationId', e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {LOCATIONS.filter(
                    (l) => !filters.campus || l.campus_name === filters.campus
                  ).map((l) => (
                    <MenuItem key={l.id} value={l.id}>
                      {l.building} — {l.room_area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* Categories Multi-select */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormLabel sx={{ fontWeight: 600, fontSize: 14, display: 'block', mb: 0.5 }}>
              Categories
            </FormLabel>
            <FormGroup row sx={{ gap: 0 }}>
              {CATEGORIES.map((cat) => (
                <FormControlLabel
                  key={cat.id}
                  label={<Typography variant="body2">{cat.name}</Typography>}
                  control={
                    <Checkbox
                      size="small"
                      checked={(filters.categories || []).includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                    />
                  }
                  sx={{ width: '100%', mr: 0, my: -0.3 }}
                />
              ))}
            </FormGroup>
          </Grid>
        </Grid>

        {/* Active filter chips */}
        <ActiveFilterChips filters={filters} onChange={onChange} />
      </Box>
    </Collapse>
  )
}

function ActiveFilterChips({ filters, onChange }) {
  const chips = []

  if (filters.type && filters.type !== 'all') {
    chips.push({
      label: filters.type === 'lost' ? 'Lost items' : 'Found items',
      clear: () => onChange({ ...filters, type: 'all' }),
    })
  }
  if (filters.campus) {
    chips.push({ label: filters.campus, clear: () => onChange({ ...filters, campus: '' }) })
  }
  if (filters.locationId) {
    const loc = LOCATIONS.find((l) => l.id === filters.locationId)
    if (loc) {
      chips.push({
        label: `${loc.building} — ${loc.room_area}`,
        clear: () => onChange({ ...filters, locationId: '' }),
      })
    }
  }
  if (filters.dateFrom) {
    chips.push({
      label: `From ${filters.dateFrom}`,
      clear: () => onChange({ ...filters, dateFrom: '' }),
    })
  }
  if (filters.dateTo) {
    chips.push({
      label: `To ${filters.dateTo}`,
      clear: () => onChange({ ...filters, dateTo: '' }),
    })
  }
  ;(filters.categories || []).forEach((catId) => {
    const cat = CATEGORIES.find((c) => c.id === catId)
    if (cat) {
      chips.push({
        label: cat.name,
        clear: () =>
          onChange({
            ...filters,
            categories: filters.categories.filter((c) => c !== catId),
          }),
      })
    }
  })

  if (!chips.length) return null

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
      <Stack direction="row" flexWrap="wrap" gap={0.8} alignItems="center">
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
          Active filters:
        </Typography>
        {chips.map((chip, i) => (
          <Chip
            key={i}
            label={chip.label}
            size="small"
            onDelete={chip.clear}
            color="primary"
            variant="outlined"
          />
        ))}
        <Chip
          label="Clear all"
          size="small"
          onClick={() =>
            onChange({ type: 'all', categories: [], campus: '', locationId: '', dateFrom: '', dateTo: '' })
          }
          variant="outlined"
          color="default"
        />
      </Stack>
    </Box>
  )
}

export default FilterPanel
