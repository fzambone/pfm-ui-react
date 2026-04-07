import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

/*
 * ButtonProps — the component API contract.
 *
 * This uses a TypeScript intersection type: we take standard HTML button
 * attributes (onClick, disabled, type, aria-*, data-*, etc.) and extend
 * them with our custom props. The `Omit<..., 'disabled'>` removes the
 * native `disabled` so we can re-declare it alongside `isLoading`
 * (both disable the button, but for different reasons).
 */
type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Shows loading spinner and disables interaction */
  isLoading?: boolean;
  /** Disables the button */
  disabled?: boolean;
  /** Icon element rendered before children */
  leftIcon?: ReactNode;
  /** Icon element rendered after children */
  rightIcon?: ReactNode;
  /** Additional classes merged via cn() */
  className?: string;
  /** Button content */
  children?: ReactNode;
};

/*
 * Variant class maps — each variant maps to Tailwind classes
 * following the Chromatic Refraction design spec.
 *
 * Primary: gradient CTA with glow shadow
 * Secondary: glass-based with ghost border highlight
 * Ghost: text-only, no background
 * Danger: solid danger color
 */
const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-primary to-primary-container text-primary-foreground shadow-glow-primary glass-edge',
  secondary:
    'bg-glass-hover backdrop-blur-md text-foreground glass-edge border border-border',
  ghost: 'bg-transparent text-primary hover:bg-glass',
  danger: 'bg-danger text-danger-foreground hover:bg-danger-hover',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps): React.ReactElement {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        // Base styles — shared across all variants
        'inline-flex items-center justify-center rounded-button font-bold',
        'transition-all duration-normal',
        'active:scale-95',
        // Variant + size
        variantClasses[variant],
        sizeClasses[size],
        // Disabled / loading state
        isDisabled && 'pointer-events-none opacity-50 cursor-not-allowed',
        // Consumer overrides
        className,
      )}
      {...rest}
    >
      {/* Loading spinner — absolutely positioned over content */}
      {isLoading ? (
        <>
          <span
            className="absolute inline-flex items-center justify-center"
            aria-label="Loading"
          >
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
          {/* Keep children in DOM but invisible for width stability */}
          <span className="invisible flex items-center gap-inherit">
            {leftIcon}
            {children}
            {rightIcon}
          </span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
