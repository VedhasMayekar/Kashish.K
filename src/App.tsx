import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarfieldBackground from "./components/StarfieldBackground";
import ProgressIndicator from "./components/ProgressIndicator";
import SceneNavigation from "./components/SceneNavigation";
import IntroScene from "./scenes/IntroScene";
import EarphonesScene from "./scenes/EarphonesScene";
import LetterScene from "./scenes/LetterScene";
import MemoriesScene from "./scenes/MemoriesScene";
import TimelineScene from "./scenes/TimelineScene";
import LittleThingsScene from "./scenes/LittleThingsScene";
import InterestsScene from "./scenes/InterestsScene";
import UniverseScene from "./scenes/UniverseScene";
import FinalScene from "./scenes/FinalScene";
import { letterScenes, letterScenesB } from "./data/memories";

const ALL_LETTER_SCENES = [...letterScenes, ...letterScenesB];

type SceneKey = "intro" | "earphones" | "letter" | "memories" | "timeline" | "little" | "interests" | "universe" | "final";

const sceneKeys: SceneKey[] = [
  "intro",
  "earphones",
  ...ALL_LETTER_SCENES.map((_, i) => `letter-${i}` as SceneKey),
  "memories",
  "timeline",
  "little",
  "interests",
  "universe",
  "final",
];

export default function App() {
  const [index, setIndex] = useState(0);
  const total = sceneKeys.length;
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(Math.min(Math.max(i, 0), total - 1));
  }, [total]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, total]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [index]);

  const currentKey = sceneKeys[index];
  const letterIndex = currentKey.startsWith("letter-")
    ? Number(currentKey.slice("letter-".length))
    : -1;

  const sceneNode = useMemo(() => {
    if (currentKey === "intro") return <IntroScene onEnter={next} />;
    if (currentKey === "earphones") return <EarphonesScene onReady={next} />;
    if (currentKey === "memories") return <MemoriesScene />;
    if (currentKey === "timeline") return <TimelineScene />;
    if (currentKey === "little") return <LittleThingsScene />;
    if (currentKey === "interests") return <InterestsScene />;
    if (currentKey === "universe") return <UniverseScene />;
    if (currentKey === "final") return <FinalScene />;
    if (letterIndex >= 0) return <LetterScene scene={ALL_LETTER_SCENES[letterIndex]} />;
    return null;
  }, [currentKey, letterIndex, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -60) next();
    if (dx > 60) prev();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative min-h-[100dvh] bg-[#03030e] text-violet-50"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#0a0620] via-[#050510] to-[#03030e]" />
      <StarfieldBackground density={currentKey === "universe" ? 1.2 : 1} />

      <ProgressIndicator index={index} total={total} />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {sceneNode}
          </motion.div>
        </AnimatePresence>
      </main>

      <SceneNavigation
        onPrev={prev} onNext={next}
        isFirst={index === 0} isLast={index === total - 1}
        onRestart={() => goTo(0)}
      />

      <a
        href="#main-skip"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-violet-400 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
    </div>
  );
}
