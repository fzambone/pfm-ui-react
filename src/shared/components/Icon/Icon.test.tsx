import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from './Icon';

describe('Icon', () => {
  // --- Rendering ---

  it('renders an SVG element for a valid icon name', () => {
    const { container } = render(<Icon name="close" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders nothing for an unknown icon name', () => {
    // @ts-expect-error — testing runtime behavior with invalid name
    const { container } = render(<Icon name="nonexistent-icon" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  // --- Sizes ---

  it('renders sm size (16px)', () => {
    const { container } = render(<Icon name="close" size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/h-4/);
    expect(svg?.getAttribute('class')).toMatch(/w-4/);
  });

  it('renders md size by default (20px)', () => {
    const { container } = render(<Icon name="close" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/h-5/);
    expect(svg?.getAttribute('class')).toMatch(/w-5/);
  });

  it('renders lg size (24px)', () => {
    const { container } = render(<Icon name="close" size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/h-6/);
    expect(svg?.getAttribute('class')).toMatch(/w-6/);
  });

  // --- Color inheritance ---

  it('uses currentColor for stroke by default', () => {
    const { container } = render(<Icon name="close" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  // --- Accessibility ---

  it('is decorative by default (aria-hidden="true")', () => {
    const { container } = render(<Icon name="close" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('accepts aria-label for meaningful icons and removes aria-hidden', () => {
    render(<Icon name="alert" aria-label="Warning" />);
    const svg = screen.getByRole('img', { name: /warning/i });
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  // --- className merge ---

  it('merges consumer className via cn()', () => {
    const { container } = render(<Icon name="close" className="text-danger" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/text-danger/);
  });

  // --- Icon set ---

  it('renders all required icons without error', () => {
    const requiredIcons = [
      'close',
      'chevron-right',
      'chevron-down',
      'menu',
      'check',
      'alert',
      'plus',
      'minus',
      'search',
      'user',
      'settings',
    ] as const;

    for (const name of requiredIcons) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      unmount();
    }
  });

  // --- Consistent viewBox ---

  it('normalizes all icons to a 24x24 viewBox', () => {
    const { container } = render(<Icon name="close" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });
});
