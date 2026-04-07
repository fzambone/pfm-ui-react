import type { SVGAttributes } from 'react';

import { cn } from '@/shared/utils/cn';

import { type IconName, iconPaths } from './icons';

/*
 * Icon — renders SVG icons from the icon registry.
 *
 * Icons use `currentColor` for stroke, so they automatically inherit
 * the text color of their parent. This means an icon inside a Button
 * or a navigation link adapts to hover/active states without extra work.
 *
 * The `aria-hidden` / `aria-label` pattern:
 * - Decorative icons (next to text): aria-hidden="true" — screen readers skip them
 * - Meaningful icons (standalone): aria-label="Description" + role="img"
 * This is the same distinction as Go's exported vs unexported identifiers —
 * decorative icons are "unexported" from the accessibility tree.
 */

type IconProps = Omit<SVGAttributes<SVGSVGElement>, 'children'> & {
  /** Icon name from the registry */
  name: IconName;
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes merged via cn() */
  className?: string;
  /** When provided, makes the icon meaningful (announced by screen readers) */
  'aria-label'?: string;
};

const sizeClasses: Record<NonNullable<IconProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function Icon({
  name,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  ...rest
}: IconProps): React.ReactElement | null {
  const pathData = iconPaths[name] as string | undefined;

  // Unknown icon name at runtime — render nothing, don't crash
  if (!pathData) return null;

  const isDecorative = !ariaLabel;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      className={cn('shrink-0', sizeClasses[size], className)}
      {...rest}
    >
      <path d={pathData} />
    </svg>
  );
}
