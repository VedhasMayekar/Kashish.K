import crypto from "node:crypto";
import {
  getConfiguredPassword,
  hashSessionToken,
  createSessionToken,
  SESSION_HOURS,
  verifyPassword,
} from "../server/auth.js";
import {
  initializeDatabase,
  MESSAGE_SELECT,
  query,
  rowToBlog,
  rowToMessage,
} from "../server/db.js";

const SESSION_COOKIE = "admin_session";
const isProduction = process.env.NODE_ENV === "production";

function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
}

function getBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return {};
}

function getCookie(req, name) {
  const cookies = String(req.headers.cookie || "").split(";");
  for (const cookie of cookies) {
    const separator = cookie.indexOf("=");
    if (separator < 0 || cookie.slice(0, separator).trim() !== name) continue;
    return cookie.slice(separator + 1).trim();
  }
  return "";
}

function setSessionCookie(req, res, token, maxAge) {
  const secure = isProduction || req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`,
  );
}

function hasExpectedOrigin(req) {
  const origin = process.env.APP_ORIGIN;
  if (!origin) {
    return !isProduction && ["http://localhost:3000", "http://localhost:5173"].includes(req.headers.origin);
  }
  try {
    const parsed = new URL(origin);
    return ["http:", "https:"].includes(parsed.protocol) &&
      parsed.origin === origin &&
      req.headers.origin === origin;
  } catch {
    return false;
  }
}

function isValidId(value) {
  return /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

function slugify(title) {
  return (title || "post")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "post";
}

async function isAdmin(req) {
  const token = getCookie(req, SESSION_COOKIE);
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  const sessions = await query(
    "SELECT 1 FROM sessions WHERE token_hash = $1 AND expires_at > NOW()",
    [hashSessionToken(token)],
  );
  return sessions.length > 0;
}

async function isRateLimited(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = typeof forwardedFor === "string"
    ? forwardedFor.split(",").at(-1)?.trim() || req.socket?.remoteAddress || "unknown"
    : req.socket?.remoteAddress || "unknown";
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
  await query("DELETE FROM message_rate_limits WHERE window_started_at < NOW() - INTERVAL '1 day'");
  const rows = await query(
    `INSERT INTO message_rate_limits (ip_hash, window_started_at, request_count)
     VALUES ($1, NOW(), 1)
     ON CONFLICT (ip_hash) DO UPDATE SET
       request_count = CASE
         WHEN message_rate_limits.window_started_at <= NOW() - INTERVAL '1 minute' THEN 1
         ELSE message_rate_limits.request_count + 1
       END,
       window_started_at = CASE
         WHEN message_rate_limits.window_started_at <= NOW() - INTERVAL '1 minute' THEN NOW()
         ELSE message_rate_limits.window_started_at
       END
     RETURNING request_count`,
    [ipHash],
  );
  return Number(rows[0]?.request_count) > 10;
}

async function handle(req, res) {
  const url = new URL(req.url, "https://vercel.invalid");
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const method = req.method || "GET";

  if (Number(req.headers["content-length"] || 0) > 2_000_000) {
    return send(res, 413, { error: "Request body is too large." });
  }

  if (method === "OPTIONS") {
    res.setHeader("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    return res.status(204).end();
  }

  if (pathname.startsWith("/api/admin/") && !["GET", "HEAD"].includes(method) && !hasExpectedOrigin(req)) {
    return send(res, 403, { error: "Request origin not allowed." });
  }

  await initializeDatabase();

  if (method === "GET" && (pathname === "/api/blogs" || pathname === "/api/blogs/")) {
    const rows = await query("SELECT * FROM blogs WHERE status = 'published' ORDER BY day_number DESC");
    return send(res, 200, rows.map(rowToBlog));
  }

  if (method === "GET" && pathname.startsWith("/api/blogs/")) {
    const idOrSlug = pathname.slice("/api/blogs/".length);
    const numericId = isValidId(idOrSlug) ? Number(idOrSlug) : -1;
    const rows = await query(
      "SELECT * FROM blogs WHERE (id = $1 OR slug = $2) AND status = 'published' LIMIT 1",
      [numericId, idOrSlug],
    );
    if (!rows[0]) return send(res, 404, { error: "Blog not found" });
    return send(res, 200, rowToBlog(rows[0]));
  }

  if (method === "POST" && (pathname === "/api/messages" || pathname === "/api/messages/")) {
    const body = getBody(req);
    if (!body) return send(res, 400, { error: "Invalid JSON body." });
    const senderName = typeof body.senderName === "string" ? body.senderName.trim().slice(0, 80) : "";
    const messageContent = typeof body.message === "string" ? body.message.trim() : "";
    if (!messageContent) return send(res, 400, { error: "Message is required." });
    if (messageContent.length > 4000) return send(res, 400, { error: "Message is too long." });

    let blogId = null;
    if (body.blogId != null && Number.isSafeInteger(Number(body.blogId)) && Number(body.blogId) > 0) {
      const blogs = await query("SELECT id FROM blogs WHERE id = $1", [Number(body.blogId)]);
      if (blogs[0]) blogId = Number(blogs[0].id);
    }

    if (await isRateLimited(req)) {
      return send(res, 429, { error: "Too many messages. Please try again in a minute." });
    }
    const inserted = await query(
      "INSERT INTO messages (sender_name, message_content, blog_id) VALUES ($1, $2, $3) RETURNING id",
      [senderName || null, messageContent, blogId],
    );
    return send(res, 201, {
      ok: true,
      id: Number(inserted[0].id),
      confirmation: "Your message has been sent successfully. Thank you for sharing your thoughts.",
    });
  }

  if (method === "POST" && pathname === "/api/admin/login") {
    const body = getBody(req);
    if (!body) return send(res, 400, { error: "Invalid JSON body." });
    if (!getConfiguredPassword()) {
      const admins = await query("SELECT id FROM admin LIMIT 1");
      if (admins.length === 0) return send(res, 500, { error: "Admin authentication is not configured." });
    }
    const admins = await query("SELECT * FROM admin LIMIT 1");
    const supplied = body.password != null ? String(body.password).trim() : "";
    if (!admins[0] || !verifyPassword(supplied, admins[0].password_hash)) {
      return send(res, 401, { error: "Invalid password." });
    }
    const token = createSessionToken();
    await query(
      "INSERT INTO sessions (token_hash, admin_id, expires_at) VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 hour'))",
      [hashSessionToken(token), admins[0].id, SESSION_HOURS],
    );
    setSessionCookie(req, res, token, SESSION_HOURS * 3600);
    return send(res, 200, { ok: true });
  }

  if (method === "POST" && pathname === "/api/admin/logout") {
    const token = getCookie(req, SESSION_COOKIE);
    if (/^[a-f0-9]{64}$/.test(token)) {
      await query("DELETE FROM sessions WHERE token_hash = $1", [hashSessionToken(token)]);
    }
    setSessionCookie(req, res, "", 0);
    return send(res, 200, { ok: true });
  }

  if (method === "GET" && pathname === "/api/admin/me") {
    return send(res, 200, { authenticated: await isAdmin(req) });
  }

  if (pathname === "/api/admin/messages" || pathname.startsWith("/api/admin/messages/")) {
    if (!(await isAdmin(req))) return send(res, 401, { error: "Admin access required." });
    if (method === "GET" && pathname === "/api/admin/messages") {
      const conditions = [];
      const params = [];
      const filter = url.searchParams.get("filter");
      if (filter === "unread") conditions.push("m.is_read = FALSE");
      if (filter === "read") conditions.push("m.is_read = TRUE");
      const search = (url.searchParams.get("q") || "").toLowerCase();
      if (search) {
        params.push(`%${search}%`);
        conditions.push(`(LOWER(COALESCE(m.sender_name, '')) LIKE $${params.length} OR LOWER(m.message_content) LIKE $${params.length})`);
      }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const order = url.searchParams.get("order") === "oldest" ? "ASC" : "DESC";
      const rows = await query(
        `${MESSAGE_SELECT} ${where} ORDER BY m.created_at ${order}, m.id ${order}`,
        params,
      );
      return send(res, 200, rows.map(rowToMessage));
    }

    const messageMatch = pathname.match(/^\/api\/admin\/messages\/(\d+)$/);
    if (messageMatch && isValidId(messageMatch[1])) {
      const id = Number(messageMatch[1]);
      if (method === "GET") {
        const rows = await query(`${MESSAGE_SELECT} WHERE m.id = $1`, [id]);
        if (!rows[0]) return send(res, 404, { error: "Message not found." });
        return send(res, 200, rowToMessage(rows[0]));
      }
      if (method === "PATCH") {
        const body = getBody(req);
        if (!body) return send(res, 400, { error: "Invalid JSON body." });
        if (typeof body.isRead === "boolean") {
          await query(
            "UPDATE messages SET is_read = $1, read_at = CASE WHEN $1 THEN NOW() ELSE NULL END WHERE id = $2",
            [body.isRead, id],
          );
        }
        const rows = await query(`${MESSAGE_SELECT} WHERE m.id = $1`, [id]);
        return send(res, 200, rows[0] ? rowToMessage(rows[0]) : { error: "Message not found." });
      }
      if (method === "DELETE") {
        await query("DELETE FROM messages WHERE id = $1", [id]);
        return send(res, 200, { ok: true });
      }
    }
  }

  if (pathname === "/api/admin/blogs" || pathname.startsWith("/api/admin/blogs/")) {
    if (!(await isAdmin(req))) return send(res, 401, { error: "Admin access required." });
    if (method === "GET" && pathname === "/api/admin/blogs") {
      const rows = await query("SELECT * FROM blogs ORDER BY day_number ASC");
      return send(res, 200, rows.map(rowToBlog));
    }
    if (method === "POST" && pathname === "/api/admin/blogs") {
      const body = getBody(req);
      if (!body) return send(res, 400, { error: "Invalid JSON body." });
      const dayNumber = Number(body.dayNumber);
      const title = String(body.title || "").trim();
      if (!Number.isSafeInteger(dayNumber) || dayNumber <= 0 || !title) {
        return send(res, 400, { error: "Day number and title are required." });
      }
      const status = body.status === "published" ? "published" : "draft";
      const publishedAt = status === "published" ? (body.publishedAt || new Date().toISOString()) : null;
      const inserted = await query(
        `INSERT INTO blogs (day_number, title, slug, content, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [dayNumber, title, `${slugify(title)}-${dayNumber}`, String(body.content || ""), status, publishedAt],
      );
      return send(res, 201, rowToBlog(inserted[0]));
    }

    const blogMatch = pathname.match(/^\/api\/admin\/blogs\/(\d+)(\/publish)?$/);
    if (blogMatch && isValidId(blogMatch[1])) {
      const id = Number(blogMatch[1]);
      if (method === "PUT" && !blogMatch[2]) {
        const body = getBody(req);
        if (!body) return send(res, 400, { error: "Invalid JSON body." });
        const existing = await query("SELECT * FROM blogs WHERE id = $1", [id]);
        if (!existing[0]) return send(res, 404, { error: "Blog not found." });
        const row = existing[0];
        const title = body.title != null ? String(body.title) : row.title;
        const dayNumber = body.dayNumber != null ? Number(body.dayNumber) : row.day_number;
        if (!Number.isSafeInteger(dayNumber) || dayNumber <= 0 || !title.trim()) {
          return send(res, 400, { error: "Day number and title are required." });
        }
        const status = body.status != null ? (body.status === "published" ? "published" : "draft") : row.status;
        const publishedAt = status === "published"
          ? (body.publishedAt || row.published_at || new Date().toISOString())
          : null;
        const updated = await query(
          `UPDATE blogs SET day_number = $1, title = $2, slug = $3, content = $4,
             status = $5, published_at = $6, updated_at = NOW()
           WHERE id = $7 RETURNING *`,
          [
            dayNumber,
            title,
            body.title != null ? `${slugify(title)}-${dayNumber}` : row.slug,
            body.content != null ? String(body.content) : row.content,
            status,
            publishedAt,
            id,
          ],
        );
        return send(res, 200, rowToBlog(updated[0]));
      }
      if (method === "PATCH" && blogMatch[2]) {
        const body = getBody(req);
        if (!body) return send(res, 400, { error: "Invalid JSON body." });
        const published = body.published !== false;
        const updated = await query(
          `UPDATE blogs SET status = $1, published_at = $2, updated_at = NOW()
           WHERE id = $3 RETURNING *`,
          [published ? "published" : "draft", published ? new Date().toISOString() : null, id],
        );
        return send(res, 200, updated[0] ? rowToBlog(updated[0]) : { error: "Blog not found." });
      }
      if (method === "DELETE" && !blogMatch[2]) {
        await query("DELETE FROM blogs WHERE id = $1", [id]);
        return send(res, 200, { ok: true });
      }
    }
  }

  return send(res, 404, { error: "Not found." });
}

export default async function handler(req, res) {
  try {
    return await handle(req, res);
  } catch (error) {
    console.error("[api] Request failed:", error);
    return send(res, 500, { error: "Server error." });
  }
}
