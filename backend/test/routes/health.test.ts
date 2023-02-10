import { test } from 'tap';

import { build } from '../helper';

test('health route', async (t) => {
  const app = await build(t);
  const res = await app.inject({
    url: '/v1/health',
  });
  t.strictSame(JSON.parse(res.payload)['cluster-id'], process.env.NODE_APP_INSTANCE || '0');
});