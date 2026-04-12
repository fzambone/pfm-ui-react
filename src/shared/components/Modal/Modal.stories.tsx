import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Text } from '@/shared/components/Text';

import { Modal } from './Modal';

/*
 * Modal is a controlled component (isOpen/onClose), so we can't use
 * Storybook's args directly. Instead, we use a ModalDemo wrapper
 * with its own useState and type the meta around that wrapper.
 */

function ModalDemo({
  size = 'md',
  title,
  description,
  children,
}: {
  size?: 'sm' | 'md' | 'lg';
  title: string;
  description?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        title={title}
        {...(description !== undefined ? { description } : {})}
        size={size}
      >
        {children ?? <Text variant="body">Modal body content goes here.</Text>}
      </Modal>
    </>
  );
}

const meta = {
  title: 'Components/Modal',
  component: ModalDemo,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'Modal Title',
    description: 'A description of what this modal does.',
    size: 'md',
  },
} satisfies Meta<typeof ModalDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { title: 'Small Modal', size: 'sm' },
};

export const Large: Story = {
  args: {
    title: 'Large Modal',
    description: 'This is a wider dialog.',
    size: 'lg',
  },
};

export const WithForm: Story = {
  args: {
    title: 'Add Transaction',
    description: 'Enter the transaction details.',
  },
  render: (args) => (
    <ModalDemo title={args.title}>
      <div className="space-y-4">
        <Input label="Description" placeholder="e.g., Grocery Store" />
        <Input label="Amount" type="number" placeholder="0.00" />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Save
          </Button>
        </div>
      </div>
    </ModalDemo>
  ),
};
