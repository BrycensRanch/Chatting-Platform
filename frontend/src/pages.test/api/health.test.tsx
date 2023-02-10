/* eslint-disable no-underscore-dangle */
import { createMocks } from 'node-mocks-http';

import healthAPI from '../../pages/api/health';

describe('/api/health', () => {
  describe('request health status', () => {
    it('should give process cluster id', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });
      await healthAPI(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          'cluster-id': '0',
        })
      );
    });
  });
});
