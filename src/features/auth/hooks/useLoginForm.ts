import { useState } from 'react';
import { useNavigate } from 'react-router';

import { callLogin, LoginError } from '../api/login';
import { useAuth } from '../useAuth';

interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  /** Field-level error on the email input — shown inline via the Input component. */
  emailError: string | null;
  /** Field-level error on the password input — shown inline via the Input component. */
  passwordError: string | null;
  /** API-level error (invalid credentials, network failure) — shown as a global alert. */
  error: string | null;
}

export interface UseLoginFormReturn extends LoginFormState {
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handleSubmit: () => Promise<void>;
}

/**
 * Manages the login form: field state, validation, API call, and navigation.
 * The component stays as a thin UI shell — all business logic lives here.
 *
 * Hook composition note: useNavigate reads the React Router context so this
 * hook must be used inside a component that is a descendant of a Router.
 */
export function useLoginForm(): UseLoginFormReturn {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: '',
    isLoading: false,
    emailError: null,
    passwordError: null,
    error: null,
  });

  const handleEmailChange = (value: string): void => {
    setState((prev) => ({ ...prev, email: value, emailError: null, error: null }));
  };

  const handlePasswordChange = (value: string): void => {
    setState((prev) => ({ ...prev, password: value, passwordError: null, error: null }));
  };

  const handleSubmit = async (): Promise<void> => {
    // Client-side validation — prevents unnecessary API calls.
    if (!state.email.trim()) {
      setState((prev) => ({ ...prev, emailError: 'Email is required.', passwordError: null, error: null }));
      return;
    }
    if (!state.password) {
      setState((prev) => ({ ...prev, passwordError: 'Password is required.', emailError: null, error: null }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, emailError: null, passwordError: null, error: null }));

    try {
      const { token, expiresAt } = await callLogin(state.email, state.password);
      login(token, expiresAt);
      // replace: true so the login page is not in the back-stack after login.
      await navigate('/dashboard', { replace: true });
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      const message =
        error instanceof LoginError && error.status === 401
          ? 'Invalid email or password.'
          : 'Something went wrong, please try again.';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  };

  return {
    ...state,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
}
