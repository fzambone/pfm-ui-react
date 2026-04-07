import { PageContent } from '@/shared/components/PageContent';
import { PageHeader } from '@/shared/components/PageHeader';
import { Text } from '@/shared/components/Text';

export function SettingsPage(): React.ReactElement {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure your account and preferences."
      />
      <PageContent>
        <Text variant="bodySmall">
          Settings will appear here in a future milestone.
        </Text>
      </PageContent>
    </>
  );
}
