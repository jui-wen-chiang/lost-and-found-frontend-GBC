import { Box, Button, Typography } from '@mui/material'

function ItemList({ items, onEdit, onDelete }) {
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
          }}
        >
          <Box>
            <Typography variant="body1" fontWeight={500}>
              {item.title}
            </Typography>
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

          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>
            <Button size="small" onClick={() => onEdit(item)}>
              Edit
            </Button>
            <Button size="small" color="error" onClick={() => onDelete(item)}>
              Delete
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default ItemList
