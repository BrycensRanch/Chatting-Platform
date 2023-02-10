# 👷‍♂️🏗️ Chatting Platform (WIP) 🚧👷

- "Make it **work**, make it **right**, make it **fast**" - *Kent Beck*
- "The function of **good software** is to **make** the **complex** appear to be **simple**." - *Grady Booch*

> Being built with love with modernity in mind.

<p align="center">
  </a>
    <a aria-label="Commitizen" href="https://commitizen.github.io/cz-cli/">
    <img alt="Commitizen Friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge">

  </a>
  <a aria-label="Semantic Release" href="https://github.com/semantic-release/semantic-release">
    <img alt="Semantic Release Badge" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge">

  <a aria-label="Frontend Build Status" href="https://github.com/BrycensRanch/Chatting-Platform/actions?query=workflow%3ci-frontend.yml">
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/BrycensRanch/Chatting-Platform/ci-frontend.yml?label=FRONTEND&logo=github&style=for-the-badge">
  </a>
    <a aria-label="Backend Build Status" href="https://github.com/BrycensRanch/Chatting-Platform/actions?query=workflow%3ci-backend.yml">
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/BrycensRanch/Chatting-Platform/ci-backend.yml?label=BACKEND&logo=github&style=for-the-badge">
  </a>
  <a aria-label="Frontend Code Coverage" href="https://github.com/BrycensRanch/Chatting-Platform/actions?query=workflow%3ci-backend.yml">
<img alt="Codecov" src="https://img.shields.io/codecov/c/github/BrycensRanch/Chatting-Platform?flag=unittests&label=FRONTEND%20UNIT%20TESTS%20COVERAGE&logo=codecov&style=for-the-badge">
  </a>
    <a aria-label="Backend Code Coverage" href="https://github.com/BrycensRanch/Chatting-Platform/actions?query=workflow%3ci-backend.yml">
<img alt="Coveralls" src="https://img.shields.io/coverallsCoverage/github/BrycensRanch/Chatting-Platform?label=BACKEND%20UNIT%20tests%20COVERAGE&style=for-the-badge">
  </a>
  <a aria-label="Licence" href="https://github.com/BrycensRanch/Chatting-Platform/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/BrycensRanch/Chatting-Platform?style=for-the-badge&labelColor=000000" />
  </a>
    <a aria-label=“CodeFactor Grade” href=“https://www.codefactor.io/repository/github/brycensranch/chatting-platform”>
  <img alt=“CodeFactor Grade” src=“https://img.shields.io/codefactor/grade/github/BrycensRanch/Chatting-Platform?style=for-the-badge” />
  </a>
</p>

## Project Goals

- Voice calling
- Messages with Tenor GIFs built in, along with images stored on the server.
- Authentication with SuperTokens
- Video calls with screen sharing using WASM
- Fastify API that generates types and schemas and OpenAPI Specification files for the VSCode extension I'm using
- Basic message encryption end to end?
- Record content while in a call, like Google Meets, but clientside!
- Switch to pnpm since a certain someone likes to run `npm install` a lot more than they should

### Planned Technology Stack

- WebRTC TypeScript
- FFMPEG WASM (Resource intensive, maybe allow a server recording option?, likely requires modern hardware & browser, such as Microsoft Edge `:troll:`)
- TypeScript (project-wide)
- Next.js (Frontend)
- Fastify (Backend)
- Jest (Frontend)
- Tap (Backend)
- Redoc (Public Enduser API documentation)
- React Native Web/Tauri/Solito (Desktop/mobile?)
- tRPC (project-wide types)
- Simple Analytics
- [Sentry.io](https://sentry.io)

### Features

N/A, just starting off the project... Initial commit type flow.

## Docker

This project ships a Docker Compose setup for **testing purposes**, if I were you, I would **never use it in production**. Instead, normally install Fail2Ban, CrowdSec, Postgres, Nginx, SuperTokens, NodeJS, `pnpm`, and Redis on a Linux machine like a regular person and configure it yourself. We have a config for Nginx for ease of deployment.

### Demo

no

## READMEs (more info on the separate projects)

- [Frontend](./frontend/README.md)
- [Backend](./backend/README.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to add tests as appropriate. In-depth ones, not one that checks if 1 + 1 === 2.

Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting any pull requests or opening issues.

## License

[MIT](./LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FBrycensRanch%2FChatting-Platform.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FBrycensRanch%2FChatting-Platform?ref=badge_large)
