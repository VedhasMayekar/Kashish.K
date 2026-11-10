import { motion } from "framer-motion";
import Timeline from "../components/Timeline";
import { timelineEvents } from "../data/memories";

export default function TimelineScene() {
  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-6xl px-5 pb-36 pt-24 sm:px-8 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-violet-300/80">The timeline</p>
        <h1 className="font-serif-display text-glow mt-4 text-4xl leading-tight text-white sm:text-5xl">
          October 21 — November 10
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-violet-100/85">
          Twenty days, six dates. Tap any star to open its story.
        </p>
      </motion.div>

      <Timeline events={timelineEvents} />
    </section>
  );
}
