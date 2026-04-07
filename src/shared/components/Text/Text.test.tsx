import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Text } from './Text';

describe('Text', () => {
  // --- Variants render correct styles ---

  it('renders h1 variant with display styles', () => {
    render(<Text variant="h1">Heading 1</Text>);
    const el = screen.getByText('Heading 1');
    expect(el.className).toMatch(/text-5xl/);
    expect(el.className).toMatch(/font-black/);
    expect(el.className).toMatch(/tracking-tighter/);
  });

  it('renders h2 variant with headline styles', () => {
    render(<Text variant="h2">Heading 2</Text>);
    const el = screen.getByText('Heading 2');
    expect(el.className).toMatch(/text-3xl/);
    expect(el.className).toMatch(/font-bold/);
  });

  it('renders h3 variant', () => {
    render(<Text variant="h3">Heading 3</Text>);
    const el = screen.getByText('Heading 3');
    expect(el.className).toMatch(/text-2xl/);
  });

  it('renders h4 variant', () => {
    render(<Text variant="h4">Heading 4</Text>);
    const el = screen.getByText('Heading 4');
    expect(el.className).toMatch(/text-xl/);
  });

  it('renders body variant with base text', () => {
    render(<Text variant="body">Body text</Text>);
    const el = screen.getByText('Body text');
    expect(el.className).toMatch(/text-base/);
    expect(el.className).toMatch(/text-foreground/);
  });

  it('renders bodySmall variant with muted color', () => {
    render(<Text variant="bodySmall">Small body</Text>);
    const el = screen.getByText('Small body');
    expect(el.className).toMatch(/text-sm/);
    expect(el.className).toMatch(/text-foreground-muted/);
  });

  it('renders caption variant with subtle color', () => {
    render(<Text variant="caption">Caption text</Text>);
    const el = screen.getByText('Caption text');
    expect(el.className).toMatch(/text-xs/);
    expect(el.className).toMatch(/text-foreground-subtle/);
  });

  it('renders label variant with uppercase and tracking', () => {
    render(<Text variant="label">Label text</Text>);
    const el = screen.getByText('Label text');
    expect(el.className).toMatch(/uppercase/);
    expect(el.className).toMatch(/tracking-\[0\.05em\]/);
    expect(el.className).toMatch(/font-bold/);
  });

  // --- Default elements ---

  it('renders h1 variant as <h1> by default', () => {
    render(<Text variant="h1">Heading</Text>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders h2 variant as <h2> by default', () => {
    render(<Text variant="h2">Heading</Text>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders h3 variant as <h3> by default', () => {
    render(<Text variant="h3">Heading</Text>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders h4 variant as <h4> by default', () => {
    render(<Text variant="h4">Heading</Text>);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('renders body variant as <p> by default', () => {
    render(<Text variant="body">Paragraph</Text>);
    const el = screen.getByText('Paragraph');
    expect(el.tagName).toBe('P');
  });

  it('renders label variant as <span> by default', () => {
    render(<Text variant="label">Label</Text>);
    const el = screen.getByText('Label');
    expect(el.tagName).toBe('SPAN');
  });

  // --- Polymorphic `as` prop ---

  it('renders as a custom element via as prop', () => {
    render(
      <Text variant="h1" as="span">
        Span heading
      </Text>,
    );
    const el = screen.getByText('Span heading');
    expect(el.tagName).toBe('SPAN');
    // Still has h1 visual styles
    expect(el.className).toMatch(/text-5xl/);
  });

  it('renders h1 visuals on a div element', () => {
    render(
      <Text variant="h1" as="div">
        Div heading
      </Text>,
    );
    const el = screen.getByText('Div heading');
    expect(el.tagName).toBe('DIV');
  });

  // --- className merge ---

  it('merges consumer className via cn()', () => {
    render(
      <Text variant="body" className="mt-4">
        Styled
      </Text>,
    );
    const el = screen.getByText('Styled');
    expect(el.className).toMatch(/mt-4/);
  });

  it('allows color override via className', () => {
    render(
      <Text variant="body" className="text-primary">
        Colored
      </Text>,
    );
    const el = screen.getByText('Colored');
    expect(el.className).toMatch(/text-primary/);
  });

  // --- Rest props passthrough ---

  it('passes through data-* and aria-* attributes', () => {
    render(
      <Text variant="body" data-testid="custom" aria-label="Description">
        Content
      </Text>,
    );
    const el = screen.getByTestId('custom');
    expect(el).toHaveAttribute('aria-label', 'Description');
  });

  // --- Truncation ---

  it('truncates with ellipsis when isTruncated is true', () => {
    render(
      <Text variant="body" isTruncated>
        Very long text that should truncate
      </Text>,
    );
    const el = screen.getByText('Very long text that should truncate');
    expect(el.className).toMatch(/truncate/);
  });

  it('does not truncate by default', () => {
    render(<Text variant="body">Normal text</Text>);
    const el = screen.getByText('Normal text');
    expect(el.className).not.toMatch(/truncate/);
  });
});
