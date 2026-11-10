import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { TimelineEvent as TimelineEventType } from "../data/memories";

interface Props {
  event: TimelineEventType;
  open: boolean;
  onToggle: () => void;
  index: number;
}

export default function TimelineEvent({ event, open, onToggle, index }: Props) {
  return (
    <motion.li
      initial={{ opacity: 0, x: index % 2 === 0 ? -14 : 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative pl-10 sm:pl-14"
    >
      <span aria-hidden="true" className="absolute left-[7px] top-6 h-3 w-3 rounded-full bg-gradient-to-br from-violet-300 to-amber-200 shadow-[0_0_12px_rgba(216,180,254,0.8)] sm:left-[11px]" />
      <button
        type="button" onClick={onToggle} aria-expanded={open}
        className="glass-card w-full rounded-3xl p-5 text-left transition hover:border-violet-300/35"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-amber-200/85">{event.date}</p>
            <h3 className="mt-1.5 font-serif-display text-xl text-white">{event.title}</h3>
          </div>
          <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-violet-200/70 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden text-sm leading-relaxed text-violet-100/85"
            >
              <span className="block pt-3">{event.description}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  );
}
