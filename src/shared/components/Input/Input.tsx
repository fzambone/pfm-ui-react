import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

import { cn } from '@/shared/utils/cn';

/*
 * InputProps — extends native input attributes with label, error, helper text.
 *
 * useId() hook: React 18+ provides useId() to generate stable, unique IDs
 * for accessibility associations (htmlFor/id, aria-describedby). This avoids
 * the common pitfall of manually generating IDs that collide in SSR or
 * concurrent mode. In Go terms, it's like a context-scoped UUID generator.
 *
 * The `size` prop conflicts with the native HTML `size` attribute (which sets
 * the visible character width). We Omit it and redeclare with our own scale.
 */
type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Label text displayed above the input */
  label: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Whether the input is in an error state */
  hasError?: boolean;
  /** Error message displayed when hasError is true */
  errorMessage?: string;
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes on the outer wrapper */
  className?: string;
};

const sizeClasses: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
};

export function Input({
  label,
  helperText,
  hasError = false,
  errorMessage,
  size = 'md',
  className,
  id: externalId,
  disabled,
  required,
  ...rest
}: InputProps): React.ReactElement {
  /*
   * useId() generates a unique ID per component instance.
   * We prefer the externally provided id, falling back to the generated one.
   * This ensures label association works even when consumers don't pass an id.
   */
  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const showError = hasError && errorMessage;
  const showHelper = !showError && helperText;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      <label
        htmlFor={inputId}
        className={cn(
          'text-xs font-bold uppercase tracking-[0.05em]',
          hasError ? 'text-danger' : 'text-foreground-muted',
        )}
      >
        {label}
        {required ? (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {/* Input */}
      <input
        id={inputId}
        disabled={disabled}
        required={required}
        aria-required={required ? 'true' : undefined}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={
          showError ? errorId : showHelper ? helperId : undefined
        }
        className={cn(
          // Base styles — Chromatic Refraction spec
          'w-full rounded-input bg-surface-high text-foreground',
          'placeholder:text-foreground-subtle',
          'outline-none transition-all duration-normal',
          // Focus glow — tertiary cyan at 30% opacity
          'focus:ring-1 focus:ring-tertiary/30',
          // Error state — danger ring
          hasError && 'ring-1 ring-danger/30 bg-danger-muted',
          // Disabled
          disabled && 'opacity-50 cursor-not-allowed',
          // Size
          sizeClasses[size],
        )}
        {...rest}
      />

      {/* Error message */}
      {showError ? (
        <p id={errorId} className="text-xs text-danger" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {/* Helper text */}
      {showHelper ? (
        <p id={helperId} className="text-xs text-foreground-subtle">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
