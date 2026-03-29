import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  ArrowBack as BackIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  RateReview as AuditIcon,
  CalendarToday as DateIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { useItem } from '../hooks/useItems'
import { useApprovePost, useRejectPost } from '../hooks/useAdmin'

export default function AdminAuditDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const numId = Number(id)

  const { data: item, isLoading, error: fetchError } = useItem(numId)
  const approvePost = useApprovePost()
  const rejectPost = useRejectPost()

  const [decision, setDecision] = useState('')
  const [reason, setReason] = useState('')

  const handleApprove = () => {
    approvePost.mutate(numId, {
      onSuccess: () => {
        setDecision('Approved')
        setTimeout(() => navigate('/admin/audit'), 1500)
      },
    })
  }

  const handleReject = () => {
    rejectPost.mutate(
      { id: numId, reason },
      {
        onSuccess: () => {
          setDecision('Rejected')
          setTimeout(() => navigate('/admin/audit'), 1500)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (fetchError || !item) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load post details.</Alert>
      </Container>
    )
  }

  const submitted = !!decision

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <AuditIcon color="warning" sx={{ fontSize: 30 }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Post Audit Detail
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Post ID: {id}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {/* Item Info Card */}
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Chip
              label={item.type?.toUpperCase()}
              size="small"
              color={item.type === 'lost' ? 'error' : 'success'}
              sx={{ fontWeight: 700 }}
            />
            <Typography variant="h6" fontWeight={700}>
              {item.title}
            </Typography>
          </Stack>

          {/* Photos */}
          {item.photos && item.photos.length > 0 && (
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} mb={0.5} display="block">
                PHOTOS
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {item.photos.map((photo) => (
                  <Box
                    key={photo.id}
                    component="img"
                    src={photo.url}
                    alt="item photo"
                    sx={{
                      width: 120,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Description */}
          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
              DESCRIPTION
            </Typography>
            <Typography variant="body2">{item.description || '—'}</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Meta */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">Category:</Typography>
              <Typography variant="body2" fontWeight={600}>{item.category}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">Location:</Typography>
              <Typography variant="body2" fontWeight={600}>{item.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <DateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">Date:</Typography>
              <Typography variant="body2" fontWeight={600}>{item.date_lost_found || '—'}</Typography>
            </Stack>
            {item.posted_by && (
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Posted by:</Typography>
                <Typography variant="body2" fontWeight={600}>{item.posted_by}</Typography>
              </Stack>
            )}
          </Stack>
        </Paper>

        {/* Decision Card */}
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Admin Decision
          </Typography>

          {submitted ? (
            <Alert severity={decision === 'Approved' ? 'success' : 'error'}>
              Decision submitted: <strong>{decision}</strong>
              {decision === 'Rejected' && reason ? ` — Reason: ${reason}` : ''}
              <br />
              <Typography variant="caption">Redirecting back to queue…</Typography>
            </Alert>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Reason for rejection"
                multiline
                rows={3}
                size="small"
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Required if rejecting — describe why this post doesn't meet standards"
              />
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={handleApprove}
                  disabled={approvePost.isPending}
                >
                  {approvePost.isPending ? 'Approving…' : 'Approve'}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={handleReject}
                  disabled={rejectPost.isPending || !reason.trim()}
                >
                  {rejectPost.isPending ? 'Rejecting…' : 'Reject'}
                </Button>
              </Stack>
              {!reason.trim() && (
                <Typography variant="caption" color="text.secondary">
                  Fill in a rejection reason to enable the Reject button.
                </Typography>
              )}
            </Stack>
          )}
        </Paper>

        <Button
          variant="text"
          startIcon={<BackIcon />}
          onClick={() => navigate('/admin/audit')}
          sx={{ width: 'fit-content' }}
        >
          Back to Queue
        </Button>
      </Stack>
    </Container>
  )
}
