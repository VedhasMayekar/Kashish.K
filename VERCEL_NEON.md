# Vercel Serverless + Neon Migration

## Migration plan

1. Keep the existing React/Vite frontend and its `/api/...` calls.
2. Replace the listening Node server with the Vercel Node.js function
   `api/[...path].js`, which routes the existing public blog, message, login/session,
   admin message, and admin blog endpoints.
3. Replace SQLite queries with parameterized PostgreSQL statements through
   `@neondatabase/serverless`. The function initializes tables/indexes idempotently;
   message rate limiting and hashed admin sessions are stored in Neon.
4. Import the existing SQLite `blogs`, `messages`, `admin`, and `sessions` rows once
   with `npm run migrate:neon`. The importer refuses a non-empty Neon database unless
   explicitly resumed, never deletes or overwrites destination rows, preserves IDs,
   hashes existing session tokens, and updates PostgreSQL ID sequences.
5. Keep the existing scrypt admin password hash. Configure `ADMIN_PASSWORD` to the
   existing password as a first-admin bootstrap fallback; the importer preserves the
   current hash rather than replacing it.
6. Deploy from the repository root on Vercel. No Railway/Render service, fixed port,
   local production database, or Vite API base URL is used.

## Existing API routes

- `GET /api/blogs` and `GET /api/blogs/`: published blogs.
- `GET /api/blogs/:id-or-slug`: a published blog.
- `POST /api/messages`: public message submission, optional blog association, and
  persistent rate limiting.
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`.
- `GET /api/admin/messages`, `GET /api/admin/messages/:id`,
  `PATCH /api/admin/messages/:id`, `DELETE /api/admin/messages/:id`.
- `GET /api/admin/blogs`, `POST /api/admin/blogs`, `PUT /api/admin/blogs/:id`,
  `PATCH /api/admin/blogs/:id/publish`, `DELETE /api/admin/blogs/:id`.

Admin data requires a valid server-side session. Session cookies are host-only,
`HttpOnly`, `Secure` in production, `SameSite=Lax`, path `/`, and expire after 12
hours. Session tokens are random and only their SHA-256 hashes are stored. Admin
state-changing requests must have the configured exact `APP_ORIGIN`; public message
submission remains available without login. API errors returned to clients are
generic and do not expose SQL, credentials, or stack traces.

## One-time setup before pushing

1. Create a Neon project and database. Do not delete or replace the local
   `data/app.db`.
2. Set the Vercel project's Node.js runtime to version 22.x or newer.
3. In Vercel, open the existing `sorrykashish` project and connect the Neon integration
   or copy the Neon pooled connection string into the Vercel environment variable
   `POSTGRES_URL`. Use Production (and Preview/Development too if you want those
   deployments to access Neon). Preview deployments use the same fixed `APP_ORIGIN`,
   so their admin state-changing requests are intentionally rejected unless you set
   the Preview `APP_ORIGIN` to that exact preview URL. Never put the database URL in
   a `VITE_` variable.
4. Set these Vercel environment variables:

   | Variable | Value |
   | --- | --- |
   | `POSTGRES_URL` | Neon pooled PostgreSQL connection string; server-only secret. |
   | `APP_ORIGIN` | `https://sorrykashish.vercel.app` (exact origin, no trailing slash). |
   | `ADMIN_PASSWORD` | Existing admin password, for first-admin bootstrap only. It does not replace an imported password hash. |

   Vercel sets `NODE_ENV=production` for production deployments. No `PORT`,
   `DATABASE_PATH`, `VITE_API_BASE_URL`, CORS domain, or client-side database secret
   is needed.
5. Import the local database before the first deployment, while the Neon destination
   is empty:
   - In Vercel, use **Settings → Environment Variables → Pull** or run
     `npx vercel env pull .env.local` from the repository root.
   - Make sure `.env.local` contains the target `POSTGRES_URL`. If the local file does
     not contain `ADMIN_PASSWORD`, add it locally only if Neon has no admin row; do
     not commit `.env.local`.
   - For local `vercel dev`, set `APP_ORIGIN=http://localhost:3000` in `.env.local`;
     keep `APP_ORIGIN=https://sorrykashish.vercel.app` in Vercel Production.
   - Run `npm run migrate:neon`. The command reads `data/app.db`, writes to Neon, and
     prints row counts only. It does not print message contents, password hashes, or
     connection secrets.
   - If the importer reports an interrupted partial import, inspect the Neon database
     first, then resume only that same import with
     `npm run migrate:neon -- --resume`. Do not use `--resume` to merge unrelated
     production data.
6. After import, keep the SQLite file as a local backup. Nothing in deployment deletes
   or modifies it.

## Push and verify deployment

1. Review and commit the changes, then push the branch connected to the existing
   Vercel project. Vercel should detect Vite, run `npm run build`, publish `dist`, and
   deploy `api/[...path].js` as a Node.js serverless function.
2. In Vercel **Deployments**, wait for the deployment to finish successfully. If
   environment variables were added or changed after a deployment started, redeploy
   so the function receives them.
3. Open these URLs on the deployed site:
   - `https://sorrykashish.vercel.app/api/blogs`
   - `https://sorrykashish.vercel.app/api/blogs/`
   Both should return JSON arrays; an empty array is valid when there are no published
   blogs.
4. Submit two messages from the public website. Sign in at `#admin`, verify both
   appear privately, refresh to verify the session, and exercise mark-read/delete.
   Create/publish a blog and confirm public detail and message association.
5. Check browser developer tools and Vercel function logs for runtime/database errors.
   Never paste `POSTGRES_URL`, `ADMIN_PASSWORD`, message contents, or session cookies
   into public logs or tickets.

For local development with API routes, install/configure the Vercel CLI, link the
project, pull environment variables to the ignored `.env.local`, then run `vercel dev`.
The existing `npm run dev` command remains the Vite-only frontend server; it does not
emulate Vercel functions or start a separate API server.
