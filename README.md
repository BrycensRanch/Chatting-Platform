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
    <a aria-label="Frontend Build Status" href="https://github.com/BrycensRanch/Chatting-Platform/actions?query=workflow%3ci-backend.yml">
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/BrycensRanch/Chatting-Platform/ci-backend.yml?label=BACKEND&logo=github&style=for-the-badge">
  </a>
  <a aria-label="Codefactor grade" href=https://www.codefactor.io/repository/github/BrycensRanch/Chatting-Platform">
    <img alt="Codefactor" src="https://img.shields.io/codefactor/grade/github/BrycensRanch/Chatting-Platform?label=Codefactor&logo=codefactor&style=for-the-badge&labelColor=000000" />
  </a>
  <a aria-label="CodeClimate maintainability" href="https://codeclimate.com/github/BrycensRanch/Chatting-Platform">
    <img alt="Maintainability" src="https://img.shields.io/codeclimate/maintainability/BrycensRanch/Chatting-Platform?label=Maintainability&logo=code-climate&style=for-the-badge&labelColor=000000" />
  </a>
  <a aria-label="CodeClimate technical debt" href="https://codeclimate.com/github/BrycensRanch/Chatting-Platform">
    <img alt="Techdebt" src="https://img.shields.io/codeclimate/tech-debt/BrycensRanch/Chatting-Platform?label=TechDebt&logo=code-climate&style=for-the-badge&labelColor=000000" />
  </a>
  <a aria-label="Codacy grade" href="https://www.codacy.com/gh/BrycensRanch/Chatting-Platform/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=BrycensRanch/Chatting-Platform&amp;utm_campaign=Badge_Grade">
    <img alt="Codacy grade" src="https://img.shields.io/codacy/grade/dff9c944af284a0fad4e165eb1727467?logo=codacy&style=flat-square&labelColor=000&label=Codacy">
  </a>
  <a aria-label="LoC">  
    <img alt="LoC" src="https://img.shields.io/tokei/lines/github/BrycensRanch/Chatting-Platform?style=for-the-badge&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/BrycensRanch/Chatting-Platform/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/BrycensRanch/Chatting-Platform?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/BrycensRanch/Chatting-Platform/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/BrycensRanch/Chatting-Platform?style=for-the-badge&labelColor=000000" />
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
