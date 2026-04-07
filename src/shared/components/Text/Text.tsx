import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

/*
 * Text — polymorphic typography component.
 *
 * Polymorphic rendering: The `as` prop determines which HTML element
 * is rendered. `variant` controls the visual style independently.
 * This decoupling lets you render h1 visuals on a <span> (e.g., for
 * SEO where the heading level must differ from the visual hierarchy).
 *
 * In Go terms, think of `as` like an interface satisfaction — the
 * same "behavior" (visual style) can be "implemented" by different
 * concrete types (HTML elements).
 *
 * The Chromatic Refraction design spec uses a high-contrast scale:
 * - Display variants: magazine-cover feel with tight tracking
 * - Labels: uppercase with wide tracking for a technical aesthetic
 */

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

type TextProps = HTMLAttributes<HTMLElement> & {
  /** Visual style variant from the typography scale */
  variant: TextVariant;
  /** HTML element to render (overrides the variant's default element) */
  as?: ElementType;
  /** Truncate text with ellipsis */
  isTruncated?: boolean;
  /** Additional classes merged via cn() */
  className?: string;
  children?: ReactNode;
};

/*
 * Variant → Tailwind class mapping.
 * Follows Chromatic Refraction typography spec:
 * - Display: font-black, tracking-tighter, text-foreground
 * - Headline: font-bold, tracking-tight
 * - Body: normal weight, muted colors for secondary
 * - Label: uppercase, wide tracking, font-bold, muted
 */
const variantClasses: Record<TextVariant, string> = {
  h1: 'text-5xl font-black tracking-tighter text-foreground',
  h2: 'text-3xl font-bold tracking-tight text-foreground',
  h3: 'text-2xl font-bold text-foreground',
  h4: 'text-xl font-bold text-foreground',
  body: 'text-base text-foreground',
  bodySmall: 'text-sm text-foreground-muted',
  caption: 'text-xs text-foreground-subtle',
  label: 'text-xs font-bold uppercase tracking-[0.05em] text-foreground-muted',
};

/*
 * Variant → default HTML element mapping.
 * Each variant renders a sensible semantic element when `as` is not provided.
 */
const defaultElements: Record<TextVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  bodySmall: 'p',
  caption: 'span',
  label: 'span',
};

export function Text({
  variant,
  as,
  isTruncated = false,
  className,
  children,
  ...rest
}: TextProps): React.ReactElement {
  const Component = as ?? defaultElements[variant];

  return (
    <Component
      className={cn(
        variantClasses[variant],
        isTruncated && 'truncate',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
