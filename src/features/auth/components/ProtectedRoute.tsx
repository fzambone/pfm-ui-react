import { Navigate, Outlet } from 'react-router';

import { useAuth } from '../useAuth';

/**
 * Wraps routes that require authentication.
 *
 * React Router note: this component uses <Outlet /> as the rendering slot for
 * child routes, rather than accepting a `children` prop. This is the idiomatic
 * pattern for layout/guard routes in React Router v6+ — the guard sits between
 * the parent <Route> and its children in the route tree.
 *
 * If unauthenticated, <Navigate replace /> replaces the current history entry
 * so the browser back button doesn't loop the user back to the protected route.
 */
export function ProtectedRoute(): React.ReactElement {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
