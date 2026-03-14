import { useState, ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Photo } from 'src/types/item'
import { apiItemToItem } from 'src/types/item'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import QRCodeDisplay from 'src/components/QRCodeDisplay'
import ItemStatusTimeline from 'src/components/items/ItemStatusTimeline'
import { isExpired, daysOld } from 'src/utils/itemUtils'
import { useItem } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { useLocations } from '../hooks/useLocations'
import { getErrorMessage, isAuthError } from '../utils/errorMessages'

import WarningAmberIcon from '@mui/icons-material/WarningAmber'

const TYPE_COLOR: Record<string, 'error' | 'success'> = { lost: 'error', found: 'success' }
const STATUS_COLOR: Record<string, 'warning' | 'success' | 'default' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  resolved: 'default',
  expired: 'error',
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending Review',
  approved: 'Active',
  resolved: 'Resolved',
  expired: 'Expired',
}

// ─── Image Gallery (OLX/Avito style) ──────────────────────────────────────────

function ImageGallery({ photos }: { photos: Photo[] }) {
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

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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
  const numId = Number(id)

  const { data: apiItem, isLoading, error } = useItem(numId)
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !apiItem) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Item not found
        </Typography>
        {error && (
          <Alert severity={isAuthError(error) ? 'info' : 'error'} sx={{ mb: 2, mx: 'auto', maxWidth: 400 }}
            action={isAuthError(error) ? <Button color="inherit" size="small" href="/login">Sign In</Button> : undefined}
          >
            {getErrorMessage(error)}
          </Alert>
        )}
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Browse
        </Button>
      </Container>
    )
  }

  const item = apiItemToItem(apiItem, categories, locations)

  const expired = isExpired(item)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      {/* ── Full-width gallery ── */}
      <ImageGallery photos={item.photos ?? []} />

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

          {/* Expired banner */}
          {expired && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'error.50',
                border: '1px solid',
                borderColor: 'error.light',
                borderRadius: 2,
                px: 2,
                py: 1,
                mb: 1,
              }}
            >
              <WarningAmberIcon color="error" fontSize="small" />
              <Typography variant="body2" color="error.dark" fontWeight={500}>
                This item has been unclaimed for {daysOld(item.date_lost_found)} days and is now
                expired. It may no longer be available for pickup.
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
            {item.description || 'No description provided.'}
          </Typography>

          {/* Status Timeline — FR: Item Status Timeline */}
          <ItemStatusTimeline status={item.status} expired={expired} />
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

          {/* QR Code — FR-10 */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <QRCodeDisplay
              value={`${window.location.origin}/items/${item.id}`}
              label={`Item #${item.id}`}
              size={150}
            />
          </Box>

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
