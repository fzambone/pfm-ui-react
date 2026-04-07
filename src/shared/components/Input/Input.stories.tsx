import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    hasError: { control: 'boolean' },
    errorMessage: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
    },
  },
  args: {
    label: 'Email',
    placeholder: 'Enter your email...',
    size: 'md',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Default ---

export const Default: Story = {};

// --- With Helper Text ---

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password...',
    helperText: 'Must be at least 8 characters',
  },
};

// --- With Error ---

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email...',
    hasError: true,
    errorMessage: 'Please enter a valid email address',
  },
};

export const ErrorReplacesHelper: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username...',
    helperText: 'Letters and numbers only',
    hasError: true,
    errorMessage: 'Username is already taken',
  },
};

// --- Sizes ---

export const Small: Story = {
  args: { label: 'Small Input', size: 'sm' },
};

export const Medium: Story = {
  args: { label: 'Medium Input', size: 'md' },
};

export const Large: Story = {
  args: { label: 'Large Input', size: 'lg' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Input label="Small" size="sm" placeholder="Small input..." />
      <Input label="Medium" size="md" placeholder="Medium input..." />
      <Input label="Large" size="lg" placeholder="Large input..." />
    </div>
  ),
};

// --- States ---

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    placeholder: 'Cannot edit...',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required...',
    required: true,
  },
};

// --- Types ---

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Number: Story = {
  args: {
    label: 'Amount',
    type: 'number',
    placeholder: '0.00',
  },
};
