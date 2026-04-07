import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

type PageContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Additional classes merged via cn() */
  className?: string;
  children?: ReactNode;
};

export function PageContent({
  className,
  children,
  ...rest
}: PageContentProps): React.ReactElement {
  return (
    <div className={cn('mt-8', className)} {...rest}>
      {children}
    </div>
  );
}
