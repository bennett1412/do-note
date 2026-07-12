# ==========================================
# Stage 1: Core Setup (Official Base)
# ==========================================
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN npm install -g corepack@latest && corepack enable

# ==========================================
# Stage 2: Monorepo Build & Bundle Deployment
# ==========================================
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# 1. Install all dependencies across the workspace using BuildKit caching

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 2. Run your tsup compilation script
RUN pnpm api:build

# 3. Magic Step: Let pnpm safely extract your production API bundle
#    This isolates your compiled code and production node_modules into a flat /prod/api directory
RUN pnpm deploy --filter=api --prod /prod/api

# 4. Copy Drizzle migrations into the production bundle
COPY apps/api/drizzle /prod/api/drizzle

# ==========================================
# Stage 3: Clean Production Runner
# ==========================================
FROM base AS runner
WORKDIR /prod/api
ENV NODE_ENV=production

# Copy the completely flattened, self-contained production bundle from Stage 2
COPY --from=build /prod/api /prod/api

EXPOSE 3000

# Start your app directly using the package.json start script
CMD [ "pnpm", "start" ]
