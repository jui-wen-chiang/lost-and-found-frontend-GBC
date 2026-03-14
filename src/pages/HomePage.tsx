import { useMemo, useState } from 'react'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'

import SearchBar from '../components/search/SearchBar'
import FilterPanel from '../components/search/FilterPanel'
import SortOptions from '../components/search/SortOptions'
import ItemCard from '../components/items/ItemCard'
import ItemList from '../components/items/ItemList'
import { Item, Filters, apiItemToItem } from 'src/types/item'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { useLocations } from '../hooks/useLocations'
import { getErrorMessage, isAuthError } from '../utils/errorMessages'

const EMPTY_FILTERS: Filters = {
  type: 'all',
  categories: [],
  campus: '',
  locationId: '',
  dateFrom: '',
  dateTo: '',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countActiveFilters(filters: Filters): number {
  let n = 0
  if (filters.type && filters.type !== 'all') n++
  if (filters.campus) n++
  if (filters.locationId) n++
  if (filters.dateFrom) n++
  if (filters.dateTo) n++
  n += (filters.categories || []).length
  return n
}

function applyFiltersAndSort(items: Item[], query: string, filters: Filters, sort: string): Item[] {
  let result = [...items]

  // Text search
  if (query.trim()) {
    const q = query.toLowerCase()
    result = result.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
    )
  }

  // Type filter
  if (filters.type && filters.type !== 'all') {
    result = result.filter((item) => item.type === filters.type)
  }

  // Campus filter
  if (filters.campus) {
    result = result.filter((item) => item.campus === filters.campus)
  }

  // Location filter
  if (filters.locationId) {
    result = result.filter((item) => item.location_id === filters.locationId)
  }

  // Date range
  if (filters.dateFrom) {
    result = result.filter((item) => item.date_lost_found >= filters.dateFrom)
  }
  if (filters.dateTo) {
    result = result.filter((item) => item.date_lost_found <= filters.dateTo)
  }

  // Category multi-select
  if (filters.categories?.length) {
    result = result.filter((item) => filters.categories.includes(item.category_id as number))
  }

  // Sort
  if (sort === 'latest') {
    result.sort((a, b) => b.date_lost_found.localeCompare(a.date_lost_found))
  } else if (sort === 'oldest') {
    result.sort((a, b) => a.date_lost_found.localeCompare(b.date_lost_found))
  } else if (sort === 'relevant' && query.trim()) {
    const q = query.toLowerCase()
    result.sort((a, b) => {
      const aTitle = a.title?.toLowerCase().includes(q) ? 0 : 1
      const bTitle = b.title?.toLowerCase().includes(q) ? 0 : 1
      return aTitle - bTitle
    })
  }

  return result
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function HomePage() {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sort, setSort] = useState('latest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const { data: apiItems, isLoading: itemsLoading, error: itemsError } = useItems()
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()

  const items: Item[] = useMemo(
    () => (apiItems ?? []).map((ai) => apiItemToItem(ai, categories, locations)),
    [apiItems, categories, locations]
  )

  const results = useMemo(
    () => applyFiltersAndSort(items, query, filters, sort),
    [items, query, filters, sort]
  )

  const activeFilterCount = countActiveFilters(filters)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Browse Lost & Found Items
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Search for lost items or browse what has been found across GBC campuses.
      </Typography>

      {/* Search bar */}
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        activeFilterCount={activeFilterCount}
      />

      {/* Advanced filter panel */}
      <FilterPanel
        open={filtersOpen}
        filters={filters}
        onChange={setFilters}
      />

      {/* Results toolbar: sort + view toggle */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 1,
        }}
      >
        <SortOptions sort={sort} onChange={setSort} total={results.length} />

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Grid view">
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="List view">
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Loading / Error / Results */}
      {itemsLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : itemsError ? (
        <Alert severity={isAuthError(itemsError) ? 'info' : 'error'} sx={{ mt: 2 }}
          action={isAuthError(itemsError) ? <Button color="inherit" size="small" href="/login">Sign In</Button> : undefined}
        >
          <AlertTitle>{isAuthError(itemsError) ? 'Sign in required' : 'Error'}</AlertTitle>
          {getErrorMessage(itemsError, 'Failed to load items.')}
        </Alert>
      ) : results.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No items match your search.
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Try adjusting your search query or filters.
          </Typography>
        </Box>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {results.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <ItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ItemList items={results} />
      )}
    </Container>
  )
}

export default HomePage
