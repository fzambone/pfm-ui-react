import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/shared/components/Button';

import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    'aria-label': { control: 'text' },
  },
  args: {
    size: 'md',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const ColorInheritance: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-primary">
        <Spinner size="md" />
      </div>
      <div className="text-tertiary">
        <Spinner size="md" />
      </div>
      <div className="text-danger">
        <Spinner size="md" />
      </div>
      <div className="text-foreground-muted">
        <Spinner size="md" />
      </div>
    </div>
  ),
};

export const InsideButton: Story = {
  render: () => (
    <Button isLoading variant="primary">
      Saving...
    </Button>
  ),
};
