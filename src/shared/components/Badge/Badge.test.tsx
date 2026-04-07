import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  // --- Rendering ---

  it('renders with children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  // --- Variants ---

  it('renders default variant with glass styling', () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default').className).toMatch(/bg-glass-hover/);
  });

  it('renders primary variant with primary muted background', () => {
    render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText('Primary').className).toMatch(/bg-primary-muted/);
  });

  it('renders success variant with success muted background', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').className).toMatch(/bg-success-muted/);
  });

  it('renders warning variant with warning muted background', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning').className).toMatch(/bg-warning-muted/);
  });

  it('renders danger variant with danger muted background', () => {
    render(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText('Danger').className).toMatch(/bg-danger-muted/);
  });

  it('renders muted variant with subtle surface background', () => {
    render(<Badge variant="muted">Muted</Badge>);
    expect(screen.getByText('Muted').className).toMatch(/bg-surface-high/);
  });

  // --- Sizes ---

  it('renders sm size with smaller text and padding', () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small').className).toMatch(/text-\[10px\]/);
  });

  it('renders md size by default', () => {
    render(<Badge>Default Size</Badge>);
    expect(screen.getByText('Default Size').className).toMatch(/text-xs/);
  });

  // --- className merge ---

  it('merges consumer className via cn()', () => {
    render(<Badge className="ml-2">Styled</Badge>);
    expect(screen.getByText('Styled').className).toMatch(/ml-2/);
  });

  // --- Rest props passthrough ---

  it('passes through data-* and aria-* attributes', () => {
    render(
      <Badge data-testid="status-badge" aria-label="Status: Active">
        Active
      </Badge>,
    );
    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveAttribute('aria-label', 'Status: Active');
  });

  // --- Truncation ---

  it('truncates long text with ellipsis', () => {
    render(<Badge>This is a very long badge text that should truncate</Badge>);
    const badge = screen.getByText(
      'This is a very long badge text that should truncate',
    );
    expect(badge.className).toMatch(/truncate/);
  });

  // --- Default variant ---

  it('uses default variant when none is specified', () => {
    render(<Badge>No Variant</Badge>);
    expect(screen.getByText('No Variant').className).toMatch(/bg-glass-hover/);
  });
});
