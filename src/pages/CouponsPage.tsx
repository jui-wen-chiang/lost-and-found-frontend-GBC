import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QRCodeDisplay from 'src/components/QRCodeDisplay'
import {
  MOCK_COUPONS,
  STATUS_COLOR,
  STATUS_LABEL,
  redeemUrl,
  daysUntilExpiry,
} from 'src/data/coupons'

const TAB_VALUES = ['all', 'available', 'used', 'expired'] as const
type TabValue = (typeof TAB_VALUES)[number]

// ─── Component ────────────────────────────────────────────────────────────────
function CouponsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabValue>('all')
  const [activatedIds, setActivatedIds] = useState<Set<number>>(new Set())

  const visible =
    tab === 'all' ? MOCK_COUPONS : MOCK_COUPONS.filter((c) => c.status === tab)

  function handleActivate(id: number) {
    setActivatedIds((prev) => new Set(prev).add(id))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocalOfferIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight={700}>
            My Coupons
          </Typography>
        </Box>
        <Button
          variant="text"
          startIcon={<HelpOutlineIcon />}
          size="small"
          onClick={() => navigate('/coupons/instructions')}
        >
          How to use
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Coupons are awarded when you successfully return a found item. Activate a
        coupon, then show the QR code at the participating store.
      </Typography>

      {/* ── Tabs ── */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v as TabValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {TAB_VALUES.map((t) => (
          <Tab
            key={t}
            value={t}
            label={t.charAt(0).toUpperCase() + t.slice(1)}
          />
        ))}
      </Tabs>

      {visible.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No coupons in this category yet.
        </Alert>
      )}

      {/* ── Coupon cards ── */}
      <Grid container spacing={3}>
        {visible.map((coupon) => {
          const isActivated = activatedIds.has(coupon.id)
          const canActivate = coupon.status === 'available' && !isActivated
          const daysLeft = daysUntilExpiry(coupon.expiresAt)

          return (
            <Grid key={coupon.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  opacity: coupon.status !== 'available' ? 0.65 : 1,
                  transition: 'box-shadow 0.15s',
                  borderColor: isActivated ? 'success.main' : undefined,
                  borderWidth: isActivated ? 2 : undefined,
                  '&:hover': coupon.status === 'available' ? { boxShadow: 4 } : undefined,
                }}
              >
                {/* ACTIVATED ribbon */}
                {isActivated && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: -1,
                      bgcolor: 'success.main',
                      color: 'white',
                      px: 1.5,
                      py: 0.3,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      borderRadius: '4px 0 0 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      zIndex: 1,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 13 }} />
                    ACTIVATED
                  </Box>
                )}

                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={STATUS_LABEL[coupon.status]}
                      color={STATUS_COLOR[coupon.status]}
                      size="small"
                    />
                    <Tooltip title={`Expires: ${coupon.expiresAt}`} arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
                        <InfoOutlinedIcon fontSize="small" color={daysLeft <= 7 && coupon.status === 'available' ? 'warning' : 'action'} />
                        {daysLeft > 0 && coupon.status === 'available' && (
                          <Typography variant="caption" color={daysLeft <= 7 ? 'warning.main' : 'text.disabled'}>
                            {daysLeft}d left
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  </Box>

                  <Typography variant="h5" fontWeight={800} color="primary.main">
                    {coupon.discount}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {coupon.store}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {coupon.description}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Inline QR preview (available only, shown after activation) */}
                  {coupon.status === 'available' && isActivated && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <QRCodeDisplay
                        value={redeemUrl(coupon.code)}
                        label={coupon.code}
                        size={120}
                        expandable
                      />
                    </Box>
                  )}

                  {/* Pre-activation placeholder */}
                  {coupon.status === 'available' && !isActivated && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 80,
                        bgcolor: 'grey.100',
                        borderRadius: 1.5,
                        gap: 1,
                        color: 'text.disabled',
                      }}
                    >
                      <QrCodeScannerIcon />
                      <Typography variant="caption">Activate to reveal QR</Typography>
                    </Box>
                  )}

                  {coupon.status !== 'available' && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      textAlign="center"
                      sx={{ mt: 1 }}
                    >
                      Code: {coupon.code}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, flexDirection: 'column', gap: 1 }}>
                  {/* Activate button */}
                  {canActivate && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => handleActivate(coupon.id)}
                    >
                      Activate &amp; Show QR
                    </Button>
                  )}

                  {/* Post-activation: scan page button */}
                  {isActivated && (
                    <>
                      <Alert
                        icon={<CheckCircleIcon fontSize="small" />}
                        severity="success"
                        sx={{ width: '100%', py: 0.5 }}
                      >
                        Ready to use at {coupon.store}
                      </Alert>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<QrCodeScannerIcon />}
                        onClick={() => navigate(`/coupons/${coupon.id}/scan`)}
                      >
                        Open Full-Screen QR
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default CouponsPage
