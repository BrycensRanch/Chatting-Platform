// all of these are the default values...
require('dotenv-expand').expand(require('dotenv-mono').load());

require('dotenv-expand').expand(
  require(`dotenv-defaults`).config({
    path: './.env',
    encoding: 'utf8',
    defaults: './.env.example', // This is new
  })
);

const frontendPort = process.env.FRONTEND_PORT || process.env.PORT || 3000;

const backendPort =
  process.env.BACKEND_PORT ||
  process.env.FASTIFY_PORT ||
  process.env.PORT ||
  8000;

const frontendServerURL = new URL(
  process.env.GITPOD_WORKSPACE_URL &&
  process.env.FRONTEND_SERVER.includes('localhost')
    ? new URL(
        `https://${frontendPort}-${
          new URL(process.env.GITPOD_WORKSPACE_URL).hostname
        }`
      )
    : process.env.FRONTEND_SERVER || `http://localhost:${frontendPort}`
).origin;
const backendServerURL = new URL(
  process.env.GITPOD_WORKSPACE_URL &&
  process.env.NEXT_PUBLIC_BACKEND_SERVER.includes('localhost')
    ? new URL(
        `https://${backendPort}-${
          new URL(process.env.GITPOD_WORKSPACE_URL).hostname
        }`
      )
    : process.env.NEXT_PUBLIC_BACKEND_SERVER ||
      `http://localhost:${backendPort}`
).origin;
// const frontendServerURL =

module.exports = {
  frontendServerURL,
  backendServerURL,
  frontendPort,
  backendPort,
};
