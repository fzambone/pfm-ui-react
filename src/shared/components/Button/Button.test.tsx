import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  // --- Rendering ---

  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it('defaults to type="button" to prevent accidental form submission', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows type="submit" to be explicitly set', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  // --- Variants ---

  it('renders primary variant with gradient classes', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/from-primary/);
    expect(button.className).toMatch(/to-primary-container/);
  });

  it('renders secondary variant with glass classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/bg-glass-hover/);
  });

  it('renders ghost variant with text-only styling', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/text-primary/);
  });

  it('renders danger variant with danger colors', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/bg-danger/);
  });

  // --- Sizes ---

  it('renders sm size with smaller padding and text', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/text-xs/);
  });

  it('renders md size by default', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/text-sm/);
  });

  it('renders lg size with larger padding and text', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/text-base/);
  });

  // --- Interaction ---

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Loading
      </Button>,
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Disabled state ---

  it('has disabled attribute and reduced opacity when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.className).toMatch(/opacity-50/);
    expect(button.className).toMatch(/cursor-not-allowed/);
  });

  // --- Loading state ---

  it('shows a loading indicator when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('[aria-label="Loading"]')).toBeInTheDocument();
  });

  it('hides children text visually when loading', () => {
    render(<Button isLoading>Loading</Button>);
    // Children should be invisible but still in DOM for width stability
    const span = screen.getByText('Loading');
    expect(span.className).toMatch(/invisible/);
  });

  // --- className merge ---

  it('merges consumer className with internal classes via cn()', () => {
    render(<Button className="mt-4">Styled</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/mt-4/);
  });

  // --- Icons ---

  it('renders leftIcon before children text', () => {
    const icon = <svg data-testid="left-icon" aria-hidden="true" />;
    render(<Button leftIcon={icon}>With Icon</Button>);
    const button = screen.getByRole('button');
    const leftIcon = screen.getByTestId('left-icon');
    expect(button).toContainElement(leftIcon);
  });

  it('renders rightIcon after children text', () => {
    const icon = <svg data-testid="right-icon" aria-hidden="true" />;
    render(<Button rightIcon={icon}>With Icon</Button>);
    const button = screen.getByRole('button');
    const rightIcon = screen.getByTestId('right-icon');
    expect(button).toContainElement(rightIcon);
  });

  // --- Rest props passthrough ---

  it('passes through data-* and aria-* attributes', () => {
    render(
      <Button data-testid="custom" aria-label="Custom action">
        Action
      </Button>,
    );
    const button = screen.getByTestId('custom');
    expect(button).toHaveAttribute('aria-label', 'Custom action');
  });

  // --- Accessibility ---

  it('has visible focus ring styles on the element', () => {
    render(<Button>Focus me</Button>);
    // Focus ring is handled by :focus-visible in base.css,
    // but the button should not suppress outline
    const button = screen.getByRole('button');
    expect(button).not.toHaveStyle({ outline: 'none' });
  });
});
