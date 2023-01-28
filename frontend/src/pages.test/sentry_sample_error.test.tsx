// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';

import SentrySampleError from '@/pages/sentry_sample_error';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Sentry Error page', () => {
  describe('Render method', () => {
    it('should have h1 tag', () => {
      render(<SentrySampleError />);

      const heading = screen.getByRole('button', {
        name: /Throw error/,
      });

      expect(heading).toBeInTheDocument();
    });
  });
});
