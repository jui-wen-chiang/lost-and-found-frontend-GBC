import { useRef, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
} from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import { Photo } from 'src/types/item'

const MAX_FILES = 5
const MAX_SIZE_MB = 1
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface Props {
  photos?: Photo[]
  onChange: (photos: Photo[]) => void
  maxFiles?: number
}

/**
 * PhotoUpload – upload, preview, and remove images.
 */
function PhotoUpload({ photos = [], onChange, maxFiles = MAX_FILES }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return
    setError('')
    const remaining = maxFiles - photos.length
    if (remaining <= 0) {
      setError(`Maximum ${maxFiles} photos allowed.`)
      return
    }

    const valid: Photo[] = []
    Array.from(fileList)
      .slice(0, remaining)
      .forEach((file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError('Only JPG, PNG, and WEBP files are allowed.')
          return
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`Each file must be under ${MAX_SIZE_MB} MB.`)
          return
        }
        valid.push({
          id: `${Date.now()}-${Math.random()}`,
          url: URL.createObjectURL(file),
          file,
        })
      })

    if (valid.length) onChange([...photos, ...valid])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const handleRemove = (id: string | number) => {
    const updated = photos.filter((p) => p.id !== id)
    onChange(updated)
  }

  return (
    <Box>
      {/* Drop zone */}
      <Box
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'grey.400',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          cursor: photos.length >= maxFiles ? 'not-allowed' : 'pointer',
          bgcolor: dragOver ? 'primary.50' : 'grey.50',
          transition: 'all 0.2s',
          opacity: photos.length >= maxFiles ? 0.5 : 1,
        }}
      >
        <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'grey.500' }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Drag & drop photos here, or click to select
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Up to {maxFiles} images · Max {MAX_SIZE_MB} MB each · JPG, PNG, WEBP
        </Typography>
        <Button
          variant="outlined"
          size="small"
          disabled={photos.length >= maxFiles}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
        >
          Choose Photos
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          hidden
          onChange={handleInputChange}
        />
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      {/* Previews */}
      {photos.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
          {photos.map((photo, idx) => (
            <Box
              key={photo.id}
              sx={{
                position: 'relative',
                width: 90,
                height: 90,
                borderRadius: 1,
                overflow: 'hidden',
                border: idx === 0 ? '2px solid' : '1px solid',
                borderColor: idx === 0 ? 'primary.main' : 'grey.300',
              }}
            >
              <Box
                component="img"
                src={photo.url}
                alt={`upload-${idx}`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {idx === 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: 10,
                    textAlign: 'center',
                    py: 0.2,
                  }}
                >
                  Cover
                </Box>
              )}
              <IconButton
                size="small"
                onClick={() => handleRemove(photo.id)}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  bgcolor: 'rgba(0,0,0,0.55)',
                  color: 'white',
                  p: 0.3,
                  '&:hover': { bgcolor: 'error.main' },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}

      {photos.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {photos.length}/{maxFiles} photos · First photo is the cover image
        </Typography>
      )}
    </Box>
  )
}

export default PhotoUpload
