# Frontend (Next.js)

## Planned project dependencies

- Tailwind
- DaisyUI
- Next SEO
- Simple Analytics
- Sentry JDK for JavaScript
- SuperTokens
- Testing Library & Jest (Unit testing)
- Cypress (End to End testing)


### Features

Developer experience first:

- ⚡ [Next.js](https://nextjs.org) for Static Site Generator
- 🔥 Type checking [TypeScript](https://www.typescriptlang.org)
- 💎 Integrate with [Tailwind CSS](https://tailwindcss.com)
- ✅ Strict Mode for TypeScript and React 18
- 📏 Linter with [ESLint](https://eslint.org) (default NextJS, NextJS Core Web Vitals, Tailwind CSS and Airbnb configuration)
- 💖 Code Formatter with [Prettier](https://prettier.io)
- 🦊 Husky for Git Hooks
- 🚫 Lint-staged for running linters on Git staged files
- 🚓 Lint git commit with Commitlint
- 📓 Write standard compliant commit messages with Commitizen
- 🦺 Unit Testing with Jest and React Testing Library
- 🧪 E2E Testing with Cypress
- 💡 Absolute Imports using `@` prefix
- 🗂 VSCode configuration: Debug, Settings, Tasks and extension for PostCSS, ESLint, Prettier, TypeScript, Jest
- 🤖 SEO metadata, JSON-LD and Open Graph tags with Next SEO
- ⚙️ [Bundler Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- 🖱️ One click deployment with Vercel or Netlify (or manual deployment to any hosting services)
- 🌈 Include a FREE minimalist theme
- 💯 Maximize lighthouse score

Built-in feature from Next.js:

- ☕ Minify HTML & CSS
- 💨 Live reload
- ✅ Cache busting

### Requirements

- Node.js 14+ and npm

### Getting started

Run the following command on your local environment:

```shell
git clone --depth=1 https://github.com/BrycensRanch/ChattingPlatform.git ChattingPlatform
cd ChattingPlatform
cd frontend
```

Then, you can run locally in development mode with live reload:

```shell
npm run dev
```

Open <http://localhost:3000> with your favorite browser to see your project.

```shell
.
├── README.md                       # README file
├── __mocks__                       # Mocks for testing
├── .husky                          # Husky configuration
├── .vscode                         # VSCode configuration
├── public                          # Public assets folder
├── src
│   ├── layouts                     # Layouts components
│   ├── pages                       # Next JS Pages
│   ├── pages.test                  # Next JS Pages tests (this avoid test to treated as a Next.js pages)
│   ├── styles                      # Styles folder
│   ├── templates                   # Default template
│   └── utils                       # Utility functions
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

### Customization

You can easily configure Next js Boilerplate. Please change the following file:

- `public/apple-touch-icon.png`, `public/favicon.ico`, `public/favicon-16x16.png` and `public/favicon-32x32.png`: your website favicon, you can generate from https://favicon.io/favicon-converter/
- `src/styles/global.css`: your CSS file using Tailwind CSS
- `src/utils/AppConfig.ts`: configuration file
- `src/templates/Main.tsx`: default theme

### Deploy to production

You can see the results locally in production mode with:

```shell
$ npm run build
$ npm run start
```

The generated HTML and CSS files are minified (built-in feature from Next js). It will also removed unused CSS from [Tailwind CSS](https://tailwindcss.com).

You can create an optimized production build with:

```shell
npm run build-prod
```

Now, your blog is ready to be deployed. All generated files are located at `out` folder, which you can deploy with any hosting service.

### Testing

All tests are colocated with the source code inside the same directory. So, it makes it easier to find them. Unfortunately, it is not possible with the `pages` folder which is used by Next.js for routing. So, what is why we have a `pages.test` folder to write tests from files located in `pages` folder.


### VSCode information (optional)

If you are VSCode users, you can have a better integration with VSCode by installing the suggested extension in `.vscode/extension.json`. The starter code comes up with Settings for a seamless integration with VSCode. The Debug configuration is also provided for frontend and backend debugging experience.

With the plugins installed on your VSCode, ESLint and Prettier can automatically fix the code and show you the errors. Same goes for testing, you can install VSCode Jest extension to automatically run your tests and it also show the code coverage in context.

## Philosophy

We're always looking for ways to make the project more lightweight for performance. We also focus on quick development with stable and reliable code tested by our CI. (GitHub Actions)

## Project goals as a backend server

Stages:

✅ Decoupled from the back end, in this project the frontend should be seperate.

✅ Testing with Jest, simple and great for React projects.

✅ Error + performance reporting

✅ Security headers

✅ SEO

✅ Push code faster and safer.

✅ Clustered SSR with PM2 & server.js CUSTOM server even in DOCKER!!!

❌ Run GitHub Actions locally to give peace of mind. Walk away after all tests pass and [GitHub Actions run locally](https://github.com/nektos/act)

❌ Configuration lib?

❌ Sitemap generation

❌ Next-boost with Redis to cache SSR pages

❌ 100% test coverage

❌ GitHub badges

❌ GitHub Actions testing building + deployment into production.

❌ Semantic releases with changelog generation

❌ FULL Husky integration with other standards listed.

❌ [skip ci] GitHub Action

❌ GitHub PR checking with comments & Lighthouse.

❌ GitHub issues templates, tags, and wiki documentation.

❌ .nvmrc, suggest the project's node version

❌ Only allow GitHub Actions runners to ssh into production with an ssh key.

❌ CONTRIBUTING.md

## Features

👀 ESLint + Prettier ran before commits with Husky

🐳 Docker support for local development testing to emulate production! (Unless you're a weirdo that runs Docker in production)

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

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

### `npm run build`

To build the backend server

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).


### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug.

### License

Licensed under the MIT License, Copyright © 2023

See [LICENSE](../LICENSE) for more information.

