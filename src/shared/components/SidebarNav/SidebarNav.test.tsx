import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { SidebarNav } from './SidebarNav';

function renderWithRouter(initialEntries: string[] = ['/dashboard']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SidebarNav onNavigate={vi.fn()} />
    </MemoryRouter>,
  );
}

describe('SidebarNav', () => {
  // --- Rendering ---

  it('renders navigation items for Dashboard, Households, and Settings', () => {
    renderWithRouter();
    expect(
      screen.getByRole('link', { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /households/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders each nav item with an icon', () => {
    renderWithRouter();
    // Each link should contain an SVG icon
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link.querySelector('svg')).toBeInTheDocument();
    }
  });

  it('renders each nav item with a text label', () => {
    renderWithRouter();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Households')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  // --- Active state ---

  it('highlights the active nav item matching the current route', () => {
    renderWithRouter(['/dashboard']);
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    // Active items get a distinct class
    expect(dashboardLink.className).toMatch(/bg-glass-hover/);
  });

  it('does not highlight inactive nav items', () => {
    renderWithRouter(['/dashboard']);
    const householdsLink = screen.getByRole('link', { name: /households/i });
    expect(householdsLink.className).not.toMatch(/bg-glass-hover/);
  });

  it('updates active state when route changes', () => {
    renderWithRouter(['/households']);
    const householdsLink = screen.getByRole('link', { name: /households/i });
    expect(householdsLink.className).toMatch(/bg-glass-hover/);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink.className).not.toMatch(/bg-glass-hover/);
  });

  // --- Navigation ---

  it('navigates to the correct route when clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(['/dashboard']);

    await user.click(screen.getByRole('link', { name: /households/i }));
    // After click, households should now be active
    expect(screen.getByRole('link', { name: /households/i }).className).toMatch(
      /bg-glass-hover/,
    );
  });

  it('calls onNavigate callback when a nav item is clicked', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <SidebarNav onNavigate={onNavigate} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: /households/i }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  // --- Keyboard ---

  it('all nav items are reachable via Tab', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await user.tab();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: /households/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: /settings/i })).toHaveFocus();
  });

  // --- Accessibility ---

  it('renders inside a nav element with aria-label', () => {
    renderWithRouter();
    expect(
      screen.getByRole('navigation', { name: /main navigation/i }),
    ).toBeInTheDocument();
  });
});
