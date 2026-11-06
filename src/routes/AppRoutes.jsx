import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// Auth Pages (Driver Login, Registration, Password Recovery & Location Permission)
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import LocationPermission from '../pages/auth/LocationPermission';

// Driver Onboarding Steps (Profile details & Primary vehicle registration)
import DriverProfileOnboarding from '../pages/onboarding/DriverProfileOnboarding';
import VehicleOnboarding from '../pages/onboarding/VehicleOnboarding';

// Driver Pages (Exclusively for Drivers)
import Dashboard from '../pages/dashboard/Dashboard';
import Explore from '../pages/explore/Explore';
import ParkingDetails from '../pages/parking/ParkingDetails';
import Sessions from '../pages/sessions/Sessions';
import SessionDetails from '../pages/sessions/SessionDetails';
import ParkingHistory from '../pages/history/ParkingHistory';
import Vehicles from '../pages/vehicles/Vehicles';
import Payments from '../pages/payments/Payments';
import Checkout from '../pages/payments/Checkout';
import PaymentResult from '../pages/payments/PaymentResult';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import HelpSupport from '../pages/support/HelpSupport';

// Errors
import NotFound from '../pages/errors/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/location-permission" element={<LocationPermission />} />
      <Route
        path="/onboarding/profile"
        element={
          <ProtectedRoute>
            <DriverProfileOnboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/vehicle"
        element={
          <ProtectedRoute>
            <VehicleOnboarding />
          </ProtectedRoute>
        }
      />

      {/* Driver-Only Authenticated Application */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Dashboard />} />
        <Route path="explore" element={<Explore />} />
        <Route path="parking/:locationId" element={<ParkingDetails />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="sessions/:sessionId" element={<SessionDetails />} />
        <Route path="parking-history" element={<ParkingHistory />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="payments" element={<Payments />} />
        <Route path="checkout/:locationId" element={<Checkout />} />
        <Route path="payment-result" element={<PaymentResult />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/*" element={<Settings />} />
        <Route path="support" element={<HelpSupport />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
