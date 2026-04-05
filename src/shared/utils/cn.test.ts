import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('resolves conflicting Tailwind classes by keeping the last one', () => {
    const result = cn('px-4 bg-primary', 'px-6');
    expect(result).toBe('bg-primary px-6');
  });

  it('ignores falsy values (undefined, false, empty string)', () => {
    const result = cn('text-sm', undefined, false, 'font-bold');
    expect(result).toBe('text-sm font-bold');
  });

  it('passes through custom design token classes without stripping them', () => {
    const result = cn('bg-surface', 'text-foreground', 'shadow-glass');
    expect(result).toBe('bg-surface text-foreground shadow-glass');
  });

  it('handles empty string inputs gracefully', () => {
    const result = cn('', '', 'text-sm');
    expect(result).toBe('text-sm');
  });

  it('returns empty string when called with no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('merges conditional class objects from clsx', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn('base-class', {
      'active-class': isActive,
      'disabled-class': isDisabled,
    });
    expect(result).toBe('base-class active-class');
  });

  it('resolves complex multi-conflict scenarios', () => {
    const result = cn(
      'p-4 text-sm text-foreground rounded-card',
      'p-6 text-lg',
    );
    expect(result).toBe('text-foreground rounded-card p-6 text-lg');
  });
});
