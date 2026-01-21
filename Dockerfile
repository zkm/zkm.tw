# Multi-stage Dockerfile for Vite React app (dev and prod)

FROM oven/bun:1.1.42-alpine AS base
WORKDIR /app

# Install dependencies first (use lockfile if present)
COPY package.json ./
COPY bun.lockb* ./
RUN bun install --frozen-lockfile

# ---------- Development ----------
FROM base AS dev
WORKDIR /app
COPY . .

# Vite dev server and HMR port
EXPOSE 5173 24678
ENV NODE_ENV=development
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]

# ---------- Build ----------
FROM base AS build
WORKDIR /app
COPY . .
RUN bun run clean && bunx tsc -b tsconfig.app.json tsconfig.node.json && bunx vite build

# ---------- Production (static) ----------
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
