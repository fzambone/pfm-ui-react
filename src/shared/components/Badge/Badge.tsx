import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';
  /** Size scale */
  size?: 'sm' | 'md';
  /** Additional classes merged via cn() */
  className?: string;
  /** Badge content */
  children: ReactNode;
};

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-glass-hover text-foreground',
  primary: 'bg-primary-muted text-primary',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  danger: 'bg-danger-muted text-danger',
  muted: 'bg-surface-high text-foreground-muted',
};

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...rest
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center rounded-badge font-bold uppercase tracking-[0.05em] truncate',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
