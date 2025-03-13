# Contribution guide

Hi! Thanks for your interest in contributing to the project. Before contributing, make sure you read the contribution guide: it will help you get started with the repo, the tools used and the project workflow.

> [!IMPORTANT]
> I try to maintain this project as much as I can, but sometimes issues and PRs may take some time before being considered. Thank you for being patient!

## Repository setup

This repo uses [`pnpm`](https://pnpm.io) as package manager.
It is also recommended you have [`Corepack`](https://nodejs.org/api/corepack.html) enabled.

To set the repository up:

| Step                                                                                                                | Command           |
| ------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1. Install [Node.js](https://nodejs.org/), using the [current or latest LTS](https://nodejs.org/en/about/releases/) | -                 |
| 2. Enable [Corepack](https://nodejs.org/api/corepack.html)                                                          | `corepack enable` |
| 3. Install [pnpm](https://pnpm.io)                                                                                  | `npm i -g pnpm`   |
| 4. Install dependencies under the project root                                                                      | `pnpm install`    |

## Repository structure

All of the plugin (and Nuxt module) source code lives under the `src/` folder. The plugin is built "Nuxt first" with a Vue-only plugin built aside.

### Core

The core logic of persistence and hydration is located in `src/runtime/core.ts` and types are located in `src/runtime/`

### Nuxt module

The Nuxt module is defined in `src/module.ts` with (auto-imported) runtime code located in `src/runtime/`.

### Vue-only plugin

The standalone Pinia plugin for Vue-only apps is exported from `src/index.ts`.

### Playground

A playground in the form of a Nuxt app is located in `playground` and serves as the development platform for the plugin/module.

### Docs

Documentation lives under the `docs/` folder and is powered by [`vitepress`](https://vitepress.vuejs.org/).

## Commands

### `pnpm run dev`

Runs the Nuxt playground as a dev server with the Nuxt module loaded.

### `pnpm run build`

Builds the package for production into `dist/` using:

- [`@nuxt/module-builder`](https://github.com/nuxt/module-builder/) for the Nuxt module.
- [`tsup`](https://tsup.egoist.dev/) for the standalone plugin.
- [`rollup`](https://rollupjs.org/) for the UMD build of the standalone plugin.

Subcommands are available to build parts separately.

### `pnpm run lint`

Runs [ESLint](https://eslint.org/). Also servers as formatter through [Stylistic](https://eslint.style/).
To resolve auto-fixable issues, run `pnpm run lint:fix`.

### `pnpm run docs`

Runs the `vitepress` dev server for the documentation website.
Use `pnpm run docs:build` to generate a production build of the documentation.

## 🙌 Submitting a pull request

### Discuss first

Before you start to work on a feature pull request, it's always better to open a feature request issue first to discuss whether the feature is desired/needed and how it could/should be implemented. This would help save time for both the maintainers and the contributors and help features to be shipped faster.

### Commit convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org).

```sh
git commit -m '<type>: <description>'
```

- `type`: the kind of change to commit (fix, feat, docs...).
- `description`: a brief description of the change.

### The pull request

If it is your first time or you need help creating a PR, you can [read the GitHub guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

When submitting a pull request, make sure your PR's title also follows the [commit convention](#commit-convention).

If your PR fixes or resolves an existing issue, please link it in your PR description (replace `123` with a real issue number):

```md
fixes #123
```

Commits in the PR don't matter as they are [squashed and merged](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-pull-request-commits) into a single commit.

---

_**Thanks for reading the guide and happy contributing!**_
