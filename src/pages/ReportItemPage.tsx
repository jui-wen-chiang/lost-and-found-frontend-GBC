import { useNavigate } from 'react-router-dom'
import { Container, Typography } from '@mui/material'

import ItemPostForm from '../components/items/ItemPostForm'
import { FormValues } from 'src/types/item'

function ReportItemPage() {
  const navigate = useNavigate()

  const handleSubmit = (formData: FormValues) => {
    // TODO: POST to API
    console.log('New item:', formData)
    navigate('/my-posts')
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Report a Lost or Found Item
      </Typography>
      <ItemPostForm onSubmit={handleSubmit} submitLabel="Create Post" />
    </Container>
  )
}

export default ReportItemPage
