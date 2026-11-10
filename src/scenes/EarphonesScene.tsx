import { motion } from "framer-motion";
import { Check, Headphones } from "lucide-react";
import { earphones } from "../data/memories";

export default function EarphonesScene({ onReady }: { onReady: () => void }) {
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex h-32 w-32 items-center justify-center rounded-full border border-violet-300/30 bg-violet-400/10 shadow-[0_0_60px_rgba(216,180,254,0.35)]"
      >
        <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border border-violet-300/20" />
        <Headphones className="h-14 w-14 text-violet-100" aria-hidden="true" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-10 text-sm tracking-wide text-violet-200/80"
      >
        {earphones.suggestion}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
        className="font-serif-display text-glow mt-4 text-4xl text-white sm:text-5xl"
      >
        {earphones.heading}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="mt-4 max-w-md text-base leading-relaxed text-violet-100/85"
      >
        {earphones.subheading}
      </motion.p>

      <motion.button
        type="button" onClick={onReady}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
        className="mt-12 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-400/90 to-fuchsia-400/70 px-8 py-4 text-base font-semibold text-white shadow-[0_0_38px_rgba(216,180,254,0.45)]"
      >
        <Check className="h-5 w-5" aria-hidden="true" />
        {earphones.buttonLabel}
      </motion.button>
    </section>
  );
}
