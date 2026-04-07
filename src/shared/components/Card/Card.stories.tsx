import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/shared/components/Button';
import { Text } from '@/shared/components/Text';

import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined'],
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Body>
        <Text variant="body">Default glass card with content.</Text>
      </Card.Body>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined">
      <Card.Body>
        <Text variant="body">Outlined card with surface-high background.</Text>
      </Card.Body>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <Text variant="h3">Card Title</Text>
        <Text variant="bodySmall" className="mt-1">
          A description of this card&apos;s content.
        </Text>
      </Card.Header>
      <Card.Body>
        <Text variant="body">
          This is the main body content of the card. It can contain any
          components.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const BodyOnly: Story = {
  render: () => (
    <Card>
      <Card.Body>
        <Text variant="body">
          A card with only body content — no header or footer.
        </Text>
      </Card.Body>
    </Card>
  ),
};

export const BothVariants: Story = {
  render: () => (
    <div className="flex gap-6">
      <Card className="w-64">
        <Card.Body>
          <Text variant="label">Default (Glass)</Text>
          <Text variant="bodySmall" className="mt-2">
            Frosted glass with backdrop blur.
          </Text>
        </Card.Body>
      </Card>
      <Card variant="outlined" className="w-64">
        <Card.Body>
          <Text variant="label">Outlined</Text>
          <Text variant="bodySmall" className="mt-2">
            Solid surface-high background.
          </Text>
        </Card.Body>
      </Card>
    </div>
  ),
};
