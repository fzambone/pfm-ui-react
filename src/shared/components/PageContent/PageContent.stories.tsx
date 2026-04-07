import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from '@/shared/components/Card';
import { Text } from '@/shared/components/Text';

import { PageContent } from './PageContent';

const meta = {
  title: 'Layout/PageContent',
  component: PageContent,
  tags: ['autodocs'],
} satisfies Meta<typeof PageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PageContent>
      <Text variant="body">
        Page content renders here with consistent top margin spacing.
      </Text>
    </PageContent>
  ),
};

export const WithCards: Story = {
  render: () => (
    <PageContent>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <Card.Body>
            <Text variant="h4">Card One</Text>
            <Text variant="bodySmall" className="mt-2">
              Content inside a page content area.
            </Text>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Text variant="h4">Card Two</Text>
            <Text variant="bodySmall" className="mt-2">
              Another card in the grid.
            </Text>
          </Card.Body>
        </Card>
      </div>
    </PageContent>
  ),
};

export const Empty: Story = {
  render: () => <PageContent />,
};
