import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  QrCode2 as QrCode2Icon,
} from '@mui/icons-material'

interface QRCodeDisplayProps {
  /** The value encoded in the QR code (URL or unique ID string) */
  value: string
  /** Label shown below the QR code */
  label?: string
  /** Size of the QR code in pixels (default 180) */
  size?: number
  /** Show a "Full Screen" / "Download" dialog when clicked */
  expandable?: boolean
}

/**
 * QRCodeDisplay — FR-10: generates a unique QR code for physical item tracking.
 * Also used for FR-8 coupon QR codes.
 *
 * Pass `value` as the item's canonical URL (e.g. `https://app.example.com/items/42`)
 * or a unique identifier string.
 */
export default function QRCodeDisplay({
  value,
  label,
  size = 180,
  expandable = true,
}: QRCodeDisplayProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  function downloadSVG() {
    const svg = wrapperRef.current?.querySelector('svg')
    if (!svg) return
    const serialized = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([serialized], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${label ?? 'item'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          ref={wrapperRef}
          onClick={() => expandable && setOpen(true)}
          sx={{
            p: 1,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: '#fff',
            cursor: expandable ? 'pointer' : 'default',
            transition: 'box-shadow 0.15s',
            '&:hover': expandable ? { boxShadow: 3 } : undefined,
          }}
        >
          <QRCodeSVG value={value} size={size} level="M" marginSize={1} />
        </Box>
        {label && (
          <Typography variant="caption" color="text.secondary" textAlign="center">
            {label}
          </Typography>
        )}
        {expandable && (
          <Tooltip title="View full screen / download">
            <Button
              size="small"
              startIcon={<QrCode2Icon />}
              onClick={() => setOpen(true)}
              variant="outlined"
              sx={{ mt: 0.5 }}
            >
              View QR Code
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* Full-screen dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          QR Code{label ? ` — ${label}` : ''}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff',
              }}
            >
              <QRCodeSVG value={value} size={240} level="M" marginSize={2} />
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ wordBreak: 'break-all', px: 1 }}>
              {value}
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadSVG}
              fullWidth
            >
              Download SVG
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}


