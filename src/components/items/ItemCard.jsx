import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CategoryIcon from '@mui/icons-material/Category'

const TYPE_COLOR = { lost: 'error', found: 'success' }
const STATUS_COLOR = { pending: 'warning', approved: 'success', resolved: 'default' }

/**
 * ItemCard – grid card for a single lost/found item.
 */
function ItemCard({ item }) {
  const navigate = useNavigate()

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/items/${item.id}`)}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Cover image — aspect-ratio box keeps all cards consistent */}
        <Box sx={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
          {item.photos?.[0] ? (
            <Box
              component="img"
              src={item.photos[0].url}
              alt={item.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CategoryIcon sx={{ fontSize: 48, color: 'grey.300' }} />
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
          {/* Type + status chips */}
          <Stack direction="row" spacing={0.8} mb={1}>
            <Chip
              label={item.type?.toUpperCase()}
              color={TYPE_COLOR[item.type] || 'default'}
              size="small"
              sx={{ fontWeight: 700, fontSize: 11 }}
            />
            {item.status && (
              <Chip
                label={item.status}
                color={STATUS_COLOR[item.status] || 'default'}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11 }}
              />
            )}
          </Stack>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.title}
          </Typography>

          {item.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 1.5,
              }}
            >
              {item.description}
            </Typography>
          )}

          <Stack spacing={0.5}>
            {item.category && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CategoryIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">
                  {item.category}
                </Typography>
              </Stack>
            )}
            {item.location && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOnIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {item.location}
                </Typography>
              </Stack>
            )}
            {item.date_lost_found && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">
                  {item.date_lost_found}
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ItemCard
