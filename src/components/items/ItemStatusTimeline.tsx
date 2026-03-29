import { Box, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

interface ItemStatusTimelineProps {
  /** Item status string from the API / mock data */
  status: string
  /** 'lost' or 'found' — determines which step labels to show */
  itemType?: string
  /** If true, renders the timeline in error/expired state */
  expired?: boolean
}

const STEPS_FOUND = [
  { label: 'Reported', desc: 'Found item posted to the system' },
  { label: 'Verified', desc: 'Listing reviewed & approved' },
  { label: 'Claimed', desc: 'Owner submitted a claim' },
  { label: 'Returned', desc: 'Item returned to its owner' },
]

const STEPS_LOST = [
  { label: 'Reported', desc: 'Lost item posted to the system' },
  { label: 'Verified', desc: 'Listing reviewed & approved' },
  { label: 'Match Found', desc: 'A finder has been in contact' },
  { label: 'Reunited', desc: 'Item successfully retrieved' },
]

/**
 * Derives the Stepper activeStep and the step index that should display
 * an error state (–1 = none).
 *
 * MUI Stepper convention: steps with index < activeStep are "completed";
 * the step at index === activeStep is "active".
 */
function deriveStepState(status: string, expired: boolean, steps: typeof STEPS_FOUND): { activeStep: number; errorStep: number } {
  if (expired) {
    // Stuck after Verified — step 2 shows error
    return { activeStep: 2, errorStep: 2 }
  }
  switch (status) {
    case 'pending':  return { activeStep: 1, errorStep: -1 } // Reported active
    case 'approved': return { activeStep: 2, errorStep: -1 } // Verified done, next step upcoming
    case 'claimed':  return { activeStep: 3, errorStep: -1 } // Claimed/Match done, last step active
    case 'completed':
    case 'resolved': return { activeStep: steps.length, errorStep: -1 } // all complete
    default:         return { activeStep: 0, errorStep: -1 }
  }
}

export default function ItemStatusTimeline({ status, itemType = 'found', expired = false }: ItemStatusTimelineProps) {
  const steps = itemType === 'lost' ? STEPS_LOST : STEPS_FOUND
  const { activeStep, errorStep } = deriveStepState(status, expired, steps)

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        Item Status Timeline
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          borderRadius: 2,
          bgcolor: expired ? 'warning.50' : 'grey.50',
          borderColor: expired ? 'warning.main' : 'divider',
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, i) => {
            const isErr = i === errorStep
            return (
              <Step key={step.label} completed={i < activeStep && !isErr}>
                <StepLabel
                  error={isErr}
                  optional={
                    <Typography
                      variant="caption"
                      color={isErr ? 'error' : 'text.disabled'}
                      textAlign="center"
                      display="block"
                      sx={{ lineHeight: 1.3 }}
                    >
                      {isErr ? 'No claim filed' : step.desc}
                    </Typography>
                  }
                >
                  {step.label}
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>

        {expired && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
            }}
          >
            <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 17 }} />
            <Typography variant="caption" color="warning.dark" fontWeight={500}>
              This item has been unclaimed for over 30 days and is now expired.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
