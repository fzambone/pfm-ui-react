import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';

/**
 * LoginPage — entry point for unauthenticated users.
 *
 * This is a thin UI shell: all form state and submit logic live in
 * useLoginForm(). The component's only job is to render and wire up events.
 *
 * Design note: this page sits outside AppLayout (no sidebar/nav) because
 * unauthenticated users should see only the login form, not the app shell.
 */
export function LoginPage(): React.ReactElement {
  const {
    email,
    password,
    isLoading,
    emailError,
    passwordError,
    error,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useLoginForm();

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void handleSubmit();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="text-sm text-foreground-muted">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { handleEmailChange(e.target.value); }}
            disabled={isLoading}
            hasError={emailError !== null}
            {...(emailError !== null && { errorMessage: emailError })}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { handlePasswordChange(e.target.value); }}
            disabled={isLoading}
            hasError={passwordError !== null}
            {...(passwordError !== null && { errorMessage: passwordError })}
          />

          {/* API-level error (invalid credentials, network failure) — role="alert"
              announces to screen readers immediately on render. Field-level errors
              are surfaced via each Input's errorMessage prop instead (aria-describedby). */}
          {error !== null && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
