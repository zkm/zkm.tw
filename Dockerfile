# Stage 1: Build the app
FROM node:lts AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source and build
COPY . .
RUN yarn run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.19

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
