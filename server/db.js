import { neon } from "@neondatabase/serverless";
import { getConfiguredPassword, hashPassword } from "./auth.js";

const connectionString = process.env.NEON_MIGRATION_MODE === "true"
  ? process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL || process.env.DATABASE_URL
  : process.env.POSTGRES_URL || process.env.DATABASE_URL;
const sql = connectionString ? neon(connectionString) : null;
let initialization;

export async function query(text, params = []) {
  if (!sql) {
    throw new Error("PostgreSQL connection is not configured. Set POSTGRES_URL in Vercel.");
  }
  return sql.query(text, params);
}

async function transaction(statements) {
  if (!sql) {
    throw new Error("PostgreSQL connection is not configured. Set POSTGRES_URL in Vercel.");
  }
  return sql.transaction((tx) =>
    statements.map(({ text, params = [] }) => tx.query(text, params)),
  );
}

async function createSchema(bootstrapAdmin) {
  await transaction([
    { text: `
      CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      day_number INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    ` },
    { text: `
      CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_name TEXT,
      message_content TEXT NOT NULL,
      blog_id INTEGER REFERENCES blogs(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_read BOOLEAN NOT NULL DEFAULT FALSE CHECK (is_read IN (TRUE, FALSE)),
      read_at TIMESTAMPTZ
      )
    ` },
    { text: `
      CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY,
      password_hash TEXT NOT NULL
      )
    ` },
    { text: `
      CREATE TABLE IF NOT EXISTS sessions (
      token_hash CHAR(64) PRIMARY KEY,
      admin_id INTEGER NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    ` },
    { text: `
      CREATE TABLE IF NOT EXISTS message_rate_limits (
      ip_hash CHAR(64) PRIMARY KEY,
      window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      request_count INTEGER NOT NULL CHECK (request_count > 0)
      )
    ` },
    { text: "CREATE INDEX IF NOT EXISTS idx_blogs_status_published ON blogs(status, published_at)" },
    { text: "CREATE INDEX IF NOT EXISTS idx_blogs_day ON blogs(day_number)" },
    { text: "CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)" },
    { text: "CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read)" },
    { text: "CREATE INDEX IF NOT EXISTS idx_messages_blog ON messages(blog_id)" },
  ]);

  const admins = await query("SELECT id FROM admin LIMIT 1");
  if (bootstrapAdmin && admins.length === 0) {
    const password = getConfiguredPassword();
    if (!password) {
      throw new Error("ADMIN_PASSWORD is required to initialize the first admin account.");
    }
    await query(
      "INSERT INTO admin (id, password_hash) VALUES (1, $1) ON CONFLICT (id) DO NOTHING",
      [hashPassword(password)],
    );
  }

  await query("DELETE FROM sessions WHERE expires_at <= NOW()");
}

export function initializeDatabase({ bootstrapAdmin = true } = {}) {
  if (!initialization) {
    initialization = createSchema(bootstrapAdmin).catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  return initialization;
}

export function rowToBlog(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    dayNumber: row.day_number,
    title: row.title,
    slug: row.slug,
    content: row.content,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function rowToMessage(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    senderName: row.sender_name || "Anonymous",
    senderNameRaw: row.sender_name,
    messageContent: row.message_content,
    blogId: row.blog_id == null ? null : Number(row.blog_id),
    blogTitle: row.blog_title || null,
    blogDayNumber: row.blog_day_number || null,
    createdAt: row.created_at,
    isRead: Boolean(row.is_read),
    readAt: row.read_at,
  };
}

export const MESSAGE_SELECT = `
  SELECT m.*, b.title AS blog_title, b.day_number AS blog_day_number
  FROM messages m LEFT JOIN blogs b ON b.id = m.blog_id
`;
