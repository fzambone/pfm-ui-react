import { useContext } from 'react';

import { AuthContext } from './AuthContext';
import { type AuthContextValue } from './types';

/**
 * Returns the current auth state and login/logout actions.
 * Must be called inside a component that is a descendant of AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
