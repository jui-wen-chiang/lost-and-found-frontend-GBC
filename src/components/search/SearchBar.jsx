import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'

/**
 * SearchBar – text search with advanced filter toggle.
 *
 * Props:
 *   query          – string
 *   onQueryChange  – (value) => void
 *   filtersOpen    – boolean
 *   onToggleFilters – () => void
 *   activeFilterCount – number of active filters (for badge)
 */
function SearchBar({ query, onQueryChange, filtersOpen, onToggleFilters, activeFilterCount = 0 }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        placeholder="Search lost or found items…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: query ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onQueryChange('')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root': { borderRadius: 2 },
        }}
      />
      <Badge badgeContent={activeFilterCount} color="primary">
        <Button
          variant={filtersOpen ? 'contained' : 'outlined'}
          startIcon={<TuneIcon />}
          onClick={onToggleFilters}
          sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
        >
          Filters
        </Button>
      </Badge>
    </Box>
  )
}

export default SearchBar
