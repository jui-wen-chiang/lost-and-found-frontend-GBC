import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Alert, CircularProgress, Container, Typography } from '@mui/material'

import ItemPostForm from '../components/items/ItemPostForm'
import { FormValues, formValuesToCreateRequest, apiItemToItem } from 'src/types/item'
import { useItem, useUpdateItem } from '../hooks/useItems'
import { useCategories } from '../hooks/useCategories'
import { useLocations } from '../hooks/useLocations'

function EditPostPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const numId = Number(id)

  const updateItem = useUpdateItem()
  const [submitError, setSubmitError] = useState('')

  // If the item was passed via router state, use it; otherwise fetch from API
  const passedItem = state?.item
  const { data: apiItem, isLoading } = useItem(passedItem ? 0 : numId) // skip if we already have it
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()

  const item = passedItem ?? (apiItem ? apiItemToItem(apiItem, categories, locations) : null)

  const handleSubmit = (formData: FormValues) => {
    setSubmitError('')
    const payload = formValuesToCreateRequest(formData)
    updateItem.mutate(
      { id: numId, data: payload },
      {
        onSuccess: () => navigate('/my-posts'),
        onError: (err) => {
          const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
          if (data) {
            setSubmitError(Object.values(data).flat().join(' ') || 'Failed to update item.')
          } else {
            setSubmitError('Failed to update item. Please try again.')
          }
        },
      },
    )
  }

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!item) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Item not found. Please go back to My Posts.</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Edit Post
      </Typography>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <ItemPostForm
        initialValues={item}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/my-posts')}
        submitLabel={updateItem.isPending ? 'Saving…' : 'Save Changes'}
      />
    </Container>
  )
}

export default EditPostPage
