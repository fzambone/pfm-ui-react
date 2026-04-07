import { createContext } from 'react';

import { type AuthContextValue } from './types';

// Starts as null — useAuth enforces that consumers are inside a provider.
export const AuthContext = createContext<AuthContextValue | null>(null);
