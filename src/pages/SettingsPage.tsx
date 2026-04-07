import { Text } from '@/shared/components/Text';

export function SettingsPage(): React.ReactElement {
  return (
    <div>
      <Text variant="h1">Settings</Text>
      <Text variant="bodySmall" className="mt-2">
        Configure your account and preferences.
      </Text>
    </div>
  );
}
