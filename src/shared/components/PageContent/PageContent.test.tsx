import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageContent } from './PageContent';

describe('PageContent', () => {
  it('renders children content', () => {
    render(<PageContent>Page body content</PageContent>);
    expect(screen.getByText('Page body content')).toBeInTheDocument();
  });

  it('renders as an empty container without breaking', () => {
    const { container } = render(<PageContent />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('merges className via cn()', () => {
    const { container } = render(
      <PageContent className="gap-8">Content</PageContent>,
    );
    expect(container.firstElementChild?.className).toMatch(/gap-8/);
  });

  it('provides consistent spacing between header and content', () => {
    const { container } = render(<PageContent>Content</PageContent>);
    // Should have top margin/padding for spacing from PageHeader
    expect(container.firstElementChild?.className).toMatch(/mt-/);
  });
});
