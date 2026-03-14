import { Box, Button, Chip, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Item } from 'src/types/item'
import { isExpired } from 'src/utils/itemUtils'

interface Props {
  items: Item[]
  onEdit?: (item: Item) => void
  onDelete?: (item: Item) => void
}

function ItemList({ items, onEdit, onDelete }: Props) {
  if (!items.length) {
    return <Typography sx={{ mt: 2 }}>No items yet.</Typography>
  }

  return (
    <Box>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid #eee',
            py: 1.5,
            opacity: isExpired(item) ? 0.8 : 1,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
              <Typography variant="body1" fontWeight={500}>
                {item.title}
              </Typography>
              {isExpired(item) && (
                <Chip
                  icon={<AccessTimeIcon sx={{ fontSize: '12px !important' }} />}
                  label="Expired"
                  color="error"
                  size="small"
                  sx={{ height: 18, fontSize: 10, fontWeight: 700 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {item.type} · {item.category} · {item.status}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.location} · {item.date_lost_found}
            </Typography>
            {item.description && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {item.description}
              </Typography>
            )}
          </Box>

          {(onEdit || onDelete) && (
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>
              {onEdit && (
                <Button size="small" onClick={() => onEdit(item)}>Edit</Button>
              )}
              {onDelete && (
                <Button size="small" color="error" onClick={() => onDelete(item)}>Delete</Button>
              )}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default ItemList
