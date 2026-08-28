# Stage 1: Build Caddy with the rate-limit plugin using xcaddy
FROM caddy:2.8-builder-alpine AS builder

RUN xcaddy build \
    --with github.com/mholt/caddy-ratelimit

# Stage 2: Final runner image containing the compiled Caddy binary
FROM caddy:2.8-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
