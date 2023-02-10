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
  if (SENTRY_DSN) {
    fastify.register(sentry, {
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      setErrorHandler: false,
    });
  } else {
    console.log(
      'did not load sentry because no sentry_dsn environment variable was provided'
    );
  }
});
