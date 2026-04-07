import type { ReactNode } from 'react';
import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/utils/cn';

/*
 * Modal — an accessible dialog rendered via portal.
 *
 * Key React concepts at play:
 *
 * createPortal: Renders children into a DOM node outside the parent tree.
 * In Go terms, it's like writing to a different io.Writer — the component
 * lives in the React tree for state/context, but its DOM output goes
 * somewhere else (document.body). This escapes parent overflow:hidden.
 *
 * Focus trapping: We query all focusable elements inside the dialog and
 * intercept Tab/Shift+Tab to cycle within them. This is critical for
 * accessibility — keyboard users must not be able to Tab behind the modal.
 *
 * useCallback: We wrap the keydown handler in useCallback so the same
 * function reference is used for addEventListener/removeEventListener.
 * Without this, cleanup would fail and we'd leak event listeners.
 */

interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Called when the modal should close (Escape, backdrop click, close button) */
  onClose: () => void;
  /** Dialog title — announced to screen readers via aria-labelledby */
  title: string;
  /** Optional description — announced via aria-describedby */
  description?: string;
  /** Size scale controlling max-width */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes on the dialog panel */
  className?: string;
  /** Dialog content */
  children?: ReactNode;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  className,
  children,
}: ModalProps): React.ReactElement | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  /*
   * Focus management: when the modal opens, move focus to the first
   * focusable element. If none exist, focus the close button (which
   * is always present). This runs on every isOpen change.
   */
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to let the portal render into the DOM
    const timer = setTimeout(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = dialog.querySelectorAll(FOCUSABLE_SELECTOR);
      const firstFocusable = focusableElements[0];

      if (firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      }
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  /*
   * Body scroll lock: prevent the page from scrolling behind the modal.
   * Save the original overflow value and restore it on cleanup.
   */
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  /*
   * Keyboard handler: Escape closes, Tab traps focus inside.
   *
   * useCallback ensures stable reference for add/removeEventListener.
   * The dependency array includes onClose — if the parent passes a new
   * onClose function, we rebind. This is safe because the effect below
   * handles cleanup.
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trapping on Tab
      if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusableElements = dialog.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          // Shift+Tab: if on first element, wrap to last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  /*
   * Backdrop click handler: close when clicking the overlay
   * but not when clicking inside the dialog panel.
   */
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      // Only close if the click target is the backdrop itself
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return createPortal(
    // Backdrop overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative w-full rounded-modal border border-border bg-surface-mid p-8 shadow-glass-lg glass-edge',
          sizeClasses[size],
          className,
        )}
      >
        {/* Title */}
        <h2 id={titleId} className="pr-8 text-xl font-bold text-foreground">
          {title}
        </h2>

        {/* Description */}
        {description ? (
          <p id={descriptionId} className="mt-2 text-sm text-foreground-muted">
            {description}
          </p>
        ) : null}

        {/* Content — placed before close button so content gets focus first */}
        <div className="mt-6">{children}</div>

        {/* Close button — last in DOM for focus order, visually positioned top-right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-pill p-1.5 text-foreground-muted transition-colors duration-normal hover:bg-glass-hover hover:text-foreground"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
