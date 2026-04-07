import { Navigate, Route, Routes } from 'react-router';

import { DashboardPage } from '@/pages/DashboardPage';
import { HouseholdsPage } from '@/pages/HouseholdsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AppLayout } from '@/shared/components/AppLayout';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

/*
 * App — route configuration with layout wrapper and error boundaries.
 *
 * Each feature route is wrapped in its own ErrorBoundary so a crash
 * in one feature (e.g., Households) doesn't take down the sidebar
 * or other features. The layout shell remains functional.
 */
function App(): React.ReactElement {
  return (
    <Routes>
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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
