import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material'

import ItemList from '../components/items/ItemList'
import DeleteItemDialog from '../components/items/DeleteItemDialog'
import { Item, apiItemToItem } from 'src/types/item'
import { useItems, useDeleteItem } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { useLocations } from '../hooks/useLocations'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage, isAuthError } from '../utils/errorMessages'

function MyPostsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: apiItems, isLoading, error } = useItems()
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()
  const deleteItemMutation = useDeleteItem()

  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null)

  const items: Item[] = useMemo(() => {
    if (!apiItems) return []
    return apiItems
      .filter((ai) => ai.owner === user?.id)
      .map((ai) => apiItemToItem(ai, categories, locations))
  }, [apiItems, categories, locations, user?.id])

  const handleEdit = (item: Item) => {
    navigate(`/my-posts/${item.id}/edit`, { state: { item } })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteItemMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">My Posts</Typography>
        <Button variant="contained" onClick={() => navigate('/items/new')}>
          + Report Item
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity={isAuthError(error) ? 'info' : 'error'}
          action={isAuthError(error) ? <Button color="inherit" size="small" href="/login">Sign In</Button> : undefined}
        >
          {getErrorMessage(error, 'Failed to load your posts.')}
        </Alert>
      ) : (
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      <DeleteItemDialog
        open={!!deleteTarget}
        item={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Container>
  )
}

export default MyPostsPage
