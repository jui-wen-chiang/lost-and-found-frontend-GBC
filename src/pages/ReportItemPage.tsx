import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Container, Typography } from '@mui/material'

import ItemPostForm from '../components/items/ItemPostForm'
import { FormValues, formValuesToCreateRequest } from 'src/types/item'
import { useCreateItem } from '../hooks/useItems'

function ReportItemPage() {
  const navigate = useNavigate()
  const createItem = useCreateItem()
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = (formData: FormValues) => {
    setSubmitError('')
    const payload = formValuesToCreateRequest(formData)
    createItem.mutate(payload, {
      onSuccess: () => navigate('/my-posts'),
      onError: (err) => {
        const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
        if (data) {
          setSubmitError(Object.values(data).flat().join(' ') || 'Failed to create item.')
        } else {
          setSubmitError('Failed to create item. Please try again.')
        }
      },
    })
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Report a Lost or Found Item
      </Typography>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <ItemPostForm
        onSubmit={handleSubmit}
        submitLabel={createItem.isPending ? 'Submitting…' : 'Create Post'}
      />
    </Container>
  )
}

export default ReportItemPage
