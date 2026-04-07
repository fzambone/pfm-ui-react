import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '@/shared/components/Text';

import { Icon } from './Icon';
import { iconPaths } from './icons';

const allIconNames = Object.keys(iconPaths) as (keyof typeof iconPaths)[];

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: allIconNames,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    'aria-label': { control: 'text' },
  },
  args: {
    name: 'dashboard',
    size: 'md',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Icon name="settings" size="sm" />
      <Icon name="settings" size="md" />
      <Icon name="settings" size="lg" />
    </div>
  ),
};

export const Meaningful: Story = {
  args: {
    name: 'alert',
    'aria-label': 'Warning: action required',
    size: 'lg',
  },
};

export const IconGrid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-8">
      {allIconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-card-nested p-3 text-center hover:bg-glass"
        >
          <Icon name={name} size="lg" className="text-foreground" />
          <Text variant="caption" className="text-[10px]">
            {name}
          </Text>
        </div>
      ))}
    </div>
  ),
};
