import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "app.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Migration v1 — blogs + messages (additive only; never drops existing data)
db.exec(`
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_blogs_status_published ON blogs(status, published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_day ON blogs(day_number);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_name TEXT,
  message_content TEXT NOT NULL,
  blog_id INTEGER REFERENCES blogs(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
  read_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_blog ON messages(blog_id);

CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export function rowToBlog(row) {
  if (!row) return null;
  return {
    id: row.id,
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
    id: row.id,
    senderName: row.sender_name || "Anonymous",
    senderNameRaw: row.sender_name,
    messageContent: row.message_content,
    blogId: row.blog_id,
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
