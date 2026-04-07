import { Link } from 'react-router';

import { Button } from '@/shared/components/Button';
import { PageContent } from '@/shared/components/PageContent';
import { Text } from '@/shared/components/Text';

export function NotFoundPage(): React.ReactElement {
  return (
    <PageContent>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Text variant="h1" className="text-foreground-muted">
          404
        </Text>
        <Text variant="h3" className="mt-4">
          Page Not Found
        </Text>
        <Text variant="bodySmall" className="mt-2">
          The page you are looking for does not exist.
        </Text>
        <Link to="/dashboard" className="mt-8">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </PageContent>
  );
}
