import { motion } from "framer-motion";
import { AudioLines, CalendarRange, Mail } from "lucide-react";
import type { LetterScene as LetterSceneType } from "../data/memories";
import { audioClips } from "../data/memories";
import AudioPlayer from "../components/AudioPlayer";

const accentStyles: Record<string, string> = {
  lavender: "from-violet-400/20 via-transparent to-transparent",
  gold: "from-amber-200/20 via-transparent to-transparent",
  pink: "from-fuchsia-300/20 via-transparent to-transparent",
};

export default function LetterScene({ scene }: { scene: LetterSceneType }) {
  const paragraphs = scene.content.split(/\n\s*\n/).filter(Boolean);
  const clip = scene.hasAudio ? audioClips[0] : undefined;

  return (
    <section className="relative mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col px-5 pb-36 pt-24 sm:px-8 sm:pt-28">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b ${accentStyles[scene.accent ?? "lavender"]} blur-2xl`}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative"
      >
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-violet-300/80">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          Chapter {scene.sceneNumber} · The letter
        </p>
        <h1 className="font-serif-display text-glow mt-4 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          {scene.heading}
        </h1>
        {scene.dateRange && (
          <p className="mt-4 flex items-center gap-2 text-sm tracking-[0.2em] text-amber-200/90">
            <CalendarRange className="h-4 w-4" aria-hidden="true" />
            {scene.dateRange}
          </p>
        )}
        <div aria-hidden="true" className="mt-6 h-px w-24 bg-gradient-to-r from-violet-300/70 to-transparent" />
      </motion.div>

      <div className="scroll-slim relative mt-8 max-h-[52dvh] overflow-y-auto pr-2 sm:max-h-[56dvh]">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.35 + i * 0.28, ease: "easeOut" }}
            className="mb-6 whitespace-pre-wrap text-[17px] leading-[1.9] text-violet-50/95 sm:text-lg lg:text-xl"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {clip && (
        <div className="relative">
          <p className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-violet-300/80">
            <AudioLines className="h-3.5 w-3.5" aria-hidden="true" />
            Listen, if you wish — only when you tap play
          </p>
          <AudioPlayer clip={clip} />
        </div>
      )}
    </section>
  );
}
