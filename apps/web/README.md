# Donote Web

Frontend for the Donote note-taking app — a Google Keep / Notion inspired rich-text note and article editor.

## Stack

- **Next.js 16** (pages router) + **TypeScript**
- **Mantine v8** for the component library & theming
- **Tiptap 2** for the rich-text editor (checklists, floating menus, resizable images)
- **TanStack Query v4** for server state (note CRUD, optimistic updates)
- **Zustand** for UI/offline-sync state
- **Framer Motion** for animations

## Development

```bash
pnpm install
pnpm dev
```

Set a local environment variable pointing at the API:

```bash
NEXT_PUBLIC_API_URL=http://localhost:80
```

The backend is a Fastify + Postgres API running alongside this frontend — see the monorepo root `docker-compose.yml`.