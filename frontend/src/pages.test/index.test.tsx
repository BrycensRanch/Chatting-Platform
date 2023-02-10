import { cleanup, render, screen, waitFor } from '@testing-library/react';
import fetch from 'jest-mock-fetch';

import Index from '@/pages/index';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: () => ({
    query: {},
    pathname: '/',
    asPath: '/',
    events: {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
    push: jest.fn(() => Promise.resolve(true)),
    prefetch: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
  }),
}));

afterEach(() => {
  // cleaning up the mess left behind the previous test
  fetch.reset();
  cleanup();
  jest.restoreAllMocks();
});

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Index page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Render method', () => {
    it('should have h1 tag', async () => {
      render(<Index />);

      const heading = screen.getByRole('heading', {
        name: /Rooms:/,
      });
      await waitFor(() => {
        expect(heading).toBeInTheDocument();
      });
    });

    it('should have room notification', async () => {
      render(<Index />);

      const rooms = screen.getByTestId('roomNotification');
      await waitFor(() => {
        expect(rooms).toBeInTheDocument();
      });
    });

    it('should have loading status', async () => {
      render(<Index />);

      const loadingStatus = screen.getByTestId('isLoading');
      await waitFor(() => {
        expect(loadingStatus).toHaveTextContent('Loading...');
      });
    });
  });
});
