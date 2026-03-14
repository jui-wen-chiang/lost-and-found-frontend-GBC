import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import StoreIcon from '@mui/icons-material/Store'
import TaskAltIcon from '@mui/icons-material/TaskAlt'

const PARTICIPATING_STORES = [
  { name: 'Campus Café – St. James', hours: 'Mon–Fri  7:30 am – 5:00 pm' },
  { name: 'Campus Café – Casa Loma', hours: 'Mon–Fri  8:00 am – 4:30 pm' },
  { name: 'GBC Coop Bookstore', hours: 'Mon–Fri  9:00 am – 6:00 pm' },
  { name: 'Student Wellness Centre', hours: 'Mon–Fri  8:30 am – 4:00 pm' },
  { name: 'Athletics & Recreation', hours: 'Mon–Fri  6:30 am – 9:00 pm' },
]

const EARN_STEPS = [
  {
    icon: <AssignmentReturnIcon />,
    primary: 'Return a found item',
    secondary:
      'Drop off an item you found on campus at any Lost & Found desk or submit it through this app.',
  },
  {
    icon: <TaskAltIcon />,
    primary: 'Item is verified',
    secondary:
      'Staff review and verify the returned item. The whole process typically takes 1–2 business days.',
  },
  {
    icon: <CardGiftcardIcon />,
    primary: 'Earn your coupon',
    secondary:
      'Once verified you receive a coupon credit in your account. Higher-value items may earn multiple coupons.',
  },
]

const REDEEM_STEPS = [
  {
    icon: <PhoneIphoneIcon />,
    primary: 'Open My Coupons',
    secondary: 'Navigate to the Coupons tab in the app and find an available coupon.',
  },
  {
    icon: <LocalOfferIcon />,
    primary: 'Tap "Activate"',
    secondary:
      'Press the Activate button on the coupon card to reveal the QR code.',
  },
  {
    icon: <QrCodeScannerIcon />,
    primary: 'Open full-screen QR',
    secondary:
      'Tap "Scan at Store" to open the large QR code optimised for scanner reading.',
  },
  {
    icon: <StoreIcon />,
    primary: 'Show to cashier',
    secondary:
      'Present the QR code screen at the participating store. Keep the screen on until the cashier confirms the scan.',
  },
  {
    icon: <CheckCircleIcon />,
    primary: 'Enjoy your discount',
    secondary:
      'The discount is applied automatically. The coupon will be marked as used in your account.',
  },
]

/**
 * CouponInstructionsPage — FR-8: Explains how to earn and redeem coupons.
 *
 * Route: /coupons/instructions
 */
export default function CouponInstructionsPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 8 }}>
      {/* ── Back nav ── */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/coupons')}
        sx={{ mb: 2 }}
      >
        Back to My Coupons
      </Button>

      {/* ── Page header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          How Coupons Work
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Good deed rewarded — return a lost item found on campus and earn
          discount coupons redeemable at participating GBC services.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* ── Section 1: Earn ── */}
      <Section
        title="Earning Coupons"
        subtitle="Help reunite students with their belongings and get rewarded."
        icon="🏆"
      >
        <List disablePadding>
          {EARN_STEPS.map((step, i) => (
            <StepItem key={i} step={i + 1} {...step} />
          ))}
        </List>
      </Section>

      <Divider sx={{ my: 4 }} />

      {/* ── Section 2: Redeem ── */}
      <Section
        title="Redeeming Coupons"
        subtitle="Use your coupon at any participating campus location."
        icon="🎟️"
      >
        <List disablePadding>
          {REDEEM_STEPS.map((step, i) => (
            <StepItem key={i} step={i + 1} {...step} />
          ))}
        </List>
      </Section>

      <Divider sx={{ my: 4 }} />

      {/* ── Section 3: Participating stores ── */}
      <Section
        title="Participating Locations"
        subtitle="Coupons are accepted at the following campus services."
        icon="📍"
      >
        <Stack spacing={1}>
          {PARTICIPATING_STORES.map((store) => (
            <Box
              key={store.name}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="body2" fontWeight={700}>
                {store.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {store.hours}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Section>

      <Divider sx={{ my: 4 }} />

      {/* ── Section 4: Important notes ── */}
      <Section title="Important Notes" icon="📋">
        <Stack spacing={1.5}>
          {[
            'Coupons are non-transferable and linked to your account.',
            'Each coupon can only be redeemed once.',
            'Coupons cannot be combined with other offers or promotions.',
            'Expired coupons cannot be extended or replaced.',
            'GBC reserves the right to revoke coupons obtained fraudulently.',
          ].map((note, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
              <Chip label={i + 1} size="small" sx={{ mt: 0.25, minWidth: 24, height: 24, fontSize: 11 }} />
              <Typography variant="body2" color="text.secondary">
                {note}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Section>

      <Divider sx={{ my: 4 }} />

      {/* ── CTA ── */}
      <Alert severity="success" sx={{ mb: 3 }}>
        Ready to report a found item and earn your first coupon?
      </Alert>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => navigate('/report')}
          fullWidth
        >
          Report Found Item
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/coupons')}
          fullWidth
        >
          My Coupons
        </Button>
      </Stack>
    </Container>
  )
}

/* ── Helper sub-components ─────────────────────────────────────── */

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: string
  children: React.ReactNode
}) {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: subtitle ? 0.5 : 2 }}>
        {icon && <Typography variant="h6">{icon}</Typography>}
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
      </Stack>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: icon ? 4 : 0 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  )
}

function StepItem({
  step,
  icon,
  primary,
  secondary,
}: {
  step: number
  icon: React.ReactNode
  primary: string
  secondary: string
}) {
  return (
    <ListItem alignItems="flex-start" disableGutters sx={{ py: 1 }}>
      <ListItemAvatar sx={{ minWidth: 52 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'primary.main',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {step}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="body1" fontWeight={600}>{primary}</Typography>}
        secondary={secondary}
        secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
      />
    </ListItem>
  )
}
