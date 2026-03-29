import { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import PhotoUpload from './PhotoUpload'
import { FormValues, Photo } from 'src/types/item'
import { useCategories } from '../../hooks/useCategories'
import { useLocations } from '../../hooks/useLocations'

const TODAY = new Date().toISOString().slice(0, 10)

const EMPTY_FORM: FormValues = {
  type: 'lost',
  title: '',
  category_id: '',
  description: '',
  location_id: '',
  date_lost_found: TODAY,
  photos: [],
}

interface Props {
  initialValues?: Partial<FormValues>
  onSubmit: (form: FormValues) => void
  onCancel?: () => void
  submitLabel?: string
}

function ItemPostForm({ initialValues = {}, onSubmit, onCancel, submitLabel = 'Submit' }: Props) {
  const [form, setForm] = useState<FormValues>({ ...EMPTY_FORM, ...initialValues })
  const { data: categories = [] } = useCategories()
  const { data: locations = [] } = useLocations()

  const handleChange = (field: keyof FormValues) => (e: { target: { value: unknown } }) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormControl>
        <FormLabel>Post Type</FormLabel>
        <RadioGroup row value={form.type} onChange={handleChange('type')}>
          <FormControlLabel value="lost" control={<Radio />} label="Lost" />
          <FormControlLabel value="found" control={<Radio />} label="Found" />
        </RadioGroup>
      </FormControl>

      <TextField
        label="Title"
        value={form.title}
        onChange={handleChange('title')}
        required
        fullWidth
      />

      <FormControl fullWidth required>
        <InputLabel>Category</InputLabel>
        <Select
          value={form.category_id}
          onChange={handleChange('category_id')}
          label="Category"
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Description"
        value={form.description}
        onChange={handleChange('description')}
        multiline
        rows={4}
        fullWidth
        placeholder="Provide details that help identify the item (colour, brand, distinguishing marks...)"
      />

      <FormControl fullWidth required>
        <InputLabel>Location</InputLabel>
        <Select
          value={form.location_id}
          onChange={handleChange('location_id')}
          label="Location"
        >
          {locations.map((l) => (
            <MenuItem key={l.id} value={l.id}>
              {l.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Date Lost / Found"
        type="date"
        value={form.date_lost_found}
        onChange={handleChange('date_lost_found')}
        InputLabelProps={{ shrink: true }}
        required
        fullWidth
      />

      <Divider />
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Photos (optional)
        </Typography>
        <PhotoUpload
          photos={form.photos}
          onChange={(photos: Photo[]) => setForm((prev) => ({ ...prev, photos }))}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          {submitLabel}
        </Button>
      </Box>
    </Box>
  )
}

export default ItemPostForm
