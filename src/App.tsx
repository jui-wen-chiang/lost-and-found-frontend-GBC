import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import HomePage from './pages/HomePage'
import ItemDetailPage from './pages/ItemDetailPage'
import ReportItemPage from './pages/ReportItemPage'
import MyPostsPage from './pages/MyPostsPage'
import EditPostPage from './pages/EditPostPage'
import AppointmentsPage from './pages/AppointmentsPage'
import CouponsPage from './pages/CouponsPage'
import CouponScanPage from './pages/CouponScanPage'
import CouponInstructionsPage from './pages/CouponInstructionsPage'
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
import AdminClaimsPage from './pages/admin/AdminClaimsPage'
import ReportsPage from './pages/admin/ReportsPage'
import IamPage from './pages/admin/IamPage'
import PostVerificationPage from './pages/admin/PostVerificationPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Authenticated user routes */}
        <Route path="/items/new" element={<ProtectedRoute><ReportItemPage /></ProtectedRoute>} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/my-posts" element={<ProtectedRoute><MyPostsPage /></ProtectedRoute>} />
        <Route path="/my-posts/:id/edit" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/home" element={<ProtectedRoute><DashboardHomePage /></ProtectedRoute>} />
        <Route path="/dashboard/lost" element={<ProtectedRoute><MyLostReportsPage /></ProtectedRoute>} />
        <Route path="/dashboard/found" element={<ProtectedRoute><MyFoundReportsPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/coupons" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
        <Route path="/coupons/instructions" element={<ProtectedRoute><CouponInstructionsPage /></ProtectedRoute>} />
        <Route path="/coupons/:id/scan" element={<ProtectedRoute><CouponScanPage /></ProtectedRoute>} />
        <Route path="/claims" element={<ProtectedRoute><MyClaimsPage /></ProtectedRoute>} />
        <Route path="/claims/new/:itemId" element={<ProtectedRoute><ClaimRequestPage /></ProtectedRoute>} />
        <Route path="/appointments/schedule/:itemId" element={<ProtectedRoute><AppointmentSchedulerPage /></ProtectedRoute>} />
        <Route path="/appointments/confirm" element={<ProtectedRoute><AppointmentConfirmationPage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/audit" element={<ProtectedRoute requiredRole="admin"><AdminAuditQueuePage /></ProtectedRoute>} />
        <Route path="/admin/audit/:id" element={<ProtectedRoute requiredRole="admin"><AdminAuditDetailPage /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute requiredRole="admin"><AdminAppointmentsPage /></ProtectedRoute>} />
        <Route path="/admin/claims" element={<ProtectedRoute requiredRole="admin"><AdminClaimsPage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><ReportsPage /></ProtectedRoute>} />
        <Route path="/admin/iam" element={<ProtectedRoute requiredRole="admin"><IamPage /></ProtectedRoute>} />
        <Route path="/admin/verify" element={<ProtectedRoute requiredRole="admin"><PostVerificationPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App