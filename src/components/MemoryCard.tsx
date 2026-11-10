import { motion } from "framer-motion";
import { Icon } from "./Icon";

interface Props {
  title: string;
  description?: string;
  category?: string;
  icon: string;
  date?: string;
  index: number;
}

export default function MemoryCard({ title, description, category, icon, date, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: (index % 6) * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="glass-card group rounded-3xl p-5 transition-colors hover:border-violet-300/35"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/25 to-fuchsia-400/15 text-violet-100 shadow-[0_0_18px_rgba(216,180,254,0.25)] transition group-hover:scale-105">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        {category && (
          <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-violet-200/80">
            {category}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-serif-display text-lg leading-snug text-white">{title}</h3>
      {description && <p className="mt-2 text-sm leading-relaxed text-violet-100/80">{description}</p>}
      {date && <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-amber-200/80">{date}</p>}
    </motion.article>
  );
}
