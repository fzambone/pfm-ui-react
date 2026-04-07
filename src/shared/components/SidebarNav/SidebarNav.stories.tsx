import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';

import { SidebarNav } from './SidebarNav';

/*
 * SidebarNav requires a Router context because it uses NavLink.
 * We wrap it in MemoryRouter for Storybook — same pattern as tests.
 */
const meta = {
  title: 'Layout/SidebarNav',
  component: SidebarNav,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard']}>
        <div className="w-64 rounded-card border border-border bg-glass p-4 glass-edge">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HouseholdsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/households']}>
        <div className="w-64 rounded-card border border-border bg-glass p-4 glass-edge">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export const SettingsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings']}>
        <div className="w-64 rounded-card border border-border bg-glass p-4 glass-edge">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
