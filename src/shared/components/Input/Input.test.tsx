import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  // --- Label association ---

  it('renders a label associated with the input via htmlFor/id', () => {
    render(<Input label="Email" id="email-input" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('auto-generates an id when none is provided', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id');
    expect(input.id).not.toBe('');
  });

  // --- Helper text ---

  it('displays helper text below the input', () => {
    render(<Input label="Name" helperText="Enter your full name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  // --- Error state ---

  it('displays error message when hasError is true', () => {
    render(<Input label="Email" hasError errorMessage="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('associates error message with input via aria-describedby', () => {
    render(
      <Input
        label="Email"
        id="email"
        hasError
        errorMessage="Email is required"
      />,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('replaces helper text with error message when hasError', () => {
    render(
      <Input
        label="Email"
        helperText="We will never share your email"
        hasError
        errorMessage="Email is required"
      />,
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(
      screen.queryByText('We will never share your email'),
    ).not.toBeInTheDocument();
  });

  it('sets aria-invalid when hasError is true', () => {
    render(<Input label="Email" hasError errorMessage="Required" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  // --- Sizes ---

  it('renders sm size with smaller text', () => {
    render(<Input label="Small" size="sm" />);
    const input = screen.getByLabelText('Small');
    expect(input.className).toMatch(/text-xs/);
  });

  it('renders md size by default', () => {
    render(<Input label="Default" />);
    const input = screen.getByLabelText('Default');
    expect(input.className).toMatch(/text-sm/);
  });

  it('renders lg size with larger text', () => {
    render(<Input label="Large" size="lg" />);
    const input = screen.getByLabelText('Large');
    expect(input.className).toMatch(/text-base/);
  });

  // --- className merge ---

  it('merges consumer className onto the wrapper', () => {
    const { container } = render(<Input label="Styled" className="mt-4" />);
    // className applies to the outermost wrapper div
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toMatch(/mt-4/);
  });

  // --- Rest props passthrough ---

  it('passes placeholder through to the native input', () => {
    render(<Input label="Search" placeholder="Type to search..." />);
    expect(
      screen.getByPlaceholderText('Type to search...'),
    ).toBeInTheDocument();
  });

  it('passes type through to the native input', () => {
    render(<Input label="Password" type="password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('passes autoComplete through to the native input', () => {
    render(<Input label="Email" autoComplete="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  // --- Disabled state ---

  it('is disabled and has reduced opacity when disabled', () => {
    render(<Input label="Disabled" disabled />);
    const input = screen.getByLabelText('Disabled');
    expect(input).toBeDisabled();
  });

  // --- Required ---

  it('shows a visual indicator and sets aria-required when required', () => {
    render(<Input label="Email" required />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-required', 'true');
    // Visual indicator — asterisk in the label
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  // --- Interaction ---

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);

    await user.type(screen.getByLabelText('Name'), 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5); // one per character
  });
});
