# Contribution guide

Hi! Thanks for your interest in contributing to the project. Before contributing, make sure you read the contribution guide: it will help you get started with the repo, the tools used and the project workflow.

## 🔨 Repository setup

This repo uses [`pnpm`](https://pnpm.io) as package manager and is also compatible with [`Volta`](https://volta.sh/) as Node version manager.
It is also recommended you have [`Corepack`](https://nodejs.org/api/corepack.html) enabled.

To set the repository up:

| Step | Command |
|-------|--------|
| 1. Install [Node.js](https://nodejs.org/), using the [current or latest LTS](https://nodejs.org/en/about/releases/) | - |
| 2. Enable [Corepack](https://nodejs.org/api/corepack.html) | `corepack enable` |
| 3. Install [pnpm](https://pnpm.io) | `npm i -g pnpm` |
| 4. Install dependencies under the project root | `pnpm install` |

### Packages

The code is a monorepo where packages are located under `packages/` folder. You will find the base `plugin` and a `nuxt` module. Monorepo is managed through `pnpm`. Each package is released independently.

### Docs

Documentation lives under the `docs/` folder and is powered by [`vitepress`](https://vitepress.vuejs.org/).

## ⚡️ Commands

### `pnpm run build`

Builds the project for production into `dist/` using [`tsup`](https://tsup.egoist.sh/).

### `pnpm run test`

Runs tests using [Vitest](https://vitest.dev/).

There are also subcommands available:

- `pnpm run test:watch`: starts test in watch mode and reruns tests on code change.
- `pnpm run test:ui`: similar to watch-mode but with [a beautiful UI](https://vitest.dev/guide/ui.html).

### `pnpm run lint`

Runs [ESLint](https://eslint.org/) (and [Prettier](https:/prettier.io) as a plugin).
To resolve auto-fixable issues, run `pnpm run lint:fix`.

### `pnpm run coverage`

Generates code coverage based on a Vue3-specific tests run using into `coverage/`.

## 🙌 Submitting a pull request

### Discuss first

Before you start to work on a feature pull request, it's always better to open a feature request issue first to discuss whether the feature is desired/needed and how it could/should be implemented. This would help save time for both the maintainers and the contributors and help features to be shipped faster.

### Commit convention

This repo uses [Gitmoji](https://github.com/carloscuesta/gitmoji) because who doesn't appreciate some colors ? ☺️

It remains simple and straightforward:
```sh
git commit -m '<intention> <message>'
```
- `intention`: an emoji from [this list](https://gitmoji.dev/) corresponding to the change.
- `message`: a brief description of the change.

### The pull request

If it is your first time or you need help creating a PR, you can [read the GitHub guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

When submitting a pull request, make sure your PR's title also follows the [commit convention](#commit-convention).

If your PR fixes or resolves an existing issue, please link it in your PR description (replace `123` with a real issue number):

```md
fixes #123
```

Commits in the PR don't matter as they are [squashed and merged](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-pull-request-commits) into a single commit.

### Code quality and testing

To maintain this project's quality, make sure the [`build`](#pnpm-run-build), [`test`](#pnpm-run-test) run successfully on your machine before submitting the PR.

When adding new features and introducing new source code into the `core` of the plugin, try to add related test cases.
If you need help implementing them, you can specify it in the description and we will gladly help you doing so!
_Helpers such as the `/nuxt` don't need to be tested as they are just pre-configured plugins and rely on external tools/frameworks._

***

_**Thanks for reading the guide and happy contributing!**_
