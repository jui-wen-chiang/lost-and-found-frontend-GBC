import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CategoryIcon from '@mui/icons-material/Category'
import PersonIcon from '@mui/icons-material/Person'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'

// ─── Mock data – replace with API fetch by id ─────────────────────────────────
const MOCK_ITEMS = [
  {
    id: 1,
    type: 'lost',
    title: 'Blue Backpack',
    category: 'Bags',
    description:
      'Navy blue Jansport backpack with a red keychain. Last seen near the library around 3 PM. Contains a laptop, notebooks, and a water bottle. The laptop has a Mario sticker on the lid.',
    location: 'St. James — Building A, Library',
    campus: 'St. James',
    date_lost_found: '2026-02-10',
    status: 'approved',
    posted_by: 'student@georgebrown.ca',
    photos: [],
  },
  {
    id: 2,
    type: 'found',
    title: 'AirPods Case',
    category: 'Electronics',
    description:
      'White AirPods Pro case found on a bench outside the main entrance. No AirPods inside the case. Has a small scratch on the lid.',
    location: 'Casa Loma — Building A, Lobby',
    campus: 'Casa Loma',
    date_lost_found: '2026-02-14',
    status: 'approved',
    posted_by: 'finder@georgebrown.ca',
    photos: [],
  },
  {
    id: 3,
    type: 'lost',
    title: 'Student ID Card',
    category: 'Books & Documents',
    description: 'GBC student ID card. Name: Alex Johnson. Student number visible on the front.',
    location: 'Casa Loma — Building B, Cafeteria',
    campus: 'Casa Loma',
    date_lost_found: '2026-02-15',
    status: 'approved',
    posted_by: 'alex.johnson@georgebrown.ca',
    photos: [],
  },
  {
    id: 4,
    type: 'found',
    title: 'Black Umbrella',
    category: 'Other',
    description: 'Compact black umbrella left in Room 204. Auto-open style with a wrist strap.',
    location: 'Waterfront — Building A, Main Hall',
    campus: 'Waterfront',
    date_lost_found: '2026-02-18',
    status: 'approved',
    posted_by: 'staff@georgebrown.ca',
    photos: [],
  },
  {
    id: 5,
    type: 'lost',
    title: 'Silver MacBook Charger',
    category: 'Electronics',
    description:
      '65W USB-C MacBook charger with a GBC sticker on the power brick. USB-C cable included.',
    location: 'St. James — Building B, Gym',
    campus: 'St. James',
    date_lost_found: '2026-02-20',
    status: 'pending',
    posted_by: 'mac.user@georgebrown.ca',
    photos: [],
  },
  {
    id: 6,
    type: 'found',
    title: 'Pair of Keys',
    category: 'Keys',
    description:
      'Found a set of keys with a Superman keychain near the main entrance. Includes 3 keys and a bus pass.',
    location: 'Casa Loma — Building A, Lobby',
    campus: 'Casa Loma',
    date_lost_found: '2026-02-22',
    status: 'approved',
    posted_by: 'finder2@georgebrown.ca',
    photos: [],
  },
]

const TYPE_COLOR = { lost: 'error', found: 'success' }
const STATUS_COLOR = { pending: 'warning', approved: 'success', resolved: 'default' }
const STATUS_LABEL = { pending: 'Pending Review', approved: 'Active', resolved: 'Resolved' }

// ─── Image Gallery (OLX/Avito style) ──────────────────────────────────────────

function ImageGallery({ photos }) {
  const [index, setIndex] = useState(0)

  if (!photos?.length) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 280,
          bgcolor: 'grey.100',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <ImageNotSupportedIcon sx={{ fontSize: 56, color: 'grey.300' }} />
        <Typography variant="body2" color="text.disabled">
          No photos available
        </Typography>
      </Box>
    )
  }

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setIndex((i) => (i + 1) % photos.length)

  return (
    <Box>
      {/* Main image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          maxHeight: 520,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'grey.900',
        }}
      >
        <Box
          component="img"
          src={photos[index].url}
          alt={`photo-${index}`}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {photos.length > 1 && (
          <>
            <IconButton
              onClick={prev}
              size="small"
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.45)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={next}
              size="small"
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.45)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 14,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontSize: 12,
                px: 1.2,
                py: 0.4,
                borderRadius: 1,
              }}
            >
              {index + 1} / {photos.length}
            </Box>
          </>
        )}
      </Box>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', pb: 0.5 }}>
          {photos.map((photo, i) => (
            <Box
              key={photo.id || i}
              onClick={() => setIndex(i)}
              component="img"
              src={photo.url}
              alt={`thumb-${i}`}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1.5,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: i === index ? 'primary.main' : 'grey.300',
                opacity: i === index ? 1 : 0.65,
                flexShrink: 0,
                transition: 'all 0.15s',
                '&:hover': { opacity: 1 },
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}

// ─── Detail row helper ─────────────────────────────────────────────────────────

function DetailRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: 'text.disabled', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.disabled" display="block">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const item = MOCK_ITEMS.find((i) => String(i.id) === String(id))

  if (!item) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Item not found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Browse
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      {/* ── Full-width gallery ── */}
      <ImageGallery photos={item.photos} />

      {/* ── Content: title+description left, details+CTA right ── */}
      <Grid container spacing={4} sx={{ mt: 1 }}>
        {/* Left column – title & description */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack direction="row" spacing={1} mb={1.5}>
            <Chip
              label={item.type?.toUpperCase()}
              color={TYPE_COLOR[item.type] || 'default'}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={STATUS_LABEL[item.status] || item.status}
              color={STATUS_COLOR[item.status] || 'default'}
              variant="outlined"
            />
          </Stack>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            {item.title}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
            {item.description || 'No description provided.'}
          </Typography>
        </Grid>

        {/* Right column – details card + CTA */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 2, p: 2.5, bgcolor: 'grey.50' }}
          >
            <Stack spacing={2}>
              <DetailRow
                icon={<CategoryIcon fontSize="small" />}
                label="Category"
                value={item.category}
              />
              <DetailRow
                icon={<LocationOnIcon fontSize="small" />}
                label="Location"
                value={item.location}
              />
              <DetailRow
                icon={<CalendarTodayIcon fontSize="small" />}
                label={item.type === 'lost' ? 'Date Lost' : 'Date Found'}
                value={item.date_lost_found}
              />
              {item.posted_by && (
                <DetailRow
                  icon={<PersonIcon fontSize="small" />}
                  label="Posted by"
                  value={item.posted_by}
                />
              )}
            </Stack>
          </Paper>

          {/* CTA */}
          <Box sx={{ mt: 2 }}>
            {item.type === 'found' && item.status === 'approved' && (
              <Button variant="contained" color="success" fullWidth size="large">
                This is mine — Claim Item
              </Button>
            )}
            {item.type === 'lost' && item.status === 'approved' && (
              <Button variant="contained" color="primary" fullWidth size="large">
                I Found This — Contact Owner
              </Button>
            )}
            {item.status === 'pending' && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                This post is awaiting review.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ItemDetailPage
