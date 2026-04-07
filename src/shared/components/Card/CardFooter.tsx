import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: ReactNode;
};

export function CardFooter({
  className,
  children,
  ...rest
}: CardFooterProps): React.ReactElement {
  return (
    <div
      className={cn('flex items-center justify-end px-8 pb-8 pt-0', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
