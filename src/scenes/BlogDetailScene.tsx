import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Send } from "lucide-react";
import BlogContent from "../components/BlogContent";
import { getJournalEntry, journalEntries, type JournalEntry } from "../data/journal";

interface Props { blogId: number; onBack: () => void; onOpen: (id: number) => void; onMessage: (blog: JournalEntry) => void }

export default function BlogDetailScene({ blogId, onBack, onOpen, onMessage }: Props) {
  const blog = getJournalEntry(blogId);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setProgress(total > 0 ? (Math.min(Math.max(-rect.top, 0), total) / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [blogId]);

  const idx = journalEntries.findIndex((entry) => entry.id === blogId);
  const newer = idx > 0 ? journalEntries[idx - 1] : null;
  const older = idx >= 0 && idx < journalEntries.length - 1 ? journalEntries[idx + 1] : null;

  const navBtn = "flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-violet-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section ref={articleRef} className="relative mx-auto min-h-[100dvh] w-full max-w-3xl px-5 pb-44 pt-24 sm:px-8 sm:pt-28">
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-30 h-[3px] bg-white/5">
        <div className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200" style={{ width: `${progress}%` }} />
      </div>

      <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-violet-200/80 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All entries
      </button>

      {blog ? (
        <>
          <motion.header initial={{ opacity: 0, y: 14, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: "easeOut" }} className="mt-10">
            <span className="rounded-full border border-violet-300/30 bg-violet-400/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-violet-100">Day {blog.dayNumber}</span>
            <h1 className="font-serif-display text-glow mt-5 text-4xl leading-tight text-white sm:text-5xl">{blog.title}</h1>
            {blog.date && (
              <p className="mt-4 flex items-center gap-2 text-sm tracking-[0.15em] text-violet-200/70">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                <time dateTime={blog.date}>{new Date(`${blog.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</time>
              </p>
            )}
            <div aria-hidden="true" className="mt-7 h-px w-24 bg-gradient-to-r from-violet-300/70 to-transparent" />
          </motion.header>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.8 }} className="mt-10">
            <BlogContent content={blog.content} />
          </motion.div>

          <div className="mt-14">
            <button type="button" onClick={() => onMessage(blog)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-400/90 to-fuchsia-400/70 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_26px_rgba(216,180,254,0.35)] transition hover:scale-[1.02] sm:w-auto">
              <Send className="h-4 w-4" aria-hidden="true" /> Send a message about this day
            </button>
          </div>

          <nav aria-label="Blog navigation" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" disabled={!newer} onClick={() => newer && onOpen(newer.id)} className={navBtn}>
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-violet-200/60">Newer</span>
                <span className="block truncate">{newer ? `Day ${newer.dayNumber} — ${newer.title}` : "No newer entry"}</span>
              </span>
            </button>
            <button type="button" disabled={!older} onClick={() => older && onOpen(older.id)} className={navBtn + " sm:ml-auto"}>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-violet-200/60">Older</span>
                <span className="block truncate">{older ? `Day ${older.dayNumber} — ${older.title}` : "No older entry"}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>
          </nav>
        </>
      ) : (
        <p role="status" className="mt-16 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-center text-sm text-violet-100/80">
          This journal entry is not available.
        </p>
      )}
    </section>
  );
}
