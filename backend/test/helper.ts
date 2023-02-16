// This file contains code that we reuse between our tests.
// eslint-disable-next-line import/extensions
import * as path from 'path';
import type * as tap from 'tap';

// eslint-disable-next-line import/extensions
const helper = require('fastify-cli/helper.js');

export type Test = typeof tap['Test']['prototype'];

const AppPath = path.join(__dirname, '..', 'init.ts');

// Fill in this config with all the configurations
// needed for testing the application
const config = async () => {
  return {};
};

// Automatically build and tear down our instance
const build = async (t: Test) => {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, await config());

  // Tear down our app after we are done
  t.teardown(() => void app.close());

  return app;
};

export { build, config };
