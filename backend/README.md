# Backend (Fastify)

[![Deploy to Zeet](https://deploy.zeet.co/fastify.svg)](https://deploy.zeet.co/?url=https://github.com/BrycensRanch/Chatting-Platform)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2FBrycensRanch%2FChatting-Platform&plugins=redis)

## Notes

This project may be overloaded to the brim with dependencies, but this is the backend. I utilized these dependencies to make this project more friendly to use and to try and meet standards for a REST API. Since none of the dependencies are shipped to the browser, I believe it's irrelevant to the goals of this project.

## Project goals as a backend server

Stages:

✅ Caching at the database level.

✅ Statelessness

✅ Decoupled from the front end, in this project the backend server should be separate for advanced usage.

✅ Node-tap with ts-node-dev

✅ Error + performance reporting

✅ Security headers

✅ Push code faster and safer.

✅ Run GitHub Actions locally to give peace of mind. Walk away after all tests pass and [GitHub Actions run locally](https://github.com/nektos/act)

❌ Configuration lib?

❌ Versioned API endpoints

❌ All endpoints are nouns

❌ 100% test coverage

❌ GitHub badges

❌ OpenAPI documentation + types.

❌ GitHub Actions testing building + deployment into production.

❌ Semantic releases with changelog generation

❌ FULL Husky integration with other standards listed.

❌ [skip ci] GitHub Action

❌ GitHub issues templates, tags, and wiki documentation.

❌ .nvmrc, suggest the project's node version

❌ Only allow GitHub Actions runners to ssh into production with an ssh key.

❌ CONTRIBUTING.md

## Features

👀 ESLint + Prettier ran before commits with Husky

🐳 Docker support for local development testing to emulate production!

💿 Redis support, share cache between different processes!

🏄‍♂️ Commitlint, Commitizen support.

😎 Simple Passwordless authentication with SuperTokens.io.

🔮 Powered by Prisma.io

👾 PM2 Clustered support, out of the box.

🌋 Track errors/App performance with Sentry.io

## Explanation of dependencies

This project was bootstrapped with Fastify-CLI.
As such, our testing framework is Node-Tap.
While I'd love to use Jest as our test framework for consistency, this type of configuration should be more appropriate for Fastify.

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

To start the app in dev mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

### `pnpm build`

To build the backend server

### `npm start`

For production mode

### `pnpm test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).
