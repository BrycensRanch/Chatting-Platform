import { test } from 'tap';

import { build } from '../helper';

test('health route', async (t) => {
  const app = await build(t);
  await app.listen()
  t.strictSame(JSON.parse(res.payload)['cluster-id'], process.env.NODE_APP_INSTANCE || '0');
});