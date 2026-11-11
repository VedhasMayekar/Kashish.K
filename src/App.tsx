import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarfieldBackground from "./components/StarfieldBackground";
import ProgressIndicator from "./components/ProgressIndicator";
import SceneNavigation from "./components/SceneNavigation";
import FloatingNav, { type NavView } from "./components/FloatingNav";
import MessageModal from "./components/MessageModal";
import IntroScene from "./scenes/IntroScene";
import EarphonesScene from "./scenes/EarphonesScene";
import LetterScene from "./scenes/LetterScene";
import MemoriesScene from "./scenes/MemoriesScene";
import TimelineScene from "./scenes/TimelineScene";
import LittleThingsScene from "./scenes/LittleThingsScene";
import InterestsScene from "./scenes/InterestsScene";
import UniverseScene from "./scenes/UniverseScene";
import FinalScene from "./scenes/FinalScene";
import BlogListScene from "./scenes/BlogListScene";
import BlogDetailScene from "./scenes/BlogDetailScene";
import AdminScene from "./scenes/AdminScene";
import { letterScenes, letterScenesB } from "./data/memories";
import type { JournalEntry } from "./data/journal";

const ALL_LETTER_SCENES = [...letterScenes, ...letterScenesB];

type SceneKey = "intro" | "earphones" | "letter" | "memories" | "timeline" | "little" | "interests" | "universe" | "final";
type View = NavView | "admin";

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

function initialRoute(): { view: View; blogId: number | null } {
  if (window.location.hash === "#admin") return { view: "admin", blogId: null };
  if (window.location.hash === "#blogs") return { view: "blog", blogId: null };
  const m = window.location.hash.match(/^#blog\/\d+$/);
  if (m) return { view: "blog", blogId: Number(m[0].slice(6)) };
  return { view: "home", blogId: null };
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [route, setRoute] = useState(initialRoute);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageContext, setMessageContext] = useState<{ blogId: number | null; label: string | null }>({ blogId: null, label: null });
  const total = sceneKeys.length;
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(Math.min(Math.max(i, 0), total - 1));
  }, [total]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const openBlogs = useCallback(() => { setRoute({ view: "blog", blogId: null }); window.location.hash = "#blogs"; }, []);
  const openHome = useCallback(() => { setRoute({ view: "home", blogId: null }); window.location.hash = ""; }, []);
  const openBlog = useCallback((id: number) => { setRoute({ view: "blog", blogId: id }); window.location.hash = `#blog/${id}`; }, []);
  const openMessage = useCallback((ctx?: { blogId?: number | null; label?: string | null }) => {
    setMessageContext({ blogId: ctx?.blogId ?? null, label: ctx?.label ?? null });
    setMessageOpen(true);
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(initialRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (route.view !== "home") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, total, route.view]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [index, route.view, route.blogId]);

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
    if (route.view !== "home" || messageOpen) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || route.view !== "home") return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -60) next();
    if (dx > 60) prev();
    touchStartX.current = null;
  };

  const navView: NavView = route.view === "blog" ? "blog" : "home";
  const activeKey = route.view === "admin"
    ? "admin"
    : route.view === "blog"
      ? (route.blogId ? `blog-${route.blogId}` : "blogs")
      : currentKey;

  return (
    <div
      className="relative min-h-[100dvh] bg-[#03030e] text-violet-50"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#0a0620] via-[#050510] to-[#03030e]" />
      <StarfieldBackground density={currentKey === "universe" ? 1.2 : 1} />

      {route.view === "home" && <ProgressIndicator index={index} total={total} />}

      <main className={`relative z-10 ${route.view === "admin" ? "" : "pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-0"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {route.view === "admin" ? (
              <AdminScene />
            ) : route.view === "blog" ? (
              route.blogId ? (
                <BlogDetailScene
                  blogId={route.blogId}
                  onBack={openBlogs}
                  onOpen={openBlog}
                  onMessage={(entry: JournalEntry) => openMessage({ blogId: null, label: `Day ${entry.dayNumber} — ${entry.title}` })}
                />
              ) : (
                <BlogListScene onOpen={openBlog} />
              )
            ) : (
              sceneNode
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {route.view === "home" && (
        <SceneNavigation
          onPrev={prev} onNext={next}
          isFirst={index === 0} isLast={index === total - 1}
          onRestart={() => goTo(0)}
        />
      )}

      {route.view !== "admin" && (
        <FloatingNav
          view={navView}
          onHome={openHome}
          onBlogs={openBlogs}
          onMessage={() => openMessage()}
        />
      )}

      <MessageModal
        open={messageOpen}
        blogId={messageContext.blogId}
        blogLabel={messageContext.label}
        onClose={() => setMessageOpen(false)}
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
