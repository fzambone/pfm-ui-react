import { PageContent } from '@/shared/components/PageContent';
import { PageHeader } from '@/shared/components/PageHeader';
import { Text } from '@/shared/components/Text';

export function HouseholdsPage(): React.ReactElement {
  return (
    <>
      <PageHeader
        title="Households"
        subtitle="Manage your shared financial spaces."
      />
      <PageContent>
        <Text variant="bodySmall">
          Household management will appear here in a future milestone.
        </Text>
      </PageContent>
    </>
  );
}
