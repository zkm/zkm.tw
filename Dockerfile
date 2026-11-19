# Multi-stage Dockerfile for Vite React app (dev and prod)

FROM cgr.dev/chainguard/node:latest-dev AS base
WORKDIR /app
USER root

# Install dependencies first (use lockfile if present)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
RUN yarn install --immutable && chown -R 65532:65532 /app
USER 65532

# ---------- Development ----------
FROM base AS dev
WORKDIR /app
COPY . .

# Vite dev server and HMR port
EXPOSE 5173 24678
ENV NODE_ENV=development
ENTRYPOINT []
CMD ["yarn", "dev", "--host", "0.0.0.0"]

# ---------- Build ----------
FROM base AS build
WORKDIR /app
COPY . .
RUN yarn clean && yarn tsc -b tsconfig.app.json tsconfig.node.json && yarn vite build

# ---------- Production (static) ----------
# Pinned to nginx 1.31.9 (security fixes); digest avoids silent drift from :latest
FROM cgr.dev/chainguard/nginx:latest@sha256:1d942360cecf98fe7e45c0470b23734b3c62868544380f920d1c1fa9de6e8e27 AS prod
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
