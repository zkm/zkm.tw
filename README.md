# 🚀 [zkm.tw — Portfolio](https://zkm.tw)

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer%20Motion-14-black?logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Chart.js-4-orange?logo=chartdotjs" alt="Chart.js" />
</p>

<p align="center">
  <a href="https://github.com/zkm/zkm.tw/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/zkm/zkm.tw/ci.yml?branch=master&label=CI&logo=githubactions&logoColor=white" alt="CI" /></a>
  <a href="https://github.com/zkm/zkm.tw/actions/workflows/coverage.yml"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fzkm%2Fzkm.tw%2Fbadges%2Fcoverage.json&logo=vitest&logoColor=white" alt="Coverage" /></a>
  <a href="https://github.com/zkm/zkm.tw/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/zkm/zkm.tw/deploy.yml?event=push&label=deploy&logo=digitalocean&logoColor=white" alt="Deploy" /></a>
  <a href="https://github.com/zkm/zkm.tw/releases/latest"><img src="https://img.shields.io/github/v/release/zkm/zkm.tw?label=release" alt="Latest release" /></a>
  <img src="https://img.shields.io/badge/Node-24-5FA04E?logo=nodedotjs&logoColor=white" alt="Node 24" />
</p>

A single-page portfolio with a collapsible resume, built with React and TypeScript. Tailwind CSS
does the styling, Framer Motion the animation, and a lazy-loaded Chart.js bar chart shows skills.
Icons come from Lucide. Vitest and Testing Library cover the tests, and Biome handles linting
and formatting.

## Getting started

Prerequisites: Node 24+, Yarn 4 (via Corepack).

```bash
yarn install
yarn dev        # Vite dev server
yarn verify     # lint + typecheck + tests; run before opening a PR
```

## Scripts

| Script | What it does |
|---|---|
| `dev` / `build` / `preview` | Vite dev server, production build into `dist/`, serve that build |
| `verify` | `lint`, `format:check`, `typecheck` and `test`: what CI runs |
| `fix` | Biome lint and format, writing fixes (`lint`, `lint:fix`, `format`, `format:check` do one part) |
| `typecheck` | `tsc` over the app, Node and test configs; `typecheck:worker` covers `workers/chat` |
| `test` / `test:watch` / `test:ui` | Vitest once, in watch mode, or with its browser UI |
| `test:coverage` | Coverage for every file in `src/`, tested or not (report in `coverage/`) |
| `docker:dev` / `docker:prod` / `docker:down` | See [Docker](#docker) |
| `health`, `deps:*` | Dependency health, audit and update helpers (see `package.json`) |

## Content and code

Site copy, experience and skills live in JSON, not in components. Edit those files to change
the site; [docs/data-schema.md](docs/data-schema.md) documents every field.

```
public/
  data/profile.json, resume.json   # site content, fetched at runtime
  analytics.js                     # GA4 setup (gtag is loaded in index.html)
src/
  main.tsx → App.tsx               # entry
  components/
    Portfolio.tsx                  # the page
    Resume.tsx                     # lazy-loaded, collapsible resume and skills chart
  hooks/                           # useProfileData, useResumeData, useFocusTrap, usePrefersReducedMotion
  __tests__/
workers/chat/                      # Cloudflare Worker for an AI chat widget (currently unused; docs/chat-worker.md)
```

Tests mock Framer Motion and Lucide globally in `src/test-setup.ts`. A new icon or animated
component may need an entry there.

## Docker

For local use only; production doesn't run on Docker or nginx.

- `yarn docker:dev`: Vite with hot reload on http://localhost:5173
- `yarn docker:prod`: the built site served by nginx on http://localhost:8082

## Deployment

Pushing a `vX.Y.Z` tag on `master` releases and deploys it, after approval: GitHub Actions runs CI, saves the build on a GitHub Release, and has DigitalOcean App Platform build and serve that tag. Merging to `master` alone deploys nothing. CI (`yarn verify` + `yarn build`) runs on every pull request. Releasing, rolling back and setup: [docs/deploy.md](docs/deploy.md).

---

<p align="center">
  Created by <a href="https://zachschneider.com">Zach Schneider</a>
</p>
