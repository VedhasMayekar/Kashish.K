import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Inbox, LogOut, Lock, Mail, MailOpen, RefreshCw, Search, Trash2 } from "lucide-react";
import { adminDeleteMessage, adminFetchMessages, adminLogin, adminLogout, adminMe, adminUpdateMessage } from "../api";
import type { Message } from "../types";

type Filter = "all" | "unread" | "read";

export default function AdminScene() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetchMessages({ q, order, filter });
      setMessages(data);
      setSelected((prev) => (prev ? data.find((m) => m.id === prev.id) ?? null : null));
    } catch { /* keep current list */ }
    setLoading(false);
  }, [q, order, filter]);

  useEffect(() => { adminMe().then((r) => setAuthed(r.authenticated)).catch(() => setAuthed(false)); }, []);

  useEffect(() => {
    if (!authed) return;
    load();
    timer.current = setInterval(load, 15000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [authed, load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoggingIn(true); setLoginError("");
    try { await adminLogin(password); setPassword(""); setAuthed(true); }
    catch (err) {
      setLoginError(err instanceof Error ? err.message : "Invalid password.");
    }
    setLoggingIn(false);
  };
  const logout = async () => { await adminLogout(); setAuthed(false); setMessages([]); setSelected(null); };

  const toggleRead = async (m: Message) => {
    const updated = await adminUpdateMessage(m.id, !m.isRead);
    setMessages((list) => list.map((x) => (x.id === m.id ? updated : x)));
    if (selected?.id === m.id) setSelected(updated);
  };
  const remove = async (m: Message) => {
    await adminDeleteMessage(m.id);
    setMessages((list) => list.filter((x) => x.id !== m.id));
    if (selected?.id === m.id) setSelected(null);
  };

  const total = messages.length;
  const unread = messages.filter((m) => !m.isRead).length;

  if (authed === null) {
    return <section className="flex min-h-[100dvh] items-center justify-center text-sm text-violet-200/70">Checking access...</section>;
  }

  if (!authed) {
    return (
      <section className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center px-5 pb-32">
        <div className="w-full">
          <Lock className="mx-auto h-10 w-10 text-violet-300/70" aria-hidden="true" />
          <h1 className="font-serif-display mt-5 text-center text-3xl text-white">Admin only</h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-violet-100/75">
            This space is private. Messages sent through the website appear here and nowhere else.
          </p>
          <form onSubmit={login} className="mt-8 w-full space-y-4">
            <label className="block text-xs uppercase tracking-[0.2em] text-violet-200/70" htmlFor="admin-pass">Admin password</label>
            <input id="admin-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-violet-300/50" />
            {loginError && <p role="alert" className="rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{loginError}</p>}
            <button type="submit" disabled={loggingIn}
              className="w-full rounded-full bg-gradient-to-r from-violet-400/90 to-fuchsia-400/70 px-6 py-3.5 text-base font-semibold text-white disabled:opacity-50">
              {loggingIn ? "Checking..." : "Unlock inbox"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-6xl px-5 pb-40 pt-24 sm:px-8 sm:pt-28">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-violet-300/80">Private inbox</p>
            <h1 className="font-serif-display text-glow mt-3 text-4xl text-white">Messages</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={load} aria-label="Refresh" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-violet-100 transition hover:bg-white/10">
              <RefreshCw className={"h-4 w-4" + (loading ? " animate-spin" : "")} />
            </button>
            <button type="button" onClick={logout} aria-label="Log out" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-violet-100 transition hover:bg-white/10">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: total, icon: Inbox },
            { label: "Unread", value: unread, icon: Mail },
            { label: "Read", value: total - unread, icon: MailOpen },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-3xl p-5 text-center">
              <s.icon className="mx-auto h-5 w-5 text-violet-300" aria-hidden="true" />
              <p className="font-serif-display mt-2 text-3xl text-white">{s.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-violet-200/60">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-200/50" aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or message..."
            aria-label="Search messages"
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-violet-200/40 outline-none transition focus:border-violet-300/50" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "unread", "read"] as Filter[]).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={"rounded-full border px-4 py-2.5 text-xs capitalize transition " + (filter === f ? "border-violet-300/50 bg-violet-400/20 text-white" : "border-white/10 text-violet-100/80 hover:bg-white/5")}>
              {f}
            </button>
          ))}
          <button type="button" onClick={() => setOrder(order === "newest" ? "oldest" : "newest")}
            className="rounded-full border border-white/10 px-4 py-2.5 text-xs text-violet-100/80 transition hover:bg-white/5">
            {order === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setSelected(m)}
                className={"w-full rounded-3xl border p-5 text-left transition " + (selected?.id === m.id ? "border-violet-300/50 bg-violet-400/10" : "glass-card hover:border-violet-300/35")}>
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-semibold text-white">{m.senderName}</p>
                  {!m.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-300" aria-label="Unread" />}
                </div>
                <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm leading-relaxed text-violet-100/80">{m.messageContent}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-violet-200/50">
                  {new Date(m.createdAt).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                  {m.blogDayNumber ? " · Day " + m.blogDayNumber : ""}
                </p>
              </button>
            </li>
          ))}
          {messages.length === 0 && (
            <li className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-violet-100/70">
              No messages match. New messages appear here automatically.
            </li>
          )}
        </ul>

        <div className="glass-card self-start rounded-3xl p-6 sm:p-7 lg:sticky lg:top-24">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif-display text-2xl text-white">{selected.senderName}</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-violet-200/60">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                  {selected.blogTitle && (
                    <p className="mt-1 text-xs text-violet-300/80">Re: Day {selected.blogDayNumber} — {selected.blogTitle}</p>
                  )}
                </div>
                <span className={"rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] " + (selected.isRead ? "bg-white/10 text-violet-200/70" : "bg-amber-300/15 text-amber-200")}>
                  {selected.isRead ? "Read" : "Unread"}
                </span>
              </div>
              <p className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-violet-50/95">{selected.messageContent}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <button type="button" onClick={() => toggleRead(selected)}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-violet-100 transition hover:bg-white/10">
                  <MailOpen className="h-4 w-4" /> {selected.isRead ? "Mark as unread" : "Mark as read"}
                </button>
                <button type="button" onClick={() => remove(selected)}
                  className="flex items-center gap-2 rounded-full border border-red-300/30 px-4 py-2.5 text-sm text-red-200 transition hover:bg-red-400/10">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </>
          ) : (
            <p className="py-10 text-center text-sm leading-relaxed text-violet-100/70">
              Select a message to read it here.<br />The inbox refreshes itself every 15 seconds.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}


