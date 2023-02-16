/* eslint-disable import/no-anonymous-default-export */
// all of these are the default values...
// import { expand } from 'dotenv-expand';

// expand(require('dotenv-mono').load());

// expand(
//   require(`dotenv-defaults`).config({
//     path: './.env',
//     encoding: 'utf8',
//     defaults: './.env.example', // This is new
//   })
// );

export const frontendPort = Number(
  process.env.FRONTEND_PORT || process.env.PORT || 3000
);

export const backendPort = Number(
  process.env.BACKEND_PORT ||
    process.env.FASTIFY_PORT ||
    process.env.PORT ||
    8000
);

export const frontendServerURL = new URL(
  process.env.GITPOD_WORKSPACE_URL &&
  process.env.FRONTEND_SERVER?.includes('localhost')
    ? new URL(
        `https://${frontendPort}-${
          new URL(process.env.GITPOD_WORKSPACE_URL).hostname
        }`
      )
    : process.env.FRONTEND_SERVER || 'http://localhost:3000'
).origin;
export const backendServerURL = new URL(
  process.env.GITPOD_WORKSPACE_URL &&
  process.env.NEXT_PUBLIC_BACKEND_SERVER?.includes('localhost')
    ? new URL(
        `https://${backendPort}-${
          new URL(process.env.GITPOD_WORKSPACE_URL).hostname
        }`
      )
    : process.env.NEXT_PUBLIC_BACKEND_SERVER ||
      `http://localhost:${backendPort}`
).origin;
// const frontendServerURL =