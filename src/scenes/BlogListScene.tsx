import { motion } from "framer-motion";
import { BookOpenText } from "lucide-react";
import BlogCard from "../components/BlogCard";
import { journalEntries } from "../data/journal";

export default function BlogListScene({ onOpen }: { onOpen: (id: number) => void }) {
  const [latest, ...older] = journalEntries;

  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-6xl px-5 pb-40 pt-24 sm:px-8 sm:pt-28">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} className="text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-violet-300/80">A personal digital journal</p>
        <h1 className="font-serif-display text-glow mt-4 text-4xl leading-tight text-white sm:text-5xl">Daily Blogs</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-violet-100/85">
          Thoughts, everyday moments, memories and the things that are easier to write than to say.
        </p>
      </motion.div>

      {journalEntries.length === 0 && (
        <div className="mx-auto mt-16 max-w-md text-center">
          <BookOpenText className="mx-auto h-10 w-10 text-violet-300/60" aria-hidden="true" />
          <p className="font-serif-display mt-4 text-2xl text-white">The journal is quiet for now.</p>
          <p className="mt-2 text-sm leading-relaxed text-violet-100/75">
            The first entry is being written. Check back soon — or leave a message in the meantime.
          </p>
        </div>
      )}

      {latest && (
        <>
          <motion.article
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-card mx-auto mt-12 max-w-3xl rounded-3xl p-7 sm:p-9"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-amber-200/40 bg-amber-200/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-100">
                Latest · Day {latest.dayNumber}
              </span>
              {latest.date && (
                <time dateTime={latest.date} className="text-xs uppercase tracking-[0.15em] text-violet-200/60">
                  {new Date(`${latest.date}T12:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                </time>
              )}
            </div>
            <h2 className="font-serif-display mt-5 text-3xl leading-tight text-white sm:text-4xl">{latest.title}</h2>
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-violet-100/85">
              {latest.content.replace(/[#>*`]/g, "").slice(0, 260)}
            </p>
            <button type="button" onClick={() => onOpen(latest.id)}
              className="mt-6 rounded-full bg-gradient-to-r from-violet-400/90 to-fuchsia-400/70 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_26px_rgba(216,180,254,0.35)] transition hover:scale-[1.02]">
              Read the latest entry
            </button>
          </motion.article>

          {older.length > 0 && (
            <>
              <h2 className="font-serif-display mt-16 text-center text-2xl text-white sm:text-3xl">Earlier entries</h2>
              <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                {older.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} onOpen={() => onOpen(blog.id)} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
