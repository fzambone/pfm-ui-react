import { PageContent } from '@/shared/components/PageContent';
import { PageHeader } from '@/shared/components/PageHeader';
import { Text } from '@/shared/components/Text';

export function DashboardPage(): React.ReactElement {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your financial overview at a glance."
      />
      <PageContent>
        <Text variant="bodySmall">
          Dashboard content will appear here in a future milestone.
        </Text>
      </PageContent>
    </>
  );
}
