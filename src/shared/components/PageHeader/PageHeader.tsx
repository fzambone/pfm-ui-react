import type { HTMLAttributes, ReactNode } from 'react';

import { Text } from '@/shared/components/Text';
import { cn } from '@/shared/utils/cn';

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  /** Page title — rendered as a display heading */
  title: string;
  /** Optional subtitle — rendered below the title in muted style */
  subtitle?: string;
  /** Additional classes merged via cn() */
  className?: string;
  /** Action buttons — rendered right-aligned in the header */
  children?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  className,
  children,
  ...rest
}: PageHeaderProps): React.ReactElement {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        className,
      )}
      {...rest}
    >
      <div>
        <Text variant="h1">{title}</Text>
        {subtitle ? (
          <Text variant="bodySmall" className="mt-2 text-foreground-muted">
            {subtitle}
          </Text>
        ) : null}
      </div>
      {children ? (
        <div className="flex items-center gap-3">{children}</div>
      ) : null}
    </header>
  );
}
