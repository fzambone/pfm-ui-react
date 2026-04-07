import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';

import { PageHeader } from './PageHeader';

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  args: {
    title: 'Dashboard',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: {
    title: 'Dashboard',
    subtitle: 'Your financial overview at a glance.',
  },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader
      title="Transactions"
      subtitle="View and manage your transactions."
    >
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<Icon name="search" size="sm" />}
      >
        Search
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Icon name="plus" size="sm" />}
      >
        Add Transaction
      </Button>
    </PageHeader>
  ),
};

export const LongTitle: Story = {
  args: {
    title: 'This Is a Very Long Page Title That Demonstrates Wrapping Behavior',
    subtitle: 'Subtitles also wrap gracefully on smaller viewports.',
  },
};
