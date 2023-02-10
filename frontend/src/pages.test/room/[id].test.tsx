import { render, screen, waitFor } from '@testing-library/react';
import fetch from 'jest-mock-fetch';

import Room from '@/pages/room/[id]';

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
});

const mediaDevicesMock = jest.fn(async () => {
  return new Promise<void>((resolve) => {
    resolve();
  });
});

beforeEach(() => {
  Object.defineProperty(global.navigator, 'permissions', {
    value: {
      query: jest.fn(),
    },
  });
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      enumerateDevices: mediaDevicesMock,
    },
  });
});

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Index page', () => {
  describe('Render method', () => {
    it('should have message box', async () => {
      render(
        <Room
          query={{
            id: 'testing',
          }}
        />
      );
      fetch.mockResponse();
      const message = screen.getByTestId('message');

      await waitFor(() => {
        expect(message).toBeInTheDocument();
      });
    });
  });
});
