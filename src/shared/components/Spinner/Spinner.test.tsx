import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  // --- Rendering ---

  it('renders an SVG with animation', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('class')).toMatch(/animate-spin/);
  });

  // --- Sizes ---

  it('renders sm size', () => {
    const { container } = render(<Spinner size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/h-4/);
    expect(svg?.getAttribute('class')).toMatch(/w-4/);
  });

  it('renders md size by default', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/h-5/);
    expect(svg?.getAttribute('class')).toMatch(/w-5/);
  });

  it('renders lg size', () => {
    const { container } = render(<Spinner size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/h-8/);
    expect(svg?.getAttribute('class')).toMatch(/w-8/);
  });

  // --- Color inheritance ---

  it('uses currentColor so it adapts to parent text color', () => {
    const { container } = render(<Spinner />);
    const circle = container.querySelector('circle');
    expect(circle).toHaveAttribute('stroke', 'currentColor');
  });

  // --- Accessibility ---

  it('has role="status" for screen readers', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has a default aria-label of "Loading"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('accepts a custom aria-label', () => {
    render(<Spinner aria-label="Saving changes" />);
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Saving changes',
    );
  });

  // --- className merge ---

  it('merges consumer className via cn()', () => {
    const { container } = render(<Spinner className="text-primary" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toMatch(/text-primary/);
  });

  // --- Layout stability ---

  it('does not cause layout shift (has explicit dimensions)', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    // shrink-0 prevents flex collapsing
    expect(svg?.getAttribute('class')).toMatch(/shrink-0/);
  });
});
