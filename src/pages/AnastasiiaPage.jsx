import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

import ItemPostForm, { CATEGORIES, LOCATIONS } from '../components/items/ItemPostForm'
import DeleteItemDialog from '../components/items/DeleteItemDialog'
import ItemList from '../components/items/ItemList'

// helper: resolve display labels from FK ids
function resolveLabels(formData) {
  const category = CATEGORIES.find((c) => c.id === formData.category_id)?.name ?? 'Other'
  const loc = LOCATIONS.find((l) => l.id === formData.location_id)
  const location = loc ? `${loc.campus_name} — ${loc.building}, ${loc.room_area}` : 'Unknown'
  return { category, location }
}

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

function AnastasiiaPage() {
  const [items, setItems] = useState(MOCK_ITEMS)
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)

  const handleCreate = (formData) => {
    const { category, location } = resolveLabels(formData)
    setItems((prev) => [
      { ...formData, id: Date.now(), category, location, status: 'pending' },
      ...prev,
    ])
    setCreateOpen(false)
  }

  const handleEdit = (formData) => {
    const { category, location } = resolveLabels(formData)
    setItems((prev) =>
      prev.map((item) =>
        item.id === editItem.id ? { ...item, ...formData, category, location } : item
      )
    )
    setEditItem(null)
  }

  const handleDelete = () => {
    setItems((prev) => prev.filter((item) => item.id !== deleteItem.id))
    setDeleteItem(null)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Item Posts</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          + Report Item
        </Button>
      </Box>

      {/* Item list */}
      <ItemList
        items={items}
        onEdit={(item) => setEditItem(item)}
        onDelete={(item) => setDeleteItem(item)}
      />

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Report a Lost or Found Item</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ItemPostForm
              onSubmit={handleCreate}
              onCancel={() => setCreateOpen(false)}
              submitLabel="Create Post"
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Item Post</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {editItem && (
              <ItemPostForm
                initialValues={editItem}
                onSubmit={handleEdit}
                onCancel={() => setEditItem(null)}
                submitLabel="Save Changes"
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <DeleteItemDialog
        open={!!deleteItem}
        item={deleteItem}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </Container>
  )
}

export default AnastasiiaPage
