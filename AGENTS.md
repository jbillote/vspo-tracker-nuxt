# AGENTS.md

Nuxt 4 app ("VSPorte! Tracker"). Package manager is **bun** (bun.lock, bun is installed).

## Commands

- `bun install` then dev server on http://localhost:3000: `bun run dev`
- `bun run lint` (eslint, Nuxt-aware autoimport config); `bun run format` (prettier, auto-sorts imports and Tailwind classes)
- `bun run build` (Nitro, Vercel preset); `bun run preview` to preview a local build
- There is **no unit test suite**. `tests/performance/*.ts` are autocannon load scripts — they require a running server:
  `BASE_URL=http://localhost:3000 bun run tests/performance/live.ts`
- No `typecheck` script; the root tsconfig only references generated files in `.nuxt/` (created by `nuxt prepare` on install).

## Gotchas

- Source lives in `app/` (Nuxt 4 layout): page in `app/pages/index.vue`, Pinia stores in `app/stores/`; API routes in `server/api/v1/**` (Nitro).
- The live endpoint (`server/api/v1/videos/live.ts`) proxies the holodex.net API and requires `NUXT_HOLODEX_API_KEY` from `.env` (gitignored; `.env`/`.env.*.local` are local-only). Without it the live/upcoming feed 401s from the upstream.
- `app/components/ui/**` is shadcn-vue managed output: excluded from eslint and prettier; add/update components via shadcn (`components.json`), don't reformat or hand-lint them.
- Streamer/org data is static: `server/data/channels.json` drives both `/api/v1/streamers` and the channel list used by the live endpoint.
- `.env` contains a stale Prisma comment block — there is no Prisma/DB in this repo.
