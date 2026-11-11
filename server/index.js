import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { db, rowToBlog, rowToMessage, MESSAGE_SELECT } from "./db.js";
import { ensureAdmin, getConfiguredPassword, verifyPassword, createSession, validSession, deleteSession } from "./auth.js";

const PORT = process.env.PORT || 3001;
const DIST = path.join(process.cwd(), "dist");
ensureAdmin();
console.log("[auth] ADMIN_PASSWORD present in environment: " + (getConfiguredPassword() !== null));

function sendJson(res, code, obj) {
  const out = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(out);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 2000000) req.destroy();
    });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isAdmin(req) {
  return validSession(parseCookies(req).admin_session);
}

function slugify(title) {
  return (title || "post").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "post";
}

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (arr.length >= 10) return true;
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname;
  const method = req.method;
  const ip = req.socket.remoteAddress || "unknown";

  try {
    if (method === "GET" && (pathname === "/api/blogs" || pathname === "/api/blogs/")) {
      const rows = db.prepare("SELECT * FROM blogs WHERE status = 'published' ORDER BY day_number DESC").all();
      return sendJson(res, 200, rows.map(rowToBlog));
    }
    if (method === "GET" && pathname.startsWith("/api/blogs/")) {
      const id = pathname.slice("/api/blogs/".length);
      const row = db.prepare("SELECT * FROM blogs WHERE (id = ? OR slug = ?) AND status = 'published'").get(id, id);
      if (!row) return sendJson(res, 404, { error: "Blog not found" });
      return sendJson(res, 200, rowToBlog(row));
    }

    if (method === "POST" && (pathname === "/api/messages" || pathname === "/api/messages/")) {
      const body = await readBody(req);
      const senderName = typeof body.senderName === "string" ? body.senderName.trim().slice(0, 80) : "";
      const messageContent = typeof body.message === "string" ? body.message.trim() : "";
      if (!messageContent) return sendJson(res, 400, { error: "Message is required." });
      if (messageContent.length > 4000) return sendJson(res, 400, { error: "Message is too long." });
      let blogId = null;
      if (body.blogId != null) {
        const blog = db.prepare("SELECT id FROM blogs WHERE id = ?").get(Number(body.blogId));
        if (blog) blogId = blog.id;
      }
      if (rateLimited(ip)) return sendJson(res, 429, { error: "Too many messages. Please try again in a minute." });
      const info = db.prepare("INSERT INTO messages (sender_name, message_content, blog_id) VALUES (?, ?, ?)")
        .run(senderName || null, messageContent, blogId);
      return sendJson(res, 201, {
        ok: true,
        id: info.lastInsertRowid,
        confirmation: "Your message has been sent successfully. Thank you for sharing your thoughts.",
      });
    }

    if (method === "POST" && pathname === "/api/admin/login") {
      const configured = getConfiguredPassword();
      const envPresent = configured !== null;
      console.log("[auth] login attempt; ADMIN_PASSWORD present in environment: " + envPresent);
      if (!envPresent) {
        return sendJson(res, 500, { error: "Admin password is not configured on the server (ADMIN_PASSWORD missing). Set it and restart the server." });
      }
      const body = await readBody(req);
      const admin = db.prepare("SELECT * FROM admin").get();
      const supplied = body.password != null ? String(body.password).trim() : "";
      const verified = !!admin && verifyPassword(supplied, admin.password_hash);
      console.log("[auth] password verification: " + (verified ? "succeeded" : "failed") + "; admin record: " + (admin ? "found" : "missing"));
      if (!verified) {
        return sendJson(res, 401, { error: "Invalid password." });
      }
      const token = createSession(admin.id);
      console.log("[auth] session created for admin id " + admin.id + "; session cookie issued to client.");
      res.setHeader("Set-Cookie", "admin_session=" + token + "; HttpOnly; Path=/; SameSite=Lax; Max-Age=" + (12 * 3600));
      return sendJson(res, 200, { ok: true });
    }
    if (method === "POST" && pathname === "/api/admin/logout") {
      deleteSession(parseCookies(req).admin_session);
      console.log("[auth] session invalidated (logout).");
      res.setHeader("Set-Cookie", "admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0");
      return sendJson(res, 200, { ok: true });
    }
    if (method === "GET" && pathname === "/api/admin/me") {
      return sendJson(res, 200, { authenticated: isAdmin(req) });
    }

    if (pathname.startsWith("/api/admin/messages")) {
      if (!isAdmin(req)) return sendJson(res, 401, { error: "Admin access required." });
      if (method === "GET" && (pathname === "/api/admin/messages" || pathname === "/api/admin/messages/")) {
        const q = (url.searchParams.get("q") || "").toLowerCase();
        const order = url.searchParams.get("order") === "oldest" ? "ASC" : "DESC";
        const filter = url.searchParams.get("filter");
        let sql = MESSAGE_SELECT;
        const conditions = [];
        const params = [];
        if (filter === "unread") conditions.push("m.is_read = 0");
        if (filter === "read") conditions.push("m.is_read = 1");
        if (q) {
          conditions.push("(lower(m.sender_name) LIKE ? OR lower(m.message_content) LIKE ?)");
          params.push("%" + q + "%", "%" + q + "%");
        }
        if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
        sql += " ORDER BY m.created_at " + order + ", m.id " + order;
        const rows = db.prepare(sql).all(...params);
        return sendJson(res, 200, rows.map(rowToMessage));
      }
      const idMatch = pathname.match(/^\/api\/admin\/messages\/(\d+)$/);
      if (idMatch) {
        const id = Number(idMatch[1]);
        if (method === "GET") {
          const row = db.prepare(MESSAGE_SELECT + " WHERE m.id = ?").get(id);
          if (!row) return sendJson(res, 404, { error: "Message not found." });
          return sendJson(res, 200, rowToMessage(row));
        }
        if (method === "PATCH") {
          const body = await readBody(req);
          if (typeof body.isRead === "boolean") {
            db.prepare("UPDATE messages SET is_read = ?, read_at = ? WHERE id = ?")
              .run(body.isRead ? 1 : 0, body.isRead ? new Date().toISOString() : null, id);
          }
          const row = db.prepare(MESSAGE_SELECT + " WHERE m.id = ?").get(id);
          return sendJson(res, 200, row ? rowToMessage(row) : { error: "Message not found." });
        }
        if (method === "DELETE") {
          db.prepare("DELETE FROM messages WHERE id = ?").run(id);
          return sendJson(res, 200, { ok: true });
        }
      }
    }

    if (pathname.startsWith("/api/admin/blogs")) {
      if (!isAdmin(req)) return sendJson(res, 401, { error: "Admin access required." });
      if (method === "GET" && (pathname === "/api/admin/blogs" || pathname === "/api/admin/blogs/")) {
        const rows = db.prepare("SELECT * FROM blogs ORDER BY day_number ASC").all();
        return sendJson(res, 200, rows.map(rowToBlog));
      }
      if (method === "POST" && (pathname === "/api/admin/blogs" || pathname === "/api/admin/blogs/")) {
        const body = await readBody(req);
        const dayNumber = Number(body.dayNumber);
        const title = String(body.title || "").trim();
        if (!dayNumber || !title) return sendJson(res, 400, { error: "Day number and title are required." });
        const status = body.status === "published" ? "published" : "draft";
        const publishedAt = status === "published" ? (body.publishedAt || new Date().toISOString()) : null;
        const info = db.prepare(
          "INSERT INTO blogs (day_number, title, slug, content, status, published_at) VALUES (?, ?, ?, ?, ?, ?)"
        ).run(dayNumber, title, slugify(title) + "-" + dayNumber, String(body.content || ""), status, publishedAt);
        return sendJson(res, 201, rowToBlog(db.prepare("SELECT * FROM blogs WHERE id = ?").get(info.lastInsertRowid)));
      }
      const idMatch = pathname.match(/^\/api\/admin\/blogs\/(\d+)(?:\/publish)?$/);
      if (idMatch) {
        const id = Number(idMatch[1]);
        if (method === "PUT") {
          const body = await readBody(req);
          const row = db.prepare("SELECT * FROM blogs WHERE id = ?").get(id);
          if (!row) return sendJson(res, 404, { error: "Blog not found." });
          const status = body.status != null ? (body.status === "published" ? "published" : "draft") : row.status;
          const publishedAt = status === "published" ? (body.publishedAt || row.published_at || new Date().toISOString()) : null;
          const dayNumber = body.dayNumber != null ? Number(body.dayNumber) : row.day_number;
          db.prepare(
            "UPDATE blogs SET day_number = ?, title = ?, slug = ?, content = ?, status = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?"
          ).run(
            dayNumber,
            body.title != null ? String(body.title) : row.title,
            body.title != null ? slugify(body.title) + "-" + dayNumber : row.slug,
            body.content != null ? String(body.content) : row.content,
            status, publishedAt, id
          );
          return sendJson(res, 200, rowToBlog(db.prepare("SELECT * FROM blogs WHERE id = ?").get(id)));
        }
        if (method === "PATCH" && pathname.endsWith("/publish")) {
          const body = await readBody(req);
          const published = body.published !== false;
          db.prepare("UPDATE blogs SET status = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?")
            .run(published ? "published" : "draft", published ? new Date().toISOString() : null, id);
          return sendJson(res, 200, rowToBlog(db.prepare("SELECT * FROM blogs WHERE id = ?").get(id)));
        }
        if (method === "DELETE") {
          db.prepare("DELETE FROM blogs WHERE id = ?").run(id);
          return sendJson(res, 200, { ok: true });
        }
      }
    }

    if (method === "GET" && !pathname.startsWith("/api/")) {
      const filePath = pathname === "/" ? path.join(DIST, "index.html") : path.join(DIST, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ogg": "audio/ogg", ".woff2": "font/woff2" };
        res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
        return res.end(fs.readFileSync(filePath));
      }
      if (fs.existsSync(path.join(DIST, "index.html"))) {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(fs.readFileSync(path.join(DIST, "index.html")));
      }
      return sendJson(res, 404, { error: "Not found. Run npm run build first." });
    }

    return sendJson(res, 404, { error: "Not found." });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: "Server error." });
  }
});

server.listen(PORT, () => console.log("[server] http://localhost:" + PORT));
