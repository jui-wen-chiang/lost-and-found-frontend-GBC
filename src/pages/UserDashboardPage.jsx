import { Button, Container, Grid, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function UserDashboardPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>My Posts</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View and manage your lost & found reports
            </Typography>
            <Button variant="contained" onClick={() => navigate('/my-posts')}>
              View My Posts
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Appointments</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Check your scheduled pickup appointments
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/appointments')}>
              View Appointments
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Report an Item</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Submit a new lost or found item report
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/items/new')}>
              Report Item
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Coupons</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View your available reward coupons
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/coupons')}>
              View Coupons
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserDashboardPage
