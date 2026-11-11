import { motion } from "framer-motion";
import { BookOpen, Home, Send } from "lucide-react";

export type NavView = "home" | "blog";

interface Props {
  view: NavView;
  onHome: () => void;
  onBlogs: () => void;
  onMessage: () => void;
}

export default function FloatingNav({ view, onHome, onBlogs, onMessage }: Props) {
  const item = (active: boolean) =>
    `flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-[10px] leading-none transition sm:flex-row sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm sm:leading-normal ${
      active ? "bg-violet-400/25 text-white" : "text-violet-200/75 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <motion.nav
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-label="Primary"
      className="fixed inset-x-0 z-40 flex justify-center px-3"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex w-full max-w-md items-center gap-1 rounded-full border border-white/12 bg-black/70 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:max-w-lg sm:gap-2 sm:p-2">
        <button type="button" onClick={onHome} aria-current={view === "home" ? "page" : undefined} className={item(view === "home")}>
          <Home className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          <span className="truncate">Home</span>
        </button>
        <button type="button" onClick={onBlogs} aria-current={view === "blog" ? "page" : undefined} className={item(view === "blog")}>
          <BookOpen className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          <span className="truncate">Daily Blogs</span>
        </button>
        <button type="button" onClick={onMessage} className={item(false)}>
          <Send className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          <span className="truncate">Send a Message</span>
        </button>
      </div>
    </motion.nav>
  );
}
