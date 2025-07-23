# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## System prerequisites

- Node v20.14.x installed
- Yarn global installed

## 🚀 Libaries

- ✌️ [Nuxt 3](https://nuxt.com/)
- 🦾 TypeScript with Composition API
- ✨ [Nuxt UI](https://ui.nuxt.com/)
- 🌏 [Nuxt/i18n](https://i18n.nuxtjs.org/) for internationalization.
- 💎 Store [Pinia](https://pinia.vuejs.org/ssr/nuxt.html)
- 🐶 Eslint, style lint, prettier, lint-staged & husky.
- 🐳 Docker / Docker compose

## Development Setup

Dont forget to create the .env file.

```bash
cp .env.example .env
```

Make sure to install the dependencies:

```bash

# install dependencies
$ yarn install

# run with hot reload at localhost:3001
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```

## Commit

- Run `yarn prepare` to install the [husky](https://github.com/typicode/husky#usage) `pre-commit` git hook.
- By default the `lint-staged` command will be excute before committing.

- This project uses [Commitlint](https://github.com/conventionalcommit/commitlint) to enforce consistent commit message conventions. By ensuring that commit messages follow a specified format, we can maintain a clean and readable Git history, which is crucial for collaboration and project maintenance.

  #### Common commit types:

  ```
  $ feat: A new feature
  $ fix: A bug fix
  $ docs: Documentation changes
  $ style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
  $ refactor: A code change that neither fixes a bug nor adds a feature
  $ perf: A code change that improves performance
  $ test: Adding missing tests or correcting existing tests
  $ chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
  ```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run start

# pnpm
pnpm run start

# yarn
yarn start

# bun
bun run start
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
