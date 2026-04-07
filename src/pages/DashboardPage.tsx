import { Text } from '@/shared/components/Text';

export function DashboardPage(): React.ReactElement {
  return (
    <div>
      <Text variant="h1">Dashboard</Text>
      <Text variant="bodySmall" className="mt-2">
        Your financial overview at a glance.
      </Text>
    </div>
  );
}
