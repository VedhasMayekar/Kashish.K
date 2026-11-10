import { motion } from "framer-motion";
import { Orbit } from "lucide-react";
import { universe } from "../data/memories";

export default function UniverseScene() {
  return (
    <section className="relative mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col items-center justify-center px-5 pb-36 pt-24 text-center sm:px-8 sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="relative h-[300px] w-[300px] sm:h-[420px] sm:w-[420px]"
        >
          <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/20 blur-xl" />
          <span className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-violet-300/60 to-indigo-400/40 text-white shadow-[0_0_40px_rgba(216,180,254,0.7)]">
            <Orbit className="h-7 w-7" aria-hidden="true" />
          </span>
          <span className="absolute bottom-0 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-amber-200/60 to-orange-300/40 text-white shadow-[0_0_34px_rgba(252,217,160,0.65)]">
            <Orbit className="h-6 w-6" aria-hidden="true" />
          </span>
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(216,180,254,0.25)" strokeDasharray="1 3" />
            <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(252,217,160,0.35)" strokeDasharray="1 4" />
          </svg>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="relative text-[11px] uppercase tracking-[0.35em] text-violet-300/80"
      >
        Two stars, one orbit
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.7, duration: 1.1, ease: "easeOut" }}
        className="font-serif-display text-glow relative mt-6 max-w-3xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
      >
        {universe.heading}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 1, ease: "easeOut" }}
        className="relative mt-5 max-w-2xl text-lg leading-relaxed text-violet-100/90"
      >
        {universe.subtitle}
      </motion.p>
    </section>
  );
}
