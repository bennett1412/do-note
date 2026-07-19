# Context Snapshot — 2026-07-12

## Project
DoNoteTS — a monorepo note-taking app with a Fastify+Drizzle+Postgres backend and Next.js 16 frontend. Currently migrating from Supabase to self-hosted Docker Compose on a Hetzner VPS (4 GB, ~€5/month).

## What's been done

### Backend rebuilt (apps/api)
- **Schema** (`src/db/schema.ts`): New `users` table (uuid PK, email, bcrypt password_hash, role enum `super_user|admin|user`, per-user limits `max_notes` default 5, `max_storage_bytes` default 1 MB) and `notes` table (bigint PK, FK to users, camelCase columns, soft-delete via `is_active`). Proper indexes on `(creator, created_at DESC)`.
- **Auth** (`src/auth.ts`): JWT + bcrypt, zero external service. `signToken(payload)` with 7-day expiry, `verifyToken(token)`, `hashPassword`/`verifyPassword`.
- **DB layer** (`src/db/index.ts`): `DrizzleRepository` class implementing `IDatabaseRepository` interface — auth, notes CRUD, limit checks (`getUserNoteCount`, `getUserStorageUsed`), admin monitoring (`getDbStats` returns `pg_database_size()`), `getAllUsers` (strips password_hash).
- **Routes** (`src/routes.ts`): `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (token validation), CRUD `/api/notes` with per-user limit enforcement (bypass for super_user/admin), `GET /api/admin/stats`, `GET /api/admin/users`, `PATCH /api/admin/users/:id` (super_user only), `GET /health`.
- **Migrations** (`src/db/migrate.ts`): Auto-runs on server startup. Drizzle SQL at `drizzle/0000_stale_nico_minoru.sql`.
- **Seed** (`src/db/seed.ts`): CLI script to create super_user. `node dist/db/seed.js --email ... --password ...`
- **Build** (`package.json`): `"build": "tsup src/server.ts src/db/migrate.ts src/db/seed.ts --format esm --clean"`
- **New deps**: `bcryptjs`, `jsonwebtoken`, `@types/bcryptjs`, `@types/jsonwebtoken`
- **Removed**: Mock DB mode (`MOCK_DB=true`), all Supabase references from backend

### Docker Compose updated
- Added `db` service: Postgres 16 Alpine, 512 MB memory limit, healthcheck, persistent volume `pgdata`
- Added `DATABASE_URL`, `JWT_SECRET`, `DB_MAX_CONNECTIONS` env vars to `api` service
- `api` depends on `db` with `condition: service_healthy`
- Added `.env.example` with required env vars

### Frontend connected (apps/web)
- **API client** (`utils/api.ts`): Generic `apiRequest<T>(path, options)` with JWT from localStorage, `ApiError` class, convenience `api.get/post/patch/delete`
- **Auth** (`hooks/useSession.tsx`): Supabase Google OAuth replaced with email/password JWT auth. `login()`, `register()`, `signOut()`, token stored in `localStorage`. Validates token on mount via `GET /api/auth/me`.
- **Auth UI** (`components/Auth/index.tsx`): Google button replaced with email/password form + login/register toggle using Mantine `TextInput`/`PasswordInput`.
- **DB operations** (`utils/supabase/db_operations.ts`): Supabase REST calls replaced with `api.get/post/patch/delete`.
- **Types** (`types/Note.ts`): All `snake_case` fields renamed to `camelCase` (`note_title` → `noteTitle`, `note_content` → `noteContent`, `active` → `isActive`, `article` → `isArticle`, `timestamp` → `updatedAt`). `id: string` → `id: number`. New `NoteCreate`, `NoteUpdate` types.
- **Hooks** (useAddNote, useDeleteNote, useGetNote, useGetNotes): Updated signatures — no more `creatorId` params (backend scopes by JWT), `number` IDs.
- **Components** (Home, Note, NotesList, Tiptap, BottomMenu, ArticleView, ArticleTiptap, ArticlesList): All field name references updated, `String(note.id)` for framer-motion `layoutId` (requires string), `Number(fsId)` passed to update/delete calls.
- **Pages** (articles/index, articles/[id]): Updated field names and ID types.
- Added `apps/web/.env.example`: `NEXT_PUBLIC_API_URL=http://localhost:80`

## Current state
- Branch: `migrate-backend`
- Docker is running (backend: api + db + caddy)
- **The `api` container has the correct `package.json` (build script includes `seed.ts`) and correct `node_modules` (bcryptjs, jsonwebtoken installed), but `dist/db/` only has `migrate.js` — NO `seed.js`.**
- This is because the Docker build ran before the `package.json` edit was saved to disk, and `docker compose up -d` reused the cached image.
- The `pnpm-lock.yaml` has been updated to match the current `package.json`.

## Next step

**Rebuild the API image with `--no-cache`**, then seed the super_user:

```bash
cd do-note-ts
docker compose build --no-cache api
docker compose up -d
# Wait for "healthy" on db, then:
docker compose exec -T api node dist/db/seed.js --email bennettmadavana@gmail.com --password bennett@123
```

Then start the frontend dev server:
```bash
cd apps\web
echo NEXT_PUBLIC_API_URL=http://localhost:80 > .env.local
pnpm dev
```

Open `http://localhost:3001/auth`, log in with the seeded credentials.

## Key decisions

- **JWT over Supabase Auth**: Self-hosted, no external dependency, zero cost. Trade-off: no Google OAuth, no password reset (yet).
- **Soft delete for notes**: `isActive: false` instead of `DELETE`. Preserves referential integrity, easier to audit/recover.
- **`bigint` for note IDs**: Cheaper than UUIDs, still supports 9 quintillion rows. `generatedByDefaultAsIdentity` for Postgres-native auto-increment.
- **`maxNotes` and `maxStorageBytes` on user row**: Enforced at API level on create/update. super_user and admin bypass.
- **`pnpm deploy` in Dockerfile**: Extracts only the production deps of the `api` workspace into a flat `/prod/api` directory. Much smaller image than copying the whole monorepo.
- **`--frozen-lockfile` in Docker**: Guarantees reproducible builds. Requires lockfile to be committed and up-to-date.
- **Caddy as reverse proxy**: Already configured with security headers, rate limiting (10 req/s), request size limits (2 MB). Separate `caddy.Dockerfile` builds with the `caddy-ratelimit` plugin.

## Docker concepts learned

- **Layer caching**: Each Dockerfile instruction produces a layer. Docker reuses cached layers if the instruction and its inputs haven't changed. `--no-cache` bypasses this.
- **`COPY .` runs at build time**: Once the image is built, `docker compose up` doesn't re-copy files. You must rebuild to pick up source changes.
- **Lockfile ≠ package.json**: The lockfile stores dependency *versions*, not scripts. It can't revert your build script changes. But `pnpm install --frozen-lockfile` validates that the dependency list matches the lockfile's snapshot.
- **Workflow**: Edit `package.json` → `pnpm install` (updates lockfile) → `git add pnpm-lock.yaml` → commit → `docker compose build` → `docker compose up -d`

## Open items

- Web Dockerfile not created — frontend runs via `pnpm dev` locally, not in Docker
- `go-api` still exists in the repo but not wired into compose
- No password reset flow
- No email verification
- Frontend's `@supabase/supabase-js` dependency still in `package.json` (dead code, not removed yet)
- `utils/supabase/init.ts` still exists but unused
- `pages/index.tsx` returns empty fragment — should it redirect to `/notes` or `/auth`?