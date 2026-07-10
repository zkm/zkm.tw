# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Zach Schneider's personal portfolio site (zkm.tw): a single-page React app (Portfolio + collapsible Resume) plus a small Cloudflare Worker that backs an AI chat widget. Prerequisites: Node 24+, Yarn 4 (via Corepack).

## Commands

```bash
yarn dev              # Vite dev server
yarn build             # tsc -b (app + node project refs) then vite build
yarn verify             # lint + typecheck + test — run this before considering a change done
yarn fix                # lint:fix + format
yarn test               # vitest run (single run)
yarn test:watch         # vitest watch mode
yarn test:coverage      # vitest with coverage
```

Run a single test file: `yarn vitest run src/__tests__/Portfolio.test.tsx`
Run tests matching a name: `yarn vitest run -t "renders resume"`

Other scripts of note: `yarn deploy` (build + push `dist/` to the `production` branch, see below), `yarn health` / `health:full` / `health:report` (scripts/*.js), `yarn deps:check` / `deps:audit`.

### Chat worker (`workers/chat/`)

This is a separate Yarn project (its own `package.json`/lockfile), not part of the root workspace.

```bash
cd workers/chat
yarn wrangler dev       # local worker on :8787
yarn wrangler deploy    # deploy to Cloudflare
```

The root `vite dev` server proxies `/api` to `http://localhost:8787` (see `vite.config.ts`), so run `wrangler dev` alongside `yarn dev` to exercise the chat widget locally. Secrets (`ANTHROPIC_API_KEY`) are set via `wrangler secret put` and are not present in the repo (`.dev.vars.example` shows the shape).

## Architecture

- **Entry**: `src/main.tsx` → `App.tsx` → `Portfolio.tsx`. `Resume.tsx` is lazy-loaded (`React.lazy`) and shown inside `Portfolio` as a collapsible/modal section, not a separate route — there is no router.
- **Data-driven content**: profile and resume content live in `public/data/profile.json` and `public/data/resume.json`, fetched at runtime by `src/hooks/useProfileData.ts` and `src/hooks/useResumeData.ts`. To change site copy/experience/skills, edit those JSON files rather than the components.
- **Styling**: Tailwind CSS v4 utility classes directly in JSX (`@import 'tailwindcss'` in `src/index.css`, config via `@tailwindcss/postcss`). `styled-components`/`styled-system` are dependencies but `src/theme/ThemeContext.tsx`, `src/assets/styles/GlobalStyles.tsx`, and `src/data/links.tsx` are currently empty stub files — don't assume they're wired up.
- **Chat widget** (`src/components/Chatbot.tsx`): POSTs conversation history to `/api/chat`. In production this is routed by Cloudflare to the Worker at `workers/chat/src/index.ts`; in dev it's proxied to local `wrangler dev`. The Worker independently fetches `https://zkm.tw/data/profile.json` and `resume.json` to build the Claude system prompt (cached in Cloudflare Cache API for 1h), enforces a per-IP rate limit and a global daily budget via `CHAT_KV`, and calls the Anthropic Messages API (`claude-haiku-4-5`, capped at 300 output tokens). Treat the worker as the source of truth for chat behavior/limits — it's not just a passthrough.
- **Email/phone obfuscation**: contact info in `Portfolio.tsx` and `Resume.tsx` is stored reversed + base64-encoded (`decodeObfuscatedEmail`/equivalent) to deter scraping, decoded client-side with `atob`. If you regenerate an obfuscated value, keep the same "base64 then reverse the string" scheme both places it's duplicated (`Portfolio.tsx` and `Resume.tsx` each have their own copy).
- **Icons**: social icons are local SVG files under `src/components/icons/`, rendered as `<img>` (not inline SVG/React components) specifically to avoid `currentColor`/fill inheritance issues across browsers — see the comment in `Portfolio.tsx`. Non-social icons come from `lucide-react`.
- **Testing**: Vitest + `@testing-library/react`, jsdom environment (`vitest.config.ts`). `src/test-setup.ts` globally mocks `framer-motion` (strips motion props, renders plain tags) and `lucide-react` (renders `data-testid` stubs) — when adding a new lucide icon or animated component, check whether it needs a corresponding mock entry there for tests to pass.
- **TypeScript**: project-referenced tsconfig split into `tsconfig.app.json` (src), `tsconfig.node.json` (vite.config.ts), and `tsconfig.test.json` (extends app config, adds vitest types). `yarn build` type-checks both app and node configs before invoking `vite build`; `yarn typecheck` runs `tsc --noEmit` standalone.

## Deployment

Two separate mechanisms exist — check which is actually current before assuming:

- `.github/workflows/deploy.yml` runs on push to `main`/`master`: installs, tests, builds, and just logs that DigitalOcean deploys automatically from that branch (no explicit deploy step in CI).
- `scripts/deploy.js` (`yarn deploy`) is a manual flow: builds locally, then checks out the `production` branch, wipes it, copies in `dist/`, commits, and pushes — used for GitHub Pages-style static hosting of the built assets.

`.github/workflows/ci.yml` (install → `yarn verify` → `yarn build`) runs on push/PR to `main`/`master`/`develop` and is the main correctness gate.
