export default function handler(req, res) {
  res.status(200).json({
    statusCode: 200,
    status: 'ok',
    uptime: process.uptime(),
    'req-id': req.id,
    'cluster-id': process.env.NODE_APP_INSTANCE || '0',
  });
}
