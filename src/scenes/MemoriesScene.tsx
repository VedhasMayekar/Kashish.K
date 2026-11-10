import { motion } from "framer-motion";
import MemoryGrid from "../components/MemoryGrid";
import { sharedMemories } from "../data/memories";

export default function MemoriesScene() {
  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-6xl px-5 pb-36 pt-24 sm:px-8 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-violet-300/80">The memory universe</p>
        <h1 className="font-serif-display text-glow mt-4 max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
          The Things That Made This Little Universe
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-violet-100/85">
          Sixteen small shared moments — each one its own little star.
        </p>
      </motion.div>

      <MemoryGrid memories={sharedMemories} />
    </section>
  );
}
