# Build stage
FROM oven/bun:1-alpine AS build
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY frontend/ .

# Build the application
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/dcim-console/browser /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf.template

EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${CONNECT_SRC}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
