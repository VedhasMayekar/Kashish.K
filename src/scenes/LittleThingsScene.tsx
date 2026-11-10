import { motion } from "framer-motion";
import { Icon } from "../components/Icon";
import { littleThings } from "../data/memories";

export default function LittleThingsScene() {
  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-6xl px-5 pb-36 pt-24 sm:px-8 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-violet-300/80">The little details</p>
        <h1 className="font-serif-display text-glow mt-4 text-4xl leading-tight text-white sm:text-5xl">
          It&apos;s Always the Little Things.
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 pt-10 md:grid-cols-3 lg:grid-cols-4">
        {littleThings.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-3xl p-5 text-center transition-colors hover:border-violet-300/35"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/25 to-fuchsia-400/15 text-violet-100 shadow-[0_0_18px_rgba(216,180,254,0.25)]">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif-display text-base text-white">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-violet-100/75">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
