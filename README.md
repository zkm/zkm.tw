# [zkm.tw](https://zkm.tw)

<p align="center">
  <a href="https://github.com/zkm/zkm.tw/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/zkm/zkm.tw/ci.yml?branch=master&label=CI&logo=githubactions&logoColor=white" alt="CI" /></a>
  <a href="https://github.com/zkm/zkm.tw/actions/workflows/coverage.yml"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fzkm%2Fzkm.tw%2Fbadges%2Fcoverage.json&logo=vitest&logoColor=white" alt="Coverage" /></a>
  <a href="https://github.com/zkm/zkm.tw/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/zkm/zkm.tw/deploy.yml?event=push&label=deploy&logo=digitalocean&logoColor=white" alt="Deploy" /></a>
  <a href="https://github.com/zkm/zkm.tw/releases/latest"><img src="https://img.shields.io/github/v/release/zkm/zkm.tw?label=release" alt="Latest release" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-blue?logo=typescript" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Framer%20Motion-14-black?logo=framer" alt="Framer Motion 14" />
  <img src="https://img.shields.io/badge/Chart.js-4-orange?logo=chartdotjs" alt="Chart.js 4" />
  <img src="https://img.shields.io/badge/Node-24-5FA04E?logo=nodedotjs&logoColor=white" alt="Node 24" />
</p>

Zach Schneider's portfolio and interactive resume: one page, a resume that opens over it, and a
teal-and-purple '90s look taken from his illustrated avatar.

<p align="center">
  <a href="https://zkm.tw"><img src="docs/screenshot.webp" alt="The zkm.tw home page: name, about text, View Resume and Say Hello buttons, the illustrated portrait and social links, on a navy background with teal brushstrokes and purple zigzags" width="860" /></a>
</p>

## Features

- **Resume pop-up**: collapsible sections, skill cards, a Chart.js skills chart (lazy-loaded with
  the resume) and print styles for a clean paper copy.
- **Content in JSON**: profile, experience and skills come from `public/data/*.json` at runtime,
  so updating the site rarely means touching a component.
- **Accessible**: a skip link, focus trapped in dialogs, WCAG AA contrast or better throughout,
  and animation turned down for anyone who prefers reduced motion.
- **Contact details kept from scrapers**: the email and phone number are stored encoded and only
  decoded when a visitor asks to see them.

## Design

The palette comes from the avatar:

| Color | Hex | Used for |
|---|---|---|
| ![](https://img.shields.io/badge/-%20%20%20%20-02cacc) Teal | `#02cacc` | Accents, primary buttons, links on dark backgrounds |
| ![](https://img.shields.io/badge/-%20%20%20%20-00777a) Dark teal | `#00777a` | Teal text on white (the resume's content area) |
| ![](https://img.shields.io/badge/-%20%20%20%20-6511aa) Purple | `#6511aa` | Zigzags, offset shadows, the second accent |
| ![](https://img.shields.io/badge/-%20%20%20%20-f29260) Coral | `#f29260` | A third accent in the resume (text: `#a3461a`) |
| ![](https://img.shields.io/badge/-%20%20%20%20-0e1424) Navy | `#0e1424` | Page background |
| ![](https://img.shields.io/badge/-%20%20%20%20-f9f4e8) Cream | `#f9f4e8` | Text on navy |

`src/index.css` has the shared accents, used across the page and the resume:

| Class | Effect |
|---|---|
| `jazz-link` | Underline that turns into a purple zigzag on hover (add `jazz-link-light` on white) |
| `jazz-pop` | Lifts on hover with a hard offset shadow, purple by default (`jazz-pop-teal`, `-coral`, `-slate`) |
| `jazz-zigzag` | A purple zigzag rule (under headings, above the footer) |
| `jazz-divided` | A faint zigzag between stacked items on white |

## Getting started

Prerequisites: Node 24+, Yarn 4 (via Corepack).

```bash
yarn install
yarn dev        # Vite dev server
yarn verify     # lint, format check, typecheck and tests; run before opening a PR
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
  zach.webp, zach.jpg              # the portrait (WebP, with a JPEG fallback)
  analytics.js                     # GA4 setup (gtag is loaded in index.html)
src/
  main.tsx → App.tsx               # entry
  index.css                        # Tailwind, and the jazz-* accents
  components/
    Portfolio.tsx                  # the page
    Resume.tsx                     # lazy-loaded resume and skills chart
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

Pushing a `vX.Y.Z` tag on `master` releases and deploys it, after approval: GitHub Actions runs
CI, saves the build on a GitHub Release, and has DigitalOcean App Platform build and serve that
tag. Merging to `master` alone deploys nothing. CI (`yarn verify` + `yarn build`) runs on every
pull request. Releasing, rolling back and setup: [docs/deploy.md](docs/deploy.md).

---

<p align="center">
  Created by <a href="https://zachschneider.com">Zach Schneider</a>
</p>
