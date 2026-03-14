import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import { useState } from 'react'
import { MOCK_COUPONS, STATUS_COLOR, STATUS_LABEL, redeemUrl, daysUntilExpiry } from 'src/data/coupons'

/**
 * CouponScanPage — FR-8: Full-screen QR code display optimised for
 * point-of-sale scanning.
 *
 * Route: /coupons/:id/scan
 */
export default function CouponScanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bright, setBright] = useState(false)

  const coupon = MOCK_COUPONS.find((c) => String(c.id) === String(id))

  if (!coupon) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Coupon not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/coupons')}>
          Back to My Coupons
        </Button>
      </Container>
    )
  }

  const daysLeft = daysUntilExpiry(coupon.expiresAt)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: bright ? '#ffffff' : 'grey.900',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s',
      }}
    >
      {/* ── Top bar ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <IconButton color="inherit" onClick={() => navigate('/coupons')} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ flex: 1, textAlign: 'center', mx: 1 }}>
          {coupon.store}
        </Typography>
        <Tooltip title={bright ? 'Dim screen' : 'Boost brightness for scanning'}>
          <IconButton
            color="inherit"
            size="small"
            onClick={() => setBright((b) => !b)}
            sx={{ opacity: bright ? 1 : 0.7 }}
          >
            <BrightnessHighIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Main content ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 4,
          gap: 3,
        }}
      >
        {/* Coupon headline */}
        <Stack alignItems="center" spacing={0.5}>
          <Typography
            variant="h3"
            fontWeight={900}
            textAlign="center"
            sx={{ color: bright ? 'primary.main' : 'white', lineHeight: 1.1 }}
          >
            {coupon.discount}
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ color: bright ? 'text.secondary' : 'grey.400' }}
          >
            {coupon.store}
          </Typography>
          <Chip
            label={STATUS_LABEL[coupon.status]}
            color={STATUS_COLOR[coupon.status]}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Stack>

        {/* QR code */}
        <Box
          sx={{
            p: 3,
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: bright ? 2 : '0 0 40px rgba(255,255,255,0.15)',
          }}
        >
          <QRCodeSVG
            value={redeemUrl(coupon.code)}
            size={260}
            level="H"
            marginSize={2}
          />
        </Box>

        {/* Code + expiry */}
        <Stack alignItems="center" spacing={0.5}>
          <Typography
            variant="body2"
            sx={{
              color: bright ? 'text.secondary' : 'grey.400',
              fontFamily: 'monospace',
              letterSpacing: 1.5,
              fontSize: 15,
            }}
          >
            {coupon.code}
          </Typography>
          {daysLeft > 0 ? (
            <Typography variant="caption" sx={{ color: daysLeft <= 7 ? 'warning.light' : (bright ? 'text.disabled' : 'grey.500') }}>
              Expires {coupon.expiresAt} · {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
            </Typography>
          ) : (
            <Typography variant="caption" color="error.light">
              Expired on {coupon.expiresAt}
            </Typography>
          )}
        </Stack>

        <Divider sx={{ width: '100%', borderColor: bright ? 'divider' : 'grey.700' }} />

        {/* Instructions */}
        <Alert
          severity="info"
          sx={{
            width: '100%',
            maxWidth: 420,
            bgcolor: bright ? undefined : 'rgba(2,136,209,0.15)',
            color: bright ? undefined : 'info.light',
            '& .MuiAlert-icon': { color: bright ? undefined : 'info.light' },
          }}
        >
          Show this QR code to the cashier. Keep this screen open until the
          cashier confirms the scan.
        </Alert>

        {coupon.status !== 'available' && (
          <Alert severity="warning" sx={{ width: '100%', maxWidth: 420 }}>
            This coupon has already been <strong>{coupon.status}</strong> and may
            not be accepted.
          </Alert>
        )}
      </Box>

      {/* ── Footer ── */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/coupons')}
          sx={{ color: bright ? 'text.secondary' : 'grey.400', borderColor: bright ? 'divider' : 'grey.600' }}
        >
          Back to My Coupons
        </Button>
      </Box>
    </Box>
  )
}
