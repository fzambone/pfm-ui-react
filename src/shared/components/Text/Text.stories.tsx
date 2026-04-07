import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'body',
        'bodySmall',
        'caption',
        'label',
      ],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div'],
    },
    isTruncated: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'body',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TypeScale: Story = {
  render: () => (
    <div className="space-y-6">
      <Text variant="h1">Heading 1 — Display</Text>
      <Text variant="h2">Heading 2 — Headline</Text>
      <Text variant="h3">Heading 3 — Title</Text>
      <Text variant="h4">Heading 4 — Subtitle</Text>
      <Text variant="body">
        Body — The quick brown fox jumps over the lazy dog. This is how
        paragraph text renders in the Chromatic Refraction design system.
      </Text>
      <Text variant="bodySmall">
        Body Small — Secondary text for descriptions, helper copy, and
        supplementary information.
      </Text>
      <Text variant="caption">
        Caption — Used for metadata, timestamps, and micro-copy.
      </Text>
      <Text variant="label">
        Label — Uppercase tracking for navigation and tags
      </Text>
    </div>
  ),
};

export const PolymorphicAs: Story = {
  render: () => (
    <div className="space-y-4">
      <Text variant="h1" as="span">
        h1 visuals on a span
      </Text>
      <Text variant="body" as="div">
        body visuals on a div
      </Text>
      <Text variant="label" as="p">
        label visuals on a paragraph
      </Text>
    </div>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div className="w-64">
      <Text variant="body" isTruncated>
        This is a very long text that will be truncated with an ellipsis when it
        overflows.
      </Text>
    </div>
  ),
};

export const Heading1: Story = {
  args: { variant: 'h1', children: 'Heading 1' },
};
export const Heading2: Story = {
  args: { variant: 'h2', children: 'Heading 2' },
};
export const Heading3: Story = {
  args: { variant: 'h3', children: 'Heading 3' },
};
export const Heading4: Story = {
  args: { variant: 'h4', children: 'Heading 4' },
};
export const Body: Story = { args: { variant: 'body' } };
export const BodySmall: Story = {
  args: { variant: 'bodySmall', children: 'Small body text' },
};
export const Caption: Story = {
  args: { variant: 'caption', children: 'Caption text' },
};
export const Label: Story = {
  args: { variant: 'label', children: 'Label text' },
};
