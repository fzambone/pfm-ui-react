import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { Icon } from '@/shared/components/Icon';
import { SidebarNav } from '@/shared/components/SidebarNav';
import { Text } from '@/shared/components/Text';
import { cn } from '@/shared/utils/cn';

/*
 * AppLayout — the app shell with sidebar + content area.
 *
 * Uses React Router's <Outlet> to render child routes in the content area.
 * The sidebar is a floating glass pill on desktop (per Chromatic Refraction spec)
 * and a slide-over overlay on mobile.
 *
 * useState for sidebar toggle: This is local UI state — it only affects
 * this component's rendering. In Go terms, it's like a mutex-protected
 * boolean flag that controls which code path runs on the next render.
 *
 * useCallback for handlers: The Escape key handler and backdrop click
 * handler are wrapped in useCallback so the event listener cleanup
 * works correctly (same function reference for add/remove).
 */

export function AppLayout(): React.ReactElement {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Escape key closes mobile sidebar
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMobile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen, closeMobile]);

  return (
    <div className="bg-mesh min-h-screen font-sans antialiased tracking-tight">
      {/* Mobile menu button — visible only on small screens */}
      <button
        type="button"
        onClick={() => {
          setIsMobileOpen(true);
        }}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-pill bg-glass text-foreground-muted backdrop-blur-[var(--blur-glass)] glass-edge lg:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" size="md" />
      </button>

      {/* Mobile backdrop overlay */}
      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          role="presentation"
          onClick={closeMobile}
        />
      ) : null}

      {/* Sidebar — floating glass pill */}
      <aside
        aria-label="Sidebar"
        className={cn(
          // Base styles (always present)
          'fixed bottom-4 left-4 top-4 z-50 flex w-64 flex-col overflow-y-auto rounded-card border border-border bg-glass py-8 shadow-glass backdrop-blur-[var(--blur-glass-lg)] glass-edge',
          // Desktop: always visible
          'hidden lg:flex',
          // Mobile: shown when open
          isMobileOpen && 'flex',
        )}
      >
        {/* App branding */}
        <div className="px-6 pb-6">
          <Text variant="h4" className="tracking-tighter">
            Luminous Ledger
          </Text>
          <Text variant="label" className="mt-1 opacity-70">
            The Digital Curator
          </Text>
        </div>

        {/* Sidebar navigation */}
        <SidebarNav onNavigate={closeMobile} />
      </aside>

      {/* Main content area */}
      <main
        className={cn(
          'min-h-screen p-6',
          // Desktop: offset by sidebar width + gaps
          'lg:pl-[calc(16rem+2rem)]',
        )}
      >
        <div className="mx-auto max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
