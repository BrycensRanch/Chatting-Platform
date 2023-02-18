import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import Medal from './Medal';
// eslint-disable-next-line import/no-extraneous-dependencies
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
  cleanup();
  jest.restoreAllMocks();
});

describe('Medal component', () => {
  describe('Render method', () => {
    it('medal should NOT render right away', async () => {
      const title = 'Random title';
      const body = 'Random description';
      render(<Medal initialValue={false} title={title} body={body} />);
      await fireEvent.click(screen.getByTestId('medal-button1'));
      await waitFor(() => {
        const medalTitle = screen.getByTestId('medal-title');
        expect(medalTitle).toHaveTextContent(title);
      });
      // dismiss button
      await fireEvent.click(screen.getByTestId('medal-button3'));
      // medal is gone
      // eslint-disable-next-line testing-library/no-await-sync-query, testing-library/prefer-presence-queries
      // expect(screen.getByText('Close')).not.toBeInTheDocument();
    });

    it('medal should render right away', async () => {
      const title = 'Random title2';
      const body = 'Random description2';
      render(<Medal initialValue={true} title={title} body={body} />);
      const medalTitle = screen.getByTestId('medal-title');
      expect(medalTitle).toHaveTextContent(title);

      // dismiss button
      await fireEvent.click(screen.getByTestId('medal-button3'));
      // medal is gone
      // eslint-disable-next-line testing-library/no-await-sync-query, testing-library/prefer-presence-queries
      // expect(screen.getByText('Close')).not.toBeInTheDocument();
    });

    it('medal should render right away and close', async () => {
      const title = 'Random title2';
      const body = 'Random description2';
      render(<Medal initialValue={true} title={title} body={body} />);
      const medalTitle = screen.getByTestId('medal-title');
      expect(medalTitle).toHaveTextContent(title);

      // dismiss button
      await fireEvent.click(screen.getByTestId('medal-button2'));
      // medal is gone
      // eslint-disable-next-line testing-library/no-await-sync-query, testing-library/prefer-presence-queries
      // expect(screen.getByText('Close')).not.toBeInTheDocument();
    });
  });
});
