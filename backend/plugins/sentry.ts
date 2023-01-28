import type { SentryPluginOptions } from '@immobiliarelabs/fastify-sentry';
import sentry from '@immobiliarelabs/fastify-sentry';
import type { FastifyTypeProviderDefault, RawServerDefault } from 'fastify';
import fp from 'fastify-plugin';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

/**
 * This plugin enables the fastify sentry plugin to track performance & error messages
 *
 * @see https://github.com/immobiliare/fastify-sentry
 */
export default fp<
  SentryPluginOptions,
  RawServerDefault,
  FastifyTypeProviderDefault
>(async (fastify) => {
  fastify.register(sentry, {
    dsn:
      SENTRY_DSN ||
      'https://443b778a8d7d4e4cbd108e3b0fe0a29f@o4504136997928960.ingest.sentry.io/4504147621904384',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    setErrorHandler: false,
  });
});
