import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  Button,
} from '@mui/material'
import {
  RateReview as AuditIcon,
  ArrowForward as ArrowIcon,
  CheckCircleOutline as EmptyIcon,
} from '@mui/icons-material'
import { usePendingPosts } from '../hooks/useAdmin'

export default function AdminAuditQueuePage() {
  const { data: posts, isLoading, error } = usePendingPosts()

  const count = (posts ?? []).length

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <AuditIcon color="warning" sx={{ fontSize: 30 }} />
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Audit Queue
            </Typography>
            {!isLoading && !error && (
              <Chip
                label={count}
                size="small"
                color={count > 0 ? 'warning' : 'default'}
                sx={{ fontWeight: 700 }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Review and approve or reject newly submitted posts
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {isLoading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error">Failed to load pending posts.</Alert>
      )}

      {!isLoading && !error && count === 0 && (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            py: 8,
            textAlign: 'center',
          }}
        >
          <EmptyIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            All caught up!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No pending posts to review right now.
          </Typography>
        </Paper>
      )}

      <Stack spacing={1.5}>
        {(posts ?? []).map((post) => (
          <Paper
            key={post.id}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              '&:hover': { borderColor: 'warning.main', bgcolor: 'warning.50' },
              transition: 'all 0.15s',
            }}
          >
            <Stack spacing={0.5} flex={1} minWidth={0}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={post.item_type?.toUpperCase()}
                  size="small"
                  color={post.item_type === 'lost' ? 'error' : 'success'}
                  sx={{ fontWeight: 700, fontSize: 11 }}
                />
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  {post.title}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Posted: {post.created_at?.slice(0, 10)}
              </Typography>
            </Stack>

            <Button
              component={RouterLink}
              to={`/admin/audit/${post.id}`}
              variant="outlined"
              color="warning"
              size="small"
              endIcon={<ArrowIcon />}
              sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Review
            </Button>
          </Paper>
        ))}
      </Stack>
    </Container>
  )
}
