import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

/**
 * Root Application Component
 * Providers hierarchy:
 * 1. ErrorBoundary - Top-level error containment preventing white screen crashes
 * 2. BrowserRouter - Client-side routing context for the entire application
 * 3. ThemeProvider - Application-wide light/dark/system theme state
 * 4. AuthProvider - Driver authentication, session storage, and 5-driver demo state
 * 5. NotificationProvider - Live alerts, toasts, camera status, and receipt banners
 * 6. AppRoutes - Route declarations and protected view routing
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
