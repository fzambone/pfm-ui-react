import { NavLink } from 'react-router';

import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import { cn } from '@/shared/utils/cn';

/*
 * SidebarNav — navigation items for the app sidebar.
 *
 * Uses React Router's <NavLink> which provides an `isActive` boolean
 * via the className callback. This is how the active route gets highlighted
 * without any manual state management — the router knows which path matches.
 *
 * In Go terms, NavLink is like an http.Handler that also knows its own
 * registered route pattern and can compare it to the current request URL.
 *
 * The `onNavigate` callback lets the parent (AppLayout) close the mobile
 * sidebar when a link is clicked — navigation should dismiss the overlay.
 */

interface SidebarNavProps {
  /** Called when a nav item is clicked (used to close mobile sidebar) */
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: IconName;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { label: 'Households', to: '/households', icon: 'wallet' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
];

export function SidebarNav({
  onNavigate,
}: SidebarNavProps): React.ReactElement {
  return (
    <nav className="flex-1 space-y-1 px-2" aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'mx-2 my-1 flex items-center gap-3 rounded-pill px-4 py-3',
              'text-xs font-medium uppercase tracking-[0.05em]',
              'transition-all duration-normal',
              'hover:translate-x-1 hover:text-foreground',
              isActive
                ? 'bg-glass-hover text-foreground shadow-[0_0_15px_rgba(255,159,74,0.3)] glass-edge'
                : 'text-foreground-muted hover:bg-glass',
            )
          }
        >
          <Icon name={item.icon} size="md" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
