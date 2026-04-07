import { Navigate, Route, Routes } from 'react-router';

import { DashboardPage } from '@/pages/DashboardPage';
import { HouseholdsPage } from '@/pages/HouseholdsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AppLayout } from '@/shared/components/AppLayout';

/*
 * App — route configuration with layout wrapper.
 *
 * The AppLayout route has no `path` — it wraps all child routes.
 * Its <Outlet> renders whichever child route matches.
 * This is React Router's "layout route" pattern.
 */
function App(): React.ReactElement {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/households" element={<HouseholdsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
