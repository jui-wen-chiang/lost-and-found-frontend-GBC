// Shared coupon types and mock data — used by CouponsPage, CouponScanPage, etc.

export type CouponStatus = 'available' | 'used' | 'expired'

export interface Coupon {
  id: number
  code: string
  store: string
  discount: string
  description: string
  /** ISO date string YYYY-MM-DD */
  expiresAt: string
  status: CouponStatus
}

// Replace with API fetch when backend is available
export const MOCK_COUPONS: Coupon[] = [
  {
    id: 1,
    code: 'GBC-CAFE-2024',
    store: 'Campus Café',
    discount: '20% off',
    description: 'Valid on any beverage purchase at the Ground Floor Café.',
    expiresAt: '2026-12-31',
    status: 'available',
  },
  {
    id: 2,
    code: 'GBC-BOOK-15',
    store: 'Campus Bookstore',
    discount: '$15 off',
    description: 'Redeem for any purchase over $50 at the main bookstore.',
    expiresAt: '2026-09-30',
    status: 'available',
  },
  {
    id: 3,
    code: 'GBC-PRINT-FREE',
    store: 'Library Print Centre',
    discount: '50 free pages',
    description: 'One-time 50-page print credit. Valid at any GBC campus library.',
    expiresAt: '2026-06-30',
    status: 'available',
  },
  {
    id: 4,
    code: 'GBC-PARK-FREE',
    store: 'Campus Parking',
    discount: '1 free day',
    description: 'One free day of parking at Lot B. Show QR at exit gate.',
    expiresAt: '2025-07-01',
    status: 'used',
  },
  {
    id: 5,
    code: 'GBC-GYM-PASS',
    store: 'Recreation Centre',
    discount: '3-day guest pass',
    description: 'Bring a friend for free — 3 consecutive days.',
    expiresAt: '2024-12-01',
    status: 'expired',
  },
]

export const STATUS_COLOR: Record<CouponStatus, 'success' | 'default' | 'error'> = {
  available: 'success',
  used: 'default',
  expired: 'error',
}

export const STATUS_LABEL: Record<CouponStatus, string> = {
  available: 'Available',
  used: 'Used',
  expired: 'Expired',
}

export const REDEEM_URL_BASE = 'https://lost-and-found.gbc.ca/redeem'

export function redeemUrl(code: string): string {
  return `${REDEEM_URL_BASE}/${code}`
}

/** Days until a coupon expires (negative = already expired) */
export function daysUntilExpiry(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
