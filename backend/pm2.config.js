// const os = require('os');

// const cpuCount = os.cpus().length;

module.exports = {
  apps: [
    // Main Application
    {
      name: 'ChatBackend',
      script: process[Symbol.for('ts-node.register.instance')]
        ? 'app.ts'
        : './dist/app.js',
      instances: 2,
      exec_mode: 'cluster',
      exp_backoff_restart_delay: 100,
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
