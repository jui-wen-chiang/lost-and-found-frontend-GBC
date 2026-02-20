import { NavLink } from 'react-router-dom'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Report Item', to: '/items/new' },
  { label: 'My Posts', to: '/my-posts' },
  { label: 'Appointments', to: '/appointments' },
  { label: 'Coupons', to: '/coupons' },
]

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
        Lost & Found
      </NavLink>

      {LINKS.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default NavBar
