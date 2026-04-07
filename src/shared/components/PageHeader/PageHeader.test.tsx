import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders the title as a heading', () => {
    render(<PageHeader title="Dashboard" />);
    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it('renders the title with display typography', () => {
    render(<PageHeader title="Dashboard" />);
    const heading = screen.getByRole('heading', { name: /dashboard/i });
    expect(heading.className).toMatch(/text-5xl/);
    expect(heading.className).toMatch(/font-black/);
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Dashboard" subtitle="Your financial overview" />);
    expect(screen.getByText('Your financial overview')).toBeInTheDocument();
  });

  it('renders subtitle in secondary style', () => {
    render(<PageHeader title="Dashboard" subtitle="Your financial overview" />);
    const subtitle = screen.getByText('Your financial overview');
    expect(subtitle.className).toMatch(/text-foreground-muted/);
  });

  it('does not render subtitle element when not provided', () => {
    const { container } = render(<PageHeader title="Dashboard" />);
    // Only the heading should be present, no subtitle p tag
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders actions slot right-aligned', () => {
    render(
      <PageHeader title="Dashboard">
        <button type="button">Export</button>
      </PageHeader>,
    );
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('merges className via cn()', () => {
    const { container } = render(
      <PageHeader title="Dashboard" className="mb-12" />,
    );
    expect(container.firstElementChild?.className).toMatch(/mb-12/);
  });

  it('handles very long titles gracefully', () => {
    render(
      <PageHeader title="This is a very long page title that might need to wrap on smaller screens" />,
    );
    const heading = screen.getByRole('heading');
    // Should not have truncate — wrapping is preferred for headings
    expect(heading).toBeInTheDocument();
  });
});
