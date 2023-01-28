// const os = require('os');

// const cpuCount = os.cpus().length;

module.exports = {
  apps: [
    // Main Application
    {
      name: 'ChatBackend',
      script: './dist/app.js',
      instances: 2,
      exec_mode: 'cluster',
    },
  ],
};
