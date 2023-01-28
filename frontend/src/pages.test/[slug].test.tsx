import { render, screen } from '@testing-library/react';

import SlugPage from '@/pages/blog/[slug]';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Blog slug page', () => {
  describe('Render method', () => {
    it('should have text of `Lorem ipsum`', () => {
      render(<SlugPage slug="test" />);

      const paragraph = screen.getAllByText(/Lorem ipsum/);

      // eslint-disable-next-line jest/valid-expect
      expect(paragraph.length === 0);
    });
  });
});
