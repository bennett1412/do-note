# Project Context

Monorepo for a full-stack note-taking app with a notes feed, rich text editor, and a separate "article" view.

## Repo layout

- `apps/api` — Fastify + Kysely backend (`src/routes.ts`, `src/db/*`).
- `apps/web` — Next.js 16 (App/pages hybrid; uses `pages/`), React 18, TypeScript frontend.
- pnpm workspaces (`pnpm --filter web|api ...`).

## Stack

- **Frontend:** Next.js 16, React 18, TipTap v2.27, @tanstack/react-query v4, Zustand, Mantine, framer-motion, idb (IndexedDB offline).
- **Backend:** Fastify, @fastify/jwt, Kysely (SQLite/Postgres via `dbClient`).

## Commands (root)

- `pnpm dev` / `pnpm build` / `pnpm lint` — web app.
- `pnpm api:dev` / `pnpm api:build` / `pnpm api:start` — API.
- Backend bootstraps `GET /health`; auth via `POST /api/auth/register|login`.

## Key files (notes feature)

| Concern | File |
| --- | --- |
| Notes list page | `apps/web/components/Home/index.tsx` |
| Note list + editor mount | `apps/web/components/Home/components/NotesList.tsx`, `Note.tsx` |
| Note state + autosave context | `apps/web/components/Home/components/NoteContext.tsx` |
| TipTap editor (notes) | `apps/web/components/Home/components/Tiptap.tsx` |
| TipTap editor (articles) | `apps/web/components/Article/ArticleTiptap.tsx` |
| Note API client | `apps/web/utils/notesApi.ts`, `apps/web/utils/api.ts` |
| React Query hooks | `apps/web/hooks/useGetNotes.tsx`, `useUpdateNote.tsx`, `useAddNote.tsx`, `useDeleteNote.tsx`, `useGetNote.tsx` |
| Shared types | `apps/web/types/Note.ts` |
| API routes (Fastify) | `apps/api/src/routes.ts` |

## Notes: load / save data flow

### Load
`GET /api/notes` → `useGetNotes` (query key `["notes"]`) → `NotesList` → `Note` →
`NoteProvider` (initial state) → `useNoteContext().content` → TipTap `content` prop.

Notes render content from the **list** endpoint. `useGetNote`/`GET /api/notes/:id` exist but are not wired into the notes UI.

### Save
TipTap `onUpdate` → context `setContent(next)` → local state + debounced (3s) `saveNote()` →
`useUpdateNote` mutation (`PATCH /api/notes/:id`) → optimistic cache update → `onSuccess` merges the server response back into the `["notes"]` cache.

- Debounce constant: `DEBOUNCE_TIME_MS = 3000` in `NoteContext.tsx`.
- PATCH **returns the saved note** (server `routes.ts`), which is merged into the cache.

## Important: save-loop guard (do not regress)

Editing a note used to trigger the whole flow: editor load → `onUpdate` → save → cache→refetch.
This caused (1) a spurious PATCH on load and (2) a full `GET /api/notes` refetch after every save (from `onSettled` invalidate).

Current defense (intentional):
1. `NoteContext.tsx` — `lastSavedContentRef` tracks the last server-confirmed content. `setContent` is a no-op if `next === lastSavedContentRef.current`, so re-echoed loaded content never triggers a save.
2. `useUpdateNote.tsx` — **no** `invalidateQueries` after save; the cache is updated via the optimistic `onMutate` + confirmed `onSuccess` merge. Do not restore a blanket `refetch` of `["notes"]` on every save.

### Editor updates are one-directional
Editor `content` is only read on mount (`useEditor` options are not reactive). There is deliberately **no** `editor.commands.setContent(...)` sync from context back into the editor.
