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
import UserDashboardPage from './pages/UserDashboardPage'
import ClaimRequestPage from './pages/ClaimRequestPage'
import MyClaimsPage from './pages/MyClaimsPage'


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        
        <Route path="/" element={<HomePage />} />
        <Route path="/items/new" element={<ReportItemPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/my-posts/:id/edit" element={<EditPostPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/claims" element={<MyClaimsPage />} />
        <Route path="/claims/new/:itemId" element={<ClaimRequestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
