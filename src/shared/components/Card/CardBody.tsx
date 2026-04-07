import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

type CardBodyProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: ReactNode;
};

export function CardBody({
  className,
  children,
  ...rest
}: CardBodyProps): React.ReactElement {
  return (
    <div className={cn('px-8 py-6', className)} {...rest}>
      {children}
    </div>
  );
}
