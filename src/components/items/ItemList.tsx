import { useNavigate } from 'react-router-dom'
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { Item } from 'src/types/item'
import { isExpired } from 'src/utils/itemUtils'

interface Props {
  items: Item[]
  onEdit?: (item: Item) => void
  onDelete?: (item: Item) => void
}

function ItemList({ items, onEdit, onDelete }: Props) {
  const navigate = useNavigate()

  if (!items.length) {
    return (
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', mt: 2 }}>
        <PostAddIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>No posts yet</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Report a lost or found item to see it here.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/items/new')}>
          Report Item
        </Button>
      </Paper>
    )
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
