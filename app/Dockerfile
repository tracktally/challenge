# Multi-stage build for the React/Vite app, served by unprivileged Nginx

FROM node:20-alpine AS builder
WORKDIR /app

# Copy source
COPY . .

RUN npm ci
RUN npm run build

# Runtime image: non-root Nginx listening on 8080
FROM nginxinc/nginx-unprivileged:stable-alpine
USER 101
EXPOSE 8080

# Copy SPA assets and nginx config
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Healthcheck (optional)
HEALTHCHECK CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1

