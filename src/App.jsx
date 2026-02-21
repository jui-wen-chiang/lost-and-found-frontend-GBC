import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ItemDetailPage from './pages/ItemDetailPage'
import ReportItemPage from './pages/ReportItemPage'
import MyPostsPage from './pages/MyPostsPage'
import EditPostPage from './pages/EditPostPage'
import AppointmentsPage from './pages/AppointmentsPage'
import CouponsPage from './pages/CouponsPage'

// ✅ Added for Personal Dashboard (Person C - FR-7)
import DashboardHomePage from './pages/DashboardHomePage'
import MyLostReportsPage from './pages/MyLostReportsPage'
import MyFoundReportsPage from './pages/MyFoundReportsPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ padding: 8, background: "yellow" }}>APP ROUTES UPDATED ✅</div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/items/new" element={<ReportItemPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/my-posts/:id/edit" element={<EditPostPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/dashboard" element={<DashboardHomePage />} />
        <Route path="/dashboard/lost" element={<MyLostReportsPage />} />
        <Route path="/dashboard/found" element={<MyFoundReportsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App