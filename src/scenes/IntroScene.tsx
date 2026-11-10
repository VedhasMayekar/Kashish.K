import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { intro } from "../data/memories";

export default function IntroScene({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.4em" }}
        animate={{ opacity: 1, letterSpacing: "0.3em" }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="text-[11px] uppercase text-violet-200/70"
      >
        21 October — 10 November 2026
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="font-serif-display text-glow mt-6 max-w-3xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
      >
        {intro.lines[0]}
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
        className="mt-5 max-w-2xl text-xl leading-relaxed text-violet-100/90 sm:text-2xl"
      >
        {intro.lines[1]}
      </motion.h2>

      <motion.button
        type="button" onClick={onEnter}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 2, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="mt-12 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-400/90 to-fuchsia-400/70 px-8 py-4 text-base font-semibold text-white shadow-[0_0_38px_rgba(216,180,254,0.45)]"
      >
        {intro.buttonLabel}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="mt-8 text-xs text-violet-200/50"
      >
        A private memory project · nothing here is shared or sent anywhere
      </motion.p>
    </section>
  );
}
