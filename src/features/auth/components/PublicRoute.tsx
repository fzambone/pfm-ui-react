import { Navigate, Outlet } from 'react-router';

import { useAuth } from '../useAuth';

/**
 * Wraps routes that should only be accessible to unauthenticated users
 * (e.g. /login).
 *
 * If the user is already authenticated, they are redirected to /dashboard —
 * there is no reason to show the login page to someone who is already logged in.
 */
export function PublicRoute(): React.ReactElement {
  const { state } = useAuth();

  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
