import { Navigate, Route, Routes } from 'react-router';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicRoute } from '@/features/auth/components/PublicRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { HouseholdsPage } from '@/pages/HouseholdsPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AppLayout } from '@/shared/components/AppLayout';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

/*
 * App — route configuration with layout wrapper and error boundaries.
 *
 * ProtectedRoute guards all internal pages — unauthenticated users are
 * redirected to /login before reaching any child route.
 *
 * PublicRoute guards /login — authenticated users are redirected to /dashboard
 * so they cannot reach the login page while already signed in.
 */
function App(): React.ReactElement {
  return (
    <Routes>
      {/* Public routes — accessible only when unauthenticated */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes — require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary>
                <DashboardPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/households"
            element={
              <ErrorBoundary>
                <HouseholdsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/settings"
            element={
              <ErrorBoundary>
                <SettingsPage />
              </ErrorBoundary>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
