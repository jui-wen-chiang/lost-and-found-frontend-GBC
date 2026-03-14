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

export const CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Accessories' },
  { id: 4, name: 'Books & Documents' },
  { id: 5, name: 'Keys' },
  { id: 6, name: 'Bags' },
  { id: 7, name: 'Other' },
]

export const LOCATIONS = [
  { id: 1, campus_name: 'Casa Loma', building: 'Building A', room_area: 'Lobby' },
  { id: 2, campus_name: 'Casa Loma', building: 'Building B', room_area: 'Cafeteria' },
  { id: 3, campus_name: 'St. James', building: 'Building A', room_area: 'Library' },
  { id: 4, campus_name: 'St. James', building: 'Building B', room_area: 'Gym' },
  { id: 5, campus_name: 'Waterfront', building: 'Building A', room_area: 'Main Hall' },
]

const EMPTY_FORM = {
  type: 'lost',
  title: '',
  category_id: '',
  description: '',
  location_id: '',
  date_lost_found: '',
  photos: [],
}

function ItemPostForm({ initialValues = {}, onSubmit, onCancel, submitLabel = 'Submit' }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
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
          {CATEGORIES.map((c) => (
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
          {LOCATIONS.map((l) => (
            <MenuItem key={l.id} value={l.id}>
              {l.campus_name} — {l.building}, {l.room_area}
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
          onChange={(photos) => setForm((prev) => ({ ...prev, photos }))}
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
