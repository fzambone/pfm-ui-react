import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
  // --- Rendering ---

  it('renders with children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders as an empty container without breaking', () => {
    const { container } = render(<Card />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  // --- Variants ---

  it('renders default (glass) variant with glass styling', () => {
    const { container } = render(<Card>Glass</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toMatch(/bg-glass/);
    expect(card?.className).toMatch(/glass-edge/);
  });

  it('renders outlined variant with surface-high background', () => {
    const { container } = render(<Card variant="outlined">Outlined</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toMatch(/bg-surface-high/);
  });

  // --- Subcomponents ---

  it('renders Card.Header in the correct position', () => {
    render(
      <Card>
        <Card.Header>Header Content</Card.Header>
      </Card>,
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders Card.Body in the correct position', () => {
    render(
      <Card>
        <Card.Body>Body Content</Card.Body>
      </Card>,
    );
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('renders Card.Footer in the correct position', () => {
    render(
      <Card>
        <Card.Footer>Footer Content</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders all three subcomponents together', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders cleanly with only Card.Body (no header/footer)', () => {
    const { container } = render(
      <Card>
        <Card.Body>Just body</Card.Body>
      </Card>,
    );
    expect(screen.getByText('Just body')).toBeInTheDocument();
    // Should only have 1 child div (the body)
    const card = container.firstElementChild;
    expect(card?.children).toHaveLength(1);
  });

  // --- Footer alignment ---

  it('right-aligns Card.Footer content by default', () => {
    render(
      <Card>
        <Card.Footer>Actions</Card.Footer>
      </Card>,
    );
    const footer = screen.getByText('Actions');
    expect(footer.className).toMatch(/justify-end/);
  });

  // --- className merge ---

  it('merges className on the Card wrapper', () => {
    const { container } = render(<Card className="mt-8">Styled</Card>);
    expect(container.firstElementChild?.className).toMatch(/mt-8/);
  });

  it('merges className on Card.Header', () => {
    render(
      <Card>
        <Card.Header className="pb-0">Header</Card.Header>
      </Card>,
    );
    expect(screen.getByText('Header').className).toMatch(/pb-0/);
  });

  it('merges className on Card.Body', () => {
    render(
      <Card>
        <Card.Body className="gap-4">Body</Card.Body>
      </Card>,
    );
    expect(screen.getByText('Body').className).toMatch(/gap-4/);
  });

  it('merges className on Card.Footer', () => {
    render(
      <Card>
        <Card.Footer className="border-t">Footer</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Footer').className).toMatch(/border-t/);
  });

  // --- Rest props passthrough ---

  it('passes through data-* and aria-* on Card', () => {
    render(
      <Card data-testid="dashboard-card" aria-label="Account summary">
        Content
      </Card>,
    );
    const card = screen.getByTestId('dashboard-card');
    expect(card).toHaveAttribute('aria-label', 'Account summary');
  });
});
