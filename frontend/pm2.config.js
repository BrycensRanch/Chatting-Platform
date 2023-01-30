// const os = require('os');

// const cpuCount = os.cpus().length;

module.exports = {
  apps: [
    // Main Application
    {
      name: 'ChatFrontend',
      script: './server.js',
      instances: 3,
      exec_mode: 'cluster',
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
