// const os = require('os');

// const cpuCount = os.cpus().length;

module.exports = {
  apps: [
    {
      name: 'ChatTester',
      script: './testPuppeteer.js',
      ignore_watch: [
        'node_modules',
        'cypress',
        'cypress-coverage',
        'jest-coverage',
        '.next',
        'src',
        'public',
        'coverage',
        '.nyc_output',
      ],
    },
  ],
};
