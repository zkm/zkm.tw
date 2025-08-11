# zkm.tw — Portfolio

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

## Deploy

The deploy script publishes the Vite build to the production branch root.

```bash
yarn deploy
```

It will:

1) Build to dist/
2) Switch to production
3) rsync dist/ -> .
4) Commit only if changes exist
5) Push to origin/production
6) Switch back to your previous branch

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

## License

MIT
