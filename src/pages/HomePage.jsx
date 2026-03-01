import { useMemo, useState } from 'react'
import { Box, Container, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'

import SearchBar from '../components/search/SearchBar'
import FilterPanel from '../components/search/FilterPanel'
import SortOptions from '../components/search/SortOptions'
import ItemCard from '../components/items/ItemCard'
import ItemList from '../components/items/ItemList'

// ─── Mock data (replace with API call) ───────────────────────────────────────
const MOCK_ITEMS = [
  {
    id: 1,
    type: 'lost',
    title: 'Blue Backpack',
    category_id: 6,
    category: 'Bags',
    description: 'Navy blue Jansport backpack with a red keychain. Last seen near the library.',
    location_id: 3,
    location: 'St. James — Building A, Library',
    campus: 'St. James',
    date_lost_found: '2026-02-10',
    status: 'approved',
    photos: [],
  },
  {
    id: 2,
    type: 'found',
    title: 'AirPods Case',
    category_id: 1,
    category: 'Electronics',
    description: 'White AirPods Pro case found on a bench, no AirPods inside.',
    location_id: 1,
    location: 'Casa Loma — Building A, Lobby',
    campus: 'Casa Loma',
    date_lost_found: '2026-02-14',
    status: 'approved',
    photos: [],
  },
  {
    id: 3,
    type: 'lost',
    title: 'Student ID Card',
    category_id: 4,
    category: 'Books & Documents',
    description: 'GBC student ID card. Name: Alex Johnson.',
    location_id: 2,
    location: 'Casa Loma — Building B, Cafeteria',
    campus: 'Casa Loma',
    date_lost_found: '2026-02-15',
    status: 'approved',
    photos: [],
  },
  {
    id: 4,
    type: 'found',
    title: 'Black Umbrella',
    category_id: 7,
    category: 'Other',
    description: 'Compact black umbrella left in Room 204.',
    location_id: 5,
    location: 'Waterfront — Building A, Main Hall',
    campus: 'Waterfront',
    date_lost_found: '2026-02-18',
    status: 'approved',
    photos: [],
  },
  {
    id: 5,
    type: 'lost',
    title: 'Silver MacBook Charger',
    category_id: 1,
    category: 'Electronics',
    description: '65W USB-C MacBook charger with GBC sticker on the brick.',
    location_id: 4,
    location: 'St. James — Building B, Gym',
    campus: 'St. James',
    date_lost_found: '2026-02-20',
    status: 'pending',
    photos: [],
  },
  {
    id: 6,
    type: 'found',
    title: 'Pair of Keys',
    category_id: 5,
    category: 'Keys',
    description: 'Found a set of keys with a Superman keychain near the entrance.',
    location_id: 1,
    location: 'Casa Loma — Building A, Lobby',
    campus: 'Casa Loma',
    date_lost_found: '2026-02-22',
    status: 'approved',
    photos: [],
  },
]

const EMPTY_FILTERS = {
  type: 'all',
  categories: [],
  campus: '',
  locationId: '',
  dateFrom: '',
  dateTo: '',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countActiveFilters(filters) {
  let n = 0
  if (filters.type && filters.type !== 'all') n++
  if (filters.campus) n++
  if (filters.locationId) n++
  if (filters.dateFrom) n++
  if (filters.dateTo) n++
  n += (filters.categories || []).length
  return n
}

function applyFiltersAndSort(items, query, filters, sort) {
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
    result = result.filter((item) => filters.categories.includes(item.category_id))
  }

  // Sort
  if (sort === 'latest') {
    result.sort((a, b) => b.date_lost_found.localeCompare(a.date_lost_found))
  } else if (sort === 'oldest') {
    result.sort((a, b) => a.date_lost_found.localeCompare(b.date_lost_found))
  } else if (sort === 'relevant' && query.trim()) {
    // Simple relevance: title match ranks higher
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

  const results = useMemo(
    () => applyFiltersAndSort(MOCK_ITEMS, query, filters, sort),
    [query, filters, sort]
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

      {/* Results */}
      {results.length === 0 ? (
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
            <Grid item xs={12} sm={6} md={4} key={item.id}>
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
