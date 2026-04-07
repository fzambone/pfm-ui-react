import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from './ErrorBoundary';

// A component that throws during render — used to trigger the error boundary
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test render error');
  }
  return <div>Normal content</div>;
}

// Suppress React's console.error for expected error boundary triggers
const originalConsoleError = console.error;
function suppressReactErrorLogs(): void {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('Error: Uncaught') ||
      msg.includes('The above error occurred') ||
      msg.includes('Error Boundary')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

function restoreConsoleError(): void {
  console.error = originalConsoleError;
}

describe('ErrorBoundary', () => {
  // --- Normal rendering ---

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  // --- Error catching ---

  it('displays fallback UI when a child throws during render', () => {
    suppressReactErrorLogs();
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );
    restoreConsoleError();

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('shows a "Try again" button in the fallback', () => {
    suppressReactErrorLogs();
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );
    restoreConsoleError();

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it('uses Typography and Button from the design system in fallback', () => {
    suppressReactErrorLogs();
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );
    restoreConsoleError();

    // Heading should use design system typography classes
    const heading = screen.getByText(/something went wrong/i);
    expect(heading).toBeInTheDocument();

    // Button should be present
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  // --- Recovery ---

  it('resets and re-renders children when "Try again" is clicked', async () => {
    suppressReactErrorLogs();
    const user = userEvent.setup();

    let shouldThrow = true;
    function ConditionalThrower() {
      if (shouldThrow) {
        throw new Error('Conditional error');
      }
      return <div>Recovered content</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>,
    );
    restoreConsoleError();

    // Should show fallback
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Fix the error condition
    shouldThrow = false;

    // Click try again
    await user.click(screen.getByRole('button', { name: /try again/i }));

    // Should recover
    expect(screen.getByText('Recovered content')).toBeInTheDocument();
  });

  // --- Isolation ---

  it('does not affect sibling components when an error occurs', () => {
    suppressReactErrorLogs();
    render(
      <div>
        <div data-testid="sibling">Sibling is fine</div>
        <ErrorBoundary>
          <ThrowingComponent shouldThrow />
        </ErrorBoundary>
      </div>,
    );
    restoreConsoleError();

    // Sibling should still be rendered
    expect(screen.getByTestId('sibling')).toBeInTheDocument();
    // Error boundary shows fallback
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  // --- Custom onError callback ---

  it('calls onError callback when an error is caught', () => {
    suppressReactErrorLogs();
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    );
    restoreConsoleError();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test render error' }),
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- expect.any() returns any by design
        componentStack: expect.any(String),
      }),
    );
  });
});
