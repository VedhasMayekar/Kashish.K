import { DatabaseSync } from "node:sqlite";
import { hashSessionToken } from "../server/auth.js";

const sourcePath = process.env.SQLITE_PATH || "data/app.db";
const resume = process.argv.includes("--resume");
process.env.NEON_MIGRATION_MODE = "true";
const { initializeDatabase, query } = await import("../server/db.js");

function toUtc(value) {
  if (value == null) return null;
  const text = String(value);
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(text)) return new Date(text).toISOString();
  return `${text.replace(" ", "T")}Z`;
}

function rows(database, table) {
  return database.prepare(`SELECT * FROM "${table}"`).all();
}

async function insertRows(statement, records, valuesFor) {
  for (const record of records) {
    await query(statement, valuesFor(record));
  }
}

const sqlite = new DatabaseSync(sourcePath, { readOnly: true });

try {
  await initializeDatabase({ bootstrapAdmin: false });

  const existing = await query(`
    SELECT
      (SELECT COUNT(*) FROM blogs) AS blogs,
      (SELECT COUNT(*) FROM messages) AS messages,
      (SELECT COUNT(*) FROM admin) AS admins,
      (SELECT COUNT(*) FROM sessions) AS sessions
  `);
  const existingCounts = Object.values(existing[0]).map(Number);
  if (!resume && existingCounts.some((count) => count > 0)) {
    throw new Error("Neon tables are not empty. Review the destination, then rerun with --resume only to continue a partial import.");
  }

  const blogs = rows(sqlite, "blogs");
  const messages = rows(sqlite, "messages");
  const admins = rows(sqlite, "admin");
  const sessions = rows(sqlite, "sessions");
  const blogSequence = sqlite.prepare("SELECT seq FROM sqlite_sequence WHERE name = 'blogs'").get()?.seq || 0;
  const messageSequence = sqlite.prepare("SELECT seq FROM sqlite_sequence WHERE name = 'messages'").get()?.seq || 0;

  await insertRows(
    `INSERT INTO blogs
      (id, day_number, title, slug, content, status, published_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT DO NOTHING`,
    blogs,
    (row) => [
      row.id,
      row.day_number,
      row.title,
      row.slug,
      row.content,
      row.status,
      toUtc(row.published_at),
      toUtc(row.created_at),
      toUtc(row.updated_at),
    ],
  );
  await insertRows(
    `INSERT INTO admin (id, password_hash) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    admins,
    (row) => [row.id, row.password_hash],
  );
  await insertRows(
    `INSERT INTO messages
      (id, sender_name, message_content, blog_id, created_at, is_read, read_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT DO NOTHING`,
    messages,
    (row) => [
      row.id,
      row.sender_name,
      row.message_content,
      row.blog_id,
      toUtc(row.created_at),
      Boolean(row.is_read),
      toUtc(row.read_at),
    ],
  );
  await insertRows(
    `INSERT INTO sessions (token_hash, admin_id, expires_at, created_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT DO NOTHING`,
    sessions,
    (row) => [
      hashSessionToken(row.token),
      row.admin_id,
      toUtc(row.expires_at),
      toUtc(row.created_at),
    ],
  );

  await query(`
    SELECT setval(
      pg_get_serial_sequence('blogs', 'id'),
      GREATEST(COALESCE(MAX(id), 0), $1, 1),
      GREATEST(COALESCE(MAX(id), 0), $1) > 0
    ) FROM blogs
  `, [blogSequence]);
  await query(`
    SELECT setval(
      pg_get_serial_sequence('messages', 'id'),
      GREATEST(COALESCE(MAX(id), 0), $1, 1),
      GREATEST(COALESCE(MAX(id), 0), $1) > 0
    ) FROM messages
  `, [messageSequence]);

  const imported = await query(`
    SELECT
      (SELECT COUNT(*) FROM blogs) AS blogs,
      (SELECT COUNT(*) FROM messages) AS messages,
      (SELECT COUNT(*) FROM admin) AS admins,
      (SELECT COUNT(*) FROM sessions) AS sessions
  `);
  console.log(
    `[migration] SQLite import completed. Destination rows: blogs=${imported[0].blogs}, messages=${imported[0].messages}, admins=${imported[0].admins}, sessions=${imported[0].sessions}.`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]") : "Unknown error";
  console.error(`[migration] Failed: ${message}`);
  process.exitCode = 1;
} finally {
  sqlite.close();
}
