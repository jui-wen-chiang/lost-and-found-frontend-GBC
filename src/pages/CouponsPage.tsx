import { useState } from 'react'
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
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import QRCodeDisplay from 'src/components/QRCodeDisplay'

// ─── Types ────────────────────────────────────────────────────────────────────
type CouponStatus = 'available' | 'used' | 'expired'

interface Coupon {
  id: number
  code: string
  store: string
  discount: string
  description: string
  expiresAt: string
  status: CouponStatus
}

// ─── Mock data – replace with API fetch ───────────────────────────────────────
const MOCK_COUPONS: Coupon[] = [
  {
    id: 1,
    code: 'GBC-CAFE-2024',
    store: 'Campus Café',
    discount: '20% off',
    description: 'Valid on any beverage purchase at the Ground Floor Café.',
    expiresAt: '2025-12-31',
    status: 'available',
  },
  {
    id: 2,
    code: 'GBC-BOOK-15',
    store: 'Campus Bookstore',
    discount: '$15 off',
    description: 'Redeem for any purchase over $50 at the main bookstore.',
    expiresAt: '2025-09-30',
    status: 'available',
  },
  {
    id: 3,
    code: 'GBC-PARK-FREE',
    store: 'Campus Parking',
    discount: '1 free day',
    description: 'One free day of parking at Lot B. Show QR at exit gate.',
    expiresAt: '2025-07-01',
    status: 'used',
  },
  {
    id: 4,
    code: 'GBC-GYM-PASS',
    store: 'Recreation Centre',
    discount: '3-day guest pass',
    description: 'Bring a friend for free — 3 consecutive days.',
    expiresAt: '2024-12-01',
    status: 'expired',
  },
]

const STATUS_COLOR: Record<CouponStatus, 'success' | 'default' | 'error'> = {
  available: 'success',
  used: 'default',
  expired: 'error',
}

const STATUS_LABEL: Record<CouponStatus, string> = {
  available: 'Available',
  used: 'Used',
  expired: 'Expired',
}

const TAB_VALUES = ['all', 'available', 'used', 'expired'] as const
type TabValue = (typeof TAB_VALUES)[number]

// ─── Component ────────────────────────────────────────────────────────────────
function CouponsPage() {
  const [tab, setTab] = useState<TabValue>('all')
  const [activatedIds, setActivatedIds] = useState<Set<number>>(new Set())

  const visible =
    tab === 'all' ? MOCK_COUPONS : MOCK_COUPONS.filter((c) => c.status === tab)

  function handleActivate(id: number) {
    setActivatedIds((prev) => new Set(prev).add(id))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <LocalOfferIcon color="primary" fontSize="large" />
        <Typography variant="h4" fontWeight={700}>
          My Coupons
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Coupons are awarded when you successfully return a found item. Show the QR
        code at the participating store to redeem your discount.
      </Typography>

      {/* Tabs */}
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

      <Grid container spacing={3}>
        {visible.map((coupon) => {
          const isActivated = activatedIds.has(coupon.id)
          const canActivate = coupon.status === 'available' && !isActivated

          return (
            <Grid key={coupon.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: coupon.status !== 'available' ? 0.65 : 1,
                  transition: 'box-shadow 0.15s',
                  '&:hover': coupon.status === 'available' ? { boxShadow: 4 } : undefined,
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={STATUS_LABEL[coupon.status]}
                      color={STATUS_COLOR[coupon.status]}
                      size="small"
                    />
                    <Tooltip title={`Expires: ${coupon.expiresAt}`} arrow>
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Box>

                  <Typography variant="h6" fontWeight={700}>
                    {coupon.discount}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {coupon.store}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {coupon.description}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* QR code — FR-8 */}
                  {coupon.status === 'available' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <QRCodeDisplay
                        value={`https://lost-and-found.example.com/redeem/${coupon.code}`}
                        label={coupon.code}
                        size={130}
                        expandable={isActivated}
                      />
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

                <CardActions sx={{ px: 2, pb: 2 }}>
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
                  {isActivated && coupon.status === 'available' && (
                    <Alert severity="success" sx={{ width: '100%', py: 0.5 }}>
                      Coupon activated — show the QR to the cashier.
                    </Alert>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Usage instructions */}
      <Paper variant="outlined" sx={{ mt: 5, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          How to use your coupons
        </Typography>
        <Box component="ol" sx={{ pl: 2, m: 0, '& li': { mb: 1 } }}>
          <Typography component="li" variant="body2">
            Tap <strong>Activate &amp; Show QR</strong> on an available coupon.
          </Typography>
          <Typography component="li" variant="body2">
            Click <strong>View QR Code</strong> to open the full-screen code.
          </Typography>
          <Typography component="li" variant="body2">
            Show the QR code to the cashier or point-of-sale scanner at the
            participating store.
          </Typography>
          <Typography component="li" variant="body2">
            Each coupon can only be redeemed once. Used coupons are marked
            automatically.
          </Typography>
          <Typography component="li" variant="body2">
            Coupons expire on the date shown. Expired coupons cannot be
            redeemed.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default CouponsPage
