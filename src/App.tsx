import { Navigate, Route, Routes } from 'react-router';

import { DashboardPage } from '@/pages/DashboardPage';
import { HouseholdsPage } from '@/pages/HouseholdsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SettingsPage } from '@/pages/SettingsPage';

/*
 * App — the route configuration (composition root for routing).
 *
 * React Router v7 uses <Routes> and <Route> for declarative routing.
 * Each <Route> maps a URL path to a component. When the URL matches,
 * that component renders — no full page reload.
 *
 * <Navigate> on "/" redirects to /dashboard so the root URL has content.
 * The "*" catch-all route handles 404s.
 *
 * The BrowserRouter wrapper lives in main.tsx — App just defines routes.
 * This separation lets tests use MemoryRouter instead of BrowserRouter.
 */
function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/households" element={<HouseholdsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
