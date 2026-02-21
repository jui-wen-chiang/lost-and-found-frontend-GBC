import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkStyle = {
  textDecoration: 'none',
  color: '#555',
  fontSize: '0.875rem',
}

const activeLinkStyle = {
  ...linkStyle,
  color: '#000',
  fontWeight: 600,
  textDecoration: 'underline',
}

function NavBar() {
  const { isAuthenticated, role, logout } = useAuth()

  const baseLinks = [{ label: 'Home', to: '/' }]

  const userLinks = [
    { label: 'Report Item', to: '/items/new' },
    { label: 'My Posts', to: '/my-posts' },
    { label: 'Appointments', to: '/appointments' },
    { label: 'Coupons', to: '/coupons' },
  ]

  // Optional (only if you actually have admin routes)
  const adminLinks = [
    { label: 'Admin Dashboard', to: '/admin' },
    // { label: 'Moderation', to: '/admin/moderation' },
    // { label: 'Reports', to: '/admin/reports' },
  ]

  let linksToShow = [...baseLinks]

  if (isAuthenticated) {
    linksToShow = [...linksToShow, ...userLinks]

    if (role === 'admin') {
      linksToShow = [...linksToShow, ...adminLinks]
    }
  }

  return (
    <nav
      style={{
        borderBottom: '1px solid #ddd',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
      }}
    >
      <NavLink to="/" style={{ textDecoration: 'none', color: '#000', fontWeight: 700, fontSize: '0.9rem' }}>
        Lost &amp; Found
      </NavLink>

      {linksToShow.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
        >
          {label}
        </NavLink>
      ))}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
        {!isAuthenticated ? (
          <>
            <NavLink to="/login" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
              Login
            </NavLink>
            <NavLink to="/register" style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}>
              Register
            </NavLink>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              border: '1px solid #ddd',
              background: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default NavBar
