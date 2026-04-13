import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

import { LoginPage } from './LoginPage';

// Mock the hook so the component tests focus on UI behaviour only.
// The hook is tested exhaustively in useLoginForm.test.ts.
vi.mock('@/features/auth/hooks/useLoginForm', () => ({
  useLoginForm: vi.fn(),
}));

const mockUseLoginForm = vi.mocked(useLoginForm);

function makeHookReturn(
  overrides: Partial<ReturnType<typeof useLoginForm>> = {},
): ReturnType<typeof useLoginForm> {
  return {
    email: '',
    password: '',
    isLoading: false,
    emailError: null,
    passwordError: null,
    error: null,
    handleEmailChange: vi.fn(),
    handlePasswordChange: vi.fn(),
    handleSubmit: vi.fn(),
    ...overrides,
  };
}

describe('LoginPage', () => {
  it('renders email field, password field, and submit button', () => {
    mockUseLoginForm.mockReturnValue(makeHookReturn());

    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('calls handleEmailChange when the user types in the email field', async () => {
    const handleEmailChange = vi.fn();
    mockUseLoginForm.mockReturnValue(makeHookReturn({ handleEmailChange }));

    render(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');

    expect(handleEmailChange).toHaveBeenCalled();
  });

  it('calls handlePasswordChange when the user types in the password field', async () => {
    const handlePasswordChange = vi.fn();
    mockUseLoginForm.mockReturnValue(makeHookReturn({ handlePasswordChange }));

    render(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/password/i), 'secret');

    expect(handlePasswordChange).toHaveBeenCalled();
  });

  it('calls handleSubmit when the form is submitted', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    mockUseLoginForm.mockReturnValue(makeHookReturn({ handleSubmit }));

    render(<LoginPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  it('submits the form when the user presses Enter in the password field', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    mockUseLoginForm.mockReturnValue(makeHookReturn({ handleSubmit }));

    render(<LoginPage />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText(/password/i));
    await user.keyboard('{Enter}');

    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  it('disables the button and shows a loading state while isLoading is true', () => {
    mockUseLoginForm.mockReturnValue(makeHookReturn({ isLoading: true }));

    render(<LoginPage />);

    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeDisabled();
  });

  it('shows an inline alert when an API-level error is set', () => {
    mockUseLoginForm.mockReturnValue(
      makeHookReturn({ error: 'Invalid email or password.' }),
    );

    render(<LoginPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid email or password.',
    );
  });

  it('does not show an alert when error is null', () => {
    mockUseLoginForm.mockReturnValue(makeHookReturn({ error: null }));

    render(<LoginPage />);

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('email field shows its inline error when emailError is set', () => {
    mockUseLoginForm.mockReturnValue(
      makeHookReturn({ emailError: 'Email is required.' }),
    );

    render(<LoginPage />);

    // The Input component renders the error inside the label group, associated
    // via aria-describedby — getByText finds it without needing a role query.
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('password field shows its inline error when passwordError is set', () => {
    mockUseLoginForm.mockReturnValue(
      makeHookReturn({ passwordError: 'Password is required.' }),
    );

    render(<LoginPage />);

    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('password field has type="password" so characters are masked', () => {
    mockUseLoginForm.mockReturnValue(makeHookReturn());

    render(<LoginPage />);

    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      'type',
      'password',
    );
  });

  it('all form fields and button are keyboard-accessible', () => {
    mockUseLoginForm.mockReturnValue(makeHookReturn());

    render(<LoginPage />);

    // Interactive elements must have accessible names — verified by getByLabelText
    // and getByRole with a name matcher (both fail if ARIA is broken).
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
