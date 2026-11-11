import type { Blog, Message } from "./types";

const BASE = "";

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown = null;
  try { data = JSON.parse(text); } catch { /* non-json */ }
  if (!res.ok) {
    const err = (data as { error?: string } | null)?.error || `Request failed (${res.status})`;
    throw new Error(err);
  }
  return data as T;
}

export async function fetchBlogs(): Promise<Blog[]> {
  const res = await fetch(`${BASE}/api/blogs`);
  return handle<Blog[]>(res);
}

export async function fetchBlog(id: number): Promise<Blog> {
  const res = await fetch(`${BASE}/api/blogs/${id}`);
  return handle<Blog>(res);
}

export async function submitMessage(payload: { senderName?: string; message: string; blogId?: number | null }): Promise<{ ok: boolean; id: number; confirmation: string }> {
  const res = await fetch(`${BASE}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

// --- admin ---
export async function adminLogin(password: string) {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    credentials: "include",
  });
  if (!res.ok) {
    // Genuine 401 = wrong password. Anything else (e.g. 500 for missing
    // ADMIN_PASSWORD config) should surface the server's real message so
    // a config problem is not misreported as "Invalid password".
    if (res.status === 401) throw new Error("Invalid password.");
    let message = `Login failed (${res.status}).`;
    try {
      const data = await res.json();
      if (data && typeof data.error === "string") message = data.error;
    } catch { /* keep default */ }
    throw new Error(message);
  }
  return handle(res);
}

export async function adminLogout() {
  await fetch(`${BASE}/api/admin/logout`, { method: "POST", credentials: "include" });
}

export async function adminMe(): Promise<{ authenticated: boolean }> {
  const res = await fetch(`${BASE}/api/admin/me`, { credentials: "include" });
  return handle(res);
}

export async function adminFetchMessages(params?: { q?: string; order?: string; filter?: string }): Promise<Message[]> {
  const qs = new URLSearchParams(params || {}).toString();
  const res = await fetch(`${BASE}/api/admin/messages${qs ? `?${qs}` : ""}`, { credentials: "include" });
  return handle<Message[]>(res);
}

export async function adminUpdateMessage(id: number, isRead: boolean) {
  const res = await fetch(`${BASE}/api/admin/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isRead }),
    credentials: "include",
  });
  return handle<Message>(res);
}

export async function adminDeleteMessage(id: number) {
  const res = await fetch(`${BASE}/api/admin/messages/${id}`, { method: "DELETE", credentials: "include" });
  return handle(res);
}

export async function adminFetchBlogs(): Promise<Blog[]> {
  const res = await fetch(`${BASE}/api/admin/blogs`, { credentials: "include" });
  return handle<Blog[]>(res);
}

export async function adminCreateBlog(blog: Partial<Blog>) {
  const res = await fetch(`${BASE}/api/admin/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
    credentials: "include",
  });
  return handle<Blog>(res);
}

export async function adminUpdateBlog(id: number, blog: Partial<Blog>) {
  const res = await fetch(`${BASE}/api/admin/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
    credentials: "include",
  });
  return handle<Blog>(res);
}

export async function adminPublishBlog(id: number, published: boolean) {
  const res = await fetch(`${BASE}/api/admin/blogs/${id}/publish`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ published }),
    credentials: "include",
  });
  return handle<Blog>(res);
}

export async function adminDeleteBlog(id: number) {
  const res = await fetch(`${BASE}/api/admin/blogs/${id}`, { method: "DELETE", credentials: "include" });
  return handle(res);
}
