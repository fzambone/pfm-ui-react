import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
  };

  // --- Portal rendering ---

  it('renders via a portal at the document body', () => {
    const { baseElement } = render(
      <div data-testid="parent">
        <Modal {...defaultProps}>
          <p>Modal content</p>
        </Modal>
      </div>,
    );
    // Modal should be in the body, not inside the parent div
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const parent = baseElement.querySelector('[data-testid="parent"]');
    expect(parent).not.toContainElement(dialog);
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal {...defaultProps} isOpen={false}>
        <p>Hidden</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // --- Focus management ---

  it('moves focus to the first focusable element when opened', async () => {
    render(
      <Modal {...defaultProps}>
        <button type="button">First button</button>
        <button type="button">Second button</button>
      </Modal>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /first button/i }),
      ).toHaveFocus();
    });
  });

  it('focuses the close button when no other focusable children exist', async () => {
    render(
      <Modal {...defaultProps}>
        <p>No focusable children here</p>
      </Modal>,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /close/i })).toHaveFocus();
    });
  });

  // --- Focus trapping ---

  it('traps focus: Tab from last element wraps to first', async () => {
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>,
    );
    // Wait for initial focus
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /first/i })).toHaveFocus();
    });
    // Tab to Last, then to Close (last focusable), then Tab should wrap to First
    await user.tab(); // → Last
    await user.tab(); // → Close button
    await user.tab(); // → wraps to First
    expect(screen.getByRole('button', { name: /first/i })).toHaveFocus();
  });

  it('traps focus: Shift+Tab from first element wraps to last', async () => {
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal>,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /first/i })).toHaveFocus();
    });
    // Shift+Tab from first should wrap to Close button (last focusable)
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: /close/i })).toHaveFocus();
  });

  // --- Escape key ---

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // --- Backdrop click ---

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    // Click the backdrop (the overlay div behind the dialog)
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      await user.click(backdrop);
    }
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the dialog', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Click me</p>
      </Modal>,
    );
    await user.click(screen.getByText('Click me'));
    expect(onClose).not.toHaveBeenCalled();
  });

  // --- Body scroll lock ---

  it('prevents body scroll when open', () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { unmount } = render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>,
    );
    unmount();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  // --- ARIA attributes ---

  it('has role="dialog" and aria-modal="true"', () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('announces title via aria-labelledby', () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    const labelId = dialog.getAttribute('aria-labelledby');
    const titleEl = document.getElementById(labelId ?? '');
    expect(titleEl?.textContent).toBe('Test Modal');
  });

  it('announces description via aria-describedby when provided', () => {
    render(
      <Modal {...defaultProps} description="This is a description">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-describedby');
    const descId = dialog.getAttribute('aria-describedby');
    const descEl = document.getElementById(descId ?? '');
    expect(descEl?.textContent).toBe('This is a description');
  });

  // --- className merge ---

  it('merges className onto the dialog panel', () => {
    render(
      <Modal {...defaultProps} className="max-w-2xl">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toMatch(/max-w-2xl/);
  });

  // --- Sizes ---

  it('renders sm size with narrow width', () => {
    render(
      <Modal {...defaultProps} size="sm">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toMatch(/max-w-sm/);
  });

  it('renders md size by default', () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toMatch(/max-w-lg/);
  });

  it('renders lg size with wide width', () => {
    render(
      <Modal {...defaultProps} size="lg">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toMatch(/max-w-2xl/);
  });
});
