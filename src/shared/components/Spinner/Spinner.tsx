import type { SVGAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

/*
 * Spinner — an animated loading indicator.
 *
 * Uses CSS `animate-spin` for rotation — no JS animation libraries.
 * Color inherits from parent via `currentColor` on the stroke, so
 * a Spinner inside a Button automatically matches the button's text color.
 *
 * Reduced motion: base.css has a global `prefers-reduced-motion: reduce`
 * rule that sets animation-duration to 0.01ms. No per-component handling needed.
 *
 * The SVG is two overlapping circles:
 * 1. A full circle at 25% opacity (the "track")
 * 2. A quarter-arc at 75% opacity (the spinning indicator)
 */

type SpinnerProps = Omit<SVGAttributes<SVGSVGElement>, 'children'> & {
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes merged via cn() */
  className?: string;
  /** Screen reader label (default: "Loading") */
  'aria-label'?: string;
};

const sizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

export function Spinner({
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Loading',
  ...rest
}: SpinnerProps): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={ariaLabel}
      className={cn('shrink-0 animate-spin', sizeClasses[size], className)}
      {...rest}
    >
      {/* Track circle — faint background ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      {/* Spinning arc — the visible indicator */}
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        className="opacity-75"
      />
    </svg>
  );
}
