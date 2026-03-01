import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Typography } from '@mui/material'

import ItemPostForm from '../components/items/ItemPostForm'

function EditPostPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const item = state?.item

  const handleSubmit = (formData) => {
    // TODO: PUT to API
    console.log('Updated item:', formData)
    navigate('/my-posts')
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
      <ItemPostForm
        initialValues={item}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/my-posts')}
        submitLabel="Save Changes"
      />
    </Container>
  )
}

export default EditPostPage
