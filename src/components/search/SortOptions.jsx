import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'relevant', label: 'Most Relevant' },
]

/**
 * SortOptions – sort select for search results.
 *
 * Props:
 *   sort      – current sort value
 *   onChange  – (value) => void
 *   total     – optional result count to display
 */
function SortOptions({ sort, onChange, total }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {total !== undefined && (
        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
          {total} result{total !== 1 ? 's' : ''}
        </Typography>
      )}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sort}
          onChange={(e) => onChange(e.target.value)}
          label="Sort by"
        >
          {SORT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default SortOptions
