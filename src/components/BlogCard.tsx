import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Blog } from "../types";

export default function BlogCard({ blog, onOpen, index }: { blog: Blog; onOpen: () => void; index: number }) {
  const date = blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "";
  const excerpt = blog.content.replace(/[#>*`]/g, "").split(/\n\s*\n/)[0]?.slice(0, 180) || "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-3xl p-6 transition-colors hover:border-violet-300/35"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-violet-300/30 bg-violet-400/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-violet-100">
          Day {blog.dayNumber}
        </span>
        {date && (
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-violet-200/60">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {date}
          </span>
        )}
      </div>
      <h3 className="font-serif-display mt-4 text-2xl leading-snug text-white">{blog.title}</h3>
      {excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-violet-100/80">{excerpt}</p>}
      <button type="button" onClick={onOpen}
        className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-200 transition hover:text-white">
        Read entry <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.article>
  );
}
