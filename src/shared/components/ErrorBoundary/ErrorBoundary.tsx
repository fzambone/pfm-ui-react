import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { Button } from '@/shared/components/Button';
import { Text } from '@/shared/components/Text';

/*
 * ErrorBoundary — catches render errors in child components.
 *
 * This is the ONE place where a class component is required in React.
 * Error boundaries use getDerivedStateFromError (synchronous, during render)
 * and componentDidCatch (asynchronous, for logging). There is no hooks
 * equivalent — React deliberately requires class components for this.
 *
 * In Go terms, this is like a deferred recover() that catches panics
 * in the render tree. Without it, a single error crashes the entire app.
 *
 * IMPORTANT LIMITATION: Error boundaries do NOT catch:
 * - Errors in event handlers (use try/catch in the handler)
 * - Errors in async code (promises, setTimeout)
 * - Server-side rendering errors
 * - Errors thrown in the error boundary itself
 */

interface ErrorBoundaryProps {
  /** Child components to protect */
  children: ReactNode;
  /** Optional callback when an error is caught (for future error reporting) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /*
   * getDerivedStateFromError runs during the render phase.
   * It receives the thrown error and returns new state.
   * This is synchronous — it must return immediately.
   */
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  /*
   * componentDidCatch runs after the error has been committed to the DOM.
   * This is where you log errors or call reporting services.
   * The errorInfo includes the component stack trace.
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private readonly handleReset = (): void => {
    this.setState({ hasError: false });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <Text variant="h3">Something went wrong</Text>
          <Text variant="bodySmall" className="mt-2 max-w-md">
            An unexpected error occurred in this section. The rest of the
            application is still functional.
          </Text>
          <Button variant="primary" className="mt-6" onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
