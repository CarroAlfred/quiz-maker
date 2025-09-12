import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonList } from './list';

describe('SkeletonList suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders the default number of skeleton items', () => {
    render(<SkeletonList />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(5); // default count
  });

  it('renders the specified number of skeleton items', () => {
    render(<SkeletonList count={3} />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('renders skeleton lines inside each item', () => {
    render(<SkeletonList count={2} />);
    const items = screen.getAllByRole('listitem');
    items.forEach((item) => {
      const shortLine = item.querySelector('.skeleton-line.short');
      const longLine = item.querySelector('.skeleton-line.long');
      expect(shortLine).toBeInTheDocument();
      expect(longLine).toBeInTheDocument();
    });
  });
});
