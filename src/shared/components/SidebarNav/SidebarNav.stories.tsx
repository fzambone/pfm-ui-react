import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

import { SidebarNav } from './SidebarNav';

/*
 * SidebarNav requires a Router context because it uses NavLink.
 * Each story provides its own MemoryRouter with the appropriate
 * initialEntries to show the correct active state.
 */

function SidebarNavWrapper({
  initialRoute = '/dashboard',
}: {
  initialRoute?: string;
}): ReactElement {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <div className="w-64 rounded-card border border-border bg-glass p-4 glass-edge">
        <SidebarNav />
      </div>
    </MemoryRouter>
  );
}

const meta = {
  title: 'Layout/SidebarNav',
  component: SidebarNavWrapper,
  tags: ['autodocs'],
  args: {
    initialRoute: '/dashboard',
  },
  argTypes: {
    initialRoute: {
      control: 'select',
      options: ['/dashboard', '/households', '/settings'],
    },
  },
} satisfies Meta<typeof SidebarNavWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HouseholdsActive: Story = {
  args: { initialRoute: '/households' },
};

export const SettingsActive: Story = {
  args: { initialRoute: '/settings' },
};
