import { Item } from 'src/types/item'

/** Days after which an approved-but-unclaimed item is considered expired. */
const EXPIRY_DAYS = 30

/** Minimal shape needed by expiry helpers — avoids coupling to the full Item type. */
type ExpirableItem = Pick<Item, 'status' | 'date_lost_found'>

/**
 * Returns true when an item is expired:
 *   - explicit status === 'expired', OR
 *   - status === 'approved' and the post date is older than EXPIRY_DAYS
 */
export function isExpired(item: ExpirableItem): boolean {
  if (item.status === 'expired') return true
  if (item.status !== 'approved') return false
  const posted = new Date(item.date_lost_found)
  const now = new Date()
  const diffDays = (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays > EXPIRY_DAYS
}

/** Number of full days since a date string (YYYY-MM-DD). */
export function daysOld(dateStr: string): number {
  return Math.floor(
    (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  )
}
