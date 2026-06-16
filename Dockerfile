# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps (cached layer)
COPY alarm-timer/package.json alarm-timer/package-lock.json ./
RUN npm ci --omit=optional

# Work around npm bug with Rollup optional deps on Alpine (musl libc)
# https://github.com/npm/cli/issues/4828
RUN npm install @rollup/rollup-linux-x64-musl

# Copy source and build
COPY alarm-timer ./
RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:1.27-alpine

# Remove default Nginx config and static page
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Custom Nginx config with health-check endpoint
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Production build from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check — lightweight endpoint returns 200
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
