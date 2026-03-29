import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  ExpandMore as ExpandMoreIcon,
  FindInPage as LogoIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

// ─── Link definitions ─────────────────────────────────────────────────────────

const USER_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Report Item', to: '/items/new' },
  { label: 'My Posts', to: '/my-posts' },
  { label: 'My Claims', to: '/claims' },
  { label: 'Appointments', to: '/appointments' },
  { label: 'Coupons', to: '/coupons' },
]

const GUEST_LINKS = [{ label: 'Home', to: '/' }]

const ADMIN_MENU_ITEMS = [
  { label: 'Admin Dashboard', to: '/admin' },
  { label: 'Audit Queue', to: '/admin/audit' },
  { label: 'Claims', to: '/admin/claims' },
  { label: 'Appointments', to: '/admin/appointments' },
  { label: 'Reports', to: '/admin/reports' },
  { label: 'User Roles (IAM)', to: '/admin/iam' },
  { label: 'Post Verification', to: '/admin/verify' },
]

// ─── NavBar ───────────────────────────────────────────────────────────────────

function NavBar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Admin dropdown
  const [adminAnchor, setAdminAnchor] = useState<null | HTMLElement>(null)
  // User avatar menu
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null)

  const navLinks = isAuthenticated ? USER_LINKS : GUEST_LINKS
  const allDrawerLinks = [
    ...navLinks,
    ...(isAdmin ? ADMIN_MENU_ITEMS : []),
  ]

  async function handleLogout() {
    setUserAnchor(null)
    await logout()
    navigate('/login')
  }

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 0.5 }}>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1} component={NavLink} to="/" sx={{ textDecoration: 'none', color: 'inherit', mr: 3 }}>
            <LogoIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              Lost &amp; Found
            </Typography>
          </Stack>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
            {navLinks.map(({ label, to }) => (
              <Button
                key={to}
                component={NavLink}
                to={to}
                end={to === '/'}
                size="small"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&.active': { color: 'primary.main', fontWeight: 700 },
                }}
              >
                {label}
              </Button>
            ))}

            {/* Admin dropdown */}
            {isAdmin && (
              <>
                <Button
                  size="small"
                  startIcon={<AdminIcon />}
                  endIcon={<ExpandMoreIcon />}
                  onClick={(e) => setAdminAnchor(e.currentTarget)}
                  color={adminAnchor ? 'primary' : 'inherit'}
                  sx={{ fontWeight: 500, color: adminAnchor ? 'primary.main' : 'text.secondary' }}
                >
                  Admin
                </Button>
                <Menu
                  anchorEl={adminAnchor}
                  open={Boolean(adminAnchor)}
                  onClose={() => setAdminAnchor(null)}
                  slotProps={{ paper: { elevation: 2, sx: { mt: 1, minWidth: 200, borderRadius: 2 } } }}
                >
                  {ADMIN_MENU_ITEMS.map(({ label, to }) => (
                    <MenuItem
                      key={to}
                      onClick={() => { setAdminAnchor(null); navigate(to) }}
                      dense
                    >
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          {/* Right side — guest: Login/Register, auth: avatar menu */}
          {!isAuthenticated ? (
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="outlined" size="small" component={NavLink} to="/login">Login</Button>
              <Button variant="contained" size="small" component={NavLink} to="/register">Register</Button>
            </Stack>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Tooltip title={user?.full_name || user?.email || 'Account'}>
                <IconButton onClick={(e) => setUserAnchor(e.currentTarget)} size="small">
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.85rem', bgcolor: isAdmin ? 'secondary.main' : 'primary.main' }}>
                    {user?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={userAnchor}
                open={Boolean(userAnchor)}
                onClose={() => setUserAnchor(null)}
                slotProps={{ paper: { elevation: 2, sx: { mt: 1, minWidth: 200, borderRadius: 2 } } }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  {user?.full_name && (
                    <Typography variant="body2" fontWeight={600} noWrap>{user.full_name}</Typography>
                  )}
                  <Typography variant="body2" color={user?.full_name ? 'text.secondary' : undefined} fontWeight={user?.full_name ? undefined : 600} noWrap>{user?.email}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{user?.role}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout} dense>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { md: 'none' }, ml: 0.5 }}
            onClick={() => setDrawerOpen(true)}
            aria-label="open navigation"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }} role="presentation">
          <Typography variant="subtitle2" fontWeight={700} sx={{ px: 2, pb: 1 }}>Navigation</Typography>
          <Divider />
          <List dense>
            {allDrawerLinks.map(({ label, to }) => (
              <ListItemButton
                key={to}
                component={NavLink}
                to={to}
                end={to === '/'}
                onClick={() => setDrawerOpen(false)}
                sx={{ '&.active': { color: 'primary.main', bgcolor: 'primary.50', fontWeight: 700 } }}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          {!isAuthenticated ? (
            <Stack spacing={1} sx={{ p: 2 }}>
              <Button variant="outlined" fullWidth component={NavLink} to="/login" onClick={() => setDrawerOpen(false)}>Login</Button>
              <Button variant="contained" fullWidth component={NavLink} to="/register" onClick={() => setDrawerOpen(false)}>Register</Button>
            </Stack>
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>{user?.email}</Typography>
              <Button variant="outlined" color="error" fullWidth startIcon={<LogoutIcon />} onClick={handleLogout} size="small">
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default NavBar
