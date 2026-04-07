import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

import { CardBody } from './CardBody';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';

/*
 * Card — a compositional container with dot-notation subcomponents.
 *
 * Usage:
 *   <Card>
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content</Card.Body>
 *     <Card.Footer>Actions</Card.Footer>
 *   </Card>
 *
 * Subcomponents are in separate files to satisfy react-refresh
 * (Fast Refresh requires one component per file for HMR tracking).
 * The Object.assign pattern attaches them as Card.Header etc.
 */

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Visual variant */
  variant?: 'default' | 'outlined';
  /** Additional classes merged via cn() */
  className?: string;
  children?: ReactNode;
};

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default:
    'bg-glass backdrop-blur-[var(--blur-glass)] border border-border glass-edge shadow-glass',
  outlined: 'bg-surface-high border border-border',
};

// eslint-disable-next-line react-refresh/only-export-components -- compound component: CardRoot is exported via Object.assign
function CardRoot({
  variant = 'default',
  className,
  children,
  ...rest
}: CardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-card overflow-hidden',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
