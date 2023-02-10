/* eslint-disable import/no-extraneous-dependencies */
const { defineConfig } = require('cypress');
const codeCoverageTask = require('@cypress/code-coverage/task');
// eslint-disable-next-line import/no-unresolved
const { loadEnvConfig } = require('@next/env');

const { combinedEnv } = loadEnvConfig(process.cwd());

module.exports = defineConfig({
  env: Object.assign(combinedEnv, {
    env: {
      codeCoverage: {
        url: '/api/__coverage__',
        exclude: 'cypress/**/*.*',
      },
    },
  }),
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },
  },
});
