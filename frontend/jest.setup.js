/* eslint-disable import/no-extraneous-dependencies */
// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// eslint-disable-next-line no-undef
global.setImmediate = jest.useRealTimers;
global.fetch = require('jest-mock-fetch').default;

// require('jest-fetch-mock').enableMocks();
// eslint-disable-next-line no-undef
