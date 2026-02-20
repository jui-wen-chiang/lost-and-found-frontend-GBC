import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography } from '@mui/material'

import ItemList from '../components/items/ItemList'
import DeleteItemDialog from '../components/items/DeleteItemDialog'

const MOCK_ITEMS = [
  {
    id: 1,
    type: 'lost',
    title: 'Blue Backpack',
    category_id: 6,
    category: 'Bags',
    description: 'Navy blue Jansport backpack with a red keychain. Last seen near the library.',
    location_id: 3,
    location: 'St. James — Building A, Library',
    date_lost_found: '2026-02-10',
    status: 'pending',
  },
  {
    id: 2,
    type: 'found',
    title: 'AirPods Case',
    category_id: 1,
    category: 'Electronics',
    description: 'White AirPods Pro case found on a bench, no AirPods inside.',
    location_id: 1,
    location: 'Casa Loma — Building A, Lobby',
    date_lost_found: '2026-02-14',
    status: 'approved',
  },
  {
    id: 3,
    type: 'lost',
    title: 'Student ID Card',
    category_id: 4,
    category: 'Books & Documents',
    description: 'GBC student ID card. Name: Alex Johnson.',
    location_id: 2,
    location: 'Casa Loma — Building B, Cafeteria',
    date_lost_found: '2026-02-15',
    status: 'approved',
  },
]

function MyPostsPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(MOCK_ITEMS)
  const [deleteItem, setDeleteItem] = useState(null)

  const handleEdit = (item) => {
    navigate(`/my-posts/${item.id}/edit`, { state: { item } })
  }

  const handleDelete = () => {
    setItems((prev) => prev.filter((i) => i.id !== deleteItem.id))
    setDeleteItem(null)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">My Posts</Typography>
        <Button variant="contained" onClick={() => navigate('/items/new')}>
          + Report Item
        </Button>
      </Box>

      <ItemList
        items={items}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteItem(item)}
      />

      <DeleteItemDialog
        open={!!deleteItem}
        item={deleteItem}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </Container>
  )
}

export default MyPostsPage
