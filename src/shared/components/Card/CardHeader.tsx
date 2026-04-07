import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: ReactNode;
};

export function CardHeader({
  className,
  children,
  ...rest
}: CardHeaderProps): React.ReactElement {
  return (
    <div className={cn('px-8 pt-8 pb-0', className)} {...rest}>
      {children}
    </div>
  );
}
