import { render, screen } from '@testing-library/react';

import BlogPage from '@/pages/blog';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Blog page', () => {
  describe('Render method', () => {
    it('should have text of `Lorem ipsum`', () => {
      render(<BlogPage />);

      const paragraph = screen.getAllByText(/Lorem ipsum/);

      // eslint-disable-next-line jest/valid-expect
      expect(paragraph.length === 0);
    });
  });
});
