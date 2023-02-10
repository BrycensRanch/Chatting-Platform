import { test } from 'tap';

import { build } from '../helper';

test('socket new route', async (t) => {
  const app = await build(t);
  const res = await app.inject({
    url: '/v1/socket/new',
  });
  t.strictSame(res.payload, "new socket");
});