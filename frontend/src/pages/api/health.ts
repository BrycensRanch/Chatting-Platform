import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    statusCode: 200,
    status: 'ok',
    uptime: process.uptime(),
    'cluster-id': process.env.NODE_APP_INSTANCE || '0',
  });
}
