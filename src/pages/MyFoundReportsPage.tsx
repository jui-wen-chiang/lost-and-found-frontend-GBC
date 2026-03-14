import { useMemo } from 'react'
import { apiItemToItem } from 'src/types/item'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { useLocations } from '../hooks/useLocations'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, isAuthError } from '../utils/errorMessages'

function StatusTag({ status }: { status: string }) {
  let color = '#f59e0b'
  if (status === 'approved') color = '#3b82f6'
  if (status === 'claimed' || status === 'completed') color = '#16a34a'

  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: '999px',
        background: `${color}15`,
        color,
        fontWeight: 600,
        fontSize: '12px',
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}

export default function MyFoundReportsPage() {
  const { user } = useAuth()
  const { data: apiItems, isLoading, error } = useItems({ item_type: 'found' })
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()

  const items = useMemo(
    () =>
      (apiItems ?? [])
        .filter((ai) => ai.owner === user?.id)
        .map((ai) => apiItemToItem(ai, categories, locations)),
    [apiItems, categories, locations, user?.id],
  )

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '16px' }}>My Found Item Reports</h2>

      {isLoading ? (
        <p>Loading…</p>
      ) : error ? (
        <div style={{ padding: '16px', borderRadius: '8px', background: isAuthError(error) ? '#e3f2fd' : '#fdecea', marginBottom: '16px' }}>
          <p style={{ margin: 0, color: isAuthError(error) ? '#1565c0' : '#c62828' }}>
            {getErrorMessage(error, 'Failed to load found reports.')}
          </p>
          {isAuthError(error) && (
            <a href="/login" style={{ color: '#1565c0', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>Sign In</a>
          )}
        </div>
      ) : items.length === 0 ? (
        <p style={{ color: '#666' }}>You haven't reported any found items yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map((r) => (
            <div
              key={r.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  Location: {r.location}
                </div>
              </div>

              <StatusTag status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}