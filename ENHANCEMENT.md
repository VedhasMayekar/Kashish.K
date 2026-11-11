# Enhancement: Daily Blog + Private Messages + Floating Nav

Additive enhancement to the existing Probably Dora-Thor Universe site.
The original letter journeys, memories, timeline, audio and design are untouched.

## Architecture (preserved)
- Existing site: React + Vite + TypeScript + Tailwind + Framer Motion.
  - All 17 original chapters, `src/data/memories.ts`, audio, components and design are untouched.
  - `src/App.tsx` only gained a hash router (`#blogs`, `#blog/:id`, `#admin`) + floating nav + modal.
- New backend: dependency-free Node.js (`node:http`) + SQLite (`node:sqlite` built-in). No new npm packages.
  - Files: `server/index.js` (API + static hosting), `server/db.js` (schema), `server/auth.js` (scrypt hash + sessions).
  - DB file: `data/app.db` (auto-created, git-ignored).
  - Production: `npm run build && npm start` → http://localhost:3001 (API + site on one port).
  - Dev: `npm run dev` (Vite :5173, proxies `/api` → :3001) + `npm run server` (:3001).

## Inspect-before-changes findings (Phase 1)
- Stack: React 18 + Vite 5 + TS 5 + Tailwind 4 + Framer Motion + lucide-react. No backend, no DB, no auth, no env vars before this enhancement.
- Reused: StarfieldBackground, glass-card styling, font theme, scene patterns, Icon registry (MemoryCard etc.).
- No existing data to migrate; tables are created additively with `CREATE TABLE IF NOT EXISTS`.

## Environment variables
- `ADMIN_PASSWORD` (**required**) — your admin password (hashed with scrypt; never in frontend code). The server now **refuses to start** if it is missing/empty — the old fallback password was removed because a database first created without the env var kept the fallback hash permanently, which is why correct passwords then failed with "Invalid password". The login endpoint also returns a clear 500 config error (instead of a misleading 401) when the env var is absent.
- `PORT` (optional, default 3001), `DB_PATH` (optional, default `./data/app.db`).
- Passwords are trimmed of accidental leading/trailing whitespace on both hash and verify, so shell newlines can't cause mismatches.
- To change the admin password later: stop the server, delete the single `admin` row from `data/app.db` (or delete `data/app.db` entirely — this also deletes messages/blogs), set the new `ADMIN_PASSWORD`, and restart.

### Admin auth diagnostics
Startup and login print safe, secret-free logs: whether `ADMIN_PASSWORD` is present, whether verification succeeded/failed, whether the admin record was found, session creation, cookie issuance, and logout invalidation. No passwords, hashes, or session tokens are ever logged.
Verified by end-to-end tests (missing-env startup failure, wrong password 401, correct password 200 + cookie, session persistence, public 401s, logout invalidation).

## API
- `GET /api/blogs` — published blogs only (drafts never returned).
- `GET /api/blogs/:id` — one published blog (id or slug).
- `POST /api/messages` — submit message `{ senderName?, message, blogId? }`, no login needed.
- `POST /api/admin/login` / `POST /api/admin/logout` / `GET /api/admin/me`
- `GET /api/admin/messages?q=&order=newest|oldest&filter=all|unread|read`
- `GET /api/admin/messages/:id`, `PATCH /api/admin/messages/:id` `{ isRead }`, `DELETE /api/admin/messages/:id`
- `GET/POST /api/admin/blogs`, `PUT/DELETE /api/admin/blogs/:id`, `PATCH /api/admin/blogs/:id/publish`

## Files created
- `server/index.js`, `server/db.js`, `server/auth.js` — backend + DB + auth.
- `src/types.ts`, `src/api.ts` — shared types + API client.
- `src/components/FloatingNav.tsx`, `src/components/MessageModal.tsx`, `src/components/BlogCard.tsx`, `src/components/BlogContent.tsx`.
- `src/scenes/BlogListScene.tsx`, `src/scenes/BlogDetailScene.tsx`, `src/scenes/AdminScene.tsx` (inbox).
- `ENHANCEMENT.md`, `.env.example`.

## Files modified
- `src/App.tsx` (hash router + nav/modal wiring only — home journey logic preserved).
- `vite.config.ts` (dev `/api` proxy), `package.json` (`server`/`start` scripts), `.gitignore` (DB files).

## How to write a blog daily
The admin screen currently shows the message inbox. Blogs are managed through these admin HTTP calls (log in first — the login sets an HttpOnly `admin_session` cookie):
1. `POST /api/admin/blogs` with `{ dayNumber, title, content, status: "draft" }` — content supports `#`/`##` headings, `**bold**`, `*italic*`, `-` lists, `1.` lists, `> ` quotes, `[text](url)`.
2. `PATCH /api/admin/blogs/:id/publish` `{ "published": true }` to publish (or `status: "published"` on create/update).
3. `PUT /api/admin/blogs/:id` to edit, `DELETE /api/admin/blogs/:id` to remove (messages keep their text; blog link becomes NULL).
4. Published posts appear at `#blogs` automatically, newest first. Messages sent from a post link to its Day number.

## How to view messages
Open `#admin`, log in, read/mark/delete messages. The inbox polls every 15 seconds and shows totals, unread/read counts, search, filters, sort, and which blog (if any) a message came from.

## Testing results (automated, against the live server)
All 29 checks passed: unauthenticated `/admin/messages` → 401; wrong password → 401; draft blogs hidden from public list/detail (404); publish keeps drafts private until published; newest-first ordering; 4 consecutive no-login submissions (named, anonymous, different name, blog-linked) each create separate records; empty message rejected; admin search/filter/read-mark/delete; deleting a blog keeps messages; logout invalidates the session. Static site, API and `/audio/voice-note.ogg` all served with 200.

## Privacy note
Messages live in the local SQLite DB on the server. Anyone with access to the server files or database can read them; they are not end-to-end encrypted, and hosting/database providers may have their own access. Keep the server folder private and use HTTPS in production.
