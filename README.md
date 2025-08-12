
# 🚀 [zkm.tw — Portfolio](https://zkm.tw)

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer%20Motion-12-black?logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Chart.js-4-orange?logo=chartdotjs" alt="Chart.js" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-Automated-blue?logo=githubactions" alt="GitHub Actions" />
</p>

Modern React + TypeScript portfolio powered by Vite, Tailwind CSS, and Framer Motion.

## Stack

- React 19, TypeScript, Vite 7
- Tailwind CSS 4, PostCSS, Styled Components
- Framer Motion (animations), Lucide Icons
- Chart.js + react-chartjs-2 (lazy-loaded Bar)
- Vitest + Testing Library (unit tests)

## Getting started

Prereqs: Node 20+, Yarn 1.x.

Install deps

```bash
yarn install
```

Dev server

```bash
yarn dev
```

Build

```bash
yarn build
```

Preview

```bash
yarn preview
```

## Scripts

- lint: eslint .
- test: vitest run
- test:watch: vitest
- test:coverage: vitest run --coverage
- docker:dev: docker-compose up Vite dev (5173, HMR 24678)
- docker:prod: docker-compose up web-prod (nginx at 8080)
- deploy: builds, switches to production branch, rsyncs dist/, commits if changed, pushes, and switches back

## Docker

- Dockerfile has multi-stage targets: dev (Vite), build, prod (nginx)
- docker-compose.yml defines:
  - web: bind-mount dev with hot reload on http://localhost:5173
  - web-prod: serves built assets via nginx on http://localhost:8080
- .dockerignore is configured to keep the build context small

Common

```bash
yarn docker:dev   # dev with HMR
yarn docker:prod  # serve built site on :8080
```

## Tests

- Vitest + @testing-library/react
- Framer Motion is mocked in test setup (src/test-setup.ts) for stable DOM
- Hooks are mocked per test with vi.mocked(...) patterns

Run

```bash
yarn test
yarn test:watch
yarn test:coverage
```

## Data & components

- Public JSON data: public/data/profile.json, public/data/resume.json
- Hooks: src/hooks/useProfileData.ts, src/hooks/useResumeData.ts
- Key components: src/components/Portfolio.tsx, src/components/Resume.tsx
- Resume sections are collapsible (accessible), default-expanded

## Analytics

GA4 is integrated via gtag in index.html using measurement ID G-2J7SWPGLE4. If you prefer GTM, replace the GA snippet with your GTM container snippet.


## Deployment

Deployment is now handled automatically via GitHub Actions:

```bash
yarn deploy
```

This will:

1. Run tests and build your project
2. Commit and push changes to the `master` branch
3. Trigger a GitHub Actions workflow that builds and deploys to GitHub Pages

### Custom Domain

Your site is published at [zkm.tw](https://zkm.tw) using a CNAME file in `public/CNAME`.

**If you change your domain, update `public/CNAME` and push to master.**

### Troubleshooting

- Check deployment status in the GitHub Actions tab
- Ensure GitHub Pages source is set to "GitHub Actions" in repository settings
- Confirm your DNS records point to GitHub Pages

## Project structure

```
src/
  components/
    Portfolio.tsx
    Resume.tsx
  hooks/
    useProfileData.ts
    useResumeData.ts
  __tests__/
public/
  data/
    profile.json
    resume.json
```


---

<p align="center">
  Created by <a href="https://zachschneider.com">Zach Schneider</a>
</p>
