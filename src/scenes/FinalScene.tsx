import { motion } from "framer-motion";
import MemoryGrid from "../components/MemoryGrid";
import { allMemories, final } from "../data/memories";

export default function FinalScene() {
  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-6xl px-5 pb-40 pt-24 sm:px-8 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-violet-300/80">The end of the journey</p>
        <h1 className="font-serif-display text-glow mt-5 text-5xl leading-tight text-white sm:text-6xl lg:text-7xl">
          {final.title}
        </h1>
        <p className="mt-4 text-xl tracking-wide text-violet-100/90">{final.subtitle}</p>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="font-serif-display mt-20 text-center text-3xl text-white sm:text-4xl"
      >
        {final.sectionHeading}
      </motion.h2>

      <MemoryGrid memories={allMemories} />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mx-auto mt-24 max-w-2xl text-center"
      >
        <div aria-hidden="true" className="mx-auto mb-10 h-px w-32 bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
        {final.closingLines.map((line, i) => (
          <p key={i} className="font-serif-display mt-6 text-2xl leading-relaxed text-violet-50/95 sm:text-3xl">
            {line}
          </p>
        ))}
        <p className="mt-16 text-xs uppercase tracking-[0.35em] text-violet-200/50">
          Preserved · 2026
        </p>
      </motion.div>
    </section>
  );
}
