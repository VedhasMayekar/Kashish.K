# Enhancement: Daily Blog + Private Messages + Floating Nav

Additive enhancement to the existing Probably Dora-Thor Universe site.
The original letter journeys, memories, timeline, audio and design are untouched.

## Architecture
- Existing site: React + Vite + TypeScript + Tailwind + Framer Motion.
  - All 17 original chapters, `src/data/memories.ts`, audio, components and design are untouched.
  - `src/App.tsx` only gained a hash router (`#blogs`, `#blog/:id`, `#admin`) + floating nav + modal.
- API: Vercel Node.js serverless function at `api/[...path].js`; shared database/auth
  helpers are in `server/db.js` and `server/auth.js`.
- Database: Neon PostgreSQL via `@neondatabase/serverless` and `POSTGRES_URL`.
  Existing `data/app.db` is retained as the source for one-time import using
  `npm run migrate:neon`.
- Production: Vercel serves the Vite build and `/api/...` functions from the same
  domain. No long-running Node server or local production database is used.
- Local functions: `vercel dev` after linking the project and pulling environment
  variables. `npm run dev` remains the Vite-only frontend server.

## Inspect-before-changes findings (Phase 1)
- Stack: React 18 + Vite 5 + TS 5 + Tailwind 4 + Framer Motion + lucide-react. No backend, no DB, no auth, no env vars before this enhancement.
- Reused: StarfieldBackground, glass-card styling, font theme, scene patterns, Icon registry (MemoryCard etc.).
- Existing data is imported to Neon by the guarded `scripts/migrate-sqlite-to-neon.js`
  command; the source SQLite database is not deleted or modified.

## Environment variables
- `POSTGRES_URL` — Neon PostgreSQL connection string; server-only, never use a `VITE_` variable.
- `APP_ORIGIN` — exact Vercel origin, such as `https://sorrykashish.vercel.app`, used to validate admin state-changing requests.
- `ADMIN_PASSWORD` — required only to bootstrap an empty Neon admin table. The SQLite import preserves the existing scrypt hash; changing this environment variable does not reset an existing admin password.
- Vercel sets `NODE_ENV` for deployment. There is no `PORT` or `DB_PATH` in production.

### Admin auth diagnostics
Passwords and session tokens are not logged. Production cookies are `HttpOnly`,
`Secure`, `SameSite=Lax`, host-only, and expire after 12 hours. Only session-token
hashes are stored in Neon. Admin writes require the exact configured `APP_ORIGIN`.

## API
- `GET /api/blogs` — published blogs only (drafts never returned).
- `GET /api/blogs/:id` — one published blog (id or slug).
- `POST /api/messages` — submit message `{ senderName?, message, blogId? }`, no login needed.
- `POST /api/admin/login` / `POST /api/admin/logout` / `GET /api/admin/me`
- `GET /api/admin/messages?q=&order=newest|oldest&filter=all|unread|read`
- `GET /api/admin/messages/:id`, `PATCH /api/admin/messages/:id` `{ isRead }`, `DELETE /api/admin/messages/:id`
- `GET/POST /api/admin/blogs`, `PUT/DELETE /api/admin/blogs/:id`, `PATCH /api/admin/blogs/:id/publish`

## Files created
- `api/[...path].js` — Vercel API function; `server/db.js` and `server/auth.js` —
  Neon database/schema and scrypt/session helpers.
- `scripts/migrate-sqlite-to-neon.js` — guarded import of the existing SQLite database.
- `VERCEL_NEON.md` — setup, import, deployment, and verification instructions.
- `src/types.ts`, `src/api.ts` — shared types + API client.
- `src/components/FloatingNav.tsx`, `src/components/MessageModal.tsx`, `src/components/BlogCard.tsx`, `src/components/BlogContent.tsx`.
- `src/scenes/BlogListScene.tsx`, `src/scenes/BlogDetailScene.tsx`, `src/scenes/AdminScene.tsx` (inbox).
- `ENHANCEMENT.md`, `.env.example`.

## Files changed for the serverless migration
- `server/index.js` and the SQLite implementation in `server/db.js` are replaced by
  the Vercel function and Neon database helper.
- `package.json` and `package-lock.json` include the Neon driver and SQLite import command.
- `vite.config.ts` no longer proxies API calls to a local fixed-port server.

## How to write a blog daily
The admin screen currently shows the message inbox. Blogs are managed through these admin HTTP calls (log in first — the login sets an HttpOnly `admin_session` cookie):
1. `POST /api/admin/blogs` with `{ dayNumber, title, content, status: "draft" }` — content supports `#`/`##` headings, `**bold**`, `*italic*`, `-` lists, `1.` lists, `> ` quotes, `[text](url)`.
2. `PATCH /api/admin/blogs/:id/publish` `{ "published": true }` to publish (or `status: "published"` on create/update).
3. `PUT /api/admin/blogs/:id` to edit, `DELETE /api/admin/blogs/:id` to remove (messages keep their text; blog link becomes NULL).
4. Published posts appear at `#blogs` automatically, newest first. Messages sent from a post link to its Day number.

## How to view messages
Open `#admin`, log in, read/mark/delete messages. The inbox polls every 15 seconds and shows totals, unread/read counts, search, filters, sort, and which blog (if any) a message came from.

## Verification
The frontend type-check/build and serverless handler smoke checks pass. The previous
SQLite backend's end-to-end checks are historical and have not been rerun against a
Neon database. Complete the live API/session/database checks in `VERCEL_NEON.md` after
setting up Neon and importing the local database.

## Privacy note
Messages live in Neon PostgreSQL. Database access and hosting providers may expose
their contents; messages are not end-to-end encrypted. Keep connection credentials
server-only and use HTTPS in production.
