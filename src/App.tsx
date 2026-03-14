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
import AppointmentSchedulerPage from './pages/AppointmentSchedulerPage'
import AppointmentConfirmationPage from './pages/AppointmentConfirmationPage'
import AdminAuditQueuePage from './pages/AdminAuditQueuePage'
import AdminAuditDetailPage from './pages/AdminAuditDetailPage'

// Personal Dashboard
import DashboardHomePage from './pages/DashboardHomePage'
import MyLostReportsPage from './pages/MyLostReportsPage'
import MyFoundReportsPage from './pages/MyFoundReportsPage'

// Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage'
import ReportsPage from './pages/admin/ReportsPage'
import IamPage from './pages/admin/IamPage'
import PostVerificationPage from './pages/admin/PostVerificationPage'

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
        <Route path="/dashboard/lost" element={<MyLostReportsPage />} />
        <Route path="/dashboard/found" element={<MyFoundReportsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/claims" element={<MyClaimsPage />} />
        <Route path="/claims/new/:itemId" element={<ClaimRequestPage />} />
        <Route path="/appointments/schedule/:itemId" element={<AppointmentSchedulerPage />} />
        <Route path="/appointments/confirm" element={<AppointmentConfirmationPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/audit" element={<AdminAuditQueuePage />} />
        <Route path="/admin/audit/:id" element={<AdminAuditDetailPage />} />
        <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/iam" element={<IamPage />} />
        <Route path="/admin/verify" element={<PostVerificationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App