import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Inventory2 as InventoryIcon,
  PendingActions as PendingIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ─── Mock data (replace with API calls when backend is ready) ─────────────────

const STATS = [
  { label: 'Total Items', value: 142, icon: <InventoryIcon />, color: '#1976d2' },
  { label: 'Pending Audits', value: 8, icon: <PendingIcon />, color: '#ed6c02' },
  { label: 'Pending Appointments', value: 5, icon: <CalendarIcon />, color: '#9c27b0' },
  { label: 'Unclaimed Items', value: 34, icon: <WarningIcon />, color: '#d32f2f' },
  { label: 'Resolved Today', value: 12, icon: <CheckCircleIcon />, color: '#2e7d32' },
  { label: 'Active Reports', value: 27, icon: <TrendingUpIcon />, color: '#0288d1' },
]

const CATEGORY_DATA = [
  { name: 'Electronics', count: 38 },
  { name: 'Clothing', count: 25 },
  { name: 'ID / Cards', count: 19 },
  { name: 'Bags', count: 22 },
  { name: 'Keys', count: 16 },
  { name: 'Other', count: 22 },
]

const STATUS_DATA = [
  { name: 'Lost', value: 58 },
  { name: 'Found', value: 50 },
  { name: 'Claimed', value: 21 },
  { name: 'Returned', value: 13 },
]

const CAMPUS_DATA = [
  { campus: 'Waterfront', lost: 24, found: 18 },
  { campus: 'North', lost: 18, found: 15 },
  { campus: 'Downtown', lost: 16, found: 17 },
]

const QUICK_ACTIONS = [
  { label: 'Review Pending Audits', sublabel: '8 posts awaiting review', path: '/admin/audit', color: 'warning' as const },
  { label: 'Manage Appointments', sublabel: '5 appointments pending', path: '/admin/appointments', color: 'secondary' as const },
  { label: 'Unclaimed Report', sublabel: 'Export & filter unclaimed items', path: '/admin/reports', color: 'error' as const },
  { label: 'User Roles (IAM)', sublabel: 'Manage user permissions', path: '/admin/iam', color: 'primary' as const },
]

const STATUS_COLORS = ['#1976d2', '#2e7d32', '#9c27b0', '#ed6c02']

// ─── Component ────────────────────────────────────────────────────────────────

function AdminDashboardPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
        <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>Admin Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of all system activity
          </Typography>
        </Box>
      </Stack>

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} mb={4}>
        {STATS.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Stack spacing={1}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: stat.color + '18',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight={700} sx={{ p: 0, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* ── Quick Action Panel ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {QUICK_ACTIONS.map((action) => (
                  <Paper
                    key={action.label}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {action.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {action.sublabel}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Category Distribution Chart ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Items by Category
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={CATEGORY_DATA} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} name="Items" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Status Distribution Pie ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Status Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {STATUS_DATA.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Campus Distribution Chart ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Items by Campus
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={CAMPUS_DATA} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="campus" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lost" fill="#d32f2f" radius={[4, 4, 0, 0]} name="Lost" />
                  <Bar dataKey="found" fill="#2e7d32" radius={[4, 4, 0, 0]} name="Found" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminDashboardPage
