import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetailPage from "./pages/EventDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import RegisterEventPage from "./pages/RegisterEventPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminEventUsersPage from "./pages/AdminEventUsersPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/register/:id" element={<RegisterEventPage />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route
              path="/resetpassword/:resetToken"
              element={<ResetPasswordPage />}
            />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/create-event"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditEventPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/event/:id/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminEventUsersPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="flex min-h-[60vh] items-center justify-center text-xl font-semibold text-gray-600">
                  404 | Page Not Found
                </div>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
