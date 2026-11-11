import crypto from "node:crypto";
import { db } from "./db.js";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function getAdmin() {
  return db.prepare("SELECT * FROM admin").get();
}

// Returns the configured admin password, or null. Trimming guards against
// accidental trailing whitespace/newlines when set from the shell.
export function getConfiguredPassword() {
  const raw = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "";
  const trimmed = raw.trim();
  return trimmed ? trimmed : null;
}

export function ensureAdmin() {
  const secret = getConfiguredPassword();
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable is not set. Set it before starting the server.");
  }
  let admin = getAdmin();
  if (!admin) {
    db.prepare("INSERT INTO admin (password_hash) VALUES (?)").run(hashPassword(secret));
    console.log("[auth] Admin account created from ADMIN_PASSWORD.");
  }
  return getAdmin();
}

const SESSION_HOURS = 12;

export function createSession(adminId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_HOURS * 3600_000).toISOString();
  db.prepare("INSERT INTO sessions (token, admin_id, expires_at) VALUES (?, ?, ?)").run(token, adminId, expires);
  return token;
}

export function validSession(token) {
  if (!token) return false;
  const row = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token);
  if (!row) return false;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return false;
  }
  return true;
}

export function deleteSession(token) {
  if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}
