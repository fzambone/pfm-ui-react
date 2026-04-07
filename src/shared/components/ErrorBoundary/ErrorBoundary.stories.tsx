import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '@/shared/components/Button';
import { Text } from '@/shared/components/Text';

import { ErrorBoundary } from './ErrorBoundary';

function ThrowOnClick(): React.ReactElement {
  const [shouldThrow, setShouldThrow] = useState(false);
  if (shouldThrow) {
    throw new Error('Intentional demo error');
  }
  return (
    <div className="space-y-4">
      <Text variant="body">
        This component is healthy. Click below to simulate a crash.
      </Text>
      <Button
        variant="danger"
        size="sm"
        onClick={() => {
          setShouldThrow(true);
        }}
      >
        Trigger Error
      </Button>
    </div>
  );
}

const meta = {
  title: 'Layout/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    children: (
      <Text variant="body">
        No error — children render normally. The error boundary is invisible
        until something breaks.
      </Text>
    ),
  },
};

export const ErrorFallback: Story = {
  args: {
    children: <ThrowOnClick />,
  },
};
