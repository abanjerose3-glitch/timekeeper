import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/dashboard/Dashboard";
import Employees from "./pages/employees/Employees";
import Attendance from "./pages/attendance/Attendance";
import AdminAdjustmentRequests from "./pages/attendance/AdminAdjustmentRequests";
import TimeClock from "./pages/timeclock/TimeClock";
import Availability from "./pages/availability/Availability";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import AdminRoute from "./components/routes/AdminRoute";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <Routes>

<Route path="/login" element={<Login />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

<Route
  path="/employees"
  element={
    <AdminRoute>
      <Employees />
    </AdminRoute>
  }
/>

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />

<Route
  path="/attendance/adjustments"
  element={
    <AdminRoute>
      <AdminAdjustmentRequests />
    </AdminRoute>
  }
/>

      <Route
        path="/time-clock"
        element={
          <ProtectedRoute>
            <TimeClock />
          </ProtectedRoute>
        }
      />

      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <Availability />
          </ProtectedRoute>
        }
      />

<Route
  path="/reports"
  element={
    <AdminRoute>
      <Reports />
    </AdminRoute>
  }
/>

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

<Route
  path="*"
  element={<NotFound />}
/>

    </Routes>
  );
}

export default App;