# Multi-stage Dockerfile for Vite React app (dev and prod)

FROM node:24-alpine AS base
WORKDIR /app

# Install dependencies first (use lockfile if present)
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
RUN yarn install --immutable

# ---------- Development ----------
FROM base AS dev
WORKDIR /app
COPY . .

# Vite dev server and HMR port
EXPOSE 5173 24678
ENV NODE_ENV=development
CMD ["yarn", "dev", "--", "--host", "0.0.0.0"]

# ---------- Build ----------
FROM base AS build
WORKDIR /app
COPY . .
RUN yarn clean && yarn tsc -b tsconfig.app.json tsconfig.node.json && yarn vite build

# ---------- Production (static) ----------
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
