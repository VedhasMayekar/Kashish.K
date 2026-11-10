import { motion } from "framer-motion";

export default function ProgressIndicator({ index, total }: { index: number; total: number }) {
  const pct = ((index + 1) / total) * 100;
  return (
    <div className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={total} aria-label="Reading progress">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.3em] text-violet-200/80">
          Scene {index + 1} / {total}
        </span>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
